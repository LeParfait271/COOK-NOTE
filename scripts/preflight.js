const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const node = process.execPath;
const changedImageSoftLimit = 40;
const changedOneImageDirLimit = 20;
const changedImageBatchLimit = 180;

function run(command, args, options = {}) {
  const label = [command, ...args].join(' ');
  console.log(`\n> ${label}`);
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: false,
    ...options
  });
  if (result.status !== 0) process.exit(result.status || 1);
}

function output(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: false
  });
  if (result.status !== 0) return '';
  return result.stdout.trim();
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function request(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, response => {
      response.resume();
      response.on('end', () => resolve(response.statusCode));
    });
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy(new Error(`Timeout ${url}`));
    });
  });
}

async function waitForServer(baseUrl) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const status = await request(`${baseUrl}/`);
      if (status === 200) return;
    } catch {}
    await wait(250);
  }
  throw new Error(`Serveur local muet: ${baseUrl}`);
}

function versionNumber() {
  const app = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const match = app.match(/const SITE_VERSION = 'v(\d+)\.(\d+)'/);
  if (!match) throw new Error('SITE_VERSION introuvable.');
  return `${Number(match[1])}${match[2].padStart(2, '0')}`;
}

async function verifyServer() {
  const port = await findFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const version = versionNumber();
  const child = spawn(node, ['server.js'], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(port), HOST: '127.0.0.1' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let logs = '';
  child.stdout.on('data', chunk => { logs += chunk.toString(); });
  child.stderr.on('data', chunk => { logs += chunk.toString(); });
  try {
    await waitForServer(baseUrl);
    const paths = [
      '/',
      `/app.js?v=${version}`,
      `/style.css?v=${version}`,
      `/assets/catalog-1.js?v=${version}`,
      `/assets/catalog-4.js?v=${version}`,
      `/service-worker.js?v=${version}`
    ];
    for (const target of paths) {
      const status = await request(`${baseUrl}${target}`);
      if (status !== 200) throw new Error(`${target}: HTTP ${status}`);
      console.log(`HTTP 200 ${target}`);
    }
  } catch (error) {
    console.error(logs.trim());
    throw error;
  } finally {
    child.kill();
  }
}

function validateDiffScope() {
  const status = output('git', ['status', '--short']);
  if (!status) {
    console.log('Diff scope OK: working tree clean.');
    return;
  }
  const files = status.split(/\r?\n/)
    .map(line => line.slice(3).trim())
    .filter(Boolean);
  const imageFiles = files.filter(file => /^assets\/recipe-(?:images|images-optimized|card-images)\//.test(file.replace(/\\/g, '/')));
  const byDir = new Map();
  imageFiles.forEach(file => {
    const normalized = file.replace(/\\/g, '/');
    const dir = normalized.split('/').slice(0, 2).join('/');
    byDir.set(dir, (byDir.get(dir) || 0) + 1);
  });
  if (imageFiles.length > changedImageSoftLimit) {
    const expectedDirs = ['assets/recipe-images', 'assets/recipe-images-optimized', 'assets/recipe-card-images'];
    const counts = expectedDirs.map(dir => byDir.get(dir) || 0);
    const balancedBatch = counts.every(count => count > 0 && count === counts[0]);
    if (!balancedBatch || imageFiles.length > changedImageBatchLimit) {
      throw new Error(`Diff image trop large: ${imageFiles.length} fichiers image modifies.`);
    }
    run(node, ['scripts/audit-images.js']);
    run(node, ['scripts/validate-visual-image-duplicates.js']);
    console.log(`Diff image large accepte: lot equilibre ${counts[0]} masters/optimisees/miniatures audite.`);
    return;
  }
  for (const [dir, count] of byDir) {
    if (count > changedOneImageDirLimit) {
      throw new Error(`Diff image suspect dans ${dir}: ${count} fichiers modifies.`);
    }
  }
  console.log(`Diff scope OK: ${files.length} fichiers, ${imageFiles.length} images.`);
}

async function main() {
  run(node, ['scripts/sync-catalog.js']);
  run(node, ['--check', 'scripts/bump-version.js']);
  run(node, ['--check', 'scripts/validate-cache-version.js']);
  run(node, ['--check', 'scripts/validate-visual-image-duplicates.js']);
  run(node, ['--check', 'scripts/preflight.js']);
  run(node, ['scripts/validate-cache-version.js']);
  run('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', '.\\check.ps1']);
  validateDiffScope();
  await verifyServer();
  console.log('\nPreflight Cook Note OK.');
}

main().catch(error => {
  console.error(`Preflight Cook Note ECHEC: ${error.message}`);
  process.exit(1);
});

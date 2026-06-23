const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const { spawn } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const HOST = '127.0.0.1';
const node = process.execPath;

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, HOST, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

function request(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, res => {
      res.resume();
      res.on('end', () => resolve(res.statusCode || 0));
    });
    req.on('error', reject);
    req.setTimeout(2000, () => {
      req.destroy(new Error(`Timeout ${url}`));
    });
  });
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(baseUrl) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const status = await request(`${baseUrl}/`);
      if (status === 200) return;
    } catch {}
    await wait(250);
  }
  throw new Error(`Serveur local muet: ${baseUrl}`);
}

function stopProcessTree(child) {
  if (!child || child.killed) return;
  try {
    child.stdout?.destroy();
    child.stderr?.destroy();
    child.kill();
    child.unref();
  } catch {}
  if (process.platform === 'win32') {
    try {
      const killer = spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true
      });
      killer.unref();
    } catch {}
  }
}

function runPlaywright(baseUrl) {
  return new Promise((resolve, reject) => {
    const cli = require.resolve('@playwright/test/cli');
    const extraArgs = process.argv.slice(2);
    const hasReporter = extraArgs.some(arg => arg === '--reporter' || arg.startsWith('--reporter='));
    const args = ['test', ...(hasReporter ? [] : ['--reporter=list']), ...extraArgs];
    let settled = false;
    let output = '';
    let successTimer = null;
    const child = spawn(node, [cli, ...args], {
      cwd: ROOT,
      env: {
        ...process.env,
        COOK_NOTE_BASE_URL: baseUrl,
        COOK_NOTE_SKIP_WEBSERVER: '1'
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    function settle(error) {
      if (settled) return;
      settled = true;
      if (successTimer) clearTimeout(successTimer);
      if (error) reject(error);
      else resolve();
    }

    function plain(text) {
      return text.replace(/\x1b\[[0-9;]*m/g, '');
    }

    function hasSuccessSummary(text) {
      return /(?:^|[\r\n])\s*\d+\s+passed\s+\(/.test(plain(text))
        && !/(?:^|[\r\n])\s*\d+\s+failed\b/.test(plain(text));
    }

    function forward(chunk, stream) {
      const text = chunk.toString();
      output += text;
      stream.write(text);
      if (hasSuccessSummary(output)) {
        if (successTimer) clearTimeout(successTimer);
        successTimer = setTimeout(() => {
          stopProcessTree(child);
          settle();
        }, 5000);
      }
    }

    child.stdout.on('data', chunk => forward(chunk, process.stdout));
    child.stderr.on('data', chunk => forward(chunk, process.stderr));
    child.on('error', settle);
    child.on('exit', code => {
      if (code === 0 || (code === null && hasSuccessSummary(output))) {
        settle();
      } else {
        settle(new Error(`Playwright a termine avec le code ${code}.`));
      }
    });
  });
}

async function main() {
  const port = await findFreePort();
  const baseUrl = `http://${HOST}:${port}`;
  const server = spawn(node, ['server.js'], {
    cwd: ROOT,
    env: { ...process.env, HOST, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  server.stdout.on('data', chunk => process.stdout.write(`[server] ${chunk}`));
  server.stderr.on('data', chunk => process.stderr.write(`[server] ${chunk}`));

  try {
    await waitForServer(baseUrl);
    await runPlaywright(baseUrl);
  } finally {
    stopProcessTree(server);
  }
}

main().catch(error => {
  console.error(`Tests visuels Cook Note ECHEC: ${error.message}`);
  process.exit(1);
});

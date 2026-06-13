const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const errors = [];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function fail(message) {
  errors.push(message);
}

function changedFilesAgainstHead() {
  try {
    return execFileSync('git', ['diff', '--name-only', 'HEAD'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })
      .split(/\r?\n/)
      .map(file => file.trim().replace(/\\/g, '/'))
      .filter(Boolean);
  } catch {
    return [];
  }
}

function isCatalogOrVisualChange(file) {
  return file === 'recipes.js'
    || /^assets\/catalog-\d+\.js$/.test(file)
    || /^assets\/recipe-(?:images|images-optimized|card-images)\//.test(file)
    || file === 'sitemap.xml';
}

const app = read('app.js');
const index = read('index.html');
const serviceWorker = read('service-worker.js');
const validateUi = read('scripts/validate-ui.js');

const siteVersion = app.match(/const SITE_VERSION = 'v(\d+)\.(\d+)'/)?.slice(1, 3);
const siteDate = app.match(/const SITE_UPDATED_AT = '(\d{2}\/\d{2}\/\d{2})'/)?.[1];
if (!siteVersion) fail('app.js: SITE_VERSION introuvable ou invalide.');
if (!siteDate) fail('app.js: SITE_UPDATED_AT introuvable ou invalide.');

const expectedAssetVersion = siteVersion ? `${Number(siteVersion[0])}${siteVersion[1].padStart(2, '0')}` : '';
const assetVersions = [
  ...index.matchAll(/\b(?:app|catalog-\d+|style)\.(?:js|css)\?v=(\d+)/g),
  ...index.matchAll(/service-worker\.js\?v=(\d+)/g),
  ...serviceWorker.matchAll(/\b(?:app|catalog-\d+|style)\.(?:js|css)\?v=(\d+)/g),
  ...serviceWorker.matchAll(/CACHE_NAME\s*=\s*'cook-note-v(\d+)'/g)
].map(match => match[1]);

if (!assetVersions.length) {
  fail('Versions assets introuvables dans index.html/service-worker.js.');
}
assetVersions.forEach(version => {
  if (version !== expectedAssetVersion) {
    fail(`Version asset incoherente: ${version}, attendu ${expectedAssetVersion}.`);
  }
});

if (siteVersion) {
  const fullVersion = `v${Number(siteVersion[0])}.${siteVersion[1].padStart(2, '0')}`;
  if (!validateUi.includes(`const SITE_VERSION = '${fullVersion}'`)) {
    fail('scripts/validate-ui.js: garde-fou SITE_VERSION non aligne.');
  }
  if (siteDate && !validateUi.includes(`const SITE_UPDATED_AT = '${siteDate}'`)) {
    fail('scripts/validate-ui.js: garde-fou SITE_UPDATED_AT non aligne.');
  }
}

const changedFiles = changedFilesAgainstHead();
const changedSet = new Set(changedFiles);
if (changedFiles.some(isCatalogOrVisualChange)) {
  [
    'app.js',
    'index.html',
    'service-worker.js',
    'scripts/validate-ui.js'
  ].forEach(file => {
    if (!changedSet.has(file)) {
      fail(`${file}: bump version/cache obligatoire quand recettes, catalogues, images ou sitemap changent.`);
    }
  });
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation cache/version OK.');

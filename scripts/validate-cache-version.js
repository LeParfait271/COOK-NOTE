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
    || file === 'app-images.js'
    || /^assets\/catalog-\d+\.js$/.test(file)
    || file === 'assets/image-manifest.js'
    || /^assets\/recipe-(?:images|images-optimized|card-images)\//.test(file)
    || file === 'sitemap.xml';
}

function isImageManifestChange(file) {
  return file === 'assets/image-manifest.js'
    || /^assets\/recipe-(?:images|images-optimized|card-images)\//.test(file);
}

const app = read('app.js');
const index = read('index.html');
const recipeHtml = read('recipe.html');
const serviceWorker = read('service-worker.js');
const validateUi = read('scripts/validate-ui.js');

const siteVersion = app.match(/const SITE_VERSION = 'v(\d+)\.(\d+)'/)?.slice(1, 3);
const siteDate = app.match(/const SITE_UPDATED_AT = '(\d{2}\/\d{2}\/\d{2})'/)?.[1];
if (!siteVersion) fail('app.js: SITE_VERSION introuvable ou invalide.');
if (siteVersion && Number(siteVersion[1]) > 99) {
  fail('app.js: SITE_VERSION doit rester au format vX.YY avec passage v1.99 -> v2.00.');
}
if (!siteDate) fail('app.js: SITE_UPDATED_AT introuvable ou invalide.');

const expectedAssetVersion = siteVersion ? `${Number(siteVersion[0])}${siteVersion[1].padStart(2, '0')}` : '';
const assetVersions = [
  ...index.matchAll(/\b(?:app|app-images|catalog-\d+|style)\.(?:js|css)\?v=(\d+)/g),
  ...index.matchAll(/\bimage-manifest\.js\?v=(\d+)/g),
  ...index.matchAll(/service-worker\.js\?v=(\d+)/g),
  ...index.matchAll(/\bbase-du-site\.png\?v=(\d+)/g),
  ...recipeHtml.matchAll(/\b(?:recipe|recipes|style)\.(?:js|css)\?v=(\d+)/g),
  ...serviceWorker.matchAll(/\b(?:app|app-images|catalog-\d+|image-manifest|recipe|style)\.(?:js|css)\?v=(\d+)/g),
  ...serviceWorker.matchAll(/CACHE_NAME\s*=\s*'cook-note-v(\d+)'/g),
  ...serviceWorker.matchAll(/IMAGE_CACHE_NAME\s*=\s*'cook-note-images-v(\d+)'/g)
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
    'app-images.js',
    'index.html',
    'service-worker.js',
    'scripts/validate-ui.js'
  ].forEach(file => {
    if (!changedSet.has(file)) {
      fail(`${file}: bump version/cache obligatoire quand recettes, catalogues, images ou sitemap changent.`);
    }
  });
}

if (changedFiles.some(isImageManifestChange) && !changedSet.has('assets/image-manifest.js')) {
  fail('assets/image-manifest.js: regeneration obligatoire quand les images changent.');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation cache/version OK.');

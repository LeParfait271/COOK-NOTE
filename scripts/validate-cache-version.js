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
  const files = new Set();
  try {
    execFileSync('git', ['diff', '--name-only', 'HEAD'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })
      .split(/\r?\n/)
      .map(file => file.trim().replace(/\\/g, '/'))
      .filter(Boolean)
      .forEach(file => files.add(file));
  } catch {}
  try {
    execFileSync('git', ['status', '--short', '--untracked-files=all'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })
      .split(/\r?\n/)
      .map(line => line.slice(3).trim().replace(/\\/g, '/'))
      .filter(Boolean)
      .forEach(file => files.add(file));
  } catch {}
  return [...files];
}

function isCatalogOrVisualChange(file) {
  return file === 'recipes.js'
    || file === 'app-images.js'
    || file === 'app-art-images.js'
    || /^assets\/catalog-\d+\.js$/.test(file)
    || file === 'assets/image-manifest.js'
    || /^assets\/(?:day|dark)\//.test(file)
    || /^assets\/recipe-(?:images|images-optimized|card-images)\//.test(file)
    || file === 'sitemap.xml';
}

function isImageManifestChange(file) {
  return file === 'assets/image-manifest.js'
    || file === 'app-art-images.js'
    || /^assets\/(?:day|dark)\//.test(file)
    || /^assets\/recipe-(?:images|images-optimized|card-images)\//.test(file);
}

const app = read('app.js');
const androidGradleProperties = read('android-legacy/gradle.properties');
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
const expectedProductVersion = siteVersion ? `${Number(siteVersion[0])}.${siteVersion[1].padStart(2, '0')}` : '';
const androidApkVersion = app.match(/const ANDROID_LEGACY_APK_VERSION = '(\d+\.\d{2})';/)?.[1];
const androidNativeVersion = androidGradleProperties.match(/^cookNoteAndroidVersion=(\d+\.\d{2})$/m)?.[1];
if (!androidApkVersion) fail('app.js: ANDROID_LEGACY_APK_VERSION introuvable ou invalide.');
if (!androidNativeVersion) fail('android-legacy/gradle.properties: cookNoteAndroidVersion introuvable ou invalide.');
if (expectedProductVersion && androidApkVersion !== expectedProductVersion) {
  fail(`Versions site/APK incoherentes: ANDROID_LEGACY_APK_VERSION=${androidApkVersion}, attendu ${expectedProductVersion}.`);
}
if (expectedProductVersion && androidNativeVersion !== expectedProductVersion) {
  fail(`Versions site/APK incoherentes: cookNoteAndroidVersion=${androidNativeVersion}, attendu ${expectedProductVersion}.`);
}
if (expectedProductVersion && !fs.existsSync(path.join(ROOT, 'downloads', `cook-note-android-legacy-v${expectedProductVersion}.apk`))) {
  fail(`downloads/cook-note-android-legacy-v${expectedProductVersion}.apk manquant pour la version produit publiee.`);
}
const assetVersions = [
  ...index.matchAll(/\b(?:app|app-images|app-art-images|theme|i18n|catalog-\d+|style)\.(?:js|css)\?v=(\d+)/g),
  ...index.matchAll(/\bimage-manifest\.js\?v=(\d+)/g),
  ...index.matchAll(/service-worker\.js\?v=(\d+)/g),
  ...index.matchAll(/\bbase-du-site\.png\?v=(\d+)/g),
  ...index.matchAll(/COOK_NOTE_ASSET_VERSION\s*=\s*'(\d+)'/g),
  ...recipeHtml.matchAll(/\b(?:theme|i18n|recipe|recipes|style)\.(?:js|css)\?v=(\d+)/g),
  ...recipeHtml.matchAll(/COOK_NOTE_ASSET_VERSION\s*=\s*'(\d+)'/g),
  ...serviceWorker.matchAll(/\b(?:app|app-images|app-art-images|theme|i18n|catalog-\d+|image-manifest|recipe|style)\.(?:js|css)\?v=(\d+)/g),
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

if (/\/(?:assets\/image-manifest|app-images|app-art-images)\.js\?v=\d+/.test(validateUi)
  || /const SITE_VERSION = 'v\d+\.\d{2}'/.test(validateUi)
  || /const SITE_UPDATED_AT = '\d{2}\/\d{2}\/\d{2}'/.test(validateUi)) {
  fail('scripts/validate-ui.js: ne doit pas contenir de version/date de release en dur.');
}

const changedFiles = changedFilesAgainstHead();
const changedSet = new Set(changedFiles);
if (changedFiles.some(isCatalogOrVisualChange)) {
  [
    'app.js',
    'app-images.js',
    'app-art-images.js',
    'index.html',
    'service-worker.js'
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

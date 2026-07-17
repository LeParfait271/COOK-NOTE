const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const VERSION_RE = /^v(\d+)\.(\d+)$/;
const EXPLICIT_VERSION_RE = /^v\d+\.\d{2}$/;

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function write(file, text) {
  fs.writeFileSync(path.join(ROOT, file), text, 'utf8');
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function replaceRequired(text, pattern, replacement, label) {
  if (!pattern.test(text)) fail(`${label} introuvable.`);
  return text.replace(pattern, replacement);
}

function parseVersion(value) {
  const match = String(value || '').match(VERSION_RE);
  if (!match) fail(`Version invalide: ${value}. Attendu: v1.16`);
  return { major: Number(match[1]), minor: Number(match[2]) };
}

function nextVersion(value) {
  const parsed = parseVersion(value);
  const nextMinor = parsed.minor + 1;
  if (nextMinor > 99) return `v${parsed.major + 1}.00`;
  return `v${parsed.major}.${String(nextMinor).padStart(2, '0')}`;
}

function numericVersion(value) {
  const parsed = parseVersion(value);
  return `${parsed.major}${String(parsed.minor).padStart(2, '0')}`;
}

function androidVersion(value) {
  const parsed = parseVersion(value);
  return `${parsed.major}.${String(parsed.minor).padStart(2, '0')}`;
}

function todayFr() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
  return formatter.format(now);
}

const args = process.argv.slice(2);
const app = read('app.js');
const current = app.match(/const SITE_VERSION = '([^']+)'/)?.[1];
if (!current) fail('SITE_VERSION introuvable dans app.js.');

const explicitVersion = args.find(arg => /^v\d+\.\d+$/.test(arg));
if (explicitVersion && !EXPLICIT_VERSION_RE.test(explicitVersion)) {
  fail(`Version explicite invalide: ${explicitVersion}. Attendu: vX.YY, par exemple v2.00.`);
}
const version = explicitVersion || (args.includes('--next') ? nextVersion(current) : null);
if (!version) fail(`Usage: node scripts/bump-version.js --next | vX.YY. Version actuelle: ${current}`);

const dateArg = args.find(arg => /^\d{2}\/\d{2}\/\d{2}$/.test(arg));
const date = dateArg || todayFr();
const numeric = numericVersion(version);
const android = androidVersion(version);
const versionParts = parseVersion(version);

let nextApp = replaceRequired(app, /const SITE_VERSION = '[^']+';/, `const SITE_VERSION = '${version}';`, 'SITE_VERSION');
nextApp = replaceRequired(nextApp, /const SITE_UPDATED_AT = '[^']+';/, `const SITE_UPDATED_AT = '${date}';`, 'SITE_UPDATED_AT');
nextApp = replaceRequired(nextApp, /const ANDROID_LEGACY_APK_VERSION = '\d+\.\d{2}';/, `const ANDROID_LEGACY_APK_VERSION = '${android}';`, 'ANDROID_LEGACY_APK_VERSION');
write('app.js', nextApp);

write('app-art-images.js', read('app-art-images.js')
  .replace(/\bconst v='\d+'/g, `const v='${numeric}'`)
  .replace(/(\/assets\/(?:day|dark)\/[^'"]+\.(?:jpg|png)\?v=)\d+(?:-[a-z0-9-]+)?/gi, `$1${numeric}`));

write('android-legacy/gradle.properties', replaceRequired(
  read('android-legacy/gradle.properties'),
  /^cookNoteAndroidVersion=\d+\.\d{2}$/m,
  `cookNoteAndroidVersion=${android}`,
  'cookNoteAndroidVersion'
));

write('app-images.js', read('app-images.js')
  .replace(/const IMAGE_HELPER_VERSION = 'v\d+\.\d+';/g, `const IMAGE_HELPER_VERSION = '${version}';`));

write('index.html', read('index.html')
  .replace(/(COOK_NOTE_ASSET_VERSION\s*=\s*')\d+(';)/g, `$1${numeric}$2`)
  .replace(/(base-du-site\.png\?v=)\d+/g, `$1${numeric}`)
  .replace(/(style\.css\?v=)\d+/g, `$1${numeric}`)
  .replace(/(catalog-\d+\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(image-manifest\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(app-images\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(app-art-images\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(theme\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(i18n\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(app-premium\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(app-techniques\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(app\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(service-worker\.js\?v=)\d+/g, `$1${numeric}`));

write('recipe.html', read('recipe.html')
  .replace(/(COOK_NOTE_ASSET_VERSION\s*=\s*')\d+(';)/g, `$1${numeric}$2`)
  .replace(/(style\.css\?v=)\d+/g, `$1${numeric}`)
  .replace(/(theme\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(i18n\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(recipes\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(recipe\.js\?v=)\d+/g, `$1${numeric}`));

write('service-worker.js', read('service-worker.js')
  .replace(/Service Worker PWA v\d+/g, `Service Worker PWA v${numeric}`)
  .replace(/CACHE_NAME = 'cook-note-v\d+'/g, `CACHE_NAME = 'cook-note-v${numeric}'`)
  .replace(/IMAGE_CACHE_NAME = 'cook-note-images-v\d+'/g, `IMAGE_CACHE_NAME = 'cook-note-images-v${numeric}'`)
  .replace(/(\/assets\/day\/[^'"]+\.(?:jpg|png)\?v=)\d+/g, `$1${numeric}`)
  .replace(/(\/assets\/dark\/[^'"]+\.(?:jpg|png)\?v=)\d+/g, `$1${numeric}`)
  .replace(/(app\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(app-techniques\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(app-premium\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(app-images\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(app-art-images\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(theme\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(i18n\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(catalog-\d+\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(image-manifest\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(style\.css\?v=)\d+/g, `$1${numeric}`)
  .replace(/(recipe\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/\[SW v\d+\]/g, `[SW v${numeric}]`));

write('downloads/android-latest-version.json', `${JSON.stringify({
  versionCode: versionParts.major * 1000 + versionParts.minor,
  versionName: android,
  apkUrl: 'https://github.com/LeParfait271/COOK-NOTE/raw/main/downloads/cook-note-android-legacy.apk'
}, null, 2)}\n`);

console.log(`Version Cook Note: ${current} -> ${version} / ${date}`);

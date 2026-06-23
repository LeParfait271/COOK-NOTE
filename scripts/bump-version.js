const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const VERSION_RE = /^v(\d+)\.(\d+)$/;

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

function parseVersion(value) {
  const match = String(value || '').match(VERSION_RE);
  if (!match) fail(`Version invalide: ${value}. Attendu: v1.16`);
  return { major: Number(match[1]), minor: Number(match[2]) };
}

function nextVersion(value) {
  const parsed = parseVersion(value);
  return `v${parsed.major}.${String(parsed.minor + 1).padStart(2, '0')}`;
}

function numericVersion(value) {
  const parsed = parseVersion(value);
  return `${parsed.major}${String(parsed.minor).padStart(2, '0')}`;
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

const explicitVersion = args.find(arg => VERSION_RE.test(arg));
const version = explicitVersion || (args.includes('--next') ? nextVersion(current) : null);
if (!version) fail(`Usage: node scripts/bump-version.js --next | vX.YY. Version actuelle: ${current}`);

const dateArg = args.find(arg => /^\d{2}\/\d{2}\/\d{2}$/.test(arg));
const date = dateArg || todayFr();
const numeric = numericVersion(version);

write('app.js', app
  .replace(/const SITE_VERSION = '[^']+';/, `const SITE_VERSION = '${version}';`)
  .replace(/const SITE_UPDATED_AT = '[^']+';/, `const SITE_UPDATED_AT = '${date}';`));

write('app-images.js', read('app-images.js')
  .replace(/const IMAGE_HELPER_VERSION = 'v\d+\.\d+';/g, `const IMAGE_HELPER_VERSION = '${version}';`));

write('scripts/validate-ui.js', read('scripts/validate-ui.js')
  .replace(/const SITE_VERSION = 'v\d+\.\d+'/g, `const SITE_VERSION = '${version}'`)
  .replace(/const SITE_UPDATED_AT = '\d{2}\/\d{2}\/\d{2}'/g, `const SITE_UPDATED_AT = '${date}'`)
  .replace(/(image-manifest\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(app-images\.js\?v=)\d+/g, `$1${numeric}`));

write('index.html', read('index.html')
  .replace(/(base-du-site\.png\?v=)\d+/g, `$1${numeric}`)
  .replace(/(style\.css\?v=)\d+/g, `$1${numeric}`)
  .replace(/(catalog-\d+\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(image-manifest\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(app-images\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(app\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(service-worker\.js\?v=)\d+/g, `$1${numeric}`));

write('recipe.html', read('recipe.html')
  .replace(/(style\.css\?v=)\d+/g, `$1${numeric}`)
  .replace(/(recipes\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(recipe\.js\?v=)\d+/g, `$1${numeric}`));

write('service-worker.js', read('service-worker.js')
  .replace(/Service Worker PWA v\d+/g, `Service Worker PWA v${numeric}`)
  .replace(/CACHE_NAME = 'cook-note-v\d+'/g, `CACHE_NAME = 'cook-note-v${numeric}'`)
  .replace(/IMAGE_CACHE_NAME = 'cook-note-images-v\d+'/g, `IMAGE_CACHE_NAME = 'cook-note-images-v${numeric}'`)
  .replace(/(app\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(app-images\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(catalog-\d+\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(image-manifest\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/(style\.css\?v=)\d+/g, `$1${numeric}`)
  .replace(/(recipe\.js\?v=)\d+/g, `$1${numeric}`)
  .replace(/\[SW v\d+\]/g, `[SW v${numeric}]`));

console.log(`Version Cook Note: ${current} -> ${version} / ${date}`);

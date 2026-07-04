const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const KB = 1024;
const errors = [];

const FILE_BUDGETS = [
  ['index.html', 14 * KB],
  ['app-images.js', 8 * KB],
  ['theme.js', 4 * KB],
  ['app.js', 380 * KB],
  ['style.css', 180 * KB],
  ['recipes.js', 475 * KB],
  ['assets/image-manifest.js', 180 * KB],
  ['app-art-images.js', 40 * KB],
  ['service-worker.js', 10 * KB],
  ['assets/vendor/react.production.min.js', 14 * KB],
  ['assets/vendor/react-dom.production.min.js', 150 * KB],
  ['assets/vendor/confetti.browser.min.js', 12 * KB],
  ['assets/vendor/qrcode.min.js', 64 * KB]
];

const DIRECTORY_BUDGETS = [
  ['assets/catalog-*.js', 'assets', /^catalog-\d+\.js$/, 475 * KB]
];

const IMAGE_BUDGETS = [
  ['assets/day/', 620 * KB],
  ['assets/dark/', 620 * KB],
  ['assets/recipe-card-images/', 170 * KB],
  ['assets/recipe-images-optimized/', 520 * KB],
  ['assets/recipe-images/', 3600 * KB]
];
const BASE_DAY_ART_FILES = [
  'assets/day/base-du-site-day.jpg',
  'assets/day/base-principale-fond-site-day.jpg',
  'assets/day/cook-note-day.png'
];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function fail(message) {
  errors.push(message);
}

function bytes(file) {
  return fs.statSync(path.join(ROOT, file)).size;
}

function formatKb(value) {
  return `${Math.round(value / KB)} Ko`;
}

function loadRecipes() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read('recipes.js'), context, { filename: path.join(ROOT, 'recipes.js') });
  return context.window.RECIPES || {};
}

function loadImageManifest() {
  const context = { window: {}, Object };
  vm.createContext(context);
  vm.runInContext(read('assets/image-manifest.js'), context, { filename: path.join(ROOT, 'assets/image-manifest.js') });
  return context.window.COOK_NOTE_IMAGE_MANIFEST || {};
}

function normalizeKey(file) {
  return file.replace(/\\/g, '/').replace(/^\/+/, '').replace(/\?.*$/, '');
}

function loadThemeRecipeArt() {
  const context = { window: {}, Object };
  vm.createContext(context);
  vm.runInContext(read('app-art-images.js'), context, { filename: path.join(ROOT, 'app-art-images.js') });
  return context.window.COOK_NOTE_THEME_RECIPE_ART || {};
}

function loadThemeArtFiles() {
  const themeArt = loadThemeRecipeArt();
  const files = new Set(BASE_DAY_ART_FILES);
  Object.values(themeArt).forEach(map => {
    Object.values(map || {}).forEach(image => files.add(normalizeKey(image)));
  });
  return files;
}

function cardPath(image) {
  return normalizeKey(image)
    .replace(/^assets\/recipe-images-optimized\//, 'assets/recipe-card-images/')
    .replace(/\.(?:png|jpe?g|webp)$/i, '.jpg');
}

function sourcePath(image) {
  return normalizeKey(image)
    .replace(/^assets\/recipe-images-optimized\//, 'assets/recipe-images/')
    .replace(/\.(?:jpe?g|webp)$/i, '.png');
}

FILE_BUDGETS.forEach(([file, maxBytes]) => {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) {
    fail(`${file}: fichier requis introuvable.`);
    return;
  }
  const size = bytes(file);
  if (size > maxBytes) fail(`${file}: poids ${formatKb(size)} > budget ${formatKb(maxBytes)}.`);
});

DIRECTORY_BUDGETS.forEach(([label, dir, pattern, maxBytes]) => {
  const total = fs.readdirSync(path.join(ROOT, dir))
    .filter(file => pattern.test(file))
    .reduce((sum, file) => sum + bytes(path.join(dir, file)), 0);
  if (total > maxBytes) fail(`${label}: poids total ${formatKb(total)} > budget ${formatKb(maxBytes)}.`);
});

const recipes = loadRecipes();
const manifest = loadImageManifest();
const expectedImages = new Set([
  'assets/base-du-site.png',
  'assets/base-principale-fond-site.jpg',
  'assets/cook-note.png',
  'assets/cook-note-white.png'
]);
loadThemeArtFiles().forEach(file => expectedImages.add(file));

Object.entries(recipes).forEach(([id, recipe]) => {
  const image = recipe?.image;
  if (!image || !image.startsWith('/assets/recipe-images-optimized/')) {
    fail(`${id}: image optimisee absente du budget.`);
    return;
  }
  const optimized = normalizeKey(image);
  expectedImages.add(optimized);
  expectedImages.add(cardPath(image));
  expectedImages.add(sourcePath(image));
});

expectedImages.forEach(file => {
  if (!manifest[file]) fail(`${file}: absent du manifest images.`);
  if (!fs.existsSync(path.join(ROOT, file))) fail(`${file}: fichier absent.`);
});

Object.keys(manifest).forEach(file => {
  if (!expectedImages.has(file)) fail(`${file}: entree manifest non referencee.`);
});

IMAGE_BUDGETS.forEach(([prefix, maxBytes]) => {
  Object.entries(manifest)
    .filter(([file]) => file.startsWith(prefix))
    .forEach(([file, info]) => {
      if (info.bytes > maxBytes) fail(`${file}: poids ${formatKb(info.bytes)} > budget ${formatKb(maxBytes)}.`);
      if (!info.width || !info.height) fail(`${file}: dimensions absentes du manifest.`);
    });
});

const app = read('app.js');
const index = read('index.html');
const serviceWorker = read('service-worker.js');
[
  'imageSizeAttrs(cardImage)',
  'fetchPriority',
  'displayRecipeImage(recipe)',
  'displayRecipeImage(item.recipe)',
  'DEFERRED_CATALOG_CHUNK_SRCS',
  'loadDeferredCatalogChunks',
  'GRID_INITIAL_RENDER_COUNT',
  'loadDeferredScript(QR_CODE_SCRIPT_SRC',
  'runConfettiBurst'
].forEach(fragment => {
  if (!app.includes(fragment)) fail(`Optimisation runtime absente (${fragment}).`);
});

if (index.includes('/assets/catalog-2.js') || index.includes('/assets/catalog-3.js') || index.includes('/assets/catalog-4.js')) {
  fail('index.html: chunks catalogue differes encore charges en synchrone.');
}
if (index.includes('/assets/vendor/confetti.browser.min.js') || index.includes('/assets/vendor/qrcode.min.js')) {
  fail('index.html: librairies partage/celebration encore bloquees au demarrage.');
}
if (!serviceWorker.includes('IMAGE_CACHE_NAME') || serviceWorker.includes("'/assets/catalog-2.js?v=")) {
  fail('service-worker.js: cache runtime images ou precache catalogue differe incorrect.');
}
[
  'IMMUTABLE_IMAGE_PATHS',
  'isImmutableImageRequest',
  'if (cached && isImmutableImageRequest(url)) return cached'
].forEach(fragment => {
  if (!serviceWorker.includes(fragment)) fail(`Optimisation service worker absente (${fragment}).`);
});
if (/console\.(?:log|warn|error)\(/.test(serviceWorker)) {
  fail('service-worker.js: logs runtime interdits dans le worker de production.');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation budget performance OK.');

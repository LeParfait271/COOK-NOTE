const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico']);
const EXPECTED_BRAND_FILES = new Set([
  'assets/brand/app-icon.png',
  'assets/brand/mark.svg'
]);
const EXPECTED_GLOBAL_THEME_FILES = new Set([
  'assets/theme/dark/global/background.jpg',
  'assets/theme/dark/global/hero.png',
  'assets/theme/dark/global/logo.png',
  'assets/theme/day/global/background.jpg',
  'assets/theme/day/global/hero.jpg',
  'assets/theme/day/global/logo.png'
]);
const TEXT_FILES = [
  'index.html',
  'recipe.html',
  'manifest.json',
  'app.js',
  'app-images.js',
  'app-art-images.js',
  'recipe.js',
  'service-worker.js',
  'style.css',
  'theme.js'
];
const errors = [];

function normalize(file) {
  return String(file || '').replace(/\\/g, '/').replace(/^\/+/, '').replace(/\?.*$/, '');
}

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function walk(dir, rows = []) {
  const absolute = path.join(ROOT, dir);
  if (!fs.existsSync(absolute)) return rows;
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const relativePath = normalize(path.join(dir, entry.name));
    if (entry.isDirectory()) walk(relativePath, rows);
    else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) rows.push(relativePath);
  }
  return rows;
}

function loadWindowScript(file, extra = {}) {
  const context = { window: {}, Object, ...extra };
  vm.createContext(context);
  vm.runInContext(read(file), context, { filename: path.join(ROOT, file) });
  return context.window;
}

function addUsed(used, file, reason) {
  const normalized = normalize(file);
  if (!normalized) return;
  if (!used.has(normalized)) used.set(normalized, new Set());
  used.get(normalized).add(reason);
}

function cardPath(image) {
  return normalize(image)
    .replace(/^assets\/recipes\/heroes\//, 'assets/recipes/cards/')
    .replace(/\.(?:png|jpe?g|webp)$/i, '.jpg');
}

function sourcePath(image) {
  return normalize(image)
    .replace(/^assets\/recipes\/heroes\//, 'assets/recipes/masters/')
    .replace(/\.(?:jpe?g|webp)$/i, '.png');
}

function collectLiteralAssetReferences(used) {
  const assetPattern = /\/?assets\/[^"'`)\s<>]+\.(?:png|jpe?g|webp|gif|svg|ico)(?:\?[^"'`)\s<>]+)?/gi;
  TEXT_FILES
    .filter(file => fs.existsSync(path.join(ROOT, file)))
    .forEach(file => {
      const matches = read(file).match(assetPattern) || [];
      matches.forEach(match => addUsed(used, match, `reference litterale dans ${file}`));
    });
}

function validateExpectedFile(file, label) {
  if (!fs.existsSync(path.join(ROOT, file))) errors.push(`${label}: fichier absent (${file}).`);
}

function main() {
  const used = new Map();
  const recipes = loadWindowScript('recipes.js').RECIPES || {};
  const themeArt = loadWindowScript('app-art-images.js').COOK_NOTE_THEME_RECIPE_ART || {};
  const recipeIds = new Set(Object.keys(recipes));

  EXPECTED_BRAND_FILES.forEach(file => addUsed(used, file, 'asset marque attendu'));
  EXPECTED_GLOBAL_THEME_FILES.forEach(file => addUsed(used, file, 'asset theme global attendu'));

  Object.entries(recipes).forEach(([id, recipe]) => {
    const image = normalize(recipe && recipe.image);
    const expectedHero = `assets/recipes/heroes/${id}.jpg`;
    const expectedCard = `assets/recipes/cards/${id}.jpg`;
    const expectedMaster = `assets/recipes/masters/${id}.png`;
    if (image !== expectedHero) errors.push(`${id}: image recette attendue ${expectedHero}, actuelle ${image || 'vide'}.`);
    [expectedHero, expectedCard, expectedMaster].forEach(file => {
      addUsed(used, file, `image recette ${id}`);
      validateExpectedFile(file, id);
    });
    if (image) {
      addUsed(used, image, `reference recette ${id}`);
      addUsed(used, cardPath(image), `miniature derivee de ${id}`);
      addUsed(used, sourcePath(image), `master source de ${id}`);
    }
  });

  ['masters', 'heroes', 'cards'].forEach(type => {
    walk(`assets/recipes/${type}`).forEach(file => {
      const id = path.basename(file, path.extname(file));
      if (!recipeIds.has(id)) errors.push(`${file}: aucun id recette correspondant.`);
    });
  });

  Object.entries(themeArt).forEach(([theme, map]) => {
    const themeDir = theme === 'light' ? 'day' : theme;
    Object.entries(map || {}).forEach(([id, image]) => {
      const normalized = normalize(image);
      const isCategory = normalized === `assets/theme/${themeDir}/categories/${id}.jpg`;
      const isRecipe = normalized === `assets/theme/${themeDir}/recipes/${id}.jpg`;
      if (!isCategory && !isRecipe) errors.push(`${theme}/${id}: chemin theme incoherent (${normalized}).`);
      addUsed(used, normalized, `override ${theme} pour ${id}`);
    });
  });

  [...EXPECTED_BRAND_FILES, ...EXPECTED_GLOBAL_THEME_FILES].forEach(file => validateExpectedFile(file, 'asset attendu'));
  collectLiteralAssetReferences(used);

  const allImages = walk('assets').sort((a, b) => a.localeCompare(b));
  const unused = allImages.filter(file => !used.has(file));
  const missing = [...used.keys()].filter(file => file.startsWith('assets/') && !fs.existsSync(path.join(ROOT, file)));

  unused.forEach(file => errors.push(`${file}: image presente mais non utilisee.`));
  missing.forEach(file => errors.push(`${file}: image referencee mais absente.`));

  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  console.log(`Validation nettoyage images OK (${allImages.length} images, 0 inutile).`);
}

main();

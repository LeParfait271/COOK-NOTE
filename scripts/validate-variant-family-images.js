const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const RECIPES_FILE = path.join(ROOT, 'recipes.js');
const errors = [];
const shouldFix = process.argv.includes('--fix');

function loadRecipes() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(RECIPES_FILE, 'utf8'), context, { filename: RECIPES_FILE });
  return context.window.RECIPES || {};
}

function imageId(image) {
  return String(image || '').match(/\/([^/?#]+)\.(?:jpe?g|png|webp)(?:[?#].*)?$/i)?.[1] || '';
}

function ownImagePath(id) {
  if (id === 'gaspachos_variantes') return '/assets/recipes/heroes/gaspachos.jpg';
  return `/assets/recipes/heroes/${id}.jpg`;
}

function run() {
  const recipes = loadRecipes();
  const rows = [];
  const imageOwners = new Map();

  Object.entries(recipes).forEach(([id, recipe]) => {
    if (recipe?.image) {
      if (!imageOwners.has(recipe.image)) imageOwners.set(recipe.image, new Set());
      imageOwners.get(recipe.image).add(id);
    }
    if (recipe?.variantGroups !== true) return;
    const nestedImages = (recipe.ingredients || [])
      .map(group => group?.recipe?.image)
      .filter(Boolean);
    if (!nestedImages.length) return;

    nestedImages.forEach(image => {
      if (!imageOwners.has(image)) imageOwners.set(image, new Set());
      imageOwners.get(image).add(imageId(image));
    });

    const expected = ownImagePath(id);
    if (shouldFix && fs.existsSync(path.join(ROOT, expected.replace(/^\//, '')))) {
      recipe.image = expected;
    }
    rows.push({ id, image: recipe.image, expected, nestedImages });
  });

  rows.forEach(row => {
    if (row.image !== row.expected) {
      errors.push(`${row.id}: image propre attendue (${row.expected}), trouvée ${row.image || 'absente'}.`);
    }
    if (row.nestedImages.some(image => image === row.image && imageId(image) !== row.id)) {
      errors.push(`${row.id}: image de famille réutilisée par une variante (${row.image}).`);
    }
  });

  imageOwners.forEach((owners, image) => {
    if (owners.size > 1) {
      errors.push(`Image réutilisée par plusieurs recettes ou variantes (${image}): ${[...owners].join(', ')}.`);
    }
  });

  if (shouldFix && !errors.length) {
    fs.writeFileSync(RECIPES_FILE, `window.RECIPES = ${JSON.stringify(recipes)};\n`, 'utf8');
  }

  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  console.log(`Validation images familles variantes OK (${rows.length} fiches).`);
}

run();

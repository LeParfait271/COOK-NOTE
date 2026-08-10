const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const RECIPES_FILE = path.join(ROOT, 'recipes.js');
const errors = [];
const shouldFix = process.argv.includes('--fix');
// Ces images nuit étaient des copies exactes de l'image optimisée de base.
// Leur absence est donc volontaire : le runtime reprend l'image de la recette.
const DARK_THEME_BASE_FALLBACK_IDS = new Set([
  'aioli_variantes',
  'chantilly_variantes',
  'cookies_sucres_variantes',
  'creme_diplomate_variantes',
  'crumble_pomme_poire_variantes',
  'frites_variantes',
  'gratins_chou_fleur_variantes',
  'haricots_tarbais_variantes',
  'mousses_chocolat_variantes',
  'pommes_nouvelles_roties_herbes_jardin',
  'poulet_basquaise_variantes',
  'rillettes_variantes',
  'sauce_bearnaise',
  'saumon_four_variantes',
  'tiramisu_variantes',
  'tresse_beurre_variantes'
]);

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

function ownDarkImagePath(id) {
  return `/assets/theme/dark/recipes/${id}.jpg`;
}

function validateDarkImage(id, label) {
  const darkPath = ownDarkImagePath(id);
  if (fs.existsSync(path.join(ROOT, darkPath.replace(/^\//, '')))) return;
  if (!DARK_THEME_BASE_FALLBACK_IDS.has(id)) {
    errors.push(`${label}: dark override missing (${darkPath}).`);
    return;
  }
  const basePath = ownImagePath(id);
  if (!fs.existsSync(path.join(ROOT, basePath.replace(/^\//, '')))) {
    errors.push(`${label}: fallback sombre impossible, image de base absente (${basePath}).`);
  }
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
      const nestedId = imageId(image);
      if (nestedId) validateDarkImage(nestedId, `${id}: nested variant ${nestedId}`);
    });

    const expected = ownImagePath(id);
    if (shouldFix && fs.existsSync(path.join(ROOT, expected.replace(/^\//, '')))) {
      recipe.image = expected;
    }
    rows.push({ id, image: recipe.image, expected, nestedImages, darkExpected: ownDarkImagePath(id) });
  });

  rows.forEach(row => {
    if (row.image !== row.expected) {
      errors.push(`${row.id}: image propre attendue (${row.expected}), trouvée ${row.image || 'absente'}.`);
    }
    if (row.nestedImages.some(image => image === row.image && imageId(image) !== row.id)) {
      errors.push(`${row.id}: image de famille réutilisée par une variante (${row.image}).`);
    }
  });

  rows.forEach(row => {
    validateDarkImage(row.id, row.id);
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

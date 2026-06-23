const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const CATALOG_FILES = [
  'assets/catalog-1.js',
  'assets/catalog-2.js',
  'assets/catalog-3.js',
  'assets/catalog-4.js'
];
const CRITICAL_CATALOG_IDS = [
  'petit_dejeuner_maitre',
  'apero_maitre',
  'entrees_maitre',
  'sauces_maitre',
  'elements_base_maitre',
  'plats_maitre',
  'accompagnements_maitre',
  'desserts_maitre'
];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function loadRecipesFrom(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read(file), context, { filename: path.join(ROOT, file) });
  return context.window.RECIPES || {};
}

function escapeAscii(value) {
  return value.replace(/[\u007f-\uffff]/g, char =>
    `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`
  );
}

function variantRefs(recipe) {
  return Array.isArray(recipe?.variants) ? recipe.variants.filter(variant => variant && variant.id) : [];
}

function leafVariantCount(recipe, recipesById, seen = new Set()) {
  if (!recipe || seen.has(recipe.id)) return 0;
  seen.add(recipe.id);
  const refs = variantRefs(recipe);
  if (!refs.length) return recipe.id ? 1 : 0;
  return refs.reduce((sum, variant) => {
    const child = recipesById[variant.id];
    return sum + (variantRefs(child).length ? leafVariantCount(child, recipesById, seen) : (child ? 1 : 0));
  }, 0);
}

function compactRecipeForCatalog(recipe, recipesById) {
  const compact = JSON.parse(JSON.stringify(recipe));
  delete compact.practical;
  const leafCount = leafVariantCount(compact, recipesById);
  if (leafCount > 1) compact.leafCount = leafCount;
  return compact;
}

const recipes = loadRecipesFrom('recipes.js');
const allIds = Object.keys(recipes);
const recipesById = Object.fromEntries(allIds.map(id => [id, { id, ...recipes[id] }]));
const criticalIds = CRITICAL_CATALOG_IDS.filter(id => recipes[id]);
const deferredIds = allIds.filter(id => !criticalIds.includes(id));
const currentChunks = [
  criticalIds,
  ...CATALOG_FILES.slice(1).map((_, index) =>
    deferredIds.filter((id, idIndex) => idIndex % (CATALOG_FILES.length - 1) === index)
  )
];

CATALOG_FILES.forEach((file, index) => {
  const ids = currentChunks[index].filter(id => recipes[id]);
  const chunk = Object.fromEntries(ids.map(id => [id, compactRecipeForCatalog(recipesById[id], recipesById)]));
  const json = JSON.stringify(chunk);
  const text = [
    `// Cook Note - catalogue recettes chunk ${index + 1}/${CATALOG_FILES.length}`,
    `window.RECIPES = Object.assign(window.RECIPES || {}, ${json});`,
    ''
  ].join('\n');
  fs.writeFileSync(path.join(ROOT, file), escapeAscii(text), 'utf8');
  console.log(`${file}: ${ids.length} recettes`);
});

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

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function countInlineVariantGroups(recipe) {
  if (recipe?.inlineVariantResolved) return 0;
  return (recipe?.ingredients || []).filter(group => {
    const label = normalizeText(group?.group);
    if (label.includes('base commune') || label === 'base' || label.includes('commun')) return false;
    if (/^\d+\)/.test(label)) return true;
    if (label.startsWith('variante') || label.startsWith('version') || label.startsWith('option')) return true;
    return Boolean(recipe?.variantGroups);
  }).length;
}

function flattenRecipeText(recipe) {
  return [
    recipe?.title,
    recipe?.yield,
    ...(recipe?.categories || []),
    ...(recipe?.seasons || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || []), group.note, ...(group.notes || [])]),
    ...(recipe?.steps || []),
    ...(recipe?.notes || []),
    ...(recipe?.technical || []).flatMap(item => [item.label, item.value, item.text]),
    ...Object.values(recipe?.practical || {}).flatMap(value => Array.isArray(value) ? value : [value])
  ].filter(Boolean).join(' ');
}

function compactSignalMask(recipe) {
  const text = normalizeText(flattenRecipeText(recipe));
  const patterns = [
    'rapide', 'express', 'four', 'enfourner', 'gratin', 'frire', 'friture', 'tempura', 'beignet',
    'air fryer', 'poele', 'plancha', 'mijoter', 'vegetarien', 'vegan', 'sans viande', 'froid',
    'refrigerateur', 'conservation', 'congeler', 'congelation', 'rechauff', 'service', 'dresser',
    'la veille', 'avance', 'week-end', 'semaine'
  ];
  return patterns.reduce((mask, pattern, index) => mask | (text.includes(pattern) ? (1 << index) : 0), 0);
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
  compact.workflowMask = compactSignalMask(recipe);
  delete compact.practical;
  delete compact.notes;
  delete compact.steps;
  const leafCount = leafVariantCount(compact, recipesById);
  if (leafCount > 1) compact.leafCount = leafCount;
  return compact;
}

const recipes = loadRecipesFrom('recipes.js');
const allIds = Object.keys(recipes);
const recipesById = Object.fromEntries(allIds.map(id => [id, { id, ...recipes[id] }]));
const catalogStats = Object.freeze({
  ficheCount: Object.values(recipesById).filter(recipe => !variantRefs(recipe).length).length,
  variantCount: Object.values(recipesById).reduce(
    (sum, recipe) => sum + (variantRefs(recipe).length ? 0 : countInlineVariantGroups(recipe)),
    0
  )
});
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
  const stats = index === 0
    ? ` window.COOK_NOTE_CATALOG_STATS = Object.freeze(${JSON.stringify(catalogStats)});`
    : '';
  const text = [
    `// Cook Note - catalogue recettes chunk ${index + 1}/${CATALOG_FILES.length}`,
    `(function(){ var __CAT__ = ${json};${stats} window.RECIPES = window.RECIPES || {}; Object.keys(__CAT__).forEach(function(k){ window.RECIPES[k] = Object.assign(window.RECIPES[k] || {}, __CAT__[k]); }); })();`,
    ''
  ].join('\n');
  fs.writeFileSync(path.join(ROOT, file), escapeAscii(text), 'utf8');
  console.log(`${file}: ${ids.length} recettes`);
});

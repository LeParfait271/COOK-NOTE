const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const ROOT_IDS = new Set([
  'apero_maitre',
  'entrees_maitre',
  'plats_maitre',
  'accompagnements_maitre',
  'desserts_maitre',
  'petit_dejeuner_maitre',
  'sauces_maitre',
  'elements_base_maitre'
]);
const generatedRoot = path.join(ROOT, 'android-legacy', 'build', 'generated', 'cook-note-lite');
const errors = [];
const warnings = [];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function expect(label, condition) {
  if (!condition) errors.push(label);
}

function loadRecipes() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read('recipes.js'), context, { filename: 'recipes.js' });
  return context.window.RECIPES || {};
}

function recipeParentIds(recipe) {
  return [...new Set([recipe?.master, ...(Array.isArray(recipe?.additionalMasters) ? recipe.additionalMasters : [])].filter(Boolean))];
}

function validateGeneratedAssets() {
  const recipeFile = path.join(generatedRoot, 'recipes-lite.json');
  const searchFile = path.join(generatedRoot, 'search-index-lite.json');
  if (!fs.existsSync(recipeFile) || !fs.existsSync(searchFile)) {
    warnings.push('Assets Android générés absents : smoke test exécuté sur le catalogue source uniquement.');
    return;
  }

  let payload;
  let search;
  try {
    payload = JSON.parse(fs.readFileSync(recipeFile, 'utf8'));
    search = JSON.parse(fs.readFileSync(searchFile, 'utf8'));
  } catch (error) {
    errors.push('Assets Android générés invalides : ' + error.message);
    return;
  }

  const siteVersion = read('app.js').match(/const SITE_VERSION = 'v(\d+\.\d{2})'/)?.[1];
  const generatedRecipes = Array.isArray(payload.recipes) ? payload.recipes : [];
  const entries = Array.isArray(search.entries) ? search.entries : [];
  const generatedIds = new Set(generatedRecipes.map(item => item?.id).filter(Boolean));
  const searchIds = new Set(entries.map(item => item?.id).filter(Boolean));
  expect('recipes-lite.json doit déclarer le mode Android Legacy natif Lite.', payload.mode === 'android-legacy-native-lite');
  expect('recipes-lite.json doit déclarer le schéma 2.', payload.schema === 2);
  expect('search-index-lite.json doit déclarer le mode de recherche Android.', search.mode === 'android-legacy-search-index');
  expect('recipes-lite.json doit avoir des identifiants uniques.', generatedIds.size === generatedRecipes.length);
  expect('search-index-lite.json doit avoir des identifiants uniques.', searchIds.size === entries.length);
  ROOT_IDS.forEach(id => expect('recipes-lite.json doit contenir ' + id + '.', generatedIds.has(id)));
  expect('Les recettes générées doivent couvrir les fiches source.', generatedIds.size >= ROOT_IDS.size);
  const searchableIds = generatedRecipes
    .map(item => item?.id)
    .filter(id => id && !ROOT_IDS.has(id));
  expect('L’index de recherche doit couvrir les fiches non parentes générées.', searchableIds.every(id => searchIds.has(id)));
  if (siteVersion && payload.version !== siteVersion) {
    warnings.push('Assets Android générés en v' + payload.version + ', source site en v' + siteVersion + ' : rebuild APK volontairement non lancé dans ce lot.');
  }
}

const recipes = loadRecipes();
const ids = new Set(Object.keys(recipes));
const masterIds = new Set(Object.entries(recipes)
  .filter(([, recipe]) => Array.isArray(recipe?.variants) && recipe.variants.length > 0)
  .map(([id]) => id));

ROOT_IDS.forEach(id => {
  expect('Fiche racine absente : ' + id + '.', ids.has(id));
  expect('Fiche racine sans variantes : ' + id + '.', masterIds.has(id));
});

Object.entries(recipes).forEach(([id, recipe]) => {
  recipeParentIds(recipe).forEach(parentId => {
    expect(id + ': parent Android introuvable (' + parentId + ').', ids.has(parentId));
    expect(id + ': parent intermédiaire interdit (' + parentId + ').', ROOT_IDS.has(parentId));
  });
  if (Array.isArray(recipe?.variants)) {
    recipe.variants.forEach(variant => {
      expect(id + ': variante sans fiche (' + (variant?.id || 'vide') + ').', Boolean(variant?.id && ids.has(variant.id)));
    });
  }
});

expect('Charlotte doit rester une collection Desserts directement racine.', recipes.charlotte_variantes?.master === 'desserts_maitre');
expect('Opéra doit rester une fiche Desserts autonome directement racine.', recipes.opera?.master === 'desserts_maitre' && !Array.isArray(recipes.opera?.variants));

const buildScript = read('scripts/build-android-legacy-assets.js');
expect('Le générateur Android doit produire recipes-lite.json.', buildScript.includes('recipes-lite.json'));
expect('Le générateur Android doit produire search-index-lite.json.', buildScript.includes('search-index-lite.json'));
expect('Le générateur Android doit reprendre la conservation explicite.', buildScript.includes('getRecipePracticalSections'));
expect('Le générateur Android doit reprendre les liens internes.', buildScript.includes('getLinkedRecipeRefs'));
expect('Le générateur Android doit gérer les variantes inline.', buildScript.includes('inlineRules'));

validateGeneratedAssets();

if (warnings.length) warnings.forEach(message => console.warn('AVERTISSEMENT Android catalogue : ' + message));
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Smoke catalogue Android Legacy OK (' + ids.size + ' fiches source, ' + masterIds.size + ' collections, ' + warnings.length + ' avertissement(s)).');

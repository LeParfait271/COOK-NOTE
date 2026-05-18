const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const recipesPath = path.join(ROOT, 'recipes.js');
const appPath = path.join(ROOT, 'app.js');
const errors = [];

function loadRecipes() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(recipesPath, 'utf8'), context, { filename: recipesPath });
  return context.window.RECIPES || {};
}

function loadQuantityHelpers() {
  const appCode = fs.readFileSync(appPath, 'utf8');
  const end = appCode.indexOf('function getStepMinutes');
  if (end === -1) throw new Error('Impossible de trouver la limite des helpers de quantite.');
  const context = {
    window: {},
    React: {
      createElement() {},
      useEffect() {},
      useMemo() {},
      useRef() {},
      useState() {}
    }
  };
  vm.createContext(context);
  vm.runInContext(appCode.slice(0, end), context, { filename: appPath });
  return context;
}

function assertEqual(label, actual, expected) {
  if (actual !== expected) {
    errors.push(`${label}: attendu "${expected}", recu "${actual}".`);
  }
}

const recipes = loadRecipes();
const helpers = loadQuantityHelpers();

[
  [{ yield: 'environ 250g' }, 4, 'environ 1000g'],
  [{ yield: '~500g' }, 0.5, '~250g'],
  [{ yield: 'environ 1 litre' }, 2, 'environ 2 litres'],
  [{ yield: '18-20 pieces' }, 2, 'Pour 36 à 40 pièces'],
  [{ yield: '4 personnes' }, 2, 'Pour 8 personnes'],
  [{ yield: '4 à 6 portions' }, 2, 'Pour 8 à 12 portions']
].forEach(([recipe, factor, expected]) => {
  assertEqual(`${recipe.yield} x${factor}`, helpers.getQuantityDisplay(recipe, factor), expected);
});

const shoppingText = helpers.shoppingListText([{
  id: 'test_quantites',
  title: 'Test quantites',
  yield: 'environ 100g',
  ingredients: [{ group: 'Base', items: ['2g sel fin, 1g poivre du moulin'] }]
}], { test_quantites: 4 });
if (!shoppingText.includes('8 g sel fin') || !shoppingText.includes('4 g poivre du moulin')) {
  errors.push('Panier courses: les lignes composees "2g sel, 1g poivre du moulin" ne sont pas regroupees correctement.');
}

for (const [id, recipe] of Object.entries(recipes)) {
  const isMaster = Array.isArray(recipe.variants) && recipe.variants.length;
  if (isMaster || !recipe.yield || !/\d/.test(recipe.yield)) continue;
  const base = helpers.getQuantityDisplay(recipe, 1);
  const doubled = helpers.getQuantityDisplay(recipe, 2);
  if (!base || !doubled || /NaN|undefined|null/i.test(`${base} ${doubled}`)) {
    errors.push(`${id}: affichage quantite invalide (${base} / ${doubled}).`);
  }
  if (base === doubled) {
    errors.push(`${id}: le rendement ne change pas en x2 (${base}).`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation quantites OK.');

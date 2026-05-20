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

const shoppingCanonicalText = helpers.shoppingListText([{
  id: 'test_panier_noms',
  title: 'Test panier noms',
  yield: '1 test',
  ingredients: [{ group: 'Base', items: ['55g beurre doux non salé ramolli', '20g beurre fondu', '30g cassonade ou vergeoise'] }]
}], { test_panier_noms: 1 });
if (!shoppingCanonicalText.includes('75 g beurre') || !shoppingCanonicalText.includes('30 g cassonade ou vergeoise')) {
  errors.push('Panier courses: les noms proches beurre/cassonade ne sont pas regroupes proprement.');
}

const shoppingDistinctText = helpers.shoppingListText([{
  id: 'test_panier_distinct',
  title: 'Test panier distinct',
  yield: '1 test',
  ingredients: [{ group: 'Base', items: ['55g huile d’olive', '20g huile neutre', '100g farine T45', '100g farine T55'] }]
}], { test_panier_distinct: 1 });
if (!shoppingDistinctText.includes("55 g huile d'olive") || !shoppingDistinctText.includes('20 g huile neutre') || !shoppingDistinctText.includes('100 g farine T45') || !shoppingDistinctText.includes('100 g farine T55')) {
  errors.push('Panier courses: les huiles et farines techniques differentes ne doivent pas etre fusionnees.');
}

const shoppingLinkedText = helpers.shoppingListText([{
  id: 'test_panier_liens',
  title: 'Test panier liens',
  yield: '1 test',
  ingredients: [{ group: 'Base', items: ['1 recette de <span data-goto="sauce_mornay">sauce Mornay</span>', '30g <span class="inline-recipe-link" data-goto="sauce_caramel">sauce caramel</span>'] }]
}], { test_panier_liens: 1 });
if (/<[^>]+>|data-goto|class=/.test(shoppingLinkedText) || !shoppingLinkedText.includes('1 recette de sauce Mornay') || !shoppingLinkedText.includes('30 g sauce caramel')) {
  errors.push('Panier courses: les liens internes ne doivent pas ressortir en HTML dans le texte partage.');
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

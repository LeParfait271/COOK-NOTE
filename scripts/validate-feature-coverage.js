const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const errors = [];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function expect(label, condition) {
  if (!condition) errors.push(label);
}

function loadAppContext() {
  const context = {
    window: {},
    document: { getElementById: () => ({ remove() {} }) },
    React: {
      createElement: () => null,
      useState: value => [typeof value === 'function' ? value() : value, () => {}],
      useMemo: fn => fn(),
      useEffect: () => {},
      useRef: value => ({ current: value || null }),
      useCallback: fn => fn
    },
    ReactDOM: { createRoot: () => ({ render() {} }) },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    requestAnimationFrame: fn => { if (typeof fn === 'function') fn(); },
    navigator: {}
  };
  context.window = Object.assign(context.window, context);
  vm.createContext(context);
  vm.runInContext(read('recipes.js'), context, { filename: path.join(ROOT, 'recipes.js') });
  vm.runInContext(read('app.js'), context, { filename: path.join(ROOT, 'app.js') });
  return context;
}

const files = {
  app: read('app.js'),
  style: read('style.css'),
  packageJson: read('package.json'),
  rules: read('COOK_NOTE_RULES.md'),
  production: read('scripts/validate-production.js'),
  recipes: read('scripts/validate-recipes.js'),
  ui: read('scripts/validate-ui.js'),
  admin: read('admin.js'),
  adminHtml: read('admin.html'),
  adminCss: read('admin.css'),
  auditRecipes: read('scripts/audit-recipes.js'),
  auditImages: read('scripts/audit-images.js'),
  visualImages: read('scripts/validate-visual-image-duplicates.js')
};

const FEATURE_COVERAGE = [
  { name: 'Recherche', checks: ['scoreRecipeSearch', 'scoreIngredientSearch', 'getRecipeIntentLabels', 'ingredient-match-badge'] },
  { name: 'Fiche recette', checks: ['RecipeView', 'getRecipeAllergens', 'getRecipeAverageWeights', 'renderLinkedText'] },
  { name: 'Images', checks: ['recipeCardImageUrl', 'onError: event =>', 'recipe-images-optimized', 'recipe-card-images', 'validate-visual-image-duplicates.js', 'PERCEPTUAL_CORRELATION_LIMIT'] },
  { name: 'Mode menu', checks: ['buildMenuSuggestion', 'menuDessertAffinity', 'menuSignature', 'buildMenuServicePlan', 'isWeeknightDessert', 'MENU_PAIRING_RULES'] },
  { name: 'Liste de courses', checks: ['buildShoppingListData', 'filterShoppingListData', 'shoppingPurchaseHint', 'shoppingSmartGroupKey'] },
  { name: 'Techniques', checks: ['TECHNIQUE_GUIDES', 'buildTechniqueTargets', 'openTechnique', 'inline-technique-link'] },
  { name: 'Anti-gaspillage', checks: ['getEggWasteRecipeRefs', 'Anti-gaspillage blancs', 'Anti-gaspillage jaunes'] },
  { name: 'Production', checks: ['service-worker.js', 'sitemap.xml', 'validate-production.js', 'generate-sitemap.js'] }
];

FEATURE_COVERAGE.forEach(feature => {
  feature.checks.forEach(fragment => {
    const haystack = `${files.app}\n${files.style}\n${files.packageJson}\n${files.production}\n${files.recipes}\n${files.ui}\n${files.admin}\n${files.adminHtml}\n${files.adminCss}\n${files.auditRecipes}\n${files.auditImages}\n${files.visualImages}`;
    expect(`Couverture feature ${feature.name} incomplete (${fragment}).`, haystack.includes(fragment));
  });
});

[
  'renderDiagnostics',
  'inferDiagnosticRole',
  'admin-diagnostic-panel',
  'MENU_COMPONENT_PATTERNS',
  'Gestes groupés',
  'healthDashboard',
  'issueBuckets',
  'Fichiers a ouvrir'
].forEach(fragment => {
  const haystack = `${files.app}\n${files.style}\n${files.admin}\n${files.adminHtml}\n${files.adminCss}\n${files.auditRecipes}\n${files.auditImages}`;
  expect(`Couverture nouvelle amelioration incomplete (${fragment}).`, haystack.includes(fragment));
});

const ctx = loadAppContext();
const recipes = ctx.window.RECIPES || {};
const recipeEntries = Object.entries(recipes);
const masterIds = new Set(recipeEntries.filter(([, recipe]) => Array.isArray(recipe.variants) && recipe.variants.length).map(([id]) => id));
const leaves = recipeEntries
  .filter(([id]) => !masterIds.has(id))
  .map(([id, recipe]) => ({ ...recipe, id }));

expect('Catalogue vide pour couverture features.', leaves.length > 0);

leaves.forEach(recipe => {
  expect(`${recipe.id}: categories requises pour recherche/menu/courses.`, Array.isArray(recipe.categories) && recipe.categories.length > 0);
  expect(`${recipe.id}: saisons requises pour menu et accueil.`, Array.isArray(recipe.seasons) && recipe.seasons.length > 0);
  expect(`${recipe.id}: image requise pour cartes/fiches.`, typeof recipe.image === 'string' && recipe.image.startsWith('/assets/'));
  expect(`${recipe.id}: texte searchable requis pour recherche.`, Boolean(recipe.title) || (Array.isArray(recipe.tags) && recipe.tags.length > 0));
});

const byId = Object.fromEntries(leaves.map(recipe => [recipe.id, recipe]));
expect('Mode menu: registre accords trop court.', Array.isArray(ctx.window.MENU_PAIRING_RULES) && ctx.window.MENU_PAIRING_RULES.length >= 100);
const themes = ['bistrot', 'mediterraneen', 'semaine', 'invites', 'apero', 'confort', 'ete'];
themes.forEach(themeId => {
  const menu = ctx.buildMenuSuggestion(leaves, 0, themeId, []);
  expect(`Mode menu ${themeId}: score absent.`, Number.isFinite(menu.quality));
  expect(`Mode menu ${themeId}: signature absente.`, Boolean(menu.signature));
  expect(`Mode menu ${themeId}: menu trop court.`, (menu.items || []).length >= 3);
  (menu.items || []).forEach(item => {
    const profile = ctx.getMenuRecipeProfile(item.recipe);
    expect(`Mode menu ${themeId}: note absente pour ${item.recipe?.id}.`, Boolean(item.note));
    expect(`Mode menu ${themeId}: composant servi (${item.recipe?.id}).`, profile.servable && profile.role !== 'component');
    if (item.key === 'main') expect(`Mode menu ${themeId}: plat mal role (${item.recipe?.id}).`, profile.role === 'main');
    if (item.key === 'dessert') expect(`Mode menu ${themeId}: dessert mal role (${item.recipe?.id}).`, profile.role === 'dessert');
    if (themeId === 'semaine' && item.key === 'dessert') expect(`Mode menu semaine: dessert trop long (${item.recipe?.id}).`, ctx.getRecipeTiming(item.recipe).active <= 10);
  });
  const shopping = ctx.buildShoppingListData((menu.items || []).map(item => item.recipe));
  const servicePlan = ctx.buildMenuServicePlan((menu.items || []).map(item => item.recipe), shopping);
  expect(`Plan menu ${themeId}: timeline absente.`, Array.isArray(servicePlan.timeline) && servicePlan.timeline.length > 0);
  expect(`Plan menu ${themeId}: charge mentale absente.`, Boolean(servicePlan.stress?.level));
  expect(`Plan menu ${themeId}: courses intelligentes absentes.`, Array.isArray(servicePlan.shoppingHints));
  expect(`Plan menu ${themeId}: service absent.`, Array.isArray(servicePlan.serviceTips) && servicePlan.serviceTips.length > 0);
  expect(`Plan menu ${themeId}: materiel absent.`, Array.isArray(servicePlan.conflicts) && servicePlan.conflicts.length > 0);
});

const firstBistrot = ctx.buildMenuSuggestion(leaves, 0, 'bistrot', []);
const secondBistrot = ctx.buildMenuSuggestion(leaves, 0, 'bistrot', [firstBistrot.signature]);
expect('Historique menu inefficace: meme signature reproposee.', firstBistrot.signature !== secondBistrot.signature);

const gaston = leaves.find(recipe => recipe.id === 'poulet_gaston_gerard');
const tomatesProvencales = leaves.find(recipe => recipe.id === 'tomates_provencales');
if (gaston && tomatesProvencales) {
  const gastonProfile = ctx.getMenuRecipeProfile(gaston);
  const tomatoProfile = ctx.getMenuRecipeProfile(tomatesProvencales);
  expect('Mode menu: poulet cremeux + tomates provencales pas assez penalise.', ctx.menuPairPenalty(gastonProfile, tomatoProfile, ctx.menuThemeById('bistrot')) >= 70);
}

const menuRecipes = (firstBistrot.items || []).map(item => item.recipe);
const shoppingData = ctx.buildShoppingListData(menuRecipes);
expect('Liste courses: rayons magasin absents.', Array.isArray(shoppingData.aisleGroups) && shoppingData.aisleGroups.length > 0);
expect('Liste courses: regroupements utiles absents.', Array.isArray(shoppingData.smartGroups));
expect('Liste courses: quantites achat absentes.', shoppingData.groupedItems.some(item => item.purchaseHint));
const owned = {};
if (shoppingData.groupedItems[0]) owned[shoppingData.groupedItems[0].key] = true;
const filtered = ctx.filterShoppingListData(shoppingData, owned);
expect('Liste courses: mode deja maison inactif.', filtered.ownedGroupedItems.length === 1 && filtered.groupedItems.length === shoppingData.groupedItems.length - 1);
expect('Liste courses: export compact absent.', ctx.shoppingListText(menuRecipes, {}, owned, 'compact').includes('Courses Cook Note'));

const searchResults = leaves.map(recipe => ctx.scoreRecipeSearch(recipe, 'rapide', byId)).filter(result => result.score > 0);
expect('Recherche: intention rapide non couverte par les recettes.', searchResults.length > 0);
const ingredientResults = leaves.map(recipe => ctx.scoreIngredientSearch(recipe, 'citron')).filter(result => result.score > 0);
expect('Recherche ingredients: citron non couvert.', ingredientResults.length > 0);
const allergenRecipe = leaves.find(recipe => /lait|creme|crème|beurre|oeuf|œuf|fromage/i.test(JSON.stringify(recipe.ingredients || [])));
expect('Allergenes: aucune recette testable.', Boolean(allergenRecipe));
if (allergenRecipe) expect('Allergenes: detection inactive.', ctx.getRecipeAllergens(allergenRecipe).length > 0);

[
  'registre de couverture des features',
  'Mode menu : accords dessert',
  'MENU_PAIRING_RULES',
  'Historique des menus',
  'Liste de courses : mode `J’ai déjà`',
  'Export compact'
].forEach(fragment => {
  expect(`Regle feature manquante (${fragment}).`, files.rules.includes(fragment));
});

expect('validate-feature-coverage non branche au package check.', files.packageJson.includes('scripts/validate-feature-coverage.js'));

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation couverture features OK.');

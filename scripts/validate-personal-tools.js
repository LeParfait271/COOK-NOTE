const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const errors = [];
const expect = (message, condition) => { if (!condition) errors.push(message); };
const context = {
  window: {
    CookNoteI18n: { t: (key, vars = {}) => Object.entries(vars).reduce((text, [name, value]) => text.replace(`{${name}}`, value), key) },
    setTimeout
  },
  React: { createElement() {}, useMemo: callback => callback(), useState() {}, useEffect() {} },
  console
};
context.window.React = context.React;
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'app-personal-tools.js'), 'utf8'), context, { filename: 'app-personal-tools.js' });
const tools = context.window.CookNotePersonalTools;
vm.runInContext(fs.readFileSync(path.join(ROOT, 'app-safety-sources.js'), 'utf8'), context, { filename: 'app-safety-sources.js' });
const safetyTools = context.window.CookNoteSafetySources;

expect('API des outils personnels absente.', Boolean(tools));
expect('Facteur de moule rond incorrect.', Math.abs(tools.calculateMoldFactor({ shape: 'round', diameter: 20 }, { shape: 'round', diameter: 24 }) - 1.44) < 0.001);
const source = { id: 'source', title: 'Crème', ingredients: ['3 jaunes d’œufs'], steps: ['Mélanger'] };
const target = { id: 'target', title: 'Meringue', ingredients: ['3 blancs d’œufs'], steps: ['Fouetter'] };
expect('Rapprochement des blancs d’œufs absent.', tools.byproductMatches(source, [source, target])[0]?.matches?.[0]?.recipe?.id === 'target');
let history = tools.captureRecipeVersion({}, 'test', source, '1', '2026-01-01T00:00:00.000Z');
history = tools.captureRecipeVersion(history, 'test', source, '1', '2026-01-02T00:00:00.000Z');
expect('Historique non dédupliqué.', history.test.length === 1);
const similar = tools.findSimilarRecipes([
  { id: 'a', title: 'Tarte citron classique', ingredients: ['200 g farine', '2 citrons'], steps: [] },
  { id: 'b', title: 'Tarte citron meringuée', ingredients: ['200 g farine', '2 citrons'], steps: [] }
]);
expect('Détection de recettes proches inactive.', similar.length === 1);

const production = tools.buildProductionPlan([
  { id: 'prep', title: 'Preparation', activeTime: 30, cookTime: 20, restTime: 10 }
], '2026-08-30T20:00:00');
expect('Plan de production incorrect.', production.length === 1 && production[0].duration.total === 60 && production[0].startsAt.getHours() === 19);
expect('Format restaurant absent.', tools.SERVICE_FORMATS?.restaurant?.factor === 1);
expect('Format degustation absent.', tools.SERVICE_FORMATS?.tasting?.factor === 0.6);
expect('Consigne de conservation validee non reprise.', tools.getRestaurantStorageGuidance({ practical: { storage: ['48h au froid.'] } })[0] === '48h au froid.');
expect('Une consigne de conservation a ete inventee.', tools.getRestaurantStorageGuidance({ notes: ['Servir chaud.'] }).length === 0);

const app = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
expect('Module personnel non chargé avant app.js.', index.indexOf('src="/app-personal-tools.js') > -1 && index.indexOf('src="/app-personal-tools.js') < index.indexOf('src="/app.js'));
expect('Sauvegarde du profil matériel absente.', app.includes('STORAGE_KEYS.equipmentProfile'));
expect('Sauvegarde de l’historique absente.', app.includes('STORAGE_KEYS.recipeHistory'));
expect('Restauration locale des recettes absente.', app.includes('STORAGE_KEYS.recipeOverrides'));
expect('Outils restaurant absents du panneau personnel.', fs.readFileSync(path.join(ROOT, 'app-personal-tools.js'), 'utf8').includes("'Restaurant'"));
expect('Matrice allergenes non reliee au detecteur existant.', app.includes('getAllergens: getRecipeAllergens'));
expect('Bloc de sources officielles absent.', typeof safetyTools.getRecipeSafetySources === 'function' && app.includes('RecipeSafetySources'));
expect('Source ministere mal ciblee.', safetyTools.getRecipeSafetySources({ title: 'Poulet rôti', ingredients: [] })[0]?.href === 'https://agriculture.gouv.fr/la-campylobacteriose');
expect('Source hors sujet affichee.', safetyTools.getRecipeSafetySources({ title: 'Creme brulee', ingredients: [] }).length === 0);

if (errors.length) {
  console.error(`Validation outils personnels: ${errors.length} erreur(s)`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}
console.log('Validation outils personnels: OK');

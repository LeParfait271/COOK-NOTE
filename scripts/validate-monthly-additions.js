const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const appPath = path.join(ROOT, 'app.js');
const recipesPath = path.join(ROOT, 'recipes.js');
const appSource = fs.readFileSync(appPath, 'utf8');
const recipesSource = fs.readFileSync(recipesPath, 'utf8');
const errors = [];

function expect(label, condition) {
  if (!condition) errors.push(label);
}

function extractMonthlyAdditions(source) {
  const match = source.match(/const MONTHLY_ADDITIONS = (\[[\s\S]*?\]);/);
  if (!match) return null;
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`monthlyAdditions = ${match[1]};`, sandbox);
  return sandbox.monthlyAdditions;
}

const recipesSandbox = { window: {} };
vm.createContext(recipesSandbox);
vm.runInContext(recipesSource, recipesSandbox, { filename: recipesPath });
const recipes = recipesSandbox.window.RECIPES || {};
const additions = extractMonthlyAdditions(appSource);

expect('MONTHLY_ADDITIONS absent ou illisible.', Array.isArray(additions));
expect('Tri categorie des ajouts du mois absent.', appSource.includes('MONTHLY_ADDITION_CATEGORY_ORDER') && appSource.includes('MONTHLY_ADDITION_CATEGORY_RANK') && appSource.includes('normalizeText(category)') && appSource.includes('rankA.category - rankB.category'));
expect('Tri titre des ajouts du mois absent.', appSource.includes("rankA.title.localeCompare(rankB.title, 'fr'"));

if (Array.isArray(additions)) {
  const seen = new Set();
  additions.forEach((item, index) => {
    const prefix = `MONTHLY_ADDITIONS[${index}]`;
    expect(`${prefix}: id manquant.`, typeof item.id === 'string' && item.id.length > 0);
    expect(`${prefix}: date addedAt invalide.`, /^\d{4}-\d{2}-\d{2}$/.test(String(item.addedAt || '')) && !Number.isNaN(new Date(`${item.addedAt}T00:00:00`).getTime()));
    expect(`${prefix}: doublon ${item.id}.`, !seen.has(item.id));
    seen.add(item.id);
    const recipe = recipes[item.id];
    expect(`${prefix}: recette introuvable (${item.id}).`, Boolean(recipe));
    if (recipe) {
      expect(`${prefix}: fiche parent interdite (${item.id}).`, !(Array.isArray(recipe.variants) && recipe.variants.length));
      expect(`${prefix}: categorie requise pour rangement (${item.id}).`, Array.isArray(recipe.categories) && recipe.categories.length > 0);
    }
  });
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation ajouts du mois OK.');

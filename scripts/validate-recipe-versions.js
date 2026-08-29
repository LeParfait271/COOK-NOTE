const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'recipes.js'), 'utf8'), context);
const recipes = context.window.RECIPES || {};
const errors = Object.entries(recipes)
  .filter(([, recipe]) => !/^\d+\.\d{2}$/.test(String(recipe.recipeVersion || '')))
  .map(([id]) => id);

if (errors.length) {
  console.error(`Versions de fiche absentes ou invalides: ${errors.slice(0, 20).join(', ')}`);
  process.exit(1);
}
console.log(`Validation versions recettes OK (${Object.keys(recipes).length} fiches).`);

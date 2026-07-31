const fs = require('fs');
const vm = require('vm');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync('recipes.js', 'utf8'), context);
const recipes = context.window.RECIPES;

function addAdditionalMaster(id, parentId) {
  const recipe = recipes[id];
  recipe.additionalMasters = [...new Set([...(recipe.additionalMasters || []), parentId])];
}

addAdditionalMaster('tortilla_espagnole', 'apero_maitre');
addAdditionalMaster('tortilla_chorizo', 'apero_maitre');
addAdditionalMaster('choux_mousse_foie_gras', 'entrees_maitre');
addAdditionalMaster('accras_morue', 'entrees_maitre');

for (const id of ['choux_mousse_foie_gras', 'accras_morue']) {
  const parent = recipes.entrees_maitre;
  const entry = { id, label: recipes[id].title };
  const index = parent.variants.findIndex(variant => variant.id === id);
  if (index >= 0) parent.variants[index] = entry;
  else parent.variants.push(entry);
}

fs.writeFileSync('recipes.js', `window.RECIPES = ${JSON.stringify(recipes)};\n`);

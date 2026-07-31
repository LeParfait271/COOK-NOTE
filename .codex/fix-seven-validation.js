const fs = require('fs');
const vm = require('vm');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync('recipes.js', 'utf8'), context);
const recipes = context.window.RECIPES;

function upsertVariant(parentId, id) {
  const parent = recipes[parentId];
  const entry = { id, label: recipes[id].title };
  const index = parent.variants.findIndex(variant => variant.id === id);
  if (index >= 0) parent.variants[index] = entry;
  else parent.variants.push(entry);
}

for (const id of ['poulet_vin_jaune', 'poulet_marengo', 'lapin_saute_chasseur', 'carpaccio_boeuf']) {
  upsertVariant('plats_maitre', id);
}
upsertVariant('apero_maitre', 'pate_en_croute_noel');
upsertVariant('entrees_maitre', 'pate_en_croute_noel');
upsertVariant('entrees_maitre', 'carpaccio_boeuf');
upsertVariant('plats_maitre', 'potee_chou');

for (const id of ['poulet_vin_jaune', 'poulet_marengo', 'pate_en_croute_noel', 'potee_chou', 'lapin_saute_chasseur', 'carpaccio_boeuf']) {
  delete recipes[id].source;
}

recipes.potee_chou.ingredients[0].items = recipes.potee_chou.ingredients[0].items.map(item =>
  item === 'Poivre en grains' ? 'Poivre du moulin' : item
);
recipes.potee_chou.steps = recipes.potee_chou.steps.map(step =>
  step.replace('le poivre en grains', 'du poivre du moulin')
);
recipes.poulet_vin_jaune.steps = recipes.poulet_vin_jaune.steps.map(step =>
  step.replace('Saler et poivrer', 'Assaisonner avec le sel fin et le poivre du moulin')
);
recipes.poulet_marengo.steps = recipes.poulet_marengo.steps.map(step =>
  step.replace('Saler et poivrer', 'Assaisonner avec le sel fin et le poivre du moulin')
);
recipes.pate_en_croute_noel.ingredients[1].items = recipes.pate_en_croute_noel.ingredients[1].items.map(item =>
  item === '5g poivre moulu' ? '5g poivre du moulin' : item
);
recipes.pate_en_croute_noel.steps = recipes.pate_en_croute_noel.steps.map(step =>
  step.replace('sel, poivre, muscade', 'sel, poivre du moulin, muscade')
);
recipes.lapin_saute_chasseur.steps = recipes.lapin_saute_chasseur.steps.map(step =>
  step.replace('saler légèrement et poivrer', 'ajouter un peu de sel fin et du poivre du moulin')
);

fs.writeFileSync('recipes.js', `window.RECIPES = ${JSON.stringify(recipes)};\n`);

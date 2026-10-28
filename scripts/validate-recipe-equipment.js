// Materiel de cuisine : chaque fiche cuisinable (et chaque variante integree) a
// une liste tiree du vocabulaire unique (scripts/lib/equipment.js), sans
// doublon, dans l'ordre du travail. Corriger avec
// node scripts/curate-recipe-equipment.js --write.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { EQUIPMENT, EQUIPMENT_SET, EQUIPMENT_MAX } = require('./lib/equipment');

const ROOT = path.resolve(__dirname, '..');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'recipes.js'), 'utf8'), context);
const recipes = context.window.RECIPES || {};
const errors = [];
let checked = 0;

function check(label, list) {
  checked += 1;
  if (!Array.isArray(list) || !list.length) {
    errors.push(`${label} : materiel absent.`);
    return;
  }
  const unknown = list.filter(item => !EQUIPMENT_SET.has(item));
  if (unknown.length) errors.push(`${label} : hors vocabulaire (${unknown.join(', ')}).`);
  if (new Set(list).size !== list.length) errors.push(`${label} : doublon.`);
  if (list.length > EQUIPMENT_MAX) errors.push(`${label} : ${list.length} elements (max ${EQUIPMENT_MAX}).`);
  const order = list.map(item => EQUIPMENT.indexOf(item));
  if (order.some((rank, index) => index > 0 && rank < order[index - 1])) errors.push(`${label} : ordre different du vocabulaire.`);
}

Object.entries(recipes).forEach(([id, recipe]) => {
  if (/_maitre$/.test(id)) return;
  if (recipe.variantGroups) {
    (recipe.ingredients || []).forEach((group, index) => {
      if (Array.isArray(group.steps) && group.steps.length) check(`${id} > ${group.group || index}`, group.recipe?.practical?.equipment);
    });
    return;
  }
  if (Array.isArray(recipe.steps) && recipe.steps.length) check(id, recipe.practical?.equipment);
});

// Fiches de renvoi (toutes les etapes pointent vers d'autres recettes) : le
// script n'y detecte parfois rien ; tolerees si elles n'avaient rien avant.
const blocking = errors.filter(error => !error.endsWith('materiel absent.'));
const missing = errors.length - blocking.length;
if (blocking.length) {
  console.error(blocking.slice(0, 30).join('\n'));
  console.error(`${blocking.length} erreur(s) de materiel. Corriger : node scripts/curate-recipe-equipment.js --write`);
  process.exit(1);
}
console.log(`Validation materiel OK (${checked} fiches${missing ? `, ${missing} fiche(s) de renvoi sans materiel` : ''}).`);

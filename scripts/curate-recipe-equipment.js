// Met a jour le materiel de cuisine de toutes les fiches (practical.equipment) :
// materiel declare ramene au vocabulaire unique + materiel detecte dans les
// etapes (scripts/lib/equipment.js). Les variantes integrees ont chacune leur
// liste (ingredients[i].recipe.practical.equipment).
// Usage : node scripts/curate-recipe-equipment.js [--write] [--report fichier]
// Sans --write : rapport seulement, recipes.js inchange.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { deriveEquipment } = require('./lib/equipment');

const ROOT = path.resolve(__dirname, '..');
const RECIPES_FILE = path.join(ROOT, 'recipes.js');
const WRITE = process.argv.includes('--write');
const reportIndex = process.argv.indexOf('--report');
const REPORT = reportIndex > 0 ? process.argv[reportIndex + 1] : '';

const source = fs.readFileSync(RECIPES_FILE, 'utf8');
const prefix = source.slice(0, source.indexOf('{'));
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context);
// Copie modifiable : le catalogue peut etre gele (Object.freeze).
const recipes = JSON.parse(JSON.stringify(context.window.RECIPES));

const asList = value => (Array.isArray(value) ? value.filter(item => typeof item === 'string') : []);
const groupItems = groups => (groups || []).flatMap(group => asList(group.items));
const rows = [];
const unknown = new Map();
let changed = 0;

function apply(target, label, input) {
  const before = asList(target.practical?.equipment);
  const { equipment, unknown: rest } = deriveEquipment(input);
  rest.forEach(item => unknown.set(item, (unknown.get(item) || 0) + 1));
  // Rien de detecte (fiche de renvoi vers d'autres recettes) : liste inchangee.
  if (!equipment.length) return;
  rows.push({ label, before, after: equipment });
  if (JSON.stringify(before) === JSON.stringify(equipment)) return;
  changed += 1;
  if (!WRITE) return;
  target.practical = { ...(target.practical || {}), equipment };
}

Object.entries(recipes).forEach(([id, recipe]) => {
  if (/_maitre$/.test(id)) return;
  const groups = recipe.ingredients || [];
  if (recipe.variantGroups) {
    groups.forEach((group, index) => {
      if (!Array.isArray(group.steps) || !group.steps.length) return;
      if (!group.recipe || typeof group.recipe !== 'object') group.recipe = {};
      apply(group.recipe, `${id} > ${group.group || index}`, {
        title: group.recipe.title || group.group || recipe.title,
        steps: asList(group.steps),
        items: asList(group.items),
        declared: asList(group.recipe.practical?.equipment).length ? asList(group.recipe.practical.equipment) : asList(recipe.practical?.equipment)
      });
    });
    return;
  }
  const steps = asList(recipe.steps);
  if (!steps.length) return;
  apply(recipe, id, {
    title: recipe.title,
    steps,
    items: groupItems(groups),
    declared: asList(recipe.practical?.equipment)
  });
});

const lines = [
  `Fiches : ${rows.length}, listes modifiees : ${changed}${WRITE ? ' (ecrit)' : ' (rapport seul)'}`,
  '',
  '## Materiel declare non reconnu (a ajouter au vocabulaire ou retirer)',
  ...[...unknown.entries()].sort((a, b) => b[1] - a[1]).map(([item, count]) => `${count}\t${item}`),
  '',
  '## Fiches',
  ...rows.map(row => `- ${row.label}\n  avant : ${row.before.join(', ') || '(rien)'}\n  apres : ${row.after.join(', ') || '(rien)'}`)
];
if (REPORT) fs.writeFileSync(REPORT, lines.join('\n'));
console.log(lines.slice(0, 3 + unknown.size + 1).join('\n'));

if (WRITE && changed) {
  fs.writeFileSync(RECIPES_FILE, `${prefix}${JSON.stringify(recipes)};\n`);
}

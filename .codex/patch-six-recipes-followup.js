const fs = require('node:fs');

const file = 'recipes.js';
let source = fs.readFileSync(file, 'utf8');
const replacements = [
  ['Démarrer la cuisson des œufs à froid dans une casserole d’eau salée', 'Cuire les œufs durs avec un départ à froid dans une casserole d’eau salée'],
  ['{"id":"souffle_fromage_facile","label":"Soufflé au fromage"}', '{"id":"souffle_fromage_facile","label":"Soufflé au comté"}']
];

for (const [before, after] of replacements) {
  if (!source.includes(before)) throw new Error(`Texte introuvable: ${before}`);
  source = source.replace(before, after);
}

fs.writeFileSync(file, source, 'utf8');

const fs = require('node:fs');

const file = 'recipes.js';
let source = fs.readFileSync(file, 'utf8');

const replacements = [
  ['"title":"Soufflé au fromage","master":"plats_maitre"', '"title":"Soufflé au comté","master":"plats_maitre"'],
  ['"aliases":["souffle au fromage facile"]', '"aliases":["souffle au comte","soufflé au comté"]'],
  ['jusqu’à obtenir une béchamel lisse. Saler et poivrer.', 'jusqu’à obtenir une béchamel lisse. Saler et ajouter du poivre du moulin.'],
  ['avec la crème et l’armagnac, saler, poivrer et porter', 'avec la crème et l’armagnac, saler, ajouter du poivre du moulin et porter'],
  ['puis le parmesan râpé, saler et poivrer.', 'puis le parmesan râpé, saler et ajouter du poivre du moulin.'],
  ['Ajouter la mayonnaise, saler, poivrer et mélanger', 'Ajouter la mayonnaise, saler, ajouter du poivre du moulin et mélanger'],
  ['Mettre les œufs dans une casserole d’eau froide salée, porter à ébullition', 'Démarrer la cuisson des œufs à froid dans une casserole d’eau salée, puis porter à ébullition'],
  ['puis saler et poivrer.', 'puis saler et ajouter du poivre du moulin.'],
  ['{"id":"accras_morue","label":"Accras de morue"}],"technical"', '{"id":"accras_morue","label":"Accras de morue"},{"id":"quichette_thon_parmesan","label":"Quichette au thon et parmesan"}],"technical"']
];

for (const [before, after] of replacements) {
  if (!source.includes(before)) throw new Error(`Texte introuvable: ${before}`);
  source = source.replace(before, after);
}

fs.writeFileSync(file, source, 'utf8');

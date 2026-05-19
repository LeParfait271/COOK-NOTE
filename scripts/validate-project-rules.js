const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const rulesPath = path.join(ROOT, 'COOK_NOTE_RULES.md');
const packagePath = path.join(ROOT, 'package.json');
const validators = {
  recipes: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-recipes.js'), 'utf8'),
  ui: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-ui.js'), 'utf8'),
  production: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-production.js'), 'utf8'),
  audit: fs.readFileSync(path.join(ROOT, 'scripts', 'audit-recipes.js'), 'utf8'),
  packageJson: fs.readFileSync(packagePath, 'utf8')
};
const errors = [];

function expect(label, condition) {
  if (!condition) errors.push(label);
}

expect('Fichier de regles Cook Note absent.', fs.existsSync(rulesPath));

const rules = fs.existsSync(rulesPath) ? fs.readFileSync(rulesPath, 'utf8') : '';
[
  'arrondir au multiple de `5g`',
  'vanille selon gout ou arôme vanille selon dosage indiqué sur la bouteille',
  'cassonade ou vergeoise',
  'poivre du moulin',
  'sortir le beurre environ 45 a 60min avant',
  'Materiel necessaire',
  'coulis_fraise',
  'Chaque recette feuille doit avoir une image locale unique',
  'assets/recipe-images-optimized/',
  'npm run optimize:images',
  'montrer le visuel et attendre validation utilisateur',
  'Regenerer le sitemap',
  'score de completude',
  'La recherche doit comprendre les intentions',
  'reseau d abord avec cache de secours',
  'bump la version des assets',
  'Le panier courses doit regrouper',
  'sans rajouter de sections gadget',
  'leur propre URL `/recette/id`',
  'ancien panneau de variante selectionnee',
  'Ne pas afficher toutes les recettes enfants en vrac',
  'Sous le nom d\'une carte recette',
  'toutes les categories de la fiche',
  '`Toppings frites` = Accompagnements/Sauces'
].forEach(fragment => {
  expect(`Regle manquante dans COOK_NOTE_RULES.md (${fragment}).`, rules.includes(fragment));
});

expect('Validation arrondi grammes non branchee.', validators.recipes.includes('checkRoundedLargeGramAmounts'));
expect('Validation dosage vanille non branchee.', validators.recipes.includes('checkVanillaDosage'));
expect('Validation cassonade/vergeoise non branchee.', validators.recipes.includes('checkBrownSugarWording'));
expect('Validation poivre du moulin non branchee.', validators.recipes.includes('checkPepperWording'));
expect('Validation unites non metriques non branchee.', validators.recipes.includes('NON_METRIC_UNIT_RE'));
expect('Validation images uniques non branchee.', validators.recipes.includes('leafImageHashes'));
expect('Validation images optimisees non branchee.', validators.recipes.includes('recipe-images-optimized') && validators.recipes.includes('master PNG introuvable'));
expect('Validation materiel necessaire colonne droite non branchee.', validators.ui.includes('Materiel necessaire encore dans la colonne droite'));
expect('Validation anti-doublon notes pratiques non branchee.', validators.ui.includes('Notes pratiques encore classees en double'));
expect('Validation recherche intention non branchee.', validators.ui.includes('Recherche par intention absente'));
expect('Validation panier courses noms proches non branchee.', fs.readFileSync(path.join(ROOT, 'scripts', 'validate-quantities.js'), 'utf8').includes('test_panier_noms'));
expect('Validation production non branchee.', validators.production.includes('Validation production OK.') && validators.packageJson.includes('scripts/validate-production.js'));
expect('Audit recettes non branche.', validators.audit.includes('Audit recettes OK') && validators.packageJson.includes('scripts/audit-recipes.js'));
expect('Validation regles non branchee au check.', validators.packageJson.includes('scripts/validate-project-rules.js'));

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation regles projet OK.');

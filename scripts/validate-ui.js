const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const files = {
  app: fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8'),
  style: fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8'),
  server: fs.readFileSync(path.join(ROOT, 'server.js'), 'utf8'),
  packageJson: fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')
};
const errors = [];

function expect(label, condition) {
  if (!condition) errors.push(label);
}

expect('Recherche ingredients absente.', files.app.includes('ingredientQuery') && files.app.includes('scoreIngredientSearch'));
expect('Filtres avances encore presents.', !files.app.includes('QUICK_FILTERS') && !files.app.includes('QuickFilterBar') && !files.style.includes('quick-filter-row'));
expect('Page techniques absente.', files.app.includes('TECHNIQUE_GUIDES') && files.app.includes('TechniquesView'));
expect('Techniques de cuisinier incompletes.', files.app.includes('Émincer') && files.app.includes('Monder des tomates') && files.app.includes('Abaisser une pâte') && files.app.includes('Foncer un moule'));
expect('Liens vers techniques absents.', files.app.includes('buildTechniqueTargets') && files.app.includes('openTechnique') && files.style.includes('inline-technique-link'));
expect('Route /techniques absente du serveur.', files.server.includes("url.pathname === '/techniques'"));
expect('Export recette propre absent.', files.app.includes('recipeExportText') && files.app.includes('Copier fiche'));
expect('Resume recette premium absent.', files.app.includes('recipe-summary-panel') && files.style.includes('.recipe-summary-panel'));
expect('CSS mobile nav incoherent.', files.style.includes('grid-template-columns: repeat(5, 1fr)'));
expect('CSS print propre absent.', files.style.includes('@media print') && files.style.includes('.recipe-summary-panel'));
expect('Ancienne section dashboard encore presente.', !files.app.includes('function HomeDashboard') && !files.style.includes('.home-dashboard'));
expect('Ancienne section collections encore presente.', !files.app.includes('SmartCollections') && !files.style.includes('smart-collection'));
expect('Script validate-ui non branche au check.', files.packageJson.includes('scripts/validate-ui.js'));

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation UI OK.');

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const recipesPath = path.join(ROOT, 'recipes.js');
const reportPath = path.join(ROOT, 'reports', 'recipe-audit.json');
const markdownPath = path.join(ROOT, 'reports', 'recipe-audit.md');

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function loadRecipes() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read('recipes.js'), context, { filename: recipesPath });
  return context.window.RECIPES || {};
}

function isMaster(recipe) {
  return Array.isArray(recipe?.variants) && recipe.variants.length > 0;
}

function isInlineVariantFamily(recipe) {
  return recipe?.variantGroups === true;
}

function currentSourceHash() {
  return crypto.createHash('sha256').update(fs.readFileSync(recipesPath)).digest('hex').slice(0, 12);
}

const recipes = loadRecipes();
const ids = Object.keys(recipes);
const masters = ids.filter(id => isMaster(recipes[id]));
const inlineFamilies = ids.filter(id => isInlineVariantFamily(recipes[id]));
const leaves = ids.filter(id => !isMaster(recipes[id]) && !isInlineVariantFamily(recipes[id]));
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const errors = [];

if (report?.source?.recipesSha256 !== currentSourceHash()) {
  errors.push('Le rapport recette ne correspond plus au hash courant de recipes.js.');
}
if (report?.totals?.recipes !== ids.length) errors.push('Le total des entrees catalogue est stale.');
if (report?.totals?.masters !== masters.length) errors.push('Le nombre de collections racines est stale.');
if (report?.totals?.inlineVariantFamilies !== inlineFamilies.length) errors.push('Le nombre de familles a variantes internes est stale.');
if (report?.totals?.leaves !== leaves.length) errors.push('Le nombre de fiches feuilles autonomes est stale.');
if (report?.totals?.qualityIssues !== 0) errors.push('Le rapport contient encore des alertes de qualite non traitees.');
if (report?.healthDashboard?.missingDiscovery !== 0) errors.push('Le rapport contient encore des fiches avec une decouverte faible.');
if (!String(fs.readFileSync(markdownPath, 'utf8')).includes(report?.source?.recipesSha256 || '')) {
  errors.push('Le rapport Markdown n affiche pas le hash source courant.');
}

for (const item of report?.weakestRecipes || []) {
  const baseId = String(item.id || '').split('::')[0];
  if (inlineFamilies.includes(baseId) && item.id === baseId) {
    errors.push(`Une famille a variantes internes est notee comme fiche executable (${item.id}).`);
  }
}

if (errors.length) {
  console.error(`Validation rapport audit KO :\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`Validation rapport audit OK (${ids.length} entrees, ${masters.length} collections, ${inlineFamilies.length} familles internes).`);

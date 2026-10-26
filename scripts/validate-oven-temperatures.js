// Bloque une cuisson au four sans temperature dans les etapes affichees d'une
// fiche (ou d'une option de variante qui remplace les etapes de base).
// Usage : node scripts/validate-oven-temperatures.js [fichier recettes]
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.resolve(ROOT, process.argv[2] || 'recipes.js');

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(FILE, 'utf8'), context, { filename: FILE });
const recipes = context.window.RECIPES || {};

const stripHtml = value => String(value || '').replace(/<[^>]+>/g, ' ');
const normalize = value => stripHtml(value).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/œ/g, 'oe').toLowerCase();

// Temperature ecrite : 180°C, 90–100°C, th. 6, thermostat 6.
const TEMPERATURE_RE = /\b\d{2,3}\s*°|\bth(?:ermostat)?\.?\s*\d/i;
// Four nomme explicitement.
const OVEN_RE = /\b(?:four|enfourn\w*|chaleur tournante|gratiner)\b/;
// Cuisson sans le mot four mais sur un support de four.
const IMPLICIT_OVEN_RE = /\b(?:cuire|cuisson)\b.*\b(?:plaque|moules?|a blanc|fond de tarte|couronnes|empreintes|caissettes)\b|\b(?:plaque|moules?|a blanc|fond de tarte|couronnes|empreintes|caissettes)\b.*\b(?:cuire|cuisson)\b/;
// Supports qui ne sont pas le four.
const NOT_OVEN_RE = /\b(?:poele|casserole|friteuse|vapeur|plancha|barbecue|wok|sauteuse|eau bouillante|micro-ondes|gaufrier|crepiere|bain-marie sur le feu|feu doux|feu moyen|feu vif|plaque filmee)\b/;
// Le gril se regle par position, pas par temperature.
const GRILL_RE = /\b(?:gril|grill)\b/;

function displayedOptions(id, recipe) {
  if (Array.isArray(recipe.variants) && recipe.variants.length) return [];
  const groupsWithSteps = recipe.variantGroups === true
    ? (recipe.ingredients || []).filter(group => Array.isArray(group.steps) && group.steps.length)
    : [];
  if (groupsWithSteps.length) {
    return groupsWithSteps.map(group => ({
      label: `${id} / ${group.group}`,
      steps: group.useRecipeSteps ? [...(recipe.steps || []), ...group.steps] : group.steps
    }));
  }
  return [{ label: id, steps: recipe.steps || [] }];
}

function isOvenStep(step) {
  const text = normalize(step);
  if (OVEN_RE.test(text)) return true;
  return IMPLICIT_OVEN_RE.test(text) && !NOT_OVEN_RE.test(text);
}

const errors = [];
let checked = 0;
Object.entries(recipes).forEach(([id, recipe]) => {
  displayedOptions(id, recipe).forEach(option => {
    const ovenSteps = option.steps.filter(isOvenStep);
    if (!ovenSteps.length) return;
    checked += 1;
    const stepsText = option.steps.map(stripHtml).join(' ');
    if (TEMPERATURE_RE.test(stepsText)) return;
    if (option.steps.some(step => GRILL_RE.test(normalize(step)))) return;
    errors.push(`${option.label} : cuisson au four sans temperature (« ${stripHtml(ovenSteps[0]).trim().slice(0, 90)} »).`);
  });
});

if (errors.length) {
  errors.forEach(error => console.error(error));
  console.error(`${errors.length} cuisson(s) au four sans temperature : ajouter la temperature dans l'etape affichee.`);
  process.exit(1);
}
console.log(`Validation temperatures four OK (${checked} cuissons au four).`);

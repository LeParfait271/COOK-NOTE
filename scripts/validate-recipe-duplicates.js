const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'recipes.js'), 'utf8'), context, {
  filename: path.join(ROOT, 'recipes.js')
});

const recipes = context.window.RECIPES || {};
const leaves = Object.entries(recipes).filter(([, recipe]) => !Array.isArray(recipe?.variants) || !recipe.variants.length);
const errors = [];

function normalize(value) {
  return String(value || '')
    .replace(/œ/gi, 'oe')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/<[^>]+>/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function normalizeDeep(value) {
  if (typeof value === 'string') return normalize(value);
  if (Array.isArray(value)) return value.map(normalizeDeep);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, normalizeDeep(value[key])]));
}

function hash(value) {
  return crypto.createHash('sha256').update(JSON.stringify(normalizeDeep(value))).digest('hex');
}

function register(map, key, id, label) {
  if (!key) return;
  if (map.has(key)) errors.push(`${label} duplique entre ${map.get(key)} et ${id}.`);
  else map.set(key, id);
}

const titleKeys = new Map();
const structureKeys = new Map();
const contentKeys = new Map();

leaves.forEach(([id, recipe]) => {
  register(titleKeys, normalize(recipe.title), id, 'Titre de recette');
  register(structureKeys, hash({ ingredients: recipe.ingredients || [], steps: recipe.steps || [] }), id, 'Ingredients et etapes');
  register(contentKeys, hash({
    ingredients: recipe.ingredients || [],
    steps: recipe.steps || [],
    notes: recipe.notes || [],
    technical: recipe.technical || [],
    practical: recipe.practical || {}
  }), id, 'Contenu culinaire');
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validation doublons recettes OK (${leaves.length} fiches feuilles).`);

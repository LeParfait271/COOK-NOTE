const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.join(ROOT, 'recipes.js');

function load(source, filename = 'recipes.js') {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename });
  return context.window.RECIPES || {};
}

function comparable(recipe) {
  const copy = JSON.parse(JSON.stringify(recipe || {}));
  delete copy.recipeVersion;
  return JSON.stringify(copy);
}

function nextVersion(value) {
  const match = String(value || '1.00').match(/^(\d+)\.(\d{2})$/);
  const major = match ? Number(match[1]) : 1;
  const minor = match ? Number(match[2]) : 0;
  return minor >= 99 ? `${major + 1}.00` : `${major}.${String(minor + 1).padStart(2, '0')}`;
}

const current = load(fs.readFileSync(FILE, 'utf8'));
let previous = {};
try {
  previous = load(execFileSync('git', ['show', 'HEAD:recipes.js'], { cwd: ROOT, encoding: 'utf8' }), 'HEAD:recipes.js');
} catch (_) {
  previous = {};
}

let created = 0;
let bumped = 0;
Object.entries(current).forEach(([id, recipe]) => {
  const oldRecipe = previous[id];
  if (!oldRecipe) {
    recipe.recipeVersion = '1.00';
    created += 1;
    return;
  }
  const oldVersion = /^\d+\.\d{2}$/.test(String(oldRecipe.recipeVersion || '')) ? oldRecipe.recipeVersion : '1.00';
  if (comparable(recipe) !== comparable(oldRecipe)) {
    recipe.recipeVersion = nextVersion(oldVersion);
    bumped += 1;
  } else {
    recipe.recipeVersion = oldVersion;
  }
});

fs.writeFileSync(FILE, `window.RECIPES = ${JSON.stringify(current)};\n`, 'utf8');
console.log(`Versions recettes synchronisees: ${Object.keys(current).length} fiches, ${created} nouvelles, ${bumped} augmentees.`);

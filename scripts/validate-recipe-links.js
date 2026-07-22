const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'recipes.js'), 'utf8'), context, {
  filename: path.join(ROOT, 'recipes.js')
});

const recipes = context.window.RECIPES || {};
const ids = new Set(Object.keys(recipes));
const errors = [];
let referenceCount = 0;

function visitStrings(value, location, callback) {
  if (typeof value === 'string') {
    callback(value, location);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => visitStrings(item, `${location}[${index}]`, callback));
    return;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => visitStrings(item, `${location}.${key}`, callback));
  }
}

function validateTarget(sourceId, targetId, location, kind) {
  referenceCount += 1;
  if (!targetId || !ids.has(targetId)) {
    errors.push(`${location}: cible ${kind} introuvable (${targetId || 'vide'}).`);
  } else if (targetId === sourceId) {
    errors.push(`${location}: lien ${kind} vers la fiche elle-meme (${targetId}).`);
  }
}

Object.entries(recipes).forEach(([id, recipe]) => {
  visitStrings(recipe, id, (value, location) => {
    const dataGotoTokens = value.match(/data-goto\s*=/gi) || [];
    const parsedTargets = [...value.matchAll(/data-goto\s*=\s*\\?["']([^"']+)\\?["']/gi)];
    if (dataGotoTokens.length !== parsedTargets.length) {
      errors.push(`${location}: balise data-goto mal formee (${value}).`);
    }
    parsedTargets.forEach(match => validateTarget(id, match[1], location, 'data-goto'));
    if (/\shref\s*=/i.test(value)) {
      errors.push(`${location}: attribut href interdit dans une fiche; utiliser data-goto.`);
    }
  });

  const linkedSeen = new Set();
  if (recipe.linkedRecipes !== undefined && !Array.isArray(recipe.linkedRecipes)) {
    errors.push(`${id}.linkedRecipes: une liste est attendue.`);
  }
  (recipe.linkedRecipes || []).forEach((link, index) => {
    const targetId = typeof link === 'string' ? link : link?.id;
    validateTarget(id, targetId, `${id}.linkedRecipes[${index}]`, 'linkedRecipes');
    if (targetId && linkedSeen.has(targetId)) {
      errors.push(`${id}.linkedRecipes: cible dupliquee (${targetId}).`);
    }
    if (targetId) linkedSeen.add(targetId);
  });

  (recipe.ingredients || []).forEach((group, index) => {
    if (group?.recipeId) validateTarget(id, group.recipeId, `${id}.ingredients[${index}].recipeId`, 'recipeId');
  });
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validation hyperliens recettes OK (${referenceCount} references internes).`);

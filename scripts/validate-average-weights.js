const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const recipesPath = path.join(ROOT, 'recipes.js');
const appImagesPath = path.join(ROOT, 'app-images.js');
const appPremiumPath = path.join(ROOT, 'app-premium.js');
const appPath = path.join(ROOT, 'app.js');
const errors = [];

function loadRecipes() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(recipesPath, 'utf8'), context, { filename: recipesPath });
  return context.window.RECIPES || {};
}

function loadHelpers() {
  const appCode = fs.readFileSync(appPath, 'utf8');
  const end = appCode.indexOf('const root = ReactDOM.createRoot');
  if (end === -1) throw new Error('Impossible de trouver la limite de montage React.');

  const context = {
    window: {
      location: { href: 'http://localhost/', pathname: '/', search: '', hash: '', origin: 'http://localhost' },
      setTimeout,
      clearTimeout
    },
    React: {
      createElement() {},
      useEffect() {},
      useMemo() {},
      useRef() {},
      useState() {}
    },
    console
  };

  vm.createContext(context);
  vm.runInContext(fs.readFileSync(appImagesPath, 'utf8'), context, { filename: appImagesPath });
  vm.runInContext(fs.readFileSync(appPremiumPath, 'utf8'), context, { filename: appPremiumPath });
  vm.runInContext(`${appCode.slice(0, end)}
globalThis.__averageWeightHelpers = {
  getRecipeAverageWeights,
  parseShoppingIngredient
};`, context, { filename: appPath });
  return context.__averageWeightHelpers;
}

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasLabel(labels, expected) {
  return labels.some(label => normalize(label) === expected);
}

function isAverageWeightTriggerLine(line) {
  return /\b\d+(?:[.,]\d+)?\s*g\b/.test(line)
    || /^(?:\d+(?:[.,]\d+)?(?:\/\d+)?|une?|quelques|des)\s+(?!min\b|minutes?\b|g\b|kg\b|ml\b|cl\b|l\b|c\.?\b|cuill|pincee\b|trait\b|filet\b)/.test(line);
}

function groupRecipe(recipe, group) {
  return {
    ...recipe,
    averageWeights: [],
    ingredients: [group]
  };
}

function checkIngredientGroup(helpers, recipeId, recipe, group) {
  const lines = (group.items || []).map(item => normalize(item));
  if (!lines.length) return 0;

  const labels = helpers
    .getRecipeAverageWeights(groupRecipe(recipe, group))
    .map(item => item.label);
  const groupName = group.group ? `${recipeId} / ${group.group}` : recipeId;
  const activeLines = lines.filter(isAverageWeightTriggerLine);
  const hasLimeJuice = activeLines.some(line => /\bjus de (?:citron vert|lime)\b/.test(line));
  const hasYellowLemonJuice = activeLines.some(line => /\bjus de citron\b/.test(line) && !/\b(?:citron vert|lime)\b/.test(line));
  const hasLimePiece = activeLines.some(line => /\b(?:citron vert|citrons verts|lime|limes)\b/.test(line) && !/\b(?:jus|zeste)\b/.test(line));
  const hasYellowLemonPiece = activeLines.some(line =>
    /\b(?:citron entier|citron jaune|citrons jaunes|citron bio|citron non traite|citron)\b/.test(line)
    && !/\b(?:jus|zeste|quartiers?|citron vert|lime|confit)\b/.test(line)
  );
  const hasMelonPiece = activeLines.some(line =>
    /\b(?:melon|melons|melon charentais)\b/.test(line)
    && !/\b(?:jus de melon|billes? de melon)\b/.test(line)
  );

  if (hasLimeJuice && !hasLabel(labels, 'jus d un citron vert')) {
    errors.push(`${groupName}: jus de citron vert sans poids moyen citron vert.`);
  }
  if (hasLimeJuice && !hasYellowLemonJuice && hasLabel(labels, 'jus d un citron jaune')) {
    errors.push(`${groupName}: jus de citron vert classe comme jus de citron jaune.`);
  }
  if (hasYellowLemonJuice && !hasLabel(labels, 'jus d un citron jaune')) {
    errors.push(`${groupName}: jus de citron jaune sans poids moyen citron jaune.`);
  }
  if (hasLimePiece && !hasLabel(labels, 'citron vert')) {
    errors.push(`${groupName}: citron vert entier sans poids moyen citron vert.`);
  }
  if (hasYellowLemonPiece && !hasLabel(labels, 'citron jaune')) {
    errors.push(`${groupName}: citron entier sans poids moyen citron jaune.`);
  }
  if (hasMelonPiece && !hasLabel(labels, 'melon moyen')) {
    errors.push(`${groupName}: melon entier sans poids moyen melon.`);
  }

  return Number(hasLimeJuice || hasYellowLemonJuice || hasLimePiece || hasYellowLemonPiece || hasMelonPiece);
}

function checkShoppingParsing(helpers) {
  [
    ['1 citron vert', 'piece:citron vert', 'citron vert'],
    ['1 citron jaune', 'piece:citron', 'citron'],
    ['1 melon bien mûr', 'piece:melon', 'melon'],
    ['20g jus de citron vert', 'g:jus de citron vert', 'jus de citron vert'],
    ['20g jus de citron', 'g:jus de citron', 'jus de citron']
  ].forEach(([line, expectedKey, expectedName]) => {
    const parsed = helpers.parseShoppingIngredient(line);
    if (!parsed) {
      errors.push(`Panier courses: ligne non analysee "${line}".`);
      return;
    }
    if (parsed.key !== expectedKey || parsed.name !== expectedName) {
      errors.push(`Panier courses: "${line}" donne ${parsed.key} / ${parsed.name}, attendu ${expectedKey} / ${expectedName}.`);
    }
  });
}

const recipes = loadRecipes();
const helpers = loadHelpers();
let checkedGroups = 0;

for (const [recipeId, recipe] of Object.entries(recipes)) {
  (recipe.ingredients || []).forEach(group => {
    checkedGroups += checkIngredientGroup(helpers, recipeId, recipe, group);
  });
}

if (checkedGroups < 10) {
  errors.push(`Validation poids moyens: seulement ${checkedGroups} groupes controles, le catalogue semble incomplet.`);
}

checkShoppingParsing(helpers);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validation poids moyens OK (${checkedGroups} groupes critiques controles).`);

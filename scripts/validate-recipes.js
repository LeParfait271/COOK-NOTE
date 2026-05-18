const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const recipesPath = path.join(ROOT, 'recipes.js');
const textFilesToCheck = [
  path.join(ROOT, 'index.html'),
  path.join(ROOT, 'app.js'),
  path.join(ROOT, 'style.css'),
  path.join(ROOT, 'manifest.json'),
  path.join(ROOT, 'service-worker.js')
];
const code = fs.readFileSync(recipesPath, 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(code, context, { filename: recipesPath });

const recipes = context.window.RECIPES;
const errors = [];
const ENCODING_SUSPECT_RE = new RegExp('(?:\\uFFFD|\\u00C3|\\u00C2[\\u00A0-\\u00BF]|\\u00E2\\u20AC|\\u00C5[\\u2018\\u2019\\u201C\\u201D])');
const NON_METRIC_UNIT_RE = /(^|[^0-9A-Za-zÀ-ÖØ-öø-ÿ])(?:cups?|oz|ounces?|tasses?)(?=$|[^0-9A-Za-zÀ-ÖØ-öø-ÿ])/i;

function checkTextEncoding(value, location) {
  if (typeof value === 'string') {
    if (ENCODING_SUSPECT_RE.test(value) || value.includes('?')) {
      errors.push(`${location}: caractere suspect detecte (${value}).`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => checkTextEncoding(item, `${location}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => checkTextEncoding(item, `${location}.${key}`));
  }
}

function collectStrings(value, out = []) {
  if (typeof value === 'string') {
    out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach(item => collectStrings(item, out));
    return out;
  }
  if (value && typeof value === 'object') {
    Object.values(value).forEach(item => collectStrings(item, out));
  }
  return out;
}

function normalizeComparable(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

if (!recipes || typeof recipes !== 'object') {
  errors.push('window.RECIPES est introuvable.');
} else {
  checkTextEncoding(recipes, 'window.RECIPES');

  const ids = new Set(Object.keys(recipes));
  const masterIds = new Set(Object.entries(recipes)
    .filter(([, recipe]) => Array.isArray(recipe.variants) && recipe.variants.length)
    .map(([id]) => id));
  const leafCache = new Map();
  const leafImages = new Map();
  const leafImageHashes = new Map();

  function leafIdsFor(parentId, seen = new Set()) {
    if (leafCache.has(parentId)) return leafCache.get(parentId);
    if (seen.has(parentId)) return new Set();
    seen.add(parentId);
    const recipe = recipes[parentId];
    const variants = Array.isArray(recipe?.variants) ? recipe.variants : [];
    const leaves = new Set();
    if (!variants.length) {
      if (parentId) leaves.add(parentId);
    } else {
      variants.forEach(variant => {
        leafIdsFor(variant?.id, new Set(seen)).forEach(leafId => leaves.add(leafId));
      });
    }
    leafCache.set(parentId, leaves);
    return leaves;
  }

  for (const [id, recipe] of Object.entries(recipes)) {
    const isMaster = masterIds.has(id);
    if (!recipe.title) errors.push(`${id}: titre manquant.`);
    if (!isMaster && (!Array.isArray(recipe.ingredients) || !recipe.ingredients.length)) errors.push(`${id}: ingredients manquants.`);
    if (!isMaster && (!Array.isArray(recipe.steps) || !recipe.steps.length)) errors.push(`${id}: etapes manquantes.`);
    if (!isMaster && (!recipe.yield || !/\d/.test(String(recipe.yield)))) errors.push(`${id}: rendement chiffre manquant.`);

    if (recipe.master && !ids.has(recipe.master)) errors.push(`${id}: fiche parent introuvable (${recipe.master}).`);
    if (!masterIds.has(id) && !recipe.master) errors.push(`${id}: recette sans fiche parent.`);
    if (recipe.master && masterIds.has(recipe.master) && !leafIdsFor(recipe.master).has(id) && !(recipes[recipe.master].variants || []).some(variant => variant?.id === id)) {
      errors.push(`${id}: absent des variantes de sa fiche parent (${recipe.master}).`);
    }
    if (Array.isArray(recipe.additionalMasters)) {
      recipe.additionalMasters.forEach(parentId => {
        if (!ids.has(parentId)) errors.push(`${id}: fiche parent additionnelle introuvable (${parentId}).`);
        else if (!masterIds.has(parentId)) errors.push(`${id}: fiche parent additionnelle non-maitre (${parentId}).`);
        else if (!leafIdsFor(parentId).has(id) && !(recipes[parentId].variants || []).some(variant => variant?.id === id)) errors.push(`${id}: absent des variantes de sa fiche parent additionnelle (${parentId}).`);
      });
    }

    if (Array.isArray(recipe.variants)) {
      const labels = recipe.variants.map(variant => variant?.label || '');
      const variantIds = recipe.variants.map(variant => variant?.id).filter(Boolean);
      const duplicateVariants = variantIds.filter((variantId, index) => variantIds.indexOf(variantId) !== index);
      if (duplicateVariants.length) errors.push(`${id}: variantes dupliquees (${[...new Set(duplicateVariants)].join(', ')}).`);
      const sortedLabels = [...labels].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
      if (labels.join('\n') !== sortedLabels.join('\n')) errors.push(`${id}: variantes non triees alphabetiquement.`);
      recipe.variants.forEach(variant => {
        if (!variant?.id || !ids.has(variant.id)) errors.push(`${id}: variante introuvable (${variant?.id || 'vide'}).`);
        const variantRecipe = recipes[variant?.id];
        if (variantRecipe && variant.label !== variantRecipe.title) errors.push(`${id}: label de variante incoherent (${variant.id}).`);
        const isNestedMaster = variantRecipe && masterIds.has(variant.id);
        const isAdditionalParent = Array.isArray(variantRecipe?.additionalMasters) && variantRecipe.additionalMasters.includes(id);
        if (variant?.id && !variantRecipe?.master && !isNestedMaster && !isAdditionalParent) errors.push(`${id}: variante ${variant.id} sans fiche parent.`);
      });
    }

    const variantishGroups = (recipe.ingredients || [])
      .filter(group => /^(variante|version|option|\d+\))/i.test(String(group.group || '').trim()));
    if (variantishGroups.length >= 2 && !recipe.variantGroups) {
      errors.push(`${id}: groupes de variantes sans variantGroups=true.`);
    }

    (recipe.ingredients || []).forEach((group, groupIndex) => {
      if (group.recipeId && !ids.has(group.recipeId)) errors.push(`${id}: recipeId introuvable dans ingredients[${groupIndex}] (${group.recipeId}).`);
    });

    if (Array.isArray(recipe.tags)) {
      recipe.tags.forEach(tag => {
        if (!tag || /\d/.test(tag)) errors.push(`${id}: tag suspect (${tag}).`);
      });
    }

    if (Array.isArray(recipe.notes)) {
      const seenNotes = new Set();
      recipe.notes.forEach(note => {
        if (/\bsource\b|https?:\/\/|href\s*=/i.test(String(note))) errors.push(`${id}: source externe presente dans les notes.`);
        const key = normalizeComparable(note);
        if (key && seenNotes.has(key)) errors.push(`${id}: note dupliquee (${note}).`);
        seenNotes.add(key);
      });
    }

    collectStrings(recipe).forEach(value => {
      if (NON_METRIC_UNIT_RE.test(value)) {
        errors.push(`${id}: unite non metrique interdite (${value}).`);
      }
    });

    let resolvedImagePath = null;
    if (!recipe.image) {
      errors.push(`${id}: image manquante.`);
    } else if (/\.svg(?:$|\?)/i.test(recipe.image)) {
      errors.push(`${id}: image SVG placeholder interdite (${recipe.image}).`);
    } else if (recipe.image.startsWith('/')) {
      const filePath = path.join(ROOT, recipe.image.replace(/^\/+/, ''));
      if (!fs.existsSync(filePath)) errors.push(`${id}: image locale introuvable (${recipe.image}).`);
      else resolvedImagePath = filePath;
    }

    if (!isMaster && recipe.image) {
      if (!leafImages.has(recipe.image)) leafImages.set(recipe.image, []);
      leafImages.get(recipe.image).push(id);
    }
    if (!isMaster && resolvedImagePath) {
      const imageHash = crypto.createHash('sha1').update(fs.readFileSync(resolvedImagePath)).digest('hex');
      if (!leafImageHashes.has(imageHash)) leafImageHashes.set(imageHash, []);
      leafImageHashes.get(imageHash).push(`${id} (${recipe.image})`);
    }

    const linkableText = collectStrings({
      ingredients: recipe.ingredients || [],
      steps: recipe.steps || [],
      notes: recipe.notes || [],
      technical: recipe.technical || []
    }).join('\n');
    for (const match of linkableText.matchAll(/data-goto=\\?["']([^"']+)\\?["']/g)) {
      if (!ids.has(match[1])) errors.push(`${id}: lien interne data-goto introuvable (${match[1]}).`);
    }
  }

  for (const [image, recipeIds] of leafImages.entries()) {
    if (recipeIds.length > 1) {
      errors.push(`image dupliquee entre recettes (${image}): ${recipeIds.join(', ')}.`);
    }
  }
  for (const [, recipeIds] of leafImageHashes.entries()) {
    if (recipeIds.length > 1) {
      errors.push(`image identique dupliquee entre recettes: ${recipeIds.join(', ')}.`);
    }
  }
}

textFilesToCheck.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  if (ENCODING_SUSPECT_RE.test(text)) {
    errors.push(`${path.relative(ROOT, filePath)}: caractere UTF-8 suspect detecte.`);
  }
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation recettes OK.');

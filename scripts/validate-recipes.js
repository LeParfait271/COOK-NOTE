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

const NON_INGREDIENT_GROUP_RE = /\b(conversion|equivalence|repere|poids moyens?|memo|avant de commencer)\b/i;
const NON_INGREDIENT_ITEM_RE = /\b(equivaut|equivalent|conversion|repere indicatif)\b/i;

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

function asList(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function isStorageNote(value) {
  const text = String(value || '');
  return /\b(conservation|stockage|p[eé]remption|cong[eé]lation|cong[eè]le)\b/i.test(text)
    || (/\br[eé]frig[eé]rateur\b/i.test(text) && /\b(conserve|garde|consomme|stocke|ferm[eé])\b/i.test(text));
}

function checkPepperWording(id, value) {
  if (id === 'sauce_aux_poivres') return;
  const normalized = normalizeComparable(value);
  if (!/\bpoivre\b|\bpoivrer\b/.test(normalized)) return;
  const allowed = /\bpoivre du moulin\b|\bpoivre timut\b|\bpoivre de sichuan\b|\bgrains? de poivre\b/.test(normalized);
  if (/\bpoivrer\b/.test(normalized) || !allowed) {
    errors.push(`${id}: utiliser "poivre du moulin" pour l'assaisonnement (${value}).`);
  }
}

function parseFrenchNumber(value) {
  return Number(String(value).replace(',', '.'));
}

function checkRoundedLargeGramAmounts(id, value) {
  const text = String(value || '');
  for (const match of text.matchAll(/(\d+(?:[.,]\d+)?)(?:\s*(?:[\u2013\u2014-]|à|a)\s*(\d+(?:[.,]\d+)?))?\s*g\b/gi)) {
    [match[1], match[2]].filter(Boolean).forEach(rawAmount => {
      const amount = parseFrenchNumber(rawAmount);
      if (Number.isFinite(amount) && amount > 50 && Math.abs(amount / 5 - Math.round(amount / 5)) > 0.0001) {
        errors.push(`${id}: arrondir les quantites au-dessus de 50g au multiple de 5g le plus proche (${value}).`);
      }
    });
  }
}

function checkVanillaDosage(id, value) {
  const text = String(value || '');
  if (!/\bvanille\b/i.test(text)) return;
  const quantifiedVanilla = /(?:^|[^0-9A-Za-zÀ-ÖØ-öø-ÿ])\d+(?:[.,]\d+)?(?:\/\d+)?\s*(?:g|ml|cl|c\.?\s*à\s*(?:café|soupe)|gousses?)\s*(?:de\s+)?(?:extrait\s+de\s+|ar[oô]me\s+)?vanille\b/i;
  if (quantifiedVanilla.test(text)) {
    errors.push(`${id}: ne pas doser la vanille numeriquement; indiquer de suivre le dosage de la bouteille (${value}).`);
  }
}

function checkBrownSugarWording(id, value) {
  const text = String(value || '');
  if (!/\b(cassonade|vergeoise|sucre roux|sucre cassonade)\b/i.test(text)) return;
  if (!/\bcassonade\b/i.test(text) || !/\bvergeoise\b/i.test(text)) {
    errors.push(`${id}: ecrire "cassonade ou vergeoise" pour les sucres roux (${value}).`);
  }
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

  function expectRecipePlacement(id, options) {
    const recipe = recipes[id];
    if (!recipe) {
      errors.push(`${id}: recette attendue introuvable pour le rangement.`);
      return;
    }
    if (options.master && recipe.master !== options.master) {
      errors.push(`${id}: fiche parent incorrecte (${recipe.master || 'aucune'} au lieu de ${options.master}).`);
    }
    (options.categories || []).forEach(category => {
      if (!(recipe.categories || []).includes(category)) errors.push(`${id}: categorie attendue absente (${category}).`);
    });
    (options.notCategories || []).forEach(category => {
      if ((recipe.categories || []).includes(category)) errors.push(`${id}: categorie interdite presente (${category}).`);
    });
    (options.additionalMasters || []).forEach(parentId => {
      if (!(recipe.additionalMasters || []).includes(parentId)) errors.push(`${id}: fiche parent additionnelle attendue absente (${parentId}).`);
    });
    if (options.variantGroups && !recipe.variantGroups) errors.push(`${id}: doit utiliser variantGroups=true.`);
  }

  function expectParentLink(parentId, childId, expected) {
    const hasLink = (recipes[parentId]?.variants || []).some(variant => variant?.id === childId);
    if (expected && !hasLink) errors.push(`${parentId}: doit contenir ${childId}.`);
    if (!expected && hasLink) errors.push(`${parentId}: ne doit pas contenir ${childId}.`);
  }

  function expectVariantGroupSteps(id, expectedGroups) {
    const recipe = recipes[id];
    if (!recipe) return;
    expectedGroups.forEach(groupName => {
      const group = (recipe.ingredients || []).find(candidate => candidate?.group === groupName);
      if (!group) {
        errors.push(`${id}: groupe de variante attendu introuvable (${groupName}).`);
        return;
      }
      if (!Array.isArray(group.steps) || group.steps.length < 2) {
        errors.push(`${id}: le groupe ${groupName} doit avoir ses propres etapes.`);
      }
    });
  }

  function expectInternalRecipeLink(consumerId, targetId, labels) {
    const consumer = recipes[consumerId];
    const target = recipes[targetId];
    if (!consumer) {
      errors.push(`${consumerId}: recette consommatrice introuvable pour le lien interne vers ${targetId}.`);
      return;
    }
    if (!target) {
      errors.push(`${consumerId}: cible de lien interne introuvable (${targetId}).`);
      return;
    }
    const allText = collectStrings(consumer).join('\n');
    const normalized = normalizeComparable(allText);
    const mentionsTarget = labels.some(label => normalized.includes(normalizeComparable(label)));
    const hasDataGoto = allText.includes(`data-goto="${targetId}"`);
    const hasLinkedRecipe = (consumer.linkedRecipes || []).some(link => link?.id === targetId);
    if (mentionsTarget && !hasDataGoto) {
      errors.push(`${consumerId}: mentionne ${target.title} sans lien data-goto="${targetId}".`);
    }
    if (mentionsTarget && !hasLinkedRecipe) {
      errors.push(`${consumerId}: mentionne ${target.title} sans entree linkedRecipes vers ${targetId}.`);
    }
  }

  expectRecipePlacement('toppings_frites', {
    master: 'accompagnements_maitre',
    categories: ['Accompagnements', 'Sauces'],
    notCategories: ['Plats', 'Apéro', 'Entrées'],
    additionalMasters: ['sauces_maitre'],
    variantGroups: true
  });
  expectParentLink('accompagnements_maitre', 'toppings_frites', true);
  expectParentLink('sauces_maitre', 'toppings_frites', true);
  expectParentLink('plats_maitre', 'toppings_frites', false);
  expectParentLink('apero_maitre', 'toppings_frites', false);
  expectParentLink('entrees_maitre', 'toppings_frites', false);

  expectRecipePlacement('oeufs_mimosa_variantes', {
    master: 'apero_maitre',
    categories: ['Apéro', 'Entrées'],
    additionalMasters: ['entrees_maitre'],
    variantGroups: true
  });

  expectRecipePlacement('legumes_rotis', {
    master: 'accompagnements_maitre',
    categories: ['Accompagnements', 'Entrées'],
    additionalMasters: ['entrees_maitre'],
    variantGroups: true
  });

  expectVariantGroupSteps('tomates_variantes', ['Version séchées', 'Version confites']);

  expectInternalRecipeLink('pain_grille_beurre_ail_herbes', 'beurre_ail', ['beurre à l’ail', 'beurre ail']);

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
    if (recipe.variantGroups) {
      variantishGroups.forEach(group => {
        if (!Array.isArray(group.steps) || group.steps.length < 2) {
          errors.push(`${id}: groupe de variante sans etapes personnalisees (${group.group}).`);
        }
      });
    }

    (recipe.ingredients || []).forEach((group, groupIndex) => {
      if (NON_INGREDIENT_GROUP_RE.test(normalizeComparable(group.group || ''))) {
        errors.push(`${id}: groupe non-ingredient dans les ingredients (${group.group}). Le ranger dans technical, notes ou practical.`);
      }
      if (group.recipeId && !ids.has(group.recipeId)) errors.push(`${id}: recipeId introuvable dans ingredients[${groupIndex}] (${group.recipeId}).`);
      if (group.steps !== undefined) {
        if (!Array.isArray(group.steps) || !group.steps.length) {
          errors.push(`${id}: ingredients[${groupIndex}].steps doit etre une liste non vide.`);
        } else {
          group.steps.forEach((step, stepIndex) => {
            if (typeof step !== 'string' || !step.trim()) errors.push(`${id}: ingredients[${groupIndex}].steps[${stepIndex}] invalide.`);
          });
        }
      }
      (group.items || []).forEach(item => {
        if (NON_INGREDIENT_ITEM_RE.test(normalizeComparable(item))) {
          errors.push(`${id}: ligne non-ingredient dans les ingredients (${item}).`);
        }
        checkRoundedLargeGramAmounts(id, item);
        checkVanillaDosage(id, item);
        checkBrownSugarWording(id, item);
      });
    });

    if (Array.isArray(recipe.linkedRecipes)) {
      recipe.linkedRecipes.forEach((link, linkIndex) => {
        const linkedId = typeof link === 'string' ? link : link?.id;
        if (!linkedId || !ids.has(linkedId)) errors.push(`${id}: linkedRecipes[${linkIndex}] introuvable (${linkedId || 'vide'}).`);
      });
    }

    if (Array.isArray(recipe.tags)) {
      recipe.tags.forEach(tag => {
        if (!tag || /\d/.test(tag)) errors.push(`${id}: tag suspect (${tag}).`);
      });
    }

    if (Array.isArray(recipe.notes)) {
      const seenNotes = new Set();
      const explicitStorageItems = [
        ...asList(recipe.storage),
        ...asList(recipe.practical?.storage)
      ];
      recipe.notes.forEach(note => {
        if (/\bsource\b|https?:\/\/|href\s*=/i.test(String(note))) errors.push(`${id}: source externe presente dans les notes.`);
        if (explicitStorageItems.length && isStorageNote(note)) {
          errors.push(`${id}: note de conservation en double avec practical.storage (${note}).`);
        }
        const key = normalizeComparable(note);
        if (key && seenNotes.has(key)) errors.push(`${id}: note dupliquee (${note}).`);
        seenNotes.add(key);
      });
    }

    collectStrings(recipe).forEach(value => {
      if (/\sstyle\s*=/.test(String(value))) {
        errors.push(`${id}: style HTML inline interdit dans les textes recette (${value}).`);
      }
      if (NON_METRIC_UNIT_RE.test(value)) {
        errors.push(`${id}: unite non metrique interdite (${value}).`);
      }
      checkPepperWording(id, value);
    });

    let resolvedImagePath = null;
    if (!recipe.image) {
      errors.push(`${id}: image manquante.`);
    } else if (/\.svg(?:$|\?)/i.test(recipe.image)) {
      errors.push(`${id}: image SVG placeholder interdite (${recipe.image}).`);
    } else if (/^\/assets\/recipe-images\/.*\.png(?:$|\?)/i.test(recipe.image)) {
      errors.push(`${id}: image recette non optimisee (${recipe.image}). Utiliser assets/recipe-images-optimized/ et garder le PNG original.`);
    } else if (recipe.image.startsWith('/')) {
      const filePath = path.join(ROOT, recipe.image.replace(/^\/+/, ''));
      if (!fs.existsSync(filePath)) errors.push(`${id}: image locale introuvable (${recipe.image}).`);
      else resolvedImagePath = filePath;
      if (/^\/assets\/recipe-images-optimized\/.*\.jpg(?:$|\?)/i.test(recipe.image)) {
        const originalPath = path.join(ROOT, recipe.image
          .replace(/^\/+/, '')
          .replace(/^assets[\\/]recipe-images-optimized[\\/]/, 'assets/recipe-images/')
          .replace(/\.jpg(?:$|\?)/i, '.png'));
        if (!fs.existsSync(originalPath)) errors.push(`${id}: master PNG introuvable pour l'image optimisee (${recipe.image}).`);
      }
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

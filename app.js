/* global React, ReactDOM, QRCode */

const { useEffect, useMemo, useRef, useState } = React;
const h = React.createElement;

const HERO_IMAGE = '/assets/base-principale-fond-site.jpg';
const COOK_NOTE_LOGO = '/assets/cook-note-white.png';

const SEASONS = ['Printemps', 'Été', 'Automne', 'Hiver'];
const DIFFICULTY_LABELS = { easy: 'Facile', medium: 'Intermédiaire', hard: 'Technique' };
const CATEGORY_ACCENTS = {
  'Apéro': '#b51f30',
  'Entrées': '#697c1f',
  'Plats': '#c46311',
  'Accompagnements': '#8b7f1f',
  'Desserts': '#7d5565',
  'Petits-déjeuners': '#b07a16',
  'Sauces': '#b84a16',
  'Base': '#0f8a84'
};
const HOME_CARD_ORDER = {
  petit_dejeuner_maitre: 1,
  apero_maitre: 2,
  entrees_maitre: 3,
  sauces_maitre: 4,
  elements_base_maitre: 5,
  plats_maitre: 6,
  accompagnements_maitre: 7,
  desserts_maitre: 8
};
const CATEGORY_PARENT_IDS = {
  'Apéro': 'apero_maitre',
  'Entrées': 'entrees_maitre',
  'Plats': 'plats_maitre',
  'Accompagnements': 'accompagnements_maitre',
  'Desserts': 'desserts_maitre',
  'Petits-déjeuners': 'petit_dejeuner_maitre',
  'Sauces': 'sauces_maitre',
  'Base': 'elements_base_maitre'
};
const SEASON_CATEGORY_FILTERS = [
  { value: 'Apéro', label: 'Apéro' },
  { value: 'Entrées', label: 'Entrées' },
  { value: 'Plats', label: 'Plats' },
  { value: 'Accompagnements', label: 'Accompagnements' },
  { value: 'Desserts', label: 'Desserts' },
  { value: 'Sauces', label: 'Sauces' },
  { value: 'Base', label: 'Bases' },
  { value: 'Petits-déjeuners', label: 'Petit-déj.' }
];
const SMART_COLLECTIONS = [
  {
    id: 'rapide',
    label: 'Rapide',
    description: 'Peu d’étapes ou préparation courte',
    keywords: ['rapide', '15min', '20min']
  },
  {
    id: 'four',
    label: 'Four',
    description: 'Cuisson au four, gratins et plaques',
    keywords: ['four', 'enfourner', 'gril', 'plaque', 'rôtir', 'rotir', 'gratin']
  },
  {
    id: 'friture',
    label: 'Friture',
    description: 'Beignets, frites, tempura',
    keywords: ['friture', 'frire', 'frites', 'beignet', 'beignets', 'tempura', 'huile à 180', 'huile a 180']
  },
  {
    id: 'bases',
    label: 'Bases',
    description: 'Préparations à réutiliser',
    categories: ['Base'],
    keywords: []
  },
  {
    id: 'sauces',
    label: 'Sauces',
    description: 'Sauces, coulis, pestos et dips',
    categories: ['Sauces'],
    keywords: []
  },
  {
    id: 'avance',
    label: 'À préparer',
    description: 'Repos, stockage ou service différé',
    keywords: ['repos', 'refroidir', 'congélation', 'congelation', 'la veille', '24h']
  }
];
const SHOPPING_AISLES = [
  { label: 'Fruits et légumes', pattern: /\b(tomate|tomates|citron|citrons|pomme|pommes|poire|poires|oignon|oignons|ail|echalote|échalote|persil|basilic|menthe|ciboulette|pomme de terre|pommes de terre|patate douce|avocat|epinard|épinard|carotte|courgette|chou|chou-fleur|melon|fraise|framboise)\b/ },
  { label: 'Crèmerie et œufs', pattern: /\b(lait|creme|crème|beurre|fromage|parmesan|comte|comté|cheddar|mozzarella|mascarpone|ricotta|yaourt|oeuf|oeufs|œuf|œufs|jaune|jaunes|blanc|blancs)\b/ },
  { label: 'Viandes et poissons', pattern: /\b(porc|poulet|boeuf|bœuf|lardon|lardons|poitrine|bacon|jambon|crevette|crevettes|calamar|calamars|poisson|moule|moules|saumon)\b/ },
  { label: 'Épicerie', pattern: /\b(farine|sucre|sel|poivre|huile|vinaigre|moutarde|chocolat|cacao|fécule|fecule|maizena|maïzena|levure|chapelure|riz|pâtes|pates|épice|epice|paprika|curry|miel|sirop)\b/ }
];
const STORAGE_KEYS = {
  favorites: 'cook_note_favorites',
  recents: 'cook_note_recents',
  shopping: 'cook_note_shopping_basket',
  shoppingFactors: 'cook_note_shopping_factors',
  homeScroll: 'cook_note_home_scroll',
  legacyFavorites: ['mc_food_favorites', 'cuisine_favs'],
  legacyRecents: ['mc_food_recents', 'cuisine_recents']
};

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore private browsing restrictions */
  }
}

function readStoredList(key, legacyKeys) {
  const current = readJson(key, null);
  if (Array.isArray(current)) return current;
  for (const legacyKey of legacyKeys) {
    const value = readJson(legacyKey, null);
    if (Array.isArray(value)) return value;
  }
  return [];
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .toLowerCase();
}

function uniq(values) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'fr'));
}

function getCurrentSeason(date = new Date()) {
  const month = Number(new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    month: 'numeric'
  }).format(date));
  if ([3, 4, 5].includes(month)) return 'Printemps';
  if ([6, 7, 8].includes(month)) return 'Été';
  if ([9, 10, 11].includes(month)) return 'Automne';
  return 'Hiver';
}

const SEASONAL_INGREDIENT_RULES = [
  { seasons: ['Printemps'], pattern: /\b(asperge|asperges|petits pois|radis|rhubarbe|fraise|fraises)\b/ },
  { seasons: ['Printemps', 'Été'], pattern: /\b(framboise|framboises|cerise|cerises|abricot|abricots|peche|peches)\b/ },
  { seasons: ['Été'], pattern: /\b(melon|pasteque|concombre|tomate|tomates|courgette|courgettes|aubergine|aubergines|poivron|poivrons|basilic|menthe|myrtille|myrtilles|mure|mures|ananas|kiwi)\b/ },
  { seasons: ['Automne'], pattern: /\b(figue|figues|raisin|raisins|poire|poires|pommes?\b(?! de terre)|coing|coings|noisette|noisettes|noix|chataigne|chataignes|champignon|champignons)\b/ },
  { seasons: ['Automne', 'Hiver'], pattern: /\b(courge|courges|potiron|potimarron|butternut|patate douce|patates douces|poireau|poireaux|celeri|chou fleur|chou-fleur|choux|endive|endives)\b/ },
  { seasons: ['Hiver'], pattern: /\b(citron|citrons|orange|oranges|clementine|clementines|mandarine|mandarines|pamplemousse|pamplemousses)\b/ }
];

function getRecipeSeasonText(recipe) {
  return normalizeText([
    recipe?.title,
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])])
  ].join(' '));
}

function getInferredRecipeSeasons(recipe) {
  const text = getRecipeSeasonText(recipe);
  const seasons = new Set();
  SEASONAL_INGREDIENT_RULES.forEach(rule => {
    if (rule.pattern.test(text)) rule.seasons.forEach(season => seasons.add(season));
  });
  return Array.from(seasons);
}

function getAssignedRecipeSeasons(recipe) {
  return (recipe?.seasons || []).filter(season => season && season !== 'Toutes saisons');
}

function getRecipeSeasonSet(recipe, recipesById = {}) {
  const seasons = new Set(getAssignedRecipeSeasons(recipe));
  getLeafVariantRefs(recipe, recipesById).forEach(ref => {
    const child = recipesById[ref.id];
    if (!child || child.id === recipe?.id) return;
    getAssignedRecipeSeasons(child).forEach(season => seasons.add(season));
  });
  if (!seasons.size && !(recipe?.seasons || []).includes('Toutes saisons')) {
    getInferredRecipeSeasons(recipe).forEach(season => seasons.add(season));
  }
  return seasons;
}

function primaryCategory(recipe) {
  return (recipe.categories || [])[0] || 'Recette';
}

function categoryLabel(category) {
  return SEASON_CATEGORY_FILTERS.find(item => item.value === category)?.label || category || 'Autres';
}

function recipeHasCategory(recipe, category) {
  if (!category) return true;
  return (recipe.categories || []).includes(category);
}

function seasonGroupCategory(recipe) {
  const categories = recipe.categories || [];
  return SEASON_CATEGORY_FILTERS.find(item => categories.includes(item.value))?.value || categories[0] || 'Autres';
}

function collectionLabel(collectionId) {
  return SMART_COLLECTIONS.find(item => item.id === collectionId)?.label || collectionId;
}

function getCollectionText(recipe) {
  return normalizeText([
    recipe?.title,
    recipe?.yield,
    recipe?.difficulty,
    ...(recipe?.categories || []),
    ...(recipe?.seasons || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || []), group.note, ...(group.notes || [])]),
    ...(recipe?.steps || []),
    ...(recipe?.notes || []),
    ...(recipe?.technical || []).flatMap(item => [item.label, item.value, item.text])
  ].join(' '));
}

function recipeMatchesCollection(recipe, collectionId) {
  if (!collectionId) return true;
  const collection = SMART_COLLECTIONS.find(item => item.id === collectionId);
  if (!collection) return true;
  const categories = recipe.categories || [];
  if ((collection.categories || []).some(category => categories.includes(category))) return true;
  const text = getCollectionText(recipe);
  if ((collection.keywords || []).some(keyword => text.includes(normalizeText(keyword)))) return true;
  if (collectionId === 'rapide') {
    const steps = getRecipeSteps(recipe);
    return steps.length > 0 && steps.length <= 4;
  }
  return false;
}

function getCategoryColor(recipe) {
  return CATEGORY_ACCENTS[primaryCategory(recipe)] || '#fbbf24';
}

function homeCardOrder(recipe) {
  return HOME_CARD_ORDER[recipe.id] || 99;
}

function countIngredients(recipe) {
  return (recipe.ingredients || []).reduce((sum, group) => sum + (group.items || []).length, 0);
}

function difficultyText(recipe) {
  return Number.isFinite(recipe?.difficultyScore)
    ? `Difficulté ${recipe.difficultyScore}/10`
    : (DIFFICULTY_LABELS[recipe?.difficulty] || 'Recette');
}

function getNutriScore(recipe) {
  if (recipe?.nutriScore) return String(recipe.nutriScore).toUpperCase();
  const text = normalizeText([
    recipe?.title,
    recipe?.yield,
    ...(recipe?.categories || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])])
  ].join(' '));
  let score = 2;
  if (/\b(salade|crudite|legume|chou fleur|tomate|gazpacho|gaspacho|melon|fruit|soupe|court bouillon)\b/.test(text)) score -= 1;
  if (/\b(friture|frites|beignet|churros|donut|caramel|cookie|cookies|creme au beurre|mayonnaise|rouille|pate sucree)\b/.test(text)) score += 1;
  if (/\b(beurre|creme|fromage|huile|sucre|chocolat|miel|sirop|jambon|lardon|poitrine fumee)\b/.test(text)) score += 1;
  if (/\b(poisson|oeuf|oeufs|yaourt|avocat|mozzarella|pesto)\b/.test(text)) score -= 0.5;
  const index = Math.max(0, Math.min(4, Math.round(score)));
  return ['A', 'B', 'C', 'D', 'E'][index];
}

function getRecipeAllergens(recipe) {
  const explicit = Array.isArray(recipe?.allergens) ? recipe.allergens : [];
  const text = normalizeText([
    recipe?.title,
    recipe?.yield,
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])])
  ].join(' '));
  const allergens = new Set(explicit);
  const addIf = (label, pattern) => {
    if (pattern.test(text)) allergens.add(label);
  };

  addIf('Gluten', /\b(farine|ble|pain|pains|brioche|brioches|bun|buns|pate a choux|pate sucree|pate a tarte|pates a tarte|chapelure|semoule|orge|avoine|epeautre|tortillas?)\b/);
  addIf('Œufs', /\b(oeuf|oeufs|jaune d oeuf|jaunes d oeufs|blanc d oeuf|blancs d oeufs|mimosa)\b/);
  addIf('Lait', /\b(lait entier|lait tiede|lait froid|lait chaud|lait ribot|babeurre|beurre|creme|fromage|parmesan|comte|cheddar|mozzarella|mascarpone|ricotta|yaourt|yogourt)\b/);
  addIf('Fruits à coque', /\b(amande|amandes|noisette|noisettes|pistache|pistaches|noix|pecan|cajou|praline|praline|pralinoise)\b/);
  addIf('Arachides', /\b(arachide|arachides|cacahuete|cacahuetes|beurre de cacahuete)\b/);
  addIf('Soja', /\b(soja|sauce soja|tofu|miso|edamame)\b/);
  addIf('Moutarde', /\b(moutarde|graines de moutarde)\b/);
  addIf('Miel', /\b(miel)\b/);
  addIf('Poisson', /\b(poisson|saumon|thon|cabillaud|anchois|sardine|dorade|bar|bouillabaisse)\b/);
  addIf('Crustacés', /\b(crevette|crevettes|crabe|homard|langoustine|gambas)\b/);
  addIf('Mollusques', /\b(calamar|calamars|moule|moules|palourde|palourdes|poulpe|encornet|encornets)\b/);
  addIf('Sésame', /\b(sesame|tahini|tahin)\b/);
  addIf('Sulfites', /\b(sulfite|sulfites|vin blanc|vin rouge|vinaigre de vin)\b/);
  addIf('Céleri', /\b(celeri|celeri rave|celeri-rave)\b/);
  addIf('Lupin', /\b(lupin|farine de lupin)\b/);

  return uniq(Array.from(allergens));
}

const AVERAGE_WEIGHT_RULES = [
  { label: 'Œuf moyen', value: '≈ 55g', pattern: /\b(oeuf|oeufs|œuf|œufs|oeufs entiers|œufs entiers|oeuf entier|œuf entier)\b/, except: /\b(jaunes?|blancs?) d['’ ]?(oeuf|oeufs)\b/ },
  { label: 'Jaune d’œuf', value: '≈ 18g', pattern: /\bjaunes? d['’ ]?(oeuf|oeufs)\b/ },
  { label: 'Blanc d’œuf', value: '≈ 30g', pattern: /\bblancs? d['’ ]?(oeuf|oeufs)\b/ },
  { label: 'Citron jaune', value: '≈ 100 à 120g', pattern: /\b(citron entier|citron jaune|citrons jaunes)\b/ },
  { label: 'Jus d’un citron', value: '≈ 40 à 50g', pattern: /\bjus de citron\b/ },
  { label: 'Gousse d’ail', value: '≈ 5g', pattern: /\b(gousse d ail|gousses d ail|ail)\b/ },
  { label: 'Oignon moyen', value: '≈ 100 à 120g', pattern: /\b(oignon|oignons)\b/ },
  { label: 'Échalote', value: '≈ 25 à 30g', pattern: /\b(echalote|echalotes)\b/ },
  { label: 'Tomate moyenne', value: '≈ 120g', pattern: /\b(tomate|tomates)\b/ },
  { label: 'Carotte moyenne', value: '≈ 100g', pattern: /\b(carotte|carottes)\b/ },
  { label: 'Pomme de terre moyenne', value: '≈ 150g', pattern: /\b(pomme de terre|pommes de terre)\b/ },
  { label: 'Patate douce moyenne', value: '≈ 250g', pattern: /\b(patate douce|patates douces)\b/ },
  { label: 'Avocat', value: '≈ 150g de chair', pattern: /\b(avocat|avocats)\b/ },
  { label: 'Poivron', value: '≈ 150 à 180g', pattern: /\b(poivron|poivrons)\b/ },
  { label: 'Courgette moyenne', value: '≈ 200g', pattern: /\b(courgette|courgettes)\b/ },
  { label: 'Aubergine moyenne', value: '≈ 300g', pattern: /\b(aubergine|aubergines)\b/ },
  { label: 'Jus d’une orange', value: '≈ 70 à 90g', pattern: /\bjus d['’ ]?orange\b/ },
  { label: 'Orange', value: '≈ 150 à 180g', pattern: /\b(orange|oranges)\b/, except: /\bjus d['’ ]?orange\b/ },
  { label: 'Pomme', value: '≈ 150g', pattern: /\b(pomme|pommes)\b(?!\s+de\s+terre)/ },
  { label: 'Poire', value: '≈ 160g', pattern: /\b(poire|poires)\b/ }
];

const SPOON_WEIGHT_RULES = [
  { label: 'Huile', tablespoon: 14, teaspoon: 5, pattern: /\b(huile|graisse)\b/ },
  { label: 'Eau / bouillon', tablespoon: 15, teaspoon: 5, pattern: /\b(eau|bouillon|jus de viande)\b/ },
  { label: 'Lait / crème', tablespoon: 15, teaspoon: 5, pattern: /\b(lait|creme|yaourt|yogourt)\b/ },
  { label: 'Vinaigre', tablespoon: 15, teaspoon: 5, pattern: /\b(vinaigre)\b/ },
  { label: 'Jus de citron', tablespoon: 15, teaspoon: 5, pattern: /\bjus de citron\b/ },
  { label: 'Miel', tablespoon: 21, teaspoon: 7, pattern: /\b(miel)\b/ },
  { label: 'Moutarde', tablespoon: 15, teaspoon: 5, pattern: /\b(moutarde)\b/ },
  { label: 'Ketchup / sauce', tablespoon: 15, teaspoon: 5, pattern: /\b(ketchup|sauce barbecue|sauce soja|sauce)\b/ },
  { label: 'Concentré de tomate', tablespoon: 16, teaspoon: 5, pattern: /\b(concentre de tomate)\b/ },
  { label: 'Relish', tablespoon: 15, teaspoon: 5, pattern: /\b(relish)\b/ },
  { label: 'Sucre', tablespoon: 12, teaspoon: 4, pattern: /\b(sucre|cassonade|vergeoise)\b/ },
  { label: 'Farine', tablespoon: 8, teaspoon: 3, pattern: /\b(farine|fecule|maizena)\b/ },
  { label: 'Cacao', tablespoon: 8, teaspoon: 3, pattern: /\b(cacao)\b/ },
  { label: 'Levure / bicarbonate', tablespoon: 12, teaspoon: 4, pattern: /\b(levure chimique|bicarbonate)\b/ },
  { label: 'Sel', tablespoon: 18, teaspoon: 6, pattern: /\b(sel|fleur de sel)\b/ },
  { label: 'Poivre', tablespoon: 6, teaspoon: 2, pattern: /\b(poivre)\b/ },
  { label: 'Épices en poudre', tablespoon: 7, teaspoon: 2, pattern: /\b(paprika|piment|cayenne|espelette|cumin|curry|garam masala|tandoori|cannelle|muscade)\b/ },
  { label: 'Ail / oignon en poudre', tablespoon: 9, teaspoon: 3, pattern: /\b(ail en poudre|oignon en poudre)\b/ },
  { label: 'Herbes séchées', tablespoon: 3, teaspoon: 1, pattern: /\b(thym|origan|herbes?|persil sec|basilic sec)\b/ }
];

function formatGramRange(first, second = null) {
  if (second !== null && Number.isFinite(second) && Math.abs(second - first) > 0.01) {
    return `${formatNumber(first)} à ${formatNumber(second)}g`;
  }
  return `${formatNumber(first)}g`;
}

function spoonLabel(kind) {
  return kind === 'tablespoon' ? 'c. à soupe' : 'c. à café';
}

function getSpoonMeasureInfo(line) {
  const text = normalizeText(line);
  const match = text.match(/(\d+(?:[.,]\d+)?(?:\/\d+)?)(?:\s*(?:[\u2013\u2014-]|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?\s*c\.?\s*(?:a\s*)?(soupe|cafe)\b/);
  if (!match) return null;

  const firstAmount = parseAmount(match[1]);
  const secondAmount = match[2] ? parseAmount(match[2]) : null;
  if (!Number.isFinite(firstAmount)) return null;

  const kind = match[3] === 'soupe' ? 'tablespoon' : 'teaspoon';
  const rule = SPOON_WEIGHT_RULES.find(item => item.pattern.test(text)) || {
    label: 'Ingrédient mesuré à la cuillère',
    tablespoon: 15,
    teaspoon: 5
  };
  const unitWeight = rule[kind];
  const firstWeight = firstAmount * unitWeight;
  const secondWeight = Number.isFinite(secondAmount) ? secondAmount * unitWeight : null;
  const amountText = match[2]
    ? `${formatNumber(firstAmount)} à ${formatNumber(secondAmount)} ${spoonLabel(kind)}`
    : `${formatNumber(firstAmount)} ${spoonLabel(kind)}`;

  return {
    label: `${rule.label} (${amountText})`,
    value: `≈ ${formatGramRange(firstWeight, secondWeight)}`
  };
}

function getRecipeAverageWeights(recipe) {
  const explicit = Array.isArray(recipe?.averageWeights) ? recipe.averageWeights : [];
  const found = new Map();
  explicit.forEach(item => {
    const label = item?.label || item?.name;
    const value = item?.value || item?.weight;
    if (label && value) found.set(label, value);
  });
  (recipe?.ingredients || []).forEach(group => {
    (group.items || []).forEach(item => {
      const text = normalizeText(item);
      const spoonInfo = getSpoonMeasureInfo(item);
      if (spoonInfo && !found.has(spoonInfo.label)) found.set(spoonInfo.label, spoonInfo.value);
      if (!/\b\d+(?:[.,]\d+)?\s*g\b/.test(text)) return;
      AVERAGE_WEIGHT_RULES.forEach(rule => {
        if (rule.except?.test(text)) return;
        if (rule.pattern.test(text) && !found.has(rule.label)) found.set(rule.label, rule.value);
      });
    });
  });
  return Array.from(found, ([label, value]) => ({ label, value }));
}

function getRecipeSteps(recipe) {
  return recipe?.steps || [];
}

function getVariantRefs(recipe) {
  return Array.isArray(recipe.variants) ? recipe.variants.filter(variant => variant && variant.id) : [];
}

function getLeafVariantRefs(recipe, recipesById = {}, seen = new Set()) {
  if (!recipe || seen.has(recipe.id)) return [];
  seen.add(recipe.id);
  const variantRefs = getVariantRefs(recipe);
  if (!variantRefs.length) return recipe.id ? [{ id: recipe.id, label: recipe.title }] : [];
  return variantRefs.flatMap(variant => {
    const child = recipesById[variant.id];
    if (!child) return [];
    return getVariantRefs(child).length
      ? getLeafVariantRefs(child, recipesById, seen)
      : [{ id: child.id, label: child.title || variant.label || child.id }];
  });
}

function recipeHasSeason(recipe, season, recipesById = {}) {
  if (!season) return true;
  const seasons = getRecipeSeasonSet(recipe, recipesById);
  return seasons.has(season);
}

function countLeafRecipes(recipe, recipesById = {}) {
  return getLeafVariantRefs(recipe, recipesById).length;
}

function sortVariantRefs(variantRefs, recipesById = {}) {
  return [...variantRefs].sort((a, b) => {
    const left = a.label || recipesById[a.id]?.title || a.id;
    const right = b.label || recipesById[b.id]?.title || b.id;
    return left.localeCompare(right, 'fr', { sensitivity: 'base' });
  });
}

function isMasterRecipe(recipe) {
  return getVariantRefs(recipe).length > 0;
}

function parseAmount(raw) {
  const normalized = raw.replace(',', '.');
  if (normalized.includes('/')) {
    const [left, right] = normalized.split('/');
    const num = Number(left);
    const den = Number(right);
    return den ? num / den : Number.NaN;
  }
  return Number(normalized);
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return '';
  if (Math.abs(value - Math.round(value)) < 0.01) return String(Math.round(value));
  return value.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
}

function prettifyServingUnit(phrase) {
  return String(phrase || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\boeufs\b/g, 'œufs')
    .replace(/\boeuf\b/g, 'œuf')
    .replace(/\bpieces\b/g, 'pièces')
    .replace(/\bpiece\b/g, 'pièce')
    .replace(/\bdecor\b/g, 'décor')
    .replace(/\bparis brests?\b/g, 'Paris-Brest')
    .replace(/^demi\s+/, 'demi-');
}

function singularizeServingUnit(phrase) {
  const words = String(phrase || '').replace(/-/g, ' ').split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const firstWordMap = {
    petits: 'petit',
    petites: 'petite',
    grands: 'grand',
    grandes: 'grande',
    gros: 'gros',
    grosses: 'grosse'
  };
  words[0] = firstWordMap[words[0]] || words[0];
  const lastIndex = words.length - 1;
  const lastWordMap = {
    oeufs: 'oeuf',
    œufs: 'œuf',
    choux: 'chou'
  };
  words[lastIndex] = lastWordMap[words[lastIndex]] || words[lastIndex].replace(/s$/i, '');
  return prettifyServingUnit(words.join(' '));
}

function pluralizeServingUnit(phrase) {
  const words = String(phrase || '').replace(/-/g, ' ').split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const firstWordMap = {
    petit: 'petits',
    petite: 'petites',
    grand: 'grands',
    grande: 'grandes',
    grosse: 'grosses'
  };
  words[0] = firstWordMap[words[0]] || words[0];
  const lastIndex = words.length - 1;
  if (!/[sx]$/i.test(words[lastIndex])) words[lastIndex] = `${words[lastIndex]}s`;
  return prettifyServingUnit(words.join(' '));
}

function getServingInfo(recipe) {
  const yieldText = String(recipe?.yield || '');
  const normalized = normalizeText(yieldText);
  const match = normalized.match(/(\d+(?:[.,]\d+)?(?:\/\d+)?)(?:\s*(?:[\u2013\u2014-]|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?\s*(personnes?|portions?|parts?)\b/);
  if (match) {
    const base = parseAmount(match[1]);
    const max = match[2] ? parseAmount(match[2]) : null;
    if (!Number.isFinite(base) || base <= 0) return null;
    const unit = match[3].startsWith('personne')
      ? 'personne'
      : match[3].startsWith('part')
        ? 'part'
        : 'portion';
    return {
      base,
      max: Number.isFinite(max) && max > base ? max : null,
      unit
    };
  }

  const genericMatch = normalized.match(/(\d+(?:[.,]\d+)?(?:\/\d+)?)(?:\s*(?:[\u2013\u2014-]|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?\s+((?:(?:petits?|petites?|grands?|grandes?|gros|grosses)\s+)?[a-zœ]+(?:-[a-zœ]+)?)\b/);
  if (!genericMatch) return null;
  const base = parseAmount(genericMatch[1]);
  const max = genericMatch[2] ? parseAmount(genericMatch[2]) : null;
  if (!Number.isFinite(base) || base <= 0) return null;
  const unitPhrase = genericMatch[3].replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
  const lastWord = unitPhrase.split(/\s+/).pop();
  const blockedUnits = new Set(['g', 'kg', 'mg', 'ml', 'cl', 'l', 'litre', 'litres', 'cm', 'mm', 'degre', 'degres', 'minute', 'minutes', 'min', 'heure', 'heures']);
  if (blockedUnits.has(unitPhrase) || blockedUnits.has(lastWord)) return null;
  return {
    base,
    max: Number.isFinite(max) && max > base ? max : null,
    unit: 'custom',
    singular: singularizeServingUnit(unitPhrase),
    plural: pluralizeServingUnit(unitPhrase)
  };
}

function servingUnitLabel(infoOrUnit, count) {
  const info = typeof infoOrUnit === 'string' ? { unit: infoOrUnit } : (infoOrUnit || {});
  if (info.unit === 'personne') return count > 1 ? 'personnes' : 'personne';
  if (info.unit === 'part') return count > 1 ? 'parts' : 'part';
  if (info.singular && info.plural) return count > 1 ? info.plural : info.singular;
  return count > 1 ? 'portions' : 'portion';
}

function getServingTarget(recipe, factor = 1) {
  const info = getServingInfo(recipe);
  if (!info) return null;
  return Math.max(1, Math.round(info.base * factor));
}

function getServingTargetRange(recipe, factor = 1) {
  const info = getServingInfo(recipe);
  if (!info) return null;
  const first = Math.max(1, Math.round(info.base * factor));
  const second = info.max ? Math.max(first, Math.round(info.max * factor)) : null;
  return { first, second, info };
}

function formatServingTarget(recipe, factor = 1) {
  const range = getServingTargetRange(recipe, factor);
  if (!range) return '';
  const unitCount = range.second || range.first;
  const label = servingUnitLabel(range.info, unitCount);
  if (range.second && range.second !== range.first) {
    return `${formatNumber(range.first)} à ${formatNumber(range.second)} ${label}`;
  }
  return `${formatNumber(range.first)} ${label}`;
}

function getQuantityDisplay(recipe, factor = 1) {
  const info = getServingInfo(recipe);
  if (!info) return scaleYieldDisplay(recipe?.yield, factor);
  return `Pour ${formatServingTarget(recipe, factor)}`;
}

function getQuantitySummary(recipe, factor = 1) {
  const info = getServingInfo(recipe);
  if (info) {
    return `pour ${formatServingTarget(recipe, factor)}`;
  }
  const scaledYield = scaleYieldDisplay(recipe?.yield, factor);
  return factor === 1 || !scaledYield ? '' : `pour ${scaledYield}`;
}

function servingOptionsFor(recipe) {
  const info = getServingInfo(recipe);
  if (!info) return [];
  const base = Math.round(info.base);
  const max = Math.max(24, base * 2);
  return uniq([1, 2, 3, 4, 5, 6, 8, 10, 12, base, base * 2]
    .filter(value => Number.isFinite(value) && value >= 1 && value <= max)
    .map(String))
    .map(Number)
    .sort((a, b) => a - b);
}

function scaleParentheticalAmounts(text, factor) {
  return String(text || '').replace(/\(([^)]*)\)/g, (full, content) => {
    const hasScalableHint = /(?:≈|env\.?|environ|oeufs?|œufs?|jaunes?|blancs?|pi[eè]ces?|portions?|cl|ml|g|kg)/i.test(content);
    if (!hasScalableHint || !/\d/.test(content)) return full;
    const scaled = content.replace(/(\d+(?:[.,]\d+)?(?:\/\d+)?)(\s*(?:[\u2013\u2014-]|à|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?/gi, (match, firstRaw, rangeSep, secondRaw) => {
      const first = parseAmount(firstRaw);
      const second = secondRaw ? parseAmount(secondRaw) : null;
      if (!Number.isFinite(first)) return match;
      if (second !== null && Number.isFinite(second)) {
        const separator = rangeSep.slice(0, rangeSep.length - secondRaw.length);
        return `${formatNumber(first * factor)}${separator}${formatNumber(second * factor)}`;
      }
      return formatNumber(first * factor);
    });
    return `(${scaled})`;
  });
}

function scaleIngredient(text, factor) {
  if (factor === 1) return text;
  const parts = splitShoppingIngredientParts(text);
  if (parts.length > 1) return parts.map(part => scaleIngredient(part, factor)).join(', ');
  const match = String(text).match(/^(\d+(?:[.,]\d+)?(?:\/\d+)?)(\s*(?:[\u2013\u2014-]|à|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?(.*)$/i);
  if (!match) return text;
  const first = parseAmount(match[1]);
  const second = match[3] ? parseAmount(match[3]) : null;
  if (!Number.isFinite(first)) return text;
  const rest = scaleParentheticalAmounts(match[4], factor);
  if (second !== null && Number.isFinite(second)) {
    const separator = match[2].slice(0, match[2].length - match[3].length);
    return `${formatNumber(first * factor)}${separator}${formatNumber(second * factor)}${rest}`;
  }
  return `${formatNumber(first * factor)}${rest}`;
}

function scaleYield(text, factor) {
  const value = String(text || '');
  if (factor === 1 || !value) return value;
  let scaledCount = 0;
  return value.replace(/(\d+(?:[.,]\d+)?(?:\/\d+)?)(\s*(?:[–-]|à|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?/gi, (match, firstRaw, rangeSep, secondRaw, offset, fullText) => {
    const after = fullText.slice(offset + match.length).trimStart().toLowerCase();
    const isDetailAmount = scaledCount > 0 && /^(?:g|kg|mg|ml|cl|cm|mm)\b/.test(after);
    if (isDetailAmount) return match;
    const first = parseAmount(firstRaw);
    const second = secondRaw ? parseAmount(secondRaw) : null;
    if (!Number.isFinite(first)) return match;
    scaledCount += 1;
    if (second !== null && Number.isFinite(second)) {
      return `${formatNumber(first * factor)}${rangeSep}${formatNumber(second * factor)}`;
    }
    return formatNumber(first * factor);
  });
}

function scaleYieldDisplay(text, factor) {
  const value = String(text || '');
  if (factor === 1 || !value) return value;
  const amountPattern = String.raw`\d+(?:[.,]\d+)?(?:\/\d+)?`;
  const rangeSeparatorPattern = String.raw`\s*(?:[\u2013\u2014-]|\u00e0|a)\s*`;
  const quantityPattern = new RegExp(String.raw`(^|[^0-9A-Za-z\u00c0-\u017f])(${amountPattern})(${rangeSeparatorPattern}(${amountPattern}))?`, 'gi');
  const detailUnitPattern = /^\s*(?:g|kg|mg|ml|cl|l|litres?|cm|mm)\b/i;
  let scaledCount = 0;
  const scaled = value.replace(quantityPattern, (match, prefix, firstRaw, rangeFull, secondRaw, offset, fullText) => {
    const after = fullText.slice(offset + match.length).trimStart().toLowerCase();
    if (scaledCount > 0 && detailUnitPattern.test(after)) return match;
    const first = parseAmount(firstRaw);
    const second = secondRaw ? parseAmount(secondRaw) : null;
    if (!Number.isFinite(first)) return match;
    scaledCount += 1;
    if (second !== null && Number.isFinite(second)) {
      const separator = rangeFull.slice(0, rangeFull.length - secondRaw.length);
      return `${prefix}${formatNumber(first * factor)}${separator}${formatNumber(second * factor)}`;
    }
    return `${prefix}${formatNumber(first * factor)}`;
  });
  return scaled
    .replace(/\b([2-9]|\d{2,}) cake\b/gi, '$1 cakes')
    .replace(/\b([2-9]|\d{2,}) litre\b/gi, '$1 litres');
}

function recipeShoppingLines(recipe, factor = 1) {
  return (recipe.ingredients || []).flatMap(group => [
    group.group ? `# ${group.group}` : '# Base',
    ...(group.items || []).map(item => `- ${scaleIngredient(item, factor)}`)
  ]);
}

function splitShoppingIngredientParts(line) {
  const value = String(line || '').trim();
  if (!/,(\s*\d+(?:[.,]\d+)?(?:\/\d+)?\s*(?:g|kg|ml|cl|l)\b)/i.test(value)) return [value];
  return value.split(/,\s+(?=\d+(?:[.,]\d+)?(?:\/\d+)?\s*(?:g|kg|ml|cl|l)\b)/i)
    .map(part => part.trim())
    .filter(Boolean);
}

function normalizeShoppingName(value) {
  return normalizeText(value)
    .replace(/^(?:de |d'|du |des |la |le |les |l')/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseShoppingIngredient(line) {
  const cleaned = String(line || '').replace(/^[-•]\s*/, '').trim();
  const match = cleaned.match(/^(\d+(?:[.,]\d+)?(?:\/\d+)?)(\s*(?:[\u2013\u2014-]|à|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?\s*(g|kg|ml|cl|l)\s+(.*)$/i);
  if (!match) return null;
  const first = parseAmount(match[1]);
  const second = match[3] ? parseAmount(match[3]) : null;
  if (!Number.isFinite(first)) return null;
  const unit = match[4].toLowerCase();
  const multiplier = unit === 'kg' || unit === 'l' ? 1000 : unit === 'cl' ? 10 : 1;
  const baseUnit = unit === 'kg' ? 'g' : unit === 'l' || unit === 'cl' ? 'ml' : unit;
  const name = match[5].trim();
  return {
    key: `${baseUnit}:${normalizeShoppingName(name)}`,
    name,
    unit: baseUnit,
    first: first * multiplier,
    second: Number.isFinite(second) ? second * multiplier : null
  };
}

function formatShoppingAmount(item) {
  if (!item.unit) return '';
  if (item.second !== null) return `${formatNumber(item.first)} à ${formatNumber(item.second)} ${item.unit}`;
  return `${formatNumber(item.first)} ${item.unit}`;
}

function shoppingAisle(name) {
  const text = normalizeText(name);
  const aisle = SHOPPING_AISLES.find(item => item.pattern.test(text));
  return aisle?.label || 'Autres';
}

function buildShoppingListData(recipes, factorById = {}) {
  const grouped = new Map();
  const blocks = recipes.map(recipe => {
    const factor = factorById[recipe.id] || 1;
    const quantitySummary = getQuantitySummary(recipe, factor);
    const factorLabel = quantitySummary ? ` (${quantitySummary})` : '';
    (recipe.ingredients || []).forEach(group => {
      (group.items || []).forEach(item => {
        const scaled = scaleIngredient(item, factor);
        splitShoppingIngredientParts(scaled).forEach(part => {
          const parsed = parseShoppingIngredient(part);
          const item = parsed || {
            key: `other:${normalizeShoppingName(part)}`,
            name: part.replace(/^[-•]\s*/, '').trim(),
            unit: '',
            first: 0,
            second: null
          };
          if (!item.name) return;
          item.aisle = shoppingAisle(item.name);
          const existing = grouped.get(item.key);
          if (existing) {
            const existingFirst = existing.first;
            const existingSecond = existing.second;
            existing.first += item.first;
            existing.second = existingSecond !== null || item.second !== null
              ? (existingSecond || existingFirst) + (item.second || item.first)
              : null;
            existing.recipes.add(recipe.title);
          } else {
            grouped.set(item.key, { ...item, recipes: new Set([recipe.title]) });
          }
        });
      });
    });
    return [`## ${recipe.title}${factorLabel}`, ...recipeShoppingLines(recipe, factor)].join('\n');
  });

  const groupedItems = [...grouped.values()]
    .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }))
    .map(item => ({ ...item, recipeNames: [...item.recipes].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' })) }));

  const aisleGroups = SHOPPING_AISLES.map(aisle => ({
    label: aisle.label,
    items: groupedItems.filter(item => item.aisle === aisle.label)
  })).filter(group => group.items.length);
  const otherItems = groupedItems.filter(item => !SHOPPING_AISLES.some(aisle => aisle.label === item.aisle));
  if (otherItems.length) aisleGroups.push({ label: 'Autres', items: otherItems });
  return { blocks, groupedItems, aisleGroups };
}

function shoppingListText(recipes, factorById = {}) {
  const data = buildShoppingListData(recipes, factorById);
  const groupedLines = data.groupedItems
    .map(item => {
      const amount = formatShoppingAmount(item);
      return `- ${[amount, item.name].filter(Boolean).join(' ')} (${item.recipeNames.join(', ')})`;
    });
  return [
    'Liste de courses Cook Note',
    '',
    groupedLines.length ? '## Ingrédients regroupés' : '',
    ...groupedLines,
    '',
    '## Détail par recette',
    ...data.blocks
  ].filter((line, index, lines) => line || lines[index - 1]).join('\n\n');
}

function getStepMinutes(step) {
  const text = normalizeText(step);
  const hourMatch = text.match(/(\d+(?:[.,]\d+)?)\s*h/);
  if (hourMatch) return Math.round(parseAmount(hourMatch[1]) * 60);
  const minuteMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:min|minute)/);
  if (minuteMatch) return Math.round(parseAmount(minuteMatch[1]));
  return 0;
}

function formatRemaining(ms) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

function getRecipeSearchText(recipe, tags, recipesById = {}) {
  const ingredients = (recipe.ingredients || [])
    .flatMap(group => [group.group, ...(group.items || [])])
    .join(' ');
  const practicalText = getRecipePracticalSections(recipe)
    .flatMap(section => [section.title, ...section.items])
    .join(' ');
  const linkedText = getLinkedRecipeRefs(recipe, recipesById)
    .flatMap(item => [item.role, item.recipe.title, ...(item.recipe.tags || [])])
    .join(' ');
  const facets = getRecipeSearchFacets(recipe).join(' ');
  const variantsText = (recipe.variants || [])
    .map(variant => recipesById[variant.id])
    .filter(Boolean)
    .map(variantRecipe => getRecipeSearchText(variantRecipe, variantRecipe.tags || [], recipesById))
    .join(' ');
  return normalizeText([
    recipe.title,
    recipe.yield,
    recipe.difficulty,
    ...(recipe.aliases || []),
    ...(recipe.categories || []),
    ...(recipe.seasons || []),
    ...tags,
    ...(recipe.variants || []).flatMap(variant => [variant.id, variant.label]),
    ingredients,
    facets,
    practicalText,
    linkedText,
    ...(recipe.steps || []),
    ...(recipe.notes || []),
    variantsText
  ].join(' '));
}

const SEARCH_SYNONYMS = {
  mayo: ['mayonnaise'],
  mayonaise: ['mayonnaise'],
  sauce: ['dip', 'assaisonnement', 'condiment'],
  sauces: ['dip', 'assaisonnement', 'condiment'],
  gateau: ['cake', 'dessert'],
  gâteau: ['cake', 'dessert'],
  patate: ['pomme de terre', 'pommes de terre'],
  fritte: ['frite', 'frites'],
  frite: ['frites', 'pomme de terre'],
  accompagnement: ['accompagnements', 'garniture'],
  garniture: ['accompagnement', 'topping'],
  crevette: ['crevettes', 'gambas'],
  calamar: ['calamars', 'encornet'],
  oeuf: ['œuf', 'oeufs', 'œufs'],
  oeufs: ['œufs', 'oeuf', 'œuf'],
  pate: ['pâte', 'base'],
  base: ['bases', 'pâte'],
  citronne: ['citron'],
  citronné: ['citron'],
  facile: ['easy', 'simple', 'débutant'],
  simple: ['easy', 'facile'],
  moyen: ['medium', 'intermédiaire'],
  difficile: ['hard', 'technique'],
  ete: ['été'],
  apero: ['apéro']
};

function expandSearchTokens(tokens) {
  return tokens.map(token => [token, ...(SEARCH_SYNONYMS[token] || []).map(normalizeText)]);
}

function isCloseSearchToken(token, text) {
  if (token.length < 4) return false;
  const words = text.match(/[a-z0-9]{4,}/g) || [];
  return words.some(word => {
    if (word.includes(token) || token.includes(word)) return true;
    if (word.length === token.length) {
      for (let index = 0; index < token.length - 1; index += 1) {
        if (
          token[index] === word[index + 1] &&
          token[index + 1] === word[index] &&
          token.slice(0, index) === word.slice(0, index) &&
          token.slice(index + 2) === word.slice(index + 2)
        ) return true;
      }
    }
    if (Math.abs(word.length - token.length) > 1) return false;
    let edits = 0;
    for (let index = 0; index < Math.min(word.length, token.length); index += 1) {
      if (word[index] !== token[index]) edits += 1;
      if (edits > 1) return false;
    }
    return edits + Math.abs(word.length - token.length) <= 1;
  });
}

function scoreRecipeSearch(recipe, query, recipesById = {}) {
  const needle = normalizeText(query).trim();
  if (!needle) return { score: 0, reasons: [] };
  const tokenGroups = expandSearchTokens(needle.split(/\s+/).filter(token => token.length > 1));
  const title = normalizeText(recipe.title);
  const aliases = normalizeText((recipe.aliases || []).join(' '));
  const tags = normalizeText([...(recipe.tags || []), ...(recipe.tagsExtracted || [])].join(' '));
  const categories = normalizeText((recipe.categories || []).join(' '));
  const ingredients = normalizeText((recipe.ingredients || []).flatMap(group => [group.group, ...(group.items || [])]).join(' '));
  const practical = normalizeText(getRecipePracticalSections(recipe).flatMap(section => [section.title, ...section.items]).join(' '));
  const facets = normalizeText(getRecipeSearchFacets(recipe).join(' '));
  const linked = normalizeText(getLinkedRecipeRefs(recipe, recipesById).flatMap(item => [item.role, item.recipe.title]).join(' '));
  const notes = normalizeText([...(recipe.notes || []), ...(recipe.technical || []).flatMap(item => [item.label, item.value, item.text])].join(' '));
  const fields = [
    { name: 'titre', text: title, points: 120 },
    { name: 'alias', text: aliases, points: 90 },
    { name: 'tag', text: tags, points: 70 },
    { name: 'usage', text: facets, points: 62 },
    { name: 'catégorie', text: categories, points: 55 },
    { name: 'ingrédient', text: ingredients, points: 45 },
    { name: 'recette liée', text: linked, points: 34 },
    { name: 'pratique', text: practical, points: 28 },
    { name: 'note', text: notes, points: 18 }
  ];
  let score = 0;
  const reasons = new Set();
  const allMatched = tokenGroups.every(group => fields.some(field => group.some(token => field.text.includes(token) || isCloseSearchToken(token, field.text))));
  if (!allMatched) return { score: 0, reasons: [] };
  if (title === needle) score += 220;
  if (title.startsWith(needle)) score += 150;
  fields.forEach(field => {
    tokenGroups.forEach(group => {
      if (group.some(token => field.text.includes(token))) {
        score += field.points;
        reasons.add(field.name);
      } else if (group.some(token => isCloseSearchToken(token, field.text))) {
        score += Math.round(field.points * 0.45);
        reasons.add(`${field.name} proche`);
      }
    });
  });
  return { score, reasons: Array.from(reasons).slice(0, 3) };
}

function extractTags(recipe) {
  const tags = new Set((recipe.tags || []).map(tag => normalizeText(tag)).filter(Boolean));
  const blocked = new Set([
    'avec', 'sans', 'pour', 'dans', 'base', 'sel', 'poivre', 'repos', 'entier', 'entiere',
    'fondu', 'fondue', 'chimique', 'minutes', 'minute', 'grammes', 'gramme', 'cuisson',
    'froid', 'froide', 'chaud', 'chaude', 'recette', 'preparation'
  ]);
  (recipe.ingredients || []).forEach(group => {
    (group.items || []).forEach(item => {
      normalizeText(item).split(/\s+/).forEach(word => {
        const clean = word.replace(/[^a-z0-9]/g, '');
        if (clean.length > 3 && !/\d/.test(clean) && !blocked.has(clean)) {
          tags.add(clean);
        }
      });
    });
  });
  return Array.from(tags).slice(0, 18);
}

function isVariantIngredientGroup(group, groups = [], recipe = null) {
  const label = normalizeText(group?.group || '');
  if (label.includes('base commune') || label === 'base' || label.includes('commun')) return false;
  if (/^\d+\)/.test(label)) return true;
  if (label.startsWith('variante') || label.startsWith('version') || label.startsWith('option')) return true;
  if (recipe?.variantGroups) return true;
  return false;
}

function buildInlineRecipeTargets(recipes) {
  const aliases = [];
  const add = (term, id) => {
    const normalized = normalizeText(term).trim();
    if (normalized.length >= 4 && id) aliases.push({ term, normalized, id });
  };
  recipes.forEach(recipe => {
    if (isMasterRecipe(recipe)) return;
    add(recipe.title, recipe.id);
    (recipe.aliases || []).forEach(alias => add(alias, recipe.id));
  });
  return aliases.sort((a, b) => b.normalized.length - a.normalized.length);
}

function renderLinkedText(text, targets, openRecipe) {
  const value = String(text || '');
  const explicitLinkPattern = /<span\s+data-goto=(["'])([^"']+)\1[^>]*>(.*?)<\/span>/i;
  const explicitMatch = value.match(explicitLinkPattern);
  if (explicitMatch) {
    const [full, , id, label] = explicitMatch;
    const index = value.indexOf(full);
    return h(React.Fragment, null,
      renderLinkedText(value.slice(0, index), targets, openRecipe),
      h('button', { type: 'button', className: 'inline-recipe-link', onClick: () => openRecipe(id) }, label.replace(/<[^>]+>/g, '')),
      renderLinkedText(value.slice(index + full.length), targets, openRecipe)
    );
  }
  const normalized = normalizeText(value);
  const target = targets.find(item => normalized.includes(item.normalized));
  if (!target) return value;
  const index = normalized.indexOf(target.normalized);
  const label = value.slice(index, index + target.term.length) || target.term;
  return h(React.Fragment, null,
    value.slice(0, index),
    h('button', { type: 'button', className: 'inline-recipe-link', onClick: () => openRecipe(target.id) }, label),
    value.slice(index + label.length)
  );
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<span\s+data-goto=(["'])([^"']+)\1[^>]*>(.*?)<\/span>/gi, '$3')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function asTextList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(item => stripHtml(item)).filter(Boolean);
  return [stripHtml(value)].filter(Boolean);
}

function compactPracticalItems(key, items) {
  if (key !== 'storage') return items;
  const hasSpecificStorage = items.some(item => /^(?:conservation|stockage optimal)\b/i.test(stripHtml(item)));
  if (!hasSpecificStorage) return items;
  return items.filter(item => {
    const text = stripHtml(item);
    return !(/^stockage\s*:/i.test(text) && /\bp[eé]remption\b/i.test(text));
  });
}

function inferEquipment(recipe) {
  const text = normalizeText([
    recipe?.title,
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])]),
    ...(recipe?.steps || []),
    ...(recipe?.notes || [])
  ].join(' '));
  const items = [];
  if (/\b(friture|frire|huile a 180|180c|180 c|bain d huile|tempura|beignet)\b/.test(text)) {
    items.push('Casserole ou sauteuse haute', 'Thermomètre de cuisson', 'Grille d’égouttage');
  }
  if (/\b(four|enfourner|gril|plaque)\b/.test(text)) items.push('Four', 'Plaque ou plat de cuisson');
  if (/\b(mixer|mixeur|blender)\b/.test(text)) items.push('Mixeur ou blender');
  if (/\b(mortier|piler)\b/.test(text)) items.push('Mortier');
  if (/\b(fouetter|fouet|emulsion|monter avec l huile)\b/.test(text)) items.push('Fouet');
  if (/\b(poche|pocher|douille)\b/.test(text)) items.push('Poche à douille');
  return uniq(items).slice(0, 4);
}

function getRecipePracticalSections(recipe) {
  const practical = recipe?.practical || {};
  const notes = (recipe?.notes || []).map(stripHtml);
  const technical = recipe?.technical || [];
  const sections = [];
  const add = (key, title, items) => {
    const cleanItems = compactPracticalItems(key, uniq((items || []).map(stripHtml).filter(Boolean)));
    if (cleanItems.length) sections.push({ key, title, items: cleanItems.slice(0, 4) });
  };

  const storageNotes = notes.filter(note => /\b(conservation|stockage|p[eé]remption|cong[eé]lation|cong[eè]le|au froid|r[eé]frig[eé]rateur)\b/i.test(note));
  const reheatingNotes = notes.filter(note => /\b(r[eé]chauff|remettre au four|four doux|vapeur)\b/i.test(note));
  const mistakeNotes = notes.filter(note => /\b(ne\s|[ée]vite|attention|trop cuit|trop cuits|surcharge|surveille|sans trop)\b/i.test(note));
  const resultTechnical = technical
    .filter(item => /\b(texture|cible|r[eé]sultat|cuisson|service)\b/i.test(String(item.label || item.title || '')))
    .map(item => item.value || item.text);

  add('equipment', 'Matériel utile', [
    ...asTextList(recipe?.equipment || practical.equipment),
    ...inferEquipment(recipe)
  ]);
  add('storage', 'Conservation', [
    ...asTextList(recipe?.storage || practical.storage),
    ...storageNotes
  ]);
  add('reheating', 'Réchauffage', [
    ...asTextList(recipe?.reheating || practical.reheating),
    ...reheatingNotes
  ]);
  add('mistakes', 'Erreurs à éviter', [
    ...asTextList(recipe?.mistakes || practical.mistakes),
    ...mistakeNotes
  ]);
  add('result', 'Résultat attendu', [
    ...asTextList(recipe?.result || practical.result),
    ...resultTechnical
  ]);

  return sections;
}

function noteKey(value) {
  return normalizeText(stripHtml(value)).replace(/[^a-z0-9]+/g, ' ').trim();
}

function getDisplayNotes(recipe, practicalSections = []) {
  const practicalKeys = new Set(
    practicalSections
      .flatMap(section => section.items || [])
      .map(noteKey)
      .filter(Boolean)
  );
  const seen = new Set();
  return (recipe?.notes || []).filter(note => {
    const key = noteKey(note);
    if (!key || practicalKeys.has(key) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractRecipeLinkIds(recipe) {
  const text = [
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || []), group.note, ...(group.notes || [])]),
    ...(recipe?.steps || []),
    ...(recipe?.notes || []),
    ...(recipe?.technical || []).flatMap(item => [item.label, item.value, item.text])
  ].join('\n');
  const ids = [];
  for (const match of text.matchAll(/data-goto=\\?["']([^"']+)\\?["']/g)) ids.push(match[1]);
  return ids;
}

function getLinkedRecipeRefs(recipe, recipesById = {}) {
  const refs = [];
  const explicit = Array.isArray(recipe?.linkedRecipes) ? recipe.linkedRecipes : [];
  explicit.forEach(item => {
    if (typeof item === 'string') refs.push({ id: item });
    else if (item?.id) refs.push({ id: item.id, role: item.role || item.label || '' });
  });
  extractRecipeLinkIds(recipe).forEach(id => refs.push({ id }));

  const seen = new Set();
  return refs
    .filter(ref => {
      if (!ref.id || ref.id === recipe?.id || seen.has(ref.id) || !recipesById[ref.id]) return false;
      seen.add(ref.id);
      return true;
    })
    .map(ref => {
      const linked = recipesById[ref.id];
      const category = primaryCategory(linked);
      return {
        id: ref.id,
        role: ref.role || (category === 'Base' ? 'Base' : category === 'Sauces' ? 'Sauce' : 'Recette liée'),
        recipe: linked
      };
    });
}

function getRecipeSearchFacets(recipe) {
  const difficulty = normalizeText(recipe?.difficulty || '');
  const labels = [
    ...(recipe?.categories || []),
    ...(recipe?.seasons || []),
    primaryCategory(recipe)
  ];
  if (difficulty === 'easy') labels.push('facile', 'simple', 'débutant');
  if (difficulty === 'medium') labels.push('moyen', 'intermédiaire', 'technique');
  if (difficulty === 'hard') labels.push('difficile', 'avancé', 'technique');
  if (isMasterRecipe(recipe)) labels.push('collection', 'catégorie', 'choisir une recette');
  if ((recipe?.tags || []).some(tag => /friture|beignet|tempura/i.test(tag))) labels.push('friture', 'croustillant');
  return uniq(labels.map(stripHtml).filter(Boolean));
}

function truncateText(value, max = 156) {
  const text = stripHtml(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function recipeDescription(recipe, recipesById = {}) {
  if (!recipe?.title) return 'Cook Note : carnet de recettes avec ingrédients, quantités ajustables, étapes et notes pratiques.';
  const category = primaryCategory(recipe).toLowerCase();
  const yieldText = recipe.yield ? ` pour ${recipe.yield}` : '';
  const ingredientNames = (recipe.ingredients || [])
    .flatMap(group => group.items || [])
    .map(item => stripHtml(item).replace(/^\d+(?:[.,]\d+)?(?:\s*(?:g|kg|ml|cl|l))?\s*/i, '').trim())
    .filter(Boolean)
    .slice(0, 3);
  const linked = getLinkedRecipeRefs(recipe, recipesById).slice(0, 2).map(item => item.recipe.title);
  const tail = linked.length ? ` Liens utiles : ${linked.join(', ')}.` : '';
  const ingredients = ingredientNames.length ? ` Avec ${ingredientNames.join(', ')}.` : '';
  return truncateText(`${recipe.title} sur Cook Note : recette ${category}${yieldText}, avec ingrédients, étapes et notes pratiques.${ingredients}${tail}`);
}

function getPathRecipe() {
  const match = window.location.pathname.match(/^\/recette\/([^/?#]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getRecipeUrl(recipeId, variantId = '') {
  const path = `/recette/${encodeURIComponent(recipeId)}`;
  return variantId ? `${path}?variant=${encodeURIComponent(variantId)}` : path;
}

function getHomeUrl() {
  return `${window.location.origin}/`;
}

function getInitialRecipe() {
  const pathRecipe = getPathRecipe();
  if (pathRecipe) return pathRecipe;
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return params.get('recipe');
}

function getInitialVariant() {
  const queryVariant = new URLSearchParams(window.location.search).get('variant');
  if (queryVariant) return queryVariant;
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return params.get('variant');
}

function isTypingTarget(target) {
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName);
}

function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const area = document.createElement('textarea');
  area.value = text;
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  area.remove();
  return Promise.resolve();
}

function sanitizeNoteHtml(value) {
  const template = document.createElement('template');
  template.innerHTML = String(value || '');
  const allowedTags = new Set(['SPAN', 'STRONG', 'EM', 'B', 'I', 'BR']);

  function clean(node) {
    Array.from(node.childNodes).forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) return;
      if (child.nodeType !== Node.ELEMENT_NODE || !allowedTags.has(child.tagName)) {
        child.replaceWith(document.createTextNode(child.textContent || ''));
        return;
      }
      Array.from(child.attributes).forEach(attribute => {
        if (!(child.tagName === 'SPAN' && attribute.name === 'data-goto')) {
          child.removeAttribute(attribute.name);
        }
      });
      clean(child);
    });
  }

  clean(template.content);
  return template.innerHTML;
}

function setMetaContent(selector, content) {
  const node = document.head.querySelector(selector);
  if (node && content) node.setAttribute('content', content);
}

function absoluteAssetUrl(url) {
  if (!url) return undefined;
  try {
    return new URL(url, window.location.origin).href;
  } catch {
    return undefined;
  }
}

function recipeJsonLd(recipe, recipesById = {}) {
  if (!recipe || isMasterRecipe(recipe)) return null;
  const url = `${window.location.origin}${getRecipeUrl(recipe.id)}`;
  const linkedRecipes = getLinkedRecipeRefs(recipe, recipesById);
  const recipeNode = {
    '@type': 'Recipe',
    '@id': `${url}#recipe`,
    name: recipe.title,
    description: recipeDescription(recipe, recipesById),
    url,
    mainEntityOfPage: url,
    image: recipe.image ? [absoluteAssetUrl(recipe.image)] : undefined,
    author: { '@type': 'Organization', name: 'Cook Note' },
    recipeYield: recipe.yield || undefined,
    recipeCategory: (recipe.categories || []).join(', ') || undefined,
    keywords: (recipe.tags || recipe.tagsExtracted || []).join(', ') || undefined,
    recipeIngredient: (recipe.ingredients || []).flatMap(group => group.items || []).map(stripHtml),
    recipeInstructions: (recipe.steps || []).map(step => ({ '@type': 'HowToStep', text: stripHtml(step) })),
    mentions: linkedRecipes.map(item => ({
      '@type': 'Recipe',
      name: item.recipe.title,
      url: `${window.location.origin}${getRecipeUrl(item.id)}`
    }))
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      recipeNode,
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Cook Note', item: getHomeUrl() },
          { '@type': 'ListItem', position: 2, name: primaryCategory(recipe), item: getHomeUrl() },
          { '@type': 'ListItem', position: 3, name: recipe.title, item: url }
        ]
      }
    ]
  };
}

function updateDocumentMeta(recipe, recipesById = {}) {
  const title = recipe?.title ? `${recipe.title} - Cook Note` : 'Cook Note';
  const description = recipe?.title ? recipeDescription(recipe, recipesById) : 'Cook Note : carnet de recettes avec ingrédients, quantités ajustables, étapes et notes pratiques.';
  const canonicalUrl = recipe?.id ? `${window.location.origin}${getRecipeUrl(recipe.id)}` : getHomeUrl();
  document.title = title;
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:type"]', recipe && !isMasterRecipe(recipe) ? 'article' : 'website');
  setMetaContent('meta[property="og:url"]', canonicalUrl);
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', description);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);
  if (recipe?.image) {
    const image = absoluteAssetUrl(recipe.image);
    setMetaContent('meta[property="og:image"]', image);
    setMetaContent('meta[property="og:image:secure_url"]', image);
    setMetaContent('meta[name="twitter:image"]', image);
  }
  document.getElementById('recipe-jsonld')?.remove();
  const jsonLd = recipeJsonLd(recipe, recipesById);
  if (jsonLd) {
    const script = document.createElement('script');
    script.id = 'recipe-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }
}

function Button(props) {
  const className = ['btn', props.variant ? `btn-${props.variant}` : '', props.className || '']
    .filter(Boolean)
    .join(' ');
  return h('button', {
    type: props.type || 'button',
    className,
    onClick: props.onClick,
    disabled: props.disabled,
    title: props.title,
    'aria-label': props.ariaLabel,
    'aria-pressed': props.pressed
  }, props.children);
}

function TopBarFixed({ onHome, shoppingCount, showFavorites, openShoppingBasket, query, openSearch }) {
  return h('header', { className: 'topbar' },
    h('div', { className: 'top-left' },
      h(Button, { variant: 'subtle', className: 'icon-square', onClick: onHome, title: 'Accueil', ariaLabel: 'Accueil' }, '\u2302')
    ),
    h('nav', { className: 'top-actions', 'aria-label': 'Actions rapides' },
      h('a', {
        className: 'btn btn-subtle',
        href: 'mailto:cooknote271@gmail.com?subject=Demande%20d%27ajout%20de%20recette%20Cook%20Note&body=Bonjour%2C%0A%0AJ%27aimerais%20demander%20l%27ajout%20de%20cette%20recette%20dans%20Cook%20Note%20%3A%0A%0ANom%20de%20la%20recette%20%3A%0AIngr%C3%A9dients%20%3A%0A%C3%89tapes%20%3A%0A%0AMerci.'
      }, 'Demander une recette'),
      h(Button, { variant: 'subtle', className: 'cart-icon-btn icon-square', onClick: openShoppingBasket, title: `${shoppingCount} course${shoppingCount > 1 ? 's' : ''}`, ariaLabel: 'Panier courses' }, [
        '\u25a4',
        shoppingCount > 0 && h('span', { className: 'cart-count', key: 'count' }, shoppingCount)
      ])
    ),
    h('div', { className: 'top-right' },
      h(Button, {
        variant: 'ghost',
        className: query.trim() ? 'top-search-button icon-square active' : 'top-search-button icon-square',
        onClick: openSearch,
        title: 'Rechercher',
        ariaLabel: 'Rechercher',
        pressed: Boolean(query.trim())
      }, '\u2315'),
      h(Button, {
        variant: 'ghost',
        className: 'top-fav-btn icon-square',
        onClick: showFavorites,
        title: 'Voir les favoris',
        ariaLabel: 'Voir les favoris'
      }, '\u2665')
    )
  );
}

function Hero() {
  return h('section', {
    className: 'hero',
    style: {
      backgroundImage: `linear-gradient(110deg, rgba(4,4,5,.92), rgba(4,4,5,.54) 48%, rgba(4,4,5,.84)), url("${HERO_IMAGE}")`
    }
  },
    h('div', { className: 'hero-inner' },
      h('h1', { className: 'sr-only' }, 'Cook Note'),
      h('img', { className: 'hero-logo', src: COOK_NOTE_LOGO, alt: 'Cook Note' })
    )
  );
}

function ActiveChips({ chips }) {
  if (!chips.length) return null;
  return h('div', { className: 'active-chips', 'aria-label': 'Filtres actifs' },
    chips.map(chip => h('button', { key: chip.key, type: 'button', onClick: chip.clear }, `${chip.label} ×`))
  );
}

function SmartCollections({ collections, activeCollection, setCollection }) {
  if (!collections.length) return null;
  return h('section', { className: 'smart-collections', 'aria-label': 'Collections rapides' },
    h('div', { className: 'smart-collections-head' },
      h('div', null,
        h('p', { className: 'eyebrow' }, 'Collections'),
        h('h2', null, 'Trouver plus vite')
      )
    ),
    h('div', { className: 'smart-collection-grid' },
      collections.map(item => h('button', {
        key: item.id,
        type: 'button',
        className: activeCollection === item.id ? 'smart-collection-card active' : 'smart-collection-card',
        onClick: () => setCollection(activeCollection === item.id ? '' : item.id)
      },
        h('span', { className: 'smart-collection-count' }, item.count),
        h('strong', null, item.label),
        h('small', null, item.description)
      ))
    )
  );
}

function HomeDashboard({ currentSeason, recentRecipe, favoritesCount, shoppingCount, setSeason, showFavorites, openShoppingBasket, openRecipe }) {
  return h('section', { className: 'home-dashboard', 'aria-label': 'Accès rapides' },
    h('button', { type: 'button', className: 'home-dashboard-tile', onClick: () => setSeason(currentSeason) },
      h('span', null, 'Saison actuelle'),
      h('strong', null, currentSeason),
      h('small', null, 'Voir les recettes du moment')
    ),
    h('button', { type: 'button', className: 'home-dashboard-tile', onClick: showFavorites },
      h('span', null, 'Favoris'),
      h('strong', null, favoritesCount ? `${favoritesCount} recette${favoritesCount > 1 ? 's' : ''}` : 'Aucun favori'),
      h('small', null, 'Retrouver les recettes gardées')
    ),
    h('button', { type: 'button', className: 'home-dashboard-tile', onClick: openShoppingBasket },
      h('span', null, 'Courses'),
      h('strong', null, shoppingCount ? `${shoppingCount} recette${shoppingCount > 1 ? 's' : ''}` : 'Panier vide'),
      h('small', null, 'Ouvrir la liste groupée')
    ),
    recentRecipe && h('button', { type: 'button', className: 'home-dashboard-tile featured', onClick: () => openRecipe(recentRecipe.id) },
      h('span', null, 'Reprendre'),
      h('strong', null, recentRecipe.title),
      h('small', null, primaryCategory(recentRecipe))
    )
  );
}

function RecipeCard({ recipe, recipesById, isFavorite, toggleFavorite, openRecipe, setTagFilter }) {
  const master = isMasterRecipe(recipe);
  const color = getCategoryColor(recipe);
  const categories = recipe.categories || [];
  const style = { '--card-accent': color };
  const className = ['recipe-card', recipe.image ? 'has-image' : '', master ? 'master-card' : '']
    .filter(Boolean)
    .join(' ');
  const imageStyle = recipe.image
    ? { backgroundImage: `url("${recipe.image}")` }
    : style;
  const seasons = (recipe.seasons || []).filter(item => item !== 'Toutes saisons');
  const cardFacts = master
    ? []
    : [
      difficultyText(recipe).replace('Difficulté ', ''),
      recipe.yield || '',
      seasons[0] || ''
    ].filter(Boolean).slice(0, 3);

  return h('article', {
    className,
    style,
    tabIndex: 0,
    role: 'button',
    onClick: () => openRecipe(recipe.id),
    onKeyDown: event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openRecipe(recipe.id);
      }
    }
  },
    h('div', { className: 'card-media', style: imageStyle },
      !recipe.image && h('span', { className: 'card-letter' }, recipe.title.slice(0, 1)),
      recipe.video && h('span', { className: 'video-badge' }, 'Vidéo'),
      !master && h('button', {
        type: 'button',
        className: isFavorite ? 'fav-btn active' : 'fav-btn',
        onClick: event => {
          event.stopPropagation();
          toggleFavorite(recipe.id);
        },
        'aria-label': isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'
      }, isFavorite ? '\u2665' : '\u2661')
    ),
    h('div', { className: 'card-body' },
      !master && h('div', { className: 'tag-line' }, categories.slice(0, 1).map(cat => h('span', { key: cat }, cat))),
      h('h3', null, recipe.title),
      !master && cardFacts.length > 0 && h('div', { className: 'card-facts' },
        cardFacts.map(fact => h('span', { key: fact }, fact))
      ),
      h('p', { className: 'card-meta' },
        master
          ? h('span', null, `${countLeafRecipes(recipe, recipesById)} recette${countLeafRecipes(recipe, recipesById) > 1 ? 's' : ''}`)
          : h('span', null, `${countIngredients(recipe)} ingrédients`)
      ),
      !master && h('span', { className: `nutri-score nutri-${getNutriScore(recipe).toLowerCase()}` }, `Nutri ${getNutriScore(recipe)}`),
      !master && h('div', { className: 'mini-tags card-overlay-tags' },
        (recipe.tagsExtracted || []).slice(0, 2).map(tag => h('button', {
          key: tag,
          type: 'button',
          onClick: event => {
            event.stopPropagation();
            setTagFilter(tag);
          }
        }, tag))
      )
    )
  );
}

function RecipeGrid({ recipes, recipesById, favorites, toggleFavorite, openRecipe, setTagFilter }) {
  if (!recipes.length) {
    return h('div', { className: 'empty-state' },
      h('h2', null, 'Aucune recette ne matche'),
      h('p', null, 'Les filtres sont trop serrés pour le contenu actuel.')
    );
  }
  return h('div', { className: 'recipe-grid' },
    recipes.map(recipe => h(RecipeCard, {
      key: recipe.id,
      recipe,
      recipesById,
      isFavorite: favorites.includes(recipe.id),
      toggleFavorite,
      openRecipe,
      setTagFilter
    }))
  );
}

function SeasonSections({ sections, recipesById, favorites, toggleFavorite, openRecipe, setTagFilter, onlyFavorites, clearFavoriteView, selectedSeason, setSeason, categoryFilter, setCategoryFilter, categoryOptions }) {
  const seasonOptions = ['Toutes', ...SEASONS];
  const showCategoryTabs = selectedSeason && !onlyFavorites && (categoryOptions || []).length > 1;
  return h('section', { className: 'season-sections', id: 'recettes' },
    h('div', { className: 'section-title list-title' },
      h('div', null,
        h('p', { className: 'eyebrow' }, onlyFavorites ? 'Favoris' : 'Rangement saisonnier'),
        h('h2', null, onlyFavorites ? 'Mes recettes favorites' : 'Recettes par saison')
      ),
      onlyFavorites
        ? h('button', { type: 'button', onClick: clearFavoriteView }, 'Quitter les favoris')
        : h('div', { className: 'season-filter-stack' },
          h('div', { className: 'season-tabs', 'aria-label': 'Filtrer par saison' },
            seasonOptions.map(item => {
              const value = item === 'Toutes' ? '' : item;
              const active = selectedSeason === value;
              return h('button', {
                key: item,
                type: 'button',
                className: active ? 'active' : '',
                onClick: () => setSeason(value)
              }, item);
            })
          ),
          showCategoryTabs && h('div', { className: 'season-category-tabs', 'aria-label': 'Filtrer la saison par catégorie' },
            categoryOptions.map(item => h('button', {
              key: item.value || 'all',
              type: 'button',
              className: categoryFilter === item.value ? 'active' : '',
              onClick: () => setCategoryFilter(item.value)
            },
              h('span', null, item.label),
              h('small', null, item.count)
            ))
          )
        )
    ),
    sections.map(section => h('section', { key: section.key, className: 'season-block' },
      h('div', { className: 'season-block-head' },
        h('div', null, h('p', { className: 'eyebrow' }, section.kicker), h('h3', null, section.title)),
        h('span', null, `${section.recipes.length} fiche${section.recipes.length > 1 ? 's' : ''}`)
      ),
      h(RecipeGrid, { recipes: section.recipes, recipesById, favorites, toggleFavorite, openRecipe, setTagFilter })
    ))
  );
}

function HomeView(props) {
  return h('main', { className: 'home-view' },
    h(Hero),
    h('div', { className: 'content-wrap' },
      props.showDashboard && h(HomeDashboard, {
        currentSeason: props.currentSeason,
        recentRecipe: props.recentRecipe,
        favoritesCount: props.favorites.length,
        shoppingCount: props.shoppingCount,
        setSeason: props.filterProps.setSeason,
        showFavorites: props.showFavorites,
        openShoppingBasket: props.openShoppingBasket,
        openRecipe: props.openRecipe
      }),
      h(ActiveChips, { chips: props.activeChips }),
      props.showSmartCollections && h(SmartCollections, {
        collections: props.smartCollections,
        activeCollection: props.filterProps.collection,
        setCollection: props.filterProps.setCollection
      }),
      h(SeasonSections, {
        sections: props.sections,
        recipesById: props.recipesById,
        favorites: props.favorites,
        toggleFavorite: props.toggleFavorite,
        openRecipe: props.openRecipe,
        setTagFilter: props.setTagFilter,
        onlyFavorites: props.onlyFavorites,
        clearFavoriteView: props.clearFavoriteView,
        selectedSeason: props.filterProps.season,
        setSeason: props.filterProps.setSeason,
        categoryFilter: props.filterProps.seasonCategory,
        setCategoryFilter: props.filterProps.setSeasonCategory,
        categoryOptions: props.filterProps.seasonCategoryOptions
      })
    )
  );
}

function SharePanel({ open, onClose, recipe }) {
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [qrReady, setQrReady] = useState(false);
  const canvasRef = useRef(null);
  const url = `${window.location.origin}${getRecipeUrl(recipe.id)}`;
  const description = recipeDescription(recipe);
  const text = `${recipe.title} - Cook Note\n${description}\n${url}`;
  const imageStyle = recipe.image ? { backgroundImage: `url("${recipe.image}")` } : {};

  function nativeShare() {
    if (!navigator.share) return copyText(text).then(() => setCopiedText(true));
    return navigator.share({ title: `${recipe.title} - Cook Note`, text: description, url }).catch(() => {});
  }

  useEffect(() => {
    setCopied(false);
    setCopiedText(false);
    setQrReady(false);
    if (!open || !canvasRef.current || !window.QRCode) return;
    window.QRCode.toCanvas(canvasRef.current, url, {
      width: 132,
      margin: 1,
      color: { dark: '#111111', light: '#ffffff' }
    }).then(() => setQrReady(true)).catch(() => setQrReady(false));
  }, [open, url]);

  if (!open) return null;
  return h('div', { className: 'modal-backdrop', onMouseDown: onClose },
    h('section', { className: 'modal-panel share-modal', role: 'dialog', 'aria-modal': 'true', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null, h('p', { className: 'eyebrow' }, 'Partager'), h('h2', null, recipe.title)),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, '\u00d7')
      ),
      h('div', { className: 'share-card' },
        h('div', { className: 'share-card-media', style: imageStyle },
          !recipe.image && h('span', { className: 'card-letter' }, recipe.title.slice(0, 1))
        ),
        h('div', { className: 'share-card-copy' },
          h('p', { className: 'eyebrow' }, 'Cook Note'),
          h('h3', null, recipe.title),
          h('p', null, description),
          h('div', { className: 'share-card-meta' },
            h('span', null, primaryCategory(recipe)),
            recipe.yield && h('span', null, recipe.yield),
            h('span', { className: `nutri-score nutri-${getNutriScore(recipe).toLowerCase()}` }, `Nutri ${getNutriScore(recipe)}`)
          )
        ),
        h('div', { className: qrReady ? 'share-qr is-ready' : 'share-qr' },
          h('canvas', { ref: canvasRef, className: 'qr-canvas', width: 132, height: 132 }),
          !qrReady && h('span', null, 'Lien pret')
        )
      ),
      h('div', { className: 'share-link-box' }, url),
      h('div', { className: 'share-actions' },
        navigator.share && h(Button, { variant: 'primary', onClick: nativeShare }, 'Partager'),
        h(Button, { variant: navigator.share ? 'subtle' : 'primary', onClick: () => copyText(url).then(() => setCopied(true)) }, copied ? 'Lien copie' : 'Copier le lien'),
        h(Button, { variant: 'subtle', onClick: () => copyText(text).then(() => setCopiedText(true)) }, copiedText ? 'Texte copie' : 'Copier le texte'),
        h('a', { className: 'btn btn-subtle', href: `https://wa.me/?text=${encodeURIComponent(text)}`, target: '_blank', rel: 'noreferrer' }, 'WhatsApp'),
        h('a', { className: 'btn btn-subtle', href: `mailto:?subject=${encodeURIComponent(recipe.title)}&body=${encodeURIComponent(text)}` }, 'Email')
      )
    )
  );
}

function SearchPanel({ open, onClose, query, setQuery, searchRef, results, resultMeta, openRecipe }) {
  if (!open) return null;
  const hasQuery = Boolean(query.trim());
  const visibleResults = hasQuery ? results.slice(0, 18) : [];
  const resultGroups = visibleResults.reduce((groups, recipe) => {
    const category = primaryCategory(recipe);
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(recipe);
    return groups;
  }, new Map());
  const suggestions = [
    { title: 'Ingrédients', items: [
      { label: 'Citron', query: 'citron' },
      { label: 'Œufs', query: 'oeuf' },
      { label: 'Chocolat', query: 'chocolat' }
    ] },
    { title: 'Usages', items: [
      { label: 'Four', query: 'four' },
      { label: 'Friture', query: 'friture' },
      { label: 'À préparer', query: 'stockage' }
    ] },
    { title: 'Familles', items: [
      { label: 'Apéro', query: 'apéro' },
      { label: 'Sauces', query: 'sauce' },
      { label: 'Bases', query: 'base' }
    ] }
  ];
  return h('div', { className: 'modal-backdrop search-backdrop', onMouseDown: onClose },
    h('section', {
      className: 'modal-panel search-modal',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Recherche',
      onMouseDown: event => event.stopPropagation()
    },
      h('div', { className: 'modal-head' },
        h('div', null,
          h('p', { className: 'eyebrow' }, 'Recherche'),
          h('h2', null, 'Trouver une recette')
        ),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, '×')
      ),
      h('div', { className: 'field search-modal-field' },
        h('label', { className: 'sr-only' }, 'Rechercher une recette'),
        h('input', {
          ref: searchRef,
          value: query,
          onChange: event => setQuery(event.target.value),
          onKeyDown: event => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'Enter' && visibleResults[0]) {
              openRecipe(visibleResults[0].id);
              onClose();
            }
          },
          placeholder: 'Ingrédient, usage, saison, difficulté...'
        })
      ),
      hasQuery
        ? h('div', { className: 'search-result-count' }, `${results.length} résultat${results.length > 1 ? 's' : ''} pour "${query}"`)
        : h('div', { className: 'search-suggestion-groups' },
          suggestions.map(group => h('section', { key: group.title, className: 'search-suggestion-group' },
            h('strong', null, group.title),
            h('div', { className: 'search-suggestions' },
              group.items.map(item =>
                h('button', { key: item.query, type: 'button', onClick: () => setQuery(item.query) }, item.label)
              )
            )
          ))
        ),
      hasQuery && (visibleResults.length
        ? h('div', { className: 'search-result-groups' },
          Array.from(resultGroups.entries()).map(([category, recipes]) => h('section', { key: category, className: 'search-result-group' },
            h('div', { className: 'search-result-group-head' },
              h('strong', null, category),
              h('span', null, `${recipes.length} résultat${recipes.length > 1 ? 's' : ''}`)
            ),
            h('div', { className: 'search-results' },
              recipes.map(recipe => {
                const meta = resultMeta.get(recipe.id);
                return h('button', {
                  key: recipe.id,
                  type: 'button',
                  className: 'search-result',
                  onClick: () => {
                    openRecipe(recipe.id);
                    onClose();
                  }
                },
                  h('span', { className: 'search-result-image', style: recipe.image ? { backgroundImage: `url("${recipe.image}")` } : {} }),
                  h('span', { className: 'search-result-copy' },
                    h('strong', null, recipe.title),
                    h('small', null, recipe.yield || difficultyText(recipe)),
                    meta?.reasons?.length && h('span', { className: 'search-reason-pills' },
                      meta.reasons.slice(0, 3).map(reason => h('em', { key: reason }, reason))
                    )
                  ),
                  h('span', { className: `nutri-score nutri-${getNutriScore(recipe).toLowerCase()}` }, `Nutri ${getNutriScore(recipe)}`)
                );
              })
            )
          ))
        )
        : h('div', { className: 'empty-state search-empty' },
          h('h2', null, 'Aucun résultat'),
          h('p', null, 'Essaie un ingrédient, une catégorie ou un mot proche.')
        ))
    )
  );
}

function ShoppingBasketPanel({ open, onClose, recipes, factorById, removeRecipe, clearShopping }) {
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const shoppingData = useMemo(() => buildShoppingListData(recipes, factorById), [recipes, factorById]);
  const text = recipes.length ? shoppingListText(recipes, factorById) : 'Liste de courses Cook Note\n\nAucune recette cochee.';
  const shareText = () => {
    if (navigator.share) {
      navigator.share({ title: 'Liste de courses Cook Note', text }).catch(() => {});
    } else {
      copyText(text).then(() => setCopied(true));
    }
  };

  useEffect(() => {
    if (open) setCopied(false);
  }, [open, recipes.length]);

  if (!open) return null;
  return h('div', { className: 'modal-backdrop', onMouseDown: onClose },
    h('section', { className: 'modal-panel shopping-modal', role: 'dialog', 'aria-modal': 'true', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null,
          h('p', { className: 'eyebrow' }, 'Panier courses'),
          h('h2', null, recipes.length ? `${recipes.length} recette${recipes.length > 1 ? 's' : ''} cochée${recipes.length > 1 ? 's' : ''}` : 'Aucune recette')
        ),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, '×')
      ),
      recipes.length
        ? h('div', { className: 'shopping-picked' },
            recipes.map(recipe => h('button', {
              key: recipe.id,
              type: 'button',
              onClick: () => removeRecipe(recipe.id),
              title: 'Retirer du panier courses'
            }, recipe.title, h('span', null, '×')))
          )
        : h('p', { className: 'muted' }, 'Ajoute une recette depuis sa fiche pour construire une liste groupée.'),
      recipes.length > 0 && h('div', { className: 'shopping-aisles' },
        shoppingData.aisleGroups.map(group => h('section', { key: group.label, className: 'shopping-aisle' },
          h('div', { className: 'shopping-aisle-head' },
            h('strong', null, group.label),
            h('span', null, `${group.items.length} article${group.items.length > 1 ? 's' : ''}`)
          ),
          group.items.map(item => {
            const checked = Boolean(checkedItems[item.key]);
            const amount = formatShoppingAmount(item);
            return h('label', { key: item.key, className: checked ? 'shopping-line checked' : 'shopping-line' },
              h('input', {
                type: 'checkbox',
                checked,
                onChange: () => setCheckedItems(prev => ({ ...prev, [item.key]: !prev[item.key] }))
              }),
              h('span', { className: 'shopping-line-main' },
                amount && h('strong', null, amount),
                h('span', null, item.name)
              ),
              h('small', null, item.recipeNames.join(', '))
            );
          })
        ))
      ),
      h('pre', { className: 'cart-output combined-cart' }, text),
      h('div', { className: 'modal-actions' },
        h(Button, { variant: 'primary', disabled: !recipes.length, onClick: () => copyText(text).then(() => setCopied(true)) }, copied ? 'Copié' : 'Copier la liste complète'),
        h(Button, { variant: 'ghost', className: 'icon-square', disabled: !recipes.length, onClick: shareText, title: 'Partager la liste', ariaLabel: 'Partager la liste' }, '\u2197'),
        h(Button, { variant: 'ghost', className: 'icon-square', disabled: !recipes.length, onClick: () => window.print(), title: 'Imprimer la liste', ariaLabel: 'Imprimer la liste' }, '\u2399'),
        h(Button, { variant: 'subtle', disabled: !recipes.length, onClick: clearShopping }, 'Vider le panier')
      )
    )
  );
}

function QuantityFactorControl({ recipe, factor, setFactor, className = '' }) {
  const servingInfo = getServingInfo(recipe);
  const servingOptions = servingOptionsFor(recipe);
  if (servingInfo && servingOptions.length) {
    const currentTarget = getServingTarget(recipe, factor);
    return h('label', {
      className: ['factor-control serving-control quantity-select-control', className].filter(Boolean).join(' '),
      'aria-label': `Choisir le nombre de ${servingUnitLabel(servingInfo, 2)}`
    },
      h('span', { className: 'factor-label' }, 'Quantité'),
      h('select', {
        className: 'quantity-select',
        value: String(currentTarget),
        onChange: event => setFactor(Number(event.target.value) / servingInfo.base)
      },
        servingOptions.map(value => h('option', { key: value, value: String(value) }, String(value)))
      ),
      h('span', { className: 'quantity-unit' }, servingUnitLabel(servingInfo, currentTarget))
    );
  }

  return h('label', {
    className: ['factor-control quantity-select-control multiplier-select-control', className].filter(Boolean).join(' '),
    'aria-label': 'Multiplier les quantités'
  },
    h('span', { className: 'factor-label' }, 'Quantité'),
    h('select', {
      className: 'quantity-select',
      value: String(factor),
      onChange: event => setFactor(Number(event.target.value))
    },
      [0.25, 0.5, 1, 2, 4].map(value => h('option', {
        key: value,
        value: String(value)
      }, `${String(value).replace('.', ',')}x`))
    ),
    h('span', { className: 'quantity-unit' }, 'fois')
  );
}

function VariantPickerPanel({ parent, variantRefs, recipesById, selectedVariantId, onSelect, factor = 1, setFactor }) {
  const sortedVariantRefs = sortVariantRefs(variantRefs, recipesById);
  if (!sortedVariantRefs.length) return null;
  const selectedVariant = selectedVariantId ? sortedVariantRefs.find(variant => variant.id === selectedVariantId) : null;
  const selectedRecipe = selectedVariant ? recipesById[selectedVariant.id] : null;
  if (selectedVariant && selectedRecipe) {
    const image = selectedRecipe.image || parent.image;
    const panelStyle = image
      ? { backgroundImage: `linear-gradient(90deg, rgba(4,4,5,.86), rgba(4,4,5,.58) 48%, rgba(4,4,5,.30)), url("${image}")` }
      : {};
    return h('section', { id: 'recipe-picker', className: 'recipe-panel variant-picker-panel variant-picker-panel-selected', style: panelStyle },
      h('div', { className: 'panel-heading' },
        h('div', null,
          h('p', { className: 'eyebrow' }, 'Recette sélectionnée'),
          h('h2', null, selectedVariant.label || selectedRecipe.title),
          h('p', { className: 'selected-recipe-meta' },
            difficultyText(selectedRecipe),
            selectedRecipe.yield && h(React.Fragment, null, ' · ', getQuantityDisplay(selectedRecipe, factor))
          ),
          selectedRecipe.variantGroups && h('p', { className: 'selected-recipe-hint' }, 'Choisis les blocs d’ingrédients à préparer ci-dessous.'),
          h(QuantityFactorControl, { recipe: selectedRecipe, factor, setFactor, className: 'variant-factor-control' })
        ),
        h(Button, { variant: 'subtle', onClick: () => onSelect('') }, 'Changer de recette')
      )
    );
  }
  return h('section', { id: 'recipe-picker', className: 'recipe-panel variant-picker-panel' },
    h('div', { className: 'panel-heading' },
      h('div', null,
        h('p', { className: 'eyebrow' }, 'Recettes'),
        h('h2', null, 'Choisir une recette')
      ),
      h('span', { className: 'progress-label' }, `${sortedVariantRefs.length} recette${sortedVariantRefs.length > 1 ? 's' : ''}`)
    ),
    h('div', { className: 'variant-card-grid' },
      sortedVariantRefs.map(variant => {
        const item = recipesById[variant.id];
        if (!item) return null;
        const image = item.image || parent.image;
        return h('button', {
          key: variant.id,
          type: 'button',
          className: selectedVariantId === variant.id ? 'variant-card active' : 'variant-card',
          style: { '--card-accent': getCategoryColor(item) },
          onClick: () => onSelect(variant.id)
        },
          image && h('span', { className: 'variant-card-bg', style: { backgroundImage: `url("${image}")` } }),
          h('span', { className: 'variant-card-body' },
            h('strong', null, variant.label || item.title)
          )
        );
      })
    )
  );
}

function RecipeBreadcrumb({ recipe, selectedRecipe, showVariants, goHome, openRecipe }) {
  const breadcrumbRecipe = showVariants ? recipe : (selectedRecipe || recipe);
  const category = primaryCategory(breadcrumbRecipe);
  const categoryParentId = CATEGORY_PARENT_IDS[category];
  const isRootParent = showVariants && !breadcrumbRecipe.master;
  const repeatsTitle = normalizeText(category) === normalizeText(breadcrumbRecipe.title);
  const openCategory = () => categoryParentId ? openRecipe(categoryParentId) : goHome();
  const openCurrentParent = () => openRecipe(breadcrumbRecipe.id);
  return h('nav', { className: 'recipe-breadcrumb', 'aria-label': 'Fil d’Ariane' },
    h('button', { type: 'button', onClick: goHome }, 'Cook Note'),
    h('span', null, '/'),
    !isRootParent && !repeatsTitle && h(React.Fragment, null,
      categoryParentId
        ? h('button', { type: 'button', onClick: openCategory }, category)
        : h('span', null, category),
      h('span', null, '/')
    ),
    isRootParent
      ? h('button', { type: 'button', onClick: openCurrentParent }, breadcrumbRecipe.title)
      : h('strong', null, breadcrumbRecipe.title)
  );
}

function LinkedRecipesBlock({ links, openRecipe }) {
  const [expanded, setExpanded] = useState(false);
  const linkKey = links.map(item => item.id).join('|');
  useEffect(() => setExpanded(false), [linkKey]);
  if (!links.length) return null;
  const hasExtra = links.length > 3;
  const visibleLinks = hasExtra && !expanded ? links.slice(0, 3) : links;
  const hiddenCount = Math.max(0, links.length - 3);
  const groups = visibleLinks.reduce((acc, item) => {
    const role = item.role || 'Recette liée';
    if (!acc.has(role)) acc.set(role, []);
    acc.get(role).push(item);
    return acc;
  }, new Map());
  return h('div', { className: 'linked-recipes-block' },
    h('p', { className: 'eyebrow' }, 'Recettes liées'),
    Array.from(groups.entries()).map(([role, items]) => h('div', { key: role, className: 'linked-recipe-group' },
      h('div', { className: 'linked-recipe-group-title' }, role),
      h('div', { className: 'linked-recipe-list' },
        items.map(item => h('button', {
          key: item.id,
          type: 'button',
          className: 'linked-recipe-item',
          style: { '--card-accent': getCategoryColor(item.recipe) },
          onClick: () => openRecipe(item.id)
        },
          h('span', { className: 'linked-recipe-thumb', style: item.recipe.image ? { backgroundImage: `url("${item.recipe.image}")` } : {} }),
          h('span', { className: 'linked-recipe-copy' },
            h('small', null, primaryCategory(item.recipe)),
            h('strong', null, item.recipe.title)
          )
        ))
      )
    )),
    hasExtra && h('button', {
      type: 'button',
      className: expanded ? 'linked-recipe-toggle active' : 'linked-recipe-toggle',
      onClick: () => setExpanded(value => !value),
      'aria-expanded': expanded
    }, expanded ? 'Masquer les recettes liées' : `Voir ${hiddenCount} autre${hiddenCount > 1 ? 's' : ''} recette${hiddenCount > 1 ? 's' : ''}`)
  );
}

function PracticalSectionsBlock({ sections }) {
  if (!sections.length) return null;
  return h('div', { className: 'practical-block' },
    h('p', { className: 'eyebrow' }, 'Repères'),
    h('h2', null, 'Infos pratiques'),
    sections.map(section => h('section', { key: section.key, className: 'practical-section' },
      h('h3', null, section.title),
      h('ul', null, section.items.map(item => h('li', { key: item }, item)))
    ))
  );
}

function RecipeQuickFacts({ recipe, factor, stepTotal }) {
  const seasons = (recipe.seasons || []).filter(item => item !== 'Toutes saisons');
  const equipment = inferEquipment(recipe).slice(0, 2);
  const facts = [
    { label: 'Difficulté', value: difficultyText(recipe).replace('Difficulté ', '') },
    recipe.yield && { label: 'Quantité', value: getQuantityDisplay(recipe, factor) },
    { label: 'Ingrédients', value: `${countIngredients(recipe)} ingrédients` },
    { label: 'Étapes', value: `${stepTotal || getRecipeSteps(recipe).length} étapes` },
    seasons.length && { label: 'Saison', value: seasons.slice(0, 2).join(' / ') },
    equipment.length && { label: 'Matériel', value: equipment.join(' · ') }
  ].filter(Boolean);
  return h('section', { className: 'recipe-quick-facts', 'aria-label': 'Résumé de la recette' },
    facts.map(item => h('div', { key: item.label, className: 'recipe-quick-fact' },
      h('span', null, item.label),
      h('strong', null, item.value)
    ))
  );
}

function RecipeView({
  recipe,
  isFavorite,
  toggleFavorite,
  shoppingIds,
  toggleShopping,
  openShoppingBasket,
  goHome,
  openRecipe,
  recipes,
  recipesById,
  checked,
  setCheckedWithHistory,
  canUndo,
  canRedo,
  undo,
  redo,
  setTagFilter,
  selectedVariantId: initialSelectedVariantId,
  onVariantChange
}) {
  const [factor, setFactor] = useState(1);
  const variantRefs = useMemo(() => sortVariantRefs(getLeafVariantRefs(recipe, recipesById), recipesById), [recipe.id, recipesById]);
  const showVariants = variantRefs.length > 0;
  const leafRecipeCount = showVariants ? countLeafRecipes(recipe, recipesById) : 0;
  const [selectedVariantId, setSelectedVariantId] = useState(() => initialSelectedVariantId || (showVariants ? '' : recipe.id));
  const selectedVariantRecipe = selectedVariantId ? recipesById[selectedVariantId] : null;
  const hasSelectedVariant = !showVariants || Boolean(selectedVariantRecipe);
  const selectedRecipe = showVariants ? (selectedVariantRecipe || recipe) : recipe;
  const inlineTargets = useMemo(() => buildInlineRecipeTargets(recipes), [recipes]);
  const detailKey = hasSelectedVariant ? selectedRecipe.id : recipe.id;
  const [shareOpen, setShareOpen] = useState(false);
  const [mobileDetailTab, setMobileDetailTab] = useState('ingredients');
  const [openIngredientGroups, setOpenIngredientGroups] = useState({});
  const [timerEnd, setTimerEnd] = useState(0);
  const [timerLabel, setTimerLabel] = useState('');
  const [now, setNow] = useState(Date.now());
  const completedRef = useRef('');
  const inlineVariantGroupIndexes = useMemo(() => (
    selectedRecipe?.variantGroups
      ? (selectedRecipe.ingredients || [])
        .map((group, index) => ({ group, index }))
        .filter(({ group }) => isVariantIngredientGroup(group, selectedRecipe.ingredients || [], selectedRecipe))
      : []
  ), [selectedRecipe]);
  const needsInlineVariantSelection = inlineVariantGroupIndexes.length > 0;
  const selectedInlineVariantGroup = needsInlineVariantSelection
    ? inlineVariantGroupIndexes.find(({ index }) => Boolean(openIngredientGroups[`${detailKey}:group:${index}`]))
    : null;
  const canShowSteps = hasSelectedVariant && (!needsInlineVariantSelection || Boolean(selectedInlineVariantGroup));
  const displaySteps = canShowSteps ? getRecipeSteps(selectedRecipe) : [];
  const stepTotal = displaySteps.length;
  const doneSteps = Object.keys(checked).filter(key => key.startsWith(`${detailKey}:step:`) && checked[key]).length;
  const progress = stepTotal ? Math.round((doneSteps / stepTotal) * 100) : 0;
  const canAddToShopping = hasSelectedVariant && canShowSteps;
  const isInShopping = hasSelectedVariant && shoppingIds.includes(detailKey);
  const canFavorite = hasSelectedVariant && !isMasterRecipe(selectedRecipe);
  const remainingMs = timerEnd ? timerEnd - now : 0;
  const recipeAllergens = hasSelectedVariant ? getRecipeAllergens(selectedRecipe) : [];
  const averageWeights = hasSelectedVariant ? getRecipeAverageWeights(selectedRecipe) : [];
  const linkedRecipes = hasSelectedVariant ? getLinkedRecipeRefs(selectedRecipe, recipesById) : [];
  const practicalSections = hasSelectedVariant ? getRecipePracticalSections(selectedRecipe) : [];
  const displayNotes = hasSelectedVariant ? getDisplayNotes(selectedRecipe, practicalSections) : [];
  const notesCount = recipeAllergens.length + averageWeights.length + linkedRecipes.length + practicalSections.length + displayNotes.length;
  const selectedGroupLabel = selectedInlineVariantGroup?.group?.group || '';

  useEffect(() => {
    setFactor(1);
    completedRef.current = '';
    setMobileDetailTab('ingredients');
    setOpenIngredientGroups({});
  }, [recipe.id, selectedVariantId]);

  useEffect(() => {
    if (!timerEnd) return undefined;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [timerEnd]);

  useEffect(() => {
    if (timerEnd && timerEnd <= now) {
      setTimerEnd(0);
      setTimerLabel('');
    }
  }, [timerEnd, now]);

  useEffect(() => {
    setSelectedVariantId(initialSelectedVariantId || (showVariants ? '' : recipe.id));
  }, [initialSelectedVariantId, recipe.id]);

  useEffect(() => {
    setOpenIngredientGroups({});
  }, [detailKey]);

  useEffect(() => {
    if (!stepTotal || doneSteps !== stepTotal || completedRef.current === detailKey) return;
    completedRef.current = detailKey;
    if (window.confetti) {
      window.confetti({ particleCount: 110, spread: 70, origin: { y: .65 } });
      setTimeout(() => window.confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } }), 220);
      setTimeout(() => window.confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } }), 380);
    }
  }, [detailKey, doneSteps, stepTotal]);

  function toggle(key) {
    setCheckedWithHistory(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function chooseVariant(variantId) {
    setSelectedVariantId(variantId);
    onVariantChange?.(recipe.id, variantId);
  }

  function scrollToRecipePicker() {
    document.getElementById('recipe-picker')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toggleIngredientGroup(groupKey) {
    setOpenIngredientGroups(prev => {
      const isOpening = !prev[groupKey];
      if (!needsInlineVariantSelection || !isOpening) return { ...prev, [groupKey]: !prev[groupKey] };
      const next = { ...prev };
      inlineVariantGroupIndexes.forEach(({ index }) => {
        delete next[`${detailKey}:group:${index}`];
      });
      next[groupKey] = true;
      return next;
    });
  }

  const heroUsesHomeImage = showVariants;
  const heroImage = heroUsesHomeImage ? HERO_IMAGE : (selectedRecipe.image || recipe.image);
  const heroEyebrow = isMasterRecipe(recipe) ? 'Catégorie' : primaryCategory(recipe);
  const heroStyle = heroImage
    ? {
      backgroundImage: heroUsesHomeImage
        ? `linear-gradient(110deg, rgba(4,4,5,.92), rgba(4,4,5,.54) 48%, rgba(4,4,5,.84)), url("${heroImage}")`
        : `linear-gradient(90deg, rgba(4,4,5,.92), rgba(4,4,5,.50)), url("${heroImage}")`
    }
    : {};
  const detailAccent = getCategoryColor(selectedRecipe);
  const detailStyle = { '--accent': detailAccent, '--accent-2': detailAccent };

  return h('main', { className: 'recipe-view', style: detailStyle },
    h('section', {
      className: heroImage ? (heroUsesHomeImage ? 'recipe-detail-hero has-photo parent-hero' : 'recipe-detail-hero has-photo') : 'recipe-detail-hero',
      style: heroStyle
    },
      h('div', { className: 'detail-hero-copy' },
        h('button', { type: 'button', className: 'back-link', onClick: goHome }, 'Retour aux recettes'),
        heroUsesHomeImage && h('img', { className: 'detail-hero-logo', src: COOK_NOTE_LOGO, alt: 'Cook Note' }),
        h(RecipeBreadcrumb, { recipe, selectedRecipe, showVariants, goHome, openRecipe }),
        h('p', { className: 'eyebrow' }, heroEyebrow),
        h('h1', null, recipe.title),
        h('div', { className: 'detail-meta' },
          showVariants
            ? [
              h('span', { key: 'recipes' }, `${leafRecipeCount} recette${leafRecipeCount > 1 ? 's' : ''}`),
              h('button', { key: 'choice', type: 'button', className: 'meta-action', onClick: scrollToRecipePicker }, 'Choisir une recette')
            ]
            : [
              h('span', { key: 'difficulty' }, difficultyText(selectedRecipe)),
              h('span', { key: 'nutri', className: `nutri-score nutri-${getNutriScore(selectedRecipe).toLowerCase()}` }, `Nutri ${getNutriScore(selectedRecipe)}`),
              selectedRecipe.yield && h('span', { key: 'yield' }, getQuantityDisplay(selectedRecipe, factor)),
              h('span', { key: 'ingredients' }, `${countIngredients(selectedRecipe)} ingrédients`),
              h('span', { key: 'steps' }, `${stepTotal} étapes`)
            ]
        ),
        h('div', { className: 'detail-actions' },
          h(Button, { variant: isInShopping ? 'primary' : 'ghost', disabled: !canAddToShopping, onClick: () => canAddToShopping && toggleShopping(detailKey, factor) }, isInShopping ? 'Dans les courses' : 'Ajouter aux courses'),
          h(Button, { variant: 'ghost', className: 'icon-square', onClick: () => setShareOpen(true), title: 'Partager', ariaLabel: 'Partager' }, '\u2197'),
          selectedRecipe.video && h('a', { className: 'btn btn-ghost', href: selectedRecipe.video, target: '_blank', rel: 'noreferrer' }, 'Voir la vidéo'),
          h(Button, { variant: 'ghost', className: 'icon-square', onClick: () => window.print(), title: 'Imprimer', ariaLabel: 'Imprimer' }, '\u2399'),
          canFavorite && h(Button, { variant: 'ghost', className: isFavorite ? 'icon-square favorite-action active' : 'icon-square favorite-action', onClick: () => toggleFavorite(detailKey), title: isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris', ariaLabel: isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }, isFavorite ? '\u2665' : '\u2661')
        )
      )
    ),
    showVariants && h(VariantPickerPanel, {
      parent: recipe,
      variantRefs,
      recipesById,
      selectedVariantId,
      onSelect: chooseVariant,
      factor,
      setFactor
    }),
    hasSelectedVariant && !isMasterRecipe(selectedRecipe) && h(RecipeQuickFacts, {
      recipe: selectedRecipe,
      factor,
      stepTotal: getRecipeSteps(selectedRecipe).length
    }),
    hasSelectedVariant && h('div', { className: 'recipe-tabs', 'aria-label': 'Sections de la recette' },
      [
        { key: 'ingredients', label: 'Ingrédients', count: countIngredients(selectedRecipe) },
        { key: 'steps', label: 'Étapes', count: stepTotal || getRecipeSteps(selectedRecipe).length },
        { key: 'notes', label: 'Avant', count: notesCount }
      ].map(tab => h('button', {
        key: tab.key,
        type: 'button',
        className: mobileDetailTab === tab.key ? 'active' : '',
        'aria-selected': mobileDetailTab === tab.key,
        onClick: () => setMobileDetailTab(tab.key)
      }, h('span', null, tab.label), h('small', null, tab.count)))
    ),
    hasSelectedVariant && needsInlineVariantSelection && h('div', { className: 'mobile-recipe-guidance' },
      canShowSteps
        ? `Bloc actif : ${selectedGroupLabel}. Les étapes affichées suivent ce choix.`
        : 'Ouvre un bloc d’ingrédients pour afficher les étapes correspondantes.'
    ),
    hasSelectedVariant && h('div', { className: 'recipe-detail-grid' },
      h('section', { className: mobileDetailTab === 'ingredients' ? 'recipe-panel ingredients-panel active-tab-panel' : 'recipe-panel ingredients-panel' },
        h('div', { className: 'panel-heading' },
          h('div', null, h('p', { className: 'eyebrow' }, 'Mise en place'), h('h2', null, 'Ingrédients'))
        ),
        needsInlineVariantSelection && h('div', { className: 'inline-choice-card' },
          h('strong', null, 'Choix de préparation'),
          h('p', null, canShowSteps
            ? `Tu suis actuellement le bloc "${selectedGroupLabel}". Ouvre un autre bloc si tu changes de préparation.`
            : 'Ouvre un bloc ci-dessous pour afficher les ingrédients détaillés et les étapes correspondantes.')
        ),
        (selectedRecipe.ingredients || []).map((group, groupIndex) => {
          const groupKey = `${detailKey}:group:${groupIndex}`;
          const collapsible = isVariantIngredientGroup(group, selectedRecipe.ingredients || [], selectedRecipe);
          const isOpen = !collapsible || Boolean(openIngredientGroups[groupKey]);
          return h('div', { className: collapsible ? 'ingredient-group collapsible-ingredient-group' : 'ingredient-group', key: groupKey },
            collapsible
              ? h('button', { type: 'button', className: 'ingredient-group-toggle', onClick: () => toggleIngredientGroup(groupKey), 'aria-expanded': isOpen }, [
                  h('span', { key: 'label' }, group.group || 'Variante'),
                  h('span', { key: 'icon', className: 'ingredient-toggle-icon' }, isOpen ? '\u2212' : '+')
                ])
              : group.recipeId && recipesById[group.recipeId]
                ? h('button', { type: 'button', className: 'ingredient-group-link', onClick: () => openRecipe(group.recipeId) }, group.group || recipesById[group.recipeId].title)
                : h('h3', null, group.group || 'Base'),
            isOpen && h('ul', null, (group.items || []).map((item, itemIndex) => {
              const key = `${detailKey}:ingredient:${groupIndex}:${itemIndex}`;
              return h('li', { key },
                h('label', null,
                  h('input', { type: 'checkbox', checked: Boolean(checked[key]), onChange: () => toggle(key) }),
                  h('span', null, renderLinkedText(scaleIngredient(item, factor), inlineTargets, openRecipe))
                )
              );
            })),
            isOpen && (group.note || (group.notes || []).length > 0) && h('div', { className: 'ingredient-group-note' },
              group.note && h('p', null, renderLinkedText(group.note, inlineTargets, openRecipe)),
              (group.notes || []).map((note, noteIndex) => h('p', { key: `${groupKey}:note:${noteIndex}` }, renderLinkedText(note, inlineTargets, openRecipe)))
            )
          );
        })
      ),
      hasSelectedVariant && h('section', { className: mobileDetailTab === 'steps' ? 'recipe-panel steps-panel active-tab-panel' : 'recipe-panel steps-panel' },
        h('div', { className: 'panel-heading' },
          h('div', null, h('p', { className: 'eyebrow' }, 'Exécution'), h('h2', null, 'Étapes')),
          needsInlineVariantSelection && selectedGroupLabel && h('span', { className: 'progress-label' }, selectedGroupLabel)
        ),
        canShowSteps && h('div', { className: 'progress-track' }, h('span', { style: { width: `${progress}%` } })),
        canShowSteps && h('div', { className: 'before-start-card' },
          h('div', null,
            h('strong', null, 'Avant de commencer'),
            h('p', null, 'Consulte les notes, allergènes et points techniques avant de lancer la recette.')
          ),
          h('button', { type: 'button', onClick: () => setMobileDetailTab('notes') }, 'Voir les notes')
        ),
        !canShowSteps
          ? h('div', { className: 'choice-empty-state variant-step-empty' },
            h('strong', null, 'Choisis un groupe d’ingrédients'),
            h('p', null, 'Ouvre un groupe d’ingrédients pour afficher les étapes correspondantes.')
          )
          : h('ol', { className: 'step-list' },
          displaySteps.map((step, index) => {
            const key = `${detailKey}:step:${index}`;
            const minutes = getStepMinutes(step);
            return h('li', { key, className: checked[key] ? 'done' : '' },
              h('label', null,
                h('input', { type: 'checkbox', checked: Boolean(checked[key]), onChange: () => toggle(key) }),
                h('span', { className: 'step-number' }, String(index + 1).padStart(2, '0')),
                h('span', { className: 'step-text' }, renderLinkedText(step, inlineTargets, openRecipe))
              ),
              minutes > 0 && h('button', {
                type: 'button',
                className: 'step-timer',
                onClick: () => {
                  setNow(Date.now());
                  setTimerEnd(Date.now() + minutes * 60000);
                  setTimerLabel(`Étape ${index + 1}`);
                }
              }, `${minutes} min`)
            );
          })
        )
      ),
      hasSelectedVariant && h('aside', { className: mobileDetailTab === 'notes' ? 'recipe-panel notes-panel active-tab-panel' : 'recipe-panel notes-panel' },
        h('h2', { className: 'read-before-title' }, 'Avant de commencer'),
        h('div', { className: 'allergen-card' },
          h('p', { className: 'eyebrow' }, 'Allergènes'),
          recipeAllergens.length
            ? h('ul', { className: 'allergen-list' }, recipeAllergens.map(allergen => h('li', { key: `${detailKey}:allergen:${allergen}` }, allergen)))
            : h('p', { className: 'allergen-empty' }, 'Aucun allergène majeur détecté dans les ingrédients.')
        ),
        averageWeights.length > 0 && h('div', { className: 'average-weight-card' },
          h('p', { className: 'eyebrow' }, 'Poids moyens'),
          h('dl', null, averageWeights.map(item =>
            h(React.Fragment, { key: `${detailKey}:average:${item.label}` },
              h('dt', null, item.label),
              h('dd', null, item.value)
            )
          ))
        ),
        h(LinkedRecipesBlock, { links: linkedRecipes, openRecipe }),
        h(PracticalSectionsBlock, { sections: practicalSections }),
        h('p', { className: 'eyebrow' }, 'Notes'),
        h('h2', null, 'Astuces et liens'),
        displayNotes.length
          ? h('ul', null, displayNotes.map((note, index) => h('li', { key: `${detailKey}:note:${index}` }, renderLinkedText(sanitizeNoteHtml(note), inlineTargets, openRecipe))))
          : h('p', null, 'Aucune note pour cette recette.'),
        (selectedRecipe.technical || recipe.technical || []).length > 0 && h('div', { className: 'technical-card' },
          h('p', { className: 'eyebrow' }, 'Fiche technique'),
          h('dl', null, (selectedRecipe.technical || recipe.technical || []).map((item, index) =>
            h(React.Fragment, { key: `${detailKey}:technical:${index}` },
              h('dt', null, item.label || item.title || 'Point clé'),
              h('dd', null, item.value || item.text || '')
            )
          ))
        )
      )
    ),
    h(SharePanel, { open: shareOpen, onClose: () => setShareOpen(false), recipe: selectedRecipe })
  );
}

function App() {
  const rawRecipes = window.RECIPES && typeof window.RECIPES === 'object' ? window.RECIPES : {};
  const recipes = useMemo(() => {
    const baseRecipesById = Object.fromEntries(Object.entries(rawRecipes).map(([id, recipe]) => [id, { id, ...recipe }]));
    return Object.entries(rawRecipes).map(([id, recipe]) => {
      const tagsExtracted = extractTags(recipe);
      return { id, tagsExtracted, searchText: getRecipeSearchText(recipe, tagsExtracted, baseRecipesById), ...recipe };
    }).sort((a, b) => a.title.localeCompare(b.title, 'fr'));
  }, []);
  const recipesById = useMemo(() => Object.fromEntries(recipes.map(recipe => [recipe.id, recipe])), [recipes]);
  const homeCatalogRecipes = useMemo(() => recipes.filter(recipe => !recipe.master), [recipes]);
  const searchableRecipes = useMemo(() => recipes.filter(recipe => !isMasterRecipe(recipe)), [recipes]);
  const currentSeason = useMemo(() => getCurrentSeason(), []);

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [season, setSeason] = useState('');
  const [seasonCategory, setSeasonCategory] = useState('');
  const [collectionFilter, setCollectionFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(() => new URLSearchParams(window.location.search).get('view') === '__favs__');
  const [activeId, setActiveId] = useState(() => getInitialRecipe());
  const [variantSelection, setVariantSelection] = useState(() => {
    const recipe = getInitialRecipe();
    const variant = getInitialVariant();
    return recipe && variant ? { [recipe]: variant } : {};
  });
  const [favorites, setFavorites] = useState(() => readStoredList(STORAGE_KEYS.favorites, STORAGE_KEYS.legacyFavorites));
  const [recents, setRecents] = useState(() => readStoredList(STORAGE_KEYS.recents, STORAGE_KEYS.legacyRecents));
  const [shoppingIds, setShoppingIds] = useState(() => readStoredList(STORAGE_KEYS.shopping, []));
  const [shoppingFactors, setShoppingFactors] = useState(() => readJson(STORAGE_KEYS.shoppingFactors, {}));
  const [checked, setChecked] = useState({});
  const [historyVersion, setHistoryVersion] = useState(0);
  const [shoppingOpen, setShoppingOpen] = useState(false);
  const searchRef = useRef(null);
  const homeScrollRef = useRef(Number(sessionStorage.getItem(STORAGE_KEYS.homeScroll)) || 0);
  const restoreHomeScrollRef = useRef(false);
  const historyRef = useRef([{}]);
  const historyIndexRef = useRef(0);

  const activeRecipe = activeId ? recipesById[activeId] : null;
  const activeVariantId = activeRecipe ? variantSelection[activeRecipe.id] : '';
  const activeSeoRecipe = activeVariantId && recipesById[activeVariantId] ? recipesById[activeVariantId] : activeRecipe;
  const shoppingRecipes = useMemo(() => shoppingIds.map(id => recipesById[id]).filter(Boolean), [shoppingIds, recipesById]);
  const hasRecipeFilters = Boolean(query.trim() || season || seasonCategory || collectionFilter || tagFilter || onlyFavorites);
  const catalogRecipes = useMemo(() => hasRecipeFilters ? searchableRecipes : homeCatalogRecipes, [hasRecipeFilters, homeCatalogRecipes, searchableRecipes]);
  const allSeasons = useMemo(() => uniq([...SEASONS, ...searchableRecipes.flatMap(recipe => recipe.seasons || [])]).filter(item => item !== 'Toutes saisons'), [searchableRecipes]);
  const smartCollections = useMemo(() => SMART_COLLECTIONS.map(collection => ({
    ...collection,
    count: searchableRecipes.filter(recipe => recipeMatchesCollection(recipe, collection.id)).length
  })).filter(collection => collection.count > 0), [searchableRecipes]);
  const recentRecipe = useMemo(() => recents.map(id => recipesById[id]).find(Boolean) || null, [recents, recipesById]);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    if (!activeRecipe) return undefined;
    const forceTop = () => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };
    forceTop();
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      forceTop();
      secondFrame = requestAnimationFrame(forceTop);
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [activeRecipe?.id, activeVariantId]);

  useEffect(() => {
    updateDocumentMeta(activeSeoRecipe, recipesById);
  }, [activeSeoRecipe?.id, recipesById]);

  useEffect(() => {
    const handleScroll = () => {
      if (activeRecipe) return;
      const top = window.scrollY || 0;
      homeScrollRef.current = top;
      sessionStorage.setItem(STORAGE_KEYS.homeScroll, String(top));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeRecipe]);

  useEffect(() => {
    if (!activeRecipe?.master || isMasterRecipe(activeRecipe)) return;
    setVariantSelection(prev => ({ ...prev, [activeRecipe.master]: activeRecipe.id }));
    setActiveId(activeRecipe.master);
  }, [activeRecipe?.id]);

  function setCheckedWithHistory(next) {
    setChecked(prev => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      historyRef.current = [...historyRef.current.slice(0, historyIndexRef.current + 1), resolved];
      historyIndexRef.current = historyRef.current.length - 1;
      setHistoryVersion(value => value + 1);
      return resolved;
    });
  }

  function undo() {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    setChecked(historyRef.current[historyIndexRef.current]);
    setHistoryVersion(value => value + 1);
  }

  function redo() {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    setChecked(historyRef.current[historyIndexRef.current]);
    setHistoryVersion(value => value + 1);
  }

  const canUndo = historyVersion >= 0 && historyIndexRef.current > 0;
  const canRedo = historyVersion >= 0 && historyIndexRef.current < historyRef.current.length - 1;

  function updateSeason(value) {
    setSeason(value);
    if (!value) setSeasonCategory('');
  }

  const searchMeta = useMemo(() => {
    const needle = query.trim();
    const map = new Map();
    if (!needle) return map;
    searchableRecipes.forEach(recipe => {
      const meta = scoreRecipeSearch(recipe, needle, recipesById);
      if (meta.score > 0) map.set(recipe.id, meta);
    });
    return map;
  }, [query, searchableRecipes, recipesById]);

  const baseFilteredRecipes = useMemo(() => {
    let list = catalogRecipes.filter(recipe => {
      if (query.trim() && !searchMeta.has(recipe.id)) return false;
      if (season && !recipeHasSeason(recipe, season, recipesById)) return false;
      if (collectionFilter && !recipeMatchesCollection(recipe, collectionFilter)) return false;
      if (tagFilter && !(recipe.tagsExtracted || []).includes(tagFilter)) return false;
      if (onlyFavorites && !favorites.includes(recipe.id)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (query.trim()) {
        const score = (searchMeta.get(b.id)?.score || 0) - (searchMeta.get(a.id)?.score || 0);
        if (score) return score;
      }
      const order = homeCardOrder(a) - homeCardOrder(b);
      if (order) return order;
      return a.title.localeCompare(b.title, 'fr');
    });
    return list;
  }, [catalogRecipes, query, searchMeta, season, collectionFilter, tagFilter, onlyFavorites, favorites, recipesById]);

  const seasonCategoryOptions = useMemo(() => {
    if (!season) return [];
    return [
      { value: '', label: 'Tous', count: baseFilteredRecipes.length },
      ...SEASON_CATEGORY_FILTERS
        .map(item => ({
          ...item,
          count: baseFilteredRecipes.filter(recipe => recipeHasCategory(recipe, item.value)).length
        }))
        .filter(item => item.count > 0)
    ];
  }, [baseFilteredRecipes, season]);

  const filteredRecipes = useMemo(() => {
    if (!season || !seasonCategory) return baseFilteredRecipes;
    return baseFilteredRecipes.filter(recipe => recipeHasCategory(recipe, seasonCategory));
  }, [baseFilteredRecipes, season, seasonCategory]);

  useEffect(() => {
    if (!season && seasonCategory) {
      setSeasonCategory('');
      return;
    }
    if (seasonCategory && !seasonCategoryOptions.some(item => item.value === seasonCategory)) {
      setSeasonCategory('');
    }
  }, [season, seasonCategory, seasonCategoryOptions]);

  const sections = useMemo(() => {
    if (onlyFavorites) {
      return [{ key: 'favorites', kicker: 'Favoris', title: 'Recettes sauvegardées', recipes: filteredRecipes }];
    }
    if (season) {
      if (seasonCategory) {
        return [{ key: `season-${season}-${seasonCategory}`, kicker: categoryLabel(seasonCategory), title: `${categoryLabel(seasonCategory)} de saison : ${season}`, recipes: filteredRecipes }];
      }
      const grouped = new Map();
      filteredRecipes.forEach(recipe => {
        const category = seasonGroupCategory(recipe);
        if (!grouped.has(category)) grouped.set(category, []);
        grouped.get(category).push(recipe);
      });
      return [
        ...SEASON_CATEGORY_FILTERS
          .filter(item => grouped.has(item.value))
          .map(item => ({
            key: `season-${season}-${item.value}`,
            kicker: season === currentSeason ? 'Saison actuelle' : 'Saison',
            title: categoryLabel(item.value),
            recipes: grouped.get(item.value)
          })),
        ...Array.from(grouped.entries())
          .filter(([category]) => !SEASON_CATEGORY_FILTERS.some(item => item.value === category))
          .map(([category, recipes]) => ({
            key: `season-${season}-${category}`,
            kicker: 'Saison',
            title: categoryLabel(category),
            recipes
          }))
      ];
    }
    if (collectionFilter) {
      return [{ key: `collection-${collectionFilter}`, kicker: 'Collection', title: collectionLabel(collectionFilter), recipes: filteredRecipes }];
    }
    return [{ key: 'all-seasons', kicker: 'Toutes', title: 'Toutes les recettes', recipes: filteredRecipes }];
  }, [currentSeason, filteredRecipes, onlyFavorites, season, seasonCategory, collectionFilter]);
  const activeChips = [
    query && { key: 'query', label: `Recherche: ${query}`, clear: () => setQuery('') },
    season && { key: 'season', label: season, clear: () => updateSeason('') },
    seasonCategory && { key: 'seasonCategory', label: categoryLabel(seasonCategory), clear: () => setSeasonCategory('') },
    collectionFilter && { key: 'collection', label: collectionLabel(collectionFilter), clear: () => setCollectionFilter('') },
    tagFilter && { key: 'tag', label: `Tag: ${tagFilter}`, clear: () => setTagFilter('') },
    onlyFavorites && { key: 'favorites', label: 'Favoris', clear: () => setOnlyFavorites(false) }
  ].filter(Boolean);

  function persistFavorites(next) {
    setFavorites(next);
    writeJson(STORAGE_KEYS.favorites, next);
  }

  function toggleFavorite(id) {
    persistFavorites(favorites.includes(id) ? favorites.filter(item => item !== id) : [id, ...favorites]);
  }

  function persistShopping(next) {
    setShoppingIds(next);
    writeJson(STORAGE_KEYS.shopping, next);
  }

  function persistShoppingFactors(next) {
    setShoppingFactors(next);
    writeJson(STORAGE_KEYS.shoppingFactors, next);
  }

  function toggleShopping(id, factor = 1) {
    if (shoppingIds.includes(id)) {
      persistShopping(shoppingIds.filter(item => item !== id));
      const nextFactors = { ...shoppingFactors };
      delete nextFactors[id];
      persistShoppingFactors(nextFactors);
      return;
    }
    persistShopping([id, ...shoppingIds]);
    persistShoppingFactors({ ...shoppingFactors, [id]: factor });
  }

  function removeShopping(id) {
    persistShopping(shoppingIds.filter(item => item !== id));
    const nextFactors = { ...shoppingFactors };
    delete nextFactors[id];
    persistShoppingFactors(nextFactors);
  }

  function clearShopping() {
    persistShopping([]);
    persistShoppingFactors({});
  }

  function openRecipe(id) {
    const target = recipesById[id];
    if (!target) return;
    if (!activeRecipe) {
      homeScrollRef.current = window.scrollY || 0;
      sessionStorage.setItem(STORAGE_KEYS.homeScroll, String(homeScrollRef.current));
    }
    restoreHomeScrollRef.current = false;
    const parentId = target.master && !isMasterRecipe(target) ? target.master : id;
    if (target.master && !isMasterRecipe(target)) {
      setVariantSelection(prev => ({ ...prev, [parentId]: id }));
    } else {
      setVariantSelection(prev => {
        const next = { ...prev };
        delete next[parentId];
        return next;
      });
    }
    setActiveId(parentId);
    setOnlyFavorites(false);
    const nextRecents = [parentId, ...recents.filter(item => item !== parentId)].slice(0, 12);
    setRecents(nextRecents);
    writeJson(STORAGE_KEYS.recents, nextRecents);
    const nextUrl = getRecipeUrl(parentId, target.master ? id : '');
    if (window.location.pathname + window.location.search !== nextUrl) {
      history.pushState('', document.title, nextUrl);
    }
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  }

  function selectVariant(parentId, variantId) {
    if (!variantId) {
      setVariantSelection(prev => {
        const next = { ...prev };
        delete next[parentId];
        return next;
      });
      const parentUrl = getRecipeUrl(parentId);
      if (window.location.pathname + window.location.search !== parentUrl) history.pushState('', document.title, parentUrl);
      return;
    }
    setVariantSelection(prev => ({ ...prev, [parentId]: variantId }));
    const nextUrl = getRecipeUrl(parentId, variantId);
    if (window.location.pathname + window.location.search !== nextUrl) history.pushState('', document.title, nextUrl);
  }

  function goHome() {
    restoreHomeScrollRef.current = Boolean(activeRecipe);
    setActiveId(null);
    history.pushState('', document.title, '/');
  }

  function showFavorites() {
    setOnlyFavorites(true);
    setActiveId(null);
    history.pushState('', document.title, '/?view=__favs__');
    setTimeout(() => document.getElementById('recettes')?.scrollIntoView({ behavior: 'smooth' }), 0);
  }

  function updateSearchQuery(value) {
    setQuery(value);
  }

  function openSearch() {
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 0);
  }

  useEffect(() => {
    const handleLocation = () => {
      const recipe = getInitialRecipe();
      const variant = getInitialVariant();
      if (recipe && !activeId) {
        homeScrollRef.current = Math.max(window.scrollY || 0, homeScrollRef.current || 0);
        restoreHomeScrollRef.current = false;
      }
      setOnlyFavorites(new URLSearchParams(window.location.search).get('view') === '__favs__');
      setActiveId(recipe);
      if (!recipe) restoreHomeScrollRef.current = true;
      if (recipe && variant) {
        setVariantSelection(prev => ({ ...prev, [recipe]: variant }));
      } else if (recipe) {
        setVariantSelection(prev => {
          const next = { ...prev };
          delete next[recipe];
          return next;
        });
      }
    };
    window.addEventListener('hashchange', handleLocation);
    window.addEventListener('popstate', handleLocation);
    return () => {
      window.removeEventListener('hashchange', handleLocation);
      window.removeEventListener('popstate', handleLocation);
    };
  }, [activeId]);

  useEffect(() => {
    if (activeRecipe || !restoreHomeScrollRef.current) return;
    restoreHomeScrollRef.current = false;
    const top = homeScrollRef.current || 0;
    let attempts = 0;
    const restore = () => {
      window.scrollTo({ top, behavior: 'auto' });
      attempts += 1;
      if (attempts < 8 && Math.abs((window.scrollY || 0) - top) > 2) requestAnimationFrame(restore);
    };
    requestAnimationFrame(() => requestAnimationFrame(restore));
  }, [activeRecipe]);

  useEffect(() => {
    const handleGoto = event => {
      const target = event.target.closest('[data-goto]');
      if (!target) return;
      const id = target.getAttribute('data-goto');
      if (!recipesById[id]) return;
      event.preventDefault();
      openRecipe(id);
    };
    document.addEventListener('click', handleGoto);
    return () => document.removeEventListener('click', handleGoto);
  }, [recipesById]);

  useEffect(() => {
    const handleKey = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openSearch();
        return;
      }
      if (event.key === 'Escape') {
        if (searchOpen) {
          setSearchOpen(false);
          return;
        }
        if (activeRecipe && !isTypingTarget(event.target)) goHome();
        return;
      }
      if (isTypingTarget(event.target)) return;
      if (activeRecipe && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        undo();
        return;
      }
      if (activeRecipe && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        redo();
        return;
      }
      if (event.key.toLowerCase() === 'h') {
        goHome();
        return;
      }
      if (activeRecipe && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        const index = catalogRecipes.findIndex(recipe => recipe.id === activeRecipe.id);
        if (index === -1 || !catalogRecipes.length) return;
        const nextIndex = event.key === 'ArrowLeft'
          ? (index - 1 + catalogRecipes.length) % catalogRecipes.length
          : (index + 1) % catalogRecipes.length;
        openRecipe(catalogRecipes[nextIndex].id);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeRecipe, catalogRecipes, canUndo, canRedo, searchOpen]);

  if (!recipes.length) {
    return h('div', { className: 'mc-shell' },
      h('main', { className: 'fatal-state' },
        h('h1', null, 'Recettes introuvables'),
        h('p', null, 'Le fichier recipes.js doit définir window.RECIPES avant app.js.')
      )
    );
  }

  const filterProps = {
    seasons: allSeasons,
    season,
    setSeason: updateSeason,
    seasonCategory,
    setSeasonCategory,
    seasonCategoryOptions,
    collection: collectionFilter,
    setCollection: setCollectionFilter
  };

  return h('div', { className: 'mc-shell' },
    h(TopBarFixed, {
      onHome: goHome,
      shoppingCount: shoppingRecipes.length,
      showFavorites,
      openShoppingBasket: () => setShoppingOpen(true),
      query,
      openSearch
    }),
    h('nav', { className: 'mobile-bottom-nav', 'aria-label': 'Navigation mobile' },
      h('button', { type: 'button', onClick: goHome, 'aria-label': 'Accueil' }, h('span', null, '\u2302'), h('span', { className: 'sr-only' }, 'Accueil')),
      h('button', { type: 'button', onClick: openSearch, 'aria-label': 'Recherche' }, h('span', null, '\u2315'), 'Recherche'),
      h('button', { type: 'button', onClick: showFavorites, 'aria-label': 'Favoris' }, h('span', null, '\u2665'), 'Favoris'),
      h('button', { type: 'button', onClick: () => setShoppingOpen(true), 'aria-label': 'Courses' }, h('span', null, '\u25a4'), 'Courses')
    ),
    activeRecipe
      ? h(RecipeView, {
          recipe: activeRecipe,
          isFavorite: favorites.includes(variantSelection[activeRecipe.id] || activeRecipe.id),
          toggleFavorite,
          shoppingIds,
          toggleShopping,
          openShoppingBasket: () => setShoppingOpen(true),
          goHome,
          openRecipe,
          recipes,
          recipesById,
          checked,
          setCheckedWithHistory,
          canUndo,
          canRedo,
          undo,
          redo,
          setTagFilter,
          selectedVariantId: variantSelection[activeRecipe.id],
          onVariantChange: selectVariant
        })
      : h(HomeView, {
          favorites,
          sections,
          recipesById,
          onlyFavorites,
          activeChips,
          showDashboard: !query.trim() && !season && !collectionFilter && !tagFilter && !onlyFavorites,
          currentSeason,
          recentRecipe,
          shoppingCount: shoppingRecipes.length,
          showFavorites,
          openShoppingBasket: () => setShoppingOpen(true),
          showSmartCollections: !query.trim() && !season && !tagFilter && !onlyFavorites,
          smartCollections,
          filterProps,
          toggleFavorite,
          openRecipe,
          clearFavoriteView: () => setOnlyFavorites(false),
          setTagFilter
        }),
    h(ShoppingBasketPanel, {
      open: shoppingOpen,
      onClose: () => setShoppingOpen(false),
      recipes: shoppingRecipes,
      factorById: shoppingFactors,
      removeRecipe: removeShopping,
      clearShopping
    }),
    h(SearchPanel, {
      open: searchOpen,
      onClose: () => setSearchOpen(false),
      query,
      setQuery: updateSearchQuery,
      searchRef,
      results: filteredRecipes,
      resultMeta: searchMeta,
      openRecipe
    })
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(App));

requestAnimationFrame(() => {
  if (window.__cookNoteReady) {
    window.__cookNoteReady();
    return;
  }
  document.getElementById('loading-screen')?.remove();
});

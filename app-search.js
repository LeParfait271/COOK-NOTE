const RECIPE_SEARCH_TEXT_CACHE = new WeakMap();

function getRecipeSearchText(recipe, tags, recipesById = {}) {
  if (!recipe || typeof recipe !== 'object') return '';
  const cachedByCatalog = RECIPE_SEARCH_TEXT_CACHE.get(recipe);
  if (cachedByCatalog?.has(recipesById)) return cachedByCatalog.get(recipesById);
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
  const intents = getRecipeIntentLabels(recipe, recipesById).join(' ');
  const semanticText = semanticRecipeSignals(recipe, recipesById).labels.join(' ');
  const timing = getRecipeTiming(recipe);
  const timingText = [
    timing.active && `actif ${formatMinutesShort(timing.active)}`,
    timing.cook && `cuisson ${formatMinutesShort(timing.cook)}`,
    timing.rest && `repos ${formatMinutesShort(timing.rest)}`,
    ...getRecipeCardBadges(recipe, recipesById)
  ].filter(Boolean).join(' ');
  const variantsText = (recipe.variants || [])
    .map(variant => recipesById[variant.id])
    .filter(Boolean)
    .map(variantRecipe => getRecipeSearchText(variantRecipe, variantRecipe.tags || [], recipesById))
    .join(' ');
  const value = normalizeText([
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
    intents,
    semanticText,
    timingText,
    practicalText,
    linkedText,
    ...(recipe.steps || []),
    ...(recipe.notes || []),
    variantsText
  ].join(' '));
  const nextCache = cachedByCatalog || new WeakMap();
  nextCache.set(recipesById, value);
  if (!cachedByCatalog) RECIPE_SEARCH_TEXT_CACHE.set(recipe, nextCache);
  return value;
}

const SEARCH_SYNONYMS = {
  mayo: ['mayonnaise'],
  mayonaise: ['mayonnaise'],
  tirramissu: ['tiramisu'],
  tiramissu: ['tiramisu'],
  tirramisu: ['tiramisu'],
  bourssin: ['boursin', 'fromage frais'],
  boursain: ['boursin', 'fromage frais'],
  saintjacques: ['saint jacques', 'st jacques', 'noix de saint jacques'],
  jacque: ['jacques', 'saintjacques'],
  jacques: ['jacque', 'saintjacques'],
  sauce: ['dip', 'assaisonnement', 'condiment'],
  sauces: ['dip', 'assaisonnement', 'condiment'],
  dessert: ['sucré', 'sucre', 'gâteau', 'cake', 'biscuit'],
  gateau: ['gâteau', 'cake', 'dessert'],
  gâteau: ['gateau', 'cake', 'dessert'],
  biscuit: ['cookies', 'sablé', 'goûter'],
  biscuits: ['cookies', 'sablés', 'goûter'],
  cookie: ['cookies', 'biscuit'],
  cookies: ['cookie', 'biscuit'],
  patate: ['pomme de terre', 'pommes de terre', 'pdt'],
  patates: ['pomme de terre', 'pommes de terre', 'pdt'],
  pdt: ['pomme de terre', 'pommes de terre', 'patate'],
  pomme: ['pommes', 'pomme de terre'],
  terre: ['pomme de terre', 'pommes de terre'],
  fritte: ['frite', 'frites'],
  frite: ['frites', 'pomme de terre'],
  frites: ['frite', 'pomme de terre'],
  reste: ['restes', 'anti gaspillage', 'fond de frigo'],
  restes: ['reste', 'anti gaspillage', 'fond de frigo'],
  frigo: ['refrigerateur', 'froid', 'reste'],
  placard: ['simple', 'rapide', 'base'],
  soir: ['diner', 'rapide', 'familial'],
  diner: ['soir', 'plat', 'familial'],
  semaine: ['rapide', 'organisation', 'familial'],
  batch: ['organisation', 'la veille', 'a preparer a l avance'],
  airfryer: ['air fryer', 'four', 'croustillant'],
  plancha: ['poele', 'saisir', 'griller'],
  barbecue: ['griller', 'gril', 'ete'],
  bbq: ['barbecue', 'griller'],
  accompagnement: ['accompagnements', 'garniture'],
  garniture: ['accompagnement', 'topping'],
  topping: ['garniture', 'sauce'],
  toppings: ['garniture', 'sauces'],
  crevette: ['crevettes', 'gambas'],
  crevettes: ['crevette', 'gambas'],
  calamar: ['calamars', 'encornet'],
  calamars: ['calamar', 'encornets'],
  oeuf: ['œuf', 'oeufs', 'œufs'],
  oeufs: ['œufs', 'oeuf', 'œuf'],
  pate: ['pâte', 'pâtes', 'base'],
  pates: ['pâtes', 'pâte', 'farine'],
  base: ['bases', 'pâte', 'fond'],
  citronne: ['citron'],
  citronné: ['citron'],
  citronnee: ['citron'],
  choco: ['chocolat'],
  chocolat: ['choco', 'noir', 'lait'],
  chilli: ['chili'],
  chili: ['chilli', 'piment'],
  crisp: ['croustillant', 'piment'],
  croquant: ['croustillant', 'texture'],
  croustillant: ['croquant', 'crisp', 'friture'],
  moelleux: ['fondant', 'tendre', 'texture'],
  fondant: ['moelleux', 'cremeux', 'texture'],
  cremeux: ['creme', 'fondant', 'texture'],
  leger: ['aerien', 'frais', 'light', 'sain'],
  frais: ['leger', 'froid', 'citron', 'acidule'],
  sain: ['leger', 'vegetarien'],
  acidule: ['citron', 'vinaigre', 'frais'],
  epice: ['piment', 'chili', 'releve'],
  releve: ['epice', 'piment'],
  aerien: ['leger', 'mousseux'],
  fourre: ['garni', 'coeur', 'insert'],
  garni: ['fourre', 'garniture'],
  garnie: ['fourre', 'garniture'],
  facile: ['easy', 'simple', 'débutant'],
  simple: ['easy', 'facile'],
  rapide: ['express', 'vite'],
  express: ['rapide', 'vite'],
  veille: ['avance', 'repos', 'make ahead'],
  lendemain: ['veille', 'avance', 'repos'],
  avance: ['préparer à l avance', 'la veille', 'make ahead'],
  preparer: ['préparer', 'préparation', 'avance'],
  sanscuisson: ['sans cuisson', 'froid'],
  froid: ['réfrigérateur', 'sans cuisson'],
  chaud: ['cuisson', 'four', 'poêle'],
  cuisson: ['four', 'poêle', 'friture'],
  four: ['enfourner', 'rôtir', 'gratin'],
  poele: ['poêle', 'saisir', 'faire revenir'],
  poêle: ['poele', 'saisir', 'faire revenir'],
  friture: ['frire', 'beignet', 'tempura', 'frites'],
  legumes: ['légumes', 'vegetal', 'végétal'],
  legume: ['légume', 'légumes'],
  chou: ['chou-fleur', 'chou fleur', 'brocoli'],
  fleur: ['chou-fleur', 'chou fleur'],
  choufleur: ['chou-fleur', 'chou fleur'],
  brocoli: ['brocolis', 'sommités', 'fleurettes'],
  sommites: ['sommités', 'fleurettes', 'petits bouquets'],
  fleurettes: ['sommités', 'petits bouquets'],
  vegetariens: ['végétarien', 'vegetarien'],
  vegetarien: ['végétarien', 'sans viande'],
  viande: ['boeuf', 'porc', 'poulet'],
  boeuf: ['bœuf'],
  poulet: ['volaille'],
  congelable: ['congélation', 'congeler'],
  moyen: ['medium', 'intermédiaire'],
  difficile: ['hard', 'technique'],
  technique: ['geste', 'tour de main'],
  blanchir: ['blanchi', 'blanchiment'],
  chemiser: ['moule', 'papier cuisson'],
  torrefier: ['torréfier', 'torréfié'],
  deglacer: ['déglacer', 'sucs', 'sauce'],
  ruban: ['macaronner', 'texture ruban'],
  ete: ['été'],
  hiver: ['automne', 'réconfort'],
  familial: ['plat', 'four', 'gratin'],
  aperitif: ['apero', 'apéro'],
  apero: ['apéro', 'aperitif'],
  entree: ['entrée', 'entrées'],
  entrees: ['entrées', 'entrée'],
  petitdej: ['petit-déjeuner', 'petits-déjeuners'],
  brunch: ['petit-déjeuner', 'petits-déjeuners']
};

const SEARCH_STOPWORDS = new Set(['a', 'au', 'aux', 'avec', 'd', 'de', 'des', 'du', 'en', 'et', 'la', 'le', 'les', 'l', 'pour', 'un', 'une']);

function searchTokens(value) {
  return normalizeText(value)
    .replace(/\bsans\s+cuisson\b/g, 'sanscuisson')
    .replace(/\bla\s+veille\b/g, 'veille')
    .replace(/\bair\s+fryer\b/g, 'airfryer')
    .replace(/\bfond\s+de\s+frigo\b/g, 'frigo')
    .replace(/\bsoir\s+de\s+semaine\b/g, 'semaine')
    .replace(/\bchou\s+fleur\b/g, 'choufleur')
    .replace(/\bpomme\s+de\s+terre\b/g, 'pdt')
    .replace(/\bst[.\s-]*jacques?\b/g, 'saintjacques')
    .replace(/\bsaint[-\s]*jacques?\b/g, 'saintjacques')
    .split(/\s+/)
    .map(token => token.replace(/[^a-z0-9-]/g, '').trim())
    .filter(token => token.length > 1 && !SEARCH_STOPWORDS.has(token));
}

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

const RECIPE_SEARCH_SCORE_FIELDS_CACHE = new WeakMap();

function getRecipeSearchScoreFields(recipe, recipesById = {}) {
  const cached = RECIPE_SEARCH_SCORE_FIELDS_CACHE.get(recipe);
  if (cached) return cached;
  const title = normalizeText(recipe.title);
  const aliases = normalizeText((recipe.aliases || []).join(' '));
  const tags = normalizeText([...(recipe.tags || []), ...(recipe.tagsExtracted || [])].join(' '));
  const categories = normalizeText((recipe.categories || []).join(' '));
  const ingredients = normalizeText((recipe.ingredients || []).flatMap(group => [group.group, ...(group.items || [])]).join(' '));
  const practical = normalizeText(getRecipePracticalSections(recipe).flatMap(section => [section.title, ...section.items]).join(' '));
  const intents = normalizeText(getRecipeIntentLabels(recipe, recipesById).join(' '));
  const facets = normalizeText(getRecipeSearchFacets(recipe).join(' '));
  const badges = normalizeText(getRecipeCardBadges(recipe, recipesById).join(' '));
  const timing = getRecipeTiming(recipe);
  const timingText = normalizeText([
    timing.active && `temps actif ${formatMinutesShort(timing.active)}`,
    timing.cook && `cuisson ${formatMinutesShort(timing.cook)}`,
    timing.rest && `repos ${formatMinutesShort(timing.rest)}`
  ].filter(Boolean).join(' '));
  const linked = normalizeText(getLinkedRecipeRefs(recipe, recipesById).flatMap(item => [item.role, item.recipe.title]).join(' '));
  const steps = normalizeText((recipe.steps || []).join(' '));
  const notes = normalizeText([...(recipe.notes || []), ...(recipe.technical || []).flatMap(item => [item.label, item.value, item.text])].join(' '));
  const fields = [
    { name: 'titre', text: title, points: 120 },
    { name: 'alias', text: aliases, points: 90 },
    { name: 'tag', text: tags, points: 70 },
    { name: 'intention', text: intents, points: 68 },
    { name: 'usage', text: facets, points: 62 },
    { name: 'repere', text: `${badges} ${timingText}`, points: 58 },
    { name: 'catégorie', text: categories, points: 55 },
    { name: 'ingrédient', text: ingredients, points: 45 },
    { name: 'recette liée', text: linked, points: 34 },
    { name: 'pratique', text: practical, points: 28 },
    { name: 'étape', text: steps, points: 24 },
    { name: 'note', text: notes, points: 18 }
  ];
  const value = { title, fields };
  RECIPE_SEARCH_SCORE_FIELDS_CACHE.set(recipe, value);
  return value;
}

// « dessert sans four », « pâtes sans lardons » : chaque « sans X » ecarte les
// fiches qui utilisent X (ingredient, materiel ou geste), le reste de la
// requete est cherche normalement. « sans cuisson », « sans gluten »… restent
// des intentions gerees par la recherche semantique.
const SEARCH_EXCLUSION_INTENTS = new Set(['cuisson', 'gluten', 'viande', 'lactose']);
const SEARCH_EXCLUSION_PATTERNS = {
  four: /\b(four|enfourn\w*)\b/,
  friture: /\b(friture|frire|frit|frites)\b/
};

function splitSearchExclusions(normalizedQuery) {
  const excluded = [];
  const rest = normalizedQuery.replace(/\bsans\s+([a-z0-9-]{3,})/g, (match, word) => {
    if (SEARCH_EXCLUSION_INTENTS.has(word)) return match;
    excluded.push(word.replace(/s$/, ''));
    return ' ';
  }).replace(/\s+/g, ' ').trim();
  return { rest, excluded };
}

function recipeUsesExcluded(recipe, word) {
  const text = normalizeText([
    recipe.title,
    ...(recipe.ingredients || []).flatMap(group => group.items || []),
    ...(recipe.practical?.equipment || []),
    ...(recipe.steps || [])
  ].map(stripHtml).join(' '));
  const pattern = SEARCH_EXCLUSION_PATTERNS[word] || new RegExp(`\\b${word.replace(/[^a-z0-9-]/g, '')}s?\\b`);
  return pattern.test(text);
}

function scoreRecipeSearch(recipe, query, recipesById = {}) {
  const fullNeedle = normalizeText(query).trim();
  if (!fullNeedle) return { score: 0, reasons: [] };
  const { rest, excluded } = splitSearchExclusions(fullNeedle);
  if (excluded.some(word => recipeUsesExcluded(recipe, word))) return { score: 0, reasons: [] };
  if (!rest && excluded.length) return { score: 1, reasons: [] };
  const needle = rest || fullNeedle;
  const tokenGroups = expandSearchTokens(searchTokens(needle));
  if (!tokenGroups.length) return { score: 0, reasons: [] };
  const indexedText = recipe.searchText || getRecipeSearchText(recipe, recipe.tagsExtracted || recipe.tags || [], recipesById);
  const indexedMatch = tokenGroups.every(group => group.some(token => indexedText.includes(token) || isCloseSearchToken(token, indexedText)));
  if (!indexedMatch) return { score: 0, reasons: [] };
  const { title, fields } = getRecipeSearchScoreFields(recipe, recipesById);
  let score = 0;
  const reasons = new Set();
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
  const semantic = semanticRecipeSearchScore(recipe, needle, recipesById);
  if (semantic.score) {
    score += semantic.score;
    semantic.reasons.forEach(reason => reasons.add(reason));
  }
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


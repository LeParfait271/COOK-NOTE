function getCurrentSeason(date = new Date()) {
  let month = date.getMonth() + 1;
  if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
    try {
      month = Number(new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        month: 'numeric'
      }).format(date));
    } catch {
      month = date.getMonth() + 1;
    }
  }
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
  return canonicalCategory((recipe.categories || [])[0]) || 'Recette';
}

function categoryLine(recipe) {
  return (recipe.categories || []).filter(Boolean).map(canonicalCategory).join(' / ') || 'Recette';
}

function canonicalCategory(category) {
  const value = String(category || '').trim();
  return CATEGORY_ALIASES[value] || value;
}

function recipeCategories(recipe) {
  return [...new Set((recipe?.categories || []).filter(Boolean).map(canonicalCategory))];
}

function categoryLabel(category) {
  return SEASON_CATEGORY_FILTERS.find(item => item.value === category)?.label || category || 'Autres';
}

function recipeHasCategory(recipe, category) {
  if (!category) return true;
  return recipeCategories(recipe).includes(canonicalCategory(category));
}

function isCategoryCollectionRecipe(recipe) {
  if (!recipe) return false;
  return Object.values(CATEGORY_PARENT_IDS).includes(recipe.id) || recipe.masterType === 'collection';
}

function seasonGroupCategory(recipe) {
  const categories = recipeCategories(recipe);
  return SEASON_CATEGORY_FILTERS.find(item => categories.includes(item.value))?.value || categories[0] || 'Autres';
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
  const mouleToolPattern = /\b(?:beurrer|fariner|graisser|chemiser|huiler|foncer|remplir|garnir|preparer|utiliser|verser|poser|dans|sur)\s+(?:un|une|des|le|la|les)?\s*moules?\b|\bmoules?\s+a\s+(?:cake|tarte|manque|muffins?|charniere|savarin|gateau|gratin|ramequins?)\b/g;
  const molluskAllergenText = text.replace(mouleToolPattern, ' ');
  const allergens = new Set(explicit);
  const addIf = (label, pattern) => {
    if (pattern.test(text)) allergens.add(label);
  };

  const nutText = text.replace(/\bnoix de (?:coco|muscade)\b/g, ' ');
  addIf('Gluten', /\b(farine|ble|blé|froment|seigle|orge|avoine|epeautre|épeautre|malt|semoule|couscous|boulgour|chapelure|panko|pain|pains|brioche|brioches|bun|buns|pate a choux|pate sucree|pate a tarte|pates a tarte|pates|pâtes|nouilles|ravioles?|tortillas?)\b/);
  addIf('Œufs', /\b(oeuf|oeufs|œuf|œufs|jaune d oeuf|jaunes d oeufs|jaune d œuf|jaunes d œufs|blanc d oeuf|blancs d oeufs|blanc d œuf|blancs d œufs|mimosa)\b/);
  addIf('Lait', /\b(lait|lactose|babeurre|beurre|creme|crème|fromage|parmesan|comte|comté|cheddar|mozzarella|mascarpone|ricotta|yaourt|yogourt|feta|roquefort|chevre|chèvre|brie|mornay|chantilly)\b/);
  if (/\b(amande|amandes|noisette|noisettes|pistache|pistaches|noix|pecan|pécan|cajou|macadamia|praline|praliné|pralinoise|pignon|pignons)\b/.test(nutText)) allergens.add('Fruits à coque');
  addIf('Arachides', /\b(arachide|arachides|cacahuete|cacahuetes|cacahuète|cacahuètes|beurre de cacahuete|beurre de cacahuète)\b/);
  addIf('Soja', /\b(soja|sauce soja|tofu|miso|edamame|tamari)\b/);
  addIf('Moutarde', /\b(moutarde|graines de moutarde)\b/);
  addIf('Poisson', /\b(poisson|saumon|thon|cabillaud|anchois|sardine|dorade|bar|lieu|merlu|truite|maquereau|bouillabaisse|nuoc mam|sauce poisson)\b/);
  addIf('Crustacés', /\b(crevette|crevettes|crabe|homard|langoustine|langoustines|gambas|écrevisse|ecrevisse)\b/);
  if (/\b(calamar|calamars|chipiron|chipirons|palourde|palourdes|poulpe|encornet|encornets|saint jacques|saint-jacques|coquilles? saint jacques|coquilles? saint-jacques)\b/.test(molluskAllergenText)
    || /\bmoules?\s+(?:de bouchot|marinieres?|cuites?|crues?|nettoyees?|entieres?|decortiquees?)\b|\bchair de moules?\b/.test(molluskAllergenText)) {
    allergens.add('Mollusques');
  }
  addIf('Sésame', /\b(sesame|tahini|tahin)\b/);
  addIf('Sulfites', /\b(sulfite|sulfites|vin blanc|vin rouge|vinaigre de vin|vinaigre balsamique)\b/);
  addIf('Céleri', /\b(celeri|céleri|celeri rave|céleri rave|celeri-rave|céleri-rave)\b/);
  addIf('Lupin', /\b(lupin|farine de lupin)\b/);

  return uniq(Array.from(allergens));
}

function getRecipeIdentityText(recipe) {
  return normalizeText([
    recipe?.title,
    ...(recipe?.categories || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || [])
  ].map(stripHtml).join(' '));
}

function getRecipeInstructionText(recipe) {
  return normalizeText([
    ...(recipe?.steps || []),
    ...(recipe?.notes || [])
  ].map(stripHtml).join(' '));
}

function hasRecipeCategory(recipe, pattern) {
  return (recipe?.categories || []).some(category => pattern.test(normalizeText(category)));
}

function hasExplicitColdService(text) {
  const directServiceMatches = [...String(text || '').matchAll(/\b(servir|deguster|dresser|envoyer)\b(.{0,80})\b(froid|froide|frais|fraiche|fraiches|bien frais)\b/g)];
  return directServiceMatches.some(match => !/\bavec\b/.test(match[2]))
    || /\b(refrigerer|placer au frais|mettre au frais|reserver au frais|garder au frais)\b.{0,80}\bavant (de )?(servir|service|dresser|deguster)\b/.test(text);
}

function hasExplicitHotService(text) {
  return /\b(servir|deguster|dresser|envoyer)\b.{0,80}\b(chaud|chaude|brulant|brulante)\b/.test(text)
    || /\b(chaud|chaude|brulant|brulante)\b.{0,80}\b(servir|deguster|dresser|envoyer)\b/.test(text);
}

function hasColdServiceIdentity(identityText) {
  return /\b(terrine|rillettes|salade|crudites|gaspacho|gazpacho|tiramisu|mojito|mousse|chantilly|coulis|vinaigrette|mayonnaise|aioli|ricotta fouettee|brie farci|tomate mozzarella|oeufs mimosa)\b/.test(identityText);
}

function hasTemperateServiceIdentity(identityText) {
  return /\b(cake|pain|brioche|cookies|cookie|biscuit|spritz|madeleine|muffin|pancake|crepe|tarte|clafoutis)\b/.test(identityText);
}

function hasHotServiceIdentity(identityText) {
  return /\b(cassoulet|ragout|stew|cocotte|gratin|dhal|curry|poulet|boeuf|porc|agneau|saucisse|lentilles|haricots|pates|tagliatelles|crevettes|encornets|calamar|souffle|veloute|soupe|poelee)\b/.test(identityText);
}

function hasHotServicePriority(recipe, identityText) {
  if (hasColdServiceIdentity(identityText)) return false;
  return hasRecipeCategory(recipe, /\bplats?\b/) || hasHotServiceIdentity(identityText);
}

function getRecipeServiceTemperature(recipe, serviceText, identityText) {
  if (hasExplicitHotService(serviceText) || hasHotServicePriority(recipe, identityText)) return 'hot';
  if (hasExplicitColdService(serviceText) || hasColdServiceIdentity(identityText)) return 'cold';
  if (hasTemperateServiceIdentity(identityText)) return 'temperate';
  return '';
}

const RECIPE_RISK_SIGNAL_NOTES = Object.freeze({
  'Froid': 'Garder au froid jusqu’au service.',
  'Friture': 'Maintenir l’huile à bonne température et égoutter aussitôt.',
  'Mer': 'Vérifier la fraîcheur et la cuisson des produits de la mer.',
  'Viande': 'Vérifier la cuisson de la viande avant le service.',
  'Œufs crus': 'Utiliser des œufs très frais et conserver au froid.',
  'Conserve': 'Respecter l’hygiène et la conservation au froid.'
});

function formatRecipeRiskNote(signal) {
  return RECIPE_RISK_SIGNAL_NOTES[String(signal?.label || '')] || 'Vérifier ce point avant le service.';
}

function getRecipeRiskSignals(recipe) {
  const identityText = getRecipeIdentityText(recipe);
  const serviceText = getRecipeInstructionText(recipe);
  const ingredientText = normalizeText([
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])])
  ].map(stripHtml).join(' '));
  const riskText = normalizeText([
    recipe?.title,
    recipe?.yield,
    ...(recipe?.categories || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])]),
    ...(recipe?.steps || [])
  ].map(stripHtml).join(' '));
  const signals = [];
  const add = (label, level, pattern, sourceText = riskText) => {
    if (pattern.test(sourceText) && !signals.some(item => item.label === label)) signals.push({ label, level });
  };
  add('Conserve', 'high', /\b(sterilis|bocal|bocaux|conserve|pate de lapin|pate lapin|pate de campagne|terrine|rillettes|saindoux)\b/);
  if (!hasHotServicePriority(recipe, identityText) && (hasColdServiceIdentity(identityText) || hasExplicitColdService(serviceText)) && !signals.some(item => item.label === 'Froid')) {
    signals.push({ label: 'Froid', level: 'medium' });
  }
  add('Œufs crus', 'medium', /\b(mayonnaise|aioli|aïoli|rouille|oeuf cru|jaune cru)\b/);
  add('Friture', 'medium', /\b(friture|frire|beignet|tempura|huile a 160|huile a 180|huile a 190)\b/);
  add('Mer', 'medium', /\b(poisson|poissons|crevette|crevettes|calamar|calamars|encornet|encornets|crustace|crustaces)\b/, ingredientText);
  add('Viande', 'medium', /\b(porc|poulet|boeuf|bœuf|lapin|agneau|viande|gorge|foie|jambon|lardon|bacon|saucisse|chorizo)\b/, ingredientText);
  return signals;
}

function getRecipeServiceItems(recipe) {
  const practicalService = asTextList(recipe?.service || recipe?.practical?.service);
  const identityText = getRecipeIdentityText(recipe);
  const practicalServiceLooksCold = /froid|froide|frais|fraiche|fraiches/i.test(practicalService.join(' '));
  if (practicalService.length && !(hasHotServicePriority(recipe, identityText) && practicalServiceLooksCold)) return practicalService.slice(0, 4);
  const serviceText = getRecipeInstructionText(recipe);
  const text = normalizeText([
    recipe?.title,
    recipe?.yield,
    ...(recipe?.categories || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.steps || []),
    ...(recipe?.notes || [])
  ].map(stripHtml).join(' '));
  const items = [...practicalService];
  const add = item => {
    if (item && !items.includes(item)) items.push(item);
  };
  const serviceTemperature = getRecipeServiceTemperature(recipe, serviceText, identityText);
  const hasRestBeforeService = /\blaisser reposer\b.*\bavant (de )?serv(ir|ice)|\breposer \d+\s*(min|minutes)\b.*\bavant (de )?serv(ir|ice)/.test(text);
  if (/\bbeurre a l.?ail\b/.test(identityText)) {
    add("Servir tartinable après quelques minutes hors du froid, selon l’usage.");
  } else if (serviceTemperature === 'hot') {
    add(hasRestBeforeService ? 'Laisser reposer le temps indiqué, puis servir chaud.' : 'Servir chaud, juste après cuisson.');
  } else if (serviceTemperature === 'cold') {
    add('Servir frais, après le repos au froid indiqué.');
  } else if (serviceTemperature === 'temperate') {
    add('Servir tiède ou à température ambiante selon la texture recherchée.');
  }
  if (/\b(friture|frire|frites|beignet|tempura)\b/.test(text)) add('Saler et terminer juste avant le service pour préserver le croustillant.');
  if (/\b(chalumeau|meringue|zeste|herbes|fleur de sel|sucre glace)\b/.test(text)) add('Faire les finitions au dernier moment.');
  return items.slice(0, 4);
}

const AVERAGE_WEIGHT_RULES = [
  { label: 'Œuf moyen', value: '≈ 55g', pattern: /\b(oeuf|oeufs|œuf|œufs|oeufs entiers|œufs entiers|oeuf entier|œuf entier)\b/, except: /\b(jaunes?|blancs?) d['’ ]?(oeuf|oeufs)\b/ },
  { label: 'Jaune d’œuf', value: '≈ 18g', pattern: /\bjaunes? d['’ ]?(oeuf|oeufs)\b/ },
  { label: 'Blanc d’œuf', value: '≈ 30g', pattern: /\bblancs? d['’ ]?(oeuf|oeufs)\b/ },
  { label: 'Citron jaune', value: '≈ 100 à 120g', pattern: /\b(citron entier|citron jaune|citrons jaunes|citron bio|citron non traite|citron non traité|citron)\b/, except: /\b(jus|zeste|quartiers?|citron vert|lime|confit)\b/ },
  { label: 'Citron vert', value: '≈ 60 à 80g', pattern: /\b(citron vert|citrons verts|lime|limes)\b/, except: /\b(jus|zeste)\b/ },
  { label: 'Jus d’un citron vert', value: '≈ 20 à 30g', pattern: /\b(jus de citron vert|jus de lime)\b/ },
  { label: 'Jus d’un citron jaune', value: '≈ 40 à 50g', pattern: /\bjus de citron\b/, except: /\b(citron vert|lime)\b/ },
  { label: 'Gousse d’ail', value: '≈ 5g', pattern: /\b(gousse d ail|gousses d ail|ail)\b/ },
  { label: 'Oignon moyen', value: '≈ 100 à 120g', pattern: /\b(oignon|oignons)\b/ },
  { label: 'Échalote', value: '≈ 25 à 30g', pattern: /\b(echalote|echalotes)\b/ },
  { label: 'Tomate moyenne', value: '≈ 120g', pattern: /\b(tomate|tomates)\b/ },
  { label: 'Carotte moyenne', value: '≈ 100g', pattern: /\b(carotte|carottes)\b/ },
  { label: 'Pomme de terre moyenne', value: '≈ 150g', pattern: /\b(pomme de terre|pommes de terre)\b/ },
  { label: 'Patate douce moyenne', value: '≈ 250g', pattern: /\b(patate douce|patates douces)\b/ },
  { label: 'Avocat', value: '≈ 150g de chair', pattern: /\b(avocat|avocats)\b/ },
  { label: 'Poivron', value: '≈ 150 à 180g', pattern: /\b(poivron|poivrons)\b/ },
  { label: 'Melon moyen', value: '≈ 800g à 1kg', pattern: /\b(melon|melons|melon charentais)\b/, except: /\b(jus de melon|billes? de melon)\b/ },
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

const SPOON_WEIGHT_NOTE = 'Repère indicatif : cuillères rases pour les poudres et pâtes, liquides remplis à niveau.';

function formatGramRange(first, second = null) {
  if (second !== null && Number.isFinite(second) && Math.abs(second - first) > 0.01) {
    return `${formatNumber(first)} à ${formatNumber(second)}g`;
  }
  return `${formatNumber(first)}g`;
}

function spoonLabel(kind) {
  return kind === 'tablespoon' ? 'c. à soupe' : 'c. à café';
}

function spoonPrecisionLabel(rule) {
  const liquidLabels = new Set(['huile', 'eau / bouillon', 'lait / creme', 'vinaigre', 'jus de citron']);
  return liquidLabels.has(normalizeText(rule?.label)) ? 'à niveau' : 'rase';
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
  const precision = spoonPrecisionLabel(rule);
  const amountText = match[2]
    ? `${formatNumber(firstAmount)} à ${formatNumber(secondAmount)} ${spoonLabel(kind)} ${precision}`
    : `${formatNumber(firstAmount)} ${spoonLabel(kind)} ${precision}`;

  return {
    label: `${rule.label} (${amountText})`,
    value: `≈ ${formatGramRange(firstWeight, secondWeight)}`
  };
}

function shouldShowAverageWeightForLine(text) {
  if (/\b\d+(?:[.,]\d+)?\s*g\b/.test(text)) return true;
  return /^(?:\d+(?:[.,]\d+)?(?:\/\d+)?|une?|quelques|des)\s+(?!min\b|minutes?\b|g\b|kg\b|ml\b|cl\b|l\b|c\.?\b|cuill|pinc[eé]e\b|trait\b|filet\b)/.test(text);
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
      if (!shouldShowAverageWeightForLine(text)) return;
      AVERAGE_WEIGHT_RULES.forEach(rule => {
        if (rule.except?.test(text)) return;
        if (rule.pattern.test(text) && !found.has(rule.label)) found.set(rule.label, rule.value);
      });
    });
  });
  return Array.from(found, ([label, value]) => ({ label, value }));
}

function recipeHasSpoonMeasures(recipe) {
  return (recipe?.ingredients || []).some(group =>
    (group.items || []).some(item => Boolean(getSpoonMeasureInfo(item)))
  );
}

function getRecipeSteps(recipe) {
  return recipe?.steps || [];
}

function getIngredientGroupSteps(group) {
  return Array.isArray(group?.steps)
    ? group.steps.filter(step => typeof step === 'string' && step.trim())
    : [];
}

function getInlineVariantRule(recipe) {
  return window.COOK_NOTE_INLINE_VARIANT_RULES?.[recipe?.id] || null;
}

function getSelectedInlineVariantSteps(recipe, selectedInlineVariantGroup) {
  const selectedGroups = Array.isArray(selectedInlineVariantGroup?.groups)
    ? selectedInlineVariantGroup.groups
    : [selectedInlineVariantGroup?.group];
  const groupSteps = selectedGroups.flatMap(getIngredientGroupSteps);
  return groupSteps.length ? groupSteps : getRecipeSteps(recipe);
}

function getInlineVariantOptions(recipe) {
  if (!recipe?.variantGroups) return [];
  const groups = recipe.ingredients || [];
  const rule = getInlineVariantRule(recipe);
  if (rule?.options?.length) {
    return rule.options.map((option, position) => {
      const selectedGroups = option.groups.map(index => groups[index]).filter(Boolean);
      return {
        index: option.groups[0] ?? position,
        key: option.key || `variant-${position + 1}`,
        group: selectedGroups[0],
        groups: selectedGroups,
        label: repairMojibakeText(option.label || cleanVariantGroupLabel(selectedGroups[0]?.group)),
        steps: rule.useRecipeSteps ? getRecipeSteps(recipe) : getSelectedInlineVariantSteps(recipe, { groups: selectedGroups })
      };
    });
  }
  return groups
    .map((group, index) => ({ group, index }))
    .filter(({ group }) => isVariantIngredientGroup(group, groups, recipe))
    .map(option => ({
      ...option,
      label: cleanVariantGroupLabel(option.group?.group),
      steps: getSelectedInlineVariantSteps(recipe, option)
    }));
}

function getInlineBaseIngredientGroups(recipe) {
  const groups = recipe?.ingredients || [];
  const rule = getInlineVariantRule(recipe);
  if (rule?.sharedGroups) return rule.sharedGroups.map(index => groups[index]).filter(Boolean);
  return groups.filter(group => !isVariantIngredientGroup(group, groups, recipe));
}

function buildInlineVariantRecipe(recipe, option) {
  if (!recipe || !option) return recipe;
  const selectedGroups = Array.isArray(option.groups) ? option.groups : [option.group];
  const nestedGroup = selectedGroups.find(group => group?.recipe && typeof group.recipe === 'object');
  const nestedRecipe = nestedGroup?.recipe || {};
  const selectedIngredientGroups = selectedGroups.map(group => {
    const { recipe: _nestedRecipe, ...selectedGroup } = group || {};
    return selectedGroup;
  }).filter(group => group && Array.isArray(group.items));
  return {
    ...recipe,
    ...nestedRecipe,
    id: recipe.id,
    title: `${recipe.title} — ${option.label || 'Variante'}`,
    master: recipe.master,
    additionalMasters: recipe.additionalMasters,
    categories: recipe.categories,
    image: nestedRecipe.image || recipe.image,
    ingredients: [...getInlineBaseIngredientGroups(recipe), ...selectedIngredientGroups],
    steps: option.steps?.length ? option.steps : getSelectedInlineVariantSteps(recipe, option),
    variantGroups: false,
    inlineVariantResolved: true
  };
}

const INLINE_VARIANT_SHOPPING_SEPARATOR = '::inline::';

function inlineVariantShoppingKey(recipeId, optionIndex) {
  return `${recipeId}${INLINE_VARIANT_SHOPPING_SEPARATOR}${optionIndex}`;
}

function resolveShoppingRecipe(recipeId, recipesById = {}) {
  const [parentId, optionIndexText] = String(recipeId || '').split(INLINE_VARIANT_SHOPPING_SEPARATOR);
  if (optionIndexText === undefined) return recipesById[recipeId] || null;
  const parent = recipesById[parentId];
  if (!parent) return null;
  const optionIndex = Number(optionIndexText);
  const option = getInlineVariantOptions(parent).find(item => item.index === optionIndex);
  if (!option) return null;
  const selected = buildInlineVariantRecipe(parent, option);
  return {
    ...selected,
    id: recipeId,
    title: `${parent.title} — ${option.label}`
  };
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
  const count = getLeafVariantRefs(recipe, recipesById).length;
  return count || recipe?.leafCount || 0;
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

function countInlineVariantGroups(recipe) {
  if (!recipe?.variantGroups) return 0;
  const groups = recipe.ingredients || [];
  return groups.filter(group => isVariantIngredientGroup(group, groups, recipe)).length;
}

function getRecipeVariantLabel(recipe) {
  if (isMasterRecipe(recipe)) return '';
  const count = countInlineVariantGroups(recipe);
  if (!count) return '';
  return `${count} variante${count > 1 ? 's' : ''}`;
}

function getCatalogRecipeStats(recipes) {
  const loadedFicheCount = recipes.filter(recipe => !isMasterRecipe(recipe)).length;
  const loadedVariantCount = recipes.reduce((sum, recipe) => {
    if (isMasterRecipe(recipe)) return sum;
    return sum + countInlineVariantGroups(recipe);
  }, 0);
  const ficheCount = Math.max(loadedFicheCount, Number(INITIAL_CATALOG_STATS.ficheCount) || 0);
  const variantCount = Math.max(loadedVariantCount, Number(INITIAL_CATALOG_STATS.variantCount) || 0);
  return {
    ficheCount,
    variantCount,
    label: `${ficheCount} fiche${ficheCount > 1 ? 's' : ''} + ${variantCount} variante${variantCount > 1 ? 's' : ''}`
  };
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
  const directCounts = Array.from({ length: Math.min(12, max) }, (_, index) => index + 1);
  return uniq([...directCounts, 14, 16, 18, 20, 24, base, base * 2]
    .filter(value => Number.isFinite(value) && value >= 1 && value <= max)
    .map(String))
    .map(Number)
    .sort((a, b) => a - b);
}

function menuServingFactorFor(recipe, peopleCount = 4) {
  const count = Math.max(1, Number(peopleCount) || 4);
  const info = getServingInfo(recipe);
  if (info && ['personne', 'portion', 'part'].includes(info.unit)) return count / info.base;
  return count / 4;
}

function menuFactorMapFor(recipes, peopleCount = 4) {
  return (recipes || []).reduce((map, recipe) => {
    if (recipe?.id) map[recipe.id] = menuServingFactorFor(recipe, peopleCount);
    return map;
  }, {});
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<span\b[^>]*data-goto=(["'])([^"']+)\1[^>]*>(.*?)<\/span>/gi, '$3')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
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
  const cleanText = stripHtml(text);
  if (factor === 1) return cleanText;
  const parts = splitShoppingIngredientParts(cleanText);
  if (parts.length > 1) return parts.map(part => scaleIngredient(part, factor)).join(', ');
  const match = String(cleanText).match(/^(\d+(?:[.,]\d+)?(?:\/\d+)?)(\s*(?:[\u2013\u2014-]|à|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?(.*)$/i);
  if (!match) return cleanText;
  const first = parseAmount(match[1]);
  const second = match[3] ? parseAmount(match[3]) : null;
  if (!Number.isFinite(first)) return cleanText;
  const rest = scaleParentheticalAmounts(match[4], factor);
  if (second !== null && Number.isFinite(second)) {
    const separator = match[2].slice(0, match[2].length - match[3].length);
    return `${formatNumber(first * factor)}${separator}${formatNumber(second * factor)}${rest}`;
  }
  return `${formatNumber(first * factor)}${rest}`;
}

// Separe la quantite (nombre et unite de mesure) du nom de l'ingredient pour
// l'affichage en deux colonnes. Un nom compte (4 gousses d'ail) reste a droite.
const INGREDIENT_QUANTITY_RE = /^(?:≈\s*)?(?:\d+(?:[.,]\d+)?(?:\/\d+)?|[½¼¾⅓⅔])(?:\s*(?:[–—-]|à)\s*\d+(?:[.,]\d+)?(?:\/\d+)?)?\s*(?:(?:kg|mg|g|cl|dl|ml|l|cs|cc)(?=[\s,(]|$)|c\.\s*à\s*(?:soupe|café|s\.|c\.)|cuill[eè]res?\s+à\s+(?:soupe|café)|pinc[ée]es?(?=[\s,(]|$)|verres?(?=[\s,(]|$)|sachets?(?=[\s,(]|$))?(?=[\s,(]|$)/i;

function splitIngredientQuantity(text) {
  const value = String(text || '').trim();
  const match = value.match(INGREDIENT_QUANTITY_RE);
  if (!match) return null;
  const name = value.slice(match[0].length).replace(/^[\s,]+/, '');
  if (!name) return null;
  return { quantity: match[0].trim(), name };
}

// Liens ingredients <-> etapes : mots porteurs du nom d'un ingredient, compares
// aux mots de chaque etape (pluriel simple ignore).
const INGREDIENT_LINK_STOPWORDS = new Set(('de du des la le les au aux et ou en un une pour avec sans sur selon gout '
  + 'frais fraiche fraiches hache hachee haches hachees cisele ciselee ciseles rape rapee rapes coupe coupee coupes '
  + 'fin fine fines gros grosse grosses petit petite petits petites moyen moyenne moyens entier entiere entiers mou molle '
  + 'doux douce sec seche secs seches tiede froid froide chaud chaude option optionnel optionnelle facultatif environ bio '
  + 'nature blanc blanche blancs noir noire rouge rouges vert verte verts jaune jaunes liquide epais epaisse pincee pincees '
  + 'tranche tranches morceau morceaux branche branches brin brins feuille feuilles gousse gousses bouquet botte zeste jus '
  + 'poudre moulu moulue cuit cuite cuits cru crue trempe trempes confit confite confites emince emincee emincees fondu fondue '
  + 'extra vierge qualite type maison base reste pate').split(' '));

function ingredientLinkStem(word) {
  return word.length > 4 ? word.replace(/(?:s|x)$/, '') : word;
}

function ingredientLinkWords(text) {
  return [...new Set(normalizeText(stripHtml(text)).split(/[^a-z0-9]+/)
    .filter(word => word.length >= 3 && !INGREDIENT_LINK_STOPWORDS.has(word) && !/^\d/.test(word))
    .map(ingredientLinkStem))];
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


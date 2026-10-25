function getStepMinutes(step) {
  const text = normalizeText(step);
  const hourMatch = text.match(/(\d+(?:[.,]\d+)?)\s*h/);
  if (hourMatch) return Math.round(parseAmount(hourMatch[1]) * 60);
  const minuteMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:min|minute)/);
  if (minuteMatch) return Math.round(parseAmount(minuteMatch[1]));
  return 0;
}

function getRecipeTiming(recipe) {
  const steps = getRecipeSteps(recipe);
  const stepText = normalizeText(steps.join(' '));
  const timedSteps = steps.map(getStepMinutes).filter(minutes => minutes > 0);
  const totalTimed = timedSteps.reduce((sum, minutes) => sum + minutes, 0);
  const restMinutes = steps
    .filter(step => /\b(repos|reposer|refroidir|refrigerateur|froid|pousse|lever|mariner)\b/.test(normalizeText(step)))
    .map(getStepMinutes)
    .reduce((sum, minutes) => sum + minutes, 0);
  const cookMinutes = steps
    .filter(step => /\b(cuire|cuisson|four|enfourner|frire|friture|poele|mijoter|fremir|griller|rotir|saisir)\b/.test(normalizeText(step)))
    .map(getStepMinutes)
    .reduce((sum, minutes) => sum + minutes, 0);
  const activeEstimate = Math.max(5, Math.min(90, Math.round((countIngredients(recipe) * 2.2) + (steps.length * 2.5))));
  const explicitActive = Number(recipe?.activeTime);
  const explicitCook = Number(recipe?.cookTime);
  const explicitRest = Number(recipe?.restTime);
  const explicitTotal = Number(recipe?.totalTime);
  const active = Number.isFinite(explicitActive) && explicitActive > 0 ? explicitActive : activeEstimate;
  const cook = Number.isFinite(explicitCook) && explicitCook > 0
    ? explicitCook
    : (cookMinutes || (totalTimed && !restMinutes ? totalTimed : 0));
  const rest = Number.isFinite(explicitRest) && explicitRest > 0 ? explicitRest : restMinutes;
  return {
    active,
    cook,
    rest,
    total: Number.isFinite(explicitTotal) && explicitTotal > 0 ? explicitTotal : active + cook + rest,
    hasOven: /\b(four|enfourner|rotir|gratin|plaque)\b/.test(stepText),
    hasFry: /\b(friture|frire|bain d huile|tempura|beignet)\b/.test(stepText),
    hasCold: /\b(refrigerateur|froid|refroidir|repos)\b/.test(stepText)
  };
}

function formatMinutesShort(minutes) {
  if (!minutes) return '';
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest ? `${hours}h${String(rest).padStart(2, '0')}` : `${hours}h`;
  }
  return `${minutes} min`;
}

function minutesToIsoDuration(minutes) {
  const value = Math.max(0, Math.round(Number(minutes) || 0));
  if (!value) return undefined;
  const hours = Math.floor(value / 60);
  const rest = value % 60;
  return `PT${hours ? `${hours}H` : ''}${rest ? `${rest}M` : ''}`;
}

function getRecipeCardBadges(recipe, recipesById = {}) {
  if (isMasterRecipe(recipe)) return [];
  const timing = getRecipeTiming(recipe);
  const text = normalizeText([
    recipe.title,
    ...(recipe.categories || []),
    ...(recipe.tags || []),
    ...(recipe.steps || []),
    ...(recipe.notes || []),
    getRecipePracticalSections(recipe).flatMap(section => section.items).join(' ')
  ].join(' '));
  const badges = [];
  if (timing.hasOven) badges.push('Four');
  if (timing.hasFry) badges.push('Friture');
  if (timing.rest || timing.hasCold) badges.push('Repos');
  if (/\b(veille|avance|conserver|congel|refrigerateur)\b/.test(text)) badges.push('\u00c0 l\u2019avance');
  if (/\b(base|technique|pate|creme|sauce|fond)\b/.test(text) || (recipe.categories || []).some(category => normalizeText(category).includes('base'))) badges.push('Base');
  if ((recipe.variants || []).length || getRecipeVariantLabel(recipe, recipesById)) badges.push('Variante');
  return uniq(badges).slice(0, 3);
}

const MENU_COMPONENT_IDS = new Set([
  'aioli_citronne_leger',
  'babeurre_maison',
  'balsamique_reduit',
  'base_pour_flan_sale',
  'beurre_ail',
  'beurre_clarifie',
  'beurre_d_escargot_persille',
  'chantilly_classique',
  'chantilly_gelatine',
  'court_bouillon',
  'craquelin_cacao',
  'creme_beurre_meringue_italienne',
  'creme_citron_lemon_curd',
  'creme_diplomate_cloud',
  'creme_diplomate_vanille',
  'creme_mascarpone_vanille',
  'creme_patissiere_praline',
  'creme_patissiere_vanille',
  'creme_pistache',
  'huile_pimentee_pizza',
  'marinades',
  'mascarpone',
  'meringue_italienne',
  'meringues',
  'pain_hot_dog',
  'pains_burgers_brioche',
  'pate_choux',
  'pate_legere_beignets_calamar_crevettes',
  'pate_sucree',
  'pates_tarte_variantes',
  'pesto_tomates_sechees_sans_cajou',
  'ricotta_fouettee',
  'rouille',
  'sauce_aux_poivres',
  'sauce_caramel',
  'sauce_mornay',
  'sauce_yaourt_citronnee',
  'tempura_beignets_calamar_crevettes',
  'toppings_frites',
  'vinaigrette'
]);

const MENU_SIDE_IDS = new Set([
  'frites',
  'frites_belges',
  'frites_maison',
  'frites_patate_douce',
  'gratin_chou_fleur',
  'gratin_dauphinois',
  'lentilles_a_la_bourguignonne',
  'puree_courge_butternut',
  'puree_pommes_de_terre_citron',
  'riz_au_citron',
  'riz_cantonnais',
  'tomates_provencales'
]);

const MENU_STARTER_IDS = new Set([
  'billes_mozzarella_marinees',
  'brie_farci_fruits_secs_noix',
  'cake_tomate_chorizo_feta',
  'chorizo_au_cidre',
  'cookies_sales_variantes',
  'rillettes_porc',
  'rillettes_poulet',
  'salade_avocat_oeuf_epinards',
  'salade_melon_mozzarella_jambon_cru',
  'terrine_campagne',
  'terrine_porc_pistaches',
  'tomates_variantes'
]);

const MENU_COMPONENT_PATTERNS = [
  /\b(base|fond|fonds|appareil|insert|garniture|fourrage)\b/,
  /\b(pate|pates|pâte|pâtes|pate a tarte|pâte à tarte|pate sucree|pâte sucrée|pate a choux|pâte à choux)\b/,
  /\b(creme|crème|ganache|chantilly|mascarpone|diplomate|patissiere|pâtissière|curd|meringue)\b/,
  /\b(sauce|coulis|pesto|vinaigrette|aioli|aïoli|rouille|marinade|sirop|caramel|topping|condiment)\b/,
  /\b(beurre aromatise|beurre aromatisé|beurre clarifie|beurre clarifié|babeurre|levain|poolish)\b/,
  /\b(pain burger|pain hot dog|bun|buns|tortilla|chapelure|croûtons|croutons)\b/
];

function getMenuRecipeProfile(recipe) {
  const text = normalizeText([
    recipe?.title,
    ...(recipe?.categories || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])])
  ].join(' '));
  const categories = (recipe?.categories || []).map(normalizeText);
  const hasCategory = value => categories.includes(normalizeText(value));
  const families = [];
  const addFamily = family => {
    if (!families.includes(family)) families.push(family);
  };
  if (/\b(riz|pates|pate|pommes? de terre|pdt|frites|puree|gratin dauphinois|pain|bun|lentilles)\b/.test(text)) addFamily('starch');
  if (/\b(poulet|volaille|boeuf|bœuf|porc|agneau|saucisse|chorizo|jambon|bacon|lapin)\b/.test(text)) addFamily('meat');
  if (/\b(poisson|cabillaud|saumon|thon|calamar|crevettes?|chipirons?)\b/.test(text)) addFamily('fish');
  if (/\b(legume|légume|courge|butternut|chou|tomate|salade|melon|betterave|carotte|avocat|epinards|épinards)\b/.test(text)) addFamily('vegetable');
  if (/\b(sauce|pesto|aioli|aïoli|mornay|rouille|vinaigrette|beurre|caramel|toppings)\b/.test(text)) addFamily('sauce');
  if (/\b(dessert|gateau|gâteau|gouter|goûter|cookies|tiramisu|creme|crème|tarte|flan|clafoutis|cerise|chocolat)\b/.test(text)) addFamily('dessert');
  if (/\b(apero|apéro|entree|entrée|brie|billes|oeufs|œufs|terrine|rillettes|cake sale|cake salé)\b/.test(text)) addFamily('starter');
  const explicitComponent = MENU_COMPONENT_IDS.has(recipe?.id);
  const explicitSide = MENU_SIDE_IDS.has(recipe?.id);
  const explicitStarter = MENU_STARTER_IDS.has(recipe?.id);
  const hasProtein = families.includes('meat') || families.includes('fish');
  const baseComponent = hasCategory('Base') || hasCategory('Sauces') || MENU_COMPONENT_PATTERNS.some(pattern => pattern.test(text));
  const servedStarter = explicitStarter || hasCategory('Apero') || hasCategory('Apéro') || hasCategory('Entrees') || hasCategory('Entrées');
  const servedSide = explicitSide || (hasCategory('Accompagnements') && !hasCategory('Plats'));
  const servedDessert = hasCategory('Desserts') && !hasCategory('Base') && !hasCategory('Sauces');
  const isComponent = explicitComponent || (baseComponent && !servedStarter && !servedSide && !servedDessert && !hasCategory('Plats'));
  const isDessert = !isComponent && servedDessert && !hasProtein;
  const isSauce = !isComponent && hasCategory('Sauces') && !hasProtein && !hasCategory('Desserts');
  const isStarter = !isComponent && servedStarter;
  const isSide = !isComponent && servedSide;
  const isCompleteMain = !isComponent && !isSide && !isStarter && (hasCategory('Plats') || hasProtein || /\b(curry|plat|croque|lentilles tomate)\b/.test(text));
  return {
    families,
    role: isComponent ? 'component' : isDessert ? 'dessert' : isSauce ? 'sauce' : isStarter ? 'starter' : isSide ? 'side' : isCompleteMain ? 'main' : families.includes('vegetable') || families.includes('starch') ? 'side' : 'other',
    heavy: families.includes('starch'),
    protein: hasProtein,
    servable: !isComponent,
    text
  };
}

const MENU_THEMES = [
  {
    id: 'bistrot',
    label: 'Bistrot',
    pitch: 'Classique chaud, sauce lisible, dessert de pâtisserie.',
    prefer: /\b(poulet|boeuf|bœuf|porc|gratin|mornay|poivre|moutarde|terrine|rillettes|tarte|flan|creme|crème)\b/,
    avoid: /\b(gazpacho|melon|air fryer|tempura|pesto)\b/
  },
  {
    id: 'mediterraneen',
    label: 'Méditerranéen',
    pitch: 'Tomate, citron, huile d’olive, herbes et fraîcheur.',
    prefer: /\b(tomate|citron|basilic|olive|pesto|poisson|saumon|cabillaud|melon|mozzarella|yaourt)\b/,
    avoid: /\b(mornay|poivre|gratin dauphinois|rhum|caramel)\b/
  },
  {
    id: 'semaine',
    label: 'Soir de semaine',
    pitch: 'Simple, rapide, peu de gestes et courses raisonnables.',
    prefer: /\b(rapide|facile|simple|poele|poêle|four|riz|pates|pâtes|poulet|salade)\b/,
    avoid: /\b(24h|la veille|maturation|terrine|macaron|pate a choux|pâte à choux)\b/
  },
  {
    id: 'invites',
    label: 'Invités',
    pitch: 'Préparable, équilibré, avec un dessert qui tient bien.',
    prefer: /\b(la veille|repos|conservation|terrine|brie|carre|carré|tiramisu|tarte|flan|clafoutis)\b/,
    avoid: /\b(frites|air fryer|croque|riz cantonnais)\b/
  },
  {
    id: 'apero',
    label: 'Apéro dînatoire',
    pitch: 'Petites pièces, dips, fromages et choses à picorer.',
    prefer: /\b(apero|apéro|brie|billes|rillettes|terrine|cake sale|cake salé|chorizo|dip|sauce|toppings)\b/,
    avoid: /\b(gratin|pates|pâtes|riz cantonnais|saucisse puree|joues)\b/
  },
  {
    id: 'confort',
    label: 'Confort',
    pitch: 'Gourmand, chaud, généreux, sans empiler deux féculents.',
    prefer: /\b(gratin|puree|purée|mornay|poulet|saucisse|lentilles|fromage|chocolat|caramel)\b/,
    avoid: /\b(gazpacho|salade melon|crudites|crudités)\b/
  },
  {
    id: 'ete',
    label: 'Été frais',
    pitch: 'Froid, acidulé, végétal, avec une fin légère.',
    prefer: /\b(froid|salade|melon|tomate|gazpacho|gaspacho|citron|yaourt|basilic|cerise|clafoutis)\b/,
    avoid: /\b(gratin|mornay|rhum|friture|beurre d escargot)\b/
  }
];

function menuThemeById(id) {
  return MENU_THEMES.find(theme => theme.id === id) || MENU_THEMES[0];
}

function isWeeknightDessert(recipe) {
  const timing = getRecipeTiming(recipe);
  return Boolean(timing.active && timing.active <= 10);
}

const MENU_PAIRING_PATTERNS = {
  creamySauce: /\b(creme|cremeux|fromage|mornay|gaston gerard|moutarde|bechamel|mascarpone|sauce blanche|sauce fromage)\b/,
  sauceMarked: /\b(sauce|jus reduit|coulis|pesto|vinaigrette|aioli|rouille|mornay|caramel|marinade|condiment)\b/,
  expressiveTomato: /\b(tomate|tomates|provencal|provencale|confites?|sechees?|ail|huile d olive|basilic|origan)\b/,
  neutralSide: /\b(riz nature|riz pilaf|pommes vapeur|pomme vapeur|haricots verts|salade verte|legumes vapeur|semoule nature|pates nature)\b/,
  greenFresh: /\b(salade|crudites|crudites|concombre|haricots verts|citron|vinaigrette|pickles|herbes|yaourt|fenouil)\b/,
  fried: /\b(friture|frire|frites|tempura|beignet|air fryer|croustillant)\b/,
  starch: /\b(riz|pates|pate|pommes de terre|pomme de terre|puree|gratin|frites|pain|bun|semoule|polenta)\b/,
  cheese: /\b(fromage|comte|comte|cheddar|parmesan|mozzarella|brie|raclette|mornay)\b/,
  delicateFish: /\b(cabillaud|sole|lieu|merlu|poisson blanc|poisson delicat)\b/,
  strongMeat: /\b(boeuf|boeuf|agneau|canard|joues|porc|saucisse)\b/,
  spicy: /\b(piment|espelette|harissa|cajun|curry|paprika fort|chili|sriracha)\b/,
  sweetSavory: /\b(miel|sucre sale|sucre-sale|caramel|rhum|sirop|fruit sec|fruits secs)\b/,
  richDessert: /\b(chocolat|caramel|cookies|brownie|tiramisu|macaron|creme|cremeux|ganache|mascarpone)\b/,
  freshDessert: /\b(citron|fruit|fruits|sorbet|yaourt|compote|fraise|framboise|cerise|clafoutis|tarte citron)\b/,
  technicalDessert: /\b(macaron|entremets|pate a choux|pate feuilletee|opera|ouréa|ourea)\b/,
  coldFresh: /\b(froid|froide|salade|gazpacho|gaspacho|melon|crudites|crudites)\b/,
  makeAhead: /\b(la veille|repos|24h|refroidir|conservation|preparer a l avance|preparable)\b/,
  strongFlavor: /\b(chorizo|bacon|lardons|poivre|moutarde forte|fromage fort|ail|anchois|fumee|fume)\b/,
  smoked: /\b(fume|fumee|fumé|fumée|bacon|lardons|poitrine fumee|saumon fume)\b/,
  eggMayo: /\b(oeuf|oeufs|œuf|œufs|mayo|mayonnaise|mimosa)\b/,
  rawAllium: /\b(oignon cru|oignons crus|ail cru|echalote crue|échalote crue|ciboule|cebettes|cébettes)\b/,
  nuts: /\b(noix|noisette|amande|pistache|pecan|pécan|cajou)\b/,
  sweetFruit: /\b(pomme|poire|abricot|cerise|fraise|framboise|figue|raisin|cranberry|canneberge|fruit sec|fruits secs)\b/,
  bitterGreen: /\b(endive|roquette|chicoree|chicorée|radicchio|salade amere|salade amère)\b/,
  herbBright: /\b(persil|ciboulette|basilic|menthe|coriandre|estragon|aneth|cerfeuil)\b/,
  pastryBase: /\b(pate sucree|pâte sucrée|pate brisee|pâte brisée|pate feuilletee|pâte feuilletée|fond de tarte|biscuit joconde)\b/,
  longRest: /\b(24h|la veille|repos une nuit|maturation|pousse lente|fermentation)\b/,
  oven: /\b(four|enfourner|rotir|rôtir|gratin|gratiner|plaque|moule)\b/,
  pan: /\b(poele|poêle|saisir|saute|sauté|revenir)\b/,
  grill: /\b(plancha|gril|griller|barbecue|brochette)\b/,
  coldServe: /\b(froid|froide|servir frais|bien frais|refrigerateur|réfrigérateur)\b/,
  hotServe: /\b(chaud|chaude|servir aussitot|servir aussitôt|sortie du four)\b/,
  mayo: /\b(mayo|mayonnaise|aioli|aïoli|remoulade|rémoulade)\b/,
  potato: /\b(pomme de terre|pommes de terre|patate|patates|puree|purée|gratin dauphinois|frites)\b/,
  rice: /\b(riz|risotto|pilaf|cantonais)\b/,
  pasta: /\b(pates|pâtes|lasagne|spaghetti|tagliatelle|macaroni)\b/,
  bread: /\b(pain|bun|buns|brioche|burger|toast|tartine|croûtons|croutons)\b/,
  legumes: /\b(lentilles|pois chiches|haricots blancs|haricot blanc|flageolets|feves|fèves)\b/,
  mushroom: /\b(champignon|champignons|cepes|cèpes|morilles|girolles)\b/,
  shellfish: /\b(crevette|crevettes|moule|moules|calamar|calamars|chipiron|chipirons|crustace|crustacé)\b/,
  citrus: /\b(citron|lime|orange|pamplemousse|zeste|agrumes)\b/,
  alcohol: /\b(rhum|vin blanc|vin rouge|cidre|biere|bière|cognac|armagnac|porto)\b/,
  coffeeCocoa: /\b(cafe|café|cacao|chocolat|praline|praliné)\b/,
  roasted: /\b(roti|rôti|roties|rôties|confites|confits|caramelise|caramélisé)\b/,
  braised: /\b(mijote|mijoté|braise|braisé|confit|longue cuisson)\b/,
  pickled: /\b(pickle|pickles|cornichon|vinaigre|saumure|mariné|marine)\b/,
  freshDairy: /\b(yaourt|fromage blanc|faisselle|ricotta|brousse|labneh)\b/,
  poultry: /\b(poulet|volaille|dinde|pintade)\b/,
  beefLamb: /\b(boeuf|bœuf|agneau|veau|joues)\b/,
  pork: /\b(porc|saucisse|lard|lardon|lardons|bacon|jambon|rillettes)\b/,
  dessertServed: /\b(dessert|gateau|gâteau|tarte|clafoutis|mousse|creme dessert|crème dessert|sorbet)\b/,
  lightSide: /\b(salade verte|crudites|crudités|legumes vapeur|légumes vapeur|haricots verts|concombre)\b/,
  crunchy: /\b(croustillant|croquant|crumble|chapelure|frit|frite|toast|noix|amande)\b/,
  softCreamyTexture: /\b(fondant|cremeux|crémeux|moelleux|puree|purée|mousse|veloute|velouté)\b/,
  bitterChocolate: /\b(chocolat noir|cacao amer|cafe|café)\b/
};

function menuHas(profile, patternName) {
  return MENU_PAIRING_PATTERNS[patternName]?.test(profile?.text || '');
}

function menuEither(firstProfile, secondProfile, patternName) {
  return menuHas(firstProfile, patternName) || menuHas(secondProfile, patternName);
}

function menuBoth(firstProfile, secondProfile, patternName) {
  return menuHas(firstProfile, patternName) && menuHas(secondProfile, patternName);
}

function menuPairHas(firstProfile, secondProfile, firstPattern, secondPattern) {
  return (menuHas(firstProfile, firstPattern) && menuHas(secondProfile, secondPattern))
    || (menuHas(firstProfile, secondPattern) && menuHas(secondProfile, firstPattern));
}

function menuRecipeDifficultyScore(recipe) {
  if (Number.isFinite(recipe?.difficultyScore)) return recipe.difficultyScore;
  if (normalizeText(recipe?.difficulty) === 'easy') return 3;
  if (normalizeText(recipe?.difficulty) === 'hard') return 8;
  return 5;
}

const MENU_PAIRING_RULES = [
  { id: 'creamy-sauce-needs-neutral-side', kind: 'pairPenalty', weight: 72, match: (a, b) => menuPairHas(a, b, 'creamySauce', 'expressiveTomato') },
  { id: 'dominant-sauce-with-second-sauce', kind: 'pairPenalty', weight: 46, match: (a, b) => menuBoth(a, b, 'sauceMarked') },
  { id: 'double-starch', kind: 'pairPenalty', weight: 44, match: (a, b) => menuBoth(a, b, 'starch') },
  { id: 'double-creamy', kind: 'pairPenalty', weight: 38, match: (a, b) => menuBoth(a, b, 'creamySauce') },
  { id: 'double-cheese', kind: 'pairPenalty', weight: 34, match: (a, b) => menuBoth(a, b, 'cheese') },
  { id: 'double-tomato', kind: 'pairPenalty', weight: 30, match: (a, b) => menuBoth(a, b, 'expressiveTomato') },
  { id: 'fried-with-fried', kind: 'pairPenalty', weight: 48, match: (a, b) => menuBoth(a, b, 'fried') },
  { id: 'fried-with-starch-heavy', kind: 'pairPenalty', weight: 34, match: (a, b) => menuPairHas(a, b, 'fried', 'starch') },
  { id: 'delicate-fish-strong-flavor', kind: 'pairPenalty', weight: 34, match: (a, b) => menuPairHas(a, b, 'delicateFish', 'strongFlavor') },
  { id: 'spicy-with-strong-heat', kind: 'pairPenalty', weight: 24, match: (a, b) => menuBoth(a, b, 'spicy') },
  { id: 'sweet-savory-with-rich-dessert', kind: 'pairPenalty', weight: 28, match: (a, b) => menuPairHas(a, b, 'sweetSavory', 'richDessert') },
  { id: 'cheese-with-rich-dessert', kind: 'pairPenalty', weight: 18, match: (a, b) => menuPairHas(a, b, 'cheese', 'richDessert') },
  { id: 'rich-meat-with-creamy-side', kind: 'pairPenalty', weight: 22, match: (a, b) => menuPairHas(a, b, 'strongMeat', 'creamySauce') },
  { id: 'cold-fresh-with-cold-fresh-repeat', kind: 'pairPenalty', weight: 12, match: (a, b) => menuBoth(a, b, 'coldFresh') },
  { id: 'sauce-and-condiment-overload', kind: 'pairPenalty', weight: 26, match: (a, b) => menuBoth(a, b, 'sauceMarked') && menuEither(a, b, 'strongFlavor') },
  { id: 'creamy-sauce-with-neutral-side', kind: 'pairAffinity', weight: 40, match: (a, b) => menuPairHas(a, b, 'creamySauce', 'neutralSide') },
  { id: 'rich-with-green-fresh', kind: 'pairAffinity', weight: 30, match: (a, b) => (menuEither(a, b, 'creamySauce') || menuEither(a, b, 'fried') || menuEither(a, b, 'cheese')) && menuEither(a, b, 'greenFresh') },
  { id: 'fried-with-acid-fresh', kind: 'pairAffinity', weight: 30, match: (a, b) => menuPairHas(a, b, 'fried', 'greenFresh') },
  { id: 'spicy-with-cooling-side', kind: 'pairAffinity', weight: 24, match: (a, b) => menuPairHas(a, b, 'spicy', 'greenFresh') },
  { id: 'fish-with-citrus-herbs', kind: 'pairAffinity', weight: 28, match: (a, b) => menuPairHas(a, b, 'delicateFish', 'greenFresh') },
  { id: 'meat-with-simple-starch', kind: 'pairAffinity', weight: 16, match: (a, b) => menuPairHas(a, b, 'strongMeat', 'neutralSide') },
  { id: 'tomato-with-mediterranean-context', kind: 'pairAffinity', weight: 12, match: (a, b) => menuBoth(a, b, 'expressiveTomato') && !menuEither(a, b, 'creamySauce') },
  { id: 'make-ahead-supports-invites', kind: 'recipeBonus', weight: 14, match: ({ recipe, theme }) => theme.id === 'invites' && menuHas(getMenuRecipeProfile(recipe), 'makeAhead') },
  { id: 'weeknight-active-under-30', kind: 'recipeBonus', weight: 14, match: ({ recipe, theme }) => theme.id === 'semaine' && (getRecipeTiming(recipe).active || 0) <= 30 },
  { id: 'weeknight-active-over-35', kind: 'recipePenalty', weight: 24, match: ({ recipe, theme }) => theme.id === 'semaine' && (getRecipeTiming(recipe).active || 0) > 35 },
  { id: 'weeknight-dessert-under-10', kind: 'recipeBonus', weight: 18, match: ({ recipe, profile, theme }) => theme.id === 'semaine' && profile.role === 'dessert' && isWeeknightDessert(recipe) },
  { id: 'weeknight-dessert-over-10', kind: 'recipePenalty', weight: 80, match: ({ recipe, profile, theme }) => theme.id === 'semaine' && profile.role === 'dessert' && !isWeeknightDessert(recipe) },
  { id: 'bistrot-dessert-simple', kind: 'recipeBonus', weight: 16, match: ({ recipe, profile, theme }) => theme.id === 'bistrot' && profile.role === 'dessert' && menuRecipeDifficultyScore(recipe) <= 6 && !menuHas(profile, 'technicalDessert') },
  { id: 'bistrot-dessert-too-technical', kind: 'recipePenalty', weight: 34, match: ({ recipe, profile, theme }) => theme.id === 'bistrot' && profile.role === 'dessert' && (menuRecipeDifficultyScore(recipe) >= 8 || menuHas(profile, 'technicalDessert')) },
  { id: 'ete-avoid-hot-heavy', kind: 'recipePenalty', weight: 26, match: ({ profile, theme }) => theme.id === 'ete' && (profile.heavy || menuHas(profile, 'creamySauce') || menuHas(profile, 'fried')) },
  { id: 'ete-fresh-cold', kind: 'recipeBonus', weight: 18, match: ({ profile, theme }) => theme.id === 'ete' && menuHas(profile, 'coldFresh') },
  { id: 'confort-accept-richness', kind: 'recipeBonus', weight: 12, match: ({ profile, theme }) => theme.id === 'confort' && (profile.heavy || menuHas(profile, 'creamySauce') || menuHas(profile, 'cheese')) },
  { id: 'mediterranean-avoid-cream', kind: 'recipePenalty', weight: 20, match: ({ profile, theme }) => theme.id === 'mediterraneen' && menuHas(profile, 'creamySauce') },
  { id: 'mediterranean-tomato-citrus-herbs', kind: 'recipeBonus', weight: 16, match: ({ profile, theme }) => theme.id === 'mediterraneen' && (menuHas(profile, 'expressiveTomato') || menuHas(profile, 'greenFresh')) },
  { id: 'apero-small-pieces', kind: 'recipeBonus', weight: 16, match: ({ profile, theme }) => theme.id === 'apero' && profile.role === 'starter' },
  { id: 'apero-avoid-real-main', kind: 'recipePenalty', weight: 50, match: ({ profile, theme }) => theme.id === 'apero' && profile.role === 'main' },
  { id: 'menu-total-under-90', kind: 'menuBonus', weight: 16, match: ({ totalActive }) => totalActive > 0 && totalActive <= 90 },
  { id: 'menu-total-over-120', kind: 'menuPenalty', weight: 28, match: ({ totalActive }) => totalActive > 120 },
  { id: 'menu-total-over-150', kind: 'menuPenalty', weight: 42, match: ({ totalActive }) => totalActive > 150 },
  { id: 'too-many-long-recipes', kind: 'menuPenalty', weight: 36, match: ({ recipes }) => recipes.filter(recipe => (getRecipeTiming(recipe).active || 0) > 30).length >= 3 },
  { id: 'weeknight-max-three-cards', kind: 'menuPenalty', weight: 34, match: ({ roles, theme }) => theme.id === 'semaine' && roles.length > 3 },
  { id: 'weeknight-total-over-75', kind: 'menuPenalty', weight: 48, match: ({ totalActive, theme }) => theme.id === 'semaine' && totalActive > 75 },
  { id: 'invites-can-hold-complexity', kind: 'menuBonus', weight: 18, match: ({ theme, recipes }) => theme.id === 'invites' && recipes.some(recipe => (getRecipeTiming(recipe).active || 0) > 30) },
  { id: 'bistrot-too-many-hard-cards', kind: 'menuPenalty', weight: 32, match: ({ theme, recipes }) => theme.id === 'bistrot' && recipes.filter(recipe => menuRecipeDifficultyScore(recipe) >= 8).length > 1 },
  { id: 'starter-rich-main-rich', kind: 'menuPenalty', weight: 28, match: ({ itemProfiles }) => itemProfiles.filter(profile => menuHas(profile, 'creamySauce') || menuHas(profile, 'fried') || menuHas(profile, 'cheese')).length >= 3 },
  { id: 'need-one-fresh-contrast', kind: 'menuPenalty', weight: 18, match: ({ itemProfiles }) => itemProfiles.some(profile => menuHas(profile, 'creamySauce') || menuHas(profile, 'fried') || menuHas(profile, 'cheese')) && !itemProfiles.some(profile => menuHas(profile, 'greenFresh') || menuHas(profile, 'freshDessert')) },
  { id: 'fresh-dessert-after-rich-main', kind: 'menuBonus', weight: 24, match: ({ itemProfiles, roles }) => roles.includes('dessert') && itemProfiles.some(profile => menuHas(profile, 'creamySauce') || menuHas(profile, 'fried') || menuHas(profile, 'cheese')) && itemProfiles.some(profile => menuHas(profile, 'freshDessert')) },
  { id: 'rich-dessert-after-rich-main', kind: 'menuPenalty', weight: 30, match: ({ itemProfiles, roles }) => roles.includes('dessert') && itemProfiles.some(profile => menuHas(profile, 'creamySauce') || menuHas(profile, 'fried') || menuHas(profile, 'cheese')) && itemProfiles.some(profile => menuHas(profile, 'richDessert')) },
  { id: 'one-clear-main-required', kind: 'menuPenalty', weight: 80, match: ({ roles, theme }) => theme.id !== 'apero' && !roles.includes('main') },
  { id: 'dessert-not-mandatory-weeknight', kind: 'menuBonus', weight: 10, match: ({ roles, theme }) => theme.id === 'semaine' && !roles.includes('dessert') },
  { id: 'component-never-served', kind: 'recipePenalty', weight: 90, match: ({ profile }) => profile.role === 'component' },
  { id: 'sauce-cannot-replace-side-alone', kind: 'menuPenalty', weight: 20, match: ({ roles, theme }) => theme.id !== 'apero' && roles.includes('sauce') && !roles.includes('side') },
  { id: 'fil-conducteur-readable', kind: 'menuBonus', weight: 8, match: ({ itemProfiles }) => new Set(itemProfiles.flatMap(profile => profile.families || [])).size >= 2 },
  { id: 'egg-mayo-with-creamy-main', kind: 'pairPenalty', weight: 30, match: (a, b) => menuPairHas(a, b, 'eggMayo', 'creamySauce') },
  { id: 'egg-mayo-with-rich-dessert', kind: 'pairPenalty', weight: 18, match: (a, b) => menuPairHas(a, b, 'eggMayo', 'richDessert') },
  { id: 'raw-allium-with-delicate-fish', kind: 'pairPenalty', weight: 24, match: (a, b) => menuPairHas(a, b, 'rawAllium', 'delicateFish') },
  { id: 'smoked-with-delicate-fish', kind: 'pairPenalty', weight: 30, match: (a, b) => menuPairHas(a, b, 'smoked', 'delicateFish') },
  { id: 'smoked-with-sweet-dessert', kind: 'pairPenalty', weight: 16, match: (a, b) => menuPairHas(a, b, 'smoked', 'richDessert') },
  { id: 'nuts-with-delicate-fish', kind: 'pairPenalty', weight: 14, match: (a, b) => menuPairHas(a, b, 'nuts', 'delicateFish') },
  { id: 'fruit-with-fresh-dessert-repeat', kind: 'pairPenalty', weight: 14, match: (a, b) => menuPairHas(a, b, 'sweetFruit', 'freshDessert') },
  { id: 'bitter-green-with-bitter-dessert', kind: 'pairPenalty', weight: 16, match: (a, b) => menuPairHas(a, b, 'bitterGreen', 'bitterChocolate') },
  { id: 'pastry-base-as-served-dessert', kind: 'recipePenalty', weight: 70, match: ({ profile }) => profile.role === 'dessert' && menuHas(profile, 'pastryBase') && !menuHas(profile, 'dessertServed') },
  { id: 'long-rest-in-weeknight', kind: 'recipePenalty', weight: 52, match: ({ profile, theme }) => theme.id === 'semaine' && menuHas(profile, 'longRest') },
  { id: 'long-rest-ok-invites', kind: 'recipeBonus', weight: 12, match: ({ profile, theme }) => theme.id === 'invites' && menuHas(profile, 'longRest') },
  { id: 'too-many-oven-recipes', kind: 'menuPenalty', weight: 22, match: ({ itemProfiles }) => itemProfiles.filter(profile => menuHas(profile, 'oven')).length >= 3 },
  { id: 'too-many-pan-recipes', kind: 'menuPenalty', weight: 16, match: ({ itemProfiles }) => itemProfiles.filter(profile => menuHas(profile, 'pan')).length >= 3 },
  { id: 'grill-theme-support', kind: 'recipeBonus', weight: 10, match: ({ profile, theme }) => theme.id === 'ete' && menuHas(profile, 'grill') },
  { id: 'hot-and-cold-balance', kind: 'menuBonus', weight: 12, match: ({ itemProfiles }) => itemProfiles.some(profile => menuHas(profile, 'hotServe')) && itemProfiles.some(profile => menuHas(profile, 'coldServe')) },
  { id: 'all-cold-menu-outside-ete', kind: 'menuPenalty', weight: 18, match: ({ itemProfiles, theme }) => theme.id !== 'ete' && itemProfiles.length >= 3 && itemProfiles.every(profile => menuHas(profile, 'coldServe')) },
  { id: 'all-hot-heavy-menu', kind: 'menuPenalty', weight: 18, match: ({ itemProfiles }) => itemProfiles.length >= 3 && itemProfiles.every(profile => menuHas(profile, 'hotServe') || profile.heavy) },
  { id: 'mayo-with-fried', kind: 'pairPenalty', weight: 18, match: (a, b) => menuPairHas(a, b, 'mayo', 'fried') },
  { id: 'mayo-with-green-fresh', kind: 'pairAffinity', weight: 12, match: (a, b) => menuPairHas(a, b, 'mayo', 'greenFresh') },
  { id: 'potato-with-rice', kind: 'pairPenalty', weight: 36, match: (a, b) => menuPairHas(a, b, 'potato', 'rice') },
  { id: 'potato-with-pasta', kind: 'pairPenalty', weight: 34, match: (a, b) => menuPairHas(a, b, 'potato', 'pasta') },
  { id: 'rice-with-pasta', kind: 'pairPenalty', weight: 34, match: (a, b) => menuPairHas(a, b, 'rice', 'pasta') },
  { id: 'bread-with-pasta', kind: 'pairPenalty', weight: 24, match: (a, b) => menuPairHas(a, b, 'bread', 'pasta') },
  { id: 'bread-with-rice', kind: 'pairPenalty', weight: 22, match: (a, b) => menuPairHas(a, b, 'bread', 'rice') },
  { id: 'legumes-with-light-side', kind: 'pairAffinity', weight: 16, match: (a, b) => menuPairHas(a, b, 'legumes', 'lightSide') },
  { id: 'legumes-with-heavy-starch', kind: 'pairPenalty', weight: 22, match: (a, b) => menuPairHas(a, b, 'legumes', 'starch') && !menuPairHas(a, b, 'legumes', 'lightSide') },
  { id: 'mushroom-with-cream-ok', kind: 'pairAffinity', weight: 12, match: (a, b) => menuPairHas(a, b, 'mushroom', 'creamySauce') && !menuEither(a, b, 'expressiveTomato') },
  { id: 'mushroom-with-tomato-clash', kind: 'pairPenalty', weight: 16, match: (a, b) => menuPairHas(a, b, 'mushroom', 'expressiveTomato') },
  { id: 'shellfish-with-citrus', kind: 'pairAffinity', weight: 24, match: (a, b) => menuPairHas(a, b, 'shellfish', 'citrus') },
  { id: 'shellfish-with-cheese', kind: 'pairPenalty', weight: 28, match: (a, b) => menuPairHas(a, b, 'shellfish', 'cheese') },
  { id: 'citrus-with-fresh-dessert-repeat', kind: 'pairPenalty', weight: 10, match: (a, b) => menuPairHas(a, b, 'citrus', 'freshDessert') && menuBoth(a, b, 'citrus') },
  { id: 'alcohol-with-weeknight', kind: 'recipePenalty', weight: 14, match: ({ profile, theme }) => theme.id === 'semaine' && menuHas(profile, 'alcohol') },
  { id: 'alcohol-with-invites', kind: 'recipeBonus', weight: 10, match: ({ profile, theme }) => theme.id === 'invites' && menuHas(profile, 'alcohol') },
  { id: 'coffee-cocoa-after-sweet-savory', kind: 'pairPenalty', weight: 16, match: (a, b) => menuPairHas(a, b, 'coffeeCocoa', 'sweetSavory') },
  { id: 'roasted-with-fresh-herbs', kind: 'pairAffinity', weight: 18, match: (a, b) => menuPairHas(a, b, 'roasted', 'herbBright') },
  { id: 'braised-with-crunchy', kind: 'pairAffinity', weight: 18, match: (a, b) => menuPairHas(a, b, 'braised', 'crunchy') },
  { id: 'braised-with-soft-creamy', kind: 'pairPenalty', weight: 16, match: (a, b) => menuPairHas(a, b, 'braised', 'softCreamyTexture') && !menuPairHas(a, b, 'braised', 'greenFresh') },
  { id: 'pickled-with-rich-main', kind: 'pairAffinity', weight: 20, match: (a, b) => menuPairHas(a, b, 'pickled', 'creamySauce') || menuPairHas(a, b, 'pickled', 'fried') || menuPairHas(a, b, 'pickled', 'cheese') },
  { id: 'pickled-with-delicate-dessert', kind: 'pairPenalty', weight: 12, match: (a, b) => menuPairHas(a, b, 'pickled', 'freshDessert') },
  { id: 'fresh-dairy-with-spice', kind: 'pairAffinity', weight: 24, match: (a, b) => menuPairHas(a, b, 'freshDairy', 'spicy') },
  { id: 'poultry-with-neutral-side', kind: 'pairAffinity', weight: 16, match: (a, b) => menuPairHas(a, b, 'poultry', 'neutralSide') },
  { id: 'poultry-with-double-cream', kind: 'pairPenalty', weight: 18, match: (a, b) => menuPairHas(a, b, 'poultry', 'creamySauce') && menuBoth(a, b, 'creamySauce') },
  { id: 'beef-lamb-with-bitter-green', kind: 'pairAffinity', weight: 16, match: (a, b) => menuPairHas(a, b, 'beefLamb', 'bitterGreen') },
  { id: 'beef-lamb-with-rich-dessert', kind: 'pairPenalty', weight: 18, match: (a, b) => menuPairHas(a, b, 'beefLamb', 'richDessert') },
  { id: 'pork-with-fruit', kind: 'pairAffinity', weight: 16, match: (a, b) => menuPairHas(a, b, 'pork', 'sweetFruit') },
  { id: 'pork-with-mayo-overload', kind: 'pairPenalty', weight: 18, match: (a, b) => menuPairHas(a, b, 'pork', 'mayo') },
  { id: 'need-crunch-or-freshness', kind: 'menuPenalty', weight: 16, match: ({ itemProfiles }) => itemProfiles.length >= 3 && !itemProfiles.some(profile => menuHas(profile, 'crunchy') || menuHas(profile, 'greenFresh') || menuHas(profile, 'freshDessert')) },
  { id: 'too-many-soft-textures', kind: 'menuPenalty', weight: 24, match: ({ itemProfiles }) => itemProfiles.filter(profile => menuHas(profile, 'softCreamyTexture')).length >= 3 },
  { id: 'one-crunchy-texture-good', kind: 'menuBonus', weight: 10, match: ({ itemProfiles }) => itemProfiles.some(profile => menuHas(profile, 'crunchy')) && itemProfiles.some(profile => menuHas(profile, 'softCreamyTexture')) },
  { id: 'dessert-base-blocked-global', kind: 'recipePenalty', weight: 64, match: ({ profile }) => profile.role === 'dessert' && menuHas(profile, 'pastryBase') }
];

window.MENU_PAIRING_RULES = MENU_PAIRING_RULES;

function menuRuleScore(kind, payload) {
  return MENU_PAIRING_RULES
    .filter(rule => {
      if (rule.kind !== kind) return false;
      if (kind === 'pairPenalty' || kind === 'pairAffinity') return rule.match(payload.firstProfile, payload.secondProfile, payload);
      return rule.match(payload);
    })
    .reduce((score, rule) => score + rule.weight, 0);
}

function menuThemeScore(recipe, profile, theme) {
  let score = 0;
  if (theme.prefer.test(profile.text)) score += 34;
  if (theme.avoid.test(profile.text)) score -= 38;
  if (theme.id === 'apero' && profile.role === 'starter') score += 22;
  if (theme.id === 'ete' && profile.families.includes('vegetable')) score += 12;
  if (theme.id === 'confort' && profile.heavy) score += 10;
  if (theme.id === 'semaine' && getRecipeTiming(recipe).active && getRecipeTiming(recipe).active <= 30) score += 12;
  if (theme.id === 'invites' && getRecipeIntentLabels(recipe).join(' ').includes('à préparer')) score += 14;
  return score;
}

function menuRecipeScore(recipe, profile = getMenuRecipeProfile(recipe), theme = MENU_THEMES[0]) {
  const timing = getRecipeTiming(recipe);
  const labels = getRecipeIntentLabels(recipe).join(' ');
  let score = 0;
  if ((recipe.seasons || []).includes(getCurrentSeason()) || (recipe.seasons || []).includes('Toutes saisons')) score += 18;
  if (normalizeText(recipe.difficulty) === 'easy') score += 8;
  if (timing.active && timing.active <= 30) score += 8;
  if (labels.includes('soir de semaine') || labels.includes('à préparer')) score += 6;
  if ((recipe.tags || []).length >= 3) score += 4;
  score += menuRuleScore('recipeBonus', { recipe, profile, theme });
  score -= menuRuleScore('recipePenalty', { recipe, profile, theme });
  return score + menuThemeScore(recipe, profile, theme);
}

function menuPairPenalty(firstProfile, secondProfile, theme = MENU_THEMES[0]) {
  if (!firstProfile || !secondProfile) return 0;
  let penalty = 0;
  if (firstProfile.heavy && secondProfile.heavy) penalty += 44;
  if (firstProfile.families.includes('starch') && secondProfile.families.includes('starch')) penalty += 32;
  if (firstProfile.families.includes('vegetable') && secondProfile.families.includes('vegetable') && !firstProfile.heavy && !secondProfile.heavy) penalty += 10;
  if (/\b(frites|friture|air fryer)\b/.test(firstProfile.text) && /\b(frites|friture|air fryer)\b/.test(secondProfile.text)) penalty += 42;
  if (/\b(creme|fromage|mornay|gratin)\b/.test(firstProfile.text) && /\b(creme|fromage|mornay|gratin)\b/.test(secondProfile.text)) penalty += 18;
  if (/\b(tomate|tomates)\b/.test(firstProfile.text) && /\b(tomate|tomates)\b/.test(secondProfile.text)) penalty += 22;
  if (firstProfile.families.includes('fish') && /\b(poivre|moutarde|bacon|chorizo)\b/.test(secondProfile.text)) penalty += 16;
  if ((firstProfile.protein && secondProfile.protein) && (firstProfile.role === 'side' || secondProfile.role === 'side')) penalty += 28;
  penalty += menuRuleScore('pairPenalty', { firstProfile, secondProfile, theme });
  return penalty;
}

function menuPairAffinity(firstProfile, secondProfile, theme = MENU_THEMES[0]) {
  if (!firstProfile || !secondProfile) return 0;
  let score = 0;
  const joined = `${firstProfile.text} ${secondProfile.text}`;
  if (firstProfile.families.includes('fish') && /\b(citron|tomate|olive|basilic|yaourt|salade|legume|légume)\b/.test(secondProfile.text)) score += 30;
  if (firstProfile.families.includes('meat') && /\b(tomate|salade|citron|moutarde|puree|purée|riz|gratin)\b/.test(secondProfile.text)) score += 18;
  if (/\b(frites|friture|air fryer)\b/.test(firstProfile.text) && /\b(salade|tomate|citron|yaourt|legume|légume)\b/.test(secondProfile.text)) score += 26;
  if (firstProfile.heavy && secondProfile.families.includes('vegetable') && !secondProfile.heavy) score += 24;
  if (firstProfile.families.includes('vegetable') && secondProfile.families.includes('starch') && !firstProfile.heavy) score += 12;
  if (/\b(miel|moutarde|rhum|piment)\b/.test(firstProfile.text) && /\b(citron|tomate|salade|yaourt)\b/.test(secondProfile.text)) score += 14;
  if (theme.id === 'mediterraneen' && /\b(tomate|olive|basilic|citron|poisson|saumon|cabillaud)\b/.test(joined)) score += 18;
  if (theme.id === 'ete' && /\b(froid|salade|melon|tomate|citron|yaourt|fruit)\b/.test(joined)) score += 16;
  if (theme.id === 'confort' && /\b(poulet|porc|boeuf|bœuf|gratin|puree|purée|chocolat|caramel)\b/.test(joined)) score += 12;
  score += menuRuleScore('pairAffinity', { firstProfile, secondProfile, theme });
  return score;
}

function menuDessertAffinity(items, profiles, theme = MENU_THEMES[0]) {
  const main = items.find(item => item.key === 'main')?.recipe;
  const dessert = items.find(item => item.key === 'dessert')?.recipe;
  if (!dessert) return 0;
  const mainProfile = main ? profiles.get(main.id) : null;
  const dessertProfile = profiles.get(dessert.id);
  let score = 0;
  const dessertText = dessertProfile?.text || '';
  const mainText = mainProfile?.text || '';
  const freshDessert = /\b(citron|lime|fruit|fruits|cerise|clafoutis|tarte citron|sorbet|fraise|framboise)\b/.test(dessertText);
  const richDessert = /\b(chocolat|caramel|cookies|brownie|tiramisu|macaron|creme|crème)\b/.test(dessertText);
  if (!mainProfile) return freshDessert ? 10 : 0;
  if (mainProfile.heavy || /\b(frites|gratin|creme|crème|fromage|mornay|porc|boeuf|bœuf|agneau)\b/.test(mainText)) {
    if (freshDessert) score += 34;
    if (richDessert) score -= 24;
  } else {
    if (richDessert) score += 16;
    if (freshDessert) score += 10;
  }
  if (theme.id === 'ete' && freshDessert) score += 20;
  if (theme.id === 'invites' && /\b(tarte|tiramisu|macaron|clafoutis)\b/.test(dessertText)) score += 16;
  if (theme.id === 'apero' && /\b(cookies|macaron|carres|carrés|mini)\b/.test(dessertText)) score += 14;
  if (theme.id === 'semaine' && isWeeknightDessert(dessert)) score += 26;
  return score;
}

function menuSignature(items) {
  return items.map(item => item.recipe?.id).filter(Boolean).sort().join('|');
}

function menuBalanceScore(items, profiles, theme) {
  const recipes = items.map(item => item.recipe).filter(Boolean);
  const itemProfiles = recipes.map(recipe => profiles.get(recipe.id));
  const roles = items.map(item => item.key);
  let score = recipes.reduce((total, recipe) => total + menuRecipeScore(recipe, profiles.get(recipe.id), theme), 0);
  for (let i = 0; i < itemProfiles.length; i += 1) {
    for (let j = i + 1; j < itemProfiles.length; j += 1) {
      score -= menuPairPenalty(itemProfiles[i], itemProfiles[j], theme);
      score += menuPairAffinity(itemProfiles[i], itemProfiles[j], theme);
    }
  }
  const familyCount = new Set(itemProfiles.flatMap(profile => profile?.families || [])).size;
  score += familyCount * 5;
  const totalActive = recipes.reduce((sum, recipe) => sum + (getRecipeTiming(recipe).active || 0), 0);
  if (totalActive && totalActive <= 90) score += 14;
  if (totalActive > 150) score -= 18;
  if (theme.id !== 'apero' && roles.includes('main') && roles.includes('dessert')) score += theme.id === 'semaine' ? 8 : 28;
  if (theme.id !== 'apero' && !roles.includes('main')) score -= 80;
  if (theme.id === 'apero') {
    score += roles.filter(role => role === 'starter').length * 18;
    if (roles.includes('main')) score -= 90;
  }
  if (theme.id === 'ete' && itemProfiles.filter(profile => profile?.heavy).length > 1) score -= 30;
  if (theme.id === 'confort' && itemProfiles.filter(profile => profile?.heavy).length === 0) score -= 14;
  const menuPayload = { recipes, itemProfiles, roles, totalActive, theme };
  score += menuRuleScore('menuBonus', menuPayload);
  score -= menuRuleScore('menuPenalty', menuPayload);
  score += menuDessertAffinity(items, profiles, theme);
  return score;
}

function menuItemReason(item, items, profiles, theme) {
  const profile = item.recipe ? profiles.get(item.recipe.id) : null;
  const main = items.find(candidate => candidate.key === 'main')?.recipe;
  const mainProfile = main ? profiles.get(main.id) : null;
  if (!profile) return '';
  if (theme.id === 'apero' && item.key === 'starter') return 'Format à partager, cohérent avec l’apéro.';
  if (item.key === 'main') {
    if (profile.families.includes('fish')) return 'Base poisson, facile à accorder avec frais et citron.';
    if (profile.families.includes('meat')) return 'Base principale solide pour construire le repas.';
    if (profile.heavy) return 'Plat structurant, donc le reste reste plus léger.';
    return 'Recette centrale du menu.';
  }
  if ((item.key === 'side' || item.key === 'sauce') && mainProfile) {
    if (mainProfile.heavy && profile.families.includes('vegetable') && !profile.heavy) return 'Allège le plat sans rajouter un second féculent.';
    if (mainProfile.families.includes('fish') && /\b(citron|tomate|olive|basilic|yaourt)\b/.test(profile.text)) return 'Accord frais avec le poisson.';
    if (mainProfile.families.includes('meat') && /\b(tomate|salade|citron|moutarde|puree|purée|riz)\b/.test(profile.text)) return 'Accompagnement logique avec la viande.';
    return 'Complète le plat sans conflit fort.';
  }
  if (item.key === 'dessert') {
    if (theme.id === 'semaine') return 'Dessert express uniquement, sinon on garde le repas court.';
    if (/\b(citron|fruit|cerise|clafoutis)\b/.test(profile.text)) return 'Fin plus fraîche après le salé.';
    if (/\b(chocolat|caramel|cookies|tiramisu)\b/.test(profile.text)) return 'Fin gourmande assumée.';
    return 'Dessert servi, pas une base technique.';
  }
  return 'Ouvre le menu sans alourdir le plat.';
}

function menuLeadReason(items, profiles, theme) {
  const main = items.find(item => item.key === 'main')?.recipe;
  const first = main || items.find(item => item.recipe)?.recipe;
  const profile = first ? profiles.get(first.id) : null;
  const cues = [];
  if (profile?.families.includes('fish')) cues.push('poisson');
  if (profile?.families.includes('meat') && !profile?.families.includes('fish')) cues.push('viande');
  if (profile?.families.includes('vegetable')) cues.push('légumes');
  if (profile?.families.includes('starch')) cues.push('féculent');
  if (profile?.families.includes('dessert')) cues.push('douceur');
  const lead = first ? `Fil conducteur : ${first.title}${cues.length ? `, ${cues.slice(0, 2).join(' et ')}` : ''}.` : 'Fil conducteur : menu cohérent.';
  return `${theme.label} : ${theme.pitch} ${lead}`;
}

function buildMenuCandidate(items, profiles, theme, recentMenuSignatures = []) {
  const cleanItems = items.filter(item => item.recipe);
  const signature = menuSignature(cleanItems);
  return {
    items: cleanItems,
    signature,
    score: menuBalanceScore(cleanItems, profiles, theme) - (recentMenuSignatures.includes(signature) ? 120 : 0)
  };
}

function annotateMenuItems(items, profiles, theme) {
  return items.map(item => ({
    ...item,
    note: menuItemReason(item, items, profiles, theme)
  }));
}

function buildMenuSuggestion(recipes, offset = 0, themeId = 'bistrot', recentMenuSignatures = []) {
  const theme = menuThemeById(themeId);
  const leaves = recipes.filter(recipe => recipe && !isMasterRecipe(recipe));
  const profiles = new Map(leaves.map(recipe => [recipe.id, getMenuRecipeProfile(recipe)]));
  const byRole = leaves.reduce((groups, recipe) => {
    const role = profiles.get(recipe.id).role;
    if (!groups[role]) groups[role] = [];
    groups[role].push(recipe);
    return groups;
  }, {});
  Object.keys(byRole).forEach(role => {
    byRole[role].sort((a, b) => menuRecipeScore(b, profiles.get(b.id), theme) - menuRecipeScore(a, profiles.get(a.id), theme) || a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }));
  });
  const rolePool = (role, limit = 16) => (byRole[role] || [])
    .filter(recipe => profiles.get(recipe.id).servable)
    .slice(0, limit);
  const candidates = [];
  if (theme.id === 'apero') {
    const starters = rolePool('starter', 28);
    const desserts = rolePool('dessert', 10);
    for (let i = 0; i < starters.length; i += 1) {
      const chosen = [starters[i], starters[(i + 3) % starters.length], starters[(i + 7) % starters.length]]
        .filter((recipe, index, list) => recipe && list.findIndex(item => item?.id === recipe.id) === index);
      const dessert = desserts[(i + offset) % Math.max(desserts.length, 1)];
      candidates.push(buildMenuCandidate([
        { key: 'starter', label: 'Bouchée salée', recipe: chosen[0] },
        { key: 'starter', label: 'À partager', recipe: chosen[1] },
        { key: 'starter', label: 'À picorer', recipe: chosen[2] },
        { key: 'dessert', label: 'Douceur', recipe: dessert }
      ], profiles, theme, recentMenuSignatures));
    }
  } else {
    const starters = rolePool('starter', 14)
      .filter(recipe => !/\b(cookies|cake|chorizo au cidre)\b/.test(profiles.get(recipe.id).text));
    const mains = rolePool('main', 18);
    const themedMains = mains.filter(recipe => {
      const text = profiles.get(recipe.id).text;
      if (theme.id === 'mediterraneen') return /\b(tomate|olive|basilic|poisson|saumon|cabillaud|bouillabaisse|calamar|crevettes|chipirons)\b/.test(text) && !/\b(chorizo|miel|moutarde|rhum)\b/.test(text);
      if (theme.id === 'ete') return /\b(froid|salade|melon|gazpacho|gaspacho|poisson|saumon|cabillaud|oeuf|œuf)\b/.test(text) && !/\b(chorizo|porc|boeuf|bœuf|agneau|miel|moutarde|rhum|gratin|friture)\b/.test(text);
      return true;
    });
    const mainOptions = themedMains.length ? themedMains : mains;
    const sides = rolePool('side', 18);
    const desserts = rolePool('dessert', 16)
      .filter(recipe => theme.id !== 'semaine' || isWeeknightDessert(recipe));
    const sauces = rolePool('sauce', 8);
    mainOptions.forEach((main, mainIndex) => {
      const mainProfile = profiles.get(main.id);
      const compatibleSides = sides
        .filter(side => menuPairPenalty(mainProfile, profiles.get(side.id), theme) < 35)
        .filter(side => theme.id !== 'mediterraneen' || !/\b(gratin|creme|crème|mornay)\b/.test(profiles.get(side.id).text))
        .filter(side => theme.id !== 'ete' || !/\b(gratin|creme|crème|frites|friture|puree|purée)\b/.test(profiles.get(side.id).text))
        .sort((a, b) => menuPairAffinity(mainProfile, profiles.get(b.id), theme) - menuPairAffinity(mainProfile, profiles.get(a.id), theme));
      const sideOptions = compatibleSides.length ? compatibleSides : [null];
      const starterOptions = starters.length ? starters : [null];
      const dessertOptions = desserts.length ? desserts : [null];
      for (let step = 0; step < Math.min(10, Math.max(sideOptions.length, dessertOptions.length, starterOptions.length)); step += 1) {
        const side = sideOptions[(mainIndex + step + offset) % sideOptions.length];
        const starter = starterOptions[(mainIndex + step * 2 + offset) % starterOptions.length];
        const dessert = dessertOptions[(mainIndex + step * 3 + offset) % dessertOptions.length];
        const sauce = !side && sauces.length ? sauces[(mainIndex + step + offset) % sauces.length] : null;
        candidates.push(buildMenuCandidate([
          { key: 'starter', label: 'Entrée / apéro', recipe: starter },
          { key: 'main', label: 'Plat', recipe: main },
          { key: side ? 'side' : 'sauce', label: side ? 'Accompagnement' : 'Sauce', recipe: side || sauce },
          { key: 'dessert', label: 'Dessert', recipe: dessert }
        ], profiles, theme, recentMenuSignatures));
      }
    });
  }
  if (candidates.length) {
    candidates.sort((a, b) => b.score - a.score);
    const freshCandidates = candidates.filter(candidate => !recentMenuSignatures.includes(candidate.signature));
    const selectionPool = freshCandidates.length ? freshCandidates : candidates;
    const selected = selectionPool[offset % Math.min(selectionPool.length, 24)] || selectionPool[0];
    return {
      theme,
      reason: menuLeadReason(selected.items, profiles, theme),
      quality: Math.max(0, Math.min(100, Math.round(62 + selected.score / 18))),
      signature: selected.signature,
      items: annotateMenuItems(selected.items, profiles, theme)
    };
  }
  const used = new Set();
  const pick = (roles, bump = 0, allowed = () => true) => {
    const pool = roles
      .flatMap(role => byRole[role] || [])
      .filter(recipe => !used.has(recipe.id) && allowed(recipe, profiles.get(recipe.id)));
    if (!pool.length) return null;
    const recipe = pool[(offset + bump) % pool.length];
    used.add(recipe.id);
    return recipe;
  };
  const starter = pick(['starter'], 0, (recipe, profile) => profile.servable);
  const main = pick(['main'], 1, (recipe, profile) => profile.servable);
  const mainProfile = main ? profiles.get(main.id) : null;
  const side = pick(['side'], 2, (recipe, profile) => {
    if (!profile.servable) return false;
    if (!mainProfile) return true;
    if (mainProfile.heavy && profile.heavy) return false;
    if (mainProfile.families.includes('starch') && profile.families.includes('starch')) return false;
    if (mainProfile.families.includes('vegetable') && profile.families.includes('vegetable') && !profile.families.includes('starch')) return offset % 2 === 0;
    return true;
  });
  const sauce = pick(['sauce'], 3, (recipe, profile) => {
    if (theme.id !== 'apero' && theme.id !== 'bistrot' && theme.id !== 'mediterraneen') return false;
    if (!mainProfile) return true;
    if (mainProfile.families.includes('fish')) return /\b(citron|yaourt|aioli|aïoli|rouille|beurre)\b/.test(profile.text);
    if (mainProfile.families.includes('meat')) return /\b(poivre|moutarde|mornay|beurre|rouille|burger)\b/.test(profile.text);
    return true;
  });
  const dessert = pick(['dessert'], 4, (recipe, profile) => profile.servable && (theme.id !== 'semaine' || isWeeknightDessert(recipe)));
  const items = [
    { key: 'starter', label: 'Entrée / apéro', recipe: starter },
    { key: 'main', label: 'Plat', recipe: main },
    { key: 'side', label: side ? 'Accompagnement' : 'Complément', recipe: side || sauce },
    { key: 'dessert', label: 'Dessert', recipe: dessert }
  ].filter(item => item.recipe);
  return {
    theme,
    reason: menuLeadReason(items, profiles, theme),
    quality: Math.max(0, Math.min(100, Math.round(menuBalanceScore(items, profiles, theme) / 18))),
    signature: menuSignature(items),
    items: annotateMenuItems(items, profiles, theme)
  };
}

function buildMenuItemReplacement(menu, recipes, themeId, targetSlot = 0, bump = 1) {
  const currentItems = menu?.items || [];
  const targetIndex = typeof targetSlot === 'string'
    ? currentItems.findIndex((item, index) => menuItemSlotKey(item, index) === targetSlot)
    : Number(targetSlot);
  const target = currentItems[targetIndex];
  if (!target?.recipe) return menu;
  const theme = menuThemeById(themeId);
  const leaves = recipes.filter(recipe => recipe && !isMasterRecipe(recipe));
  const profiles = new Map(leaves.map(recipe => [recipe.id, getMenuRecipeProfile(recipe)]));
  const usedIds = new Set(currentItems.map(item => item.recipe?.id).filter(Boolean));
  const wantedRole = target.key === 'sauce' ? 'sauce' : target.key === 'side' ? 'side' : target.key;
  const roleMatches = (recipe, profile) => {
    if (profile.role === wantedRole) return true;
    if (wantedRole === 'main') return (recipe.categories || []).some(category => normalizeText(category) === 'plats');
    if (wantedRole === 'side') return profile.role === 'sauce' || (recipe.categories || []).some(category => normalizeText(category) === 'accompagnements');
    return false;
  };
  const allowed = (recipe, strict = true) => {
    const profile = profiles.get(recipe.id);
    if (!profile?.servable || !roleMatches(recipe, profile) || usedIds.has(recipe.id)) return false;
    if (theme.id === 'semaine' && wantedRole === 'dessert' && !isWeeknightDessert(recipe)) return false;
    if (wantedRole === 'side') {
      const main = currentItems.find(item => item.key === 'main')?.recipe;
      const mainProfile = main ? profiles.get(main.id) : null;
      if (strict && mainProfile && menuPairPenalty(mainProfile, profile, theme) >= 35) return false;
    }
    return true;
  };
  const strictCandidates = leaves.filter(recipe => allowed(recipe, true));
  const relaxedCandidates = strictCandidates.length ? strictCandidates : leaves.filter(recipe => allowed(recipe, false));
  const candidates = relaxedCandidates
    .map(recipe => {
      const items = currentItems.map((item, index) => index === targetIndex ? { ...item, recipe } : item);
      return {
        recipe,
        items,
        score: menuBalanceScore(items, profiles, theme)
      };
    })
    .sort((a, b) => b.score - a.score || a.recipe.title.localeCompare(b.recipe.title, 'fr', { sensitivity: 'base' }));
  if (!candidates.length) return menu;
  const selected = candidates[(Math.max(1, bump) - 1) % Math.min(candidates.length, 24)];
  const signature = menuSignature(selected.items);
  return {
    theme,
    reason: menuLeadReason(selected.items, profiles, theme),
    quality: Math.max(0, Math.min(100, Math.round(62 + selected.score / 18))),
    signature,
    items: annotateMenuItems(selected.items, profiles, theme)
  };
}

function buildMenuSuggestionWithOverrides(recipes, offset = 0, themeId = 'bistrot', recentMenuSignatures = [], itemOffsets = {}) {
  return Object.entries(itemOffsets)
    .filter(([, bump]) => Number(bump) > 0)
    .sort(([left], [right]) => String(left).localeCompare(String(right), 'fr', { numeric: true }))
    .reduce(
      (currentMenu, [slot, bump]) => buildMenuItemReplacement(currentMenu, recipes, themeId, slot, Number(bump)),
      buildMenuSuggestion(recipes, offset, themeId, recentMenuSignatures)
    );
}

function menuItemSlotKey(item, index) {
  return `${item?.key || 'slot'}:${index}`;
}

const COMPACT_WORKFLOW_SIGNALS = Object.freeze([
  'rapide', 'express', 'four', 'enfourner', 'gratin', 'frire', 'friture', 'tempura', 'beignet',
  'air fryer', 'poele', 'plancha', 'mijoter', 'vegetarien', 'vegan', 'sans viande', 'froid',
  'refrigerateur', 'conservation', 'congeler', 'congelation', 'rechauff', 'service', 'dresser',
  'la veille', 'avance', 'week-end', 'semaine'
]);

function getCompactWorkflowSignals(recipe) {
  if (Array.isArray(recipe?.workflowSignals)) return recipe.workflowSignals;
  const mask = Number(recipe?.workflowMask) || 0;
  return COMPACT_WORKFLOW_SIGNALS.filter((_, index) => mask & (1 << index));
}

function menuRecipeStepText(recipe) {
  return normalizeText([
    recipe?.title,
    ...getCompactWorkflowSignals(recipe),
    ...(recipe?.steps || []),
    ...(recipe?.notes || []),
    ...(recipe?.tags || [])
  ].join(' '));
}

function buildMenuTimeline(recipes) {
  const groups = [
    { key: 'advance', label: 'À faire en avance', items: [] },
    { key: 'start', label: 'Démarrer le repas', items: [] },
    { key: 'parallel', label: 'Pendant les cuissons', items: [] },
    { key: 'finish', label: 'Dernière minute', items: [] }
  ];
  recipes.forEach(recipe => {
    const text = menuRecipeStepText(recipe);
    const timing = getRecipeTiming(recipe);
    if (/\b(veille|repos|reposer|refroidir|refrigerateur|réfrigérateur|mariner|conserver|24h)\b/.test(text) || timing.rest >= 60) {
      groups[0].items.push(`${recipe.title} : préparer/refroidir avant le service.`);
    }
    if (/\b(four|prechauffer|préchauffer|mijoter|cuire|frire|poele|poêle)\b/.test(text)) {
      groups[1].items.push(`${recipe.title} : lancer la cuisson principale.`);
    } else {
      groups[1].items.push(`${recipe.title} : préparer les bases et pesées.`);
    }
    if (timing.cook || /\b(four|mijoter|repos|refroidir)\b/.test(text)) {
      groups[2].items.push(`${recipe.title} : profiter du temps mort pour préparer garniture, sauce ou dressage.`);
    }
    if (/\b(servir|dresser|minute|chaud|saler|poivrer|parsemer|zeste|citron|grille|grillé|croustillant)\b/.test(text)) {
      groups[3].items.push(`${recipe.title} : finir et dresser juste avant d’envoyer.`);
    }
  });
  return groups
    .map(group => ({ ...group, items: uniq(group.items).slice(0, 4) }))
    .filter(group => group.items.length);
}

function buildMenuStress(recipes) {
  const timings = recipes.map(getRecipeTiming);
  const totalActive = timings.reduce((sum, timing) => sum + (timing.active || 0), 0);
  const text = normalizeText(recipes.map(menuRecipeStepText).join(' '));
  const equipment = uniq(recipes.flatMap(getRecipeEquipment));
  let points = 0;
  if (totalActive > 120) points += 2;
  else if (totalActive > 80) points += 1;
  if (/\b(frire|friture|tempura|beignet)\b/.test(text)) points += 2;
  if (/\b(four)\b/.test(text) && /\b(poele|poêle|casserole|mijoter)\b/.test(text)) points += 1;
  if (/\b(minute|immediatement|immédiatement|croustillant)\b/.test(text)) points += 1;
  if (equipment.length >= 5) points += 1;
  const level = points >= 5 ? 'Intense' : points >= 3 ? 'Moyen' : 'Tranquille';
  const reasons = [
    totalActive ? `${formatMinutesShort(totalActive)} actif cumulé` : '',
    /\b(frire|friture|tempura|beignet)\b/.test(text) ? 'friture ou croustillant minute' : '',
    equipment.length >= 5 ? `${equipment.length} matériels à sortir` : '',
    /\b(four)\b/.test(text) && /\b(poele|poêle|casserole|mijoter)\b/.test(text) ? 'cuissons à coordonner' : ''
  ].filter(Boolean);
  return { level, reasons };
}

function buildMenuShoppingHints(shoppingData) {
  const freshPattern = /\b(citron|salade|tomate|herbe|basilic|persil|menthe|poisson|saumon|cabillaud|crevette|mozzarella|creme|crème|oeuf|œuf|viande|poulet|porc|boeuf|bœuf)\b/;
  const pantryPattern = /\b(sel|poivre|huile|farine|sucre|riz|pates|pâtes|moutarde|vinaigre|epice|épice|miel|chocolat|levure)\b/;
  const critical = shoppingData.groupedItems
    .filter(item => freshPattern.test(normalizeText(item.name)))
    .slice(0, 5)
    .map(item => item.name);
  const pantry = shoppingData.groupedItems
    .filter(item => pantryPattern.test(normalizeText(item.name)))
    .slice(0, 5)
    .map(item => item.name);
  return [
    critical.length && { label: 'À acheter frais', items: critical },
    pantry.length && { label: 'Épicerie à vérifier', items: pantry },
    shoppingData.aisleGroups.length && { label: 'Rayons principaux', items: shoppingData.aisleGroups.slice(0, 4).map(group => group.label) }
  ].filter(Boolean);
}

function buildMenuLeftovers(recipes, shoppingData) {
  const ingredientNames = shoppingData.groupedItems.map(item => normalizeText(item.name)).join(' ');
  const ideas = [];
  if (/\b(citron|lime)\b/.test(ingredientNames)) ideas.push('Citron restant : vinaigrette, marinade express ou zestes sur un dessert.');
  if (/\b(creme|crème|mascarpone|fromage)\b/.test(ingredientNames)) ideas.push('Crème/fromage restant : sauce minute, gratin ou tartine chaude.');
  if (/\b(tomate|salade|herbe|basilic|persil|menthe)\b/.test(ingredientNames)) ideas.push('Herbes/légumes frais : salade du lendemain ou garniture de sandwich.');
  if (/\b(riz|pomme de terre|pates|pâtes|pain)\b/.test(ingredientNames)) ideas.push('Féculent restant : poêlée rapide, croquettes ou bol repas.');
  if (recipes.some(recipe => getRecipeTiming(recipe).active > 30)) ideas.push('Prévoir une portion en plus du plat principal pour un repas simple le lendemain.');
  return uniq(ideas).slice(0, 4);
}

function buildMenuServiceTips(recipes) {
  return recipes.map(recipe => {
    const text = menuRecipeStepText(recipe);
    let tip = 'Servir en portion nette, avec l’élément chaud envoyé en dernier.';
    if (/\b(sauce|jus|creme|crème|yaourt)\b/.test(text)) tip = 'Servir la sauce à part ou napper au dernier moment.';
    if (/\b(salade|froid|melon|gazpacho|gaspacho)\b/.test(text)) tip = 'Servir bien frais, assiette froide si possible.';
    if (/\b(frite|croustillant|tempura|beignet|frire)\b/.test(text)) tip = 'Envoyer aussitôt pour garder le croustillant.';
    if (/\b(tarte|cake|cookies|tiramisu|macaron|dessert)\b/.test(text)) tip = 'Sortir avant service si besoin pour retrouver la bonne texture.';
    return { title: recipe.title, tip };
  }).slice(0, 5);
}

function buildMenuEquipmentConflicts(recipes) {
  const rows = recipes.map(recipe => ({
    recipe,
    text: menuRecipeStepText(recipe),
    equipment: getRecipeEquipment(recipe)
  }));
  const conflicts = [];
  const ovenRecipes = rows.filter(row => /\b(four|prechauffer|préchauffer)\b/.test(row.text));
  const fryRecipes = rows.filter(row => /\b(frire|friture|tempura|beignet)\b/.test(row.text));
  const panRecipes = rows.filter(row => /\b(poele|poêle|saisir|mijoter|casserole)\b/.test(row.text));
  if (ovenRecipes.length > 1) conflicts.push(`Four partagé : ${ovenRecipes.map(row => row.recipe.title).join(', ')}.`);
  if (fryRecipes.length) conflicts.push(`Friture minute à isoler : ${fryRecipes.map(row => row.recipe.title).join(', ')}.`);
  if (panRecipes.length >= 2) conflicts.push(`Feux/poêles à coordonner : ${panRecipes.map(row => row.recipe.title).join(', ')}.`);
  const equipmentCounts = new Map();
  rows.flatMap(row => row.equipment).forEach(item => {
    equipmentCounts.set(item, (equipmentCounts.get(item) || 0) + 1);
  });
  [...equipmentCounts.entries()].filter(([, count]) => count > 1).slice(0, 2).forEach(([item, count]) => {
    conflicts.push(`${item} utilisé sur ${count} recettes.`);
  });
  return conflicts.length ? conflicts.slice(0, 5) : ['Aucun conflit matériel évident.'];
}

function buildMenuServicePlan(recipes, shoppingData) {
  return {
    timeline: buildMenuTimeline(recipes),
    stress: buildMenuStress(recipes),
    shoppingHints: buildMenuShoppingHints(shoppingData),
    leftovers: buildMenuLeftovers(recipes, shoppingData),
    serviceTips: buildMenuServiceTips(recipes),
    conflicts: buildMenuEquipmentConflicts(recipes)
  };
}

const EMPTY_MENU = { items: [], reason: '', quality: NaN };
const EMPTY_MENU_SERVICE_PLAN = {
  timeline: [],
  stress: { level: '', reasons: [] },
  shoppingHints: [],
  leftovers: [],
  serviceTips: [],
  conflicts: []
};

function getBatchPlanData(recipes) {
  const allSteps = recipes.flatMap(recipe => getRecipeSteps(recipe).map(step => ({ recipe, step, text: normalizeText(step) })));
  const combinedText = normalizeText(recipes.map(recipe => [
    recipe.title,
    ...(recipe.ingredients || []).flatMap(group => [group.group, ...(group.items || [])]),
    ...(recipe.steps || [])
  ].join(' ')).join(' '));
  const sharedPrep = [
    /\b(citron|zeste|jus de citron|lime)\b/.test(combinedText) && 'Zester/presser tous les citrons en une fois, puis garder zestes et jus séparés.',
    /\b(oeuf|œuf|oeufs|œufs|jaune|blanc)\b/.test(combinedText) && 'Casser ou cuire les œufs groupés, en séparant jaunes/blancs si besoin.',
    /\b(persil|basilic|menthe|ciboulette|herbes)\b/.test(combinedText) && 'Laver, sécher et hacher toutes les herbes au même moment.',
    /\b(oignon|echalote|échalote|ail)\b/.test(combinedText) && 'Éplucher et tailler ail/oignons/échalotes avant de lancer les cuissons.',
    /\bbeurre\b/.test(combinedText) && 'Sortir le beurre nécessaire au début si une texture pommade ou souple est utile.',
    /\bfour|enfourner|prechauffer|préchauffer\b/.test(combinedText) && 'Préchauffer le four avant la mise en place chaude.'
  ].filter(Boolean);
  const advanceItems = recipes.map(recipe => {
    const text = normalizeText([
      recipe.title,
      ...(recipe.steps || []),
      ...(recipe.notes || []),
      ...(recipe.practical?.tips || [])
    ].join(' '));
    if (!/\b(la veille|avance|repos|mariner|refroidir|conservation|congel|base|pate|pâte|sauce|creme|crème)\b/.test(text)) return '';
    if (/\b(mariner|repos|la veille)\b/.test(text)) return `${recipe.title} : lancer marinades, repos ou bases froides en premier.`;
    if (/\b(sauce|creme|crème|pate|pâte|base)\b/.test(text)) return `${recipe.title} : préparer la base séparément, refroidir proprement et finir au service.`;
    return `${recipe.title} : isoler les éléments qui se gardent, puis garder les finitions fragiles pour la fin.`;
  }).filter(Boolean).slice(0, 5);
  const storageItems = recipes.flatMap(recipe => {
    const storage = getRecipePracticalSections(recipe).find(section => section.key === 'storage');
    return storage?.items?.[0] ? [`${recipe.title} : ${storage.items[0]}`] : [];
  }).slice(0, 5);
  return [
    {
      key: 'prep',
      label: 'Mise en place',
      items: [
        `${recipes.length} fiche${recipes.length > 1 ? 's' : ''} \u00e0 pr\u00e9parer`,
        `${recipes.reduce((sum, recipe) => sum + countIngredients(recipe), 0)} lignes d'ingr\u00e9dients \u00e0 v\u00e9rifier`
      ]
    },
    {
      key: 'shared',
      label: 'Gestes groupés',
      items: sharedPrep
    },
    {
      key: 'advance',
      label: 'Bases à faire en avance',
      items: advanceItems
    },
    {
      key: 'cold',
      label: 'Froid / repos',
      items: allSteps
        .filter(item => /\b(repos|reposer|froid|refrigerateur|refroidir|mariner|pousse|lever)\b/.test(item.text))
        .slice(0, 4)
        .map(item => `${item.recipe.title} : ${stripHtml(item.step)}`)
    },
    {
      key: 'cook',
      label: 'Cuissons',
      items: allSteps
        .filter(item => /\b(cuire|cuisson|four|enfourner|frire|poele|mijoter|griller|rotir|saisir)\b/.test(item.text))
        .slice(0, 5)
        .map(item => `${item.recipe.title} : ${stripHtml(item.step)}`)
    },
    {
      key: 'finish',
      label: 'Finitions',
      items: allSteps
        .filter(item => /\b(servir|dresser|finir|zeste|saupoudrer|napper|decore|garnir)\b/.test(item.text))
        .slice(0, 4)
        .map(item => `${item.recipe.title} : ${stripHtml(item.step)}`)
    },
    {
      key: 'storage',
      label: 'Conservation',
      items: storageItems
    }
  ].filter(group => group.items.length);
}


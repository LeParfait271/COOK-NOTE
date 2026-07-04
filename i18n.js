(function initCookNoteI18n(global) {
  'use strict';

  const STORAGE_KEY = 'cook_note_locale';
  const DEFAULT_LOCALE = 'fr';
  const SUPPORTED_LOCALES = ['fr', 'en'];

  const messages = {
    fr: {
      'language.selector': 'Langue',
      'language.fr': 'Français',
      'language.en': 'English',
      'language.current': 'Langue actuelle : {language}',
      'site.description': 'Cook Note : carnet de recettes maison avec ingrédients, étapes, variantes, techniques de cuisine, favoris et liste de courses.',
      'site.ogDescription': 'Carnet de recettes maison avec variantes, techniques, favoris et liste de courses.',
      'seo.recipe.description': '{title} sur Cook Note : recette {category}{yieldText}{ingredientsText}.',
      'seo.techniques.description': 'Techniques de cuisine Cook Note : gestes, bases et repères pratiques pour cuisiner plus proprement.',
      'seo.home.title': 'Cook Note',
      'seo.techniques.title': 'Techniques - Cook Note'
    },
    en: {
      'language.selector': 'Language',
      'language.fr': 'Français',
      'language.en': 'English',
      'language.current': 'Current language: {language}',
      'site.description': 'Cook Note: a home recipe notebook with ingredients, steps, variants, cooking techniques, favorites and shopping lists.',
      'site.ogDescription': 'A home recipe notebook with variants, techniques, favorites and shopping lists.',
      'seo.recipe.description': '{title} on Cook Note: {category} recipe{yieldText}{ingredientsText}.',
      'seo.techniques.description': 'Cook Note cooking techniques: practical gestures, basics and kitchen cues for cleaner cooking.',
      'seo.home.title': 'Cook Note',
      'seo.techniques.title': 'Techniques - Cook Note'
    }
  };

  const phraseEn = {
    'Accueil': 'Home',
    'Actions rapides': 'Quick actions',
    'Techniques': 'Techniques',
    'Menu': 'Menu',
    'Demander une recette': 'Request a recipe',
    'Panier courses': 'Shopping basket',
    'Rechercher': 'Search',
    'Voir les favoris': 'View favorites',
    'Préférences d’affichage': 'Display preferences',
    'Aller au contenu': 'Skip to content',
    'Navigation mobile': 'Mobile navigation',
    'Mode menu': 'Menu mode',
    'Favoris': 'Favorites',
    'Favori': 'Favorite',
    'Courses': 'Shopping',
    '+ Courses': '+ Shopping',
    'Retour haut': 'Back to top',
    'Retour en haut de page': 'Back to top',
    'Informations catalogue': 'Catalog information',
    'Installer Cook Note': 'Install Cook Note',
    'Carnet personnel de recettes et techniques culinaires développé par MaruChiwa.': 'Personal recipe and cooking-technique notebook developed by MaruChiwa.',
    'Application autonome Android 5+ développée par MaruChiwa.': 'Standalone Android 5+ application developed by MaruChiwa.',
    'Installer Cook Note Android 5.0+': 'Install Cook Note Android 5.0+',
    'APK Legacy': 'Legacy APK',
    'APK Legacy pour les tablettes anciennes. Le fichier est hébergé sur GitHub pour éviter les limites de taille Cloudflare Pages.': 'Legacy APK for older tablets. The file is hosted on GitHub to avoid Cloudflare Pages size limits.',
    'Touche Télécharger l’APK.': 'Tap Download APK.',
    'Si Android affiche une alerte, autorise le téléchargement.': 'If Android shows a warning, allow the download.',
    'Ouvre le fichier téléchargé, puis autorise l’installation depuis le navigateur si Android le demande.': 'Open the downloaded file, then allow installation from the browser if Android asks.',
    'Si le lien direct affiche une erreur, utilise le lien brut ou la page GitHub.': 'If the direct link shows an error, use the raw link or the GitHub page.',
    'Télécharger l’APK': 'Download APK',
    'Lien brut': 'Raw link',
    'Page GitHub': 'GitHub page',
    'Lien stable': 'Stable link',
    'Fermer': 'Close',
    'Partager': 'Share',
    'Partager la liste': 'Share list',
    'Imprimer': 'Print',
    'Imprimer la liste': 'Print list',
    'Copier': 'Copy',
    'Copiée': 'Copied',
    'Copier fiche': 'Copy recipe',
    'Fiche copiée': 'Recipe copied',
    'Ajouter aux courses': 'Add to shopping',
    'Dans les courses': 'In shopping',
    'Retirer des courses': 'Remove from shopping',
    'Ajouter aux favoris': 'Add to favorites',
    'Retirer des favoris': 'Remove from favorites',
    'Voir la vidéo': 'Watch video',
    'Ingrédients': 'Ingredients',
    'Étapes': 'Steps',
    'Avant': 'Before',
    'Avant de commencer': 'Before you start',
    'Mise en place': 'Setup',
    'Exécution': 'Execution',
    'Mémo': 'Memo',
    'Allergènes': 'Allergens',
    'Aucun allergène majeur détecté dans les ingrédients.': 'No major allergen detected in the ingredients.',
    'Poids moyens': 'Average weights',
    'Poids moyens utiles': 'Useful average weights',
    'Correspondances de poids moyens': 'Average-weight references',
    'Recettes liées': 'Related recipes',
    'Notes': 'Notes',
    'Astuces et liens': 'Tips and links',
    'Fiche technique': 'Technical sheet',
    'Points techniques': 'Technical points',
    'Matériel nécessaire': 'Required equipment',
    'Résumé': 'Summary',
    'Fiche rapide': 'Quick sheet',
    'Fiche active': 'Active sheet',
    'Temps actif': 'Active time',
    'Cuisson': 'Cooking',
    'Repos / froid': 'Rest / chilling',
    'Difficulté': 'Difficulty',
    'Quantité': 'Quantity',
    'Saison': 'Season',
    'Lecture chef': 'Chef notes',
    'Lecture chef de la recette': 'Recipe chef notes',
    'Choix de variante': 'Variant choice',
    'Tableau de bord recette': 'Recipe dashboard',
    'Sections de la fiche': 'Recipe sections',
    'Sections de la recette': 'Recipe sections',
    'Choisir une variante': 'Choose a variant',
    'Variante active': 'Active variant',
    'Choisis une variante pour afficher les ingrédients et les étapes correspondantes.': 'Choose a variant to show the matching ingredients and steps.',
    'Choisis un groupe d’ingrédients': 'Choose an ingredient group',
    'Ouvre un groupe d’ingrédients pour afficher les étapes correspondantes.': 'Open an ingredient group to show the matching steps.',
    'Recettes introuvables': 'Recipes not found',
    'Le fichier de recettes doit définir window.RECIPES avant app.js.': 'The recipe file must define window.RECIPES before app.js.',
    'Retour au carnet': 'Back to notebook',
    'Retour aux recettes': 'Back to recipes',
    'Retour': 'Back',
    'Recherche': 'Search',
    'Recette, ingrédients, usage, saison...': 'Recipe, ingredients, use, season...',
    'Commande, recette, ingrédient...': 'Command, recipe, ingredient...',
    'Recherches rapides': 'Quick searches',
    'Filtres actifs': 'Active filters',
    'Filtrer par saison': 'Filter by season',
    'Filtrer la saison par catégorie': 'Filter the season by category',
    'Toutes saisons': 'All seasons',
    'Printemps': 'Spring',
    'Été': 'Summer',
    'Automne': 'Autumn',
    'Hiver': 'Winter',
    'Toutes difficultés': 'All difficulties',
    'Facile': 'Easy',
    'Moyen': 'Medium',
    'Technique': 'Technical',
    'Intermédiaire': 'Intermediate',
    'Toutes': 'All',
    'Toutes les recettes': 'All recipes',
    'Recettes sauvegardées': 'Saved recipes',
    'Préférences': 'Preferences',
    'Passer en mode jour': 'Switch to day mode',
    'Passer en mode nuit': 'Switch to night mode',
    'Thème': 'Theme',
    'Conserver le mode nuit': 'Keep night mode',
    'Activer le mode jour': 'Enable day mode',
    'Nuit': 'Night',
    'Jour': 'Day',
    'Densité des cartes': 'Card density',
    'Compact': 'Compact',
    'Confort': 'Comfort',
    'Afficher plus de cartes': 'Show more cards',
    'Afficher des cartes plus aérées': 'Show roomier cards',
    'Activer le texte plus lisible': 'Enable more readable text',
    'Activer les animations calmes': 'Enable calm animations',
    'Fermer la notification': 'Close notification',
    'Multiplier les quantités': 'Scale quantities',
    'Personnes': 'People',
    'Liste de courses Cook Note': 'Cook Note shopping list',
    'Aucune recette cochée.': 'No recipe selected.',
    'Partage de la liste ouvert': 'List sharing opened',
    'Retirer du panier courses': 'Remove from shopping basket',
    'Tout décocher': 'Uncheck all',
    'Synthèse magasin': 'Store summary',
    'J’ai déjà': 'I already have it',
    'Marquer comme déjà à la maison': 'Mark as already at home',
    'Remettre dans la liste': 'Put back on the list',
    'Style de menu': 'Menu style',
    'Choisir le nombre de personnes du menu': 'Choose menu serving count',
    'Nombre de personnes du menu': 'Menu serving count',
    'Qualité du menu': 'Menu quality',
    'Fil d’Ariane': 'Breadcrumb',
    'Retour au catalogue Cook Note': 'Back to Cook Note catalog',
    'Retour au catalogue': 'Back to catalog',
    'Aucune recette ne correspond': 'No recipe matches',
    'Les filtres sont trop serrés pour le contenu actuel.': 'The current filters are too restrictive.',
    'Recettes liées à cette fiche': 'Recipes related to this recipe card',
    'Masquer les recettes liées supplémentaires': 'Hide additional related recipes',
    'Statut de la note privée': 'Private note status',
    'Ex : moins de sucre, cuisson +3 min, validée pour 8 personnes...': 'Ex: less sugar, cook +3 min, approved for 8 people...',
    'Effacer la note privée de cette recette': 'Clear this recipe private note',
    'Effacer la note': 'Clear note',
    'Résumé de la recette': 'Recipe summary',
    'Allergènes détectés': 'Detected allergens',
    'Liste des allergènes détectés': 'Detected allergen list',
    'Fiche technique de la recette': 'Recipe technical notes',
    'Mettre à jour': 'Update',
    'Mettre Cook Note à jour': 'Update Cook Note',
    'Mise à jour...': 'Updating...',
    'WhatsApp': 'WhatsApp',
    'Email': 'Email',
    'Lien copié': 'Link copied',
    'Lien prêt': 'Link ready',
    'Lien de partage': 'Share link',
    'QR code': 'QR code',
    'App Android': 'Android app',
    'Base': 'Base',
    'Apéro': 'Appetizers',
    'Entrées': 'Starters',
    'Plats': 'Mains',
    'Accompagnements': 'Sides',
    'Desserts': 'Desserts',
    'Sauces': 'Sauces',
    'Petit-déjeuner': 'Breakfast',
    'Petits-déjeuners': 'Breakfasts',
    'traité': 'handled',
    'Menu équilibré.': 'Balanced menu.',
    'Rôles à composer': 'Roles to build',
    'Recette': 'Recipe',
    'Collection': 'Collection'
  };

  const recipePhraseEn = {
    'Crumble pomme-poire': 'Apple and pear crumble',
    'Flan parisien vanille': 'Parisian vanilla custard tart',
    'Flan p\u00e2tissier \u00e9pais vanille': 'Thick Parisian vanilla custard tart',
    'Flan vanille cr\u00e9meux': 'Creamy vanilla custards',
    'Tarte citron meringu\u00e9e': 'Lemon meringue tart',
    'Chantilly classique': 'Classic Chantilly cream',
    'Chantilly stabilis\u00e9e': 'Stabilized Chantilly cream',
    'Court-bouillon': 'Court bouillon',
    'P\u00e2te \u00e0 choux': 'Choux pastry',
    'P\u00e2te sucr\u00e9e': 'Sweet tart dough',
    'P\u00e2tes \u00e0 tarte': 'Tart doughs',
    'Cochon confit \u00e0 la bi\u00e8re et au sirop d\u2019\u00e9rable': 'Pork confit with beer and maple syrup',
    'C\u00f4telettes de porc miel moutarde': 'Pork chops with honey and mustard',
    'Bouillabaisse': 'Bouillabaisse',
    'Frites belges': 'Belgian fries',
    'Frites': 'Fries',
    'Gaufres de pommes de terre croustillantes': 'Crispy potato waffles',
    'Gazpacho tomate, menthe et basilic': 'Tomato, mint and basil gazpacho',
    'Gaspacho de melon': 'Melon gazpacho',
    'Salade melon, mozzarella et jambon cru': 'Melon, mozzarella and prosciutto salad',
    'Salade avocat, \u0153uf et \u00e9pinards': 'Avocado, egg and spinach salad',
    'Tomates proven\u00e7ales': 'Proven\u00e7al tomatoes',
    'Tortillas': 'Tortillas',
    'Babeurre': 'Buttermilk',
    'Pain hot dog brioch\u00e9': 'Brioche hot dog buns',
    'Pains burgers brioch\u00e9s': 'Brioche burger buns',
    'Base pour flan sal\u00e9': 'Savory flan base',
    'Beurre clarifi\u00e9': 'Clarified butter',
    'Beurre \u00e0 l\u2019ail': 'Garlic butter',
    'Cr\u00e8me citron': 'Lemon curd',
    'Cr\u00e8me diplomate vanille': 'Vanilla diplomat cream',
    'Cr\u00e8me p\u00e2tissi\u00e8re vanille': 'Vanilla pastry cream',
    'Cr\u00e8me p\u00e2tissi\u00e8re pralin\u00e9': 'Praline pastry cream',
    'Cr\u00e8me pistache \u00e0 garnir': 'Pistachio filling cream',
    'Cr\u00e8me pralin\u00e9': 'Praline cream',
    'Meringue italienne': 'Italian meringue',
    'Mousse au chocolat': 'Chocolate mousse'
  };

  const culinaryReplacementsEn = [
    ['huile d\u2019olive', 'olive oil'],
    ["huile d'olive", 'olive oil'],
    ['jus de citron vert', 'lime juice'],
    ['jus de citron', 'lemon juice'],
    ['zeste de citron', 'lemon zest'],
    ['poivre du moulin', 'freshly ground pepper'],
    ['sel fin', 'fine salt'],
    ['sucre glace', 'icing sugar'],
    ['sucre blond', 'light brown sugar'],
    ['sucre', 'sugar'],
    ['farine', 'flour'],
    ['beurre doux', 'unsalted butter'],
    ['beurre fondu', 'melted butter'],
    ['beurre', 'butter'],
    ['lait entier', 'whole milk'],
    ['lait', 'milk'],
    ['cr\u00e8me liquide', 'cream'],
    ['cr\u00e8me', 'cream'],
    ['\u0153ufs', 'eggs'],
    ['oeufs', 'eggs'],
    ['\u0153uf', 'egg'],
    ['oeuf', 'egg'],
    ['ail', 'garlic'],
    ['oignon', 'onion'],
    ['oignons', 'onions'],
    ['\u00e9chalote', 'shallot'],
    ['\u00e9chalotes', 'shallots'],
    ['persil', 'parsley'],
    ['basilic', 'basil'],
    ['menthe', 'mint'],
    ['ciboulette', 'chives'],
    ['thym', 'thyme'],
    ['romarin', 'rosemary'],
    ['vanille', 'vanilla'],
    ['chocolat noir', 'dark chocolate'],
    ['chocolat blanc', 'white chocolate'],
    ['chocolat', 'chocolate'],
    ['citron vert', 'lime'],
    ['citron', 'lemon'],
    ['pomme de terre', 'potato'],
    ['pommes de terre', 'potatoes'],
    ['pomme', 'apple'],
    ['pommes', 'apples'],
    ['poire', 'pear'],
    ['poires', 'pears'],
    ['fraise', 'strawberry'],
    ['fraises', 'strawberries'],
    ['framboise', 'raspberry'],
    ['framboises', 'raspberries'],
    ['myrtille', 'blueberry'],
    ['myrtilles', 'blueberries'],
    ['abricot', 'apricot'],
    ['abricots', 'apricots'],
    ['tomate', 'tomato'],
    ['tomates', 'tomatoes'],
    ['carotte', 'carrot'],
    ['carottes', 'carrots'],
    ['courgette', 'zucchini'],
    ['courgettes', 'zucchini'],
    ['chou-fleur', 'cauliflower'],
    ['brocoli', 'broccoli'],
    ['poireau', 'leek'],
    ['poireaux', 'leeks'],
    ['champignon', 'mushroom'],
    ['champignons', 'mushrooms'],
    ['poulet', 'chicken'],
    ['porc', 'pork'],
    ['boeuf', 'beef'],
    ['b\u0153uf', 'beef'],
    ['agneau', 'lamb'],
    ['saumon', 'salmon'],
    ['cabillaud', 'cod'],
    ['crevette', 'shrimp'],
    ['crevettes', 'shrimp'],
    ['calamar', 'squid'],
    ['encornets', 'squid'],
    ['fromage', 'cheese'],
    ['parmesan', 'Parmesan'],
    ['mozzarella', 'mozzarella'],
    ['feta', 'feta'],
    ['moutarde', 'mustard'],
    ['miel', 'honey'],
    ['vinaigre de vin rouge', 'red wine vinegar'],
    ['vinaigre', 'vinegar'],
    ['Xérès', 'sherry'],
    ['Madère', 'Madeira'],
    ['levure chimique', 'baking powder'],
    ['poudre d\u2019amandes', 'almond flour'],
    ["poudre d'amandes", 'almond flour'],
    ['amandes', 'almonds'],
    ['noisettes', 'hazelnuts'],
    ['noix', 'walnuts'],
    ['pignons', 'pine nuts'],
    ['p\u00e2te feuillet\u00e9e', 'puff pastry'],
    ['p\u00e2te sabl\u00e9e', 'shortcrust pastry'],
    ['p\u00e2te sucr\u00e9e', 'sweet tart dough'],
    ['p\u00e2te \u00e0 choux', 'choux pastry'],
    ['tarte', 'tart'],
    ['g\u00e2teau', 'cake'],
    ['cr\u00eapes', 'crepes'],
    ['muffins', 'muffins'],
    ['cookies', 'cookies'],
    ['sauce', 'sauce'],
    ['salade', 'salad'],
    ['soupe', 'soup'],
    ['pur\u00e9e', 'mash'],
    ['gratin', 'gratin'],
    ['coulis', 'coulis'],
    ['lanières', 'strips'],
    ['tronçons', 'pieces'],
    ['frémissement', 'gentle simmer'],
    ['tendreté', 'tenderness'],
    ['réchauffage', 'reheating'],
    ['immédiatement', 'immediately'],
    ['dorés', 'golden'],
    ['doré', 'golden'],
    ['dorée', 'golden'],
    ['réduite', 'reduced'],
    ['réduit', 'reduced'],
    ['grillée', 'grilled'],
    ['grillé', 'grilled'],
    ['gratiné', 'browned'],
    ['moutardée', 'mustard-based'],
    ['environ', 'about'],
    ['optionnel', 'optional'],
    ['optionnelle', 'optional'],
    ['ramolli', 'softened'],
    ['hach\u00e9', 'minced'],
    ['hach\u00e9e', 'minced'],
    ['cisel\u00e9', 'finely sliced'],
    ['cisel\u00e9e', 'finely sliced'],
    ['r\u00e2p\u00e9', 'grated'],
    ['r\u00e2p\u00e9e', 'grated'],
    ['fondu', 'melted'],
    ['fondue', 'melted'],
    ['froid', 'cold'],
    ['froide', 'cold'],
    ['chaud', 'hot'],
    ['chaude', 'hot'],
    ['toutes saisons', 'all seasons'],
    ['personnes', 'people'],
    ['portions', 'servings'],
    ['parts', 'slices']
  ];

  const dynamicRules = [
    [/^(\d+) recipe card(s?)$/, match => `${match[1]} recipe card${match[1] === '1' ? '' : 's'}`],
    [/^(\d+) ingr\u00e9dient(s?)$/, match => `${match[1]} ingredient${match[1] === '1' ? '' : 's'}`],
    [/^(\d+) \u00e9tape(s?)$/, match => `${match[1]} step${match[1] === '1' ? '' : 's'}`],
    [/^(\d+)% pr\u00eat$/, match => `${match[1]}% ready`],
    [/^Difficult\u00e9 (.+)$/, match => `Difficulty ${text(match[1])}`],
    [/^Ouvrir (.+)$/, match => `Open ${text(match[1])}`],
    [/^Pour (.+)$/, match => `For ${text(match[1])}`],
    [/^Version APK ([0-9.]+), Android 5\.0 minimum\.$/, match => `APK version ${match[1]}, Android 5.0 minimum.`],
    [/^(\d+) recette(s?)$/, match => `${match[1]} recipe${match[1] === '1' ? '' : 's'}`],
    [/^(\d+) fiche(s?)$/, match => `${match[1]} recipe card${match[1] === '1' ? '' : 's'}`],
    [/^(\d+) ingrédient(s?)$/, match => `${match[1]} ingredient${match[1] === '1' ? '' : 's'}`],
    [/^(\d+) étape(s?)$/, match => `${match[1]} step${match[1] === '1' ? '' : 's'}`],
    [/^(\d+) course(s?)$/, match => `${match[1]} shopping item${match[1] === '1' ? '' : 's'}`],
    [/^(\d+) personne(s?)$/, match => `${match[1]} ${match[1] === '1' ? 'person' : 'people'}`],
    [/^(\d+)% prêt$/, match => `${match[1]}% ready`],
    [/^Pour (.+)$/, match => `For ${match[1]}`],
    [/^Difficulté (.+)$/, match => `Difficulty ${match[1]}`],
    [/^Retirer le filtre (.+)$/, match => `Remove filter ${match[1]}`],
    [/^Ouvrir (.+)$/, match => `Open ${match[1]}`],
    [/^Ouvrir la catégorie (.+)$/, match => `Open category ${match[1]}`],
    [/^Installer (.+) - (.+)$/, match => `Install ${match[1]} - ${match[2]}`],
    [/^Partager (.+) sur WhatsApp$/, match => `Share ${match[1]} on WhatsApp`],
    [/^Partager (.+) par email$/, match => `Share ${match[1]} by email`],
    [/^QR code de (.+)$/, match => `QR code for ${match[1]}`],
    [/^QR code du lien (.+)$/, match => `QR code for ${match[1]} link`],
    [/^Lien de partage (.+)$/, match => `Share link ${match[1]}`],
    [/^Tout décocher \((\d+) article(s?)\)$/, match => `Uncheck all (${match[1]} item${match[1] === '1' ? '' : 's'})`],
    [/^Retirer (.+) du panier courses$/, match => `Remove ${match[1]} from shopping basket`],
    [/^Marquer (.+) comme déjà à la maison$/, match => `Mark ${match[1]} as already at home`],
    [/^Remettre (.+) dans la liste à acheter$/, match => `Put ${match[1]} back on the shopping list`],
    [/^Fermer la notification : (.+)$/, match => `Close notification: ${match[1]}`],
    [/^Choisir le style (.+)$/, match => `Choose ${match[1]} style`],
    [/^Afficher (\d+) recette(s?) liée(s?) supplémentaire(s?)$/, match => `Show ${match[1]} more related recipe${match[1] === '1' ? '' : 's'}`],
    [/^(.+) de saison : (.+)$/, match => `Seasonal ${match[1]}: ${match[2]}`]
  ];

  const listeners = new Set();

  function interpolate(template, params) {
    return String(template || '').replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => (
      Object.prototype.hasOwnProperty.call(params || {}, key) ? params[key] : ''
    ));
  }

  function repairI18nMojibake(value) {
    const text = String(value || '');
    if (!/[ÃÂâ]/.test(text)) return text;
    try {
      const decoded = decodeURIComponent(escape(text));
      const sourceScore = (text.match(/[ÃÂâ]/g) || []).length;
      const decodedScore = (decoded.match(/[ÃÂâ]/g) || []).length;
      return decodedScore < sourceScore ? decoded : text;
    } catch {
      return text;
    }
  }

  function normalizeI18nKey(value) {
    return repairI18nMojibake(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[’‘]/g, "'")
      .replace(/[œŒ]/g, 'oe')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  const phraseLookupEn = new Map();
  Object.entries({ ...phraseEn, ...recipePhraseEn }).forEach(([source, translated]) => {
    phraseLookupEn.set(normalizeI18nKey(source), translated);
  });

  function replaceCulinaryTerms(value) {
    let output = ` ${value} `;
    culinaryReplacementsEn
      .slice()
      .sort((left, right) => right[0].length - left[0].length)
      .forEach(([source, translated]) => {
        const normalizedSource = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[’']/g, "[’']");
        output = output.replace(new RegExp(`(^|[^\\p{L}])${normalizedSource}(?=$|[^\\p{L}])`, 'giu'), `$1${translated}`);
      });

    return output
      .replace(/\s+d[’']\s+/gi, ' of ')
      .replace(/\s+de\s+l[’']\s+/gi, ' of ')
      .replace(/\s+de\s+la\s+/gi, ' of ')
      .replace(/\s+du\s+/gi, ' of ')
      .replace(/\s+des\s+/gi, ' of ')
      .replace(/\s+aux\s+/gi, ' with ')
      .replace(/\s+au\s+/gi, ' with ')
      .replace(/\s+\u00e0\s+la\s+/gi, ' with ')
      .replace(/\s+\u00e0\s+l[’']\s+/gi, ' with ')
      .replace(/\s+et\s+/gi, ' and ')
      .replace(/\s+ou\s+/gi, ' or ')
      .replace(/\s+avec\s+/gi, ' with ')
      .replace(/\s+pour\s+/gi, ' for ')
      .replace(/\s+si besoin\s*/gi, ' if needed')
      .replace(/\s+option\s*/gi, ' optional')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function looksLikeRecipeText(value) {
    const key = normalizeI18nKey(value);
    if (!key || key.length > 260 || /[<>]/.test(value)) return false;
    return culinaryReplacementsEn.some(([source]) => key.includes(normalizeI18nKey(source)))
      || /\b\d+\s*(?:g|kg|ml|cl|l|min|h|%|c)\b/i.test(key)
      || /\b(?:cuire|fouetter|melanger|mixer|ajouter|servir|prechauffer|reserver|assaisonner|egoutter)\b/i.test(key);
  }

  function translateRecipeText(value) {
    const source = repairI18nMojibake(value).trim();
    const exact = recipePhraseEn[source] || phraseLookupEn.get(normalizeI18nKey(source));
    if (exact) return exact;
    if (!looksLikeRecipeText(source)) return '';

    let translated = replaceCulinaryTerms(source)
      .replace(/\bPr\u00e9chauffer\b/gi, 'Preheat')
      .replace(/\bM\u00e9langer\b/gi, 'Mix')
      .replace(/\bFouetter\b/gi, 'Whisk')
      .replace(/\bAjouter\b/gi, 'Add')
      .replace(/\bCuire\b/gi, 'Cook')
      .replace(/\bFrire\b/gi, 'Fry')
      .replace(/\bMijoter\b/gi, 'Simmer')
      .replace(/\bRôtir\b/gi, 'Roast')
      .replace(/\bSecouer\b/gi, 'Shake')
      .replace(/\bSaler\b/gi, 'Salt')
      .replace(/\bPorter\b/gi, 'Bring')
      .replace(/\bFlamber\b/gi, 'Flambé')
      .replace(/\bRéduire\b/gi, 'Reduce')
      .replace(/\bCouvrir\b/gi, 'Cover')
      .replace(/\bServir\b/gi, 'Serve')
      .replace(/\bR\u00e9server\b/gi, 'Set aside')
      .replace(/\bMixer\b/gi, 'Blend')
      .replace(/\bGo\u00fbter\b/gi, 'Taste')
      .replace(/\bLaisser\b/gi, 'Let')
      .replace(/\bIncorporer\b/gi, 'Fold in')
      .replace(/\bAssaisonner\b/gi, 'Season')
      .replace(/\bDorer\b/gi, 'Brown')
      .replace(/\bRefroidir\b/gi, 'Cool');

    if (translated === source) return '';
    return source[0] === source[0]?.toUpperCase()
      ? translated.charAt(0).toUpperCase() + translated.slice(1)
      : translated;
  }

  function safeLocale(value) {
    const locale = String(value || '').slice(0, 2).toLowerCase();
    return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  }

  function queryLocale() {
    try {
      return new URLSearchParams(global.location.search).get('lang');
    } catch {
      return '';
    }
  }

  function storedLocale() {
    try {
      return global.localStorage.getItem(STORAGE_KEY);
    } catch {
      return '';
    }
  }

  function browserLocale() {
    const languages = global.navigator?.languages?.length ? global.navigator.languages : [global.navigator?.language];
    return (languages || []).map(safeLocale).find(locale => SUPPORTED_LOCALES.includes(locale)) || DEFAULT_LOCALE;
  }

  let currentLocale = safeLocale(queryLocale() || storedLocale() || browserLocale());

  function persistLocale(locale) {
    try {
      global.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Preference persistence is best-effort; rendering must keep working.
    }
  }

  function t(key, params = {}) {
    const catalog = messages[currentLocale] || messages[DEFAULT_LOCALE];
    const fallback = messages[DEFAULT_LOCALE] || {};
    return interpolate(catalog[key] || fallback[key] || key, params);
  }

  function text(value) {
    if (typeof value !== 'string' || currentLocale === DEFAULT_LOCALE) return value;
    const source = repairI18nMojibake(value);
    const translated = phraseEn[value] || phraseEn[source] || phraseLookupEn.get(normalizeI18nKey(source));
    if (translated) return translated;
    for (const [pattern, render] of dynamicRules) {
      const match = source.match(pattern);
      if (match) return render(match);
    }
    return translateRecipeText(source) || source;
  }

  function setLocale(locale) {
    const next = safeLocale(locale);
    if (next === currentLocale) return currentLocale;
    currentLocale = next;
    persistLocale(next);
    applyDocumentLanguage();
    listeners.forEach(listener => listener(next));
    global.dispatchEvent?.(new CustomEvent('cook-note:locale-change', { detail: { locale: next } }));
    return next;
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') return () => {};
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function locale() {
    return currentLocale;
  }

  function applyDocumentLanguage() {
    if (global.document?.documentElement) {
      global.document.documentElement.lang = currentLocale;
      global.document.documentElement.dataset.locale = currentLocale;
    }
  }

  function ensureAlternateLinks(baseUrl) {
    if (!global.document?.head) return;
    const url = baseUrl || global.location.href.split('#')[0].split('?')[0];
    SUPPORTED_LOCALES.forEach(localeCode => {
      const id = `cook-note-hreflang-${localeCode}`;
      let link = global.document.getElementById(id);
      if (!link) {
        link = global.document.createElement('link');
        link.id = id;
        link.rel = 'alternate';
        link.hreflang = localeCode;
        global.document.head.appendChild(link);
      }
      link.href = `${url}?lang=${localeCode}`;
    });
    let xDefault = global.document.getElementById('cook-note-hreflang-x-default');
    if (!xDefault) {
      xDefault = global.document.createElement('link');
      xDefault.id = 'cook-note-hreflang-x-default';
      xDefault.rel = 'alternate';
      xDefault.hreflang = 'x-default';
      global.document.head.appendChild(xDefault);
    }
    xDefault.href = url;
  }

  function translateCategory(category) {
    return text(category || 'Recipe');
  }

  function localizeDocument(root) {
    const scope = root || global.document;
    if (!scope?.querySelectorAll) return;
    scope.querySelectorAll('[data-i18n-text]').forEach(node => {
      const key = node.getAttribute('data-i18n-text');
      node.textContent = key ? t(key) : text(node.textContent || '');
    });
    scope.querySelectorAll('[data-i18n-phrase]').forEach(node => {
      node.textContent = text(node.getAttribute('data-i18n-phrase') || node.textContent || '');
    });
    scope.querySelectorAll('[data-i18n-aria]').forEach(node => {
      const phrase = node.getAttribute('data-i18n-aria') || node.getAttribute('aria-label') || '';
      node.setAttribute('aria-label', text(phrase));
    });
  }

  const api = {
    defaultLocale: DEFAULT_LOCALE,
    supportedLocales: SUPPORTED_LOCALES.slice(),
    messages,
    phrases: { en: phraseEn },
    dynamicRuleCount: dynamicRules.length,
    t,
    text,
    setLocale,
    subscribe,
    locale,
    applyDocumentLanguage,
    ensureAlternateLinks,
    translateCategory,
    translateRecipeText,
    localizeDocument
  };

  global.CookNoteI18n = api;
  applyDocumentLanguage();
})(window);

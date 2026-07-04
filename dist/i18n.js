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
    'Copier le lien': 'Copy link',
    'Copier le texte': 'Copy text',
    'Texte copié': 'Text copied',
    'Lien de recette copié': 'Recipe link copied',
    'Texte de recette copié': 'Recipe text copied',
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
    'Gluten': 'Gluten',
    'Lait': 'Milk',
    'Mollusques': 'Molluscs',
    'Crustacés': 'Shellfish',
    'Moutarde': 'Mustard',
    'Œufs': 'Eggs',
    'Oeufs': 'Eggs',
    'Poids moyens': 'Average weights',
    'Poids moyens utiles': 'Useful average weights',
    'Correspondances de poids moyens': 'Average-weight references',
    'Recettes liées': 'Related recipes',
    'Notes': 'Notes',
    'Carnet perso': 'Personal notebook',
    'Note privée': 'Private note',
    'Statut': 'Status',
    'Non classée': 'Unclassified',
    'À refaire': 'To redo',
    'Testée / validée': 'Tested / approved',
    'À ajuster': 'Needs adjustment',
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
    'Choisir la préparation': 'Choose the preparation',
    'Aucune variante sélectionnée': 'No variant selected',
    'Sélectionne une variante pour afficher les détails.': 'Select a variant to show the details.',
    'Choisis une variante pour afficher les ingrédients et les étapes correspondantes.': 'Choose a variant to show the matching ingredients and steps.',
    'Choisis un groupe d’ingrédients': 'Choose an ingredient group',
    'Ouvre un groupe d’ingrédients pour afficher les étapes correspondantes.': 'Open an ingredient group to show the matching steps.',
    'Recettes introuvables': 'Recipes not found',
    'Recette introuvable': 'Recipe not found',
    'Retournez à la liste des recettes.': 'Go back to the recipe list.',
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
    'Mer': 'Seafood',
    'Viande': 'Meat',
    'Collection': 'Collection'
  };

  const recipePhraseEn = {
    'Brochettes crevettes chorizo': 'Shrimp and chorizo skewers',
    'Beignets de calamar': 'Calamari fritters',
    'Calamars': 'Calamari',
    'Pâte légère': 'Light batter',
    'Aïoli citronné léger': 'Light lemon aioli',
    'Variante tempura': 'Tempura variant',
    'Bol': 'Bowl',
    'Pics à brochettes': 'Skewers',
    'Pics a brochettes': 'Skewers',
    'Plancha ou poêle': 'Plancha or frying pan',
    'Plancha ou poele': 'Plancha or frying pan',
    'Casserole ou sauteuse haute': 'Tall saucepan or deep saute pan',
    'Grille d’égouttage': 'Draining rack',
    'Thermomètre de cuisson': 'Cooking thermometer',
    'Jus d’un citron jaune': 'Juice of one lemon',
    "Jus d'un citron jaune": 'Juice of one lemon',
    'Gousse d’ail': 'Garlic clove',
    "Gousse d'ail": 'Garlic clove',
    'Blanc d’œuf': 'Egg white',
    'Blanc d’oeuf': 'Egg white',
    'Jaune d’œuf': 'Egg yolk',
    'Jaune d’oeuf': 'Egg yolk',
    'Rincer rapidement les calamars, les éponger, puis couper les tubes en anneaux réguliers de 1 à 1,5cm.': 'Quickly rinse the calamari, pat them dry, then cut the tubes into even 1 to 1.5cm rings.',
    'Mélanger lait, citron, ail, sel, poivre du moulin et piment, puis mariner les calamars 30min à 2h au frais.': 'Mix the milk, lemon, garlic, salt, freshly ground pepper and chili, then marinate the calamari for 30 minutes to 2 hours in the fridge.',
    'Préparer l’<span data-goto="aioli_citronne_leger">aïoli citronné léger</span>, puis le garder au frais.': 'Prepare the light lemon aioli, then keep it chilled.',
    'Préparer au dernier moment la <span data-goto="pate_legere_beignets_calamar_crevettes">pâte légère</span> ou la <span data-goto="tempura_beignets_calamar_crevettes">tempura</span>, selon le croustillant voulu.': 'Prepare the light batter or tempura at the last moment, depending on the crunch you want.',
    'Égoutter les calamars, les éponger très soigneusement, puis les passer légèrement dans farine ou fécule.': 'Drain the calamari, pat them very thoroughly dry, then dust them lightly with flour or starch.',
    'Chauffer l’huile à 180°C.': 'Heat the oil to 180°C.',
    'Tremper les calamars dans la pâte choisie et frire par petites quantités 1min 30 à 2min maximum.': 'Dip the calamari in the chosen batter and fry in small batches for 1 minute 30 seconds to 2 minutes maximum.',
    'Égoutter sur grille, saler légèrement et servir immédiatement avec citron et sauce.': 'Drain on a rack, salt lightly and serve immediately with lemon and sauce.',
    'Mélanger farine, fécule et sel, puis ajouter jaune d’œuf et eau gazeuse glacée au dernier moment.': 'Mix the flour, starch and salt, then add the egg yolk and ice-cold sparkling water at the last moment.',
    'Garder une pâte irrégulière et très froide, puis tremper les calamars bien secs.': 'Keep the batter uneven and very cold, then dip the well-dried calamari.',
    'Frire immédiatement en petites fournées dans une huile chaude jusqu’à obtenir des beignets légèrement dorés, légers et croustillants.': 'Fry immediately in small batches in hot oil until the fritters are lightly golden, light and crisp.',
    'Mélanger huile, citron, ail, persil et poivre du moulin.': 'Mix the oil, lemon, garlic, parsley and freshly ground pepper.',
    'Enrober les crevettes 10min, pas plus longtemps.': 'Coat the shrimp for 10 minutes, no longer.',
    'Monter les brochettes en alternant crevettes et chorizo.': 'Assemble the skewers, alternating shrimp and chorizo.',
    'Cuire à la plancha ou à la poêle chaude 2 à 3min par face.': 'Cook on a plancha or in a hot frying pan for 2 to 3 minutes per side.',
    'Servir aussitôt avec un trait de citron.': 'Serve immediately with a squeeze of lemon.',
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
    'Mousse au chocolat': 'Chocolate mousse',
    'Cabillaud au four, crumble de chorizo': 'Baked cod with chorizo crumble',
    'Poulet au chorizo, vin blanc et citron': 'Chicken with chorizo, white wine and lemon',
    'Poulet aux tomates, poivron, vin blanc et thym': 'Chicken with tomatoes, bell pepper, white wine and thyme',
    'Joues de bœuf carottes orange vin rouge': 'Beef cheeks with carrots, orange and red wine',
    'Joues de bœuf whiskey orange': 'Beef cheeks with whiskey and orange',
    'Pâtes tomates confites parmesan': 'Pasta with confit tomatoes and Parmesan',
    'Gratin de pâtes au chorizo': 'Pasta gratin with chorizo',
    'Pommes de terre fondantes aux herbes et moutarde': 'Fondant potatoes with herbs and mustard',
    'Pommes de terre au four à la grecque': 'Greek-style baked potatoes',
    'Temps de cuisson des légumes à l’autocuiseur': 'Pressure-cooker vegetable cooking times',
    'Poêlée de blé au poulet et curcuma': 'Pan-fried wheat with chicken and turmeric',
    'Repos 10min puis cuisson en petites louches sur poêle beurrée.': 'Rest for 10 minutes, then cook small ladles of batter in a buttered pan.',
    'Verser la crème anglaise d’abord, poser les blancs pour les faire flotter, puis finir caramel et amandes sur les blancs.': 'Pour in the custard first, set the poached whites on top so they float, then finish with caramel and almonds.',
    'Faire un petit trou sur le côté de chaque donut tiède ou froid. Mettre la crème en poche avec une douille longue. Pocher 30–40g de crème par donut — arrêter dès qu’il devient légèrement plus lourd.': 'Make a small hole in the side of each warm or cold donut. Put the cream in a piping bag fitted with a long tip. Pipe in 30 to 40g of cream per donut, stopping as soon as it feels slightly heavier.',
    "Faire un petit trou sur le côté de chaque donut tiède ou froid. Mettre la crème en poche avec une douille longue. Pocher 30–40g de crème par donut — arrêter dès qu'il devient légèrement plus lourd.": 'Make a small hole in the side of each warm or cold donut. Put the cream in a piping bag fitted with a long tip. Pipe in 30 to 40g of cream per donut, stopping as soon as it feels slightly heavier.',
    'Cuisson déglacer la poêle, ajouter fond, crème et poivres, réduire 5 minutes puis monter au beurre froid.': 'Cooking: deglaze the pan, add stock, cream and pepper, reduce for 5 minutes, then finish by whisking in cold butter.',
    'Cuisson réduire le bouillon 3 à 5 minutes, puis mijoter avec crème et moutarde 5 à 8 minutes.': 'Cooking: reduce the stock for 3 to 5 minutes, then simmer with cream and mustard for 5 to 8 minutes.',
    'Lever les filets des poissons ou demander au poissonnier de le faire, puis garder arêtes et têtes pour le bouillon.': 'Fillet the fish, or ask the fishmonger to do it, then keep the bones and heads for the stock.',
    'Champignons poêlés au beurre noisette': 'Mushrooms sautéed in brown butter',
    'Faire un beurre noisette clair avec 40g de beurre, filtrer si besoin et laisser tiédir.': 'Make a light brown butter with 40g butter, strain if needed, and let it cool until lukewarm.',
    'Cuisson four': 'Oven cooking',
    'Faire réduire le jus quelques minutes si besoin avant de servir.': 'Reduce the juices for a few minutes if needed before serving.',
    'Repos idéal une nuit au réfrigérateur.': 'Ideally rest overnight in the refrigerator.',
    'Faire mariner les viandes coupées avec cognac, échalote, ail, sel, poivre du moulin et thym pendant 2h au frais.': 'Marinate the cut meats with cognac, shallot, garlic, salt, freshly ground pepper and thyme for 2 hours in the refrigerator.',
    'Couper les viandes bien froides en morceaux et les faire mariner 2h avec alcool, échalote, ail, sel fin, poivre du moulin et quatre-épices.': 'Cut the very cold meats into pieces and marinate for 2 hours with alcohol, shallot, garlic, fine salt, freshly ground pepper and quatre-épices.',
    'Fouetter les œufs avec le sucre et le sel sans faire trop mousser.': 'Whisk the eggs with the sugar and salt without making the mixture too foamy.'
  };

  const culinaryReplacementsEn = [
    ['choisir une variante pour afficher les recettes.', 'Choose a variant to show the recipes.'],
    ['choisir une variante pour afficher les ingrédients et les étapes.', 'Choose a variant to show the ingredients and steps.'],
    ['choisir une variante pour afficher la recette complète.', 'Choose a variant to show the full recipe.'],
    ['choisir une variante pour afficher la méthode adaptée.', 'Choose a variant to show the matching method.'],
    ['choisir une sauce dans la fiche.', 'Choose a sauce in this sheet.'],
    ['choisir une base dans la fiche.', 'Choose a base in this sheet.'],
    ['sélectionner la sauce voulue dans les cartes de recettes.', 'Select the sauce you want from the recipe cards.'],
    ['sélectionner la base voulue dans les cartes de recettes.', 'Select the base you want from the recipe cards.'],
    ['sélectionner la préparation de tomates voulue dans les boutons de la fiche.', 'Select the tomato preparation you want from the sheet buttons.'],
    ['sélectionner la base salée ou l’accompagnement voulu dans les boutons de la fiche.', 'Select the savory base or side you want from the sheet buttons.'],
    ["sélectionner la base salée ou l'accompagnement voulu dans les boutons de la fiche.", 'Select the savory base or side you want from the sheet buttons.'],
    ['sélectionner la base ou le montage voulu dans les boutons de la fiche.', 'Select the base or assembly you want from the sheet buttons.'],
    ['sélectionner le biscuit ou goûter voulu dans les boutons de la fiche.', 'Select the biscuit or snack you want from the sheet buttons.'],
    ['sélectionner la chantilly voulue dans les boutons de la fiche.', 'Select the whipped cream you want from the sheet buttons.'],
    ['sélectionner la sauce ou l’assaisonnement voulu dans les boutons de la fiche.', 'Select the sauce or seasoning you want from the sheet buttons.'],
    ["sélectionner la sauce ou l'assaisonnement voulu dans les boutons de la fiche.", 'Select the sauce or seasoning you want from the sheet buttons.'],
    ['fiche parent de navigation.', 'Parent navigation sheet.'],
    ['fiche maître', 'master sheet'],
    ['fiche parent', 'parent sheet'],
    ['les recettes restent conservées dans leurs variantes.', 'The recipes stay stored in their variants.'],
    ['les variantes sont rangées dans la fiche', 'The variants are stored in the sheet'],
    ['carnet perso', 'personal notebook'],
    ['non classée', 'unclassified'],
    ['point de vigilance', 'watch point'],
    ['organisation', 'organization'],
    ['regroupe les recettes faciles à partager avant le repas.', 'Groups recipes that are easy to share before the meal.'],
    ['fiche parent pour les sauces, pestos, marinades et assaisonnements.', 'Parent sheet for sauces, pestos, marinades and seasonings.'],
    ['fiche parent pour les préparations de base pains, tortillas, pâtes, fonds et supports de recettes.', 'Parent sheet for basic preparations, breads, tortillas, doughs, bases and recipe supports.'],
    ['brochettes crevettes chorizo', 'shrimp and chorizo skewers'],
    ['poêlée de blé au poulet et curcuma', 'Pan-fried wheat with chicken and turmeric'],
    ['poêlée', 'pan-fry'],
    ['ble', 'wheat'],
    ['blé', 'wheat'],
    ['beignets de calamar', 'calamari fritters'],
    ['grosses crevettes décortiquées', 'large peeled shrimp'],
    ['grosses crevettes decortiquees', 'large peeled shrimp'],
    ['grosses crevettes', 'large shrimp'],
    ['crevettes décortiquées', 'peeled shrimp'],
    ['crevettes decortiquees', 'peeled shrimp'],
    ['crevettes', 'shrimp'],
    ['crevette', 'shrimp'],
    ['chorizo en rondelles', 'sliced chorizo'],
    ['chorizo', 'chorizo'],
    ['pics à brochettes', 'skewers'],
    ['pics a brochettes', 'skewers'],
    ['plancha ou poêle', 'plancha or frying pan'],
    ['plancha ou poele', 'plancha or frying pan'],
    ['brochettes', 'skewers'],
    ['brochette', 'skewer'],
    ['crustacés', 'shellfish'],
    ['bol', 'bowl'],
    ['trait de citron', 'squeeze of lemon'],
    ['sautés', 'sautéed'],
    ['sautées', 'sautéed'],
    ['sautees', 'sautéed'],
    ['sauté', 'sautéed'],
    ['saute', 'sautéed'],
    ['sucre blanc', 'white sugar'],
    ['moutarde jaune', 'yellow mustard'],
    ['vinaigre blanc', 'white vinegar'],
    ['matières grasses', 'fats'],
    ['matiere grasse', 'fat'],
    ['matières grasses', 'fats'],
    ['temps de repos', 'resting time'],
    ['repos', 'rest'],
    ['assaisonnement', 'seasoning'],
    ['poivre blanc', 'white pepper'],
    ['jambon blanc', 'cooked ham'],
    ['jaune d’œuf', 'egg yolk'],
    ["jaune d'oeuf", 'egg yolk'],
    ['jaunes d’œuf', 'egg yolks'],
    ["jaunes d'oeuf", 'egg yolks'],
    ['blanc d’œuf', 'egg white'],
    ["blanc d'oeuf", 'egg white'],
    ['blancs d’œuf', 'egg whites'],
    ["blancs d'oeuf", 'egg whites'],
    ['pâte d’ail', 'garlic paste'],
    ["pâte d'ail", 'garlic paste'],
    ['pomme de terre écrasée', 'mashed potato'],
    ['pommes de terre sautées', 'sautéed potatoes'],
    ['pommes de terre croustillantes', 'crispy potatoes'],
    ['poêle beurrée', 'buttered pan'],
    ['réfrigérateur', 'refrigerator'],
    ['frigo', 'refrigerator'],
    ['congélateur', 'freezer'],
    ['casserole', 'saucepan'],
    ['couteau', 'knife'],
    ['pointe', 'tip'],
    ['cercle', 'ring'],
    ['friteuse', 'deep fryer'],
    ['bâtonnets', 'sticks'],
    ['batonnets', 'sticks'],
    ['réguliers', 'even'],
    ['reguliers', 'even'],
    ['régulières', 'even'],
    ['regulieres', 'even'],
    ['cuite', 'cooked'],
    ['cuit', 'cooked'],
    ['écrasée', 'mashed'],
    ['ecrasee', 'mashed'],
    ['épaisse', 'thick'],
    ['epaisse', 'thick'],
    ['liquide', 'runny'],
    ['quelques gouttes', 'a few drops'],
    ['nécessaire', 'needed'],
    ['necessaire', 'needed'],
    ['jaune coulant', 'runny yolk'],
    ['jaune cuit', 'cooked yolk'],
    ['jaune', 'yolk'],
    ['blanc pris', 'set white'],
    ['blanc', 'white'],
    ['poissonnier', 'fishmonger'],
    ['arêtes', 'bones'],
    ['aretes', 'bones'],
    ['têtes', 'heads'],
    ['tetes', 'heads'],
    ['marmite', 'pot'],
    ['grand marmite', 'large pot'],
    ['grande marmite', 'large pot'],
    ['filet', 'thin stream'],
    ['filets', 'fillets'],
    ['côté', 'side'],
    ['cote', 'side'],
    ['douille étoile', 'star tip'],
    ['douille etoile', 'star tip'],
    ['douille longue', 'long piping tip'],
    ['poche', 'piping bag'],
    ['poche à douille', 'piping bag'],
    ['crème anglaise', 'custard'],
    ['creme anglaise', 'custard'],
    ['bords croustillants', 'crispy edges'],
    ['bords', 'edges'],
    ['croustillants', 'crispy'],
    ['croustillant', 'crispy'],
    ['fondant', 'soft'],
    ['lisse', 'smooth'],
    ['doucement', 'gently'],
    ['d’abord', 'first'],
    ["d'abord", 'first'],
    ['finir', 'finish'],
    ['flotter', 'float'],
    ['petit trou', 'small hole'],
    ['arrêter', 'stop'],
    ['arreter', 'stop'],
    ['chaque', 'each'],
    ['par donut', 'per donut'],
    ['plus lourd', 'heavier'],
    ['légèrement', 'slightly'],
    ['legerement', 'slightly'],
    ['coloration', 'browning'],
    ['forte coloration', 'strong browning'],
    ['forte', 'strong'],
    ['graisse', 'fat'],
    ['allumettes', 'strips'],
    ['gras jaune clair', 'clear yellow fat'],
    ['dépôt', 'sediment'],
    ['depot', 'sediment'],
    ['fond', 'bottom'],
    ['nouveau jaune', 'new yolk'],
    ['sécurité', 'safety'],
    ['securite', 'safety'],
    ['poisson', 'fish'],
    ['poissons', 'fish'],
    ['viande', 'meat'],
    ['volaille', 'poultry'],
    ['volailles', 'poultry'],
    ['porc', 'pork'],
    ['poulet', 'chicken'],
    ['bœuf', 'beef'],
    ['boeuf', 'beef'],
    ['agneau', 'lamb'],
    ['canard', 'duck'],
    ['saumon', 'salmon'],
    ['cabillaud', 'cod'],
    ['thon', 'tuna'],
    ['calamars', 'calamari'],
    ['calamar', 'calamari'],
    ['chipirons', 'baby squid'],
    ['encornets', 'squid'],
    ['gambas', 'prawns'],
    ['moules', 'mussels'],
    ['coquilles saint-jacques', 'scallops'],
    ['saint-jacques', 'scallops'],
    ['pommes de terre', 'potatoes'],
    ['pomme de terre', 'potato'],
    ['carottes', 'carrots'],
    ['carotte', 'carrot'],
    ['tomates cerises', 'cherry tomatoes'],
    ['tomates', 'tomatoes'],
    ['tomate', 'tomato'],
    ['oignons blancs', 'white onions'],
    ['oignons', 'onions'],
    ['oignon', 'onion'],
    ['échalotes', 'shallots'],
    ['échalote', 'shallot'],
    ['ail des ours', 'wild garlic'],
    ['gousses d’ail', 'garlic cloves'],
    ["gousses d'ail", 'garlic cloves'],
    ['gousse d’ail', 'garlic clove'],
    ["gousse d'ail", 'garlic clove'],
    ['ail', 'garlic'],
    ['persil plat', 'flat-leaf parsley'],
    ['persil', 'parsley'],
    ['coriandre', 'cilantro'],
    ['ciboulette', 'chives'],
    ['basilic', 'basil'],
    ['thym', 'thyme'],
    ['romarin', 'rosemary'],
    ['laurier', 'bay leaf'],
    ['origan', 'oregano'],
    ['aneth', 'dill'],
    ['menthe', 'mint'],
    ['citron vert', 'lime'],
    ['citron jaune', 'lemon'],
    ['citron', 'lemon'],
    ['orange', 'orange'],
    ['poire', 'pear'],
    ['poires', 'pears'],
    ['pomme', 'apple'],
    ['pommes', 'apples'],
    ['abricots', 'apricots'],
    ['abricot', 'apricot'],
    ['framboises', 'raspberries'],
    ['framboise', 'raspberry'],
    ['myrtilles', 'blueberries'],
    ['myrtille', 'blueberry'],
    ['cerises', 'cherries'],
    ['cerise', 'cherry'],
    ['fraises', 'strawberries'],
    ['fraise', 'strawberry'],
    ['farine t55', 'T55 flour'],
    ['farine t45', 'T45 flour'],
    ['farine', 'flour'],
    ['fécule de maïs', 'cornstarch'],
    ['fécule', 'starch'],
    ['levure chimique', 'baking powder'],
    ['levure boulangère', 'baker’s yeast'],
    ['poudre d’amandes', 'almond flour'],
    ["poudre d'amandes", 'almond flour'],
    ['amandes effilées', 'sliced almonds'],
    ['amandes', 'almonds'],
    ['noisettes torréfiées', 'toasted hazelnuts'],
    ['noisettes', 'hazelnuts'],
    ['noix', 'walnuts'],
    ['pignons', 'pine nuts'],
    ['sucre glace', 'icing sugar'],
    ['sucres', 'sugars'],
    ['sucre blond', 'light brown sugar'],
    ['sucre roux', 'brown sugar'],
    ['sucre semoule', 'caster sugar'],
    ['sucre', 'sugar'],
    ['miel liquide', 'runny honey'],
    ['miel', 'honey'],
    ['beurre doux', 'unsalted butter'],
    ['beurre fondu', 'melted butter'],
    ['beurre pommade', 'softened butter'],
    ['beurre', 'butter'],
    ['huile d’olive douce', 'mild olive oil'],
    ["huile d'olive douce", 'mild olive oil'],
    ['huile d’olive', 'olive oil'],
    ["huile d'olive", 'olive oil'],
    ['huile neutre', 'neutral oil'],
    ['huiles', 'oils'],
    ['huile', 'oil'],
    ['crème liquide entière', 'full-fat cream'],
    ['crème liquide', 'cream'],
    ['crème entière', 'full-fat cream'],
    ['crème', 'cream'],
    ['lait entier', 'whole milk'],
    ['lait chaud', 'hot milk'],
    ['lait froid', 'cold milk'],
    ['lait', 'milk'],
    ['œufs', 'eggs'],
    ['oeufs', 'eggs'],
    ['œuf', 'egg'],
    ['oeuf', 'egg'],
    ['jaunes d’œufs', 'egg yolks'],
    ["jaunes d'oeufs", 'egg yolks'],
    ['jaunes d’œuf', 'egg yolks'],
    ['blancs d’œufs', 'egg whites'],
    ["blancs d'oeufs", 'egg whites'],
    ['blancs d’œuf', 'egg whites'],
    ['moutarde de dijon', 'Dijon mustard'],
    ['moutarde à l’ancienne', 'whole-grain mustard'],
    ["moutarde à l'ancienne", 'whole-grain mustard'],
    ['moutarde', 'mustard'],
    ['vinaigre de cidre', 'cider vinegar'],
    ['vinaigre de riz', 'rice vinegar'],
    ['vinaigre', 'vinegar'],
    ['sauce soja salée', 'salted soy sauce'],
    ['sauce soja', 'soy sauce'],
    ['sauce huître', 'oyster sauce'],
    ['sauce huitre', 'oyster sauce'],
    ['sel fin', 'fine salt'],
    ['fleur de sel', 'sea salt flakes'],
    ['pincée de sel', 'pinch of salt'],
    ['poivre du moulin', 'freshly ground pepper'],
    ['poivre', 'pepper'],
    ['piment d’espelette', 'Espelette pepper'],
    ["piment d'espelette", 'Espelette pepper'],
    ['piment', 'chili'],
    ['paprika fumé', 'smoked paprika'],
    ['paprika doux', 'sweet paprika'],
    ['paprika', 'paprika'],
    ['cumin moulu', 'ground cumin'],
    ['cumin', 'cumin'],
    ['curcuma', 'turmeric'],
    ['gingembre', 'ginger'],
    ['muscade', 'nutmeg'],
    ['vanille', 'vanilla'],
    ['rhum ambré', 'dark rum'],
    ['rhum', 'rum'],
    ['vin blanc sec', 'dry white wine'],
    ['vin blanc', 'white wine'],
    ['vin rouge', 'red wine'],
    ['bouillon de volaille', 'chicken stock'],
    ['bouillon de légumes', 'vegetable stock'],
    ['bouillon', 'stock'],
    ['eau bouillante', 'boiling water'],
    ['eau froide', 'cold water'],
    ['eau chaude', 'hot water'],
    ['jus', 'juice'],
    ['eau', 'water'],
    ['anneaux de calamar', 'calamari rings'],
    ['aïoli citronné léger', 'light lemon aioli'],
    ['pâte légère', 'light batter'],
    ['jus d’un citron jaune', 'juice of one lemon'],
    ["jus d'un citron jaune", 'juice of one lemon'],
    ['gousse d’ail', 'garlic clove'],
    ["gousse d'ail", 'garlic clove'],
    ['blanc d’œuf', 'egg white'],
    ['blanc d’oeuf', 'egg white'],
    ['jaune d’œuf', 'egg yolk'],
    ['jaune d’oeuf', 'egg yolk'],
    ['calamars', 'calamari'],
    ['calamar', 'calamari'],
    ['eau gazeuse très froide', 'very cold sparkling water'],
    ['eau gazeuse glacée', 'ice-cold sparkling water'],
    ['eau gazeuse', 'sparkling water'],
    ['vodka très froide', 'very cold vodka'],
    ['ail écrasé', 'crushed garlic'],
    ['ail râpé', 'grated garlic'],
    ['beignets', 'fritters'],
    ['beignet', 'fritter'],
    ['mollusques', 'molluscs'],
    ['éponger', 'pat dry'],
    ['mariner', 'marinate'],
    ['mariné', 'marinated'],
    ['marinés', 'marinated'],
    ['rincer', 'rinse'],
    ['tubes', 'tubes'],
    ['anneaux', 'rings'],
    ['frais', 'chilled'],
    ['papier cuisson', 'parchment paper'],
    ['plaque de cuisson', 'baking sheet'],
    ['poche à douille', 'piping bag'],
    ['huile de friture', 'frying oil'],
    ['huile neutre', 'neutral oil'],
    ['eau froide', 'cold water'],
    ['eau chaude', 'hot water'],
    ['bouillon de volaille', 'chicken stock'],
    ['bouillon de légumes', 'vegetable stock'],
    ['vin blanc', 'white wine'],
    ['vin rouge', 'red wine'],
    ['sirop d’érable', 'maple syrup'],
    ["sirop d'érable", 'maple syrup'],
    ['paprika fumé', 'smoked paprika'],
    ['piment d’Espelette', 'Espelette pepper'],
    ["piment d'Espelette", 'Espelette pepper'],
    ['fleur de sel', 'sea salt flakes'],
    ['sucre roux', 'brown sugar'],
    ['cassonade', 'brown sugar'],
    ['fécule de maïs', 'cornstarch'],
    ['maïzena', 'cornstarch'],
    ['fécule', 'starch'],
    ['chapelure', 'breadcrumbs'],
    ['beurre froid', 'cold butter'],
    ['beurre mou', 'softened butter'],
    ['crème fraîche', 'creme fraiche'],
    ['crème épaisse', 'thick cream'],
    ['lait de coco', 'coconut milk'],
    ['mascarpone', 'mascarpone'],
    ['yaourt', 'yogurt'],
    ['chocolat au lait', 'milk chocolate'],
    ['citron confit', 'preserved lemon'],
    ['patates douces', 'sweet potatoes'],
    ['patate douce', 'sweet potato'],
    ['poivrons', 'bell peppers'],
    ['poivron', 'bell pepper'],
    ['petits pois', 'peas'],
    ['pois chiches', 'chickpeas'],
    ['haricots blancs', 'white beans'],
    ['haricots tarbais', 'Tarbais beans'],
    ['haricots', 'beans'],
    ['lentilles vertes', 'green lentils'],
    ['lentilles', 'lentils'],
    ['saucisse de Morteau', 'Morteau sausage'],
    ['saucisses', 'sausages'],
    ['saucisse', 'sausage'],
    ['poitrine fumée', 'smoked bacon'],
    ['jambon cru', 'prosciutto'],
    ['foie gras', 'foie gras'],
    ['saint-jacques', 'scallops'],
    ['noix de cajou', 'cashews'],
    ['poudre de noisettes', 'hazelnut flour'],
    ['papier sulfurisé', 'parchment paper'],
    ['cuillère à soupe', 'tablespoon'],
    ['cuillères à soupe', 'tablespoons'],
    ['cuillère à café', 'teaspoon'],
    ['cuillères à café', 'teaspoons'],
    ['c. à soupe', 'tbsp'],
    ['c. à café', 'tsp'],
    ['feu doux', 'low heat'],
    ['feu moyen', 'medium heat'],
    ['feu vif', 'high heat'],
    ['hors feu', 'off the heat'],
    ['à couvert', 'covered'],
    ['huile', 'oil'],
    ['eau', 'water'],
    ['bouillon', 'stock'],
    ['cidre', 'cider'],
    ['bière', 'beer'],
    ['rhum', 'rum'],
    ['whiskey', 'whiskey'],
    ['muscade', 'nutmeg'],
    ['paprika', 'paprika'],
    ['piment', 'chili'],
    ['cumin', 'cumin'],
    ['curcuma', 'turmeric'],
    ['curry', 'curry'],
    ['herbes', 'herbs'],
    ['laurier', 'bay leaf'],
    ['origan', 'oregano'],
    ['poivre', 'pepper'],
    ['sel', 'salt'],
    ['praliné', 'praline'],
    ['riz', 'rice'],
    ['pâtes', 'pasta'],
    ['blé', 'wheat'],
    ['canard', 'duck'],
    ['dinde', 'turkey'],
    ['chorizo', 'chorizo'],
    ['lardons', 'bacon lardons'],
    ['comté', 'Comté'],
    ['roquefort', 'Roquefort'],
    ['chèvre', 'goat cheese'],
    ['pistaches', 'pistachios'],
    ['gaufres', 'waffles'],
    ['pancakes', 'pancakes'],
    ['brioche', 'brioche'],
    ['velouté', 'creamy soup'],
    ['marinade', 'marinade'],
    ['garniture', 'filling'],
    ['dressage', 'plating'],
    ['poudre', 'powder'],
    ['en poudre', 'powdered'],
    ['émulsionner', 'emulsify'],
    ['emulsionner', 'emulsify'],
    ['émulsifier', 'emulsify'],
    ['emulsifier', 'emulsify'],
    ['cuisson', 'cooking'],
    ['préparation', 'preparation'],
    ['four', 'oven'],
    ['poêle', 'pan'],
    ['casserole', 'saucepan'],
    ['faitout', 'pot'],
    ['moule', 'pan'],
    ['saladier', 'mixing bowl'],
    ['bol', 'bowl'],
    ['fouet', 'whisk'],
    ['spatule', 'spatula'],
    ['maryse', 'spatula'],
    ['pinceau', 'brush'],
    ['morceaux', 'pieces'],
    ['dés', 'dice'],
    ['rondelles', 'slices'],
    ['lamelles', 'slices'],
    ['feuilles', 'leaves'],
    ['sucs', 'fond'],
    ['ébullition', 'boil'],
    ['progressivement', 'gradually'],
    ['délicatement', 'gently'],
    ['pincée', 'pinch'],
    ['gousses', 'cloves'],
    ['gousse', 'clove'],
    ['tiède', 'warm'],
    ['minutes', 'minutes'],
    ['minute', 'minute'],
    ['heures', 'hours'],
    ['heure', 'hour'],
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
    ['goûter', 'snack'],
    ['goûters', 'snacks'],
    ['apéro', 'appetizer'],
    ['apéros', 'appetizers'],
    ['entrée', 'starter'],
    ['entrées', 'starters'],
    ['plat', 'dish'],
    ['plats', 'dishes'],
    ['dessert', 'dessert'],
    ['desserts', 'desserts'],
    ['base', 'base'],
    ['bases', 'bases'],
    ['accompagnement', 'side'],
    ['accompagnements', 'sides'],
    ['variante', 'variant'],
    ['variantes', 'variants'],
    ['recette complète', 'full recipe'],
    ['recettes', 'recipes'],
    ['recette', 'recipe'],
    ['ingrédients', 'ingredients'],
    ['ingrédient', 'ingredient'],
    ['étapes', 'steps'],
    ['étape', 'step'],
    ['boutons', 'buttons'],
    ['bouton', 'button'],
    ['cartes', 'cards'],
    ['carte', 'card'],
    ['fiche', 'sheet'],
    ['fiches', 'sheets'],
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
    ['options', 'options'],
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
    ['printemps', 'spring'],
    ['été', 'summer'],
    ['automne', 'autumn'],
    ['hiver', 'winter'],
    ['personnes', 'people'],
    ['portions', 'servings'],
    ['parts', 'slices']
  ];

  const recipeGrammarReplacementsEn = [
    ['faire fondre', 'melt'],
    ['fais fondre', 'melt'],
    ['faire revenir', 'saute'],
    ['fais revenir', 'saute'],
    ['faire cuire', 'cook'],
    ['fais cuire', 'cook'],
    ['faire dorer', 'brown'],
    ['fais dorer', 'brown'],
    ['faire frémir', 'bring to a gentle simmer'],
    ['faire fremir', 'bring to a gentle simmer'],
    ['fais frémir', 'bring to a gentle simmer'],
    ['fais fremir', 'bring to a gentle simmer'],
    ['faire bouillir', 'bring to a boil'],
    ['fais bouillir', 'bring to a boil'],
    ['faire chauffer', 'heat'],
    ['fais chauffer', 'heat'],
    ['faire tremper', 'soak'],
    ['fais tremper', 'soak'],
    ['faire mariner', 'marinate'],
    ['fais mariner', 'marinate'],
    ['faire colorer', 'brown'],
    ['fais colorer', 'brown'],
    ['faire mousser', 'foam'],
    ['faire fumer', 'smoke'],
    ['faire trancher', 'split'],
    ['faire suer', 'sweat'],
    ['fais suer', 'sweat'],
    ['faire sauter', 'saute'],
    ['fais sauter', 'saute'],
    ['faire griller', 'grill'],
    ['fais griller', 'grill'],
    ['faire redescendre', 'bring down'],
    ['fais redescendre', 'bring down'],
    ['au dernier moment', 'at the last moment'],
    ['à la dernière minute', 'at the last minute'],
    ['a la derniere minute', 'at the last minute'],
    ['à mi-cuisson', 'halfway through cooking'],
    ['a mi-cuisson', 'halfway through cooking'],
    ['à température ambiante', 'at room temperature'],
    ['a temperature ambiante', 'at room temperature'],
    ['au réfrigérateur', 'in the refrigerator'],
    ['au refrigerateur', 'in the refrigerator'],
    ['au congélateur', 'in the freezer'],
    ['au congelateur', 'in the freezer'],
    ['au frais', 'in the refrigerator'],
    ['au froid', 'in the refrigerator'],
    ['au four', 'in the oven'],
    ['à la poêle', 'in a frying pan'],
    ['a la poele', 'in a frying pan'],
    ['à la plancha', 'on a plancha'],
    ['a la plancha', 'on a plancha'],
    ['bain-marie', 'water bath'],
    ['papier cuisson', 'parchment paper'],
    ['papier sulfurisé', 'parchment paper'],
    ['chaleur tournante', 'fan oven'],
    ['feu très doux', 'very low heat'],
    ['feu tres doux', 'very low heat'],
    ['feu doux', 'low heat'],
    ['feu moyen', 'medium heat'],
    ['feu vif', 'high heat'],
    ['hors du feu', 'off the heat'],
    ['hors feu', 'off the heat'],
    ['en filet', 'in a thin stream'],
    ['en pluie', 'gradually'],
    ['en morceaux', 'into pieces'],
    ['en cubes', 'into cubes'],
    ['en dés', 'into dice'],
    ['en des', 'into dice'],
    ['en rondelles', 'into slices'],
    ['en tranches', 'into slices'],
    ['en quartiers', 'into wedges'],
    ['en deux', 'in half'],
    ['par petites quantités', 'in small batches'],
    ['par petites quantites', 'in small batches'],
    ['par impulsions courtes', 'in short pulses'],
    ['pour émulsionner', 'to emulsify'],
    ['pour emulsionner', 'to emulsify'],
    ['pour émulsifier', 'to emulsify'],
    ['pour emulsifier', 'to emulsify'],
    ['un peu d’eau', 'a little water'],
    ["un peu d'eau", 'a little water'],
    ['un peu de jus', 'a little juice'],
    ['un peu d’huile', 'a little oil'],
    ["un peu d'huile", 'a little oil'],
    ['si besoin', 'if needed'],
    ['selon la texture', 'depending on the texture'],
    ['selon le fruit', 'depending on the fruit'],
    ['selon l’usage', 'depending on use'],
    ["selon l'usage", 'depending on use'],
    ['selon', 'depending on'],
    ['pas plus longtemps', 'no longer'],
    ['sans trop travailler', 'without overworking'],
    ['sans chauffer', 'without heating'],
    ['sans mélanger', 'without stirring'],
    ['sans melanger', 'without stirring'],
    ['bien égoutter', 'drain well'],
    ['bien egoutter', 'drain well'],
    ['bien froids', 'very cold'],
    ['bien froid', 'very cold'],
    ['bien froide', 'very cold'],
    ['bien chauds', 'very hot'],
    ['bien chaud', 'very hot'],
    ['bien chaude', 'very hot'],
    ['bien mélanger', 'mix well'],
    ['bien melanger', 'mix well'],
    ['bien remuer', 'stir well'],
    ['bien secouer', 'shake well'],
    ['bien sécher', 'dry thoroughly'],
    ['bien secher', 'dry thoroughly'],
    ['goûter et ajuster', 'taste and adjust'],
    ['gouter et ajuster', 'taste and adjust'],
    ['corriger sucre et acidité', 'adjust sugar and acidity'],
    ['corriger sel et citron', 'adjust salt and lemon'],
    ['ajuster acidité et sel', 'adjust acidity and salt'],
    ['ajuster citron ou huile', 'adjust lemon or oil'],
    ['ajuster la texture', 'adjust the texture'],
    ['préparer', 'prepare'],
    ['preparer', 'prepare'],
    ['préchauffer', 'preheat'],
    ['prechauffer', 'preheat'],
    ['sélectionner', 'select'],
    ['selectionner', 'select'],
    ['choisir', 'choose'],
    ['afficher', 'show'],
    ['respecter', 'respect'],
    ['mélanger', 'mix'],
    ['melanger', 'mix'],
    ['mettre', 'put'],
    ['fouetter', 'whisk'],
    ['ajouter', 'add'],
    ['verser', 'add'],
    ['cuire', 'cook'],
    ['chauffer', 'heat'],
    ['porter', 'bring'],
    ['rincer', 'rinse'],
    ['éponger', 'pat dry'],
    ['eponger', 'pat dry'],
    ['essuyer', 'pat dry'],
    ['tremper', 'dip'],
    ['frire', 'fry'],
    ['enrober', 'coat'],
    ['monter', 'assemble'],
    ['alterner', 'alternate'],
    ['mijoter', 'simmer'],
    ['rôtir', 'roast'],
    ['rotir', 'roast'],
    ['saler', 'salt'],
    ['passer', 'dust'],
    ['garder', 'keep'],
    ['réduire', 'reduce'],
    ['reduire', 'reduce'],
    ['couvrir', 'cover'],
    ['servir', 'serve'],
    ['réserver', 'set aside'],
    ['reserver', 'set aside'],
    ['mixer', 'blend'],
    ['goûter', 'taste'],
    ['gouter', 'taste'],
    ['laisser', 'let'],
    ['incorporer', 'fold in'],
    ['assaisonner', 'season'],
    ['dorer', 'brown'],
    ['refroidir', 'cool'],
    ['égoutter', 'drain'],
    ['egoutter', 'drain'],
    ['retirer', 'remove'],
    ['couper', 'cut'],
    ['émincer', 'slice thinly'],
    ['emincer', 'slice thinly'],
    ['hacher', 'chop'],
    ['déposer', 'place'],
    ['deposer', 'place'],
    ['placer', 'place'],
    ['filmer', 'cover with film'],
    ['enfourner', 'bake'],
    ['répartir', 'divide'],
    ['repartir', 'divide'],
    ['détailler', 'cut'],
    ['detailler', 'cut'],
    ['découper', 'cut out'],
    ['decouper', 'cut out'],
    ['tailler', 'cut'],
    ['badigeonner', 'brush'],
    ['recongeler', 'freeze again'],
    ['obtenir', 'get'],
    ['filtrer', 'strain'],
    ['infuser', 'infuse'],
    ['mariner', 'marinate'],
    ['tasser', 'pack down'],
    ['reposer', 'rest'],
    ['continuer', 'continue'],
    ['éviter', 'avoid'],
    ['eviter', 'avoid'],
    ['aider', 'help'],
    ['devenir', 'become'],
    ['rester', 'stay'],
    ['réveiller', 'brighten'],
    ['reveiller', 'brighten'],
    ['foncer', 'line'],
    ['garnir', 'fill'],
    ['déglacer', 'deglaze'],
    ['deglacer', 'deglaze'],
    ['concasser', 'crush'],
    ['pocher', 'pipe'],
    ['demander', 'ask'],
    ['disposer', 'arrange'],
    ['lever', 'fillet'],
    ['inciser', 'score'],
    ['aller', 'go'],
    ['sauter', 'saute'],
    ['peut être', 'can be'],
    ['peut etre', 'can be'],
    ['parer', 'trim'],
    ['sécher', 'dry'],
    ['secher', 'dry'],
    ['étaler', 'spread'],
    ['etaler', 'spread'],
    ['travailler', 'work'],
    ['former', 'shape'],
    ['torréfier', 'toast'],
    ['torrefier', 'toast'],
    ['blanchir', 'blanch'],
    ['éplucher', 'peel'],
    ['eplucher', 'peel'],
    ['écaler', 'shell'],
    ['ecaler', 'shell'],
    ['laver', 'wash'],
    ['râper', 'grate'],
    ['raper', 'grate'],
    ['ciseler', 'finely chop'],
    ['délayer', 'thin'],
    ['delayer', 'thin'],
    ['tamiser', 'sift'],
    ['remuer', 'stir'],
    ['retourner', 'turn over'],
    ['prolonger', 'extend'],
    ['utiliser', 'use'],
    ['vérifier', 'check'],
    ['verifier', 'check'],
    ['conserver', 'store'],
    ['stocker', 'store'],
    ['adapter', 'adjust'],
    ['corriger', 'adjust'],
    ['transférer', 'transfer'],
    ['transferer', 'transfer'],
    ['réfrigérer', 'refrigerate'],
    ['refrigerer', 'refrigerate'],
    ['congeler', 'freeze'],
    ['décongeler', 'thaw'],
    ['decongeler', 'thaw'],
    ['sortir', 'take out'],
    ['ouvrir', 'open'],
    ['décoller', 'release'],
    ['decoller', 'release'],
    ['pulvériser', 'spray'],
    ['pulveriser', 'spray'],
    ['crèmer', 'cream'],
    ['crémer', 'cream'],
    ['cremer', 'cream'],
    ['séparer', 'separate'],
    ['separer', 'separate'],
    ['étirer', 'stretch'],
    ['etirer', 'stretch'],
    ['poser', 'set'],
    ['terminer', 'finish'],
    ['napper', 'coat'],
    ['allonger', 'thin'],
    ['détendre', 'loosen'],
    ['detendre', 'loosen']
  ];

  const dynamicRules = [
    [/^(\d+) recipe card(s?)$/, match => `${match[1]} recipe card${match[1] === '1' ? '' : 's'}`],
    [/^(\d+) ingr\u00e9dient(s?)$/, match => `${match[1]} ingredient${match[1] === '1' ? '' : 's'}`],
    [/^(\d+) \u00e9tape(s?)$/, match => `${match[1]} step${match[1] === '1' ? '' : 's'}`],
    [/^(\d+) option(s?)$/, match => `${match[1]} option${match[1] === '1' ? '' : 's'}`],
    [/^(\d+)% pr\u00eat$/, match => `${match[1]}% ready`],
    [/^Actif (.+)$/, match => `Active ${match[1]}`],
    [/^Cuisson (.+)$/, match => `Cooking ${match[1]}`],
    [/^Repos (.+)$/, match => `Rest ${match[1]}`],
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
    [/^Copier le lien de (.+)$/, match => `Copy ${text(match[1])} link`],
    [/^Copier le texte de partage de (.+)$/, match => `Copy ${text(match[1])} share text`],
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
    [/^(.+) : point de vigilance\.$/, match => `${text(match[1])}: watch point.`],
    [/^Tu suis actuellement "(.+)". Le sélecteur au-dessus change aussi les ingrédients et les étapes\.$/, match => `You are currently using "${text(match[1])}". The selector above also changes the ingredients and steps.`],
    [/^Variante active : (.+). Ingrédients et étapes suivent ce choix\.$/, match => `Active variant: ${text(match[1])}. Ingredients and steps follow this choice.`],
    [/^Choisis une variante au-dessus pour afficher les ingrédients détaillés et les étapes correspondantes\.$/, () => 'Choose a variant above to show the detailed ingredients and matching steps.'],
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

  function capitalizeRecipeEnglish(value) {
    const text = String(value || '').trim();
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
  }

  function cleanRecipeEnglish(value) {
    return String(value || '')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s+([,.;:])/g, '$1')
      .replace(/\bd[â€™'’](?=\p{L})/giu, 'of ')
      .replace(/\bl[â€™'’](?=\p{L})/giu, '')
      .replace(/\bof with\b/gi, 'with')
      .replace(/\bwith with\b/gi, 'with')
      .replace(/\bfor with\b/gi, 'for')
      .replace(/\bto with\b/gi, 'with')
      .replace(/\bfor emulsify\b/gi, 'to emulsify')
      .replace(/\bor of\b/gi, 'or')
      .replace(/\band of\b/gi, 'and')
      .replace(/\bpeu of\b/gi, 'little')
      .replace(/\ba peu\b/gi, 'a little')
      .replace(/\bsi nÃ©cessaire\b/gi, 'if needed')
      .replace(/\bsi nécessaire\b/gi, 'if needed')
      .replace(/\bsi\s+/gi, 'if ')
      .replace(/\bin in\b/gi, 'in')
      .replace(/\bthe the\b/gi, 'the')
      .replace(/\bde\s+/gi, 'of ')
      .replace(/\bd'\s*/gi, 'of ')
      .replace(/\bdu\s+/gi, 'of ')
      .replace(/\bdes\s+/gi, 'of ')
      .replace(/\bau\s+/gi, 'with ')
      .replace(/\baux\s+/gi, 'with ')
      .replace(/\bÃ \s+/gi, 'to ')
      .replace(/\bà\s+/gi, 'to ')
      .replace(/\bavec\s+/gi, 'with ')
      .replace(/\bet,/gi, 'and,')
      .replace(/\bet\s+/gi, 'and ')
      .replace(/\bou\s+/gi, 'or ')
      .replace(/\bdans\s+/gi, 'in ')
      .replace(/\ben\s+/gi, 'in ')
      .replace(/\bsur\s+/gi, 'on ')
      .replace(/\bsous\s+/gi, 'under ')
      .replace(/\bsans\s+/gi, 'without ')
      .replace(/\bpuis\s+/gi, 'then ')
      .replace(/\bquand\s+/gi, 'when ')
      .replace(/\bavant\s+/gi, 'before ')
      .replace(/\baprÃ¨s\s+/gi, 'after ')
      .replace(/\bapr\u00e8s\s+/gi, 'after ')
      .replace(/\bpendant\s+/gi, 'for ')
      .replace(/\bjusqu[â€™']Ã \s+/gi, 'until ')
      .replace(/\bjusqu[’']à\s+/gi, 'until ')
      .replace(/\btrÃ¨s\s+/gi, 'very ')
      .replace(/\btr\u00e8s\s+/gi, 'very ')
      .replace(/\btrop\s+/gi, 'too ')
      .replace(/\bbien\s+/gi, 'well ')
      .replace(/\ble\s+/gi, 'the ')
      .replace(/\bla\s+/gi, 'the ')
      .replace(/\bles\s+/gi, 'the ')
      .replace(/\bl'\s*/gi, '')
      .replace(/\bun\s+/gi, 'a ')
      .replace(/\bune\s+/gi, 'a ')
      .replace(/\bce\s+/gi, 'this ')
      .replace(/\bcette\s+/gi, 'this ')
      .replace(/\bces\s+/gi, 'these ')
      .replace(/\bson\s+/gi, 'its ')
      .replace(/\bsa\s+/gi, 'its ')
      .replace(/\bses\s+/gi, 'its ')
      .replace(/\bleur\s+/gi, 'their ')
      .replace(/\bleurs\s+/gi, 'their ')
      .replace(/\bplus\s+longtemps\b/gi, 'longer')
      .replace(/\bpas\s+/gi, 'not ')
      .replace(/\bne\s+/gi, '')
      .replace(/\bn['â€™’]\s*/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function translateRecipeFragment(value) {
    const exact = phraseLookupEn.get(normalizeI18nKey(value));
    if (exact) return exact;
    return cleanRecipeEnglish(replaceCulinaryTerms(repairI18nMojibake(value)));
  }

  const recipeStructureRulesEn = [
    [/^(.+?)\s+au four(?:,?\s+(.+))?$/i, match => {
      const base = translateRecipeFragment(match[1]);
      return match[2] ? `${base} baked with ${translateRecipeFragment(match[2])}` : `Baked ${base}`;
    }],
    [/^(.+?)\s+aux\s+(.+)$/i, match => `${translateRecipeFragment(match[1])} with ${translateRecipeFragment(match[2])}`],
    [/^(.+?)\s+au\s+(.+)$/i, match => `${translateRecipeFragment(match[1])} with ${translateRecipeFragment(match[2])}`],
    [/^(.+?)\s+à la\s+(.+)$/i, match => `${translateRecipeFragment(match[1])} with ${translateRecipeFragment(match[2])}`],
    [/^(.+?)\s+à l[’'](.+)$/i, match => `${translateRecipeFragment(match[1])} with ${translateRecipeFragment(match[2])}`],
    [/^(.+?)\s+en\s+(.+)$/i, match => `${translateRecipeFragment(match[1])} in ${translateRecipeFragment(match[2])}`],
    [/^(Brochettes?)\s+(.+)$/i, match => `${translateRecipeFragment(match[2])} ${translateRecipeFragment(match[1])}`],
    [/^(Beignets?|Billes|Brochettes|Bricks|Croquettes|Verrines|Gressins|Madeleines|Muffins|Cookies|Choux|Donuts|Churros|Tempura|Curry|Gratin|Salade|Soupe|Velouté|Purée|Crumble|Tarte|Gâteau|Crème|Sauce|Coulis|Compotée|Poêlée|Ragoût)\s+de\s+(.+)$/i, match => `${translateRecipeFragment(match[2])} ${translateRecipeFragment(match[1])}`]
  ];

  function translateRecipeStructure(source) {
    if (/[.;!?]/.test(source) || source.length > 110) return '';
    for (const [pattern, render] of recipeStructureRulesEn) {
      const match = source.match(pattern);
      if (!match) continue;
      const translated = cleanRecipeEnglish(render(match));
      if (translated && normalizeI18nKey(translated) !== normalizeI18nKey(source)) {
        return capitalizeRecipeEnglish(translated);
      }
    }
    return '';
  }

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

  function replaceRecipeGrammar(value) {
    let output = ` ${repairI18nMojibake(value)} `;
    recipeGrammarReplacementsEn
      .slice()
      .sort((left, right) => right[0].length - left[0].length)
      .forEach(([source, translated]) => {
        const normalizedSource = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[â€™'’]/g, "[â€™'’]");
        output = output.replace(new RegExp(`(^|[^\\p{L}])${normalizedSource}(?=$|[^\\p{L}])`, 'giu'), `$1${translated}`);
      });
    return cleanRecipeEnglish(output);
  }

  function looksLikeRecipeText(value) {
    const key = normalizeI18nKey(value);
    if (!key || key.length > 700 || /[<>]/.test(value)) return false;
    return culinaryReplacementsEn.some(([source]) => key.includes(normalizeI18nKey(source)))
      || /\b\d+\s*(?:g|kg|ml|cl|l|min|h|%|c)\b/i.test(key)
      || /\b(?:cuire|cuis|fouetter|fouette|melanger|melange|mixer|mixe|ajouter|ajoute|verser|verse|servir|sers|mettre|mets|faire|fais|prechauffer|prechauffe|preparer|prepare|rincer|rince|eponger|eponge|chauffer|chauffe|tremper|trempe|frire|frit|saler|sale|passer|passe|garder|garde|enrober|enrobe|monter|monte|alterner|alterne|reserver|reserve|laisser|laisse|incorporer|incorpore|assaisonner|assaisonne|egoutter|egoutte|retirer|retire|couper|coupe|enfourner|enfourne|dorer|dore|cremer|creme|pocher|poche|foncer|fonce|garnir|garnis|deglacer|deglace|concasser|concasse|tailler|taille|decouper|decoupe|badigeonner|badigeonne|reposer|repose|continuer|continue|eviter|evite|aider|aide|devenir|devient|rester|reste|filtrer|filtre|infuser|infuse|mariner|marine)\b/i.test(key);
  }

  function translateRecipeText(value) {
    const source = repairI18nMojibake(value).trim();
    const exact = recipePhraseEn[source] || phraseLookupEn.get(normalizeI18nKey(source));
    if (exact) return exact;
    const tagFreeSource = source.replace(/<[^>]+>/g, '').trim();
    if (tagFreeSource && tagFreeSource !== source) {
      const tagFreeTranslation = translateRecipeText(tagFreeSource);
      if (tagFreeTranslation) return tagFreeTranslation;
    }
    const structured = translateRecipeStructure(source);
    if (structured) return structured;
    if (!looksLikeRecipeText(source)) return '';

    let translated = replaceRecipeGrammar(replaceCulinaryTerms(source))
      .replace(/\bFais cuire\b/gi, 'Cook')
      .replace(/\bFaire cuire\b/gi, 'Cook')
      .replace(/\bFais revenir\b/gi, 'Sauté')
      .replace(/\bFaire revenir\b/gi, 'Sauté')
      .replace(/\bFais dorer\b/gi, 'Brown')
      .replace(/\bFaire dorer\b/gi, 'Brown')
      .replace(/\bFais frémir\b/gi, 'Bring to a gentle simmer')
      .replace(/\bFaire frémir\b/gi, 'Bring to a gentle simmer')
      .replace(/\bPréchauffe\b/gi, 'Preheat')
      .replace(/\bPr\u00e9chauffer\b/gi, 'Preheat')
      .replace(/\bMélange\b/gi, 'Mix')
      .replace(/\bM\u00e9langer\b/gi, 'Mix')
      .replace(/\bPrépare\b/gi, 'Prepare')
      .replace(/\bPr\u00e9parer\b/gi, 'Prepare')
      .replace(/\bRince\b/gi, 'Rinse')
      .replace(/\bRincer\b/gi, 'Rinse')
      .replace(/\bÉponge\b/gi, 'Pat dry')
      .replace(/\bÉponger\b/gi, 'Pat dry')
      .replace(/\bEssuie\b/gi, 'Pat dry')
      .replace(/\bEssuyer\b/gi, 'Pat dry')
      .replace(/\bChauffe\b/gi, 'Heat')
      .replace(/\bChauffer\b/gi, 'Heat')
      .replace(/\bTrempe\b/gi, 'Dip')
      .replace(/\bTremper\b/gi, 'Dip')
      .replace(/\bFouette\b/gi, 'Whisk')
      .replace(/\bFouetter\b/gi, 'Whisk')
      .replace(/\bAjoute\b/gi, 'Add')
      .replace(/\bAjouter\b/gi, 'Add')
      .replace(/\bVerse\b/gi, 'Pour')
      .replace(/\bVerser\b/gi, 'Pour')
      .replace(/\bCuis\b/gi, 'Cook')
      .replace(/\bCuire\b/gi, 'Cook')
      .replace(/\bFais frire\b/gi, 'Fry')
      .replace(/\bFrire\b/gi, 'Fry')
      .replace(/\bEnrobe\b/gi, 'Coat')
      .replace(/\bEnrober\b/gi, 'Coat')
      .replace(/\bMonte\b/gi, 'Assemble')
      .replace(/\bMonter\b/gi, 'Assemble')
      .replace(/\bAlterne\b/gi, 'Alternate')
      .replace(/\bAlterner\b/gi, 'Alternate')
      .replace(/\bMijote\b/gi, 'Simmer')
      .replace(/\bMijoter\b/gi, 'Simmer')
      .replace(/\bRôtis\b/gi, 'Roast')
      .replace(/\bRôtir\b/gi, 'Roast')
      .replace(/\bSecoue\b/gi, 'Shake')
      .replace(/\bSecouer\b/gi, 'Shake')
      .replace(/\bSale\b/gi, 'Salt')
      .replace(/\bSaler\b/gi, 'Salt')
      .replace(/\bPasse\b/gi, 'Dust')
      .replace(/\bPasser\b/gi, 'Dust')
      .replace(/\bGarde\b/gi, 'Keep')
      .replace(/\bGarder\b/gi, 'Keep')
      .replace(/\bPorte\b/gi, 'Bring')
      .replace(/\bPorter\b/gi, 'Bring')
      .replace(/\bFlambe\b/gi, 'Flambé')
      .replace(/\bFlamber\b/gi, 'Flambé')
      .replace(/\bRéduis\b/gi, 'Reduce')
      .replace(/\bRéduire\b/gi, 'Reduce')
      .replace(/\bCouvre\b/gi, 'Cover')
      .replace(/\bCouvrir\b/gi, 'Cover')
      .replace(/\bSers\b/gi, 'Serve')
      .replace(/\bServir\b/gi, 'Serve')
      .replace(/\bRéserve\b/gi, 'Set aside')
      .replace(/\bR\u00e9server\b/gi, 'Set aside')
      .replace(/\bMixe\b/gi, 'Blend')
      .replace(/\bMixer\b/gi, 'Blend')
      .replace(/\bGoûte\b/gi, 'Taste')
      .replace(/\bGo\u00fbter\b/gi, 'Taste')
      .replace(/\bLaisse\b/gi, 'Let')
      .replace(/\bLaisser\b/gi, 'Let')
      .replace(/\bIncorpore\b/gi, 'Fold in')
      .replace(/\bIncorporer\b/gi, 'Fold in')
      .replace(/\bAssaisonne\b/gi, 'Season')
      .replace(/\bAssaisonner\b/gi, 'Season')
      .replace(/\bDore\b/gi, 'Brown')
      .replace(/\bDorer\b/gi, 'Brown')
      .replace(/\bRefroidis\b/gi, 'Cool')
      .replace(/\bRefroidir\b/gi, 'Cool')
      .replace(/\bÉgoutte\b/gi, 'Drain')
      .replace(/\bÉgoutter\b/gi, 'Drain')
      .replace(/\bRetire\b/gi, 'Remove')
      .replace(/\bRetirer\b/gi, 'Remove')
      .replace(/\bCoupe\b/gi, 'Cut')
      .replace(/\bCouper\b/gi, 'Cut')
      .replace(/\bÉmince\b/gi, 'Slice thinly')
      .replace(/\bÉmincer\b/gi, 'Slice thinly')
      .replace(/\bHache\b/gi, 'Chop')
      .replace(/\bHacher\b/gi, 'Chop')
      .replace(/\bDépose\b/gi, 'Place')
      .replace(/\bDéposer\b/gi, 'Place')
      .replace(/\bPlace\b/gi, 'Place')
      .replace(/\bFilme\b/gi, 'Cover with film')
      .replace(/\bFilmer\b/gi, 'Cover with film')
      .replace(/\bEnfourne\b/gi, 'Bake')
      .replace(/\bEnfourner\b/gi, 'Bake');

    translated = cleanRecipeEnglish(translated);

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

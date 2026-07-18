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
    'Inspiration du matin': 'Morning inspiration',
    'Cuisine du jour': 'Today\'s kitchen',
    'Table du soir': 'Evening table',
    'Que voulez-vous cuisiner ?': 'What would you like to cook?',
    'Recherchez une recette, un ingredient ou une envie dans votre carnet.': 'Search your notebook for a recipe, ingredient or craving.',
    'Rechercher une recette ou un ingredient': 'Search for a recipe or ingredient',
    'Composer un menu': 'Plan a menu',
    'Mes favoris': 'My favorites',
    'Liste de courses': 'Shopping list',
    'Acces rapides Cook Note': 'Cook Note quick access',
    'Raccourcis culinaires': 'Cooking shortcuts',
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
    'Copier la fiche': 'Copy recipe',
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
    'Pomme de terre': 'Potato',
    'Feculent': 'Starchy food',
    'Toute saison': 'Year-round',
    'Au sec, a l abri de la lumiere; jamais au froid humide.': 'Store in a dry, dark, well-ventilated place; never in a damp refrigerator.',
    'Ail, romarin, beurre, moutarde, fromage.': 'Garlic, rosemary, butter, mustard and cheese.',
    'Trop travailler une puree: texture elastique.': 'Overworking mashed potatoes makes them gluey.',
    'Mise en place': 'Setup',
    'Exécution': 'Execution',
    'Mémo': 'Memo',
    'Allergènes': 'Allergens',
    'Aucun allergène majeur détecté dans les ingrédients.': 'No major allergen detected in the ingredients.',
    'Gluten': 'Gluten',
    'Lait': 'Milk',
    'Mollusques': 'Molluscs',
    'Mer : point de vigilance.': 'Seafood: watch point.',
    'Crustacés': 'Shellfish',
    'Moutarde': 'Mustard',
    'Œufs': 'Eggs',
    'Oeufs': 'Eggs',
    'Œufs crus': 'Raw eggs',
    'Oeufs crus': 'Raw eggs',
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
    'Tenue': 'Stability',
    'Usage': 'Use',
    'Température': 'Temperature',
    'Égouttage': 'Draining',
    'Travail': 'Handling',
    'Équilibre': 'Balance',
    'Maturité': 'Ripeness',
    'Texture': 'Texture',
    'Utilisation': 'Use',
    'Appareil': 'Mixture',
    'Friture': 'Frying',
    'Finition': 'Finishing',
    'Assemblage': 'Assembly',
    'Assemblage final': 'Final assembly',
    'Composants liés': 'Linked components',
    'Conversion levure': 'Yeast conversion',
    'Pâte légère à frire': 'Light frying batter',
    'à frire': 'for frying',
    'Raccourcis': 'Shortcuts',
    'Raccourcis ': 'Shortcuts: ',
    'Raccourcis Pâte légère à frire / Aïoli citronné léger / Tempura.': 'Shortcuts: light frying batter / light lemon aioli / tempura.',
    'La pâte doit rester froide, légère et légèrement irrégulière.': 'The batter should stay cold, light and slightly uneven.',
    'À servir immédiatement après cuisson pour garder le croustillant.': 'Serve immediately after cooking to keep it crisp.',
    'Si besoin, réchauffer brièvement au four chaud sur grille, jamais au micro-ondes.': 'If needed, reheat briefly in a hot oven on a rack, never in the microwave.',
    'Ne surcharge pas le bain d’huile pour garder une friture nette et non grasse.': 'Do not overcrowd the oil bath; it keeps the frying clean and light.',
    'Ne prolonge pas la cuisson le calamar devient vite caoutchouteux.': 'Do not extend the cooking time: calamari turns rubbery quickly.',
    'Beignets dorés, croûte fine et croustillante, calamar encore tendre.': 'Golden fritters with a thin, crisp crust and tender calamari.',
    'Croûte fine et croustillante, calamar tendre.': 'Thin, crisp crust with tender calamari.',
    '180°C pour saisir vite sans graisser.': '180°C to sear quickly without making the batter greasy.',
    'Préférer une grille au papier pour éviter la vapeur.': 'Use a rack rather than paper towels to avoid steam.',
    'Résumé': 'Summary',
    'Fiche rapide': 'Quick sheet',
    'Fiche active': 'Active sheet',
    'Temps actif': 'Active time',
    'Cuisson': 'Cooking',
    'Repos / froid': 'Rest / chilling',
    'Difficulté': 'Difficulty',
    'Quantité': 'Quantity',
    'Saison': 'Season',
    'Repères': 'Practical cues',
    'Repère indicatif': 'Guideline',
    'Repères de préparation': 'Prep timeline',
    'Infos pratiques': 'Practical info',
    'À savoir': 'Good to know',
    'Erreurs à éviter': 'Mistakes to avoid',
    'Résultat attendu': 'Expected result',
    'Réchauffage': 'Reheating',
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
    'Choix requis': 'Choice required',
    'Consulte les notes, allergènes et points techniques avant de lancer la recette.': 'Review the notes, allergens and technical points before starting the recipe.',
    'Sélectionne une variante pour afficher les informations de la fiche rapide.': 'Select a variant to show the quick sheet.',
    'Sélectionne une variante pour afficher les détails.': 'Select a variant to show the details.',
    'Choisis une variante pour afficher les ingrédients et les étapes correspondantes.': 'Choose a variant to show the matching ingredients and steps.',
    'Choisis un groupe d’ingrédients': 'Choose an ingredient group',
    'Ouvre un groupe d’ingrédients pour afficher les étapes correspondantes.': 'Open an ingredient group to show the matching steps.',
    'Glisse pour passer d’un panneau à l’autre': 'Swipe between panels',
    'Voir les notes': 'View notes',
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
    'Point clé': 'Key point',
    'Résumé de la recette': 'Recipe summary',
    'Allergènes détectés': 'Detected allergens',
    'Allergenes detectes': 'Detected allergens',
    'Liste des allergènes détectés': 'Detected allergen list',
    'Liste des allergenes detectes': 'Detected allergen list',
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
    'Collection': 'Collection',
    'Bases salées': 'Savory bases',
    'Ricotta fouettée': 'Whipped ricotta',
    'Version séchées': 'Dried version',
    'Version confites': 'Confit version',
    'Version babeurre': 'Buttermilk version',
    'Pâtissière': 'Pastry cream',
    'Craquelin': 'Craquelin topping',
    'Garnissage': 'Filling',
    'Pâte': 'Dough',
    'Pâte à crumble': 'Crumble topping',
    'Fruits': 'Fruit',
    'Légumes & aromates': 'Vegetables and aromatics',
    'Liquides': 'Liquids',
    'Appareil': 'Mixture',
    'Meringues': 'Meringues',
    'Verser le vinaigre balsamique dans une petite casserole à fond épais.': 'Pour the balsamic vinegar into a small heavy-bottomed saucepan.',
    'Verser sur les ingredients secs et mélanger juste assez pour garder une pâte épaisse.': 'Pour over the dry ingredients and mix just enough to keep a thick batter.',
    'Verser sur les ingrédients secs et mélanger juste assez pour garder une pâte épaisse.': 'Pour over the dry ingredients and mix just enough to keep a thick batter.',
    'Rôtir 20 à 25min face coupee vers le haut, jusqu’au jus concentre et aux bords légèrement fripes.': 'Roast for 20 to 25 minutes cut side up, until the juices are concentrated and the edges are lightly wrinkled.',
    'Rôtir 20 à 25min face coupée vers le haut, jusqu’au jus concentré et aux bords légèrement fripés.': 'Roast for 20 to 25 minutes cut side up, until the juices are concentrated and the edges are lightly wrinkled.',
    'Cuire jusqu’aux bords dorés et au centre encore tendre, puis laisser tiédir sur plaque avant de déplacer.': 'Cook until golden at the edges and still tender in the center, then let cool until warm on the tray before moving.',
    'Mise en place courte : garder les ingredients visibles avant cuisson.': 'Short prep: keep the ingredients visible before cooking.',
    'Mise en place courte : garder les ingrédients visibles avant cuisson.': 'Short prep: keep the ingredients visible before cooking.',
    'Prevoir le repos avant de promettre le service.': 'Allow for the resting time before promising service.',
    'Prévoir le repos avant de promettre le service.': 'Allow for the resting time before promising service.',
    'A estimer': 'To estimate',
    'À estimer': 'To estimate',
    'Fiche recette copiée': 'Recipe copied',
    'Servir chaud, juste après cuisson.': 'Serve hot, right after cooking.',
    'Laisser reposer le temps indiqué, puis servir chaud.': 'Let it rest for the indicated time, then serve hot.',
    'Servir frais, après le repos au froid indiqué.': 'Serve chilled, after the indicated cold rest.',
    'Servir tiède ou à température ambiante selon la texture recherchée.': 'Serve warm or at room temperature, depending on the texture you want.',
    "Servir tartinable, sorti quelques minutes du froid selon l'usage.": 'Serve spreadable, taken out of the fridge a few minutes beforehand depending on use.',
    'Saler ou finir juste avant d’envoyer pour garder le croustillant.': 'Salt or finish just before serving to keep it crisp.',
    'Faire les finitions au dernier moment.': 'Add the finishing touches at the last moment.',
    'Après cuisson : refroidis rapidement, conserve en boîte hermétique au réfrigérateur 3–4 jours et réchauffe au four, à la poêle ou doucement selon la texture.': 'After cooking: cool quickly, store in an airtight container in the fridge for 3 to 4 days, and reheat in the oven, in a pan, or gently depending on the texture.',
    'Après préparation : conserve au réfrigérateur à 0–4°C en contenant propre fermé et consomme sous 24–48h.': 'After preparation: store in a clean closed container in the fridge at 0 to 4°C and eat within 24 to 48 hours.',
    'Après préparation : conserve couvert dans un contenant propre ; mets au réfrigérateur dès qu’il y a humidité, fruit coupé, sauce ou garniture fraîche.': 'After preparation: keep covered in a clean container; refrigerate whenever there is moisture, cut fruit, sauce, or a fresh garnish.'
  };

  const recipePhraseEn = {
    'Brochettes crevettes chorizo': 'Shrimp and chorizo skewers',
    'Beignets de calamar': 'Calamari fritters',
    'Gressins fromage olives': 'Cheese and olive breadsticks',
    'Oeufs cocotte chorizo': 'Baked eggs with chorizo',
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
    'Gaspacho tomate, menthe et basilic': 'Tomato, mint and basil gazpacho',
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
    'Faire un petit trou sur le côté de chaque beignet tiède ou froid. Mettre la crème en poche avec une douille longue. Pocher 30–40g de crème par beignet — arrêter dès qu’il devient légèrement plus lourd.': 'Make a small hole in the side of each warm or cold beignet. Put the cream in a piping bag fitted with a long tip. Pipe in 30 to 40g of cream per beignet, stopping as soon as it feels slightly heavier.',
    "Faire un petit trou sur le côté de chaque beignet tiède ou froid. Mettre la crème en poche avec une douille longue. Pocher 30–40g de crème par beignet — arrêter dès qu'il devient légèrement plus lourd.": 'Make a small hole in the side of each warm or cold beignet. Put the cream in a piping bag fitted with a long tip. Pipe in 30 to 40g of cream per beignet, stopping as soon as it feels slightly heavier.',
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
    'Fouetter les œufs avec le sucre et le sel sans faire trop mousser.': 'Whisk the eggs with the sugar and salt without making the mixture too foamy.',
    'Plier en triangles serres.': 'Fold into tight triangles.',
    'Repere menu : version plus moutardee que la fiche saucisse lentilles.': 'Menu cue: more mustard-forward than the sausage and lentils sheet.',
    'Batteur ou robot': 'Hand mixer or stand mixer',
    'Ne pas mixer la patate douce longtemps, elle deviendrait collante.': 'Do not blend the sweet potato too long; it would become sticky.',
    'Mieux vaut couper regulierement et prolonger 1 a 2min que trop cuire des le depart.': 'It is better to cut evenly and add 1 to 2 minutes than to overcook from the start.',
    'Minuteur': 'Timer',
    'Ne pas remplir au-dela du niveau de securite.': 'Do not fill beyond the safety level.',
    'La sauce huitre apporte une note salee-sucree, mais la recette reste bonne sans elle.': 'Oyster sauce adds a sweet-salty note, but the recipe is still good without it.',
    'Repartir dans le panier de l air fryer sans trop tasser.': 'Spread in the air-fryer basket without packing too tightly.',
    'Remuer': 'Stir',
    'Ne pas surcharger le panier.': 'Do not overcrowd the basket.',
    'La veille': 'The day before',
    'S il n est pas parfaitement sec, le repartir sur une plaque et secher 15 a 20min a 100C.': 'If it is not perfectly dry, spread it on a tray and dry for 15 to 20 minutes at 100C.',
    'Eviter le mixeur, il rendrait l amidon elastique.': 'Avoid the blender; it would make the starch elastic.',
    'Elle saisit la surface et limite l effet pomme de terre vapeur.': 'It sears the surface and limits the steamed-potato effect.',
    'Les frites doivent se toucher le moins possible.': 'The fries should touch as little as possible.',
    'Les carottes retiennent de l eau, il faut les laisser bien s egoutter.': 'Carrots hold water, so let them drain well.',
    'Il s incorpore mieux et garde la puree souple.': 'It folds in better and keeps the mash soft.',
    'Elle confit sans dessecher et laisse le romarin infuser.': 'It confits without drying out and lets the rosemary infuse.',
    'Ne pas hacher le romarin trop finement, il brulerait plus vite.': 'Do not chop the rosemary too finely; it would burn faster.',
    'sans lactose': 'lactose-free',
    'Il detend la pate et rend les crepes plus souples.': 'It relaxes the batter and makes the crepes more flexible.',
    'Le rhum doit parfumer sans dominer, il peut etre supprime pour une version familiale.': 'The rum should perfume without dominating; it can be omitted for a family version.',
    'Remplir les caissettes aux trois quarts.': 'Fill the paper cases three-quarters full.',
    'Ne pas noyer la brioche, elle casserait dans la poele.': 'Do not soak the brioche too much; it would break in the pan.',
    "Repartir dans le panier de l'air fryer sans trop tasser.": 'Spread in the air-fryer basket without packing too tightly.',
    "S'il n'est pas parfaitement sec, le repartir sur une plaque et secher 15 a 20min a 100C.": 'If it is not perfectly dry, spread it on a tray and dry for 15 to 20 minutes at 100C.',
    "Eviter le mixeur, il rendrait l'amidon elastique.": 'Avoid the blender; it would make the starch elastic.',
    "Elle saisit la surface et limite l'effet pomme de terre vapeur.": 'It sears the surface and limits the steamed-potato effect.',
    "Les carottes retiennent de l'eau, il faut les laisser bien s'egoutter.": 'Carrots hold water, so let them drain well.',
    "Il s'incorpore mieux et garde la puree souple.": 'It folds in better and keeps the mash soft.',
    "Rouler le biscuit dans le torchon pendant qu'il est encore chaud, puis laisser tiedir.": 'Roll the sponge in the towel while it is still hot, then let it cool until warm.',
    'Ne pas attendre que le biscuit refroidisse a plat avant de le rouler.': 'Do not wait for the sponge to cool flat before rolling it.',
    'Incorporer les jaunes au chocolat tiede, un par un.': 'Fold the yolks into the warm chocolate, one at a time.'
  };

  const culinaryReplacementsEn = [
    ['ne presse pas trop fort', 'do not press too hard'],
    ['presse pas trop fort', 'do not press too hard'],
    ['peut devenir amer', 'can turn bitter'],
    ['peut devenir amere', 'can turn bitter'],
    ['ne reduis pas trop', 'do not reduce too much'],
    ['reduit pas trop', 'does not reduce too much'],
    ['evite de cuire', 'avoid cooking'],
    ['eviter de cuire', 'avoid cooking'],
    ['perd sa couleur verte', 'loses its green color'],
    ['donne plutot une texture de', 'gives more of a'],
    ['detends bien apres mixage', 'loosen well after blending'],
    ['filtre soigneusement', 'strain carefully'],
    ['filtrer soigneusement', 'strain carefully'],
    ['plus genants que ceux de', 'more noticeable than those of'],
    ['plus genantes que celles de', 'more noticeable than those of'],
    ['mixeur plongeant', 'immersion blender'],
    ['blender puissant', 'high-powered blender'],
    ['un blender puissant', 'a high-powered blender'],
    ['astuce cuisson cru', 'no-cook tip'],
    ['astuce cuisson', 'cooking tip:'],
    ['finition commune', 'common finish'],
    ['apres refroidissement', 'after cooling'],
    ['texture nappante', 'coating consistency'],
    ['texture de compote fluide', 'loose compote texture'],
    ['compote fluide', 'loose compote'],
    ['bonne brillance', 'nice shine'],
    ['sucre present mais pas dominant', 'noticeable but not dominant sweetness'],
    ['acidite assez vive', 'bright enough acidity'],
    ['reveiller le fruit', 'wake up the fruit'],
    ['filme au contact', 'cover with film directly on the surface'],
    ['filmer au contact', 'cover with film directly on the surface'],
    ['film au contact', 'film directly on the surface'],
    ['au contact', 'directly on the surface'],
    ['chaleur residuelle', 'residual heat'],
    ['texture finale', 'final texture'],
    ['pate humide', 'wet paste'],
    ['corser les pates', 'make the dough tough'],
    ['ce qu il faut', 'only as much as needed'],
    ["ce qu'il faut", 'only as much as needed'],
    ['plutot que', 'rather than'],
    ['minuteur seul', 'timer alone'],
    ['la sauce attend', 'the sauce has to wait'],
    ['selon sauce', 'depending on the sauce'],
    ['selon la texture', 'depending on the texture'],
    ['selon le fruit', 'depending on the fruit'],
    ['selon les pepins', 'depending on the seeds'],
    ['selon l usage', 'depending on the use'],
    ["selon l'usage", 'depending on the use'],
    ['selon l equilibre voulu', 'depending on the desired balance'],
    ["selon l'equilibre voulu", 'depending on the desired balance'],
    ['selon l equilibre', 'depending on the balance'],
    ['cote chair', 'flesh side'],
    ['face coupee vers le haut', 'cut side up'],
    ['plat de cuisson', 'baking dish'],
    ['pepins de mure', 'blackberry seeds'],
    ['jus de citron', 'lemon juice'],
    ['gouttes de citron', 'drops of lemon'],
    ['pepins', 'seeds'],
    ['passoire', 'strainer'],
    ['sinon', 'otherwise'],
    ['beaucoup', 'a lot'],
    ['toujours', 'always'],
    ['rapidement', 'quickly'],
    ['naturellement', 'naturally'],
    ['soigneusement', 'carefully'],
    ['longtemps', 'too long'],
    ['fibreux', 'fibrous'],
    ['puissant', 'powerful'],
    ['meilleur resultat', 'better result'],
    ['resultat', 'result'],
    ['mixage', 'blending'],
    ['oxydation', 'oxidation'],
    ['ameres', 'bitter'],
    ['amere', 'bitter'],
    ['amer', 'bitter'],
    ['cru', 'raw'],
    ['verte', 'green'],
    ['vert', 'green'],
    ['fluide', 'loose'],
    ['nappante', 'coating'],
    ['brillance', 'shine'],
    ['dominant', 'dominant'],
    ['vive', 'bright'],
    ['fibre', 'fiber'],
    ['fibres', 'fibers'],
    ['peaux', 'skins'],
    ['peau', 'skin'],
    ['mures', 'blackberries'],
    ['mure', 'blackberry'],
    ['mango', 'mango'],
    ['mangue', 'mango'],
    ['myrtille', 'blueberry'],
    ['myrtilles', 'blueberries'],
    ['ananas', 'pineapple'],
    ['kiwi', 'kiwi'],
    ['pomme', 'apple'],
    ['abricot', 'apricot'],
    ['framboise', 'raspberry'],
    ['framboises', 'raspberries'],
    ['cuisson', 'cooking'],
    ['passer au tamis', 'pass through a sieve'],
    ['tamis', 'sieve'],
    ['ajuste', 'adjust'],
    ['ajuster', 'adjust'],
    ['presse', 'press'],
    ['presser', 'press'],
    ['filtre', 'strain'],
    ['filtrer', 'strain'],
    ['reduis', 'reduce'],
    ['reduire', 'reduce'],
    ['detends', 'loosen'],
    ['detendre', 'loosen'],
    ['devient', 'becomes'],
    ['devenir', 'become'],
    ['epaissit', 'thickens'],
    ['epaissir', 'thicken'],
    ['evite', 'avoid'],
    ['eviter', 'avoid'],
    ['perd', 'loses'],
    ['peut', 'can'],
    ['donne', 'gives'],
    ['donner', 'give'],
    ['indique', 'indicated'],
    ['choisi', 'chosen'],
    ['choisie', 'chosen'],
    ['suivre', 'follow'],
    ['corriger', 'adjust'],
    ['corrige', 'adjust'],
    ['finition', 'finish'],
    ['refroidissement', 'cooling'],
    ['conservation', 'storage'],
    ['portion', 'serving'],
    ['petites portions', 'small portions'],
    ['sortir legerement', 'take out slightly'],
    ['sortir', 'take out'],
    ['raffermir', 'firm up'],
    ['trancher', 'slice'],
    ['tartiner', 'spread'],
    ['fondue', 'melted'],
    ['figerait', 'would set'],
    ['perdrait', 'would lose'],
    ['joliment', 'nicely'],
    ['presente', 'present'],
    ['brillante', 'shiny'],
    ['aeree', 'airy'],
    ['aere', 'airy'],
    ['chaleur tournante', 'fan-assisted oven'],
    ['leger fremissement', 'gentle simmer'],
    ['legere fremissement', 'gentle simmer'],
    ['elements chauds separes', 'hot elements separate'],
    ['dressage attend', 'plating has to wait'],
    ['elle rend beaucoup d eau', 'it releases a lot of water'],
    ["elle rend beaucoup d'eau", 'it releases a lot of water'],
    ['la mettre dans un bol froid', 'put it in a cold bowl'],
    ['les poser face coupee vers le haut', 'place them cut side up'],
    ['eau de vegetation s est concentree', 'vegetable moisture has concentrated'],
    ["eau de vegetation s'est concentree", 'vegetable moisture has concentrated'],
    ['face coupee contre la plaque', 'cut side down on the tray'],
    ['pointes grillees', 'toasted tips'],
    ['coeur juste tendre', 'just-tender center'],
    ['brosse le potimarron', 'scrub the pumpkin'],
    ['brosser le potimarron', 'scrub the pumpkin'],
    ['potimarron', 'pumpkin'],
    ['leouvrir', 'open it'],
    ['l ouvrir', 'open it'],
    ["l'ouvrir", 'open it'],
    ['graines et filaments', 'seeds and fibers'],
    ['grosses frites', 'large wedges'],
    ['grosses fries', 'large wedges'],
    ['retourner une fois', 'turn once'],
    ['une fois', 'once'],
    ['a 200c', 'at 200C'],
    ['a 180c', 'at 180C'],
    ['a 170c', 'at 170C'],
    ['a 160c', 'at 160C'],
    ['a 150c', 'at 150C'],
    ['choux de bruxelles', 'Brussels sprouts'],
    ['choux of bruxelles', 'Brussels sprouts'],
    ['sommites', 'florets'],
    ['coupees en deux', 'halved'],
    ['coupes en deux', 'halved'],
    ['coupes in deux', 'halved'],
    ['eau de vegetation', 'vegetable moisture'],
    ['s est concentree', 'has concentrated'],
    ["s'est concentree", 'has concentrated'],
    ['chaleur moderee', 'moderate heat'],
    ['cuisson forte', 'high-heat cooking'],
    ['cuisson longue', 'long baking'],
    ['laquer', 'glaze'],
    ['exces de liquide', 'excess liquid'],
    ['exces of runny', 'excess liquid'],
    ['empeche la coloration', 'prevents browning'],
    ['empeche the browning', 'prevents browning'],
    ['faire bruler', 'burn'],
    ['bruler', 'burn'],
    ['brule', 'burns'],
    ['brulee', 'burned'],
    ['qui a touche le cru', 'that touched raw food'],
    ['a touche le cru', 'touched raw food'],
    ['marinade crue', 'raw marinade'],
    ['porter franchement a ebullition', 'bring to a full boil'],
    ['porter a ebullition', 'bring to a boil'],
    ['doit devenir une sauce', 'must become a sauce'],
    ['doit servir de sauce', 'must be used as a sauce'],
    ['servir de sauce', 'be used as a sauce'],
    ['reutiliser', 'reuse'],
    ['jeter', 'discard'],
    ['franchement', 'fully'],
    ['des de jambon', 'ham cubes'],
    ['jambon', 'ham'],
    ['assez petits', 'small enough'],
    ['se tiennent bien', 'hold together well'],
    ['se tiennent', 'hold together'],
    ['dessus bulle', 'top bubbles'],
    ['fromage se stabilise', 'cheese sets'],
    ['se stabilise', 'sets'],
    ['legere coloration', 'light browning'],
    ['texture attendue', 'expected texture'],
    ['realiser', 'make'],
    ['pocher', 'pipe'],
    ['disque', 'disk'],
    ['longue', 'long'],
    ['bien seches', 'fully dry'],
    ['bien seche', 'fully dry'],
    ['seches et stables', 'dry and stable'],
    ['seches', 'dry'],
    ['exces', 'excess'],
    ['belle coloration', 'nice browning'],
    ['belle', 'nice'],
    ['legere', 'light'],
    ['leger', 'light'],
    ['doux au toucher', 'smooth to the touch'],
    ['four doux', 'low oven'],
    ['rechauffage doux', 'gentle reheating'],
    ['doux', 'gentle'],
    ['douce', 'gentle'],
    ['gros quartiers', 'large pieces'],
    ['gros morceaux', 'large pieces'],
    ['gros oeufs', 'large eggs'],
    ['gros', 'large'],
    ['grosses', 'large'],
    ['grosse', 'large'],
    ['petits', 'small'],
    ['petites', 'small'],
    ['petit', 'small'],
    ['propres', 'clean'],
    ['morceau', 'piece'],
    ['morceaux', 'pieces'],
    ['cuits', 'cooked'],
    ['mi-cuits au chocolat', 'molten chocolate cakes'],
    ['mi-cuits', 'molten cakes'],
    ['coupe en des', 'diced'],
    ['coupe in dice', 'diced'],
    ['des de jambon', 'ham cubes'],
    ['en des', 'diced'],
    ['mousseux', 'foamy'],
    ['blancs mousseux', 'foamy egg whites'],
    ['blancs montes', 'whipped egg whites'],
    ['trous', 'holes'],
    ['levee', 'raised'],
    ['croustillante', 'crisp'],
    ['croustillants', 'crisp'],
    ['moelleuse', 'soft'],
    ['moelleux', 'soft'],
    ['fondante', 'melting'],
    ['fondants', 'tender'],
    ['attendu', 'expected'],
    ['amande', 'almond'],
    ['amandes', 'almonds'],
    ['sirop', 'syrup'],
    ['poudre de piment', 'chili powder'],
    ['flocons de piment', 'chili flakes'],
    ['cinq-epices', 'five-spice'],
    ['graines de sesame', 'sesame seeds'],
    ['resistant a la chaleur', 'heatproof'],
    ['resistant with chaleur', 'heatproof'],
    ['se conserver', 'be stored'],
    ['correctement stockee', 'stored properly'],
    ['elle doit reveiller', 'it should wake up'],
    ['elle doit', 'it should'],
    ['ni faire fumer', 'or smoke'],
    ['ni fumer', 'or smoke'],
    ['precipiter', 'rush'],
    ['ne jamais precipiter', 'never rush'],
    ['jamais', 'never'],
    ['melanges mousseux', 'foamy mixtures'],
    ['sors', 'take out'],
    ['ramollir', 'soften'],
    ['temperature de la piece', 'room temperature'],
    ['piece il doit', 'room; it should'],
    ['il doit', 'it should'],
    ['mais pas', 'but not'],
    ['pommade', 'softened'],
    ['cremeux', 'creamy'],
    ['grossierement', 'coarsely'],
    ['tiedit', 'cools until lukewarm'],
    ['au-dessus', 'above'],
    ['depart a froid', 'cold start'],
    ['depuis le depart a froid', 'from a cold start'],
    ['foncage', 'lining'],
    ['colmate', 'patch'],
    ['meme epaisseur', 'the same thickness'],
    ['se ressoude', 'seals itself'],
    ['casse', 'breaks'],
    ['fondante', 'melting'],
    ['cuisson lente indispensable', 'slow cooking is essential'],
    ['meme fiche', 'same sheet'],
    ['meme temperature', 'same temperature'],
    ['meme quantite', 'same quantity'],
    ['citronne', 'lemony'],
    ['traditionnel', 'traditional'],
    ['epaisseur reguliere', 'even thickness'],
    ['epaisseur', 'thickness'],
    ['entre deux feuilles', 'between two sheets'],
    ['feuilles de papier cuisson', 'sheets of parchment paper'],
    ['sans ajouter de farine', 'without adding flour'],
    ['qu il soit', 'so it is'],
    ["qu'il soit", 'so it is'],
    ['qu elle devienne translucide', 'it turns translucent'],
    ["qu'elle devienne translucide", 'it turns translucent'],
    ['qu elle reste', 'so it stays'],
    ["qu'elle reste", 'so it stays'],
    ['elle peut apporter de l amertume', 'it can bring bitterness'],
    ["elle peut apporter de l'amertume", 'it can bring bitterness'],
    ['amertume', 'bitterness'],
    ['infuse', 'infused'],
    ['plus reguliere', 'more even'],
    ['parfum plus propre', 'cleaner aroma'],
    ['ajoute a sec', 'added dry'],
    ['idealement', 'ideally'],
    ['faciliter', 'help'],
    ['quantite', 'quantity'],
    ['indiquee', 'indicated'],
    ['precision', 'precision'],
    ['aide a obtenir', 'helps produce'],
    ['aide', 'helps'],
    ['mie', 'crumb'],
    ['tranches fines', 'thin slices'],
    ['fines', 'thin'],
    ['afin que la sauce tienne bien', 'so the sauce clings well'],
    ['sauce tienne bien', 'sauce clings well'],
    ['tienne bien', 'holds well'],
    ['plaques de ravioles', 'ravioli sheets'],
    ['une par une', 'one by one'],
    ['ecumoire large', 'large slotted spoon'],
    ['ecumoire', 'slotted spoon'],
    ['beurre clarifie', 'clarified butter'],
    ['clarifie', 'clarified'],
    ['selon besoin', 'as needed'],
    ['besoin', 'need'],
    ['moins il reste d eau', 'the less water remains'],
    ["moins il reste d'eau", 'the less water remains'],
    ['seront croustillantes', 'will be crisp'],
    ['alcool', 'alcohol'],
    ['remplace', 'replace'],
    ['par la meme quantite', 'with the same quantity of'],
    ['eau gazeuse', 'sparkling water'],
    ['blender tourne', 'blender is running'],
    ['sans concombre', 'cucumber-free'],
    ['gaspacho melon sans concombre', 'cucumber-free melon gazpacho'],
    ['papier absorbant', 'paper towels'],
    ['mieux', 'better'],
    ['sur grille', 'on a rack'],
    ['finition plus nette', 'cleaner finish'],
    ['deuxieme bain', 'second fry'],
    ['juste avant le service', 'just before service'],
    ['a part', 'separate'],
    ['jusqu a la fin', 'until the end'],
    ["jusqu'a la fin", 'until the end'],
    ['reste lisible', 'stays distinct'],
    ['ne disparaisse pas', 'does not disappear'],
    ['disparaisse', 'disappear'],
    ['lisible', 'distinct'],
    ['batonnets reguliers', 'even sticks'],
    ['tous les fours', 'all ovens'],
    ['ne colorent pas de la meme facon', 'do not brown the same way'],
    ['meme facon', 'same way'],
    ['sous le gril', 'under the broiler'],
    ['continue a gratiner', 'keeps gratinating'],
    ['jusqu au dernier moment', 'until the last moment'],
    ["jusqu'au dernier moment", 'until the last moment'],
    ['optionnelle', 'optional'],
    ['elle aide surtout', 'it mainly helps'],
    ['friture plus seche', 'drier frying'],
    ['ne surcharge pas', 'do not overload'],
    ['se detendre', 'loosen'],
    ['repartir dans les empreintes', 'divide among the molds'],
    ['remplissant aux trois quarts', 'filling them three-quarters full'],
    ['empreintes', 'molds'],
    ['pommade pour s etaler', 'softened so it spreads'],
    ["pommade pour s'etaler", 'softened so it spreads'],
    ['dechirer le pain', 'tearing the bread'],
    ['surdose pas', 'do not overdo'],
    ['ail cru', 'raw garlic'],
    ['ne jette pas', 'do not discard'],
    ['huile parfumee', 'flavored oil'],
    ['un a un', 'one at a time'],
    ['centre doit etre pris', 'center should be set'],
    ['finit de se stabiliser', 'finishes setting'],
    ['en tiedissant', 'as it cools slightly'],
    ['faire secher des cerises', 'dry cherries'],
    ['temperature douce et longue', 'low, slow heat'],
    ['chaleur forte', 'high heat'],
    ['qui cuit le fruit', 'that cooks the fruit'],
    ['ne remplis pas', 'do not fill'],
    ['jusqu en haut', 'to the top'],
    ["jusqu'en haut", 'to the top'],
    ['marge limite les debordements', 'headspace limits overflow'],
    ['sterilisation', 'sterilization'],
    ['35 a 45min', '35 to 45 min'],
    ['25 a 35min', '25 to 35 min'],
    ['22 a 35min', '22 to 35 min'],
    ['30 a 45min', '30 to 45 min'],
    ['15 a 25min', '15 to 25 min'],
    ['18 a 35min', '18 to 35 min'],
    ['30 a 40min', '30 to 40 min'],
    ['pates et bases patissieres', 'pastry doughs and bases'],
    ['toppings et garnitures', 'toppings and fillings'],
    ['sauces, pestos et assaisonnements', 'sauces, pestos and seasonings'],
    ['tomates preparees', 'prepared tomatoes'],
    ['biscuits, cookies et meringues', 'biscuits, cookies and meringues'],
    ['bases salees', 'savory bases'],
    ['cookies sales', 'savory cookies'],
    ['cookies sucres', 'sweet cookies'],
    ['petites preparations sucrees ou salees', 'small sweet or savory preparations'],
    ['bases salees utiles', 'useful savory bases'],
    ['preparations salees', 'savory preparations'],
    ['preparations sucrees', 'sweet preparations'],
    ['preparations', 'preparations'],
    ['patissieres', 'pastry'],
    ['patissiere', 'pastry cream'],
    ['patisserie', 'pastry'],
    ['cremes a garnir', 'filling creams'],
    ['creme a garnir', 'filling cream'],
    ['chantilly stabilisee', 'stabilized Chantilly cream'],
    ['chantilly', 'Chantilly cream'],
    ['diplomate', 'diplomat cream'],
    ['version allegee', 'lighter version'],
    ['version traditionnelle', 'traditional version'],
    ['traditionnelle', 'traditional'],
    ['mediterraneenne', 'Mediterranean'],
    ['mexicaine', 'Mexican'],
    ['thai citronnelle', 'Thai lemongrass'],
    ['citronnelle', 'lemongrass'],
    ['teriyaki rapide', 'quick teriyaki'],
    ['bbq fume', 'smoky BBQ'],
    ['legumes balsamique', 'balsamic vegetables'],
    ['harissa rouge', 'red harissa'],
    ['sauce aigre-douce vietnamienne', 'Vietnamese sweet-and-sour sauce'],
    ['sauce nem', 'Vietnamese dipping sauce'],
    ['sauce caramel', 'caramel sauce'],
    ['rouille', 'rouille sauce'],
    ['marinades', 'marinades'],
    ['mayonnaise', 'mayonnaise'],
    ['pestos', 'pestos'],
    ['vinaigrette', 'vinaigrette'],
    ['coulis', 'fruit coulis'],
    ['churros', 'churros'],
    ['meringues', 'meringues'],
    ['tortillas', 'tortillas'],
    ['southern biscuits', 'Southern biscuits'],
    ['macaron ourea', 'Ourea macaron'],
    ['fin de preparation', 'end of preparation'],
    ['surtout apres', 'especially after'],
    ['surtout', 'especially'],
    ['reduction', 'reduction'],
    ['rotissage', 'roasting'],
    ['en fin', 'at the end'],
    ['frais ou en congelation', 'in the fridge or frozen'],
    ['congelation possible', 'can be frozen'],
    ['congelation', 'freezing'],
    ['decongelation', 'thawing'],
    ['refrigerateur', 'refrigerator'],
    ['boite hermetique', 'airtight container'],
    ['hermetique', 'airtight'],
    ['mois', 'months'],
    ['semaines', 'weeks'],
    ['semaine', 'week'],
    ['jours', 'days'],
    ['jour', 'day'],
    ['3 j', '3 days'],
    ['par petites portions', 'in small portions'],
    ['petites portions', 'small portions'],
    ['portions', 'servings'],
    ['pieces', 'pieces'],
    ['individuels', 'individual'],
    ['commune', 'common'],
    ['base commune', 'common base'],
    ['seche', 'dry'],
    ['seches', 'dry'],
    ['secs', 'dry'],
    ['sablee', 'shortcrust'],
    ['sucree', 'sweet'],
    ['sucrees', 'sweet'],
    ['sales', 'savory'],
    ['salees', 'savory'],
    ['sale', 'savory'],
    ['parfume', 'flavored'],
    ['parfumee', 'flavored'],
    ['tartinable', 'spreadable'],
    ['bien aile', 'garlicky'],
    ['aile', 'garlicky'],
    ['grace a', 'thanks to'],
    ['parfait sur', 'perfect on'],
    ['pain grille', 'toasted bread'],
    ['legumes rotis', 'roasted vegetables'],
    ['legumes', 'vegetables'],
    ['legume', 'vegetable'],
    ['rotis', 'roasted'],
    ['roties', 'roasted'],
    ['roti', 'roasted'],
    ['grillee', 'grilled'],
    ['grille', 'grilled'],
    ['fraiches', 'fresh'],
    ['fraiche', 'fresh'],
    ['frais', 'fresh'],
    ['mure', 'ripe'],
    ['mures', 'ripe'],
    ['zeste de', 'zest of'],
    ['zeste', 'zest'],
    ['piments', 'chilies'],
    ['pimentes', 'spicy'],
    ['choix', 'choice'],
    ['au choix', 'of your choice'],
    ['un seul bloc', 'one single block'],
    ['seul bloc', 'single block'],
    ['ci-dessous', 'below'],
    ['repere de taille', 'size guide'],
    ['repere', 'guide'],
    ['taille', 'size'],
    ['aromates', 'aromatics'],
    ['ecraser', 'crush'],
    ['sans ecraser', 'without crushing'],
    ['sont dorees', 'are golden'],
    ['aretes sont dorees', 'edges are golden'],
    ['aretes dorees', 'golden edges'],
    ['chair fondante', 'melting flesh'],
    ['chair tendre', 'tender flesh'],
    ['chair', 'flesh'],
    ['couche fine', 'thin layer'],
    ['couche', 'layer'],
    ['fine', 'thin'],
    ['produit', 'product'],
    ['aliment', 'food'],
    ['tous les ingredients', 'all the ingredients'],
    ['tous', 'all'],
    ['propre', 'clean'],
    ['nappante', 'coating'],
    ['nappant', 'coating'],
    ['nappe la cuillere', 'coats the spoon'],
    ['nappe', 'coats'],
    ['cuillere', 'spoon'],
    ['epaississement', 'thickening'],
    ['epaissir', 'thicken'],
    ['epaissit', 'thickens'],
    ['pectine', 'pectin'],
    ['present mais pas dominant', 'present but not dominant'],
    ['present', 'present'],
    ['dominant', 'dominant'],
    ['vive', 'bright'],
    ['brillance', 'shine'],
    ['texture nappante', 'coating texture'],
    ['verifie', 'check'],
    ['possible', 'possible'],
    ['avant service', 'before serving'],
    ['service', 'serving'],
    ['secouer avant service', 'shake before serving'],
    ['secouer', 'shake'],
    ['ajuster', 'adjust'],
    ['utiliser rapidement', 'use quickly'],
    ['couvrir d huile', 'cover with oil'],
    ['couvrir dhuile', 'cover with oil'],
    ['au frais', 'in the refrigerator'],
    ['avant cuisson', 'before cooking'],
    ['avant', 'before'],
    ['fondre', 'melt'],
    ['hydrater', 'bloom'],
    ['reste froid', 'cold remaining cream'],
    ['reste', 'remaining'],
    ['huiles', 'oils'],
    ['huile', 'oil'],
    ['huilee', 'oiled'],
    ['huile', 'oil'],
    ['lisser', 'smooth'],
    ['detendre', 'loosen'],
    ['la detendre', 'loosen it'],
    ['bulles d air', 'air bubbles'],
    ['bulles', 'bubbles'],
    ['fois', 'times'],
    ['seule', 'alone'],
    ['assemblee', 'assembled'],
    ['incorporation', 'folding in'],
    ['a nouveau', 'again'],
    ['apres decongelation', 'after thawing'],
    ['apres cuisson', 'after cooking'],
    ['apres preparation', 'after preparation'],
    ['sur-appret', 'overproofing'],
    ['appret insuffisant', 'underproofing'],
    ['appret', 'proofing'],
    ['retombent', 'collapse'],
    ['qui', 'that'],
    ['mie dense', 'dense crumb'],
    ['longue', 'long'],
    ['stables', 'stable'],
    ['perte de texture', 'loss of texture'],
    ['pour pocher', 'for poaching'],
    ['pocher poissons', 'poach fish'],
    ['pocher poisson', 'poach fish'],
    ['base aromatique', 'aromatic base'],
    ['ideal', 'ideal'],
    ['poissons', 'fish'],
    ['crustaces', 'shellfish'],
    ['volailles', 'poultry'],
    ['composant pour', 'component for'],
    ['decor pour', 'decoration for'],
    ['decor', 'decoration'],
    ['petites meringues', 'small meringues'],
    ['petites', 'small'],
    ['petits', 'small'],
    ['allongee', 'loosened'],
    ['moelleux', 'soft texture'],
    ['fondante', 'melting'],
    ['tendre', 'tender'],
    ['tendres', 'tender'],
    ['dorees', 'golden'],
    ['doree', 'golden'],
    ['dores', 'golden'],
    ['dore', 'golden'],
    ['legerement', 'slightly'],
    ['tres', 'very'],
    ['bien', 'well'],
    ['jusqu a', 'until'],
    ["jusqu'a", 'until'],
    ['jusqu au', 'until the'],
    ["jusqu'au", 'until the'],
    ['jusqu aux', 'until the'],
    ["jusqu'aux", 'until the'],
    ['a feu doux', 'over low heat'],
    ['a feu moyen', 'over medium heat'],
    ['a feu vif', 'over high heat'],
    ['feu doux', 'low heat'],
    ['feu moyen', 'medium heat'],
    ['feu vif', 'high heat'],
    ['couper le feu', 'turn off the heat'],
    ['le feu', 'the heat'],
    ['elle continuera', 'it will continue'],
    ['continuera', 'will continue'],
    ['en refroidissant', 'as it cools'],
    ['refroidissant', 'cooling'],
    ['filtrer', 'strain'],
    ['figue', 'fig'],
    ['espresso', 'espresso'],
    ['cacao', 'cocoa'],
    ['orange', 'orange'],
    ['rechauffer quelques minutes au four doux', 'reheat for a few minutes in a low oven'],
    ['rechauffer quelques secondes', 'reheat for a few seconds'],
    ['rechauffer', 'reheat'],
    ['quelques minutes', 'a few minutes'],
    ['quelques secondes', 'a few seconds'],
    ['four doux', 'low oven'],
    ['vapeur', 'steam'],
    ['humidite', 'moisture'],
    ['retrouver', 'restore'],
    ['decoupe', 'cutting'],
    ['apres decoupe', 'after cutting'],
    ['degustation', 'serving'],
    ['avant degustation', 'before serving'],
    ['plusieurs recettes', 'several recipes'],
    ['plusieurs portions', 'several servings'],
    ['plusieurs jours', 'several days'],
    ['plusieurs', 'several'],
    ['utiles', 'useful'],
    ['utile', 'useful'],
    ['voulue', 'chosen'],
    ['voulu', 'chosen'],
    ['confites', 'confit'],
    ['confite', 'confit'],
    ['sechees', 'dried'],
    ['sechee', 'dried'],
    ['saler progressivement', 'salt gradually'],
    ['gras', 'fat'],
    ['en fin de preparation', 'at the end of preparation'],
    ['in end of preparation', 'at the end of preparation'],
    ['morceaux crus agressifs', 'harsh raw pieces'],
    ['crus agressifs', 'harsh raw'],
    ['crus', 'raw'],
    ['agressifs', 'harsh'],
    ['piler', 'pound'],
    ['pilier', 'pound'],
    ['marquer', 'sear'],
    ['sont epais', 'are thick'],
    ['sont', 'are'],
    ['epaisse', 'thick'],
    ['epais', 'thick'],
    ['entiere', 'whole'],
    ['entier', 'whole'],
    ['battu', 'beaten'],
    ['battre', 'beat'],
    ['gratter la gousse', 'scrape the pod'],
    ['gratter', 'scrape'],
    ['gousse si entiere', 'pod if whole'],
    ['base technique', 'technical base'],
    ['entremets', 'entremets'],
    ['patisseries classiques', 'classic pastries'],
    ['classiques', 'classic'],
    ['utilise par exemple dans', 'used for example in'],
    ['utilise', 'used'],
    ['par exemple', 'for example'],
    ['pancakes fluffy', 'fluffy pancakes'],
    ['asperges mimosa', 'mimosa asparagus'],
    ['asperges', 'asparagus'],
    ['carpaccio betterave mozzarella yuzu', 'beetroot, mozzarella and yuzu carpaccio'],
    ['betterave', 'beetroot'],
    ['nems vietnamiens', 'Vietnamese spring rolls'],
    ['potee au chou', 'cabbage stew'],
    ['chou vert en sauce tomate', 'green cabbage in tomato sauce'],
    ['chou vert', 'green cabbage'],
    ['chou pointu', 'pointed cabbage'],
    ['chou fleur', 'cauliflower'],
    ['chou-fleur', 'cauliflower'],
    ['chou', 'cabbage'],
    ['toppings frites', 'fries toppings'],
    ['tartes', 'tarts'],
    ['frites chaudes', 'hot fries'],
    ['frites', 'fries'],
    ['ile flottante', 'floating island dessert'],
    ['speculoos', 'speculoos'],
    ['tiramisu speculoos', 'speculoos tiramisu'],
    ['terrine de campagne', 'country terrine'],
    ['appareil a cake', 'cake batter'],
    ['preparation du moule', 'pan preparation'],
    ['demouler', 'unmold'],
    ['proprement', 'cleanly'],
    ['cuisson lente indispensable', 'slow cooking is essential'],
    ['lente', 'slow'],
    ['indispensable', 'essential'],
    ['servir rapidement', 'serve quickly'],
    ['avocat', 'avocado'],
    ['bicarbonate', 'baking soda'],
    ['coques', 'shells'],
    ['glacage', 'glaze'],
    ['texture cible', 'target texture'],
    ['stockage optimal', 'optimal storage'],
    ['endroit frais et sec', 'cool dry place'],
    ['endroit', 'place'],
    ['sec', 'dry'],
    ['tranches', 'slices'],
    ['plutot', 'preferably'],
    ['qu en', 'than in'],
    ["qu'en", 'than in'],
    ['aromes', 'aromas'],
    ['le lendemain', 'the next day'],
    ['souvent meilleur', 'often better'],
    ['se stabilisent', 'stabilize'],
    ['se tient', 'holds'],
    ['doit etre', 'should be'],
    ['etre pochee', 'be piped'],
    ['pochee', 'piped'],
    ['stries', 'ridges'],
    ['douille', 'piping tip'],
    ['friture et finition', 'frying and finishing'],
    ['sauce mornay', 'Mornay sauce'],
    ['sauces burger', 'burger sauces'],
    ['bases', 'bases'],
    ['gros cookies', 'large cookies'],
    ['beurres', 'butters'],
    ['passage au congelateur', 'time in the freezer'],
    ['aident', 'help'],
    ['boudins', 'logs'],
    ['film alimentaire', 'plastic wrap'],
    ['au moins', 'at least'],
    ['se conservent', 'keep'],
    ['boules', 'balls'],
    ['donnent', 'make'],
    ['environ', 'about'],
    ['boite fermee', 'closed container'],
    ['fermee', 'closed'],
    ['fourrage cheesecake', 'cheesecake filling'],
    ['fourrage', 'filling'],
    ['torréfier les poivres', 'toast the peppercorns'],
    ['torrefier les poivres', 'toast the peppercorns'],
    ['chauffer doucement et laisser reduire', 'heat gently and reduce'],
    ['garnitures adaptees', 'matching sides'],
    ['adaptees', 'suitable'],
    ['celeri-rave', 'celeriac'],
    ['carottes glacees', 'glazed carrots'],
    ['ecrase de pommes de terre', 'mashed potatoes'],
    ['option gastronomique', 'gourmet option'],
    ['emulsion', 'emulsion'],
    ['relief', 'depth'],
    ['safran', 'saffron'],
    ['daurades royales', 'gilthead sea bream'],
    ['rougets barbets', 'red mullets'],
    ['rascasses de ligne', 'line-caught scorpionfish'],
    ['etoiles de badiane', 'star anise'],
    ['graines de cardamome', 'cardamom pods'],
    ['fenouils', 'fennel bulbs'],
    ['pocher quelques minutes', 'poach for a few minutes'],
    ['estragon', 'tarragon'],
    ['poivron rouge roti mixe', 'blended roasted red pepper'],
    ['poivron rouge', 'red bell pepper'],
    ['rouge', 'red'],
    ['deja montee', 'already emulsified'],
    ['ancienne preparation', 'previous mixture'],
    ['petit a petit', 'little by little'],
    ['tranche', 'splits'],
    ['acidite', 'acidity'],
    ['bisque', 'bisque'],
    ['ravioles', 'ravioli'],
    ['gril', 'broiler'],
    ['option haut de gamme', 'premium option'],
    ['bain ne doit pas etre trop charge', 'the oil bath must not be overloaded'],
    ['chute de temperature', 'temperature drop'],
    ['rend les frites grasses', 'makes the fries greasy'],
    ['pains', 'buns'],
    ['oeuf entier battu', 'whole beaten egg'],
    ['oeuf entier', 'whole egg'],
    ['faconnage', 'shaping'],
    ['farce betterave', 'beetroot filling'],
    ['farce', 'filling'],
    ['graines de sesame noir', 'black sesame seeds'],
    ['graines de sesame torrefiees', 'toasted sesame seeds'],
    ['graines de pavot', 'poppy seeds'],
    ['graines de tournesol', 'sunflower seeds'],
    ['graines', 'seeds'],
    ['pavot', 'poppy'],
    ['dorure', 'egg wash'],
    ['pousse', 'proofing'],
    ['gout', 'taste'],
    ['option luxe', 'luxury option'],
    ['mojito classique', 'classic mojito'],
    ['mojito concombre', 'cucumber mojito'],
    ['mojito fruit de la passion', 'passion fruit mojito'],
    ['glacons', 'ice cubes'],
    ['mini-billes de melon', 'mini melon balls'],
    ['roquette', 'arugula'],
    ['oignon rouge', 'red onion'],
    ['mozzarella marinee', 'marinated mozzarella'],
    ['marinee', 'marinated'],
    ['chiffonnade', 'thin ribbons'],
    ['anti-gaspillage', 'anti-waste'],
    ['premier bain', 'first fry'],
    ['second bain', 'second fry'],
    ['cible', 'target'],
    ['liens utiles', 'useful links'],
    ['lait de coco entier', 'full-fat coconut milk'],
    ['epices', 'spices'],
    ['sentir bon', 'smell fragrant'],
    ['bruler', 'burn'],
    ['roux', 'roux'],
    ['montage', 'assembly'],
    ['meringue italienne', 'Italian meringue'],
    ['brulee', 'torched'],
    ['chalumeau', 'kitchen torch'],
    ['colorer', 'brown'],
    ['tout le tiramisu', 'the whole tiramisu'],
    ['trempage', 'soaking'],
    ['saladiers', 'mixing bowls'],
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
    ['casserole à fond épais', 'heavy-bottomed saucepan'],
    ['fond épais', 'heavy bottom'],
    ['petite casserole', 'small saucepan'],
    ['petit plat à gratin', 'small baking dish'],
    ['plat à gratin', 'baking dish'],
    ['plaque préchauffée', 'preheated tray'],
    ['plaque de cuisson', 'baking sheet'],
    ['branches de céleri', 'celery stalks'],
    ['branches de celeri', 'celery stalks'],
    ['branche de céleri', 'celery stalk'],
    ['branche de celeri', 'celery stalk'],
    ['clous de girofle', 'cloves'],
    ['clou de girofle', 'clove'],
    ['babeurre', 'buttermilk'],
    ['piments secs', 'dried chilies'],
    ['piment sec', 'dried chili'],
    ['balsamique', 'balsamic'],
    ['plaque', 'tray'],
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
    ['par beignet', 'per beignet'],
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
    ['pâte à crumble', 'crumble topping'],
    ['pate a crumble', 'crumble topping'],
    ['pâte à frire', 'frying batter'],
    ['pate a frire', 'frying batter'],
    ['pâte tandoori', 'tandoori paste'],
    ['pate tandoori', 'tandoori paste'],
    ['pâte', 'dough'],
    ['pate', 'dough'],
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
    ['levure fraîche', 'fresh yeast'],
    ['levure fraiche', 'fresh yeast'],
    ['levure', 'yeast'],
    ['gélatine', 'gelatin'],
    ['gelatine', 'gelatin'],
    ['levure boulangère', 'baker’s yeast'],
    ['poudre d’amandes', 'almond flour'],
    ["poudre d'amandes", 'almond flour'],
    ['amandes effilées', 'sliced almonds'],
    ['amandes', 'almonds'],
    ['noisettes torréfiées', 'toasted hazelnuts'],
    ['noisettes', 'hazelnuts'],
    ['noisette', 'hazelnut'],
    ['pâte de noisette', 'hazelnut paste'],
    ['pate de noisette', 'hazelnut paste'],
    ['praliné noisette', 'hazelnut praline'],
    ['praline noisette', 'hazelnut praline'],
    ['cacao non sucré', 'unsweetened cocoa'],
    ['cacao non sucre', 'unsweetened cocoa'],
    ['cacao', 'cocoa'],
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
    ['mangue mûre', 'ripe mango'],
    ['mangues mûres', 'ripe mangoes'],
    ['mangue', 'mango'],
    ['pêches mûres', 'ripe peaches'],
    ['pêche mûre', 'ripe peach'],
    ['pêches', 'peaches'],
    ['pêche', 'peach'],
    ['abricots mûrs', 'ripe apricots'],
    ['abricot mûr', 'ripe apricot'],
    ['abricots', 'apricots'],
    ['abricot', 'apricot'],
    ['myrtilles', 'blueberries'],
    ['myrtille', 'blueberry'],
    ['mûres', 'blackberries'],
    ['mûre', 'blackberry'],
    ['ananas frais', 'fresh pineapple'],
    ['ananas', 'pineapple'],
    ['kiwis mûrs', 'ripe kiwis'],
    ['kiwi mûr', 'ripe kiwi'],
    ['kiwis', 'kiwis'],
    ['pommes', 'apples'],
    ['pomme', 'apple'],
    ['poires', 'pears'],
    ['poire', 'pear'],
    ['pépins', 'seeds'],
    ['peau', 'skin'],
    ['peaux', 'skins'],
    ['personnes', 'people'],
    ['portions', 'servings'],
    ['parts', 'slices']
  ];

  const recipeGrammarReplacementsEn = [
    ["d'huile d'olive", 'olive oil'],
    ["l'huile d'olive", 'olive oil'],
    ["a l'huile d'olive", 'with olive oil'],
    ["a l'huile", 'with oil'],
    ["d'huile", 'oil'],
    ["l'huile", 'oil'],
    ["l'ail", 'garlic'],
    ["d'ail", 'garlic'],
    ["a l'ail", 'with garlic'],
    ["l'oeuf", 'egg'],
    ["d'oeuf", 'egg'],
    ["a l'oeuf", 'with egg'],
    ["l'oeufs", 'eggs'],
    ["d'oeufs", 'eggs'],
    ["l'eau", 'water'],
    ["d'eau", 'water'],
    ["l'echalote", 'shallot'],
    ["d'echalote", 'shallot'],
    ["l'oignon", 'onion'],
    ["d'oignon", 'onion'],
    ["l'appareil", 'the mixture'],
    ["d'appareil", 'mixture'],
    ["l'emulsion", 'the emulsion'],
    ["d'emulsion", 'emulsion'],
    ["l'assaisonnement", 'the seasoning'],
    ["d'assaisonnement", 'seasoning'],
    ['astuce cuisson', 'cooking tip:'],
    ['en fin de cuisson', 'at the end of cooking'],
    ['fin de cuisson', 'end of cooking'],
    ['le temps indiqué', 'the indicated time'],
    ['temps indiqué', 'indicated time'],
    ['fruit choisi', 'chosen fruit'],
    ['pâte choisie', 'chosen batter'],
    ['goût frais', 'fresh taste'],
    ['goût', 'taste'],
    ['acidité', 'acidity'],
    ['couleur bien rouge', 'bright red color'],
    ['bien rouge', 'bright red'],
    ['couleur', 'color'],
    ['quelques gouttes', 'a few drops'],
    ['dès que', 'as soon as'],
    ['dès qu’il', 'as soon as it'],
    ["dès qu'il", 'as soon as it'],
    ['au contact', 'directly on the surface'],
    ['forme un bec souple à ferme', 'forms soft to firm peaks'],
    ['souple à ferme', 'soft to firm'],
    ['bec souple', 'soft peak'],
    ['texture pommade', 'soft, spreadable texture'],
    ['bouche légère', 'light mouthfeel'],
    ['plus douce', 'milder'],
    ['petit pot', 'small container'],
    ['papier cuisson', 'parchment paper'],
    ['une seule couche', 'a single layer'],
    ['face coupée contre la plaque', 'cut side down on the tray'],
    ['face coupee contre la plaque', 'cut side down on the tray'],
    ['face coupée vers le haut', 'cut side up'],
    ['face coupee vers le haut', 'cut side up'],
    ['cœur juste tendre', 'just-tender center'],
    ['coeur juste tendre', 'just-tender center'],
    ['cœur tendre', 'tender center'],
    ['coeur tendre', 'tender center'],
    ['bords dorés', 'golden edges'],
    ['bords dores', 'golden edges'],
    ['pointes grillées', 'toasted tips'],
    ['pointes grillees', 'toasted tips'],
    ['jus concentré', 'concentrated juices'],
    ['jus concentre', 'concentrated juices'],
    ['légèrement fripés', 'lightly wrinkled'],
    ['legerement fripes', 'lightly wrinkled'],
    ['croûte plus nette', 'cleaner crust'],
    ['croute plus nette', 'cleaner crust'],
    ['centre encore tendre', 'center still soft'],
    ['pâte lisse', 'smooth dough'],
    ['pate lisse', 'smooth dough'],
    ['légèrement collante', 'slightly sticky'],
    ['legerement collante', 'slightly sticky'],
    ['mie dense', 'dense crumb'],
    ['apprêt insuffisant', 'underproofing'],
    ['appret insuffisant', 'underproofing'],
    ['le lendemain', 'the next day'],
    ['jusqu’au dressage', 'until plating'],
    ["jusqu'au dressage", 'until plating'],
    ['dressage', 'plating'],
    ['garnitures', 'toppings'],
    ['garniture', 'topping'],
    ['ingrédients secs', 'dry ingredients'],
    ['ingredients secs', 'dry ingredients'],
    ['juste assez', 'just enough'],
    ['pancakes cuits', 'cooked pancakes'],
    ['cuits', 'cooked'],
    ['cuites', 'cooked'],
    ['filmés', 'wrapped'],
    ['filmes', 'wrapped'],
    ['boîte hermétique', 'airtight container'],
    ['boite hermetique', 'airtight container'],
    ['perte de texture', 'loss of texture'],
    ['semaines', 'weeks'],
    ['semaine', 'week'],
    ['jours', 'days'],
    ['jour', 'day'],
    ['pièces', 'pieces'],
    ['pieces', 'pieces'],
    ['individuels', 'individual'],
    ['décor', 'decoration'],
    ['decor', 'decoration'],
    ['composant pour', 'component for'],
    ['composants liés', 'linked components'],
    ['composants lies', 'linked components'],
    ['voir', 'see'],
    ['récipient', 'container'],
    ['contenant propre', 'clean container'],
    ['boîte hermétique', 'airtight container'],
    ['refroidissement', 'cooling'],
    ['utilisation', 'use'],
    ['température', 'temperature'],
    ['maturité', 'ripeness'],
    ['équilibre', 'balance'],
    ['assaisonnement', 'seasoning'],
    ['très finement', 'very finely'],
    ['progressivement', 'gradually'],
    ['rapidement', 'quickly'],
    ['soigneusement', 'carefully'],
    ['constamment', 'constantly'],
    ['franchement', 'clearly'],
    ['naturellement', 'naturally'],
    ['toujours', 'always'],
    ['plutôt', 'preferably'],
    ['peu', 'briefly'],
    ['vite', 'quickly'],
    ['assez', 'enough'],
    ['vrai', 'proper'],
    ['bonne', 'good'],
    ['mais non', 'but not'],
    ['souple', 'soft'],
    ['ferme', 'firm'],
    ['fondu', 'melted'],
    ['fondue', 'melted'],
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
    ['suivre', 'follow'],
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
    ['utilisé', 'used'],
    ['utilisee', 'used'],
    ['utilisée', 'used'],
    ['recouvrir', 'cover'],
    ['pétrir', 'knead'],
    ['petrir', 'knead'],
    ['bouler', 'shape into a ball'],
    ['tiédir', 'cool until warm'],
    ['tiedir', 'cool until warm'],
    ['déplacer', 'move'],
    ['deplacer', 'move'],
    ['surveiller', 'watch'],
    ['retournant', 'turning'],
    ['dessèchement', 'drying out'],
    ['dessechement', 'drying out'],
    ['répartition régulière', 'even distribution'],
    ['repartition reguliere', 'even distribution'],
    ['intensité souhaitée', 'desired intensity'],
    ['intensite souhaitee', 'desired intensity'],
    ['rouler en boudin', 'roll into a log'],
    ['en boudin', 'into a log'],
    ['boudin', 'log'],
    ['former', 'form'],
    ['forme', 'forms'],
    ['indiqué', 'indicated'],
    ['indique', 'indicated'],
    ['choisi', 'chosen'],
    ['choisie', 'chosen'],
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
    [/^(\d+)\/(\d+) caract\u00e8res$/, match => `${match[1]}/${match[2]} characters`],
    [/^(\d+)% pr\u00eat$/, match => `${match[1]}% ready`],
    [/^Actif (.+)$/, match => `Active ${match[1]}`],
    [/^Cuisson (.+)$/, match => `Cooking ${match[1]}`],
    [/^Repos (.+)$/, match => `Rest ${match[1]}`],
    [/^Difficult\u00e9 (.+)$/, match => `Difficulty ${text(match[1])}`],
    [/^Ouvrir la cat\u00e9gorie (.+)$/, match => `Open category ${text(match[1])}`],
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
      .replace(/\u00b0/g, '')
      .replace(/[’‘]/g, "'")
      .replace(/[œŒ]/g, 'oe')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function normalizeRecipeReplacementText(value) {
    return repairI18nMojibake(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u0152\u0153]/g, 'oe')
      .replace(/[\u00c6\u00e6]/g, 'ae')
      .replace(/\u00b0/g, '')
      .replace(/[\u2018\u2019\u201a\u201b\u2032]/g, "'")
      .replace(/[\u2013\u2014]/g, '-');
  }

  function escapeRecipeReplacementSource(value) {
    return normalizeRecipeReplacementText(value)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/'/g, "['\\u2019]");
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
      .replace(/(\d+)\s*(?:\u00e0|a)\s*(\d+)/gi, '$1 to $2')
      .replace(/\bgrace a\b/gi, 'thanks to')
      .replace(/\bjusqu['\u2019]?a\s+/gi, 'until ')
      .replace(/\bjusqu\s+a\s+/gi, 'until ')
      .replace(/\ba feu doux\b/gi, 'over low heat')
      .replace(/\ba feu moyen\b/gi, 'over medium heat')
      .replace(/\ba feu vif\b/gi, 'over high heat')
      .replace(/\ba temperature ambiante\b/gi, 'at room temperature')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s+([,.;:])/g, '$1')
      .replace(/\bafin de\s+/gi, 'to ')
      .replace(/\bpour\s+(?:garder|obtenir|afficher|éviter|eviter|émulsionner|emulsionner|émulsifier|emulsifier)\b/gi, match => {
        const verb = match.replace(/^pour\s+/i, '').toLowerCase();
        return {
          garder: 'to keep',
          obtenir: 'to get',
          afficher: 'to show',
          'éviter': 'to avoid',
          eviter: 'to avoid',
          'émulsionner': 'to emulsify',
          emulsionner: 'to emulsify',
          'émulsifier': 'to emulsify',
          emulsifier: 'to emulsify'
        }[verb] || 'to ';
      })
      .replace(/\b(?:pour|for)\s+show\b/gi, 'to show')
      .replace(/\b(?:pour|for)\s+keep\b/gi, 'to keep')
      .replace(/\b(?:pour|for)\s+get\b/gi, 'to get')
      .replace(/\b(?:pour|for)\s+avoid\b/gi, 'to avoid')
      .replace(/\bd['’](?=\p{L})/giu, 'of ')
      .replace(/\bl['’](?=\p{L})/giu, '')
      .replace(/\bof with\b/gi, 'with')
      .replace(/\bwith with\b/gi, 'with')
      .replace(/\bloe(?=[a-z])/gi, '')
      .replace(/\bdoeenviron\b/gi, 'about')
      .replace(/\bdoe(?=[a-z])/gi, 'of ')
      .replace(/\bjusquoea\b/gi, 'until')
      .replace(/\bjusquoeau\b/gi, 'until the')
      .replace(/\bjusquoeaux\b/gi, 'until the')
      .replace(/\bquoeun\b/gi, 'than a')
      .replace(/\bquoeune\b/gi, 'than a')
      .replace(/\bquoeil\b/gi, 'so it')
      .replace(/\bquoeelle\b/gi, 'so it')
      .replace(/\bquoeelles\b/gi, 'so they')
      .replace(/\bquoeen\b/gi, 'than in')
      .replace(/\bin of\b/gi, 'in')
      .replace(/\btransfer in\b/gi, 'transfer to')
      .replace(/\btransfer to of\b/gi, 'transfer to')
      .replace(/\bfor with\b/gi, 'for')
      .replace(/\bto with\b/gi, 'with')
      .replace(/\ba (low|medium|high) heat\b/gi, 'over $1 heat')
      .replace(/\bin end of preparation\b/gi, 'at the end of preparation')
      .replace(/\bcover of\b/gi, 'cover with')
      .replace(/\bjar clean\b/gi, 'clean jar')
      .replace(/\bthe conservation\b/gi, 'storage')
      .replace(/\bversion milder\b/gi, 'milder version')
      .replace(/\bwater simmering\b/gi, 'simmering water')
      .replace(/\bwell drain\b/gi, 'drain well')
      .replace(/\bavoid of cook\b/gi, 'avoid cooking')
      .replace(/\bil loses\b/gi, 'it loses')
      .replace(/\bil would lose\b/gi, 'it would lose')
      .replace(/\belle rend\b/gi, 'it releases')
      .replace(/\ba lot water\b/gi, 'a lot of water')
      .replace(/\bthen the put\b/gi, 'then put it')
      .replace(/\bthe put\b/gi, 'put it')
      .replace(/\bin a bowl cold\b/gi, 'in a cold bowl')
      .replace(/\btexture smooth\b/gi, 'smooth texture')
      .replace(/\btexture soft\b/gi, 'soft texture')
      .replace(/\bkeep a texture smooth\b/gi, 'keep a smooth texture')
      .replace(/\bpreferably que\b/gi, 'rather than')
      .replace(/\bque the\b/gi, 'than the')
      .replace(/\bthe timer alone\b/gi, 'the timer alone')
      .replace(/\bhot elements separate\b/gi, 'hot elements separate')
      .replace(/\bthe plating attend\b/gi, 'the plating has to wait')
      .replace(/\bplating attend\b/gi, 'plating has to wait')
      .replace(/\bNot melt\b/g, 'Do not melt')
      .replace(/\bbutter il\b/gi, 'butter; it')
      .replace(/\bmoins nicely\b/gi, 'less neatly')
      .replace(/\bmeat grilled\b/gi, 'grilled meat')
      .replace(/\bthin layer oil\b/gi, 'thin layer of oil')
      .replace(/\bbring a leger gentle simmer\b/gi, 'bring to a gentle simmer')
      .replace(/\bleger gentle simmer\b/gi, 'gentle simmer')
      .replace(/\bsalt slightly flesh side\b/gi, 'salt the flesh side lightly')
      .replace(/\bthen the set cut side up\b/gi, 'then place them cut side up')
      .replace(/\bthe set cut side up\b/gi, 'place them cut side up')
      .replace(/\bdepending on balance chosen\b/gi, 'depending on the desired balance')
      .replace(/\bdepending on sauce\b/gi, 'depending on the sauce')
      .replace(/\bCut the tomatoes Roma\b/gi, 'Cut the Roma tomatoes')
      .replace(/\bturn over a times\b/gi, 'turn once')
      .replace(/\bwater of vegetation s est concentree\b/gi, 'vegetable moisture has concentrated')
      .replace(/\buntil the toasted tips and with just-tender center\b/gi, 'until the tips are toasted and the center is just tender')
      .replace(/\bfor the choux\b/gi, 'for the cabbages')
      .replace(/\bBrosser the\b/g, 'Scrub the')
      .replace(/\bleouvrir\b/gi, 'open it')
      .replace(/\bgrosses fries\b/gi, 'large wedges')
      .replace(/\bgrosses frites\b/gi, 'large wedges')
      .replace(/\bchaleur tournante\b/gi, 'fan-assisted oven')
      .replace(/\bfan oven\b/gi, 'fan oven')
      .replace(/(\d+)\s*(?:\u00e0|a)\s*(\d+)\s*min/gi, '$1 to $2 min')
      .replace(/\s+(?:\u00e0|a)\s+(\d+\s*°?\s*C)/gi, ' at $1')
      .replace(/\bchoux of Bruxelles\b/gi, 'Brussels sprouts')
      .replace(/\bchoux de Bruxelles\b/gi, 'Brussels sprouts')
      .replace(/\bin sommites\b/gi, 'as florets')
      .replace(/\bsommites\b/gi, 'florets')
      .replace(/\bcoupes in deux\b/gi, 'halved')
      .replace(/\bcoupes en deux\b/gi, 'halved')
      .replace(/\bcoupees en deux\b/gi, 'halved')
      .replace(/\bl['’]?vegetable moisture\b/gi, 'vegetable moisture')
      .replace(/\bwater of vegetation s est concentree\b/gi, 'vegetable moisture has concentrated')
      .replace(/\bvegetable moisture s est concentree\b/gi, 'vegetable moisture has concentrated')
      .replace(/\bhas concentree\b/gi, 'has concentrated')
      .replace(/\bavoid que garlic burns\b/gi, 'avoid burning the garlic')
      .replace(/\bavoid que garlic brule\b/gi, 'avoid burning the garlic')
      .replace(/\bavoid que\b/gi, 'so that')
      .replace(/\bto avoid of burn\b/gi, 'to avoid burning')
      .replace(/\bCook a chaleur moderee\b/gi, 'Cook over moderate heat')
      .replace(/\bchaleur moderee\b/gi, 'moderate heat')
      .replace(/\bcooking strong\b/gi, 'high-heat cooking')
      .replace(/\bthen laquer\b/gi, 'then glaze')
      .replace(/\bexces of runny\b/gi, 'excess liquid')
      .replace(/\bprevents the browning\b/gi, 'prevents browning')
      .replace(/\bJeter the marinade\b/g, 'Discard the marinade')
      .replace(/\bNot reutiliser\b/g, 'Do not reuse')
      .replace(/\breutiliser\b/gi, 'reuse')
      .replace(/\bcrue\b/gi, 'raw')
      .replace(/\belle should\b/gi, 'it should')
      .replace(/\bthe bring clearly a boil\b/gi, 'bring it to a full boil')
      .replace(/\bthe bring a boil\b/gi, 'bring it to a boil')
      .replace(/\bbring a boil\b/gi, 'bring to a boil')
      .replace(/\bserve of sauce\b/gi, 'be used as a sauce')
      .replace(/\bAstuce Keep\b/g, 'Tip: keep')
      .replace(/\bfor que the cookies se tiennent well\b/gi, 'so the cookies hold together well')
      .replace(/\bfor que the cheese se stabilise\b/gi, 'so the cheese sets')
      .replace(/\bfor que\b/gi, 'so that')
      .replace(/\band que\b/gi, 'and')
      .replace(/\bse tiennent\b/gi, 'hold together')
      .replace(/\bdessus bulle\b/gi, 'top bubbles')
      .replace(/\blegere browning\b/gi, 'light browning')
      .replace(/\bTexture attendue legere\b/g, 'Expected texture: light')
      .replace(/\bTexture attendue\b/g, 'Expected texture')
      .replace(/\bRealiser\b/g, 'Make')
      .replace(/\bpocher\b/gi, 'pipe')
      .replace(/\bdisque\b/gi, 'disk')
      .replace(/\bCooking longue\b/g, 'Long baking')
      .replace(/\bbien seches\b/gi, 'fully dry')
      .replace(/\bseches and stables\b/gi, 'dry and stable')
      .replace(/\bin whisking\b/gi, 'while whisking')
      .replace(/\bfor emulsify\b/gi, 'to emulsify')
      .replace(/\bor of\b/gi, 'or')
      .replace(/\band of\b/gi, 'and')
      .replace(/\bpeu of\b/gi, 'little')
      .replace(/\ba peu\b/gi, 'a little')
      .replace(/\bsi nécessaire\b/gi, 'if needed')
      .replace(/\bsi nécessaire\b/gi, 'if needed')
      .replace(/\bsi\s+/gi, 'if ')
      .replace(/\bin in\b/gi, 'in')
      .replace(/\bthe the\b/gi, 'the')
      .replace(/\bde\s+/gi, 'of ')
      .replace(/\bd'\s*/gi, 'of ')
      .replace(/\bd’\s*/gi, 'of ')
      .replace(/\bdu\s+/gi, 'of ')
      .replace(/\bdes\s+/gi, 'of ')
      .replace(/\bau\s+/gi, 'with ')
      .replace(/\baux\s+/gi, 'with ')
      .replace(/\bà\s+/gi, 'to ')
      .replace(/\bà\s+/gi, 'to ')
      .replace(/\bà\s+/gi, 'to ')
      .replace(/\ba la\s+/gi, 'with ')
      .replace(/\ba l'\s*/gi, 'with ')
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
      .replace(/\bdès que\s+/gi, 'as soon as ')
      .replace(/\bdes que\s+/gi, 'as soon as ')
      .replace(/\bdes qu'\s*/gi, 'as soon as ')
      .replace(/\bjusqu['’]au\s+/gi, 'until the ')
      .replace(/\bjusqu['’]aux\s+/gi, 'until the ')
      .replace(/\bjusqu\s+aux\s+/gi, 'until the ')
      .replace(/\bjusqu['’]with\s+/gi, 'until ')
      .replace(/\bjusqu\s+with\s+/gi, 'until ')
      .replace(/\baprès\s+/gi, 'after ')
      .replace(/\bapr\u00e8s\s+/gi, 'after ')
      .replace(/\baprès\s+/gi, 'after ')
      .replace(/\bapres\s+/gi, 'after ')
      .replace(/\bpendant\s+/gi, 'for ')
      .replace(/\bjusqu['’]à\s+/gi, 'until ')
      .replace(/\bjusqu['’]à\s+/gi, 'until ')
      .replace(/\bjusqu[’']à\s+/gi, 'until ')
      .replace(/\btrès\s+/gi, 'very ')
      .replace(/\btr\u00e8s\s+/gi, 'very ')
      .replace(/\btres\s+/gi, 'very ')
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
      .replace(/\band (Add|Mix|Cook|Fold|Transfer|Roll|Serve|Keep|Cut|Pour|Whisk|Heat|Bake|Fry|Drain|Salt|Taste)\b/g, (_, verb) => `and ${verb.toLowerCase()}`)
      .replace(/\bthen (Add|Mix|Cook|Fold|Transfer|Roll|Serve|Keep|Cut|Pour|Whisk|Heat|Bake|Fry|Drain|Salt|Taste)\b/g, (_, verb) => `then ${verb.toLowerCase()}`)
      .replace(/\band Add\b/g, 'and add')
      .replace(/\bbefore of\b/gi, 'before')
      .replace(/([.!?])\s+([a-z])/g, (_, end, letter) => `${end} ${letter.toUpperCase()}`)
      .replace(/\bn['’]\s*/gi, '')
      .replace(/\bhuile of olive\b/gi, 'olive oil')
      .replace(/\boil of olive\b/gi, 'olive oil')
      .replace(/\boil neutral\b/gi, 'neutral oil')
      .replace(/\bolive oil mild\b/gi, 'mild olive oil')
      .replace(/\bassemble with neutral oil\b/gi, 'whisk in neutral oil')
      .replace(/\bversees\b/gi, 'poured')
      .replace(/\bhuile\b/gi, 'oil')
      .replace(/\bail\b/gi, 'garlic')
      .replace(/\babricot\b/gi, 'apricot')
      .replace(/\bananas\b/gi, 'pineapple')
      .replace(/\bdevient\b/gi, 'becomes')
      .replace(/\bacide\b/gi, 'acidic')
      .replace(/\bgoute\b/gi, 'taste')
      .replace(/\btout\b/gi, 'all')
      .replace(/\bajouter\b/gi, 'add')
      .replace(/\bdouces\b/gi, 'mild')
      .replace(/\bdouce\b/gi, 'mild')
      .replace(/\bneutre\b/gi, 'neutral')
      .replace(/\bdeja\b/gi, 'already')
      .replace(/\bquelques\b/gi, 'a few')
      .replace(/\bsecondes\b/gi, 'seconds')
      .replace(/\bfouettant\b/gi, 'whisking')
      .replace(/\bbocal\b/gi, 'jar')
      .replace(/\bpreparees\b/gi, 'prepared')
      .replace(/\belles\b/gi, 'they')
      .replace(/\bqu'elles\b/gi, 'they')
      .replace(/\begoutter\b/gi, 'drain')
      .replace(/\bfremissante\b/gi, 'simmering')
      .replace(/\bdoit\b/gi, 'should')
      .replace(/\bdoivent\b/gi, 'should')
      .replace(/\betre\b/gi, 'be')
      .replace(/\boeufs\b/gi, 'eggs')
      .replace(/\boeuf\b/gi, 'egg')
      .replace(/\bwhite\s+(?:of\s+)?(?:uf|egg)\b/gi, 'egg white')
      .replace(/\byolk\s+(?:of\s+)?(?:uf|egg)\b/gi, 'egg yolk')
      .replace(/\beau\b/gi, 'water')
      .replace(/\bechalote\b/gi, 'shallot')
      .replace(/\boignon\b/gi, 'onion')
      .replace(/\bappareil\b/gi, 'mixture')
      .replace(/\bconcentre of tomato\b/gi, 'tomato paste')
      .replace(/\bconcentre\b/gi, 'concentrate')
      .replace(/\bbain of water\b/gi, 'ice bath')
      .replace(/\bbain glace\b/gi, 'ice bath')
      .replace(/\bbain\b/gi, 'bath')
      .replace(/\bfriture\b/gi, 'frying')
      .replace(/\bemulsion\b/gi, 'emulsion')
      .replace(/\bepices\b/gi, 'spices')
      .replace(/\brouleau\b/gi, 'rolling pin')
      .replace(/\bproche\b/gi, 'close')
      .replace(/\bgout\b/gi, 'taste')
      .replace(/\bcover of\b/gi, 'cover with')
      .replace(/\bjar clean\b/gi, 'clean jar')
      .replace(/\bthe conservation\b/gi, 'storage')
      .replace(/\bwater simmering\b/gi, 'simmering water')
      .replace(/\bwell drain\b/gi, 'drain well')
      .replace(/\boil neutral\b/gi, 'neutral oil')
      .replace(/\bolive oil mild\b/gi, 'mild olive oil')
      .replace(/\bAssemble with neutral oil\b/g, 'Whisk in neutral oil')
      .replace(/\bassemble with neutral oil\b/gi, 'whisk in neutral oil')
      .replace(/\bExpected texture legere\b/g, 'Expected texture: light')
      .replace(/\bExpected texture light\b/g, 'Expected texture: light')
      .replace(/\bElle should\b/g, 'It should')
      .replace(/\belle should\b/gi, 'it should')
      .replace(/\bif elle\b/gi, 'if it')
      .replace(/\belle est correctement stockee\b/gi, 'it is stored properly')
      .replace(/\bse store\b/gi, 'be stored')
      .replace(/\bNot reuse\b/g, 'Do not reuse')
      .replace(/\bFais not\b/gi, 'Do not')
      .replace(/\bthe bring clearly a boil if it should become a sauce\b/gi, 'bring it to a full boil if it will become a sauce')
      .replace(/\bthe bring clearly a boil\b/gi, 'bring it to a full boil')
      .replace(/\bthe bring a boil\b/gi, 'bring it to a boil')
      .replace(/\bit should serve of sauce\b/gi, 'it must be used as a sauce')
      .replace(/\bserve of sauce\b/gi, 'be used as a sauce')
      .replace(/\bexces of\b/gi, 'excess ')
      .replace(/\ba belle browning\b/gi, 'nice browning')
      .replace(/\bbelle browning\b/gi, 'nice browning')
      .replace(/\bPour on foamy egg whites\b/g, 'poured over foamy egg whites')
      .replace(/\bwith cream with butter\b/gi, 'into the buttercream')
      .replace(/\buntil this que\b/gi, 'until')
      .replace(/\bthe fruits soient\b/gi, 'the fruit is')
      .replace(/\bthe crumble soit\b/gi, 'the crumble is')
      .replace(/\bsoient\b/gi, 'are')
      .replace(/\bsoit\b/gi, 'is')
      .replace(/\bflocons of chili\b/gi, 'chili flakes')
      .replace(/\bpowder of chili\b/gi, 'chili powder')
      .replace(/\bcinq-spices\b/gi, 'five-spice')
      .replace(/\bseeds of sesame\b/gi, 'sesame seeds')
      .replace(/\bbowl resistant with chaleur\b/gi, 'heatproof bowl')
      .replace(/\bwithout burn garlic ni smoke oil\b/gi, 'without burning the garlic or smoking the oil')
      .replace(/\bVraie gaufre of Bruxelles\b/g, 'True Brussels waffle')
      .replace(/\bdough levee\b/gi, 'raised dough')
      .replace(/\bblancs montes\b/gi, 'whipped egg whites')
      .replace(/\bgros trous\b/gi, 'large holes')
      .replace(/\btexture legere\b/gi, 'light texture')
      .replace(/\bResult attendu\b/g, 'Expected result')
      .replace(/\bdough croustillante\b/gi, 'crisp dough')
      .replace(/\bcream of amande\b/gi, 'almond cream')
      .replace(/\bcream lemon\b/gi, 'lemon cream')
      .replace(/\bmeringue legere\b/gi, 'light meringue')
      .replace(/\bNe jamais precipiter\b/g, 'Never rush')
      .replace(/\bou les\b/gi, 'or the')
      .replace(/\bmelanges mousseux\b/gi, 'foamy mixtures')
      .replace(/\bchorizo coupe in dice\b/gi, 'diced chorizo')
      .replace(/\bcoupe in dice\b/gi, 'diced')
      .replace(/\bin the oven doux\b/gi, 'in a low oven')
      .replace(/\breheating doux\b/gi, 'gentle reheating')
      .replace(/\bbriefly of sauce\b/gi, 'a little sauce')
      .replace(/\bCooking lente indispensable pour une texture fondante\b/gi, 'Slow cooking is essential for a melting texture')
      .replace(/\bSors the butter a ramollir\b/gi, 'Take the butter out to soften')
      .replace(/\bpiece il should\b/gi, 'room; it should')
      .replace(/\bmais not\b/gi, 'but not')
      .replace(/\bgros pieces\b/gi, 'large pieces')
      .replace(/\bau-dessus dice eggs\b/gi, 'above the eggs')
      .replace(/\bdepuis the depart a cold\b/gi, 'from a cold start')
      .replace(/\bPress dice logs\b/gi, 'Press logs')
      .replace(/\bau-dessus of oil\b/gi, 'over the oil')
      .replace(/\bdice pieces\b/gi, 'pieces')
      .replace(/\bthe cake on its grilled\b/gi, 'the cake on its rack')
      .replace(/\bwith toucher\b/gi, 'to the touch')
      .replace(/\bTake out the butter a ramollir\b/gi, 'Take the butter out to soften')
      .replace(/\bfor que the butter hazelnut tiedit\b/gi, 'while the brown butter cools until lukewarm')
      .replace(/\bbutter hazelnut\b/gi, 'brown butter')
      .replace(/\bMeme sheet\b/g, 'Same sheet')
      .replace(/\bMeme\b/g, 'Same')
      .replace(/\bmeme\b/gi, 'same')
      .replace(/\bcitronne\b/gi, 'lemony')
      .replace(/\btraditionnel\b/gi, 'traditional')
      .replace(/\bepaisseur\b/gi, 'thickness')
      .replace(/\bentre deux leaves\b/gi, 'between two sheets')
      .replace(/\bleaves of parchment paper\b/gi, 'sheets of parchment paper')
      .replace(/\bwithout add of flour\b/gi, 'without adding flour')
      .replace(/\belle seals itself\b/gi, 'it seals itself')
      .replace(/\bfor qu['’]?il is\b/gi, 'so it is')
      .replace(/\bqu['’]?il is\b/gi, 'so it is')
      .replace(/\bfor que the brown butter cools until lukewarm\b/gi, 'while the brown butter cools until lukewarm')
      .replace(/\broom temperature il should\b/gi, 'room temperature; it should')
      .replace(/\bit turns translucide\b/gi, 'it turns translucent')
      .replace(/\bthis qu['’]?elle devienne translucide\b/gi, 'it turns translucent')
      .replace(/\belle can apporter of amertume\b/gi, 'it can bring bitterness')
      .replace(/\bcolor plus reguliere\b/gi, 'more even color')
      .replace(/\bparfum plus clean que\b/gi, 'cleaner aroma than')
      .replace(/\bclean que\b/gi, 'cleaner than')
      .replace(/\bAdd a dry\b/gi, 'added dry')
      .replace(/\bidealement\b/gi, 'ideally')
      .replace(/\bwith same temperature\b/gi, 'at the same temperature')
      .replace(/\bfor faciliter\b/gi, 'to help')
      .replace(/\bquantite\b/gi, 'quantity')
      .replace(/\bindiquee\b/gi, 'indicated')
      .replace(/\bprecision aide a get\b/gi, 'precision helps produce')
      .replace(/\bmie\b/gi, 'crumb')
      .replace(/\binto slices fines\b/gi, 'in thin slices')
      .replace(/\bafin que the sauce tienne well\b/gi, 'so the sauce clings well')
      .replace(/\bdice fries\b/gi, 'fries')
      .replace(/\bplaques of ravioli\b/gi, 'ravioli sheets')
      .replace(/\ba par une\b/gi, 'one by one')
      .replace(/\bthe remove gently\b/gi, 'remove them gently')
      .replace(/\bwith a ecumoire large\b/gi, 'with a large slotted spoon')
      .replace(/\bclarifie\b/gi, 'clarified')
      .replace(/\bdepending on need\b/gi, 'as needed')
      .replace(/\bMoins il remaining water\b/gi, 'The less water remains')
      .replace(/\bplus the waffles seront croustillantes\b/gi, 'the crispier the waffles will be')
      .replace(/\bwithout alcool\b/gi, 'without alcohol')
      .replace(/\bremplace the rum par the same quantity water gazeuse\b/gi, 'replace the rum with the same quantity of sparkling water')
      .replace(/\bfor que the blender tourne\b/gi, 'while the blender is running')
      .replace(/\bgaspacho melon sans concombre\b/gi, 'cucumber-free melon gazpacho')
      .replace(/\bpapier absorbant ou, mieux, on grilled\b/gi, 'paper towels or, better, a rack')
      .replace(/\bplus nette\b/gi, 'cleaner')
      .replace(/\bthen fais the deuxieme bath juste before the serving\b/gi, 'then do the second fry just before serving')
      .replace(/\ba part\b/gi, 'separate')
      .replace(/\buntil the fin\b/gi, 'until the end')
      .replace(/\bfor qu['’]?elle remaining lisible\b/gi, 'so it stays distinct')
      .replace(/\bdisparaisse not\b/gi, 'does not disappear')
      .replace(/\beven of (\d+)\s+to\s+(\d+mm) of thickness\b/gi, 'even, $1 to $2 thick')
      .replace(/\bSurveille the cooking all the fours colorent not of same facon\b/gi, 'Watch the cooking; all ovens brown differently')
      .replace(/\belle continue a gratiner\b/gi, 'it keeps gratinating')
      .replace(/\bjusqu['’]?at the last moment\b/gi, 'until the last moment')
      .replace(/\bThe vodka est optionalal\b/gi, 'The vodka is optional')
      .replace(/\belle aide especially a get\b/gi, 'it mainly helps produce')
      .replace(/\bfrying plus dry\b/gi, 'drier frying')
      .replace(/\bSurcharge not\b/gi, 'Do not overload')
      .replace(/\belle can se loosen\b/gi, 'it can loosen')
      .replace(/\bRépartir dans les empreintes en remplissant aux trois quarts\b/g, 'Divide among the molds, filling them three-quarters full')
      .replace(/\bIl should\b/g, 'It should')
      .replace(/\bfor s'spread\b/gi, 'so it spreads')
      .replace(/\bwithout dechirer the pain\b/gi, 'without tearing the bread')
      .replace(/\bSurdose not\b/gi, 'Do not overdo')
      .replace(/\bil becomes\b/gi, 'it becomes')
      .replace(/\bJette not\b/gi, 'Do not discard')
      .replace(/\belle Season\b/gi, 'it seasons')
      .replace(/\bAdd the eggs a a un\b/gi, 'Add the eggs one at a time')
      .replace(/\bcentre should be pris mais encore soft\b/gi, 'center should be set but still soft')
      .replace(/\bil finit of se stabiliser in tiedissant\b/gi, 'it finishes setting as it cools slightly')
      .replace(/\bfaire dry dice cherries\b/gi, 'dry cherries')
      .replace(/\bMieux vaut a temperature gentle and long qu['’]?a chaleur strong that cooked the fruit\b/gi, 'Low, slow heat is better than high heat that cooks the fruit')
      .replace(/\bRemplis not the bocaux jusqu['’]?in haut the marge limite the debordements with sterilisation\b/gi, 'Do not fill the jars to the top; headspace limits overflow during sterilization')
      .replace(/\bcleaner aroma que\b/gi, 'cleaner aroma than')
      .replace(/\bfor que the blender is running\b/gi, 'while the blender is running')
      .replace(/\bou, better\b/gi, 'or, better')
      .replace(/\bthen fais the second fry\b/gi, 'then do the second fry')
      .replace(/\belle keeps gratinating\b/gi, 'it keeps gratinating')
      .replace(/\bmais encore soft il finishes setting\b/gi, 'but still soft; it finishes setting')
      .replace(/\bDough rustique, flavored, with a chaleur gentle of Espelette pepper\b/gi, 'Rustic, fragrant pate with gentle Espelette pepper heat')
      .replace(/\bchaleur gentle\b/gi, 'gentle heat')
      .replace(/\bThe cold stabilise the topping and facilite the serving\b/gi, 'The cold stabilizes the filling and makes serving easier')
      .replace(/\bcentre should trembler slightly with sortie of oven il se raffermit in the refrigerator\b/gi, 'center should wobble slightly when it comes out of the oven; it firms up in the refrigerator')
      .replace(/\bPack down fermement the base avoid qu['’]?elle s['’]?effrite with cutting\b/gi, 'Pack the base firmly so it does not crumble when cut')
      .replace(/\bNot sous-cook: the surface should be well coloree\b/gi, 'Do not undercook: the surface should be well browned')
      .replace(/\bcoupe in brunoise\b/gi, 'diced')
      .replace(/\bamidon dice potatoes: il helps a lier\b/gi, 'potato starch: it helps bind')
      .replace(/\bThe chili d Espelette flavored plus qu il should burn\b/gi, 'Espelette pepper should perfume more than burn')
      .replace(/\bsauce brune flavored e leorange, finale chaleureuse\b/gi, 'brown sauce scented with orange and a warm finish')
      .replace(/\bCarrots fondantes, sauce coco-curry courte and finale citronnee\b/gi, 'Tender carrots, short coconut-curry sauce and lemony finish')
      .replace(/\bRectifier chaleur and acidity\b/gi, 'Adjust heat and acidity')
      .replace(/\bPlier en triangles serres\b/gi, 'Fold into tight triangles')
      .replace(/\bwatch l oil hot\b/gi, 'watch the hot oil')
      .replace(/\bnever remplir the saucepan au-dela of moitie\b/gi, 'never fill the saucepan more than halfway')
      .replace(/\btomato concentree\b/gi, 'concentrated tomato')
      .replace(/\bconcentree\b/gi, 'concentrated')
      .replace(/\bposes dessus\b/gi, 'set on top')
      .replace(/\bfor qu['’]?elle se tienne\b/gi, 'so it holds')
      .replace(/\bil gagne in taste\b/gi, 'it gains flavor')
      .replace(/\bmore mustard-based que\b/gi, 'more mustard-forward than')
      .replace(/\bcheck que the chicken est cooked a coeur\b/gi, 'check that the chicken is cooked through')
      .replace(/\bsauce tomato bell pepper concentrated\b/gi, 'concentrated tomato and pepper sauce')
      .replace(/\bwell gouteux, mais grated finement for qu['’]?il se repartisse\b/gi, 'flavorful, but finely grated so it disperses')
      .replace(/\bDo not bouillir fort the foie fat, il can graisser\b/gi, 'Do not boil the foie gras hard; it can turn greasy')
      .replace(/\bThe cream est optionalal, elle arrondit the turmeric\b/gi, 'The cream is optional; it rounds out the turmeric')
      .replace(/\bBatteur ou robot\b/g, 'Hand mixer or stand mixer')
      .replace(/\bil reveille\b/gi, 'it brightens')
      .replace(/\bwithout masquer\b/gi, 'without masking')
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
    [/^(.+?)\s+a la\s+(.+)$/i, match => `${translateRecipeFragment(match[1])} with ${translateRecipeFragment(match[2])}`],
    [/^(.+?)\s+a l['](.+)$/i, match => `${translateRecipeFragment(match[1])} with ${translateRecipeFragment(match[2])}`],
    [/^(.+?)\s+en\s+(.+)$/i, match => `${translateRecipeFragment(match[1])} in ${translateRecipeFragment(match[2])}`],
    [/^(Brochettes?)\s+(.+)$/i, match => `${translateRecipeFragment(match[2])} ${translateRecipeFragment(match[1])}`],
    [/^(Beignets?|Billes|Brochettes|Bricks|Croquettes|Verrines|Gressins|Madeleines|Muffins|Cookies|Choux|Donuts|Churros|Tempura|Curry|Gratin|Salade|Soupe|Veloute|Puree|Crumble|Tarte|Gateau|Creme|Sauce|Coulis|Compotee|Poelee|Ragout)\s+de\s+(.+)$/i, match => `${translateRecipeFragment(match[2])} ${translateRecipeFragment(match[1])}`],
    [/^(Beignets?|Billes|Brochettes|Bricks|Croquettes|Verrines|Gressins|Madeleines|Muffins|Cookies|Choux|Donuts|Churros|Tempura|Curry|Gratin|Salade|Soupe|Velouté|Purée|Crumble|Tarte|Gâteau|Crème|Sauce|Coulis|Compotée|Poêlée|Ragoût)\s+de\s+(.+)$/i, match => `${translateRecipeFragment(match[2])} ${translateRecipeFragment(match[1])}`]
  ];

  function translateRecipeStructure(source) {
    if (/[.;!?]/.test(source) || source.length > 110) return '';
    const normalizedSource = normalizeRecipeReplacementText(source);
    for (const [pattern, render] of recipeStructureRulesEn) {
      const match = normalizedSource.match(pattern);
      if (!match) continue;
      const translated = cleanRecipeEnglish(render(match));
      if (translated && normalizeI18nKey(translated) !== normalizeI18nKey(source)) {
        return capitalizeRecipeEnglish(translated);
      }
    }
    return '';
  }

  function replaceCulinaryTerms(value) {
    let output = ` ${normalizeRecipeReplacementText(value)} `;
    culinaryReplacementsEn
      .slice()
      .sort((left, right) => right[0].length - left[0].length)
      .forEach(([source, translated]) => {
        const normalizedSource = escapeRecipeReplacementSource(source);
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
    let output = ` ${normalizeRecipeReplacementText(value)} `;
    recipeGrammarReplacementsEn
      .slice()
      .sort((left, right) => right[0].length - left[0].length)
      .forEach(([source, translated]) => {
        const normalizedSource = escapeRecipeReplacementSource(source);
        output = output.replace(new RegExp(`(^|[^\\p{L}])${normalizedSource}(?=$|[^\\p{L}])`, 'giu'), `$1${translated}`);
      });
    return output.replace(/\s+/g, ' ').trim();
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

    let translated = replaceCulinaryTerms(replaceRecipeGrammar(source))
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
    const recipeTranslated = translateRecipeText(source);
    if (recipeTranslated) return recipeTranslated;
    for (const [pattern, render] of dynamicRules) {
      const match = source.match(pattern);
      if (match) return render(match);
    }
    return source;
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

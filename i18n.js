(function initCookNoteI18n(global) {
  'use strict';

  // Textes d'interface du site, en francais uniquement. Une traduction future
  // repartira de ces cles (t).
  const messages = {
      'site.description': 'Cook Note : carnet de recettes maison avec ingrédients, étapes, variantes, techniques de cuisine, favoris et liste de courses.',
      'site.ogDescription': 'Carnet de recettes maison avec variantes, techniques, favoris et liste de courses.',
      'seo.recipe.description': '{title} sur Cook Note : recette {category}{yieldText}{ingredientsText}.',
      'seo.techniques.description': 'Techniques de cuisine Cook Note : gestes, bases et repères pratiques pour cuisiner plus proprement.',
      'seo.home.title': 'Cook Note',
      'seo.techniques.title': 'Techniques - Cook Note',
      'home.heroSystemLabel': 'Archives culinaires · Les deux citadelles',
      'home.searchTitle': 'Rechercher une recette ou un ingrédient',
      'home.searchSubtitle': 'Titre, produit, saison, envie ou technique',
      'nav.home': 'Accueil',
      'nav.search': 'Recherche',
      'nav.searchShort': 'Rech',
      'nav.menu': 'Mode menu',
      'nav.menuShort': 'Menu',
      'nav.favorites': 'Favoris',
      'nav.favoritesShort': 'Fav',
      'nav.shopping': 'Courses',
      'nav.shoppingShort': 'Liste',
      'nav.day': 'Jour',
      'nav.night': 'Nuit',
      'nav.switchToDay': 'Passer en mode jour',
      'nav.switchToNight': 'Passer en mode nuit',
      'search.pending': 'Recherche en cours…',
      'search.bestResults': '{shown} meilleurs résultats sur {total} pour "{query}"',
      'search.results': '{count} résultat{plural} pour "{query}"',
      'offline.preparing': 'Préparation hors-ligne…',
      'offline.progress': '{completed}/{total} ressources préparées',
      'recipe.loadingTitle': 'Préparation de la fiche…',
      'recipe.loadingDescription': 'Les ingrédients et les étapes arrivent sans bloquer la page.',
      'recipe.loadingShort': 'Chargement…',
      'recipe.quickNavigation': 'Accès rapide dans la fiche',
      'recipe.jumpIngredients': 'Ingrédients',
      'recipe.jumpSteps': 'Étapes',
      'recipe.jumpBefore': 'Avant',
      'common.close': 'Fermer',
      'personal.analysisLoading': 'Analyse en cours…',
      'personal.history': 'Historique de la fiche',
      'personal.historyAria': 'Historique local de cette recette',
      'personal.historyLocalActive': 'Une ancienne version est utilisée localement.',
      'personal.historyUsePublished': 'Revenir à la version publiée',
      'personal.historyHelp': 'Les quatre dernières versions consultées sont conservées sur cet appareil.',
      'personal.historyUnknownVersion': 'Version enregistrée',
      'personal.historyPublished': 'Version publiée actuelle',
      'personal.historyRestore': 'Restaurer localement',
      'personal.historyTitleChanged': 'titre modifié',
      'personal.historyIngredientDelta': '{direction}{count} ingrédient(s)',
      'personal.historyStepDelta': '{direction}{count} étape(s)',
      'personal.historyNotesChanged': 'notes modifiées',
      'personal.historyPracticalChanged': 'informations pratiques modifiées',
      'personal.historyDetailsChanged': 'contenu modifié',
      'personal.equipmentRecipe': 'Compatibilité avec mon matériel',
      'personal.equipmentRecipeAria': 'Compatibilité du matériel requis',
      'personal.equipmentOwned': 'Disponible',
      'personal.equipmentCheck': 'À vérifier',
      'personal.equipmentOvenOffset': 'Réglage conseillé : corriger le four de {offset} °C.',
      'personal.mold': 'Adapter le contenant',
      'personal.moldAria': 'Calculateur de moules et contenants',
      'personal.moldHelp': 'Compare les surfaces pour ajuster toutes les quantités en une seule fois.',
      'personal.moldDiameter': 'Diamètre (cm)',
      'personal.moldWidth': 'Largeur (cm)',
      'personal.moldLength': 'Longueur (cm)',
      'personal.moldRound': 'Rond',
      'personal.moldRectangle': 'Rectangulaire',
      'personal.moldSource': 'Contenant de la recette',
      'personal.moldTarget': 'Mon contenant',
      'personal.moldFactor': 'Multiplier les quantités par {factor}',
      'personal.moldMore': '{percent} % de préparation en plus',
      'personal.moldLess': '{percent} % de préparation en moins',
      'personal.moldSame': 'Quantités inchangées',
      'personal.moldCaution': 'Le temps de cuisson reste à surveiller : la hauteur et la matière du contenant peuvent le modifier.',
      'personal.byproducts': 'Utiliser les restes utiles',
      'personal.byproductsHelp': 'Suggestions calculées depuis les sous-produits générés par cette recette.',
      'personal.byproduct.whites': 'Blancs d’œufs disponibles',
      'personal.byproduct.yolks': 'Jaunes d’œufs disponibles',
      'personal.byproduct.lemonJuice': 'Jus de citron disponible',
      'personal.byproductCount': '{count} recette(s) compatible(s)',
      'personal.byproductsNoMatch': 'Aucune recette compatible trouvée dans le catalogue.'
  };

  function interpolate(template, params) {
    return String(template || '').replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => (
      Object.prototype.hasOwnProperty.call(params || {}, key) ? params[key] : ''
    ));
  }

  function t(key, params = {}) {
    return interpolate(messages[key] || key, params);
  }

  global.CookNoteI18n = { messages, t };
})(window);

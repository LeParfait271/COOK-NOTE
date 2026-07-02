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
    'Courses': 'Shopping',
    'Retour haut': 'Back to top',
    'Retour en haut de page': 'Back to top',
    'Informations catalogue': 'Catalog information',
    'Installer Cook Note': 'Install Cook Note',
    'Carnet personnel de recettes et techniques culinaires développé par MaruChiwa.': 'Personal recipe and cooking-technique notebook developed by MaruChiwa.',
    'Application stand alone Android 5+ développé par MaruChiwa.': 'Standalone Android 5+ application developed by MaruChiwa.',
    'Installer Cook Note Android 5.0+': 'Install Cook Note Android 5.0+',
    'APK Legacy': 'Legacy APK',
    'APK Legacy pour les tablettes anciennes. Le fichier est heberge sur GitHub pour eviter les limites de taille Cloudflare Pages.': 'Legacy APK for older tablets. The file is hosted on GitHub to avoid Cloudflare Pages size limits.',
    'Touche Telecharger l APK.': 'Tap Download APK.',
    'Si Android affiche une alerte, autorise le telechargement.': 'If Android shows a warning, allow the download.',
    'Ouvre le fichier telecharge, puis autorise l installation depuis le navigateur si Android le demande.': 'Open the downloaded file, then allow installation from the browser if Android asks.',
    'Si le lien direct affiche une erreur, utilise le lien brut ou la page GitHub.': 'If the direct link shows an error, use the raw link or the GitHub page.',
    'Telecharger l APK': 'Download APK',
    'Lien brut': 'Raw link',
    'Page GitHub': 'GitHub page',
    'Lien stable': 'Stable link',
    'Fermer': 'Close',
    'Partager': 'Share',
    'Partager la liste': 'Share list',
    'Imprimer': 'Print',
    'Imprimer la liste': 'Print list',
    'Copier': 'Copy',
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
    'Toutes difficultes': 'All difficulties',
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
    'Partage de la liste ouvert': 'List sharing opened',
    'Retirer du panier courses': 'Remove from shopping basket',
    'Tout décocher': 'Uncheck all',
    'Synthese magasin': 'Store summary',
    'J’ai déjà': 'I already have it',
    'Marquer comme déjà à la maison': 'Mark as already at home',
    'Remettre dans la liste': 'Put back on the list',
    'Style de menu': 'Menu style',
    'Choisir le nombre de personnes du menu': 'Choose menu serving count',
    'Nombre de personnes du menu': 'Menu serving count',
    'Qualite du menu': 'Menu quality',
    'Fil d’Ariane': 'Breadcrumb',
    'Retour au catalogue Cook Note': 'Back to Cook Note catalog',
    'Retour au catalogue': 'Back to catalog',
    'Recettes liees a cette fiche': 'Recipes related to this sheet',
    'Masquer les recettes liees supplementaires': 'Hide additional related recipes',
    'Statut de la note privée': 'Private note status',
    'Ex : moins de sucre, cuisson +3 min, validée pour 8 personnes...': 'Ex: less sugar, cook +3 min, approved for 8 people...',
    'Effacer la note privée de cette recette': 'Clear this recipe private note',
    'Effacer la note': 'Clear note',
    'Résumé de la recette': 'Recipe summary',
    'Allergenes detectes': 'Detected allergens',
    'Liste des allergenes detectes': 'Detected allergen list',
    'Fiche technique de la recette': 'Recipe technical sheet',
    'Mettre à jour': 'Update',
    'Mettre Cook Note à jour': 'Update Cook Note',
    'Mise à jour...': 'Updating...',
    'WhatsApp': 'WhatsApp',
    'Email': 'Email',
    'Lien copié': 'Link copied',
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
    'Recette': 'Recipe',
    'Collection': 'Collection'
  };

  const dynamicRules = [
    [/^Version APK ([0-9.]+), Android 5\.0 minimum\.$/, match => `APK version ${match[1]}, Android 5.0 minimum.`],
    [/^(\d+) recette(s?)$/, match => `${match[1]} recipe${match[1] === '1' ? '' : 's'}`],
    [/^(\d+) fiche(s?)$/, match => `${match[1]} sheet${match[1] === '1' ? '' : 's'}`],
    [/^(\d+) ingrédient(s?)$/, match => `${match[1]} ingredient${match[1] === '1' ? '' : 's'}`],
    [/^(\d+) étape(s?)$/, match => `${match[1]} step${match[1] === '1' ? '' : 's'}`],
    [/^(\d+) course(s?)$/, match => `${match[1]} shopping item${match[1] === '1' ? '' : 's'}`],
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
    const translated = phraseEn[value];
    if (translated) return translated;
    for (const [pattern, render] of dynamicRules) {
      const match = value.match(pattern);
      if (match) return render(match);
    }
    return value;
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
    localizeDocument
  };

  global.CookNoteI18n = api;
  applyDocumentLanguage();
})(window);

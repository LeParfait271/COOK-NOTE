/* global React, ReactDOM */

const { useEffect, useMemo, useRef, useState } = React;
const {
  recipeCardImageUrl,
  imageSizeAttrs,
  imageSrcSet,
  imageBackgroundStyle,
  preferredImageUrl,
  cssImageValue,
  retryOriginalImage
} = window.CookNoteImages || {};
const IMAGE_MANIFEST = window.COOK_NOTE_IMAGE_MANIFEST || {};
const INITIAL_CATALOG_STATS = window.COOK_NOTE_CATALOG_STATS || {};

if (!recipeCardImageUrl || !imageSizeAttrs || !imageSrcSet || !imageBackgroundStyle || !preferredImageUrl || !cssImageValue || !retryOriginalImage) {
  throw new Error('CookNoteImages doit etre charge avant app.js.');
}

const h = (type, props, ...children) => React.createElement(
  type,
  repairReactProps(props),
  ...children.map(repairReactChildText)
);

const CookNoteI18n = window.CookNoteI18n || { t: key => key };
const t = (key, params) => CookNoteI18n.t(key, params);
const CookNoteTheme = window.CookNoteTheme || {
  themes: ['dark'],
  defaultTheme: 'dark',
  theme: () => 'dark',
  assets: () => ({}),
  asset: () => '',
  applyArtAssets: () => {},
  applyTheme: () => 'dark',
  setTheme: () => 'dark',
  toggleTheme: () => 'dark',
  subscribe: () => () => {},
  isValidTheme: value => value === 'dark'
};

const deferredScriptLoads = new Map();

function loadDeferredScript(src, globalName = '') {
  if (globalName && window[globalName]) return Promise.resolve(window[globalName]);
  if (deferredScriptLoads.has(src)) return deferredScriptLoads.get(src);

  const promise = new Promise((resolve, reject) => {
    const absoluteSrc = new URL(src, window.location.href).href;
    const existing = Array.from(document.scripts).find(script => script.src === absoluteSrc);
    const complete = () => resolve(globalName ? window[globalName] : true);

    if (existing) {
      if (existing.dataset.cookNoteLoaded === 'true' || (globalName && window[globalName])) {
        complete();
        return;
      }
      existing.addEventListener('load', complete, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.cookNoteDeferred = globalName || src;
    script.onload = () => {
      script.dataset.cookNoteLoaded = 'true';
      complete();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  deferredScriptLoads.set(src, promise);
  return promise;
}

function imageManifestEntry(src) {
  const path = String(src || '').replace(/^\/+/, '').split('?')[0];
  return IMAGE_MANIFEST[path] || IMAGE_MANIFEST[`/${path}`] || null;
}

function runConfettiBurst() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  loadDeferredScript(CONFETTI_SCRIPT_SRC, 'confetti').then(confetti => {
    if (typeof confetti !== 'function') return;
    confetti({ particleCount: 110, spread: 70, origin: { y: .65 } });
    setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } }), 220);
    setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } }), 380);
  }).catch(() => {});
}

const FALLBACK_ART_ASSETS = Object.freeze({
  background: '/assets/theme/dark/global/background.jpg',
  hero: '/assets/theme/dark/global/hero.png',
  logo: '/assets/brand/app-icon.png',
  appIcon: '/assets/brand/app-icon.png'
});
const THEME_RECIPE_ART_IMAGES = window.COOK_NOTE_THEME_RECIPE_ART || Object.freeze({ dark: Object.freeze({}), light: Object.freeze({}) });
const SITE_VERSION = 'v5.34';
const SITE_UPDATED_AT = '25/10/26';
const APP_RAW_DOWNLOAD_BASE = 'https://raw.githubusercontent.com/LeParfait271/COOK-NOTE/main/downloads';
const ANDROID_LEGACY_APK_VERSION = '5.32';
const ANDROID_LEGACY_STABLE_APK_FILE = 'cook-note-android-legacy.apk';
const APP_INSTALL_OPTIONS = Object.freeze([
  {
    id: 'android-legacy',
    kind: 'apk',
    label: 'Android 5.0+',
    detail: 'APK Legacy',
    href: `${APP_RAW_DOWNLOAD_BASE}/${ANDROID_LEGACY_STABLE_APK_FILE}`
  }
]);
const SITE_CACHE_VERSION = `${SITE_VERSION.replace(/^v(\d+)\.(\d+)$/, (_, major, minor) => `${major}${minor.padStart(2, '0')}`)}-parent-title`;
const FULL_RECIPE_CATALOG_SRC = `/recipes.js?v=${SITE_CACHE_VERSION}`;
const RECIPE_DETAIL_WORKER_SRC = '/recipe-worker.js';
const DEFERRED_CATALOG_CHUNK_SRCS = [2, 3, 4].map(index => `/assets/catalog-${index}.js?v=${SITE_CACHE_VERSION}`);
const QR_CODE_SCRIPT_SRC = '/assets/vendor/qrcode.min.js';
const CONFETTI_SCRIPT_SRC = '/assets/vendor/confetti.browser.min.js';
const GRID_INITIAL_RENDER_COUNT = 36;
const GRID_RENDER_BATCH_SIZE = 24;
const SEARCH_INPUT_COMMIT_DELAY_MS = 180;

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
const CATEGORY_ALIASES = Object.freeze({
  Apero: 'Apéro',
  Aperos: 'Apéro',
  Entrees: 'Entrées',
  'Petit-déjeuner': 'Petits-déjeuners',
  'Petit dejeuner': 'Petits-déjeuners',
  Bases: 'Base',
  Boulangerie: 'Base'
});
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
const BASE_TECHNIQUE_GUIDES = [
  {
    id: 'emincer',
    title: 'Émincer',
    label: 'Couteau',
    description: 'Couper en tranches fines et régulières, souvent pour les oignons, échalotes, poireaux ou champignons.',
    steps: ['Stabilise l’aliment avec une face plate.', 'Place les doigts en griffe.', 'Fais glisser la lame sans écraser.', 'Garde une épaisseur régulière.'],
    tip: 'Plus la coupe est fine, plus l’aliment fond vite à la cuisson.',
    query: 'oignon échalote champignon',
    aliases: ['émincer', 'émincé', 'émincée', 'émincés', 'émincées']
  },
  {
    id: 'ciseler',
    title: 'Ciseler',
    label: 'Couteau',
    description: 'Tailler très finement sans faire de purée, surtout pour les herbes, oignons et échalotes.',
    steps: ['Garde la pointe du couteau proche de la planche.', 'Avance petit à petit avec la main en griffe.', 'Repasse une fois seulement si nécessaire.', 'Arrête avant que l’aliment ne rende trop d’eau.'],
    tip: 'Pour les herbes, un couteau bien affûté évite de noircir les feuilles.',
    query: 'persil ciboulette échalote',
    aliases: ['ciseler', 'ciselé', 'ciselée', 'ciselés', 'ciselées']
  },
  {
    id: 'hacher',
    title: 'Hacher',
    label: 'Couteau',
    description: 'Couper très petit en gardant de la texture, pour l’ail, les herbes, les noix ou certains aromates.',
    steps: ['Regroupe l’aliment en tas.', 'Utilise un mouvement de balancier.', 'Ramène régulièrement les morceaux au centre.', 'Arrête avant d’obtenir une pâte humide.'],
    tip: 'Pour l’ail, retire le germe si tu veux un goût plus doux.',
    query: 'ail herbes noix',
    aliases: ['hacher', 'haché', 'hachée', 'hachés', 'hachées']
  },
  {
    id: 'brunoise',
    title: 'Tailler en brunoise',
    label: 'Couteau',
    description: 'Couper en très petits dés réguliers pour une cuisson rapide ou une garniture nette.',
    steps: ['Taillez d’abord des tranches régulières.', 'Coupe-les en bâtonnets fins.', 'Rassemble les bâtonnets.', 'Détaille en petits dés réguliers.'],
    tip: 'Une brunoise régulière cuit vite et donne une texture plus élégante.',
    query: 'carotte courgette légumes',
    aliases: ['brunoise', 'petite brunoise']
  },
  {
    id: 'julienne',
    title: 'Tailler en julienne',
    label: 'Couteau',
    description: 'Couper en fins bâtonnets pour une garniture, une salade ou une cuisson très courte.',
    steps: ['Coupe l’aliment en tronçons réguliers.', 'Fais des tranches fines.', 'Superpose quelques tranches.', 'Détaille en bâtonnets fins.'],
    tip: 'Ne superpose pas trop de tranches à la fois, sinon la coupe devient irrégulière.',
    query: 'légumes carotte courgette',
    aliases: ['julienne', 'en julienne']
  },
  {
    id: 'sommites',
    title: 'Détailler en sommités',
    label: 'Légumes',
    description: 'Séparer chou-fleur ou brocoli en petits bouquets réguliers pour une cuisson homogène et une présentation nette.',
    steps: ['Retire les feuilles et raccourcis la base du trognon.', 'Détache les gros bouquets à la main ou avec la pointe du couteau.', 'Recoupe par la tige pour garder des sommités régulières sans émietter les têtes.', 'Garde les parures et le cœur épluché pour une soupe, une purée ou une garniture.'],
    tip: 'Des sommités de taille proche cuisent au même rythme : plus petites pour rôtir vite, plus grosses pour garder du croquant.',
    query: 'chou-fleur brocoli fleurettes bouquets',
    aliases: ['sommités', 'sommites', 'somités', 'somites', 'détailler en sommités', 'detailler en sommites', 'fleurettes', 'en fleurettes', 'petits bouquets']
  },
  {
    id: 'monder-tomates',
    title: 'Monder des tomates',
    label: 'Légumes',
    description: 'Retirer facilement la peau des tomates pour une sauce, un coulis ou une préparation plus nette.',
    steps: ['Incise une petite croix sous chaque tomate.', 'Plonge 10 à 20 secondes dans l’eau bouillante.', 'Refroidis aussitôt dans de l’eau froide.', 'Tire la peau avec la pointe d’un couteau.'],
    tip: 'Le but est de décoller la peau, pas de cuire la chair.',
    query: 'tomate coulis sauce',
    aliases: ['monder', 'monder des tomates', 'tomate mondée', 'tomates mondées', 'mondée', 'mondées']
  },
  {
    id: 'concasser',
    title: 'Concasser',
    label: 'Préparation',
    description: 'Couper grossièrement pour garder des morceaux irréguliers, souvent pour tomates, noix, chocolat ou poivre.',
    steps: ['Place l’aliment sur une planche stable.', 'Coupe ou écrase grossièrement.', 'Garde des morceaux visibles.', 'Évite de réduire en poudre ou en purée.'],
    tip: 'Concasser donne du relief : texture, éclats et mâche.',
    query: 'tomates poivre noisettes chocolat',
    aliases: ['concasser', 'concassé', 'concassée', 'concassés', 'concassées']
  },
  {
    id: 'peler-a-vif',
    title: 'Peler à vif',
    label: 'Agrumes',
    description: 'Retirer peau et membrane blanche d’un agrume pour obtenir des segments nets et sans amertume.',
    steps: ['Coupe les deux extrémités.', 'Suis la courbe avec un couteau bien aiguisé.', 'Retire toute la partie blanche.', 'Prélève les segments entre les membranes.'],
    tip: 'Travaille au-dessus d’un bol pour récupérer le jus.',
    query: 'orange citron agrume',
    aliases: ['peler à vif', 'peler a vif', 'pelé à vif', 'pelée à vif']
  },
  {
    id: 'zester',
    title: 'Zester un agrume',
    label: 'Agrumes',
    description: 'Prélever seulement la partie parfumée de la peau, sans l’amertume du blanc.',
    steps: ['Lave et sèche l’agrume.', 'Utilise une râpe fine ou un zesteur.', 'Tourne l’agrume à chaque passage.', 'Arrête dès que la partie blanche apparaît.'],
    tip: 'Le zeste parfume mieux ajouté hors du feu ou en fin de préparation.',
    query: 'citron zeste',
    aliases: ['zester', 'zeste', 'zestes', 'zesté']
  },
  {
    id: 'abaisser-pate',
    title: 'Abaisser une pâte',
    label: 'Pâtisserie',
    description: 'Étaler une pâte au rouleau avec une épaisseur régulière, sans la réchauffer ni la déformer.',
    steps: ['Farine légèrement le plan de travail.', 'Étale du centre vers l’extérieur.', 'Tourne la pâte régulièrement.', 'Remets au frais si elle devient collante.'],
    tip: 'Une pâte trop farinée devient sèche ; une pâte trop chaude se rétracte davantage.',
    query: 'pâte tarte',
    aliases: ['abaisser', 'abaisser une pâte', 'pâte abaissée', 'abaissée']
  },
  {
    id: 'foncer-moule',
    title: 'Foncer un moule',
    label: 'Pâtisserie',
    description: 'Installer une pâte dans un cercle ou un moule en gardant les angles propres.',
    steps: ['Dépose la pâte abaissée sans tirer.', 'Pousse délicatement dans les angles.', 'Coupe l’excédent.', 'Pique et remets au froid si besoin.'],
    tip: 'Ne tire pas sur la pâte : elle se rétracterait à la cuisson.',
    query: 'fond de tarte pâte',
    aliases: ['foncer', 'foncer le moule', 'foncer un moule']
  },
  {
    id: 'cuire-a-blanc',
    title: 'Cuire à blanc',
    label: 'Pâtisserie',
    description: 'Précuire une pâte seule avant d’ajouter une garniture humide ou fragile.',
    steps: ['Fonce et pique la pâte.', 'Couvre de papier cuisson.', 'Ajoute des poids ou légumes secs.', 'Cuis jusqu’à légère coloration puis sèche sans poids si besoin.'],
    tip: 'Le froid avant cuisson limite la rétractation.',
    query: 'fond de tarte cuire blanc',
    aliases: ['cuire à blanc', 'cuire a blanc', 'cuisson à blanc', 'cuisson a blanc']
  },
  {
    id: 'sabler',
    title: 'Sabler',
    label: 'Pâtisserie',
    description: 'Mélanger farine et beurre pour obtenir une texture sableuse avant d’hydrater ou lier une pâte.',
    steps: ['Mets farine et beurre froid en morceaux.', 'Frotte entre les doigts ou au robot.', 'Arrête dès que la texture ressemble à du sable.', 'Ajoute le liquide ou l’œuf ensuite.'],
    tip: 'Ne chauffe pas trop le beurre, sinon la pâte perd son côté friable.',
    query: 'pâte sablée farine beurre',
    aliases: ['sabler', 'sablage', 'sablé la pâte', 'texture sableuse']
  },
  {
    id: 'fraiser',
    title: 'Fraiser une pâte',
    label: 'Pâtisserie',
    description: 'Écraser la pâte avec la paume pour homogénéiser sans trop la travailler.',
    steps: ['Rassemble la pâte en masse.', 'Pousse une portion avec la paume.', 'Rassemble à nouveau.', 'Arrête dès que la pâte est homogène.'],
    tip: 'Trop fraiser développe le gluten et rend la pâte moins friable.',
    query: 'pâte tarte sablée',
    aliases: ['fraiser', 'fraser', 'fraisage', 'frasage']
  },
  {
    id: 'chemiser',
    title: 'Chemiser',
    label: 'Moule',
    description: 'Recouvrir l’intérieur d’un moule avec farine, cacao, sucre, papier ou beurre pour faciliter le démoulage.',
    steps: ['Beurre ou humidifie légèrement le moule selon la recette.', 'Ajoute farine, cacao, sucre ou papier.', 'Couvre toute la surface.', 'Retire l’excédent avant de remplir.'],
    tip: 'Pour un gâteau chocolat, le cacao évite les traces blanches de farine.',
    query: 'moule cacao farine gâteau',
    aliases: ['chemiser', 'chemisé', 'chemisée']
  },
  {
    id: 'beurrer-fariner',
    title: 'Beurrer et fariner',
    label: 'Moule',
    description: 'Préparer un moule ou des ramequins pour éviter que les gâteaux et mi-cuits accrochent.',
    steps: ['Passe une fine couche de beurre mou.', 'Ajoute une petite cuillère de farine.', 'Tourne le moule pour couvrir les parois.', 'Tape pour retirer l’excédent.'],
    tip: 'Cette étape est importante pour les préparations qui collent facilement.',
    query: 'mi cuit chocolat cake',
    aliases: ['beurrer et fariner', 'beurrer le moule', 'beurrer un moule', 'beurrer les moules', 'beurrer les cercles', 'beurrer les ramequins', 'fariner le moule', 'fariner les ramequins']
  },
  {
    id: 'badigeonner',
    title: 'Badigeonner',
    label: 'Geste',
    description: 'Appliquer une fine couche de dorure, marinade, beurre, huile, miel ou moutarde sur une surface avec un pinceau.',
    steps: ['Prépare le mélange dans un petit bol.', 'Utilise un pinceau de cuisine propre.', 'Étale en couche fine et régulière.', 'Évite les flaques qui brûlent ou détrempent.', 'Renouvelle en cours de cuisson seulement si la recette le demande.'],
    tip: 'Badigeonner sert à parfumer, faire briller ou aider une surface à colorer sans l’imbiber.',
    query: 'pinceau dorure marinade moutarde miel',
    aliases: ['badigeonner', 'badigeoner', 'badigeonne', 'badigeonné', 'badigeonnée', 'badigeonner de moutarde', 'badigeonner les cuisses', 'badigeonner au pinceau', 'au pinceau', 'pinceau de cuisine']
  },
  {
    id: 'blanchir',
    title: 'Blanchir',
    label: 'Cuisson',
    description: 'Cuire brièvement dans l’eau bouillante, ou fouetter œufs et sucre jusqu’à éclaircissement selon le contexte.',
    steps: ['Pour les légumes, plonge dans l’eau bouillante salée.', 'Cuis très peu de temps.', 'Rafraîchis aussitôt si besoin.', 'Pour les œufs, fouette avec le sucre jusqu’à texture plus claire.'],
    tip: 'Le contexte dit tout : légumes blanchis ou œufs blanchis ne veulent pas dire la même chose.',
    query: 'blanchir œufs légumes',
    aliases: ['blanchir', 'blanchi', 'blanchie', 'sans trop blanchir']
  },
  {
    id: 'rafraichir',
    title: 'Rafraîchir',
    label: 'Cuisson',
    description: 'Stopper une cuisson en plongeant l’aliment dans de l’eau froide ou glacée.',
    steps: ['Prépare un bol d’eau froide avant la cuisson.', 'Égoutte l’aliment chaud.', 'Plonge immédiatement dans l’eau froide.', 'Égoutte à nouveau avant d’utiliser.'],
    tip: 'Rafraîchir garde les couleurs nettes et évite la surcuisson.',
    query: 'légumes eau froide',
    aliases: ['rafraîchir', 'rafraichir', 'refroidir aussitôt']
  },
  {
    id: 'monter-blancs',
    title: 'Monter des blancs',
    label: 'Œufs',
    description: 'Incorporer de l’air dans les blancs d’œufs pour obtenir une mousse stable.',
    steps: ['Utilise un bol propre et sec.', 'Commence doucement pour casser les blancs.', 'Augmente la vitesse quand la mousse devient fine.', 'Arrête au bec demandé par la recette.'],
    tip: 'Des blancs trop battus deviennent granuleux et s’incorporent moins bien.',
    query: 'blancs œufs meringue',
    aliases: ['monter les blancs', 'monter des blancs', 'blancs en neige', 'bec d’oiseau', 'bec d oiseau']
  },
  {
    id: 'incorporer-delicatement',
    title: 'Incorporer délicatement',
    label: 'Mélange',
    description: 'Mélanger une préparation légère sans casser l’air incorporé.',
    steps: ['Ajoute une première petite portion pour détendre.', 'Utilise une maryse.', 'Soulève la masse du bas vers le haut.', 'Arrête dès que le mélange est homogène.'],
    tip: 'Trop mélanger fait retomber les blancs, chantilly ou mousses.',
    query: 'incorporer délicatement blancs chantilly',
    aliases: ['incorporer délicatement', 'incorporer la chantilly', 'incorporer les blancs', 'incorporer progressivement']
  },
  {
    id: 'monter-mayonnaise',
    title: 'Monter une mayonnaise',
    label: 'Sauce',
    description: 'Créer une émulsion stable entre jaune d’œuf, moutarde, acidité et huile.',
    steps: ['Mélange jaune, moutarde, sel et acidité.', 'Verse l’huile goutte à goutte au début.', 'Augmente le filet quand la sauce prend.', 'Détends si elle devient trop épaisse.'],
    tip: 'Si elle tranche, repars avec une cuillère d’eau puis incorpore la sauce ratée petit à petit.',
    query: 'mayonnaise aïoli sauce',
    aliases: ['monter une mayonnaise', 'mayonnaise montée', 'monter à l’huile']
  },
  {
    id: 'pocher',
    title: 'Pocher',
    label: 'Cuisson',
    description: 'Cuire doucement dans un liquide frémissant, ou dresser une préparation à la poche selon le contexte.',
    steps: ['Pour une cuisson, garde le liquide sous l’ébullition.', 'Plonge l’aliment doucement.', 'Surveille la température.', 'Pour une poche, presse régulièrement sans à-coups.'],
    tip: 'Pocher peut désigner une cuisson douce ou un dressage à la poche.',
    query: 'pocher poche crème poisson',
    aliases: ['pocher', 'poché', 'pochée', 'à la poche', 'a la poche']
  },
  {
    id: 'frire',
    title: 'Frire',
    label: 'Cuisson',
    description: 'Cuire dans un bain d’huile chaud pour obtenir une surface croustillante.',
    steps: ['Chauffe l’huile à la température indiquée.', 'Travaille par petites quantités.', 'Égoutte sur grille ou papier.', 'Sale ou assaisonne juste après cuisson.'],
    tip: 'Trop remplir la casserole fait chuter la température et graisse la friture.',
    query: 'friture beignet tempura frites',
    aliases: ['frire', 'friture', 'à frire', 'a frire']
  },
  {
    id: 'paner',
    title: 'Paner',
    label: 'Cuisson',
    description: 'Enrober un aliment pour créer une croûte régulière à la cuisson.',
    steps: ['Sèche l’aliment.', 'Passe dans farine, œuf puis chapelure.', 'Appuie légèrement pour faire adhérer.', 'Laisse reposer si possible avant cuisson.'],
    tip: 'Une panure adhère mieux sur un aliment sec.',
    query: 'chapelure panure',
    aliases: ['paner', 'pané', 'panée', 'panure']
  },
  {
    id: 'suer',
    title: 'Faire suer',
    label: 'Cuisson',
    description: 'Cuire doucement un aromate ou légume sans coloration pour faire sortir son eau et son parfum.',
    steps: ['Chauffe doucement avec un peu de matière grasse.', 'Ajoute l’aliment taillé finement.', 'Sale légèrement si utile.', 'Cuis jusqu’à texture translucide sans brunir.'],
    tip: 'Suer développe la douceur sans goût grillé.',
    query: 'échalote oignon sauce',
    aliases: ['faire suer', 'suer', 'fait suer']
  },
  {
    id: 'etuver',
    title: 'Étuver',
    label: 'Cuisson douce',
    description: 'Cuire doucement à couvert avec très peu de liquide ou de matière grasse, souvent pour des légumes.',
    steps: ['Coupe les aliments assez régulièrement.', 'Ajoute peu de matière grasse ou un fond de liquide.', 'Couvre pour garder la vapeur.', 'Cuis doucement sans chercher de coloration.'],
    tip: 'Étuver attendrit et concentre le goût, mais peut ramollir un aliment qu’on voulait croustillant.',
    query: 'légumes vapeur couvert',
    aliases: ['étuver', 'etuver', 'étuvé', 'étuvée', 'étuvés', 'étuvées', 'étuvage', 'à l’étouffée', 'a l etouffee']
  },
  {
    id: 'faire-revenir',
    title: 'Faire revenir',
    label: 'Cuisson',
    description: 'Colorer rapidement un aliment dans une matière grasse pour développer le goût.',
    steps: ['Chauffe la poêle avant d’ajouter l’aliment.', 'Évite de surcharger.', 'Laisse colorer avant de remuer.', 'Baisse le feu si les sucs brûlent.'],
    tip: 'Faire revenir cherche plus de goût qu’une cuisson douce.',
    query: 'faire revenir oignon viande',
    aliases: ['faire revenir']
  },
  {
    id: 'deglacer',
    title: 'Déglacer',
    label: 'Cuisson',
    description: 'Décoller les sucs au fond d’une poêle avec un liquide pour créer une base de sauce.',
    steps: ['Retire l’excès de gras si nécessaire.', 'Verse un liquide dans la poêle chaude.', 'Gratte le fond avec une spatule.', 'Laisse réduire pour concentrer.'],
    tip: 'Eau, bouillon, vin, vinaigre ou jus peuvent déglacer selon la recette.',
    query: 'sauce cuisson',
    aliases: ['déglacer', 'deglacer', 'déglacé', 'déglacée']
  },
  {
    id: 'reduire',
    title: 'Réduire',
    label: 'Sauce',
    description: 'Faire évaporer une partie du liquide pour concentrer le goût et épaissir.',
    steps: ['Laisse frémir à découvert.', 'Remue de temps en temps.', 'Surveille les bords de casserole.', 'Arrête quand la texture nappe ou devient sirupeuse.'],
    tip: 'Une réduction continue d’épaissir légèrement en refroidissant.',
    query: 'sauce réduire',
    aliases: ['réduire', 'reduire', 'réduit', 'réduire presque à sec', 'réduire de moitié']
  },
  {
    id: 'lier-sauce',
    title: 'Lier une sauce',
    label: 'Sauce',
    description: 'Donner de la tenue à une sauce avec beurre, crème, fécule, jaune ou réduction.',
    steps: ['Choisis le liant adapté.', 'Ajoute-le hors feu ou à feu doux selon le cas.', 'Fouette pour homogénéiser.', 'Évite l’ébullition forte avec les jaunes ou le beurre.'],
    tip: 'Une sauce liée doit napper sans devenir lourde.',
    query: 'lier sauce beurre crème',
    aliases: ['lier la sauce', 'lier une sauce', 'pour lier', 'sauce liée']
  },
  {
    id: 'monter-au-beurre',
    title: 'Monter au beurre',
    label: 'Sauce',
    description: 'Finir une sauce chaude avec du beurre froid pour lui donner brillance, rondeur et tenue.',
    steps: ['Réduis la sauce avant d’ajouter le beurre.', 'Coupe le feu ou baisse très fort.', 'Ajoute le beurre froid en petits morceaux.', 'Fouette ou vanne la casserole sans refaire bouillir.'],
    tip: 'Si la sauce bout trop fort après ajout du beurre, elle peut trancher.',
    query: 'sauce beurre froid',
    aliases: ['monter au beurre', 'ajouter le beurre froid']
  },
  {
    id: 'clarifier',
    title: 'Clarifier',
    label: 'Préparation',
    description: 'Séparer une préparation de ses éléments troubles ou indésirables : beurre clarifié, bouillon limpide ou œuf séparé selon le contexte.',
    steps: ['Identifie ce qui doit être séparé : petit-lait, écume, dépôt ou blanc/jaune.', 'Travaille doucement pour éviter de remélanger les éléments.', 'Retire l’écume ou verse en laissant le dépôt au fond.', 'Filtre si la recette demande une texture parfaitement nette.'],
    tip: 'Clarifier demande de la douceur : si tu remues trop fort, les éléments séparés se remettent en suspension.',
    query: 'beurre bouillon œuf filtrer',
    aliases: ['clarifier', 'clarifié', 'clarifiée', 'beurre clarifié', 'bouillon clarifié']
  },
  {
    id: 'torrefier',
    title: 'Torréfier',
    label: 'Cuisson',
    description: 'Chauffer à sec ou au four pour renforcer le parfum des épices, graines ou fruits secs.',
    steps: ['Étale en couche fine.', 'Chauffe à sec ou au four.', 'Remue ou surveille souvent.', 'Arrête dès que l’odeur devient intense.'],
    tip: 'Les épices brûlent vite : quelques secondes peuvent suffire à la poêle.',
    query: 'noisettes épices graines',
    aliases: ['torréfier', 'torrefier', 'torréfié', 'torréfiée', 'torréfiées']
  },
  {
    id: 'detendre',
    title: 'Détendre une préparation',
    label: 'Texture',
    description: 'Assouplir une crème, une sauce ou une pâte trop ferme avec un peu de liquide ou une petite portion de préparation souple.',
    steps: ['Travaille d’abord la préparation au fouet ou à la spatule.', 'Ajoute le liquide ou la base souple en petite quantité.', 'Mélange jusqu’à retrouver une texture lisse.', 'Arrête dès que la texture est utilisable, sans la rendre liquide.'],
    tip: 'Détendre sert à faciliter l’incorporation : une crème trop ferme casse plus facilement une mousse ou une chantilly.',
    query: 'crème sauce pâte texture',
    aliases: ['détendre', 'detendre', 'détendu', 'détendue', 'détendre avec']
  },
  {
    id: 'serrer-blancs',
    title: 'Serrer des blancs',
    label: 'Œufs',
    description: 'Ajouter le sucre progressivement dans des blancs montés pour obtenir une meringue plus stable, brillante et régulière.',
    steps: ['Monte les blancs jusqu’à une mousse fine.', 'Ajoute le sucre petit à petit, pas d’un seul coup.', 'Continue de fouetter jusqu’à texture brillante.', 'Arrête au bec demandé par la recette.'],
    tip: 'Serrer trop tôt ralentit la montée ; serrer trop tard stabilise moins bien la mousse.',
    query: 'meringue blancs sucre',
    aliases: ['serrer', 'serrer au sucre', 'serrer les blancs', 'blancs serrés', 'meringue serrée']
  },
  {
    id: 'texture-ruban',
    title: 'Obtenir le ruban',
    label: 'Pâtisserie',
    description: 'Atteindre une texture souple qui retombe en ruban continu, utile pour les appareils fouettés, macarons et certaines pâtes.',
    steps: ['Soulève la préparation avec la maryse ou le fouet.', 'Observe si elle retombe en bande continue.', 'Mélange encore par petits gestes si elle casse trop vite.', 'Arrête dès que le ruban se fond lentement dans la masse.'],
    tip: 'Un ruban trop liquide annonce souvent un mélange trop travaillé.',
    query: 'macaron pâte appareil ruban',
    aliases: ['ruban', 'texture ruban', 'obtenir un ruban', 'ruban souple', 'faire le ruban']
  },
  {
    id: 'parer',
    title: 'Parer',
    label: 'Préparation',
    description: 'Retirer les parties inutiles, dures ou irrégulières d’un aliment pour obtenir une pièce nette avant cuisson ou dressage.',
    steps: ['Identifie les parties sèches, dures, grasses ou abîmées.', 'Retire-les avec un couteau bien aiguisé.', 'Garde les parures propres pour un bouillon ou une sauce si utile.', 'Évite de trop enlever : on cherche une pièce nette, pas une perte excessive.'],
    tip: 'Parer améliore la cuisson et la présentation, surtout sur viandes, poissons, légumes et agrumes.',
    query: 'préparer viande poisson légumes parures',
    aliases: ['parer', 'parures', 'paré', 'parée']
  },
  {
    id: 'singer',
    title: 'Singer',
    label: 'Sauce',
    description: 'Saupoudrer une préparation de farine puis cuire brièvement pour lier une sauce ou un ragoût sans goût de farine crue.',
    steps: ['Ajoute la farine en pluie sur la garniture chaude.', 'Mélange pour enrober régulièrement.', 'Cuis 1 à 2 minutes pour retirer le goût cru.', 'Mouille progressivement avec le liquide de cuisson.'],
    tip: 'Singer demande une cuisson courte de la farine avant d’ajouter le liquide, sinon la sauce peut rester pâteuse.',
    query: 'farine sauce ragoût liaison',
    aliases: ['singer', 'singer la garniture', 'fariner la garniture']
  },
  {
    id: 'cremer',
    title: 'Crémer',
    label: 'Pâtisserie',
    description: 'Travailler beurre pommade et sucre pour obtenir une base souple et homogène.',
    steps: ['Utilise un beurre pommade, pas fondu.', 'Travaille avec le sucre jusqu’à texture crémeuse.', 'Racle les bords du bol.', 'Ajoute les œufs ensuite selon la recette.'],
    tip: 'Trop crémer peut changer la texture finale de certains cakes ou cookies.',
    query: 'beurre sucre cookie cake',
    aliases: ['crémer', 'cremer', 'crémer le beurre']
  },
  {
    id: 'infuser',
    title: 'Infuser',
    label: 'Parfum',
    description: 'Extraire les parfums d’un ingrédient dans un liquide chaud ou froid.',
    steps: ['Chauffe le liquide si la recette le demande.', 'Ajoute aromates, épices ou zestes.', 'Couvre pour garder les parfums.', 'Filtre ou retire l’aromate avant usage.'],
    tip: 'Une infusion trop forte peut devenir amère, surtout avec agrumes, thé ou safran.',
    query: 'infuser safran zeste épice',
    aliases: ['infuser', 'infusé', 'infusée', 'laisser infuser']
  },
  {
    id: 'filmer-contact',
    title: 'Filmer au contact',
    label: 'Crème',
    description: 'Poser le film directement sur une crème pour éviter la peau en surface.',
    steps: ['Verse la crème dans un récipient propre.', 'Pose le film directement contre la surface.', 'Chasse les bulles d’air.', 'Refroidis rapidement si la recette le demande.'],
    tip: 'Le film doit toucher la crème, pas seulement couvrir le bol.',
    query: 'crème pâtissière refroidir',
    aliases: ['filmer au contact', 'film au contact', 'filmer immédiatement au contact']
  },
  {
    id: 'tamiser',
    title: 'Tamiser',
    label: 'Pâtisserie',
    description: 'Passer une poudre ou une préparation au tamis pour retirer les grains et alléger.',
    steps: ['Place le tamis au-dessus d’un bol.', 'Verse la poudre ou la préparation.', 'Tapote ou racle doucement.', 'Jette les gros morceaux si la recette demande une texture fine.'],
    tip: 'Tamiser évite les grumeaux dans les biscuits, macarons, crèmes et sauces.',
    query: 'tamis poudre amande sucre glace',
    aliases: ['tamiser', 'tamisé', 'tamisée', 'passer au tamis']
  },
  {
    id: 'macaroner',
    title: 'Macaroner',
    label: 'Pâtisserie',
    description: 'Travailler l’appareil à macarons pour le détendre juste assez et obtenir un ruban souple.',
    steps: ['Incorpore la meringue aux poudres.', 'Écrase légèrement la masse contre la paroi.', 'Ramène la pâte au centre.', 'Arrête dès que le ruban retombe souplement sans devenir liquide.'],
    tip: 'Un appareil trop peu macaronné fait des coques épaisses ; trop macaronné, il s’étale et perd son volume.',
    query: 'macaron meringue poudre amande',
    aliases: ['macaroner', 'macaronner', 'macaronnage', 'macaronné', 'macaronnée']
  },
  {
    id: 'bain-marie',
    title: 'Cuire au bain-marie',
    label: 'Cuisson douce',
    description: 'Chauffer doucement une préparation grâce à un récipient posé sur une eau frémissante.',
    steps: ['Fais frémir un fond d’eau.', 'Pose un bol sans que le fond touche trop l’eau.', 'Remue régulièrement.', 'Garde une chaleur douce et stable.'],
    tip: 'Le bain-marie évite de brûler chocolat, beurre, crèmes et sauces fragiles.',
    query: 'bain-marie chocolat beurre',
    aliases: ['bain-marie', 'bain marie', 'au bain-marie']
  },
  {
    id: 'steriliser-sans-sterilisateur',
    title: 'Stériliser',
    label: 'Conserve',
    description: 'Traiter des bocaux fermés à l’eau bouillante, au stérilisateur ou dans un grand faitout.',
    steps: ['Utilise des bocaux propres, des joints neufs et des couvercles en bon état.', 'Installe un torchon au fond du faitout ou du stérilisateur, puis cale les bocaux debout pour qu’ils ne s’entrechoquent pas.', 'Couvre largement d’eau : prévois 3 à 5cm au-dessus des couvercles pendant toute la cuisson.', 'Pour stériliser des bocaux vides, fais bouillir 10min à gros bouillons, puis laisse égoutter sans toucher l’intérieur.', 'Pour des bocaux remplis, fais bouillir pendant la durée de la recette : par exemple 2h30 pour un pâté de viande en conserve.', 'Garde les bocaux immergés jusqu’au refroidissement, sèche-les, puis vérifie que chaque fermeture tient avant stockage.'],
    tip: 'Pour viande, pâtés et bocaux peu acides, ne raccourcis jamais la durée indiquée. Écarte tout bocal mal fermé, fuyant, bombé, trouble ou suspect.',
    query: 'steriliser bocal conserve terrine pate lapin faitout',
    aliases: ['stériliser sans stérilisateur', 'steriliser sans sterilisateur', 'stériliser', 'steriliser', 'stérilisation', 'sterilisation', 'bocaux à conserve']
  },
  {
    id: 'flamber',
    title: 'Flamber',
    label: 'Cuisson',
    description: 'Enflammer brièvement un alcool assez chaud pour concentrer le goût et retirer une partie de l’alcool.',
    steps: ['Éloigne la poêle de la hotte et coupe toute flamme trop proche.', 'Chauffe légèrement l’alcool à part ou verse-le dans une poêle déjà chaude.', 'Allume prudemment avec une longue allumette ou incline très légèrement la poêle si tu cuisines au gaz.', 'Laisse la flamme s’éteindre seule avant de continuer la sauce.'],
    tip: 'Un alcool froid flambe mal. Ne verse jamais directement depuis la bouteille et ne flambe jamais sous une hotte allumée.',
    query: 'cognac armagnac flamber',
    aliases: ['flamber', 'flambé', 'flambée']
  },
  {
    id: 'saisir',
    title: 'Saisir',
    label: 'Cuisson',
    description: 'Colorer rapidement un aliment au contact d’une poêle, casserole ou plancha bien chaude pour créer une croûte avant de poursuivre la cuisson.',
    steps: ['Éponge l’aliment pour retirer l’humidité de surface.', 'Chauffe la poêle avec un peu de matière grasse.', 'Dépose les morceaux sans les serrer.', 'Laisse colorer avant de retourner.', 'Baisse le feu ou continue selon la recette.'],
    tip: 'Si l’aliment rend beaucoup d’eau ou ne colore pas, la poêle est trop froide ou trop remplie.',
    query: 'poêle viande poulet légumes plancha',
    aliases: ['saisir', 'saisi', 'saisie', 'saisir la viande', 'saisir le poulet', 'saisir les légumes', 'faire dorer', 'dorer les morceaux']
  },
  {
    id: 'mariner',
    title: 'Mariner',
    label: 'Préparation',
    description: 'Laisser un aliment au contact d’un assaisonnement pour parfumer, attendrir ou protéger.',
    steps: ['Mélange la marinade avant d’ajouter l’aliment.', 'Enrobe toute la surface.', 'Couvre et place au frais.', 'Égoutte ou essuie si la cuisson doit saisir.'],
    tip: 'Une marinade acide trop longue peut cuire ou durcir certains aliments.',
    query: 'mariner mozzarella calamars',
    aliases: ['mariner', 'marinade', 'mariné', 'marinée']
  },
  {
    id: 'raper',
    title: 'Râper',
    label: 'Préparation',
    description: 'Réduire un ingrédient en fins copeaux ou filaments pour mieux répartir son goût ou sa texture.',
    steps: ['Choisis une râpe adaptée.', 'Garde les doigts loin de la surface.', 'Râpe au dernier moment si l’ingrédient oxyde.', 'Presse si la recette demande de retirer l’eau.'],
    tip: 'Les pommes de terre râpées doivent souvent être pressées très fort pour croustiller.',
    query: 'râper pomme de terre ail gingembre',
    aliases: ['râper', 'raper', 'râpé', 'râpée', 'râper gros']
  },
  {
    id: 'enrober',
    title: 'Enrober',
    label: 'Mélange',
    description: 'Couvrir régulièrement un aliment avec une pâte, une huile, une sauce ou un assaisonnement.',
    steps: ['Verse l’assaisonnement dans un grand bol.', 'Ajoute l’aliment en plusieurs fois si besoin.', 'Mélange par retournements doux.', 'Vérifie que toutes les faces sont couvertes.'],
    tip: 'Un enrobage régulier donne une cuisson et un assaisonnement plus homogènes.',
    query: 'enrober huile tempura assaisonnement',
    aliases: ['enrober', 'enrobé', 'enrobée', 'pour les enrober']
  },
  {
    id: 'lisser',
    title: 'Lisser',
    label: 'Finition',
    description: 'Uniformiser une crème, une pâte, une sauce ou une surface pour obtenir une texture nette et régulière.',
    steps: ['Travaille avec une spatule, un fouet ou une palette adaptée.', 'Écrase les petits amas si besoin.', 'Racle les bords du récipient.', 'Arrête dès que la surface ou la texture est régulière.'],
    tip: 'Lisser ne veut pas dire trop mélanger : dès que c’est homogène, on s’arrête.',
    query: 'lisser creme surface glacage',
    aliases: ['lisser', 'lissé', 'lissée', 'lisser légèrement', 'lisser la surface']
  },
  {
    id: 'napper',
    title: 'Napper',
    label: 'Sauce',
    description: 'Couvrir une préparation avec une sauce assez liée pour tenir en fine couche.',
    steps: ['Vérifie que la sauce est assez liée.', 'Verse ou cuillère depuis le centre.', 'Couvre sans noyer la garniture.', 'Sers rapidement si la sauce est chaude.'],
    tip: 'Une sauce qui nappe le dos d’une cuillère laisse une trace nette au doigt.',
    query: 'napper sauce',
    aliases: ['napper', 'nappant', 'nappante', 'doit napper']
  },
  {
    id: 'mijoter',
    title: 'Mijoter / frémir',
    label: 'Cuisson douce',
    description: 'Cuire doucement avec de petites bulles pour développer le goût sans brutaliser la préparation.',
    steps: ['Porte d’abord proche de l’ébullition si nécessaire.', 'Baisse jusqu’à petites bulles régulières.', 'Couvre partiellement selon la réduction voulue.', 'Remue de temps en temps.'],
    tip: 'Un vrai frémissement est plus doux qu’une ébullition à gros bouillons.',
    query: 'mijoter frémir sauce bouillon',
    aliases: ['mijoter', 'frémir', 'fremir', 'frémissement', 'à frémissement']
  }
];
const EXTENDED_TECHNIQUE_GUIDES = Array.isArray(window.COOK_NOTE_EXTRA_TECHNIQUE_GUIDES) ? window.COOK_NOTE_EXTRA_TECHNIQUE_GUIDES : [];
const TECHNIQUE_GUIDES = [...BASE_TECHNIQUE_GUIDES, ...EXTENDED_TECHNIQUE_GUIDES];
const SORTED_TECHNIQUE_GUIDES = [...TECHNIQUE_GUIDES].sort((a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }));
const FAVORITE_COLLECTIONS = [
  { id: '', label: 'Tout' },
  { id: 'famille', label: 'Repas famille', match: recipe => /\b(plat|plats|accompagnements|famil|gratin|burger|poulet|porc|boeuf|bœuf)\b/.test(normalizeText([recipe.title, ...(recipe.categories || []), ...(recipe.tags || [])].join(' '))) },
  { id: 'desserts', label: 'Desserts', match: recipe => recipeHasCategory(recipe, 'Desserts') },
  { id: 'sauces', label: 'Sauces', match: recipe => recipeHasCategory(recipe, 'Sauces') }
];
const SHOPPING_AISLES = [
  { label: 'Primeur', pattern: /\b(tomate|tomates|citron|citrons|zeste|jus de citron|pomme|pommes|poire|poires|oignon|oignons|ail|echalote|échalote|persil|basilic|menthe|ciboulette|pomme de terre|pommes de terre|patate douce|avocat|epinard|épinard|carotte|courgette|chou|chou-fleur|brocoli|butternut|courge|fenouil|poireau|melon|fraise|framboise|abricot|cerise|cranberry|canneberge)\b/ },
  { label: 'Crèmerie et œufs', pattern: /\b(lait|creme|crème|beurre|fromage|parmesan|comte|comté|cheddar|mozzarella|mascarpone|ricotta|yaourt|babeurre|oeuf|oeufs|œuf|œufs|jaune|jaunes|blanc|blancs)\b/ },
  { label: 'Boucherie', pattern: /\b(porc|poulet|volaille|boeuf|bœuf|agneau|magret|canard|lardon|lardons|poitrine|bacon|jambon|saucisse)\b/ },
  { label: 'Poissonnerie', pattern: /\b(crevette|crevettes|calamar|calamars|poisson|moule|moules|saumon|cabillaud|thon|chipiron|chipirons)\b/ },
  { label: 'Boulangerie', pattern: /\b(pain|pains|bun|buns|brioche|brioches|tortilla|tortillas)\b/ },
  { label: 'Épicerie salée', pattern: /\b(sel|poivre|huile|vinaigre|moutarde|chapelure|panko|riz|pâtes|pates|épice|epice|paprika|curry|miel|conserve|pois|lentille|lentilles)\b/ },
  { label: 'Épicerie sucrée', pattern: /\b(farine|sucre|cassonade|vergeoise|chocolat|cacao|fécule|fecule|maizena|maïzena|levure|sirop|vanille|praliné|noisette|noisettes|noix|amande|amandes|pistache|pistaches)\b/ }
];
const STORAGE_KEYS = {
  favorites: 'cook_note_favorites',
  shopping: 'cook_note_shopping_basket',
  shoppingFactors: 'cook_note_shopping_factors',
  shoppingChecked: 'cook_note_shopping_checked',
  shoppingOwned: 'cook_note_shopping_owned',
  menuHistory: 'cook_note_menu_history',
  preferences: 'cook_note_preferences',
  recentRecipes: 'cook_note_recent_recipes',
  recentSearches: 'cook_note_recent_searches',
  pantry: 'cook_note_pantry_items',
  equipmentProfile: 'cook_note_equipment_profile',
  recipeHistory: 'cook_note_recipe_history',
  recipeOverrides: 'cook_note_recipe_overrides',
  homeScroll: 'cook_note_home_scroll',
  scrollPositions: 'cook_note_session_scroll_positions',
  legacyFavorites: ['mc_food_favorites', 'cuisine_favs']
};

const LOCAL_DATA_EXPORT_KEYS = Object.freeze([
  STORAGE_KEYS.favorites,
  STORAGE_KEYS.shopping,
  STORAGE_KEYS.shoppingFactors,
  STORAGE_KEYS.shoppingChecked,
  STORAGE_KEYS.shoppingOwned,
  STORAGE_KEYS.menuHistory,
  STORAGE_KEYS.preferences,
  STORAGE_KEYS.recentRecipes,
  STORAGE_KEYS.recentSearches,
  STORAGE_KEYS.pantry,
  STORAGE_KEYS.equipmentProfile,
  STORAGE_KEYS.recipeHistory,
  STORAGE_KEYS.recipeOverrides
]);
const LOCAL_DATA_EXPORT_SCHEMA = 'cook-note-local-data';
const LOCAL_DATA_EXPORT_VERSION = 2;

const {
  pantryIndex,
  pantryHasIngredientName,
  getSmartSubstitutionNotes,
  getVariantAdaptationNotes,
  getRecipeFlavorMap,
  getRecipeFlavorPairingNotes,
  getRecipeIngredientCards,
  getIngredientGuideNotes,
  getRecipePlatingNotes,
  semanticRecipeSignals,
  recipeMatchesSearchConstraints,
  semanticRecipeSearchScore,
  searchSuggestionTerms,
  filterFreshShoppingData,
  shoppingListTextFromData,
  downloadSharePosterCard,
  trapModalFocus,
  ModalDialog,
  cacheUrlsForOffline
} = window.CookNotePremium;
const {
  captureRecipeVersion,
  normalizeEquipmentProfile,
  RecipeHistoryBlock,
  EquipmentProfileBlock,
  MoldCalculatorBlock,
  ByproductBlock,
  PersonalToolsPanel
} = window.CookNotePersonalTools || {};
const { RecipeSafetySources } = window.CookNoteSafetySources || {};

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

function localDataSnapshot() {
  const data = {};
  LOCAL_DATA_EXPORT_KEYS.forEach(key => {
    const raw = localStorage.getItem(key);
    if (raw !== null) data[key] = readJson(key, null);
  });
  return {
    schema: LOCAL_DATA_EXPORT_SCHEMA,
    version: LOCAL_DATA_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data
  };
}

function downloadLocalDataBackup() {
  const payload = JSON.stringify(localDataSnapshot(), null, 2);
  const blob = new Blob([payload], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `cook-note-sauvegarde-${date}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function restoreLocalDataBackup(rawPayload) {
  const parsed = typeof rawPayload === 'string' ? JSON.parse(rawPayload) : rawPayload;
  if (!parsed || parsed.schema !== LOCAL_DATA_EXPORT_SCHEMA || ![1, LOCAL_DATA_EXPORT_VERSION].includes(parsed.version) || !parsed.data || typeof parsed.data !== 'object') {
    throw new Error('Format de sauvegarde Cook Note non reconnu.');
  }
  const allowed = new Set(LOCAL_DATA_EXPORT_KEYS);
  const entries = Object.entries(parsed.data).filter(([key]) => allowed.has(key));
  if (!entries.length) throw new Error('La sauvegarde ne contient aucune donnée Cook Note.');
  const serialized = JSON.stringify(parsed.data);
  if (serialized.length > 2500000) throw new Error('La sauvegarde est trop volumineuse.');
  entries.forEach(([key, value]) => writeJson(key, value));
  return entries.length;
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

function currentScrollRouteKey() {
  return `${window.location.pathname}${window.location.search}${window.location.hash || ''}`;
}

function readSessionScrollPositions() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.scrollPositions);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCurrentScrollPosition(routeKey = currentScrollRouteKey()) {
  try {
    const positions = readSessionScrollPositions();
    positions[routeKey] = Math.max(0, Math.round(window.scrollY || document.documentElement.scrollTop || 0));
    sessionStorage.setItem(STORAGE_KEYS.scrollPositions, JSON.stringify(positions));
  } catch {
    /* ignore session storage restrictions */
  }
}

function readScrollPositionForCurrentRoute() {
  const value = Number(readSessionScrollPositions()[currentScrollRouteKey()]);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function scrollElementToViewportCenter(element, behavior = 'smooth') {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const viewportOffset = window.visualViewport?.offsetTop || 0;
  const top = Math.max(0, window.scrollY + rect.top + (rect.height / 2) - (viewportHeight / 2) - viewportOffset);
  window.scrollTo({ top, behavior });
}

function runViewTransition(update) {
  if (typeof update !== 'function') return;
  const commit = () => {
    if (typeof ReactDOM !== 'undefined' && typeof ReactDOM.flushSync === 'function') {
      return ReactDOM.flushSync(update);
    }
    return update();
  };
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || document.querySelector('.display-reduce-motion');
  if (typeof document.startViewTransition !== 'function' || reduceMotion) {
    commit();
    return;
  }
  try {
    const transition = document.startViewTransition(commit);
    transition?.finished?.catch(() => {});
  } catch {
    commit();
  }
}

const WINDOWS_1252_BYTE_BY_CODEPOINT = {
  0x20AC: 0x80,
  0x201A: 0x82,
  0x0192: 0x83,
  0x201E: 0x84,
  0x2026: 0x85,
  0x2020: 0x86,
  0x2021: 0x87,
  0x02C6: 0x88,
  0x2030: 0x89,
  0x0160: 0x8A,
  0x2039: 0x8B,
  0x0152: 0x8C,
  0x017D: 0x8E,
  0x2018: 0x91,
  0x2019: 0x92,
  0x201C: 0x93,
  0x201D: 0x94,
  0x2022: 0x95,
  0x2013: 0x96,
  0x2014: 0x97,
  0x02DC: 0x98,
  0x2122: 0x99,
  0x0161: 0x9A,
  0x203A: 0x9B,
  0x0153: 0x9C,
  0x017E: 0x9E,
  0x0178: 0x9F
};

function mojibakeScore(value) {
  const text = String(value || '');
  return (text.match(/[ÃÂÅ\uFFFD]/g) || []).length + (text.match(/â[\u20ac\u2122\u0153\u20ac\u201c\u201d\u00a0-\u00bf]/g) || []).length;
}

function repairMojibakeText(value) {
  const text = String(value || '');
  if (!/[ÃÂâÅ]/.test(text) || typeof TextDecoder === 'undefined') return text;
  try {
    const bytes = Uint8Array.from(Array.from(text, char => {
      const code = char.codePointAt(0);
      return WINDOWS_1252_BYTE_BY_CODEPOINT[code] ?? (code <= 255 ? code : 63);
    }));
    const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    return mojibakeScore(decoded) < mojibakeScore(text) ? decoded : text;
  } catch {
    return text;
  }
}

function normalizeLoadedRecipeValue(value) {
  if (typeof value === 'string') return repairMojibakeText(value);
  if (Array.isArray(value)) return value.map(normalizeLoadedRecipeValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeLoadedRecipeValue(item)]));
}

const REPAIRABLE_REACT_PROPS = new Set(['aria-label', 'title', 'placeholder', 'alt']);

function repairReactProps(props) {
  if (!props || typeof props !== 'object') return props;
  let repaired = props;
  REPAIRABLE_REACT_PROPS.forEach(name => {
    if (typeof props[name] !== 'string') return;
    const text = repairMojibakeText(props[name]);
    if (text === props[name]) return;
    if (repaired === props) repaired = { ...props };
    repaired[name] = text;
  });
  return repaired;
}

function repairReactChildText(child) {
  if (typeof child === 'string') return repairMojibakeText(child);
  if (Array.isArray(child)) return child.map(repairReactChildText);
  return child;
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[œŒ]/g, 'oe')
    .replace(/[æÆ]/g, 'ae')
    .toLowerCase();
}

function uniq(values) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'fr'));
}

function uniqInOrder(values) {
  const seen = new Set();
  return values.filter(value => {
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}


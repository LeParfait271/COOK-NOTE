const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');

// Modules runtime de l'application, dans l'ordre de chargement. Ce sont des
// scripts classiques : ils partagent la portee globale, donc l'ordre compte
// (app.js d'abord, app-main.js en dernier car il monte React).
// Source unique utilisee par index.html (via validation), le build, le service
// worker et les validateurs.
const APP_MODULES = Object.freeze([
  'app.js',
  'app-english.js',
  'app-journal.js',
  'app-recipe-model.js',
  'app-shopping.js',
  'app-menu.js',
  'app-search.js',
  'app-recipe-content.js',
  'app-components.js',
  'app-voice.js',
  'app-voice-en.js',
  'app-sky.js',
  'app-kitchen.js',
  'app-seasons.js',
  'app-nutrition.js',
  'app-anticipate.js',
  'app-week.js',
  'app-chef.js',
  'app-profile.js',
  'app-wine.js',
  'app-panels.js',
  'app-basket.js',
  'app-recipe-view.js',
  'app-main.js'
]);

// Concatenation du code applicatif, pour les validateurs qui inspectent le
// texte ou executent l'application dans une VM.
function readAppSource(root = ROOT) {
  return APP_MODULES.map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('');
}

// Feuilles de style du site, assemblees dans cet ordre pour former /style.css
// (server.js en local, build-site.js pour dist/).
// Deux couches CSS (@layer) : `legacy` regroupe l'historique (01 a 07, ordre =
// cascade, ne pas reordonner) et les petites feuilles annexes ; `design` porte la
// direction artistique actuelle et l'emporte sur `legacy` sans !important ni
// course a la specificite.
const STYLE_LAYERS = Object.freeze(['legacy', 'design']);
// Feuille principale (/style.css) : ce que toutes les pages affichent.
const MAIN_STYLE_MODULES = Object.freeze([
  'styles/01-socle.css',
  'styles/02-accueil.css',
  'styles/03-cartes-et-fiche.css',
  'styles/04-panneaux.css',
  'styles/05-raffinements.css',
  'styles/06-finitions-et-themes.css',
  'styles/07-responsive.css',
  'styles/10-design.css',
  'styles/11-design-fiche.css',
  'styles/12-design-effets.css',
  'styles/13-design-finitions.css',
  'styles/15-partage.css',
  'styles/16-chef.css',
  'styles/17-collections.css',
  'styles/19-semaine.css'
]);
// Fenetres (/panels.css) : chargees a la premiere ouverture d'une fenetre ou
// pendant un temps mort de l'accueil ; la feuille principale ne grossit plus
// a chaque nouvelle fenetre.
const PANEL_STYLE_MODULES = Object.freeze([
  'styles/14-constellation.css',
  'styles/18-saisons.css',
  'styles/20-fenetres.css'
]);
// Tous les modules (validateurs, budgets, controles de texte).
const STYLE_MODULES = Object.freeze([...MAIN_STYLE_MODULES, ...PANEL_STYLE_MODULES]);

const styleLayerOf = file => (/^styles\/0\d-/.test(file) ? 'legacy' : 'design');

// Texte brut des modules (pour les validateurs qui inspectent le CSS).
function readStyleSource(root = ROOT) {
  return STYLE_MODULES.map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('');
}

// Feuille publique : chaque module dans sa couche, ordre des couches declare en tete.
function buildStyleSheet(root = ROOT, modules = MAIN_STYLE_MODULES) {
  const blocks = STYLE_LAYERS.map(layer => {
    const text = modules.filter(file => styleLayerOf(file) === layer)
      .map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('');
    return text ? `@layer ${layer} {\n${text}\n}\n` : '';
  });
  return `@layer ${STYLE_LAYERS.join(', ')};\n${blocks.join('')}`;
}

// Feuille des fenetres, memes couches que la principale.
const buildPanelStyleSheet = (root = ROOT) => buildStyleSheet(root, PANEL_STYLE_MODULES);

module.exports = { APP_MODULES, readAppSource, STYLE_LAYERS, STYLE_MODULES, MAIN_STYLE_MODULES, PANEL_STYLE_MODULES, readStyleSource, buildStyleSheet, buildPanelStyleSheet };

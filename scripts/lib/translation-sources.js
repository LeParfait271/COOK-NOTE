// Textes a traduire en anglais : tout ce que le site AFFICHE, jamais ce qui
// sert au fonctionnement (ids, categories, saisons, tags et alias de
// recherche, champs analyses par le code). Partage par translate-en.js et
// validate-translations.js ; l'empreinte est la meme que dans le navigateur
// (cookNoteTextHash, app.js).
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Champs affiches des recettes (nom de la cle feuille).
const RECIPE_TEXT_KEYS = new Set(['title', 'yield', 'items', 'steps', 'notes', 'group', 'note', 'label', 'value', 'equipment', 'storage', 'mistakes', 'result', 'reheating', 'weights', 'role']);
const RECIPE_SKIP_KEYS = new Set(['tags', 'aliases', 'seasons', 'categories', 'allergens', 'id', 'image', 'master', 'additionalMasters', 'recipeId', 'masterType', 'difficulty', 'nutriScore', 'recipeVersion']);
const TECHNIQUE_TEXT_KEYS = new Set(['title', 'label', 'description', 'steps', 'tip']);
const ATLAS_TEXT_KEYS = ['name', 'portrait', 'saveur', 'origine', 'saison', 'choix', 'conservation', 'astuce', 'accords', 'nutrition'];

// cyrb53 : empreinte 53 bits, ecrite en base 36.
function textHash(text, seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

const worthTranslating = text => typeof text === 'string' && /[a-zà-ÿ]{2,}/i.test(text) && !/^(\/|https?:)/.test(text);

function walkTexts(value, keep, skip, add, key = '') {
  if (Array.isArray(value)) value.forEach(item => walkTexts(item, keep, skip, add, key));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([child, item]) => { if (!skip.has(child)) walkTexts(item, keep, skip, add, child); });
  else if (keep.has(key) && worthTranslating(value)) add(value, key);
}

function loadScripts(root, files, context = { window: {} }) {
  context.window.window = context.window;
  vm.createContext(context);
  files.forEach(file => vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file }));
  return context;
}

// Quantite et unite en tete d'une ligne d'ingredient (« 800g », « 2 c. à soupe de »).
const INGREDIENT_QUANTITY = /^\s*(?:\d+(?:[.,/]\d+)?(?:\s*(?:à|-)\s*\d+(?:[.,]\d+)?)?|½|¼|¾|une?|quelques)\s*(?:(?:kg|g|mg|ml|cl|dl|l|c\.?\s*à\s*(?:soupe|café)|cuill(?:ères?|eres?)\s*à\s*(?:soupe|café)|pincées?|tranches?|boîtes?|sachets?|gousses?|brins?|bottes?|feuilles?|morceaux?|pots?|verres?|tasses?|filets?|branches?|bouquets?|poignées?|traits?|plaquettes?|tiges?|têtes?|bâtons?|boules?)\b\.?\s*)?(?:de\s+|d['’]\s*)?/i;

// Une chaine du code ressemble-t-elle a une phrase francaise affichee ?
const FRENCH_WORDS = /\b(le|la|les|un|une|des|du|de|et|ou|pour|avec|sans|sur|dans|au|aux|en|par|plus|pas|ne|est|sont|votre|ton|ta|tes|vos|ce|cette|ces|il|elle|on|tout|toutes|tous|fiche|fiches|recette|recettes|étape|étapes|ingrédient|ingrédients|personnes?|minutes?|jours?|heure|heures)\b/i;
function looksFrench(text) {
  const value = text.trim();
  if (value.length < 2 || !/[a-zà-ÿ]/i.test(value)) return false;
  if (/^(https?:|\/|#|\.|data:|[a-z]+:\/\/)/.test(value) || /[{}<>=]|=>|\(\)|\$\w|\\n/.test(value.replace(/\{#\}/g, 'X'))) return false;
  // « ; » francais (entoure d'espaces) accepte, pas celui du CSS ou du code.
  if (/;/.test(value.replace(/ ; /g, ''))) return false;
  // Traces SVG, CSS, expressions regulieres, directives.
  if (/^[MmLlHhVvCcSsQqTtAaZz0-9 .,-]+$/.test(value) || /url\(|translate\(|scale\(|rgba?\(|var\(--|\(\?|\\[sdbw]|^use strict$/.test(value)) return false;
  // Identifiants, classes, cles techniques (minuscules et tirets, sans espace ni accent).
  if (/^[a-z0-9_.:\/\[\]-]+$/.test(value) && !/[à-ÿ]/.test(value) && !FRENCH_WORDS.test(value)) return false;
  if (/^[a-z][a-z0-9-]*( [a-z][a-z0-9-]*)+$/.test(value) && /-/.test(value) && !/[à-ÿ]/.test(value)) return false;
  if (/^(?:[a-z-]+\s)*(?:is|has)-[a-z-]+/.test(value)) return false;
  return /[à-ÿœ]/i.test(value) || FRENCH_WORDS.test(value) || /^[A-ZÀ-Ý][a-zà-ÿ]+[….!?:]*$/.test(value) || /\s/.test(value);
}

// Gabarit `...${x}...` -> variantes « ...{#}... » (pluriels developpes).
function templateVariants(body) {
  let variants = [''];
  const parts = body.split(/(\$\{(?:[^{}]|\{[^{}]*\})*\})/);
  for (const part of parts) {
    if (!part.startsWith('${')) {
      variants = variants.map(v => v + part);
      continue;
    }
    const choice = part.match(/\?\s*'([^'$]{0,12})'\s*:\s*'([^'$]{0,12})'\s*\}$/);
    const both = choice && /[a-zà-ÿ]|^$/.test(choice[1] + choice[2]) && !/\d/.test(choice[1] + choice[2]) ? [choice[1], choice[2]] : null;
    variants = both ? variants.flatMap(v => both.map(option => v + option)) : variants.map(v => `${v}{#}`);
    if (variants.length > 8) return [];
  }
  return variants.map(v => v.replace(/\s+/g, ' ').trim()).filter(v => v.replace(/\{#\}/g, '').trim().length > 1);
}

// Echappements JS (\u00e9, \u2019) rendus en caracteres, comme a l'affichage.
const unescapeJs = text => text.replace(/\\u([0-9a-fA-F]{4})/g, (whole, hex) => String.fromCharCode(parseInt(hex, 16)));

function uiLiterals(source) {
  const found = new Set();
  // Commentaires retires (sans toucher aux chaines).
  const code = unescapeJs(source.replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1'));
  for (const match of code.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)) {
    const quoted = match[1] !== undefined ? match[1] : match[2];
    if (quoted !== undefined) {
      const text = quoted.replace(/\\'/g, '\'').replace(/\\"/g, '"').replace(/\\u00a0/g, ' ');
      if (looksFrench(text)) found.add(text.trim());
      // Titre ou puce de texte (« ## Ingrédients regroupés ») : affiche sans marque.
      const bare = text.replace(/^\s*(?:#{1,3}|[-•])\s+/, '').trim();
      if (bare !== text.trim() && looksFrench(bare)) found.add(bare);
    } else if (!match[3].includes('\n')) {
      // Un gabarit garde ses chiffres ecrits en dur comme des nombres (« /10 »).
      templateVariants(match[3]).forEach(text => {
        if (looksFrench(text)) found.add(/\{#\}/.test(text) ? text.replace(/\d+(?:[.,]\d+)?/g, '{#}') : text);
      });
    }
  }
  // tc('...') ecrits a l'interieur d'un gabarit (non vus par la boucle ci-dessus).
  for (const match of code.matchAll(/\btc\(\s*'((?:[^'\\\n]|\\.)*)'\s*\)/g)) found.add(match[1].replace(/\\'/g, '\'').trim());
  // Textes colles avec « + » : 'Marquer ' + nom + ' comme déjà à la maison'.
  for (const match of code.matchAll(/'([^'\\\n]*)'\s*\+\s*[\w.$?()[\]]+\s*\+\s*'([^'\\\n]*)'/g)) {
    const text = `${match[1]}{#}${match[2]}`.replace(/\s+/g, ' ').trim();
    if (looksFrench(text)) found.add(text);
  }
  for (const match of code.matchAll(/'([^'\\\n]{3,})'\s*\+\s*[\w.$()[\]]+\s*[),]/g)) {
    const text = `${match[1]}{#}`.replace(/\s+/g, ' ').trim();
    if (looksFrench(text)) found.add(text);
  }
  return found;
}

function collectEnglishSources(root) {
  const seen = new Map();
  const add = (text, origin) => {
    const clean = text.trim();
    if (!clean) return;
    const hash = textHash(clean);
    if (!seen.has(hash)) seen.set(hash, { hash, text: clean, origin });
  };
  // Recettes.
  const recipes = loadScripts(root, ['recipes.js']).window.RECIPES || {};
  Object.values(recipes).forEach(recipe => walkTexts(recipe, RECIPE_TEXT_KEYS, RECIPE_SKIP_KEYS, (text, key) => {
    add(text, 'recette');
    // Nom seul (liste de courses) : ligne sans quantite, unite ni parenthese.
    if (key !== 'items') return;
    const name = text.replace(/<[^>]+>/g, '').replace(INGREDIENT_QUANTITY, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
    if (!name || name === text.trim() || !/[a-zà-ÿ]{3}/i.test(name)) return;
    add(name, 'recette');
    add(name.charAt(0).toUpperCase() + name.slice(1), 'recette');
  }));
  // Atlas des ingredients.
  const atlasContext = loadScripts(root, ['assets/ingredients/atlas-core.js']);
  atlasContext.cookNoteAtlas = atlasContext.window.cookNoteAtlas;
  atlasContext.window.cookNoteAtlas.FILES.forEach(file => vm.runInContext(fs.readFileSync(path.join(root, 'assets/ingredients', file), 'utf8'), atlasContext));
  atlasContext.window.cookNoteAtlas.FAMILIES.forEach(family => add(family.label, 'atlas'));
  atlasContext.window.cookNoteAtlas.entries.forEach(entry => ATLAS_TEXT_KEYS.forEach(key => { if (worthTranslating(entry[key])) add(entry[key], 'atlas'); }));
  // Techniques (tableaux litteraux de app.js et app-techniques.js).
  ['app.js', 'app-techniques.js'].forEach(file => {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    const pattern = /\b(title|label|description|tip):\s*'((?:[^'\\]|\\.)*)'/g;
    for (const block of source.match(/(?:BASE|EXTENDED)_TECHNIQUE_GUIDES\s*=\s*\[[\s\S]*?\n\];/g) || []) {
      let match;
      while ((match = pattern.exec(block))) if (TECHNIQUE_TEXT_KEYS.has(match[1])) add(match[2].replace(/\\'/g, '\''), 'technique');
      for (const steps of block.match(/steps:\s*\[([^\]]*)\]/g) || []) {
        for (const step of steps.match(/'((?:[^'\\]|\\.)*)'/g) || []) add(step.slice(1, -1).replace(/\\'/g, '\''), 'technique');
      }
    }
  });
  // Interface : toutes les phrases francaises ecrites dans le code (chaines et
  // gabarits). Le traducteur d'affichage (app-english.js) les remplace dans la
  // page ; un gabarit `${n} ingrédients` devient « {#} ingrédients » (les
  // nombres sont repris tels quels), les pluriels « ${n > 1 ? 's' : ''} »
  // donnent leurs deux formes. app-voice.js est exclu : les commandes vocales
  // restent en francais (modele de reconnaissance francais).
  fs.readdirSync(root).filter(file => /^app[\w-]*\.js$/.test(file) && file !== 'app-voice.js').forEach(file => {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    for (const text of uiLiterals(source)) add(text, 'interface');
  });
  // Textes d'interface deja sortis en cles (i18n.js).
  const i18n = loadScripts(root, ['i18n.js']).window.CookNoteI18n;
  Object.values(i18n?.messages || {}).forEach(text => add(text, 'interface'));
  return [...seen.values()];
}

module.exports = { collectEnglishSources, textHash, RECIPE_TEXT_KEYS };

// Atlas des ingredients Cook Note : moteur commun (site + verification).
// Les fiches sont dans assets/ingredients/atlas-*.js (une par famille) ; chacune
// appelle cookNoteAtlas.add([...]). La constellation des saveurs affiche une
// etoile par fiche utilisee dans au moins une recette, et
// scripts/validate-ingredient-atlas.js refuse toute ligne d'ingredient qu'aucune
// fiche ne reconnait : ajouter une recette avec un nouvel ingredient impose
// d'ajouter sa fiche (voir COOK_NOTE_RULES.md, « Atlas des ingredients »).
(function (root) {
  // Familles : couleur de l'etoile et ordre de la legende.
  var FAMILIES = [
    { id: 'legumes', label: 'Légumes', color: '#a9e3a0' },
    { id: 'fruits', label: 'Fruits', color: '#f4b183' },
    { id: 'aromates', label: 'Herbes & aromates', color: '#a9e3d2' },
    { id: 'epices', label: 'Épices', color: '#f2a28f' },
    { id: 'laitages', label: 'Laitages & œufs', color: '#f6ecd2' },
    { id: 'fromages', label: 'Fromages', color: '#f3d58a' },
    { id: 'viandes', label: 'Viandes & volailles', color: '#e8908a' },
    { id: 'mer', label: 'Poissons & mer', color: '#9cc8f0' },
    { id: 'cereales', label: 'Céréales & féculents', color: '#e2c79a' },
    { id: 'douceurs', label: 'Sucres & douceurs', color: '#f3cf86' },
    { id: 'graisses', label: 'Huiles & matières grasses', color: '#e6d36b' },
    { id: 'condiments', label: 'Condiments & sauces', color: '#d6b6f0' },
    { id: 'secs', label: 'Fruits secs & graines', color: '#d9a87a' },
    { id: 'boissons', label: 'Vins, alcools & boissons', color: '#c98bb9' },
    { id: 'preparations', label: 'Préparations de base', color: '#cfc6b8' }
  ];
  // Fichiers de fiches charges par la constellation (verifie par le controle).
  var FILES = ['atlas-legumes.js', 'atlas-fruits.js', 'atlas-aromates.js', 'atlas-epices.js', 'atlas-laitages.js', 'atlas-fromages.js', 'atlas-viandes.js', 'atlas-mer.js', 'atlas-cereales.js', 'atlas-douceurs.js', 'atlas-graisses.js', 'atlas-condiments.js', 'atlas-secs.js', 'atlas-boissons.js', 'atlas-preparations.js', 'nutrition.js'];
  var FIELDS = ['portrait', 'saveur', 'origine', 'saison', 'choix', 'conservation', 'astuce', 'accords', 'nutrition'];
  // Lignes qui ne sont pas des ingredients (consignes, materiel, renvois).
  var IGNORE = [
    /^\s*(—|–|-{2}|→|>)/,
    /^\s*(cuisson|four a|four \d)/,
    /\b(ficelle de cuisine|pics? en bois|papier cuisson|huile en spray)\b/,
    /^\s*(sauce et garnitures|sauce au choix|garnitures?)( selon|$)/,
    /\bpics? a brochette\b/,
    /^\s*\d+ litres? eau\b/,
    /^\s*choisir une\b/,
    /\blegumes au choix\b/
  ];
  var entries = [];
  var byId = {};
  var index = null;
  var cache = new Map();

  function normalize(value) {
    return String(value || '')
      .replace(/<[^>]+>/g, ' ')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/œ/g, 'oe').replace(/æ/g, 'ae')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  // Pluriels simples : « tomates », « choux » -> « tomate », « chou ».
  function stem(word) {
    if (word.length > 3 && /[sx]$/.test(word)) return word.slice(0, -1);
    return word;
  }

  function words(value) {
    return normalize(value).split(' ').filter(Boolean).map(stem);
  }

  // Valeurs nutritionnelles pour 100 g (nutrition.js) : [kcal, proteines,
  // glucides, lipides, poids d'une piece].
  var nutritionTable = {};
  function nutrition(table) {
    Object.keys(table).forEach(function (id) { nutritionTable[id] = table[id]; });
  }

  function add(list) {
    list.forEach(function (entry) {
      if (byId[entry.id]) throw new Error('Atlas : fiche en double ' + entry.id);
      byId[entry.id] = entry;
      entries.push(entry);
    });
    index = null;
  }

  // Index par premier mot : une ligne ne compare que les termes qui peuvent
  // commencer a chaque position (au lieu de tous les synonymes de l'atlas).
  function buildIndex() {
    var byFirst = new Map();
    entries.forEach(function (entry) {
      // Le nom compte aussi morceau par morceau : « Gelatine et pectine » -> gelatine, pectine.
      var parts = String(entry.name).split(/\s+et\s+|,|&/);
      [entry.name].concat(parts.length > 1 ? parts : [], entry.aliases || []).forEach(function (alias) {
        var tokens = words(alias);
        if (!tokens.length) return;
        if (!byFirst.has(tokens[0])) byFirst.set(tokens[0], []);
        byFirst.get(tokens[0]).push({ id: entry.id, parts: tokens });
      });
    });
    // Les termes les plus longs d'abord : « creme patissiere » avant « creme ».
    byFirst.forEach(function (list) { list.sort(function (a, b) { return b.parts.length - a.parts.length; }); });
    index = byFirst;
    cache = new Map();
  }

  function ignored(line) {
    var text = normalize(line);
    if (!/[a-z]/.test(text)) return true;
    var raw = String(line || '').trim();
    return IGNORE.some(function (pattern) { return pattern.test(raw) || pattern.test(text); });
  }

  // Ingredients reconnus dans une ligne (« 650g brocoli ou chou-fleur » -> deux).
  // Le terme le plus long gagne a chaque position ; resultat garde en memoire.
  function match(line) {
    if (!index) buildIndex();
    var key = String(line || '');
    if (cache.has(key)) return cache.get(key);
    var tokens = words(key);
    var found = [];
    var start = 0;
    while (start < tokens.length) {
      var candidates = index.get(tokens[start]);
      var hit = null;
      for (var c = 0; candidates && c < candidates.length && !hit; c += 1) {
        var term = candidates[c];
        if (start + term.parts.length > tokens.length) continue;
        var ok = true;
        for (var k = 1; k < term.parts.length; k += 1) {
          if (tokens[start + k] !== term.parts[k]) { ok = false; break; }
        }
        if (ok) hit = term;
      }
      if (hit) {
        if (found.indexOf(hit.id) === -1) found.push(hit.id);
        start += hit.parts.length;
      } else {
        start += 1;
      }
    }
    cache.set(key, found);
    return found;
  }
  root.cookNoteAtlas = {
    FAMILIES: FAMILIES,
    FILES: FILES,
    nutrition: nutrition,
    nutritionOf: function (id) { return nutritionTable[id] || null; },
    nutritionTable: nutritionTable,
    FIELDS: FIELDS,
    entries: entries,
    byId: byId,
    add: add,
    match: match,
    ignored: ignored,
    normalize: normalize
  };
})(typeof window !== 'undefined' ? window : globalThis);

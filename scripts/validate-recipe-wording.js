// Bloque les fautes de redaction qui ont deja echappe a une relecture :
// chronologie (« la veille » en cours de fiche, « le lendemain » sans repos),
// four utilise avant d'etre prechauffe, intitules colles sans « : », elisions
// sans apostrophe, etape qui commence par une minuscule, « 10min avant. » sans
// complement, conseil « meilleur la veille » dans les etapes ou en double.
// Usage : node scripts/validate-recipe-wording.js [fichier recettes]
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.resolve(ROOT, process.argv[2] || 'recipes.js');

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(FILE, 'utf8'), context, { filename: FILE });
const recipes = context.window.RECIPES || {};

const strip = value => String(value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

// Options affichees : fiche simple, ou chaque variante qui porte ses etapes.
function displayedOptions(id, recipe) {
  if (Array.isArray(recipe.variants) && recipe.variants.length) return [];
  const groups = (recipe.ingredients || []).filter(group => Array.isArray(group.steps) && group.steps.length);
  if (groups.length) {
    return groups.map(group => ({
      label: `${id} / ${group.group}`,
      steps: (group.useRecipeSteps ? [...(recipe.steps || []), ...group.steps] : group.steps).map(strip),
      notes: (group.recipe?.notes || recipe.notes || []).map(strip)
    }));
  }
  return [{ label: id, steps: (recipe.steps || []).map(strip), notes: (recipe.notes || []).map(strip) }];
}

// Une phrase qui commence par « La veille » n'a sa place qu'a la premiere etape.
const LATE_EVE = /(?:^|[.!?]\s+)la veille\b/i;
// « La veille prélever… » : sans virgule, on ne sait plus ce qui se fait la veille.
const BARE_TIME_VERB = /\b(?:la veille|le lendemain)\s+\p{Ll}+(?:er|ir|re)\b/iu;
const OVERNIGHT = /la veille|nuit|\b1[0-9]\s*(?:à|-|–)?\s*\d*\s*h\b|12h|24h|48h/i;
const BETTER_AHEAD = /encore meilleur/i;
const MAKE_AHEAD_NOTE = /meilleur.*(?:lendemain|veille|r[ée]chauff)|nuit au frais|la veille/i;
// Intitule de sous-recette ou de methode suivi directement d'un verbe.
const LABEL_WORDS = /^(?:pâte|crème|compotée|montage|meringue|méthode|option|règle|finition|garniture|sauce|dressage|biscuit|insert|glaçage|sirop|appareil|ganache|caramel|décor|base|farce|marinade|cuisson|service)$/i;
const INFINITIVE = /^[a-zàâçéèêëîïôûùüÿœ'’-]+(?:er|ir|re|oir)$/i;
const PREHEAT = /préchauffer/i;
const OVEN_USE = /\benfourner\b|\bau four\b|\b\d{2,3}\s*°C\b/i;
const NOT_OVEN = /huile|friture|frire|sirop|à cœur|thermom|lait|tiédir|eau|caramel|beurre/i;
const VAGUE_BEFORE = /\d+\s*(?:min|h)\s+avant\s*[.,;]/i;

const errors = [];
let checkedOptions = 0;
Object.entries(recipes).forEach(([id, recipe]) => {
  displayedOptions(id, recipe).forEach(({ label, steps, notes }) => {
    checkedOptions += 1;
    steps.forEach((step, index) => {
      const where = `${label} [etape ${index + 1}]`;
      const excerpt = step.slice(0, 90);
      if (index > 0 && LATE_EVE.test(step)) errors.push(`${where} « la veille » apres le debut de la fiche : « ${excerpt} »`);
      if (/le lendemain/i.test(step) && !steps.slice(0, index).some(previous => OVERNIGHT.test(previous))) errors.push(`${where} « le lendemain » sans repos de la veille : « ${excerpt} »`);
      if (BARE_TIME_VERB.test(step)) errors.push(`${where} « la veille / le lendemain » sans virgule avant le verbe : « ${excerpt} »`);
      if (BETTER_AHEAD.test(step)) errors.push(`${where} conseil « encore meilleur » a mettre dans les notes : « ${excerpt} »`);
      if (/^\p{Ll}/u.test(step)) errors.push(`${where} commence par une minuscule : « ${excerpt} »`);
      if (index > 0 && VAGUE_BEFORE.test(step)) errors.push(`${where} « avant » sans complement : « ${excerpt} »`);
      const first = step.split(/\s+/)[0].replace(/[^\p{L}'’-]/gu, '');
      if (LABEL_WORDS.test(first) && !INFINITIVE.test(first) && !/[:,(]/.test(step.slice(0, 48))) errors.push(`${where} intitule sans deux-points : « ${excerpt} »`);
    });
    const preheat = steps.findIndex(step => PREHEAT.test(step));
    const firstOven = steps.findIndex(step => OVEN_USE.test(step) && !PREHEAT.test(step) && !NOT_OVEN.test(step));
    if (preheat > 0 && firstOven >= 0 && firstOven < preheat) errors.push(`${label} four utilise a l'etape ${firstOven + 1} mais prechauffe a l'etape ${preheat + 1}`);
    if (notes.filter(note => MAKE_AHEAD_NOTE.test(note)).length > 1) errors.push(`${label} plusieurs notes « meilleur la veille » : garder une seule note`);
  });
});

// Elisions sans apostrophe (« l intérieur ») dans tout le texte affiche ;
// une unite apres un nombre (« 30 s à feu vif », « 3 j au froid ») n'en est pas une.
const SKIP_KEYS = new Set(['image', 'categories', 'seasons', 'difficulty', 'tags', 'aliases', 'id', 'role', 'linkedRecipes', 'recipeId', 'masterType', 'master', 'additionalMasters', 'recipeVersion', 'allergens', 'nutriScore']);
const ELISION = /(^|[\s(«“"])(l|d|j|m|n|s|t|qu|jusqu|lorsqu|puisqu)\s(?=[aeiouyhàâéèêëîïôûœ])/gi;
function checkElisions(text, where) {
  for (const match of text.matchAll(ELISION)) {
    const previous = text.slice(0, match.index + match[1].length).trimEnd().split(/\s+/).pop() || '';
    if (/\d$/.test(previous)) continue;
    errors.push(`${where} elision sans apostrophe : « ${text.slice(Math.max(0, match.index - 20), match.index + 30).trim()} »`);
    return;
  }
}
// Mots deja corriges une fois (accents perdus) : ils ne doivent pas revenir.
const UNACCENTED = /(?<![\p{L}])(puree|concassees|entieres|moitie|ecumoire|batonnets|congelation|epaisses|au-dela|supplementaire|epaule|decouvert|decouvrir|reutiliser|ecrasees|fremir|pincees|deuxieme|caramelisees|caramelises|precaution|ebullition|dernieres|detremper|vegetal|vegetarien|concentree|graissee|ridee|gelatineux|crustaces|cuillere|repete|apero|entree|coherent|cremeuses|preference|sucre-sale)(?![\p{L}])/iu;
// « a » pour « à » devant un nom ou un infinitif courant.
const PREPOSITION_A = /(?:^|[\s(])a (?:cœur|température|servir|cause|sec|gratin|four|consommer|équilibrer|ne pas)\b/iu;
// Phrase qui enchaine sans ponctuation : « cuire 5 minutes elles doivent… », « Résultat cible extérieur… ».
const RUN_ON = /(?:^|\s)(?!(?:si|que|qu’\S*|qu'\S*|lorsque|quand|où) )[\p{L}\d]*[\p{Ll}\d] (?:il|elle|ils|elles) doi(?:t|vent)\b/u;
const CIBLE = /\b(?:Résultat|Texture) cible (?!:)/;
function checkText(text, where) {
  checkElisions(text, where);
  const excerpt = text.slice(0, 90);
  const word = text.match(UNACCENTED);
  if (word) errors.push(`${where} accent manquant (« ${word[1]} ») : « ${excerpt} »`);
  if (PREPOSITION_A.test(text)) errors.push(`${where} « a » pour « à » : « ${excerpt} »`);
  if (RUN_ON.test(text) || CIBLE.test(text)) errors.push(`${where} phrase sans ponctuation (ajouter « : ») : « ${excerpt} »`);
}
function walk(node, where) {
  if (typeof node === 'string') return checkText(strip(node), where);
  if (Array.isArray(node)) return node.forEach(value => walk(value, where));
  if (!node || typeof node !== 'object') return;
  Object.entries(node).forEach(([key, value]) => { if (!SKIP_KEYS.has(key)) walk(value, where); });
}
Object.entries(recipes).forEach(([id, recipe]) => walk(recipe, id));

if (errors.length) {
  errors.forEach(error => console.error(error));
  console.error(`${errors.length} faute(s) de redaction dans les recettes.`);
  process.exit(1);
}
console.log(`Validation redaction recettes OK (${checkedOptions} fiches et options).`);

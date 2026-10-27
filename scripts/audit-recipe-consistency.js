// Audit consultatif de coherence des fiches : ecrit reports/recipe-consistency.md
// et ne modifie jamais recipes.js (empreinte verifiee avant/apres).
// Usage : node scripts/audit-recipe-consistency.js
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const RECIPES_FILE = path.join(ROOT, 'recipes.js');
const REPORT = path.join(ROOT, 'reports', 'recipe-consistency.md');
const sourceBefore = fs.readFileSync(RECIPES_FILE, 'utf8');
const hash = value => crypto.createHash('sha256').update(value).digest('hex').slice(0, 12);

const context = { window: {} };
vm.createContext(context);
vm.runInContext(sourceBefore, context, { filename: RECIPES_FILE });
const RECIPES = context.window.RECIPES || {};

const strip = value => String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const fold = value => strip(value).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[œŒ]/g, 'oe').toLowerCase();
const words = value => strip(value).toLowerCase().split(/[^a-zàâäéèêëîïôöùûüçœ'’-]+/i).map(word => word.replace(/^['’-]+|['’-]+$/g, '')).filter(Boolean);

// Fiches executables : fiche simple, ou chaque option d'une fiche a variantes internes.
function options(id, recipe) {
  if (Array.isArray(recipe.variants) && recipe.variants.length) return [];
  const groups = recipe.ingredients || [];
  if (recipe.variantGroups === true) {
    const withSteps = groups.filter(group => Array.isArray(group.steps) && group.steps.length);
    if (withSteps.length) {
      const shared = groups.filter(group => !(Array.isArray(group.steps) && group.steps.length) && !group.recipe);
      return withSteps.map(group => ({
        id: `${id} › ${group.group}`,
        title: group.recipe?.title || `${recipe.title} — ${group.group}`,
        items: [...shared, group].flatMap(g => g.items || []),
        // Les etapes d'une variante renvoient souvent a « la pate de base » : seuls ses
        // propres ingredients sont compares a ses etapes.
        ownItems: group.items || [],
        steps: group.useRecipeSteps ? [...(recipe.steps || []), ...group.steps] : group.steps,
        notes: group.recipe?.notes || recipe.notes || []
      }));
    }
  }
  return [{ id, title: recipe.title, items: groups.flatMap(group => group.items || []), steps: recipe.steps || [], notes: recipe.notes || [] }];
}

const all = Object.entries(RECIPES).flatMap(([id, recipe]) => options(id, recipe));
const findings = {
  accents: [],
  noDuration: [],
  noQuantity: [],
  similarNames: [],
  unusedIngredients: [],
  formatting: []
};

// 1. Fautes d'accent : orthographe minoritaire face a la forme accentuee dominante du catalogue.
const spellings = new Map();
for (const option of all) {
  for (const text of [option.title, ...option.items, ...option.steps, ...option.notes]) {
    for (const word of words(text)) {
      if (word.length < 4) continue;
      const key = fold(word);
      if (!spellings.has(key)) spellings.set(key, new Map());
      spellings.get(key).set(word, (spellings.get(key).get(word) || 0) + 1);
    }
  }
}
const accentFixes = new Map();
// Homographes sans accent valides, ecartes apres relecture : « une coupe » (le verre),
// et des verbes conjugues (« le chorizo sale la sauce », « l’amaretto parfume la crème »).
const VALID_UNACCENTED = new Set(['coupe', 'repartir', 'parfume', 'sale', 'concentre', 'fige', 'poches', 'gonfle']);
for (const [key, forms] of spellings) {
  if (VALID_UNACCENTED.has(key)) continue;
  const sorted = [...forms.entries()].sort((a, b) => b[1] - a[1]);
  const [best, bestCount] = sorted[0];
  if (best === key) continue; // la forme dominante est deja sans accent
  for (const [form, count] of sorted.slice(1)) {
    if (form === key && bestCount >= 4 && bestCount >= count * 3) accentFixes.set(form, best);
  }
}
// Préposition « a » pour « à » devant un nom courant (« pâte a cookies », « a feu doux »).
const PREPOSITION_A = /(^|[\s(])a (la |l’|l'|feu|four|blanc|coeur|cœur|temp[eé]rature|chaleur|point|peine|moiti[eé]|l’avance|l'avance|\d)/i;
for (const option of all) {
  const hits = new Set();
  // Les notes comptent aussi : « Repère menu », « Conservation » y ont garde des mots sans accent.
  for (const text of [...option.items, ...option.steps, ...option.notes]) {
    for (const word of words(text)) if (accentFixes.has(word)) hits.add(`${word} → ${accentFixes.get(word)}`);
    const match = strip(text).match(PREPOSITION_A);
    if (match) hits.add(`« a ${match[2].trim()} » → « à ${match[2].trim()} »`);
  }
  if (hits.size) findings.accents.push({ id: option.id, title: option.title, detail: [...hits].slice(0, 6).join(' ; ') });
}

// 2. Cuissons sans duree ni repere de fin.
// Verbes de cuisson seulement : « fin de cuisson », « papier cuisson » ne sont pas des etapes de cuisson.
const COOK = /\b(cuire|enfourner|rotir|frire|mijoter|griller|poeler|saisir|bouillir|braiser|confire)\b/;
// « 1h10 », « 2h30 » comptent comme des durees.
const TIME = /\b\d+\s*(?:à|a|-|–)?\s*\d*\s*(?:min|minutes?|h(?:\d{2})?\b|heures?|s\b|secondes?)/i;
const CUE = /\d{2,3}\s*°|\b(quand|bulle|retourner|jusqu|dore|doree|tendre|fondant|croustill|nappe|pris|prise|colore|coloration|translucide|bouillon|ebullition|frem|al dente|cuit|cuite|cuits|coeur|reduit|reduire|caramel|gonfl|sec|seche|ferme|souple|lisse|epais|nacre|de la meme maniere|temps indique)\w*/;
// Pas une cuisson a borner : montage hors du feu, ebullition (repere en soi), mise au four a l'etape suivante.
const NOT_A_COOK_STEP = /hors du feu|sans (?:re)?faire bouillir|faire bouillir|avant d.enfourner|^utiliser/;
for (const option of all) {
  // Guide dont les temps sont donnes dans la liste (ex. tableau autocuiseur).
  if (option.items.filter(item => TIME.test(item)).length >= 3) continue;
  const bad = option.steps.map(strip).filter(step => COOK.test(fold(step)) && !NOT_A_COOK_STEP.test(fold(step)) && !TIME.test(step) && !CUE.test(fold(step)));
  if (bad.length) findings.noDuration.push({ id: option.id, title: option.title, detail: bad.slice(0, 2).map(step => `« ${step.slice(0, 110)} »`).join(' ; ') });
}

// 3. Ingredients sans quantite (hors assaisonnements et finitions « au gout »).
const OPTIONAL = /\b(sel|poivre|piment|muscade|herbes?|persil|ciboulette|coriandre|aneth|basilic|menthe|zeste|fleur de sel|selon|au gout|facultatif|option|pour servir|pour la cuisson|pour le moule|pour beurrer|pour fariner|pour la friture|huile de friture|quelques|un peu|filet|pincee|graines|sucre glace|cacao|vanille|eau)\b/;
for (const option of all) {
  const missing = option.items.map(strip).filter(item => item && !/^[—–-]{1,2}.*[—–-]{1,2}$/.test(item) && !/^(→|qs\b)/i.test(item) && !/\d|½|¼|¾/.test(item) && !OPTIONAL.test(fold(item)));
  if (missing.length) findings.noQuantity.push({ id: option.id, title: option.title, detail: missing.slice(0, 5).join(' ; ') });
}

// 4. Noms de variantes trop proches dans une meme fiche (ex. « fraise » / « fraises »).
const singular = value => fold(value).replace(/\b(version|variante|tiramisu|aux?|a la|au|de|du|des|la|le|les)\b/g, ' ').replace(/(s|x)\b/g, '').replace(/\s+/g, ' ').trim();
for (const [id, recipe] of Object.entries(RECIPES)) {
  const labels = (recipe.variantGroups ? (recipe.ingredients || []).filter(g => g.steps || g.recipe).map(g => g.group) : [])
    .concat((recipe.variants || []).map(ref => (typeof ref === 'string' ? RECIPES[ref]?.title : ref.label || RECIPES[ref.id]?.title)).filter(Boolean));
  for (let i = 0; i < labels.length; i += 1) {
    for (let j = i + 1; j < labels.length; j += 1) {
      if (singular(labels[i]) && singular(labels[i]) === singular(labels[j])) findings.similarNames.push({ id, title: recipe.title, detail: `« ${labels[i]} » / « ${labels[j]} »` });
    }
  }
}

// 5. Ingredients jamais repris dans les etapes (oubli possible d'une etape).
const STOP = new Set('moulin legume legumes olive neutre choix gout selon quantite assaisonnement herbes epices garniture de du des la le les au aux et ou en un une pour avec sans sur frais fraiche hache cisele rape coupe fin fine gros grosse petit petite moyen moyenne entier mou doux douce sec seche froid chaud option environ bio blanc noir rouge vert jaune liquide tranche tranches morceau morceaux feuille feuilles gousse gousses bouquet zeste jus poudre moulu cuit cuite cru crue base pate eau huile beurre sucre sel poivre farine'.split(' '));
const stem = word => (word.length > 4 ? word.replace(/(s|x)$/, '') : word);
for (const option of all) {
  if (option.steps.length < 2) continue;
  // « Mixer tous les ingredients » couvre la liste : pas de signalement.
  if (option.steps.some(step => /\b(tous les ingredients|tout le reste|le reste des ingredients|les ingredients|tous les elements)\b/.test(fold(step)))) continue;
  const stepWords = new Set(option.steps.flatMap(step => fold(step).split(/[^a-z]+/)).map(stem));
  const unused = (option.ownItems || option.items).map(strip).filter(item => {
    if (/^[—–-]{1,2}.*[—–-]{1,2}$/.test(item)) return false;
    const name = fold(item).replace(/^[\d.,/\s½¼¾–-]*(?:kg|mg|g|cl|dl|ml|l|cs|cc|c\. ?a (?:soupe|cafe))?\s*/, '');
    const keys = name.split(/[^a-z]+/).filter(word => word.length >= 4 && !STOP.has(word)).map(stem);
    return keys.length && !keys.some(key => stepWords.has(key));
  });
  if (unused.length >= 2) findings.unusedIngredients.push({ id: option.id, title: option.title, detail: unused.slice(0, 4).join(' ; ') });
}

// 6. Mise en forme : espaces doubles, unites collees ou heterogenes dans une meme fiche.
for (const option of all) {
  const text = [...option.items, ...option.steps].map(strip).join(' | ');
  const issues = [];
  if (/\d\s+°\s*C|\d°\s+C/.test(text)) issues.push('temperature mal espacee (180 °C / 180° C)');
  if (/\b\d+\s*minutes?\b/i.test(text) && /\b\d+\s*min\b/.test(text)) issues.push('« min » et « minutes » melanges');
  if (/\bcs\b|\bcc\b/.test(text) && /c\. ?à (soupe|café)/.test(text)) issues.push('« cs/cc » et « c. à soupe/café » melanges');
  if (/ {2,}/.test([...option.items, ...option.steps].join(' '))) issues.push('espaces doubles');
  if (issues.length) findings.formatting.push({ id: option.id, title: option.title, detail: issues.join(' ; ') });
}

const SECTIONS = [
  ['accents', 'Fautes d’accent probables', 'Forme minoritaire face à la forme accentuée dominante du catalogue, ou « a » au lieu de « à ».'],
  ['noDuration', 'Cuissons sans durée ni repère de fin', 'Étape de cuisson qui ne donne ni temps, ni signe visuel ou tactile de fin.'],
  ['noQuantity', 'Ingrédients sans quantité', 'Hors assaisonnements, herbes et finitions « au goût ».'],
  ['similarNames', 'Noms de variantes trop proches', 'Deux choix d’une même fiche qui ne se distinguent presque pas.'],
  ['unusedIngredients', 'Ingrédients jamais repris dans les étapes', 'Au moins deux ingrédients absents des étapes : étape oubliée ou intitulé différent (à vérifier à la main).'],
  ['formatting', 'Mise en forme hétérogène', 'Espaces, unités et écritures mélangées dans une même fiche.']
];
const total = SECTIONS.reduce((sum, [key]) => sum + findings[key].length, 0);
const lines = [
  '# Audit de cohérence des fiches',
  '',
  'Rapport consultatif généré par `npm run audit:consistency`. `recipes.js` n’est pas modifié :',
  'chaque correction est présentée et validée avant intégration.',
  '',
  `- Fiches et options analysées : ${all.length}`,
  `- Signalements : ${total}`,
  `- Empreinte recipes.js : ${hash(sourceBefore)}`,
  ''
];
for (const [key, label, help] of SECTIONS) {
  lines.push(`## ${label} (${findings[key].length})`, '', `_${help}_`, '');
  for (const item of findings[key]) lines.push(`- [ ] **${item.title}** (\`${item.id}\`) — ${item.detail}`);
  lines.push('');
}
fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(REPORT, lines.join('\n'), 'utf8');
if (hash(fs.readFileSync(RECIPES_FILE, 'utf8')) !== hash(sourceBefore)) {
  console.error('recipes.js a change pendant l audit : rapport invalide.');
  process.exit(1);
}
console.log(`Audit coherence : ${all.length} fiches/options, ${total} signalement(s) -> ${path.relative(ROOT, REPORT)}`);
SECTIONS.forEach(([key, label]) => console.log(`  ${label} : ${findings[key].length}`));

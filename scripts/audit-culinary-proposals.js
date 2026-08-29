const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const RECIPES_FILE = path.join(ROOT, 'recipes.js');
const REPORT_JSON = path.join(ROOT, 'reports', 'culinary-proposals.json');
const REPORT_MD = path.join(ROOT, 'reports', 'culinary-proposals.md');

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const stripHtml = value => String(value || '').replace(/<[^>]+>/g, ' ');
const normalize = value => stripHtml(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/œ/g, 'oe').toLowerCase().replace(/[^a-z0-9°%]+/g, ' ').trim();

function loadRecipes(source) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: RECIPES_FILE });
  return context.window.RECIPES || {};
}

function collect(recipe) {
  return [recipe.title, recipe.yield,
    ...(recipe.ingredients || []).flatMap(group => [group.group, ...(group.items || []), ...(group.steps || [])]),
    ...(recipe.steps || []), ...(recipe.notes || []),
    ...(recipe.technical || []).flatMap(item => [item.label, item.value, item.text]),
    ...Object.values(recipe.practical || {}).flatMap(value => Array.isArray(value) ? value : [value])
  ].filter(Boolean);
}

function executableRecipes(recipes) {
  const result = [];
  Object.entries(recipes).forEach(([id, recipe]) => {
    if (Array.isArray(recipe.variants) && recipe.variants.length) return;
    if (recipe.variantGroups === true) {
      (recipe.ingredients || []).forEach((group, index) => {
        if (!group.recipe && !group.steps) return;
        result.push({ id: `${id}::${index + 1}`, recipe: { ...recipe, ...(group.recipe || {}), title: group.recipe?.title || `${recipe.title} — ${group.group || `option ${index + 1}`}`, ingredients: [{ group: group.group, items: group.items || [] }], steps: group.steps || group.recipe?.steps || recipe.steps || [] } });
      });
      return;
    }
    result.push({ id, recipe });
  });
  return result;
}

function add(list, type, confidence, observation, addition, evidence) {
  list.push({ type, confidence, observation, addition, evidence });
}

function inspectRecipe(id, recipe) {
  const proposals = [];
  const rawText = collect(recipe).join(' ');
  const text = normalize(rawText);
  const steps = (recipe.steps || []).map(stripHtml);
  const hasTemperature = /\b\d{2,3}\s*°\s*c\b/i.test(rawText);
  const timedSteps = steps.filter(step => {
    const normalizedStep = normalize(step);
    return /\b\d+\s*(?:a|à|-|–)?\s*\d*\s*(?:min|minute|minutes|h|heure|heures)\b/i.test(step)
      && /\b(cuire|cuisson|four|mijoter|poeler|griller|frire|rotir|chauffer|bouillir|fremir|saisir)\b/.test(normalizedStep);
  });
  const sensoryPattern = /(dore|napp|fondant|ferme|tendre|translucide|evapor|colore|croustill|moelleux|prise|tremble|rose|jus clair|se detache|texture)/;
  const sensoryMissing = timedSteps.filter(step => !sensoryPattern.test(normalize(step)));
  if (sensoryMissing.length) add(proposals, 'repere-sensoriel', 'moyenne', `${sensoryMissing.length} étape(s) donnent un temps sans repère sensoriel explicite.`, 'Ajouter un signe visuel ou tactile après le temps existant, sans modifier ni supprimer ce temps.', sensoryMissing.slice(0, 3));

  if (/\b(poulet|dinde|canard|volaille|pintade)\b/.test(text) && !hasTemperature) add(proposals, 'temperature-a-coeur', 'haute', 'Volaille détectée sans température à cœur explicite.', 'Conserver tous les temps écrits et proposer en complément « cuisson à cœur, supérieure à 65 °C, chair non rosée et sans trace de sang ».', ['Ministère de l’Agriculture — La campylobactériose']);
  if (/\b(viande hachee|steak hache|boulette|saucisse)\b/.test(text) && !hasTemperature) add(proposals, 'temperature-a-coeur', 'haute', 'Viande hachée ou préparation hachée détectée sans température à cœur explicite.', 'Conserver tous les temps écrits et proposer en complément une cuisson à cœur ; pour les publics sensibles, proposer au moins 71 °C en fin de cuisson.', ['Anses — prévention des infections à E. coli entérohémorragiques']);

  const storageLines = [...(recipe.practical?.storage || []), ...(recipe.notes || [])];
  const storageText = normalize(storageLines.join(' '));
  if (/\b(pomme de terre|riz|pates|oeuf|viande|poisson)\b/.test(text) && /\b(conserv|refriger|frigo|froid|sec|lumiere)\b/.test(storageText) && !/\b(cru|crue|cuit|cuite|prepare|preparation|reste)\b/.test(storageText)) add(proposals, 'conservation-contexte', 'moyenne', 'Un conseil de conservation peut être ambigu entre ingrédient cru et préparation cuite.', 'Préciser le contexte cru/cuit après validation, sans retirer la consigne existante.', [stripHtml(storageLines.join(' ')).slice(0, 320)]);

  const sensitive = (recipe.ingredients || []).flatMap(group => group.items || []).map(stripHtml).filter(line => /\b(levure|gelatine|agar|piment|alcool)\b/.test(normalize(line)));
  if (sensitive.length) add(proposals, 'mise-a-echelle', 'information', 'La fiche contient des ingrédients dont la multiplication mérite une vérification gustative ou technique.', 'Afficher un avertissement lors du changement de portions ; ne modifier aucune quantité source.', sensitive.slice(0, 5));
  return { id, title: recipe.title || id, proposals };
}

const sourceBefore = fs.readFileSync(RECIPES_FILE, 'utf8');
const hashBefore = sha256(sourceBefore);
const reviewed = executableRecipes(loadRecipes(sourceBefore)).map(({ id, recipe }) => inspectRecipe(id, recipe));
const withProposals = reviewed.filter(item => item.proposals.length);
const totalsByType = withProposals.flatMap(item => item.proposals).reduce((totals, item) => ({ ...totals, [item.type]: (totals[item.type] || 0) + 1 }), {});
const hashAfter = sha256(fs.readFileSync(RECIPES_FILE, 'utf8'));
if (hashBefore !== hashAfter) throw new Error('Audit interrompu : recipes.js a été modifié.');

const report = {
  generatedAt: new Date().toISOString(),
  mode: 'propositions uniquement — validation utilisateur obligatoire',
  sourceIntegrity: { before: hashBefore, after: hashAfter, unchanged: true },
  sources: ['https://agriculture.gouv.fr/la-campylobacteriose', 'https://www.anses.fr/fr/system/files/ANSES-Ft-BIORISK2012sa0005_Avis.pdf'],
  totals: { reviewed: reviewed.length, withProposals: withProposals.length, byType: totalsByType },
  recipes: withProposals
};

const markdown = ['# Propositions culinaires à valider', '', '> Rapport consultatif : aucune fiche n’a été modifiée. Chaque correction ou ajout doit être validé par l’utilisateur.', '', `- Fiches exécutables contrôlées : ${report.totals.reviewed}`, `- Fiches avec proposition : ${report.totals.withProposals}`, `- Empreinte recipes.js avant/après : ${hashBefore === hashAfter ? 'identique' : 'différente'}`, '', '## Règle pour les temps et températures', '', 'Toute température à cœur ou tout repère sensoriel proposé vient après le temps existant. Aucun temps n’est remplacé ou supprimé.', '', '## Sources de sécurité', '', ...report.sources.map(source => `- ${source}`), '', '## Propositions par fiche', '', ...withProposals.flatMap(item => [`### ${item.title} (${item.id})`, '', ...item.proposals.flatMap(proposal => [`- **${proposal.type} — confiance ${proposal.confidence}**`, `  - Constat : ${proposal.observation}`, `  - Proposition à valider : ${proposal.addition}`, ...(proposal.evidence || []).map(value => `  - Preuve/contexte : ${value}`)]), ''])].join('\n');
fs.mkdirSync(path.dirname(REPORT_JSON), { recursive: true });
fs.writeFileSync(REPORT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
fs.writeFileSync(REPORT_MD, `${markdown}\n`, 'utf8');
console.log(`Audit culinaire non destructif OK : ${report.totals.reviewed} fiches, recipes.js inchangé.`);

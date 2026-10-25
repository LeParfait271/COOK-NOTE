// Propositions de liens internes : repere, dans les ingredients et les etapes,
// les sauces et bases du catalogue qu'une fiche utilise sans y renvoyer.
// Rapport consultatif uniquement : recipes.js n'est jamais modifie, chaque lien
// doit etre valide par l'utilisateur avant integration (COOK_NOTE_RULES.md, section 2).
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const RECIPES_FILE = path.join(ROOT, 'recipes.js');
const REPORT_JSON = path.join(ROOT, 'reports', 'link-proposals.json');
const REPORT_MD = path.join(ROOT, 'reports', 'link-proposals.md');
const COMPONENT_PARENTS = new Set(['sauces_maitre', 'elements_base_maitre']);
// Noms trop generiques pour prouver l'usage d'une recette du catalogue.
const GENERIC_NAMES = new Set(['sauce', 'base', 'pate', 'creme', 'sirop', 'bouillon', 'fond', 'marinade', 'beurre', 'caramel', 'chocolat']);
const MIN_NAME_LENGTH = 6;

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const stripLinks = value => String(value || '').replace(/<span[^>]*data-goto[^>]*>.*?<\/span>/gi, ' ');
const normalize = value => String(value || '')
  .replace(/<[^>]+>/g, ' ')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/œ/g, 'oe')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

function loadRecipes(source) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: RECIPES_FILE });
  return context.window.RECIPES || {};
}

function isComponent(recipe) {
  return COMPONENT_PARENTS.has(recipe.master) || (recipe.additionalMasters || []).some(id => COMPONENT_PARENTS.has(id));
}

function linkedIds(recipe) {
  const text = JSON.stringify(recipe);
  const ids = new Set([...text.matchAll(/data-goto=\\?["']([^"'\\]+)/g)].map(match => match[1]));
  (recipe.linkedRecipes || []).forEach(item => ids.add(typeof item === 'string' ? item : item?.id));
  return ids;
}

function usageLines(recipe) {
  return [
    ...(recipe.ingredients || []).flatMap(group => [...(group.items || []), ...(group.steps || [])]),
    ...(recipe.steps || [])
  ].map(stripLinks);
}

function componentNames(recipe) {
  return [...new Set([recipe.title, ...(recipe.aliases || [])].map(normalize))]
    .filter(name => name.length >= MIN_NAME_LENGTH && !GENERIC_NAMES.has(name));
}

const source = fs.readFileSync(RECIPES_FILE, 'utf8');
const hashBefore = sha256(source);
const recipes = loadRecipes(source);
const entries = Object.entries(recipes);
const components = entries
  .filter(([, recipe]) => isComponent(recipe))
  .map(([id, recipe]) => ({ id, title: recipe.title, names: componentNames(recipe) }))
  .filter(component => component.names.length > 0);

const proposals = [];
entries
  .filter(([, recipe]) => recipe.master)
  .forEach(([id, recipe]) => {
    const alreadyLinked = linkedIds(recipe);
    const lines = usageLines(recipe).map(line => ({ raw: line.replace(/<[^>]+>/g, '').trim(), text: ` ${normalize(line)} ` }));
    components.forEach(component => {
      if (component.id === id || alreadyLinked.has(component.id)) return;
      for (const name of component.names) {
        const hit = lines.find(line => line.text.includes(` ${name} `));
        if (hit) {
          proposals.push({ id, title: recipe.title, target: component.id, targetTitle: component.title, evidence: hit.raw });
          break;
        }
      }
    });
  });

proposals.sort((a, b) => a.title.localeCompare(b.title, 'fr') || a.targetTitle.localeCompare(b.targetTitle, 'fr'));
const hashAfter = sha256(fs.readFileSync(RECIPES_FILE, 'utf8'));
if (hashBefore !== hashAfter) {
  console.error('recipes.js a change pendant l audit : rapport annule.');
  process.exit(1);
}

const byRecipe = new Map();
proposals.forEach(item => {
  if (!byRecipe.has(item.id)) byRecipe.set(item.id, []);
  byRecipe.get(item.id).push(item);
});
const lines = [
  '# Propositions de liens internes',
  '',
  'Rapport consultatif genere par `npm run audit:link-proposals`. `recipes.js` n’est pas modifié :',
  'chaque lien doit être validé avant intégration (lien `data-goto` dans le texte et `linkedRecipes`).',
  '',
  `- Sauces et bases du catalogue cherchées : ${components.length}`,
  `- Fiches concernées : ${byRecipe.size}`,
  `- Liens proposés : ${proposals.length}`,
  `- Empreinte recipes.js : ${hashBefore.slice(0, 12)}`,
  ''
];
byRecipe.forEach(items => {
  lines.push(`## ${items[0].title} (\`${items[0].id}\`)`, '');
  items.forEach(item => lines.push(`- [ ] ${item.targetTitle} (\`${item.target}\`) — « ${item.evidence} »`));
  lines.push('');
});

fs.mkdirSync(path.dirname(REPORT_MD), { recursive: true });
fs.writeFileSync(REPORT_MD, `${lines.join('\n').trimEnd()}\n`, 'utf8');
fs.writeFileSync(REPORT_JSON, `${JSON.stringify({ recipesHash: hashBefore, proposals }, null, 2)}\n`, 'utf8');
console.log(`Propositions de liens : ${proposals.length} sur ${byRecipe.size} fiches (reports/link-proposals.md).`);

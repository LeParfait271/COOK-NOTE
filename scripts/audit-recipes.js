const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, 'reports');
const SCORE_WEIGHTS = {
  identity: 12,
  structure: 20,
  usability: 18,
  safety: 18,
  discovery: 16,
  production: 16
};

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function loadRecipes() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read('recipes.js'), context, { filename: path.join(ROOT, 'recipes.js') });
  return context.window.RECIPES || {};
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]+>/g, ' ');
}

function normalize(value) {
  return stripHtml(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function collectStrings(recipe) {
  return [
    recipe.title,
    recipe.yield,
    recipe.difficulty,
    ...(recipe.categories || []),
    ...(recipe.seasons || []),
    ...(recipe.tags || []),
    ...(recipe.aliases || []),
    ...(recipe.ingredients || []).flatMap(group => [group.group, ...(group.items || []), group.note, ...(group.notes || [])]),
    ...(recipe.steps || []),
    ...(recipe.notes || []),
    ...(recipe.technical || []).flatMap(item => [item.label, item.value, item.text])
  ].filter(Boolean);
}

function recipeText(recipe) {
  return normalize(collectStrings(recipe).join(' '));
}

function isMaster(recipe) {
  return Array.isArray(recipe?.variants) && recipe.variants.length > 0;
}

function hasStorage(recipe) {
  return collectStrings(recipe).some(value => /\b(conservation|stockage|refrigerateur|réfrigérateur|congel|au froid|boite hermetique|boîte hermétique)\b/i.test(stripHtml(value)));
}

function hasSafety(recipe) {
  const text = recipeText(recipe);
  if (/\b(oeuf cru|huile.*ail|ail.*huile|poisson|mollusque|viande|creme|fromage frais|mascarpone)\b/.test(text)) {
    return /\b(refrigerateur|au froid|cuillere propre|refroidir|jette|consomme|24|48|3 jours|temperature ambiante)\b/.test(text);
  }
  return true;
}

function activeCategories(recipe, recipes) {
  const categories = new Set(recipe.categories || []);
  [recipe.master, ...(recipe.additionalMasters || [])].filter(Boolean).forEach(parentId => {
    (recipes[parentId]?.categories || []).forEach(category => categories.add(category));
  });
  return categories;
}

function focusedDiscoveryText(recipe) {
  return normalize([
    recipe.title,
    ...(recipe.aliases || [])
  ].filter(Boolean).join(' '));
}

function categorySuggestions(recipe, recipes) {
  const text = focusedDiscoveryText(recipe);
  const categories = activeCategories(recipe, recipes);
  const suggestions = [];
  const add = (category, reason) => {
    if (!categories.has(category)) suggestions.push({ category, reason });
  };
  if (/\b(frites|riz|pommes de terre|legumes rotis|accompagnement)\b/.test(text)) add('Accompagnements', 'semble etre un accompagnement');
  if (/\b(mayonnaise|sauce|coulis|pesto|vinaigrette|aioli|aïoli|marinade|balsamique|rouille|dip)\b/.test(text)) add('Sauces', 'semble etre une sauce ou un condiment');
  if (/\b(pate a choux|pate sucree|pate a tarte|babeurre|fond de tarte|tortilla|base)\b/.test(text)) add('Base', 'semble etre une base reutilisable');
  if (/\b(cookie|cookies|gateau|gâteau|tarte|dessert|chantilly|macaron|mousse|cake|crumble|meringue)\b/.test(text) && !/\bsale|sal[eé]s?\b/.test(text)) add('Desserts', 'semble etre sucré ou patissier');
  if (/\b(apero|apéro|toast|mimosa|beignet|mojito)\b/.test(text)) add('Apéro', 'semble utile a l apero');
  return suggestions;
}

function ingredientCore(value) {
  return normalize(value)
    .trim();
}

function qualityIssuesFor(id, recipe) {
  const issues = [];
  const ingredientGroups = recipe.ingredients || [];
  ingredientGroups.forEach(group => {
    const groupName = String(group.group || '');
    if (/\b(conversion|equivalence|repere|poids moyens?|memo|avant de commencer)\b/i.test(normalize(groupName))) {
      issues.push(`Groupe non ingredient dans les ingredients : ${groupName}.`);
    }
    (group.items || []).forEach(item => {
      if (/\b(equivaut|equivalent|conversion|repere indicatif)\b/i.test(normalize(item))) {
        issues.push(`Ligne non ingredient dans les ingredients : ${stripHtml(item)}.`);
      }
      if (/\sstyle\s*=/.test(String(item))) {
        issues.push('Style HTML inline dans un ingredient.');
      }
    });
  });

  if (!recipe.variantGroups) {
    const seen = new Map();
    ingredientGroups.forEach(group => (group.items || []).forEach(item => {
      const key = ingredientCore(item);
      if (!key) return;
      seen.set(key, [...(seen.get(key) || []), stripHtml(item)]);
    }));
    seen.forEach(values => {
      if (values.length > 1) issues.push(`Ingredient probablement duplique : ${values.join(' / ')}.`);
    });
  }

  const noteKeys = new Set();
  (recipe.notes || []).forEach(note => {
    if (/\sstyle\s*=/.test(String(note))) issues.push('Style HTML inline dans une note.');
    const key = normalize(note);
    if (key && noteKeys.has(key)) issues.push(`Note dupliquee : ${stripHtml(note)}.`);
    noteKeys.add(key);
  });
  return issues;
}

function scoreLeaf(id, recipe, recipes) {
  const issues = [];
  const suggestions = [];
  const text = recipeText(recipe);
  let score = 0;

  const award = (key, condition, issue) => {
    if (condition) score += SCORE_WEIGHTS[key];
    else issues.push(issue);
  };

  award('identity', recipe.title && recipe.yield && (recipe.categories || []).length && (recipe.seasons || []).length, 'Identite incomplete : titre, rendement, categorie ou saison manquant.');
  const hasReadableStructure = (recipe.ingredients || []).length > 0 && ((recipe.steps || []).length >= 2 || (recipe.variantGroups && (recipe.ingredients || []).length >= 3 && (recipe.steps || []).length >= 1));
  award('structure', hasReadableStructure, 'Structure faible : ingredients ou etapes insuffisants.');
  award('usability', (recipe.notes || []).length > 0 || (recipe.technical || []).length > 0, 'Peu de reperes utilisateur : notes ou points techniques absents.');
  award('safety', hasStorage(recipe) && hasSafety(recipe), 'Conservation ou securite alimentaire a verifier.');
  award('discovery', (recipe.tags || []).length >= 2 && ((recipe.aliases || []).length || text.includes('data goto')), 'Decouverte faible : tags, alias ou liens internes pauvres.');
  award('production', recipe.image && !/\.svg(?:$|\?)/i.test(recipe.image), 'Image locale exploitable manquante.');

  if ((recipe.steps || []).length > 12) suggestions.push('Recette longue : verifier que les etapes restent faciles a suivre sur mobile.');
  if ((recipe.notes || []).length > 8) suggestions.push('Notes nombreuses : verifier que tout est bien range dans les sections pratiques.');
  if (!hasStorage(recipe)) suggestions.push('Ajouter une conservation explicite si la recette est fragile ou preparable a l avance.');
  categorySuggestions(recipe, recipes).forEach(item => suggestions.push(`Categorie possible : ${item.category} (${item.reason}).`));
  const qualityIssues = qualityIssuesFor(id, recipe);

  return { id, title: recipe.title, score, issues, qualityIssues, suggestions };
}

function linkedIds(recipe) {
  const text = collectStrings(recipe).join('\n');
  const ids = [];
  for (const match of text.matchAll(/data-goto=\\?["']([^"']+)\\?["']/g)) ids.push(match[1]);
  (recipe.linkedRecipes || []).forEach(item => ids.push(typeof item === 'string' ? item : item?.id));
  return ids.filter(Boolean);
}

const recipes = loadRecipes();
const allIds = Object.keys(recipes);
const leaves = allIds.filter(id => !isMaster(recipes[id]));
const masters = allIds.filter(id => isMaster(recipes[id]));
const leafReports = leaves.map(id => scoreLeaf(id, recipes[id], recipes)).sort((a, b) => a.score - b.score || a.title.localeCompare(b.title, 'fr'));
const lowScore = leafReports.filter(item => item.score < 78);
const categoryIdeas = leafReports.flatMap(item => item.suggestions.filter(text => text.startsWith('Categorie possible')).map(text => ({ id: item.id, title: item.title, text })));
const linkCounts = leaves.map(id => ({ id, title: recipes[id].title, count: linkedIds(recipes[id]).length })).sort((a, b) => a.count - b.count || a.title.localeCompare(b.title, 'fr'));
const reviewedRecipes = leafReports
  .slice()
  .sort((a, b) => a.title.localeCompare(b.title, 'fr'))
  .map(item => ({
    id: item.id,
    title: item.title,
    score: item.score,
    issues: item.issues,
    qualityIssues: item.qualityIssues,
    suggestions: item.suggestions
  }));
const recipesWithQualityIssues = reviewedRecipes.filter(item => item.qualityIssues.length > 0);
const healthDashboard = {
  ready: reviewedRecipes.filter(item => item.score >= 90).length,
  improve: reviewedRecipes.filter(item => item.score >= 78 && item.score < 90).length,
  weak: reviewedRecipes.filter(item => item.score < 78).length,
  missingDiscovery: reviewedRecipes.filter(item => item.issues.some(issue => /Decouverte faible/.test(issue))).length,
  missingSafety: reviewedRecipes.filter(item => item.issues.some(issue => /Conservation|securite/.test(issue))).length,
  productionRisk: reviewedRecipes.filter(item => item.issues.some(issue => /Image/.test(issue))).length,
  fewLinks: linkCounts.filter(item => item.count === 0).length
};

const summary = {
  generatedAt: new Date().toISOString(),
  totals: {
    recipes: allIds.length,
    leaves: leaves.length,
    masters: masters.length,
    lowScore: lowScore.length,
    categoryIdeas: categoryIdeas.length,
    qualityIssues: recipesWithQualityIssues.length
  },
  averageScore: Math.round(leafReports.reduce((sum, item) => sum + item.score, 0) / Math.max(1, leafReports.length)),
  healthDashboard,
  weakestRecipes: lowScore.slice(0, 20),
  categoryIdeas: categoryIdeas.slice(0, 40),
  recipesWithFewLinks: linkCounts.filter(item => item.count === 0).slice(0, 30),
  reviewedRecipes
};

const markdown = [
  '# Audit Cook Note',
  '',
  `Genere le ${summary.generatedAt}.`,
  '',
  `- Recettes totales : ${summary.totals.recipes}`,
  `- Recettes feuilles : ${summary.totals.leaves}`,
  `- Fiches parentes : ${summary.totals.masters}`,
  `- Score moyen : ${summary.averageScore}/100`,
  `- Fiches sous 78 : ${summary.totals.lowScore}`,
  `- Fiches avec defauts a verifier : ${summary.totals.qualityIssues}`,
  '',
  '## Dashboard sante',
  '',
  `- Pretes : ${summary.healthDashboard.ready}`,
  `- A ameliorer : ${summary.healthDashboard.improve}`,
  `- Faibles : ${summary.healthDashboard.weak}`,
  `- Decouverte faible : ${summary.healthDashboard.missingDiscovery}`,
  `- Conservation/securite a verifier : ${summary.healthDashboard.missingSafety}`,
  `- Risque image/production : ${summary.healthDashboard.productionRisk}`,
  `- Sans liens internes explicites : ${summary.healthDashboard.fewLinks}`,
  '',
  '## Fiches a surveiller',
  '',
  ...(summary.weakestRecipes.length ? summary.weakestRecipes.flatMap(item => [
    `- ${item.title} (${item.id}) : ${item.score}/100`,
    ...item.issues.map(issue => `  - ${issue}`),
    ...item.suggestions.slice(0, 3).map(suggestion => `  - ${suggestion}`)
  ]) : ['Aucune fiche faible detectee.']),
  '',
  '## Audit integral',
  '',
  ...summary.reviewedRecipes.flatMap(item => [
    `- ${item.title} (${item.id}) : ${item.score}/100${item.qualityIssues.length ? '' : ' - OK'}`,
    ...item.qualityIssues.map(issue => `  - ${issue}`),
    ...(!item.qualityIssues.length && item.issues.length ? item.issues.slice(0, 2).map(issue => `  - A surveiller : ${issue}`) : [])
  ]),
  '',
  '## Idees de rangement prudentes',
  '',
  ...(summary.categoryIdeas.length ? summary.categoryIdeas.map(item => `- ${item.title} (${item.id}) : ${item.text}`) : ['Aucune idee de rangement prioritaire.']),
  '',
  '## Fiches a relier progressivement',
  '',
  ...(summary.recipesWithFewLinks.length ? summary.recipesWithFewLinks.map(item => `- ${item.title} (${item.id})`) : ['Toutes les fiches ont au moins un lien interne explicite.']),
  ''
].join('\n');

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORT_DIR, 'recipe-audit.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(REPORT_DIR, 'recipe-audit.md'), markdown, 'utf8');

console.log(`Audit recettes OK: ${summary.totals.leaves} fiches feuilles, score moyen ${summary.averageScore}/100.`);

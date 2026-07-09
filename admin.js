const CATEGORIES = ['Apéro', 'Entrées', 'Plats', 'Desserts', 'Petit-déjeuner', 'Sauces', 'Base'];
const SEASONS = ['Printemps', 'Été', 'Automne', 'Hiver', 'Toutes saisons'];
const DIFFICULTY = { easy: 'Facile', medium: 'Intermédiaire', hard: 'Technique' };
const DIAGNOSTIC_COMPONENT_PATTERNS = [
  /\b(base|fond|fonds|appareil|insert|garniture|fourrage)\b/,
  /\b(pate|pates|pâte|pâtes|creme|crème|ganache|chantilly|meringue|curd)\b/,
  /\b(sauce|coulis|pesto|vinaigrette|marinade|sirop|caramel|topping|condiment)\b/,
  /\b(bun|buns|pain burger|pain hot dog|babeurre|levain|poolish)\b/
];
const DIAGNOSTIC_AISLES = [
  { label: 'Primeur', pattern: /\b(tomate|citron|pomme|poire|oignon|ail|echalote|persil|basilic|menthe|pomme de terre|avocat|carotte|courgette|chou|melon|fraise|cerise)\b/ },
  { label: 'Crèmerie et œufs', pattern: /\b(lait|creme|crème|beurre|fromage|mozzarella|mascarpone|ricotta|yaourt|oeuf|œuf|jaune|blanc)\b/ },
  { label: 'Boucherie', pattern: /\b(porc|poulet|volaille|boeuf|bœuf|agneau|canard|lardon|bacon|jambon|saucisse)\b/ },
  { label: 'Poissonnerie', pattern: /\b(crevette|calamar|poisson|moule|saumon|cabillaud|thon)\b/ },
  { label: 'Boulangerie', pattern: /\b(pain|bun|brioche|tortilla)\b/ },
  { label: 'Épicerie', pattern: /\b(farine|sucre|sel|poivre|huile|vinaigre|moutarde|chocolat|riz|pates|pâtes|epice|épice|miel|vanille|noix|amande|pistache)\b/ }
];

let recipes = {};
let activeId = null;
let mode = 'create';

const $ = selector => document.querySelector(selector);

const fields = {
  id: $('#field-id'),
  title: $('#field-title'),
  difficulty: $('#field-difficulty'),
  yield: $('#field-yield'),
  tags: $('#field-tags'),
  video: $('#field-video'),
  image: $('#field-image'),
  master: $('#field-master'),
  variants: $('#field-variants'),
  ingredients: $('#field-ingredients'),
  steps: $('#field-steps'),
  notes: $('#field-notes'),
  technical: $('#field-technical')
};

function message(text, isError = false) {
  const output = $('#admin-message');
  output.textContent = text;
  output.style.color = isError ? '#fca5a5' : '#fbbf24';
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[œŒ]/g, 'oe')
    .replace(/[æÆ]/g, 'ae')
    .toLowerCase();
}

function slugify(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}

function recipeDiagnosticText(recipe) {
  return normalizeText([
    recipe.title,
    ...(recipe.categories || []),
    ...(recipe.tags || []),
    ...(recipe.ingredients || []).flatMap(group => [group.group, ...(group.items || [])]),
    ...(recipe.steps || []),
    ...(recipe.notes || []),
    ...(recipe.technical || []).flatMap(item => [item.label, item.title, item.value, item.text])
  ].join(' '));
}

function inferDiagnosticRole(recipe) {
  const text = recipeDiagnosticText(recipe);
  const categories = new Set(recipe.categories || []);
  const isComponent = categories.has('Base') || categories.has('Sauces') || DIAGNOSTIC_COMPONENT_PATTERNS.some(pattern => pattern.test(text));
  if (isComponent && !categories.has('Plats') && !categories.has('Desserts') && !categories.has('Apéro') && !categories.has('Entrées')) return 'Composant/base';
  if (categories.has('Desserts')) return 'Dessert servi';
  if (categories.has('Plats')) return 'Plat';
  if (categories.has('Accompagnements')) return 'Accompagnement';
  if (categories.has('Apéro') || categories.has('Entrées')) return 'Entrée/apéro';
  return 'À classer';
}

function inferDiagnosticAisles(recipe) {
  const text = recipeDiagnosticText(recipe);
  return DIAGNOSTIC_AISLES.filter(aisle => aisle.pattern.test(text)).map(aisle => aisle.label);
}

function inferDiagnosticAllergens(recipe) {
  const text = recipeDiagnosticText(recipe);
  const nutText = text
    .replace(/\bnoix de coco\b/g, '')
    .replace(/\bnoix de muscade\b/g, '');
  const seafoodText = text
    .replace(/\bmoules?\s+(a|de|en)\s+(cake|tarte|manque|savarin|muffin|madeleine|charniere|gratin|four)\b/g, '')
    .replace(/\bmoules?\s+(cake|tarte|manque|savarin|muffin|madeleine|charniere|gratin)\b/g, '');
  const items = [];
  const add = (label, pattern, source = text) => {
    if (pattern.test(source) && !items.includes(label)) items.push(label);
  };
  add('Gluten', /\b(farine|ble|froment|seigle|orge|avoine|epeautre|malt|semoule|couscous|boulgour|chapelure|panko|pain|brioche|bun|buns|pates?|nouilles?|ravioles?|tortillas?|speculoos|biscuit|biscuits|genoise|pizza)\b/);
  add('Œufs', /\b(oeufs?|jaunes?\s+d\s*oeufs?|blancs?\s+d\s*oeufs?|meringue|mayonnaise)\b/);
  add('Lait/lactose', /\b(lait|lactose|beurre|creme|fromage|yaourt|mascarpone|ricotta|mozzarella|parmesan|comte|feta|chevre|brie|roquefort|mornay|chantilly|babeurre)\b/);
  add('Fruits à coque', /\b(amandes?|noisettes?|pistaches?|noix|pecan|cajou|macadamia|praline|pralines?|pignons?)\b/, nutText);
  add('Arachides', /\b(arachides?|cacahuetes?|beurre\s+de\s+cacahuete)\b/);
  add('Soja', /\b(soja|tofu|tamari|edamame|miso)\b/);
  add('Sésame', /\b(sesame|tahini|tahin)\b/);
  add('Moutarde', /\b(moutarde)\b/);
  add('Poisson', /\b(poisson|saumon|cabillaud|thon|anchois|sardines?|truite|bar|dorade|colin|merlu|nuoc\s*mam|sauce\s+poisson)\b/);
  add('Crustacés', /\b(crevettes?|gambas|langoustines?|crabes?|homards?|ecrevisses?)\b/);
  add('Mollusques', /\b(moules?|calamars?|encornets?|seiches?|poulpes?|coquilles?\s+saint\s+jacques?|huitres?|palourdes?)\b/, seafoodText);
  add('Céleri', /\b(celeri|celeri-rave)\b/);
  add('Sulfites', /\b(sulfites?|vin|vinaigre|balsamique|cidre|biere)\b/);
  add('Lupin', /\b(lupin)\b/);
  return items;
}

function adminQualityChecks(id, recipe) {
  const checks = [];
  const add = (label, ok, detail) => checks.push({ label, ok, detail });
  const categories = recipe.categories || [];
  const seasons = recipe.seasons || [];
  const tags = recipe.tags || [];
  const ingredients = recipe.ingredients || [];
  const steps = recipe.steps || [];
  const variants = recipe.variants || [];
  const notes = recipe.notes || [];
  const technical = recipe.technical || [];
  const practicalText = normalizeText([...notes, ...technical.flatMap(item => [item.label, item.title, item.value, item.text])].join(' '));
  const hasConservation = /\b(conservation|conserver|garde|frigo|refrigerateur|congel|congelation|avance|veille|jours?)\b/.test(practicalText);
  const hasLinks = Boolean(recipe.master || variants.length || /\b(data-goto|recette liee|voir aussi|base|sauce)\b/.test(recipeDiagnosticText(recipe)));
  add('Identité', Boolean(id && recipe.title && recipe.yield), 'slug, titre, rendement');
  add('Rangement', categories.length > 0 && seasons.length > 0, 'catégorie + saison');
  add('Recherche', tags.length >= 2, 'au moins 2 tags utiles');
  add('Structure', ingredients.length > 0 && steps.length > 0, 'ingrédients et étapes');
  add('Image', String(recipe.image || '').startsWith('/assets/recipes/heroes/'), 'image locale optimisée');
  add('SEO', String(recipe.title || '').length >= 4 && steps.join(' ').length >= 80, 'titre + contenu descriptif');
  add('Conservation', hasConservation, 'note conservation / avance / frigo');
  add('Liens', hasLinks, 'parent, variante ou renvoi utile');
  return checks;
}

function recipeHealthSummary(id, recipe) {
  const checks = adminQualityChecks(id, recipe);
  const allergens = inferDiagnosticAllergens(recipe);
  const failed = checks.filter(item => !item.ok);
  return {
    id,
    recipe,
    checks,
    failed,
    allergens,
    score: checks.length - failed.length,
    qualityScore: Math.round(((checks.length - failed.length) / checks.length) * 100)
  };
}

function recipeDuplicateTokens(recipe) {
  const stopwords = new Set(['avec', 'sans', 'pour', 'dans', 'base', 'recette', 'preparation', 'cuisson', 'sel', 'poivre']);
  const text = normalizeText([
    recipe.title,
    ...(recipe.categories || []),
    ...(recipe.tags || []),
    ...(recipe.ingredients || []).flatMap(group => [group.group, ...(group.items || [])])
  ].join(' '));
  return new Set(text.split(/[^a-z0-9]+/).filter(token => token.length > 3 && !stopwords.has(token)));
}

function jaccardSimilarity(a, b) {
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  a.forEach(token => {
    if (b.has(token)) intersection += 1;
  });
  return intersection / (a.size + b.size - intersection);
}

function findCatalogDuplicateSignals(summaries) {
  const tokensById = new Map(summaries.map(item => [item.id, recipeDuplicateTokens(item.recipe)]));
  const similarRecipes = [];
  for (let left = 0; left < summaries.length; left += 1) {
    for (let right = left + 1; right < summaries.length; right += 1) {
      const a = summaries[left];
      const b = summaries[right];
      const score = jaccardSimilarity(tokensById.get(a.id), tokensById.get(b.id));
      const titleA = normalizeText(a.recipe.title).replace(/\b(variante|version)\b/g, '').trim();
      const titleB = normalizeText(b.recipe.title).replace(/\b(variante|version)\b/g, '').trim();
      const sameTitle = titleA && titleA === titleB;
      if (score >= 0.62 || sameTitle) similarRecipes.push({ a, b, score: sameTitle ? Math.max(score, .88) : score });
    }
  }
  const images = new Map();
  summaries.forEach(item => {
    const image = String(item.recipe.image || '').trim();
    if (!image) return;
    if (!images.has(image)) images.set(image, []);
    images.get(image).push(item);
  });
  const imageDuplicates = Array.from(images.entries())
    .filter(([, items]) => items.length > 1)
    .map(([image, items]) => ({ image, items }));
  const ids = new Set(summaries.map(item => item.id));
  const variantIssues = summaries.flatMap(item => {
    const issues = [];
    (item.recipe.variants || []).forEach(variant => {
      if (!ids.has(variant.id)) issues.push(`${item.recipe.title || item.id} → variante absente : ${variant.id}`);
    });
    if (item.recipe.master && !ids.has(item.recipe.master)) issues.push(`${item.recipe.title || item.id} → master absent : ${item.recipe.master}`);
    return issues;
  });
  return {
    similarRecipes: similarRecipes.sort((a, b) => b.score - a.score).slice(0, 6),
    imageDuplicates: imageDuplicates.sort((a, b) => b.items.length - a.items.length).slice(0, 6),
    variantIssues: variantIssues.slice(0, 6)
  };
}

function renderCatalogHealth(visibleCount = null) {
  const target = $('#admin-health-panel');
  if (!target) return;
  const summaries = Object.entries(recipes).map(([id, recipe]) => recipeHealthSummary(id, recipe));
  if (!summaries.length) {
    target.innerHTML = `
      <div class="admin-health-empty">
        <strong>Catalogue vide</strong>
        <span>Crée une première recette pour lancer les contrôles.</span>
      </div>
    `;
    return;
  }
  const total = summaries.length;
  const weak = summaries.filter(item => item.failed.length);
  const missingImage = summaries.filter(item => item.failed.some(check => check.label === 'Image'));
  const missingConservation = summaries.filter(item => item.failed.some(check => check.label === 'Conservation'));
  const missingLinks = summaries.filter(item => item.failed.some(check => check.label === 'Liens'));
  const averageScore = Math.round(summaries.reduce((sum, item) => sum + item.qualityScore, 0) / total);
  const duplicateSignals = findCatalogDuplicateSignals(summaries);
  const allergenCounts = new Map();
  summaries.forEach(item => item.allergens.forEach(label => allergenCounts.set(label, (allergenCounts.get(label) || 0) + 1)));
  const topAllergens = Array.from(allergenCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'fr'))
    .slice(0, 4);
  const queue = weak
    .sort((a, b) => a.score - b.score || b.failed.length - a.failed.length || (a.recipe.title || a.id).localeCompare(b.recipe.title || b.id, 'fr'))
    .slice(0, 5);
  const metrics = [
    { label: 'Recettes', value: String(total), detail: visibleCount === null ? 'catalogue' : `${visibleCount} visibles` },
    { label: 'Score moyen', value: `${averageScore}%`, detail: 'qualité globale' },
    { label: 'À renforcer', value: String(weak.length), detail: `${Math.round(((total - weak.length) / total) * 100)}% OK` },
    { label: 'Images', value: String(missingImage.length), detail: 'à optimiser' },
    { label: 'Conservation', value: String(missingConservation.length), detail: 'à documenter' },
    { label: 'Liens', value: String(missingLinks.length), detail: 'à relier' },
    { label: 'Doublons', value: String(duplicateSignals.similarRecipes.length), detail: 'recettes proches' },
    { label: 'Images doublées', value: String(duplicateSignals.imageDuplicates.length), detail: 'visuels partagés' },
    { label: 'Variantes', value: String(duplicateSignals.variantIssues.length), detail: 'liens suspects' }
  ];
  const duplicateRows = [
    ...duplicateSignals.similarRecipes.map(item => `${item.a.recipe.title || item.a.id} / ${item.b.recipe.title || item.b.id} · ${Math.round(item.score * 100)}% proche`),
    ...duplicateSignals.imageDuplicates.map(item => `${item.items.length} fiches utilisent ${item.image.split('/').pop()}`),
    ...duplicateSignals.variantIssues
  ].slice(0, 8);
  target.innerHTML = `
    <div class="admin-health-head">
      <div>
        <p class="eyebrow">Qualité catalogue</p>
        <h2>Cockpit</h2>
      </div>
      <span>${escapeHtml(topAllergens.length ? topAllergens.map(([label, count]) => `${label} ${count}`).join(' · ') : 'Allergènes majeurs : aucun signal fort')}</span>
    </div>
    <div class="admin-health-metrics">
      ${metrics.map(item => `
        <article>
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value)}</strong>
          <small>${escapeHtml(item.detail)}</small>
        </article>
      `).join('')}
    </div>
    <div class="admin-health-duplicates">
      <span>Contrôle doublons</span>
      ${duplicateRows.length ? duplicateRows.map(item => `<small>${escapeHtml(item)}</small>`).join('') : '<em>Aucun doublon fort, image réutilisée ou variante cassée détecté.</em>'}
    </div>
    <div class="admin-health-queue">
      <span>Priorité</span>
      ${queue.length ? queue.map(item => `
        <button type="button" data-id="${escapeHtml(item.id)}" class="admin-health-item">
          <strong>${escapeHtml(item.recipe.title || item.id)}</strong>
          <small>${escapeHtml(item.failed.slice(0, 3).map(check => check.label).join(', '))}</small>
        </button>
      `).join('') : '<em>Tout le catalogue passe les checks principaux.</em>'}
    </div>
  `;
}

function renderDiagnostics(id, recipe) {
  const target = $('#recipe-diagnostics');
  if (!target) return;
  const role = inferDiagnosticRole(recipe);
  const aisles = inferDiagnosticAisles(recipe);
  const allergens = inferDiagnosticAllergens(recipe);
  const checks = adminQualityChecks(id, recipe);
  target.innerHTML = [
    { label: 'Rôle menu', value: role },
    { label: 'Rayons', value: aisles.length ? aisles.join(', ') : 'À déduire' },
    { label: 'Allergènes', value: allergens.length ? allergens.join(', ') : 'Aucun majeur détecté' },
    { label: 'Image', value: recipe.image ? (recipe.image.startsWith('/assets/recipes/heroes/') ? 'Optimisée' : 'À optimiser') : 'Manquante' },
    { label: 'Checks', value: `${checks.filter(item => item.ok).length}/${checks.length} OK` }
  ].map(item => `
    <article>
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
    </article>
  `).join('') + `
    <ul>
      ${checks.map(item => `<li class="${item.ok ? 'ok' : 'warn'}">${escapeHtml(item.label)} : ${escapeHtml(item.ok ? 'OK' : item.detail)}</li>`).join('')}
    </ul>
  `;
}

function renderOptions() {
  $('#category-options').innerHTML = CATEGORIES.map(item => `
    <label><input type="checkbox" name="category" value="${escapeHtml(item)}"> ${escapeHtml(item)}</label>
  `).join('');
  $('#season-options').innerHTML = SEASONS.map(item => `
    <label><input type="checkbox" name="season" value="${escapeHtml(item)}"> ${escapeHtml(item)}</label>
  `).join('');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: options.body instanceof FormData
      ? options.headers
      : { 'content-type': 'application/json', ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Erreur ${response.status}`);
  return data;
}

async function loadRecipes() {
  const data = await api('/api/admin/recipes');
  recipes = data.recipes || {};
  const first = Object.keys(recipes).sort()[0];
  renderList();
  if (activeId && recipes[activeId]) {
    selectRecipe(activeId);
  } else if (first) {
    selectRecipe(first);
  } else {
    newRecipe();
  }
}

function renderList() {
  const needle = normalizeText($('#recipe-search').value);
  const entries = Object.entries(recipes)
    .sort((a, b) => (a[1].title || a[0]).localeCompare(b[1].title || b[0], 'fr'))
    .filter(([id, recipe]) => !needle || normalizeText(`${id} ${recipe.title} ${(recipe.categories || []).join(' ')}`).includes(needle));

  $('#recipe-list').innerHTML = entries.map(([id, recipe]) => `
    <button type="button" class="admin-recipe-item ${id === activeId ? 'active' : ''}" data-id="${escapeHtml(id)}">
      <strong>${escapeHtml(recipe.title || id)}</strong>
      <small>${escapeHtml(id)} · ${escapeHtml((recipe.categories || []).join(', '))} · ${escapeHtml(DIFFICULTY[recipe.difficulty] || recipe.difficulty || '')}</small>
    </button>
  `).join('');
  renderCatalogHealth(entries.length);
}

function setChecked(name, values) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
    input.checked = values.includes(input.value);
  });
}

function getChecked(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value);
}

function ingredientsToText(groups = []) {
  return groups.map(group => [
    group.group || 'Base',
    ...(group.items || []).map(item => `- ${item}`)
  ].join('\n')).join('\n\n');
}

function textToIngredients(text) {
  return String(text || '')
    .split(/\n\s*\n/)
    .map(block => block.split('\n').map(line => line.trim()).filter(Boolean))
    .filter(lines => lines.length)
    .map(lines => {
      const group = lines[0].replace(/^-\s*/, '') || 'Base';
      const items = lines.slice(1).map(line => line.replace(/^-\s*/, '').trim()).filter(Boolean);
      return { group, items };
    })
    .filter(group => group.items.length);
}

function arrayToLines(items = []) {
  return items.join('\n');
}

function linesToArray(text) {
  return String(text || '').split('\n').map(line => line.trim()).filter(Boolean);
}

function csvToArray(text) {
  return String(text || '').split(',').map(item => item.trim()).filter(Boolean);
}

function variantsToText(items = []) {
  return items.map(item => [item.id, item.label].filter(Boolean).join(' | ')).join('\n');
}

function textToVariants(text) {
  return linesToArray(text).map(line => {
    const [rawId, ...rawLabel] = line.split('|');
    const id = slugify(rawId);
    const label = rawLabel.join('|').trim();
    return { id, ...(label ? { label } : {}) };
  }).filter(item => item.id);
}

function technicalToText(items = []) {
  return items.map(item => `${item.label || item.title || 'Point clé'}: ${item.value || item.text || ''}`).join('\n');
}

function textToTechnical(text) {
  return linesToArray(text).map(line => {
    const separator = line.indexOf(':');
    if (separator === -1) return { label: 'Point clé', value: line };
    return {
      label: line.slice(0, separator).trim() || 'Point clé',
      value: line.slice(separator + 1).trim()
    };
  }).filter(item => item.value);
}

function selectRecipe(id) {
  activeId = id;
  mode = 'edit';
  const recipe = recipes[id];
  $('#editor-title').textContent = recipe.title || id;
  fields.id.value = id;
  fields.id.disabled = true;
  fields.title.value = recipe.title || '';
  fields.difficulty.value = recipe.difficulty || 'easy';
  fields.yield.value = recipe.yield || '';
  fields.tags.value = (recipe.tags || []).join(', ');
  fields.video.value = recipe.video || '';
  fields.image.value = recipe.image || '';
  fields.master.value = recipe.master || '';
  fields.variants.value = variantsToText(recipe.variants || []);
  fields.ingredients.value = ingredientsToText(recipe.ingredients || []);
  fields.steps.value = arrayToLines(recipe.steps || []);
  fields.notes.value = arrayToLines(recipe.notes || []);
  fields.technical.value = technicalToText(recipe.technical || []);
  setChecked('category', recipe.categories || []);
  setChecked('season', recipe.seasons || []);
  updatePreview();
  renderList();
  message('');
}

function newRecipe() {
  activeId = null;
  mode = 'create';
  $('#editor-title').textContent = 'Nouvelle recette';
  fields.id.disabled = false;
  fields.id.value = '';
  fields.title.value = '';
  fields.difficulty.value = 'easy';
  fields.yield.value = '';
  fields.tags.value = '';
  fields.video.value = '';
  fields.image.value = '';
  fields.master.value = '';
  fields.variants.value = '';
  fields.ingredients.value = 'Base\n- ';
  fields.steps.value = '';
  fields.notes.value = '';
  fields.technical.value = '';
  setChecked('category', []);
  setChecked('season', ['Toutes saisons']);
  updatePreview();
  renderList();
  message('');
}

function collectRecipe() {
  const variants = textToVariants(fields.variants.value);
  return {
    title: fields.title.value.trim(),
    categories: getChecked('category'),
    seasons: getChecked('season'),
    difficulty: fields.difficulty.value,
    yield: fields.yield.value.trim(),
    ingredients: textToIngredients(fields.ingredients.value),
    steps: linesToArray(fields.steps.value),
    notes: linesToArray(fields.notes.value),
    image: fields.image.value.trim(),
    video: fields.video.value.trim(),
    tags: csvToArray(fields.tags.value),
    master: slugify(fields.master.value),
    variants,
    masterType: variants.length ? 'collection' : '',
    technical: textToTechnical(fields.technical.value)
  };
}

function validateLocal(id, recipe) {
  const errors = [];
  if (!id) errors.push('Slug requis.');
  if (!/^[a-z0-9_-]+$/.test(id)) errors.push('Slug invalide.');
  if (mode === 'create' && recipes[id]) errors.push('Slug déjà utilisé.');
  if (!recipe.title) errors.push('Titre requis.');
  if (!recipe.categories.length) errors.push('Choisir au moins une catégorie.');
  if (!recipe.seasons.length) errors.push('Choisir au moins une saison.');
  if (!recipe.ingredients.length) errors.push('Ajouter au moins un groupe ingrédients avec items.');
  if (!recipe.steps.length) errors.push('Ajouter au moins une étape.');
  recipe.variants.forEach(variant => {
    if (!recipes[variant.id]) errors.push(`Variante introuvable: ${variant.id}.`);
  });
  return errors;
}

async function saveRecipe() {
  const id = slugify(fields.id.value);
  fields.id.value = id;
  const recipe = collectRecipe();
  const errors = validateLocal(id, recipe);
  if (errors.length) {
    message(errors.join(' '), true);
    return;
  }

  const url = mode === 'create' ? '/api/admin/recipes' : `/api/admin/recipes/${encodeURIComponent(id)}`;
  const method = mode === 'create' ? 'POST' : 'PUT';
  const data = await api(url, { method, body: JSON.stringify({ id, recipe }) });
  recipes[id] = data.recipe;
  activeId = id;
  mode = 'edit';
  fields.id.disabled = true;
  renderList();
  message('Recette sauvegardée. Sauvegarde automatique créée.');
}

async function deleteRecipe() {
  if (!activeId || mode !== 'edit') return;
  const recipe = recipes[activeId];
  if (!confirm(`Supprimer "${recipe.title || activeId}" ? Une sauvegarde sera créée avant suppression.`)) return;
  await api(`/api/admin/recipes/${encodeURIComponent(activeId)}`, { method: 'DELETE' });
  delete recipes[activeId];
  message('Recette supprimée.');
  const next = Object.keys(recipes).sort()[0];
  if (next) selectRecipe(next);
  else newRecipe();
}

function duplicateRecipe() {
  if (!activeId || !recipes[activeId]) return;
  const source = recipes[activeId];
  newRecipe();
  fields.id.value = `${activeId}_copie`;
  fields.title.value = `${source.title || activeId} (copie)`;
  fields.difficulty.value = source.difficulty || 'easy';
  fields.yield.value = source.yield || '';
  fields.tags.value = (source.tags || []).join(', ');
  fields.video.value = source.video || '';
  fields.image.value = source.image || '';
  fields.master.value = source.master || '';
  fields.variants.value = variantsToText(source.variants || []);
  fields.ingredients.value = ingredientsToText(source.ingredients || []);
  fields.steps.value = arrayToLines(source.steps || []);
  fields.notes.value = arrayToLines(source.notes || []);
  fields.technical.value = technicalToText(source.technical || []);
  setChecked('category', source.categories || []);
  setChecked('season', source.seasons || []);
  updatePreview();
  message('Copie prête à sauvegarder.');
}

function updatePreview() {
  const preview = $('#image-preview');
  const url = fields.image.value.trim();
  preview.style.backgroundImage = url ? `url("${url}")` : '';
  preview.textContent = url ? '' : 'Aperçu';
  const id = mode === 'edit' ? activeId : slugify(fields.id.value || fields.title.value);
  renderDiagnostics(id, collectRecipe());
}

async function uploadImage(file) {
  if (!file) return;
  const slug = slugify(fields.id.value || fields.title.value || 'recette') || 'recette';
  const form = new FormData();
  form.append('image', file);
  message('Upload image...');
  const data = await api(`/api/admin/upload?slug=${encodeURIComponent(slug)}`, {
    method: 'POST',
    body: form
  });
  fields.image.value = data.url;
  updatePreview();
  message('Image uploadée.');
}

function bind() {
  $('#recipe-list').addEventListener('click', event => {
    const button = event.target.closest('[data-id]');
    if (button) selectRecipe(button.dataset.id);
  });
  $('#admin-health-panel').addEventListener('click', event => {
    const button = event.target.closest('[data-id]');
    if (button && recipes[button.dataset.id]) selectRecipe(button.dataset.id);
  });
  $('#recipe-search').addEventListener('input', renderList);
  $('#new-btn').addEventListener('click', newRecipe);
  $('#save-btn').addEventListener('click', () => saveRecipe().catch(error => message(error.message, true)));
  $('#delete-btn').addEventListener('click', () => deleteRecipe().catch(error => message(error.message, true)));
  $('#duplicate-btn').addEventListener('click', duplicateRecipe);
  $('#logout-btn').addEventListener('click', async () => {
    await api('/api/admin/logout', { method: 'POST', body: '{}' }).catch(() => {});
    window.location.href = '/admin-login.html';
  });
  fields.title.addEventListener('input', () => {
    if (mode === 'create' && !fields.id.value) fields.id.value = slugify(fields.title.value);
    updatePreview();
  });
  $('#recipe-form').addEventListener('input', updatePreview);
  $('#recipe-form').addEventListener('change', updatePreview);
  fields.image.addEventListener('input', updatePreview);
  $('#image-upload').addEventListener('change', event => {
    uploadImage(event.target.files[0]).catch(error => message(error.message, true));
  });
}

renderOptions();
bind();
loadRecipes().catch(error => message(error.message, true));

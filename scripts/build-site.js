const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const ROOT_FILES = [
  '_headers',
  '_redirects',
  'app.js',
  'app-images.js',
  'index.html',
  'manifest.json',
  'recipe.html',
  'recipe.js',
  'recipes.js',
  'robots.txt',
  'service-worker.js',
  'sitemap.xml',
  'style.css'
];

const ASSET_FILES = [
  'base-du-site.png',
  'base-principale-fond-site.jpg',
  'catalog-1.js',
  'catalog-2.js',
  'catalog-3.js',
  'catalog-4.js',
  'cook-note-mark.svg',
  'cook-note-white.png',
  'cook-note.png'
];

const ASSET_DIRS = [
  'recipe-card-images',
  'recipe-images-optimized',
  'vendor'
];

const PUBLIC_DIRS = [
  'downloads'
];

const SITE_URL = 'https://cook-note.pages.dev';
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
const DIFFICULTY_LABELS = { easy: 'Facile', medium: 'Intermédiaire', hard: 'Technique' };

function withinRoot(target) {
  const relative = path.relative(ROOT, target);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function ensureParent(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function copyFile(relative) {
  const source = path.join(ROOT, relative);
  const destination = path.join(DIST, relative);
  if (!fs.existsSync(source)) throw new Error(`${relative}: fichier source introuvable.`);
  ensureParent(destination);
  fs.copyFileSync(source, destination);
}

function copyDirectory(relative) {
  const source = path.join(ROOT, relative);
  const destination = path.join(DIST, relative);
  if (!fs.existsSync(source)) throw new Error(`${relative}: dossier source introuvable.`);
  fs.cpSync(source, destination, { recursive: true });
}

function loadImageManifest() {
  const context = { window: {}, Object };
  vm.createContext(context);
  vm.runInContext(
    fs.readFileSync(path.join(ROOT, 'assets', 'image-manifest.js'), 'utf8'),
    context,
    { filename: path.join(ROOT, 'assets', 'image-manifest.js') }
  );
  return context.window.COOK_NOTE_IMAGE_MANIFEST || {};
}

function loadRecipes() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(
    fs.readFileSync(path.join(ROOT, 'recipes.js'), 'utf8'),
    context,
    { filename: path.join(ROOT, 'recipes.js') }
  );
  return context.window.RECIPES || {};
}

function cacheVersion() {
  const app = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const match = app.match(/const SITE_VERSION = 'v(\d+)\.(\d+)'/);
  if (!match) throw new Error('SITE_VERSION introuvable dans app.js.');
  return `${Number(match[1])}${match[2].padStart(2, '0')}`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<span\b[^>]*data-goto=(["'])([^"']+)\1[^>]*>(.*?)<\/span>/gi, '$3')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function safeJson(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function primaryCategory(recipe) {
  return (recipe?.categories || [])[0] || 'Recette';
}

function categoryColor(recipe) {
  return CATEGORY_ACCENTS[primaryCategory(recipe)] || '#fbbf24';
}

function difficultyText(recipe) {
  return DIFFICULTY_LABELS[recipe?.difficulty] || 'Recette';
}

function variantRefs(recipe) {
  return Array.isArray(recipe?.variants) ? recipe.variants.filter(variant => variant && variant.id) : [];
}

function collectRouteRecipes(id, recipes) {
  const output = {};
  const compactRecipe = recipe => ({
    title: recipe.title,
    image: recipe.image,
    categories: recipe.categories || [],
    seasons: recipe.seasons || [],
    difficulty: recipe.difficulty,
    difficultyScore: recipe.difficultyScore,
    yield: recipe.yield,
    master: recipe.master,
    masterType: recipe.masterType
  });
  const addRecipe = (recipeId, mode = 'summary') => {
    const recipe = recipes[recipeId];
    if (recipe && !output[recipeId]) output[recipeId] = mode === 'full' ? recipe : compactRecipe(recipe);
  };
  const recipe = recipes[id];
  addRecipe(id, 'full');
  if (!recipe) return output;
  if (recipe.master) addRecipe(recipe.master);
  variantRefs(recipe).forEach(variant => addRecipe(variant.id));
  return output;
}

function recipeUrl(id) {
  return `/recette/${encodeURIComponent(id)}`;
}

function absoluteRecipeUrl(id) {
  return `${SITE_URL}${recipeUrl(id)}`;
}

function recipeImage(recipe) {
  return recipe?.image || '/assets/base-du-site.png';
}

function absoluteImageUrl(recipe) {
  return `${SITE_URL}${recipeImage(recipe)}`;
}

function recipeDescription(recipe) {
  const category = primaryCategory(recipe).toLowerCase();
  const yieldText = recipe?.yield ? ` pour ${recipe.yield}` : '';
  const ingredients = (recipe?.ingredients || [])
    .flatMap(group => group.items || [])
    .slice(0, 4)
    .map(item => stripHtml(item).replace(/^\s*\d+[.,]?\d*\s*(?:g|kg|ml|cl|l|c\.|cuill|pincée|tranche|boîte|sachet)?\s+/i, '').trim())
    .filter(Boolean)
    .join(', ');
  return `${recipe.title} sur Cook Note : recette ${category}${yieldText}${ingredients ? ` avec ${ingredients}` : ''}.`;
}

function timingFacts(recipe) {
  const steps = (recipe?.steps || []).join(' ');
  const matches = [...steps.matchAll(/(\d+)\s*(?:min|minutes?|h|heures?)/gi)];
  const minutes = matches.reduce((sum, match) => {
    const value = Number(match[1]);
    return sum + (/h|heure/i.test(match[0]) ? value * 60 : value);
  }, 0);
  if (!minutes) return '';
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest ? `${hours}h${String(rest).padStart(2, '0')}` : `${hours}h`;
  }
  return `${minutes}min`;
}

function renderList(items, tag = 'ul') {
  if (!items.length) return '';
  const children = items.map(item => `<li>${escapeHtml(stripHtml(item))}</li>`).join('');
  return `<${tag}>${children}</${tag}>`;
}

function renderIngredients(recipe) {
  const groups = recipe.ingredients || [];
  if (!groups.length) return '<p class="recipe-summary-message">Cette fiche sert de collection.</p>';
  return groups.map(group => [
    '<section class="ingredient-group">',
    `<h3>${escapeHtml(group.group || 'Base')}</h3>`,
    renderList(group.items || []),
    '</section>'
  ].join('')).join('');
}

function renderNotes(recipe) {
  const notes = (recipe.notes || []).map(stripHtml).filter(Boolean);
  if (!notes.length) return '<p class="recipe-summary-message">Notes pratiques chargées dans Cook Note.</p>';
  return renderList(notes.slice(0, 8));
}

function renderVariantCards(recipe, recipes) {
  const variants = variantRefs(recipe)
    .map(variant => ({ ref: variant, recipe: recipes[variant.id] }))
    .filter(item => item.recipe)
    .sort((a, b) => (a.ref.label || a.recipe.title).localeCompare(b.ref.label || b.recipe.title, 'fr', { sensitivity: 'base' }));
  if (!variants.length) return '';
  return [
    '<section class="recipe-summary-panel static-prerender-panel">',
    '<div class="recipe-summary-head">',
    '<div>',
    '<p class="eyebrow">Collection</p>',
    `<h2>${variants.length} fiche${variants.length > 1 ? 's' : ''} prête${variants.length > 1 ? 's' : ''}</h2>`,
    '</div>',
    '</div>',
    '<div class="variant-card-grid">',
    variants.map(({ ref, recipe: variant }) => {
      const title = ref.label || variant.title;
      const image = recipeImage(variant);
      return [
        `<a class="variant-card" style="--card-accent:${escapeHtml(categoryColor(variant))}" href="${recipeUrl(variant.id)}">`,
        `<span class="variant-card-bg" style="background-image:linear-gradient(180deg, rgba(4,4,5,.22), rgba(4,4,5,.82)), url('${escapeHtml(image)}')"></span>`,
        '<span class="variant-card-body">',
        `<span class="eyebrow">${escapeHtml(primaryCategory(variant))}</span>`,
        `<strong>${escapeHtml(title)}</strong>`,
        `<small>${escapeHtml([difficultyText(variant), variant.yield || ''].filter(Boolean).join(' · '))}</small>`,
        '</span>',
        '</a>'
      ].join('');
    }).join(''),
    '</div>',
    '</section>'
  ].join('');
}

function renderRecipeBody(recipe) {
  const steps = recipe.steps || [];
  const noteCount = (recipe.notes || []).length;
  return [
    '<div class="recipe-detail-grid static-prerender-grid">',
    '<section class="recipe-panel ingredients-panel active-tab-panel">',
    '<p class="eyebrow">Ingrédients</p>',
    `<h2>${(recipe.ingredients || []).length ? 'Liste prête' : 'Collection'}</h2>`,
    renderIngredients(recipe),
    '</section>',
    '<section class="recipe-panel steps-panel active-tab-panel">',
    '<p class="eyebrow">Étapes</p>',
    `<h2>${steps.length} étape${steps.length > 1 ? 's' : ''}</h2>`,
    renderList(steps, 'ol'),
    '</section>',
    '<section class="recipe-panel notes-panel active-tab-panel">',
    '<p class="eyebrow">Notes</p>',
    `<h2>${noteCount ? `${noteCount} note${noteCount > 1 ? 's' : ''}` : 'Repères'}</h2>`,
    renderNotes(recipe),
    '</section>',
    '</div>'
  ].join('');
}

function renderStaticRecipePage(id, recipe, recipes, version) {
  const fullRecipe = { id, ...recipe };
  const routeRecipes = collectRouteRecipes(id, recipes);
  const accent = categoryColor(fullRecipe);
  const description = recipeDescription(fullRecipe);
  const image = recipeImage(fullRecipe);
  const heroStyle = `--accent:${accent};--accent-2:${accent};background-image:linear-gradient(90deg, rgba(4,4,5,.92), rgba(4,4,5,.50)), url('${escapeHtml(image)}')`;
  const variants = renderVariantCards(fullRecipe, recipes);
  const facts = [
    difficultyText(fullRecipe),
    fullRecipe.yield || '',
    (fullRecipe.ingredients || []).length ? `${(fullRecipe.ingredients || []).flatMap(group => group.items || []).length} ingrédients` : '',
    (fullRecipe.steps || []).length ? `${(fullRecipe.steps || []).length} étapes` : '',
    timingFacts(fullRecipe)
  ].filter(Boolean);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': variantRefs(fullRecipe).length ? 'CollectionPage' : 'Recipe',
    name: fullRecipe.title,
    description,
    url: absoluteRecipeUrl(id),
    image: absoluteImageUrl(fullRecipe),
    recipeYield: fullRecipe.yield || undefined,
    recipeCategory: (fullRecipe.categories || []).join(', ') || undefined,
    recipeIngredient: (fullRecipe.ingredients || []).flatMap(group => group.items || []).map(stripHtml),
    recipeInstructions: (fullRecipe.steps || []).map(step => ({ '@type': 'HowToStep', text: stripHtml(step) }))
  };
  return [
    '<!DOCTYPE html>',
    '<html lang="fr">',
    '<head>',
    '  <meta charset="UTF-8" />',
    `  <title>${escapeHtml(fullRecipe.title)} - Cook Note</title>`,
    '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
    `  <meta name="description" content="${escapeHtml(description)}" />`,
    '  <meta name="theme-color" content="#fbbf24" />',
    '  <meta name="color-scheme" content="dark" />',
    '  <meta name="mobile-web-app-capable" content="yes" />',
    '  <meta name="apple-mobile-web-app-capable" content="yes" />',
    '  <meta name="apple-mobile-web-app-title" content="Cook Note" />',
    '  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />',
    `  <meta property="og:title" content="${escapeHtml(`${fullRecipe.title} - Cook Note`)}" />`,
    `  <meta property="og:description" content="${escapeHtml(description)}" />`,
    `  <meta property="og:type" content="${variantRefs(fullRecipe).length ? 'website' : 'article'}" />`,
    `  <meta property="og:url" content="${escapeHtml(absoluteRecipeUrl(id))}" />`,
    `  <meta property="og:image" content="${escapeHtml(absoluteImageUrl(fullRecipe))}" />`,
    '  <meta name="twitter:card" content="summary_large_image" />',
    `  <meta name="twitter:title" content="${escapeHtml(`${fullRecipe.title} - Cook Note`)}" />`,
    `  <meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `  <meta name="twitter:image" content="${escapeHtml(absoluteImageUrl(fullRecipe))}" />`,
    `  <link rel="canonical" href="${escapeHtml(absoluteRecipeUrl(id))}" />`,
    '  <link rel="manifest" href="/manifest.json" />',
    '  <link rel="icon" href="/assets/cook-note-mark.svg" type="image/svg+xml" />',
    '  <link rel="apple-touch-icon" href="/assets/cook-note.png" />',
    '  <link rel="preload" as="image" href="/assets/base-principale-fond-site.jpg" fetchpriority="high" />',
    image && `  <link rel="preload" as="image" href="${escapeHtml(image)}" fetchpriority="high" />`,
    `  <link rel="stylesheet" href="/style.css?v=${version}" />`,
    `  <script id="recipe-jsonld" type="application/ld+json">${safeJson(jsonLd)}</script>`,
    '</head>',
    '<body>',
    '  <div id="root">',
    `    <div class="mc-shell static-prerender-shell" style="--ambient-accent:${escapeHtml(accent)}">`,
    `      <main class="recipe-view static-prerender" style="--accent:${escapeHtml(accent)};--accent-2:${escapeHtml(accent)}">`,
    `        <section class="recipe-detail-hero has-photo${variantRefs(fullRecipe).length ? ' parent-hero' : ''}" style="${heroStyle}">`,
    '          <div class="detail-hero-copy">',
    variantRefs(fullRecipe).length ? '            <img class="detail-hero-logo" src="/assets/cook-note-white.png" alt="Cook Note" decoding="async" width="948" height="302" />' : '',
    `            <p class="eyebrow">${escapeHtml(primaryCategory(fullRecipe))}</p>`,
    `            <h1>${escapeHtml(fullRecipe.title)}</h1>`,
    '            <div class="detail-meta">',
    facts.map(fact => `              <span>${escapeHtml(fact)}</span>`).join(''),
    '            </div>',
    '          </div>',
    '        </section>',
    variants || renderRecipeBody(fullRecipe),
    '      </main>',
    '    </div>',
    '  </div>',
    '  <script src="/assets/vendor/react.production.min.js"></script>',
    '  <script src="/assets/vendor/react-dom.production.min.js"></script>',
    `  <script src="/assets/catalog-1.js?v=${version}"></script>`,
    `  <script src="/assets/image-manifest.js?v=${version}"></script>`,
    `  <script src="/app-images.js?v=${version}"></script>`,
    '  <script>',
    `    window.COOK_NOTE_PRERENDERED_ROUTE = ${safeJson(id)};`,
    `    window.COOK_NOTE_PRERENDERED_RECIPES = ${safeJson(routeRecipes)};`,
    '    window.RECIPES = Object.assign(window.RECIPES || {}, window.COOK_NOTE_PRERENDERED_RECIPES);',
    '  </script>',
    `  <script src="/app.js?v=${version}"></script>`,
    '  <script>',
    "    if ('serviceWorker' in navigator) {",
    `      window.addEventListener('load', () => navigator.serviceWorker.register('/service-worker.js?v=${version}').catch(() => {}));`,
    '    }',
    '  </script>',
    '</body>',
    '</html>',
    ''
  ].filter(line => line !== false && line !== '').join('\n');
}

function writeStaticRecipePages(recipes) {
  const version = cacheVersion();
  Object.entries(recipes).forEach(([id, recipe]) => {
    const destination = path.join(DIST, 'recette', encodeURIComponent(id), 'index.html');
    ensureParent(destination);
    fs.writeFileSync(destination, renderStaticRecipePage(id, recipe, recipes, version), 'utf8');
  });
}

function writeDistRedirects(recipes) {
  const base = fs.readFileSync(path.join(ROOT, '_redirects'), 'utf8').trimEnd();
  const recipeRules = Object.keys(recipes)
    .sort((left, right) => left.localeCompare(right, 'fr', { sensitivity: 'base' }))
    .flatMap(id => {
      const slug = encodeURIComponent(id);
      return [
        `/recette/${slug} /recette/${slug}/index.html 200`,
        `/recette/${slug}/ /recette/${slug}/index.html 200`
      ];
    });
  fs.writeFileSync(path.join(DIST, '_redirects'), [...recipeRules, base, ''].join('\n'), 'utf8');
}

function writeDistImageManifest() {
  const manifest = loadImageManifest();
  const productionManifest = Object.fromEntries(
    Object.entries(manifest)
      .filter(([file]) => !file.startsWith('assets/recipe-images/'))
      .sort(([left], [right]) => left.localeCompare(right, 'en'))
  );
  const text = `// Generated by scripts/build-site.js. Do not edit manually.\nwindow.COOK_NOTE_IMAGE_MANIFEST = Object.freeze(${JSON.stringify(productionManifest, null, 2)});\n`;
  const destination = path.join(DIST, 'assets', 'image-manifest.js');
  ensureParent(destination);
  fs.writeFileSync(destination, text, 'utf8');
}

if (!withinRoot(DIST)) {
  throw new Error(`Dossier dist invalide: ${DIST}`);
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

const recipes = loadRecipes();
ROOT_FILES.forEach(copyFile);
ASSET_FILES.forEach(file => copyFile(path.join('assets', file)));
ASSET_DIRS.forEach(dir => copyDirectory(path.join('assets', dir)));
PUBLIC_DIRS.forEach(copyDirectory);
writeDistImageManifest();
writeStaticRecipePages(recipes);
writeDistRedirects(recipes);

console.log('Build Cook Note OK: dist/');

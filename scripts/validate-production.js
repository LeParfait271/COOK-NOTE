const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const errors = [];
const STALE_RECIPE_IDS = [
  'coulis_fraise',
  'coulis_framboise',
  'coulis_abricot_vanille',
  'coulis_poire',
  'coulis_guide'
];
const STALE_IMAGE_PATHS = [
  'assets/recipe-images/coulis_fraise_spooky.png',
  'assets/recipe-images/coulis_framboise_spooky.png',
  'assets/recipe-images/coulis_abricot_vanille_spooky.png',
  'assets/recipe-images/coulis_poire_spooky.png',
  'assets/recipe-images/coulis_guide_spooky.png'
];
const MOJIBAKE_PATTERN = /\u00c3[\u0080-\u00bf]|\u00c2[\u0080-\u00bf]|\u00c5[\u0080-\u00bf\u0152\u0153\u0160\u0161\u0178\u017d\u017e\u2018-\u201d]|\u00e2[\u0080-\u00bf\u20ac\u201a-\u201e\u2020-\u2021\u2026\u2030\u2039\u2122]|\ufffd/;
const TEXT_FILES_TO_SCAN = [
  'index.html',
  'recipe.html',
  'app-images.js',
  'app-art-images.js',
  'theme.js',
  'i18n.js',
  'app.js',
  'recipe.js',
  'recipes.js',
  'assets/catalog-1.js',
  'assets/catalog-2.js',
  'assets/catalog-3.js',
  'assets/catalog-4.js',
  'service-worker.js',
  '_headers',
  '_redirects',
  'style.css',
  'assets/image-manifest.js',
  'manifest.json',
  'sitemap.xml',
  'robots.txt'
];

function fail(message) {
  errors.push(message);
}

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function loadRecipes() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read('recipes.js'), context, { filename: path.join(ROOT, 'recipes.js') });
  return context.window.RECIPES || {};
}

function loadCatalogRecipes() {
  const context = { window: {} };
  vm.createContext(context);
  ['assets/catalog-1.js', 'assets/catalog-2.js', 'assets/catalog-3.js', 'assets/catalog-4.js'].forEach(file => {
    vm.runInContext(read(file), context, { filename: path.join(ROOT, file) });
  });
  return context.window.RECIPES || {};
}

function staticAssetsFromServiceWorker(text) {
  const match = text.match(/const\s+STATIC_ASSETS\s*=\s*\[([\s\S]*?)\];/);
  if (!match) return null;
  const assets = [];
  for (const item of match[1].matchAll(/'([^']+)'|"([^"]+)"/g)) {
    assets.push(item[1] || item[2]);
  }
  return assets;
}

const recipes = loadRecipes();
const catalogRecipes = loadCatalogRecipes();
const recipesById = Object.fromEntries(Object.entries(recipes).map(([id, recipe]) => [id, { id, ...recipe }]));
const recipeIds = new Set(Object.keys(recipes));
const sitemap = read('sitemap.xml');
const robots = read('robots.txt');
const serviceWorker = read('service-worker.js');
const indexHtml = read('index.html');
const recipeHtml = read('recipe.html');
const packageJson = read('package.json');
const headers = read('_headers');
const redirects = read('_redirects');
const workflow = read('.github/workflows/cook-note.yml');
const buildSite = read('scripts/build-site.js');

const FORBIDDEN_INLINE_ALIASES = new Set([
  'base',
  'plat',
  'plats',
  'sauce',
  'sauces',
  'recette',
  'recettes',
  'cuisson',
  'service',
  'conservation'
]);

TEXT_FILES_TO_SCAN.forEach(file => {
  const text = read(file);
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    const intentionalMojibakeRepair = (file === 'app.js' || file === 'recipe.js') && (
      line.includes('mojibakeScore') ||
      line.includes('repairMojibakeText') ||
      line.includes('repairText') ||
      line.includes('[ÃÂâÅ') ||
      line.includes('[ÃÂÅ') ||
      line.includes('â[')
    );
    if (!intentionalMojibakeRepair && MOJIBAKE_PATTERN.test(line)) {
      fail(`${file}:${index + 1}: caracteres encodes incorrectement detectes.`);
    }
  });
});

[
  'Prévoir le temps de repos ou de froid avant le service.',
  'Préparer le matériel chaud et surveiller la coloration en fin de cuisson.',
  'Sortir 10 à 20min avant service pour détendre la texture.',
  'Plan discret',
  'Chaque four réagit différemment',
  'Stockage bocal ou boîte hermétique',
  'Stockage boîte hermétique adaptée',
  'Stockage idéalement le jour même',
  'Stockage au réfrigérateur à 0–4°C',
  'Stockage boîte hermétique au sec'
].forEach(fragment => {
  TEXT_FILES_TO_SCAN.forEach(file => {
    if (read(file).includes(fragment)) {
      fail(`${file}: texte generique ou doublon interdit (${fragment}).`);
    }
  });
});

['assets/catalog-1.js', 'assets/catalog-2.js', 'assets/catalog-3.js', 'assets/catalog-4.js'].forEach(file => {
  const text = read(file);
  if (/\ufffd/.test(text)) {
    fail(`${file}: caractere de remplacement UTF-8 detecte.`);
  }
});

const catalogIds = new Set(Object.keys(catalogRecipes));
if (catalogIds.size !== recipeIds.size) {
  fail(`catalogue frontend: nombre de recettes incoherent (${catalogIds.size} au lieu de ${recipeIds.size}).`);
}
function variantRefs(recipe) {
  return Array.isArray(recipe?.variants) ? recipe.variants.filter(variant => variant && variant.id) : [];
}

function leafVariantCount(recipe, seen = new Set()) {
  if (!recipe || seen.has(recipe.id)) return 0;
  seen.add(recipe.id);
  const refs = variantRefs(recipe);
  if (!refs.length) return recipe.id ? 1 : 0;
  return refs.reduce((sum, variant) => {
    const child = recipesById[variant.id];
    return sum + (variantRefs(child).length ? leafVariantCount(child, seen) : (child ? 1 : 0));
  }, 0);
}

function compactRecipeForCatalog(id, recipe) {
  const compact = JSON.parse(JSON.stringify({ id, ...recipe }));
  delete compact.practical;
  const leafCount = leafVariantCount({ id, ...compact });
  if (leafCount > 1) compact.leafCount = leafCount;
  return compact;
}
recipeIds.forEach(id => {
  if (!catalogIds.has(id)) {
    fail(`catalogue frontend: recette absente (${id}).`);
    return;
  }
  if (JSON.stringify(catalogRecipes[id]) !== JSON.stringify(compactRecipeForCatalog(id, recipes[id]))) {
    fail(`catalogue frontend: recette non synchronisee (${id}). Lancer node scripts/sync-catalog.js.`);
  }
});

Object.entries(recipes).forEach(([id, recipe]) => {
  if (recipe.image && /^\/assets\/recipe-images-optimized\/.*\.jpg(?:$|\?)/i.test(recipe.image)) {
    const cardImagePath = recipe.image
      .replace(/^\/assets\/recipe-images-optimized\//, 'assets/recipe-card-images/')
      .replace(/\?.*$/, '');
    if (!fs.existsSync(path.join(ROOT, cardImagePath))) {
      fail(`${id}: miniature carte introuvable (${cardImagePath}).`);
    }
  }
  (recipe.aliases || []).forEach(alias => {
    const normalized = String(alias)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
    if (FORBIDDEN_INLINE_ALIASES.has(normalized)) {
      fail(`${id}: alias trop generique interdit (${alias}).`);
    }
  });
});

const staticAssets = staticAssetsFromServiceWorker(serviceWorker);
if (!staticAssets) {
  fail('service-worker.js: STATIC_ASSETS introuvable.');
} else {
  const normalizedStaticAssets = staticAssets.map(asset => asset.split('?')[0]);
  [
    '/',
    '/index.html',
    '/recipe.html',
    '/app.js',
    '/app-images.js',
    '/app-art-images.js',
    '/theme.js',
    '/i18n.js',
    '/assets/catalog-1.js',
    '/assets/image-manifest.js',
    '/recipe.js',
    '/style.css',
    '/manifest.json',
    '/assets/vendor/react.production.min.js',
    '/assets/vendor/react-dom.production.min.js',
    '/assets/cook-note.png',
    '/assets/cook-note-white.png',
    '/assets/day/base-du-site-day.jpg',
    '/assets/day/base-principale-fond-site-day.jpg',
    '/assets/day/category-apero-day.jpg',
    '/assets/day/category-accompagnements-day.jpg',
    '/assets/day/category-bases-day.jpg',
    '/assets/day/category-desserts-day.jpg',
    '/assets/day/category-entrees-day.jpg',
    '/assets/day/category-petit-dejeuner-day.jpg',
    '/assets/day/category-plats-day.jpg',
    '/assets/day/category-sauces-day.jpg',
    '/assets/day/cook-note-day.png',
    '/assets/day/recipe-seafood-day.jpg',
    '/assets/dark/recipe-beurre_ail-dark.jpg'
  ].forEach(required => {
    if (!normalizedStaticAssets.includes(required)) fail(`service-worker.js: asset critique absent du precache (${required}).`);
  });
  staticAssets
    .filter(asset => asset !== '/' && asset.startsWith('/'))
    .forEach(asset => {
      const filePath = path.join(ROOT, asset.split('?')[0].replace(/^\/+/, ''));
      if (!fs.existsSync(filePath)) fail(`service-worker.js: asset precache introuvable (${asset}).`);
    });
}

if (!/CACHE_NAME\s*=\s*['"]cook-note-v\d+['"]/.test(serviceWorker)) {
  fail('service-worker.js: CACHE_NAME doit etre versionne en cook-note-vN.');
}
if (!/IMAGE_CACHE_NAME\s*=\s*['"]cook-note-images-v\d+['"]/.test(serviceWorker)) {
  fail('service-worker.js: IMAGE_CACHE_NAME doit etre versionne en cook-note-images-vN.');
}

const indexAssetVersions = [
  ...indexHtml.matchAll(/\b(?:app|app-images|app-art-images|theme|i18n|catalog-\d+|image-manifest|style)\.(?:js|css)\?v=(\d+)/g),
  ...indexHtml.matchAll(/\bbase-du-site\.png\?v=(\d+)/g),
  ...recipeHtml.matchAll(/\b(?:theme|i18n|recipe|recipes|style)\.(?:js|css)\?v=(\d+)/g)
].map(match => match[1]);
const swRegistrationVersion = indexHtml.match(/service-worker\.js\?v=(\d+)/)?.[1];
const swAssetVersions = [...serviceWorker.matchAll(/\b(?:app|app-images|app-art-images|theme|i18n|catalog-\d+|image-manifest|recipe|style)\.(?:js|css)\?v=(\d+)/g)].map(match => match[1]);
const swCacheVersion = serviceWorker.match(/CACHE_NAME\s*=\s*['"]cook-note-v(\d+)['"]/)?.[1];
const allAssetVersions = [...indexAssetVersions, swRegistrationVersion, ...swAssetVersions, swCacheVersion].filter(Boolean);
if (!allAssetVersions.length || new Set(allAssetVersions).size !== 1) {
  fail('index.html/service-worker.js: versions assets incoherentes.');
}

if (!robots.includes('Disallow: /admin') || !robots.includes('Disallow: /api/')) {
  fail('robots.txt: admin/api doivent rester exclus.');
}
if (!/Sitemap:\s*https?:\/\/.+\/sitemap\.xml/.test(robots)) {
  fail('robots.txt: sitemap absolu manquant.');
}

if ([indexHtml, robots, sitemap].some(text => text.includes('1c1996d6.cook-note.pages.dev'))) {
  fail('SEO: ancien domaine preview Cloudflare encore reference.');
}
if (!indexHtml.includes('https://cook-note.pages.dev/')) {
  fail('index.html: domaine canonique public absent.');
}
[
  'mobile-web-app-capable',
  'apple-mobile-web-app-capable',
  'apple-mobile-web-app-title',
  'apple-mobile-web-app-status-bar-style'
].forEach(fragment => {
  if (!indexHtml.includes(fragment)) fail(`index.html: balise PWA Apple absente (${fragment}).`);
  if (!buildSite.includes(fragment)) fail(`build-site.js: balise PWA Apple absente des pages prerendues (${fragment}).`);
});
['unpkg.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'].forEach(domain => {
  if (indexHtml.includes(domain)) fail(`index.html: dependance CDN restante (${domain}).`);
});
[
  'href="/style.css?',
  'src="/assets/vendor/react.production.min.js"',
  'src="/assets/vendor/react-dom.production.min.js"',
  'src="/assets/catalog-1.js?',
  'src="/app-images.js?',
  'src="/app-art-images.js?',
  'src="/theme.js?',
  'src="/i18n.js?',
  'src="/app.js?',
  "register('/service-worker.js?"
].forEach(fragment => {
  if (!indexHtml.includes(fragment)) fail(`index.html: chemin racine attendu absent (${fragment}).`);
});
['href="style.css', 'src="assets/vendor', 'src="recipes.js', 'src="assets/catalog-', 'src="app-images.js', 'src="app-art-images.js', 'src="theme.js', 'src="i18n.js', 'src="app.js', "register('service-worker.js"].forEach(fragment => {
  if (indexHtml.includes(fragment)) fail(`index.html: chemin relatif fragile detecte (${fragment}).`);
});

const sitemapRecipeIds = new Set();
for (const match of sitemap.matchAll(/<loc>[^<]+\/recette\/([^<]+)<\/loc>/g)) {
  sitemapRecipeIds.add(decodeURIComponent(match[1]));
}
recipeIds.forEach(id => {
  if (!sitemapRecipeIds.has(id)) fail(`sitemap.xml: recette manquante (${id}).`);
});
sitemapRecipeIds.forEach(id => {
  if (!recipeIds.has(id)) fail(`sitemap.xml: URL de recette obsolete (${id}).`);
});
if (!sitemap.includes('/techniques')) fail('sitemap.xml: page techniques absente.');

STALE_RECIPE_IDS.forEach(id => {
  if (recipeIds.has(id)) fail(`Ancienne fiche coulis interdite revenue (${id}).`);
  if (sitemap.includes(`/recette/${id}`)) fail(`sitemap.xml: ancienne fiche coulis encore referencee (${id}).`);
});
STALE_IMAGE_PATHS.forEach(asset => {
  if (fs.existsSync(path.join(ROOT, asset))) fail(`Image obsolete de coulis revenue (${asset}).`);
});

if (!packageJson.includes('scripts/validate-production.js')) {
  fail('package.json: validate-production.js doit rester branche au check.');
}
if (!packageJson.includes('scripts/validate-headers.js')) {
  fail('package.json: validate-headers.js doit rester branche au check.');
}
if (!packageJson.includes('"test:visual": "node scripts/run-visual-tests.js"')) {
  fail('package.json: script test:visual absent.');
}
if (!packageJson.includes('@playwright/test')) {
  fail('package.json: dependance Playwright absente.');
}
if (!headers.includes("Content-Security-Policy: default-src 'self'")) {
  fail('_headers: Content-Security-Policy absent.');
}
if (!headers.includes('/service-worker.js') || !headers.includes('Cache-Control: no-cache')) {
  fail('_headers: service worker doit rester en no-cache.');
}
if (!headers.includes('/recette/*') || !headers.includes('Cache-Control: no-cache')) {
  fail('_headers: pages recettes prerendue doivent rester en no-cache.');
}
if (!redirects.includes('/recette/* / 200')) {
  fail('_redirects: fallback SPA recettes absent.');
}
if (redirects.includes('/recette/* /index.html 200') || redirects.includes('/techniques/ /index.html 200')) {
  fail('_redirects: fallback Cloudflare invalide vers index.html.');
}
if (!buildSite.includes('writeStaticRecipePages') || !buildSite.includes('COOK_NOTE_PRERENDERED_RECIPES') || !buildSite.includes('writeDistRedirects')) {
  fail('build-site.js: prerendu statique des recettes absent.');
}
if (!buildSite.includes('`/recette/${slug}/ /recette/${slug} 301`')) {
  fail('build-site.js: redirection canonique des recettes avec slash final absente.');
}
if (!workflow.includes('npm run test:visual') || !workflow.includes('Upload visual smoke artifacts')) {
  fail('GitHub Actions: tests visuels Playwright absents.');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation production OK.');

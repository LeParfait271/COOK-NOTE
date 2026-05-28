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
const MOJIBAKE_PATTERN = /\u00c3[\u0080-\u00bf]|\u00c2[\u0080-\u00bf]|\u00e2[\u0080-\u00bf\u20ac\u201a-\u201e\u2020-\u2021\u2026\u2030\u2039\u2122]|\ufffd/;
const TEXT_FILES_TO_SCAN = [
  'index.html',
  'app.js',
  'recipe.js',
  'service-worker.js',
  'style.css',
  'recipes.js',
  'assets/catalog-1.js',
  'assets/catalog-2.js',
  'assets/catalog-3.js',
  'assets/catalog-4.js',
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
const recipeIds = new Set(Object.keys(recipes));
const sitemap = read('sitemap.xml');
const robots = read('robots.txt');
const serviceWorker = read('service-worker.js');
const indexHtml = read('index.html');
const packageJson = read('package.json');

TEXT_FILES_TO_SCAN.forEach(file => {
  const text = read(file);
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (MOJIBAKE_PATTERN.test(line)) {
      fail(`${file}:${index + 1}: caracteres encodes incorrectement detectes.`);
    }
  });
});

['assets/catalog-1.js', 'assets/catalog-2.js', 'assets/catalog-3.js', 'assets/catalog-4.js'].forEach(file => {
  const text = read(file);
  if (/[^\x00-\x7f]/.test(text)) {
    fail(`${file}: le catalogue frontend doit rester ASCII avec echappements unicode.`);
  }
});

const catalogIds = new Set(Object.keys(catalogRecipes));
if (catalogIds.size !== recipeIds.size) {
  fail(`catalogue frontend: nombre de recettes incoherent (${catalogIds.size} au lieu de ${recipeIds.size}).`);
}
recipeIds.forEach(id => {
  if (!catalogIds.has(id)) {
    fail(`catalogue frontend: recette absente (${id}).`);
    return;
  }
  if (JSON.stringify(catalogRecipes[id]) !== JSON.stringify(recipes[id])) {
    fail(`catalogue frontend: recette non synchronisee (${id}).`);
  }
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
    '/assets/catalog-1.js',
    '/assets/catalog-2.js',
    '/assets/catalog-3.js',
    '/assets/catalog-4.js',
    '/recipe.js',
    '/style.css',
    '/manifest.json',
    '/assets/vendor/react.production.min.js',
    '/assets/vendor/react-dom.production.min.js',
    '/assets/vendor/confetti.browser.min.js',
    '/assets/vendor/qrcode.min.js',
    '/assets/cook-note.png',
    '/assets/cook-note-white.png'
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

const indexAssetVersions = [...indexHtml.matchAll(/\b(?:app|catalog-\d+|style)\.(?:js|css)\?v=(\d+)/g)].map(match => match[1]);
const swRegistrationVersion = indexHtml.match(/service-worker\.js\?v=(\d+)/)?.[1];
const swAssetVersions = [...serviceWorker.matchAll(/\b(?:app|catalog-\d+|style)\.(?:js|css)\?v=(\d+)/g)].map(match => match[1]);
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
['unpkg.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'].forEach(domain => {
  if (indexHtml.includes(domain)) fail(`index.html: dependance CDN restante (${domain}).`);
});
[
  'href="/style.css?',
  'src="/assets/vendor/react.production.min.js"',
  'src="/assets/vendor/react-dom.production.min.js"',
  'src="/assets/vendor/confetti.browser.min.js"',
  'src="/assets/vendor/qrcode.min.js"',
  'src="/assets/catalog-1.js?',
  'src="/assets/catalog-2.js?',
  'src="/assets/catalog-3.js?',
  'src="/assets/catalog-4.js?',
  'src="/app.js?',
  "register('/service-worker.js?"
].forEach(fragment => {
  if (!indexHtml.includes(fragment)) fail(`index.html: chemin racine attendu absent (${fragment}).`);
});
['href="style.css', 'src="assets/vendor', 'src="recipes.js', 'src="assets/catalog-', 'src="app.js', "register('service-worker.js"].forEach(fragment => {
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

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation production OK.');

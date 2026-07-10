const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const errors = [];

const REQUIRED_FILES = [
  '_headers',
  '_redirects',
  'app.js',
  'app-techniques.js',
  'app-images.js',
  'app-art-images.js',
  'theme.js',
  'i18n.js',
  'assets/brand/app-icon.png',
  'assets/brand/mark.svg',
  'assets/catalog-1.js',
  'assets/catalog-2.js',
  'assets/catalog-3.js',
  'assets/catalog-4.js',
  'assets/theme/dark/global/background.jpg',
  'assets/theme/dark/global/hero.png',
  'assets/theme/dark/global/logo.png',
  'assets/theme/day/global/background.jpg',
  'assets/theme/day/global/hero.jpg',
  'assets/theme/day/global/logo.png',
  'assets/theme/day/categories/apero_maitre.jpg',
  'assets/theme/day/categories/accompagnements_maitre.jpg',
  'assets/theme/day/categories/elements_base_maitre.jpg',
  'assets/theme/day/categories/desserts_maitre.jpg',
  'assets/theme/day/categories/entrees_maitre.jpg',
  'assets/theme/day/categories/petit_dejeuner_maitre.jpg',
  'assets/theme/day/categories/plats_maitre.jpg',
  'assets/theme/day/categories/sauces_maitre.jpg',
  'assets/image-manifest.js',
  'assets/vendor/react.production.min.js',
  'assets/vendor/react-dom.production.min.js',
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

const FORBIDDEN_PATHS = [
  '.git',
  '.github',
  'admin.html',
  'admin-login.html',
  'admin.js',
  'admin.css',
  'admin.local.example.json',
  'assets/recipes/masters',
  'backups',
  'docs',
  'node_modules',
  'package.json',
  'playwright.config.js',
  'reports',
  'scripts',
  'test-results',
  'tests'
];

function fail(message) {
  errors.push(message);
}

function exists(relative) {
  return fs.existsSync(path.join(DIST, relative));
}

function read(relative) {
  return fs.readFileSync(path.join(DIST, relative), 'utf8');
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

function normalizeAssetPath(asset) {
  return asset
    .split('?')[0]
    .replace(/^\/+/, '');
}

function loadScriptObject(relative, key) {
  const context = { window: {}, Object };
  vm.createContext(context);
  vm.runInContext(read(relative), context, { filename: path.join(DIST, relative) });
  return context.window[key] || {};
}

function loadRecipesFromDist() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read('recipes.js'), context, { filename: path.join(DIST, 'recipes.js') });
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

if (!fs.existsSync(DIST)) {
  fail('dist/: dossier absent. Lancer npm run build.');
} else {
  REQUIRED_FILES.forEach(file => {
    if (!exists(file)) fail(`dist/${file}: fichier requis absent.`);
  });

  FORBIDDEN_PATHS.forEach(file => {
    if (exists(file)) fail(`dist/${file}: fichier ou dossier source interdit dans le build.`);
  });

  const recipes = exists('recipes.js') ? loadRecipesFromDist() : {};
  const redirects = exists('_redirects') ? read('_redirects') : '';
  redirects.split(/\r?\n/).forEach((line, index) => {
    const clean = line.trim();
    if (!clean || clean.startsWith('#')) return;
    if (/^\/(?:recette\/\*|techniques\/)\s+\/index\.html\s+200\b/.test(clean)) {
      fail(`dist/_redirects:${index + 1}: fallback Cloudflare invalide vers index.html.`);
    }
  });
  Object.entries(recipes).forEach(([id, recipe]) => {
    const image = recipe?.image;
    if (!image || !image.startsWith('/assets/recipes/heroes/')) {
      fail(`${id}: image production absente ou non optimisee.`);
      return;
    }
    const optimized = normalizeAssetPath(image);
    const card = optimized
      .replace(/^assets\/recipes\/heroes\//, 'assets/recipes/cards/')
      .replace(/\.(?:png|jpe?g|webp)$/i, '.jpg');
    if (!exists(optimized)) fail(`dist/${optimized}: image optimisee manquante (${id}).`);
    if (!exists(card)) fail(`dist/${card}: miniature manquante (${id}).`);

    const slug = encodeURIComponent(id);
    const prerenderedPage = `recette/${slug}/index.html`;
    if (!exists(prerenderedPage)) {
      fail(`dist/${prerenderedPage}: page recette prerendue manquante (${id}).`);
    } else {
      const prerenderedHtml = read(prerenderedPage);
      if (!prerenderedHtml.includes('COOK_NOTE_PRERENDERED_RECIPES')) {
        fail(`dist/${prerenderedPage}: donnees de boot recette absentes.`);
      }
      if (!prerenderedHtml.includes(`>${escapeHtml(recipe.title)} - Cook Note</title>`)) {
        fail(`dist/${prerenderedPage}: titre recette prerendu incoherent.`);
      }
      if (prerenderedHtml.includes('loading-screen')) {
        fail(`dist/${prerenderedPage}: loader bloquant interdit dans une page prerendue.`);
      }
    }
    if (!redirects.includes(`/recette/${slug} /recette/${slug}/ 301`)) {
      fail(`dist/_redirects: redirection recette sans slash absente (${id}).`);
    }
    if (!redirects.includes(`/recette/${slug}/ /recette/${slug}/index.html 200`)) {
      fail(`dist/_redirects: route statique recette absente (${id}).`);
    }
  });

  const manifest = exists('assets/image-manifest.js')
    ? loadScriptObject('assets/image-manifest.js', 'COOK_NOTE_IMAGE_MANIFEST')
    : {};
  Object.keys(manifest).forEach(file => {
    if (file.startsWith('assets/recipes/masters/')) {
      fail(`dist/assets/image-manifest.js: master PNG publie dans le manifest (${file}).`);
    }
    if (!exists(file)) fail(`dist/${file}: fichier liste dans le manifest absent.`);
  });

  if (exists('service-worker.js')) {
    const staticAssets = staticAssetsFromServiceWorker(read('service-worker.js'));
    if (!staticAssets) {
      fail('dist/service-worker.js: STATIC_ASSETS introuvable.');
    } else {
      staticAssets
        .filter(asset => asset !== '/' && asset.startsWith('/'))
        .forEach(asset => {
          const file = normalizeAssetPath(asset);
          if (!exists(file)) fail(`dist/${file}: asset precache absent.`);
        });
    }
  }

  ['index.html', 'recipe.html', 'app-art-images.js', 'app-techniques.js', 'theme.js', 'i18n.js', 'recipes.js', 'service-worker.js', 'style.css'].forEach(file => {
    if (exists(file) && /\ufffd/.test(read(file))) {
      fail(`dist/${file}: caractere de remplacement UTF-8 detecte.`);
    }
  });
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation dist OK.');

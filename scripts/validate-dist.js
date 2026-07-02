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
  'app-images.js',
  'theme.js',
  'i18n.js',
  'assets/base-du-site.png',
  'assets/base-principale-fond-site.jpg',
  'assets/catalog-1.js',
  'assets/catalog-2.js',
  'assets/catalog-3.js',
  'assets/catalog-4.js',
  'assets/cook-note-mark.svg',
  'assets/cook-note-white.png',
  'assets/cook-note.png',
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
  'assets/recipe-images',
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
  Object.entries(recipes).forEach(([id, recipe]) => {
    const image = recipe?.image;
    if (!image || !image.startsWith('/assets/recipe-images-optimized/')) {
      fail(`${id}: image production absente ou non optimisee.`);
      return;
    }
    const optimized = normalizeAssetPath(image);
    const card = optimized
      .replace(/^assets\/recipe-images-optimized\//, 'assets/recipe-card-images/')
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
    if (!redirects.includes(`/recette/${slug} /recette/${slug}/index.html 200`)) {
      fail(`dist/_redirects: route statique recette absente (${id}).`);
    }
  });

  const manifest = exists('assets/image-manifest.js')
    ? loadScriptObject('assets/image-manifest.js', 'COOK_NOTE_IMAGE_MANIFEST')
    : {};
  Object.keys(manifest).forEach(file => {
    if (file.startsWith('assets/recipe-images/')) {
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

  ['index.html', 'recipe.html', 'theme.js', 'i18n.js', 'recipes.js', 'service-worker.js', 'style.css'].forEach(file => {
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

const fs = require('node:fs');
const path = require('node:path');
const babel = require('@babel/core');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const LEGACY_DIST = path.join(ROOT, 'android-legacy', 'build', 'generated', 'cook-note-www');
const CORE_JS_SOURCE = path.join(ROOT, 'node_modules', 'core-js-bundle', 'minified.js');
const CORE_JS_TARGET = path.join(LEGACY_DIST, 'assets', 'vendor', 'core-js-bundle.min.js');

const JS_FILES = [
  'app.js',
  'app-images.js',
  'recipe.js',
  'recipes.js',
  'assets/catalog-1.js',
  'assets/catalog-2.js',
  'assets/catalog-3.js',
  'assets/catalog-4.js',
  'assets/image-manifest.js'
];

const LEGACY_LOADER_SCRIPT = `  <script>
    (function () {
      window.__cookNoteReady = function () {
        var ls = document.getElementById('loading-screen');
        if (!ls) return;
        ls.style.pointerEvents = 'none';
        ls.style.opacity = '0';
        ls.style.display = 'none';
        if (ls.parentNode) ls.parentNode.removeChild(ls);
      };

      function hideLoaderWhenRootReady() {
        var root = document.getElementById('root');
        if (root && root.children && root.children.length > 0) {
          window.__cookNoteReady();
          return true;
        }
        return false;
      }

      setTimeout(function () {
        if (!hideLoaderWhenRootReady()) setTimeout(hideLoaderWhenRootReady, 120);
      }, 0);

      setTimeout(function () {
        var ls = document.getElementById('loading-screen');
        if (!ls) return;
        ls.style.transition = 'opacity 0.4s ease';
        ls.style.opacity = '0';
        setTimeout(function () {
          if (!ls.parentNode) return;
          ls.innerHTML = '<div style="color:#ef4444;font-family:Arial,sans-serif;text-align:center;padding:20px"><p style="font-size:18px;font-weight:700">Erreur de chargement</p><p style="font-size:13px;opacity:.75;margin-top:8px">Relance Cook Note. Si le blocage revient, installe la derniere APK Android 5.</p><button onclick="location.reload()" style="margin-top:16px;padding:10px 20px;background:#fbbf24;border:0;border-radius:8px;cursor:pointer;font-weight:700">Recharger</button></div>';
          ls.style.opacity = '1';
          ls.style.background = '#111';
        }, 450);
      }, 8000);
    }());
  </script>`;

const LEGACY_NO_SW_SCRIPT = '  <script>/* Service worker disabled in Android Legacy local assets. */</script>';

function ensureParent(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  ensureParent(file);
  fs.writeFileSync(file, content, 'utf8');
}

function copyDist() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    throw new Error('dist/index.html introuvable. Lance npm run build avant les assets Android Legacy.');
  }
  fs.rmSync(LEGACY_DIST, { recursive: true, force: true });
  fs.cpSync(DIST, LEGACY_DIST, { recursive: true });
}

function transformJs(relativePath) {
  const target = path.join(LEGACY_DIST, relativePath);
  if (!fs.existsSync(target)) throw new Error(`${relativePath}: fichier JS introuvable dans les assets Legacy.`);
  const result = babel.transformSync(read(target), {
    filename: relativePath,
    babelrc: false,
    configFile: false,
    sourceType: 'script',
    comments: false,
    compact: false,
    presets: [[require.resolve('@babel/preset-env'), {
      targets: { chrome: '37', android: '5' },
      modules: false,
      useBuiltIns: false
    }]]
  });
  write(target, result.code.endsWith('\n') ? result.code : `${result.code}\n`);
}

function injectCoreJs(html) {
  if (html.includes('/assets/vendor/core-js-bundle.min.js')) return html;
  const tag = '  <script src="/assets/vendor/core-js-bundle.min.js"></script>\n';
  if (html.includes('<script src="/assets/vendor/react.production.min.js"></script>')) {
    return html.replace('  <script src="/assets/vendor/react.production.min.js"></script>', `${tag}  <script src="/assets/vendor/react.production.min.js"></script>`);
  }
  if (html.includes('<script src="/recipes.js')) {
    return html.replace(/  <script src="\/recipes\.js\?v=\d+"><\/script>/, match => `${tag}${match}`);
  }
  return html;
}

function disableServiceWorker(html) {
  return html.replace(/  <script>\s*if \('serviceWorker' in navigator\)[\s\S]*?<\/script>/g, html.includes('id="loading-screen"') ? LEGACY_LOADER_SCRIPT : LEGACY_NO_SW_SCRIPT);
}

function patchHtml(file) {
  let html = read(file);
  html = injectCoreJs(html);
  html = disableServiceWorker(html);
  write(file, html);
}

function patchHtmlFiles() {
  const stack = [LEGACY_DIST];
  while (stack.length) {
    const current = stack.pop();
    fs.readdirSync(current, { withFileTypes: true }).forEach(entry => {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        patchHtml(fullPath);
      }
    });
  }
}

function copyPolyfill() {
  if (!fs.existsSync(CORE_JS_SOURCE)) {
    throw new Error('core-js-bundle introuvable. Lance npm install avant de builder Android Legacy.');
  }
  fs.copyFileSync(CORE_JS_SOURCE, CORE_JS_TARGET);
}

copyDist();
copyPolyfill();
JS_FILES.forEach(transformJs);
patchHtmlFiles();

console.log(`Assets Android Legacy compatibles WebView ancien OK: ${LEGACY_DIST}`);

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
const LEGACY_RUNTIME_SCRIPT = `  <script>
    (function () {
      function showLegacyError(message) {
        var root = document.getElementById('root') || document.body;
        if (!root || document.getElementById('cook-note-legacy-error')) return;
        var panel = document.createElement('div');
        panel.id = 'cook-note-legacy-error';
        panel.style.cssText = [
          'position:fixed',
          'left:12px',
          'right:12px',
          'top:12px',
          'z-index:100001',
          'padding:14px',
          'border:1px solid #fbbf24',
          'border-radius:8px',
          'background:#120f0a',
          'color:#fff7ed',
          'font:14px/1.45 Arial,sans-serif',
          'box-shadow:0 12px 34px rgba(0,0,0,.52)'
        ].join(';');
        panel.innerHTML = '<strong style="color:#fbbf24">Cook Note Android 5</strong><br>' + String(message || 'Erreur inconnue');
        root.appendChild(panel);
      }

      window.onerror = function (message, source, line, column) {
        showLegacyError(String(message || 'Erreur JavaScript') + ' ligne ' + (line || '?'));
        return false;
      };

      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
          return setTimeout(function () { callback(Date.now()); }, 16);
        };
      }
      if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) { clearTimeout(id); };
      }

      if (!window.URLSearchParams) {
        window.URLSearchParams = function (query) {
          this._items = {};
          query = String(query || '').replace(/^\\?/, '');
          if (!query) return;
          var parts = query.split('&');
          for (var i = 0; i < parts.length; i += 1) {
            if (!parts[i]) continue;
            var pair = parts[i].split('=');
            var key = decodeURIComponent((pair[0] || '').replace(/\\+/g, ' '));
            var value = decodeURIComponent((pair.slice(1).join('=') || '').replace(/\\+/g, ' '));
            if (key) this._items[key] = value;
          }
        };
        window.URLSearchParams.prototype.get = function (key) {
          return Object.prototype.hasOwnProperty.call(this._items, key) ? this._items[key] : null;
        };
        window.URLSearchParams.prototype.set = function (key, value) {
          this._items[key] = String(value);
        };
        window.URLSearchParams.prototype.toString = function () {
          var output = [];
          for (var key in this._items) {
            if (Object.prototype.hasOwnProperty.call(this._items, key)) {
              output.push(encodeURIComponent(key) + '=' + encodeURIComponent(this._items[key]));
            }
          }
          return output.join('&');
        };
      }

      if (!window.URL) {
        window.URL = function (url, base) {
          var value = String(url || '');
          var baseText = String(base || window.location.href || '');
          var originMatch = baseText.match(/^[a-z][a-z0-9+.-]*:\\/\\/[^\\/?#]+/i);
          if (value.charAt(0) === '/' && originMatch) {
            value = originMatch[0] + value;
          } else if (!/^[a-z][a-z0-9+.-]*:/i.test(value) && baseText) {
            value = baseText.replace(/[?#].*$/, '').replace(/\\/[^\\/]*$/, '/') + value;
          }
          var link = document.createElement('a');
          link.href = value;
          this.href = link.href;
          this.protocol = link.protocol;
          this.host = link.host;
          this.hostname = link.hostname;
          this.port = link.port;
          this.pathname = link.pathname.charAt(0) === '/' ? link.pathname : '/' + link.pathname;
          this.search = link.search;
          this.hash = link.hash;
          this.origin = this.protocol + '//' + this.host;
        };
      }

      var nativeScrollTo = window.scrollTo;
      window.scrollTo = function (x, y) {
        if (x && typeof x === 'object') {
          return nativeScrollTo.call(window, Number(x.left || 0), Number(x.top || 0));
        }
        return nativeScrollTo.call(window, x || 0, y || 0);
      };
    }());
  </script>`;

const LEGACY_CSS_OVERRIDES = `

/* Android Legacy WebView fallback: Chrome 37 has no CSS variables/color-mix/grid. */
html,
body,
#root,
.mc-shell {
  min-height: 100vh !important;
  background-color: #050505 !important;
  color: #fff7ed !important;
}

.mc-shell {
  background: #050505 url("/assets/base-principale-fond-site.jpg") center top / cover no-repeat !important;
}

.mc-shell,
.mc-shell * {
  text-shadow: none;
}

.app-header,
.hero-panel,
.content-card,
.recipe-card,
.category-card,
.modal-panel,
.search-panel,
.recipe-panel,
.ingredients-panel,
.notes-panel,
.install-panel,
.footer-install-card {
  background-color: rgba(18, 18, 16, .96) !important;
  border-color: rgba(251, 191, 36, .28) !important;
  color: #fff7ed !important;
}

.recipe-grid > *,
.mc-quick-picks > *,
.category-grid > *,
.cards-grid > *,
.filters-grid > *,
.recipe-layout > *,
.techniques-layout > *,
.content-grid > * {
  margin-bottom: 14px !important;
}

.recipe-card-title,
.category-card-title,
.section-title,
.hero-title,
.recipe-title,
h1,
h2,
h3 {
  color: #fff7ed !important;
}

.muted,
.recipe-meta,
.category-meta,
.eyebrow,
.section-kicker {
  color: #cfc6b8 !important;
}

.button-primary,
.pill-active,
.tab-active,
button[aria-current="true"] {
  background: #f59e0b !important;
  border-color: #fbbf24 !important;
  color: #151108 !important;
}

img {
  opacity: 1 !important;
}
`;

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

function splitTopLevel(input, separator) {
  const output = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === separator && depth === 0) {
      output.push(input.slice(start, index).trim());
      start = index + 1;
    }
  }
  output.push(input.slice(start).trim());
  return output;
}

function replaceFunctionCalls(input, functionName, replacer) {
  const needle = `${functionName}(`;
  let output = '';
  let cursor = 0;
  while (cursor < input.length) {
    const start = input.indexOf(needle, cursor);
    if (start === -1) {
      output += input.slice(cursor);
      break;
    }

    output += input.slice(cursor, start);
    let depth = 0;
    let end = -1;
    for (let index = start + functionName.length; index < input.length; index += 1) {
      const char = input[index];
      if (char === '(') depth += 1;
      if (char === ')') {
        depth -= 1;
        if (depth === 0) {
          end = index;
          break;
        }
      }
    }

    if (end === -1) {
      output += input.slice(start);
      break;
    }

    output += replacer(input.slice(start + functionName.length + 1, end));
    cursor = end + 1;
  }
  return output;
}

function extractColor(part) {
  const trimmed = part.trim();
  if (/transparent/i.test(trimmed)) return 'transparent';
  const rgbaMatch = trimmed.match(/rgba?\([^)]+\)/i);
  if (rgbaMatch) return rgbaMatch[0];
  const hexMatch = trimmed.match(/#[0-9a-f]{3,8}/i);
  if (hexMatch) return hexMatch[0];
  const wordMatch = trimmed.match(/\b(white|black|red|orange|yellow|green|blue|purple)\b/i);
  return wordMatch ? wordMatch[0] : trimmed.replace(/\s+\d+%.*$/, '');
}

function alphaColor(color, alpha) {
  const hex = color.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const value = hex[1];
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const rgba = color.match(/^rgba?\(([^)]+)\)$/i);
  if (rgba) {
    const parts = rgba[1].split(',').map(part => part.trim());
    return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
  }
  return color;
}

function colorMixFallback(inner) {
  const parts = splitTopLevel(inner, ',');
  const firstColorPart = parts[1] || parts[0] || '#fff7ed';
  const secondColorPart = parts[2] || '';
  const firstColor = extractColor(firstColorPart);
  const secondColor = extractColor(secondColorPart);
  const percent = firstColorPart.match(/(\d+(?:\.\d+)?)%/);
  if (secondColor === 'transparent' && percent) {
    return alphaColor(firstColor, Math.max(0, Math.min(1, Number(percent[1]) / 100)));
  }
  if (firstColor === 'transparent') return secondColor === 'transparent' ? 'transparent' : secondColor;
  return firstColor === 'transparent' ? '#fff7ed' : firstColor;
}

function collectCssVariables(css) {
  const variables = {};
  css.replace(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi, (match, name, value) => {
    variables[`--${name}`] = value.trim();
    return match;
  });
  return variables;
}

function resolveCssValue(value, variables, seen = new Set()) {
  let resolved = value;
  for (let pass = 0; pass < 8; pass += 1) {
    let changed = false;
    resolved = resolved.replace(/var\(\s*(--[a-z0-9-]+)(?:\s*,\s*([^)]+))?\s*\)/gi, (match, name, fallback = '') => {
      if (seen.has(name)) return fallback || '#fff7ed';
      const variableValue = variables[name];
      if (!variableValue) return fallback || '#fff7ed';
      changed = true;
      const nextSeen = new Set(seen);
      nextSeen.add(name);
      return resolveCssValue(variableValue, variables, nextSeen);
    });
    if (!changed) break;
  }
  return resolved;
}

function legacyCss(css) {
  const variables = collectCssVariables(css);
  let output = resolveCssValue(css, variables);
  output = replaceFunctionCalls(output, 'color-mix', colorMixFallback);
  output = replaceFunctionCalls(output, 'clamp', inner => splitTopLevel(inner, ',')[1] || splitTopLevel(inner, ',')[0] || '16px');
  output = replaceFunctionCalls(output, 'min', inner => splitTopLevel(inner, ',').slice(-1)[0] || '100%');
  output = replaceFunctionCalls(output, 'max', inner => splitTopLevel(inner, ',').slice(-1)[0] || '100%');
  output = output
    .replace(/display\s*:\s*grid\s*;/gi, 'display: block;')
    .replace(/^\s*grid-[a-z-]+\s*:[^;]+;\s*$/gmi, '')
    .replace(/^\s*(?:-webkit-)?backdrop-filter\s*:[^;]+;\s*$/gmi, '')
    .replace(/^\s*content-visibility\s*:[^;]+;\s*$/gmi, '')
    .replace(/^\s*contain\s*:[^;]+;\s*$/gmi, '')
    .replace(/^\s*scrollbar-width\s*:[^;]+;\s*$/gmi, '');
  return `${output}\n${LEGACY_CSS_OVERRIDES}`;
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
  const runtimeTag = LEGACY_RUNTIME_SCRIPT + '\n';
  if (html.includes('cook-note-legacy-error')) return html;
  const tag = `  <script src="/assets/vendor/core-js-bundle.min.js"></script>\n${runtimeTag}`;
  if (html.includes('/assets/vendor/core-js-bundle.min.js')) {
    return html.replace('  <script src="/assets/vendor/core-js-bundle.min.js"></script>', `  <script src="/assets/vendor/core-js-bundle.min.js"></script>\n${runtimeTag}`);
  }
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

function patchCss() {
  const cssPath = path.join(LEGACY_DIST, 'style.css');
  write(cssPath, legacyCss(read(cssPath)));
}

copyDist();
copyPolyfill();
JS_FILES.forEach(transformJs);
patchCss();
patchHtmlFiles();

console.log(`Assets Android Legacy compatibles WebView ancien OK: ${LEGACY_DIST}`);

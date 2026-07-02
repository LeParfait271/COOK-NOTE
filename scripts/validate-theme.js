const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const errors = [];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function fail(message) {
  errors.push(message);
}

function expect(message, condition) {
  if (!condition) fail(message);
}

function loadTheme(prefersLight = false) {
  const store = new Map();
  const documentElement = {
    dataset: {},
    style: {}
  };
  const context = {
    window: {
      localStorage: {
        getItem: key => store.get(key) || null,
        setItem: (key, value) => { store.set(key, String(value)); }
      },
      document: {
        documentElement,
        querySelector: () => ({ setAttribute() {} })
      },
      matchMedia: () => ({
        matches: prefersLight,
        addEventListener() {}
      }),
      dispatchEvent() {},
      CustomEvent: function CustomEvent(type, init) {
        return { type, detail: init?.detail };
      }
    },
    CustomEvent: function CustomEvent(type, init) {
      return { type, detail: init?.detail };
    }
  };
  vm.createContext(context);
  vm.runInContext(read('theme.js'), context, { filename: 'theme.js' });
  return { api: context.window.CookNoteTheme, documentElement, store };
}

const darkRuntime = loadTheme(false);
expect('CookNoteTheme global absent.', Boolean(darkRuntime.api));
expect('Themes dark/light absents.', darkRuntime.api?.themes?.includes('dark') && darkRuntime.api?.themes?.includes('light'));
expect('Theme par defaut incorrect.', darkRuntime.api?.defaultTheme === 'dark');
expect('Theme sombre non applique par defaut.', darkRuntime.documentElement.dataset.theme === 'dark');

const lightRuntime = loadTheme(true);
expect('prefers-color-scheme light non detecte.', lightRuntime.documentElement.dataset.theme === 'light');
lightRuntime.api.setTheme('dark');
expect('setTheme dark inactif.', lightRuntime.documentElement.dataset.theme === 'dark');
expect('Preference theme non persistee.', /"theme":"dark"/.test(lightRuntime.store.get('cook_note_preferences') || ''));

const style = read('style.css');
expect('Tokens theme clair absents.', style.includes(':root[data-theme="light"]'));
expect('Token color-scheme absent.', style.includes('--ds-color-scheme'));
expect('Background shell non tokenise.', style.includes('--ds-shell-background') && style.includes('background: var(--ds-shell-background)'));
expect('Theme light shell absent.', style.includes('.mc-shell.theme-light'));
expect('Surfaces light non couvertes.', style.includes('.mc-shell.theme-light :where(.site-footer-inner'));

const app = read('app.js');
expect('Runtime theme non branche dans app.js.', app.includes('CookNoteTheme') && app.includes('activeTheme') && app.includes('toggleTheme'));
expect('Theme non expose dans la topbar.', app.includes('theme-toggle-btn') && app.includes('Passer en mode jour') && app.includes('Passer en mode nuit'));
expect('Theme absent des preferences.', app.includes("'Thème'") && app.includes("update({ theme: 'light' })"));
expect('Shell theme non marque.', app.includes("'data-theme': activeTheme") && app.includes("theme-light"));

const index = read('index.html');
const recipe = read('recipe.html');
const buildSite = read('scripts/build-site.js');
const serviceWorker = read('service-worker.js');
const server = read('server.js');
const preflight = read('scripts/preflight.js');
const packageJson = read('package.json');

expect('theme.js non charge dans index.html.', index.includes('/theme.js?v='));
expect('theme.js doit charger avant style.css dans index.html.', index.indexOf('/theme.js?v=') < index.indexOf('/style.css?v='));
expect('theme.js non charge dans recipe.html.', recipe.includes('/theme.js?v='));
expect('theme.js doit charger avant style.css dans recipe.html.', recipe.indexOf('/theme.js?v=') < recipe.indexOf('/style.css?v='));
expect('Meta color-scheme non ouverte.', index.includes('content="dark light"') && recipe.includes('content="dark light"'));
expect('theme.js non copie dans dist.', buildSite.includes("'theme.js'"));
expect('theme.js absent des pages prerendues.', buildSite.includes('/theme.js?v=${version}'));
expect('theme.js non precache.', serviceWorker.includes('/theme.js?v='));
expect('theme.js non network-first.', serviceWorker.includes("'/theme.js'"));
expect('theme.js non servi localement.', server.includes("'theme.js'"));
expect('theme.js non teste en preflight.', preflight.includes('/theme.js?v=${version}'));
expect('Validation theme non branchee au check.', packageJson.includes('scripts/validate-theme.js'));

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation theme OK.');

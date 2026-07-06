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
    style: {
      values: {},
      setProperty(key, value) {
        this.values[key] = value;
      }
    }
  };
  const context = {
    window: {
      localStorage: {
        getItem: key => store.get(key) || null,
        setItem: (key, value) => { store.set(key, String(value)); }
      },
      document: {
        documentElement,
        querySelector: () => ({ setAttribute() {} }),
        querySelectorAll: () => [],
        addEventListener() {}
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
expect('Direction artistique nuit non appliquee.', darkRuntime.documentElement.dataset.artDirection === 'night');
expect('Asset hero nuit incorrect.', darkRuntime.api?.asset?.('hero') === '/assets/theme/dark/global/hero.png');
expect('Variables art direction absentes.', darkRuntime.documentElement.style.values['--art-background-image'] === 'url("/assets/theme/dark/global/background.jpg")');

const lightRuntime = loadTheme(true);
expect('prefers-color-scheme light ne doit pas remplacer le dark mode par defaut.', lightRuntime.documentElement.dataset.theme === 'dark');
lightRuntime.api.setTheme('light');
expect('Theme jour manuel non applique.', lightRuntime.documentElement.dataset.theme === 'light');
expect('Direction artistique jour non appliquee.', lightRuntime.documentElement.dataset.artDirection === 'day');
expect('Assets jour valides non actifs.', lightRuntime.api?.dayAssetsApproved === true && lightRuntime.documentElement.dataset.artAssets === 'approved');
expect('Asset hero jour incorrect.', lightRuntime.api?.asset?.('hero') === '/assets/theme/day/global/hero.jpg');
expect('Logo jour incorrect.', lightRuntime.api?.asset?.('logo') === '/assets/theme/day/global/logo.png');
expect('Variables jour non branchees.', lightRuntime.documentElement.style.values['--art-background-image'] === 'url("/assets/theme/day/global/background.jpg")');
lightRuntime.api.setTheme('dark');
expect('setTheme dark inactif.', lightRuntime.documentElement.dataset.theme === 'dark');
expect('Preference theme non persistee.', /"theme":"dark"/.test(lightRuntime.store.get('cook_note_preferences') || ''));

const style = read('style.css');
expect('Tokens theme clair absents.', style.includes(':root[data-theme="light"]'));
expect('Token color-scheme absent.', style.includes('--ds-color-scheme'));
expect('Tokens art direction absents.', style.includes('--art-background-image') && style.includes('--art-hero-image') && style.includes('--art-logo-image'));
expect('Background art direction non tokenise.', style.includes('var(--art-background-image) center top'));
expect('Background shell non tokenise.', style.includes('--ds-shell-background') && style.includes('background: var(--ds-shell-background)'));
expect('Theme light shell absent.', style.includes('.mc-shell.theme-light'));
expect('Surfaces light non couvertes.', style.includes('.mc-shell.theme-light :where(.site-footer-inner'));
expect('Logo jour non style.', style.includes('mix-blend-mode:multiply'));

const app = read('app.js');
const appArtImages = read('app-art-images.js');
const appArtContext = { window: {}, Object };
vm.createContext(appArtContext);
vm.runInContext(appArtImages, appArtContext, { filename: 'app-art-images.js' });
const themeRecipeArt = appArtContext.window.COOK_NOTE_THEME_RECIPE_ART || {};
const darkRecipeArt = Object.values(themeRecipeArt.dark || {});
const lightRecipeArt = Object.values(themeRecipeArt.light || {});
expect('Runtime theme non branche dans app.js.', app.includes('CookNoteTheme') && app.includes('activeTheme') && app.includes('toggleTheme'));
expect('Assets art direction non branches dans app.js.', app.includes('FALLBACK_ART_ASSETS') && app.includes('THEME_RECIPE_ART_IMAGES') && app.includes('displayRecipeImage') && app.includes('function artAsset') && app.includes("artAsset('hero'") && app.includes("artAsset('logo'"));
expect('Runtime images theme absent.', appArtImages.includes('COOK_NOTE_THEME_RECIPE_ART') && lightRecipeArt.some(url => url.includes('/assets/theme/day/')) && darkRecipeArt.some(url => url.includes('/assets/theme/dark/')));
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
expect('app-art-images.js non charge dans index.html.', index.includes('/app-art-images.js?v='));
expect('theme.js doit charger avant style.css dans index.html.', index.indexOf('/theme.js?v=') < index.indexOf('/style.css?v='));
expect('Version assets art direction absente dans index.html.', index.includes('COOK_NOTE_ASSET_VERSION'));
expect('Assets art direction absents dans index.html.', index.includes('data-art-asset="hero"') && index.includes('data-art-asset="background"') && index.includes('data-art-asset="appIcon"'));
expect('theme.js non charge dans recipe.html.', recipe.includes('/theme.js?v='));
expect('theme.js doit charger avant style.css dans recipe.html.', recipe.indexOf('/theme.js?v=') < recipe.indexOf('/style.css?v='));
expect('Version assets art direction absente dans recipe.html.', recipe.includes('COOK_NOTE_ASSET_VERSION'));
expect('Meta color-scheme non ouverte.', index.includes('content="dark light"') && recipe.includes('content="dark light"'));
expect('theme.js non copie dans dist.', buildSite.includes("'theme.js'"));
expect('app-art-images.js non copie dans dist.', buildSite.includes("'app-art-images.js'"));
expect('theme.js absent des pages prerendues.', buildSite.includes('/theme.js?v=${version}'));
expect('app-art-images.js absent des pages prerendues.', buildSite.includes('/app-art-images.js?v=${version}'));
expect('Assets art direction absents des pages prerendues.', buildSite.includes('OPTIONAL_ASSET_DIRS') && buildSite.includes('data-art-asset="background"') && buildSite.includes('data-art-asset="logo"'));
expect('theme.js non precache.', serviceWorker.includes('/theme.js?v='));
expect('app-art-images.js non precache.', serviceWorker.includes('/app-art-images.js?v='));
expect('theme.js non network-first.', serviceWorker.includes("'/theme.js'"));
expect('app-art-images.js non network-first.', serviceWorker.includes("'/app-art-images.js'"));
expect('theme.js non servi localement.', server.includes("'theme.js'"));
expect('theme.js non teste en preflight.', preflight.includes('/theme.js?v=${version}'));
expect('Validation theme non branchee au check.', packageJson.includes('scripts/validate-theme.js'));

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation theme OK.');

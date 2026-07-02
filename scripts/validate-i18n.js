const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const errors = [];

function read(relative) {
  return fs.readFileSync(path.join(ROOT, relative), 'utf8');
}

function expect(message, condition) {
  if (!condition) errors.push(message);
}

function loadI18n() {
  const context = {
    window: {
      location: { href: 'https://cook-note.pages.dev/', search: '', pathname: '/', hash: '' },
      navigator: { language: 'fr-FR', languages: ['fr-FR'] },
      localStorage: { getItem() { return ''; }, setItem() {} },
      document: {
        documentElement: { lang: '', dataset: {} },
        head: { appendChild() {} },
        getElementById() { return null; },
        createElement() {
          return { set rel(value) { this._rel = value; }, set hreflang(value) { this._hreflang = value; } };
        }
      },
      addEventListener() {},
      dispatchEvent() {}
    },
    CustomEvent: function CustomEvent(type, init) {
      return { type, detail: init?.detail };
    }
  };
  vm.createContext(context);
  vm.runInContext(read('i18n.js'), context, { filename: 'i18n.js' });
  return context.window.CookNoteI18n;
}

function flattenKeys(object, prefix = '') {
  return Object.keys(object || {}).flatMap(key => {
    const pathKey = prefix ? `${prefix}.${key}` : key;
    const value = object[key];
    return value && typeof value === 'object' && !Array.isArray(value)
      ? flattenKeys(value, pathKey)
      : [pathKey];
  });
}

const i18n = loadI18n();
const app = read('app.js');
const index = read('index.html');
const recipeHtml = read('recipe.html');
const serviceWorker = read('service-worker.js');
const buildSite = read('scripts/build-site.js');
const packageJson = read('package.json');

expect('CookNoteI18n global absent.', Boolean(i18n));
expect('Locales FR/EN absentes.', i18n?.supportedLocales?.includes('fr') && i18n?.supportedLocales?.includes('en'));
expect('Locale par defaut incorrecte.', i18n?.defaultLocale === 'fr');

const frKeys = flattenKeys(i18n.messages?.fr).sort();
const enKeys = flattenKeys(i18n.messages?.en).sort();
expect('Catalogue i18n FR vide.', frKeys.length > 0);
expect('Catalogue i18n EN vide.', enKeys.length > 0);
expect('Catalogues i18n FR/EN non synchronises.', JSON.stringify(frKeys) === JSON.stringify(enKeys));

const phraseCount = Object.keys(i18n.phrases?.en || {}).length;
expect('Catalogue de phrases UI EN trop faible.', phraseCount >= 120);
expect('Regles dynamiques i18n trop faibles.', Number(i18n.dynamicRuleCount) >= 20);
i18n.setLocale('en');
expect('Traduction de base inactive.', i18n.text('Accueil') === 'Home');
expect('Traduction par cle inactive.', i18n.t('language.selector') === 'Language');
expect('Traduction dynamique inactive.', i18n.text('3 recettes') === '3 recipes');

const staticKeys = new Set(frKeys);
for (const match of app.matchAll(/\bt\(\s*['"`]([^'"`]+)['"`]/g)) {
  const key = match[1];
  if (key.includes('${')) continue;
  expect(`Cle i18n utilisee mais absente: ${key}`, staticKeys.has(key));
}

expect('Runtime i18n non branche dans app.js.', app.includes('CookNoteI18n') && app.includes('translateUiText') && app.includes('repairReactChildText') && app.includes('repairReactProps'));
expect('Hook locale React absent.', app.includes('useI18nLocale') && app.includes('CookNoteI18n.subscribe'));
expect('Selecteur de langue absent.', app.includes('function LanguageSwitcher') && app.includes('language-switcher') && app.includes('supportedLocales'));
expect('SEO i18n absent.', app.includes("t('site.description')") && app.includes("t('seo.techniques.description')") && app.includes('ensureAlternateLinks'));

expect('i18n.js non charge dans index.html.', index.includes('/i18n.js?v='));
expect('hreflang FR absent.', index.includes('hreflang="fr"'));
expect('hreflang EN absent.', index.includes('hreflang="en"'));
expect('hreflang x-default absent.', index.includes('hreflang="x-default"'));
expect('Bouton update SW non localise.', index.includes('CookNoteI18n?.text'));

expect('i18n.js non copie dans dist.', buildSite.includes("'i18n.js'"));
expect('i18n.js non precache.', serviceWorker.includes('/i18n.js?v='));
expect('i18n.js non network-first.', serviceWorker.includes("'/i18n.js'"));
expect('Page recipe legacy non marquee i18n.', recipeHtml.includes('data-i18n-phrase') && recipeHtml.includes('localizeDocument'));
expect('Validation i18n non branchee au check.', packageJson.includes('scripts/validate-i18n.js'));

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation i18n OK.');

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { readAppSource, readStyleSource } = require('./lib/app-modules');

const ROOT = path.resolve(__dirname, '..');
const errors = [];

function read(relative) {
  return fs.readFileSync(path.join(ROOT, relative), 'utf8');
}

function expect(message, condition) {
  if (!condition) errors.push(message);
}

function loadI18n() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read('i18n.js'), context, { filename: 'i18n.js' });
  return context.window.CookNoteI18n;
}

// Le site est en francais uniquement depuis la v5.33. L'anglais sera refait a
// neuf plus tard : ce validateur bloque tout retour partiel de l'ancienne
// traduction automatique.
const i18n = loadI18n();
const i18nSource = read('i18n.js');
const app = readAppSource();
const index = read('index.html');
const recipeHtml = read('recipe.html');
const recipeJs = read('recipe.js');
const notFound = read('404.html');
const style = readStyleSource();
const serviceWorker = read('service-worker.js');
const buildSite = read('scripts/build-site.js');
const packageJson = read('package.json');

expect('CookNoteI18n global absent.', Boolean(i18n) && typeof i18n.t === 'function');
const keys = Object.keys(i18n?.messages || {});
expect('Catalogue de textes FR vide.', keys.length > 0);
expect('Catalogue de textes FR mal structure (une seule langue attendue).', keys.every(key => typeof i18n.messages[key] === 'string'));
expect('Interpolation i18n inactive.', i18n.t('search.results', { count: 3, plural: 's', query: 'tarte' }) === '3 résultats pour "tarte"');
expect('Cle absente non rendue telle quelle.', i18n.t('cle.inconnue') === 'cle.inconnue');

const staticKeys = new Set(keys);
for (const source of [app, recipeJs, read('app-personal-tools.js')]) {
  for (const match of source.matchAll(/\bt\(\s*['"`]([^'"`]+)['"`]/g)) {
    const key = match[1];
    if (key.includes('${') || key.endsWith('.')) continue;
    expect(`Cle i18n utilisee mais absente: ${key}`, staticKeys.has(key));
  }
}

const englishLeftovers = [
  ['i18n.js', i18nSource, /\ben\s*:|phraseEn|translateRecipeText|setLocale|supportedLocales/],
  ['app.js', app, /translateUiText|LanguageSwitcher|useI18nLocale|CookNoteI18n\.(?:text|locale|setLocale|subscribe|ensureAlternateLinks|translateCategory)|=== 'en'/],
  ['recipe.js', recipeJs, /CookNoteI18n\.(?:text|locale|localizeDocument)|=== 'en'/],
  ['recipe.html', recipeHtml, /data-i18n-|localizeDocument/],
  ['index.html', index, /hreflang|CookNoteI18n\?\.text|lang=en/],
  ['404.html', notFound, /data-en|lang=en/],
  ['styles/', style, /language-switcher|language-toggle|data-locale='en'/]
];
englishLeftovers.forEach(([file, source, pattern]) => {
  expect(`${file}: reste de l'ancienne traduction anglaise (${pattern}).`, !pattern.test(source));
});

expect('Pages statiques non declarees en francais.', index.includes('<html lang="fr"') && recipeHtml.includes('<html lang="fr"') && notFound.includes('<html lang="fr"'));
expect('i18n.js non charge dans index.html.', index.includes('/i18n.js?v='));
expect('i18n.js non copie dans dist.', buildSite.includes("'i18n.js'"));
expect('i18n.js non precache.', serviceWorker.includes('/i18n.js?v='));
expect('i18n.js non network-first.', serviceWorker.includes("'/i18n.js'"));
expect('Validation i18n non branchee au check.', packageJson.includes('scripts/validate-i18n.js'));

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validation i18n OK (francais seul, ${keys.length} cles).`);

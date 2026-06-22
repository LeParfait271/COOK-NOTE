const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const CATALOG_FILES = [
  'assets/catalog-1.js',
  'assets/catalog-2.js',
  'assets/catalog-3.js',
  'assets/catalog-4.js'
];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function loadRecipesFrom(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read(file), context, { filename: path.join(ROOT, file) });
  return context.window.RECIPES || {};
}

function escapeAscii(value) {
  return value.replace(/[\u007f-\uffff]/g, char =>
    `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`
  );
}

const recipes = loadRecipesFrom('recipes.js');
const currentChunks = CATALOG_FILES.map(file => Object.keys(loadRecipesFrom(file)));
const knownIds = new Set(currentChunks.flat());
const missingIds = Object.keys(recipes).filter(id => !knownIds.has(id));
if (missingIds.length) currentChunks[currentChunks.length - 1].push(...missingIds);

CATALOG_FILES.forEach((file, index) => {
  const ids = currentChunks[index].filter(id => recipes[id]);
  const chunk = Object.fromEntries(ids.map(id => [id, recipes[id]]));
  const json = JSON.stringify(chunk);
  const text = [
    `// Cook Note - catalogue recettes chunk ${index + 1}/${CATALOG_FILES.length}`,
    `window.RECIPES = Object.assign(window.RECIPES || {}, ${json});`,
    ''
  ].join('\n');
  fs.writeFileSync(path.join(ROOT, file), escapeAscii(text), 'utf8');
  console.log(`${file}: ${ids.length} recettes`);
});

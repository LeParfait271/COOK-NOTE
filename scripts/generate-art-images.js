const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const OUT_FILE = path.join(ROOT, 'app-art-images.js');

const CATEGORY_DAY_IMAGES = Object.freeze({
  'category-accompagnements-day.jpg': 'accompagnements_maitre',
  'category-apero-day.jpg': 'apero_maitre',
  'category-bases-day.jpg': 'elements_base_maitre',
  'category-desserts-day.jpg': 'desserts_maitre',
  'category-entrees-day.jpg': 'entrees_maitre',
  'category-petit-dejeuner-day.jpg': 'petit_dejeuner_maitre',
  'category-plats-day.jpg': 'plats_maitre',
  'category-sauces-day.jpg': 'sauces_maitre'
});

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function currentNumericVersion() {
  const app = read('app.js');
  const match = app.match(/const SITE_VERSION = 'v(\d+)\.(\d+)'/);
  if (!match) throw new Error('SITE_VERSION introuvable dans app.js.');
  return `${Number(match[1])}${match[2].padStart(2, '0')}`;
}

function cleanVersion(url, numeric) {
  return String(url || '').replace(/\?v=\d+$/, `?v=${numeric}`);
}

function loadInlineDayMap(numeric) {
  const app = read('app.js');
  const match = app.match(/const\s+DAY_RECIPE_ART_IMAGES\s*=\s*Object\.freeze\(\{([\s\S]*?)\}\);/);
  if (!match) return {};
  const map = {};
  for (const item of match[1].matchAll(/([a-z0-9_]+):\s*'([^']+)'/gi)) {
    map[item[1]] = cleanVersion(item[2], numeric);
  }
  return map;
}

function loadExistingRuntimeMap(numeric) {
  if (!fs.existsSync(OUT_FILE)) return { dark: {}, light: {} };
  const context = { window: {}, Object };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(OUT_FILE, 'utf8'), context, { filename: OUT_FILE });
  const source = context.window.COOK_NOTE_THEME_RECIPE_ART || {};
  return {
    dark: Object.fromEntries(Object.entries(source.dark || {}).map(([id, url]) => [id, cleanVersion(url, numeric)])),
    light: Object.fromEntries(Object.entries(source.light || {}).map(([id, url]) => [id, cleanVersion(url, numeric)]))
  };
}

function loadRecipes() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read('recipes.js'), context, { filename: path.join(ROOT, 'recipes.js') });
  return context.window.RECIPES || {};
}

function recipeHasVariants(recipe) {
  return Array.isArray(recipe?.variants) && recipe.variants.some(variant => variant?.id);
}

function usesOriginalParentImage(recipe) {
  return Boolean(recipe && (recipe.masterType === 'collection' || recipeHasVariants(recipe)));
}

function listFiles(relative) {
  const dir = path.join(ROOT, relative);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isFile());
}

function addDayFiles(map, numeric) {
  const recipeIds = new Set(Object.keys(loadRecipes()));
  listFiles('assets/day').forEach(file => {
    if (/^recipe-.+-day\.jpg$/i.test(file)) {
      const id = file.replace(/^recipe-/i, '').replace(/-day\.jpg$/i, '');
      if (recipeIds.has(id)) map[id] = `/assets/day/${file}?v=${numeric}`;
    }
    const categoryId = CATEGORY_DAY_IMAGES[file];
    if (categoryId) map[categoryId] = `/assets/day/${file}?v=${numeric}`;
  });
}

function addDarkFiles(map, numeric) {
  const recipeIds = new Set(Object.keys(loadRecipes()));
  listFiles('assets/dark').forEach(file => {
    if (!/^recipe-.+-dark\.jpg$/i.test(file)) return;
    const id = file.replace(/^recipe-/i, '').replace(/-dark\.jpg$/i, '');
    if (recipeIds.has(id)) map[id] = `/assets/dark/${file}?v=${numeric}`;
  });
}

function filterDisplayArtRecipes(map, recipes) {
  return Object.fromEntries(Object.entries(map).filter(([id]) => recipes[id] && !usesOriginalParentImage(recipes[id])));
}

function renderMap(map, indent) {
  return Object.entries(map)
    .sort(([left], [right]) => left.localeCompare(right, 'fr', { sensitivity: 'base' }))
    .map(([id, url]) => `${indent}${id}: '${url}'`)
    .join(',\n');
}

const numeric = currentNumericVersion();
const recipes = loadRecipes();
const maps = loadExistingRuntimeMap(numeric);
maps.light = { ...loadInlineDayMap(numeric), ...maps.light };
addDayFiles(maps.light, numeric);
addDarkFiles(maps.dark, numeric);
maps.light = filterDisplayArtRecipes(maps.light, recipes);
maps.dark = filterDisplayArtRecipes(maps.dark, recipes);

const text = `/* global window */

(function initCookNoteArtImages() {
  'use strict';

  window.COOK_NOTE_THEME_RECIPE_ART = Object.freeze({
    dark: Object.freeze({
${renderMap(maps.dark, '      ')}
    }),
    light: Object.freeze({
${renderMap(maps.light, '      ')}
    })
  });
}());
`;

fs.writeFileSync(OUT_FILE, text, 'utf8');
console.log(`Images art generees: dark=${Object.keys(maps.dark).length}, light=${Object.keys(maps.light).length}`);

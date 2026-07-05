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

const DARK_PARENT_IMAGE_OVERRIDES = Object.freeze({
  accompagnements_maitre: 'recipe-accompagnements_maitre-dark.jpg',
  apero_maitre: 'recipe-apero_maitre-dark.jpg',
  desserts_maitre: 'recipe-desserts_maitre-dark.jpg',
  elements_base_maitre: 'recipe-elements_base_maitre-dark.jpg',
  entrees_maitre: 'recipe-entrees_maitre-dark.jpg',
  petit_dejeuner_maitre: 'recipe-petit_dejeuner_maitre-dark.jpg',
  plats_maitre: 'recipe-plats_maitre-dark.jpg',
  sauces_maitre: 'recipe-sauces_maitre-dark.jpg'
});

const PARENT_ART_REVISION = 'parent-title';

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
  return String(url || '').replace(/\?v=\d+(?:-[a-z0-9-]+)?$/i, `?v=${numeric}`);
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
  });
  Object.entries(CATEGORY_DAY_IMAGES).forEach(([file, id]) => {
    if (recipeIds.has(id) && fs.existsSync(path.join(ROOT, 'assets/day', file))) {
      map[id] = `/assets/day/${file}?v=${numeric}-${PARENT_ART_REVISION}`;
    }
  });
}

function addDarkFiles(map, numeric) {
  const recipeIds = new Set(Object.keys(loadRecipes()));
  listFiles('assets/dark').forEach(file => {
    if (!/^recipe-.+-dark\.jpg$/i.test(file)) return;
    const id = file.replace(/^recipe-/i, '').replace(/-dark\.jpg$/i, '');
    if (recipeIds.has(id)) map[id] = `/assets/dark/${file}?v=${numeric}`;
  });
  Object.entries(DARK_PARENT_IMAGE_OVERRIDES).forEach(([id, file]) => {
    if (recipeIds.has(id) && fs.existsSync(path.join(ROOT, 'assets/dark', file))) {
      map[id] = `/assets/dark/${file}?v=${numeric}-${PARENT_ART_REVISION}`;
    }
  });
}

function filterDisplayArtRecipes(map, recipes) {
  return Object.fromEntries(Object.entries(map).filter(([id]) => recipes[id]));
}

function compactMapPayload(map, dir, suffix, numericVersion) {
  const ids = [];
  const extra = {};
  Object.entries(map)
    .sort(([left], [right]) => left.localeCompare(right, 'fr', { sensitivity: 'base' }))
    .forEach(([id, url]) => {
      const expected = `/assets/${dir}/recipe-${id}-${suffix}.jpg?v=${numericVersion}`;
      if (url === expected) {
        ids.push(id);
      } else {
        extra[id] = url;
      }
    });
  return { ids, extra };
}

const numeric = currentNumericVersion();
const recipes = loadRecipes();
const maps = loadExistingRuntimeMap(numeric);
maps.light = { ...loadInlineDayMap(numeric), ...maps.light };
addDayFiles(maps.light, numeric);
addDarkFiles(maps.dark, numeric);
maps.light = filterDisplayArtRecipes(maps.light, recipes);
maps.dark = filterDisplayArtRecipes(maps.dark, recipes);

const darkPayload = compactMapPayload(maps.dark, 'dark', 'dark', numeric);
const lightPayload = compactMapPayload(maps.light, 'day', 'day', numeric);
const text = `/* global window */\n(function initCookNoteArtImages(){'use strict';const v='${numeric}',m=(ids,d,s,e)=>Object.freeze(Object.assign(Object.fromEntries(ids.map(id=>[id,'/assets/'+d+'/recipe-'+id+'-'+s+'.jpg?v='+v])),e));window.COOK_NOTE_THEME_RECIPE_ART=Object.freeze({dark:m(${JSON.stringify(darkPayload.ids)},'dark','dark',${JSON.stringify(darkPayload.extra)}),light:m(${JSON.stringify(lightPayload.ids)},'day','day',${JSON.stringify(lightPayload.extra)})});}());\n`;

fs.writeFileSync(OUT_FILE, text, 'utf8');
console.log(`Images art generees: dark=${Object.keys(maps.dark).length}, light=${Object.keys(maps.light).length}`);

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const RECIPE_FILE = 'recipes.js';

const CATEGORY_ROOTS = new Map([
  ['apero', 'apero_maitre'],
  ['aperitif', 'apero_maitre'],
  ['aperitifs', 'apero_maitre'],
  ['entree', 'entrees_maitre'],
  ['entrees', 'entrees_maitre'],
  ['plat', 'plats_maitre'],
  ['plats', 'plats_maitre'],
  ['accompagnement', 'accompagnements_maitre'],
  ['accompagnements', 'accompagnements_maitre'],
  ['dessert', 'desserts_maitre'],
  ['desserts', 'desserts_maitre'],
  ['petit dejeuner', 'petit_dejeuner_maitre'],
  ['petits dejeuners', 'petit_dejeuner_maitre'],
  ['sauce', 'sauces_maitre'],
  ['sauces', 'sauces_maitre'],
  ['base', 'elements_base_maitre'],
  ['bases', 'elements_base_maitre']
]);

const ROOT_LABELS = {
  apero_maitre: 'Apero',
  entrees_maitre: 'Entrees',
  plats_maitre: 'Plats',
  accompagnements_maitre: 'Accompagnements',
  desserts_maitre: 'Desserts',
  petit_dejeuner_maitre: 'Petits-dejeuners',
  sauces_maitre: 'Sauces',
  elements_base_maitre: 'Base'
};

const ROOT_IDS = new Set(CATEGORY_ROOTS.values());

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function loadRecipes() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read(RECIPE_FILE), context, { filename: path.join(ROOT, RECIPE_FILE) });
  const raw = context.window.RECIPES;
  if (!raw || typeof raw !== 'object') throw new Error('window.RECIPES introuvable.');
  return Object.fromEntries(Object.entries(raw).map(([id, recipe]) => [id, { ...recipe, id: recipe.id || id }]));
}

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2019']/g, ' ')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();
}

function isMaster(recipe) {
  return Array.isArray(recipe?.variants) && recipe.variants.length > 0;
}

function categoriesOf(recipe) {
  return [...new Set([...(recipe.categories || []), recipe.category].filter(Boolean))];
}

function parentIdsOf(recipe) {
  return [...new Set([recipe.master, ...(recipe.additionalMasters || [])].filter(Boolean))];
}

function formatRoots(roots) {
  return [...roots].map(root => ROOT_LABELS[root] || root).join(', ') || 'aucune';
}

const recipes = loadRecipes();
const ids = new Set(Object.keys(recipes));
const masterIds = new Set(Object.entries(recipes).filter(([, recipe]) => isMaster(recipe)).map(([id]) => id));
const errors = [];

masterIds.forEach(parentId => {
  if (!ROOT_IDS.has(parentId)) errors.push(`${parentId}: fiche parente intermediaire interdite; rattacher directement ses recettes a une fiche racine.`);
});

ROOT_IDS.forEach(rootId => {
  if (!ids.has(rootId)) errors.push(`${rootId}: fiche racine introuvable.`);
  else if (!masterIds.has(rootId)) errors.push(`${rootId}: fiche racine sans variantes.`);
});

const directParents = new Map();
const directChildren = new Map();

Object.entries(recipes).forEach(([parentId, parent]) => {
  if (!isMaster(parent)) return;
  const childIds = new Set();
  const labels = new Map();
  directChildren.set(parentId, childIds);

  parent.variants.forEach((variant, index) => {
    if (!variant?.id) {
      errors.push(`${parentId}: variante ${index + 1} sans id.`);
      return;
    }
    if (!ids.has(variant.id)) {
      errors.push(`${parentId}: variante introuvable (${variant.id}).`);
      return;
    }
    if (childIds.has(variant.id)) errors.push(`${parentId}: variante dupliquee (${variant.id}).`);
    childIds.add(variant.id);

    const child = recipes[variant.id];
    if (variant.label !== child.title) {
      errors.push(`${parentId}: label incoherent pour ${variant.id} (${variant.label || 'vide'} au lieu de ${child.title || 'titre manquant'}).`);
    }

    const labelKey = normalize(variant.label);
    if (labelKey && labels.has(labelKey)) {
      errors.push(`${parentId}: libelle de variante duplique (${variant.label}) pour ${labels.get(labelKey)} et ${variant.id}.`);
    }
    labels.set(labelKey, variant.id);

    if (!directParents.has(variant.id)) directParents.set(variant.id, []);
    directParents.get(variant.id).push(parentId);
  });
});

const recursiveCache = new Map();

function recursiveChildrenOf(parentId, seen = new Set()) {
  if (recursiveCache.has(parentId)) return recursiveCache.get(parentId);
  const children = new Set();
  if (seen.has(parentId)) {
    errors.push(`${parentId}: cycle detecte dans les variantes.`);
    return children;
  }
  seen.add(parentId);

  (recipes[parentId]?.variants || []).forEach(variant => {
    if (!variant?.id || !ids.has(variant.id)) return;
    children.add(variant.id);
    if (isMaster(recipes[variant.id])) {
      recursiveChildrenOf(variant.id, new Set(seen)).forEach(childId => children.add(childId));
    }
  });

  recursiveCache.set(parentId, children);
  return children;
}

function reaches(parentId, childId) {
  return recursiveChildrenOf(parentId).has(childId);
}

function rootFor(parentId) {
  let current = parentId;
  const seen = new Set();

  while (current && ids.has(current) && !ROOT_IDS.has(current)) {
    if (seen.has(current)) {
      errors.push(`${parentId}: cycle detecte en remontant vers la racine (${current}).`);
      return null;
    }
    seen.add(current);
    current = recipes[current].master;
  }

  return ROOT_IDS.has(current) ? current : null;
}

function expectedRootsFor(recipe) {
  const roots = new Set();
  categoriesOf(recipe).forEach(category => {
    const root = CATEGORY_ROOTS.get(normalize(category));
    if (root) roots.add(root);
  });
  return roots;
}

function actualRootsFor(recipe) {
  const roots = new Set();
  parentIdsOf(recipe).forEach(parentId => {
    const root = rootFor(parentId);
    if (root) roots.add(root);
  });
  return roots;
}

Object.entries(recipes).forEach(([id, recipe]) => {
  if (!recipe.title) errors.push(`${id}: titre manquant.`);

  if (!ROOT_IDS.has(id) && !recipe.master && !isMaster(recipe)) {
    errors.push(`${id}: recette individuelle sans fiche parent.`);
  }

  parentIdsOf(recipe).forEach(parentId => {
    if (!ids.has(parentId)) {
      errors.push(`${id}: fiche parent introuvable (${parentId}).`);
      return;
    }
    if (!masterIds.has(parentId)) {
      errors.push(`${id}: fiche parent non-maitre (${parentId}).`);
      return;
    }
    if (!reaches(parentId, id)) {
      errors.push(`${id}: declare sous ${parentId}, mais absent de ses variantes.`);
    }
  });

  if (recipe.master) {
    const directSet = directChildren.get(recipe.master);
    if (directSet && !directSet.has(id)) {
      errors.push(`${id}: master direct ${recipe.master}, mais la fiche n'est pas listee directement dans ses variantes.`);
    }
  }

  if (!ROOT_IDS.has(id)) {
    const expectedRoots = expectedRootsFor(recipe);
    const actualRoots = actualRootsFor(recipe);
    expectedRoots.forEach(root => {
      if (!actualRoots.has(root)) {
        errors.push(`${id}: categorie ${ROOT_LABELS[root]} sans rattachement a cette fiche racine (rattache: ${formatRoots(actualRoots)}).`);
      }
    });
    actualRoots.forEach(root => {
      if (expectedRoots.size && !expectedRoots.has(root)) {
        errors.push(`${id}: rattache a ${ROOT_LABELS[root]} sans categorie correspondante (categories: ${categoriesOf(recipe).join(', ') || 'aucune'}).`);
      }
    });
  }
});

directParents.forEach((parents, childId) => {
  const child = recipes[childId];
  const declaredParents = parentIdsOf(child);

  parents.forEach(parentId => {
    const parentIsAncestor = declaredParents.some(declaredParent => reaches(parentId, declaredParent));
    if (!declaredParents.includes(parentId) && !parentIsAncestor) {
      errors.push(`${childId}: liste dans ${parentId}, mais absent de master/additionalMasters.`);
    }
  });
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validation fiches parent OK (${ids.size} fiches, ${masterIds.size} parents).`);

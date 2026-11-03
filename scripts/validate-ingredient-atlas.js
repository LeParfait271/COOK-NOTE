// Atlas des ingredients : chaque ligne d'ingredient de chaque recette doit etre
// reconnue par une fiche (assets/ingredients/atlas-*.js), et chaque fiche doit
// etre complete. Ajouter une recette avec un nouvel ingredient = ajouter sa
// fiche, sinon ce controle echoue (npm run check).
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const ATLAS_DIR = path.join(ROOT, 'assets', 'ingredients');

function loadAtlas(context) {
  vm.runInContext(fs.readFileSync(path.join(ATLAS_DIR, 'atlas-core.js'), 'utf8'), context, { filename: 'atlas-core.js' });
  // Dans le navigateur window est la portee globale ; ici on l'expose aussi.
  context.cookNoteAtlas = context.window.cookNoteAtlas;
  atlasFiles().forEach(file => vm.runInContext(fs.readFileSync(path.join(ATLAS_DIR, file), 'utf8'), context, { filename: file }));
  return context.window.cookNoteAtlas;
}

function atlasFiles() {
  return fs.readdirSync(ATLAS_DIR).filter(file => /^atlas-(?!core).+\.js$/.test(file)).sort();
}

function main() {
  const context = { window: { RECIPES: {} }, console };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'recipes.js'), 'utf8'), context, { filename: 'recipes.js' });
  const atlas = loadAtlas(context);
  const families = new Set(atlas.FAMILIES.map(family => family.id));
  const problems = [];
  const listed = [...atlas.FILES].sort().join(',');
  if (listed !== atlasFiles().join(',')) problems.push('atlas-core.js : FILES doit lister exactement les fichiers assets/ingredients/atlas-*.js.');

  atlas.entries.forEach(entry => {
    if (!entry.id || !/^[a-z0-9-]+$/.test(entry.id)) problems.push(`Fiche sans id valide : ${entry.name}`);
    if (!entry.name) problems.push(`Fiche sans nom : ${entry.id}`);
    if (!families.has(entry.family)) problems.push(`Famille inconnue pour ${entry.id} : ${entry.family}`);
    atlas.FIELDS.forEach(field => {
      if (!String(entry[field] || '').trim()) problems.push(`Fiche ${entry.id} : champ « ${field} » vide`);
    });
  });

  const unmatched = new Map();
  const used = new Set();
  Object.entries(context.window.RECIPES).forEach(([id, recipe]) => {
    (recipe.ingredients || []).forEach(group => (group.items || []).forEach(item => {
      if (atlas.ignored(item)) return;
      const found = atlas.match(item);
      if (!found.length) {
        const key = String(item).replace(/<[^>]+>/g, '');
        if (!unmatched.has(key)) unmatched.set(key, id);
      }
      found.forEach(entryId => used.add(entryId));
    }));
  });

  if (unmatched.size) {
    problems.push(`${unmatched.size} ligne(s) d'ingredient sans fiche dans l'atlas (assets/ingredients/) :`);
    [...unmatched.entries()].slice(0, 80).forEach(([line, id]) => problems.push(`  ${id} : ${line}`));
  }
  const unused = atlas.entries.filter(entry => !used.has(entry.id)).map(entry => entry.id);

  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  console.log(`Validation atlas ingredients OK (${atlas.entries.length} fiches, ${atlas.entries.length - unused.length} utilisees${unused.length ? `, en reserve : ${unused.join(', ')}` : ''}).`);
}

if (require.main === module) main();

module.exports = { loadAtlas, atlasFiles };

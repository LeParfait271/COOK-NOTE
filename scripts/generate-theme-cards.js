// Miniatures de cartes pour les illustrations de theme (nuit / jour) : les grilles
// affichaient les illustrations pleine taille (1400-1700px) dans des cartes de
// ~290px. Ouvrir une categorie faisait decoder et televerser une quinzaine de
// grandes images d'un coup (~350ms de GPU : transitions figees).
// assets/theme/<t>/recipes/x.jpg    -> assets/theme/<t>/recipe-cards/x.jpg
// assets/theme/<t>/categories/x.jpg -> assets/theme/<t>/category-cards/x.jpg
// Plus une miniature 400px en AVIF seul (recipe-cards-sm / category-cards-sm) :
// cartes en ecran 1x et halos floutes ; quatre fois moins de pixels a decoder
// et a dessiner a l'ouverture d'une categorie (repli : la miniature 800px).
// Usage : node scripts/generate-theme-cards.js [--force | --check]   (ImageMagick de .tools)
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
// 800px : net jusqu'a une carte de 400px en ecran 2x.
const CARD_WIDTH = 800;
const QUALITY = '82';
const FORCE = process.argv.includes('--force');
const CHECK_ONLY = process.argv.includes('--check');
const SMALL_CARD_WIDTH = 400;
const SMALL_AVIF_QUALITY = '58';
const CARD_DIRS = ['dark', 'day'].flatMap(theme => [`assets/theme/${theme}/recipe-cards`, `assets/theme/${theme}/category-cards`]);
const SMALL_DIRS = CARD_DIRS.map(dir => `${dir}-sm`);

const normalize = file => String(file || '').replace(/\\/g, '/').replace(/^\/+/, '').replace(/\?.*$/, '');
const themeCardPath = file => normalize(file).replace(/^(assets\/theme\/(?:dark|day))\/(recipes|categories)\//, (match, base, kind) => `${base}/${kind === 'recipes' ? 'recipe' : 'category'}-cards/`);
const themeCardSmallPath = file => themeCardPath(file).replace(/-cards\//, '-cards-sm/').replace(/\.jpg$/i, '.avif');

function themeArtSources() {
  const context = { window: {}, Object };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'app-art-images.js'), 'utf8'), context);
  const art = context.window.COOK_NOTE_THEME_RECIPE_ART || {};
  const sources = new Set();
  Object.values(art).forEach(map => Object.values(map || {}).forEach(image => {
    const file = normalize(image);
    if (/^assets\/theme\/(?:dark|day)\/(?:recipes|categories)\/[^/]+\.jpg$/i.test(file)) sources.add(file);
  }));
  return [...sources].sort();
}

const sources = themeArtSources();
const expected = new Set(sources.map(themeCardPath));
const expectedSmall = new Set(sources.map(themeCardSmallPath));
const existing = CARD_DIRS.flatMap(dir => {
  const abs = path.join(ROOT, dir);
  return fs.existsSync(abs) ? fs.readdirSync(abs).filter(file => /\.jpg$/i.test(file)).map(file => `${dir}/${file}`) : [];
});
const existingSmall = SMALL_DIRS.flatMap(dir => {
  const abs = path.join(ROOT, dir);
  return fs.existsSync(abs) ? fs.readdirSync(abs).filter(file => /\.avif$/i.test(file)).map(file => `${dir}/${file}`) : [];
});
const orphans = [
  ...existing.filter(file => !expected.has(file)),
  ...existingSmall.filter(file => !expectedSmall.has(file))
];
const olderThan = (target, source) => !fs.existsSync(path.join(ROOT, target))
  || fs.statSync(path.join(ROOT, target)).mtimeMs < fs.statSync(path.join(ROOT, source)).mtimeMs;
const stale = source => olderThan(themeCardPath(source), source);
const staleSmall = source => olderThan(themeCardSmallPath(source), source);

if (CHECK_ONLY) {
  const missing = sources.filter(source => stale(source) || staleSmall(source));
  if (missing.length || orphans.length) {
    missing.slice(0, 10).forEach(file => console.error(`Miniature theme manquante ou perimee : ${themeCardPath(file)} / ${themeCardSmallPath(file)}`));
    orphans.slice(0, 10).forEach(file => console.error(`Miniature theme orpheline : ${file}`));
    console.error(`${missing.length} miniature(s) a generer, ${orphans.length} orpheline(s). Lancer node scripts/generate-theme-cards.js puis npm run generate:avif.`);
    process.exit(1);
  }
  console.log(`Validation miniatures theme OK (${sources.length} cartes, 800px + 400px).`);
  process.exit(0);
}

function findMagick() {
  const local = path.join(ROOT, '.tools', 'imagemagick', process.platform === 'win32' ? 'magick.exe' : 'magick');
  if (fs.existsSync(local)) return local;
  return process.platform === 'win32' ? 'magick.exe' : 'magick';
}

const magick = findMagick();
let created = 0;
let createdSmall = 0;
for (const source of sources) {
  const target = path.join(ROOT, themeCardPath(source));
  if (FORCE || stale(source)) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    execFileSync(magick, [path.join(ROOT, source), '-resize', `${CARD_WIDTH}x>`, '-strip', '-sampling-factor', '4:2:0', '-interlace', 'JPEG', '-quality', QUALITY, target], { stdio: 'ignore' });
    created++;
  }
  if (FORCE || staleSmall(source)) {
    const small = path.join(ROOT, themeCardSmallPath(source));
    fs.mkdirSync(path.dirname(small), { recursive: true });
    execFileSync(magick, [target, '-resize', `${SMALL_CARD_WIDTH}x>`, '-strip', '-quality', SMALL_AVIF_QUALITY, '-define', 'heic:speed=6', small], { stdio: 'ignore' });
    createdSmall++;
  }
}
orphans.forEach(file => fs.rmSync(path.join(ROOT, file)));
console.log(`Miniatures theme : ${created} creee(s) en 800px, ${createdSmall} en 400px, ${orphans.length} orpheline(s) retiree(s).`);

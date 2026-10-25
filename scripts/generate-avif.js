// Genere une copie AVIF a cote de chaque image servie (miniatures, heros,
// visuels de theme jour/nuit). Les JPG/PNG restent la reference et le repli.
// Usage : node scripts/generate-avif.js [--force | --check]   (ImageMagick de .tools)
// --check : verifie seulement qu'aucune copie ne manque et qu'aucune n'est orpheline.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const DIRS = [
  'assets/recipes/heroes',
  'assets/recipes/cards',
  'assets/theme/dark/recipes',
  'assets/theme/dark/categories',
  'assets/theme/dark/global',
  'assets/theme/day/recipes',
  'assets/theme/day/categories',
  'assets/theme/day/global'
];
// Qualite AVIF calee pour rester visuellement equivalente aux JPG servis.
const QUALITY = '58';
const FORCE = process.argv.includes('--force');
const CHECK_ONLY = process.argv.includes('--check');
const SOURCE_PATTERN = /\.(?:jpe?g|png)$/i;

function listImages() {
  const sources = []; const avifs = [];
  for (const dir of DIRS) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const file of fs.readdirSync(abs)) {
      if (SOURCE_PATTERN.test(file)) sources.push(path.join(abs, file));
      else if (/\.avif$/i.test(file)) avifs.push(path.join(abs, file));
    }
  }
  return { sources, avifs };
}

const avifOf = source => source.replace(SOURCE_PATTERN, '.avif');
const relative = file => path.relative(ROOT, file).replace(/\\/g, '/');
const { sources, avifs } = listImages();
const expected = new Set(sources.map(avifOf));
const orphans = avifs.filter(file => !expected.has(file));

if (CHECK_ONLY) {
  const missing = sources.filter(source => !fs.existsSync(avifOf(source)));
  if (missing.length || orphans.length) {
    missing.slice(0, 10).forEach(file => console.error(`AVIF manquant : ${relative(avifOf(file))}`));
    orphans.slice(0, 10).forEach(file => console.error(`AVIF orphelin : ${relative(file)}`));
    console.error(`${missing.length} AVIF manquant(s), ${orphans.length} orphelin(s). Lancer npm run generate:avif.`);
    process.exit(1);
  }
  console.log(`Validation AVIF OK (${sources.length} images).`);
  process.exit(0);
}

function findMagick() {
  const exe = process.platform === 'win32' ? 'magick.exe' : 'magick';
  const local = path.join(ROOT, '.tools', 'imagemagick', exe);
  if (fs.existsSync(local)) return local;
  try {
    execFileSync(exe, ['-version'], { stdio: 'ignore' });
    return exe;
  } catch {
    console.error('ImageMagick introuvable : installez-le dans .tools/imagemagick ou dans le PATH.');
    process.exit(1);
  }
}

const magick = findMagick();
let created = 0; let skipped = 0; let sourceBytes = 0; let avifBytes = 0;
for (const source of sources) {
  const target = avifOf(source);
  const srcStat = fs.statSync(source);
  if (!FORCE && fs.existsSync(target) && fs.statSync(target).mtimeMs >= srcStat.mtimeMs) { skipped++; continue; }
  execFileSync(magick, [source, '-strip', '-quality', QUALITY, '-define', 'heic:speed=6', target], { stdio: 'ignore' });
  created++;
  sourceBytes += srcStat.size;
  avifBytes += fs.statSync(target).size;
}
// Une image source supprimee emporte sa copie AVIF.
orphans.forEach(file => fs.rmSync(file));
const ratio = sourceBytes ? Math.round((1 - avifBytes / sourceBytes) * 100) : 0;
console.log(`AVIF : ${created} cree(s), ${skipped} a jour, ${orphans.length} orpheline(s) retiree(s)${created ? `, ${Math.round(sourceBytes / 1048576)} Mo -> ${Math.round(avifBytes / 1048576)} Mo (-${ratio} %)` : ''}.`);

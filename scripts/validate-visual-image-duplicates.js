const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const PERCEPTUAL_CORRELATION_LIMIT = 0.92;
const errors = [];

function loadJpeg() {
  try {
    return require('./vendor/jpeg-js');
  } catch {}
  try {
    return require('jpeg-js');
  } catch {}
  const home = process.env.USERPROFILE || process.env.HOME || '';
  const runtimeJpeg = path.join(home, '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies', 'node', 'node_modules', 'jpeg-js');
  try {
    return require(runtimeJpeg);
  } catch {}
  throw new Error('Module jpeg-js introuvable: impossible de valider les doublons visuels.');
}

const jpeg = loadJpeg();

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function loadRecipes() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read('recipes.js'), context, { filename: path.join(ROOT, 'recipes.js') });
  return context.window.RECIPES || {};
}

function loadThemeRecipeArtImages() {
  const context = { window: {}, Object };
  vm.createContext(context);
  vm.runInContext(read('app-art-images.js'), context, { filename: path.join(ROOT, 'app-art-images.js') });
  const source = context.window.COOK_NOTE_THEME_RECIPE_ART || {};
  return {
    dark: new Map(Object.entries(source.dark || {})),
    light: new Map(Object.entries(source.light || {}))
  };
}

function imagePath(image) {
  return path.join(ROOT, image.replace(/^\/+/, '').replace(/\?.*$/, ''));
}

function centered(values) {
  const mean = values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
  return values.map(value => value - mean);
}

function correlation(left, right) {
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftNorm += left[index] * left[index];
    rightNorm += right[index] * right[index];
  }
  if (!leftNorm || !rightNorm) return 0;
  return dot / Math.sqrt(leftNorm * rightNorm);
}

function imageSignature(filePath) {
  const decoded = jpeg.decode(fs.readFileSync(filePath), { useTArray: true });
  const width = 32;
  const height = 32;
  const values = [];
  for (let y = 0; y < height; y += 1) {
    const sourceY = Math.min(decoded.height - 1, Math.floor((y / height) * decoded.height));
    for (let x = 0; x < width; x += 1) {
      const sourceX = Math.min(decoded.width - 1, Math.floor((x / width) * decoded.width));
      const offset = (sourceY * decoded.width + sourceX) * 4;
      const red = decoded.data[offset];
      const green = decoded.data[offset + 1];
      const blue = decoded.data[offset + 2];
      values.push((red * 0.299 + green * 0.587 + blue * 0.114) / 255);
    }
  }
  return centered(values);
}

async function main() {
  const recipes = loadRecipes();
  const themeRecipeArtImages = loadThemeRecipeArtImages();
  const imageRows = [];
  for (const [id, recipe] of Object.entries(recipes)) {
    if (!recipe?.image || !recipe.image.startsWith('/assets/')) continue;
    const filePath = imagePath(recipe.image);
    if (!fs.existsSync(filePath)) continue;
    imageRows.push({
      id,
      title: recipe.title || id,
      image: recipe.image,
      hash: crypto.createHash('sha1').update(fs.readFileSync(filePath)).digest('hex'),
      signature: imageSignature(filePath)
    });
  }

  Object.entries(themeRecipeArtImages).forEach(([theme, artImages]) => {
    const resolvedImages = new Map();
    artImages.forEach((image, id) => {
      if (!recipes[id]) errors.push(`Image ${theme} reference une fiche inconnue: ${id} (${image}).`);
      if (!image.startsWith(`/assets/theme/${theme === 'light' ? 'day' : 'dark'}/`)) errors.push(`${id}: image ${theme} hors assets/theme/${theme === 'light' ? 'day' : 'dark'} (${image}).`);
      if (!fs.existsSync(imagePath(image))) errors.push(`${id}: image ${theme} introuvable (${image}).`);
    });
    Object.entries(recipes).forEach(([id, recipe]) => {
      const image = artImages.get(id) || recipe?.image;
      if (!image) return;
      if (!resolvedImages.has(image)) resolvedImages.set(image, []);
      resolvedImages.get(image).push(id);
    });
    resolvedImages.forEach((ids, image) => {
      if (ids.length > 1) errors.push(`Image dupliquee en mode ${theme} (${image}): ${ids.join(', ')}.`);
    });
    const themeHashes = new Map();
    resolvedImages.forEach((ids, image) => {
      if (!image.startsWith('/assets/')) return;
      const filePath = imagePath(image);
      if (!fs.existsSync(filePath)) return;
      const hash = crypto.createHash('sha1').update(fs.readFileSync(filePath)).digest('hex');
      if (!themeHashes.has(hash)) themeHashes.set(hash, []);
      ids.forEach(id => themeHashes.get(hash).push({ id, image }));
    });
    themeHashes.forEach(rows => {
      const ids = new Set(rows.map(row => row.id));
      const images = new Set(rows.map(row => row.image));
      if (ids.size > 1 && images.size > 1) {
        errors.push(`Image exactement dupliquee en mode ${theme}: ${rows.map(row => `${row.id} (${row.image})`).join(' / ')}`);
      }
    });
  });

  const hashes = new Map();
  imageRows.forEach(row => {
    if (!hashes.has(row.hash)) hashes.set(row.hash, []);
    hashes.get(row.hash).push(row);
  });
  hashes.forEach(rows => {
    if (rows.length > 1) {
      errors.push(`Image exactement dupliquee: ${rows.map(row => `${row.id} (${row.image})`).join(' / ')}`);
    }
  });

  for (let leftIndex = 0; leftIndex < imageRows.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < imageRows.length; rightIndex += 1) {
      const left = imageRows[leftIndex];
      const right = imageRows[rightIndex];
      const score = correlation(left.signature, right.signature);
      if (score >= PERCEPTUAL_CORRELATION_LIMIT) {
        errors.push(`Images trop similaires (${score.toFixed(3)}): ${left.id} (${left.image}) / ${right.id} (${right.image})`);
      }
    }
  }

  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  console.log('Validation doublons visuels OK.');
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});

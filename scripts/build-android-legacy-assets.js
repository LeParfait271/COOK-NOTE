const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { TextDecoder } = require('node:util');
const jpeg = require('jpeg-js');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'android-legacy', 'build', 'generated', 'cook-note-lite');
const OUT_IMAGE_DIR = path.join(OUT_DIR, 'images');
const OUT_DETAIL_IMAGE_DIR = path.join(OUT_DIR, 'detail-images');
const RECIPES_FILE = path.join(ROOT, 'recipes.js');
const APP_FILE = path.join(ROOT, 'app.js');
const MAX_IMAGE_WIDTH = 480;
const DETAIL_IMAGE_WIDTH = 960;
const JPEG_QUALITY = 54;
const DETAIL_JPEG_QUALITY = 66;
const ENCODING_SUSPECT_RE = /(?:\u00c3[\u0080-\u00bf]|\u00c2[\u00a0-\u00bf]|\u00e2[\u0080-\u00bf\u20ac-\u2122]|\uFFFD)/;
const WINDOWS_1252_BYTE_BY_CODEPOINT = new Map([
  [0x20AC, 0x80],
  [0x201A, 0x82],
  [0x0192, 0x83],
  [0x201E, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02C6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8A],
  [0x2039, 0x8B],
  [0x0152, 0x8C],
  [0x017D, 0x8E],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201C, 0x93],
  [0x201D, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02DC, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9A],
  [0x203A, 0x9B],
  [0x0153, 0x9C],
  [0x017E, 0x9E],
  [0x0178, 0x9F]
]);
const UTF8_DECODER = new TextDecoder('utf-8', { fatal: false });

const CATEGORY_ORDER = [
  'Petit-dejeuner',
  'Apero',
  'Entrees',
  'Sauces',
  'Base',
  'Plats',
  'Accompagnements',
  'Desserts'
];

const CATEGORY_ALIASES = new Map([
  ['Petits-déjeuners', 'Petit-dejeuner'],
  ['Petits-dejeuners', 'Petit-dejeuner'],
  ['Petit-dejeuner', 'Petit-dejeuner'],
  ['Apéro', 'Apero'],
  ['Apero', 'Apero'],
  ['Entrées', 'Entrees'],
  ['Entrees', 'Entrees'],
  ['Sauces', 'Sauces'],
  ['Base', 'Base'],
  ['Plats', 'Plats'],
  ['Accompagnements', 'Accompagnements'],
  ['Desserts', 'Desserts']
]);

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function mojibakeScore(value) {
  const text = String(value || '');
  return (text.match(/[\u00c3\u00c2\u00c5\uFFFD]/g) || []).length
    + (text.match(/\u00e2[\u0080-\u00bf\u20ac-\u2122]/g) || []).length;
}

function repairMojibakeText(value) {
  const text = String(value || '');
  if (!ENCODING_SUSPECT_RE.test(text)) return text;
  try {
    const bytes = Uint8Array.from(Array.from(text, char => {
      const codePoint = char.codePointAt(0);
      return WINDOWS_1252_BYTE_BY_CODEPOINT.get(codePoint) ?? (codePoint <= 255 ? codePoint : 63);
    }));
    const decoded = UTF8_DECODER.decode(bytes);
    return mojibakeScore(decoded) < mojibakeScore(text) ? decoded : text;
  } catch {
    return text;
  }
}

function stripHtml(value) {
  return repairMojibakeText(value)
    .replace(/<span\b[^>]*data-goto=(["'])([^"']+)\1[^>]*>(.*?)<\/span>/gi, '$3')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function collectEncodingIssues(value, keyPath, issues) {
  if (issues.length >= 12) return;
  if (typeof value === 'string') {
    if (ENCODING_SUSPECT_RE.test(value)) {
      issues.push(`${keyPath}: ${value.slice(0, 90)}`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectEncodingIssues(item, `${keyPath}[${index}]`, issues));
    return;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => collectEncodingIssues(item, `${keyPath}.${key}`, issues));
  }
}

function assertNoEncodingIssues(payload) {
  const issues = [];
  collectEncodingIssues(payload, 'recipes-lite', issues);
  if (issues.length) {
    throw new Error(`Texte UTF-8 suspect dans les assets Android Legacy:\n${issues.join('\n')}`);
  }
}

function normalizeText(value) {
  return stripHtml(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanArray(value) {
  return Array.isArray(value) ? value.map(item => stripHtml(item)).filter(Boolean) : [];
}

function cleanCategory(category) {
  const cleaned = stripHtml(category);
  return CATEGORY_ALIASES.get(cleaned) || cleaned || 'Recette';
}

function loadRecipes() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read(RECIPES_FILE), context, { filename: RECIPES_FILE });
  return context.window.RECIPES || {};
}

function loadVersion() {
  const match = read(APP_FILE).match(/const SITE_VERSION = 'v(\d+\.\d+)'/);
  return match ? match[1] : '0.0';
}

function safeBasename(imagePath) {
  if (!imagePath) return '';
  const clean = String(imagePath).replace(/^\/+/, '').replace(/\\/g, '/');
  return path.basename(clean);
}

function imageSourceFor(imagePath, preferCardImage) {
  const clean = String(imagePath || '').replace(/^\/+/, '').replace(/\\/g, '/');
  const basename = path.basename(clean);
  if (!basename) return null;

  const cardCandidate = path.join(ROOT, 'assets', 'recipe-card-images', basename);
  const directCandidate = path.join(ROOT, clean);
  const optimizedCandidate = path.join(ROOT, 'assets', 'recipe-images-optimized', basename);
  const candidates = preferCardImage
    ? [cardCandidate, directCandidate, optimizedCandidate]
    : [directCandidate, optimizedCandidate, cardCandidate];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  return null;
}

function resizeNearest(decoded, targetWidth, targetHeight) {
  const source = decoded.data;
  const output = Buffer.alloc(targetWidth * targetHeight * 4);
  for (let y = 0; y < targetHeight; y += 1) {
    const sourceY = Math.min(decoded.height - 1, Math.floor((y * decoded.height) / targetHeight));
    for (let x = 0; x < targetWidth; x += 1) {
      const sourceX = Math.min(decoded.width - 1, Math.floor((x * decoded.width) / targetWidth));
      const sourceIndex = (sourceY * decoded.width + sourceX) * 4;
      const targetIndex = (y * targetWidth + x) * 4;
      output[targetIndex] = source[sourceIndex];
      output[targetIndex + 1] = source[sourceIndex + 1];
      output[targetIndex + 2] = source[sourceIndex + 2];
      output[targetIndex + 3] = 255;
    }
  }
  return { data: output, width: targetWidth, height: targetHeight };
}

function writeLiteJpeg(source, destination, maxWidth, quality) {
  const input = fs.readFileSync(source);
  const decoded = jpeg.decode(input, { useTArray: true, maxMemoryUsageInMB: 512 });
  const targetWidth = Math.min(maxWidth, decoded.width);
  const targetHeight = Math.max(1, Math.round((decoded.height * targetWidth) / decoded.width));
  const resized = targetWidth === decoded.width
    ? { data: Buffer.from(decoded.data), width: decoded.width, height: decoded.height }
    : resizeNearest(decoded, targetWidth, targetHeight);
  const encoded = jpeg.encode(resized, quality).data;
  fs.writeFileSync(destination, encoded);
}

function copyLiteImage(imagePath, copiedImages, targetDir, preferCardImage, maxWidth, quality) {
  const basename = safeBasename(imagePath);
  if (!basename || copiedImages.has(basename)) return basename;

  const source = imageSourceFor(imagePath, preferCardImage);
  if (!source) return '';

  const destination = path.join(targetDir, basename);
  ensureDir(path.dirname(destination));

  if (/\.jpe?g$/i.test(source)) {
    writeLiteJpeg(source, destination, maxWidth, quality);
  } else {
    fs.copyFileSync(source, destination);
  }

  copiedImages.add(basename);
  return basename;
}

function cleanGroups(groups) {
  if (!Array.isArray(groups)) return [];
  return groups.map(group => ({
    group: stripHtml(group.group || 'Base'),
    items: cleanArray(group.items),
    note: stripHtml(group.note || ''),
    steps: cleanArray(group.steps)
  })).filter(group => group.group || group.items.length || group.note || group.steps.length);
}

function cleanTechnical(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    label: stripHtml(item.label || ''),
    value: stripHtml(item.value || '')
  })).filter(item => item.label || item.value);
}

function cleanPractical(practical) {
  if (!practical || typeof practical !== 'object') return [];
  const labels = {
    equipment: 'Materiel',
    storage: 'Conservation',
    mistakes: 'A eviter',
    result: 'Resultat'
  };
  return Object.entries(labels)
    .map(([key, title]) => ({
      title,
      items: cleanArray(practical[key])
    }))
    .filter(section => section.items.length);
}

function compactRecipe(id, recipe, imageName, detailImageName) {
  const categories = cleanArray(recipe.categories).map(cleanCategory);
  const variants = Array.isArray(recipe.variants)
    ? recipe.variants.map(variant => ({
      id: stripHtml(variant.id || ''),
      label: stripHtml(variant.label || '')
    })).filter(variant => variant.id)
    : [];
  const ingredients = cleanGroups(recipe.ingredients);
  const steps = cleanArray(recipe.steps);
  const notes = cleanArray(recipe.notes);
  const technical = cleanTechnical(recipe.technical);
  const practical = cleanPractical(recipe.practical);
  const aliases = cleanArray(recipe.aliases);
  const tags = cleanArray(recipe.tags);
  const searchText = normalizeText([
    id,
    recipe.title,
    ...categories,
    ...aliases,
    ...tags,
    ...ingredients.flatMap(group => [group.group, ...group.items]),
    ...steps,
    ...notes
  ].join(' '));

  return {
    id,
    title: stripHtml(recipe.title || id),
    image: imageName,
    detailImage: detailImageName,
    categories,
    seasons: cleanArray(recipe.seasons),
    difficulty: stripHtml(recipe.difficulty || ''),
    difficultyScore: Number.isFinite(recipe.difficultyScore) ? recipe.difficultyScore : 0,
    yield: stripHtml(recipe.yield || ''),
    activeTime: Number.isFinite(recipe.activeTime) ? recipe.activeTime : 0,
    cookTime: Number.isFinite(recipe.cookTime) ? recipe.cookTime : 0,
    master: stripHtml(recipe.master || ''),
    additionalMasters: cleanArray(recipe.additionalMasters),
    masterType: stripHtml(recipe.masterType || ''),
    variantGroups: Boolean(recipe.variantGroups),
    variants,
    ingredients,
    steps,
    notes,
    technical,
    practical,
    tags,
    aliases,
    searchText
  };
}

function categorySummary(recipes) {
  const counts = new Map();
  recipes.forEach(recipe => {
    const category = recipe.categories[0] || 'Recette';
    counts.set(category, (counts.get(category) || 0) + 1);
  });
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => {
      const leftIndex = CATEGORY_ORDER.indexOf(left.name);
      const rightIndex = CATEGORY_ORDER.indexOf(right.name);
      const safeLeft = leftIndex === -1 ? 99 : leftIndex;
      const safeRight = rightIndex === -1 ? 99 : rightIndex;
      return safeLeft - safeRight || left.name.localeCompare(right.name, 'fr', { sensitivity: 'base' });
    });
}

function buildLiteAssets() {
  const recipes = loadRecipes();
  const copiedImages = new Set();
  const copiedDetailImages = new Set();

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  ensureDir(OUT_IMAGE_DIR);
  ensureDir(OUT_DETAIL_IMAGE_DIR);

  const outputRecipes = Object.entries(recipes)
    .map(([id, recipe]) => {
      const imageName = copyLiteImage(recipe.image, copiedImages, OUT_IMAGE_DIR, true, MAX_IMAGE_WIDTH, JPEG_QUALITY);
      const detailImageName = copyLiteImage(recipe.image, copiedDetailImages, OUT_DETAIL_IMAGE_DIR, false, DETAIL_IMAGE_WIDTH, DETAIL_JPEG_QUALITY);
      return compactRecipe(id, recipe, imageName, detailImageName || imageName);
    })
    .sort((left, right) => left.title.localeCompare(right.title, 'fr', { sensitivity: 'base' }));

  const payload = {
    schema: 2,
    mode: 'android-legacy-native-lite',
    version: loadVersion(),
    imageMaxWidth: MAX_IMAGE_WIDTH,
    detailImageMaxWidth: DETAIL_IMAGE_WIDTH,
    jpegQuality: JPEG_QUALITY,
    detailJpegQuality: DETAIL_JPEG_QUALITY,
    categories: categorySummary(outputRecipes),
    recipes: outputRecipes
  };

  assertNoEncodingIssues(payload);
  fs.writeFileSync(path.join(OUT_DIR, 'recipes-lite.json'), JSON.stringify(payload), 'utf8');

  console.log(`Assets Android Legacy Native Lite OK: ${OUT_DIR}`);
  console.log(`Recettes natives: ${outputRecipes.length}`);
  console.log(`Images natives ${MAX_IMAGE_WIDTH}px max: ${copiedImages.size}`);
  console.log(`Images detail natives ${DETAIL_IMAGE_WIDTH}px max: ${copiedDetailImages.size}`);
}

buildLiteAssets();

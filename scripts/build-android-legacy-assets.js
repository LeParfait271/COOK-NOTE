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
const APP_IMAGES_FILE = path.join(ROOT, 'app-images.js');
const ANDROID_GRADLE_PROPERTIES_FILE = path.join(ROOT, 'android-legacy', 'gradle.properties');
const MAX_IMAGE_WIDTH = 480;
const DETAIL_IMAGE_WIDTH = 1280;
const JPEG_QUALITY = 54;
const DETAIL_JPEG_QUALITY = 68;
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
  const siteMatch = read(APP_FILE).match(/const SITE_VERSION = 'v(\d+\.\d{2})'/);
  const apkMatch = read(APP_FILE).match(/const ANDROID_LEGACY_APK_VERSION = '(\d+\.\d{2})'/);
  const androidMatch = fs.existsSync(ANDROID_GRADLE_PROPERTIES_FILE)
    ? read(ANDROID_GRADLE_PROPERTIES_FILE).match(/^cookNoteAndroidVersion=(\d+\.\d{2})$/m)
    : null;
  const siteVersion = siteMatch?.[1];
  const apkVersion = apkMatch?.[1];
  const androidVersion = androidMatch?.[1];
  if (!siteVersion || !apkVersion || !androidVersion) {
    throw new Error('Versions Cook Note incompletes: SITE_VERSION, ANDROID_LEGACY_APK_VERSION et cookNoteAndroidVersion sont obligatoires.');
  }
  if (siteVersion !== apkVersion || siteVersion !== androidVersion) {
    throw new Error(`Versions Cook Note non alignees: site=${siteVersion}, lien APK=${apkVersion}, APK native=${androidVersion}.`);
  }
  return androidVersion;
}

function loadAppHelpers() {
  const appCode = read(APP_FILE);
  const end = appCode.indexOf('const root = ReactDOM.createRoot');
  if (end === -1) throw new Error('Impossible de trouver la limite de montage React.');

  const context = {
    window: {
      RECIPES: {},
      location: { href: 'http://localhost/', pathname: '/', search: '', hash: '', origin: 'http://localhost' },
      setTimeout,
      clearTimeout
    },
    React: {
      Fragment: 'Fragment',
      createElement() {},
      useEffect() {},
      useMemo(factory) {
        return typeof factory === 'function' ? factory() : undefined;
      },
      useRef(value) {
        return { current: value };
      },
      useState(value) {
        return [typeof value === 'function' ? value() : value, () => {}];
      }
    },
    console
  };

  vm.createContext(context);
  vm.runInContext(read(APP_IMAGES_FILE), context, { filename: APP_IMAGES_FILE });
  vm.runInContext(`${appCode.slice(0, end)}
globalThis.__cookNoteAndroidHelpers = {
  getRecipeAllergens,
  getRecipeAverageWeights,
  getRecipeEquipment,
  getRecipePracticalSections,
  getDisplayNotes,
  getPrepTimeline,
  getLinkedRecipeRefs
};`, context, { filename: APP_FILE });

  const helpers = context.__cookNoteAndroidHelpers;
  [
    'getRecipeAllergens',
    'getRecipeAverageWeights',
    'getRecipeEquipment',
    'getRecipePracticalSections',
    'getDisplayNotes',
    'getPrepTimeline',
    'getLinkedRecipeRefs'
  ].forEach(name => {
    if (typeof helpers?.[name] !== 'function') {
      throw new Error(`Helper fiche recette introuvable pour Android Legacy: ${name}.`);
    }
  });
  return helpers;
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
    label: stripHtml(item.label || item.title || 'Point cle'),
    value: stripHtml(item.value || item.text || '')
  })).filter(item => item.label || item.value);
}

function uniqueText(items) {
  const seen = new Set();
  const output = [];
  items.forEach(item => {
    const cleaned = stripHtml(item);
    const key = normalizeText(cleaned);
    if (!key || seen.has(key)) return;
    seen.add(key);
    output.push(cleaned);
  });
  return output;
}

function labelValueText(label, value) {
  const cleanLabel = stripHtml(label || '');
  const cleanValue = stripHtml(value || '');
  if (cleanLabel && cleanValue) return `${cleanLabel}: ${cleanValue}`;
  return cleanLabel || cleanValue;
}

function addBeforeSection(sections, title, items) {
  const cleanTitle = stripHtml(title || '');
  const cleanItems = uniqueText(items);
  if (cleanTitle && cleanItems.length) sections.push({ title: cleanTitle, items: cleanItems });
}

function recipesWithIds(recipes) {
  return Object.fromEntries(
    Object.entries(recipes).map(([id, recipe]) => [id, { ...recipe, id }])
  );
}

function linkedRecipeItems(recipe, recipes, helpers) {
  return (helpers.getLinkedRecipeRefs(recipe, recipes) || [])
    .map(item => labelValueText(item.role || 'Recette liee', item.recipe?.title || recipes[item.id]?.title || item.id));
}

function completeBeforeSections(id, recipe, recipes, helpers) {
  const sourceRecipe = { ...recipe, id };
  const sections = [];
  const practicalSections = helpers.getRecipePracticalSections(sourceRecipe) || [];

  const allergens = (helpers.getRecipeAllergens(sourceRecipe) || []).map(stripHtml);
  addBeforeSection(sections, 'Allergenes', allergens.length
    ? allergens
    : ['Aucun allergene majeur detecte dans les ingredients.']);
  addBeforeSection(sections, 'Materiel necessaire', helpers.getRecipeEquipment(sourceRecipe) || []);
  addBeforeSection(
    sections,
    'Poids moyens',
    (helpers.getRecipeAverageWeights(sourceRecipe) || []).map(item => labelValueText(item.label, item.value))
  );
  addBeforeSection(
    sections,
    'Timing',
    (helpers.getPrepTimeline(sourceRecipe) || []).map(item => labelValueText(item.label, item.value))
  );
  addBeforeSection(sections, 'Recettes liees', linkedRecipeItems(sourceRecipe, recipes, helpers));
  practicalSections.forEach(section => addBeforeSection(sections, section.title, section.items || []));
  addBeforeSection(sections, 'Notes', helpers.getDisplayNotes(sourceRecipe, practicalSections) || []);
  addBeforeSection(sections, 'Technique', cleanTechnical(sourceRecipe.technical).map(item => labelValueText(item.label, item.value)));

  return sections;
}

function compactRecipe(id, recipe, imageName, detailImageName, recipes, helpers) {
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
  const practical = completeBeforeSections(id, recipe, recipes, helpers);
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
    ...notes,
    ...technical.flatMap(item => [item.label, item.value]),
    ...practical.flatMap(section => [section.title, ...section.items])
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

function searchIndexEntry(recipe) {
  return {
    id: recipe.id,
    title: normalizeText(recipe.title),
    aliases: normalizeText(recipe.aliases.join(' ')),
    tags: normalizeText(recipe.tags.join(' ')),
    categories: normalizeText(recipe.categories.join(' ')),
    search: recipe.searchText
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
  const helperRecipes = recipesWithIds(recipes);
  const helpers = loadAppHelpers();
  const copiedImages = new Set();
  const copiedDetailImages = new Set();

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  ensureDir(OUT_IMAGE_DIR);
  ensureDir(OUT_DETAIL_IMAGE_DIR);

  const outputRecipes = Object.entries(recipes)
    .map(([id, recipe]) => {
      const imageName = copyLiteImage(recipe.image, copiedImages, OUT_IMAGE_DIR, true, MAX_IMAGE_WIDTH, JPEG_QUALITY);
      const detailImageName = copyLiteImage(recipe.image, copiedDetailImages, OUT_DETAIL_IMAGE_DIR, false, DETAIL_IMAGE_WIDTH, DETAIL_JPEG_QUALITY);
      return compactRecipe(id, recipe, imageName, detailImageName || imageName, helperRecipes, helpers);
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
  const searchIndex = {
    schema: 1,
    mode: 'android-legacy-search-index',
    version: payload.version,
    entries: outputRecipes
      .filter(recipe => !recipe.variants.length && recipe.masterType !== 'collection')
      .map(searchIndexEntry)
  };

  assertNoEncodingIssues(payload);
  assertNoEncodingIssues(searchIndex);
  fs.writeFileSync(path.join(OUT_DIR, 'recipes-lite.json'), JSON.stringify(payload), 'utf8');
  fs.writeFileSync(path.join(OUT_DIR, 'search-index-lite.json'), JSON.stringify(searchIndex), 'utf8');

  console.log(`Assets Android Legacy Native Lite OK: ${OUT_DIR}`);
  console.log(`Recettes natives: ${outputRecipes.length}`);
  console.log(`Index recherche natif: ${searchIndex.entries.length}`);
  console.log(`Images natives ${MAX_IMAGE_WIDTH}px max: ${copiedImages.size}`);
  console.log(`Images detail natives ${DETAIL_IMAGE_WIDTH}px max: ${copiedDetailImages.size}`);
}

buildLiteAssets();

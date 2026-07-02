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

function asTextList(value) {
  if (Array.isArray(value)) return cleanArray(value);
  const single = stripHtml(value || '');
  return single ? [single] : [];
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

function ingredientLines(recipe) {
  return Array.isArray(recipe.ingredients)
    ? recipe.ingredients.flatMap(group => cleanArray(group.items))
    : [];
}

function recipeRuleText(recipe) {
  return normalizeText([
    recipe.title,
    recipe.yield,
    ...(recipe.tags || []),
    ...(recipe.aliases || []),
    ...ingredientLines(recipe)
  ].join(' '));
}

const ALLERGEN_RULES = [
  ['Gluten', /\b(farine|ble|pain|pains|brioche|brioches|bun|buns|pate a choux|pate sucree|pate a tarte|chapelure|semoule|orge|avoine|epeautre|tortillas?)\b/],
  ['Oeufs', /\b(oeuf|oeufs|jaune d oeuf|jaunes d oeufs|blanc d oeuf|blancs d oeufs|mimosa|mayonnaise)\b/],
  ['Lait', /\b(lait|beurre|creme|fromage|parmesan|comte|cheddar|mozzarella|mascarpone|ricotta|yaourt|yogourt|feta)\b/],
  ['Fruits a coque', /\b(amande|amandes|noisette|noisettes|pistache|pistaches|noix|pecan|cajou|praline|pralinoise|pignons?)\b/],
  ['Arachides', /\b(arachide|arachides|cacahuete|cacahuetes|beurre de cacahuete)\b/],
  ['Soja', /\b(soja|sauce soja|tofu|miso|edamame)\b/],
  ['Moutarde', /\b(moutarde|graines de moutarde)\b/],
  ['Poisson', /\b(poisson|saumon|thon|cabillaud|anchois|sardine|dorade|bar|bouillabaisse)\b/],
  ['Crustaces', /\b(crevette|crevettes|crabe|homard|langoustine|gambas)\b/],
  ['Mollusques', /\b(calamar|calamars|chipiron|chipirons|palourde|palourdes|poulpe|encornet|encornets|moules de bouchot|chair de moules)\b/],
  ['Sesame', /\b(sesame|tahini|tahin)\b/],
  ['Sulfites', /\b(sulfite|sulfites|vin blanc|vin rouge|vinaigre de vin)\b/],
  ['Celeri', /\b(celeri|celeri rave|celeri-rave)\b/],
  ['Lupin', /\b(lupin|farine de lupin)\b/]
];

const AVERAGE_WEIGHT_RULES = [
  { label: 'Oeuf moyen', value: '~ 55g', pattern: /\b(oeuf|oeufs|oeufs entiers|oeuf entier)\b/, except: /\b(jaunes?|blancs?) d[' ]?(oeuf|oeufs)\b/ },
  { label: 'Jaune d oeuf', value: '~ 18g', pattern: /\bjaunes? d[' ]?(oeuf|oeufs)\b/ },
  { label: 'Blanc d oeuf', value: '~ 30g', pattern: /\bblancs? d[' ]?(oeuf|oeufs)\b/ },
  { label: 'Citron jaune', value: '~ 100 a 120g', pattern: /\b(citron entier|citron jaune|citrons jaunes|citron bio|citron non traite|citron)\b/, except: /\b(jus|zeste|quartiers?|citron vert|lime|confit)\b/ },
  { label: 'Citron vert', value: '~ 60 a 80g', pattern: /\b(citron vert|citrons verts|lime|limes)\b/, except: /\b(jus|zeste)\b/ },
  { label: 'Jus d un citron vert', value: '~ 20 a 30g', pattern: /\b(jus de citron vert|jus de lime)\b/ },
  { label: 'Jus d un citron jaune', value: '~ 40 a 50g', pattern: /\bjus de citron\b/, except: /\b(citron vert|lime)\b/ },
  { label: 'Gousse d ail', value: '~ 5g', pattern: /\b(gousse d ail|gousses d ail|ail)\b/ },
  { label: 'Oignon moyen', value: '~ 100 a 120g', pattern: /\b(oignon|oignons)\b/ },
  { label: 'Echalote', value: '~ 25 a 30g', pattern: /\b(echalote|echalotes)\b/ },
  { label: 'Tomate moyenne', value: '~ 120g', pattern: /\b(tomate|tomates)\b/ },
  { label: 'Carotte moyenne', value: '~ 100g', pattern: /\b(carotte|carottes)\b/ },
  { label: 'Pomme de terre moyenne', value: '~ 150g', pattern: /\b(pomme de terre|pommes de terre)\b/ },
  { label: 'Patate douce moyenne', value: '~ 250g', pattern: /\b(patate douce|patates douces)\b/ },
  { label: 'Avocat', value: '~ 150g de chair', pattern: /\b(avocat|avocats)\b/ },
  { label: 'Poivron', value: '~ 150 a 180g', pattern: /\b(poivron|poivrons)\b/ },
  { label: 'Melon moyen', value: '~ 800g a 1kg', pattern: /\b(melon|melons|melon charentais)\b/, except: /\b(jus de melon|billes? de melon)\b/ },
  { label: 'Courgette moyenne', value: '~ 200g', pattern: /\b(courgette|courgettes)\b/ },
  { label: 'Aubergine moyenne', value: '~ 300g', pattern: /\b(aubergine|aubergines)\b/ },
  { label: 'Jus d une orange', value: '~ 70 a 90g', pattern: /\bjus d[' ]?orange\b/ },
  { label: 'Orange', value: '~ 150 a 180g', pattern: /\b(orange|oranges)\b/, except: /\bjus d[' ]?orange\b/ },
  { label: 'Pomme', value: '~ 150g', pattern: /\b(pomme|pommes)\b(?!\s+de\s+terre)/ },
  { label: 'Poire', value: '~ 160g', pattern: /\b(poire|poires)\b/ }
];

const SPOON_WEIGHT_NOTE = 'Repere indicatif : cuilleres rases pour les poudres et pates, liquides remplis a niveau.';

function detectAllergens(recipe) {
  const allergens = new Set(cleanArray(recipe.allergens));
  const text = recipeRuleText(recipe).replace(
    /\b(?:beurrer|fariner|graisser|chemiser|huiler|foncer|remplir|garnir|preparer|utiliser|verser|poser|dans|sur)\s+(?:un|une|des|le|la|les)?\s*moules?\b|\bmoules?\s+a\s+(?:cake|tarte|manque|muffins?|charniere|savarin|gateau|gratin|ramequins?)\b/g,
    ' '
  );
  ALLERGEN_RULES.forEach(([label, pattern]) => {
    if (pattern.test(text)) allergens.add(label);
  });
  return uniqueText([...allergens]);
}

function shouldShowAverageWeightForLine(text) {
  if (/\b\d+(?:[.,]\d+)?\s*g\b/.test(text)) return true;
  return /^(?:\d+(?:[.,]\d+)?(?:\/\d+)?|une?|quelques|des)\s+(?!min\b|minutes?\b|g\b|kg\b|ml\b|cl\b|l\b|c\.?\b|cuill|pincee\b|trait\b|filet\b)/.test(text);
}

function averageWeightItems(recipe) {
  const found = new Map();
  if (Array.isArray(recipe.averageWeights)) {
    recipe.averageWeights.forEach(item => {
      const label = stripHtml(item?.label || item?.name || '');
      const value = stripHtml(item?.value || item?.weight || '');
      if (label && value) found.set(label, value);
    });
  }
  ingredientLines(recipe).forEach(item => {
    const text = normalizeText(item);
    if (!shouldShowAverageWeightForLine(text)) return;
    AVERAGE_WEIGHT_RULES.forEach(rule => {
      if (rule.except?.test(text)) return;
      if (rule.pattern.test(text) && !found.has(rule.label)) found.set(rule.label, rule.value);
    });
  });
  return Array.from(found, ([label, value]) => `${label}: ${value}`);
}

function hasSpoonMeasures(recipe) {
  return ingredientLines(recipe).some(item =>
    /\b(\d+(?:[,.]\d+)?)\s*(c\.?\s*a\s*(?:soupe|cafe)|cuilleres?\s*a\s*(?:soupe|cafe))\b/.test(normalizeText(item))
  );
}

function inferStorage(recipe) {
  const text = recipeRuleText(recipe);
  if (/\b(creme|lait|fromage|yaourt|oeuf|oeufs|mayonnaise|poisson|saumon|thon|crevette|crabe)\b/.test(text)) {
    return ['Conserver au refrigerateur a 0-4C en contenant propre ferme et consommer sous 24-48h.'];
  }
  if (/\b(cuit|cuire|four|poele|mijoter|gratin|soupe|plat)\b/.test(text)) {
    return ['Refroidir rapidement, conserver en boite hermetique au refrigerateur 3-4 jours et rechauffer doucement.'];
  }
  return [];
}

function cleanPractical(recipe) {
  const practical = recipe && recipe.practical && typeof recipe.practical === 'object' ? recipe.practical : {};
  const allergens = detectAllergens(recipe);
  const labels = {
    equipment: ['Materiel', asTextList(practical.equipment)],
    measures: ['Repere indicatif', hasSpoonMeasures(recipe) ? [SPOON_WEIGHT_NOTE] : []],
    weights: ['Poids moyens', [...averageWeightItems(recipe), ...asTextList(practical.weights)]],
    storage: ['Conservation', uniqueText([...inferStorage(recipe), ...asTextList(recipe.storage), ...asTextList(practical.storage)])],
    reheating: ['Rechauffage', uniqueText([...asTextList(recipe.reheating), ...asTextList(practical.reheating)])],
    tips: ['A savoir', uniqueText([...asTextList(recipe.tips), ...asTextList(practical.tips)])],
    substitutions: ['Substitutions', uniqueText([...asTextList(recipe.substitutions), ...asTextList(practical.substitutions)])],
    mistakes: ['A eviter', uniqueText([...asTextList(recipe.mistakes), ...asTextList(practical.mistakes)])],
    result: ['Resultat', uniqueText([...asTextList(recipe.result), ...asTextList(practical.result)])],
    service: ['Service', uniqueText([...asTextList(recipe.service), ...asTextList(practical.service)])],
    timeline: ['Timing', uniqueText([...asTextList(recipe.timeline), ...asTextList(practical.timeline)])]
  };
  return [
    {
      title: 'Allergenes',
      items: allergens.length
        ? allergens
        : ['Aucun allergene majeur detecte dans les ingredients.']
    },
    ...Object.values(labels).map(([title, items]) => ({
      title,
      items: uniqueText(items)
    }))
  ]
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
  const practical = cleanPractical(recipe);
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

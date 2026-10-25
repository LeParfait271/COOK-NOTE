function recipeShoppingLines(recipe, factor = 1) {
  return (recipe.ingredients || []).flatMap(group => [
    group.group ? `# ${group.group}` : '# Base',
    ...(group.items || []).map(item => `- ${stripHtml(scaleIngredient(item, factor))}`)
  ]);
}

function splitShoppingIngredientParts(line) {
  const value = String(line || '').trim();
  if (!/,(\s*\d+(?:[.,]\d+)?(?:\/\d+)?\s*(?:g|kg|ml|cl|l)\b)/i.test(value)) return [value];
  return value.split(/,\s+(?=\d+(?:[.,]\d+)?(?:\/\d+)?\s*(?:g|kg|ml|cl|l)\b)/i)
    .map(part => part.trim())
    .filter(Boolean);
}

function normalizeShoppingName(value) {
  let text = normalizeText(value)
    .replace(/^(?:de |d'|du |des |la |le |les |l')/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (/^beurre\b/.test(text)) {
    if (/\bdemi sel\b/.test(text)) return 'beurre demi sel';
    if (/\bsale\b/.test(text) && !/\bnon sale\b/.test(text)) return 'beurre sale';
    text = text.replace(/\b(doux|non|sale|pommade|ramolli|ramollie|fondu|fondue|froid|froide|mou|molle)\b/g, ' ');
  }
  if (/^farine\b/.test(text)) {
    text = text.replace(/\b(de ble|blé|fluide|tamisee|tamise)\b/g, ' ');
  }
  if (/^huile\b/.test(text)) {
    text = text
      .replace(/\bd olive\b/g, 'olive')
      .replace(/\bde tournesol\b/g, 'tournesol')
      .replace(/\bd arachide\b/g, 'arachide')
      .replace(/\bde pepins de raisin\b/g, 'pepins raisin')
      .replace(/\bd avocat\b/g, 'avocat');
  }
  if (/^citrons?\s+verts?\b|^limes?\b/.test(text)) return 'citron vert';
  if (/^citrons?\b/.test(text)) return 'citron';
  if (/^melons?\b/.test(text)) return 'melon';
  if (/^tomates?\b/.test(text)) return 'tomate';
  if (/^oeufs?\b|^œufs?\b/.test(text)) return 'oeufs';
  return text.replace(/\s+/g, ' ').trim();
}

function canonicalShoppingName(value) {
  const text = normalizeText(value);
  if (/\bjus de citron vert\b|\bjus de lime\b/.test(text)) return 'jus de citron vert';
  if (/\bjus de citron\b/.test(text)) return 'jus de citron';
  if (/\bzeste de citron vert\b|\bzestes de citron vert\b|\bzeste de lime\b/.test(text)) return 'zeste de citron vert';
  if (/\bzeste de citron\b|\bzestes de citron\b/.test(text)) return 'zeste de citron';
  if (/^citrons?\s+verts?\b|^limes?\b/.test(text)) return 'citron vert';
  if (/^citrons?\b/.test(text)) return 'citron';
  if (/^melons?\b/.test(text)) return 'melon';
  if (/^oignons?\b/.test(text)) return 'oignon';
  if (/^echalotes?\b|^échalotes?\b/.test(text)) return 'échalote';
  if (/^gousses? d ail\b|^ail\b/.test(text)) return 'ail';
  if (/^beurre\b/.test(text)) {
    if (/\bdemi sel\b/.test(text)) return 'beurre demi-sel';
    if (/\bsale\b/.test(text) && !/\bnon sale\b/.test(text)) return 'beurre salé';
    return 'beurre';
  }
  if (/^farine\b/.test(text)) {
    if (/\bt45\b/.test(text)) return 'farine T45';
    if (/\bt55\b/.test(text)) return 'farine T55';
    return 'farine';
  }
  if (/^huile\b/.test(text)) {
    if (/\bolive\b/.test(text)) return "huile d'olive";
    if (/\bavocat\b/.test(text)) return "huile d'avocat";
    if (/\btournesol|arachide|pepins de raisin|pépins de raisin|neutre\b/.test(text)) return 'huile neutre';
    return value.trim();
  }
  if (/\bcassonade\b|\bvergeoise\b/.test(text)) return 'cassonade ou vergeoise';
  if (/^oeufs?\b|^œufs?\b/.test(text)) return 'œufs';
  if (/^chocolat noir\b/.test(text)) return 'chocolat noir';
  if (/^chocolat au lait\b/.test(text)) return 'chocolat au lait';
  if (/^chocolat blanc\b/.test(text)) return 'chocolat blanc';
  return value.trim();
}

function parseShoppingIngredient(line) {
  const cleaned = stripHtml(line).replace(/^[-•]\s*/, '').trim();
  const match = cleaned.match(/^(\d+(?:[.,]\d+)?(?:\/\d+)?)(\s*(?:[\u2013\u2014-]|à|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?\s*(g|kg|ml|cl|l)\s+(.*)$/i);
  if (!match) {
    const countMatch = cleaned.match(/^(\d+(?:[.,]\d+)?(?:\/\d+)?)(\s*(?:[\u2013\u2014-]|à|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?\s+(?!recette\b|c\.|cuill|pinc[eé]e\b|trait\b|filet\b)(citron(?:s)?|melon(?:s)?|oignon(?:s)?|échalote(?:s)?|echalote(?:s)?|gousse(?:s)? d[’']ail|œuf(?:s)?|oeuf(?:s)?|jaune(?:s)?|blanc(?:s)?|tomate(?:s)?|avocat(?:s)?|pomme(?:s)?|poire(?:s)?|carotte(?:s)?|courgette(?:s)?)(.*)$/i);
    if (!countMatch) return null;
    const first = parseAmount(countMatch[1]);
    const second = countMatch[3] ? parseAmount(countMatch[3]) : null;
    if (!Number.isFinite(first)) return null;
    const rawName = `${countMatch[4]}${countMatch[5] || ''}`.trim();
    const normalizedName = normalizeShoppingName(rawName);
    const name = canonicalShoppingName(rawName);
    return {
      key: `piece:${normalizedName}`,
      name,
      unit: 'piece',
      first,
      second: Number.isFinite(second) ? second : null
    };
  }
  const first = parseAmount(match[1]);
  const second = match[3] ? parseAmount(match[3]) : null;
  if (!Number.isFinite(first)) return null;
  const unit = match[4].toLowerCase();
  const multiplier = unit === 'kg' || unit === 'l' ? 1000 : unit === 'cl' ? 10 : 1;
  const baseUnit = unit === 'kg' ? 'g' : unit === 'l' || unit === 'cl' ? 'ml' : unit;
  const rawName = stripHtml(match[5]).trim();
  const normalizedName = normalizeShoppingName(rawName);
  const name = canonicalShoppingName(rawName);
  return {
    key: `${baseUnit}:${normalizedName}`,
    name,
    unit: baseUnit,
    first: first * multiplier,
    second: Number.isFinite(second) ? second * multiplier : null
  };
}

function formatShoppingAmount(item) {
  if (!item.unit) return '';
  if (item.unit === 'piece') return item.second !== null ? `${formatNumber(item.first)} à ${formatNumber(item.second)}` : formatNumber(item.first);
  if (item.second !== null) return `${formatNumber(item.first)} à ${formatNumber(item.second)} ${item.unit}`;
  return `${formatNumber(item.first)} ${item.unit}`;
}

function shoppingPurchaseHint(item) {
  const text = normalizeText(item?.name);
  if (item.unit === 'ml') {
    if (/\b(creme|crème|lait|babeurre)\b/.test(text)) return `${Math.max(1, Math.ceil(item.first / 200))} briquette${item.first > 200 ? 's' : ''} 20cl`;
    if (/\bhuile|vinaigre|sirop\b/.test(text)) return 'bouteille à vérifier';
  }
  if (item.unit === 'g') {
    if (/\bbeurre\b/.test(text)) return `${Math.max(1, Math.ceil(item.first / 250))} plaquette${item.first > 250 ? 's' : ''}`;
    if (/\bfarine|sucre\b/.test(text)) return `${Math.max(1, Math.ceil(item.first / 1000))} paquet${item.first > 1000 ? 's' : ''}`;
    if (/\bchocolat\b/.test(text)) return `${Math.max(1, Math.ceil(item.first / 200))} tablette${item.first > 200 ? 's' : ''}`;
  }
  if (item.unit === 'piece') {
    if (/\boeufs|œufs\b/.test(text)) return `${Math.max(1, Math.ceil(item.first / 6))} boîte${item.first > 6 ? 's' : ''} de 6`;
    if (/\bcitron\b/.test(text)) return item.first >= 4 ? '1 filet ou vrac' : 'vrac';
    if (/\bmelon\b/.test(text)) return 'à l’unité';
  }
  return '';
}

function shoppingSmartGroupKey(item) {
  const text = normalizeText(item?.name);
  if (/\bcitron|jus de citron|zeste de citron|lime\b/.test(text)) return 'Citron, jus et zestes';
  if (/\boeuf|oeufs|œuf|œufs|jaune|blanc\b/.test(text)) return 'Œufs, jaunes et blancs';
  if (/\bail|gousse\b/.test(text)) return 'Ail';
  if (/\btomate|tomates\b/.test(text)) return 'Tomates';
  if (/\bcreme|crème|mascarpone|yaourt\b/.test(text)) return 'Crèmes et laitages';
  return '';
}

function buildShoppingSmartGroups(groupedItems) {
  const map = new Map();
  groupedItems.forEach(item => {
    const key = shoppingSmartGroupKey(item);
    if (!key) return;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  });
  return [...map.entries()]
    .filter(([, items]) => items.length > 1)
    .map(([label, items]) => ({ label, items }));
}

function shoppingAisle(name) {
  const text = normalizeText(name);
  const aisle = SHOPPING_AISLES.find(item => item.pattern.test(text));
  return aisle?.label || 'Autres';
}

function buildShoppingListData(recipes, factorById = {}) {
  const grouped = new Map();
  const blocks = recipes.map(recipe => {
    const factor = factorById[recipe.id] || 1;
    const quantitySummary = getQuantitySummary(recipe, factor);
    const factorLabel = quantitySummary ? ` (${quantitySummary})` : '';
    (recipe.ingredients || []).forEach(group => {
      (group.items || []).forEach(item => {
        const scaled = scaleIngredient(item, factor);
        splitShoppingIngredientParts(scaled).forEach(part => {
          const parsed = parseShoppingIngredient(part);
          const item = parsed || {
            key: `other:${normalizeShoppingName(part)}`,
            name: part.replace(/^[-•]\s*/, '').trim(),
            unit: '',
            first: 0,
            second: null
          };
          if (!item.name) return;
          item.aisle = shoppingAisle(item.name);
          const existing = grouped.get(item.key);
          if (existing) {
            const existingFirst = existing.first;
            const existingSecond = existing.second;
            existing.first += item.first;
            existing.second = existingSecond !== null || item.second !== null
              ? (existingSecond || existingFirst) + (item.second || item.first)
              : null;
            existing.recipes.add(recipe.title);
          } else {
            grouped.set(item.key, { ...item, recipes: new Set([recipe.title]) });
          }
        });
      });
    });
    return [`## ${recipe.title}${factorLabel}`, ...recipeShoppingLines(recipe, factor)].join('\n');
  });

  const groupedItems = [...grouped.values()]
    .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }))
    .map(item => ({ ...item, purchaseHint: shoppingPurchaseHint(item), recipeNames: [...item.recipes].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' })) }));

  const aisleGroups = SHOPPING_AISLES.map(aisle => ({
    label: aisle.label,
    items: groupedItems.filter(item => item.aisle === aisle.label)
  })).filter(group => group.items.length);
  const otherItems = groupedItems.filter(item => !SHOPPING_AISLES.some(aisle => aisle.label === item.aisle));
  if (otherItems.length) aisleGroups.push({ label: 'Autres', items: otherItems });
  return { blocks, groupedItems, aisleGroups, smartGroups: buildShoppingSmartGroups(groupedItems) };
}

function filterShoppingListData(data, ownedItems = {}, pantryItems = []) {
  const index = pantryIndex(pantryItems);
  const hasPantryItems = Array.isArray(pantryItems) && pantryItems.length > 0;
  const pantryOwns = item => hasPantryItems && pantryHasIngredientName(item.name, index);
  const isOwned = item => Boolean(ownedItems[item.key]) || pantryOwns(item);
  const markOwned = item => ({ ...item, ownedByPantry: pantryOwns(item) && !ownedItems[item.key] });
  const groupedItems = data.groupedItems.filter(item => !isOwned(item));
  const ownedGroupedItems = data.groupedItems.filter(isOwned).map(markOwned);
  const aisleGroups = SHOPPING_AISLES.map(aisle => ({
    label: aisle.label,
    items: groupedItems.filter(item => item.aisle === aisle.label)
  })).filter(group => group.items.length);
  const otherItems = groupedItems.filter(item => !SHOPPING_AISLES.some(aisle => aisle.label === item.aisle));
  if (otherItems.length) aisleGroups.push({ label: 'Autres', items: otherItems });
  return { ...data, groupedItems, ownedGroupedItems, aisleGroups, smartGroups: buildShoppingSmartGroups(groupedItems) };
}

const EMPTY_SHOPPING_DATA = {
  blocks: [],
  groupedItems: [],
  ownedGroupedItems: [],
  aisleGroups: [],
  smartGroups: []
};

function shoppingListText(recipes, factorById = {}, ownedItems = {}, mode = 'detailed', pantryItems = []) {
  const data = buildShoppingListData(recipes, factorById);
  const filtered = filterShoppingListData(data, ownedItems, pantryItems);
  if (mode === 'compact') {
    return [
      'Courses Cook Note',
      ...filtered.aisleGroups.flatMap(group => [
        `${group.label}:`,
        ...group.items.map(item => `- ${[formatShoppingAmount(item), item.name].filter(Boolean).join(' ')}`)
      ])
    ].join('\n');
  }
  const groupedLines = filtered.groupedItems
    .map(item => {
      const amount = formatShoppingAmount(item);
      const hint = item.purchaseHint ? ` - achat: ${item.purchaseHint}` : '';
      return `- ${[amount, item.name].filter(Boolean).join(' ')}${hint} (${item.recipeNames.join(', ')})`;
    });
  return [
    'Liste de courses Cook Note',
    '',
    groupedLines.length ? '## Ingrédients regroupés' : '',
    ...groupedLines,
    filtered.smartGroups.length ? '' : '',
    filtered.smartGroups.length ? '## Regroupements utiles' : '',
    ...filtered.smartGroups.map(group => `- ${group.label}: ${group.items.map(item => item.name).join(', ')}`),
    filtered.ownedGroupedItems.length ? '' : '',
    filtered.ownedGroupedItems.length ? '## Déjà à la maison' : '',
    ...filtered.ownedGroupedItems.map(item => `- ${[formatShoppingAmount(item), item.name].filter(Boolean).join(' ')}${item.ownedByPantry ? ' (déjà à la maison)' : ''}`),
    '',
    '## Détail par recette',
    ...data.blocks
  ].filter((line, index, lines) => line || lines[index - 1]).join('\n\n');
}

function recipeExportText(recipe, factor = 1) {
  const practicalSections = getRecipePracticalSections(recipe);
  const notes = getDisplayNotes(recipe, practicalSections).map(stripHtml);
  const equipment = getRecipeEquipment(recipe);
  return [
    `${recipe.title} - Cook Note`,
    recipe.yield ? getQuantityDisplay(recipe, factor) : '',
    difficultyText(recipe),
    '',
    equipment.length ? '## Matériel nécessaire' : '',
    ...equipment.map(item => `- ${item}`),
    equipment.length ? '' : '',
    '## Ingrédients',
    ...(recipe.ingredients || []).flatMap(group => [
      group.group ? `### ${group.group}` : '',
      ...(group.items || []).map(item => `- ${stripHtml(scaleIngredient(item, factor))}`),
      group.note ? `Note: ${stripHtml(group.note)}` : '',
      ...(group.notes || []).map(note => `Note: ${stripHtml(note)}`)
    ]).filter(Boolean),
    '',
    '## Étapes',
    ...getRecipeSteps(recipe).map((step, index) => `${index + 1}. ${stripHtml(step)}`),
    '',
    practicalSections.length ? '## Avant de commencer' : '',
    ...practicalSections.flatMap(section => [
      `### ${section.title}`,
      ...(section.items || []).map(item => `- ${stripHtml(item)}`)
    ]),
    notes.length ? '' : '',
    notes.length ? '## Notes' : '',
    ...notes.map(note => `- ${note}`)
  ].filter((line, index, lines) => line || lines[index - 1]).join('\n');
}


// Transfert de la liste de courses vers un autre appareil : la liste voyage
// dans le fragment d'URL (#courses=...), jamais envoye au serveur. Le format
// reste volontairement simple pour etre produit aussi par l'app Android.
const SHOPPING_TRANSFER_KEY = 'courses';
const SHOPPING_TRANSFER_MAX_ENTRIES = 30;
const SHOPPING_TRANSFER_ID_PATTERN = /^[a-z0-9_]+(?:::inline::\d+)?$/;

function encodeShoppingTransfer(ids, factorById = {}) {
  return ids.slice(0, SHOPPING_TRANSFER_MAX_ENTRIES).map(id => {
    const factor = Number(factorById[id]) || 1;
    return encodeURIComponent(factor === 1 ? id : `${id}*${factor}`);
  }).join(',');
}

function shoppingTransferUrl(ids, factorById = {}) {
  return ids.length ? `${getHomeUrl()}#${SHOPPING_TRANSFER_KEY}=${encodeShoppingTransfer(ids, factorById)}` : '';
}

function decodeShoppingTransfer(hash) {
  const match = String(hash || '').match(new RegExp(`^#${SHOPPING_TRANSFER_KEY}=([^&#]+)$`));
  if (!match) return null;
  const seen = new Set();
  const entries = match[1].split(',').slice(0, SHOPPING_TRANSFER_MAX_ENTRIES).map(part => {
    let raw = '';
    try {
      raw = decodeURIComponent(part);
    } catch {
      return null;
    }
    const [id, factorText] = raw.split('*');
    const factor = factorText === undefined ? 1 : Number(factorText);
    if (!SHOPPING_TRANSFER_ID_PATTERN.test(id) || !(factor >= 0.25 && factor <= 20) || seen.has(id)) return null;
    seen.add(id);
    return { id, factor };
  }).filter(Boolean);
  return entries.length ? entries : null;
}

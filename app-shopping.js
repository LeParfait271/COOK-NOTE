function recipeShoppingLines(recipe, factor = 1) {
  return (recipe.ingredients || []).flatMap(group => [
    group.group ? `# ${group.group}` : '# Base',
    ...(group.items || [])
      .filter(item => !isShoppingNonIngredient(stripHtml(item)))
      .map(item => `- ${stripHtml(scaleIngredient(item, factor))}`)
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
  // « ail en poudre », « citron confit » : un autre produit que le frais.
  if (!/\b(?:en poudre|semoule|seche|sechee?s?|confits?|frits?|noir|des ours)\b/.test(text)) {
    if (/^citrons?\s+verts?\b|^limes?\b/.test(text)) return 'citron vert';
    if (/^citrons?\b/.test(text)) return 'citron';
    if (/^melons?\b/.test(text)) return 'melon';
    if (/^oignons?\b/.test(text)) return 'oignon';
    if (/^echalotes?\b|^échalotes?\b/.test(text)) return 'échalote';
    if (/^gousses? d ail\b|^ail\b/.test(text)) return 'ail';
  }
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
  return value.trim().replace(/^(?:de\s+|d[’']\s*)/i, '');
}

// Lignes de structure glissees parmi les ingredients (intertitres « — Pâte — »,
// consignes de cuisson ou de choix de variante) : rien a acheter.
function isShoppingNonIngredient(line) {
  const text = String(line || '').replace(/^[-•]\s*/, '').trim();
  return !text || /^[–—].*[–—]$/.test(text) || /^→/.test(text) || /^(?:cuisson|choisir)\b/i.test(text);
}

const SHOPPING_AMOUNT = '(\\d+(?:[.,]\\d+)?(?:\\/\\d+)?)(\\s*(?:[\\u2013\\u2014-]|à|a)\\s*(\\d+(?:[.,]\\d+)?(?:\\/\\d+)?))?';
const SHOPPING_OF = '(?:de\\s+|d[’\']\\s*)?';
const SHOPPING_SPOON_PATTERN = new RegExp(`^${SHOPPING_AMOUNT}\\s*(c\\.\\s*à\\s*(?:s\\.|soupe|c\\.|café)|cuill[eè]res?\\s+à\\s+(?:soupe|café))\\s+${SHOPPING_OF}(.+)$`, 'i');
const SHOPPING_KNOWN_COUNT_PATTERN = new RegExp(`^${SHOPPING_AMOUNT}\\s+(?!recette\\b|c\\.|cuill|pinc[eé]e\\b|trait\\b|filet\\b)(citron(?:s)?|melon(?:s)?|oignon(?:s)?|échalote(?:s)?|echalote(?:s)?|œuf(?:s)?|oeuf(?:s)?|jaune(?:s)?|blanc(?:s)?|tomate(?:s)?|avocat(?:s)?|pomme(?:s)?|poire(?:s)?|carotte(?:s)?|courgette(?:s)?)(.*)$`, 'i');
const SHOPPING_COUNT_PATTERN = new RegExp(`^${SHOPPING_AMOUNT}\\s+(?!recette\\b|c\\.|cuill|pinc[eé]es?\\b|traits?\\b|filets?\\b|(?:min|h)\\b)(\\p{L}.*)$`, 'iu');
// « 1 pincée de sel », « Quelques gouttes d'huile » : pas de quantite utile a
// l'achat, mais le meme article que « Sel » ou « Huile » ailleurs.
const SHOPPING_PINCH_PATTERN = /^(?:(?:une|un|\d+(?:[.,]\d+)?)\s+)?(?:(?:petite|belle|bonne|grosse)s?\s+)?(?:pinc[ée]es?|traits?|filets?|pointes?|touches?|noisettes?)\s+(?:de\s+|d[’']\s*)?|^(?:quelques\s+gouttes|un\s+peu)\s+(?:de\s+|d[’']\s*)?/i;
const SHOPPING_ADJECTIVES = new Set(['petit', 'petite', 'gros', 'grosse', 'grand', 'grande', 'beau', 'belle', 'moyen', 'moyenne', 'garni', 'epais', 'epaisse', 'fin', 'fine', 'entier', 'entiere', 'jeune']);

function shoppingCountKey(rawName) {
  return normalizeText(rawName)
    .replace(/[’']/g, ' ')
    .replace(/\b(?:de|d|du|des)\b/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(word => (word.length > 3 ? word.replace(/[sx]$/, '') : word))
    .join(' ');
}

// « petit oignon » -> « petits oignons », « cuisse de poulet » -> « cuisses de
// poulet » : le nom et ses adjectifs, jamais le complement.
function pluralizeShoppingName(name) {
  let nounDone = false;
  let stopped = false;
  return String(name || '').split(/\s+/).map(word => {
    const plain = normalizeText(word);
    if (stopped) return word;
    const isAdjective = SHOPPING_ADJECTIVES.has(plain);
    if (nounDone && !isAdjective) {
      stopped = true;
      return word;
    }
    if (!isAdjective) nounDone = true;
    if (/[sxz]$/i.test(word) || plain === 'ail') return word;
    return /eau$/i.test(word) ? `${word}x` : `${word}s`;
  }).join(' ');
}

function cleanShoppingLooseName(text) {
  const name = String(text || '')
    .replace(/^[-•]\s*/, '')
    .replace(SHOPPING_PINCH_PATTERN, '')
    .replace(/\s+(?:selon (?:le )?goût|au goût|optionnel|facultatif)$/i, '')
    .trim();
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
}

function parseShoppingIngredient(line) {
  const cleaned = stripHtml(line).replace(/^[-•]\s*/, '').trim();
  const match = cleaned.match(/^(\d+(?:[.,]\d+)?(?:\/\d+)?)(\s*(?:[–—-]|à|a)\s*(\d+(?:[.,]\d+)?(?:\/\d+)?))?\s*(g|kg|ml|cl|l)\s+(.*)$/i);
  if (!match) {
    const spoonMatch = cleaned.match(SHOPPING_SPOON_PATTERN);
    if (spoonMatch) {
      const first = parseAmount(spoonMatch[1]);
      const second = spoonMatch[3] ? parseAmount(spoonMatch[3]) : null;
      if (!Number.isFinite(first)) return null;
      const ml = /s\.|soupe/i.test(spoonMatch[4]) ? 15 : 5;
      const rawName = stripHtml(spoonMatch[5]).trim();
      return {
        key: `ml:${normalizeShoppingName(canonicalShoppingName(rawName))}`,
        name: canonicalShoppingName(rawName),
        unit: 'ml',
        spoon: true,
        first: first * ml,
        second: Number.isFinite(second) ? second * ml : null
      };
    }
    const countMatch = cleaned.match(SHOPPING_KNOWN_COUNT_PATTERN);
    if (countMatch) {
      const first = parseAmount(countMatch[1]);
      const second = countMatch[3] ? parseAmount(countMatch[3]) : null;
      if (!Number.isFinite(first)) return null;
      const rawName = `${countMatch[4]}${countMatch[5] || ''}`.trim();
      return {
        key: `piece:${shoppingCountKey(normalizeShoppingName(rawName))}`,
        name: canonicalShoppingName(rawName),
        unit: 'piece',
        first,
        second: Number.isFinite(second) ? second : null
      };
    }
    const genericMatch = cleaned.match(SHOPPING_COUNT_PATTERN);
    if (genericMatch) {
      const first = parseAmount(genericMatch[1]);
      const second = genericMatch[3] ? parseAmount(genericMatch[3]) : null;
      if (!Number.isFinite(first)) return null;
      const rawName = genericMatch[4].trim();
      const many = (Number.isFinite(second) ? second : first) > 1;
      return {
        key: `piece:${shoppingCountKey(rawName)}`,
        name: rawName,
        nameOne: many ? '' : rawName,
        nameMany: many ? rawName : '',
        unit: 'piece',
        first,
        second: Number.isFinite(second) ? second : null
      };
    }
    return null;
  }
  const first = parseAmount(match[1]);
  const second = match[3] ? parseAmount(match[3]) : null;
  if (!Number.isFinite(first)) return null;
  const unit = match[4].toLowerCase();
  const multiplier = unit === 'kg' || unit === 'l' ? 1000 : unit === 'cl' ? 10 : 1;
  const baseUnit = unit === 'kg' ? 'g' : unit === 'l' || unit === 'cl' ? 'ml' : unit;
  const rawName = stripHtml(match[5]).trim();
  // Cle tiree du nom affiche : deux lignes au meme nom sont le meme achat.
  const name = canonicalShoppingName(rawName);
  return {
    key: `${baseUnit}:${normalizeShoppingName(name)}`,
    name,
    unit: baseUnit,
    first: first * multiplier,
    second: Number.isFinite(second) ? second * multiplier : null
  };
}

// Cuilleres : affichees en cuilleres tant que l'article ne vient que de
// cuilleres (« 2 c. à s. »), sinon en ml comme le reste.
function formatSpoonAmount(...values) {
  const halves = size => values.every(ml => ml >= size && Math.abs((ml / size) * 2 - Math.round((ml / size) * 2)) < 0.01);
  const size = halves(15) ? 15 : 5;
  const amounts = values.map(ml => formatNumber(Math.max(0.5, Math.round((ml / size) * 2) / 2)));
  return `${amounts.join(' à ')} ${size === 15 ? 'c. à s.' : 'c. à c.'}`;
}

function formatShoppingAmount(item) {
  if (!item.unit) return '';
  if (item.unit === 'piece') return item.second !== null ? `${formatNumber(item.first)} à ${formatNumber(item.second)}` : formatNumber(item.first);
  if (item.unit === 'ml' && item.spoon) {
    return item.second !== null ? formatSpoonAmount(item.first, item.second) : formatSpoonAmount(item.first);
  }
  if (item.second !== null) return `${formatNumber(item.first)} à ${formatNumber(item.second)} ${item.unit}`;
  return `${formatNumber(item.first)} ${item.unit}`;
}

// Formats courants du commerce : [taille, libelle singulier, pluriel]. Le
// conseil couvre la quantite haute de la fourchette avec le moins de perte.
const SHOPPING_PACKS = [
  { unit: 'ml', pattern: /\blait de coco\b/, packs: [[400, 'boîte de 40 cl', 'boîtes de 40 cl']] },
  { unit: 'ml', pattern: /\bcreme\b/, packs: [[200, 'briquette de 20 cl', 'briquettes de 20 cl'], [500, 'briquette de 50 cl', 'briquettes de 50 cl']] },
  { unit: 'g', pattern: /\bcreme\b/, packs: [[200, 'pot de 20 cl', 'pots de 20 cl'], [400, 'pot de 40 cl', 'pots de 40 cl']] },
  { unit: 'ml', pattern: /\bbabeurre\b/, packs: [[500, 'bouteille de 50 cl', 'bouteilles de 50 cl']] },
  { unit: 'ml', pattern: /\blait\b/, packs: [[500, 'bouteille de 50 cl', 'bouteilles de 50 cl'], [1000, 'bouteille de 1 L', 'bouteilles de 1 L']] },
  { unit: 'ml', pattern: /\bvin\b/, packs: [[750, 'bouteille de 75 cl', 'bouteilles de 75 cl']] },
  { unit: 'ml', pattern: /\bbiere\b/, packs: [[330, 'bouteille de 33 cl', 'bouteilles de 33 cl']] },
  { unit: 'ml', pattern: /\bbouillon\b/, packs: [[500, 'cube de bouillon (50 cl)', 'cubes de bouillon (50 cl chacun)']] },
  { unit: 'ml', pattern: /\bjus de citron vert\b/, packs: [[25, 'citron vert', 'citrons verts']] },
  { unit: 'ml', pattern: /\bjus de citron\b/, packs: [[40, 'citron', 'citrons']] },
  { unit: 'g', pattern: /\bjus de citron vert\b/, packs: [[25, 'citron vert', 'citrons verts']] },
  { unit: 'g', pattern: /\bjus de citron\b/, packs: [[40, 'citron', 'citrons']] },
  { unit: 'g', pattern: /\bbeurre\b/, packs: [[125, 'plaquette de 125 g', 'plaquettes de 125 g'], [250, 'plaquette de 250 g', 'plaquettes de 250 g']] },
  { unit: 'g', pattern: /\bsucre glace\b/, packs: [[500, 'paquet de 500 g', 'paquets de 500 g']] },
  { unit: 'g', pattern: /\bsucre vanille\b/, packs: [[7.5, 'sachet de 7,5 g', 'sachets de 7,5 g']] },
  { unit: 'g', pattern: /\blevure chimique\b/, packs: [[11, 'sachet de 11 g', 'sachets de 11 g']] },
  { unit: 'g', pattern: /\bgelatine\b/, packs: [[2, 'feuille (2 g)', 'feuilles (2 g)']] },
  { unit: 'g', pattern: /\bcassonade|vergeoise\b/, packs: [[500, 'paquet de 500 g', 'paquets de 500 g']] },
  { unit: 'g', pattern: /^(?:farine|sucre)\b/, packs: [[1000, 'paquet de 1 kg', 'paquets de 1 kg']] },
  { unit: 'g', pattern: /\bpoudre d.amandes?\b/, packs: [[125, 'sachet de 125 g', 'sachets de 125 g']] },
  { unit: 'g', pattern: /\bchocolat\b/, packs: [[100, 'tablette de 100 g', 'tablettes de 100 g'], [200, 'tablette de 200 g', 'tablettes de 200 g']] },
  { unit: 'g', pattern: /\bmascarpone\b/, packs: [[250, 'pot de 250 g', 'pots de 250 g'], [500, 'pot de 500 g', 'pots de 500 g']] },
  { unit: 'g', pattern: /\bricotta\b/, packs: [[250, 'pot de 250 g', 'pots de 250 g']] },
  { unit: 'g', pattern: /\bfromage blanc\b/, packs: [[500, 'pot de 500 g', 'pots de 500 g']] },
  { unit: 'g', pattern: /\bmozzarella\b/, packs: [[125, 'boule de 125 g', 'boules de 125 g']] },
  { unit: 'g', pattern: /\blardons?\b/, packs: [[200, 'barquette de 200 g', 'barquettes de 200 g']] },
  { unit: 'g', pattern: /\b(?:tomates? (?:concassees|pelees)|pulpe de tomates?|coulis de tomates?)\b/, packs: [[400, 'boîte de 400 g', 'boîtes de 400 g']] },
  { unit: 'g', pattern: /^(?:pates|spaghetti|tagliatelles|penne|coquillettes|linguine|fusilli|macaronis?|lasagnes?)\b/, packs: [[500, 'paquet de 500 g', 'paquets de 500 g']] },
  { unit: 'g', pattern: /^riz\b/, packs: [[500, 'paquet de 500 g', 'paquets de 500 g'], [1000, 'paquet de 1 kg', 'paquets de 1 kg']] },
  { unit: 'piece', pattern: /\boeufs?\b/, packs: [[6, 'boîte de 6', 'boîtes de 6'], [12, 'boîte de 12', 'boîtes de 12']] },
  { unit: 'piece', pattern: /\bgousses? d.ail\b/, packs: [[10, 'tête d’ail', 'têtes d’ail']] }
];

// Combinaison d'au plus deux formats : d'abord le moins de surplus, puis le
// moins d'emballages.
function shoppingPackPlan(need, packs) {
  let best = null;
  const [small, large = small] = packs;
  for (let a = 0; a <= 12; a += 1) {
    for (let b = 0; b <= 12; b += 1) {
      const total = a * small[0] + (large === small ? 0 : b * large[0]);
      if (total < need - 0.001 || (large === small && b > 0)) continue;
      const score = [total - need, a + b];
      if (!best || score[0] < best.score[0] - 0.001 || (Math.abs(score[0] - best.score[0]) < 0.001 && score[1] < best.score[1])) {
        best = { score, parts: [[b, large], [a, small]].filter(([count]) => count > 0) };
      }
    }
  }
  if (!best) return '';
  return best.parts.map(([count, pack]) => `${count} ${count > 1 ? pack[2] : pack[1]}`).join(' + ');
}

function shoppingPurchaseHint(item) {
  const text = normalizeText(item?.name);
  const need = item.second !== null && Number.isFinite(item.second) ? item.second : item.first;
  if (!(need > 0)) return '';
  // Une cuillere de bouillon ou de lait ne justifie pas un achat dedie.
  const rule = !(item.spoon && !/\bjus de citron\b/.test(text))
    && SHOPPING_PACKS.find(entry => entry.unit === item.unit && entry.pattern.test(text));
  if (rule) {
    const plan = shoppingPackPlan(need, rule.packs);
    if (plan) return plan;
  }
  if (item.unit === 'ml' && !item.spoon && /\bhuile|vinaigre|sirop\b/.test(text)) return 'bouteille à vérifier';
  if (item.unit === 'piece') {
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

// Nom accorde au total : « 1 petit oignon » + « 1 petit oignon » -> « 2 petits oignons ».
function shoppingCountName(item) {
  const total = item.second !== null ? item.second : item.first;
  if (total > 1) return item.nameMany || pluralizeShoppingName(item.nameOne);
  return item.nameOne || item.nameMany;
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
          if (isShoppingNonIngredient(stripHtml(part))) return;
          const parsed = parseShoppingIngredient(part);
          const looseName = parsed ? '' : cleanShoppingLooseName(stripHtml(part));
          const item = parsed || {
            key: `other:${normalizeShoppingName(looseName)}`,
            name: looseName,
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
            existing.spoon = Boolean(existing.spoon && item.spoon);
            existing.nameOne = existing.nameOne || item.nameOne || '';
            existing.nameMany = existing.nameMany || item.nameMany || '';
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
    .map(item => (item.nameOne || item.nameMany ? { ...item, name: shoppingCountName(item) } : item))
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

// Placard : retenu par nom, quelle que soit l'unite (« Sel fin » en pincee ou en g).
function shoppingStapleKey(item) {
  return normalizeShoppingName(item?.name || '');
}

// Articles « J'ai deja » de ce panier + articles toujours au placard.
function shoppingOwnedWithStaples(groupedItems, ownedItems = {}, stapleItems = {}) {
  const owned = { ...(ownedItems || {}) };
  (groupedItems || []).forEach(item => {
    if (stapleItems?.[shoppingStapleKey(item)]) owned[item.key] = true;
  });
  return owned;
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

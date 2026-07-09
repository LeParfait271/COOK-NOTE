// Cook Note premium helpers loaded before app.js.
(function () {
  const PANTRY_SUGGESTIONS = [
    'oeufs',
    'beurre',
    'creme',
    'lait',
    'farine',
    'sucre',
    'chocolat noir',
    'citron',
    'pommes de terre',
    'oignon',
    'ail',
    'tomates',
    'riz',
    'pates',
    'moutarde',
    'huile d olive'
  ];

  const PANTRY_LOW_IMPACT_PATTERN = /\b(eau|sel|poivre|poivre du moulin|fleur de sel|vanille|epice|epices|herbes? de provence)\b/;
  const PANTRY_OPTIONAL_PATTERN = /\b(option|optionnel|optionnelle|facultatif|facultative|sel|poivre|eau|glaçons?|glacons?)\b/;
  const FRESH_AISLE_PATTERN = /\b(primeur|cremerie|oeufs|boucherie|poissonnerie|boulangerie)\b/;
  const SUBSTITUTION_RULES = [
    {
      id: 'cream',
      pattern: /\b(creme|creme fraiche|creme liquide|creme epaisse)\b/,
      options: [
        { label: 'mascarpone détendu', pantry: ['mascarpone'], allergen: 'Lait/lactose', impact: 'plus dense, très riche' },
        { label: 'lait + beurre', pantry: ['lait', 'beurre'], allergen: 'Lait/lactose', impact: 'plus fluide, garde le gras' },
        { label: 'yaourt grec', pantry: ['yaourt', 'fromage blanc'], allergen: 'Lait/lactose', impact: 'plus acidulé, à feu doux' },
        { label: 'lait de coco', pantry: ['lait coco', 'coco'], allergen: 'Noix de coco selon sensibilité', impact: 'sans lait, goût coco marqué' }
      ]
    },
    {
      id: 'mascarpone',
      pattern: /\b(mascarpone)\b/,
      options: [
        { label: 'crème épaisse + fromage frais', pantry: ['creme', 'fromage frais'], allergen: 'Lait/lactose', impact: 'moins dense, proche en douceur' },
        { label: 'ricotta mixée + crème', pantry: ['ricotta', 'creme'], allergen: 'Lait/lactose', impact: 'plus léger, texture moins lisse' }
      ]
    },
    {
      id: 'milk',
      pattern: /\b(lait)\b/,
      options: [
        { label: 'crème diluée', pantry: ['creme'], allergen: 'Lait/lactose', impact: 'plus riche' },
        { label: 'boisson soja', pantry: ['soja'], allergen: 'Soja', impact: 'neutre, un peu moins rond' },
        { label: 'eau + beurre', pantry: ['eau', 'beurre'], allergen: 'Lait/lactose', impact: 'utile en pâte ou sauce' }
      ]
    },
    {
      id: 'butter',
      pattern: /\b(beurre)\b/,
      options: [
        { label: 'huile neutre', pantry: ['huile'], allergen: 'Aucun majeur courant', impact: 'moins lacté, plus souple' },
        { label: 'margarine', pantry: ['margarine'], allergen: 'Vérifier lait/soja', impact: 'proche en texture' },
        { label: 'purée d’amande', pantry: ['amande'], allergen: 'Fruits à coque', impact: 'goût marqué, très dense' }
      ]
    },
    {
      id: 'egg',
      pattern: /\b(oeuf|oeufs|jaune|blanc)\b/,
      options: [
        { label: 'compote', pantry: ['compote', 'pomme'], allergen: 'Aucun majeur courant', impact: 'dessert plus moelleux, moins structuré' },
        { label: 'yaourt', pantry: ['yaourt'], allergen: 'Lait/lactose', impact: 'moelleux, légère acidité' },
        { label: 'graines de lin hydratées', pantry: ['lin', 'chia'], allergen: 'Graines à vérifier', impact: 'liant végétal, texture plus rustique' }
      ]
    },
    {
      id: 'flour',
      pattern: /\b(farine)\b/,
      options: [
        { label: 'fécule ou Maïzena', pantry: ['fecule', 'maizena'], allergen: 'Aucun majeur courant', impact: 'plus léger, moins élastique' },
        { label: 'farine de riz', pantry: ['riz'], allergen: 'Aucun majeur courant', impact: 'sans gluten, texture plus friable' },
        { label: 'poudre d’amande', pantry: ['amande'], allergen: 'Fruits à coque', impact: 'plus fondant, goût marqué' }
      ]
    },
    {
      id: 'breadcrumbs',
      pattern: /\b(chapelure|panko)\b/,
      options: [
        { label: 'pain rassis mixé', pantry: ['pain'], allergen: 'Gluten', impact: 'plus rustique' },
        { label: 'flocons d’avoine mixés', pantry: ['avoine'], allergen: 'Gluten possible', impact: 'plus croustillant, moins fin' },
        { label: 'crackers écrasés', pantry: ['crackers', 'biscuit sale'], allergen: 'Gluten souvent présent', impact: 'plus salé' }
      ]
    },
    {
      id: 'wine',
      pattern: /\b(vin blanc|vin rouge|vin)\b/,
      options: [
        { label: 'bouillon + trait de vinaigre', pantry: ['bouillon', 'vinaigre'], allergen: 'Sulfites possibles', impact: 'moins alcoolisé, acidité contrôlée' },
        { label: 'cidre', pantry: ['cidre'], allergen: 'Sulfites possibles', impact: 'plus fruité' }
      ]
    },
    {
      id: 'lemon',
      pattern: /\b(citron|jus de citron|zeste)\b/,
      options: [
        { label: 'lime', pantry: ['lime', 'citron vert'], allergen: 'Aucun majeur courant', impact: 'acidité plus vive' },
        { label: 'vinaigre doux', pantry: ['vinaigre'], allergen: 'Sulfites possibles', impact: 'acidité sans parfum d’agrume' }
      ]
    },
    {
      id: 'cheese',
      pattern: /\b(parmesan|comte|comté|fromage|cheddar|mozzarella|feta|chevre|chèvre)\b/,
      options: [
        { label: 'autre fromage affiné', pantry: ['fromage', 'parmesan', 'comte'], allergen: 'Lait/lactose', impact: 'selon affinage, goût variable' },
        { label: 'levure maltée', pantry: ['levure maltee'], allergen: 'Gluten possible', impact: 'note fromagère, pas de fonte' }
      ]
    },
    {
      id: 'mustard',
      pattern: /\b(moutarde)\b/,
      options: [
        { label: 'vinaigre + miel', pantry: ['vinaigre', 'miel'], allergen: 'Sulfites possibles', impact: 'acidulé sucré, moins piquant' },
        { label: 'raifort doux', pantry: ['raifort'], allergen: 'À vérifier', impact: 'plus piquant' }
      ]
    },
    {
      id: 'sugar',
      pattern: /\b(sucre|cassonade|vergeoise)\b/,
      options: [
        { label: 'miel', pantry: ['miel'], allergen: 'Aucun majeur courant', impact: 'plus humide, goût floral' },
        { label: 'sirop d’érable', pantry: ['erable', 'sirop'], allergen: 'Aucun majeur courant', impact: 'plus humide, goût marqué' }
      ]
    }
  ];

  function pantryEntryLabel(value) {
    if (value && typeof value === 'object') return value.label || value.name || value.title || '';
    return value;
  }

  function cleanPantryLabel(value) {
    return stripHtml(pantryEntryLabel(value))
      .replace(/^[-•]\s*/, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 80);
  }

  function normalizePantryDate(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    const iso = raw.match(/\b(20\d{2})[-/](\d{1,2})[-/](\d{1,2})\b/);
    if (iso) return `${iso[1]}-${iso[2].padStart(2, '0')}-${iso[3].padStart(2, '0')}`;
    const fr = raw.match(/\b(\d{1,2})[-/](\d{1,2})[-/](20\d{2})\b/);
    if (fr) return `${fr[3]}-${fr[2].padStart(2, '0')}-${fr[1].padStart(2, '0')}`;
    return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : '';
  }

  function parsePantryDraftEntry(value, defaults = {}) {
    const source = String(value || '').trim();
    const date = normalizePantryDate(source) || normalizePantryDate(defaults.expiresAt);
    const opened = Boolean(defaults.opened) || /\b(ouvert|ouverte|entame|entam[eé]e|reste|restes)\b/i.test(source);
    const quantityMatch = source.match(/\b(\d+(?:[.,]\d+)?\s*(?:x|g|kg|ml|cl|l|pi[eè]ces?|pots?|bocaux?|tranches?|sachets?|boites?|boîtes?))\b/i);
    const quantity = stripHtml(defaults.quantity || quantityMatch?.[1] || '').slice(0, 32);
    const label = cleanPantryLabel(source
      .replace(/\b20\d{2}[-/]\d{1,2}[-/]\d{1,2}\b/g, ' ')
      .replace(/\b\d{1,2}[-/]\d{1,2}[-/]20\d{2}\b/g, ' ')
      .replace(/\b(ouvert|ouverte|entame|entam[eé]e|reste|restes)\b/ig, ' ')
      .replace(quantityMatch?.[0] || '', ' '));
    return { label: label || cleanPantryLabel(source), quantity, expiresAt: date, opened, note: stripHtml(defaults.note || '').slice(0, 80) };
  }

  function pantryDaysUntil(expiresAt) {
    const date = normalizePantryDate(expiresAt);
    if (!date) return null;
    const today = new Date();
    const now = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const target = new Date(`${date}T00:00:00`).getTime();
    if (!Number.isFinite(target)) return null;
    return Math.round((target - now) / 86400000);
  }

  function pantryPriority(item) {
    const days = pantryDaysUntil(item?.expiresAt);
    let score = item?.opened ? 38 : 0;
    if (days !== null) score += days < 0 ? 95 : days <= 2 ? 80 : days <= 5 ? 55 : days <= 10 ? 25 : 0;
    if (/\b(reste|restes|entame|entam[eé])\b/.test(normalizeText(item?.note || item?.label || ''))) score += 20;
    return score;
  }

  function pantryStatusLabel(item) {
    const days = pantryDaysUntil(item?.expiresAt);
    if (days !== null && days < 0) return 'à vérifier';
    if (days === 0) return 'aujourd’hui';
    if (days === 1) return 'demain';
    if (days !== null && days <= 5) return `${days} jours`;
    if (item?.opened) return 'ouvert';
    return '';
  }

  function pantryItemKey(value) {
    const label = cleanPantryLabel(value);
    if (!label) return '';
    return normalizeText(canonicalShoppingName(label))
      .replace(/\b(doux|sale|salé|fondu|fondue|ramolli|ramollie|pommade|entier|entiere|entière|frais|fraiche|fraîche)\b/g, ' ')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizePantryItems(items = []) {
    const map = new Map();
    items.forEach(item => {
      const entry = item && typeof item === 'object' ? item : parsePantryDraftEntry(item);
      const label = cleanPantryLabel(entry);
      const key = pantryItemKey(label);
      if (label && key && !map.has(key)) {
        const normalized = {
          key,
          label,
          quantity: stripHtml(entry.quantity || '').slice(0, 32),
          expiresAt: normalizePantryDate(entry.expiresAt),
          opened: Boolean(entry.opened),
          note: stripHtml(entry.note || '').slice(0, 80)
        };
        normalized.priority = pantryPriority(normalized);
        normalized.status = pantryStatusLabel(normalized);
        map.set(key, normalized);
      }
    });
    return Array.from(map.values()).sort((a, b) => b.priority - a.priority || a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' }));
  }

  function serializePantryItem(item) {
    const normalized = item?.key ? item : normalizePantryItems([item])[0];
    if (!normalized?.label) return null;
    const output = { label: normalized.label };
    if (normalized.quantity) output.quantity = normalized.quantity;
    if (normalized.expiresAt) output.expiresAt = normalized.expiresAt;
    if (normalized.opened) output.opened = true;
    if (normalized.note) output.note = normalized.note;
    return output;
  }

  function serializePantryItems(items = []) {
    return normalizePantryItems(items).map(serializePantryItem).filter(Boolean);
  }

  function pantryIndex(items = []) {
    const normalized = normalizePantryItems(items);
    return {
      items: normalized,
      keys: new Set(normalized.map(item => item.key)),
      text: normalized.map(item => item.key).join(' | ')
    };
  }

  function pantryHasIngredientName(name, index = pantryIndex()) {
    const key = pantryItemKey(name);
    if (!key) return false;
    if (index.keys.has(key)) return true;
    if (PANTRY_LOW_IMPACT_PATTERN.test(key)) return true;
    return index.items.some(item => (
      key.length >= 4 &&
      item.key.length >= 4 &&
      (key.includes(item.key) || item.key.includes(key))
    ));
  }

  function substitutionOptionsForIngredient(name) {
    const key = pantryItemKey(name);
    if (!key) return [];
    return SUBSTITUTION_RULES
      .filter(rule => rule.pattern.test(key))
      .flatMap(rule => rule.options.map(option => ({ ...option, rule: rule.id, missing: name })));
  }

  function pantryHasSubstitution(option, index) {
    return (option.pantry || []).some(item => pantryHasIngredientName(item, index));
  }

  function bestPantrySubstitution(name, index) {
    return substitutionOptionsForIngredient(name).find(option => pantryHasSubstitution(option, index)) || null;
  }

  function formatSubstitution(option) {
    return `${option.missing} → ${option.label} (${option.impact}; allergène : ${option.allergen})`;
  }

  function getSmartSubstitutionNotes(recipe, pantryItems = []) {
    const index = pantryIndex(pantryItems);
    const seen = new Set();
    return recipePantryRequirements(recipe)
      .flatMap(item => substitutionOptionsForIngredient(item.name).map(option => ({ ...option, missing: item.name })))
      .filter(option => {
        const key = `${pantryItemKey(option.missing)}:${option.label}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => Number(pantryHasSubstitution(b, index)) - Number(pantryHasSubstitution(a, index)))
      .slice(0, 5)
      .map(option => {
        const owned = pantryHasSubstitution(option, index) ? 'disponible au placard' : 'option';
        return `${formatSubstitution(option)} · ${owned}.`;
      });
  }

  function getVariantAdaptationNotes(recipe) {
    if (!recipe) return [];
    const sourceText = [
      recipe.title,
      ...(recipe.categories || []),
      ...(recipe.tags || []),
      ...(recipe.ingredients || []).flatMap(group => [group.group, ...(group.items || [])]),
      ...(recipe.steps || []),
      ...(recipe.notes || [])
    ].join(' ');
    const text = normalizeText(sourceText);
    const allergens = typeof getRecipeAllergens === 'function' ? getRecipeAllergens(recipe).map(normalizeText) : [];
    const hasMilk = allergens.some(item => item.includes('lait') || item.includes('lactose')) || /\b(lait|creme|beurre|fromage|yaourt|mascarpone|mozzarella|parmesan|ricotta)\b/.test(text);
    const hasGluten = allergens.some(item => item.includes('gluten')) || /\b(farine|pain|chapelure|panko|pates?|brioche|semoule|ble|froment)\b/.test(text);
    const hasEgg = allergens.some(item => item.includes('oeuf')) || /\b(oeufs?|jaune|blanc|meringue|mayonnaise)\b/.test(text);
    const hasVariants = Boolean(recipe.master || (recipe.variants || []).length);
    const notes = [];
    const add = (label, body) => {
      const line = `${label}: ${body}`;
      if (!notes.some(item => normalizeText(item) === normalizeText(line))) notes.push(line);
    };
    if (hasVariants) {
      add('Base + variantes', 'garde le meme ordre de preparation et isole les ingredients qui changent; la texture reste plus stable que si toute la recette est reecrite.');
    }
    if (hasMilk) {
      add('Adaptation sans lait', 'creme -> creme vegetale epaisse ou lait + un peu de beurre/huile; beurre -> huile douce. Impact: texture moins ronde, sauce parfois plus fluide.');
    }
    if (hasGluten) {
      add('Adaptation sans gluten', 'farine/chapelure/pain -> farine de riz + fecule, panko sans gluten ou pain sans gluten. Impact: tenue plus fragile, repos utile avant cuisson.');
    }
    if (hasEgg) {
      add('Adaptation sans oeufs', 'liaison -> graines de lin hydratees, yaourt epais ou fecule selon recette; dorure -> lait ou creme. Impact: mie plus dense et coloration plus douce.');
    }
    if (/\b(creme|sauce|veloute|ganache|chantilly|mousse)\b/.test(text)) {
      add('Texture controlee', 'si tu remplaces un produit gras par du lait, ajoute progressivement et garde une option epaisse sous la main pour rattraper la liaison.');
    }
    return notes.slice(0, 5);
  }

  function recipePantryRequirements(recipe) {
    const seen = new Set();
    return (recipe?.ingredients || []).flatMap(group => group.items || []).flatMap(line => {
      const cleanLine = stripHtml(line);
      return splitShoppingIngredientParts(cleanLine).map(part => {
        const parsed = parseShoppingIngredient(part);
        const name = parsed?.name || canonicalShoppingName(part.replace(/^[-•]\s*/, '').replace(/^\d+(?:[.,]\d+)?(?:\s*(?:g|kg|ml|cl|l))?\s+/i, '').trim());
        const key = pantryItemKey(name);
        if (!key || seen.has(key)) return null;
        seen.add(key);
        const lineText = normalizeText(part);
        return {
          key,
          name,
          optional: PANTRY_OPTIONAL_PATTERN.test(lineText),
          lowImpact: PANTRY_LOW_IMPACT_PATTERN.test(key)
        };
      }).filter(Boolean);
    });
  }

  function scorePantryRecipe(recipe, pantryItems = []) {
    if (!recipe || isMasterRecipe(recipe)) return { score: 0, matched: [], missing: [], coverage: 0 };
    const requirements = recipePantryRequirements(recipe).filter(item => !item.optional);
    if (!requirements.length) return { score: 0, matched: [], missing: [], coverage: 0 };
    const index = pantryIndex(pantryItems);
    const matched = [];
    const missing = [];
    const substitutable = [];
    requirements.forEach(item => {
      if (pantryHasIngredientName(item.name, index)) matched.push(item.name);
      else if (!item.lowImpact) {
        const replacement = bestPantrySubstitution(item.name, index);
        if (replacement) substitutable.push({ missing: item.name, replacement: replacement.label, impact: replacement.impact, allergen: replacement.allergen });
        else missing.push(item.name);
      }
    });
    if (!matched.length && !substitutable.length) return { score: 0, matched, missing, substitutable, coverage: 0 };
    const coverage = (matched.length + (substitutable.length * 0.72)) / requirements.length;
    const missingPenalty = missing.length * 42;
    const nearReadyBonus = missing.length <= 2 ? 95 - (missing.length * 22) : 0;
    const replacementBonus = substitutable.length * 28;
    const score = Math.round((coverage * 360) + (matched.length * 22) + replacementBonus + nearReadyBonus - missingPenalty);
    return { score, matched, missing, substitutable, coverage };
  }

  function pantryMatchLabel(meta) {
    const missingCount = meta?.missing?.length || 0;
    const replacementCount = meta?.substitutable?.length || 0;
    if (missingCount === 0) return replacementCount ? 'Remplacements OK' : 'Placard complet';
    if (replacementCount && missingCount === 1) return '1 achat + remplacements';
    if (replacementCount) return `${missingCount} achats + remplacements`;
    if (missingCount === 1) return '1 achat';
    if (missingCount === 2) return '2 achats';
    return `${missingCount} achats`;
  }

  function semanticRecipeSignals(recipe, recipesById = {}) {
    const text = normalizeText([
      recipe?.title,
      recipe?.yield,
      ...(recipe?.categories || []),
      ...(recipe?.tags || []),
      ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])]),
      ...(recipe?.steps || []),
      ...(recipe?.notes || [])
    ].join(' '));
    const timing = typeof getRecipeTiming === 'function' ? getRecipeTiming(recipe) : {};
    const allergens = typeof getRecipeAllergens === 'function' ? getRecipeAllergens(recipe).map(normalizeText) : [];
    const categoryText = normalizeText((recipe?.categories || []).join(' '));
    const labels = [];
    const add = (label, ok) => { if (ok) labels.push(label); };
    add('rapide', (timing.total || timing.active || 999) <= 30 || /\b(rapide|express|minute|soir de semaine)\b/.test(text));
    add('moins de 30 min', (timing.total || timing.active || 999) <= 30);
    add('sans four', !/\b(four|enfourner|prechauffer|préchauffer|gratin|roti|rôti)\b/.test(text));
    add('sans cuisson', !/\b(cuire|cuisson|four|poele|poêle|frire|mijoter|saisir|bouillir|griller)\b/.test(text));
    add('apéro froid', /\b(apero|apéritif|entree|entrée)\b/.test(categoryText) && /\b(froid|frais|verrine|salade|tartinade)\b/.test(text));
    add('dessert sans four', /\bdessert/.test(categoryText) && !/\b(four|enfourner|prechauffer|préchauffer)\b/.test(text));
    add('reste anti-gaspi', /\b(reste|restes|anti gaspillage|blancs?|jaunes?|pain rassis|placard)\b/.test(text));
    add('batch cooking', /\b(la veille|avance|conservation|congel|repos|mariner|base)\b/.test(text));
    add('sans gluten', !allergens.some(item => item.includes('gluten')));
    add('sans lait', !allergens.some(item => item.includes('lait') || item.includes('lactose')));
    add('sans œufs', !allergens.some(item => item.includes('oeuf')));
    add('familial', /\b(familial|gratin|plat|poulet|porc|boeuf|saucisse|pates|pommes de terre)\b/.test(text));
    add('invités', /\b(foie gras|saint jacques|agneau|paris brest|macaron|terrine|verrine)\b/.test(text));
    return { labels: uniq(labels), text };
  }

  function searchConstraints(query) {
    const text = normalizeText(query);
    return {
      active: /\b(sans|moins|maximum|max|reste|restes|froid|four|cuisson)\b/.test(text),
      sansGluten: /\bsans gluten\b/.test(text),
      sansLait: /\b(sans lait|sans lactose|sans creme|sans crème)\b/.test(text),
      sansOeuf: /\b(sans oeuf|sans oeufs|sans œuf|sans œufs)\b/.test(text),
      sansFour: /\bsans four\b/.test(text),
      sansCuisson: /\bsans cuisson\b/.test(text),
      aperoFroid: /\b(apero froid|apé[rl]o froid|entree froide|entrée froide)\b/.test(text),
      dessertSansFour: /\bdessert sans four\b/.test(text),
      reste: (text.match(/\b(restes?|reste de|restant)\s+(?:de\s+|d\s*)?([a-z0-9 ]{3,})/) || [])[2],
      maxMinutes: Number((text.match(/\b(?:moins de|max|maximum)\s*(\d{1,3})\s*(?:min|minutes|mn)\b/) || [])[1]) || 0
    };
  }

  function recipeMatchesSearchConstraints(recipe, query, recipesById = {}) {
    const constraints = searchConstraints(query);
    if (!constraints.active) return true;
    const signals = semanticRecipeSignals(recipe, recipesById);
    const timing = typeof getRecipeTiming === 'function' ? getRecipeTiming(recipe) : {};
    const allergens = typeof getRecipeAllergens === 'function' ? getRecipeAllergens(recipe).map(normalizeText) : [];
    const ingredientText = normalizeText((recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])]).join(' '));
    if (constraints.sansGluten && allergens.some(item => item.includes('gluten'))) return false;
    if (constraints.sansLait && allergens.some(item => item.includes('lait') || item.includes('lactose'))) return false;
    if (constraints.sansOeuf && allergens.some(item => item.includes('oeuf'))) return false;
    if (constraints.sansFour && !signals.labels.includes('sans four')) return false;
    if (constraints.sansCuisson && !signals.labels.includes('sans cuisson')) return false;
    if (constraints.aperoFroid && !signals.labels.includes('apéro froid')) return false;
    if (constraints.dessertSansFour && !signals.labels.includes('dessert sans four')) return false;
    if (constraints.maxMinutes && (timing.total || timing.active || 999) > constraints.maxMinutes) return false;
    if (constraints.reste && !ingredientText.includes(normalizeText(constraints.reste))) return false;
    return true;
  }

  function semanticRecipeSearchScore(recipe, query, recipesById = {}) {
    const needle = normalizeText(query);
    if (!needle) return { score: 0, reasons: [] };
    const signals = semanticRecipeSignals(recipe, recipesById);
    let score = 0;
    const reasons = [];
    signals.labels.forEach(label => {
      const normalized = normalizeText(label);
      if (needle.includes(normalized) || normalized.split(/\s+/).some(part => part.length > 3 && needle.includes(part))) {
        score += 58;
        reasons.push(label);
      }
    });
    [
      ['plat rapide poulet citron', /\bplat\b.*\brapide\b|\brapide\b.*\bplat\b/, ['rapide']],
      ['dessert sans four', /\bdessert sans four\b/, ['dessert sans four']],
      ['apéro froid', /\b(apero|apéro).*froid|froid.*(apero|apéro)\b/, ['apéro froid']],
      ['reste anti-gaspi', /\b(restes?|anti gaspillage|fond de frigo)\b/, ['reste anti-gaspi']]
    ].forEach(([reason, pattern, required]) => {
      if (pattern.test(needle) && required.every(label => signals.labels.includes(label))) {
        score += 95;
        reasons.push(reason);
      }
    });
    return { score, reasons: uniq(reasons).slice(0, 3) };
  }

  function searchSuggestionTerms(query = '', recipes = []) {
    const text = normalizeText(query);
    const base = [
      'plat rapide poulet citron',
      'dessert sans four',
      'apéro froid',
      'sans gluten',
      'sans lait',
      'moins de 30 min',
      'reste de jaunes d’œufs',
      'batch cooking',
      'frais seulement'
    ];
    const fromRecipes = recipes.slice(0, 6).flatMap(recipe => [
      recipe.title,
      ...(recipe.tags || []).slice(0, 2),
      primaryCategory(recipe)
    ]);
    return uniq([...base, ...fromRecipes])
      .filter(item => !text || normalizeText(item).includes(text) || text.split(/\s+/).some(part => part.length > 2 && normalizeText(item).includes(part)))
      .slice(0, 8);
  }

  function isFreshShoppingItem(item) {
    return FRESH_AISLE_PATTERN.test(normalizeText(item?.aisle || item?.name || ''));
  }

  function filterFreshShoppingData(data) {
    const groupedItems = (data.groupedItems || []).filter(isFreshShoppingItem);
    const ownedGroupedItems = (data.ownedGroupedItems || []).filter(isFreshShoppingItem);
    const aisleGroups = (data.aisleGroups || [])
      .map(group => ({ ...group, items: (group.items || []).filter(isFreshShoppingItem) }))
      .filter(group => group.items.length);
    return { ...data, groupedItems, ownedGroupedItems, aisleGroups, smartGroups: typeof buildShoppingSmartGroups === 'function' ? buildShoppingSmartGroups(groupedItems) : [] };
  }

  function shoppingListTextFromData(data, mode = 'detailed') {
    const lines = ['Courses Cook Note'];
    if (mode === 'fresh') lines[0] = 'Courses fraîches Cook Note';
    (data.aisleGroups || []).forEach(group => {
      lines.push('', `## ${group.label}`);
      group.items.forEach(item => lines.push(`- ${[formatShoppingAmount(item), item.name].filter(Boolean).join(' ')}${item.purchaseHint ? ` (${item.purchaseHint})` : ''}`));
    });
    if (data.ownedGroupedItems?.length) {
      lines.push('', '## Déjà à la maison');
      data.ownedGroupedItems.forEach(item => lines.push(`- ${[formatShoppingAmount(item), item.name].filter(Boolean).join(' ')}${item.ownedByPantry ? ' (placard)' : ''}`));
    }
    return lines.join('\n').trim();
  }

  function PantryPanel({ open, onClose, items = [], setItems, recipes = [], openRecipe, activatePantryMode, notify }) {
    const [draft, setDraft] = useState('');
    const [draftQuantity, setDraftQuantity] = useState('');
    const [draftExpiry, setDraftExpiry] = useState('');
    const [draftOpened, setDraftOpened] = useState(false);
    const pantryItems = useMemo(() => normalizePantryItems(items), [items]);
    const pantryMatches = useMemo(() => {
      if (!open || !pantryItems.length) return [];
      return recipes
        .map(recipe => ({ recipe, meta: scorePantryRecipe(recipe, pantryItems) }))
        .filter(item => item.meta.score > 0)
        .sort((a, b) => b.meta.score - a.meta.score || a.meta.missing.length - b.meta.missing.length || a.recipe.title.localeCompare(b.recipe.title, 'fr'))
        .slice(0, 8);
    }, [open, recipes, pantryItems]);
    const readyCount = pantryMatches.filter(item => item.meta.missing.length === 0).length;
    const nearReadyCount = pantryMatches.filter(item => item.meta.missing.length > 0 && item.meta.missing.length <= 2).length;
    const urgentCount = pantryItems.filter(item => item.priority >= 55).length;
    const commitItems = next => setItems?.(serializePantryItems(next));
    const addItems = value => {
      const nextItems = String(value || '')
        .split(/[,;\n]+/)
        .map(item => parsePantryDraftEntry(item, { quantity: draftQuantity, expiresAt: draftExpiry, opened: draftOpened }))
        .map(serializePantryItem)
        .filter(Boolean);
      if (!nextItems.length) return;
      commitItems([...pantryItems, ...nextItems]);
      setDraft('');
      setDraftQuantity('');
      setDraftExpiry('');
      setDraftOpened(false);
    };
    const removeItem = key => commitItems(pantryItems.filter(item => item.key !== key));
    const toggleSuggestion = label => {
      const key = pantryItemKey(label);
      if (!key) return;
      if (pantryItems.some(item => item.key === key)) removeItem(key);
      else commitItems([...pantryItems, parsePantryDraftEntry(label)]);
    };
    const openMatchedRecipe = recipe => {
      onClose();
      openRecipe(recipe.id);
    };
    const viewAllMatches = () => {
      activatePantryMode?.();
      onClose();
    };

    useEffect(() => {
      if (open) {
        setDraft('');
        setDraftQuantity('');
        setDraftExpiry('');
        setDraftOpened(false);
      }
    }, [open]);

    if (!open) return null;
    return h('div', { className: 'modal-backdrop pantry-backdrop', onMouseDown: onClose },
      h('section', {
        className: 'modal-panel pantry-modal',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': 'pantry-modal-title',
        tabIndex: -1,
        onKeyDown: trapModalFocus,
        onMouseDown: event => event.stopPropagation()
      },
        h('div', { className: 'modal-head' },
          h('div', null,
            h('p', { className: 'eyebrow' }, 'Anti-gaspi'),
            h('h2', { id: 'pantry-modal-title' }, 'Mon placard')
          ),
          h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
        ),
        h('form', {
          className: 'pantry-add-row',
          onSubmit: event => {
            event.preventDefault();
            addItems(draft);
          }
        },
          h('label', { className: 'sr-only', htmlFor: 'pantry-add-input' }, 'Ajouter un ingrédient au placard'),
          h('input', {
            id: 'pantry-add-input',
            value: draft,
            onChange: event => setDraft(event.target.value),
            placeholder: 'oeufs, citron, restes de poulet...'
          }),
          h('label', { className: 'sr-only', htmlFor: 'pantry-quantity-input' }, 'Quantite'),
          h('input', {
            id: 'pantry-quantity-input',
            value: draftQuantity,
            onChange: event => setDraftQuantity(event.target.value),
            placeholder: 'quantite'
          }),
          h('label', { className: 'sr-only', htmlFor: 'pantry-expiry-input' }, 'Date limite'),
          h('input', {
            id: 'pantry-expiry-input',
            type: 'date',
            value: draftExpiry,
            onChange: event => setDraftExpiry(event.target.value)
          }),
          h('label', { className: 'pantry-opened-toggle' },
            h('input', {
              type: 'checkbox',
              checked: draftOpened,
              onChange: event => setDraftOpened(event.target.checked)
            }),
            h('span', null, 'Ouvert / reste')
          ),
          h(Button, { variant: 'primary', type: 'submit', disabled: !draft.trim() }, 'Ajouter')
        ),
        h('div', { className: 'pantry-suggestions', 'aria-label': 'Suggestions placard' },
          PANTRY_SUGGESTIONS.map(label => {
            const active = pantryItems.some(item => item.key === pantryItemKey(label));
            return h('button', {
              key: label,
              type: 'button',
              className: active ? 'active' : '',
              'aria-pressed': active,
              onClick: () => toggleSuggestion(label)
            }, label);
          })
        ),
        pantryItems.length > 0 && h('div', { className: 'pantry-current-list' },
          pantryItems.map(item => h('button', {
            key: item.key,
            type: 'button',
            className: item.priority >= 55 ? 'urgent' : '',
            onClick: () => removeItem(item.key),
            title: 'Retirer du placard',
            'aria-label': `Retirer ${item.label} du placard`
          }, item.label, h('span', null, '×')))
        ),
        h('div', { className: 'pantry-score-row', role: 'status', 'aria-live': 'polite' },
          h('span', null, h('strong', null, pantryItems.length), h('small', null, 'ingrédients')),
          h('span', null, h('strong', null, readyCount), h('small', null, 'sans achat')),
          h('span', null, h('strong', null, nearReadyCount), h('small', null, '1-2 achats'))
        ),
        pantryMatches.length > 0 && h('div', { className: 'pantry-match-list' },
          pantryMatches.map(({ recipe, meta }) => {
            const replacements = (meta.substitutable || []).slice(0, 2);
            return h('button', {
              key: recipe.id,
              type: 'button',
              className: 'pantry-match-row',
              onClick: () => openMatchedRecipe(recipe),
              'aria-label': `Ouvrir ${recipe.title}`
            },
              h('span', { className: 'pantry-match-image', style: imageBackgroundStyle(displayRecipeImage(recipe)), 'aria-hidden': true }),
              h('span', { className: 'pantry-match-copy' },
                h('strong', null, recipe.title),
                h('small', null, meta.missing.length ? `Manque: ${meta.missing.slice(0, 3).join(', ')}` : replacements.length ? `Remplacements: ${replacements.map(item => item.missing).join(', ')}` : 'Tout est dans le placard'),
                replacements.length > 0 && h('small', { className: 'pantry-substitution-hint' }, replacements.map(item => `${item.missing} → ${item.replacement}`).join(', ')),
                h('span', { className: 'search-reason-pills' }, [
                  ...meta.matched.slice(0, 3),
                  ...replacements.map(item => item.replacement)
                ].slice(0, 4).map(item => h('em', { key: item }, item)))
              ),
              h('span', { className: meta.missing.length ? 'pantry-match-badge' : 'pantry-match-badge ready' }, pantryMatchLabel(meta))
            );
          })
        ),
        !pantryMatches.length && h('div', { className: 'empty-state pantry-empty' },
          h('h2', null, pantryItems.length ? 'Aucune idée solide' : 'Placard vide'),
          h('p', null, pantryItems.length ? 'Ajoute deux ou trois ingrédients de plus pour affiner les idées.' : 'Ajoute quelques ingrédients pour lancer les idées anti-gaspi.')
        ),
        h('div', { className: 'modal-actions' },
          h(Button, { variant: 'primary', disabled: !pantryMatches.length, onClick: viewAllMatches }, 'Voir les idées'),
          h(Button, { variant: 'subtle', disabled: !pantryItems.length, onClick: () => {
            commitItems([]);
            notify?.('Placard vidé', 'info');
          } }, 'Vider'),
          h(Button, { variant: 'ghost', onClick: onClose }, 'Fermer')
        )
      )
    );
  }

  function PantryPanelV2({ open, onClose, items = [], setItems, recipes = [], openRecipe, activatePantryMode, notify }) {
    const [draft, setDraft] = useState('');
    const [draftQuantity, setDraftQuantity] = useState('');
    const [draftExpiry, setDraftExpiry] = useState('');
    const [draftOpened, setDraftOpened] = useState(false);
    const pantryItems = useMemo(() => normalizePantryItems(items), [items]);
    const pantryMatches = useMemo(() => {
      if (!open || !pantryItems.length) return [];
      return recipes
        .map(recipe => ({ recipe, meta: scorePantryRecipe(recipe, pantryItems) }))
        .filter(item => item.meta.score > 0)
        .sort((a, b) => b.meta.score - a.meta.score || a.meta.missing.length - b.meta.missing.length || a.recipe.title.localeCompare(b.recipe.title, 'fr'))
        .slice(0, 8);
    }, [open, recipes, pantryItems]);
    const readyCount = pantryMatches.filter(item => item.meta.missing.length === 0).length;
    const nearReadyCount = pantryMatches.filter(item => item.meta.missing.length > 0 && item.meta.missing.length <= 2).length;
    const urgentCount = pantryItems.filter(item => item.priority >= 55).length;
    const openedCount = pantryItems.filter(item => item.opened).length;
    const commitItems = next => setItems?.(serializePantryItems(next));
    const clearDraft = () => {
      setDraft('');
      setDraftQuantity('');
      setDraftExpiry('');
      setDraftOpened(false);
    };
    const addItems = value => {
      const nextItems = String(value || '')
        .split(/[,;\n]+/)
        .map(item => parsePantryDraftEntry(item, { quantity: draftQuantity, expiresAt: draftExpiry, opened: draftOpened }))
        .map(serializePantryItem)
        .filter(Boolean);
      if (!nextItems.length) return;
      commitItems([...pantryItems, ...nextItems]);
      clearDraft();
    };
    const removeItem = key => commitItems(pantryItems.filter(item => item.key !== key));
    const toggleSuggestion = label => {
      const key = pantryItemKey(label);
      if (!key) return;
      if (pantryItems.some(item => item.key === key)) removeItem(key);
      else commitItems([...pantryItems, parsePantryDraftEntry(label)]);
    };
    const openMatchedRecipe = recipe => {
      onClose();
      openRecipe(recipe.id);
    };
    const viewAllMatches = () => {
      activatePantryMode?.();
      onClose();
    };

    useEffect(() => {
      if (open) clearDraft();
    }, [open]);

    if (!open) return null;
    return h('div', { className: 'modal-backdrop pantry-backdrop', onMouseDown: onClose },
      h('section', {
        className: 'modal-panel pantry-modal',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': 'pantry-modal-title',
        tabIndex: -1,
        onKeyDown: trapModalFocus,
        onMouseDown: event => event.stopPropagation()
      },
        h('div', { className: 'modal-head' },
          h('div', null,
            h('p', { className: 'eyebrow' }, 'Anti-gaspi'),
            h('h2', { id: 'pantry-modal-title' }, 'Mon placard')
          ),
          h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
        ),
        h('form', {
          className: 'pantry-add-row',
          onSubmit: event => {
            event.preventDefault();
            addItems(draft);
          }
        },
          h('label', { className: 'sr-only', htmlFor: 'pantry-add-input' }, 'Ajouter un ingredient au placard'),
          h('input', {
            id: 'pantry-add-input',
            value: draft,
            onChange: event => setDraft(event.target.value),
            placeholder: 'oeufs, citron, restes de poulet...'
          }),
          h('label', { className: 'sr-only', htmlFor: 'pantry-quantity-input' }, 'Quantite'),
          h('input', {
            id: 'pantry-quantity-input',
            value: draftQuantity,
            onChange: event => setDraftQuantity(event.target.value),
            placeholder: 'quantite'
          }),
          h('label', { className: 'sr-only', htmlFor: 'pantry-expiry-input' }, 'Date limite'),
          h('input', {
            id: 'pantry-expiry-input',
            type: 'date',
            value: draftExpiry,
            onChange: event => setDraftExpiry(event.target.value)
          }),
          h('label', { className: 'pantry-opened-toggle' },
            h('input', {
              type: 'checkbox',
              checked: draftOpened,
              onChange: event => setDraftOpened(event.target.checked)
            }),
            h('span', null, 'Ouvert / reste')
          ),
          h(Button, { variant: 'primary', type: 'submit', disabled: !draft.trim() }, 'Ajouter')
        ),
        h('div', { className: 'pantry-suggestions', 'aria-label': 'Suggestions placard' },
          PANTRY_SUGGESTIONS.map(label => {
            const active = pantryItems.some(item => item.key === pantryItemKey(label));
            return h('button', {
              key: label,
              type: 'button',
              className: active ? 'active' : '',
              'aria-pressed': active,
              onClick: () => toggleSuggestion(label)
            }, label);
          })
        ),
        pantryItems.length > 0 && h('div', { className: 'pantry-current-list' },
          pantryItems.map(item => h('button', {
            key: item.key,
            type: 'button',
            className: item.priority >= 55 ? 'urgent' : '',
            onClick: () => removeItem(item.key),
            title: 'Retirer du placard',
            'aria-label': `Retirer ${item.label} du placard`
          },
            h('strong', null, item.label),
            (item.quantity || item.status || item.opened) && h('small', null, [
              item.quantity,
              item.status ? `a utiliser: ${item.status}` : '',
              !item.status && item.opened ? 'ouvert' : ''
            ].filter(Boolean).join(' - ')),
            h('span', null, 'x')
          ))
        ),
        h('div', { className: 'pantry-score-row', role: 'status', 'aria-live': 'polite' },
          h('span', null, h('strong', null, pantryItems.length), h('small', null, 'ingredients')),
          h('span', null, h('strong', null, urgentCount), h('small', null, 'a utiliser vite')),
          h('span', null, h('strong', null, openedCount), h('small', null, 'ouverts/restes')),
          h('span', null, h('strong', null, readyCount), h('small', null, 'sans achat')),
          h('span', null, h('strong', null, nearReadyCount), h('small', null, '1-2 achats'))
        ),
        pantryMatches.length > 0 && h('div', { className: 'pantry-match-list' },
          pantryMatches.map(({ recipe, meta }) => {
            const replacements = (meta.substitutable || []).slice(0, 2);
            return h('button', {
              key: recipe.id,
              type: 'button',
              className: 'pantry-match-row',
              onClick: () => openMatchedRecipe(recipe),
              'aria-label': `Ouvrir ${recipe.title}`
            },
              h('span', { className: 'pantry-match-image', style: imageBackgroundStyle(displayRecipeImage(recipe)), 'aria-hidden': true }),
              h('span', { className: 'pantry-match-copy' },
                h('strong', null, recipe.title),
                h('small', null, meta.missing.length ? `Manque: ${meta.missing.slice(0, 3).join(', ')}` : replacements.length ? `Remplacements: ${replacements.map(item => item.missing).join(', ')}` : 'Tout est dans le placard'),
                replacements.length > 0 && h('small', { className: 'pantry-substitution-hint' }, replacements.map(item => `${item.missing} -> ${item.replacement}`).join(', ')),
                h('span', { className: 'search-reason-pills' }, [
                  ...meta.matched.slice(0, 3),
                  ...replacements.map(item => item.replacement)
                ].slice(0, 4).map(item => h('em', { key: item }, item)))
              ),
              h('span', { className: meta.missing.length ? 'pantry-match-badge' : 'pantry-match-badge ready' }, pantryMatchLabel(meta))
            );
          })
        ),
        !pantryMatches.length && h('div', { className: 'empty-state pantry-empty' },
          h('h2', null, pantryItems.length ? 'Aucune idee solide' : 'Placard vide'),
          h('p', null, pantryItems.length ? 'Ajoute deux ou trois ingredients de plus pour affiner les idees.' : 'Ajoute quelques ingredients pour lancer les idees anti-gaspi.')
        ),
        h('div', { className: 'modal-actions' },
          h(Button, { variant: 'primary', disabled: !pantryMatches.length, onClick: viewAllMatches }, 'Voir les idees'),
          h(Button, { variant: 'subtle', disabled: !pantryItems.length, onClick: () => {
            commitItems([]);
            notify?.('Placard vide', 'info');
          } }, 'Vider'),
          h(Button, { variant: 'ghost', onClick: onClose }, 'Fermer')
        )
      )
    );
  }

  function PantryAssistant({ pantryItems = [], pantryMode, openPantry, activatePantryMode, clearPantryMode, pantryMatches = [] }) {
    const visibleItems = normalizePantryItems(pantryItems).slice(0, 8);
    const best = pantryMatches[0];
    return h('section', { className: 'fridge-assistant', 'aria-label': 'Assistant placard' },
      h('div', { className: 'fridge-assistant-copy' },
        h('p', { className: 'eyebrow' }, 'Anti-gaspi'),
        h('h3', null, best ? best.recipe.title : 'Idées depuis ton placard'),
        h('p', null, best ? pantryMatchLabel(best.meta) : `${visibleItems.length} ingrédient${visibleItems.length > 1 ? 's' : ''} disponible${visibleItems.length > 1 ? 's' : ''}`)
      ),
      h('div', { className: 'fridge-assistant-controls' },
        h('button', { type: 'button', className: 'fridge-open-btn', onClick: openPantry },
          h(Icon, { name: 'pantry' }),
          h('span', null, 'Gérer le placard')
        ),
        h('div', { className: 'fridge-chips' },
          visibleItems.length
            ? visibleItems.map(item => h('button', { key: item.key, type: 'button', onClick: openPantry }, item.label))
            : PANTRY_SUGGESTIONS.slice(0, 6).map(label => h('button', { key: label, type: 'button', onClick: openPantry }, label)),
          h('button', {
            type: 'button',
            className: pantryMode ? 'active' : '',
            onClick: pantryMode ? clearPantryMode : activatePantryMode,
            disabled: !pantryItems.length
          }, pantryMode ? 'Toutes les recettes' : 'Idées placard')
        )
      )
    );
  }

  function PantryAssistantV2({ pantryItems = [], pantryMode, openPantry, activatePantryMode, clearPantryMode, pantryMatches = [] }) {
    const visibleItems = normalizePantryItems(pantryItems).slice(0, 8);
    const urgentItems = visibleItems.filter(item => item.priority >= 55);
    const best = pantryMatches[0];
    const summary = best
      ? pantryMatchLabel(best.meta)
      : urgentItems.length
        ? `${urgentItems.length} a utiliser vite`
        : `${visibleItems.length} ingredient${visibleItems.length > 1 ? 's' : ''} disponible${visibleItems.length > 1 ? 's' : ''}`;
    return h('section', { className: 'fridge-assistant', 'aria-label': 'Assistant placard' },
      h('div', { className: 'fridge-assistant-copy' },
        h('p', { className: 'eyebrow' }, 'Anti-gaspi'),
        h('h3', null, best ? best.recipe.title : 'Idees depuis ton placard'),
        h('p', null, summary)
      ),
      h('div', { className: 'fridge-assistant-controls' },
        h('button', { type: 'button', className: 'fridge-open-btn', onClick: openPantry },
          h(Icon, { name: 'pantry' }),
          h('span', null, 'Gerer le placard')
        ),
        h('div', { className: 'fridge-chips' },
          visibleItems.length
            ? visibleItems.map(item => h('button', {
              key: item.key,
              type: 'button',
              className: item.priority >= 55 ? 'urgent' : '',
              onClick: openPantry
            }, item.status ? `${item.label} - ${item.status}` : item.label))
            : PANTRY_SUGGESTIONS.slice(0, 6).map(label => h('button', { key: label, type: 'button', onClick: openPantry }, label)),
          h('button', {
            type: 'button',
            className: pantryMode ? 'active' : '',
            onClick: pantryMode ? clearPantryMode : activatePantryMode,
            disabled: !pantryItems.length
          }, pantryMode ? 'Toutes les recettes' : 'Idees placard')
        )
      )
    );
  }

  function loadCanvasImage(src) {
    return new Promise((resolve, reject) => {
      if (!src) {
        reject(new Error('Image absente.'));
        return;
      }
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  function drawImageCover(ctx, image, x, y, width, height) {
    const ratio = Math.max(width / image.width, height / image.height);
    const drawWidth = image.width * ratio;
    const drawHeight = image.height * ratio;
    ctx.drawImage(image, x + ((width - drawWidth) / 2), y + ((height - drawHeight) / 2), drawWidth, drawHeight);
  }

  function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    words.forEach(word => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    lines.slice(0, maxLines).forEach((item, index) => {
      const suffix = index === maxLines - 1 && lines.length > maxLines ? '...' : '';
      ctx.fillText(`${item}${suffix}`, x, y + (index * lineHeight));
    });
    return Math.min(lines.length, maxLines) * lineHeight;
  }

  function safeDownloadName(value) {
    return normalizeText(value)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70) || 'recette';
  }

  async function downloadSharePosterCard({ title, description, imageUrl, metaText, qrReady, qrCanvas, format = 'story' }) {
    const presets = {
      story: { width: 1080, height: 1350, hero: 820, brandY: 790, titleY: 880, descY: 1110, metaY: 1262, qrX: 858, qrY: 1112, qrBox: 150, qrSize: 126, titleSize: 74, titleWidth: 800, titleLines: 3, descWidth: 760 },
      square: { width: 1080, height: 1080, hero: 660, brandY: 632, titleY: 716, descY: 910, metaY: 1016, qrX: 870, qrY: 890, qrBox: 138, qrSize: 116, titleSize: 66, titleWidth: 770, titleLines: 2, descWidth: 700 },
      print: { width: 1240, height: 1754, hero: 640, brandY: 610, titleY: 780, descY: 1030, metaY: 1240, qrX: 970, qrY: 1490, qrBox: 178, qrSize: 148, titleSize: 76, titleWidth: 940, titleLines: 3, descWidth: 860 }
    };
    const preset = presets[format] || presets.story;
    const isPrint = format === 'print';
    const canvas = document.createElement('canvas');
    canvas.width = preset.width;
    canvas.height = preset.height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = isPrint ? '#fff8ee' : '#080706';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    try {
      const image = await loadCanvasImage(imageUrl);
      drawImageCover(ctx, image, 0, 0, canvas.width, preset.hero);
    } catch {
      const fallback = ctx.createLinearGradient(0, 0, canvas.width, preset.hero);
      fallback.addColorStop(0, '#1f1a13');
      fallback.addColorStop(1, '#090807');
      ctx.fillStyle = fallback;
      ctx.fillRect(0, 0, canvas.width, preset.hero);
    }
    const veil = ctx.createLinearGradient(0, Math.round(preset.hero * 0.25), 0, isPrint ? preset.hero + 140 : canvas.height);
    veil.addColorStop(0, 'rgba(0,0,0,.08)');
    veil.addColorStop(.55, 'rgba(0,0,0,.58)');
    veil.addColorStop(1, isPrint ? 'rgba(0,0,0,.84)' : 'rgba(0,0,0,.96)');
    ctx.fillStyle = veil;
    ctx.fillRect(0, 0, canvas.width, isPrint ? preset.hero + 140 : canvas.height);
    if (isPrint) {
      ctx.fillStyle = '#fff8ee';
      ctx.fillRect(0, preset.hero + 18, canvas.width, canvas.height - preset.hero - 18);
      ctx.fillStyle = 'rgba(107,74,28,.18)';
      ctx.fillRect(72, preset.hero + 44, canvas.width - 144, 2);
    }
    ctx.fillStyle = '#f8d779';
    ctx.font = '900 34px system-ui, -apple-system, Segoe UI, sans-serif';
    ctx.fillText('Cook Note', 72, preset.brandY);
    ctx.fillStyle = isPrint ? '#2a1c11' : '#fff7ed';
    ctx.font = `950 ${preset.titleSize}px system-ui, -apple-system, Segoe UI, sans-serif`;
    drawWrappedText(ctx, title, 72, preset.titleY, preset.titleWidth, Math.round(preset.titleSize * 1.12), preset.titleLines);
    ctx.fillStyle = isPrint ? 'rgba(42,28,17,.76)' : 'rgba(255,247,237,.76)';
    ctx.font = '700 30px system-ui, -apple-system, Segoe UI, sans-serif';
    drawWrappedText(ctx, description, 72, preset.descY, preset.descWidth, 42, isPrint ? 5 : 3);
    ctx.fillStyle = '#f8d779';
    ctx.font = '900 28px system-ui, -apple-system, Segoe UI, sans-serif';
    ctx.fillText(metaText, 72, preset.metaY);
    if (qrReady && qrCanvas) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(preset.qrX, preset.qrY, preset.qrBox, preset.qrBox);
      const offset = Math.round((preset.qrBox - preset.qrSize) / 2);
      ctx.drawImage(qrCanvas, preset.qrX + offset, preset.qrY + offset, preset.qrSize, preset.qrSize);
    }
    const link = document.createElement('a');
    link.download = `cook-note-${safeDownloadName(title)}-${format}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function trapModalFocus(event) {
    if (event.key !== 'Tab') return;
    const focusable = Array.from(event.currentTarget.querySelectorAll([
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(','))).filter(element => element.offsetParent !== null || element === document.activeElement);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function cacheUrlsForOffline(urls) {
    return new Promise((resolve, reject) => {
      if (!('serviceWorker' in navigator) || typeof MessageChannel === 'undefined') {
        reject(new Error('Service worker indisponible.'));
        return;
      }
      const channel = new MessageChannel();
      const timer = window.setTimeout(() => {
        resolve({ cached: 0, total: urls.length, timeout: true });
      }, 9000);
      channel.port1.onmessage = event => {
        window.clearTimeout(timer);
        if (event.data?.error) {
          reject(new Error('Cache offline impossible.'));
          return;
        }
        resolve(event.data || { cached: 0, total: urls.length });
      };
      navigator.serviceWorker.ready.then(registration => {
        const worker = registration.active || navigator.serviceWorker.controller || registration.waiting;
        if (!worker) {
          window.clearTimeout(timer);
          reject(new Error('Service worker non actif.'));
          return;
        }
        worker.postMessage({ type: 'CACHE_URLS', urls }, [channel.port2]);
      }).catch(error => {
        window.clearTimeout(timer);
        reject(error);
      });
    });
  }

  window.CookNotePremium = {
    PANTRY_SUGGESTIONS,
    PANTRY_LOW_IMPACT_PATTERN,
    PANTRY_OPTIONAL_PATTERN,
    cleanPantryLabel,
    parsePantryDraftEntry,
    pantryDaysUntil,
    pantryPriority,
    pantryStatusLabel,
    pantryItemKey,
    normalizePantryItems,
    serializePantryItems,
    pantryIndex,
    pantryHasIngredientName,
    substitutionOptionsForIngredient,
    getSmartSubstitutionNotes,
    getVariantAdaptationNotes,
    recipePantryRequirements,
    scorePantryRecipe,
    pantryMatchLabel,
    semanticRecipeSignals,
    recipeMatchesSearchConstraints,
    semanticRecipeSearchScore,
    searchSuggestionTerms,
    filterFreshShoppingData,
    shoppingListTextFromData,
    PantryPanel: PantryPanelV2,
    PantryAssistant: PantryAssistantV2,
    downloadSharePosterCard,
    trapModalFocus,
    cacheUrlsForOffline
  };
}());

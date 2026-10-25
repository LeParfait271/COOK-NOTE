function isVariantIngredientGroup(group, groups = [], recipe = null) {
  if (recipe?.inlineVariantResolved) return false;
  const label = normalizeText(group?.group || '');
  if (label.includes('base commune') || label === 'base' || label.includes('commun')) return false;
  if (/^\d+\)/.test(label)) return true;
  if (label.startsWith('variante') || label.startsWith('version') || label.startsWith('option')) return true;
  if (recipe?.variantGroups) return true;
  return false;
}

function buildInlineRecipeTargets(recipes) {
  const aliasesByTerm = new Map();
  const forbiddenInlineTerms = new Set([
    'base',
    'plat',
    'plats',
    'sauce',
    'sauces',
    'recette',
    'recettes',
    'cuisson',
    'service',
    'conservation'
  ]);
  const add = (term, recipe, type) => {
    const normalized = normalizeText(term).trim();
    if (normalized.length < 4 || !recipe?.id) return;
    if (forbiddenInlineTerms.has(normalized)) return;
    const titleNormalized = normalizeText(recipe.title || '');
    const priority = type === 'title' ? 0 : titleNormalized.includes(normalized) ? 1 : 2;
    const target = { term, normalized, id: recipe.id, priority };
    const existing = aliasesByTerm.get(normalized);
    if (!existing || priority < existing.priority) aliasesByTerm.set(normalized, target);
  };
  recipes.forEach(recipe => {
    if (isMasterRecipe(recipe)) return;
    add(recipe.title, recipe, 'title');
    (recipe.aliases || []).forEach(alias => add(alias, recipe, 'alias'));
  });
  return Array.from(aliasesByTerm.values()).sort((a, b) => {
    const length = b.normalized.length - a.normalized.length;
    if (length) return length;
    return a.priority - b.priority;
  });
}

function buildTechniqueTargets() {
  const targets = [];
  const seen = new Set();
  const add = (term, id, title) => {
    const normalized = normalizeText(term).trim();
    if (normalized.length < 5 || seen.has(normalized)) return;
    seen.add(normalized);
    targets.push({ term, normalized, id, title });
  };
  SORTED_TECHNIQUE_GUIDES.forEach(technique => {
    add(technique.title, technique.id, technique.title);
    (technique.aliases || []).forEach(alias => add(alias, technique.id, technique.title));
  });
  return targets.sort((a, b) => b.normalized.length - a.normalized.length);
}

function isLinkedTextBoundary(char) {
  return !char || !/[a-z0-9]/.test(char);
}

function buildNormalizedIndexMap(value) {
  let normalized = '';
  const indexMap = [];
  for (let index = 0; index < value.length; index += 1) {
    const normalizedChar = normalizeText(value[index]);
    for (let charIndex = 0; charIndex < normalizedChar.length; charIndex += 1) {
      normalized += normalizedChar[charIndex];
      indexMap.push(index);
    }
  }
  return { normalized, indexMap };
}

function findLinkedTextMatch(value, targets) {
  const { normalized, indexMap } = buildNormalizedIndexMap(value);
  for (const target of targets) {
    let index = normalized.indexOf(target.normalized);
    while (index !== -1) {
      const end = index + target.normalized.length;
      if (isLinkedTextBoundary(normalized[index - 1]) && isLinkedTextBoundary(normalized[end])) {
        return {
          target,
          index: indexMap[index] ?? 0,
          end: end >= indexMap.length ? value.length : indexMap[end]
        };
      }
      index = normalized.indexOf(target.normalized, index + 1);
    }
  }
  return null;
}

function polishDisplayText(value) {
  return String(value || '')
    .replace(/\bPrechauffer\b/g, 'Préchauffer')
    .replace(/\bDetailler\b/g, 'Détailler')
    .replace(/\bEtaler\b/g, 'Étaler')
    .replace(/\bRotir\b/g, 'Rôtir')
    .replace(/\bGouter\b/g, 'Goûter')
    .replace(/\bEgoutter\b/g, 'Égoutter')
    .replace(/\bReduire\b/g, 'Réduire')
    .replace(/\bReserver\b/g, 'Réserver')
    .replace(/\bpoele\b/g, 'poêle')
    .replace(/\bechalote\b/g, 'échalote')
    .replace(/\blegumes\b/g, 'légumes')
    .replace(/\blegume\b/g, 'légume')
    .replace(/\bepices\b/g, 'épices')
    .replace(/\bjusqu a\b/g, 'jusqu’à')
    .replace(/(^|[^A-Za-zÀ-ÖØ-öø-ÿ])([DdLlMmNnSsTt]) (?=[aeiouhàâäéèêëîïôöùûüAEIOUHÀÂÄÉÈÊËÎÏÔÖÙÛÜ])/g, '$1$2’')
    .replace(/\b([Cc]) (?=est\b|était\b|etaient\b|étaient\b|étais\b|etait\b)/g, '$1’')
    .replace(/\b([Qq]u) (?=[aeiouhàâäéèêëîïôöùûüAEIOUHÀÂÄÉÈÊËÎÏÔÖÙÛÜ])/g, '$1’')
    .replace(/\b(jusqu|lorsqu|puisqu) (?=[aeiouhàâäéèêëîïôöùûüAEIOUHÀÂÄÉÈÊËÎÏÔÖÙÛÜ])/gi, '$1’')
    .replace(/\ba l’/g, 'à l’')
    .replace(/\bA l’/g, 'À l’')
    .replace(/\bd Espelette\b/g, 'd’Espelette')
    .replace(/\baujourd hui\b/g, 'aujourd’hui')
    .replace(/\ba mi-cuisson\b/g, 'à mi-cuisson')
    .replace(/\ba coeur\b/g, 'à cœur')
    .replace(/\bau coeur\b/g, 'au cœur')
    .replace(/\bcoeur\b/g, 'cœur')
    .replace(/\b(\d{3})C\b/g, '$1°C');
}

function renderLinkedText(text, targets, openRecipe, techniqueTargets = [], openTechnique = null) {
  const rawValue = polishDisplayText(text);
  const value = rawValue;
  const activeTargets = targets;
  const activeTechniqueTargets = techniqueTargets;
  const explicitLinkPattern = /<span\s+data-goto=(["'])([^"']+)\1[^>]*>(.*?)<\/span>/i;
  const explicitMatch = value.match(explicitLinkPattern);
  if (explicitMatch) {
    const [full, , id, label] = explicitMatch;
    const index = value.indexOf(full);
    return h(React.Fragment, null,
      renderLinkedText(value.slice(0, index), targets, openRecipe, techniqueTargets, openTechnique),
      h('button', {
        type: 'button',
        className: 'inline-recipe-link',
        onClick: event => {
          event.preventDefault();
          event.stopPropagation();
          openRecipe(id);
        }
      }, label.replace(/<[^>]+>/g, '')),
      renderLinkedText(value.slice(index + full.length), targets, openRecipe, techniqueTargets, openTechnique)
    );
  }
  const targetMatch = findLinkedTextMatch(value, activeTargets);
  const techniqueMatch = openTechnique ? findLinkedTextMatch(value, activeTechniqueTargets) : null;
  if (!targetMatch && !techniqueMatch) return value;
  const targetIndex = targetMatch ? targetMatch.index : Number.POSITIVE_INFINITY;
  const techniqueIndex = techniqueMatch ? techniqueMatch.index : Number.POSITIVE_INFINITY;
  const isTechnique = Boolean(techniqueMatch) && techniqueIndex < targetIndex;
  const chosen = isTechnique ? techniqueMatch.target : targetMatch.target;
  const index = isTechnique ? techniqueMatch.index : targetIndex;
  const end = isTechnique ? techniqueMatch.end : targetMatch.end;
  const label = value.slice(index, end) || chosen.term;
  return h(React.Fragment, null,
    renderLinkedText(value.slice(0, index), targets, openRecipe, techniqueTargets, openTechnique),
    h('button', {
      type: 'button',
      className: isTechnique ? 'inline-technique-link' : 'inline-recipe-link',
      title: isTechnique ? `Voir la technique : ${chosen.title}` : undefined,
      onClick: event => {
        event.preventDefault();
        event.stopPropagation();
        if (isTechnique) openTechnique(chosen.id);
        else openRecipe(chosen.id);
      }
    }, label),
    renderLinkedText(value.slice(end), targets, openRecipe, techniqueTargets, openTechnique)
  );
}

function asTextList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(item => stripHtml(item)).filter(Boolean);
  return [stripHtml(value)].filter(Boolean);
}

function compactPracticalItems(key, items) {
  if (key !== 'storage') return items;
  const hasSpecificStorage = items.some(item => /^(?:avant cuisson|avant service|avant préparation|après cuisson|après préparation|conservation|stockage optimal)\b/i.test(stripHtml(item)));
  if (!hasSpecificStorage) return items;
  return items.filter(item => {
    const text = stripHtml(item);
    return !(/^stockage\s*:/i.test(text) && /\bp[eé]remption\b/i.test(text));
  });
}

function inferEquipment(recipe) {
  const text = normalizeText([
    recipe?.title,
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])]),
    ...(recipe?.steps || []),
    ...(recipe?.notes || [])
  ].join(' '));
  const items = [];
  if (/\b(friture|frire|huile a 180|180c|180 c|bain d huile|tempura|beignet)\b/.test(text)) {
    items.push('Casserole ou sauteuse haute', 'Thermomètre de cuisson', 'Grille d’égouttage');
  }
  if (/\b(four|enfourner|gril|plaque)\b/.test(text)) items.push('Four', 'Plaque ou plat de cuisson');
  if (/\b(mixer|mixeur|blender)\b/.test(text)) items.push('Mixeur ou blender');
  if (/\b(mortier|piler)\b/.test(text)) items.push('Mortier');
  if (/\b(fouetter|fouet|emulsion|monter avec l huile)\b/.test(text)) items.push('Fouet');
  if (/\b(poche|pocher|douille)\b/.test(text)) items.push('Poche à douille');
  return uniq(items).slice(0, 4);
}

function getRecipeEquipment(recipe) {
  const practical = recipe?.practical || {};
  return uniq([
    ...asTextList(recipe?.equipment || practical.equipment),
    ...inferEquipment(recipe)
  ]).slice(0, 8);
}

function getRecipeConservationText(recipe) {
  return normalizeText([
    recipe?.title,
    ...(recipe?.categories || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])]),
    ...(recipe?.steps || [])
  ].map(stripHtml).join(' '));
}

function inferRecipeConservation(recipe) {
  const titleText = normalizeText([
    recipe?.title,
    ...(recipe?.categories || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || [])
  ].map(stripHtml).join(' '));
  const ingredientText = normalizeText((recipe?.ingredients || [])
    .flatMap(group => [group.group, ...(group.items || [])])
    .map(stripHtml)
    .join(' '));
  const stepText = normalizeText((recipe?.steps || []).map(stripHtml).join(' '));
  const text = getRecipeConservationText(recipe);
  const categories = normalizeText((recipe?.categories || []).join(' '));
  const cooked = /\b(cuire|cuisson|cuit|cuite|frire|friture|four|enfourner|poele|saisir|mijoter|fremir|bouillir|chauffer|rotir|griller|pocher|carameliser|bain marie)\b/.test(stepText);
  const fried = /\b(friture|frire|frit|frites|tempura|beignet|bain d huile|huile de friture)\b/.test(text);
  const seafood = /\b(calamar|calamars|crevette|crevettes|moule|moules|poisson|saumon|crustace|crustaces)\b/.test(ingredientText);
  const meat = /\b(porc|poulet|boeuf|viande|cotelette|cotelettes|jambon|lardon|lardons|bacon)\b/.test(ingredientText);
  const egg = /\b(oeuf|oeufs|jaune|jaunes|blanc|blancs)\b/.test(ingredientText);
  const dairy = /\b(lait|creme|cremes|beurre|fromage|parmesan|cheddar|mozzarella|mascarpone|yaourt|chantilly)\b/.test(ingredientText);
  const rawEggSauce = /\b(mayonnaise|aioli|aïoli|rouille)\b/.test(titleText);
  const cream = /\b(creme|cremes|chantilly|patissiere|diplomate|mascarpone|mornay|ganache)\b/.test(titleText) || /\b(creme|cremes|chantilly|mascarpone|ganache)\b/.test(ingredientText);
  const coldFresh = /\b(salade|crudite|crudites|gaspacho|gazpacho|mojito|tartare|soupe froide)\b/.test(titleText);
  const coulisOrFruitSauce = /\b(coulis|marmelade|compote|fruit|fruits|fraise|framboise|abricot|poire|citron)\b/.test(text) && /\b(sucre|jus de citron|mixer|flacon|pot)\b/.test(text);
  const dough = /\b(pate|pates|farine|levure|petrir|abaisser|foncer|pointage|pousse|repos)\b/.test(text);
  const minuteBatter = /\b(tempura|pate legere|pate a beignet|pate beignet)\b/.test(text);
  const bread = /\b(pain|pains|bun|buns|burger|hot dog|brioche)\b/.test(titleText);
  const dryBaked = /\b(cookie|cookies|biscuit|biscuits|craquelin|meringue|meringues|macaron|cake|sable|sables)\b/.test(titleText);
  const hotSauce = categories.includes('sauces') && cooked && !rawEggSauce;
  const items = [];

  if (seafood || meat) {
    items.push(`Avant cuisson : garde ${seafood ? 'poisson, crustacés ou calamars' : 'viande'} au réfrigérateur à 0–4°C, couvert, et sors seulement la quantité nécessaire juste avant cuisson.`);
    if (/\b(marinade|mariner|marin[ée]e?)\b/.test(text)) {
      items.push('Avant cuisson : marinade toujours couverte au froid ; jette la marinade qui a touché le cru, ou fais-la bouillir si elle doit servir de sauce.');
    }
  } else if (minuteBatter) {
    items.push('Avant cuisson : prépare la pâte au dernier moment et garde les liquides très froids ; une pâte tempura ou beignet se conserve mal une fois mélangée.');
  } else if (dough && cooked) {
    items.push('Avant cuisson : si la pâte doit attendre, couvre-la au contact ou filme-la et garde-la au réfrigérateur ; laisse-la revenir selon la recette avant cuisson.');
  } else if (cream || rawEggSauce) {
    items.push('Avant service : garde la préparation au réfrigérateur à 0–4°C et sors-la seulement pour le montage ou le dressage.');
  } else if (coldFresh) {
    items.push('Avant service : garde les éléments lavés, coupés ou mixés au froid, couverts ; ajoute herbes, assaisonnement et garnitures fragiles au dernier moment.');
  }

  if (rawEggSauce) {
    items.push('Après préparation : pot propre fermé au réfrigérateur à 0–4°C, 24h maximum ; utilise une cuillère propre et jette si odeur, texture ou couleur change.');
  } else if (seafood) {
    items.push(fried
      ? 'Après cuisson : meilleur immédiatement ; restes refroidis vite, boîte hermétique au réfrigérateur 24h, réchauffage au four ou air fryer pour limiter la perte de croustillant.'
      : 'Après cuisson : refroidis en moins de 2h, conserve au réfrigérateur en boîte hermétique 24–48h, puis réchauffe à cœur ou consomme bien froid.');
  } else if (meat) {
    items.push('Après cuisson : refroidis en moins de 2h, conserve en boîte hermétique au réfrigérateur 2–3 jours, puis réchauffe à cœur.');
  } else if (minuteBatter) {
    items.push('Après utilisation : ne conserve pas une pâte qui a touché des aliments crus ; jette le reste et prépare une nouvelle pâte pour une autre cuisson.');
  } else if (fried) {
    items.push('Après cuisson : idéalement minute ; les restes se gardent 24h au réfrigérateur et se réchauffent au four chaud ou air fryer, jamais au micro-ondes si tu veux du croustillant.');
  } else if (bread) {
    items.push('Après cuisson : refroidis sur grille, puis garde 24–48h en sachet ou boîte fermée ; congèle bien emballé après refroidissement pour une conservation plus longue.');
  } else if (dryBaked) {
    items.push('Après cuisson : refroidis complètement, puis conserve en boîte hermétique au sec ; passe au réfrigérateur seulement si la garniture contient crème, œufs ou fruits frais.');
  } else if (cream || (egg && dairy)) {
    items.push('Après préparation : refroidis rapidement si la base est chaude, filme au contact ou ferme en boîte propre, puis conserve 24–48h au réfrigérateur.');
  } else if (coldFresh) {
    items.push('Après préparation : couvre et conserve au réfrigérateur 24h maximum ; avec jambon, mozzarella, œuf, poisson ou sauce fraîche, vise plutôt le jour même.');
  } else if (coulisOrFruitSauce) {
    items.push('Après préparation : pot ou flacon propre fermé au réfrigérateur 3–5 jours ; congélation possible en petites portions environ 2 mois.');
  } else if (hotSauce) {
    items.push('Après cuisson : refroidis vite, filme au contact ou ferme en boîte propre, conserve 24–48h au réfrigérateur et réchauffe doucement en fouettant.');
  } else if (cooked) {
    items.push('Après cuisson : refroidis rapidement, conserve en boîte hermétique au réfrigérateur 3–4 jours et réchauffe au four, à la poêle ou doucement selon la texture.');
  } else if (dairy || egg) {
    items.push('Après préparation : conserve au réfrigérateur à 0–4°C en contenant propre fermé et consomme sous 24–48h.');
  } else {
    items.push('Après préparation : conserve couvert dans un contenant propre ; mets au réfrigérateur dès qu’il y a humidité, fruit coupé, sauce ou garniture fraîche.');
  }

  return items;
}

function getRecipePracticalSections(recipe) {
  const practical = recipe?.practical || recipe?.practicalSummary || {};
  const notes = (recipe?.notes || []).map(stripHtml);
  const technical = recipe?.technical || [];
  const sections = [];
  const seenItems = new Set();
  const add = (key, title, items) => {
    const cleanItems = compactPracticalItems(key, uniqInOrder((items || []).map(stripHtml).filter(Boolean)))
      .filter(item => {
        const itemKey = noteKey(item);
        if (!itemKey || seenItems.has(itemKey)) return false;
        seenItems.add(itemKey);
        return true;
      });
    if (cleanItems.length) sections.push({ key, title, items: cleanItems.slice(0, key === 'storage' ? 6 : 4) });
  };

  const isStorageNote = note => (
    /\b(conservation|stockage|p[eé]remption|cong[eé]lation|cong[eè]le)\b/i.test(note)
    || (/\br[eé]frig[eé]rateur\b/i.test(note) && /\b(conserve|garde|consomme|stocke|ferm[eé])\b/i.test(note))
  );
  const isReheatingNote = note => /\b(r[eé]chauff|remettre au four|four doux)\b/i.test(note);
  const storageNotes = notes.filter(isStorageNote);
  const reheatingNotes = notes.filter(note => isReheatingNote(note) && !storageNotes.includes(note));
  const substitutionNotes = notes.filter(note => /\b(remplace|remplacer|substitut|substitution|à défaut|a defaut|sinon|possible avec|variante)\b/i.test(note));
  const noteAlreadyClassified = note => storageNotes.includes(note) || reheatingNotes.includes(note) || substitutionNotes.includes(note);
  const mistakeNotes = notes.filter(note => !noteAlreadyClassified(note) && /\b(ne\s|[ée]vite|attention|trop cuit|trop cuits|surcharge|surveille|sans trop)\b/i.test(note));
  const tipNotes = notes.filter(note => !storageNotes.includes(note) && !reheatingNotes.includes(note) && !mistakeNotes.includes(note) && !substitutionNotes.includes(note));
  const resultTechnical = technical
    .filter(item => /\b(texture|cible|r[eé]sultat)\b/i.test(String(item.label || item.title || '')))
    .map(item => item.value || item.text);

  add('measures', 'Repère indicatif', recipeHasSpoonMeasures(recipe) ? [SPOON_WEIGHT_NOTE] : []);
  add('tips', 'À savoir', [
    ...asTextList(recipe?.tips || practical.tips),
    ...tipNotes
  ]);
  add('pairings', 'Carte des accords', [
    ...asTextList(recipe?.pairings || practical.pairings),
    ...getRecipeFlavorPairingNotes(recipe)
  ]);
  add('ingredientGuide', 'Fiches ingrédients', [
    ...asTextList(recipe?.ingredientGuide || practical.ingredientGuide),
    ...getIngredientGuideNotes(recipe)
  ]);
  add('plating', 'Dressage', [
    ...asTextList(recipe?.plating || practical.plating),
    ...getRecipePlatingNotes(recipe)
  ]);
  add('service', 'Service', getRecipeServiceItems(recipe));
  const rawExplicitStorage = asTextList(recipe?.storage || practical.storage);
  const explicitStorage = rawExplicitStorage.length
    ? rawExplicitStorage.filter(note => !isReheatingNote(note))
    : storageNotes;
  const explicitStorageReheating = rawExplicitStorage.filter(isReheatingNote);
  add('storage', 'Conservation', [
    ...(explicitStorage.length ? [] : inferRecipeConservation(recipe)),
    ...explicitStorage
  ]);
  add('reheating', 'Réchauffage', [
    ...asTextList(recipe?.reheating || practical.reheating),
    ...explicitStorageReheating,
    ...reheatingNotes
  ]);
  add('mistakes', 'Erreurs à éviter', [
    ...asTextList(recipe?.mistakes || practical.mistakes),
    ...mistakeNotes
  ]);
  add('result', 'Résultat attendu', [
    ...asTextList(recipe?.result || practical.result),
    ...resultTechnical
  ]);

  return sections;
}

function getPrepTimeline(recipe) {
  const explicitTimeline = asTextList(recipe?.timeline || recipe?.practical?.timeline);
  if (explicitTimeline.length) {
    return explicitTimeline.slice(0, 4).map((item, index) => {
      const parts = String(item).split(/\s*:\s*/);
      if (parts.length > 1) return { label: parts.shift(), value: parts.join(': ') };
      return { label: `Repère ${index + 1}`, value: item };
    });
  }
  return [];
}

function noteKey(value) {
  return normalizeText(stripHtml(value)).replace(/[^a-z0-9]+/g, ' ').trim();
}

function noteCoveredByPracticalSection(note, practicalSections = []) {
  const text = normalizeText(stripHtml(note));
  const hasSection = key => practicalSections.some(section => section.key === key);
  if (hasSection('storage') && /\b(conservation|stockage|peremption|congelation|congele|refrigerateur)\b/.test(text)) return true;
  if (hasSection('reheating') && /\b(rechauff|remettre au four|four doux|vapeur)\b/.test(text)) return true;
  return false;
}

function getDisplayNotes(recipe, practicalSections = []) {
  const practicalKeys = new Set(
    practicalSections
      .flatMap(section => section.items || [])
      .map(noteKey)
      .filter(Boolean)
  );
  const seen = new Set();
  return (recipe?.notes || []).filter(note => {
    const key = noteKey(note);
    if (!key || practicalKeys.has(key) || noteCoveredByPracticalSection(note, practicalSections) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getRecipeIngredientText(recipe) {
  return normalizeText((recipe?.ingredients || [])
    .flatMap(group => [group.group, ...(group.items || [])])
    .map(stripHtml)
    .join(' '));
}

function getEggPartUsage(recipe) {
  const text = getRecipeIngredientText(recipe)
    .replace(/\bjaunes?\s+(?:d['’ ]?|de\s+)?oeufs?\s+cuits?\b/g, '')
    .replace(/\bblancs?\s+(?:d['’ ]?|de\s+)?oeufs?\s+cuits?\b/g, '');
  return {
    yolks: /\bjaunes?\s+(?:d['’ ]?|de\s+)?oeufs?\b/.test(text),
    whites: /\bblancs?\s+(?:d['’ ]?|de\s+)?oeufs?\b/.test(text)
  };
}

function getEggWasteRecipeRefs(recipe, recipesById = {}) {
  const usage = getEggPartUsage(recipe);
  if (usage.yolks === usage.whites) return [];

  const wantedPart = usage.yolks ? 'whites' : 'yolks';
  const role = wantedPart === 'whites' ? 'Anti-gaspillage blancs d’œufs' : 'Anti-gaspillage jaunes d’œufs';
  const categoryPriority = wantedPart === 'whites'
    ? { Desserts: 0, Base: 1, Apéro: 2, Sauces: 3 }
    : { Sauces: 0, Base: 1, Apéro: 2, Desserts: 3 };

  return Object.values(recipesById)
    .filter(candidate => {
      if (!candidate?.id || candidate.id === recipe?.id || isMasterRecipe(candidate)) return false;
      const candidateUsage = getEggPartUsage(candidate);
      return wantedPart === 'whites'
        ? candidateUsage.whites && !candidateUsage.yolks
        : candidateUsage.yolks && !candidateUsage.whites;
    })
    .sort((left, right) => {
      const leftPriority = categoryPriority[primaryCategory(left)] ?? 9;
      const rightPriority = categoryPriority[primaryCategory(right)] ?? 9;
      if (leftPriority !== rightPriority) return leftPriority - rightPriority;
      const leftDifficulty = Number.isFinite(left.difficultyScore) ? left.difficultyScore : 99;
      const rightDifficulty = Number.isFinite(right.difficultyScore) ? right.difficultyScore : 99;
      if (leftDifficulty !== rightDifficulty) return leftDifficulty - rightDifficulty;
      return left.title.localeCompare(right.title, 'fr', { sensitivity: 'base' });
    })
    .slice(0, 6)
    .map(candidate => ({ id: candidate.id, role }));
}

function extractRecipeLinkIds(recipe) {
  const text = [
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || []), group.note, ...(group.notes || [])]),
    ...(recipe?.steps || []),
    ...(recipe?.notes || []),
    ...(recipe?.technical || []).flatMap(item => [item.label, item.value, item.text])
  ].join('\n');
  const ids = [];
  for (const match of text.matchAll(/data-goto=\\?["']([^"']+)\\?["']/g)) ids.push(match[1]);
  return ids;
}

function getLinkedRecipeRefs(recipe, recipesById = {}) {
  const refs = [];
  const explicit = Array.isArray(recipe?.linkedRecipes) ? recipe.linkedRecipes : [];
  explicit.forEach(item => {
    if (typeof item === 'string') refs.push({ id: item });
    else if (item?.id) refs.push({ id: item.id, role: item.role || item.label || '' });
  });
  extractRecipeLinkIds(recipe).forEach(id => refs.push({ id }));
  getEggWasteRecipeRefs(recipe, recipesById).forEach(ref => refs.push(ref));

  const seen = new Set();
  return refs
    .filter(ref => {
      if (!ref.id || ref.id === recipe?.id || seen.has(ref.id) || !recipesById[ref.id]) return false;
      seen.add(ref.id);
      return true;
    })
    .map(ref => {
      const linked = recipesById[ref.id];
      const category = primaryCategory(linked);
      return {
        id: ref.id,
        role: ref.role || (category === 'Base' ? 'Base' : category === 'Sauces' ? 'Sauce' : 'Recette liée'),
        recipe: linked
      };
    });
}

function getRecipeWorkflowText(recipe, recipesById = {}) {
  return normalizeText([
    recipe?.title,
    recipe?.yield,
    recipe?.difficulty,
    ...(recipe?.categories || []),
    ...(recipe?.seasons || []),
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...getCompactWorkflowSignals(recipe),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || []), group.note, ...(group.notes || [])]),
    ...(recipe?.steps || []),
    ...(recipe?.notes || []),
    ...(recipe?.technical || []).flatMap(item => [item.label, item.value, item.text]),
    ...getLinkedRecipeRefs(recipe, recipesById).flatMap(item => [item.role, item.recipe.title])
  ].join(' '));
}

function getRecipeWorkflowFlags(recipe, recipesById = {}) {
  const text = getRecipeWorkflowText(recipe, recipesById);
  const steps = getRecipeSteps(recipe);
  const difficultyScore = Number.isFinite(recipe?.difficultyScore)
    ? recipe.difficultyScore
    : recipe?.difficulty === 'easy'
      ? 3
      : recipe?.difficulty === 'hard'
        ? 8
        : 5;
  return {
    rapid: steps.length > 0 && (steps.length <= 4 || /\b(rapide|15\s*min|20\s*min|express)\b/.test(text)),
    easy: difficultyScore <= 3 || normalizeText(recipe?.difficulty) === 'easy',
    oven: /\b(four|enfourner|gril|plaque|ramequin|ramequins|moule|moules|gratiner|gratin)\b/.test(text),
    frying: /\b(friture|frire|frites?|beignets?|tempura|bain d huile|huile a 180)\b/.test(text),
    vegetarian: !/\b(poulet|boeuf|bœuf|porc|lardon|lardons|bacon|jambon|poisson|saumon|thon|cabillaud|crevette|crevettes|calamar|calamars|moule|moules|viande)\b/.test(text),
    cold: /\b(froid|froide|refroidir|refrigerateur|réfrigérateur|repos au frais|chantilly|salade|coulis|gaspacho|gazpacho)\b/.test(text),
    makeAhead: /\b(repos|la veille|24h|refroidir|conservation|stockage|au frais|refrigerateur|réfrigérateur|congelation|congélation)\b/.test(text),
    weeknight: /\b(rapide|facile|simple|15\s*min|20\s*min|30\s*min|poele|poêle|four|plat)\b/.test(text) && !/\b(24h|la veille|repos une nuit|maturation)\b/.test(text),
    airFryer: /\b(air fryer|airfryer)\b/.test(text),
    plancha: /\b(plancha|saisir|griller|gril)\b/.test(text)
  };
}

function getRecipeIntentLabels(recipe, recipesById = {}) {
  const text = getRecipeWorkflowText(recipe, recipesById);
  const flags = getRecipeWorkflowFlags(recipe, recipesById);
  const labels = [];
  const add = (...items) => items.forEach(item => labels.push(item));
  const hasCookingVerb = /\b(cuire|cuisson|four|enfourner|poele|poêle|frire|friture|gril|griller|bouillir|porter a ebullition|porter à ébullition|mijoter|rotir|rôtir|gratiner)\b/.test(text);

  if (flags.rapid) add('rapide', 'express', 'vite');
  if (flags.easy) add('facile', 'simple', 'débutant');
  if (flags.oven) add('cuisson au four', 'four', 'plat au four');
  if (flags.frying) add('friture', 'croustillant', 'beignet');
  if (flags.vegetarian) add('végétarien', 'sans viande');
  if (flags.cold) add('froid', 'à servir froid');
  if (flags.makeAhead) add('à préparer à l’avance', 'la veille', 'organisation');
  if (flags.weeknight) add('soir de semaine', 'dîner rapide', 'repas simple');
  if (flags.airFryer) add('air fryer', 'croustillant sans friture');
  if (flags.plancha) add('plancha', 'grillé', 'saisi');
  if (!hasCookingVerb && !flags.oven && !flags.frying) add('sans cuisson');
  if (/\b(congel|congelation|congélation|congeler|congelateur|congélateur)\b/.test(text)) add('congelable', 'à congeler');
  if (/\b(oeuf|œuf|blancs d oeufs|jaunes d oeufs)\b/.test(text)) add('anti-gaspillage œufs', 'œufs');
  if (/\b(panier|courses|liste de courses)\b/.test(text)) add('courses');
  return uniq(labels);
}

function ingredientSearchTokens(value) {
  const normalized = normalizeText(value)
    .replace(/\bchou\s+fleur\b/g, 'choufleur')
    .replace(/\bpomme\s+de\s+terre\b/g, 'pdt')
    .replace(/\bet\b/g, ',');
  const parts = normalized
    .split(/[,;\n]+/)
    .map(part => part.replace(/\b(de|du|des|la|le|les|l)\b/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const tokens = parts.length > 1 ? parts : normalized
    .split(/\s+/)
    .map(part => part.trim())
    .filter(part => part.length > 2 && !['avec', 'sans', 'pour'].includes(part));
  return uniq(tokens);
}

const RECIPE_INGREDIENT_SEARCH_TEXT_CACHE = new WeakMap();

function getRecipeIngredientSearchText(recipe) {
  const cached = RECIPE_INGREDIENT_SEARCH_TEXT_CACHE.get(recipe);
  if (cached) return cached;
  const value = normalizeText([
    recipe?.title,
    ...(recipe?.tags || []),
    ...(recipe?.aliases || []),
    ...(recipe?.ingredients || []).flatMap(group => [group.group, ...(group.items || [])])
  ].join(' '));
  RECIPE_INGREDIENT_SEARCH_TEXT_CACHE.set(recipe, value);
  return value;
}

function scoreIngredientSearch(recipe, query) {
  const tokens = ingredientSearchTokens(query);
  if (!tokens.length) return { score: 0, matched: [], missing: [] };
  const ingredientText = getRecipeIngredientSearchText(recipe);
  const matched = [];
  const missing = [];
  tokens.forEach(token => {
    const alternatives = [token, ...(SEARCH_SYNONYMS[token] || []).map(normalizeText)];
    if (alternatives.some(item => ingredientText.includes(item) || isCloseSearchToken(item, ingredientText))) matched.push(token);
    else missing.push(token);
  });
  if (!matched.length) return { score: 0, matched, missing };
  return {
    score: matched.length * 90 - missing.length * 28 + (missing.length ? 0 : 45),
    matched,
    missing
  };
}

function getRecipeSearchFacets(recipe) {
  const difficulty = normalizeText(recipe?.difficulty || '');
  const intentLabels = getRecipeIntentLabels(recipe);
  const labels = [
    ...(recipe?.categories || []),
    ...(recipe?.seasons || []),
    primaryCategory(recipe),
    ...intentLabels
  ];
  if (difficulty === 'easy') labels.push('facile', 'simple', 'débutant');
  if (difficulty === 'medium') labels.push('moyen', 'intermédiaire', 'technique');
  if (difficulty === 'hard') labels.push('difficile', 'avancé', 'technique');
  if (isMasterRecipe(recipe)) labels.push('collection', 'catégorie', 'choisir une recette');
  if ((recipe?.tags || []).some(tag => /friture|beignet|tempura/i.test(tag))) labels.push('friture', 'croustillant');
  return uniq(labels.map(stripHtml).filter(Boolean));
}

function truncateText(value, max = 156) {
  const text = stripHtml(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function recipeDescription(recipe, recipesById = {}) {
  if (!recipe?.title) return t('site.description');
  const category = primaryCategory(recipe).toLowerCase();
  const yieldText = recipe.yield ? ` pour ${recipe.yield}` : '';
  const ingredientNames = (recipe.ingredients || [])
    .flatMap(group => group.items || [])
    .map(item => stripHtml(item).replace(/^\d+(?:[.,]\d+)?(?:\s*(?:g|kg|ml|cl|l))?\s*/i, '').trim())
    .filter(Boolean)
    .slice(0, 3);
  const ingredientsText = ingredientNames.length ? ` avec ${ingredientNames.join(', ')}` : '';
  return truncateText(t('seo.recipe.description', {
    title: recipe.title,
    category,
    yieldText,
    ingredientsText
  }));
}

function getPathRecipe() {
  const match = window.location.pathname.match(/^\/recette\/([^/?#]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getPathPage() {
  return window.location.pathname === '/techniques' || window.location.pathname === '/techniques/' ? 'techniques' : 'home';
}

function getInitialTechnique() {
  if (getPathPage() !== 'techniques') return '';
  try {
    return decodeURIComponent(window.location.hash.replace(/^#/, ''));
  } catch {
    return window.location.hash.replace(/^#/, '');
  }
}

function getRecipeUrl(recipeId, variantId = '') {
  return `/recette/${encodeURIComponent(variantId || recipeId)}/`;
}

function getHomeUrl() {
  return `${window.location.origin}/`;
}

function getTechniquesUrl() {
  return `${window.location.origin}/techniques`;
}

function getInitialRecipe() {
  const variantRecipe = getInitialVariant();
  const pathRecipe = getPathRecipe();
  if (variantRecipe && window.RECIPES?.[variantRecipe]) return variantRecipe;
  if (pathRecipe) return pathRecipe;
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return params.get('recipe');
}

function getInitialVariant() {
  const queryVariant = new URLSearchParams(window.location.search).get('variant');
  if (queryVariant) return queryVariant;
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return params.get('variant');
}

function getInitialInlineVariantKey() {
  if (!getPathRecipe()) return '';
  const variant = getInitialVariant();
  return variant && !window.RECIPES?.[variant] ? variant : '';
}

function getInlineVariantUrl(recipeId, optionKey = '') {
  const baseUrl = getRecipeUrl(recipeId);
  return optionKey ? `${baseUrl}?variant=${encodeURIComponent(optionKey)}` : baseUrl;
}

function getCurrentRecipeUrl(recipe) {
  if (!recipe?.id) return getHomeUrl();
  const inlineKey = getPathRecipe() === recipe.id ? getInitialInlineVariantKey() : '';
  return `${window.location.origin}${getInlineVariantUrl(recipe.id, inlineKey)}`;
}

function isTypingTarget(target) {
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName);
}

function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const area = document.createElement('textarea');
  area.value = text;
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  area.remove();
  return Promise.resolve();
}

function sanitizeNoteHtml(value) {
  const template = document.createElement('template');
  template.innerHTML = String(value || '');
  const allowedTags = new Set(['SPAN', 'STRONG', 'EM', 'B', 'I', 'BR']);

  function clean(node) {
    Array.from(node.childNodes).forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) return;
      if (child.nodeType !== Node.ELEMENT_NODE || !allowedTags.has(child.tagName)) {
        child.replaceWith(document.createTextNode(child.textContent || ''));
        return;
      }
      Array.from(child.attributes).forEach(attribute => {
        if (!(child.tagName === 'SPAN' && attribute.name === 'data-goto')) {
          child.removeAttribute(attribute.name);
        }
      });
      clean(child);
    });
  }

  clean(template.content);
  return template.innerHTML;
}

function setMetaContent(selector, content) {
  const node = document.head.querySelector(selector);
  if (node && content) node.setAttribute('content', content);
}

function absoluteAssetUrl(url) {
  if (!url) return undefined;
  try {
    return new URL(url, window.location.origin).href;
  } catch {
    return undefined;
  }
}

function artAsset(name, theme) {
  return CookNoteTheme.asset?.(name, theme) || FALLBACK_ART_ASSETS[name] || '';
}

function isDayArtTheme() {
  return Boolean(CookNoteTheme.dayAssetsApproved && document.documentElement?.dataset.theme === 'light');
}

function themeRecipeArtImage(recipe) {
  const theme = isDayArtTheme() ? 'light' : 'dark';
  return THEME_RECIPE_ART_IMAGES[theme]?.[recipe?.id] || '';
}

function usesOriginalParentImage(recipe) {
  return isCategoryCollectionRecipe(recipe) || isMasterRecipe(recipe);
}

function displayRecipeImage(recipe) {
  if (usesOriginalParentImage(recipe)) return themeRecipeArtImage(recipe) || recipe.image || '';
  return themeRecipeArtImage(recipe) || recipe?.image || '';
}

function collectionHeroImage(recipe) {
  return displayRecipeImage(recipe);
}

function inlineVariantImage(recipe, option) {
  const nestedRecipe = option?.group?.recipe && typeof option.group.recipe === 'object'
    ? option.group.recipe
    : {};
  const sourceImage = nestedRecipe.image || recipe?.image || '';
  const sourceId = String(sourceImage).match(/\/([^/?#]+)\.(?:jpe?g|png|webp)(?:[?#].*)?$/i)?.[1] || recipe?.id;
  const theme = isDayArtTheme() ? 'day' : 'dark';
  const themedImage = THEME_RECIPE_ART_IMAGES[theme === 'day' ? 'light' : 'dark']?.[sourceId];
  const themedFallback = `/assets/theme/${theme}/recipes/${sourceId}.jpg`;
  if (themedImage) return themedImage;
  if (imageManifestEntry(themedFallback)) {
    return `${themedFallback}?v=${SITE_VERSION.replace(/\D/g, '')}`;
  }
  return displayRecipeImage({
    ...recipe,
    ...nestedRecipe,
    id: sourceId || recipe?.id,
    image: sourceImage
  });
}

function ambilightStyle(image, extra = {}) {
  return image ? { ...extra, '--ambilight-image': cssImageValue(image) } : extra;
}

function recipeJsonLd(recipe, recipesById = {}) {
  if (!recipe || isMasterRecipe(recipe)) return null;
  const url = getCurrentRecipeUrl(recipe);
  const linkedRecipes = getLinkedRecipeRefs(recipe, recipesById);
  const keywords = uniq([...(recipe.tags || []), ...(recipe.tagsExtracted || []), ...recipeCategories(recipe), primaryCategory(recipe)]).join(', ');
  const recipeText = normalizeText([recipe.title, ...(recipe.tags || []), ...(recipe.categories || []), ...(recipe.ingredients || []).flatMap(group => group.items || [])].join(' '));
  const timing = getRecipeTiming(recipe);
  const steps = getRecipeSteps(recipe);
  const equipment = getRecipeEquipment(recipe);
  const recipeNode = {
    '@type': 'Recipe',
    '@id': `${url}#recipe`,
    name: recipe.title,
    description: recipeDescription(recipe, recipesById),
    url,
    mainEntityOfPage: url,
    image: recipe.image ? [absoluteAssetUrl(recipe.image)] : undefined,
    author: { '@type': 'Organization', name: 'Cook Note' },
    publisher: { '@type': 'Organization', name: 'Cook Note', url: getHomeUrl() },
    inLanguage: 'fr-FR',
    recipeCuisine: 'Cuisine maison',
    recipeYield: recipe.yield || undefined,
    recipeCategory: recipeCategories(recipe).join(', ') || undefined,
    keywords: keywords || undefined,
    prepTime: minutesToIsoDuration(recipe.activeTime || timing.active),
    cookTime: minutesToIsoDuration(recipe.cookTime || timing.cook),
    totalTime: minutesToIsoDuration(recipe.totalTime || timing.total),
    suitableForDiet: /\b(vegetarien|végétarien|sans viande)\b/.test(recipeText) ? 'https://schema.org/VegetarianDiet' : undefined,
    recipeIngredient: (recipe.ingredients || []).flatMap(group => group.items || []).map(stripHtml),
    recipeInstructions: steps.map((step, index) => ({ '@type': 'HowToStep', position: index + 1, name: `Étape ${index + 1}`, text: stripHtml(step) })),
    tool: equipment.map(item => ({ '@type': 'HowToTool', name: stripHtml(item) })),
    isAccessibleForFree: true,
    mentions: linkedRecipes.map(item => ({
      '@type': 'Recipe',
      name: item.recipe.title,
      url: `${window.location.origin}${getRecipeUrl(item.id)}`
    }))
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      recipeNode,
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Cook Note', item: getHomeUrl() },
          { '@type': 'ListItem', position: 2, name: primaryCategory(recipe), item: getHomeUrl() },
          { '@type': 'ListItem', position: 3, name: recipe.title, item: url }
        ]
      }
    ]
  };
}

function websiteJsonLd() {
  const url = getHomeUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cook Note',
    description: t('site.description'),
    url,
    inLanguage: 'fr-FR',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

function techniquesJsonLd() {
  const url = getTechniquesUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('seo.techniques.title').replace(' - Cook Note', ''),
    description: t('seo.techniques.description'),
    url,
    inLanguage: 'fr-FR',
    hasPart: SORTED_TECHNIQUE_GUIDES.map(guide => ({
      '@type': 'HowTo',
      name: guide.title,
      description: guide.description,
      url: `${url}#${guide.id}`,
      step: (guide.steps || []).map(step => ({ '@type': 'HowToStep', text: step }))
    }))
  };
}

function updateDocumentMeta(recipe, recipesById = {}, page = 'home') {
  const isTechniques = page === 'techniques';
  const title = isTechniques
    ? t('seo.techniques.title')
    : recipe?.title
      ? `${recipe.title} - Cook Note`
      : t('seo.home.title');
  const description = isTechniques
    ? t('seo.techniques.description')
    : recipe?.title
      ? recipeDescription(recipe, recipesById)
      : t('site.description');
  const canonicalUrl = isTechniques
    ? getTechniquesUrl()
    : recipe?.id
      ? getCurrentRecipeUrl(recipe)
      : getHomeUrl();
  document.title = title;
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:type"]', recipe && !isMasterRecipe(recipe) ? 'article' : 'website');
  setMetaContent('meta[property="og:url"]', canonicalUrl);
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', description);
  setMetaContent('meta[name="twitter:card"]', 'summary_large_image');
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);
  const image = absoluteAssetUrl(recipe?.image || artAsset('hero'));
  setMetaContent('meta[property="og:image"]', image);
  setMetaContent('meta[property="og:image:secure_url"]', image);
  setMetaContent('meta[name="twitter:image"]', image);
  document.getElementById('recipe-jsonld')?.remove();
  const jsonLd = isTechniques ? techniquesJsonLd() : (recipeJsonLd(recipe, recipesById) || websiteJsonLd());
  if (jsonLd) {
    const script = document.createElement('script');
    script.id = 'recipe-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }
}


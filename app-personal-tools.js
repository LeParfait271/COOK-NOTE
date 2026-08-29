// Cook Note personal tools loaded before app.js.
(function () {
  const h = React.createElement;
  const { useEffect, useMemo, useState } = React;
  const STOP_WORDS = new Set(['avec', 'aux', 'des', 'dans', 'les', 'pour', 'sans', 'une', 'maison', 'variante', 'variantes']);

  function t(key, vars) {
    return window.CookNoteI18n && typeof window.CookNoteI18n.t === 'function'
      ? window.CookNoteI18n.t(key, vars)
      : key;
  }

  function normalize(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\u0153/g, 'oe')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function plain(value) {
    return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function ingredientItems(recipe) {
    return (recipe && Array.isArray(recipe.ingredients) ? recipe.ingredients : [])
      .flatMap(group => typeof group === 'string' ? [group] : Array.isArray(group && group.items) ? group.items : [])
      .map(plain)
      .filter(Boolean);
  }

  function searchText(recipe) {
    return normalize([
      recipe && recipe.title,
      ...(recipe && recipe.categories || []),
      ...(recipe && recipe.tags || []),
      ...ingredientItems(recipe),
      ...(recipe && recipe.steps || [])
    ].join(' '));
  }

  function cleanSnapshot(value, depth) {
    if (depth > 8) return null;
    if (Array.isArray(value)) return value.slice(0, 120).map(item => cleanSnapshot(item, depth + 1));
    if (!value || typeof value !== 'object') return typeof value === 'string' ? value.slice(0, 5000) : value;
    const result = {};
    Object.keys(value).sort().forEach(key => {
      if (key !== 'id' && key !== 'tagsExtracted') result[key] = cleanSnapshot(value[key], depth + 1);
    });
    return result;
  }

  function snapshotRecipe(recipe) {
    return cleanSnapshot(recipe || {}, 0);
  }

  function recipeFingerprint(recipe) {
    const source = JSON.stringify(snapshotRecipe(recipe));
    let hash = 2166136261;
    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function captureRecipeVersion(history, recipeId, recipe, siteVersion, savedAt) {
    if (!recipeId || !recipe || !Array.isArray(recipe.steps)) return history || {};
    const current = history && typeof history === 'object' ? history : {};
    const snapshot = snapshotRecipe(recipe);
    const fingerprint = recipeFingerprint(snapshot);
    const entries = Array.isArray(current[recipeId]) ? current[recipeId] : [];
    if (entries.some(entry => entry && entry.fingerprint === fingerprint)) return current;
    const next = {
      ...current,
      [recipeId]: [{
        fingerprint,
        siteVersion: String(siteVersion || ''),
        savedAt: savedAt || new Date().toISOString(),
        recipe: snapshot
      }, ...entries].slice(0, 4)
    };
    Object.keys(next)
      .sort((left, right) => String(next[right] && next[right][0] && next[right][0].savedAt || '').localeCompare(String(next[left] && next[left][0] && next[left][0].savedAt || '')))
      .slice(30)
      .forEach(id => delete next[id]);
    return next;
  }

  function describeChanges(candidate, published) {
    if (!candidate || !published) return [];
    const changes = [];
    const ingredientDelta = ingredientItems(candidate).length - ingredientItems(published).length;
    const stepDelta = (candidate.steps || []).length - (published.steps || []).length;
    if (candidate.title !== published.title) changes.push(t('personal.historyTitleChanged'));
    if (ingredientDelta) changes.push(t('personal.historyIngredientDelta', { direction: ingredientDelta > 0 ? '+' : '-', count: Math.abs(ingredientDelta) }));
    if (stepDelta) changes.push(t('personal.historyStepDelta', { direction: stepDelta > 0 ? '+' : '-', count: Math.abs(stepDelta) }));
    if (JSON.stringify(candidate.notes || []) !== JSON.stringify(published.notes || [])) changes.push(t('personal.historyNotesChanged'));
    if (JSON.stringify(candidate.practical || {}) !== JSON.stringify(published.practical || {})) changes.push(t('personal.historyPracticalChanged'));
    return changes.length ? changes : [t('personal.historyDetailsChanged')];
  }

  function normalizeEquipmentProfile(profile) {
    const source = profile && typeof profile === 'object' ? profile : {};
    const items = Array.isArray(source.items) ? source.items : String(source.items || '').split(',');
    return {
      items: [...new Set(items.map(item => plain(item).trim()).filter(Boolean))].slice(0, 40),
      ovenOffset: Math.max(-30, Math.min(30, Number(source.ovenOffset) || 0)),
      roundMold: Math.max(0, Math.min(50, Number(source.roundMold) || 0)),
      rectWidth: Math.max(0, Math.min(60, Number(source.rectWidth) || 0)),
      rectLength: Math.max(0, Math.min(80, Number(source.rectLength) || 0))
    };
  }

  function equipmentCompatibility(required, profile) {
    const normalized = normalizeEquipmentProfile(profile);
    const owned = normalize(normalized.items.join(' '));
    const noise = new Set(['adapte', 'adaptee', 'grand', 'grande', 'petit', 'petite', 'necessaire', 'cuisson']);
    const items = (required || []).map(label => {
      const tokens = normalize(label).split(' ').filter(token => token.length > 2 && !noise.has(token)).slice(0, 4);
      return { label, owned: Boolean(tokens.length && tokens.some(token => owned.includes(token))) };
    });
    return {
      items,
      profile: normalized,
      configured: normalized.items.length > 0 || normalized.ovenOffset !== 0 || normalized.roundMold > 0 || normalized.rectWidth > 0
    };
  }

  function countUnits(items, pattern) {
    return items.reduce((total, item) => {
      const clean = normalize(item);
      if (!pattern.test(clean)) return total;
      const match = clean.match(/(?:^|\s)(\d+(?:\.\d+)?)\s*/);
      return total + (match ? Number(match[1]) : 1);
    }, 0);
  }

  function detectMold(recipe) {
    const source = normalize([recipe && recipe.title, ...ingredientItems(recipe), ...(recipe && recipe.steps || []), ...(recipe && recipe.notes || [])].join(' '));
    if (!/\b(moule|cercle|tarte|gateau|cake|flan|entremets|cheesecake|brioche)\b/.test(source)) return null;
    const rectangle = source.match(/\b(\d{2})\s*(?:x|par)\s*(\d{2})\s*cm\b/);
    if (rectangle) return { shape: 'rectangle', width: Number(rectangle[1]), length: Number(rectangle[2]), diameter: 0 };
    const round = source.match(/\b(?:moule|cercle)(?:\s+\w+){0,3}\s+(\d{2})\s*cm\b/) || source.match(/\b(\d{2})\s*cm(?:\s+de)?\s+diametre\b/);
    return {
      shape: /\b(moule a cake|rectangulaire)\b/.test(source) ? 'rectangle' : 'round',
      width: 0,
      length: 0,
      diameter: round ? Number(round[1]) : 0
    };
  }

  function moldArea(shape, primary, secondary) {
    const first = Number(primary);
    const second = Number(secondary);
    if (!Number.isFinite(first) || first <= 0) return 0;
    return shape === 'rectangle'
      ? Number.isFinite(second) && second > 0 ? first * second : 0
      : Math.PI * Math.pow(first / 2, 2);
  }

  function calculateMoldFactor(source, target) {
    const sourceArea = moldArea(source.shape, source.shape === 'round' ? source.diameter : source.width, source.length);
    const targetArea = moldArea(target.shape, target.shape === 'round' ? target.diameter : target.width, target.length);
    return sourceArea && targetArea ? Math.max(0.2, Math.min(5, targetArea / sourceArea)) : 0;
  }

  function byproductNeeds(recipe) {
    const items = ingredientItems(recipe);
    const whites = countUnits(items, /\bblancs?(?: d oeufs?)?\b/);
    const yolks = countUnits(items, /\bjaunes?(?: d oeufs?)?\b/);
    const whole = countUnits(items, /\boeufs?\b/) - whites - yolks;
    const needs = [];
    if (yolks > 0 && whites === 0 && whole <= 0) needs.push({ key: 'whites', count: yolks, pattern: /\bblancs?(?: d oeufs?)?\b/ });
    if (whites > 0 && yolks === 0 && whole <= 0) needs.push({ key: 'yolks', count: whites, pattern: /\bjaunes?(?: d oeufs?)?\b/ });
    const source = searchText(recipe);
    if (/\bzeste(?:s)? de citron\b/.test(source) && !/\bjus de citron\b/.test(source)) needs.push({ key: 'lemonJuice', count: 0, pattern: /\bjus de citron\b/ });
    return needs;
  }

  function byproductMatches(recipe, recipes) {
    return byproductNeeds(recipe).map(need => {
      const matches = (recipes || [])
        .filter(candidate => candidate && candidate.id !== recipe.id && !candidate.variants && Array.isArray(candidate.ingredients))
        .filter(candidate => need.pattern.test(searchText(candidate)))
        .map(candidate => {
          const count = need.key === 'whites'
            ? countUnits(ingredientItems(candidate), /\bblancs?(?: d oeufs?)?\b/)
            : need.key === 'yolks'
              ? countUnits(ingredientItems(candidate), /\bjaunes?(?: d oeufs?)?\b/)
              : 0;
          return { recipe: candidate, count, distance: need.count && count ? Math.abs(need.count - count) : 0 };
        })
        .sort((left, right) => left.distance - right.distance || left.recipe.title.localeCompare(right.recipe.title, 'fr'))
        .slice(0, 4);
      return { ...need, matches };
    });
  }

  function tokens(value) {
    return new Set(normalize(value).split(' ').filter(token => token.length > 2 && !STOP_WORDS.has(token)));
  }

  function jaccard(left, right) {
    if (!left.size || !right.size) return 0;
    let common = 0;
    left.forEach(value => { if (right.has(value)) common += 1; });
    return common / (left.size + right.size - common);
  }

  function findSimilarRecipes(recipes, limit) {
    const leaves = (recipes || [])
      .filter(recipe => recipe && recipe.id && !recipe.variants && Array.isArray(recipe.ingredients))
      .map(recipe => ({
        recipe,
        title: tokens(recipe.title),
        ingredients: tokens(ingredientItems(recipe).join(' '))
      }));
    const pairs = [];
    for (let leftIndex = 0; leftIndex < leaves.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < leaves.length; rightIndex += 1) {
        const left = leaves[leftIndex];
        const right = leaves[rightIndex];
        const titleScore = jaccard(left.title, right.title);
        const ingredientScore = jaccard(left.ingredients, right.ingredients);
        const sameParent = Boolean(left.recipe.master && left.recipe.master === right.recipe.master);
        const score = titleScore * 0.58 + ingredientScore * 0.32 + (sameParent ? 0.1 : 0);
        if (score < 0.43 || (titleScore < 0.34 && ingredientScore < 0.5)) continue;
        const reasons = [];
        if (sameParent) reasons.push(t('personal.similarSameFamily'));
        if (titleScore >= 0.34) reasons.push(t('personal.similarTitle', { percent: Math.round(titleScore * 100) }));
        if (ingredientScore >= 0.35) reasons.push(t('personal.similarIngredients', { percent: Math.round(ingredientScore * 100) }));
        pairs.push({ left: left.recipe, right: right.recipe, score, reasons });
      }
    }
    return pairs.sort((left, right) => right.score - left.score || left.left.title.localeCompare(right.left.title, 'fr')).slice(0, Number(limit) || 20);
  }

  const SERVICE_FORMATS = Object.freeze({
    restaurant: { label: 'Service restaurant', factor: 1 },
    tasting: { label: 'Menu dégustation', factor: 0.6 },
    buffet: { label: 'Buffet', factor: 1.15 },
    banquet: { label: 'Banquet', factor: 1.05 }
  });

  function recipeDuration(recipe) {
    const active = Math.max(0, Number(recipe && recipe.activeTime) || 0);
    const cook = Math.max(0, Number(recipe && recipe.cookTime) || 0);
    const rest = Math.max(0, Number(recipe && recipe.restTime) || 0);
    return { active, cook, rest, total: active + cook + rest };
  }

  function buildProductionPlan(recipes, serviceAt) {
    const end = new Date(serviceAt);
    if (!Number.isFinite(end.getTime())) return [];
    return (recipes || []).map(recipe => {
      const duration = recipeDuration(recipe);
      return {
        recipe,
        duration,
        startsAt: duration.total ? new Date(end.getTime() - duration.total * 60000) : null,
        serviceAt: end
      };
    }).sort((left, right) => (left.startsAt ? left.startsAt.getTime() : Infinity) - (right.startsAt ? right.startsAt.getTime() : Infinity));
  }

  function getRestaurantStorageGuidance(recipe) {
    const practical = recipe && recipe.practical && Array.isArray(recipe.practical.storage) ? recipe.practical.storage : [];
    const notes = (recipe && Array.isArray(recipe.notes) ? recipe.notes : [])
      .map(plain)
      .filter(note => /\b(conservation|conserver|refriger|congel|au froid|sous vide)\b/i.test(normalize(note)));
    return [...new Set([...practical.map(plain), ...notes])].filter(Boolean);
  }

  function ProfessionalKitchenTools({ recipes, ensureCatalog, getAllergens }) {
    const [section, setSection] = useState('production');
    const [catalog, setCatalog] = useState(recipes || []);
    const [selectedIds, setSelectedIds] = useState([]);
    const [query, setQuery] = useState('');
    const [serviceAt, setServiceAt] = useState(() => {
      const date = new Date(Date.now() + 4 * 3600000);
      date.setMinutes(Math.ceil(date.getMinutes() / 15) * 15, 0, 0);
      return date.toISOString().slice(0, 16);
    });
    const [format, setFormat] = useState('restaurant');
    const [covers, setCovers] = useState(20);
    useEffect(() => {
      Promise.resolve(typeof ensureCatalog === 'function' ? ensureCatalog() : null).then(source => {
        if (!source || typeof source !== 'object') return;
        setCatalog(Object.entries(source).map(([id, recipe]) => ({ id, ...recipe })));
      }).catch(() => null);
    }, []);
    const leaves = useMemo(() => (catalog || []).filter(recipe => recipe && recipe.id && !recipe.variants && Array.isArray(recipe.ingredients)), [catalog]);
    const filtered = useMemo(() => {
      const needle = normalize(query);
      return leaves.filter(recipe => !needle || searchText(recipe).includes(needle)).slice(0, 40);
    }, [leaves, query]);
    const selected = useMemo(() => selectedIds.map(id => leaves.find(recipe => recipe.id === id)).filter(Boolean), [selectedIds, leaves]);
    const toggle = id => setSelectedIds(current => current.includes(id) ? current.filter(item => item !== id) : current.length < 12 ? [...current, id] : current);
    const plan = buildProductionPlan(selected, serviceAt);
    const allergens = useMemo(() => [...new Set(selected.flatMap(recipe => typeof getAllergens === 'function' ? getAllergens(recipe) : []))].sort((a, b) => a.localeCompare(b, 'fr')), [selected, getAllergens]);
    const time = value => value && value.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const tabs = [
      ['production', 'Plan de production'], ['allergens', 'Matrice allergènes'],
      ['formats', 'Formats de service'], ['leftovers', 'Gestion des restes']
    ];
    return h('div', { className: 'restaurant-tools' },
      h('div', { className: 'restaurant-tools-tabs', role: 'tablist', 'aria-label': 'Outils restaurant' },
        tabs.map(([id, label]) => h('button', { key: id, type: 'button', role: 'tab', className: section === id ? 'active' : '', 'aria-selected': section === id, onClick: () => setSection(id) }, label))
      ),
      h('p', { className: 'personal-tool-notice' }, 'Outils indicatifs calculés à partir des fiches existantes. Ils ne remplacent ni le PMS, ni les étiquettes fournisseurs, ni la vérification des contaminations croisées.'),
      h('label', { className: 'field restaurant-search' }, h('span', null, 'Choisir jusqu’à 12 recettes'), h('input', { type: 'search', value: query, placeholder: 'Rechercher une recette', onChange: event => setQuery(event.target.value) })),
      h('div', { className: 'restaurant-recipe-picker' }, filtered.map(recipe => h('label', { key: recipe.id, className: selectedIds.includes(recipe.id) ? 'selected' : '' },
        h('input', { type: 'checkbox', checked: selectedIds.includes(recipe.id), onChange: () => toggle(recipe.id) }), h('span', null, recipe.title)
      ))),
      !selected.length && h('p', { className: 'personal-tool-empty' }, 'Sélectionne au moins une recette pour afficher cet outil.'),
      section === 'production' && selected.length > 0 && h('section', { className: 'restaurant-result' },
        h('label', { className: 'field' }, h('span', null, 'Heure de service'), h('input', { type: 'datetime-local', value: serviceAt, onChange: event => setServiceAt(event.target.value) })),
        h('div', { className: 'production-plan' }, plan.map(item => h('article', { key: item.recipe.id },
          h('strong', null, item.recipe.title),
          item.startsAt ? h('p', null, `${time(item.startsAt)} → ${time(item.serviceAt)}`) : h('p', null, 'Durée non structurée dans la fiche.'),
          item.duration.total > 0 && h('small', null, `Actif ${item.duration.active}min · Cuisson ${item.duration.cook}min · Repos ${item.duration.rest}min`)
        )))
      ),
      section === 'allergens' && selected.length > 0 && h('section', { className: 'restaurant-result restaurant-table-wrap' },
        allergens.length ? h('table', { className: 'allergen-matrix' },
          h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Recette'), allergens.map(item => h('th', { key: item, scope: 'col' }, item)))),
          h('tbody', null, selected.map(recipe => { const found = typeof getAllergens === 'function' ? getAllergens(recipe) : []; return h('tr', { key: recipe.id }, h('th', { scope: 'row' }, recipe.title), allergens.map(item => h('td', { key: item }, found.includes(item) ? '✓' : '—'))); }))
        ) : h('p', null, 'Aucun allergène détecté automatiquement. Vérification manuelle obligatoire.')
      ),
      section === 'formats' && selected.length > 0 && h('section', { className: 'restaurant-result' },
        h('div', { className: 'personal-tools-form-grid' },
          h('label', null, h('span', null, 'Format'), h('select', { value: format, onChange: event => setFormat(event.target.value) }, Object.entries(SERVICE_FORMATS).map(([id, item]) => h('option', { key: id, value: id }, item.label)))),
          h('label', null, h('span', null, 'Couverts prévus'), h('input', { type: 'number', min: 1, max: 1000, value: covers, onChange: event => setCovers(Math.max(1, Number(event.target.value) || 1)) }))
        ),
        h('p', { className: 'service-format-result' }, h('strong', null, `${Math.ceil(covers * SERVICE_FORMATS[format].factor)} portions de référence`), h('small', null, `Coefficient indicatif × ${String(SERVICE_FORMATS[format].factor).replace('.', ',')} — les quantités originales restent inchangées.`))
      ),
      section === 'leftovers' && selected.length > 0 && h('section', { className: 'restaurant-result leftovers-list' }, selected.map(recipe => {
        const guidance = getRestaurantStorageGuidance(recipe);
        return h('article', { key: recipe.id }, h('strong', null, recipe.title), guidance.length
          ? h('ul', null, guidance.map((item, index) => h('li', { key: index }, item)))
          : h('p', null, 'Aucune consigne validée dans la fiche : ne pas déduire une durée ni un réemploi.'));
      }))
    );
  }

  function RecipeHistoryBlock({ recipe, publishedRecipe, entries, activeOverride, onRestore, onClear, Disclosure }) {
    if (!recipe) return null;
    const version = /^\d+\.\d{2}$/.test(String(recipe.recipeVersion || '')) ? recipe.recipeVersion : '1.00';
    return h('section', { className: 'personal-history-block notes-static-card', 'aria-label': 'Version de la fiche' },
      h('p', { className: 'eyebrow' }, 'Version de la fiche'),
      h('strong', { className: 'recipe-version-value' }, `v${version}`)
    );
  }

  function EquipmentProfileBlock({ requiredEquipment, profile, Disclosure }) {
    if (!Disclosure) return null;
    const match = equipmentCompatibility(requiredEquipment, profile);
    if (!match.configured || !match.items.length) return null;
    return h(Disclosure, { className: 'personal-equipment-block', label: t('personal.equipmentRecipe'), ariaLabel: t('personal.equipmentRecipeAria') },
      h('ul', { className: 'personal-equipment-list' },
        match.items.map(item => h('li', { key: item.label, className: item.owned ? 'is-owned' : 'is-unconfirmed' },
          h('span', { 'aria-hidden': true }, item.owned ? '✓' : '?'),
          h('span', null, item.label),
          h('small', null, item.owned ? t('personal.equipmentOwned') : t('personal.equipmentCheck'))
        ))
      ),
      match.profile.ovenOffset !== 0 && match.items.some(item => /\bfour\b/i.test(item.label)) && h('p', { className: 'personal-tool-notice' },
        t('personal.equipmentOvenOffset', { offset: match.profile.ovenOffset > 0 ? '+' + match.profile.ovenOffset : match.profile.ovenOffset })
      )
    );
  }

  function MoldCalculatorBlock({ recipe, profile, Disclosure }) {
    const detected = useMemo(() => detectMold(recipe), [recipe]);
    const saved = useMemo(() => normalizeEquipmentProfile(profile), [profile]);
    const [sourceShape, setSourceShape] = useState(detected && detected.shape || 'round');
    const [sourcePrimary, setSourcePrimary] = useState(detected && (detected.shape === 'round' ? detected.diameter : detected.width) || '');
    const [sourceSecondary, setSourceSecondary] = useState(detected && detected.length || '');
    const [targetShape, setTargetShape] = useState(saved.roundMold ? 'round' : saved.rectWidth && saved.rectLength ? 'rectangle' : 'round');
    const [targetPrimary, setTargetPrimary] = useState(saved.roundMold || saved.rectWidth || '');
    const [targetSecondary, setTargetSecondary] = useState(saved.rectLength || '');
    useEffect(() => {
      if (!detected) return;
      setSourceShape(detected.shape);
      setSourcePrimary(detected.shape === 'round' ? detected.diameter || '' : detected.width || '');
      setSourceSecondary(detected.length || '');
    }, [recipe && recipe.id]);
    if (!Disclosure || !detected) return null;
    const factor = calculateMoldFactor(
      { shape: sourceShape, diameter: sourcePrimary, width: sourcePrimary, length: sourceSecondary },
      { shape: targetShape, diameter: targetPrimary, width: targetPrimary, length: targetSecondary }
    );
    const fields = (shape, primary, setPrimary, secondary, setSecondary) => h('div', { className: 'personal-mold-fields' },
      h('label', null, h('span', null, shape === 'round' ? t('personal.moldDiameter') : t('personal.moldWidth')),
        h('input', { type: 'number', min: 5, max: 80, step: 1, value: primary, onChange: event => setPrimary(event.target.value) })),
      shape === 'rectangle' && h('label', null, h('span', null, t('personal.moldLength')),
        h('input', { type: 'number', min: 5, max: 100, step: 1, value: secondary, onChange: event => setSecondary(event.target.value) }))
    );
    const mold = (title, shape, setShape, primary, setPrimary, secondary, setSecondary) => h('fieldset', null,
      h('legend', null, title),
      h('select', { value: shape, onChange: event => setShape(event.target.value) },
        h('option', { value: 'round' }, t('personal.moldRound')),
        h('option', { value: 'rectangle' }, t('personal.moldRectangle'))
      ),
      fields(shape, primary, setPrimary, secondary, setSecondary)
    );
    return h(Disclosure, { className: 'personal-mold-block', label: t('personal.mold'), ariaLabel: t('personal.moldAria') },
      h('p', { className: 'personal-tool-help' }, t('personal.moldHelp')),
      h('div', { className: 'personal-mold-grid' },
        mold(t('personal.moldSource'), sourceShape, setSourceShape, sourcePrimary, setSourcePrimary, sourceSecondary, setSourceSecondary),
        mold(t('personal.moldTarget'), targetShape, setTargetShape, targetPrimary, setTargetPrimary, targetSecondary, setTargetSecondary)
      ),
      factor > 0 && h('div', { className: 'personal-mold-result', role: 'status' },
        h('strong', null, t('personal.moldFactor', { factor: factor.toFixed(2).replace('.', ',') })),
        h('span', null, factor > 1 ? t('personal.moldMore') : factor < 1 ? t('personal.moldLess') : t('personal.moldSame')),
        h('small', null, t('personal.moldCaution'))
      )
    );
  }

  function ByproductBlock({ recipe, recipes, openRecipe, ensureCatalog }) {
    const [loading, setLoading] = useState(false);
    const needs = useMemo(() => byproductMatches(recipe, recipes), [recipe, recipes]);
    if (!needs.length) return null;
    const load = event => {
      if (!event.currentTarget.open || typeof ensureCatalog !== 'function') return;
      setLoading(true);
      Promise.resolve(ensureCatalog()).catch(() => null).finally(() => setLoading(false));
    };
    return h('details', { className: 'notes-disclosure personal-byproduct-block', onToggle: load },
      h('summary', { className: 'notes-disclosure-summary' },
        h('span', null, t('personal.byproducts')),
        h('span', { className: 'notes-disclosure-icon', 'aria-hidden': true }, '+')
      ),
      h('div', { className: 'notes-disclosure-body' },
        h('p', { className: 'personal-tool-help' }, t('personal.byproductsHelp')),
        loading && h('p', { role: 'status' }, t('personal.analysisLoading')),
        needs.map(need => h('section', { key: need.key, className: 'personal-byproduct-section' },
          h('strong', null, t('personal.byproduct.' + need.key, { count: need.count })),
          need.matches.length
            ? h('div', { className: 'personal-recipe-links' },
              need.matches.map(match => h('button', { key: match.recipe.id, type: 'button', onClick: () => openRecipe(match.recipe.id) },
                h('span', null, match.recipe.title),
                match.count > 0 && h('small', null, t('personal.byproductCount', { count: match.count }))
              ))
            )
            : !loading && h('small', null, t('personal.byproductsNoMatch'))
        ))
      )
    );
  }

  function PersonalToolsPanel({ open, onClose, profile, saveProfile, recipes, ensureCatalog, openRecipe, icon, getAllergens, initialTab }) {
    const [tab, setTab] = useState('equipment');
    const [draft, setDraft] = useState(() => normalizeEquipmentProfile(profile));
    const [pairs, setPairs] = useState([]);
    const [busy, setBusy] = useState(false);
    useEffect(() => {
      if (open) {
        setDraft(normalizeEquipmentProfile(profile));
        if (initialTab) setTab(initialTab);
      }
    }, [open, profile, initialTab]);
    if (!open) return null;
    const update = patch => setDraft(current => ({ ...current, ...patch }));
    const analyze = () => {
      setBusy(true);
      Promise.resolve(typeof ensureCatalog === 'function' ? ensureCatalog() : null)
        .then(source => {
          const list = source && typeof source === 'object'
            ? Object.entries(source).map(([id, recipe]) => ({ id, ...recipe }))
            : recipes;
          return new Promise(resolve => window.setTimeout(() => resolve(findSimilarRecipes(list, 18)), 0));
        })
        .then(setPairs)
        .finally(() => setBusy(false));
    };
    return h('div', { className: 'modal-backdrop', onMouseDown: onClose },
      h('section', { className: 'modal-panel personal-tools-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'personal-tools-title', tabIndex: -1, onKeyDown: window.CookNotePremium?.trapModalFocus, onMouseDown: event => event.stopPropagation() },
        h('div', { className: 'modal-head' },
          h('div', null, h('p', { className: 'eyebrow' }, t('personal.kicker')), h('h2', { id: 'personal-tools-title' }, t('personal.title'))),
          h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': t('common.close') }, typeof icon === 'function' ? icon('close') : '×')
        ),
        h('div', { className: 'personal-tools-tabs', role: 'tablist', 'aria-label': t('personal.tabsAria') },
          [['equipment', t('personal.tab.equipment')], ['catalog', t('personal.tab.catalog')], ['restaurant', 'Restaurant']].map(([item, label]) => h('button', { key: item, type: 'button', role: 'tab', className: tab === item ? 'active' : '', 'aria-selected': tab === item, onClick: () => setTab(item) }, label))
        ),
        tab === 'equipment' && h('div', { className: 'personal-tools-content', role: 'tabpanel' },
          h('p', { className: 'personal-tool-help' }, t('personal.equipmentHelp')),
          h('label', { className: 'personal-tools-wide-field field' },
            h('span', null, t('personal.equipmentList')),
            h('textarea', { rows: 3, value: draft.items.join(', '), placeholder: t('personal.equipmentPlaceholder'), onChange: event => update({ items: event.target.value.split(',').map(item => item.trim()).filter(Boolean) }) })
          ),
          h('div', { className: 'personal-tools-form-grid' },
            h('label', null, h('span', null, t('personal.ovenOffset')), h('input', { type: 'number', min: -30, max: 30, step: 5, value: draft.ovenOffset, onChange: event => update({ ovenOffset: event.target.value }) })),
            h('label', null, h('span', null, t('personal.roundMold')), h('input', { type: 'number', min: 0, max: 50, step: 1, value: draft.roundMold || '', onChange: event => update({ roundMold: event.target.value }) })),
            h('label', null, h('span', null, t('personal.rectWidth')), h('input', { type: 'number', min: 0, max: 60, step: 1, value: draft.rectWidth || '', onChange: event => update({ rectWidth: event.target.value }) })),
            h('label', null, h('span', null, t('personal.rectLength')), h('input', { type: 'number', min: 0, max: 80, step: 1, value: draft.rectLength || '', onChange: event => update({ rectLength: event.target.value }) }))
          ),
          h('div', { className: 'modal-actions' },
            h('button', { type: 'button', className: 'btn btn-primary', onClick: () => saveProfile(normalizeEquipmentProfile(draft)) }, t('personal.saveEquipment'))
          )
        ),
        tab === 'catalog' && h('div', { className: 'personal-tools-content', role: 'tabpanel' },
          h('p', { className: 'personal-tool-help' }, t('personal.similarHelp')),
          h('button', { type: 'button', className: 'btn btn-primary', disabled: busy, onClick: analyze }, busy ? t('personal.analysisLoading') : t('personal.analyze')),
          pairs.length > 0 && h('div', { className: 'personal-similar-list' },
            pairs.map(pair => h('article', { key: pair.left.id + ':' + pair.right.id, className: 'personal-similar-card' },
              h('div', null, h('strong', null, pair.left.title), h('span', { 'aria-hidden': true }, '↔'), h('strong', null, pair.right.title)),
              h('p', null, pair.reasons.join(' · ')),
              h('div', null,
                h('button', { type: 'button', className: 'btn btn-subtle', onClick: () => openRecipe(pair.left.id) }, t('personal.openFirst')),
                h('button', { type: 'button', className: 'btn btn-subtle', onClick: () => openRecipe(pair.right.id) }, t('personal.openSecond'))
              )
            ))
          ),
          !busy && !pairs.length && h('p', { className: 'personal-tool-empty' }, t('personal.analysisEmpty'))
        ),
        tab === 'restaurant' && h('div', { className: 'personal-tools-content', role: 'tabpanel' },
          h(ProfessionalKitchenTools, { recipes, ensureCatalog, getAllergens })
        )
      )
    );
  }

  window.CookNotePersonalTools = Object.freeze({
    snapshotRecipe,
    recipeFingerprint,
    captureRecipeVersion,
    normalizeEquipmentProfile,
    detectMold,
    calculateMoldFactor,
    byproductMatches,
    findSimilarRecipes,
    SERVICE_FORMATS,
    buildProductionPlan,
    getRestaurantStorageGuidance,
    RecipeHistoryBlock,
    EquipmentProfileBlock,
    MoldCalculatorBlock,
    ByproductBlock,
    PersonalToolsPanel,
    ProfessionalKitchenTools
  });
}());

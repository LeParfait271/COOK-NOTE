// ---------- Valeurs nutritionnelles estimees ----------
// Chaque ligne d'ingredient est reconnue par l'atlas (fiche -> valeurs pour
// 100 g, assets/ingredients/nutrition.js) puis pesee : grammes ecrits,
// millilitres, cuilleres (SPOON_WEIGHT_RULES), pincees, ou nombre de pieces
// (poids d'une piece). Le total est divise par le nombre de portions de la
// fiche. Estimation indicative : affichee seulement si l'essentiel des
// ingredients a pu etre pese.
const NUTRITION_UNITS = { kg: 1000, g: 1, mg: 0.001, l: 1000, dl: 100, cl: 10, ml: 1 };
const NUTRITION_COUNTS = { un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, dix: 10, douze: 12, demi: 0.5, demie: 0.5 };
const nutritionNumber = value => Number(String(value).replace(',', '.'));
// Cas particuliers : blancs et jaunes d'oeufs (valeurs et poids propres),
// tete d'ail (8 gousses), huile de friture (environ 10 % absorbes).
const EGG_WHITE = [48, 11, 0.7, 0.2, 30];
const EGG_YOLK = [322, 16, 3.6, 27, 18];
function nutritionValuesFor(line, values) {
  const text = normalizeText(stripHtml(line));
  if (/\bblancs? d.?(oeufs?|œufs?)\b/.test(text)) return EGG_WHITE;
  if (/\bjaunes? d.?(oeufs?|œufs?)\b/.test(text)) return EGG_YOLK;
  if (/\btetes? d.?ail\b/.test(text)) return [...values.slice(0, 4), 40];
  return values;
}
const nutritionShare = line => (/\b(pour (?:la )?friture|bain de friture|pour frire)\b/.test(normalizeText(stripHtml(line))) ? 0.1 : 1);

function nutritionGrams(line, values) {
  const text = normalizeText(stripHtml(line)).replace(/\s+/g, ' ').trim();
  const oil = /\b(huile|graisse)\b/.test(text) ? 0.92 : 1;
  const measured = text.match(/^(?:environ |env )?(\d+(?:[.,]\d+)?)(?:\s*(?:a|-)\s*(\d+(?:[.,]\d+)?))?\s*(kg|g|mg|ml|cl|dl|l)\b/);
  if (measured) {
    const amount = measured[2] ? (nutritionNumber(measured[1]) + nutritionNumber(measured[2])) / 2 : nutritionNumber(measured[1]);
    const unit = measured[3];
    return amount * NUTRITION_UNITS[unit] * (/^(l|dl|cl|ml)$/.test(unit) ? oil : 1);
  }
  const spoon = text.match(/^(\d+(?:[.,]\d+)?|une?|deux|trois|quatre|demi)(?:\s*(?:a|-)\s*(\d+(?:[.,]\d+)?))?\s*(?:c\.?|cuilleres?|cuillere)\s*(?:a\s*)?(soupe|cafe)\b/);
  if (spoon) {
    const first = NUTRITION_COUNTS[spoon[1]] ?? nutritionNumber(spoon[1]);
    const amount = spoon[2] ? (first + nutritionNumber(spoon[2])) / 2 : first;
    const rule = SPOON_WEIGHT_RULES.find(item => item.pattern.test(text)) || { tablespoon: 15, teaspoon: 5 };
    return amount * (spoon[3] === 'soupe' ? rule.tablespoon : rule.teaspoon);
  }
  if (/^(?:\d+\s*)?pincees?\b|^une pincee\b/.test(text)) return 0.5;
  const counted = text.match(/^(\d+(?:[.,]\d+)?|une?|deux|trois|quatre|cinq|six|sept|huit|dix|douze|demie?)(?:\s*(?:a|-)\s*(\d+(?:[.,]\d+)?))?\b/);
  if (counted && values?.[4]) {
    const first = NUTRITION_COUNTS[counted[1]] ?? nutritionNumber(counted[1]);
    const amount = counted[2] ? (first + nutritionNumber(counted[2])) / 2 : first;
    return amount * values[4];
  }
  return 0;
}

// { kcal, protein, carbs, fat, portions, coverage } pour une portion, ou null.
function estimateRecipeNutrition(recipe, atlas) {
  if (!recipe || !atlas?.nutritionOf || !(recipe.ingredients || []).length) return null;
  // Plusieurs variantes dans la fiche (coulis, cookies...) : pas de total qui les additionnerait.
  if (typeof getInlineVariantOptions === 'function' && getInlineVariantOptions(recipe).length) return null;
  const lines = (recipe.ingredients || []).flatMap(group => group.items || []).filter(line => !isIngredientSeparator(line) && !atlas.ignored(line));
  let weighed = 0;
  let relevant = 0;
  const total = [0, 0, 0, 0];
  let mass = 0;
  lines.forEach(line => {
    const id = atlas.match(line)[0];
    const base = id ? atlas.nutritionOf(id) : null;
    if (!base) return;
    const values = nutritionValuesFor(line, base);
    const grams = nutritionGrams(line, values) * nutritionShare(line);
    // Sel, poivre, herbes « a votre gout » : negligeables, non comptes.
    const matters = values[0] >= 50 || grams > 0;
    if (!matters) return;
    relevant += 1;
    if (!grams) return;
    weighed += 1;
    mass += grams;
    for (let index = 0; index < 4; index += 1) total[index] += (values[index] * grams) / 100;
  });
  if (!relevant || weighed / relevant < 0.7) return null;
  // Par portion si la fiche compte en personnes / parts / portions, sinon pour 100 g.
  const serving = getServingInfo(recipe);
  const perPortion = serving && ['personne', 'part', 'portion'].includes(serving.unit);
  const portions = perPortion ? serving.base : mass / 100;
  if (!portions || !Number.isFinite(portions)) return null;
  return {
    per: perPortion ? 'portion' : '100g',
    kcal: Math.round(total[0] / portions / 10) * 10,
    protein: Math.round(total[1] / portions),
    carbs: Math.round(total[2] / portions),
    fat: Math.round(total[3] / portions),
    portions,
    coverage: weighed / relevant
  };
}

function NutritionBlock({ recipe }) {
  const [atlas, setAtlas] = useState(() => (window.cookNoteAtlasReady ? window.cookNoteAtlas : null));
  useEffect(() => {
    if (!atlas) loadIngredientAtlas().then(setAtlas).catch(() => {});
  }, []);
  const estimate = useMemo(() => (atlas ? estimateRecipeNutrition(recipe, atlas) : null), [atlas, recipe]);
  if (!estimate) return null;
  return h('section', { className: 'nutrition-card notes-static-card', 'aria-label': 'Valeurs nutritionnelles estimées' },
    h('p', { className: 'eyebrow' }, tc('Valeurs nutritionnelles')),
    h('p', { className: 'nutrition-kcal' }, h('strong', null, `≈ ${estimate.kcal}`), ` ${estimate.per === 'portion' ? tc('kcal par portion') : tc('kcal pour 100 g')}`),
    h('dl', { className: 'nutrition-macros' },
      [['Protéines', estimate.protein], ['Glucides', estimate.carbs], ['Lipides', estimate.fat]].map(([label, value]) => h('div', { key: label }, h('dt', null, tc(label)), h('dd', null, `${value} g`)))
    ),
    h('small', null, estimate.per === 'portion' ? tc('Estimation à partir des ingrédients, pour une portion.') : tc('Estimation à partir des ingrédients, pour 100 g de préparation.'))
  );
}

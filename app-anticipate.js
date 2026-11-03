// ---------- A anticiper ----------
// Ce qu'une recette demande de preparer en avance, lu dans ses ingredients et
// ses etapes : beurre ou oeufs a temperature ambiante, trempage, marinade,
// repos au froid, levee. Chaque rappel porte son avance en minutes ; « Me le
// rappeler » cree un evenement de calendrier (.ics) avec une alarme par
// rappel, a l'heure du repas choisie : l'agenda du telephone previent, meme
// site ferme.
const ANTICIPATION_RULES = [
  { id: 'beurre', test: /\bbeurre\b[^.;]*\b(pommade|mou|ramolli|temperature ambiante)|\b(pommade)\b/, text: 'Sortir le beurre du réfrigérateur', lead: 60 },
  { id: 'oeufs', test: /\b(oeufs?|œufs?)\b[^.;]*\btemperature ambiante\b/, text: 'Sortir les œufs du réfrigérateur', lead: 45 },
  { id: 'viande', test: /\b(sortir|sors)\b[^.;]*\b(viande|gigot|roti|cote de boeuf|poulet|magret)\b[^.;]*\b(avance|avant|temperature ambiante)/, text: 'Sortir la viande du réfrigérateur', lead: 45 },
  { id: 'trempage', test: /\b(tremper|trempage|faire tremper)\b[^.;]*\b(nuit|veille|\d+\s*h)/, text: 'Mettre à tremper', lead: 720 },
  { id: 'marinade', test: /\b(mariner|marinade|laisser mariner)\b[^.;]*\b(nuit|veille|(\d+)\s*h)/, text: 'Lancer la marinade', lead: 'marinade' },
  { id: 'froid', test: /\b(repos(er)?|reserver|laisser prendre|refroidir)\b[^.;]*\b(au frais|au refrigerateur|au froid)\b[^.;]*\b(nuit|(\d+)\s*h)/, text: 'Préparer à l’avance (repos au froid)', lead: 'froid' },
  { id: 'levee', test: /\b(lever|levee|pousser|pousse)\b[^.;]*\b(\d+)\s*h/, text: 'Commencer la pâte (levée)', lead: 'levee' }
];

function anticipationHours(match, fallback) {
  const hours = Number(String(match || '').match(/(\d+)\s*h/)?.[1]);
  return hours ? hours * 60 : fallback;
}

function getRecipeAnticipations(recipe) {
  if (!recipe) return [];
  const lines = [
    ...(recipe.ingredients || []).flatMap(group => group.items || []),
    ...(recipe.steps || []).map(step => (typeof step === 'string' ? step : step?.text || ''))
  ].map(line => normalizeText(stripHtml(line)))
    // Conservation (« se conserve 48 h au frais ») : pas une preparation a l'avance.
    .filter(line => !/\b(conserv|se garde|jusqu a \d|restes?)\b/.test(line));
  const found = [];
  ANTICIPATION_RULES.forEach(rule => {
    const line = lines.find(text => rule.test.test(text));
    if (!line) return;
    const night = /\b(nuit|veille)\b/.test(line);
    let lead = rule.lead;
    if (typeof lead !== 'number') lead = night ? 720 : anticipationHours(line.match(rule.test)?.[0], 120);
    // Marge d'un quart d'heure en plus du temps demande, pour s'organiser.
    found.push({ id: rule.id, text: rule.text, lead: Math.min(1440, lead + (lead >= 120 ? 15 : 0)) });
  });
  return found.sort((a, b) => b.lead - a.lead);
}

const formatLead = minutes => (minutes >= 600 ? tc('la veille') : minutes >= 60 ? `${Math.round(minutes / 60)} h ${tc('avant')}` : `${minutes} min ${tc('avant')}`);

function downloadAnticipationEvent(recipe, items, mealAt) {
  const stamp = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const escape = text => String(text).replace(/[\\;,]/g, match => `\\${match}`).replace(/\n/g, '\\n');
  const title = tc(recipe.title);
  const start = new Date(mealAt);
  const end = new Date(start.getTime() + 60 * 60000);
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Cook Note//FR', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    `UID:${recipe.id || 'recette'}-${start.getTime()}@cook-note`,
    `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:${escape(`${tc('Cuisiner')} : ${title}`)}`,
    `DESCRIPTION:${escape(items.map(item => `${tc(item.text)} (${formatLead(item.lead)})`).join('\n'))}`,
    `URL:${window.location.origin}${getRecipeUrl(recipe.id)}`,
    ...items.flatMap(item => ['BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${escape(`${tc(item.text)} · ${title}`)}`, `TRIGGER:-PT${item.lead}M`, 'END:VALARM']),
    'END:VEVENT', 'END:VCALENDAR'
  ];
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' }));
  link.download = `cook-note-${recipe.id || 'recette'}.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function AnticipationBlock({ recipe }) {
  const items = useMemo(() => getRecipeAnticipations(recipe), [recipe]);
  const [mealAt, setMealAt] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + (date.getHours() >= 17 ? 1 : 0));
    date.setHours(19, 30, 0, 0);
    const pad = value => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  });
  if (!items.length) return null;
  return h('section', { className: 'anticipation-card notes-static-card', 'aria-label': tc('À anticiper') },
    h('p', { className: 'eyebrow' }, tc('À anticiper')),
    h('ul', null, items.map(item => h('li', { key: item.id }, h('strong', null, formatLead(item.lead)), ' ', tc(item.text)))),
    h('div', { className: 'anticipation-remind' },
      h('label', null, h('span', null, tc('Repas prévu')), h('input', { type: 'datetime-local', value: mealAt, onChange: event => setMealAt(event.target.value) })),
      h('button', { type: 'button', disabled: !mealAt, onClick: () => downloadAnticipationEvent(recipe, items, mealAt) }, h(Icon, { name: 'bell' }), h('span', null, tc('Me le rappeler')))
    ),
    h('small', null, tc('Ajoute un rendez-vous à votre agenda, avec une alerte pour chaque préparation.'))
  );
}

// ---------- Dans le meme esprit ----------
// Recettes proches : ingredients en commun (mots d'ingredients, extractTags),
// meme categorie en bonus. Les fiches de la meme collection passent apres.
const similarTagsCache = new WeakMap();
const similarTags = recipe => {
  if (!similarTagsCache.has(recipe)) similarTagsCache.set(recipe, new Set(extractTags(recipe)));
  return similarTagsCache.get(recipe);
};
function getSimilarRecipes(recipe, recipes, limit = 4) {
  if (!recipe || !(recipe.ingredients || []).length) return [];
  const mine = similarTags(recipe);
  if (mine.size < 2) return [];
  const category = primaryCategory(recipe);
  return (recipes || [])
    .filter(item => item?.id && item.id !== recipe.id && (item.ingredients || []).length && !(item.variants || []).length && !isMasterRecipe(item) && !isCategoryCollectionRecipe(item))
    .map(item => {
      const theirs = similarTags(item);
      let shared = 0;
      mine.forEach(tag => { if (theirs.has(tag)) shared += 1; });
      const score = shared / Math.sqrt(mine.size * Math.max(1, theirs.size)) + (primaryCategory(item) === category ? 0.15 : 0) - (item.master && item.master === recipe.master ? 0.05 : 0);
      return { item, score, shared };
    })
    .filter(entry => entry.shared >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(entry => entry.item);
}

function SimilarRecipesBlock({ recipe, recipes, openRecipe }) {
  const similar = useMemo(() => getSimilarRecipes(recipe, recipes), [recipe, recipes]);
  if (!similar.length) return null;
  return h(NotesDisclosure, { className: 'linked-recipes-block similar-recipes-block', label: tc('Dans le même esprit'), ariaLabel: tc('Recettes proches de cette fiche') },
    h('div', { className: 'linked-recipe-list', role: 'list' },
      similar.map(item => h('button', {
        key: item.id,
        type: 'button',
        className: 'linked-recipe-item',
        role: 'listitem',
        style: { '--card-accent': getCategoryColor(item) },
        onClick: () => openRecipe(item.id),
        'aria-label': `${tc('Ouvrir')} ${tc(item.title)}`
      },
        h('span', { className: 'linked-recipe-thumb', style: imageBackgroundStyle(displayRecipeImage(item)), 'aria-hidden': true }),
        h('span', { className: 'linked-recipe-copy' }, h('small', null, tc(primaryCategory(item))), h('strong', null, tc(item.title)))
      ))
    )
  );
}

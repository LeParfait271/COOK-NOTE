// ---------- Parcours de chef : classement et succes ----------
// Classement : 5 rangs x 5 divisions (V -> I), 100 points de cote par
// division. Chaque recette a une cote tiree de sa difficulte. Rien n'est
// gagne a la simple fin d'une recette : le cuisinier donne son verdict
// (reussi 1, correct 1/2, rate 0) et la cote bouge comme un Elo,
// K x (verdict - chance de reussite attendue). Les plats faciles ne rapportent
// presque plus quand on est fort ; rater un plat facile coute cher.
// Succes : une technique (TECHNIQUE_GUIDES) se debloque la premiere fois
// qu'elle est executee dans un plat valide (reussi ou correct). Chaque plat
// suivant qui la demande ajoute 1 ; a 1000 / 1000, badge Maitre.
// Tout reste sur l'appareil (cle cook_note_chef) ; un QR code transfere le
// parcours d'un appareil a l'autre (#chef=...).
const CHEF_STORAGE_KEY = 'cook_note_chef';
const CHEF_EVENT = 'cooknote-chef';
const CHEF_K = 60;
const CHEF_DIVISION_SIZE = 100;
const CHEF_DIVISIONS = ['V', 'IV', 'III', 'II', 'I'];
const CHEF_RANKS = [
  { id: 'commis', label: 'Commis', light: '#e2b48a', dark: '#6b4426' },
  { id: 'cuisinier', label: 'Cuisinier', light: '#eef1f5', dark: '#727a85' },
  { id: 'partie', label: 'Chef de partie', light: '#f6dc9c', dark: '#a0741d' },
  { id: 'sous-chef', label: 'Sous-chef', light: '#c4f0e3', dark: '#2f7d74' },
  { id: 'etoile', label: 'Chef étoilé', light: '#ddd2ff', dark: '#5543b0' }
];
const CHEF_MAX_RATING = CHEF_RANKS.length * CHEF_DIVISIONS.length * CHEF_DIVISION_SIZE;
const CHEF_FALLBACK_SCORE = { easy: 3, medium: 5, hard: 8 };
// Verdicts proposes apres un plat (score Elo : 1, 1/2, 0).
const CHEF_VERDICTS = [
  { id: 'reussi', label: 'Réussi', score: 1 },
  { id: 'correct', label: 'Correct', score: 0.5 },
  { id: 'rate', label: 'Raté', score: 0 }
];
const CHEF_MASTER_GOAL = 1000;
// Ancien format (liste de recettes) -> compteur.
const chefTechCount = value => (Array.isArray(value) ? value.length : Number(value) || 0);

function chefRecipeScore(recipe) {
  if (Number.isFinite(recipe?.difficultyScore)) return Math.min(10, Math.max(1, recipe.difficultyScore));
  return CHEF_FALLBACK_SCORE[recipe?.difficulty] || 4;
}

// Cote d'une recette : 1/10 vaut un Commis, 10/10 le sommet du classement.
function chefRecipeRating(recipe) {
  return Math.round(150 + chefRecipeScore(recipe) * 230);
}

function chefExpected(rating, recipeRating) {
  return 1 / (1 + 10 ** ((recipeRating - rating) / 400));
}

function readChef() {
  const data = readJson(CHEF_STORAGE_KEY, null) || {};
  // Ancien champ « mmr » (premiere version) repris tel quel.
  const rating = Number.isFinite(data.rating) ? data.rating : Number.isFinite(data.mmr) ? data.mmr : 0;
  return {
    rating,
    best: Number.isFinite(data.best) ? data.best : rating,
    cooked: data.cooked && typeof data.cooked === 'object' ? data.cooked : {},
    tech: data.tech && typeof data.tech === 'object' ? data.tech : {},
    unlocked: data.unlocked && typeof data.unlocked === 'object' ? data.unlocked : {},
    master: data.master && typeof data.master === 'object' ? data.master : {},
    history: Array.isArray(data.history) ? data.history : []
  };
}

function writeChef(chef) {
  writeJson(CHEF_STORAGE_KEY, chef);
  window.dispatchEvent(new CustomEvent(CHEF_EVENT));
}

function chefStanding(rating) {
  const value = Math.max(0, Math.min(CHEF_MAX_RATING - 1, Math.floor(rating)));
  const step = Math.floor(value / CHEF_DIVISION_SIZE);
  const tier = Math.floor(step / CHEF_DIVISIONS.length);
  const division = step % CHEF_DIVISIONS.length;
  const rank = CHEF_RANKS[tier];
  const nextStep = step + 1;
  const next = nextStep < CHEF_RANKS.length * CHEF_DIVISIONS.length
    ? `${CHEF_RANKS[Math.floor(nextStep / CHEF_DIVISIONS.length)].label} ${CHEF_DIVISIONS[nextStep % CHEF_DIVISIONS.length]}`
    : '';
  return {
    tier,
    division,
    level: step,
    rank,
    roman: CHEF_DIVISIONS[division],
    name: `${rank.label} ${CHEF_DIVISIONS[division]}`,
    points: Math.max(0, Math.floor(rating)) - step * CHEF_DIVISION_SIZE,
    next,
    top: !next && rating >= CHEF_MAX_RATING - 1
  };
}

const chefFormat = value => Math.round(value).toLocaleString('fr-FR');
const chefSigned = value => `${value >= 0 ? '+' : '−'}${Math.abs(value)}`;

// Variation de cote pour un verdict donne. Refaire le meme plat dans la
// semaine rapporte deux fois moins a chaque fois (une perte reste entiere).
function chefPreview(chef, recipe, score = 1) {
  const expected = chefExpected(chef.rating, chefRecipeRating(recipe));
  const raw = CHEF_K * (score - expected);
  if (raw <= 0) return Math.min(-1, Math.round(raw));
  const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
  const recent = chef.history.filter(entry => entry.id === recipe.id && entry.score > 0 && entry.at > weekAgo).length;
  return Math.max(1, Math.round(raw * 0.5 ** recent));
}

// Techniques demandees par une recette (celles citees dans ses etapes).
function chefRecipeTechniques(recipe) {
  if (!recipe) return [];
  const targets = typeof buildTechniqueTargets === 'function' ? buildTechniqueTargets() : [];
  const ids = new Set();
  (recipe.steps || []).forEach(step => {
    stepTechniques(typeof step === 'string' ? step : step?.text || '', targets).forEach(guide => ids.add(guide.id));
  });
  return [...ids];
}

// Enregistre le verdict. Seule une reussite fait avancer les succes.
function recordChefVerdict(recipe, verdictId) {
  const verdict = CHEF_VERDICTS.find(item => item.id === verdictId);
  if (!recipe?.id || !verdict) return null;
  const chef = readChef();
  const before = chefStanding(chef.rating);
  const delta = chefPreview(chef, recipe, verdict.score);
  const rating = Math.max(0, Math.min(CHEF_MAX_RATING, chef.rating + delta));
  const tech = { ...chef.tech };
  const unlocked = { ...chef.unlocked };
  const master = { ...chef.master };
  const progressed = [];
  const newlyUnlocked = [];
  const newlyMastered = [];
  if (verdict.score > 0) {
    chefRecipeTechniques(recipe).forEach(id => {
      tech[id] = Math.min(CHEF_MASTER_GOAL, chefTechCount(tech[id]) + 1);
      progressed.push(id);
      if (!unlocked[id]) {
        unlocked[id] = Date.now();
        newlyUnlocked.push(id);
      }
      if (!master[id] && tech[id] >= CHEF_MASTER_GOAL) {
        master[id] = Date.now();
        newlyMastered.push(id);
      }
    });
  }
  const entry = { id: recipe.id, title: recipe.title, verdict: verdict.id, score: verdict.score, delta: rating - chef.rating, at: Date.now(), progressed, unlockedIds: newlyUnlocked, masteredIds: newlyMastered };
  writeChef({
    rating,
    best: Math.max(chef.best, rating),
    cooked: verdict.score > 0 ? { ...chef.cooked, [recipe.id]: (chef.cooked[recipe.id] || 0) + 1 } : chef.cooked,
    tech,
    unlocked,
    master,
    history: [entry, ...chef.history].slice(0, 80)
  });
  const after = chefStanding(rating);
  return {
    entry,
    before,
    after,
    promoted: after.level > before.level,
    demoted: after.level < before.level,
    unlocked: newlyUnlocked.map(id => TECHNIQUE_GUIDES.find(guide => guide.id === id)).filter(Boolean),
    mastered: newlyMastered.map(id => TECHNIQUE_GUIDES.find(guide => guide.id === id)).filter(Boolean)
  };
}

// Annule le dernier verdict (erreur de bouton) : cote, compteur et succes.
function undoChefVerdict(recipe) {
  const chef = readChef();
  const last = chef.history[0];
  if (!last || last.id !== recipe?.id) return false;
  const cooked = { ...chef.cooked };
  if (last.score > 0) {
    const count = (cooked[last.id] || 1) - 1;
    if (count > 0) cooked[last.id] = count;
    else delete cooked[last.id];
  }
  const tech = { ...chef.tech };
  (last.progressed || []).forEach(id => {
    tech[id] = Math.max(0, chefTechCount(tech[id]) - 1);
  });
  const unlocked = { ...chef.unlocked };
  (last.unlockedIds || []).forEach(id => delete unlocked[id]);
  const master = { ...chef.master };
  (last.masteredIds || []).forEach(id => delete master[id]);
  writeChef({ ...chef, rating: Math.max(0, chef.rating - last.delta), cooked, tech, unlocked, master, history: chef.history.slice(1) });
  return true;
}

function useChef() {
  const [chef, setChef] = useState(readChef);
  useEffect(() => {
    const refresh = () => setChef(readChef());
    window.addEventListener(CHEF_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(CHEF_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return chef;
}

function chefResultMessage(result) {
  if (!result) return '';
  const change = `Cote ${chefSigned(result.entry.delta)}`;
  if (result.promoted) return `${change} · Promotion : ${result.after.name}`;
  if (result.demoted) return `${change} · Retour en ${result.after.name}`;
  return `${change} · ${result.after.name}`;
}

// Notifications apres un verdict : la cote, puis chaque succes debloque.
function announceChefResult(result, notify) {
  if (!result || !notify) return;
  notify(chefResultMessage(result), result.promoted ? 'success' : 'info');
  result.unlocked.forEach(guide => notify(`Technique débloquée · ${guide.title}`, 'success'));
  result.mastered.forEach(guide => notify(`Badge Maître · ${guide.title}`, 'success'));
}

// Transfert : le minimum utile dans l'adresse (cote, record, plats, succes).
function encodeChefTransfer(chef) {
  const payload = JSON.stringify({ r: Math.round(chef.rating), b: Math.round(chef.best), c: chef.cooked, t: chef.tech, u: chef.unlocked, x: chef.master });
  const base = btoa(unescape(encodeURIComponent(payload))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${window.location.origin}/#chef=${base}`;
}

function decodeChefTransfer(hash) {
  const match = String(hash || '').match(/#chef=([\w-]+)/);
  if (!match) return null;
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(match[1].replace(/-/g, '+').replace(/_/g, '/')))));
    const rating = Number.isFinite(data.r) ? data.r : data.m;
    if (!Number.isFinite(rating)) return null;
    const object = value => (value && typeof value === 'object' ? value : {});
    return { rating: Math.max(0, Math.min(CHEF_MAX_RATING, rating)), best: Number(data.b) || rating, cooked: object(data.c), tech: object(data.t), unlocked: object(data.u), master: object(data.x) };
  } catch {
    return null;
  }
}

// Fusion : on garde le meilleur des deux appareils.
function mergeChefTransfer(received) {
  const chef = readChef();
  const cooked = { ...chef.cooked };
  Object.entries(received.cooked).forEach(([id, count]) => {
    cooked[id] = Math.max(cooked[id] || 0, Number(count) || 0);
  });
  const tech = { ...chef.tech };
  Object.entries(received.tech).forEach(([id, count]) => {
    tech[id] = Math.max(chefTechCount(tech[id]), chefTechCount(count));
  });
  const unlocked = { ...chef.unlocked };
  Object.entries(received.unlocked).forEach(([id, at]) => {
    unlocked[id] = unlocked[id] ? Math.min(unlocked[id], Number(at) || unlocked[id]) : Number(at) || Date.now();
  });
  const master = { ...chef.master };
  Object.entries(received.master).forEach(([id, at]) => {
    master[id] = master[id] ? Math.min(master[id], Number(at) || master[id]) : Number(at) || Date.now();
  });
  const merged = { ...chef, rating: Math.max(chef.rating, received.rating), best: Math.max(chef.best, received.best, received.rating), cooked, tech, unlocked, master };
  writeChef(merged);
  return merged;
}

// Embleme : blason hexagonal aux couleurs du rang, toque au centre, chiffre
// romain de la division sur un ruban. Le rang etoile gagne une etoile.
function ChefEmblem({ rating, size = 96, standing }) {
  const info = standing || chefStanding(rating);
  const { rank, roman, tier } = info;
  const id = `chef-${rank.id}-${size}`;
  return h('svg', { className: `chef-emblem is-${rank.id}`, width: size, height: size * 1.12, viewBox: '0 0 100 112', 'aria-hidden': true },
    h('defs', null,
      h('linearGradient', { id: `${id}-metal`, x1: 0, y1: 0, x2: 0.4, y2: 1 },
        h('stop', { offset: '0%', stopColor: rank.light }),
        h('stop', { offset: '55%', stopColor: rank.dark }),
        h('stop', { offset: '100%', stopColor: rank.light, stopOpacity: 0.85 })
      ),
      h('radialGradient', { id: `${id}-glow`, cx: '50%', cy: '42%', r: '60%' },
        h('stop', { offset: '0%', stopColor: rank.light, stopOpacity: 0.55 }),
        h('stop', { offset: '100%', stopColor: rank.light, stopOpacity: 0 })
      )
    ),
    h('circle', { cx: 50, cy: 48, r: 50, fill: `url(#${id}-glow)`, className: 'chef-emblem-glow' }),
    h('path', { d: 'M50 4 L88 26 L88 70 L50 92 L12 70 L12 26 Z', fill: `url(#${id}-metal)`, stroke: rank.light, strokeWidth: 1.5 }),
    h('path', { d: 'M50 13 L80 30.5 L80 65.5 L50 83 L20 65.5 L20 30.5 Z', fill: 'rgb(12 10 8 / .78)', stroke: rank.light, strokeOpacity: 0.55, strokeWidth: 1 }),
    h('g', { fill: rank.light },
      h('path', { d: 'M35 57 C27 55 26 42 35 41 C35 32 46 29 50 35 C54 29 65 32 65 41 C74 42 73 55 65 57 Z' }),
      h('rect', { x: 36, y: 58, width: 28, height: 8, rx: 2 })
    ),
    Array.from({ length: tier }, (_, fold) => h('line', { key: fold, x1: 42 + fold * 4 - (tier - 1) * 2, x2: 42 + fold * 4 - (tier - 1) * 2, y1: 46, y2: 56, stroke: rank.dark, strokeWidth: 1.4, strokeLinecap: 'round' })),
    tier === CHEF_RANKS.length - 1 && h('path', { d: 'M50 16 L52.4 21.6 L58 22 L53.6 25.6 L55 31 L50 28 L45 31 L46.4 25.6 L42 22 L47.6 21.6 Z', fill: '#fff4cf' }),
    h('path', { d: 'M24 90 L76 90 L72 98 L76 106 L24 106 L28 98 Z', fill: `url(#${id}-metal)`, stroke: rank.light, strokeWidth: 1 }),
    h('text', { x: 50, y: 102.5, textAnchor: 'middle', className: 'chef-emblem-roman', fill: '#140f0a' }, roman)
  );
}

// Medaille de succes : hexagone grave. Cadenas tant que la technique n'a
// jamais ete executee, etoile doree une fois debloquee, double cadre et
// couronne au rang Maitre (1000 / 1000).
function ChefAchievementBadge({ state }) {
  return h('svg', { className: `chef-medal is-${state}`, viewBox: '0 0 48 48', width: 44, height: 44, 'aria-hidden': true },
    h('path', { d: 'M24 2 L44 14 L44 34 L24 46 L4 34 L4 14 Z', className: 'chef-medal-frame' }),
    h('path', { d: 'M24 8 L39 17 L39 31 L24 40 L9 31 L9 17 Z', className: 'chef-medal-core' }),
    state === 'master' && h('path', { d: 'M24 5 L41.5 15.5 L41.5 32.5 L24 43 L6.5 32.5 L6.5 15.5 Z', className: 'chef-medal-ring' }),
    state === 'locked'
      ? h('g', { className: 'chef-medal-lock' },
        h('rect', { x: 18.5, y: 23, width: 11, height: 9, rx: 1.6 }),
        h('path', { d: 'M20.5 23 v-3 a3.5 3.5 0 0 1 7 0 v3', fill: 'none' })
      )
      : h('path', { className: 'chef-medal-mark', d: state === 'master'
        ? 'M15 30 L17 19 L21.5 24 L24 16 L26.5 24 L31 19 L33 30 Z'
        : 'M24 13 L26.6 21.4 L35 24 L26.6 26.6 L24 35 L21.4 26.6 L13 24 L21.4 21.4 Z' })
  );
}
// Verdict apres un plat : trois choix, la variation de cote affichee pour
// chacun. Apres coup : le resultat, et « Annuler » en cas d'erreur.
function ChefVerdict({ recipe, notify, onDone, compact = false }) {
  const chef = useChef();
  const [result, setResult] = useState(null);
  if (result) {
    return h('div', { className: result.promoted ? 'chef-verdict is-done is-promoted' : 'chef-verdict is-done' },
      h(ChefEmblem, { standing: result.after, size: compact ? 28 : 40 }),
      h('div', { className: 'chef-verdict-copy' },
        h('strong', null, chefResultMessage(result)),
        result.unlocked.map(guide => h('span', { key: guide.id, className: 'chef-verdict-unlock' }, `Technique débloquée · ${guide.title}`)),
        result.mastered.map(guide => h('span', { key: `m-${guide.id}`, className: 'chef-verdict-unlock' }, `Badge Maître · ${guide.title}`))
      ),
      h('button', { type: 'button', className: 'chef-verdict-undo', onClick: () => {
        undoChefVerdict(recipe);
        setResult(null);
      } }, 'Annuler')
    );
  }
  return h('div', { className: 'chef-verdict' },
    h('p', null, 'Comment s’est passé ce plat ?'),
    h('div', { className: 'chef-verdict-choices' },
      CHEF_VERDICTS.map(verdict => {
        const delta = chefPreview(chef, recipe, verdict.score);
        return h('button', {
          key: verdict.id,
          type: 'button',
          className: `chef-verdict-choice is-${verdict.id}`,
          onClick: () => {
            const next = recordChefVerdict(recipe, verdict.id);
            setResult(next);
            announceChefResult(next, notify);
            onDone?.(next);
          }
        }, h('span', null, verdict.label), h('em', null, chefSigned(delta)));
      })
    )
  );
}

// Fiche : « J'ai cuisiné ce plat » ouvre le verdict dans une petite fenetre.
function ChefCookedButton({ recipe, notify }) {
  const chef = useChef();
  const [open, setOpen] = useState(false);
  const count = chef.cooked[recipe?.id] || 0;
  return h('div', { className: 'chef-cooked' },
    h(Button, {
      variant: 'ghost',
      className: count ? 'detail-action-button chef-cooked-action is-cooked' : 'detail-action-button chef-cooked-action',
      pressed: open,
      ariaLabel: `J’ai cuisiné ${recipe?.title || 'cette recette'}`,
      onClick: () => setOpen(value => !value)
    }, h(ChefEmblem, { rating: chef.rating, size: 16 }), h('span', null, count ? `Réussi ${count}×` : 'Je l’ai cuisiné')),
    open && (window.innerWidth <= 640 ? sheet => ReactDOM.createPortal(sheet, document.body) : sheet => sheet)(h('div', { className: 'chef-cooked-popover', role: 'dialog', 'aria-label': 'Verdict du plat' },
      h('button', { type: 'button', className: 'chef-cooked-close', onClick: () => setOpen(false), 'aria-label': 'Fermer' }, h(Icon, { name: 'close' })),
      h(ChefVerdict, { recipe, notify, compact: true, onDone: () => setTimeout(() => setOpen(false), 2600) })
    ))
  );
}

// Recettes qui font progresser : cote juste au-dessus du niveau actuel (vrai
// defi, mais a portee), jamais cuisinees cette semaine.
function chefSuggestions(chef, recipes, limit = 3) {
  const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
  const recent = new Set(chef.history.filter(entry => entry.at > weekAgo).map(entry => entry.id));
  return (recipes || [])
    .filter(recipe => recipe?.id && !(recipe.variants || []).length && (recipe.ingredients || []).length && !recent.has(recipe.id) && !isMasterRecipe(recipe) && !isCategoryCollectionRecipe(recipe) && !getInlineVariantOptions(recipe).length)
    .map(recipe => ({ recipe, gain: chefPreview(chef, recipe), gap: Math.abs(chefRecipeRating(recipe) - (chef.rating + 180)) }))
    .sort((left, right) => left.gap - right.gap || right.gain - left.gain || hashText(left.recipe.id) - hashText(right.recipe.id))
    .slice(0, limit);
}

const CHEF_ACHIEVEMENT_FILTERS = [
  { id: 'all', label: 'Tous' },
  { id: 'unlocked', label: 'Débloqués' },
  { id: 'master', label: 'Maître' },
  { id: 'locked', label: 'À découvrir' }
];

function ChefAchievements({ chef }) {
  const [filter, setFilter] = useState('all');
  const items = TECHNIQUE_GUIDES.map(guide => {
    const count = chefTechCount(chef.tech[guide.id]);
    const masterAt = chef.master[guide.id] || 0;
    const at = chef.unlocked[guide.id] || 0;
    return { guide, count, at, masterAt, state: masterAt ? 'master' : at ? 'unlocked' : 'locked' };
  }).sort((left, right) => (right.masterAt - left.masterAt) || (right.count - left.count) || (right.at - left.at) || left.guide.title.localeCompare(right.guide.title, 'fr'));
  const total = items.length;
  const done = items.filter(item => item.at).length;
  const masters = items.filter(item => item.masterAt).length;
  const shown = items.filter(item => filter === 'all' || item.state === filter || (filter === 'unlocked' && item.state === 'master'));
  const date = at => new Date(at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  return h('div', { className: 'chef-achievements' },
    h('div', { className: 'chef-achievements-head' },
      h('strong', null, `${done} / ${total} techniques débloquées`),
      h('span', null, masters ? `${masters} maître${masters > 1 ? 's' : ''}` : `${Math.round((100 * done) / Math.max(1, total))} %`),
      h('div', { className: 'chef-bar' }, h('i', { style: { width: `${(100 * done) / Math.max(1, total)}%` } }))
    ),
    h('div', { className: 'chef-filters', role: 'tablist' },
      CHEF_ACHIEVEMENT_FILTERS.map(item => h('button', { key: item.id, type: 'button', role: 'tab', 'aria-selected': filter === item.id, className: filter === item.id ? 'is-active' : '', onClick: () => setFilter(item.id) }, item.label))
    ),
    shown.length
      ? h('ul', { className: 'chef-achievement-list' }, shown.map(({ guide, count, at, masterAt, state }) => h('li', { key: guide.id, className: `is-${state}` },
        h(ChefAchievementBadge, { state }),
        h('div', null,
          h('strong', null, guide.title, state === 'master' && h('i', null, 'Maître')),
          h('span', null, state === 'locked'
            ? 'Exécutez cette technique dans un plat réussi pour la débloquer.'
            : state === 'master' ? `Maîtrisée le ${date(masterAt)}.` : `Débloquée le ${date(at)}. Badge Maître à ${chefFormat(CHEF_MASTER_GOAL)}.`),
          state !== 'locked' && h('div', { className: 'chef-achievement-progress' },
            h('div', { className: 'chef-bar' }, h('i', { style: { width: `${(100 * count) / CHEF_MASTER_GOAL}%` } })),
            h('small', null, `${chefFormat(count)} / ${chefFormat(CHEF_MASTER_GOAL)}`)
          )
        )
      )))
      : h('p', { className: 'chef-empty' }, filter === 'master' ? `Aucune technique maîtrisée : il faut ${chefFormat(CHEF_MASTER_GOAL)} exécutions réussies.` : filter === 'locked' ? 'Toutes les techniques sont débloquées.' : 'Aucune technique débloquée : réussissez un plat pour commencer.')
  );
}
const CHEF_TABS = [
  { id: 'parcours', label: 'Classement' },
  { id: 'succes', label: 'Techniques' }
];

function ChefPanel({ open, onClose, recipes, openRecipe, notify }) {
  const chef = useChef();
  const [tab, setTab] = useState('parcours');
  const [transfer, setTransfer] = useState(false);
  const canvasRef = useRef(null);
  const standing = chefStanding(chef.rating);
  const transferUrl = useMemo(() => (open ? encodeChefTransfer(chef) : ''), [open, chef]);
  const suggestions = useMemo(() => (open ? chefSuggestions(chef, recipes) : []), [open, chef, recipes]);

  useEffect(() => {
    if (!open || !transfer || !canvasRef.current) return undefined;
    let cancelled = false;
    loadDeferredScript(QR_CODE_SCRIPT_SRC, 'QRCode').then(QRCode => {
      if (!cancelled && canvasRef.current && QRCode?.create) drawFineQr(canvasRef.current, QRCode, transferUrl, 176);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, transfer, transferUrl, tab]);

  useEffect(() => {
    if (!open) {
      setTransfer(false);
      setTab('parcours');
    }
  }, [open]);

  if (!open) return null;
  const successes = chef.history.filter(entry => entry.score === 1).length;
  const played = chef.history.length;
  const unlockedCount = Object.keys(chef.unlocked).length;
  const masterCount = Object.keys(chef.master).length;
  const progress = standing.top ? 100 : standing.points;
  const verdictLabel = id => (CHEF_VERDICTS.find(item => item.id === id) || CHEF_VERDICTS[0]).label;

  return h(ModalDialog, { className: '', onClose },
    h('section', { className: `modal-panel chef-modal is-${standing.rank.id}`, role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'chef-modal-title', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null, h('p', { className: 'eyebrow' }, 'Parcours de chef'), h('h2', { id: 'chef-modal-title' }, standing.name)),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('div', { className: 'chef-tabs', role: 'tablist' },
        CHEF_TABS.map(item => h('button', { key: item.id, type: 'button', role: 'tab', 'aria-selected': tab === item.id, className: tab === item.id ? 'is-active' : '', onClick: () => setTab(item.id) },
          item.label,
          item.id === 'succes' && h('em', null, `${unlockedCount}/${TECHNIQUE_GUIDES.length}`)
        ))
      ),
      tab === 'succes'
        ? h(ChefAchievements, { chef })
        : h(React.Fragment, null,
          h('div', { className: 'chef-hero' },
            h(ChefEmblem, { standing, size: 116 }),
            h('div', { className: 'chef-hero-copy' },
              h('span', { className: 'chef-rating' }, `Cote ${chefFormat(chef.rating)}`, h('em', null, ` · meilleure ${chefFormat(chef.best)}`)),
              h('div', { className: 'chef-bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': progress, 'aria-label': `Division : ${progress} sur 100` },
                h('i', { style: { width: `${progress}%` } })
              ),
              h('small', null, standing.top ? 'Sommet du classement' : `${progress} / 100 avant ${standing.next}`)
            )
          ),
          h('ol', { className: 'chef-ladder', 'aria-label': 'Les cinq rangs' },
            CHEF_RANKS.map((rank, tier) => h('li', { key: rank.id, className: tier === standing.tier ? 'is-current' : tier < standing.tier ? 'is-done' : 'is-locked' },
              h(ChefEmblem, { size: 40, standing: { rank, roman: tier === standing.tier ? standing.roman : 'V', tier } }),
              h('span', null, rank.label)
            ))
          ),
          h('div', { className: 'chef-stats' },
            h('div', null, h('strong', null, successes), h('span', null, successes > 1 ? 'plats réussis' : 'plat réussi')),
            h('div', null, h('strong', null, played ? `${Math.round((100 * successes) / played)} %` : '—'), h('span', null, 'de réussite')),
            h('div', null, h('strong', null, unlockedCount), h('span', null, masterCount ? `techniques · ${masterCount} maître${masterCount > 1 ? 's' : ''}` : unlockedCount > 1 ? 'techniques débloquées' : 'technique débloquée'))
          ),
          suggestions.length > 0 && h('div', { className: 'chef-section' },
            h('small', null, 'Pour progresser'),
            h('ul', { className: 'chef-suggestions' }, suggestions.map(({ recipe, gain }) => h('li', { key: recipe.id },
              h('button', { type: 'button', onClick: () => { onClose(); openRecipe(recipe.id); } },
                h('span', null, recipe.title),
                h('em', null, `${difficultyText(recipe)} · ${chefSigned(gain)}`)
              )
            )))
          ),
          chef.history.length > 0 && h('div', { className: 'chef-section' },
            h('small', null, 'Derniers plats'),
            h('ul', { className: 'chef-history' }, chef.history.slice(0, 5).map(entry => h('li', { key: `${entry.id}-${entry.at}` },
              h('span', null, entry.title, h('i', { className: `is-${entry.verdict || 'reussi'}` }, verdictLabel(entry.verdict))),
              h('em', { className: entry.delta >= 0 ? 'is-up' : 'is-down' }, chefSigned(entry.delta))
            )))
          ),
          !chef.history.length && h('p', { className: 'chef-empty' }, 'Après un plat, donnez votre verdict (réussi, correct ou raté) en fin de mode mains libres ou avec « Je l’ai cuisiné » sur la fiche. Plus le plat est exigeant pour votre niveau, plus une réussite compte.'),
          h('div', { className: 'chef-transfer' },
            h('button', { type: 'button', className: 'share-chip', onClick: () => setTransfer(value => !value), 'aria-expanded': transfer }, transfer ? 'Masquer le QR code' : 'Transférer sur un autre appareil'),
            transfer && h('div', { className: 'chef-transfer-body' },
              h('canvas', { ref: canvasRef, className: 'qr-canvas', width: 176, height: 176, role: 'img', 'aria-label': 'QR code de transfert du parcours' }),
              h('p', null, 'Scannez avec l’autre appareil : les deux parcours sont fusionnés, le meilleur est gardé.'),
              h('button', { type: 'button', className: 'share-chip', onClick: () => copyText(transferUrl).then(() => notify?.('Lien de transfert copié')) }, 'Copier le lien')
            )
          )
        )
    )
  );
}

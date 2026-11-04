// ---------- Ma semaine et Mon frigo ----------
// Ma semaine : 7 jours x (midi, soir), rempli a la main ou automatiquement
// (plats de saison, varies, rapides en semaine), avec sa propre liste de courses (a part du panier).
// Mon frigo : on note ce qu'on a, Cook Note propose les recettes qui s'en
// servent le mieux et dit ce qui manque (ingredients reconnus par l'atlas ;
// sel, poivre, huile, beurre, sucre, farine et eau sont supposes au placard).
const WEEK_KEY = 'cook_note_week';
const FRIDGE_KEY = 'cook_note_fridge';
const WEEK_DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const WEEK_MEALS = [['midi', 'Midi'], ['soir', 'Soir']];
const FRIDGE_STAPLES = new Set(['sel', 'poivre', 'eau', 'huile-olive', 'huile-neutre', 'beurre', 'sucre', 'farine', 'vinaigre']);

function weekCandidates(recipes) {
  return (recipes || []).filter(recipe => recipe?.id && (recipe.ingredients || []).length && !(recipe.variants || []).length
    && !isMasterRecipe(recipe) && !isCategoryCollectionRecipe(recipe) && !getInlineVariantOptions(recipe).length);
}

function weekMainDishes(recipes) {
  const candidates = weekCandidates(recipes);
  const mains = candidates.filter(recipe => normalizeText(primaryCategory(recipe)) === 'plats');
  return mains.length >= 14 ? mains : candidates;
}

// Remplissage : saison du moment d'abord, pas deux fois la meme fiche, plats
// plus rapides les midis de semaine. Melange stable par semaine (numero ISO).
function fillWeek(recipes, current = {}) {
  const now = new Date();
  const week = Math.floor((now - new Date(now.getFullYear(), 0, 1)) / 604800000);
  const season = ['Hiver', 'Hiver', 'Printemps', 'Printemps', 'Printemps', 'Été', 'Été', 'Été', 'Automne', 'Automne', 'Automne', 'Hiver'][now.getMonth()];
  const minutes = recipe => Number(recipe.activeTime || 0) + Number(recipe.cookTime || 0);
  // Mon profil : fiches a eviter (allergies, gouts, regime) mises de cote.
  const profile = readProfile();
  const pool = weekMainDishes(recipes)
    .filter(recipe => !recipeAvoidedByProfile(recipe, profile))
    .map(recipe => ({ recipe, order: hashText(`${recipe.id}:${week}`) % 1000, seasonal: (recipe.seasons || []).some(name => name === season || /toutes/i.test(name)) }))
    .sort((a, b) => Number(b.seasonal) - Number(a.seasonal) || a.order - b.order)
    .map(item => item.recipe);
  const used = new Set(Object.values(current).filter(Boolean));
  const next = { ...current };
  WEEK_DAYS.forEach((day, dayIndex) => WEEK_MEALS.forEach(([meal]) => {
    const slot = `${dayIndex}:${meal}`;
    if (next[slot]) return;
    const quick = dayIndex < 5 && meal === 'midi';
    const choice = pool.find(recipe => !used.has(recipe.id) && (!quick || !minutes(recipe) || minutes(recipe) <= 45)) || pool.find(recipe => !used.has(recipe.id));
    if (choice) {
      next[slot] = choice.id;
      used.add(choice.id);
    }
  }));
  return next;
}

// Agenda : chaque repas prevu a 12 h 30 ou 19 h 30, cette semaine (lundi -> dimanche).
function weekAgendaEvents(plan, recipesById) {
  const monday = new Date();
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return Object.entries(plan).filter(([, id]) => recipesById[id]).map(([slot, id]) => {
    const [day, meal] = slot.split(':');
    const start = new Date(monday);
    start.setDate(monday.getDate() + Number(day));
    start.setHours(meal === 'midi' ? 12 : 19, 30, 0, 0);
    const recipe = recipesById[id];
    return { uid: `semaine-${slot}-${id}-${start.getTime()}`, start, end: new Date(start.getTime() + 60 * 60000), summary: tc(recipe.title), url: `${window.location.origin}${getRecipeUrl(id)}`, alarms: [{ minutes: 60 }] };
  }).sort((a, b) => a.start - b.start);
}

function WeekPanel({ open, onClose, recipes, recipesById, openRecipe, openWeekBasket, notify }) {
  const [plan, setPlan] = useState(() => readJson(WEEK_KEY, {}));
  const [picking, setPicking] = useState('');
  const [query, setQuery] = useState('');
  // Relu a chaque ouverture : les courses de la semaine peuvent retirer une fiche.
  useEffect(() => { if (open) setPlan(readJson(WEEK_KEY, {})); else { setPicking(''); setQuery(''); } }, [open]);
  if (!open) return null;
  const save = next => {
    setPlan(next);
    writeJson(WEEK_KEY, next);
  };
  const ids = Object.values(plan).filter(id => id && recipesById[id]);
  const needle = normalizeText(query.trim());
  const matches = picking && needle.length >= 2
    ? weekCandidates(recipes).filter(recipe => normalizeText(`${recipe.title} ${tc(recipe.title)}`).includes(needle)).slice(0, 6)
    : [];
  const swap = slot => {
    const pool = weekMainDishes(recipes).filter(recipe => !Object.values(plan).includes(recipe.id));
    if (!pool.length) return;
    save({ ...plan, [slot]: pool[hashText(`${slot}:${Date.now()}`) % pool.length].id });
  };
  return h(ModalDialog, { className: '', onClose },
    h('section', { className: 'modal-panel week-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'week-modal-title', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null, h('p', { className: 'eyebrow' }, tc('Planning')), h('h2', { id: 'week-modal-title' }, tc('Ma semaine'))),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('div', { className: 'week-tools' },
        h('button', { type: 'button', className: 'week-tool is-primary', onClick: () => { save(fillWeek(recipes, plan)); notify?.(tc('Semaine complétée')); } }, h(Icon, { name: 'spark' }), h('span', null, tc('Compléter la semaine'))),
        h('button', { type: 'button', className: 'week-tool', disabled: !ids.length, onClick: openWeekBasket }, h(Icon, { name: 'basket' }), h('span', null, `${tc('Courses de la semaine')} (${new Set(ids).size})`)),
        ids.length > 0 && h(ShareLinkButton, { label: tc('Partager la semaine'), kind: 'semaine', value: plan, title: tc('Ma semaine') }),
        ids.length > 0 && h(AgendaButtons, { events: weekAgendaEvents(plan, recipesById), fileName: 'cook-note-semaine.ics', label: 'Semaine dans l’agenda' }),
        h('button', { type: 'button', className: 'week-tool', disabled: !ids.length, onClick: () => save({}) }, tc('Vider'))
      ),
      h('ol', { className: 'week-days' },
        WEEK_DAYS.map((day, dayIndex) => h('li', { key: day, className: 'week-day' },
          h('strong', null, tc(day)),
          h('div', { className: 'week-meals' },
            WEEK_MEALS.map(([meal, label]) => {
              const slot = `${dayIndex}:${meal}`;
              const recipe = recipesById[plan[slot]];
              return h('div', { key: meal, className: recipe ? 'week-slot is-filled' : 'week-slot' },
                h('small', null, tc(label)),
                recipe
                  ? h(React.Fragment, null,
                    h('button', { type: 'button', className: 'week-slot-title', onClick: () => { onClose(); openRecipe(recipe.id); } }, tc(recipe.title)),
                    h('span', { className: 'week-slot-actions' },
                      h('button', { type: 'button', onClick: () => swap(slot), 'aria-label': `${tc('Changer')} ${tc(recipe.title)}`, title: tc('Autre idée') }, '↻'),
                      h('button', { type: 'button', onClick: () => { const next = { ...plan }; delete next[slot]; save(next); }, 'aria-label': `${tc('Retirer')} ${tc(recipe.title)}`, title: tc('Retirer') }, '×')
                    ))
                  : picking === slot
                    ? h('div', { className: 'week-picker' },
                      h('input', { type: 'search', autoFocus: true, value: query, placeholder: tc('Chercher une recette…'), onChange: event => setQuery(event.target.value), onKeyDown: event => { if (event.key === 'Escape') { event.stopPropagation(); setPicking(''); } } }),
                      matches.length > 0 && h('ul', null, matches.map(item => h('li', { key: item.id }, h('button', { type: 'button', onClick: () => { save({ ...plan, [slot]: item.id }); setPicking(''); setQuery(''); } }, tc(item.title)))))
                    )
                    : h('button', { type: 'button', className: 'week-slot-add', onClick: () => { setPicking(slot); setQuery(''); } }, `+ ${tc('Ajouter')}`)
              );
            })
          )
        ))
      )
    )
  );
}

function FridgePanel({ open, onClose, recipes, openRecipe }) {
  const [items, setItems] = useState(() => readJson(FRIDGE_KEY, []));
  const [draft, setDraft] = useState('');
  const [atlas, setAtlas] = useState(() => (window.cookNoteAtlasReady ? window.cookNoteAtlas : null));
  useEffect(() => {
    if (open && !atlas) loadIngredientAtlas().then(setAtlas).catch(() => {});
  }, [open]);
  const results = useMemo(() => {
    if (!open || !atlas || !items.length) return [];
    const have = new Set(items);
    return weekCandidates(recipes).map(recipe => {
      const ids = new Set();
      (recipe.ingredients || []).forEach(group => (group.items || []).forEach(line => {
        if (!atlas.ignored(line)) atlas.match(line).forEach(id => ids.add(id));
      }));
      const needed = [...ids].filter(id => !FRIDGE_STAPLES.has(id));
      const used = needed.filter(id => have.has(id));
      const missing = needed.filter(id => !have.has(id));
      return { recipe, used, missing };
    })
      // Au moins deux de mes ingredients (ou le seul note), puis le plus utilise moins ce qui manque.
      .filter(item => item.used.length >= Math.min(2, have.size))
      .sort((a, b) => (b.used.length * 2 - b.missing.length) - (a.used.length * 2 - a.missing.length) || a.missing.length - b.missing.length)
      .slice(0, 18);
  }, [open, atlas, items, recipes]);
  if (!open) return null;
  const save = next => {
    setItems(next);
    writeJson(FRIDGE_KEY, next);
  };
  const nameOf = id => tc(atlas?.byId?.[id]?.name || id);
  const add = text => {
    if (!atlas || !text.trim()) return;
    const id = atlas.match(text)[0];
    if (!id) {
      setDraft(text);
      return;
    }
    if (!items.includes(id)) save([...items, id]);
    setDraft('');
  };
  return h(ModalDialog, { className: '', onClose },
    h('section', { className: 'modal-panel fridge-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'fridge-modal-title', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null, h('p', { className: 'eyebrow' }, tc('Que cuisiner ?')), h('h2', { id: 'fridge-modal-title' }, tc('Mon frigo'))),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('form', { className: 'fridge-form', onSubmit: event => { event.preventDefault(); add(draft); } },
        h('input', { type: 'search', list: 'fridge-names', value: draft, placeholder: tc('Ajouter un ingrédient (poulet, courgette…)'), onChange: event => setDraft(event.target.value), 'aria-label': tc('Ingrédient que j’ai') }),
        h('button', { type: 'submit', className: 'week-tool is-primary' }, tc('Ajouter')),
        atlas && h('datalist', { id: 'fridge-names' }, atlas.entries.map(entry => h('option', { key: entry.id, value: tc(entry.name) })))
      ),
      draft && atlas && !atlas.match(draft)[0] && h('p', { className: 'fridge-hint' }, tc('Ingrédient non reconnu : essayez un nom plus simple.')),
      items.length > 0 && h('div', { className: 'fridge-items' },
        items.map(id => h('button', { key: id, type: 'button', onClick: () => save(items.filter(item => item !== id)), 'aria-label': `${tc('Retirer')} ${nameOf(id)}` }, nameOf(id), ' ×')),
        h('button', { type: 'button', className: 'fridge-clear', onClick: () => save([]) }, tc('Tout effacer'))
      ),
      !items.length && h('p', { className: 'fridge-hint' }, tc('Notez ce que vous avez : Cook Note propose les recettes qui s’en servent le mieux. Sel, poivre, huile, beurre, sucre et farine sont supposés au placard.')),
      results.length > 0 && h('ul', { className: 'fridge-results' },
        results.map(({ recipe, used, missing }) => h('li', { key: recipe.id },
          h('button', { type: 'button', onClick: () => { onClose(); openRecipe(recipe.id); } },
            h('strong', null, tc(recipe.title)),
            h('small', null, missing.length ? `${tc('Il manque')} : ${missing.slice(0, 5).map(nameOf).join(', ')}${missing.length > 5 ? '…' : ''}` : tc('Vous avez tout')),
            h('em', { className: missing.length ? '' : 'is-complete' }, `${used.length}/${used.length + missing.length}`)
          )
        ))
      ),
      items.length > 0 && atlas && !results.length && h('p', { className: 'fridge-hint' }, tc('Aucune recette avec ces ingrédients pour l’instant.'))
    )
  );
}

// ---------- Liens de partage : semaine et favoris ----------
// La semaine (#semaine=...) ou les favoris (#favoris=...) tiennent dans
// l'adresse ; en l'ouvrant, Cook Note propose de les importer (fusion pour
// les favoris), avant meme d'afficher l'application.
const encodeShareData = value => btoa(unescape(encodeURIComponent(JSON.stringify(value)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const decodeShareData = text => JSON.parse(decodeURIComponent(escape(atob(text.replace(/-/g, '+').replace(/_/g, '/')))));
const shareLinkFor = (kind, value) => `${window.location.origin}${COOK_NOTE_LANG === 'en' ? '/en/' : '/'}#${kind}=${encodeShareData(value)}`;

(function importSharedLink() {
  const match = String(window.location?.hash || '').match(/^#(semaine|favoris)=([\w-]+)/);
  if (!match) return;
  try {
    const value = decodeShareData(match[2]);
    if (match[1] === 'semaine' && value && typeof value === 'object') {
      const slots = Object.keys(value).length;
      if (slots && window.confirm(`${tc('Importer la semaine reçue')} (${slots} ${tc('repas')}) ? ${tc('Elle remplace votre semaine actuelle.')}`)) writeJson(WEEK_KEY, value);
    }
    if (match[1] === 'favoris' && Array.isArray(value) && value.length) {
      const current = readJson('cook_note_favorites', []);
      const added = value.filter(id => typeof id === 'string' && !current.includes(id));
      if (added.length && window.confirm(`${tc('Ajouter')} ${added.length} ${tc('recettes reçues à vos favoris ?')}`)) writeJson('cook_note_favorites', [...current, ...added]);
    }
  } catch { /* lien abime : ignore */ }
  window.history.replaceState(window.history.state, document.title, `${window.location.pathname}${window.location.search}`);
})();

// Bouton de partage : feuille de partage du telephone, sinon lien copie et QR.
function ShareLinkButton({ label, kind, value, title }) {
  const [url, setUrl] = useState('');
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!url || !canvasRef.current) return;
    loadDeferredScript(QR_CODE_SCRIPT_SRC, 'QRCode').then(QRCode => { if (canvasRef.current && QRCode?.create) drawFineQr(canvasRef.current, QRCode, url, 176); }).catch(() => {});
  }, [url]);
  const share = () => {
    const link = shareLinkFor(kind, value);
    if (navigator.share) {
      navigator.share({ title: `${title} - Cook Note`, url: link }).catch(() => {});
      return;
    }
    copyText(link).catch(() => {});
    setUrl(link);
  };
  return h('div', { className: 'share-link-button' },
    h('button', { type: 'button', className: 'week-tool', onClick: share }, h(Icon, { name: 'share' }), h('span', null, label)),
    url && h('div', { className: 'share-link-popover' },
      h('canvas', { ref: canvasRef, className: 'qr-canvas', width: 176, height: 176, role: 'img', 'aria-label': tc('QR code du lien') }),
      h('p', null, tc('Lien copié. Scannez ce code avec un autre téléphone pour l’ouvrir.')),
      h('button', { type: 'button', onClick: () => setUrl('') }, tc('Fermer'))
    )
  );
}

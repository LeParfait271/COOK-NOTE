// Carte des saisons : fruits et legumes de France mois par mois, avec les
// recettes Cook Note qui les utilisent (reconnaissance par l'atlas des ingredients).
// Mois en plages "debut-fin" (1 = janvier), une plage peut passer l'hiver (10-3).
const SEASON_MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const SEASON_KINDS = [
  { id: 'legumes', label: 'Légumes' },
  { id: 'fruits', label: 'Fruits' }
];
const SEASON_PRODUCE = {
  legumes: [
    ['Ail', '6-9'], ['Artichaut', '5-9'], ['Asperge', '4-6'], ['Aubergine', '6-9'], ['Betterave', '7-3'],
    ['Blette', '6-11'], ['Brocoli', '6-11'], ['Butternut', '9-2'], ['Carotte', '1-12'], ['Céleri', '9-3'],
    ['Champignons', '9-11'], ['Chou de Bruxelles', '10-2'], ['Chou-fleur', '9-4'], ['Chou vert', '10-3'], ['Concombre', '5-9'],
    ['Courgette', '6-9'], ['Endive', '10-4'], ['Épinard', '3-5,9-11'], ['Fenouil', '6-10'], ['Fève', '5-7'],
    ['Haricot vert', '6-9'], ['Laitue', '4-10'], ['Mâche', '10-3'], ['Maïs', '8-9'], ['Navet', '10-3'],
    ['Oignon', '1-12'], ['Panais', '10-3'], ['Petit pois', '5-7'], ['Poireau', '9-4'], ['Poivron', '7-9'],
    ['Pomme de terre', '1-12'], ['Potiron', '9-12'], ['Radis', '4-7'], ['Tomate', '6-9'], ['Topinambour', '10-3']
  ],
  fruits: [
    ['Abricot', '6-8'], ['Cassis', '6-7'], ['Cerise', '5-7'], ['Châtaigne', '10-12'], ['Citron', '12-3'],
    ['Clémentine', '11-2'], ['Coing', '9-11'], ['Figue', '8-10'], ['Fraise', '4-7'], ['Framboise', '6-9'],
    ['Groseille', '6-8'], ['Kaki', '10-12'], ['Kiwi', '11-4'], ['Melon', '6-9'], ['Mirabelle', '8-9'],
    ['Mûre', '8-9'], ['Myrtille', '7-9'], ['Noix', '9-11'], ['Orange', '12-3'], ['Pamplemousse', '12-4'],
    ['Pastèque', '7-8'], ['Pêche', '6-9'], ['Poire', '8-1'], ['Pomme', '8-3'], ['Prune', '7-9'],
    ['Raisin', '8-10'], ['Rhubarbe', '4-6']
  ]
};

function seasonMonthSet(ranges) {
  const months = new Set();
  ranges.split(',').forEach(range => {
    const [start, end] = range.split('-').map(Number);
    for (let month = start; ; month = (month % 12) + 1) {
      months.add(month);
      if (month === end) break;
    }
  });
  return months;
}

const SEASON_TABLE = Object.fromEntries(Object.entries(SEASON_PRODUCE).map(([kind, list]) => [kind, list.map(([name, ranges]) => ({ name, months: seasonMonthSet(ranges) }))]));

// Recettes (fiches finales) par produit, via l'atlas ; calcule une fois par catalogue.
function seasonRecipeIndex(recipes, atlas) {
  const byId = new Map();
  (recipes || []).forEach(recipe => {
    if (!recipe || (recipe.variants || []).length) return;
    const ids = new Set();
    (recipe.ingredients || []).forEach(group => (group.items || []).forEach(item => {
      if (!atlas.ignored(item)) atlas.match(item).forEach(id => ids.add(id));
    }));
    ids.forEach(id => {
      if (!byId.has(id)) byId.set(id, []);
      byId.get(id).push(recipe);
    });
  });
  return name => {
    const id = atlas.match(name)[0];
    return id ? byId.get(id) || [] : [];
  };
}

function SeasonPanel({ open, onClose, recipes, openRecipe }) {
  const today = new Date().getMonth() + 1;
  const [kind, setKind] = useState('legumes');
  const [month, setMonth] = useState(today);
  const [picked, setPicked] = useState('');
  const [atlas, setAtlas] = useState(() => (window.cookNoteAtlasReady ? window.cookNoteAtlas : null));
  useEffect(() => {
    if (!open) return;
    setMonth(today);
    setPicked('');
    if (!atlas) loadIngredientAtlas().then(setAtlas).catch(() => {});
  }, [open]);
  // Le mois choisi reste visible dans la frise (telephone : elle defile).
  const monthsRef = useRef(null);
  useEffect(() => {
    const strip = monthsRef.current;
    const active = strip?.querySelector('.is-active');
    if (strip && active) strip.scrollLeft = active.offsetLeft - (strip.clientWidth - active.offsetWidth) / 2;
  }, [open, month]);
  const recipesFor = useMemo(() => (open && atlas ? seasonRecipeIndex(recipes, atlas) : () => []), [open, atlas, recipes]);
  if (!open) return null;

  const next = (month % 12) + 1;
  const previous = ((month + 10) % 12) + 1;
  const items = SEASON_TABLE[kind]
    .map(item => {
      const now = item.months.has(month);
      const status = !now ? (item.months.has(next) ? 'soon' : '') : item.months.size === 12 ? 'always' : !item.months.has(previous) ? 'new' : !item.months.has(next) ? 'last' : 'peak';
      return { ...item, now, status };
    })
    .sort((a, b) => Number(b.now) - Number(a.now) || Number(a.status === 'always') - Number(b.status === 'always') || a.name.localeCompare(b.name, 'fr'));
  const fresh = items.filter(item => item.now && item.status !== 'always').length;
  const STATUS = { new: 'Arrive', last: 'Dernier mois', soon: 'Le mois prochain', always: 'Toute l’année' };
  const kindLabel = (SEASON_KINDS.find(item => item.id === kind) || SEASON_KINDS[0]).label.toLowerCase();

  return h(ModalDialog, { className: '', onClose },
    h('section', { className: 'modal-panel season-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'season-modal-title', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null, h('p', { className: 'eyebrow' }, 'Carte des saisons'), h('h2', { id: 'season-modal-title' }, `${SEASON_MONTHS[month - 1]}${month === today ? ', ce mois-ci' : ''}`)),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('div', { className: 'season-kinds', role: 'tablist' },
        SEASON_KINDS.map(item => h('button', { key: item.id, type: 'button', role: 'tab', 'aria-selected': kind === item.id, className: kind === item.id ? 'is-active' : '', onClick: () => { setKind(item.id); setPicked(''); } }, item.label))
      ),
      h('div', { ref: monthsRef, className: 'season-months', role: 'group', 'aria-label': 'Choisir le mois' },
        SEASON_MONTHS.map((label, index) => h('button', {
          key: label,
          type: 'button',
          className: `${index + 1 === month ? 'is-active' : ''}${index + 1 === today ? ' is-today' : ''}`,
          'aria-pressed': index + 1 === month,
          'aria-label': label,
          onClick: () => setMonth(index + 1)
        }, label.slice(0, 3).replace('Jui', index === 5 ? 'Juin' : 'Juil').replace('Aoû', 'Août')))
      ),
      h('p', { className: 'season-summary' }, `${fresh} ${kindLabel} de saison en ${SEASON_MONTHS[month - 1].toLowerCase()}, plus les classiques de toute l’année.`),
      h('ul', { className: 'season-list' },
        items.map(item => {
          const open = picked === item.name;
          const used = open ? recipesFor(item.name) : [];
          return h('li', { key: item.name, className: `season-row${item.now ? ' is-now' : ''}${open ? ' is-open' : ''}` },
            h('button', { type: 'button', className: 'season-row-head', 'aria-expanded': open, onClick: () => setPicked(open ? '' : item.name) },
              h('strong', null, item.name),
              item.status && h('em', { className: `season-tag is-${item.status}` }, STATUS[item.status] || 'Pleine saison'),
              h('span', { className: 'season-bar', 'aria-label': `De saison : ${SEASON_MONTHS.filter((_, index) => item.months.has(index + 1)).join(', ')}` },
                SEASON_MONTHS.map((label, index) => h('i', { key: label, className: `${item.months.has(index + 1) ? 'is-on' : ''}${index + 1 === month ? ' is-month' : ''}` }))
              )
            ),
            open && h('div', { className: 'season-recipes' },
              !atlas ? h('p', null, 'Chargement des recettes…')
                : used.length ? h(React.Fragment, null,
                  h('p', null, `Dans ${used.length} recette${used.length > 1 ? 's' : ''} Cook Note`),
                  h('div', null, used.slice(0, 8).map(recipe => h('button', { key: recipe.id, type: 'button', onClick: () => { onClose(); openRecipe(recipe.id); } }, recipe.title)))
                )
                  : h('p', null, 'Pas encore de recette Cook Note avec ce produit.')
            )
          );
        })
      )
    )
  );
}

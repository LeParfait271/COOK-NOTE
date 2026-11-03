// Carte des saisons : fruits et legumes de France mois par mois, avec les
// recettes Cook Note qui les utilisent.
// Source automatique : chaque fiche `legumes` / `fruits` de l'atlas des
// ingredients porte `mois` (controle par validate-ingredient-atlas.js) ; une
// recette qui apporte un nouveau legume ou fruit l'ajoute donc ici sans rien
// toucher a ce fichier. SEASON_EXTRAS complete le calendrier avec des produits
// de saison encore absents des recettes (ou ranges dans une autre famille).
const SEASON_MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const SEASON_INITIALS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const SEASON_KINDS = [
  { id: 'legumes', label: 'Légumes', color: '#8fcf86' },
  { id: 'fruits', label: 'Fruits', color: '#f4b183' }
];
const SEASON_EXTRAS = {
  legumes: [['Ail', '6-9'], ['Fève', '5-7'], ['Haricot coco', '8-10'], ['Laitue', '4-10'], ['Mâche', '10-3'], ['Maïs', '8-9'], ['Radis', '4-7'], ['Topinambour', '10-3']],
  fruits: [['Cassis', '6-7'], ['Clémentine', '11-2'], ['Coing', '9-11'], ['Figue', '8-10'], ['Kaki', '10-12'], ['Mirabelle', '8-9'], ['Noix', '9-11'], ['Mandarine', '11-2'], ['Nectarine', '6-9'], ['Noisette', '9-10'], ['Pamplemousse', '12-4'], ['Pastèque', '7-8'], ['Prune', '7-9'], ['Rhubarbe', '4-6']]
};
const SEASON_SECTIONS = [
  { id: 'new', label: 'Arrivent ce mois-ci' },
  { id: 'peak', label: 'En pleine saison' },
  { id: 'last', label: 'Derniers jours' },
  { id: 'always', label: 'Toute l’année' },
  { id: 'soon', label: 'Le mois prochain' },
  { id: 'off', label: 'Hors saison' }
];
// Fiche rangee dans une autre famille de l'atlas mais montree ailleurs ici.
const SEASON_KIND_OF = { chataigne: 'fruits' };

function seasonMonthSet(ranges) {
  const months = new Set();
  if (ranges === 'toute') {
    for (let month = 1; month <= 12; month += 1) months.add(month);
    return months;
  }
  String(ranges).split(',').forEach(range => {
    const [start, end] = range.split('-').map(Number);
    if (!start || !end) return;
    for (let month = start; ; month = (month % 12) + 1) {
      months.add(month);
      if (month === end) break;
    }
  });
  return months;
}

// Produits par famille (atlas d'abord, complements ensuite) et recettes par
// produit ; calcule une fois par catalogue.
function seasonCatalog(recipes, atlas) {
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
  const table = {};
  SEASON_KINDS.forEach(({ id: kind }) => {
    const items = atlas.entries
      .filter(entry => (SEASON_KIND_OF[entry.id] || entry.family) === kind && entry.mois && entry.mois !== 'aucune')
      .map(entry => ({ key: entry.id, name: entry.name, months: seasonMonthSet(entry.mois), recipes: byId.get(entry.id) || [] }));
    // Un complement n'est ecarte que si l'atlas a deja ce produit sous ce nom
    // (la clementine reconnue comme « orange » reste un produit a part).
    const names = new Set(items.map(item => atlas.normalize(item.name)));
    SEASON_EXTRAS[kind].forEach(([name, ranges]) => {
      if (names.has(atlas.normalize(name))) return;
      const id = atlas.match(name)[0];
      const own = id && atlas.normalize(atlas.byId[id].name).startsWith(atlas.normalize(name).slice(0, 5));
      items.push({ key: `extra-${name}`, name, months: seasonMonthSet(ranges), recipes: own ? byId.get(id) || [] : [] });
    });
    table[kind] = items;
  });
  return table;
}

function seasonStatus(item, month) {
  const next = (month % 12) + 1;
  const previous = ((month + 10) % 12) + 1;
  if (!item.months.has(month)) return item.months.has(next) ? 'soon' : 'off';
  if (item.months.size === 12) return 'always';
  if (!item.months.has(previous)) return 'new';
  if (!item.months.has(next)) return 'last';
  return 'peak';
}

function SeasonPanel({ open, onClose, recipes, openRecipe }) {
  const today = new Date().getMonth() + 1;
  const [kind, setKind] = useState('legumes');
  const [month, setMonth] = useState(today);
  const [picked, setPicked] = useState('');
  const [atlas, setAtlas] = useState(() => (window.cookNoteAtlasReady ? window.cookNoteAtlas : null));
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!open) return;
    setMonth(today);
    setPicked('');
    if (!atlas) loadIngredientAtlas().then(setAtlas).catch(() => setFailed(true));
  }, [open]);
  const table = useMemo(() => (open && atlas ? seasonCatalog(recipes, atlas) : null), [open, atlas, recipes]);
  if (!open) return null;

  const tone = (SEASON_KINDS.find(item => item.id === kind) || SEASON_KINDS[0]);
  const shift = step => {
    setMonth(current => ((current - 1 + step + 12) % 12) + 1);
    setPicked('');
  };
  const items = table ? table[kind].map(item => ({ ...item, status: seasonStatus(item, month) })) : [];
  const fresh = items.filter(item => item.status === 'new' || item.status === 'peak' || item.status === 'last').length;

  return h(ModalDialog, { className: '', onClose },
    h('section', { className: 'modal-panel season-modal', style: { '--season': tone.color }, role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'season-modal-title', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null, h('p', { className: 'eyebrow' }, tc('Carte des saisons')), h('h2', { id: 'season-modal-title' }, tc('Fruits et légumes de saison'))),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('div', { className: 'season-kinds', role: 'tablist', 'aria-label': 'Légumes ou fruits' },
        SEASON_KINDS.map(item => h('button', { key: item.id, type: 'button', role: 'tab', 'aria-selected': kind === item.id, style: { '--season': item.color }, className: kind === item.id ? 'is-active' : '', onClick: () => { setKind(item.id); setPicked(''); } }, item.label))
      ),
      h('div', { className: 'season-month' },
        h('button', { type: 'button', className: 'season-step', onClick: () => shift(-1), 'aria-label': 'Mois précédent' }, '‹'),
        h('div', { className: 'season-month-name' },
          h('strong', null, SEASON_MONTHS[month - 1]),
          h('small', null, month === today ? 'Ce mois-ci' : h('button', { type: 'button', onClick: () => setMonth(today) }, 'Revenir à ce mois-ci'))
        ),
        h('button', { type: 'button', className: 'season-step', onClick: () => shift(1), 'aria-label': 'Mois suivant' }, '›')
      ),
      h('div', { className: 'season-months', role: 'group', 'aria-label': 'Choisir le mois' },
        SEASON_INITIALS.map((initial, index) => h('button', {
          key: index,
          type: 'button',
          className: `${index + 1 === month ? 'is-active' : ''}${index + 1 === today ? ' is-today' : ''}`,
          'aria-pressed': index + 1 === month,
          'aria-label': SEASON_MONTHS[index],
          title: SEASON_MONTHS[index],
          onClick: () => { setMonth(index + 1); setPicked(''); }
        }, initial))
      ),
      !table
        ? h('p', { className: 'season-summary' }, failed ? tc('La carte n’a pas pu se charger. Vérifiez la connexion puis rouvrez-la.') : tc('Chargement du calendrier…'))
        : h(React.Fragment, null,
          h('p', { className: 'season-summary' }, h('strong', null, fresh), ` ${tone.label.toLowerCase()} de saison en ${SEASON_MONTHS[month - 1].toLowerCase()}, sur ${items.length} au calendrier`),
          SEASON_SECTIONS.map(section => {
            const list = items.filter(item => item.status === section.id).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
            if (!list.length) return null;
            return h('section', { key: section.id, className: `season-section is-${section.id}` },
              h('h3', null, section.label, h('span', null, list.length)),
              h('div', { className: 'season-grid' },
                list.map(item => {
                  const opened = picked === item.key;
                  return h('div', { key: item.key, className: `season-card${opened ? ' is-open' : ''}` },
                    h('button', { type: 'button', className: 'season-card-head', 'aria-expanded': opened, onClick: () => setPicked(opened ? '' : item.key) },
                      h('strong', null, item.name),
                      h('small', null, item.recipes.length ? `${item.recipes.length} recette${item.recipes.length > 1 ? 's' : ''}` : 'Aucune recette'),
                      h('span', { className: 'season-bar', 'aria-label': `De saison : ${SEASON_MONTHS.filter((_, index) => item.months.has(index + 1)).join(', ')}` },
                        SEASON_INITIALS.map((initial, index) => h('i', { key: index, className: `${item.months.has(index + 1) ? 'is-on' : ''}${index + 1 === month ? ' is-month' : ''}` }))
                      )
                    ),
                    opened && h('div', { className: 'season-recipes' },
                      item.recipes.length
                        ? item.recipes.slice(0, 8).map(recipe => h('button', { key: recipe.id, type: 'button', onClick: () => { onClose(); openRecipe(recipe.id); } }, recipe.title))
                        : h('p', null, tc('Pas encore de recette Cook Note avec ce produit.'))
                    )
                  );
                })
              )
            );
          })
        )
    )
  );
}

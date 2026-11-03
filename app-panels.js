function SearchPanel({ open, onClose, query, resultQuery, setQuery, searchRef, results, resultMeta, ingredientMeta, openRecipe, rememberSearch }) {
  const [draftQuery, setDraftQuery] = useState(query);
  const [fridge, setFridge] = useState(false);
  const draftQueryRef = useRef(query);
  const queryCommitTimerRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    let requested = false;
    try {
      requested = sessionStorage.getItem(FRIDGE_MODE_KEY) === '1';
      sessionStorage.removeItem(FRIDGE_MODE_KEY);
    } catch { /* stockage indisponible */ }
    setFridge(requested);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const frame = window.requestAnimationFrame(() => searchRef.current?.focus?.({ preventScroll: true }));
    return () => window.cancelAnimationFrame(frame);
  }, [open, searchRef]);

  useEffect(() => {
    if (!open) return undefined;
    draftQueryRef.current = query;
    setDraftQuery(query);
    return () => {
      if (queryCommitTimerRef.current) window.clearTimeout(queryCommitTimerRef.current);
      queryCommitTimerRef.current = 0;
    };
  }, [open]);

  const updateDraftQuery = (value, immediate = false) => {
    draftQueryRef.current = value;
    setDraftQuery(value);
    if (queryCommitTimerRef.current) window.clearTimeout(queryCommitTimerRef.current);
    queryCommitTimerRef.current = 0;
    if (immediate) {
      setQuery(value);
      return;
    }
    queryCommitTimerRef.current = window.setTimeout(() => {
      queryCommitTimerRef.current = 0;
      setQuery(value);
    }, SEARCH_INPUT_COMMIT_DELAY_MS);
  };
  const closeSearch = () => {
    updateDraftQuery(draftQueryRef.current, true);
    onClose();
  };

  if (!open) return null;
  const hasQuery = Boolean(draftQuery.trim());
  const searchPending = draftQuery !== query || query !== resultQuery;
  const ingredientTokens = ingredientSearchTokens(draftQuery);
  const hasIngredientMatches = hasQuery && !searchPending && results.some(recipe => ingredientMeta.has(recipe.id));
  const groupByIngredientAvailability = hasIngredientMatches && (draftQuery.includes(',') || ingredientTokens.length > 1);
  const visibleResults = hasQuery && !searchPending ? results.slice(0, 12) : [];
  const resultGroups = visibleResults.reduce((groups, recipe) => {
    const availability = ingredientMeta.has(recipe.id) ? ingredientAvailabilityGroup(ingredientMeta.get(recipe.id)) : null;
    const key = groupByIngredientAvailability && availability ? availability.key : primaryCategory(recipe);
    const label = groupByIngredientAvailability && availability ? availability.label : key;
    if (!groups.has(key)) groups.set(key, { key, label, recipes: [], ingredientGroup: Boolean(groupByIngredientAvailability && availability) });
    groups.get(key).recipes.push(recipe);
    return groups;
  }, new Map());
  const quickSearches = [
    { label: 'Rapide', query: 'rapide' },
    { label: 'Ap\u00e9ro', query: 'apero' },
    { label: 'Au four', query: 'cuisson au four' }
  ];
  const liveSuggestions = hasQuery && !searchPending ? searchSuggestionTerms(draftQuery, results) : [];
  const rememberCurrentSearch = () => {
    if (draftQuery.trim()) rememberSearch?.(draftQuery);
  };
  const openSearchRecipe = recipe => {
    rememberCurrentSearch();
    rememberRequestedServings(draftQuery);
    openRecipe(recipe.id);
    onClose();
  };
  return h(ModalDialog, { className: 'search-backdrop', onClose: closeSearch },
    h('section', {
      className: 'modal-panel search-modal',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Recherche',
      tabIndex: -1,
      onKeyDown: trapModalFocus,
      onMouseDown: event => event.stopPropagation()
    },
      h('div', { className: 'modal-head' },
         h('h2', null, tc('Rechercher')),
        h('button', { type: 'button', className: 'icon-btn', onClick: closeSearch, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('div', { className: 'field search-modal-field' },
        h('label', { className: 'sr-only', htmlFor: 'recipe-search-input' }, tc('Rechercher une recette')),
        h('input', {
          id: 'recipe-search-input',
          type: 'search',
          ref: searchRef,
          value: draftQuery,
          onChange: event => updateDraftQuery(event.target.value),
          onKeyDown: event => {
            if (event.key === 'Escape') closeSearch();
            if (event.key === 'Enter' && searchPending) {
              event.preventDefault();
              updateDraftQuery(draftQuery, true);
            } else if (event.key === 'Enter' && visibleResults[0]) {
              openSearchRecipe(visibleResults[0]);
            }
          },
          placeholder: fridge ? 'Mes ingrédients : œufs, tomates, fromage…' : 'Recette, ingrédients, usage, saison...'
        })
      ),
      fridge && !hasQuery && h('p', { className: 'search-fridge-hint' }, tc('Liste ce que tu as sous la main, séparé par des virgules : les recettes faisables tout de suite passent en premier, puis celles où il manque un ou deux ingrédients.')),
      hasQuery && liveSuggestions.length > 0 && h('div', { className: 'search-live-suggestions', 'aria-label': 'Suggestions pendant la frappe' },
        liveSuggestions.map(item => h('button', {
          key: item,
          type: 'button',
          onClick: () => {
            updateDraftQuery(item, true);
            rememberSearch?.(item);
          }
        }, item))
      ),
      !hasQuery && h('div', { className: 'search-quick-rail', 'aria-label': 'Recherches rapides' },
        h('button', {
          type: 'button',
          className: fridge ? 'active' : '',
          'aria-pressed': fridge,
          onClick: () => {
            setFridge(!fridge);
            searchRef.current?.focus?.();
          }
        }, 'Avec ce que j’ai'),
        quickSearches.map(item => h('button', {
          key: item.query,
          type: 'button',
          onClick: () => {
            updateDraftQuery(item.query, true);
            rememberSearch?.(item.query);
          }
        }, item.label))
      ),
      !hasQuery && h('p', { className: 'search-empty-state' }, tc('Saisissez un plat, un ingrédient ou une envie.')),
      hasQuery
        ? h('div', { className: searchPending ? 'search-result-count search-pending' : 'search-result-count', role: 'status', 'aria-live': 'polite' },
          searchPending
            ? t('search.pending')
            : visibleResults.length < results.length
              ? t('search.bestResults', { shown: visibleResults.length, total: results.length, query: draftQuery })
              : t('search.results', { count: results.length, plural: results.length > 1 ? 's' : '', query: draftQuery }))
        : null,
      hasQuery && !searchPending && (visibleResults.length
        ? h('div', { className: 'search-result-groups' },
          Array.from(resultGroups.values()).map(group => h('section', { key: group.key, className: group.ingredientGroup ? 'search-result-group ingredient-match-group' : 'search-result-group' },
            h('div', { className: 'search-result-group-head' },
              h('strong', null, group.label),
              h('span', null, `${group.recipes.length} résultat${group.recipes.length > 1 ? 's' : ''}`)
            ),
            h('div', { className: 'search-results' },
              group.recipes.map(recipe => {
                const ingredient = ingredientMeta.get(recipe.id);
                const availability = ingredient ? ingredientAvailabilityGroup(ingredient) : null;
                return h('button', {
                  key: recipe.id,
                  type: 'button',
                  className: 'search-result',
                  'aria-label': `Ouvrir ${recipe.title}`,
                  onClick: () => openSearchRecipe(recipe)
                },
                  h('span', { className: 'search-result-image', style: imageBackgroundStyle(displayRecipeImage(recipe)), 'aria-hidden': true }),
                  h('span', { className: 'search-result-copy' },
                    h('strong', null, recipe.title),
                    h('small', { className: 'search-result-meta' }, [primaryCategory(recipe), formatMinutesShort(getRecipeTiming(recipe).total), recipe.yield || difficultyText(recipe)].filter(Boolean).join(' · ')),
                    availability && h('span', { className: `ingredient-match-badge ${availability.key}` }, availability.label),
                    ingredient?.matched?.length && h('span', { className: 'search-reason-pills' },
                      ingredient.matched.slice(0, 3).map(reason => h('em', { key: reason }, reason))
                    ),
                    ingredient?.missing?.length > 0 && h('small', { className: 'ingredient-missing' }, `Manque peut-être : ${ingredient.missing.slice(0, 2).join(', ')}`)
                  ),
                );
              })
            )
          ))
        )
        : h('div', { className: 'empty-state search-empty', style: { justifyItems: 'center', textAlign: 'center' } },
          h('span', { className: 'empty-state-mark', 'aria-hidden': true, style: { display: 'grid', placeItems: 'center', width: 42, height: 42, border: '1px solid color-mix(in srgb,var(--accent) 52%,var(--line))', borderRadius: '999px', background: 'color-mix(in srgb,var(--accent) 12%,var(--surface-soft))' } }, h(Icon, { name: 'search' })),
          h('h2', null, tc('Aucun résultat')),
          h('p', null, tc('Essaie un ingrédient, une catégorie ou un mot proche.'))
        ))

    )
  );
}

function CommandPalette({
  open,
  onClose,
  commandRef,
  recipes,
  recipesById,
  query,
  setQuery,
  openFullSearch,
  openRecipe,
  showFavorites,
  openMenuPlanner,
  openTechniques,
  openShoppingBasket,
  shoppingCount = 0
}) {
  const [term, setTerm] = useState('');
  const scoringTerm = useDebouncedValue(term, 80);
  const compactCommandInput = useMediaQuery('(max-width: 420px)');

  useEffect(() => {
    if (!open) return;
    setTerm(query || '');
    window.setTimeout(() => commandRef.current?.focus(), 0);
  }, [open]);

  if (!open) return null;

  const cleanTerm = term.trim();
  const cleanScoringTerm = scoringTerm.trim();
  const normalizedTerm = normalizeText(cleanScoringTerm);
  const commandPending = term !== scoringTerm;
  const openSearchWithTerm = () => {
    if (cleanTerm) setQuery(cleanTerm);
    onClose();
    openFullSearch();
  };
  const runAction = action => {
    onClose();
    action.run();
  };
  const baseActions = [
    {
      id: 'menu',
      icon: 'spark',
      label: 'Composer un menu',
      detail: 'Accords, service, liste de courses',
      run: openMenuPlanner
    },
    {
      id: 'techniques',
      icon: 'book',
      label: 'Techniques',
      detail: 'Gestes, rep\u00e8res et bases',
      run: openTechniques
    },
    {
      id: 'fridge',
      icon: 'basket',
      label: 'Avec ce que j’ai',
      detail: 'Tes ingrédients, les recettes faisables',
      run: () => {
        requestFridgeSearch();
        if (cleanTerm) setQuery('');
        openFullSearch();
      }
    },
    {
      id: 'favorites',
      icon: 'heart',
      label: 'Favoris',
      detail: 'Fiches sauvegard\u00e9es',
      run: showFavorites
    },
    {
      id: 'shopping',
      icon: 'basket',
      label: 'Courses',
      detail: `${shoppingCount} fiche${shoppingCount > 1 ? 's' : ''}`,
      run: openShoppingBasket
    }
  ];
  const matchedActions = normalizedTerm ? [] : [...baseActions].sort((left, right) => (right.id === 'fridge') - (left.id === 'fridge'));
  // « sans X », « en moins de… », « pour 6 » : contraintes, pas des mots a chercher.
  const constraints = splitSearchExclusions(normalizedTerm);
  const positiveTerm = constraints.rest;
  const commandRecipes = normalizedTerm
    ? recipes
      .filter(recipe => recipeFitsSearchConstraints(recipe, constraints))
      .map(recipe => {
        const titleScore = positiveTerm && normalizeText(recipe.title).includes(positiveTerm) ? 24 : 0;
        const categoryScore = positiveTerm && normalizeText(categoryLine(recipe)).includes(positiveTerm) ? 8 : 0;
        const textMeta = scoreRecipeSearch(recipe, cleanScoringTerm, recipesById);
        const ingredient = positiveTerm ? scoreIngredientSearch(recipe, positiveTerm) : { score: 0 };
        return {
          recipe,
          score: titleScore + categoryScore + textMeta.score + ingredient.score
        };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score || a.recipe.title.localeCompare(b.recipe.title, 'fr'))
      .slice(0, 7)
    : [];
  const firstCommand = commandRecipes[0] || matchedActions[0];
  const runRecipe = recipe => {
    rememberRequestedServings(cleanTerm);
    onClose();
    openRecipe(recipe.id);
  };
  const runFirstCommand = () => {
    if (!firstCommand) return;
    if (firstCommand.recipe) runRecipe(firstCommand.recipe);
    else runAction(firstCommand);
  };

  return h(ModalDialog, { className: 'command-backdrop', onClose: onClose },
    h('section', {
      className: 'modal-panel command-palette',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Commandes Cook Note',
      tabIndex: -1,
      onKeyDown: trapModalFocus,
      onMouseDown: event => event.stopPropagation()
    },
      h('div', { className: 'command-input-shell' },
        h(Icon, { name: 'search' }),
        h('label', { className: 'sr-only', htmlFor: 'cook-note-command-input' }, tc('Commande ou recette')),
        h('input', {
          id: 'cook-note-command-input',
          ref: commandRef,
          type: 'search',
          value: term,
          onChange: event => setTerm(event.target.value),
          onKeyDown: event => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'Enter') {
              event.preventDefault();
              if (!cleanTerm || commandPending || !commandRecipes.length) openSearchWithTerm();
              else runFirstCommand();
            }
          },
          placeholder: (compactCommandInput ? tc('Rechercher…') : tc('Commande, recette, ingr\u00e9dient...'))
        }),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('div', { className: 'command-sections' },
        !cleanTerm && h('section', { className: 'command-section' },
          h('div', { className: 'command-section-head' },
              h('strong', null, tc('Accès rapides'))
          ),
          h('div', { className: 'command-action-grid' },
            matchedActions.map(action => h('button', {
              key: action.id,
              type: 'button',
              // Cinq acces : le premier (Avec ce que j'ai) occupe toute la ligne.
              className: action.id === 'fridge' ? 'command-row is-wide' : 'command-row',
              onClick: () => runAction(action)
            },
              h('span', { className: 'command-row-icon' }, h(Icon, { name: action.icon })),
              h('span', { className: 'command-row-copy' },
                h('strong', null, action.label),
                h('small', null, action.detail)
              )
            )),
            !matchedActions.length && h('button', { type: 'button', className: 'command-row command-search-fallback', onClick: openSearchWithTerm },
              h('span', { className: 'command-row-icon' }, h(Icon, { name: 'search' })),
              h('span', { className: 'command-row-copy' },
                h('strong', null, tc('Recherche complète')),
                h('small', null, cleanTerm || 'Catalogue')
              )
            )
          )
        ),
        cleanTerm && h('section', { className: 'command-section' },
          h('div', { className: 'command-section-head' },
            h('strong', null, tc('Recettes')),
            h('button', { type: 'button', onClick: openSearchWithTerm }, tc('Recherche complète'))
          ),
          commandRecipes.length
            ? h('div', { className: 'command-recipe-list' },
              // Sous-titre utile (categorie, temps, difficulte) : il repetait la recherche.
              commandRecipes.map(({ recipe }) => h('button', {
                key: recipe.id,
                type: 'button',
                className: 'command-recipe-row',
                onClick: () => runRecipe(recipe)
              },
                h('span', { className: 'command-recipe-image', style: imageBackgroundStyle(displayRecipeImage(recipe)) }),
                h('span', { className: 'command-row-copy' },
                  h('strong', null, recipe.title),
                  h('small', null, [primaryCategory(recipe), formatMinutesShort(getRecipeTiming(recipe).total), difficultyText(recipe)].filter(Boolean).join(' · '))
                )
              ))
            )
            : h('div', { className: 'command-empty' },
              h('strong', null, `Aucune recette pour « ${cleanTerm} »`),
              h('p', null, tc('Essaie un ingrédient, un plat ou une envie : « poulet », « tarte », « rapide ».')),
              h('button', { type: 'button', className: 'btn btn-ghost command-empty-action', onClick: openSearchWithTerm }, tc('Chercher dans tout le catalogue'))
            )
        )
      )
    )
  );
}
// Panier de courses (ShoppingBasketPanel) : app-basket.js.

function MenuPlannerPanel({ open, onClose, recipes, openRecipe, addMenuToShopping, notify }) {
  const [offset, setOffset] = useState(0);
  const [itemOffsets, setItemOffsets] = useState({});
  const [peopleCount, setPeopleCount] = useState(4);
  const [themeId, setThemeId] = useState(MENU_THEMES[0].id);
  const [menuHistory, setMenuHistory] = useState(() => readStoredList(STORAGE_KEYS.menuHistory, []));
  const menu = useMemo(() => open ? buildMenuSuggestionWithOverrides(recipes, offset, themeId, menuHistory, itemOffsets) : EMPTY_MENU, [open, recipes, offset, themeId, menuHistory, itemOffsets]);
  const menuItems = useMemo(() => menu.items || [], [menu]);
  const menuRecipes = useMemo(() => menuItems.map(item => item.recipe), [menuItems]);
  const menuFactorById = useMemo(() => open ? menuFactorMapFor(menuRecipes, peopleCount) : {}, [open, menuRecipes, peopleCount]);
  const shoppingData = useMemo(() => open ? buildShoppingListData(menuRecipes, menuFactorById) : EMPTY_SHOPPING_DATA, [open, menuRecipes, menuFactorById]);
  const servicePlan = useMemo(() => open ? buildMenuServicePlan(menuRecipes, shoppingData) : EMPTY_MENU_SERVICE_PLAN, [open, menuRecipes, shoppingData]);
  if (!open) return null;
  const rememberMenu = currentMenu => {
    if (!currentMenu?.signature) return;
    const next = [currentMenu.signature, ...menuHistory.filter(item => item !== currentMenu.signature)].slice(0, 12);
    setMenuHistory(next);
    writeJson(STORAGE_KEYS.menuHistory, next);
  };
  const addToShopping = () => {
    rememberMenu(menu);
    addMenuToShopping(menuRecipes, menuFactorById);
    notify?.(`Menu ajouté aux courses pour ${peopleCount} personnes`);
  };
  const changeWholeMenu = () => {
    rememberMenu(menu);
    setItemOffsets({});
    setOffset(value => value + 1);
  };
  const changeOneItem = index => {
    setItemOffsets(current => ({ ...current, [index]: (current[index] || 0) + 1 }));
  };
  return h(ModalDialog, { className: '', onClose: onClose },
    h('section', { className: 'modal-panel menu-planner-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'menu-planner-title', tabIndex: -1, onKeyDown: trapModalFocus, onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head menu-planner-modal-head' },
        h('div', null,
          h('p', { className: 'eyebrow' }, tc('Mode menu')),
          h('h2', { id: 'menu-planner-title' }, tc('Composer un repas'))
        ),
        h('div', { className: 'menu-planner-head-actions' },
          h(Button, { variant: 'subtle', onClick: changeWholeMenu, ariaLabel: 'Proposer un autre menu complet' }, 'Autre menu'),
          h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
        )
      ),
      h('div', { className: 'menu-theme-tabs', 'aria-label': 'Style de menu' },
        MENU_THEMES.map(theme => h('button', {
          key: theme.id,
          type: 'button',
          className: theme.id === themeId ? 'active' : '',
          'aria-pressed': theme.id === themeId,
          'aria-label': `Choisir le style ${theme.label}`,
          onClick: () => {
            setThemeId(theme.id);
            setOffset(0);
            setItemOffsets({});
          }
        }, theme.label))
      ),
      h('div', { className: 'menu-planner-controls' },
        h('label', { className: 'factor-control serving-control quantity-select-control menu-serving-control', 'aria-label': 'Choisir le nombre de personnes du menu' },
          h('span', { className: 'factor-label' }, tc('Personnes')),
          h('select', {
            className: 'quantity-select',
            value: String(peopleCount),
            'aria-label': 'Nombre de personnes du menu',
            onChange: event => setPeopleCount(Number(event.target.value))
          },
            [1, 2, 3, 4, 5, 6, 8, 10, 12].map(value => h('option', { key: value, value: String(value) }, String(value)))
          ),
          h('span', { className: 'quantity-unit' }, peopleCount > 1 ? tc('personnes') : tc('personne'))
        ),
        h('span', { className: 'menu-serving-hint' }, tc('Les quantités du menu et des courses suivent ce nombre.'))
      ),
      // Le style du menu en une phrase (la note « 98/100 » faisait gadget).
      h('p', { className: 'menu-planner-reason' }, menu.reason),
      h('div', { className: 'menu-planner-grid' },
        menuItems.map((item, index) => h('article', { key: `${item.key}-${item.recipe.id}-${index}`, className: 'menu-planner-card' },
          h('span', { className: 'menu-planner-image', style: imageBackgroundStyle(displayRecipeImage(item.recipe)), 'aria-hidden': true }),
          h('div', null,
            h('p', { className: 'eyebrow' }, item.label),
            h('h3', null, item.recipe.title),
            h('small', null, [primaryCategory(item.recipe), difficultyText(item.recipe), getRecipeTiming(item.recipe).active ? `Actif ${formatMinutesShort(getRecipeTiming(item.recipe).active)}` : '', getQuantityDisplay(item.recipe, menuFactorById[item.recipe.id] || 1)].filter(Boolean).join(' · ')),
            item.note && h('p', { className: 'menu-planner-note' }, item.note),
            h('div', { className: 'menu-planner-card-actions' },
              h(Button, { variant: 'subtle', onClick: () => openRecipe(item.recipe.id), ariaLabel: `Ouvrir ${item.recipe.title}` }, 'Ouvrir'),
              h(Button, { variant: 'ghost', onClick: () => changeOneItem(menuItemSlotKey(item, index)), ariaLabel: `Changer ${item.label} : ${item.recipe.title}` }, 'Changer')
            )
          )
        ))
      ),
      h('div', { className: 'menu-planner-summary' },
        h('span', null, `Charge ${servicePlan.stress.level}`),
        h('span', null, `${menuRecipes.length} fiches`),
        h('span', null, `${shoppingData.groupedItems.length} articles groupés`),
        h('span', null, `${shoppingData.aisleGroups.length} rayons`)
      ),
      h('div', { className: 'menu-service-grid' },
        servicePlan.timeline.length > 0 && h('section', { className: 'menu-service-panel menu-service-panel-wide' },
          h('p', { className: 'eyebrow' }, tc('Timeline')),
          servicePlan.timeline.map(group => h('div', { key: group.key, className: 'menu-service-block' },
            h('strong', null, group.label),
            h('ul', null, group.items.map(item => h('li', { key: item }, item)))
          ))
        ),
        h('section', { className: 'menu-service-panel' },
          h('p', { className: 'eyebrow' }, tc('Charge mentale')),
          h('strong', null, servicePlan.stress.level),
          h('ul', null, (servicePlan.stress.reasons.length ? servicePlan.stress.reasons : ['Menu simple à coordonner.']).map(item => h('li', { key: item }, item)))
        ),
        h('section', { className: 'menu-service-panel' },
          h('p', { className: 'eyebrow' }, tc('Courses')),
          servicePlan.shoppingHints.map(group => h('div', { key: group.label, className: 'menu-service-block' },
            h('strong', null, group.label),
            h('ul', null, group.items.map(item => h('li', { key: item }, item)))
          ))
        ),
        servicePlan.leftovers.length > 0 && h('section', { className: 'menu-service-panel' },
          h('p', { className: 'eyebrow' }, tc('Restes')),
          h('ul', null, servicePlan.leftovers.map(item => h('li', { key: item }, item)))
        ),
        h('section', { className: 'menu-service-panel' },
          h('p', { className: 'eyebrow' }, tc('Service')),
          h('ul', null, servicePlan.serviceTips.map(item => h('li', { key: item.title }, `${item.title} : ${item.tip}`)))
        ),
        h('section', { className: 'menu-service-panel' },
          h('p', { className: 'eyebrow' }, tc('Matériel')),
          h('ul', null, servicePlan.conflicts.map(item => h('li', { key: item }, item)))
        )
      ),
      h('div', { className: 'modal-actions' },
        h(Button, { variant: 'primary', disabled: !menuRecipes.length, onClick: addToShopping, ariaLabel: `Ajouter le menu aux courses pour ${peopleCount} personnes` }, 'Ajouter le menu aux courses')
      )
    )
  );
}

function PreferencesPanel({ open, onClose, preferences, updatePreferences, favoriteCount = 0, isOnline = true, offlineBusy = false, offlineProgress = null, preloadFavoritesOffline, preloadCatalogOffline = null, exportLocalData, importLocalData }) {
  if (!open) return null;
  const update = patch => updatePreferences(patch);
  const theme = preferences.theme === 'light' ? 'light' : 'dark';
  return h(ModalDialog, { className: '', onClose: onClose },
    h('section', { className: 'modal-panel preferences-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'preferences-title', tabIndex: -1, onKeyDown: trapModalFocus, onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head menu-planner-modal-head' },
        h('div', null,
          h('p', { className: 'eyebrow' }, tc('Affichage')),
          h('h2', { id: 'preferences-title' }, tc('Préférences'))
        ),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('div', { className: 'preference-group' },
        h('strong', null, tc('Thème')),
        h('div', { className: 'segmented-control', role: 'group', 'aria-label': 'Thème' },
          h('button', { type: 'button', className: theme === 'dark' ? 'active' : '', 'aria-pressed': theme === 'dark', title: 'Conserver le mode nuit', onClick: () => update({ theme: 'dark' }) }, 'Nuit'),
          h('button', { type: 'button', className: theme === 'light' ? 'active' : '', 'aria-pressed': theme === 'light', title: 'Activer le mode jour', onClick: () => update({ theme: 'light' }) }, 'Jour')
        )
      ),
      (favoriteCount > 0 || !isOnline) && h('div', { className: 'preference-group preference-offline-group' },
        h('div', null,
          h('strong', null, tc('Favoris hors-ligne')),
          h('small', null, isOnline
            ? `${favoriteCount} favori${favoriteCount > 1 ? 's' : ''} à préparer pour une consultation sans réseau.`
            : 'Connexion absente : les favoris déjà préchargés restent disponibles.')
        ),
        h(Button, {
          variant: 'subtle',
          disabled: offlineBusy || !favoriteCount || !isOnline,
          onClick: preloadFavoritesOffline,
          ariaLabel: 'Précharger les recettes favorites hors-ligne'
        }, offlineBusy ? t('offline.preparing') : 'Précharger'),
        preloadCatalogOffline && h(Button, {
          variant: 'subtle',
          disabled: offlineBusy || !isOnline,
          onClick: preloadCatalogOffline,
          ariaLabel: 'Préparer tout le catalogue hors-ligne'
        }, tc('Tout le catalogue')),
        offlineBusy && offlineProgress && h('div', { className: 'offline-progress-wrap' },
          h('progress', { max: Math.max(1, offlineProgress.total || 1), value: offlineProgress.completed || 0, 'aria-label': t('offline.progress', offlineProgress) }),
          h('small', null, t('offline.progress', offlineProgress))
        )
      ),
      // Journal technique local (erreurs, vitesse), app-journal.js.
      h('div', { className: 'preference-group preference-data-group' }, h(JournalBlock)),
      h('div', { className: 'preference-group preference-data-group' },
        h('div', { className: 'preference-data-copy' },
          h('strong', null, tc('Sauvegarde locale')),
          h('small', null, tc('Exporte ou restaure tes favoris, notes et listes de courses sur cet appareil.'))
        ),
        h('div', { className: 'preference-data-actions' },
          h(Button, { variant: 'subtle', onClick: exportLocalData, ariaLabel: 'Exporter les données locales' }, 'Exporter'),
          h('label', {
            className: 'btn btn-subtle',
            tabIndex: 0,
            role: 'button',
            'aria-label': 'Importer une sauvegarde locale',
            onKeyDown: event => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault();
              event.currentTarget.querySelector('input')?.click();
            }
          },
            'Importer',
            h('input', {
              type: 'file',
              accept: 'application/json,.json',
              className: 'sr-only',
              onChange: event => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (file) importLocalData?.(file);
              }
            })
          )
        )
      ),
    )
  );
}

function OfflineStatusBar({ isOnline, favoriteCount }) {
  if (isOnline) return null;
  return h('div', { className: 'offline-status-bar', role: 'status' },
    h(Icon, { name: 'download' }),
    h('span', null, favoriteCount
      ? `${favoriteCount} favori${favoriteCount > 1 ? 's' : ''} utilisable${favoriteCount > 1 ? 's' : ''} si déjà préchargé${favoriteCount > 1 ? 's' : ''}.`
      : 'Mode hors-ligne : les pages déjà ouvertes restent accessibles.')
  );
}

function ToastStack({ toasts, dismissToast }) {
  if (!toasts.length) return null;
  const toast = toasts[0];
  return h('div', { className: 'toast-stack', role: 'status', 'aria-live': 'polite' },
    h('button', {
      key: toast.id,
      type: 'button',
      className: `toast toast-${toast.tone || 'info'}`,
      onClick: () => dismissToast(toast.id),
      title: 'Fermer la notification',
      'aria-label': `Fermer la notification : ${toast.message}`
    },
      h('strong', null, toast.title || 'Cook Note'),
      h('span', null, toast.message)
    )
  );
}

function QuantityFactorControl({ recipe, factor, setFactor, className = '', stepper = false }) {
  const servingInfo = getServingInfo(recipe);
  const servingOptions = servingOptionsFor(recipe);
  // Bandeau de fiche : « − 8 parts + » (la liste deroulante native faisait
  // reglage systeme). Les pas suivent les memes valeurs que la liste.
  if (stepper && servingInfo && servingOptions.length) {
    const currentTarget = getServingTarget(recipe, factor);
    const index = servingOptions.reduce((best, value, position) => (
      Math.abs(value - currentTarget) < Math.abs(servingOptions[best] - currentTarget) ? position : best
    ), 0);
    const unitPlural = servingUnitLabel(servingInfo, 2);
    const go = next => setFactor(servingOptions[next] / servingInfo.base);
    return h('div', {
      className: ['factor-control serving-control quantity-stepper', className].filter(Boolean).join(' '),
      role: 'group',
      'aria-label': `Nombre de ${unitPlural}`
    },
      h('button', { type: 'button', className: 'quantity-step', disabled: index <= 0, onClick: () => go(index - 1), 'aria-label': `Moins de ${unitPlural}` }, '−'),
      h('span', { className: 'quantity-stepper-value', 'aria-live': 'polite' },
        h('strong', null, String(currentTarget)),
        h('span', null, servingUnitLabel(servingInfo, currentTarget))
      ),
      h('button', { type: 'button', className: 'quantity-step', disabled: index >= servingOptions.length - 1, onClick: () => go(index + 1), 'aria-label': `Plus de ${unitPlural}` }, '+')
    );
  }
  if (servingInfo && servingOptions.length) {
    const currentTarget = getServingTarget(recipe, factor);
    const labelText = servingInfo.unit === 'personne'
      ? 'Personnes'
      : servingInfo.unit === 'part'
        ? 'Parts'
        : 'Portions';
    return h('label', {
      className: ['factor-control serving-control quantity-select-control', className].filter(Boolean).join(' '),
      'aria-label': `Choisir le nombre de ${servingUnitLabel(servingInfo, 2)}`
    },
      h('span', { className: 'factor-label' }, labelText),
      h('select', {
        className: 'quantity-select',
        value: String(currentTarget),
        onChange: event => setFactor(Number(event.target.value) / servingInfo.base)
      },
        servingOptions.map(value => h('option', { key: value, value: String(value) }, String(value)))
      ),
      h('span', { className: 'quantity-unit' }, servingUnitLabel(servingInfo, currentTarget))
    );
  }

  return h('label', {
    className: ['factor-control quantity-select-control multiplier-select-control', className].filter(Boolean).join(' '),
    'aria-label': 'Multiplier les quantités'
  },
    h('span', { className: 'factor-label' }, tc('Quantité')),
    h('select', {
      className: 'quantity-select',
      value: String(factor),
      onChange: event => setFactor(Number(event.target.value))
    },
      [0.25, 0.5, 1, 2, 4].map(value => h('option', {
        key: value,
        value: String(value)
      }, `${String(value).replace('.', ',')}x`))
    ),
    h('span', { className: 'quantity-unit' }, tc('fois'))
  );
}

// Pages categorie : quatre saisons qui filtrent la grille (un second toucher
// remet toutes les recettes). La saison en cours est marquee d'un point.
function CollectionSeasonFilter({ items, recipesById, season, setSeason }) {
  if (!items.length) return null;
  const current = getCurrentSeason();
  return h('div', { className: 'collection-season-filter', role: 'group', 'aria-label': 'Filtrer les recettes par saison' },
    h('button', {
      key: 'all',
      type: 'button',
      className: season ? '' : 'active',
      'aria-pressed': !season,
      onClick: () => setSeason('')
    },
      h('span', { className: 'season-name' }, tc('Toutes')),
      h('span', { className: 'season-count' }, items.length)
    ),
    SEASONS.map(name => {
      const count = items.filter(item => recipeHasSeason(item, name, recipesById)).length;
      const active = season === name;
      return h('button', {
        key: name,
        type: 'button',
        className: [active ? 'active' : '', name === current ? 'is-current' : ''].filter(Boolean).join(' '),
        'aria-pressed': active,
        disabled: !count,
        title: name === current ? 'Saison actuelle' : undefined,
        onClick: () => setSeason(active ? '' : name)
      },
        h('span', { className: 'season-name' }, name),
        h('span', { className: 'season-count' }, count)
      );
    })
  );
}

function CollectionLinksPanel({ parent, variantRefs, recipesById, openRecipe, preloadRecipe = null, favorites = [], toggleFavorite = null, ensureCatalog = null }) {
  // Fiches completes (ingredients) pour les filtres de regime.
  useEffect(() => {
    if (typeof ensureCatalog === 'function') Promise.resolve(ensureCatalog()).catch(() => {});
  }, [parent.id]);
  const [season, setSeason] = useState('');
  const [family, setFamily] = useState('');
  const [sort, setSort] = useState('alpha');
  const [filter, setFilter] = useState('');
  const [diet, setDiet] = useState('');
  useEffect(() => {
    setSeason('');
    setFamily('');
    setDiet('');
    setSort('alpha');
    setFilter('');
  }, [parent.id]);
  const sortedVariantRefs = sortVariantRefs(variantRefs, recipesById);
  if (!sortedVariantRefs.length) return null;
  const recipeEntries = sortedVariantRefs
    .map(variant => ({ variant, item: recipesById[variant.id] }))
    .filter(entry => entry.item)
    .map(entry => ({ ...entry, family: collectionFamilyOf(parent.id, entry.item) }));
  // Sous-familles : chips seulement s'il y en a au moins deux remplies.
  const familyCounts = recipeEntries.reduce((counts, entry) => {
    if (entry.family) counts.set(entry.family, (counts.get(entry.family) || 0) + 1);
    return counts;
  }, new Map());
  const familyOrder = [...(COLLECTION_FAMILIES[parent.id] || []).map(([name]) => name), 'Autres'].filter(name => familyCounts.has(name));
  const showFamilies = familyOrder.length > 1;
  const needle = normalizeText(filter.trim());
  const totalMinutes = item => Number(item.activeTime || 0) + Number(item.cookTime || 0) + Number(item.restTime || 0);
  const visibleEntries = recipeEntries
    .filter(entry => !season || recipeHasSeason(entry.item, season, recipesById))
    .filter(entry => !family || entry.family === family)
    .filter(entry => !diet || getRecipeDiets(entry.item).includes(diet))
    .filter(entry => !needle || normalizeText([entry.variant.label, entry.item.title, ...(entry.item.tags || [])].join(' ')).includes(needle))
    .sort((left, right) => {
      if (sort === 'quick') return (totalMinutes(left.item) || 9999) - (totalMinutes(right.item) || 9999);
      if (sort === 'easy') return (left.item.difficultyScore ?? 99) - (right.item.difficultyScore ?? 99);
      return 0;
    });
  return h('section', { id: 'recipe-picker', className: 'recipe-panel variant-picker-panel collection-links-panel', 'aria-label': `Recettes de la collection ${parent.title}` },
    // Une seule barre de filtres, en trois rangs alignes : recherche et tri,
    // puis saison, puis famille (memes pastilles, meme hauteur).
    h('div', { className: 'collection-toolbar' },
      h('div', { className: 'collection-tools' },
        h('label', { className: 'collection-search' },
          h(Icon, { name: 'search' }),
          h('span', { className: 'sr-only' }, `Filtrer ${parent.title}`),
          h('input', { type: 'text', value: filter, placeholder: `Chercher dans ${parent.title.toLowerCase()}…`, onChange: event => setFilter(event.target.value) })
        ),
        // Tri en commande segmentee (trois choix courts, toujours visibles).
        h('div', { className: 'collection-sort', role: 'radiogroup', 'aria-label': 'Trier les recettes' },
          COLLECTION_SORTS.map(([value, label]) => h('button', {
            key: value,
            type: 'button',
            role: 'radio',
            'aria-checked': sort === value,
            className: sort === value ? 'active' : '',
            onClick: () => setSort(value)
          }, label))
        )
      ),
      h('div', { className: 'collection-filter-row' },
        h('span', { className: 'collection-filter-label' }, tc('Saison')),
        h(CollectionSeasonFilter, { items: recipeEntries.map(entry => entry.item), recipesById, season, setSeason })
      ),
      // Regime : vegetarien, vegan, sans gluten, sans lactose (deduits des
      // ingredients) ; rang masque tant que les fiches completes ne sont pas la.
      recipeEntries.some(entry => getRecipeDiets(entry.item).length) && h('div', { className: 'collection-filter-row' },
        h('span', { className: 'collection-filter-label' }, tc('Régime')),
        h('div', { className: 'collection-family-filter', role: 'group', 'aria-label': 'Régime alimentaire' },
          RECIPE_DIETS.map(item => {
            const count = recipeEntries.filter(entry => getRecipeDiets(entry.item).includes(item.id)).length;
            return count ? h('button', { key: item.id, type: 'button', className: diet === item.id ? 'active' : '', 'aria-pressed': diet === item.id, onClick: () => setDiet(diet === item.id ? '' : item.id) }, tc(item.label), h('span', null, count)) : null;
          })
        )
      ),
      showFamilies && h('div', { className: 'collection-filter-row' },
        h('span', { className: 'collection-filter-label' }, tc('Famille')),
        h('div', { className: 'collection-family-filter', role: 'group', 'aria-label': `Familles de ${parent.title}` },
          h('button', { type: 'button', className: family ? '' : 'active', 'aria-pressed': !family, onClick: () => setFamily('') }, 'Toutes', h('span', null, recipeEntries.length)),
          familyOrder.map(name => h('button', {
            key: name,
            type: 'button',
            className: family === name ? 'active' : '',
            'aria-pressed': family === name,
            onClick: () => setFamily(family === name ? '' : name)
          }, name, h('span', null, familyCounts.get(name))))
        )
      )
    ),
    h('div', { className: 'collection-result' },
      h('span', null, `${visibleEntries.length} recette${visibleEntries.length > 1 ? 's' : ''}`, visibleEntries.length !== recipeEntries.length && h('em', null, ` sur ${recipeEntries.length}`)),
      (season || family || filter || diet) && h('button', { type: 'button', onClick: () => { setSeason(''); setFamily(''); setFilter(''); setDiet(''); } }, 'Réinitialiser')
    ),
    !visibleEntries.length && h('p', { className: 'collection-empty' }, tc('Aucune recette avec ces filtres.')),
    h('div', { className: 'variant-card-grid' },
      visibleEntries.map(({ variant, item }) => {
        const image = displayRecipeImage(item) || displayRecipeImage(parent);
        const cardImage = image ? recipeCardImageUrl(image) : '';
        const variantLabel = getRecipeVariantLabel(item, recipesById);
        const favorite = favorites.includes(variant.id);
        return h('div', { key: variant.id, className: 'variant-card-shell' },
          toggleFavorite && h('button', {
            type: 'button',
            className: favorite ? 'variant-card-favorite active' : 'variant-card-favorite',
            'aria-pressed': favorite,
            'aria-label': favorite ? `Retirer ${item.title} des favoris` : `Ajouter ${item.title} aux favoris`,
            onClick: () => toggleFavorite(variant.id, item.title)
          }, h(Icon, { name: 'heart', filled: favorite })),
          h('button', {
            type: 'button',
            className: 'variant-card',
            'data-vt-card': '',
            onPointerEnter: () => warmRecipeOnIntent(preloadRecipe, variant.id, image),
            onFocus: () => warmRecipeOnIntent(preloadRecipe, variant.id, image),
            onTouchStart: () => warmRecipeOnIntent(preloadRecipe, variant.id, image),
            style: ambilightStyle(cardImage, { '--card-accent': getCategoryColor(item) }),
            'aria-label': `Ouvrir ${variant.label || item.title}`,
            onClick: () => openRecipe(variant.id)
          },
            cardImage && h('span', { className: 'variant-card-ambilight', 'aria-hidden': true }),
            image && h('span', { className: 'variant-card-bg', 'data-vt-media': variant.id, style: imageBackgroundStyle(image) }),
            h('span', { className: 'variant-card-body' },
              h('strong', { 'data-vt-title': variant.id }, variant.label || item.title),
              // Plus de pastille difficulte / temps (elle cachait l'image) :
              // le titre seul, en bas a gauche ; le compteur des familles reste.
              variantLabel && h('small', { className: 'variant-card-variant-count' }, variantLabel)
            )
          )
        );
      })
    )
  );
}

function RecipeBreadcrumb({ recipe, selectedRecipe, showVariants, goHome, openRecipe }) {
  const breadcrumbRecipe = showVariants ? recipe : (selectedRecipe || recipe);
  const category = primaryCategory(breadcrumbRecipe);
  const categoryParentId = CATEGORY_PARENT_IDS[category];
  const isRootParent = showVariants && !breadcrumbRecipe.master;
  const repeatsTitle = normalizeText(category) === normalizeText(breadcrumbRecipe.title);
  const openCategory = () => categoryParentId ? openRecipe(categoryParentId) : goHome();
  const openCurrentParent = () => openRecipe(breadcrumbRecipe.id);
  return h('nav', { className: 'recipe-breadcrumb', 'aria-label': 'Fil d’Ariane' },
    h('button', { type: 'button', onClick: goHome, 'aria-label': 'Retour au catalogue Cook Note', title: 'Retour au catalogue' }, tc('Cook Note')),
    h('span', null, '/'),
    !isRootParent && !repeatsTitle && h(React.Fragment, null,
      categoryParentId
        ? h('button', { type: 'button', onClick: openCategory, 'aria-label': `Ouvrir la catégorie ${category}`, title: `Ouvrir ${category}` }, category)
        : h('span', null, category),
      h('span', null, '/')
    ),
    isRootParent
      ? h('button', { type: 'button', onClick: openCurrentParent, 'aria-label': `Ouvrir ${breadcrumbRecipe.title}`, title: breadcrumbRecipe.title }, breadcrumbRecipe.title)
      : h('strong', { 'aria-current': 'page' }, breadcrumbRecipe.title)
  );
}

// Boite repliable d'"Avant de commencer" : fermee, seul le titre se lit (un
// apercu tronque faisait brouillon) ; le contenu s'ouvre au toucher.
function NotesDisclosure({ label, children, className = '', ariaLabel }) {
  return h('details', {
    className: ['notes-disclosure', className].filter(Boolean).join(' '),
    'aria-label': ariaLabel
  },
  h('summary', { className: 'notes-disclosure-summary' },
    h('span', { className: 'notes-disclosure-text' },
      h('span', { className: 'notes-disclosure-label' }, label)
    ),
    h('span', { className: 'notes-disclosure-icon', 'aria-hidden': true }, '\u2304')
  ),
  h('div', { className: 'notes-disclosure-body' }, children));
}

// Familles d'"Avant de commencer" : chaque bloc est range dans une seule famille.
const PRACTICAL_FAMILIES = Object.freeze({
  serve: Object.freeze(['pairings', 'plating', 'service']),
  keep: Object.freeze(['storage', 'reheating']),
  master: Object.freeze(['measures', 'tips', 'ingredientGuide', 'mistakes', 'result'])
});

function NotesFamily({ title, children, hidden = false, panelId }) {
  return h('section', { className: 'notes-family', 'aria-label': title, hidden, id: panelId, role: panelId ? 'tabpanel' : undefined },
    h('h3', { className: 'notes-family-title' }, title),
    children
  );
}

// Servir / Conserver / Maitriser en onglets : une famille a la fois au lieu
// d'une colonne de onze rubriques repliees. Les familles vides n'ont pas
// d'onglet ; a l'impression, tout s'affiche.
function NotesFamilyTabs({ resetKey, children }) {
  const families = React.Children.toArray(children).filter(Boolean);
  const titles = families.map(child => child.props.title);
  const containerRef = useRef(null);
  const [available, setAvailable] = useState(titles);
  const [active, setActive] = useState(titles[0]);
  // Nouvelle fiche : retour au premier onglet.
  useEffect(() => setActive(undefined), [resetKey]);
  // A chaque rendu (certains blocs arrivent apres le catalogue) : quelles
  // familles ont un contenu ? Etat inchange si rien ne bouge (pas de boucle).
  React.useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const filled = Array.from(container.querySelectorAll(':scope > .notes-family'))
      .filter(section => Array.from(section.children).some(node => !node.classList.contains('notes-family-title')))
      .map(section => section.getAttribute('aria-label'));
    setAvailable(previous => (previous.join('|') === filled.join('|') ? previous : filled));
    setActive(previous => (filled.includes(previous) ? previous : filled[0]));
  });
  const current = available.includes(active) ? active : available[0];
  const tabId = title => `notes-family-${normalizeText(title).replace(/[^a-z]+/g, '-')}`;
  return h('div', { ref: containerRef, className: 'notes-optional-stack notes-family-tabs' },
    available.length > 1 && h('div', { className: 'notes-family-tablist', role: 'tablist', 'aria-label': 'Conseils de la fiche' },
      available.map(title => h('button', {
        key: title,
        type: 'button',
        role: 'tab',
        'aria-selected': title === current,
        'aria-controls': tabId(title),
        className: title === current ? 'active' : '',
        onClick: () => setActive(title)
      }, title))
    ),
    families.map(child => React.cloneElement(child, {
      hidden: child.props.title !== current,
      panelId: tabId(child.props.title)
    }))
  );
}

function LinkedRecipesBlock({ links, openRecipe }) {
  const [expanded, setExpanded] = useState(false);
  const linkKey = links.map(item => item.id).join('|');
  useEffect(() => setExpanded(false), [linkKey]);
  if (!links.length) return null;
  const hasExtra = links.length > 3;
  const visibleLinks = hasExtra && !expanded ? links.slice(0, 3) : links;
  const hiddenCount = Math.max(0, links.length - 3);
  const groups = visibleLinks.reduce((acc, item) => {
    const role = item.role || 'Recette liée';
    if (!acc.has(role)) acc.set(role, []);
    acc.get(role).push(item);
    return acc;
  }, new Map());
  return h(NotesDisclosure, { className: 'linked-recipes-block', label: 'Recettes liées', ariaLabel: 'Recettes liées à cette fiche' },
    Array.from(groups.entries()).map(([role, items]) => h('div', { key: role, className: 'linked-recipe-group' },
      h('div', { className: 'linked-recipe-group-title' }, role),
      h('div', { className: 'linked-recipe-list', role: 'list' },
        items.map(item => h('button', {
          key: item.id,
          type: 'button',
          className: 'linked-recipe-item',
          role: 'listitem',
          style: { '--card-accent': getCategoryColor(item.recipe) },
          onClick: () => openRecipe(item.id),
          'aria-label': `Ouvrir ${item.recipe.title}, ${item.role || primaryCategory(item.recipe)}`
        },
          h('span', { className: 'linked-recipe-thumb', style: imageBackgroundStyle(displayRecipeImage(item.recipe)), 'aria-hidden': true }),
          h('span', { className: 'linked-recipe-copy' },
            h('small', null, primaryCategory(item.recipe)),
            h('strong', null, item.recipe.title)
          )
        ))
      )
    )),
    hasExtra && h('button', {
      type: 'button',
      className: expanded ? 'linked-recipe-toggle active' : 'linked-recipe-toggle',
      onClick: () => setExpanded(value => !value),
      'aria-expanded': expanded,
      'aria-label': expanded ? 'Masquer les recettes liees supplementaires' : `Afficher ${hiddenCount} recette${hiddenCount > 1 ? 's' : ''} liee${hiddenCount > 1 ? 's' : ''} supplementaire${hiddenCount > 1 ? 's' : ''}`
    }, expanded ? 'Masquer les recettes liées' : `Voir ${hiddenCount} autre${hiddenCount > 1 ? 's' : ''} recette${hiddenCount > 1 ? 's' : ''}`)
  );
}

const PRACTICAL_DISCLOSURE_LABELS = Object.freeze({
  measures: 'Mesures',
  tips: 'À savoir',
  pairings: 'Accords',
  ingredientGuide: 'Conversation ingrédients',
  plating: 'Dressage',
  service: 'Service',
  storage: 'Conservation',
  reheating: 'Réchauffage',
  mistakes: 'Erreurs à éviter',
  result: 'Résultat attendu'
});

function PracticalSectionsBlock({ sections, inlineTargets, openRecipe, techniqueTargets, openTechnique, hiddenKeys = [], onlyKeys = null }) {
  const hidden = new Set(hiddenKeys);
  const only = onlyKeys ? new Set(onlyKeys) : null;
  const visibleSections = sections.filter(section => !hidden.has(section.key) && (!only || only.has(section.key)));
  if (!visibleSections.length) return null;
  return h('div', { className: 'practical-block' },
    visibleSections.map(section => h(NotesDisclosure, {
      key: section.key,
      className: 'practical-section',
      label: PRACTICAL_DISCLOSURE_LABELS[section.key] || section.title,
      ariaLabel: section.title
    },
      h('ul', null, section.items.map(item => h('li', { key: item }, renderLinkedText(item, inlineTargets || [], openRecipe, techniqueTargets || [], openTechnique))))
    ))
  );
}

function FlavorMapBlock({ recipe }) {
  const items = getRecipeFlavorMap(recipe);
  if (!items.length) return null;
  return h(NotesDisclosure, { className: 'flavor-map-block', label: 'Accords', ariaLabel: 'Accords de la recette' },
    h('div', { className: 'flavor-map-grid' },
      items.map(item => h('article', { key: item.key, className: 'flavor-node' },
        h('div', { className: 'flavor-node-head' },
          h('strong', null, item.label),
          h('small', null, item.profile)
        ),
        item.matches.length > 0 && h('div', { className: 'flavor-pairs' },
          item.matches.slice(0, 4).map(pair => h('span', { key: `${item.key}:${pair.label}`, title: pair.reason }, pair.label))
        ),
        item.suggestions.length > 0 && h('small', { className: 'flavor-suggestion' }, `A tenter: ${item.suggestions.slice(0, 2).join(', ')}`),
        item.boosters.length > 0 && h('small', { className: 'flavor-boosters' }, `Finition: ${item.boosters.slice(0, 2).join(', ')}`)
      ))
    )
  );
}

function IngredientKnowledgeBlock({ recipe }) {
  const cards = getRecipeIngredientCards(recipe);
  if (!cards.length) return null;
  return h(NotesDisclosure, { className: 'ingredient-knowledge-block', label: 'Conversation ingrédients', ariaLabel: 'Conversation ingrédients' },
    h('div', { className: 'ingredient-knowledge-grid' },
      cards.map(card => h('article', { key: card.label, className: 'ingredient-knowledge-card' },
        h('div', null,
          h('strong', null, card.label)
        ),
        h('p', null, card.storage),
        h('dl', null,
          h('dt', null, tc('Vigilance')),
          h('dd', null, card.avoid)
        )
      ))
    )
  );
}

function PrepTimelineBlock({ recipe }) {
  const items = getPrepTimeline(recipe);
  if (!items.length) return null;
  return h(NotesDisclosure, { className: 'prep-timeline-block', label: 'Organisation', ariaLabel: 'Organisation de la préparation' },
    h('ol', null, items.map(item => h('li', { key: item.label },
      h('strong', null, item.label),
      h('span', null, item.value)
    )))
  );
}

function RecipeQuickFacts({ recipe, factor, stepTotal, needsVariantSelection = false, hasVariantSelection = true }) {
  if (needsVariantSelection && !hasVariantSelection) {
    return h('section', { className: 'recipe-summary-panel recipe-summary-empty', 'aria-label': 'Résumé de la recette' },
      h('div', { className: 'recipe-summary-head' },
        h('h2', null, tc('Fiche rapide'))
      ),
      h('p', { className: 'recipe-summary-message' }, tc('Sélectionne une variante pour afficher les informations de la fiche rapide.'))
    );
  }
  const equipment = getRecipeEquipment(recipe);
  const timing = getRecipeTiming(recipe);
  // Lecture chef : uniquement les conseils ecrits pour cette fiche. Les phrases
  // deduites automatiquement (« Servir tiede… », « Prevoir le temps de
  // repos… ») etaient fausses pour une partie des recettes.
  const chefNotes = asTextList(recipe?.service || recipe?.practical?.service).slice(0, 3);
  const facts = [
    // Total reel : les etapes faites pendant une cuisson ou un repos ne s'ajoutent pas.
    timing.total && { label: timing.overlap ? 'Total réel' : 'Total', value: formatTotalDuration(timing.total, timing.rest) },
    { label: 'Actif', value: formatMinutesShort(timing.active) || 'À estimer' },
    timing.cook && { label: 'Cuisson', value: formatMinutesShort(timing.cook) },
    timing.rest && { label: 'Repos', value: formatMinutesShort(timing.rest) },
  ].filter(Boolean);
  return h('section', { className: 'recipe-summary-panel', 'aria-label': 'Résumé de la recette' },
    h('div', { className: 'recipe-summary-head' },
      h('h2', null, tc('Fiche rapide'))
    ),
    h('div', { className: `recipe-quick-facts fact-count-${facts.length}` },
      facts.map(item => h('div', { key: item.label, className: 'recipe-quick-fact' },
        h('span', null, item.label),
        h('strong', null, item.value)
      ))
    ),
    chefNotes.length > 0 && h('div', { className: 'recipe-chef-strip', 'aria-label': 'Lecture chef de la recette' },
      h('strong', null, tc('Lecture chef')),
      h('ul', null, chefNotes.map(item => h('li', { key: item }, item)))
    ),
    equipment.length > 0 && h('div', { className: 'recipe-equipment-strip' },
      h('strong', null, tc('Matériel nécessaire')),
      h('ul', null, equipment.map(item => h('li', { key: item }, item)))
    )
  );
}

function RecipeAnatomy({ recipe, variantOptions = [], selectedIndex, onSelectVariant }) {
  // Fiche a variantes : le bandeau devient le selecteur, aligne sur la grille,
  // pour changer de variante sans remonter jusqu'aux cartes de choix.
  if (variantOptions.length > 1 && typeof onSelectVariant === 'function') {
    return h('nav', { className: 'recipe-anatomy recipe-variant-switch', 'aria-label': 'Changer de variante' },
      h('span', { className: 'recipe-variant-switch-label' }, tc('Variante')),
      h('div', { className: 'recipe-variant-switch-tabs', role: 'group' },
        variantOptions.map(option => {
          const active = option.index === selectedIndex;
          return h('button', {
            key: `${recipe.id}:switch:${option.index}`,
            type: 'button',
            className: active ? 'active' : '',
            'aria-pressed': active,
            'aria-controls': 'recipe-detail-content',
            onClick: () => onSelectVariant(option.index)
          }, cleanVariantGroupLabel(option.label || option.group?.group || 'Variante'));
        })
      )
    );
  }
  const timing = getRecipeTiming(recipe);
  const groups = (recipe.ingredients || [])
    .map(group => cleanVariantGroupLabel(group.group || ''))
    .filter(Boolean);
  const stages = groups.length > 1
    ? [...new Set(groups)].slice(0, 4)
    : ['Pr\u00e9paration', timing.cook ? 'Cuisson' : '', timing.rest ? 'Repos' : '', 'Finition'].filter(Boolean);
  if (stages.length < 2) return null;
  // Deroule de la fiche, nomme comme tel ; avec des groupes d'ingredients,
  // chaque etape mene a son groupe dans la liste.
  const jumpToGroup = index => {
    const target = document.querySelectorAll('.ingredients-panel .ingredient-group')[index];
    if (target && target.offsetParent) target.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };
  return h('ol', { className: 'recipe-anatomy', 'aria-label': 'Déroulé de la recette' },
    h('li', { className: 'recipe-anatomy-label', 'aria-hidden': true }, tc('Déroulé')),
    stages.map((stage, index) => h('li', { key: `${stage}:${index}` },
      groups.length > 1
        ? h('button', { type: 'button', onClick: () => jumpToGroup(index), title: `Aller aux ingrédients : ${stage}` },
          h('span', { 'aria-hidden': true }, String(index + 1).padStart(2, '0')),
          h('strong', null, stage)
        )
        : [
          h('span', { key: 'n', 'aria-hidden': true }, String(index + 1).padStart(2, '0')),
          h('strong', { key: 's' }, stage)
        ]
    ))
  );
}

function cleanVariantGroupLabel(label) {
  return String(label || 'Variante').replace(/^\d+\)\s*/, '').replace(/^variante\s*:?\s*/i, '').trim();
}

function InlineVariantPicker({ recipe, options, selectedIndex, onSelect }) {
  if (!options.length) return null;
  const optionDetails = options.map((option, position) => {
    const optionRecipe = buildInlineVariantRecipe(recipe, option);
    return {
      ...option,
      position,
      ingredientCount: countIngredients(optionRecipe),
      stepCount: getRecipeSteps(optionRecipe).length
    };
  });
  const selectedOption = optionDetails.find(option => option.index === selectedIndex) || null;

  return h('section', { className: 'recipe-panel variant-choice-panel', 'aria-label': 'Choix de variante' },
    h('div', { className: 'variant-choice-header' },
      h('div', { className: 'variant-choice-heading' },
        h('p', { className: 'eyebrow' }, tc('Variante')),
        h('h2', null, tc('Choisis une variante')),
        h('p', { className: 'variant-choice-description' },
          'Chaque choix ouvre une recette compl\u00e8te avec ses propres ingr\u00e9dients, \u00e9tapes, quantit\u00e9s et conseils.'
        )
      )
    ),
    h('div', { className: 'variant-choice-tabs', role: 'group', 'aria-label': 'Variantes disponibles' },
      optionDetails.map(option => {
        const active = Boolean(selectedOption) && option.index === selectedOption.index;
        const image = inlineVariantImage(recipe, option);
        return h('button', {
          key: `${recipe.id}:variant:${option.index}`,
          type: 'button',
          className: `variant-choice-button${image ? ' has-image' : ''}${active ? ' active' : ''}`,
          style: image ? { '--variant-choice-image': cssImageValue(image) } : {},
          onClick: () => onSelect(option.index),
          'aria-pressed': active,
          'aria-controls': 'recipe-detail-content'
        },
          h('span', { className: 'variant-choice-card-top' },
            h('span', { className: 'variant-choice-number' }, `Choix ${option.position + 1}`),
            h('span', { className: 'variant-choice-state' },
              active ? [h('span', { key: 'check', 'aria-hidden': true }, '\u2713'), 'S\u00e9lectionn\u00e9e'] : 'S\u00e9lectionner'
            )
          ),
          h('strong', { className: 'variant-choice-title' }, option.label || 'Variante'),
          h('span', { className: 'variant-choice-meta' },
            h('span', null, `${option.ingredientCount} ingr\u00e9dients`),
            h('span', null, `${option.stepCount} \u00e9tapes`)
          )
        );
      })
    )
  );
}

function RecipeDetailLoadingState() {
  const panelStyle = {
    width: 'calc(100% - 32px)',
    maxWidth: 1240,
    margin: '16px auto 0',
    minHeight: 180,
    display: 'grid',
    placeItems: 'center',
    gap: 8,
    padding: 28,
    textAlign: 'center',
    borderColor: 'color-mix(in srgb,var(--accent) 32%,var(--line))',
    borderRadius: 'var(--cn-panel-radius)',
    background: 'var(--surface-strong)',
    boxShadow: 'var(--ds-shadow-1)'
  };
  const markStyle = {
    width: 136,
    height: 8,
    borderRadius: 'var(--ds-radius-pill)',
    background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent),color-mix(in srgb,var(--accent) 16%,rgba(255,255,255,.06))',
    backgroundSize: '220% 100%',
    animation: 'skeletonSweep 1.3s var(--ds-ease) infinite'
  };
  return h('section', { className: 'recipe-panel recipe-detail-loading', style: panelStyle, role: 'status', 'aria-live': 'polite' },
    h('span', { className: 'recipe-detail-loading-mark', style: markStyle, 'aria-hidden': true }),
    h('h2', null, t('recipe.loadingTitle')),
    h('p', null, t('recipe.loadingDescription'))
  );
}


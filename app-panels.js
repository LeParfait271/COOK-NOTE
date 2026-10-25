function SearchPanel({ open, onClose, query, resultQuery, setQuery, searchRef, results, resultMeta, ingredientMeta, openRecipe, rememberSearch }) {
  const [draftQuery, setDraftQuery] = useState(query);
  const draftQueryRef = useRef(query);
  const queryCommitTimerRef = useRef(0);

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
    { label: 'Au four', query: 'cuisson au four' },
    { label: 'Dessert', query: 'dessert' }
  ];
  const liveSuggestions = hasQuery && !searchPending ? searchSuggestionTerms(draftQuery, results) : [];
  const rememberCurrentSearch = () => {
    if (draftQuery.trim()) rememberSearch?.(draftQuery);
  };
  const openSearchRecipe = recipe => {
    rememberCurrentSearch();
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
         h('h2', null, 'Rechercher'),
        h('button', { type: 'button', className: 'icon-btn', onClick: closeSearch, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('div', { className: 'field search-modal-field' },
        h('label', { className: 'sr-only', htmlFor: 'recipe-search-input' }, 'Rechercher une recette'),
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
          placeholder: 'Recette, ingrédients, usage, saison...'
        })
      ),
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
        quickSearches.map(item => h('button', {
          key: item.query,
          type: 'button',
          onClick: () => {
            updateDraftQuery(item.query, true);
            rememberSearch?.(item.query);
          }
        }, item.label))
      ),
      !hasQuery && h('p', { className: 'search-empty-state' }, 'Saisissez un plat, un ingrédient ou une envie.'),
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
                const meta = resultMeta.get(recipe.id);
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
                    meta?.reasons?.length && h('span', { className: 'search-reason-pills' },
                      meta.reasons.slice(0, 3).map(reason => h('em', { key: reason }, reason))
                    ),
                    ingredient?.matched?.length && h('span', { className: 'search-reason-pills' },
                      ingredient.matched.slice(0, 3).map(reason => h('em', { key: reason }, reason))
                    ),
                    ingredient?.missing?.length > 0 && h('small', { className: 'ingredient-missing' }, `Manque peut-être : ${ingredient.missing.slice(0, 2).join(', ')}`)
                  ),
                  h('span', { className: `nutri-score nutri-${getNutriScore(recipe).toLowerCase()}` }, `Nutri ${getNutriScore(recipe)}`)
                );
              })
            )
          ))
        )
        : h('div', { className: 'empty-state search-empty', style: { justifyItems: 'center', textAlign: 'center' } },
          h('span', { className: 'empty-state-mark', 'aria-hidden': true, style: { display: 'grid', placeItems: 'center', width: 42, height: 42, border: '1px solid color-mix(in srgb,var(--accent) 52%,var(--line))', borderRadius: '999px', background: 'color-mix(in srgb,var(--accent) 12%,var(--surface-soft))' } }, h(Icon, { name: 'search' })),
          h('h2', null, 'Aucun résultat'),
          h('p', null, 'Essaie un ingrédient, une catégorie ou un mot proche.')
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
  const matchedActions = normalizedTerm ? [] : baseActions;
  const commandRecipes = normalizedTerm
    ? recipes
      .map(recipe => {
        const titleScore = normalizeText(recipe.title).includes(normalizedTerm) ? 24 : 0;
        const categoryScore = normalizeText(categoryLine(recipe)).includes(normalizedTerm) ? 8 : 0;
        const textMeta = scoreRecipeSearch(recipe, cleanScoringTerm, recipesById);
        const ingredient = scoreIngredientSearch(recipe, cleanScoringTerm);
        return {
          recipe,
          score: titleScore + categoryScore + textMeta.score + ingredient.score,
          reason: ingredient.matched?.[0] || textMeta.reasons?.[0] || categoryLine(recipe)
        };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score || a.recipe.title.localeCompare(b.recipe.title, 'fr'))
      .slice(0, 7)
    : [];
  const firstCommand = commandRecipes[0] || matchedActions[0];
  const runRecipe = recipe => {
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
        h('label', { className: 'sr-only', htmlFor: 'cook-note-command-input' }, 'Commande ou recette'),
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
          placeholder: (compactCommandInput ? 'Rechercher…' : 'Commande, recette, ingr\u00e9dient...')
        }),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('h2', { className: 'command-title' }, (cleanTerm ? 'Résultats' : 'Rechercher')),
      h('div', { className: 'command-sections' },
        !cleanTerm && h('section', { className: 'command-section' },
          h('div', { className: 'command-section-head' },
              h('strong', null, 'Accès rapides')
          ),
          h('div', { className: 'command-action-grid' },
            matchedActions.map(action => h('button', {
              key: action.id,
              type: 'button',
              className: 'command-row',
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
                h('strong', null, 'Recherche complète'),
                h('small', null, cleanTerm || 'Catalogue')
              )
            )
          )
        ),
        cleanTerm && h('section', { className: 'command-section' },
          h('div', { className: 'command-section-head' },
            h('strong', null, 'Recettes'),
            h('button', { type: 'button', onClick: openSearchWithTerm }, 'Recherche complète')
          ),
          commandRecipes.length
            ? h('div', { className: 'command-recipe-list' },
              commandRecipes.map(({ recipe, reason }) => h('button', {
                key: recipe.id,
                type: 'button',
                className: 'command-recipe-row',
                onClick: () => runRecipe(recipe)
              },
                h('span', { className: 'command-recipe-image', style: imageBackgroundStyle(displayRecipeImage(recipe)) }),
                h('span', { className: 'command-row-copy' },
                  h('strong', null, recipe.title),
                  h('small', null, reason || difficultyText(recipe))
                ),
                h('span', { className: `nutri-score nutri-${getNutriScore(recipe).toLowerCase()}` }, `Nutri ${getNutriScore(recipe)}`)
              ))
            )
            : h('div', { className: 'command-empty' },
              h('strong', null, 'Aucune fiche directe'),
              h('p', null, 'La recherche complète prendra le relais.')
            )
        )
      )
    )
  );
}
function shoppingOutputNodes(value) {
  return String(value || '').split('\n').map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return h('br', { key: `space-${index}`, 'aria-hidden': true });
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      return h(level === 1 ? 'h3' : 'h4', { key: `heading-${index}`, className: `cart-output-heading cart-output-heading-${level}` }, heading[2]);
    }
    const bullet = trimmed.match(/^-\s+(.+)$/);
    if (bullet) {
      return h('div', { key: `bullet-${index}`, className: 'cart-output-line' },
        h('span', { className: 'cart-output-bullet', 'aria-hidden': true }, '\u2022 '),
        bullet[1]
      );
    }
    return h('div', { key: `line-${index}`, className: 'cart-output-line' }, line);
  });
}

function ShoppingTransferQr({ url }) {
  const canvasRef = useRef(null);
  const [qrReady, setQrReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setQrReady(false);
    if (!url || !canvasRef.current) return () => {
      cancelled = true;
    };
    loadDeferredScript(QR_CODE_SCRIPT_SRC, 'QRCode').then(QRCode => {
      if (cancelled || !canvasRef.current || !QRCode?.toCanvas) return null;
      return QRCode.toCanvas(canvasRef.current, url, {
        width: 196,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#111111', light: '#ffffff' }
      });
    }).then(result => {
      if (!cancelled && result !== null) setQrReady(true);
    }).catch(() => {
      if (!cancelled) setQrReady(false);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return h('div', { className: 'shopping-transfer', role: 'region', 'aria-label': 'Envoyer la liste sur un autre appareil' },
    h('div', { className: qrReady ? 'share-qr is-ready' : 'share-qr' },
      h('canvas', { ref: canvasRef, className: 'qr-canvas', width: 196, height: 196, 'aria-label': 'QR code de la liste de courses' }),
      !qrReady && h('span', null, 'Préparation…')
    ),
    h('p', null, 'Scanne ce code avec l’appareil photo du téléphone : la liste s’ouvre dans Cook Note, prête pour le magasin.')
  );
}

function ShoppingBasketPanel({ open, onClose, recipes, factorById, transferUrl = '', pantryItems = [], removeRecipe, clearShopping, notify }) {
  // Accessibility contracts retained for the UI audit: 'aria-label': `Retirer ${recipe.title} du panier courses`; 'aria-label': `${checked ? 'Décocher' : 'Cocher'} ${[amount, item.name].filter(Boolean).join(' ')}`; 'aria-label': `Marquer ${item.name} comme déjà à la maison`; 'aria-label': `Remettre ${item.name} dans la liste à acheter`.
  const [copied, setCopied] = useState(false);
  const [freshOnly, setFreshOnly] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState(() => readJson(STORAGE_KEYS.shoppingChecked, {}));
  const [ownedItems, setOwnedItems] = useState(() => readJson(STORAGE_KEYS.shoppingOwned, {}));
  const shoppingData = useMemo(() => open ? buildShoppingListData(recipes, factorById) : EMPTY_SHOPPING_DATA, [open, recipes, factorById]);
  const activeShoppingData = useMemo(() => open ? filterShoppingListData(shoppingData, ownedItems, pantryItems) : EMPTY_SHOPPING_DATA, [open, shoppingData, ownedItems, pantryItems]);
  const scopedShoppingData = useMemo(() => freshOnly ? filterFreshShoppingData(activeShoppingData) : activeShoppingData, [freshOnly, activeShoppingData]);
  const batchPlan = useMemo(() => open ? getBatchPlanData(recipes) : [], [open, recipes]);
  const rawText = open && recipes.length
    ? freshOnly ? shoppingListTextFromData(scopedShoppingData, 'fresh') : shoppingListText(recipes, factorById, ownedItems, 'detailed', pantryItems)
    : 'Liste de courses Cook Note\n\nAucune recette cochée.';
  const text = rawText;
  const rawCompactText = open && recipes.length
    ? freshOnly ? shoppingListTextFromData(scopedShoppingData, 'fresh') : shoppingListText(recipes, factorById, ownedItems, 'compact', pantryItems)
    : 'Courses Cook Note\nAucune recette.';
  const compactText = rawCompactText;
  const visibleShoppingKeys = useMemo(() => new Set(shoppingData.groupedItems.map(item => item.key)), [shoppingData]);
  const checkedCount = scopedShoppingData.groupedItems.filter(item => checkedItems[item.key]).length;
  const handledCount = checkedCount + scopedShoppingData.ownedGroupedItems.length;
  const totalShoppingCount = scopedShoppingData.groupedItems.length + scopedShoppingData.ownedGroupedItems.length;
  const handledRatio = totalShoppingCount ? Math.round((handledCount / totalShoppingCount) * 100) : 0;
  const freshAisleCount = scopedShoppingData.aisleGroups
    .filter(group => /primeur|cremerie|oeufs|boucherie|poissonnerie/.test(normalizeText(group.label)))
    .reduce((total, group) => total + group.items.length, 0);
  const topAisles = scopedShoppingData.aisleGroups.slice(0, 4).map(group => group.label);
  const setShoppingChecked = updater => {
    setCheckedItems(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      writeJson(STORAGE_KEYS.shoppingChecked, next);
      return next;
    });
  };
  const shareText = () => {
    if (navigator.share) {
      navigator.share({ title: 'Liste de courses Cook Note', text }).then(() => notify?.('Partage de la liste ouvert')).catch(() => {});
    } else {
      copyText(text).then(() => {
        setCopied(true);
        notify?.('Liste de courses copiée');
      });
    }
  };
  const setOwnedShoppingItems = updater => {
    setOwnedItems(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      writeJson(STORAGE_KEYS.shoppingOwned, next);
      return next;
    });
  };
  const toggleOwnedItem = key => {
    setOwnedShoppingItems(prev => {
      const next = { ...(prev || {}) };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };

  useEffect(() => {
    if (open) setCopied(false);
  }, [open, recipes.length]);

  useEffect(() => {
    if (!open) return;
    setShoppingChecked(prev => {
      const next = {};
      Object.entries(prev || {}).forEach(([key, value]) => {
        if (visibleShoppingKeys.has(key) && value) next[key] = true;
      });
      return next;
    });
  }, [open, visibleShoppingKeys]);

  if (!open) return null;
  return h(ModalDialog, { className: '', onClose: onClose },
    h('section', { className: 'modal-panel shopping-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'shopping-modal-title', tabIndex: -1, onKeyDown: trapModalFocus, onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null,
          h('p', { className: 'eyebrow' }, 'Panier courses'),
          h('h2', { id: 'shopping-modal-title' }, (recipes.length ? `${recipes.length} recette${recipes.length > 1 ? 's' : ''} cochée${recipes.length > 1 ? 's' : ''}` : 'Aucune recette'))
        ),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      recipes.length
        ? h('div', { className: 'shopping-picked' },
            recipes.map(recipe => h('button', {
              key: recipe.id,
              type: 'button',
              onClick: () => removeRecipe(recipe.id),
              title: 'Retirer du panier courses',
              'aria-label': ('Retirer ' + recipe.title + ' du panier courses')
            }, recipe.title, h('span', null, '×')))
          )
        : h('p', { className: 'muted' }, 'Ajoute une recette depuis sa fiche pour construire une liste groupée.'),
      recipes.length > 0 && h('div', { className: 'shopping-summary' },
        h('span', null, `${scopedShoppingData.groupedItems.length} à acheter`),
        scopedShoppingData.ownedGroupedItems.length > 0 && h('span', null, `${scopedShoppingData.ownedGroupedItems.length} déjà maison`),
        h('span', null, `${checkedCount} coché${checkedCount > 1 ? 's' : ''}`),
        h('button', {
          type: 'button',
          className: freshOnly ? 'active' : '',
          'aria-pressed': freshOnly,
          onClick: () => setFreshOnly(value => !value)
        }, (freshOnly ? 'Tout afficher' : 'Frais seulement')),
        checkedCount > 0 && h('button', { type: 'button', onClick: () => setShoppingChecked({}), 'aria-label': `Tout décocher (${checkedCount} article${checkedCount > 1 ? 's' : ''})` }, 'Tout décocher')
      ),
      recipes.length > 0 && h('div', { className: 'shopping-store-dashboard', style: { '--shopping-progress': `${handledRatio}%` }, 'aria-label': 'Synthèse magasin' },
        h('div', { className: 'shopping-store-score' },
          h('span', { 'aria-hidden': true }, h('span', null)),
          h('strong', null, `${handledRatio}%`),
        h('small', null, 'traité')
        ),
        h('div', { className: 'shopping-store-metrics' },
          h('span', null, h('strong', null, scopedShoppingData.aisleGroups.length), h('small', null, 'rayons')),
          h('span', null, h('strong', null, freshAisleCount), h('small', null, 'frais')),
          h('span', null, h('strong', null, topAisles.length ? topAisles.join(' / ') : 'Aucun'), h('small', null, 'trajet'))
        )
      ),
      recipes.length > 0 && scopedShoppingData.smartGroups.length > 0 && h('div', { className: 'shopping-smart-groups' },
        scopedShoppingData.smartGroups.map(group => h('span', { key: group.label }, group.label + ': ' + group.items.map(item => item.name).join(', ')))
      ),
      recipes.length > 1 && batchPlan.length > 0 && h('div', { className: 'batch-plan' },
        h('div', { className: 'batch-plan-head' },
          h('p', { className: 'eyebrow' }, 'Batch'),
          h('h3', null, 'Ordre de pr\u00e9paration')
        ),
        batchPlan.map(group => h('section', { key: group.key },
          h('strong', null, group.label),
          h('ul', null, group.items.map(item => h('li', { key: item }, item)))
        ))
      ),
      recipes.length > 0 && h('div', { className: 'shopping-aisles-shell' },
        h('div', { className: 'shopping-aisles' },
        scopedShoppingData.aisleGroups.map(group => h('section', { key: group.label, className: 'shopping-aisle' },
          h('div', { className: 'shopping-aisle-head' },
            h('strong', null, group.label),
            h('span', null, `${group.items.length} article${group.items.length > 1 ? 's' : ''}`)
          ),
          group.items.map(item => {
            const checked = Boolean(checkedItems[item.key]);
            const amount = formatShoppingAmount(item);
            const displayName = item.name;
            return h('label', { key: item.key, className: checked ? 'shopping-line checked' : 'shopping-line' },
              h('input', {
                type: 'checkbox',
                checked,
                'aria-label': `${checked ? 'Décocher' : 'Cocher'} ${[amount, displayName].filter(Boolean).join(' ')}`,
                onChange: () => setShoppingChecked(prev => ({ ...prev, [item.key]: !prev[item.key] }))
              }),
              h('span', { className: 'shopping-line-main' },
                amount && h('strong', null, amount),
                h('span', null, item.name),
                item.purchaseHint && h('em', null, item.purchaseHint)
              ),
              h('small', null, item.recipeNames.join(', ')),
              h('button', { type: 'button', className: 'shopping-owned-btn', onClick: event => {
                event.preventDefault();
                toggleOwnedItem(item.key);
              }, 'aria-label': ('Marquer ' + displayName + ' comme déjà à la maison'), title: 'Marquer comme déjà à la maison' }, 'J’ai déjà')
            );
          })
        ))
        )
      ),
      recipes.length > 0 && freshOnly && scopedShoppingData.groupedItems.length === 0 && scopedShoppingData.ownedGroupedItems.length === 0 && h('div', { className: 'empty-state shopping-empty' },
        h('h2', null, 'Aucun achat frais'),
        h('p', null, 'Les recettes cochées sont couvertes par les rayons secs ou par ce qui est déjà à la maison.')
      ),
      scopedShoppingData.ownedGroupedItems.length > 0 && h('div', { className: 'shopping-owned-list' },
        h('strong', null, 'Déjà à la maison'),
        scopedShoppingData.ownedGroupedItems.map(item => item.ownedByPantry
          ? h('span', { key: item.key, title: 'Déjà à la maison' }, `${[formatShoppingAmount(item), item.name].filter(Boolean).join(' ')} · maison`)
          : h('button', { key: item.key, type: 'button', onClick: () => toggleOwnedItem(item.key), 'aria-label': ('Remettre ' + item.name + ' dans la liste à acheter'), title: 'Remettre dans la liste' }, `${[formatShoppingAmount(item), item.name].filter(Boolean).join(' ')}`))
      ),
      h('div', { className: 'cart-output combined-cart', role: 'region', 'aria-label': 'Détail de la liste de courses' }, shoppingOutputNodes(text)),
      h('div', { className: 'modal-actions' },
        h(Button, { variant: 'primary', disabled: !recipes.length, onClick: () => copyText(text).then(() => {
          setCopied(true);
          notify?.('Liste de courses copiée');
        }) }, (copied ? 'Copié' : 'Copier la liste complète')),
        h(Button, { variant: 'subtle', disabled: !recipes.length, onClick: () => copyText(compactText).then(() => {
          setCopied(true);
          notify?.('Liste compacte copiée');
        }) }, 'Copier compact'),
        h(Button, { variant: 'ghost', className: 'icon-square', disabled: !recipes.length, onClick: shareText, title: 'Partager la liste', ariaLabel: 'Partager la liste' }, h(Icon, { name: 'share' })),
        h(Button, { variant: 'ghost', className: 'icon-square', disabled: !recipes.length, onClick: () => window.print(), title: 'Imprimer la liste', ariaLabel: 'Imprimer la liste' }, h(Icon, { name: 'print' })),
        h(Button, { variant: 'subtle', disabled: !recipes.length || !transferUrl, onClick: () => setTransferOpen(value => !value), pressed: transferOpen, title: 'Afficher un QR code pour ouvrir la liste sur le téléphone' }, transferOpen ? 'Masquer le QR code' : 'Sur mon téléphone'),
        h(Button, { variant: 'subtle', disabled: !recipes.length, onClick: clearShopping }, 'Vider le panier')
      ),
      transferOpen && recipes.length > 0 && transferUrl && h(ShoppingTransferQr, { url: transferUrl })
    )
  );
}

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
  const menuQuality = Number.isFinite(menu.quality) ? Math.max(0, Math.min(100, menu.quality)) : 0;
  const menuQualityLabel = menuQuality >= 86 ? 'Service fluide'
    : menuQuality >= 74 ? 'Accord solide'
      : menuQuality >= 60 ? 'Menu correct'
        : 'A affiner';
  const menuRoleLine = menuItems.map(item => item.label).filter(Boolean).join(' / ');
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
          h('p', { className: 'eyebrow' }, 'Mode menu'),
          h('h2', { id: 'menu-planner-title' }, 'Composer un repas')
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
          h('span', { className: 'factor-label' }, 'Personnes'),
          h('select', {
            className: 'quantity-select',
            value: String(peopleCount),
            'aria-label': 'Nombre de personnes du menu',
            onChange: event => setPeopleCount(Number(event.target.value))
          },
            [1, 2, 3, 4, 5, 6, 8, 10, 12].map(value => h('option', { key: value, value: String(value) }, String(value)))
          ),
          h('span', { className: 'quantity-unit' }, peopleCount > 1 ? 'personnes' : 'personne')
        ),
        h('span', { className: 'menu-serving-hint' }, 'Les quantités du menu et des courses suivent ce nombre.')
      ),
      h('p', { className: 'menu-planner-reason' }, menu.reason),
      h('div', { className: 'menu-quality-band', style: { '--menu-quality': `${menuQuality}%` }, 'aria-label': 'Qualité du menu' },
        h('div', { className: 'menu-quality-score' },
          h('span', null, h('span', null)),
          h('strong', null, `${menuQuality || '--'}/100`),
          h('small', null, menuQualityLabel)
        ),
        h('div', { className: 'menu-quality-copy' },
          h('strong', null, menu.theme?.pitch || 'Menu équilibré.'),
          h('small', null, menuRoleLine || 'Rôles à composer')
        )
      ),
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
        Number.isFinite(menu.quality) && h('span', null, `Cohérence ${menu.quality}/100`),
        h('span', null, `Charge ${servicePlan.stress.level}`),
        h('span', null, `${menuRecipes.length} fiches`),
        h('span', null, `${shoppingData.groupedItems.length} articles groupés`),
        h('span', null, `${shoppingData.aisleGroups.length} rayons`)
      ),
      h('div', { className: 'menu-service-grid' },
        servicePlan.timeline.length > 0 && h('section', { className: 'menu-service-panel menu-service-panel-wide' },
          h('p', { className: 'eyebrow' }, 'Timeline'),
          servicePlan.timeline.map(group => h('div', { key: group.key, className: 'menu-service-block' },
            h('strong', null, group.label),
            h('ul', null, group.items.map(item => h('li', { key: item }, item)))
          ))
        ),
        h('section', { className: 'menu-service-panel' },
          h('p', { className: 'eyebrow' }, 'Charge mentale'),
          h('strong', null, servicePlan.stress.level),
          h('ul', null, (servicePlan.stress.reasons.length ? servicePlan.stress.reasons : ['Menu simple à coordonner.']).map(item => h('li', { key: item }, item)))
        ),
        h('section', { className: 'menu-service-panel' },
          h('p', { className: 'eyebrow' }, 'Courses'),
          servicePlan.shoppingHints.map(group => h('div', { key: group.label, className: 'menu-service-block' },
            h('strong', null, group.label),
            h('ul', null, group.items.map(item => h('li', { key: item }, item)))
          ))
        ),
        servicePlan.leftovers.length > 0 && h('section', { className: 'menu-service-panel' },
          h('p', { className: 'eyebrow' }, 'Restes'),
          h('ul', null, servicePlan.leftovers.map(item => h('li', { key: item }, item)))
        ),
        h('section', { className: 'menu-service-panel' },
          h('p', { className: 'eyebrow' }, 'Service'),
          h('ul', null, servicePlan.serviceTips.map(item => h('li', { key: item.title }, `${item.title} : ${item.tip}`)))
        ),
        h('section', { className: 'menu-service-panel' },
          h('p', { className: 'eyebrow' }, 'Matériel'),
          h('ul', null, servicePlan.conflicts.map(item => h('li', { key: item }, item)))
        )
      ),
      h('div', { className: 'modal-actions' },
        h(Button, { variant: 'primary', disabled: !menuRecipes.length, onClick: addToShopping, ariaLabel: `Ajouter le menu aux courses pour ${peopleCount} personnes` }, 'Ajouter le menu aux courses')
      )
    )
  );
}

function PreferencesPanel({ open, onClose, preferences, updatePreferences, favoriteCount = 0, isOnline = true, offlineBusy = false, offlineProgress = null, preloadFavoritesOffline, exportLocalData, importLocalData }) {
  if (!open) return null;
  const update = patch => updatePreferences(patch);
  const theme = preferences.theme === 'light' ? 'light' : 'dark';
  return h(ModalDialog, { className: '', onClose: onClose },
    h('section', { className: 'modal-panel preferences-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'preferences-title', tabIndex: -1, onKeyDown: trapModalFocus, onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head menu-planner-modal-head' },
        h('div', null,
          h('p', { className: 'eyebrow' }, 'Affichage'),
          h('h2', { id: 'preferences-title' }, 'Préférences')
        ),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('div', { className: 'preference-group' },
        h('strong', null, 'Thème'),
        h('div', { className: 'segmented-control', role: 'group', 'aria-label': 'Thème' },
          h('button', { type: 'button', className: theme === 'dark' ? 'active' : '', 'aria-pressed': theme === 'dark', title: 'Conserver le mode nuit', onClick: () => update({ theme: 'dark' }) }, 'Nuit'),
          h('button', { type: 'button', className: theme === 'light' ? 'active' : '', 'aria-pressed': theme === 'light', title: 'Activer le mode jour', onClick: () => update({ theme: 'light' }) }, 'Jour')
        )
      ),
      (favoriteCount > 0 || !isOnline) && h('div', { className: 'preference-group preference-offline-group' },
        h('div', null,
          h('strong', null, 'Favoris hors-ligne'),
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
        offlineBusy && offlineProgress && h('div', { className: 'offline-progress-wrap' },
          h('progress', { max: Math.max(1, offlineProgress.total || 1), value: offlineProgress.completed || 0, 'aria-label': t('offline.progress', offlineProgress) }),
          h('small', null, t('offline.progress', offlineProgress))
        )
      ),
      h('div', { className: 'preference-group preference-data-group' },
        h('div', { className: 'preference-data-copy' },
          h('strong', null, 'Sauvegarde locale'),
          h('small', null, 'Exporte ou restaure tes favoris, notes et listes de courses sur cet appareil.')
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

function QuantityFactorControl({ recipe, factor, setFactor, className = '' }) {
  const servingInfo = getServingInfo(recipe);
  const servingOptions = servingOptionsFor(recipe);
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
    h('span', { className: 'factor-label' }, 'Quantité'),
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
    h('span', { className: 'quantity-unit' }, 'fois')
  );
}

// Ouverture de chapitre des huit categories : une phrase et des reperes calcules
// sur le catalogue (informatifs, sans filtre).
const COLLECTION_INTROS = Object.freeze({
  petit_dejeuner_maitre: 'Viennoiseries, pancakes et douceurs du matin pour bien commencer la journée.',
  apero_maitre: 'Bouchées, tartinables et petites fritures à partager avant le repas.',
  entrees_maitre: 'Entrées froides et chaudes pour ouvrir un repas avec légèreté.',
  sauces_maitre: 'Sauces chaudes, froides et émulsions pour accompagner et relever.',
  elements_base_maitre: 'Pâtes, fonds, beurres et préparations de base à réutiliser partout.',
  plats_maitre: 'Plats mijotés, rôtis et poêlées pour le cœur du repas.',
  accompagnements_maitre: 'Légumes, féculents et garnitures pour compléter l’assiette.',
  desserts_maitre: 'Gâteaux, crèmes, tartes et douceurs pour finir en beauté.'
});

function CollectionChapter({ parent, items, recipesById }) {
  const intro = COLLECTION_INTROS[parent.id];
  if (!intro || !items.length) return null;
  const season = getCurrentSeason();
  const easy = items.filter(item => item.difficulty === 'easy').length;
  const seasonal = items.filter(item => (item.seasons || []).includes(season) || recipeHasSeason(item, season, recipesById)).length;
  // Le total est deja dans le hero : le chapitre donne les reperes utiles.
  const figures = [
    { key: 'easy', value: easy, label: `facile${easy > 1 ? 's' : ''}` },
    { key: 'season', value: seasonal, label: `de saison (${season.toLowerCase()})` }
  ].filter(figure => figure.value > 0);
  return h('div', { className: 'collection-chapter' },
    h('p', { className: 'collection-chapter-intro' }, intro),
    h('dl', { className: 'collection-chapter-figures' },
      figures.map(figure => h('div', { key: figure.key },
        h('dd', null, figure.value),
        h('dt', null, figure.label)
      ))
    )
  );
}

function CollectionLinksPanel({ parent, variantRefs, recipesById, openRecipe, preloadRecipe = null }) {
  const sortedVariantRefs = sortVariantRefs(variantRefs, recipesById);
  if (!sortedVariantRefs.length) return null;
  const recipeEntries = sortedVariantRefs
    .map(variant => ({ variant, item: recipesById[variant.id] }))
    .filter(entry => entry.item);
  return h('section', { id: 'recipe-picker', className: 'recipe-panel variant-picker-panel collection-links-panel', 'aria-label': `Recettes de la collection ${parent.title}` },
    h(CollectionChapter, { parent, items: recipeEntries.map(entry => entry.item), recipesById }),
    h('div', { className: 'variant-card-grid' },
      recipeEntries.map(({ variant, item }) => {
        const image = displayRecipeImage(item) || displayRecipeImage(parent);
        const cardImage = image ? recipeCardImageUrl(image) : '';
        const variantLabel = getRecipeVariantLabel(item, recipesById);
        return h('div', { key: variant.id, className: 'variant-card-shell' },
          h('button', {
            type: 'button',
            className: 'variant-card',
            onPointerEnter: () => warmRecipeOnIntent(preloadRecipe, variant.id, image),
            onFocus: () => warmRecipeOnIntent(preloadRecipe, variant.id, image),
            onTouchStart: () => warmRecipeOnIntent(preloadRecipe, variant.id, image),
            style: ambilightStyle(cardImage, { '--card-accent': getCategoryColor(item) }),
            'aria-label': `Ouvrir ${variant.label || item.title}`,
            onClick: () => openRecipe(variant.id)
          },
            cardImage && h('span', { className: 'variant-card-ambilight', 'aria-hidden': true }),
            image && h('span', { className: 'variant-card-bg', style: imageBackgroundStyle(image) }),
            h('span', { className: 'variant-card-body' },
              h('strong', null, variant.label || item.title),
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
    h('button', { type: 'button', onClick: goHome, 'aria-label': 'Retour au catalogue Cook Note', title: 'Retour au catalogue' }, 'Cook Note'),
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

// Boite repliable d'"Avant de commencer" : un apercu d'une ligne reste lisible
// fermee, pour choisir quoi ouvrir sans tout deplier.
function NotesDisclosure({ label, children, className = '', ariaLabel, preview = '' }) {
  const previewText = stripHtml(preview).replace(/\s+/g, ' ').trim();
  return h('details', {
    className: ['notes-disclosure', className].filter(Boolean).join(' '),
    'aria-label': ariaLabel
  },
  h('summary', { className: 'notes-disclosure-summary' },
    h('span', { className: 'notes-disclosure-text' },
      h('span', { className: 'notes-disclosure-label' }, label),
      previewText && h('small', { className: 'notes-disclosure-preview' }, previewText)
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

function NotesFamily({ title, children }) {
  return h('section', { className: 'notes-family', 'aria-label': title },
    h('h3', { className: 'notes-family-title' }, title),
    children
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
  return h(NotesDisclosure, { className: 'linked-recipes-block', label: 'Recettes liées', ariaLabel: 'Recettes liées à cette fiche', preview: links.map(item => item.recipe.title).join(', ') },
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
      ariaLabel: section.title,
      preview: section.items[0] || ''
    },
      h('ul', null, section.items.map(item => h('li', { key: item }, renderLinkedText(item, inlineTargets || [], openRecipe, techniqueTargets || [], openTechnique))))
    ))
  );
}

function FlavorMapBlock({ recipe }) {
  const items = getRecipeFlavorMap(recipe);
  if (!items.length) return null;
  return h(NotesDisclosure, { className: 'flavor-map-block', label: 'Accords', ariaLabel: 'Accords de la recette', preview: items.map(item => item.label).join(', ') },
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
  return h(NotesDisclosure, { className: 'ingredient-knowledge-block', label: 'Conversation ingrédients', ariaLabel: 'Conversation ingrédients', preview: cards.map(card => card.label).join(', ') },
    h('div', { className: 'ingredient-knowledge-grid' },
      cards.map(card => h('article', { key: card.label, className: 'ingredient-knowledge-card' },
        h('div', null,
          h('strong', null, card.label)
        ),
        h('p', null, card.storage),
        h('dl', null,
          h('dt', null, 'Vigilance'),
          h('dd', null, card.avoid)
        )
      ))
    )
  );
}

function PrepTimelineBlock({ recipe }) {
  const items = getPrepTimeline(recipe);
  if (!items.length) return null;
  return h(NotesDisclosure, { className: 'prep-timeline-block', label: 'Organisation', ariaLabel: 'Organisation de la préparation', preview: items.map(item => item.label).join(', ') },
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
        h('h2', null, 'Fiche rapide')
      ),
      h('p', { className: 'recipe-summary-message' }, 'Sélectionne une variante pour afficher les informations de la fiche rapide.')
    );
  }
  const equipment = getRecipeEquipment(recipe);
  const timing = getRecipeTiming(recipe);
  const serviceItems = getRecipeServiceItems(recipe).slice(0, 2);
  const riskSignals = getRecipeRiskSignals(recipe).slice(0, 2);
  const chefNotes = [
    timing.active && timing.active <= 20 ? 'Mise en place courte : garder les ingrédients à portée de main avant la cuisson.' : '',
    timing.rest ? 'Prévoir le temps de repos avant de servir.' : '',
    ...serviceItems,
    ...riskSignals.map(formatRecipeRiskNote)
  ].filter(Boolean).slice(0, 3);
  const facts = [
    timing.total && { label: 'Total', value: formatMinutesShort(timing.total) },
    { label: 'Temps actif', value: formatMinutesShort(timing.active) || 'À estimer' },
    timing.cook && { label: 'Cuisson', value: formatMinutesShort(timing.cook) },
    timing.rest && { label: 'Repos / froid', value: formatMinutesShort(timing.rest) },
  ].filter(Boolean);
  return h('section', { className: 'recipe-summary-panel', 'aria-label': 'Résumé de la recette' },
    h('div', { className: 'recipe-summary-head' },
      h('h2', null, 'Fiche rapide')
    ),
    h('div', { className: `recipe-quick-facts fact-count-${facts.length}` },
      facts.map(item => h('div', { key: item.label, className: 'recipe-quick-fact' },
        h('span', null, item.label),
        h('strong', null, item.value)
      ))
    ),
    chefNotes.length > 0 && h('div', { className: 'recipe-chef-strip', 'aria-label': 'Lecture chef de la recette' },
      h('strong', null, 'Lecture chef'),
      h('ul', null, chefNotes.map(item => h('li', { key: item }, item)))
    ),
    equipment.length > 0 && h('div', { className: 'recipe-equipment-strip' },
      h('strong', null, 'Matériel nécessaire'),
      h('ul', null, equipment.map(item => h('li', { key: item }, item)))
    )
  );
}

function RecipeAnatomy({ recipe, variantOptions = [], selectedIndex, onSelectVariant }) {
  // Fiche a variantes : le bandeau devient le selecteur, aligne sur la grille,
  // pour changer de variante sans remonter jusqu'aux cartes de choix.
  if (variantOptions.length > 1 && typeof onSelectVariant === 'function') {
    return h('nav', { className: 'recipe-anatomy recipe-variant-switch', 'aria-label': 'Changer de variante' },
      h('span', { className: 'recipe-variant-switch-label' }, 'Variante'),
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
  return h('ol', { className: 'recipe-anatomy', 'aria-label': 'Structure de la recette' },
    stages.map((stage, index) => h('li', { key: `${stage}:${index}` },
      h('span', { 'aria-hidden': true }, String(index + 1).padStart(2, '0')),
      h('strong', null, stage)
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
        h('p', { className: 'eyebrow' }, 'Variante'),
        h('h2', null, 'Choisis une variante'),
        h('p', { className: 'variant-choice-description' },
          'Chaque choix ouvre une recette compl\u00e8te avec ses propres ingr\u00e9dients, \u00e9tapes, quantit\u00e9s et conseils.'
        )
      ),
      h('span', { className: 'variant-choice-count' }, `${options.length} variante${options.length > 1 ? 's' : ''}`)
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
    ),
    !selectedOption && h('div', {
      className: 'variant-choice-status waiting',
      role: 'status',
      'aria-live': 'polite'
    },
      h('span', { className: 'variant-choice-status-icon', 'aria-hidden': true }, '\u2192'),
      h('span', { className: 'variant-choice-status-copy' },
            h('small', null, 'Choix requis'),
            h('strong', null, 'Choisis une carte ci-dessus'),
            h('span', null, 'La fiche compl\u00e8te s\u2019affichera ensuite, sans m\u00e9langer les recettes.')
      )
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


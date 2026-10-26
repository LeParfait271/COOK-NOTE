function App() {
  const [recipeSource, setRecipeSource] = useState(() => (window.RECIPES && typeof window.RECIPES === 'object' ? window.RECIPES : {}));
  const [fullRecipeCatalogLoaded, setFullRecipeCatalogLoaded] = useState(false);
  const [recipeDetailsById, setRecipeDetailsById] = useState({});
  const [recipeDetailsLoading, setRecipeDetailsLoading] = useState({});
  const [catalogChunksLoaded, setCatalogChunksLoaded] = useState(() => Boolean(window.COOK_NOTE_CATALOG_COMPLETE));
  const [recipeOverrides, setRecipeOverrides] = useState(() => readJson(STORAGE_KEYS.recipeOverrides, {}));
  const recipes = useMemo(() => {
    const normalizedRecipes = normalizeLoadedRecipeValue(recipeSource);
    return Object.entries(normalizedRecipes).map(([id, recipe]) => {
      const tagsExtracted = extractTags(recipe);
      return { id, tagsExtracted, ...recipe, ...(recipeOverrides[id]?.recipe || {}) };
    }).sort((a, b) => a.title.localeCompare(b.title, 'fr'));
  }, [recipeSource, recipeOverrides]);
  const recipesById = useMemo(() => Object.fromEntries(recipes.map(recipe => [recipe.id, recipe])), [recipes]);
  const catalogStats = useMemo(() => getCatalogRecipeStats(recipes), [recipes]);
  const homeCatalogRecipes = useMemo(() => recipes.filter(recipe => !recipe.master), [recipes]);
  const searchableRecipes = useMemo(() => recipes.filter(recipe => !isMasterRecipe(recipe)), [recipes]);
  const currentSeason = useMemo(() => getCurrentSeason(), []);

  const [preferences, setPreferences] = useState(() => {
    const stored = readJson(STORAGE_KEYS.preferences, {});
    const detectedTheme = CookNoteTheme.theme();
    return {
      density: 'comfort',
      largeText: true,
      reduceMotion: false,
      ...stored,
      density: 'comfort',
      largeText: true,
      reduceMotion: false,
      theme: CookNoteTheme.isValidTheme(stored.theme) ? stored.theme : detectedTheme
    };
  });
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') || '');
  const searchFilterQuery = useDebouncedValue(query, 80);
  const [searchOpen, setSearchOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [season, setSeason] = useState('');
  const [seasonCategory, setSeasonCategory] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [activePage, setActivePage] = useState(() => getPathPage());
  const [targetTechniqueId, setTargetTechniqueId] = useState(() => getInitialTechnique());
  const [onlyFavorites, setOnlyFavorites] = useState(() => new URLSearchParams(window.location.search).get('view') === '__favs__');
  const [favoriteCollection, setFavoriteCollection] = useState('');
  const [activeId, setActiveId] = useState(() => getInitialRecipe());
  const [favorites, setFavorites] = useState(() => readStoredList(STORAGE_KEYS.favorites, STORAGE_KEYS.legacyFavorites));
  const [shoppingIds, setShoppingIds] = useState(() => readStoredList(STORAGE_KEYS.shopping, []));
  const [shoppingFactors, setShoppingFactors] = useState(() => readJson(STORAGE_KEYS.shoppingFactors, {}));
  const [checked, setChecked] = useState({});
  const [historyVersion, setHistoryVersion] = useState(0);
  const [shoppingOpen, setShoppingOpen] = useState(false);
  const [menuPlannerOpen, setMenuPlannerOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [equipmentProfile, setEquipmentProfile] = useState(() => normalizeEquipmentProfile(readJson(STORAGE_KEYS.equipmentProfile, {})));
  const [recipeHistory, setRecipeHistory] = useState(() => readJson(STORAGE_KEYS.recipeHistory, {}));
  const [offlineBusy, setOfflineBusy] = useState(false);
  const [offlineProgress, setOfflineProgress] = useState(null);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine !== false);
  const [recentRecipeIds, setRecentRecipeIds] = useState(() => readStoredList(STORAGE_KEYS.recentRecipes, []));
  const [recentSearches, setRecentSearches] = useState(() => readStoredList(STORAGE_KEYS.recentSearches, []));
  const [toasts, setToasts] = useState([]);
  const searchRef = useRef(null);
  const commandRef = useRef(null);
  const modalRestoreFocusRef = useRef(null);
  const homeScrollRef = useRef(Number(sessionStorage.getItem(STORAGE_KEYS.homeScroll)) || 0);
  const restoreHomeScrollRef = useRef(false);
  const pendingScrollModeRef = useRef('top');
  const lastRouteKeyRef = useRef(currentScrollRouteKey());
  const historyRef = useRef([{}]);
  const historyIndexRef = useRef(0);
  const catalogChunkLoadRef = useRef(null);
  const fullRecipeLoadRef = useRef(null);
  const recipeDetailWorkerRef = useRef(null);
  const recipeDetailRequestsRef = useRef(new Map());
  const activeTheme = preferences.theme === 'light' ? 'light' : 'dark';
  const anyModalOpen = searchOpen || commandOpen || shoppingOpen || menuPlannerOpen || preferencesOpen;

  useEffect(() => () => {
    recipeDetailWorkerRef.current?.terminate();
    recipeDetailWorkerRef.current = null;
    const failure = new Error('Chargement de la fiche interrompu.');
    recipeDetailRequestsRef.current.forEach(({ reject }) => reject(failure));
    recipeDetailRequestsRef.current.clear();
  }, []);

  useEffect(() => {
    if (anyModalOpen) {
      modalRestoreFocusRef.current = document.activeElement;
      requestAnimationFrame(() => {
        const firstControl = document.querySelector('[role="dialog"] button, [role="dialog"] input, [role="dialog"] select');
        firstControl?.focus?.({ preventScroll: true });
      });
      return undefined;
    }
    modalRestoreFocusRef.current?.focus?.();
    modalRestoreFocusRef.current = null;
    return undefined;
  }, [anyModalOpen]);
  const updatePreferences = patch => {
    const isThemePatch = Object.prototype.hasOwnProperty.call(patch, 'theme');
    const requestedTheme = isThemePatch && CookNoteTheme.isValidTheme(patch.theme) ? patch.theme : '';
    const commit = () => {
      if (requestedTheme) CookNoteTheme.applyTheme(requestedTheme);
      setPreferences(current => {
        const nextTheme = requestedTheme || current.theme;
        const next = { ...current, ...patch, theme: nextTheme };
        writeJson(STORAGE_KEYS.preferences, next);
        return next;
      });
    };
    if (requestedTheme && typeof ReactDOM !== 'undefined' && typeof ReactDOM.flushSync === 'function') {
      ReactDOM.flushSync(commit);
      return;
    }
    commit();
  };
  const toggleTheme = () => updatePreferences({ theme: activeTheme === 'light' ? 'dark' : 'light' });

  useEffect(() => {
    CookNoteTheme.applyTheme(activeTheme);
  }, [activeTheme]);

  useEffect(() => CookNoteTheme.subscribe(theme => {
    setPreferences(current => current.theme === theme ? current : { ...current, theme });
  }), []);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine !== false);
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const activeRecipeBase = activeId ? recipesById[activeId] : null;
  const activeRecipe = useMemo(() => {
    if (!activeRecipeBase) return null;
    const details = recipeDetailsById[activeId];
    return details ? { ...activeRecipeBase, ...details } : activeRecipeBase;
  }, [activeId, activeRecipeBase, recipeDetailsById]);
  const publishedActiveRecipe = useMemo(() => {
    if (!activeId || !recipeSource[activeId]) return activeRecipe;
    return { id: activeId, ...recipeSource[activeId], ...(recipeDetailsById[activeId] || {}) };
  }, [activeId, activeRecipe, recipeDetailsById, recipeSource]);
  useEffect(() => {
    if (!activeId || !publishedActiveRecipe || isMasterRecipe(publishedActiveRecipe) || !recipeDetailsById[activeId]) return;
    setRecipeHistory(current => {
      const next = captureRecipeVersion(current, activeId, publishedActiveRecipe, window.COOK_NOTE_ASSET_VERSION || 'site');
      if (next === current) return current;
      writeJson(STORAGE_KEYS.recipeHistory, next);
      return next;
    });
  }, [activeId, publishedActiveRecipe, recipeDetailsById]);
  const activeRecipes = useMemo(() => {
    if (!activeRecipe || !recipeDetailsById[activeId]) return recipes;
    return recipes.map(recipe => recipe.id === activeId ? activeRecipe : recipe);
  }, [activeId, activeRecipe, recipeDetailsById, recipes]);
  const activeRecipesById = useMemo(() => {
    if (!activeRecipe || !recipeDetailsById[activeId]) return recipesById;
    return { ...recipesById, [activeId]: activeRecipe };
  }, [activeId, activeRecipe, recipeDetailsById, recipesById]);
  const activeSeoRecipe = activeRecipe;
  const shoppingRecipes = useMemo(() => shoppingIds.map(id => resolveShoppingRecipe(id, recipesById)).filter(Boolean), [shoppingIds, recipesById]);
  const hasRecipeFilters = Boolean((!searchOpen && searchFilterQuery.trim()) || season || seasonCategory || tagFilter || onlyFavorites);
  const catalogRecipes = useMemo(() => hasRecipeFilters ? searchableRecipes : homeCatalogRecipes, [hasRecipeFilters, homeCatalogRecipes, searchableRecipes]);
  const allSeasons = useMemo(() => uniq([...SEASONS, ...searchableRecipes.flatMap(recipe => recipe.seasons || [])]).filter(item => item !== 'Toutes saisons'), [searchableRecipes]);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const needsFullRecipe = Boolean(
      activeRecipe
      && !isMasterRecipe(activeRecipe)
      && !Array.isArray(activeRecipe.steps)
      && !recipeDetailsById[activeId]
    );
    if (needsFullRecipe) {
      loadRecipeDetails(activeId, true).catch(() => {});
      return;
    }
    if (activeRecipe && !needsFullRecipe) return;
    if (catalogChunksLoaded) {
      loadRecipeDetails(activeId, true).catch(() => {});
      return;
    }
    loadDeferredCatalogChunks()
      .then(nextRecipes => {
        const loaded = nextRecipes?.[activeId];
        if (loaded && !isMasterRecipe(loaded) && !Array.isArray(loaded.steps)) {
          return loadRecipeDetails(activeId, true);
        }
        return null;
      })
      .catch(() => loadRecipeDetails(activeId, true).catch(() => {}));
  }, [activeId, activeRecipe?.id, activeRecipe?.steps?.length, catalogChunksLoaded, recipeDetailsById]);

  useEffect(() => {
    const legacyVariant = new URLSearchParams(window.location.search).get('variant');
    if (legacyVariant && recipesById[legacyVariant]) {
      history.replaceState('', document.title, getRecipeUrl(legacyVariant));
    }
  }, [recipesById]);

  useEffect(() => {
    const mode = pendingScrollModeRef.current;
    if (mode === 'none') return undefined;
    const top = mode === 'restore' ? readScrollPositionForCurrentRoute() : 0;
    pendingScrollModeRef.current = 'top';
    const applyScroll = () => window.scrollTo({ top, left: 0, behavior: 'auto' });
    applyScroll();
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      applyScroll();
      secondFrame = requestAnimationFrame(applyScroll);
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [activeRecipe?.id, activePage, targetTechniqueId]);

  // Onglet cache : le fond vivant se fige (aucune image calculee pour rien).
  useEffect(() => {
    const syncVisibility = () => document.documentElement.classList.toggle('page-hidden', document.hidden);
    syncVisibility();
    document.addEventListener('visibilitychange', syncVisibility);
    return () => document.removeEventListener('visibilitychange', syncVisibility);
  }, []);

  useEffect(() => {
    updateDocumentMeta(activeSeoRecipe, recipesById, activePage);
  }, [activeSeoRecipe?.id, recipesById, activePage]);

  useEffect(() => {
    let persistTimer = 0;
    const persistScrollPosition = () => {
      persistTimer = 0;
      if (!activeRecipe) {
        try {
          sessionStorage.setItem(STORAGE_KEYS.homeScroll, String(homeScrollRef.current || 0));
        } catch {
          /* ignore session storage restrictions */
        }
      }
      saveCurrentScrollPosition();
    };
    const schedulePersist = () => {
      if (persistTimer) return;
      persistTimer = window.setTimeout(persistScrollPosition, 280);
    };
    const handleScroll = () => {
      const top = window.scrollY || 0;
      if (!activeRecipe) {
        homeScrollRef.current = top;
      }
      schedulePersist();
    };
    const flushScrollPosition = () => {
      if (persistTimer) {
        window.clearTimeout(persistTimer);
        persistTimer = 0;
      }
      persistScrollPosition();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flushScrollPosition();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pagehide', flushScrollPosition);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pagehide', flushScrollPosition);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      flushScrollPosition();
    };
  }, [activeRecipe]);

  function setCheckedWithHistory(next) {
    setChecked(prev => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      historyRef.current = [...historyRef.current.slice(0, historyIndexRef.current + 1), resolved];
      historyIndexRef.current = historyRef.current.length - 1;
      setHistoryVersion(value => value + 1);
      return resolved;
    });
  }

  function undo() {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    setChecked(historyRef.current[historyIndexRef.current]);
    setHistoryVersion(value => value + 1);
  }

  function redo() {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    setChecked(historyRef.current[historyIndexRef.current]);
    setHistoryVersion(value => value + 1);
  }

  const canUndo = historyVersion >= 0 && historyIndexRef.current > 0;
  const canRedo = historyVersion >= 0 && historyIndexRef.current < historyRef.current.length - 1;

  function updateSeason(value) {
    if (value) loadDeferredCatalogChunks().catch(() => {});
    setSeason(value);
    if (!value) setSeasonCategory('');
  }

  function updateTagFilter(value) {
    if (value) loadDeferredCatalogChunks().catch(() => {});
    setTagFilter(value);
  }

  const searchMeta = useMemo(() => {
    const needle = searchFilterQuery.trim();
    const map = new Map();
    if (!needle) return map;
    searchableRecipes.forEach(recipe => {
      const meta = scoreRecipeSearch(recipe, needle, recipesById);
      if (meta.score > 0) map.set(recipe.id, meta);
    });
    return map;
  }, [searchFilterQuery, searchableRecipes, recipesById]);

  const ingredientMeta = useMemo(() => {
    const needle = searchFilterQuery.trim();
    const map = new Map();
    if (!needle) return map;
    searchableRecipes.forEach(recipe => {
      const meta = scoreIngredientSearch(recipe, needle);
      if (meta.score > 0) map.set(recipe.id, meta);
    });
    return map;
  }, [searchFilterQuery, searchableRecipes]);

  const searchPanelResults = useMemo(() => {
    const needle = searchFilterQuery.trim();
    if (!needle) return [];
    return searchableRecipes
      .filter(recipe => (searchMeta.has(recipe.id) || ingredientMeta.has(recipe.id)) && recipeMatchesSearchConstraints(recipe, needle, recipesById))
      .sort((a, b) => {
        const score = ((searchMeta.get(b.id)?.score || 0) + (ingredientMeta.get(b.id)?.score || 0))
          - ((searchMeta.get(a.id)?.score || 0) + (ingredientMeta.get(a.id)?.score || 0));
        return score || a.title.localeCompare(b.title, 'fr');
      });
  }, [searchFilterQuery, searchableRecipes, searchMeta, ingredientMeta, recipesById]);

  const baseFilteredRecipes = useMemo(() => {
    const activeSearchQuery = searchOpen ? '' : searchFilterQuery.trim();
    const activeFavoriteCollection = FAVORITE_COLLECTIONS.find(collection => collection.id === favoriteCollection);
    let list = catalogRecipes.filter(recipe => {
      if (activeSearchQuery && !searchMeta.has(recipe.id) && !ingredientMeta.has(recipe.id)) return false;
      if (activeSearchQuery && !recipeMatchesSearchConstraints(recipe, activeSearchQuery, recipesById)) return false;
      if (season && !recipeHasSeason(recipe, season, recipesById)) return false;
      if (tagFilter && !(recipe.tagsExtracted || []).includes(tagFilter)) return false;
      if (onlyFavorites && !favorites.includes(recipe.id)) return false;
      if (onlyFavorites && activeFavoriteCollection?.id && !activeFavoriteCollection.match?.(recipe)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (activeSearchQuery) {
        const score = ((searchMeta.get(b.id)?.score || 0) + (ingredientMeta.get(b.id)?.score || 0))
          - ((searchMeta.get(a.id)?.score || 0) + (ingredientMeta.get(a.id)?.score || 0));
        if (score) return score;
      }
      const order = homeCardOrder(a) - homeCardOrder(b);
      if (order) return order;
      return a.title.localeCompare(b.title, 'fr');
    });
    return list;
  }, [catalogRecipes, searchOpen, searchFilterQuery, searchMeta, ingredientMeta, season, tagFilter, onlyFavorites, favorites, recipesById, favoriteCollection]);

  const seasonCategoryOptions = useMemo(() => {
    if (!season) return [];
    return [
      { value: '', label: 'Tous', count: baseFilteredRecipes.length },
      ...SEASON_CATEGORY_FILTERS
        .map(item => ({
          ...item,
          count: baseFilteredRecipes.filter(recipe => recipeHasCategory(recipe, item.value)).length
        }))
        .filter(item => item.count > 0)
    ];
  }, [baseFilteredRecipes, season]);

  const filteredRecipes = useMemo(() => {
    if (!season || !seasonCategory) return baseFilteredRecipes;
    return baseFilteredRecipes.filter(recipe => recipeHasCategory(recipe, seasonCategory));
  }, [baseFilteredRecipes, season, seasonCategory]);

  useEffect(() => {
    if (!season && seasonCategory) {
      setSeasonCategory('');
      return;
    }
    if (seasonCategory && !seasonCategoryOptions.some(item => item.value === seasonCategory)) {
      setSeasonCategory('');
    }
  }, [season, seasonCategory, seasonCategoryOptions]);

  const sections = useMemo(() => {
    if (onlyFavorites) {
      if (!filteredRecipes.length) {
        return [{ key: 'favorites-empty', kicker: 'Favoris', title: 'Recettes sauvegardées', recipes: filteredRecipes }];
      }
      const grouped = new Map();
      filteredRecipes.forEach(recipe => {
        const category = seasonGroupCategory(recipe);
        if (!grouped.has(category)) grouped.set(category, []);
        grouped.get(category).push(recipe);
      });
      return Array.from(grouped.entries()).map(([category, recipes]) => ({
        key: `favorites-${category}`,
        kicker: 'Favoris',
        title: categoryLabel(category),
        recipes
      }));
    }
    if (season) {
      if (seasonCategory) {
        return [{ key: `season-${season}-${seasonCategory}`, kicker: categoryLabel(seasonCategory), title: `${categoryLabel(seasonCategory)} de saison : ${season}`, recipes: filteredRecipes }];
      }
      const grouped = new Map();
      filteredRecipes.forEach(recipe => {
        const category = seasonGroupCategory(recipe);
        if (!grouped.has(category)) grouped.set(category, []);
        grouped.get(category).push(recipe);
      });
      return [
        ...SEASON_CATEGORY_FILTERS
          .filter(item => grouped.has(item.value))
          .map(item => ({
            key: `season-${season}-${item.value}`,
            kicker: season === currentSeason ? 'Saison actuelle' : 'Saison',
            title: categoryLabel(item.value),
            recipes: grouped.get(item.value)
          })),
        ...Array.from(grouped.entries())
          .filter(([category]) => !SEASON_CATEGORY_FILTERS.some(item => item.value === category))
          .map(([category, recipes]) => ({
            key: `season-${season}-${category}`,
            kicker: 'Saison',
            title: categoryLabel(category),
            recipes
          }))
      ];
    }
    return [{ key: 'all-seasons', kicker: 'Toutes', title: 'Toutes les recettes', recipes: filteredRecipes }];
  }, [currentSeason, filteredRecipes, onlyFavorites, season, seasonCategory]);
  const activeChips = [
    query && { key: 'query', label: `Recherche: ${query}`, clear: () => setQuery('') },
    season && { key: 'season', label: season, clear: () => updateSeason('') },
    seasonCategory && { key: 'seasonCategory', label: categoryLabel(seasonCategory), clear: () => setSeasonCategory('') },
    tagFilter && { key: 'tag', label: `Tag: ${tagFilter}`, clear: () => updateTagFilter('') },
    onlyFavorites && { key: 'favorites', label: 'Favoris', clear: () => { setOnlyFavorites(false); setFavoriteCollection(''); } },
    onlyFavorites && favoriteCollection && { key: 'favoriteCollection', label: FAVORITE_COLLECTIONS.find(item => item.id === favoriteCollection)?.label || 'Collection', clear: () => setFavoriteCollection('') }
  ].filter(Boolean);

  function dismissToast(id) {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }

  function notify(message, tone = 'info', title = 'Cook Note') {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts([{ id, title, message, tone }]);
    window.setTimeout(() => dismissToast(id), 3400);
  }

  function persistRecentRecipes(next) {
    setRecentRecipeIds(next);
    writeJson(STORAGE_KEYS.recentRecipes, next);
  }

  function rememberRecipeVisit(id) {
    const recipe = recipesById[id];
    if (!recipe || isMasterRecipe(recipe)) return;
    persistRecentRecipes([id, ...recentRecipeIds.filter(item => item !== id)].slice(0, 8));
  }

  function rememberSearch(value) {
    const clean = stripHtml(value).trim();
    if (clean.length < 2) return;
    const next = [clean, ...recentSearches.filter(item => normalizeText(item) !== normalizeText(clean))].slice(0, 8);
    setRecentSearches(next);
    writeJson(STORAGE_KEYS.recentSearches, next);
  }

  function persistFavorites(next) {
    setFavorites(next);
    writeJson(STORAGE_KEYS.favorites, next);
  }

  function exportLocalData() {
    try {
      downloadLocalDataBackup();
      notify('Sauvegarde locale téléchargée', 'success');
    } catch {
      notify('Sauvegarde locale impossible', 'error');
    }
  }

  async function importLocalData(file) {
    if (!file || file.size > 1000000) {
      notify('Fichier de sauvegarde trop volumineux', 'error');
      return;
    }
    try {
      const raw = await file.text();
      const confirmMessage = 'Cette action remplacera les données locales Cook Note. Continuer ?';
      if (!window.confirm(confirmMessage)) return;
      const count = restoreLocalDataBackup(raw);
      notify(`${count} éléments restaurés. Rechargement...`, 'success');
      window.setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      notify(error?.message || 'Import de sauvegarde impossible', 'error');
    }
  }

  function toggleFavorite(id, label = '') {
    const recipe = recipesById[id];
    const removing = favorites.includes(id);
    const displayLabel = label || recipe?.title || 'Recette';
    persistFavorites(removing ? favorites.filter(item => item !== id) : [id, ...favorites]);
    notify(removing ? `${displayLabel} retirée des favoris` : `${displayLabel} ajoutée aux favoris`, removing ? 'info' : 'success');
  }

  function persistShopping(next) {
    setShoppingIds(next);
    writeJson(STORAGE_KEYS.shopping, next);
  }

  function persistShoppingFactors(next) {
    setShoppingFactors(next);
    writeJson(STORAGE_KEYS.shoppingFactors, next);
  }

  function toggleShopping(id, factor = 1) {
    const recipe = resolveShoppingRecipe(id, recipesById);
    if (shoppingIds.includes(id)) {
      persistShopping(shoppingIds.filter(item => item !== id));
      const nextFactors = { ...shoppingFactors };
      delete nextFactors[id];
      persistShoppingFactors(nextFactors);
      notify(`Retiré des courses : ${recipe?.title || 'recette'}`, 'info');
      return;
    }
    persistShopping([id, ...shoppingIds]);
    persistShoppingFactors({ ...shoppingFactors, [id]: factor });
    notify(`Ajouté aux courses : ${recipe?.title || 'recette'}`, 'success');
  }

  function removeShopping(id) {
    const recipe = resolveShoppingRecipe(id, recipesById);
    persistShopping(shoppingIds.filter(item => item !== id));
    const nextFactors = { ...shoppingFactors };
    delete nextFactors[id];
    persistShoppingFactors(nextFactors);
    notify(`Retiré des courses : ${recipe?.title || 'recette'}`, 'info');
  }

  function clearShopping() {
    persistShopping([]);
    persistShoppingFactors({});
    notify('Panier de courses vidé', 'info');
  }

  // Liste recue d'un autre appareil via le QR code (#courses=...) : ajoutee en
  // tete de la liste actuelle apres confirmation, puis le fragment est efface.
  useEffect(() => {
    const entries = decodeShoppingTransfer(window.location.hash);
    if (!entries) return;
    window.history.replaceState(window.history.state, document.title, `${window.location.pathname}${window.location.search}`);
    const count = entries.length;
    if (!window.confirm(`Ajouter ${count} recette${count > 1 ? 's' : ''} reçue${count > 1 ? 's' : ''} à ta liste de courses ?`)) return;
    const ids = entries.map(entry => entry.id);
    persistShopping([...ids, ...shoppingIds.filter(id => !ids.includes(id))]);
    persistShoppingFactors(entries.reduce((next, entry) => ({ ...next, [entry.id]: entry.factor }), { ...shoppingFactors }));
    notify(`${count} recette${count > 1 ? 's' : ''} ajoutée${count > 1 ? 's' : ''} aux courses`, 'success');
    openShoppingBasket();
  }, []);

  function addMenuToShopping(menuRecipes, factorById = {}) {
    const ids = menuRecipes.map(recipe => recipe.id).filter(Boolean);
    const merged = [...ids, ...shoppingIds.filter(id => !ids.includes(id))];
    persistShopping(merged);
    persistShoppingFactors(ids.reduce((next, id) => ({ ...next, [id]: factorById[id] || shoppingFactors[id] || 1 }), { ...shoppingFactors }));
    setShoppingOpen(true);
  }

  function favoriteOfflineUrls(sourceById = recipesById) {
    const urls = new Set([
      '/',
      '/index.html',
      '/recipe.html',
      `/style.css?v=${SITE_CACHE_VERSION}`,
      `/app.js?v=${SITE_CACHE_VERSION}`,
      `/app-techniques.js?v=${SITE_CACHE_VERSION}`,
      `/app-premium.js?v=${SITE_CACHE_VERSION}`,
      `/recipe.js?v=${SITE_CACHE_VERSION}`,
      FULL_RECIPE_CATALOG_SRC,
      ...DEFERRED_CATALOG_CHUNK_SRCS,
      '/manifest.json',
      '/assets/brand/mark.svg',
      '/assets/brand/app-icon.png',
      preferredImageUrl('/assets/theme/dark/global/background.jpg')
    ]);
    favorites.forEach(id => {
      const recipe = recipesById[id] || sourceById[id];
      if (!recipe) return;
      urls.add(getRecipeUrl(id));
      const image = displayRecipeImage(recipe);
      if (image) urls.add(preferredImageUrl(image));
      getLinkedRecipeRefs(recipe, sourceById).slice(0, 4).forEach(link => {
        urls.add(getRecipeUrl(link.recipe.id));
        const linkedImage = displayRecipeImage(link.recipe);
        if (linkedImage) urls.add(preferredImageUrl(linkedImage));
      });
    });
    return Array.from(urls);
  }

  async function preloadFavoriteRecipesOffline() {
    if (offlineBusy) return;
    if (!favorites.length) {
      notify('Ajoute des recettes en favoris avant de précharger.', 'info');
      return;
    }
    if (!isOnline) {
      notify('Connexion nécessaire pour précharger les favoris.', 'info');
      return;
    }
    setOfflineBusy(true);
    try {
      const loadedSource = catalogChunksLoaded ? recipeSource : await loadDeferredCatalogChunks().catch(() => recipeSource);
      const loadedRecipes = Object.fromEntries(Object.entries(normalizeLoadedRecipeValue(loadedSource)).map(([id, recipe]) => [id, { id, ...recipe }]));
      const favoriteCount = favorites.filter(id => recipesById[id] || loadedRecipes[id]).length;
      const urls = favoriteOfflineUrls(loadedRecipes);
      setOfflineProgress({ cached: 0, completed: 0, total: urls.length });
      const result = await cacheUrlsForOffline(urls, setOfflineProgress);
      notify(`${favoriteCount} favori${favoriteCount > 1 ? 's' : ''} prêt${favoriteCount > 1 ? 's' : ''} hors-ligne (${result.cached || 0}/${result.total || 0})`, 'success');
    } catch {
      notify('Préchargement hors-ligne impossible pour le moment.', 'error');
    } finally {
      setOfflineBusy(false);
      setOfflineProgress(null);
    }
  }

  function loadDeferredCatalogChunks() {
    if (catalogChunksLoaded) return Promise.resolve(recipeSource);
    if (catalogChunkLoadRef.current) return catalogChunkLoadRef.current;

    catalogChunkLoadRef.current = Promise.all(DEFERRED_CATALOG_CHUNK_SRCS.map(src => loadDeferredScript(src)))
      .then(() => {
        const nextRecipes = window.RECIPES && typeof window.RECIPES === 'object' ? { ...window.RECIPES } : { ...recipeSource };
        window.COOK_NOTE_CATALOG_COMPLETE = true;
        setRecipeSource(nextRecipes);
        setCatalogChunksLoaded(true);
        return nextRecipes;
      })
      .catch(error => {
        catalogChunkLoadRef.current = null;
        throw error;
      });

    return catalogChunkLoadRef.current;
  }

  function getRecipeDetailWorker() {
    if (recipeDetailWorkerRef.current) return recipeDetailWorkerRef.current;
    if (typeof Worker !== 'function') return null;

    let worker;
    try {
      worker = new Worker(RECIPE_DETAIL_WORKER_SRC);
    } catch {
      return null;
    }

    worker.onmessage = event => {
      const data = event.data || {};
      const pending = recipeDetailRequestsRef.current.get(data.id);
      if (!pending) return;
      recipeDetailRequestsRef.current.delete(data.id);
      if (data.type !== 'recipe' || !data.recipe) {
        pending.reject(new Error(data.message || 'Fiche recette introuvable.'));
        return;
      }
      setRecipeDetailsById(current => current[data.id]
        ? current
        : { ...current, [data.id]: data.recipe });
      pending.resolve(data.recipe);
    };
    worker.onerror = () => {
      const failure = new Error('Chargement de la fiche impossible.');
      recipeDetailRequestsRef.current.forEach(({ reject }) => reject(failure));
      recipeDetailRequestsRef.current.clear();
      worker.terminate();
      recipeDetailWorkerRef.current = null;
    };
    recipeDetailWorkerRef.current = worker;
    return worker;
  }

  function loadRecipeDetails(id, showLoading = false) {
    const known = recipeDetailsById[id] || recipeSource[id] || recipesById[id];
    if (recipeDetailsById[id] || (known && Array.isArray(known.steps))) return Promise.resolve(known);

    if (showLoading) setRecipeDetailsLoading(current => current[id] ? current : { ...current, [id]: true });
    const clearLoading = () => setRecipeDetailsLoading(current => {
      if (!current[id]) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
    const existing = recipeDetailRequestsRef.current.get(id);
    if (existing) return showLoading ? existing.promise.finally(clearLoading) : existing.promise;
    const fallback = () => loadFullRecipeCatalog().then(source => {
      const loaded = source?.[id] || recipeSource[id] || recipesById[id];
      if (!loaded) throw new Error('Fiche recette introuvable.');
      return loaded;
    });
    const worker = getRecipeDetailWorker();
    if (!worker) return fallback().finally(showLoading ? clearLoading : undefined);

    let resolveRequest;
    let rejectRequest;
    const rawPromise = new Promise((resolve, reject) => {
      resolveRequest = resolve;
      rejectRequest = reject;
    });
    const request = {
      promise: null,
      resolve: resolveRequest,
      reject: rejectRequest
    };
    const promise = rawPromise.catch(() => fallback()).finally(showLoading ? clearLoading : undefined);
    request.promise = promise;
    recipeDetailRequestsRef.current.set(id, request);
    try {
      worker.postMessage({ type: 'load', id, src: FULL_RECIPE_CATALOG_SRC });
    } catch {
      recipeDetailRequestsRef.current.delete(id);
      rejectRequest(new Error('Chargement de la fiche impossible.'));
    }
    return promise;
  }

  function loadFullRecipeCatalog() {
    if (fullRecipeCatalogLoaded) return Promise.resolve(recipeSource);
    if (fullRecipeLoadRef.current) return fullRecipeLoadRef.current;

    fullRecipeLoadRef.current = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-cook-note-full-recipes="true"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.RECIPES || {}), { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = FULL_RECIPE_CATALOG_SRC;
      script.async = true;
      script.dataset.cookNoteFullRecipes = 'true';
      script.onload = () => {
        const nextRecipes = window.RECIPES && typeof window.RECIPES === 'object' ? { ...window.RECIPES } : { ...recipeSource };
        window.COOK_NOTE_CATALOG_COMPLETE = true;
        setRecipeSource(nextRecipes);
        setCatalogChunksLoaded(true);
        setFullRecipeCatalogLoaded(true);
        resolve(nextRecipes);
      };
      script.onerror = () => {
        fullRecipeLoadRef.current = null;
        reject(new Error('Chargement du catalogue complet impossible.'));
      };
      document.head.appendChild(script);
    });

    return fullRecipeLoadRef.current;
  }

  function preloadRecipe(id) {
    const target = recipesById[id] || (window.RECIPES && window.RECIPES[id]);
    if (target && isMasterRecipe(target)) return loadDeferredCatalogChunks();
    if (target) return loadRecipeDetails(id);
    return loadDeferredCatalogChunks().then(nextRecipes => {
      const loaded = nextRecipes?.[id] || (window.RECIPES && window.RECIPES[id]);
      if (!loaded || isMasterRecipe(loaded)) return loaded || null;
      return loadRecipeDetails(id);
    });
  }

  function openShoppingBasket() {
    setShoppingOpen(true);
    loadDeferredCatalogChunks().catch(() => {});
  }

  function restoreRecipeVersion(entry) {
    if (!activeId || !entry?.recipe) return;
    const next = { ...recipeOverrides, [activeId]: entry };
    setRecipeOverrides(next);
    writeJson(STORAGE_KEYS.recipeOverrides, next);
  }

  function clearRecipeOverride() {
    if (!activeId) return;
    const next = { ...recipeOverrides };
    delete next[activeId];
    setRecipeOverrides(next);
    writeJson(STORAGE_KEYS.recipeOverrides, next);
  }

  function openRecipe(id) {
    const target = recipesById[id];
    if (!target) return;
    const catalogLoader = isMasterRecipe(target) ? loadDeferredCatalogChunks : () => loadRecipeDetails(id, true);
    catalogLoader().catch(() => {});
    saveCurrentScrollPosition(lastRouteKeyRef.current);
    pendingScrollModeRef.current = 'top';
    if (!activeRecipe) {
      homeScrollRef.current = window.scrollY || 0;
      sessionStorage.setItem(STORAGE_KEYS.homeScroll, String(homeScrollRef.current));
    }
    restoreHomeScrollRef.current = false;
    if (!isMasterRecipe(target)) {
      rememberRecipeVisit(id);
    }
    // Le defilement en haut se fait apres la capture de l'ancien etat : la carte
    // cliquee part de sa vraie position.
    const resetRecipeScroll = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    runViewTransition(() => {
      setActivePage('home');
      setTargetTechniqueId('');
      setActiveId(id);
      setOnlyFavorites(false);
      setFavoriteCollection('');
    }, {
      sourceId: id,
      returnId: activeId || '',
      after: () => {
        resetRecipeScroll();
        requestAnimationFrame(() => requestAnimationFrame(resetRecipeScroll));
        window.setTimeout(resetRecipeScroll, 80);
      }
    });
    const nextUrl = getRecipeUrl(id);
    if (window.location.pathname + window.location.search !== nextUrl) {
      history.pushState('', document.title, nextUrl);
    }
    lastRouteKeyRef.current = currentScrollRouteKey();
  }

  function goHome() {
    saveCurrentScrollPosition(lastRouteKeyRef.current);
    pendingScrollModeRef.current = 'top';
    restoreHomeScrollRef.current = false;
    setSeason('');
    setSeasonCategory('');
    setTagFilter('');
    setQuery('');
    const resetHomeScroll = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    runViewTransition(() => {
      setActivePage('home');
      setTargetTechniqueId('');
      setOnlyFavorites(false);
      setFavoriteCollection('');
      setActiveId(null);
    }, {
      returnId: activeId || '',
      after: () => {
        resetHomeScroll();
        requestAnimationFrame(() => requestAnimationFrame(resetHomeScroll));
        window.setTimeout(resetHomeScroll, 80);
      }
    });
    history.pushState('', document.title, '/');
    lastRouteKeyRef.current = currentScrollRouteKey();
  }

  function showFavorites() {
    loadDeferredCatalogChunks().catch(() => {});
    saveCurrentScrollPosition(lastRouteKeyRef.current);
    pendingScrollModeRef.current = 'top';
    runViewTransition(() => {
      setActivePage('home');
      setTargetTechniqueId('');
      setOnlyFavorites(true);
      setFavoriteCollection('');
      setActiveId(null);
    });
    history.pushState('', document.title, '/?view=__favs__');
    lastRouteKeyRef.current = currentScrollRouteKey();
    setTimeout(() => document.getElementById('recettes')?.scrollIntoView({ behavior: 'smooth' }), 0);
  }

  function goTechniques() {
    saveCurrentScrollPosition(lastRouteKeyRef.current);
    pendingScrollModeRef.current = 'top';
    restoreHomeScrollRef.current = false;
    runViewTransition(() => {
      setActivePage('techniques');
      setTargetTechniqueId('');
      setActiveId(null);
      setOnlyFavorites(false);
    });
    history.pushState('', document.title, '/techniques');
    lastRouteKeyRef.current = currentScrollRouteKey();
  }

  function openTechnique(id) {
    saveCurrentScrollPosition(lastRouteKeyRef.current);
    pendingScrollModeRef.current = 'none';
    restoreHomeScrollRef.current = false;
    runViewTransition(() => {
      setActivePage('techniques');
      setTargetTechniqueId(id);
      setActiveId(null);
      setOnlyFavorites(false);
    });
    history.pushState('', document.title, `/techniques#${encodeURIComponent(id)}`);
    lastRouteKeyRef.current = currentScrollRouteKey();
  }

  function updateSearchQuery(value) {
    if (String(value || '').trim()) loadDeferredCatalogChunks().catch(() => {});
    setQuery(value);
  }

  function openSearch() {
    if (String(query || '').trim()) loadDeferredCatalogChunks().catch(() => {});
    setCommandOpen(false);
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 0);
  }

  function openCommandPalette() {
    loadDeferredCatalogChunks().catch(() => {});
    setSearchOpen(false);
    setCommandOpen(true);
    setTimeout(() => commandRef.current?.focus(), 0);
  }

  function markMenuPlannerReturnState(enabled) {
    const currentState = (history.state && typeof history.state === 'object') ? history.state : {};
    history.replaceState({ ...currentState, menuPlannerOpen: Boolean(enabled) }, document.title, window.location.href);
  }

  function openMenuPlanner() {
    loadDeferredCatalogChunks().catch(() => {});
    markMenuPlannerReturnState(false);
    setMenuPlannerOpen(true);
  }

  function closeMenuPlanner() {
    markMenuPlannerReturnState(false);
    setMenuPlannerOpen(false);
  }

  function openMenuRecipe(id) {
    markMenuPlannerReturnState(true);
    setMenuPlannerOpen(false);
    openRecipe(id);
  }

  useEffect(() => {
    const handleLocation = event => {
      saveCurrentScrollPosition(lastRouteKeyRef.current);
      const recipe = getInitialRecipe();
      const page = getPathPage();
      const technique = page === 'techniques' ? getInitialTechnique() : '';
      pendingScrollModeRef.current = page === 'techniques' && technique ? 'none' : 'restore';
      lastRouteKeyRef.current = currentScrollRouteKey();
      if (recipe && !activeId) {
        homeScrollRef.current = Math.max(window.scrollY || 0, homeScrollRef.current || 0);
        restoreHomeScrollRef.current = false;
      }
      runViewTransition(() => {
        setActivePage(page);
        setTargetTechniqueId(technique);
        const view = new URLSearchParams(window.location.search).get('view');
        setOnlyFavorites(view === '__favs__');
        setActiveId(recipe);
        setMenuPlannerOpen(Boolean(event?.state?.menuPlannerOpen));
      }, { sourceId: recipe || '', returnId: activeId || '' });
      if (!recipe && page === 'home') restoreHomeScrollRef.current = false;
    };
    window.addEventListener('hashchange', handleLocation);
    window.addEventListener('popstate', handleLocation);
    return () => {
      window.removeEventListener('hashchange', handleLocation);
      window.removeEventListener('popstate', handleLocation);
    };
  }, [activeId]);

  useEffect(() => {
    if (activeRecipe || !restoreHomeScrollRef.current) return;
    restoreHomeScrollRef.current = false;
    const top = homeScrollRef.current || 0;
    let attempts = 0;
    const restore = () => {
      window.scrollTo({ top, behavior: 'auto' });
      attempts += 1;
      if (attempts < 8 && Math.abs((window.scrollY || 0) - top) > 2) requestAnimationFrame(restore);
    };
    requestAnimationFrame(() => requestAnimationFrame(restore));
  }, [activeRecipe]);

  useEffect(() => {
    const handleGoto = event => {
      const target = event.target.closest('[data-goto]');
      if (!target) return;
      const id = target.getAttribute('data-goto');
      if (!recipesById[id]) return;
      event.preventDefault();
      openRecipe(id);
    };
    document.addEventListener('click', handleGoto);
    return () => document.removeEventListener('click', handleGoto);
  }, [recipesById]);

  useEffect(() => {
    const handleKey = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openCommandPalette();
        return;
      }
      if (event.key === 'Escape') {
        if (commandOpen) {
          setCommandOpen(false);
          return;
        }
        if (searchOpen) {
          setSearchOpen(false);
          return;
        }
        if (preferencesOpen) {
          setPreferencesOpen(false);
          return;
        }
        if (shoppingOpen) {
          setShoppingOpen(false);
          return;
        }
        if (menuPlannerOpen) {
          closeMenuPlanner();
          return;
        }
        // Une fenetre <dialog> ouverte ou le mode cuisine gerent Echap eux-memes.
        if (document.querySelector('dialog.modal-backdrop[open]') || document.documentElement.classList.contains('cook-mode-open')) return;
        if ((activeRecipe || activePage === 'techniques') && !isTypingTarget(event.target)) goHome();
        return;
      }
      if (isTypingTarget(event.target)) return;
      if (activeRecipe && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        undo();
        return;
      }
      if (activeRecipe && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        redo();
        return;
      }
      if (event.key.toLowerCase() === 'h') {
        goHome();
        return;
      }
      if (activeRecipe && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        const index = catalogRecipes.findIndex(recipe => recipe.id === activeRecipe.id);
        if (index === -1 || !catalogRecipes.length) return;
        const nextIndex = event.key === 'ArrowLeft'
          ? (index - 1 + catalogRecipes.length) % catalogRecipes.length
          : (index + 1) % catalogRecipes.length;
        openRecipe(catalogRecipes[nextIndex].id);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeRecipe, activePage, catalogRecipes, canUndo, canRedo, commandOpen, searchOpen, preferencesOpen, shoppingOpen, menuPlannerOpen]);

  if (!recipes.length) {
    return h('div', { className: 'mc-shell' },
      h('main', { className: 'fatal-state' },
        h('h1', null, 'Recettes introuvables'),
        h('p', null, 'Le fichier de recettes doit définir window.RECIPES avant app.js.')
      )
    );
  }

  const filterProps = {
    seasons: allSeasons,
    season,
    setSeason: updateSeason,
    seasonCategory,
    setSeasonCategory,
    seasonCategoryOptions
  };
  const missingRecipeId = activeId && !activeRecipe ? activeId : '';
  const catalogResolvingRecipe = Boolean(missingRecipeId && !catalogChunksLoaded);
  const shellClassName = [
    'mc-shell',
    activeTheme === 'light' ? 'theme-light' : 'theme-dark',
    preferences.density === 'compact' ? 'display-compact' : '',
    preferences.largeText ? 'display-large-text' : '',
    preferences.reduceMotion ? 'display-reduce-motion' : ''
  ].filter(Boolean).join(' ');
  const ambientRecipe = activeRecipe || filteredRecipes[0] || homeCatalogRecipes[0] || recipes[0];
  const shellStyle = { '--ambient-accent': getCategoryColor(ambientRecipe) };

  return h('div', {
    className: shellClassName,
    style: shellStyle,
    'data-app-mode': 'standard',
    'data-theme': activeTheme
  },
    // Fond vivant : lumieres lentes animees en transform (compositeur seul).
    h('div', { className: 'ambient-backdrop', 'aria-hidden': 'true' }, h('span')),
    h(TopBarFixed, {
      onHome: goHome,
      showFavorites,
      query,
      openSearch: openCommandPalette,
      openPreferences: () => setPreferencesOpen(true),
      activeTheme,
      toggleTheme,
      homeActive: !activeRecipe && activePage === 'home' && !onlyFavorites,
      searchActive: commandOpen || searchOpen,
      favoritesActive: onlyFavorites
    }),
    h(ScrollProgress),
    h(OfflineStatusBar, { isOnline, favoriteCount: favorites.length }),
    h('a', { className: 'skip-link', href: '#cook-note-content' }, 'Aller au contenu'),
    h('div', { id: 'cook-note-content', className: 'content-anchor', tabIndex: -1 },
    missingRecipeId
      ? (catalogResolvingRecipe
        ? h(CatalogLoadingView)
        : h(NotFoundView, {
          goHome,
          openSearch
        }))
      : activeRecipe
      ? h(RecipeView, {
          recipe: activeRecipe,
          isFavorite: favorites.includes(activeRecipe.id),
          toggleFavorite,
          shoppingIds,
          toggleShopping,
          openShoppingBasket,
          goHome,
          openRecipe,
          recipes: activeRecipes,
          recipesById: activeRecipesById,
          checked,
          setCheckedWithHistory,
          canUndo,
          canRedo,
          undo,
          redo,
           setTagFilter: updateTagFilter,
           openTechnique,
           notify,
           preloadRecipe,
           detailsLoading: Boolean(activeId && recipeDetailsLoading[activeId] && !recipeDetailsById[activeId]),
           equipmentProfile,
           historyEntries: recipeHistory[activeId] || [],
           publishedRecipe: publishedActiveRecipe,
           activeOverride: Boolean(recipeOverrides[activeId]),
           restoreRecipeVersion,
           clearRecipeOverride,
           ensureCatalog: loadDeferredCatalogChunks
        })
      : activePage === 'techniques'
        ? h(TechniquesView, {
            targetTechniqueId,
            goHome
          })
        : h(HomeView, {
          favorites,
          sections,
          recipesById,
          onlyFavorites,
          activeChips,
          favoriteCollection,
          setFavoriteCollection,
          filterProps,
          toggleFavorite,
          openRecipe,
          clearFavoriteView: () => { setOnlyFavorites(false); setFavoriteCollection(''); },
           setTagFilter: updateTagFilter,
           preloadRecipe,
           openSearch,
          openMenuPlanner,
          showFavorites,
          openShoppingBasket,
          openTechniques: goTechniques
        })
    ),
    h('footer', { className: 'site-footer' },
      h('div', { className: 'site-footer-inner' },
        h('div', { className: 'site-footer-identity' },
          h('div', { className: 'site-footer-mark' },
          h('img', { src: '/assets/brand/mark.svg', alt: '', width: 128, height: 128, loading: 'lazy', decoding: 'async' })
          ),
          h('div', { className: 'site-footer-copy' },
          h('p', { className: 'site-footer-brand' }, 'Cook Note \u00a9 2026.'),
          h('p', null, 'Carnet de recettes et techniques culinaires, sur le web et sur Android 5+, par MaruChiwa.')
          )
        ),
        h('div', { className: 'site-footer-stats', 'aria-label': 'Informations catalogue' },
          h('span', { className: 'site-footer-count' }, catalogStats.label),
          h('span', { className: 'site-footer-version' }, `${SITE_VERSION} / ${SITE_UPDATED_AT}`)
        ),
        h('div', { className: 'site-footer-actions', 'aria-label': 'Installer Cook Note' },
          APP_INSTALL_OPTIONS.map(option =>
            h('a', {
              key: option.id,
              className: `site-footer-action site-footer-install site-footer-install-${option.id}`,
              href: option.href,
              'aria-label': `Installer ${option.label} - ${option.detail}`,
              title: `${option.label} - ${option.detail}`
            }, h(Icon, { name: option.kind === 'apk' ? 'download' : 'device' }), h('span', null, option.label), h('small', null, option.detail))
          ),
          h('a', {
            className: 'site-footer-action site-footer-request',
            href: 'mailto:cooknote271@gmail.com?subject=Demande%20d%27ajout%20de%20recette%20Cook%20Note&body=Bonjour%2C%0A%0AJ%27aimerais%20demander%20l%27ajout%20de%20cette%20recette%20dans%20Cook%20Note%20%3A%0A%0ANom%20de%20la%20recette%20%3A%0AIngr%C3%A9dients%20%3A%0A%C3%89tapes%20%3A%0A%0AMerci.'
          }, h(Icon, { name: 'spark' }), h('span', null, 'Demander une recette'), h('small', null, 'Proposer une fiche')),
          h('button', {
            type: 'button',
            className: 'site-footer-action site-footer-top',
            'aria-label': 'Retour en haut de page',
            onClick: () => window.scrollTo({ top: 0, behavior: preferences.reduceMotion ? 'auto' : 'smooth' })
          }, h(Icon, { name: 'arrowUp' }), h('span', null, 'Retour haut'))
        )
      )
    ),
    h(ShoppingBasketPanel, {
      open: shoppingOpen,
      onClose: () => setShoppingOpen(false),
      recipes: shoppingRecipes,
      factorById: shoppingFactors,
      transferUrl: shoppingOpen ? shoppingTransferUrl(shoppingIds, shoppingFactors) : '',
      pantryItems: [],
      removeRecipe: removeShopping,
      clearShopping,
      notify
    }),
    h(MenuPlannerPanel, {
      open: menuPlannerOpen,
      onClose: closeMenuPlanner,
      recipes: searchableRecipes,
      openRecipe: openMenuRecipe,
      addMenuToShopping,
      notify
    }),
    h(PreferencesPanel, {
      open: preferencesOpen,
      onClose: () => setPreferencesOpen(false),
      preferences,
      updatePreferences,
      favoriteCount: favorites.length,
      isOnline,
      offlineBusy,
      offlineProgress,
      preloadFavoritesOffline: preloadFavoriteRecipesOffline,
      exportLocalData,
      importLocalData,
    }),
    h(CommandPalette, {
      open: commandOpen,
      onClose: () => setCommandOpen(false),
      commandRef,
      recipes: searchableRecipes,
      recipesById,
      query,
      setQuery: updateSearchQuery,
      openFullSearch: openSearch,
      openRecipe,
      showFavorites,
      openMenuPlanner,
      openTechniques: goTechniques,
      openShoppingBasket,
      shoppingCount: shoppingRecipes.length
    }),
    h(SearchPanel, {
      open: searchOpen,
      onClose: () => setSearchOpen(false),
      query,
      resultQuery: searchFilterQuery,
      setQuery: updateSearchQuery,
      searchRef,
      results: searchPanelResults,
      resultMeta: searchMeta,
      ingredientMeta,
      openRecipe,
      rememberSearch
    }),
    h(KitchenTimerDock),
    h(ToastStack, { toasts, dismissToast })
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(App));

const scheduleLoadingTimeout = typeof window.setTimeout === 'function'
  ? window.setTimeout.bind(window)
  : (typeof globalThis.setTimeout === 'function' ? globalThis.setTimeout.bind(globalThis) : callback => callback());

function removeLoadingScreen() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;
  if (window.__cookNoteReady && loader.dataset.readyCalled !== 'true') {
    loader.dataset.readyCalled = 'true';
    window.__cookNoteReady();
  }
  scheduleLoadingTimeout(() => document.getElementById('loading-screen')?.remove(), 520);
}

requestAnimationFrame(removeLoadingScreen);
scheduleLoadingTimeout(removeLoadingScreen, 0);

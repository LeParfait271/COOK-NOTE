function RecipeView({
  recipe,
  isFavorite,
  toggleFavorite,
  shoppingIds,
  toggleShopping,
  openShoppingBasket,
  goHome,
  openRecipe,
  recipes,
  recipesById,
  checked,
  setCheckedWithHistory,
  canUndo,
  canRedo,
  undo,
  redo,
  setTagFilter,
  openTechnique,
  notify,
  preloadRecipe = null,
  detailsLoading = false,
  equipmentProfile,
  historyEntries = [],
  publishedRecipe,
  activeOverride = false,
  restoreRecipeVersion,
  clearRecipeOverride,
  ensureCatalog
}) {
  const [factor, setFactor] = useState(1);
  const variantRefs = useMemo(() => (
    getVariantRefs(recipe).length
      ? sortVariantRefs(getLeafVariantRefs(recipe, recipesById), recipesById)
      : []
  ), [recipe.id, recipesById]);
  const showVariants = variantRefs.length > 0;
  const leafRecipeCount = showVariants ? countLeafRecipes(recipe, recipesById) : 0;
  const hasSelectedVariant = !showVariants;
  const inlineTargets = useMemo(() => buildInlineRecipeTargets(recipes), [recipes]);
  const techniqueTargets = useMemo(() => buildTechniqueTargets(), []);
  const detailKey = recipe.id;
  const [shareOpen, setShareOpen] = useState(false);
  const [utilitiesOpen, setUtilitiesOpen] = useState(false);
  const [mobileDetailTab, setMobileDetailTab] = useState('ingredients');
  const [openIngredientGroups, setOpenIngredientGroups] = useState({});
  const mobileSwipeStartRef = useRef(null);
  const pendingInlineVariantScrollRef = useRef(false);
  const completedRef = useRef('');
  const inlineVariantOptions = useMemo(() => getInlineVariantOptions(recipe), [recipe]);
  const needsInlineVariantSelection = inlineVariantOptions.length > 0;
  const selectedInlineVariantGroup = needsInlineVariantSelection
    ? inlineVariantOptions.find(({ index }) => Boolean(openIngredientGroups[`${detailKey}:group:${index}`])) || null
    : null;
  const selectedRecipe = selectedInlineVariantGroup
    ? buildInlineVariantRecipe(recipe, selectedInlineVariantGroup)
    : recipe;
  const hasResolvedRecipe = hasSelectedVariant && (!needsInlineVariantSelection || Boolean(selectedInlineVariantGroup));
  const recipeDetailsReady = !detailsLoading;
  const canShowSteps = hasResolvedRecipe && recipeDetailsReady;
  const displaySteps = canShowSteps ? getRecipeSteps(selectedRecipe) : [];
  const stepScopeKey = selectedInlineVariantGroup ? `${detailKey}:variant-group:${selectedInlineVariantGroup.index}` : detailKey;
  const stepTotal = displaySteps.length;
  const fallbackStepTotal = getRecipeSteps(selectedRecipe).length;
  const effectiveStepTotal = stepTotal || fallbackStepTotal;
  const stepMetaText = needsInlineVariantSelection && !selectedInlineVariantGroup
    ? `${inlineVariantOptions.length} version${inlineVariantOptions.length > 1 ? 's' : ''}`
    : `${effectiveStepTotal} étape${effectiveStepTotal > 1 ? 's' : ''}`;
  const doneSteps = Object.keys(checked).filter(key => key.startsWith(`${stepScopeKey}:step:`) && checked[key]).length;
  const progress = stepTotal ? Math.round((doneSteps / stepTotal) * 100) : 0;
  const canAddToShopping = hasResolvedRecipe && recipeDetailsReady && canShowSteps;
  const shoppingKey = selectedInlineVariantGroup
    ? inlineVariantShoppingKey(detailKey, selectedInlineVariantGroup.index)
    : detailKey;
  const isInShopping = hasSelectedVariant && shoppingIds.includes(shoppingKey);
  const canFavorite = hasResolvedRecipe && recipeDetailsReady && !isMasterRecipe(selectedRecipe);
  const showRecipeUtilities = hasResolvedRecipe && recipeDetailsReady && !isMasterRecipe(selectedRecipe) && !isCategoryCollectionRecipe(selectedRecipe);
  const displayedRecipeTitle = hasResolvedRecipe ? selectedRecipe.title : recipe.title;
  const recipeAllergens = hasResolvedRecipe && recipeDetailsReady ? getRecipeAllergens(selectedRecipe) : [];
  const averageWeights = hasResolvedRecipe && recipeDetailsReady ? getRecipeAverageWeights(selectedRecipe) : [];
  const linkedRecipes = hasResolvedRecipe && recipeDetailsReady ? getLinkedRecipeRefs(selectedRecipe, recipesById) : [];
  const practicalSections = hasResolvedRecipe && recipeDetailsReady ? getRecipePracticalSections(selectedRecipe) : [];
  const displayNotes = hasResolvedRecipe && recipeDetailsReady ? getDisplayNotes(selectedRecipe, practicalSections) : [];
  const flavorMap = hasResolvedRecipe && recipeDetailsReady ? getRecipeFlavorMap(selectedRecipe) : [];
  const ingredientCards = hasResolvedRecipe && recipeDetailsReady ? getRecipeIngredientCards(selectedRecipe) : [];
  const hiddenPracticalKeys = [
    flavorMap.length ? 'pairings' : '',
    ingredientCards.length ? 'ingredientGuide' : ''
  ].filter(Boolean);
  const notesCount = recipeAllergens.length + averageWeights.length + linkedRecipes.length + practicalSections.length + displayNotes.length + flavorMap.length + ingredientCards.length;
  const selectedGroupLabel = selectedInlineVariantGroup?.label || selectedInlineVariantGroup?.group?.group || '';
  const nextStepIndex = displaySteps.findIndex((_, index) => !checked[`${stepScopeKey}:step:${index}`]);
  const mobileTabOrder = ['ingredients', 'steps', 'notes'];

  function handleMobileTabSwipeStart(event) {
    if (!event.touches || event.touches.length !== 1) return;
    mobileSwipeStartRef.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }

  function handleMobileTabSwipeEnd(event) {
    if (!mobileSwipeStartRef.current || !event.changedTouches || event.changedTouches.length !== 1) return;
    const start = mobileSwipeStartRef.current;
    mobileSwipeStartRef.current = null;
    const deltaX = event.changedTouches[0].clientX - start.x;
    const deltaY = event.changedTouches[0].clientY - start.y;
    if (Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY) * 1.35) return;
    setMobileDetailTab(current => {
      const currentIndex = mobileTabOrder.indexOf(current);
      if (currentIndex === -1) return 'ingredients';
      const direction = deltaX < 0 ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(mobileTabOrder.length - 1, currentIndex + direction));
      return mobileTabOrder[nextIndex];
    });
  }

  useEffect(() => {
    setFactor(1);
    completedRef.current = '';
    setMobileDetailTab('ingredients');
    setOpenIngredientGroups({});
    setUtilitiesOpen(false);
  }, [recipe.id]);

  useEffect(() => {
    const requestedKey = getInitialInlineVariantKey();
    const requestedOption = inlineVariantOptions.find(option => option.key === requestedKey);
    setOpenIngredientGroups(requestedOption
      ? { [`${detailKey}:group:${requestedOption.index}`]: true }
      : {});
  }, [detailKey, inlineVariantOptions]);

  useEffect(() => {
    if (!pendingInlineVariantScrollRef.current || !selectedInlineVariantGroup) return undefined;
    pendingInlineVariantScrollRef.current = false;
    const frame = window.requestAnimationFrame(() => scrollToRecipeDetails());
    return () => window.cancelAnimationFrame(frame);
  }, [selectedInlineVariantGroup?.index]);

  useEffect(() => {
    if (!stepTotal || doneSteps !== stepTotal || completedRef.current === stepScopeKey) return;
    completedRef.current = stepScopeKey;
    runConfettiBurst();
  }, [stepScopeKey, doneSteps, stepTotal]);

  function toggle(key) {
    setCheckedWithHistory(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleIngredientGroup(groupKey) {
    setOpenIngredientGroups(prev => {
      const isOpening = !prev[groupKey];
      if (!needsInlineVariantSelection || !isOpening) return { ...prev, [groupKey]: !prev[groupKey] };
      const next = { ...prev };
      inlineVariantOptions.forEach(({ index }) => {
        delete next[`${detailKey}:group:${index}`];
      });
      next[groupKey] = true;
      return next;
    });
  }

  function selectInlineVariant(index) {
    if (selectedInlineVariantGroup?.index === index) {
      scrollToRecipeDetails();
      return;
    }
    const option = inlineVariantOptions.find(item => item.index === index);
    pendingInlineVariantScrollRef.current = Boolean(option && (showVariants || inlineVariantOptions.length > 1));
    setOpenIngredientGroups(prev => {
      const next = { ...prev };
      inlineVariantOptions.forEach(option => {
        delete next[`${detailKey}:group:${option.index}`];
      });
      next[`${detailKey}:group:${index}`] = true;
      return next;
    });
    if (option) {
      window.history.replaceState('', document.title, getInlineVariantUrl(recipe.id, option.key));
    }
  }

  function scrollToRecipeDetails() {
    const target = document.getElementById('recipe-detail-content');
    if (!target) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || document.querySelector('.display-reduce-motion');
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function copyCurrentRecipe() {
    return copyText(recipeExportText(selectedRecipe, factor)).then(() => {
      notify?.(`Fiche copi\u00e9e : ${selectedRecipe.title}`);
    });
  }

  const isCollectionHero = showVariants;
  const heroImage = isCollectionHero
    ? collectionHeroImage(recipe)
    : displayRecipeImage(selectedRecipe || recipe);
  const heroTransitionName = !isCollectionHero && selectedRecipe?.id
    ? recipeViewTransitionName(selectedRecipe.id)
    : '';
  const heroFallbackImage = selectedRecipe?.image && selectedRecipe.image !== heroImage
    ? selectedRecipe.image
    : '';
  const detailAccent = getCategoryColor(selectedRecipe);
  const detailStyle = { '--accent': detailAccent, '--accent-2': detailAccent, '--recipe-image': cssImageValue(heroImage) };

  return h('main', {
    className: detailsLoading ? 'recipe-view is-loading-details' : 'recipe-view',
    style: detailStyle,
    'aria-busy': detailsLoading ? 'true' : undefined,
    onTouchStart: hasResolvedRecipe && recipeDetailsReady ? handleMobileTabSwipeStart : undefined,
    onTouchEnd: hasResolvedRecipe && recipeDetailsReady ? handleMobileTabSwipeEnd : undefined
  },
    h('section', {
      className: heroImage ? (isCollectionHero ? 'recipe-detail-hero has-photo parent-hero' : 'recipe-detail-hero has-photo') : 'recipe-detail-hero',
      style: undefined
    },
      heroImage && h('div', {
        className: 'recipe-detail-hero-media',
        style: heroTransitionName ? { viewTransitionName: heroTransitionName } : undefined,
        'aria-hidden': true
      },
        h('img', {
          className: 'recipe-detail-hero-image',
          src: preferredImageUrl(heroImage),
          'data-original-src': heroImage,
          alt: '',
          loading: 'eager',
          decoding: 'async',
          fetchPriority: 'high',
          draggable: false,
          ...imageSizeAttrs(heroImage),
          onError: event => {
            if (retryOriginalImage(event.currentTarget)) return;
            if (heroFallbackImage && event.currentTarget.src !== new URL(heroFallbackImage, window.location.href).href) {
              event.currentTarget.src = heroFallbackImage;
              return;
            }
            event.currentTarget.hidden = true;
          }
        })
      ),
      h('div', { className: 'detail-hero-copy' },
        h(RecipeBreadcrumb, { recipe, selectedRecipe, showVariants, goHome, openRecipe }),
        h('h1', null, displayedRecipeTitle),
        h('div', { className: 'detail-meta' },
          showVariants
            ? h('span', { key: 'recipes' }, `${leafRecipeCount} recette${leafRecipeCount > 1 ? 's' : ''}`)
            : needsInlineVariantSelection && !selectedInlineVariantGroup
              ? [
                h('span', { key: 'variants' }, `${inlineVariantOptions.length} variante${inlineVariantOptions.length > 1 ? 's' : ''}`),
                h('span', { key: 'choice', className: 'detail-meta-choice-required' }, 'Choix requis pour ouvrir la fiche')
              ]
            : [
              h('span', { key: 'difficulty' }, difficultyText(selectedRecipe)),
              h('span', { key: 'nutri', className: `nutri-score nutri-${getNutriScore(selectedRecipe).toLowerCase()}` }, `Nutri ${getNutriScore(selectedRecipe)}`),
              h('span', { key: 'ingredients' }, `${countIngredients(selectedRecipe)} ingrédients`),
               h('span', { key: 'steps' }, detailsLoading ? t('recipe.loadingShort') : stepMetaText)
            ]
        ),
         hasResolvedRecipe && recipeDetailsReady && !isMasterRecipe(selectedRecipe) && h('div', { className: 'detail-quantity-row' },
          h(QuantityFactorControl, { recipe: selectedRecipe, factor, setFactor, className: 'detail-quantity-control' })
        ),
         hasResolvedRecipe && recipeDetailsReady && h('div', { className: 'detail-actions' },
          h(Button, { variant: 'primary', disabled: !canAddToShopping, onClick: () => canAddToShopping && toggleShopping(shoppingKey, factor) }, isInShopping ? 'Dans les courses' : 'Ajouter aux courses'),
          canFavorite && h(Button, { variant: 'ghost', className: isFavorite ? 'detail-action-button favorite-action active' : 'detail-action-button favorite-action', onClick: () => toggleFavorite(detailKey, selectedRecipe.title), title: isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris', ariaLabel: isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }, h(Icon, { name: 'heart', filled: isFavorite }), h('span', null, 'Favori')),
          showRecipeUtilities && h('details', {
            className: 'detail-utility-menu',
            open: utilitiesOpen,
            onToggle: event => setUtilitiesOpen(event.currentTarget.open)
          },
            h('summary', { className: 'btn btn-ghost detail-action-button', 'aria-label': 'Plus d’actions' }, h(Icon, { name: 'settings' }), h('span', null, 'Plus')),
            h('div', { className: 'detail-utility-popover' },
              h(Button, { variant: 'ghost', className: 'detail-utility-item', onClick: () => copyCurrentRecipe().finally(() => setUtilitiesOpen(false)) }, h(Icon, { name: 'copy' }), h('span', null, 'Copier fiche')),
              h(Button, { variant: 'ghost', className: 'detail-utility-item', onClick: () => {
                setUtilitiesOpen(false);
                setShareOpen(true);
              } }, h(Icon, { name: 'share' }), h('span', null, 'Partager')),
              selectedRecipe.video && h('a', { className: 'btn btn-ghost detail-utility-item', href: selectedRecipe.video, target: '_blank', rel: 'noreferrer' }, h(Icon, { name: 'book' }), h('span', null, 'Voir la vidéo')),
              h(Button, { variant: 'ghost', className: 'detail-utility-item', onClick: () => {
                setUtilitiesOpen(false);
                window.print();
              } }, h(Icon, { name: 'print' }), h('span', null, 'Imprimer'))
            )
          )
        )
      )
    ),
    h('h1', { className: 'print-recipe-heading' }, displayedRecipeTitle),
    showVariants && h(CollectionLinksPanel, {
      parent: recipe,
       variantRefs,
       recipesById,
       openRecipe,
       preloadRecipe
    }),
    hasSelectedVariant && needsInlineVariantSelection && h(InlineVariantPicker, {
      recipe,
      options: inlineVariantOptions,
      selectedIndex: selectedInlineVariantGroup?.index,
      onSelect: selectInlineVariant
    }),
    detailsLoading && h(RecipeDetailLoadingState),
    !detailsLoading && hasResolvedRecipe && !isMasterRecipe(selectedRecipe) && h(RecipeQuickFacts, {
      recipe: selectedRecipe,
      factor,
      stepTotal: effectiveStepTotal,
      needsVariantSelection: needsInlineVariantSelection,
      hasVariantSelection: true
    }),
    !detailsLoading && hasResolvedRecipe && !isMasterRecipe(selectedRecipe) && h(RecipeAnatomy, { recipe: selectedRecipe }),
    !detailsLoading && hasResolvedRecipe && h('div', { className: 'recipe-tabs', role: 'tablist', 'aria-label': 'Sections de la recette' },
      [
        { key: 'ingredients', label: 'Ingrédients', count: countIngredients(selectedRecipe) },
        { key: 'steps', label: 'Étapes', count: effectiveStepTotal },
        { key: 'notes', label: 'Avant', count: notesCount }
      ].map(tab => h('button', {
         key: tab.key,
         type: 'button',
         role: 'tab',
         className: mobileDetailTab === tab.key ? 'active' : '',
        'aria-selected': mobileDetailTab === tab.key,
        'aria-controls': `recipe-panel-${tab.key}`,
        tabIndex: mobileDetailTab === tab.key ? 0 : -1,
        onClick: () => setMobileDetailTab(tab.key)
      }, h('span', null, tab.label), h('small', null, tab.count)))
    ),
    !detailsLoading && hasResolvedRecipe && h('p', { className: 'mobile-swipe-hint' },
      h('span', { 'aria-hidden': true }, '\u2039'),
      ' Glisse pour passer d\u2019un panneau \u00e0 l\u2019autre ',
      h('span', { 'aria-hidden': true }, '\u203a')
    ),
    !detailsLoading && hasResolvedRecipe && h('div', { key: selectedInlineVariantGroup?.key || detailKey, id: 'recipe-detail-content', className: 'recipe-detail-grid' },
      h('section', { id: 'recipe-panel-ingredients', role: 'tabpanel', className: mobileDetailTab === 'ingredients' ? 'recipe-panel ingredients-panel active-tab-panel' : 'recipe-panel ingredients-panel' },
        h('div', { className: 'panel-heading' },
          h('div', null, h('h2', null, 'Ingrédients'))
        ),
        (selectedRecipe.ingredients || []).map((group, groupIndex) => {
          const groupKey = `${detailKey}:group:${groupIndex}`;
          const collapsible = isVariantIngredientGroup(group, selectedRecipe.ingredients || [], selectedRecipe);
          const isSelectedInlineVariant = collapsible && selectedInlineVariantGroup?.index === groupIndex;
          const isOpen = !collapsible || Boolean(openIngredientGroups[groupKey]) || isSelectedInlineVariant;
          return h('div', { className: collapsible ? 'ingredient-group collapsible-ingredient-group' : 'ingredient-group', key: groupKey },
            collapsible
              ? h('button', { type: 'button', className: 'ingredient-group-toggle', onClick: () => toggleIngredientGroup(groupKey), 'aria-expanded': isOpen }, [
                  h('span', { key: 'label' }, group.group || 'Variante'),
                  h('span', { key: 'icon', className: 'ingredient-toggle-icon' }, isOpen ? '\u2212' : '+')
                ])
              : group.recipeId && recipesById[group.recipeId]
                ? h('button', { type: 'button', className: 'ingredient-group-link', onClick: () => openRecipe(group.recipeId) }, group.group || recipesById[group.recipeId].title)
                : h('h3', null, renderLinkedText(group.group || 'Base', inlineTargets, openRecipe, techniqueTargets, openTechnique)),
            isOpen && h('ul', null, (group.items || []).map((item, itemIndex) => {
              const key = `${detailKey}:ingredient:${groupIndex}:${itemIndex}`;
              const plainItem = stripHtml(item).trim();
              const isIngredientSeparator = /^[-\u2013\u2014]{1,2}\s*.+?\s*[-\u2013\u2014]{1,2}$/.test(plainItem);
              return h('li', {
                key,
                className: isIngredientSeparator ? 'ingredient-section-label' : ''
              },
                isIngredientSeparator
                  ? h('span', { className: 'ingredient-section-label' }, renderLinkedText(item, inlineTargets, openRecipe, techniqueTargets, openTechnique))
                  : h('label', null,
                    h('input', { type: 'checkbox', checked: Boolean(checked[key]), onChange: () => toggle(key) }),
                    h('span', null, renderLinkedText(scaleIngredient(item, factor), inlineTargets, openRecipe, techniqueTargets, openTechnique))
                  )
              );
            })),
            isOpen && (group.note || (group.notes || []).length > 0) && h('div', { className: 'ingredient-group-note' },
              group.note && h('p', null, renderLinkedText(group.note, inlineTargets, openRecipe, techniqueTargets, openTechnique)),
              (group.notes || []).map((note, noteIndex) => h('p', { key: `${groupKey}:note:${noteIndex}` }, renderLinkedText(note, inlineTargets, openRecipe, techniqueTargets, openTechnique)))
            )
          );
        })
      ),
      hasSelectedVariant && h('section', { id: 'recipe-panel-steps', role: 'tabpanel', className: mobileDetailTab === 'steps' ? 'recipe-panel steps-panel active-tab-panel' : 'recipe-panel steps-panel' },
        h('div', { className: 'panel-heading' },
          h('div', null, h('h2', null, 'Étapes')),
          h('div', { className: 'steps-panel-tools' },
            needsInlineVariantSelection && selectedGroupLabel && h('span', { className: 'progress-label' }, selectedGroupLabel)
          )
        ),
        canShowSteps && h('div', { className: 'progress-track', role: 'progressbar', 'aria-label': 'Progression de la recette', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': progress }, h('span', { style: { width: `${progress}%` } })),
        canShowSteps && h('div', { className: 'before-start-card' },
          h('div', null,
            h('strong', null, 'Avant de commencer'),
            h('p', null, 'Consulte les notes, allergènes et points techniques avant de lancer la recette.')
          ),
          h('button', { type: 'button', onClick: () => setMobileDetailTab('notes') }, 'Voir les notes')
        ),
        !canShowSteps
          ? h('div', { className: 'choice-empty-state variant-step-empty' },
            h('strong', null, 'Choisis un groupe d’ingrédients'),
            h('p', null, 'Ouvre un groupe d’ingrédients pour afficher les étapes correspondantes.')
          )
          : h('ol', { className: 'step-list' },
          displaySteps.map((step, index) => {
            const key = `${stepScopeKey}:step:${index}`;
             const isNext = nextStepIndex === index;
             return h('li', { key, className: checked[key] ? 'done' : isNext ? 'next' : '', 'aria-current': isNext ? 'step' : undefined },
              h('label', null,
                h('input', { type: 'checkbox', checked: Boolean(checked[key]), onChange: () => toggle(key) }),
                h('span', { className: 'step-number' }, String(index + 1).padStart(2, '0')),
                h('span', { className: 'step-text' }, renderLinkedText(step, inlineTargets, openRecipe, techniqueTargets, openTechnique))
              )
            );
          })
        )
      ),
      hasSelectedVariant && h('aside', { id: 'recipe-panel-notes', role: 'tabpanel', className: mobileDetailTab === 'notes' ? 'recipe-panel notes-panel active-tab-panel' : 'recipe-panel notes-panel' },
        h('div', { className: 'notes-panel-head' },
          h('h2', { className: 'read-before-title' }, 'Avant de commencer')
        ),
        h('div', { className: 'notes-core-stack' },
          h(RecipeHistoryBlock, { recipe: selectedRecipe, updatedAt: SITE_UPDATED_AT }),
          h('div', { className: 'allergen-card', 'aria-label': 'Allergenes detectes' },
            h('p', { className: 'eyebrow' }, 'Allergènes'),
            recipeAllergens.length
              ? h('ul', { className: 'allergen-list', 'aria-label': 'Liste des allergenes detectes' }, recipeAllergens.map(allergen => h('li', { key: `${detailKey}:allergen:${allergen}` }, allergen)))
              : h('p', { className: 'allergen-empty' }, 'Aucun allergène majeur détecté dans les ingrédients.')
          ),
          averageWeights.length > 0 && h('section', { className: 'average-weight-card notes-static-card', 'aria-label': 'Poids moyens utiles' },
            h('p', { className: 'eyebrow' }, 'Poids moyens'),
            h('dl', { 'aria-label': 'Correspondances de poids moyens' }, averageWeights.map(item =>
              h(React.Fragment, { key: `${detailKey}:average:${item.label}` },
                h('dt', null, item.label),
                h('dd', null, item.value)
              )
            ))
          ),
          h(PrepTimelineBlock, { recipe: selectedRecipe })
        ),
        h('div', { className: 'notes-optional-stack' },
          h(NotesFamily, { title: 'Servir' },
            h(FlavorMapBlock, { recipe: selectedRecipe }),
            h(PracticalSectionsBlock, { sections: practicalSections, inlineTargets, openRecipe, techniqueTargets, openTechnique, hiddenKeys: hiddenPracticalKeys, onlyKeys: PRACTICAL_FAMILIES.serve }),
            h(LinkedRecipesBlock, { links: linkedRecipes, openRecipe })
          ),
          h(NotesFamily, { title: 'Conserver' },
            h(PracticalSectionsBlock, { sections: practicalSections, inlineTargets, openRecipe, techniqueTargets, openTechnique, hiddenKeys: hiddenPracticalKeys, onlyKeys: PRACTICAL_FAMILIES.keep }),
            h(ByproductBlock, { recipe: selectedRecipe, recipes, ensureCatalog, openRecipe, Disclosure: NotesDisclosure })
          ),
          h(NotesFamily, { title: 'Maîtriser' },
            h(PracticalSectionsBlock, { sections: practicalSections, inlineTargets, openRecipe, techniqueTargets, openTechnique, hiddenKeys: hiddenPracticalKeys, onlyKeys: PRACTICAL_FAMILIES.master }),
            h(IngredientKnowledgeBlock, { recipe: selectedRecipe }),
            displayNotes.length > 0 && h(NotesDisclosure, { className: 'free-notes-block', label: 'Notes', ariaLabel: 'Notes de la recette', preview: displayNotes[0] },
              h('ul', null, displayNotes.map((note, index) => h('li', { key: `${detailKey}:note:${index}` }, renderLinkedText(sanitizeNoteHtml(note), inlineTargets, openRecipe, techniqueTargets, openTechnique))))
            ),
            (selectedRecipe.technical || recipe.technical || []).length > 0 && h(NotesDisclosure, { className: 'technical-card', label: 'Fiche technique', ariaLabel: 'Fiche technique de la recette', preview: (selectedRecipe.technical || recipe.technical || []).map(item => item.label || item.title || '').filter(Boolean).join(', ') },
              h('dl', { 'aria-label': 'Points techniques' }, (selectedRecipe.technical || recipe.technical || []).map((item, index) =>
                h(React.Fragment, { key: `${detailKey}:technical:${index}` },
                  h('dt', null, renderLinkedText(item.label || item.title || 'Point clé', inlineTargets, openRecipe, techniqueTargets, openTechnique)),
                  h('dd', null, renderLinkedText(item.value || item.text || '', inlineTargets, openRecipe, techniqueTargets, openTechnique))
                )
              ))
            ),
            h(EquipmentProfileBlock, { requiredEquipment: getRecipeEquipment(selectedRecipe), profile: equipmentProfile, Disclosure: NotesDisclosure }),
            h(MoldCalculatorBlock, { recipe: selectedRecipe, profile: equipmentProfile, Disclosure: NotesDisclosure })
          )
        )
      )
    ),
    !detailsLoading && hasResolvedRecipe && !isMasterRecipe(selectedRecipe) && h(RecipeSafetySources, { recipe: selectedRecipe }),
    showRecipeUtilities && h(SharePanel, {
      open: shareOpen,
      onClose: () => setShareOpen(false),
      recipe: selectedRecipe,
      shareUrl: selectedInlineVariantGroup
        ? `${window.location.origin}${getInlineVariantUrl(recipe.id, selectedInlineVariantGroup.key)}`
        : '',
      notify
    })
  );
}


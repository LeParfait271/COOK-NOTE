// Ajout aux courses : une vignette du plat file en arc jusqu'au bouton, qui
// emet une onde doree. Rien en mouvement reduit ou sans Web Animations.
function playAddToShoppingEffect(button, hero) {
  if (!button?.animate || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const target = button.getBoundingClientRect();
  const image = hero?.querySelector('.recipe-detail-hero-image');
  const source = image?.getBoundingClientRect();
  const imageUrl = image?.currentSrc || image?.getAttribute('src') || '';
  if (source && imageUrl && source.bottom > 0) {
    const size = 64;
    const startX = Math.min(Math.max(source.left + source.width * 0.7, size), window.innerWidth - size) - size / 2;
    const startY = Math.max(source.top + Math.min(source.height, window.innerHeight) * 0.4, size) - size / 2;
    const endX = target.left + target.width / 2 - size / 2;
    const endY = target.top + target.height / 2 - size / 2;
    const flyer = document.createElement('div');
    flyer.className = 'shopping-flyer';
    flyer.setAttribute('aria-hidden', 'true');
    flyer.style.backgroundImage = `url("${imageUrl}")`;
    document.body.appendChild(flyer);
    const lift = Math.min(160, Math.abs(endY - startY) * 0.6 + 60);
    flyer.animate([
      { transform: `translate(${startX}px, ${startY}px) scale(1)`, opacity: 0 },
      { transform: `translate(${startX}px, ${startY}px) scale(1)`, opacity: 1, offset: 0.12 },
      { transform: `translate(${(startX + endX) / 2}px, ${Math.min(startY, endY) - lift}px) scale(0.75)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${endX}px, ${endY}px) scale(0.2)`, opacity: 0.2 }
    ], { duration: 720, easing: 'cubic-bezier(.55, 0, .35, 1)' }).finished.finally(() => flyer.remove());
  }
  button.animate([
    { boxShadow: '0 0 0 0 color-mix(in oklch, var(--ds-gold) 70%, transparent)' },
    { boxShadow: '0 0 0 16px color-mix(in oklch, var(--ds-gold) 0%, transparent)' }
  ], { duration: 640, delay: 560, easing: 'ease-out' });
}

// Quantite qui « defile » quand on change le nombre de portions : chaque nombre
// glisse de l'ancienne a la nouvelle valeur (texte reel, lisible et copiable).
// Le DOM est ecrit directement pendant l'animation : aucun rendu React par image.
const QUANTITY_NUMBER_RE = /\d+(?:[.,]\d+)?/g;

function formatRollingNumber(value, decimals) {
  return decimals ? value.toFixed(decimals).replace('.', ',') : String(Math.round(value));
}

function RollingQuantity({ text, className }) {
  const ref = useRef(null);
  const shownRef = useRef('');
  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const from = shownRef.current;
    shownRef.current = text;
    const fromNumbers = from.match(QUANTITY_NUMBER_RE) || [];
    const toNumbers = text.match(QUANTITY_NUMBER_RE) || [];
    const sameShape = Boolean(from) && fromNumbers.length > 0 && fromNumbers.length === toNumbers.length
      && from.replace(QUANTITY_NUMBER_RE, '#') === text.replace(QUANTITY_NUMBER_RE, '#');
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || document.querySelector('.display-reduce-motion');
    if (!sameShape || from === text || reduceMotion) {
      element.textContent = text;
      return undefined;
    }
    const parse = value => Number(value.replace(',', '.'));
    const decimals = toNumbers.map(value => (value.split(/[.,]/)[1] || '').length);
    const parts = text.split(QUANTITY_NUMBER_RE);
    const startedAt = performance.now();
    let frame = 0;
    element.classList.add('is-rolling');
    const tick = time => {
      const progress = Math.min(1, (time - startedAt) / 420);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = progress >= 1
        ? text
        : parts.reduce((out, part, index) => out + part + (index < toNumbers.length
          ? formatRollingNumber(parse(fromNumbers[index]) + (parse(toNumbers[index]) - parse(fromNumbers[index])) * eased, decimals[index])
          : ''), '');
      if (progress < 1) frame = requestAnimationFrame(tick);
      else element.classList.remove('is-rolling');
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      element.textContent = text;
      element.classList.remove('is-rolling');
    };
  }, [text]);
  return h('span', { ref, className });
}

const INGREDIENT_SEPARATOR_RE = /^[-–—]{1,2}\s*.+?\s*[-–—]{1,2}$/;

function isIngredientSeparator(item) {
  return INGREDIENT_SEPARATOR_RE.test(stripHtml(item).trim());
}

// Mode mains libres : une etape a la fois, en grand, ecran maintenu allume,
// pilotable a la voix des l'ouverture (micro allume d'office). Facultatif :
// la fiche reste la lecture de reference. « Suivante » coche l'etape.
function CookingMode({
  title, steps, startIndex, isDone, markDone, unmarkDone, stepIngredients, allIngredients,
  recipe, factor, setFactor, equipment = [], techniqueTargets = [], onClose
}) {
  const total = steps.length;
  const [index, setIndex] = useState(Math.min(Math.max(startIndex, 0), Math.max(total - 1, 0)));
  const [direction, setDirection] = useState('forward');
  const [awake, setAwake] = useState(false);
  const [voice, setVoice] = useState(Boolean(SPEECH_RECOGNITION));
  const [paused, setPaused] = useState(false);
  // Panneau a la place de l'etape : tous les ingredients, materiel, technique.
  const [panel, setPanel] = useState(null);
  const [voiceNote, setVoiceNote] = useState(null);
  const overlayRef = useRef(null);
  const closeRef = useRef(null);
  const swipeRef = useRef(null);
  const stageRef = useRef(null);
  const fitRef = useRef(null);
  // Etapes cochees pendant la session, pour « annule ».
  const doneHistoryRef = useRef([]);
  const shell = document.querySelector('.mc-shell') || document.body;

  const go = next => {
    if (next < 0 || next >= total) return;
    setDirection(next > index ? 'forward' : 'backward');
    setIndex(next);
  };
  const advance = () => {
    if (!isDone(index)) doneHistoryRef.current.push(index);
    markDone(index);
    if (index >= total - 1) onClose();
    else go(index + 1);
  };
  const undoLast = () => {
    const last = doneHistoryRef.current.pop();
    if (last === undefined) return -1;
    unmarkDone(last);
    return last;
  };
  const actionsRef = useRef({ advance, go, index, onClose, panel });
  actionsRef.current = { advance, go, index, onClose, panel };

  const note = (text, tone = 'ok', duration = 2500) => setVoiceNote({ text, tone, duration, at: Date.now() });
  const handsFree = useHandsFree(voice, command => {
    // En pause, seul « reprends » est entendu.
    if (paused && command.type !== 'listenResume') return;
    if (command.type === 'listenResume') setPaused(false);
    runCookVoiceCommand(command, {
      index, total, steps, title, go, advance, undoLast, onClose, note, setPanel, setPaused,
      setEnabled: setVoice, recipe, factor, setFactor, allIngredients, techniqueTargets
    });
  });

  useEffect(() => {
    if (!voiceNote) return undefined;
    const timer = window.setTimeout(() => setVoiceNote(null), voiceNote.duration);
    return () => window.clearTimeout(timer);
  }, [voiceNote]);
  useEffect(() => {
    if (!voice) setPaused(false);
  }, [voice]);

  // Mots de la recette ajoutes au vocabulaire ecoute (minuteur nomme).
  useEffect(() => {
    setVoiceVocabulary(allIngredients().flatMap(group => group.items.map(item => item.name)));
  }, [recipe]);

  // Confidentialite et autorisation du micro : affichees tant que le micro
  // n'est pas autorise durablement (« Autoriser cette fois » les fait revenir).
  useEffect(() => {
    if (!SPEECH_RECOGNITION) return undefined;
    let active = true;
    const show = () => {
      if (active) setPanel(current => current || { type: 'privacy' });
    };
    try {
      navigator.permissions.query({ name: 'microphone' })
        .then(status => { if (status.state !== 'granted') show(); })
        .catch(show);
    } catch {
      show();
    }
    return () => { active = false; };
  }, []);

  // Ecoute en capture et arret de la propagation : Echap ferme le panneau ouvert,
  // sinon le mode mains libres, sans declencher le raccourci global (Echap =
  // retour a l'accueil).
  useEffect(() => {
    const onKey = event => {
      const actions = actionsRef.current;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (actions.panel) setPanel(null);
        else actions.onClose();
      } else if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault();
        event.stopImmediatePropagation();
        setPanel(null);
        actions.advance();
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        event.stopImmediatePropagation();
        setPanel(null);
        actions.go(actions.index - 1);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, []);

  // Page inerte et figee dessous ; le focus revient au bouton d'ouverture.
  useEffect(() => {
    const previousFocus = document.activeElement;
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    html.classList.add('cook-mode-open');
    const siblings = Array.from(shell.children).filter(element => element !== overlayRef.current && !element.classList.contains('kitchen-timer-dock') && !element.inert);
    siblings.forEach(element => { element.inert = true; });
    closeRef.current?.focus();
    return () => {
      html.style.overflow = previousOverflow;
      html.classList.remove('cook-mode-open');
      siblings.forEach(element => { element.inert = false; });
      previousFocus?.focus?.();
    };
  }, []);

  // Ecran allume (Wake Lock), redemande au retour sur l'onglet.
  useEffect(() => {
    let lock = null;
    let active = true;
    const request = async () => {
      if (!navigator.wakeLock || document.visibilityState !== 'visible') return;
      try {
        lock = await navigator.wakeLock.request('screen');
        if (!active) {
          lock.release().catch(() => {});
          return;
        }
        setAwake(true);
        lock.addEventListener('release', () => setAwake(false));
      } catch {
        setAwake(false);
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') request();
    };
    request();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      active = false;
      document.removeEventListener('visibilitychange', onVisibility);
      lock?.release?.().catch(() => {});
    };
  }, []);

  // Plein ecran reel sur les ecrans tactiles (barre du navigateur masquee).
  // On ne quitte que le plein ecran qu'on a soi-meme demande.
  useEffect(() => {
    const root = document.documentElement;
    let requested = false;
    if (window.matchMedia?.('(pointer: coarse)').matches && document.fullscreenEnabled && !document.fullscreenElement && root.requestFullscreen) {
      requested = true;
      root.requestFullscreen({ navigationUI: 'hide' }).catch(() => { requested = false; });
    }
    return () => {
      if (requested && document.fullscreenElement === root) document.exitFullscreen().catch(() => {});
    };
  }, []);

  const step = steps[index] || '';
  const ingredients = stepIngredients(index);
  const techniques = stepTechniques(step, techniqueTargets);
  useFitToBox(stageRef, fitRef, [index, panel, factor]);
  const listening = voice && handsFree.status === 'listening';
  const suggestions = listening ? voiceSuggestions({
    step,
    index,
    total,
    paused,
    panel,
    timers: kitchenTimersLeft().length > 0,
    techniques: techniques.length > 0,
    temperature: Boolean(stepTemperature(step))
  }) : [];
  const ingredientRow = item => h('li', { key: item.key },
    item.quantity && h('strong', null, frenchUnitSpacing(item.quantity)),
    item.quantity ? ' ' : '',
    h('span', null, item.name)
  );
  const panelTitle = {
    ingredients: 'Tous les ingrédients',
    equipment: 'Matériel',
    privacy: 'Pilotez la recette à la voix'
  }[panel?.type] || (panel?.techniques?.length > 1 ? 'Techniques de l’étape' : panel?.techniques?.[0]?.title);
  const micReady = handsFree.status === 'listening';
  const panelView = panel && h('article', { key: `panel-${panel.type}`, className: `cook-mode-panel is-${panel.type}` },
    h('header', { className: 'cook-mode-panel-head' },
      h('h2', null, panelTitle),
      h('button', { type: 'button', className: 'cook-mode-panel-ok', onClick: () => setPanel(null) }, 'OK')
    ),
    panel.type === 'privacy' && h(React.Fragment, null,
      h('p', { className: 'cook-mode-panel-lead' }, 'Dites « suivant », « minuteur 10 minutes » ou « voir les ingrédients » : Cook Note suit la recette sans que vous touchiez l’écran.'),
      h('ul', { className: 'cook-mode-privacy' },
        h('li', null, h('strong', null, 'Tout reste sur votre appareil. '), 'Ce que vous dites est analysé directement sur ce téléphone ou cet ordinateur : rien n’est enregistré, rien n’est envoyé sur Internet.'),
        h('li', null, h('strong', null, 'Aucun usage commercial. '), 'Cook Note ne conserve, ne partage et ne revend aucune donnée vocale.'),
        h('li', null, h('strong', null, 'Autoriser le micro. '), 'Quand le navigateur le demande, choisissez « Autoriser ». Avec « Autoriser cette fois », ce message reviendra à la prochaine ouverture.')
      ),
      h('p', { className: `cook-mode-privacy-status is-${micReady ? 'ready' : handsFree.status}` },
        micReady
          ? h(React.Fragment, null, h('span', { className: 'cook-mode-voice-ok', 'aria-hidden': 'true' }, '✓'), 'Micro autorisé : dites « ok » pour commencer.')
          : handsFree.status === 'error'
            ? 'Le micro n’est pas disponible : voir le message ci-dessus.'
            : handsFree.status === 'loading'
              ? handsFree.message
              : 'En attente de l’autorisation du micro…')
    ),
    panel.type === 'ingredients' && allIngredients().map(group => h('section', { key: group.key, className: 'cook-mode-panel-group' },
      group.title && h('h3', null, group.title),
      h('ul', { className: 'cook-mode-ingredients' }, group.items.map(ingredientRow))
    )),
    panel.type === 'equipment' && (equipment.length
      ? h('ul', { className: 'cook-mode-ingredients' }, equipment.map(item => h('li', { key: item }, h('span', null, item))))
      : h('p', { className: 'cook-mode-panel-empty' }, 'Pas de matériel particulier.')),
    panel.type === 'technique' && panel.techniques.map(guide => h('section', { key: guide.id, className: 'cook-mode-panel-group' },
      panel.techniques.length > 1 && h('h3', null, guide.title),
      guide.description && h('p', { className: 'cook-mode-panel-lead' }, guide.description),
      (guide.steps || []).length > 0 && h('ol', { className: 'cook-mode-panel-steps' }, guide.steps.map((item, position) => h('li', { key: position }, item))),
      guide.tip && h('p', { className: 'cook-mode-panel-tip' }, h('strong', null, 'Astuce : '), guide.tip)
    ))
  );

  return ReactDOM.createPortal(h('div', {
    ref: overlayRef,
    className: 'cook-mode',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': `Mode mains libres : ${title}`,
    onTouchStart: event => {
      if (event.touches.length === 1) swipeRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    },
    onTouchEnd: event => {
      const start = swipeRef.current;
      swipeRef.current = null;
      if (panel || !start || event.changedTouches.length !== 1) return;
      const deltaX = event.changedTouches[0].clientX - start.x;
      const deltaY = event.changedTouches[0].clientY - start.y;
      if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY) * 1.4) return;
      if (deltaX < 0) advance();
      else go(index - 1);
    }
  },
    h('header', { className: 'cook-mode-head' },
      h('div', { className: 'cook-mode-title' },
        h('small', null, 'Mode mains libres'),
        h('strong', null, title)
      ),
      h('span', { className: 'cook-mode-count' }, `Étape ${index + 1} / ${total}`),
      // Micro allume d'office ; ce bouton ne sert qu'a le couper ou le rallumer.
      SPEECH_RECOGNITION && h('button', {
        type: 'button',
        className: voice ? 'cook-mode-voice is-on' : 'cook-mode-voice',
        'aria-pressed': voice,
        'aria-label': voice ? 'Couper le micro' : 'Rallumer le micro',
        title: voice ? 'Couper le micro' : 'Rallumer le micro',
        onClick: () => setVoice(!voice)
      }, h(Icon, { name: 'mic' })),
      h('button', { ref: closeRef, type: 'button', className: 'cook-mode-close', onClick: onClose, 'aria-label': 'Quitter le mode mains libres' }, h(Icon, { name: 'close' }))
    ),
    voice && h('div', { className: `cook-mode-voice-hint is-${paused ? 'paused' : voiceNote ? voiceNote.tone : handsFree.status}`, role: 'status' },
      handsFree.status === 'error'
        ? h(React.Fragment, null,
          h('span', null, handsFree.message),
          handsFree.retry && h('button', { type: 'button', className: 'cook-mode-voice-retry', onClick: handsFree.retry }, 'Réessayer'))
        : paused
          ? h(React.Fragment, null, h('span', { className: 'cook-mode-voice-ok', 'aria-hidden': 'true' }, '❚❚'), 'En pause : dites « reprends »')
          : voiceNote
            ? h(React.Fragment, null, h('span', { className: 'cook-mode-voice-ok', 'aria-hidden': 'true' }, voiceNote.tone === 'info' ? 'i' : '✓'), voiceNote.text)
            : handsFree.status === 'listening'
              ? h(React.Fragment, null,
                h('span', { className: 'cook-mode-voice-dot', 'aria-hidden': 'true' }),
                handsFree.heard ? `Entendu : « ${handsFree.heard} »` : 'À l’écoute')
              : handsFree.status === 'loading'
                ? handsFree.message
                : 'Activation du micro…'
    ),
    h('div', { className: 'cook-mode-progress', 'aria-hidden': 'true' },
      steps.map((_, stepIndex) => h('span', { key: stepIndex, className: stepIndex === index ? 'is-current' : (isDone(stepIndex) ? 'is-done' : '') }))
    ),
    // Jamais de defilement : le contenu se reduit jusqu'a tenir (useFitToBox).
    h('div', { className: 'cook-mode-stage', ref: stageRef },
      h('div', { className: 'cook-mode-fit', ref: fitRef },
      panelView || h('article', { key: index, className: `cook-mode-step is-${direction}`, 'aria-live': 'polite' },
        h('span', { className: 'cook-mode-number', 'aria-hidden': 'true' }, String(index + 1).padStart(2, '0')),
        h('p', { className: 'cook-mode-text' }, withKitchenTimers(stripHtml(step), title)),
        ingredients.length > 0 && h('ul', { className: 'cook-mode-ingredients', 'aria-label': 'Ingrédients de cette étape' }, ingredients.map(ingredientRow)),
        techniques.length > 0 && h('button', { type: 'button', className: 'cook-mode-technique', onClick: () => setPanel({ type: 'technique', techniques }) },
          h(Icon, { name: 'book' }),
          `Technique : ${techniques.map(guide => guide.title).join(', ')}`
        ),
        isDone(index) && h('p', { className: 'cook-mode-done' }, '✓ Étape déjà faite')
      ))
    ),
    // Aide integree : les commandes utiles a cet instant, sans fenetre.
    suggestions.length > 0 && h('p', { className: 'cook-mode-say', 'aria-label': 'Commandes vocales utiles' },
      h('span', { className: 'cook-mode-say-label' }, 'Dites'),
      suggestions.map(item => h('span', { key: item, className: 'cook-mode-say-item' }, `« ${item} »`))
    ),
    h('footer', { className: 'cook-mode-nav' },
      h('button', { type: 'button', className: 'cook-mode-prev', disabled: index === 0, onClick: () => { setPanel(null); go(index - 1); } },
        h(Icon, { name: 'arrowLeft' }),
        h('span', null, 'Précédente')
      ),
      awake && h('span', { className: 'cook-mode-awake' }, 'Écran maintenu allumé'),
      h('button', { type: 'button', className: 'cook-mode-next', onClick: () => { setPanel(null); advance(); } },
        h('span', null, index >= total - 1 ? 'Terminer' : 'Étape suivante'),
        h(Icon, { name: 'arrowRight' })
      )
    )
  ), shell);
}

function RecipeView({
  recipe,
  isFavorite,
  favorites = [],
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
  const heroRef = useRef(null);
  // Survol ou focus d'une etape (ou d'un ingredient) : met en relief l'autre colonne.
  const [linkFocus, setLinkFocus] = useState(null);
  const [topbarSlot, setTopbarSlot] = useState(null);
  const [heroOutOfView, setHeroOutOfView] = useState(false);
  const [cookModeOpen, setCookModeOpen] = useState(false);
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

  // Raccourci « Mode mains libres » de l'icone installee : la derniere fiche s'ouvre
  // directement en mode mains libres, une fois ses etapes chargees.
  useEffect(() => {
    if (!canShowSteps || !stepTotal) return;
    try {
      if (sessionStorage.getItem('cook_note_open_cook_mode') !== '1') return;
      sessionStorage.removeItem('cook_note_open_cook_mode');
    } catch {
      return;
    }
    setCookModeOpen(true);
  }, [canShowSteps, stepTotal]);
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
  const stepsByIngredient = useMemo(() => {
    if (!canShowSteps) return {};
    const stepWords = displaySteps.map(step => new Set(ingredientLinkWords(step)));
    const links = {};
    (selectedRecipe.ingredients || []).forEach((group, groupIndex) => (group.items || []).forEach((item, itemIndex) => {
      const parts = splitIngredientQuantity(stripHtml(item));
      const words = ingredientLinkWords(parts ? parts.name : item);
      const steps = stepWords.reduce((found, set, index) => (words.some(word => set.has(word)) ? [...found, index] : found), []);
      if (steps.length) links[`${detailKey}:ingredient:${groupIndex}:${itemIndex}`] = steps;
    }));
    return links;
  }, [stepScopeKey, canShowSteps]);
  const isIngredientLinked = key => linkFocus?.type === 'step' && Boolean(stepsByIngredient[key]?.includes(linkFocus.index));
  const isStepLinked = index => linkFocus?.type === 'ingredient' && Boolean(stepsByIngredient[linkFocus.key]?.includes(index));
  const linkHandlers = (focus, enabled = true) => (enabled ? {
    onMouseEnter: () => setLinkFocus(focus),
    onMouseLeave: () => setLinkFocus(null),
    onFocus: () => setLinkFocus(focus),
    onBlur: () => setLinkFocus(null)
  } : {});
  const nextStepIndex = displaySteps.findIndex((_, index) => !checked[`${stepScopeKey}:step:${index}`]);
  const mobileTabOrder = ['ingredients', 'steps', 'notes'];
  // Ingredients visibles (groupes ouverts, sans les intertitres) : jauge « prets ».
  const visibleIngredientKeys = [];
  if (hasResolvedRecipe && recipeDetailsReady) {
    (selectedRecipe.ingredients || []).forEach((group, groupIndex) => {
      const collapsible = isVariantIngredientGroup(group, selectedRecipe.ingredients || [], selectedRecipe);
      const isOpen = !collapsible || Boolean(openIngredientGroups[`${detailKey}:group:${groupIndex}`]) || selectedInlineVariantGroup?.index === groupIndex;
      if (!isOpen) return;
      (group.items || []).forEach((item, itemIndex) => {
        if (!isIngredientSeparator(item)) visibleIngredientKeys.push(`${detailKey}:ingredient:${groupIndex}:${itemIndex}`);
      });
    });
  }
  const readyIngredients = visibleIngredientKeys.filter(key => checked[key]).length;

  function stepIngredients(stepIndex) {
    return Object.entries(stepsByIngredient)
      .filter(([, steps]) => steps.includes(stepIndex))
      .map(([key]) => {
        const [groupIndex, itemIndex] = key.split(':').slice(-2).map(Number);
        const item = selectedRecipe.ingredients?.[groupIndex]?.items?.[itemIndex];
        if (!item) return null;
        const text = stripHtml(scaleIngredient(item, factor));
        const parts = splitIngredientQuantity(text);
        return { key, quantity: parts ? parts.quantity : '', name: parts ? parts.name : text };
      })
      .filter(Boolean);
  }

  function markStepDone(stepIndex) {
    setCheckedWithHistory(prev => ({ ...prev, [`${stepScopeKey}:step:${stepIndex}`]: true }));
  }

  function unmarkStepDone(stepIndex) {
    setCheckedWithHistory(prev => ({ ...prev, [`${stepScopeKey}:step:${stepIndex}`]: false }));
  }

  // Tous les ingredients des groupes ouverts, quantites ajustees (mode mains
  // libres : voir les ingredients).
  function allIngredients() {
    if (!hasResolvedRecipe || !recipeDetailsReady) return [];
    return (selectedRecipe.ingredients || []).map((group, groupIndex) => {
      const collapsible = isVariantIngredientGroup(group, selectedRecipe.ingredients || [], selectedRecipe);
      const isOpen = !collapsible || Boolean(openIngredientGroups[`${detailKey}:group:${groupIndex}`]) || selectedInlineVariantGroup?.index === groupIndex;
      if (!isOpen) return null;
      const items = (group.items || [])
        .filter(item => !isIngredientSeparator(item))
        .map((item, itemIndex) => {
          const text = stripHtml(scaleIngredient(item, factor));
          const parts = splitIngredientQuantity(text);
          return { key: `${groupIndex}:${itemIndex}`, quantity: parts ? parts.quantity : '', name: parts ? parts.name : text };
        });
      return items.length ? { key: String(groupIndex), title: stripHtml(group.group || ''), items } : null;
    }).filter(Boolean);
  }

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

  // Titre de la fiche dans la barre du haut des que le hero sort de l'ecran.
  useEffect(() => {
    setTopbarSlot(document.getElementById('topbar-context'));
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || typeof IntersectionObserver !== 'function') return undefined;
    const observer = new IntersectionObserver(([entry]) => setHeroOutOfView(!entry.isIntersecting), { rootMargin: '-72px 0px 0px 0px' });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [recipe.id]);

  // Impression : les blocs replies d'Avant de commencer s'ouvrent le temps
  // d'imprimer (un <details> ferme n'imprime pas son contenu), puis se referment.
  useEffect(() => {
    let reopened = [];
    const beforePrint = () => {
      reopened = Array.from(document.querySelectorAll('.notes-panel details:not([open])'));
      reopened.forEach(details => { details.open = true; });
    };
    const afterPrint = () => {
      reopened.forEach(details => { details.open = false; });
      reopened = [];
    };
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);
    return () => {
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
    };
  }, []);

  useEffect(() => {
    // Recherche « … pour 6 » : la fiche s'ouvre directement a 6 convives.
    const requested = typeof takeRequestedServings === 'function' ? takeRequestedServings() : 0;
    const servingInfo = requested ? getServingInfo(recipe) : null;
    setFactor(servingInfo?.base ? requested / servingInfo.base : 1);
    completedRef.current = '';
    setMobileDetailTab('ingredients');
    setOpenIngredientGroups({});
    setUtilitiesOpen(false);
    setCookModeOpen(false);
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

  // Ingredient en deux colonnes : quantite alignee a gauche, nom a droite.
  function renderIngredientLine(text) {
    const parts = splitIngredientQuantity(text);
    if (!parts) return h('span', { className: 'ingredient-line no-quantity' }, h('span', { className: 'ingredient-name' }, h('span', { className: 'strike-text' }, renderLinkedText(text, inlineTargets, openRecipe, techniqueTargets, openTechnique))));
    // L'espace entre les colonnes garde une lecture continue (lecteur d'ecran, copie).
    return h('span', { className: 'ingredient-line' },
      h(RollingQuantity, { className: 'ingredient-qty', text: frenchUnitSpacing(parts.quantity) }),
      ' ',
      h('span', { className: 'ingredient-name' }, h('span', { className: 'strike-text' }, renderLinkedText(parts.name, inlineTargets, openRecipe, techniqueTargets, openTechnique)))
    );
  }

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
  // Image de la carte (deja chargee depuis la grille) : floutee sous le hero en
  // attendant la grande image, qui se precise ensuite en fondu.
  // Fiche maitre : l'image d'accueil est deja en cache, et l'art de la carte
  // ne doit pas apparaitre dessous.
  const heroPlaceholder = heroImage && !isCollectionHero ? recipeCardImageUrl(heroImage) : '';
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
    topbarSlot && ReactDOM.createPortal(h('button', {
      type: 'button',
      className: heroOutOfView ? 'topbar-recipe-title is-visible' : 'topbar-recipe-title',
      'aria-hidden': heroOutOfView ? undefined : 'true',
      tabIndex: heroOutOfView ? 0 : -1,
      title: 'Revenir en haut de la fiche',
      onClick: () => window.scrollTo({ top: 0, behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    }, h('span', null, displayedRecipeTitle)), topbarSlot),
    h('section', {
      ref: heroRef,
      className: heroImage ? (isCollectionHero ? 'recipe-detail-hero has-photo parent-hero' : 'recipe-detail-hero has-photo') : 'recipe-detail-hero',
      style: undefined
    },
      heroImage && h('div', {
        className: 'recipe-detail-hero-media',
        style: heroPlaceholder ? { '--hero-placeholder': cssImageValue(heroPlaceholder) } : undefined,
        'aria-hidden': true
      },
        h('img', {
          key: heroImage,
          className: 'recipe-detail-hero-image',
          ref: markLoadedImage,
          onLoad: event => {
            if (!event.currentTarget.dataset.loaded) event.currentTarget.dataset.loaded = 'true';
          },
          src: preferredImageUrl(heroImage),
          srcSet: !isCollectionHero && heroSrcSet ? heroSrcSet(heroImage) || undefined : undefined,
          sizes: '100vw',
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
      h('div', { key: displayedRecipeTitle, className: 'detail-hero-copy' },
        h(RecipeBreadcrumb, { recipe, selectedRecipe, showVariants, goHome, openRecipe }),
        h('h1', null, displayedRecipeTitle),
        h('div', { className: 'detail-meta' },
          showVariants
            ? h('span', { key: 'recipes' }, `${leafRecipeCount} recette${leafRecipeCount > 1 ? 's' : ''}`)
            : needsInlineVariantSelection && !selectedInlineVariantGroup
              ? h('span', { key: 'variants' }, `${inlineVariantOptions.length} variante${inlineVariantOptions.length > 1 ? 's' : ''}`)
            : [
              h('span', { key: 'difficulty' }, difficultyText(selectedRecipe)),
              // Nutri-Score : une pastille comme les autres (en orange, il sonnait
              // comme un avertissement sur presque toutes les fiches).
              getNutriScore(selectedRecipe) && h('span', { key: 'nutri', title: 'Nutri-Score estimé' }, `Nutri-Score ${getNutriScore(selectedRecipe)}`),
              h('span', { key: 'ingredients' }, `${countIngredients(selectedRecipe)} ingrédients`),
               h('span', { key: 'steps' }, detailsLoading ? t('recipe.loadingShort') : stepMetaText)
            ]
        ),
         // Parts et actions sur une seule rangee (les parts etaient seules sur leur ligne).
         hasResolvedRecipe && recipeDetailsReady && h('div', { className: 'detail-actions' },
          !isMasterRecipe(selectedRecipe) && h(QuantityFactorControl, { recipe: selectedRecipe, factor, setFactor, className: 'detail-quantity-control', stepper: true }),
          h(Button, {
              variant: 'primary',
              className: isInShopping ? 'is-in-shopping' : '',
              disabled: !canAddToShopping,
              onClick: event => {
                if (!canAddToShopping) return;
                if (!isInShopping) playAddToShoppingEffect(event.currentTarget, heroRef.current);
                toggleShopping(shoppingKey, factor);
              }
            }, isInShopping ? '✓ Dans les courses' : 'Ajouter aux courses'),
          canShowSteps && stepTotal > 0 && h(Button, { variant: 'ghost', className: 'detail-action-button cook-mode-action', onClick: () => setCookModeOpen(true), title: 'Mode mains libres : une étape à la fois, pilotable à la voix, écran allumé', ariaLabel: 'Ouvrir le mode mains libres' }, h(Icon, { name: 'mic' }), h('span', null, 'Mode mains libres')),
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
       preloadRecipe,
       favorites,
       toggleFavorite
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
    !detailsLoading && hasResolvedRecipe && !isMasterRecipe(selectedRecipe) && h(RecipeAnatomy, {
      recipe: selectedRecipe,
      variantOptions: needsInlineVariantSelection ? inlineVariantOptions : [],
      selectedIndex: selectedInlineVariantGroup?.index,
      onSelectVariant: selectInlineVariant
    }),
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
          h('div', null, h('h2', null, 'Ingrédients')),
          visibleIngredientKeys.length > 1 && h('div', {
            className: readyIngredients === visibleIngredientKeys.length ? 'ingredient-progress is-complete' : 'ingredient-progress',
            role: 'progressbar',
            'aria-label': 'Ingrédients prêts',
            'aria-valuemin': 0,
            'aria-valuemax': visibleIngredientKeys.length,
            'aria-valuenow': readyIngredients
          },
            h('span', { className: 'ingredient-progress-label' }, `${readyIngredients}/${visibleIngredientKeys.length} prêts`),
            h('span', { className: 'ingredient-progress-track' },
              h('span', { style: { transform: `scaleX(${readyIngredients / visibleIngredientKeys.length})` } })
            )
          )
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
              const separator = isIngredientSeparator(item);
              return h('li', {
                key,
                className: separator ? 'ingredient-section-label' : (isIngredientLinked(key) ? 'is-linked' : ''),
                ...linkHandlers({ type: 'ingredient', key }, !separator && Boolean(stepsByIngredient[key]))
              },
                separator
                  ? h('span', { className: 'ingredient-section-label' }, renderLinkedText(item, inlineTargets, openRecipe, techniqueTargets, openTechnique))
                  : h('label', null,
                    h('input', { type: 'checkbox', checked: Boolean(checked[key]), onChange: () => toggle(key) }),
                    renderIngredientLine(scaleIngredient(item, factor))
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
          h('div', null, h('h2', null, 'Étapes'))
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
             const stepClass = [checked[key] ? 'done' : isNext ? 'next' : '', isStepLinked(index) ? 'is-linked' : ''].filter(Boolean).join(' ');
             return h('li', { key, className: stepClass, 'aria-current': isNext ? 'step' : undefined, ...linkHandlers({ type: 'step', index }) },
              h('label', null,
                h('input', { type: 'checkbox', checked: Boolean(checked[key]), onChange: () => toggle(key) }),
                h('span', { className: 'step-number' }, String(index + 1).padStart(2, '0')),
                h('span', { className: 'step-text' }, h('span', { className: 'strike-text' }, withKitchenTimers(renderLinkedText(step, inlineTargets, openRecipe, techniqueTargets, openTechnique), displayedRecipeTitle)))
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
                h('dd', null, frenchUnitSpacing(item.value))
              )
            ))
          ),
          h(PrepTimelineBlock, { recipe: selectedRecipe })
        ),
        h(NotesFamilyTabs, { resetKey: detailKey },
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
            displayNotes.length > 0 && h(NotesDisclosure, { className: 'free-notes-block', label: 'Notes', ariaLabel: 'Notes de la recette' },
              h('ul', null, displayNotes.map((note, index) => h('li', { key: `${detailKey}:note:${index}` }, renderLinkedText(sanitizeNoteHtml(note), inlineTargets, openRecipe, techniqueTargets, openTechnique))))
            ),
            (selectedRecipe.technical || recipe.technical || []).length > 0 && h(NotesDisclosure, { className: 'technical-card', label: 'Fiche technique', ariaLabel: 'Fiche technique de la recette' },
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
        ),
        // Version de la fiche : mention discrete en pied de colonne.
        h(RecipeHistoryBlock, { recipe: selectedRecipe, updatedAt: SITE_UPDATED_AT })
      )
    ),
    !detailsLoading && hasResolvedRecipe && !isMasterRecipe(selectedRecipe) && h(RecipeSafetySources, { recipe: selectedRecipe }),
    cookModeOpen && canShowSteps && stepTotal > 0 && h(CookingMode, {
      title: displayedRecipeTitle,
      steps: displaySteps,
      startIndex: nextStepIndex === -1 ? 0 : nextStepIndex,
      isDone: stepIndex => Boolean(checked[`${stepScopeKey}:step:${stepIndex}`]),
      markDone: markStepDone,
      unmarkDone: unmarkStepDone,
      stepIngredients,
      allIngredients,
      recipe: selectedRecipe,
      factor,
      setFactor,
      equipment: getRecipeEquipment(selectedRecipe),
      techniqueTargets,
      onClose: () => setCookModeOpen(false)
    }),
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


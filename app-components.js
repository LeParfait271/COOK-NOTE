function Button(props) {
  const className = ['btn', props.variant ? `btn-${props.variant}` : '', props.className || '']
    .filter(Boolean)
    .join(' ');
  return h('button', {
    type: props.type || 'button',
    className,
    onClick: props.onClick,
    disabled: props.disabled,
    title: props.title,
    'aria-label': props.ariaLabel,
    'aria-pressed': props.pressed,
    'aria-current': props.current
  }, props.children);
}

const ICON_PATHS = {
  home: [
    'M3.5 11.2 12 4l8.5 7.2',
    'M5.8 10.2V20h12.4v-9.8',
    'M9.4 20v-5.6h5.2V20'
  ],
  search: [
    'M10.8 18.2a7.4 7.4 0 1 1 0-14.8 7.4 7.4 0 0 1 0 14.8Z',
    'M16.2 16.2 21 21'
  ],
  heart: [
    'M20.3 5.9c-1.8-1.9-4.8-1.9-6.6 0L12 7.6l-1.7-1.7c-1.8-1.9-4.8-1.9-6.6 0-1.9 2-1.9 5.1 0 7.1L12 21l8.3-8c1.9-2 1.9-5.1 0-7.1Z'
  ],
  basket: [
    'M6.5 9.2h11L16.7 20H7.3L6.5 9.2Z',
    'M9 9.2 12 4l3 5.2',
    'M8.4 13h7.2',
    'M8.7 16.4h6.6'
  ],
  pantry: [
    'M5 5.2h14v15H5z',
    'M5 9.2h14',
    'M12 5.2v15',
    'M8.1 12.4h1.2',
    'M14.7 12.4h1.2',
    'M8.1 16h1.2',
    'M14.7 16h1.2'
  ],
  book: [
    'M5 4.8h7a3 3 0 0 1 3 3V20H8a3 3 0 0 0-3-3V4.8Z',
    'M19 4.8h-4a3 3 0 0 0-3 3V20h4a3 3 0 0 1 3-3V4.8Z',
    'M8 8h3',
    'M8 11h3'
  ],
  spark: [
    'M12 3l1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9L12 3Z',
    'M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z'
  ],
  share: [
    'M14 4h6v6',
    'M20 4 11 13',
    'M11 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5'
  ],
  print: [
    'M7 8V4h10v4',
    'M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2',
    'M7 14h10v7H7z'
  ],
  copy: [
    'M8 8h10v12H8z',
    'M6 16H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2',
    'M11 12h4',
    'M11 16h3'
  ],
  download: [
    'M12 4v10',
    'M7 10l5 5 5-5',
    'M5 19h14'
  ],
  device: [
    'M8 2.8h8a2 2 0 0 1 2 2v14.4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4.8a2 2 0 0 1 2-2Z',
    'M10 5.8h4',
    'M11 18.2h2'
  ],
  arrowUp: [
    'M12 20V5',
    'M6 11l6-6 6 6'
  ],
  focus: [
    'M9 4H5a1 1 0 0 0-1 1v4',
    'M15 4h4a1 1 0 0 1 1 1v4',
    'M20 15v4a1 1 0 0 1-1 1h-4',
    'M9 20H5a1 1 0 0 1-1-1v-4',
    'M9 12h6'
  ],
  settings: [
    'M4 7h10',
    'M18 7h2',
    'M14 7a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z',
    'M4 17h2',
    'M10 17h10',
    'M6 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z'
  ],
  sun: [
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
    'M12 2.8V5',
    'M12 19v2.2',
    'M4.2 4.2l1.6 1.6',
    'M18.2 18.2l1.6 1.6',
    'M2.8 12H5',
    'M19 12h2.2',
    'M4.2 19.8l1.6-1.6',
    'M18.2 5.8l1.6-1.6'
  ],
  moon: [
    'M20.5 14.8A7.8 7.8 0 0 1 9.2 3.5 8.7 8.7 0 1 0 20.5 14.8Z'
  ],
  cocktail: [
    'M5 4h14l-5.5 7.2h-3L5 4Z',
    'M12 11.2V20',
    'M8.5 20h7'
  ],
  leaf: [
    'M19.5 4.5C12 4.2 6.2 7.2 5 14.8c4.4 1 8.7-.3 11.5-3.8 1.7-2.1 2.6-4.4 3-6.5Z',
    'M5 19c2.8-4.8 6.4-8 11.5-10.2'
  ],
  cloche: [
    'M4 16.5h16',
    'M6 16.5a6 6 0 0 1 12 0',
    'M12 7.5V5',
    'M10.5 5h3'
  ],
  sprig: [
    'M6 20c3.2-5.9 7-10.2 12-14',
    'M8.2 14.7c-2.9.2-4.3-1.2-4.2-4.1 2.8-.2 4.3 1.2 4.2 4.1Z',
    'M13 10c-.1-2.9 1.3-4.4 4.2-4.5.1 2.9-1.3 4.4-4.2 4.5Z'
  ],
  cake: [
    'M5 11h14v9H5z',
    'M5 15c2 1.4 4 .1 7 0s5 1.4 7 0',
    'M9 11V7',
    'M15 11V7',
    'M8.2 6.8 9 5l.8 1.8',
    'M14.2 6.8 15 5l.8 1.8'
  ],
  cup: [
    'M5 8h11v7.5A4.5 4.5 0 0 1 11.5 20h-2A4.5 4.5 0 0 1 5 15.5V8Z',
    'M16 10h1.5a2.5 2.5 0 0 1 0 5H16',
    'M8 4.8c0 1 .8 1.2.8 2.2',
    'M12 4.8c0 1 .8 1.2.8 2.2'
  ],
  drop: [
    'M12 3.5s6 6.7 6 10.5a6 6 0 0 1-12 0c0-3.8 6-10.5 6-10.5Z',
    'M9 15.2c.5 1.2 1.4 1.8 2.8 2'
  ],
  mortar: [
    'M5 11h14c-.4 5.5-2.8 8.2-7 8.2S5.4 16.5 5 11Z',
    'M15.5 10.8 20 5.5',
    'M18.2 4.3 21 6.7'
  ],
  close: [
    'M6 6l12 12',
    'M18 6 6 18'
  ],
  timer: [
    'M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
    'M12 9v4l2.6 1.6',
    'M10 2.8h4',
    'M12 2.8V5'
  ],
  arrowLeft: [
    'M20 12H5',
    'M11 6l-6 6 6 6'
  ],
  arrowRight: [
    'M4 12h15',
    'M13 6l6 6-6 6'
  ]
};

function Icon({ name, filled = false }) {
  return h('svg', {
    className: 'site-icon',
    viewBox: '0 0 24 24',
    'aria-hidden': 'true',
    focusable: 'false'
  },
    (ICON_PATHS[name] || []).map(path => h('path', {
      key: path,
      d: path,
      fill: filled ? 'currentColor' : 'none',
      stroke: 'currentColor',
      strokeWidth: '1.9',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    }))
  );
}

function ingredientAvailabilityGroup(meta) {
  const missingCount = meta?.missing?.length || 0;
  if (missingCount === 0) return { key: 'all', label: 'Tu as tout', order: 0 };
  if (missingCount === 1) return { key: 'missing-1', label: 'Il manque 1 ingrédient', order: 1 };
  if (missingCount === 2) return { key: 'missing-2', label: 'Il manque 2 ingrédients', order: 2 };
  return { key: 'missing-3', label: `Il manque ${missingCount} ingrédients`, order: 3 + missingCount };
}

function useDebouncedValue(value, delay = 180) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function useMediaQuery(query) {
  const getMatch = () => Boolean(window.matchMedia?.(query).matches);
  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    const media = window.matchMedia?.(query);
    if (!media) return undefined;
    const update = () => setMatches(media.matches);
    update();
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }
    media.addListener?.(update);
    return () => media.removeListener?.(update);
  }, [query]);

  return matches;
}

function ScrollProgress() {
  const progressRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, window.scrollY / scrollable));
      progressRef.current?.style.setProperty('--scroll-progress', String(progress));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return h('div', { ref: progressRef, className: 'scroll-progress', 'aria-hidden': true });
}

// Bascule jour/nuit : le nouveau theme se devoile en cercle depuis le bouton
// (View Transitions). Sans support ou en mouvement reduit, bascule immediate.
function revealThemeToggle(event, activeTheme, toggleTheme) {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (typeof document.startViewTransition !== 'function' || reduceMotion) {
    toggleTheme();
    return;
  }
  const rect = event.currentTarget.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.style.setProperty('--theme-reveal-x', `${x}px`);
  root.style.setProperty('--theme-reveal-y', `${y}px`);
  root.style.setProperty('--theme-reveal-r', `${Math.ceil(radius)}px`);
  root.classList.add('theme-reveal');
  // toggleTheme applique le theme et rend React de facon synchrone (flushSync).
  const transition = document.startViewTransition(() => toggleTheme());
  transition.finished.finally(() => root.classList.remove('theme-reveal'));
}

function TopBarFixed({ onHome, showFavorites, query, openSearch, openPreferences, activeTheme, toggleTheme, homeActive = false, searchActive = false, favoritesActive = false }) {
  const themeToggleLabel = activeTheme === 'light' ? 'Passer en mode nuit' : 'Passer en mode jour';

  return h('header', { className: 'topbar' },
    h('div', { className: 'top-left' },
      h(Button, { variant: 'subtle', className: homeActive ? 'icon-square active' : 'icon-square', onClick: onHome, title: 'Accueil', ariaLabel: 'Accueil', current: homeActive ? 'page' : undefined }, h(Icon, { name: 'home' }))
    ),
    // Emplacement central : la fiche ouverte y affiche son titre au defilement.
    h('div', { className: 'top-actions', id: 'topbar-context' }),
    h('div', { className: 'top-right' },
      h(Button, {
        variant: 'ghost',
        className: query.trim() || searchActive ? 'top-search-button icon-square active' : 'top-search-button icon-square',
        onClick: openSearch,
        title: 'Rechercher',
        ariaLabel: 'Rechercher',
        pressed: Boolean(query.trim() || searchActive)
      }, h(Icon, { name: 'search' })),
      h(Button, {
        variant: 'ghost',
        className: favoritesActive ? 'top-fav-btn icon-square active' : 'top-fav-btn icon-square',
        onClick: showFavorites,
        title: 'Voir les favoris',
        ariaLabel: 'Voir les favoris',
        pressed: favoritesActive,
        current: favoritesActive ? 'page' : undefined
      }, h(Icon, { name: 'heart' })),
      h(Button, {
        variant: 'ghost',
        className: 'theme-toggle-btn icon-square',
        onClick: event => revealThemeToggle(event, activeTheme, toggleTheme),
        title: themeToggleLabel,
        ariaLabel: themeToggleLabel,
        pressed: activeTheme === 'light'
      }, h(Icon, { name: activeTheme === 'light' ? 'moon' : 'sun' })),
      h(Button, {
        variant: 'ghost',
        className: 'top-settings-btn icon-square',
        onClick: openPreferences,
        title: 'Préférences d’affichage',
        ariaLabel: 'Préférences d’affichage'
      }, h(Icon, { name: 'settings' }))
    )
  );
}

// Logo principal « Cook Note » (lettrage clin d'oeil a Death Note, blanc cerne
// de noir avec halo) sur le decor des chateaux, sans pictogramme accole ni filet
// decoratif (COOK_NOTE_RULES.md, section 5). Le texte reste pour les lecteurs
// d'ecran.
const BRAND_WORDMARK_IMAGE = '/assets/brand/cook-note-white.png';

function Hero() {
  const dayArt = isDayArtTheme();
  return h('section', { className: dayArt ? 'hero hero-day-art' : 'hero' },
    h('span', { className: 'hero-atmosphere hero-atmosphere-glow', 'aria-hidden': true }),
    h('span', { className: 'hero-atmosphere hero-atmosphere-mist', 'aria-hidden': true }),
    h('div', { className: 'hero-inner' },
      h('p', { className: 'hero-system-label' }, t('home.heroSystemLabel')),
      h('h1', { className: 'hero-wordmark' },
        h('img', {
          className: 'hero-wordmark-image',
          src: preferredImageUrl(BRAND_WORDMARK_IMAGE),
          'data-original-src': BRAND_WORDMARK_IMAGE,
          alt: '',
          width: 948,
          height: 302,
          decoding: 'async',
          fetchPriority: 'high',
          draggable: false,
          onError: event => retryOriginalImage(event.currentTarget)
        }),
        h('span', { className: 'sr-only' }, 'Cook Note')
      )
    )
  );
}

function ActiveChips({ chips }) {
  if (!chips.length) return null;
  return h('div', { className: 'active-chips', 'aria-label': 'Filtres actifs' },
    chips.map(chip => h('button', {
      key: chip.key,
      type: 'button',
      onClick: chip.clear,
      title: `Retirer le filtre ${chip.label}`,
      'aria-label': `Retirer le filtre ${chip.label}`
    }, `${chip.label} ×`))
  );
}

const WARMED_HERO_IMAGES = new Set();

// Image deja en cache : `load` a pu partir avant React. On la marque `cached`
// des son montage (affichee sans fondu) ; `onLoad` marque `true` (fondu).
function markLoadedImage(img) {
  if (img && !img.dataset.loaded && img.complete && img.naturalWidth > 0) img.dataset.loaded = 'cached';
}

// ---------- Minuteurs de cuisine ----------
// Les durees ecrites dans les etapes (« 25min », « 2h30 à 3h ») deviennent des
// boutons. Un intervalle donne la borne basse : on verifie tot, on prolonge.
const KITCHEN_TIMER_EVENT = 'cook-note:kitchen-timer';
const KITCHEN_TIMER_STORAGE = 'cook_note_kitchen_timers';
const KITCHEN_TIMER_MAX_SECONDS = 4 * 3600;
const KITCHEN_TIMER_LIMIT = 4;
const DURATION_UNIT = '(h(?:eures?)?|min(?:utes?)?|secondes?|sec|s)';
// Le prefixe capture remplace un lookbehind (absent des Safari anciens).
const DURATION_RE = new RegExp(`(^|[^\\d,.])((?:(\\d+)(?:\\s*${DURATION_UNIT}(?:\\s?(\\d{1,2}))?)?\\s*(?:à|-|–)\\s*)?(\\d+)\\s*${DURATION_UNIT}(\\d{1,2})?)(?![\\p{L}\\d])`, 'giu');
let kitchenAudio = null;

function durationSeconds(value, unit, sub) {
  const amount = Number(value) || 0;
  const extra = Number(sub) || 0;
  const key = String(unit || '').toLowerCase();
  if (key.startsWith('h')) return amount * 3600 + extra * 60;
  if (key.startsWith('m')) return amount * 60 + extra;
  return amount;
}

function findStepDurations(text) {
  const found = [];
  String(text || '').replace(DURATION_RE, (match, prefix, duration, lowValue, lowUnit, lowSub, value, unit, sub, offset) => {
    const seconds = lowValue
      ? durationSeconds(lowValue, lowUnit || unit, lowSub)
      : durationSeconds(value, unit, sub);
    if (seconds >= 5 && seconds <= KITCHEN_TIMER_MAX_SECONDS) found.push({ index: offset + prefix.length, text: duration, seconds });
    return match;
  });
  return found;
}

function formatTimerClock(seconds) {
  const total = Math.max(0, Math.ceil(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = String(total % 60).padStart(2, '0');
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${rest}` : `${minutes}:${rest}`;
}

// Le son ne peut demarrer qu'apres un geste : on prepare l'audio au clic.
function unlockKitchenAudio() {
  try {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    kitchenAudio = kitchenAudio || new AudioCtor();
    if (kitchenAudio.state === 'suspended') kitchenAudio.resume().catch(() => {});
  } catch {
    kitchenAudio = null;
  }
}

function playKitchenChime() {
  const context = kitchenAudio;
  if (!context) return;
  const start = context.currentTime + 0.02;
  [880, 880, 1175].forEach((frequency, index) => {
    const at = start + index * 0.34;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.22, at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.3);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(at);
    oscillator.stop(at + 0.32);
  });
}

function startKitchenTimer({ seconds, label, title = '' }) {
  if (!seconds) return;
  unlockKitchenAudio();
  window.dispatchEvent(new CustomEvent(KITCHEN_TIMER_EVENT, { detail: { seconds, label, title } }));
}

// Texte d'etape : chaque duree devient un bouton minuteur. Seules les chaines
// de premier niveau sont decoupees ; les liens restent intacts.
function withKitchenTimers(content, title = '') {
  const split = text => {
    const durations = findStepDurations(text);
    if (!durations.length) return text;
    const nodes = [];
    let cursor = 0;
    durations.forEach(duration => {
      if (duration.index > cursor) nodes.push(text.slice(cursor, duration.index));
      nodes.push(h('button', {
        key: `timer-${duration.index}`,
        type: 'button',
        className: 'kitchen-timer-chip',
        'aria-label': `Lancer un minuteur de ${formatTimerClock(duration.seconds)} (${duration.text})`,
        onClick: event => {
          event.preventDefault();
          event.stopPropagation();
          startKitchenTimer({ seconds: duration.seconds, label: duration.text, title });
        }
      }, h(Icon, { name: 'timer' }), duration.text));
      cursor = duration.index + duration.text.length;
    });
    if (cursor < text.length) nodes.push(text.slice(cursor));
    return nodes;
  };
  // renderLinkedText renvoie des fragments imbriques : on descend dans les
  // fragments et on laisse intacts les autres elements (liens, boutons).
  const visit = node => {
    if (typeof node === 'string') return split(node);
    if (Array.isArray(node)) return node.map(child => visit(child));
    if (React.isValidElement(node) && node.type === React.Fragment) {
      return h(React.Fragment, { key: node.key }, ...[].concat(node.props.children).map(child => visit(child)));
    }
    return node;
  };
  return visit(content);
}

function readKitchenTimers() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(KITCHEN_TIMER_STORAGE) || '[]');
    return Array.isArray(stored) ? stored.filter(timer => timer && timer.id && timer.total > 0).slice(-KITCHEN_TIMER_LIMIT) : [];
  } catch {
    return [];
  }
}

function timerRemaining(timer, now) {
  if (timer.done) return 0;
  if (timer.pausedLeft != null) return timer.pausedLeft / 1000;
  return Math.max(0, (timer.endAt - now) / 1000);
}

const KITCHEN_RING = 2 * Math.PI * 19;

// Minuteurs en cours, en bas d'ecran sur toutes les pages. Une seule mise a jour
// par seconde ; l'anneau glisse en CSS entre deux ticks. Les echeances sont des
// heures absolues : un onglet en veille reste juste.
function KitchenTimerDock() {
  const [timers, setTimers] = useState(readKitchenTimers);
  const [now, setNow] = useState(() => Date.now());
  const [announce, setAnnounce] = useState('');

  useEffect(() => {
    const add = event => {
      const { seconds, label, title } = event.detail || {};
      const timer = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, label, title, total: seconds, endAt: Date.now() + seconds * 1000, done: false, pausedLeft: null };
      setTimers(list => [...list.filter(item => !item.done), timer].slice(-KITCHEN_TIMER_LIMIT));
      setNow(Date.now());
    };
    window.addEventListener(KITCHEN_TIMER_EVENT, add);
    return () => window.removeEventListener(KITCHEN_TIMER_EVENT, add);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(KITCHEN_TIMER_STORAGE, JSON.stringify(timers));
    } catch {
      /* Stockage indisponible : les minuteurs restent en memoire. */
    }
  }, [timers]);

  const ticking = timers.some(timer => !timer.done && timer.pausedLeft == null);
  useEffect(() => {
    if (!ticking) return undefined;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [ticking]);

  useEffect(() => {
    const finished = timers.filter(timer => !timer.done && timer.pausedLeft == null && timer.endAt <= now);
    if (!finished.length) return;
    setTimers(list => list.map(timer => (finished.some(item => item.id === timer.id) ? { ...timer, done: true } : timer)));
    setAnnounce(`Minuteur terminé : ${finished.map(timer => [timer.label, timer.title].filter(Boolean).join(', ')).join(' ; ')}`);
    try {
      navigator.vibrate?.([320, 140, 320, 140, 620]);
    } catch {
      /* Vibration indisponible. */
    }
    playKitchenChime();
  }, [now, timers]);

  const update = (id, change) => setTimers(list => list.map(timer => (timer.id === id ? change(timer) : timer)));
  const togglePause = id => update(id, timer => (timer.pausedLeft != null
    ? { ...timer, endAt: Date.now() + timer.pausedLeft, pausedLeft: null }
    : { ...timer, pausedLeft: Math.max(0, timer.endAt - Date.now()) }));
  const addMinute = id => update(id, timer => {
    const left = timer.done ? 60000 : (timer.pausedLeft != null ? timer.pausedLeft : timer.endAt - Date.now()) + 60000;
    return timer.pausedLeft != null && !timer.done
      ? { ...timer, pausedLeft: left, total: Math.max(timer.total, left / 1000) }
      : { ...timer, done: false, pausedLeft: null, endAt: Date.now() + left, total: Math.max(timer.done ? 60 : timer.total, left / 1000) };
  });
  const remove = id => setTimers(list => list.filter(timer => timer.id !== id));

  if (!timers.length && !announce) return null;
  return h('div', { className: 'kitchen-timer-dock' },
    h('p', { className: 'sr-only', role: 'status', 'aria-live': 'assertive' }, announce),
    timers.map(timer => {
      const left = timerRemaining(timer, now);
      const ratio = timer.total ? Math.min(1, left / timer.total) : 0;
      const paused = timer.pausedLeft != null && !timer.done;
      return h('div', { key: timer.id, className: ['kitchen-timer', timer.done ? 'is-done' : '', paused ? 'is-paused' : ''].filter(Boolean).join(' ') },
        h('button', {
          type: 'button',
          className: 'kitchen-timer-ring',
          disabled: timer.done,
          'aria-label': paused ? `Reprendre le minuteur ${timer.label}` : `Mettre en pause le minuteur ${timer.label}`,
          onClick: () => togglePause(timer.id)
        },
          h('svg', { viewBox: '0 0 44 44', 'aria-hidden': 'true', focusable: 'false' },
            h('circle', { className: 'kitchen-timer-track', cx: 22, cy: 22, r: 19 }),
            h('circle', { className: 'kitchen-timer-progress', cx: 22, cy: 22, r: 19, strokeDasharray: KITCHEN_RING, strokeDashoffset: KITCHEN_RING * (1 - ratio) })
          ),
          h('span', { className: 'kitchen-timer-glyph', 'aria-hidden': 'true' }, timer.done ? '✓' : paused ? '▶' : '❚❚')
        ),
        h('div', { className: 'kitchen-timer-copy' },
          h('strong', { className: 'kitchen-timer-clock' }, timer.done ? 'Terminé' : formatTimerClock(left)),
          h('small', null, [timer.label, timer.title].filter(Boolean).join(' · '))
        ),
        h('button', { type: 'button', className: 'kitchen-timer-action', onClick: () => addMinute(timer.id), 'aria-label': `Ajouter une minute au minuteur ${timer.label}` }, '+1'),
        h('button', { type: 'button', className: 'kitchen-timer-action', onClick: () => remove(timer.id), 'aria-label': `Fermer le minuteur ${timer.label}` }, h(Icon, { name: 'close' }))
      );
    })
  );
}

// Reflet lumineux qui suit la souris sur une carte (souris uniquement, via CSS).
function trackCardGlare(event) {
  if (event.pointerType !== 'mouse') return;
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--glare-x', `${Math.round(((event.clientX - rect.left) / rect.width) * 100)}%`);
  card.style.setProperty('--glare-y', `${Math.round(((event.clientY - rect.top) / rect.height) * 100)}%`);
}

// Intention d'ouverture (survol, focus, toucher) : on prepare les donnees de la
// fiche et son image principale, pour une ouverture instantanee.
function warmRecipeOnIntent(preloadRecipe, recipeId, heroImage = '') {
  if (heroImage && !WARMED_HERO_IMAGES.has(heroImage) && WARMED_HERO_IMAGES.size < 48) {
    WARMED_HERO_IMAGES.add(heroImage);
    const image = new Image();
    image.decoding = 'async';
    image.fetchPriority = 'low';
    image.src = preferredImageUrl(heroImage);
  }
  if (typeof preloadRecipe !== 'function' || !recipeId) return;
  try {
    const result = preloadRecipe(recipeId);
    if (result && typeof result.catch === 'function') result.catch(() => {});
  } catch {
    /* Prefetch is an enhancement; navigation remains available if it fails. */
  }
}

function RecipeCard({ recipe, recipesById, isFavorite, toggleFavorite, openRecipe, setTagFilter, hideFavorite = false, preloadRecipe = null }) {
  const master = isMasterRecipe(recipe);
  const variantLabel = getRecipeVariantLabel(recipe, recipesById);
  const color = getCategoryColor(recipe);
  const style = { '--card-accent': color };
  const sourceImage = displayRecipeImage(recipe);
  const renderCardImage = Boolean(sourceImage);
  const cardImage = renderCardImage ? recipeCardImageUrl(sourceImage) : '';
  const hasDayFallback = !isDayArtTheme() && !themeRecipeArtImage(recipe) && Boolean(recipe.image);
  const className = ['recipe-card', renderCardImage ? 'has-image' : '', hasDayFallback ? 'theme-fallback-day' : '', master ? 'master-card' : '']
    .filter(Boolean)
    .join(' ');
  const cardStyle = { ...ambilightStyle(cardImage, style), cursor: 'pointer' };
  const warmRecipe = () => warmRecipeOnIntent(preloadRecipe, recipe.id, master ? '' : sourceImage);

  return h('article', {
    className,
    style: cardStyle,
    'data-recipe-id': recipe.id,
    'data-vt-card': '',
    title: recipe.title,
    tabIndex: 0,
    role: 'button',
    onPointerEnter: warmRecipe,
    onPointerMove: trackCardGlare,
    onFocus: warmRecipe,
    onTouchStart: warmRecipe,
    'aria-label': `Ouvrir ${recipe.title}`,
    onClick: () => openRecipe(recipe.id),
    onKeyDown: event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openRecipe(recipe.id);
      }
    }
  },
    renderCardImage && h('span', { className: 'card-ambilight', 'aria-hidden': true }),
    h('span', { className: 'card-glare', 'aria-hidden': true }),
    h('div', { className: 'card-media', 'data-vt-media': recipe.id },
      renderCardImage && h('img', {
        className: 'card-image',
        ref: markLoadedImage,
        src: preferredImageUrl(cardImage),
        'data-original-src': cardImage,
        alt: recipe.title,
        loading: 'lazy',
        decoding: 'async',
        fetchPriority: master ? 'high' : 'low',
        srcSet: imageSrcSet(sourceImage),
        sizes: '(max-width: 760px) calc(100vw - 32px), 380px',
        draggable: false,
        ...imageSizeAttrs(cardImage),
        onLoad: event => {
          if (!event.currentTarget.dataset.loaded) event.currentTarget.dataset.loaded = 'true';
        },
        onError: event => {
          if (retryOriginalImage(event.currentTarget)) return;
          const fallbackImage = recipe.image ? recipeCardImageUrl(recipe.image) : '';
          if (fallbackImage && event.currentTarget.getAttribute('src') !== fallbackImage) {
            event.currentTarget.src = fallbackImage;
          }
        }
      }),
      !renderCardImage && h('span', { className: 'card-letter' }, recipe.title.slice(0, 1))
    ),
    h('div', { className: 'card-body' },
      h('h3', { className: 'card-title', 'data-vt-title': recipe.id }, recipe.title),
      variantLabel && h('p', { className: 'card-meta', 'aria-label': variantLabel },
        h('span', { className: 'card-variant-count' }, variantLabel)
      )
    )
  );
}

function useCenteredScrollFeature(containerRef, dependencyKey) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const media = window.matchMedia?.('(hover: none), (pointer: coarse), (max-width: 760px)');
    if (!media) return undefined;
    let featuredCard = null;
    let frame = 0;

    const clearFeaturedCard = () => {
      if (!featuredCard) return;
      featuredCard.classList.remove('is-scroll-featured');
      featuredCard = null;
    };

    const updateFeaturedCard = () => {
      frame = 0;
      if (!media.matches) {
        clearFeaturedCard();
        return;
      }

      const cards = Array.from(container.querySelectorAll('.recipe-card.has-image'));
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const targetY = viewportHeight * 0.52;
      const activationTop = viewportHeight * 0.28;
      const activationBottom = viewportHeight * 0.78;
      let nextCard = null;
      let nextDistance = Number.POSITIVE_INFINITY;

      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.bottom < activationTop || rect.top > activationBottom) return;
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - targetY);
        if (distance < nextDistance) {
          nextDistance = distance;
          nextCard = card;
        }
      });

      if (nextCard === featuredCard) return;
      clearFeaturedCard();
      featuredCard = nextCard;
      featuredCard?.classList.add('is-scroll-featured');
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateFeaturedCard);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    window.addEventListener('orientationchange', requestUpdate);
    media?.addEventListener?.('change', requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      window.removeEventListener('orientationchange', requestUpdate);
      media?.removeEventListener?.('change', requestUpdate);
      clearFeaturedCard();
    };
  }, [containerRef, dependencyKey]);
}

function RecipeGrid({ recipes, recipesById, favorites, toggleFavorite, openRecipe, setTagFilter, hideFavorite = false, emptyState = null, preloadRecipe = null }) {
  const masterGrid = recipes.length > 0 && recipes.every(isMasterRecipe);
  const recipeKey = recipes.map(recipe => recipe.id).join('|');
  const chunkedGrid = !masterGrid && recipes.length > GRID_INITIAL_RENDER_COUNT;
  const initialVisibleCount = chunkedGrid ? GRID_INITIAL_RENDER_COUNT : recipes.length;
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const gridRef = useRef(null);
  const loadMoreRef = useRef(null);
  const hasMore = visibleCount < recipes.length;

  useEffect(() => {
    setVisibleCount(initialVisibleCount);
  }, [recipeKey, initialVisibleCount]);

  useEffect(() => {
    if (!hasMore || !loadMoreRef.current || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      setVisibleCount(count => Math.min(recipes.length, count + GRID_RENDER_BATCH_SIZE));
    }, { rootMargin: '640px 0px' });
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, recipes.length, recipeKey]);

  useCenteredScrollFeature(gridRef, `${recipeKey}:${visibleCount}`);

  if (!recipes.length) {
    const emptyTitle = emptyState?.title || 'Aucune recette ne correspond';
    const emptyDescription = emptyState?.description || 'Les filtres sont trop serrés pour le contenu actuel.';
    return h('div', { className: 'empty-state', style: { justifyItems: 'center', textAlign: 'center' } },
      h('span', { className: 'empty-state-mark', 'aria-hidden': true, style: { display: 'grid', placeItems: 'center', width: 42, height: 42, border: '1px solid color-mix(in srgb,var(--accent) 52%,var(--line))', borderRadius: '999px', background: 'color-mix(in srgb,var(--accent) 12%,var(--surface-soft))' } }, h(Icon, { name: 'book' })),
      h('h2', null, emptyTitle),
      h('p', null, emptyDescription)
    );
  }
  const gridClassName = ['recipe-grid', masterGrid ? 'master-recipe-grid' : '']
    .filter(Boolean)
    .join(' ');
  const visibleRecipes = hasMore ? recipes.slice(0, visibleCount) : recipes;
  const remainingRecipeCount = Math.max(0, recipes.length - visibleCount);
  const nextRecipeBatchCount = Math.min(GRID_RENDER_BATCH_SIZE, remainingRecipeCount);
  const loadMoreLabel = nextRecipeBatchCount > 0
    ? `Afficher ${nextRecipeBatchCount} recette${nextRecipeBatchCount > 1 ? 's' : ''} de plus, ${remainingRecipeCount} restante${remainingRecipeCount > 1 ? 's' : ''}`
    : 'Afficher plus de recettes';

  return h(React.Fragment, null,
    h('div', { className: gridClassName, ref: gridRef },
      visibleRecipes.map(recipe => h(RecipeCard, {
        key: recipe.id,
        recipe,
        recipesById,
        isFavorite: favorites.includes(recipe.id),
        toggleFavorite,
        openRecipe,
        setTagFilter,
        hideFavorite,
        preloadRecipe
      }))
    ),
    hasMore && h('div', { className: 'recipe-grid-load-more', ref: loadMoreRef },
      h('button', {
        type: 'button',
        title: loadMoreLabel,
        'aria-label': loadMoreLabel,
        onClick: () => setVisibleCount(count => Math.min(recipes.length, count + GRID_RENDER_BATCH_SIZE))
      }, 'Afficher plus')
    )
  );
}

function SeasonSections({ sections, recipesById, favorites, toggleFavorite, openRecipe, setTagFilter, onlyFavorites, clearFavoriteView, selectedSeason, setSeason, categoryFilter, setCategoryFilter, categoryOptions, favoriteCollection, setFavoriteCollection, preloadRecipe = null }) {
  const seasonOptions = ['Toutes', ...SEASONS];
  const showCategoryTabs = selectedSeason && !onlyFavorites && (categoryOptions || []).length > 1;
  const defaultCatalogSection = !onlyFavorites
    && !selectedSeason
    && sections.length === 1
    && sections[0]?.key === 'all-seasons'
    ? sections[0]
    : null;
  const favoriteRecipes = favorites.map(id => recipesById[id]).filter(Boolean);
  const favoriteEmptyState = onlyFavorites && favoriteRecipes.length === 0
    ? {
      title: 'Aucune recette favorite pour le moment',
      description: 'Ouvre une fiche puis utilise « Favori » pour la retrouver ici.'
    }
    : null;
  const favoriteCollectionCounts = onlyFavorites ? FAVORITE_COLLECTIONS.reduce((counts, collection) => {
    counts[collection.id] = collection.id
      ? favoriteRecipes.filter(recipe => collection.match?.(recipe)).length
      : favoriteRecipes.length;
    return counts;
  }, {}) : {};
  return h('section', { className: `season-sections${defaultCatalogSection ? ' is-default-catalog' : ''}`, id: 'recettes' },
    h('div', { className: 'section-title list-title season-dashboard' },
      h('div', { className: 'season-dashboard-copy' },
        h('p', { className: 'eyebrow' }, onlyFavorites ? 'Favoris' : 'Catalogue'),
        h('div', { className: 'season-dashboard-title-row' },
          h('h2', null, onlyFavorites ? 'Mes recettes favorites' : defaultCatalogSection ? 'Toutes les catégories' : 'Recettes'),
          defaultCatalogSection && h('span', { className: 'season-dashboard-count' },
            `${defaultCatalogSection.recipes.length} catégorie${defaultCatalogSection.recipes.length > 1 ? 's' : ''}`
          )
        ),
        onlyFavorites && h('div', { className: 'favorite-collection-tabs', 'aria-label': 'Collections de favoris' },
          FAVORITE_COLLECTIONS
            .filter(collection => !collection.id || favoriteCollectionCounts[collection.id] > 0 || favoriteCollection === collection.id)
            .map(collection => h('button', {
              key: collection.id || 'all',
              type: 'button',
              className: favoriteCollection === collection.id ? 'active' : '',
              'aria-pressed': favoriteCollection === collection.id,
              onClick: () => setFavoriteCollection?.(collection.id)
            },
              h('span', null, collection.label),
              h('small', null, favoriteCollectionCounts[collection.id] || 0)
            ))
        )
      ),
      onlyFavorites
        ? h('button', { type: 'button', onClick: clearFavoriteView }, 'Quitter les favoris')
        : h('div', { className: 'season-filter-stack' },
          h('div', { className: 'season-tabs', 'aria-label': 'Filtrer par saison' },
            seasonOptions.map(item => {
              const value = item === 'Toutes' ? '' : item;
              const active = selectedSeason === value;
              return h('button', {
                key: item,
                type: 'button',
                className: active ? 'active' : '',
                'aria-pressed': active,
                onClick: () => setSeason(value)
              }, item);
            })
          ),
          showCategoryTabs && h('div', { className: 'season-category-tabs', 'aria-label': 'Filtrer la saison par catégorie' },
            categoryOptions.map(item => h('button', {
              key: item.value || 'all',
              type: 'button',
              className: categoryFilter === item.value ? 'active' : '',
              'aria-pressed': categoryFilter === item.value,
              onClick: () => setCategoryFilter(item.value)
            },
              h('span', null, item.label),
              h('small', null, item.count)
            ))
          )
        )
    ),
    sections.map(section => {
      const isDefaultCatalogBlock = defaultCatalogSection?.key === section.key;
      return h('section', {
        key: section.key,
        className: `season-block${isDefaultCatalogBlock ? ' season-block-default' : ''}`
      },
        !isDefaultCatalogBlock && h('div', { className: 'season-block-head' },
          h('div', null, h('p', { className: 'eyebrow' }, section.kicker), h('h3', null, section.title)),
          h('span', null, `${section.recipes.length} fiche${section.recipes.length > 1 ? 's' : ''}`)
        ),
        h(RecipeGrid, { recipes: section.recipes, recipesById, favorites, toggleFavorite, openRecipe, setTagFilter, emptyState: favoriteEmptyState, preloadRecipe })
      );
    })
  );
}

function HomeView(props) {
  return h('main', { className: 'home-view' },
    h(Hero),
    h('div', { className: 'content-wrap' },
      !props.onlyFavorites && h('section', { className: 'home-command-center', 'aria-label': 'Acces rapides Cook Note' },
        h('button', { type: 'button', className: 'home-search-launcher', onClick: props.openSearch },
          h(Icon, { name: 'search' }),
          h('span', { className: 'home-search-copy' },
            h('strong', null, t('home.searchTitle')),
            h('small', null, t('home.searchSubtitle'))
          ),
          h('kbd', { className: 'home-search-hint', 'aria-hidden': true }, 'Ctrl K')
        ),
        h('nav', { className: 'home-quick-actions', 'aria-label': 'Raccourcis culinaires' },
          h('button', { type: 'button', onClick: props.openMenuPlanner }, h(Icon, { name: 'spark' }), h('span', null, 'Composer un menu')),
          h('button', { type: 'button', onClick: props.showFavorites }, h(Icon, { name: 'heart' }), h('span', null, 'Mes favoris')),
          h('button', { type: 'button', onClick: props.openShoppingBasket }, h(Icon, { name: 'basket' }), h('span', null, 'Liste de courses')),
          h('button', { type: 'button', onClick: props.openTechniques }, h(Icon, { name: 'book' }), h('span', null, 'Techniques'))
        )
      ),
      h(ActiveChips, { chips: props.activeChips }),
      h(SeasonSections, {
        sections: props.sections,
        recipesById: props.recipesById,
        favorites: props.favorites,
        toggleFavorite: props.toggleFavorite,
        openRecipe: props.openRecipe,
        setTagFilter: props.setTagFilter,
        onlyFavorites: props.onlyFavorites,
        clearFavoriteView: props.clearFavoriteView,
        selectedSeason: props.filterProps.season,
        setSeason: props.filterProps.setSeason,
        categoryFilter: props.filterProps.seasonCategory,
        setCategoryFilter: props.filterProps.setSeasonCategory,
        categoryOptions: props.filterProps.seasonCategoryOptions,
        favoriteCollection: props.favoriteCollection,
        setFavoriteCollection: props.setFavoriteCollection,
        preloadRecipe: props.preloadRecipe
      })
    )
  );
}

function NotFoundView({ goHome, openSearch }) {
  return h('main', { className: 'not-found-view' },
    h(Hero),
    h('div', { className: 'content-wrap' },
      h('section', { className: 'fatal-state not-found-panel' },
        h('p', { className: 'eyebrow' }, 'Page introuvable'),
        h('h1', null, 'Cette fiche n’existe pas encore'),
        h('p', null, 'Le lien pointe vers une recette absente du carnet ou déplacée.'),
        h('div', { className: 'not-found-actions' },
          h(Button, { variant: 'primary', onClick: openSearch }, 'Rechercher une recette'),
          h(Button, { variant: 'subtle', onClick: goHome }, 'Retour au carnet')
        )
      )
    )
  );
}

function CatalogLoadingView() {
  return h('main', { className: 'not-found-view catalog-loading-view' },
    h(Hero),
    h('div', { className: 'content-wrap' },
      h('section', { className: 'fatal-state not-found-panel' },
        h('p', { className: 'eyebrow' }, 'Catalogue'),
        h('h1', null, 'Chargement de la fiche'),
        h('p', null, 'Le carnet termine de charger les recettes.')
      )
    )
  );
}

function TechniquesView({ targetTechniqueId, goHome }) {
  const [highlightedTechniqueId, setHighlightedTechniqueId] = useState('');
  const [techniqueFilter, setTechniqueFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const techniqueLabels = useMemo(() => uniq(SORTED_TECHNIQUE_GUIDES.map(guide => guide.label)), []);
  const visibleTechniques = useMemo(() => techniqueFilter
    ? SORTED_TECHNIQUE_GUIDES.filter(guide => guide.label === techniqueFilter)
    : SORTED_TECHNIQUE_GUIDES, [techniqueFilter]);
  const techniqueGroups = useMemo(() => {
    const groups = new Map();
    visibleTechniques.forEach(guide => {
      const label = guide.label || 'Technique';
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(guide);
    });
    return Array.from(groups, ([label, guides]) => ({ label, guides }));
  }, [visibleTechniques]);
  useEffect(() => {
    const frameIds = new Set();
    const settleTimers = [];

    const scheduleFrame = callback => {
      const frameId = window.requestAnimationFrame(() => {
        frameIds.delete(frameId);
        callback();
      });
      frameIds.add(frameId);
    };

    const clearSettles = () => {
      settleTimers.splice(0).forEach(timer => window.clearTimeout(timer));
    };

    function hashId() {
      try {
        return decodeURIComponent(window.location.hash.replace(/^#/, ''));
      } catch {
        return window.location.hash.replace(/^#/, '');
      }
    }

    function centerTechnique(target, id, behavior) {
      if (!target?.isConnected) return;
      target.focus({ preventScroll: true });
      setHighlightedTechniqueId(id);
      scrollElementToViewportCenter(target, behavior);
    }

    function scrollToTechnique(attempt = 0, forcedId = null) {
      const id = forcedId !== null ? forcedId : (targetTechniqueId || hashId());
      if (!id) {
        setHighlightedTechniqueId('');
        return;
      }
      const target = document.getElementById(`technique-${id}`);
      if (!target) {
        if (attempt < 36) scheduleFrame(() => scrollToTechnique(attempt + 1, forcedId));
        return;
      }
      clearSettles();
      scheduleFrame(() => centerTechnique(target, id, 'smooth'));
      [180, 520, 1100, 1800].forEach(delay => {
        settleTimers.push(window.setTimeout(() => {
          scheduleFrame(() => centerTechnique(target, id, 'auto'));
        }, delay));
      });
    }

    const handleHashChange = () => scrollToTechnique(0, hashId());
    scrollToTechnique();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      frameIds.forEach(frameId => window.cancelAnimationFrame(frameId));
      clearSettles();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [targetTechniqueId, visibleTechniques.length]);
  const deepLinkedTechnique = Boolean(targetTechniqueId || highlightedTechniqueId);
  return h('main', { className: deepLinkedTechnique ? 'techniques-view techniques-view--deep-link' : 'techniques-view' },
    h('div', { className: 'content-wrap techniques-wrap' },
      h('div', { className: 'section-title techniques-title' },
        h('div', null,
          h('p', { className: 'eyebrow' }, 'Gestes de cuisine'),
          h('h2', null, 'Technique de cuisinier'),
          h('p', null, 'Les gestes de base pour cuisiner plus proprement : tailler, peler, abaisser, foncer, monter, lier et éviter les erreurs classiques.')
        ),
        h(Button, { variant: 'subtle', onClick: goHome }, 'Retour aux recettes')
      ),
      h('button', {
        type: 'button',
        className: filtersOpen ? 'technique-filter-toggle active' : 'technique-filter-toggle',
        'aria-expanded': filtersOpen,
        'aria-controls': 'technique-filter-tabs',
        onClick: () => setFiltersOpen(open => !open)
      }, techniqueFilter ? `Filtrer : ${techniqueFilter}` : 'Filtrer les gestes'),
      h('div', { id: 'technique-filter-tabs', className: filtersOpen ? 'technique-filter-tabs is-open' : 'technique-filter-tabs', 'aria-label': 'Filtrer les techniques' },
        ['Toutes', ...techniqueLabels].map(label => {
          const value = label === 'Toutes' ? '' : label;
          const count = value ? SORTED_TECHNIQUE_GUIDES.filter(guide => guide.label === value).length : SORTED_TECHNIQUE_GUIDES.length;
          return h('button', {
            key: label,
            type: 'button',
            className: techniqueFilter === value ? 'active' : '',
            'aria-pressed': techniqueFilter === value,
            onClick: () => {
              setTechniqueFilter(value);
              setFiltersOpen(false);
            }
          }, h('span', null, label), h('small', null, count));
        })
      ),
      h('div', { className: 'technique-family-list' },
        techniqueGroups.map(group => h('section', { key: group.label, className: 'technique-family' },
          h('div', { className: 'technique-family-head' },
            h('h3', null, group.label),
            h('span', null, `${group.guides.length} ${(group.guides.length > 1 ? 'techniques' : 'technique')}`)
          ),
          h('div', { className: 'technique-grid' },
            group.guides.map(guide => h('article', {
              key: guide.id,
              id: `technique-${guide.id}`,
              tabIndex: -1,
              className: highlightedTechniqueId === guide.id ? 'technique-card technique-card-highlight' : 'technique-card'
            },
              h('div', { className: 'technique-card-head' },
                h('span', null, h(Icon, { name: 'spark' })),
                h('small', null, guide.label)
              ),
              h('h3', null, guide.title),
              h('p', null, guide.description),
              h('ol', { className: 'technique-steps' },
                (guide.steps || []).map((step, index) => h('li', { key: `${guide.id}:step:${index}` }, step))
              ),
              guide.tip && h('p', { className: 'technique-tip' }, guide.tip)
            ))
          )
        ))
      )
    )
  );
}

function SharePanel({ open, onClose, recipe, notify, shareUrl = '' }) {
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [posterBusy, setPosterBusy] = useState(false);
  const [qrReady, setQrReady] = useState(false);
  const canvasRef = useRef(null);
  const modalRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const shareData = useMemo(() => {
    if (!open) return { url: '', description: '', text: '', imageStyle: {}, imageUrl: '' };
    const url = shareUrl || getCurrentRecipeUrl(recipe);
    const description = recipeDescription(recipe);
    const imageUrl = displayRecipeImage(recipe);
    return {
      url,
      description,
      text: `${recipe.title} - Cook Note\n${description}\n${url}`,
      imageStyle: imageUrl ? { backgroundImage: cssImageValue(imageUrl) } : {},
      imageUrl
    };
  }, [open, recipe, shareUrl]);
  const { url, description, text, imageStyle, imageUrl } = shareData;

  function nativeShare() {
    if (!navigator.share) return copyText(text).then(() => {
      setCopiedText(true);
      notify?.('Texte de partage copié');
    });
    return navigator.share({ title: `${recipe.title} - Cook Note`, text: description, url }).then(() => {
      notify?.('Partage ouvert');
    }).catch(() => {});
  }

  async function downloadSharePoster(format = 'story') {
    if (posterBusy) return;
    setPosterBusy(true);
    try {
      await downloadSharePosterCard({
        title: recipe.title,
        description,
        imageUrl,
        metaText: [primaryCategory(recipe), recipe.yield, getNutriScore(recipe) && `Nutri ${getNutriScore(recipe)}`].filter(Boolean).join(' · '),
        qrReady,
        qrCanvas: canvasRef.current,
        format
      });
      notify?.('Carte de partage téléchargée', 'success');
    } catch {
      notify?.('Carte de partage impossible à générer', 'error');
    } finally {
      setPosterBusy(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    setCopied(false);
    setCopiedText(false);
    setPosterBusy(false);
    setQrReady(false);
    if (!open || !canvasRef.current) return () => {
      cancelled = true;
    };
    loadDeferredScript(QR_CODE_SCRIPT_SRC, 'QRCode').then(QRCode => {
      if (cancelled || !canvasRef.current || !QRCode?.toCanvas) return null;
      return QRCode.toCanvas(canvasRef.current, url, {
        width: 132,
        margin: 1,
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
  }, [open, url]);

  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement;
      requestAnimationFrame(() => modalRef.current?.querySelector('button, a[href], input')?.focus());
      return undefined;
    }
    restoreFocusRef.current?.focus?.();
    restoreFocusRef.current = null;
    return undefined;
  }, [open]);

  if (!open) return null;
  return h(ModalDialog, { className: '', onClose: onClose },
    h('section', { ref: modalRef, className: 'modal-panel share-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'share-modal-title', tabIndex: -1, onKeyDown: trapModalFocus, onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null, h('p', { className: 'eyebrow' }, 'Partager'), h('h2', { id: 'share-modal-title' }, recipe.title)),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('div', { className: 'share-card' },
        h('div', { className: 'share-card-media', style: imageStyle, 'aria-hidden': true },
          !imageUrl && h('span', { className: 'card-letter' }, recipe.title.slice(0, 1))
        ),
        h('div', { className: 'share-card-copy' },
          h('p', { className: 'eyebrow' }, 'Cook Note'),
          h('h3', null, recipe.title),
          h('p', null, description),
          h('div', { className: 'share-card-meta' },
            h('span', null, primaryCategory(recipe)),
            recipe.yield && h('span', null, recipe.yield),
            h('span', { className: `nutri-score nutri-${getNutriScore(recipe).toLowerCase()}` }, `Nutri ${getNutriScore(recipe)}`)
          )
        ),
        h('div', { className: qrReady ? 'share-qr is-ready' : 'share-qr', 'aria-label': `QR code de ${recipe.title}` },
          h('canvas', { ref: canvasRef, className: 'qr-canvas', width: 132, height: 132, 'aria-label': `QR code du lien ${recipe.title}` }),
          !qrReady && h('span', null, 'Lien prêt')
        )
      ),
      h('div', { className: 'share-link-box', title: url, 'aria-label': `Lien de partage ${url}` }, url),
      h('div', { className: 'share-actions' },
        navigator.share && h(Button, { variant: 'primary', onClick: nativeShare, ariaLabel: `Partager ${recipe.title}` }, 'Partager'),
        h(Button, { variant: navigator.share ? 'subtle' : 'primary', onClick: () => copyText(url).then(() => {
          setCopied(true);
          notify?.('Lien de recette copié');
        }), ariaLabel: `Copier le lien de ${recipe.title}` }, copied ? 'Lien copié' : 'Copier le lien'),
        h(Button, { variant: 'subtle', onClick: () => copyText(text).then(() => {
          setCopiedText(true);
          notify?.('Texte de recette copié');
        }), ariaLabel: `Copier le texte de partage de ${recipe.title}` }, copiedText ? 'Texte copié' : 'Copier le texte'),
        h(Button, { variant: 'subtle', disabled: posterBusy, onClick: () => downloadSharePoster('story'), ariaLabel: `Télécharger une story de ${recipe.title}` }, posterBusy ? 'Carte...' : 'Story'),
        h(Button, { variant: 'subtle', disabled: posterBusy, onClick: () => downloadSharePoster('square'), ariaLabel: `Télécharger une carte carrée de ${recipe.title}` }, 'Carré'),
        h(Button, { variant: 'subtle', disabled: posterBusy, onClick: () => downloadSharePoster('print'), ariaLabel: `Télécharger une fiche imprimable de ${recipe.title}` }, 'Fiche'),
        h('a', { className: 'btn btn-subtle', href: `https://wa.me/?text=${encodeURIComponent(text)}`, target: '_blank', rel: 'noreferrer', 'aria-label': `Partager ${recipe.title} sur WhatsApp` }, 'WhatsApp'),
        h('a', { className: 'btn btn-subtle', href: `mailto:?subject=${encodeURIComponent(recipe.title)}&body=${encodeURIComponent(text)}`, 'aria-label': `Partager ${recipe.title} par email` }, 'Email')
      )
    )
  );
}


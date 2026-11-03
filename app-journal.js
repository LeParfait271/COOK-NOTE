// ---------- Journal technique (local) ----------
// Sans serveur, les erreurs et la vitesse restent sur l'appareil : chaque
// erreur JavaScript (avec la page et la version) et chaque chargement (temps
// d'affichage, plus grand element, decalages, taches longues) sont gardes dans
// cook_note_journal (30 erreurs, 20 chargements). Preferences : resume,
// envoi par e-mail, effacement.
const JOURNAL_KEY = 'cook_note_journal';
const JOURNAL_MAIL = 'cooknote271@gmail.com';

function readJournal() {
  const journal = readJson(JOURNAL_KEY, null) || {};
  return { errors: Array.isArray(journal.errors) ? journal.errors : [], loads: Array.isArray(journal.loads) ? journal.loads : [] };
}

function writeJournal(journal) {
  writeJson(JOURNAL_KEY, { errors: journal.errors.slice(-30), loads: journal.loads.slice(-20) });
}

(function startJournal() {
  if (typeof window.addEventListener !== 'function') return;
  const record = message => {
    const journal = readJournal();
    const text = String(message || 'Erreur inconnue').slice(0, 300);
    const last = journal.errors[journal.errors.length - 1];
    if (last && last.message === text && Date.now() - last.at < 5000) return;
    journal.errors.push({ at: Date.now(), message: text, page: window.location.pathname, version: typeof SITE_VERSION !== 'undefined' ? SITE_VERSION : '' });
    writeJournal(journal);
  };
  window.addEventListener('error', event => record(event.error?.stack?.split('\n').slice(0, 2).join(' ') || event.message));
  window.addEventListener('unhandledrejection', event => record(`Promesse : ${event.reason?.message || event.reason}`));

  // Vitesse : mesures du chargement, enregistrees quand la page passe en arriere-plan.
  if (typeof PerformanceObserver !== 'function') return;
  const sample = { lcp: 0, cls: 0, longTasks: 0, longTime: 0 };
  const observe = (type, handler) => {
    try { new PerformanceObserver(list => list.getEntries().forEach(handler)).observe({ type, buffered: true }); } catch { /* type non gere */ }
  };
  observe('largest-contentful-paint', entry => { sample.lcp = Math.round(entry.startTime); });
  observe('layout-shift', entry => { if (!entry.hadRecentInput) sample.cls += entry.value; });
  observe('longtask', entry => { sample.longTasks += 1; sample.longTime += Math.round(entry.duration); });
  let saved = false;
  const save = () => {
    if (saved) return;
    saved = true;
    const navigation = performance.getEntriesByType?.('navigation')?.[0];
    const journal = readJournal();
    journal.loads.push({
      at: Date.now(),
      page: window.location.pathname,
      ready: navigation ? Math.round(navigation.domContentLoadedEventEnd) : 0,
      lcp: sample.lcp,
      cls: Math.round(sample.cls * 1000) / 1000,
      longTasks: sample.longTasks,
      longTime: sample.longTime,
      device: `${window.innerWidth}x${window.innerHeight}@${window.devicePixelRatio || 1}`
    });
    writeJournal(journal);
  };
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(); });
  window.addEventListener('pagehide', save);
})();

function journalSummary() {
  const { errors, loads } = readJournal();
  const median = values => {
    const sorted = values.filter(value => value > 0).sort((a, b) => a - b);
    return sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
  };
  return { errors, loads, lcp: median(loads.map(load => load.lcp)), ready: median(loads.map(load => load.ready)) };
}

function journalReport() {
  const { errors, loads, lcp, ready } = journalSummary();
  const date = at => new Date(at).toLocaleString('fr-FR');
  return [
    `Cook Note ${typeof SITE_VERSION !== 'undefined' ? SITE_VERSION : ''} · ${navigator.userAgent}`,
    '',
    `Vitesse (${loads.length} chargements) : affichage ${ready} ms, plus grand élément ${lcp} ms (médianes)`,
    ...loads.slice(-8).map(load => `- ${date(load.at)} ${load.page} : prêt ${load.ready} ms, LCP ${load.lcp} ms, CLS ${load.cls}, ${load.longTasks} tâches longues (${load.longTime} ms), ${load.device}`),
    '',
    `Erreurs (${errors.length}) :`,
    ...errors.slice(-15).map(error => `- ${date(error.at)} ${error.page} (${error.version}) : ${error.message}`)
  ].join('\n');
}

function JournalBlock() {
  const [summary, setSummary] = useState(journalSummary);
  return h('div', { className: 'journal-block' },
    h('div', null,
      h('strong', null, tc('Journal technique')),
      h('small', null, `${summary.errors.length} ${summary.errors.length > 1 ? tc('erreurs') : tc('erreur')} · ${summary.loads.length} ${tc('chargements')}${summary.lcp ? ` · ${tc('affichage médian')} ${summary.lcp} ms` : ''}`)
    ),
    h('div', { className: 'journal-actions' },
      h(Button, { variant: 'subtle', onClick: () => { window.location.href = `mailto:${JOURNAL_MAIL}?subject=${encodeURIComponent('Journal technique Cook Note')}&body=${encodeURIComponent(journalReport())}`; } }, tc('Envoyer le rapport')),
      h(Button, { variant: 'ghost', onClick: () => { writeJournal({ errors: [], loads: [] }); setSummary(journalSummary()); } }, tc('Effacer'))
    )
  );
}

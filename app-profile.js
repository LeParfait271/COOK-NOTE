// ---------- Mon profil (un seul par appareil) ----------
// Prenom, portions par defaut, gouts et allergies, liste « a essayer », notes
// personnelles par fiche, bilan mois par mois (tire de l'historique du
// parcours de chef) et transfert par QR code (#profil=...). Tout reste dans
// cook_note_profile, sur l'appareil.
const PROFILE_KEY = 'cook_note_profile';
const PROFILE_EVENT = 'cooknote-profile';
const PROFILE_ALLERGENS = ['Gluten', 'Lait', 'Œufs', 'Fruits à coque', 'Arachides', 'Soja', 'Poisson', 'Crustacés', 'Mollusques', 'Moutarde', 'Sésame', 'Céleri'];
const PROFILE_DIETS = [['', 'Aucun'], ['vegetarien', 'Végétarien'], ['vegan', 'Végan'], ['sans-gluten', 'Sans gluten'], ['sans-lactose', 'Sans lactose']];
const PROFILE_MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function readProfile() {
  const data = readJson(PROFILE_KEY, null) || {};
  const list = value => (Array.isArray(value) ? value.filter(item => typeof item === 'string' && item) : []);
  return {
    name: typeof data.name === 'string' ? data.name.slice(0, 40) : '',
    servings: Number(data.servings) > 0 && Number(data.servings) <= 20 ? Number(data.servings) : 0,
    diet: PROFILE_DIETS.some(([id]) => id === data.diet) ? data.diet : '',
    allergens: list(data.allergens).filter(label => PROFILE_ALLERGENS.includes(label)),
    dislikes: list(data.dislikes).slice(0, 30),
    toTry: list(data.toTry).slice(0, 200),
    notes: data.notes && typeof data.notes === 'object' ? data.notes : {},
    created: Number(data.created) || 0
  };
}

function writeProfile(profile) {
  writeJson(PROFILE_KEY, profile);
  window.dispatchEvent?.(new CustomEvent(PROFILE_EVENT));
}

function updateProfile(changes) {
  const next = { ...readProfile(), ...changes };
  writeProfile(next);
  return next;
}

function useProfile() {
  const [profile, setProfile] = useState(readProfile);
  useEffect(() => {
    if (typeof window.addEventListener !== 'function') return undefined;
    const refresh = () => setProfile(readProfile());
    window.addEventListener(PROFILE_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(PROFILE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return profile;
}

// Portions par defaut d'une fiche ouverte (0 : quantite de base).
function profileServings() {
  return readProfile().servings;
}

// Ce qui ne va pas pour ce profil : allergenes, mots a eviter, regime.
function profileWarnings(recipe, profile = readProfile()) {
  if (!recipe || !(recipe.ingredients || []).length) return [];
  const warnings = [];
  const allergens = new Set(getRecipeAllergens(recipe));
  profile.allergens.forEach(label => { if (allergens.has(label)) warnings.push(label); });
  if (profile.dislikes.length) {
    const text = normalizeText((recipe.ingredients || []).flatMap(group => group.items || []).join(' '));
    profile.dislikes.forEach(word => {
      const needle = normalizeText(word);
      if (needle && new RegExp(`\\b${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(text)) warnings.push(word);
    });
  }
  if (profile.diet && !getRecipeDiets(recipe).includes(profile.diet)) {
    warnings.push(`${tc('pas')} ${tc((PROFILE_DIETS.find(([id]) => id === profile.diet) || ['', ''])[1]).toLowerCase()}`);
  }
  return warnings;
}

function recipeAvoidedByProfile(recipe, profile = readProfile()) {
  return profileWarnings(recipe, profile).length > 0;
}

// Plat cuisine (verdict donne) : il sort de la liste « a essayer ».
if (typeof window.addEventListener === 'function') {
  window.addEventListener(CHEF_EVENT, () => {
    const last = readChef().history[0];
    const profile = readProfile();
    if (last?.id && profile.toTry.includes(last.id)) updateProfile({ toTry: profile.toTry.filter(id => id !== last.id) });
  });
}

function toggleToTry(id) {
  const profile = readProfile();
  const toTry = profile.toTry.includes(id) ? profile.toTry.filter(item => item !== id) : [id, ...profile.toTry];
  updateProfile({ toTry });
  return toTry.includes(id);
}

// Ligne discrete sous le titre de la fiche : avertissement, note, a essayer.
function ProfileRecipeLine({ recipe }) {
  const profile = useProfile();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  useEffect(() => setEditing(false), [recipe?.id]);
  if (!recipe?.id) return null;
  const note = String(profile.notes[recipe.id] || '');
  const warnings = profileWarnings(recipe, profile);
  const wanted = profile.toTry.includes(recipe.id);
  const saveNote = value => {
    const notes = { ...profile.notes };
    const text = value.trim().slice(0, 300);
    if (text) notes[recipe.id] = text;
    else delete notes[recipe.id];
    updateProfile({ notes });
    setEditing(false);
  };
  return h('div', { className: 'profile-line' },
    warnings.length > 0 && h('span', { className: 'profile-line-warn', title: tc('Selon tes goûts et allergies (Mon profil)') }, `⚠ ${tc('Contient')} : ${warnings.map(item => tc(item)).join(', ')}`),
    editing
      ? h('form', { className: 'profile-note-form', onSubmit: event => { event.preventDefault(); saveNote(draft); } },
        h('input', { type: 'text', value: draft, autoFocus: true, maxLength: 300, placeholder: tc('Ta note : moins de sel, four à 170…'), 'aria-label': tc('Note personnelle'), onChange: event => setDraft(event.target.value), onKeyDown: event => { if (event.key === 'Escape') { event.stopPropagation(); setEditing(false); } } }),
        h('button', { type: 'submit' }, tc('OK'))
      )
      : h('button', { type: 'button', className: note ? 'profile-line-note has-note' : 'profile-line-note', onClick: () => { setDraft(note); setEditing(true); }, title: tc('Note personnelle, visible seulement sur cet appareil') }, note ? `✎ ${note}` : `✎ ${tc('Ajouter une note')}`),
    !editing && h('button', { type: 'button', className: wanted ? 'profile-line-try is-on' : 'profile-line-try', 'aria-pressed': wanted, onClick: () => toggleToTry(recipe.id) }, wanted ? tc('★ À essayer') : tc('☆ À essayer'))
  );
}

// ---------- Bilan du mois ----------
function profileMonthReport(history, recipesById, year, month) {
  const entries = history.filter(entry => {
    const date = new Date(entry.at);
    return date.getFullYear() === year && date.getMonth() === month;
  });
  const before = history.filter(entry => entry.at < new Date(year, month, 1).getTime());
  const seenBefore = new Set(before.map(entry => entry.id));
  const counts = new Map();
  const categories = new Map();
  entries.forEach(entry => {
    counts.set(entry.id, { title: entry.title, count: (counts.get(entry.id)?.count || 0) + 1 });
    const recipe = recipesById[entry.id];
    const category = recipe ? primaryCategory(recipe) : '';
    if (category) categories.set(category, (categories.get(category) || 0) + 1);
  });
  const top = [...counts.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, 3).map(([id, value]) => ({ id, ...value }));
  const category = [...categories.entries()].sort((a, b) => b[1] - a[1])[0];
  return {
    total: entries.length,
    successes: entries.filter(entry => entry.score === 1).length,
    discoveries: new Set(entries.filter(entry => !seenBefore.has(entry.id)).map(entry => entry.id)).size,
    delta: entries.reduce((sum, entry) => sum + (Number(entry.delta) || 0), 0),
    top,
    category: category ? category[0] : ''
  };
}

function ProfileMonthReport({ recipesById, openRecipe, onClose }) {
  const chef = useChef();
  const [month, setMonth] = useState(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), 1); });
  const report = profileMonthReport(chef.history, recipesById, month.getFullYear(), month.getMonth());
  const shift = step => setMonth(new Date(month.getFullYear(), month.getMonth() + step, 1));
  const isCurrent = month.getFullYear() === new Date().getFullYear() && month.getMonth() === new Date().getMonth();
  return h('div', { className: 'profile-report' },
    h('div', { className: 'profile-report-head' },
      h('button', { type: 'button', onClick: () => shift(-1), 'aria-label': tc('Mois précédent') }, '‹'),
      h('strong', null, `${tc(PROFILE_MONTHS[month.getMonth()])} ${month.getFullYear()}`),
      h('button', { type: 'button', onClick: () => shift(1), disabled: isCurrent, 'aria-label': tc('Mois suivant') }, '›')
    ),
    report.total === 0
      ? h('p', { className: 'muted' }, tc('Aucun plat noté ce mois-ci. Donne ton verdict après un plat pour remplir le bilan.'))
      : h(React.Fragment, null,
        h('div', { className: 'profile-report-stats' },
          h('div', null, h('strong', null, report.total), h('span', null, report.total > 1 ? tc('plats cuisinés') : tc('plat cuisiné'))),
          h('div', null, h('strong', null, report.successes), h('span', null, report.successes > 1 ? tc('réussis') : tc('réussi'))),
          h('div', null, h('strong', null, report.discoveries), h('span', null, report.discoveries > 1 ? tc('nouvelles recettes') : tc('nouvelle recette'))),
          h('div', null, h('strong', null, `${report.delta >= 0 ? '+' : ''}${Math.round(report.delta)}`), h('span', null, tc('points de cote')))
        ),
        report.category && h('p', { className: 'profile-report-line' }, `${tc('Rayon préféré')} : ${tc(report.category)}`),
        h('ol', { className: 'profile-report-top' }, report.top.map(item => h('li', { key: item.id },
          h('button', { type: 'button', onClick: () => { onClose(); openRecipe(item.id); } }, tc(item.title)),
          h('span', null, `× ${item.count}`)
        )))
      )
  );
}

// ---------- Transfert par QR ----------
function encodeProfileTransfer(profile) {
  const payload = JSON.stringify({ n: profile.name, s: profile.servings, d: profile.diet, a: profile.allergens, x: profile.dislikes, t: profile.toTry, o: profile.notes });
  const base = btoa(unescape(encodeURIComponent(payload))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${window.location.origin}/#profil=${base}`;
}

function decodeProfileTransfer(hash) {
  const match = String(hash || '').match(/#profil=([\w-]+)/);
  if (!match) return null;
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(match[1].replace(/-/g, '+').replace(/_/g, '/')))));
    return { name: data.n, servings: data.s, diet: data.d, allergens: data.a, dislikes: data.x, toTry: data.t, notes: data.o };
  } catch {
    return null;
  }
}

// Fusion : listes reunies, notes de l'autre appareil gardees si absentes ici.
function mergeProfileTransfer(received) {
  const current = readProfile();
  const union = (a, b) => [...new Set([...(a || []), ...(Array.isArray(b) ? b : [])])];
  writeJson(PROFILE_KEY, {
    ...current,
    name: current.name || received.name || '',
    servings: current.servings || received.servings || 0,
    diet: current.diet || received.diet || '',
    allergens: union(current.allergens, received.allergens),
    dislikes: union(current.dislikes, received.dislikes),
    toTry: union(current.toTry, received.toTry),
    notes: { ...(received.notes && typeof received.notes === 'object' ? received.notes : {}), ...current.notes },
    created: current.created || Date.now()
  });
  const merged = readProfile();
  writeProfile(merged);
  return merged;
}

function ProfileTransferQr({ url }) {
  const canvasRef = useRef(null);
  const [state, setState] = useState('');
  useEffect(() => {
    let cancelled = false;
    setState('');
    loadDeferredScript(QR_CODE_SCRIPT_SRC, 'QRCode').then(QRCode => {
      if (cancelled || !canvasRef.current || !QRCode?.create) return;
      try {
        drawFineQr(canvasRef.current, QRCode, url, 196);
        setState('ready');
      } catch {
        setState('big');
      }
    }).catch(() => { if (!cancelled) setState('big'); });
    return () => { cancelled = true; };
  }, [url]);
  return h('div', { className: 'profile-qr' },
    state !== 'big' && h('canvas', { ref: canvasRef, className: 'qr-canvas', width: 196, height: 196, 'aria-label': tc('QR code du profil') }),
    h('p', null, state === 'big'
      ? tc('Profil trop long pour un QR code : utilise le fichier de sauvegarde.')
      : tc('Scanne-le avec l’autre appareil : goûts, notes et liste à essayer y sont ajoutés. Le parcours de chef a son propre QR.'))
  );
}

// ---------- Sauvegarde automatique dans un fichier ----------
// Chrome / Edge sur ordinateur : on choisit une fois le fichier, Cook Note le
// reecrit ensuite tout seul quand les donnees changent (verifie toutes les
// minutes). Le lien vers le fichier est garde dans IndexedDB ; apres un
// redemarrage du navigateur, un clic redonne l'autorisation. Ailleurs : un
// rappel de la date de la derniere sauvegarde.
const BACKUP_AT_KEY = 'cook_note_backup_at';
const AUTO_BACKUP_SUPPORTED = typeof window.showSaveFilePicker === 'function';
let autoBackupLastText = '';

function backupHandleStore(mode, action) {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return resolve(null);
    const request = indexedDB.open('cook-note-backup', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('handles');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const store = request.result.transaction('handles', mode).objectStore('handles');
      const step = action(store);
      step.onsuccess = () => resolve(step.result || null);
      step.onerror = () => reject(step.error);
    };
  });
}
const readBackupHandle = () => backupHandleStore('readonly', store => store.get('file')).catch(() => null);
const saveBackupHandle = handle => backupHandleStore('readwrite', store => (handle ? store.put(handle, 'file') : store.delete('file'))).catch(() => null);

function markBackupDone() {
  try { localStorage.setItem(BACKUP_AT_KEY, String(Date.now())); } catch { /* stockage plein */ }
}

async function writeAutoBackup(handle, force = false) {
  if (!handle || (await handle.queryPermission?.({ mode: 'readwrite' })) !== 'granted') return false;
  const snapshot = localDataSnapshot();
  const text = JSON.stringify(snapshot.data);
  if (!force && text === autoBackupLastText) return true;
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(snapshot, null, 2));
  await writable.close();
  autoBackupLastText = text;
  markBackupDone();
  return true;
}

if (AUTO_BACKUP_SUPPORTED && typeof window.setInterval === 'function') {
  window.setInterval(() => { readBackupHandle().then(handle => writeAutoBackup(handle)).catch(() => {}); }, 60000);
  window.addEventListener('pagehide', () => { readBackupHandle().then(handle => writeAutoBackup(handle)).catch(() => {}); });
}

function AutoBackupBlock({ notify }) {
  const [state, setState] = useState('loading');
  const [at, setAt] = useState(() => Number(readJson(BACKUP_AT_KEY, 0)) || 0);
  const refresh = () => readBackupHandle().then(async handle => {
    setAt(Number(readJson(BACKUP_AT_KEY, 0)) || 0);
    if (!handle) return setState('off');
    const permission = await handle.queryPermission?.({ mode: 'readwrite' });
    setState(permission === 'granted' ? 'on' : 'paused');
  });
  useEffect(() => { if (AUTO_BACKUP_SUPPORTED) refresh(); }, []);
  const days = at ? Math.floor((Date.now() - at) / 86400000) : -1;
  const when = at ? new Date(at).toLocaleString(COOK_NOTE_LANG === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
  if (!AUTO_BACKUP_SUPPORTED) {
    return h('small', { className: days < 0 || days >= 14 ? 'profile-backup-late' : '' }, days < 0
      ? tc('Aucune sauvegarde pour l’instant. Ce navigateur ne permet pas la sauvegarde automatique : pense au fichier de temps en temps.')
      : `${tc('Dernière sauvegarde')} : ${when}${days >= 14 ? ` · ${tc('pense à en refaire une')}` : ''}`);
  }
  const enable = async () => {
    try {
      const handle = await window.showSaveFilePicker({ suggestedName: 'cook-note-sauvegarde.json', types: [{ description: 'Sauvegarde Cook Note', accept: { 'application/json': ['.json'] } }] });
      await saveBackupHandle(handle);
      await writeAutoBackup(handle, true);
      notify?.(tc('Sauvegarde automatique activée'), 'success');
    } catch { /* choix annule */ }
    refresh();
  };
  const resume = async () => {
    const handle = await readBackupHandle();
    if (handle && (await handle.requestPermission?.({ mode: 'readwrite' })) === 'granted') await writeAutoBackup(handle, true);
    refresh();
  };
  const stop = async () => {
    await saveBackupHandle(null);
    notify?.(tc('Sauvegarde automatique arrêtée'));
    refresh();
  };
  return h('div', { className: 'profile-autobackup' },
    state === 'on'
      ? h(React.Fragment, null,
        h('span', { className: 'profile-autobackup-on' }, `● ${tc('Sauvegarde automatique active')}${when ? ` · ${when}` : ''}`),
        h('button', { type: 'button', onClick: stop }, tc('Arrêter')))
      : state === 'paused'
        ? h('button', { type: 'button', className: 'week-tool', onClick: resume }, tc('Reprendre la sauvegarde automatique'))
        : h('button', { type: 'button', className: 'week-tool', onClick: enable }, tc('Sauvegarde automatique…')),
    state !== 'on' && h('small', null, state === 'paused'
      ? tc('Le navigateur a redémarré : un clic pour l’autoriser à nouveau à écrire dans ton fichier.')
      : tc('Choisis une fois où ranger le fichier : Cook Note le met à jour tout seul à chaque changement.'))
  );
}

// ---------- Panneau Mon profil ----------
const PROFILE_TABS = [['bilan', 'Bilan'], ['essayer', 'À essayer'], ['gouts', 'Goûts'], ['notes', 'Notes']];

function ProfilePanel({ open, onClose, recipesById, openRecipe, notify }) {
  const profile = useProfile();
  const [tab, setTab] = useState('bilan');
  const [word, setWord] = useState('');
  // Gouts : modifies en brouillon, enregistres d'un bouton.
  const [draft, setDraft] = useState(null);
  const [atlas, setAtlas] = useState(() => (window.cookNoteAtlasReady ? window.cookNoteAtlas : null));
  useEffect(() => { if (!open) { setTab('bilan'); setDraft(null); } }, [open]);
  useEffect(() => { if (open && tab === 'gouts' && !atlas && typeof loadIngredientAtlas === 'function') loadIngredientAtlas().then(setAtlas).catch(() => {}); }, [open, tab]);
  if (!open) return null;
  // Avant la creation : ce que deviennent les donnees, en clair.
  if (!profile.created) {
    return h(ModalDialog, { className: '', onClose },
      h('section', { className: 'modal-panel profile-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'profile-intro-title', onMouseDown: event => event.stopPropagation() },
        h('div', { className: 'modal-head' },
          h('div', null, h('p', { className: 'eyebrow' }, tc('Mon profil')), h('h2', { id: 'profile-intro-title' }, tc('Tes données restent chez toi'))),
          h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
        ),
        h('div', { className: 'profile-intro' },
          h('p', null, tc('Ton profil (pseudonyme, goûts, allergies, notes, plats cuisinés) est enregistré uniquement dans ce navigateur, sur cet appareil.')),
          h('ul', null,
            h('li', null, tc('Rien n’est envoyé : Cook Note n’a ni serveur de comptes, ni base de données, ni mot de passe. Aucune fuite n’est possible depuis le site, il n’y a rien à pirater de notre côté.')),
            h('li', null, tc('Aucun e-mail, aucun numéro, aucune donnée bancaire n’est demandé.')),
            h('li', null, tc('Tes données ne quittent l’appareil que si tu le choisis : QR code, fichier de sauvegarde ou rapport envoyé par e-mail.')),
            h('li', null, tc('À savoir : une personne qui utilise cet appareil peut voir ton profil, et vider les données du navigateur l’efface. Pense au fichier de sauvegarde.'))
          ),
          h('div', { className: 'profile-intro-actions' },
            h(Button, { variant: 'primary', onClick: () => updateProfile({ created: Date.now() }) }, tc('Créer mon profil')),
            h(Button, { variant: 'ghost', onClick: onClose }, tc('Plus tard'))
          )
        )
      )
    );
  }
  const tastes = draft || { servings: profile.servings, diet: profile.diet, allergens: profile.allergens, dislikes: profile.dislikes };
  const editTastes = changes => setDraft({ ...tastes, ...changes });
  const toggleIn = (key, value) => editTastes({ [key]: tastes[key].includes(value) ? tastes[key].filter(item => item !== value) : [...tastes[key], value] });
  const addDislike = () => {
    const value = word.trim().toLowerCase();
    if (value && !tastes.dislikes.includes(value)) editTastes({ dislikes: [...tastes.dislikes, value] });
    setWord('');
  };
  const saveTastes = () => {
    updateProfile(tastes);
    setDraft(null);
    notify?.(tc('Paramètres enregistrés'), 'success');
  };
  const go = id => { onClose(); openRecipe(id); };
  const toTry = profile.toTry.filter(id => recipesById[id]);
  const notes = Object.entries(profile.notes).filter(([id]) => recipesById[id]);
  return h(ModalDialog, { className: '', onClose },
    h('section', { className: 'modal-panel profile-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'profile-modal-title', onMouseDown: event => event.stopPropagation() },
      h('div', { className: 'modal-head' },
        h('div', null,
          h('p', { className: 'eyebrow' }, tc('Mon profil')),
          h('input', { id: 'profile-modal-title', className: 'profile-name', type: 'text', value: profile.name, maxLength: 40, placeholder: tc('Ton pseudonyme'), 'aria-label': tc('Ton pseudonyme'), onChange: event => updateProfile({ name: event.target.value }) })
        ),
        h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': 'Fermer' }, h(Icon, { name: 'close' }))
      ),
      h('div', { className: 'chef-tabs profile-tabs', role: 'tablist' },
        PROFILE_TABS.map(([id, label]) => h('button', { key: id, type: 'button', role: 'tab', 'aria-selected': tab === id, className: tab === id ? 'is-active' : '', onClick: () => setTab(id) },
          tc(label),
          id === 'essayer' && toTry.length > 0 && h('em', null, toTry.length)
        ))
      ),
      tab === 'bilan' && h(ProfileMonthReport, { recipesById, openRecipe, onClose }),
      tab === 'essayer' && (toTry.length
        ? h('ul', { className: 'profile-list' }, toTry.map(id => h('li', { key: id },
          h('button', { type: 'button', className: 'profile-list-title', onClick: () => go(id) }, tc(recipesById[id].title)),
          h('button', { type: 'button', className: 'profile-list-remove', onClick: () => toggleToTry(id), 'aria-label': `${tc('Retirer')} ${tc(recipesById[id].title)}` }, '×')
        )))
        : h('p', { className: 'muted' }, tc('Touche « ☆ À essayer » sur une fiche pour la garder ici. Une fois cuisinée, elle passe dans le bilan.'))),
      tab === 'gouts' && h('div', { className: 'profile-tastes' },
        h('div', { className: 'profile-field' },
          h('strong', null, tc('Portions par défaut')),
          h('div', { className: 'profile-chips' },
            [0, 1, 2, 3, 4, 6, 8].map(count => h('button', { key: count, type: 'button', className: tastes.servings === count ? 'is-on' : '', 'aria-pressed': tastes.servings === count, onClick: () => editTastes({ servings: count }) }, count ? String(count) : tc('Fiche')))
          ),
          h('small', null, tc('Chaque fiche s’ouvre pour ce nombre de personnes.'))
        ),
        h('div', { className: 'profile-field' },
          h('strong', null, tc('Régime')),
          h('div', { className: 'profile-chips' },
            PROFILE_DIETS.map(([id, label]) => h('button', { key: id || 'none', type: 'button', className: tastes.diet === id ? 'is-on' : '', 'aria-pressed': tastes.diet === id, onClick: () => editTastes({ diet: id }) }, tc(label)))
          )
        ),
        h('div', { className: 'profile-field' },
          h('strong', null, tc('Allergies')),
          h('div', { className: 'profile-chips' },
            PROFILE_ALLERGENS.map(label => h('button', { key: label, type: 'button', className: tastes.allergens.includes(label) ? 'is-on' : '', 'aria-pressed': tastes.allergens.includes(label), onClick: () => toggleIn('allergens', label) }, tc(label)))
          )
        ),
        h('div', { className: 'profile-field' },
          h('strong', null, tc('Je n’aime pas')),
          // Liste deroulante : les ingredients de l'atlas (comme Mon frigo).
          h('form', { className: 'profile-word-form', onSubmit: event => { event.preventDefault(); addDislike(); } },
            h('input', { type: 'text', list: 'profile-ingredients', value: word, maxLength: 40, placeholder: tc('Choisis un ingrédient…'), 'aria-label': tc('Ingrédient à éviter'), onChange: event => setWord(event.target.value) }),
            atlas && h('datalist', { id: 'profile-ingredients' }, atlas.entries.map(entry => h('option', { key: entry.id, value: tc(entry.name) }))),
            h('button', { type: 'submit', disabled: !word.trim() }, tc('Ajouter'))
          ),
          tastes.dislikes.length > 0 && h('div', { className: 'profile-chips' },
            tastes.dislikes.map(item => h('button', { key: item, type: 'button', className: 'is-on', onClick: () => toggleIn('dislikes', item), 'aria-label': `${tc('Retirer')} ${item}` }, `${item} ×`))
          ),
          h('small', null, tc('Les fiches concernées sont signalées, et Ma semaine les évite.'))
        ),
        h('div', { className: 'profile-save' },
          draft && h('small', null, tc('Modifications non enregistrées')),
          h(Button, { variant: 'primary', disabled: !draft, onClick: saveTastes }, tc('Enregistrer les paramètres'))
        )
      ),
      tab === 'notes' && (notes.length
        ? h('ul', { className: 'profile-list' }, notes.map(([id, text]) => h('li', { key: id },
          h('button', { type: 'button', className: 'profile-list-title', onClick: () => go(id) }, tc(recipesById[id].title), h('small', null, text))
        )))
        : h('p', { className: 'muted' }, tc('Touche « ✎ Ajouter une note » sous le titre d’une fiche : la note y reste, sur cet appareil.'))),
      // Pied : deux cartes cote a cote (bureau), l'une sous l'autre (telephone).
      h('div', { className: 'profile-foot' },
        // Fichier de sauvegarde : tout Cook Note (profil, parcours, favoris,
        // semaine, courses...) pour restaurer apres un nettoyage du navigateur.
        h('section', { className: 'profile-card' },
          h('strong', null, tc('Sauvegarde')),
          h('div', { className: 'profile-card-actions' },
            h('button', { type: 'button', className: 'week-tool', onClick: () => { downloadLocalDataBackup(); markBackupDone(); notify?.(tc('Sauvegarde enregistrée dans tes téléchargements')); } }, h(Icon, { name: 'download' }), h('span', null, tc('Sauvegarder'))),
            h('label', { className: 'week-tool profile-restore' },
              h('span', null, tc('Restaurer')),
              h('input', { type: 'file', accept: 'application/json,.json', 'aria-label': tc('Restaurer un fichier'), onChange: event => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (!file) return;
                file.text().then(text => {
                  if (!window.confirm(tc('Restaurer cette sauvegarde ? Les données actuelles de Cook Note seront remplacées par celles du fichier.'))) return;
                  const count = restoreLocalDataBackup(text);
                  notify?.(`${tc('Sauvegarde restaurée')} (${count})`, 'success');
                  window.setTimeout(() => window.location.reload(), 600);
                }).catch(error => notify?.(error?.message || tc('Fichier illisible'), 'info'));
              } })
            )
          ),
          h(AutoBackupBlock, { notify }),
          h('small', null, tc('Le fichier garde tout (profil, parcours de chef, favoris, semaine, courses) : à faire avant de vider le navigateur.'))
        ),
        h('section', { className: 'profile-card profile-card-qr' },
          h('strong', null, tc('Sur un autre appareil')),
          h(ProfileTransferQr, { url: encodeProfileTransfer(profile) })
        )
      )
    )
  );
}

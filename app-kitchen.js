// Fonctions « cuisine » partagees par les panneaux : mode frigo de la
// recherche, sous-familles et tri des pages categorie, retroplanning du
// service (« je sers a 20 h »). Script classique, charge avant app-panels.js.

// « Avec ce que j'ai » : ouvert depuis la palette ou la recherche, il invite a
// lister ses ingredients (virgules) ; les resultats se rangent par faisabilite.
const FRIDGE_MODE_KEY = 'cook_note_fridge_mode';

function requestFridgeSearch() {
  try { sessionStorage.setItem(FRIDGE_MODE_KEY, '1'); } catch { /* sans stockage : recherche normale */ }
}

// Sous-familles des pages categorie, deduites du titre (premiere regle qui
// correspond ; le reste va dans « Autres »). Les fiches ne changent pas.
const COLLECTION_FAMILIES = {
  desserts_maitre: [
    ['Brioches et crêpes', /\b(brioche|babka|chinois|pain perdu|crepe|beignet|churros)/],
    ['Tartes', /\b(tarte|fond de tarte)/],
    ['Gâteaux', /\b(cake|gateau|fondant|mi-cuit|cheesecake|opera|charlotte|tiramisu|paris-brest|clafoutis|crumble)/],
    ['Petits gâteaux', /\b(muffin|madeleine|cookie|biscuit|sable|choux|macaron|spritz|meringue|carres)/],
    ['Crèmes et entremets', /\b(creme|flan|panna cotta|mousse|ile flottante|chantilly|souffle)/],
    ['Fruits et bases', /\b(coulis|caramel|marmelade|confit|pate a|poire|fraise|granola)/]
  ],
  plats_maitre: [
    ['Poissons et fruits de mer', /\b(crevette|calamar|chipiron|encornet|cabillaud|saumon|lotte|saint-jacques|bouillabaisse|fish|paella)/],
    ['Volaille et lapin', /\b(poulet|volaille|coq|canard|lapin)/],
    ['Pâtes et riz', /\b(pates|tagliatelle|rigatoni|macaroni|coquillette|riz|ble|nems|okonomiyaki|carbonara)/],
    ['Bœuf, veau et agneau', /\b(boeuf|bavette|veau|agneau|burger|joues|osso|navarin|tartare|carpaccio)/],
    ['Porc et charcuterie', /\b(porc|cochon|saucisse|chorizo|croque|rougail|cassoulet|morteau|flammekueche|potee)/],
    ['Légumes et gratins', /\b(lentille|dhal|haricot|legum|curry|gratin|tian|courge|tomates farcies|piperade|souffle|fondue|flan)/]
  ],
  entrees_maitre: [
    ['Salades', /\b(salade|carpaccio betterave|tomate mozzarella)/],
    ['Mer', /\b(crevette|calamar|chipiron|saint-jacques|langoustine|morue|thon|anchois)/],
    ['Œufs', /\b(oeuf|tortilla|souffle|tamago)/],
    ['Foie gras et viandes', /\b(foie gras|pate en croute|tartare|carpaccio|samoussa|lard)/],
    ['Fromages et bouchées', /\b(fromage|mozzarella|burrata|brie|roquefort|gougere|bricks|bruschetta|cannele|brownie|quichette)/],
    ['Légumes et soupes', /\b(legume|veloute|gaspacho|tomate|asperge|chou-fleur|oignon|houmous|falafel|pois chiche|acras|melon|courgette|betterave)/]
  ],
  accompagnements_maitre: [
    ['Pommes de terre', /\b(pomme|patate|frite|rattes|wedges|duchesse|dauphine|croquette)/],
    ['Pains', /\b(pain|focaccia|pita)/],
    ['Riz et céréales', /\b(riz|polenta|lentille|haricot)/],
    ['Légumes', /\b(carott|chou|tomate|legum|oignon|petits pois|asperge|aubergine|tian|puree|curry|mousse|galettes)/],
    ['Sauces et garnitures', /\b(sauce|pesto|topping)/]
  ],
  apero_maitre: [
    ['Brochettes', /\bbrochette/],
    ['Fritures et bouchées chaudes', /\b(beignet|tempura|accras|acras|croquette|samoussa|falafel|chou-fleur|gougere|choux)/],
    ['Tartinables et terrines', /\b(houmous|aioli|beurre|sauce|yaourt|pesto|rillette|terrine|pate en croute|verrine)/],
    ['Fromages', /\b(fromage|mozzarella|burrata|brie|chevre|roquefort)/],
    ['Biscuits, pains et cakes', /\b(cookie|gressin|sable|pain|focaccia|cake|brownie|galette|batonnet|madeleine|cannele|brioche|quichette|flammekueche|tortilla)/]
  ],
  sauces_maitre: [
    ['Sauces chaudes', /\b(bearnaise|hollandaise|chasseur|bordelaise|perigueux|bourguignonne|beurre blanc|morille|porto|poivre|estragon|fond de veau|fromage|moutarde)/],
    ['Sauces froides et condiments', /\b(mayonnaise|aioli|rouille|tartare|remoulade|gribiche|vinaigrette|burger|yaourt|ricotta|pesto|harissa|huile|balsamique|marinade|topping|nem|aigre)/],
    ['Sauces sucrées', /\b(caramel|coulis)/]
  ],
  elements_base_maitre: [
    ['Pains et pâtes levées', /\b(pain|baguette|bagel|brioche|levain|tortilla|tresse|biscuits|pizza)/],
    ['Pâtes et crèmes', /\b(pate|tempura|base pour flan|craquelin|meringue|creme)/],
    ['Beurres, fonds et bouillons', /\b(beurre|fond|bouillon|babeurre|chapelure)/],
    ['Fruits et condiments', /\b(coulis|marmelade|confit|cerise|citron|tamago)/]
  ],
  petit_dejeuner_maitre: [
    ['Brioches', /\b(brioche|babka|chinois|tresse)/],
    ['Pains', /\b(pain|bagel)/],
    ['Crêpes, gaufres et pancakes', /\b(crepe|gaufre|pancake|madeleine)/]
  ]
};

function collectionFamilyOf(parentId, recipe) {
  const rules = COLLECTION_FAMILIES[parentId];
  if (!rules) return '';
  const title = normalizeText(recipe?.title || '');
  const match = rules.find(([, pattern]) => pattern.test(title));
  return match ? match[0] : 'Autres';
}

const COLLECTION_SORTS = [
  ['alpha', 'De A à Z'],
  ['quick', 'Les plus rapides'],
  ['easy', 'Les plus faciles']
];

// Carte de categorie : temps total et difficulte, quand la fiche les donne.
function collectionCardMeta(recipe) {
  const total = Number(recipe?.activeTime || 0) + Number(recipe?.cookTime || 0) + Number(recipe?.restTime || 0);
  return [
    total ? formatTotalDuration(total, Number(recipe?.restTime || 0)) : '',
    Number.isFinite(recipe?.difficultyScore) ? `Difficulté ${recipe.difficultyScore}/10` : ''
  ].filter(Boolean).join(' · ');
}

// ---------- Retroplanning : « je sers a 20 h » ----------
// A partir des temps de chaque fiche (preparation, cuisson, repos), l'heure a
// laquelle commencer chaque phase ; rappels en notification a chaque etape.
function parseServeTime(value) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value || '');
  if (!match) return null;
  const date = new Date();
  date.setHours(Number(match[1]), Number(match[2]), 0, 0);
  // Heure deja passee : c'est pour demain.
  if (date.getTime() < Date.now() - 5 * 60000) date.setDate(date.getDate() + 1);
  return date;
}

function formatServeClock(date, serveDate) {
  const clock = `${date.getHours()} h ${String(date.getMinutes()).padStart(2, '0')}`;
  const day = value => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const daysBefore = Math.round((day(serveDate) - day(date)) / 86400000);
  if (daysBefore <= 0) return clock;
  return daysBefore === 1 ? `La veille, ${clock}` : `J-${daysBefore}, ${clock}`;
}

function servePlanEvents(entries, serveAt) {
  const events = [];
  entries.forEach(({ title, timing }) => {
    const active = timing.active || 0;
    const cook = timing.cook || 0;
    const rest = timing.rest || 0;
    const start = serveAt - (active + cook + rest) * 60000;
    // Une seule fiche : phrases avec majuscule ; un menu : « Plat : action ».
    const say = text => (entries.length > 1 ? `${title} : ${text}` : text.charAt(0).toUpperCase() + text.slice(1));
    events.push({ at: start, label: say('commencer la préparation') });
    if (cook) events.push({ at: start + active * 60000, label: say('lancer la cuisson') });
    if (rest) events.push({ at: start + (active + cook) * 60000, label: say(rest >= 480 ? 'laisser reposer la nuit' : `laisser reposer ${formatMinutesShort(rest)}`) });
  });
  events.sort((left, right) => left.at - right.at);
  events.push({ at: serveAt, label: 'Servir' });
  return events;
}

function ServeTimePlanner({ entries, className = '' }) {
  const [value, setValue] = useState('');
  const [reminders, setReminders] = useState('');
  const timeoutsRef = useRef([]);
  const clearReminders = () => {
    timeoutsRef.current.forEach(id => window.clearTimeout(id));
    timeoutsRef.current = [];
  };
  useEffect(() => clearReminders, []);
  const longest = Math.max(0, ...entries.map(({ timing }) => (timing.active || 0) + (timing.cook || 0) + (timing.rest || 0)));
  if (!longest) return null;
  const serveDate = parseServeTime(value);
  const events = serveDate ? servePlanEvents(entries, serveDate.getTime()) : [];
  const late = events.length > 1 && events[0].at < Date.now();
  const remind = async () => {
    const allowed = await askKitchenNotifications();
    clearReminders();
    if (!allowed) {
      setReminders('refused');
      return;
    }
    events.filter(event => event.at > Date.now()).forEach((event, index) => {
      timeoutsRef.current.push(window.setTimeout(
        () => notifyKitchen(`${formatServeClock(new Date(event.at), serveDate)} · Cook Note`, event.label, `plan-${index}`),
        event.at - Date.now()
      ));
    });
    setReminders('on');
  };
  return h('div', { className: ['serve-planner', className].filter(Boolean).join(' ') },
    h('div', { className: 'serve-planner-head' },
      h('label', { className: 'serve-planner-time' },
        h('span', null, 'Je sers à'),
        h('input', {
          type: 'time',
          value,
          step: 300,
          onChange: event => {
            clearReminders();
            setReminders('');
            setValue(event.target.value);
          }
        })
      ),
      serveDate && KITCHEN_NOTIFICATIONS && h('button', {
        type: 'button',
        className: 'serve-planner-remind',
        disabled: reminders === 'on',
        onClick: remind
      }, h(Icon, { name: 'bell' }), h('span', null, reminders === 'on' ? 'Rappels programmés' : reminders === 'refused' ? 'Notifications refusées' : 'Me prévenir'))
    ),
    serveDate
      ? h('ol', { className: 'serve-planner-steps' },
        events.map((event, index) => h('li', { key: `${event.at}-${index}`, className: event.at < Date.now() ? 'is-past' : '' },
          h('time', null, formatServeClock(new Date(event.at), serveDate)),
          h('span', null, event.label)
        )))
      : h('p', { className: 'serve-planner-hint' }, 'Choisis l’heure de service : Cook Note calcule quand commencer chaque étape.'),
    late && h('p', { className: 'serve-planner-hint is-warning' }, 'Trop juste pour cette heure : décale le service ou commence tout de suite.'),
    reminders === 'on' && h('p', { className: 'serve-planner-hint' }, 'Garde Cook Note ouvert (même en arrière-plan) pour recevoir les rappels.')
  );
}

// ---------- Mains libres : commandes vocales du mode cuisine ----------
// Cook Note ecoute mais ne parle pas : chaque commande comprise est affichee.
// Seules des phrases courtes qui SONT une commande declenchent (pas un mot
// entendu au milieu d'une conversation) ; une commande nette agit des le
// resultat provisoire, sans attendre la fin de phrase.
const SPEECH_RECOGNITION = window.SpeechRecognition || window.webkitSpeechRecognition || null;
const HANDS_FREE_KEY = 'cook_note_hands_free';
const FRENCH_NUMBERS = {
  un: 1, une: 1, premier: 1, premiere: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8,
  neuf: 9, dix: 10, onze: 11, douze: 12, treize: 13, quatorze: 14, quinze: 15, seize: 16, vingt: 20,
  trente: 30, quarante: 40, cinquante: 50, soixante: 60
};

const voiceNumber = token => (/^\d+$/.test(token) ? Number(token) : FRENCH_NUMBERS[token]);

// « dix sept » -> 17, « vingt et un » -> 21, « quatre vingt » -> 80, « 12 » -> 12.
function spokenNumber(text) {
  let total = 0;
  let previous = 0;
  for (const token of String(text || '').split(/\s+/).filter(Boolean)) {
    if (token === 'et') continue;
    const value = voiceNumber(token);
    if (value === undefined) return 0;
    total = value === 20 && previous === 4 ? total + 76 : total + value;
    previous = value;
  }
  return total;
}

// « minuteur dix minutes », « 1 heure 30 », « vingt-cinq minutes » -> secondes.
function spokenDurationSeconds(text) {
  // « un minuteur de dix minutes » : l'article n'est pas une duree.
  const words = normalizeText(text)
    .replace(/-/g, ' ')
    .replace(/\b(un|une)\s+(minuteur|minuterie|chrono|timer)\b/g, '$2')
    .replace(/(\d+)\s*h\s*(\d+)/, '$1 heure $2 minute');
  let total = 0;
  let pending = 0;
  words.split(/\s+/).forEach(token => {
    const value = voiceNumber(token);
    if (value !== undefined) pending += value;
    else if (/^(h|heures?)$/.test(token)) { total += pending * 3600; pending = 0; }
    else if (/^(min|minutes?|mn)$/.test(token)) { total += pending * 60; pending = 0; }
    else if (/^(s|sec|secondes?)$/.test(token)) { total += pending; pending = 0; }
    else if (token === 'demi' || token === 'demie') total += total >= 3600 ? 1800 : 30;
  });
  if (pending && total >= 3600) total += pending * 60;
  return total;
}

// Commandes : la phrase entiere (moins les politesses) doit correspondre.
const VOICE_COMMANDS = [
  ['next', /^(suivant|suivante|etape suivante|la suite|et apres|on continue|continue|c est fait|fait|c est bon|j ai fini|termine l etape|ok suivant)$/],
  ['previous', /^(precedent|precedente|etape precedente|retour|reviens|reviens en arriere|en arriere)$/],
  ['first', /^(premiere etape|la premiere etape|au debut|debut|recommence|recommencer|retour au debut|depuis le debut|reprends du debut)$/],
  ['last', /^(derniere etape|la derniere etape|a la fin|va a la fin)$/],
  ['help', /^(aide|aide moi|a l aide|commandes|les commandes|qu est ce que je peux dire|que puis je dire|je peux dire quoi)$/],
  ['mute', /^(coupe le micro|arrete d ecouter|arrete l ecoute|desactive la voix|micro off)$/],
  // « stop » seul arrete l'alarme d'un minuteur termine, « pause » seul met
  // les minuteurs en pause.
  ['timerStop', /^(stop|arrete|silence|ca suffit)$/],
  ['timerPause', /^pause$/],
  ['close', /^(terminer|quitter|ferme|fermer|fin|quitte le mode cuisine|ferme le mode cuisine|sortir)$/]
];
const TIMER_WORD = /\b(minuteurs?|minuterie|chrono|timer|alarme|sonnerie)\b/;

function parseVoiceCommand(transcript) {
  const said = normalizeText(transcript)
    .replace(/['’-]/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const core = said
    .replace(/^(ok|okay|alors|bon|euh|cook note|dis|hey)\s+/, '')
    .replace(/\s+(s il te plait|s il vous plait|stp|merci)$/, '')
    .trim();
  if (!core) return null;
  const words = core.split(' ');
  // Minuteurs en cours : « arrete le minuteur », « pause minuteur »,
  // « reprends le chrono », « combien de temps », « il reste combien ».
  if (words.length <= 6) {
    const timerWord = TIMER_WORD.test(core);
    if (timerWord && /^(arrete|arreter|stop|stoppe|coupe|annule|eteins|ferme|supprime|enleve)\b/.test(core)) return { type: 'timerStop', heard: core };
    if (timerWord && /^(pause|mets en pause|mets pause|suspends?)\b/.test(core)) return { type: 'timerPause', heard: core };
    if (timerWord && /^(reprends|reprendre|relance|redemarre|continue)\b/.test(core)) return { type: 'timerResume', heard: core };
    if (/^(combien de temps|il reste combien|combien il reste|combien reste t il|temps restant|ou en est le minuteur|ou en sont les minuteurs|le minuteur en est ou)\b/.test(core)) {
      return { type: 'timerLeft', heard: core };
    }
  }
  // « minuteur 10 minutes », « lance un minuteur de cinq minutes », « minuteur ».
  if (words.length <= 8 && TIMER_WORD.test(core)) {
    return { type: 'timer', seconds: spokenDurationSeconds(core), heard: core };
  }
  // « etape 4 », « va a l etape dix sept », « etape numero trois ».
  const jump = core.match(/^(?:va a l |aller a l |passe a l |on passe a l )?etape (?:numero |n )?([a-z0-9 ]+)$/);
  if (jump && spokenNumber(jump[1])) return { type: 'goto', step: spokenNumber(jump[1]), heard: core };
  if (words.length > 5) return null;
  const match = VOICE_COMMANDS.find(([, pattern]) => pattern.test(core));
  return match ? { type: match[0], heard: core } : null;
}

// Aide affichee par « aide » (exemples, pas une liste exhaustive).
const VOICE_HELP = [
  ['Avancer', '« suivant », « c’est fait »'],
  ['Revenir', '« précédent », « première étape », « dernière étape »'],
  ['Aller à', '« étape 4 », « étape dix-sept »'],
  ['Minuteur', '« minuteur 10 minutes », « minuteur » (durée de l’étape)'],
  ['Minuteurs en cours', '« combien de temps », « pause », « reprends le minuteur », « stop »'],
  ['Micro', '« coupe le micro »'],
  ['Quitter', '« terminer »']
].map(([label, examples]) => [label, examples.replace(/« /g, '« ').replace(/ »/g, ' »')]);

// Etiquette d'un minuteur lance a la voix : « 10 min », « 1 h 30 », « 45 s ».
function formatTimerLabel(seconds) {
  if (seconds < 60) return `${seconds} s`;
  return seconds % 60 ? formatTimerClock(seconds) : formatMinutesShort(seconds / 60);
}

const VOICE_ERRORS = {
  'not-allowed': 'Micro non autorisé : touche « Réessayer » et accepte la demande du navigateur.',
  'service-not-allowed': 'Micro non autorisé : touche « Réessayer » et accepte la demande du navigateur.',
  'audio-capture': 'Aucun micro détecté sur cet appareil.',
  network: 'La reconnaissance vocale de ce navigateur a besoin d’Internet.'
};
// Hors https et localhost, Chrome refuse le micro sans rien demander.
const VOICE_INSECURE = 'Le micro ne marche qu’en adresse sécurisée : ouvre Cook Note par https:// ou http://localhost:8080.';
const VOICE_BLOCKED_SITE ='Micro bloqué pour ce site : clique sur l’icône à gauche de l’adresse, Micro, Autoriser, puis « Réessayer ».';
const VOICE_BLOCKED_SYSTEM = 'Micro bloqué par l’appareil. Sur Windows : Paramètres, Confidentialité, Microphone, autoriser les applications de bureau, puis « Réessayer ».';

// Refus du micro : bloque par le site (reglage du navigateur), par le systeme
// (le site est autorise mais le micro reste inaccessible) ou simple demande
// ignoree. Renvoie le message a afficher.
async function microphoneRefusalMessage() {
  if (window.isSecureContext === false) return VOICE_INSECURE;
  let permission = 'prompt';
  try {
    permission = (await navigator.permissions?.query({ name: 'microphone' }))?.state || 'prompt';
  } catch {
    /* Requete de permission non geree (Firefox, Safari anciens). */
  }
  if (permission === 'denied') return VOICE_BLOCKED_SITE;
  if (permission === 'granted') return VOICE_BLOCKED_SYSTEM;
  return VOICE_ERRORS['not-allowed'];
}

// Geste « Réessayer » : redemande le micro (affiche la demande du navigateur).
// Un refus instantane, sans que la demande ait pu s'afficher, vient de
// l'appareil (Windows bloque le micro pour les applications de bureau).
async function requestMicrophone() {
  if (window.isSecureContext === false) return VOICE_INSECURE;
  const askedAt = Date.now();
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return '';
  } catch (error) {
    if (error?.name === 'NotFoundError') return VOICE_ERRORS['audio-capture'];
    if (error?.name === 'NotReadableError') return VOICE_BLOCKED_SYSTEM;
    const message = await microphoneRefusalMessage();
    return message === VOICE_ERRORS['not-allowed'] && Date.now() - askedAt < 400 ? VOICE_BLOCKED_SYSTEM : message;
  }
}

// Ecoute continue relancee a chaque fin de session (Chrome coupe apres un
// silence ou une minute). Les numeros de resultats repartent de 0 a chaque
// session : le suivi des resultats deja traites est remis a zero au demarrage.
// Une coupure reseau passagere est retentee avant d'afficher l'erreur.
const VOICE_NETWORK_RETRIES = 3;

function useHandsFree(enabled, onCommand) {
  const handlerRef = useRef(onCommand);
  handlerRef.current = onCommand;
  const [state, setState] = useState({ status: 'off', message: '' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled || !SPEECH_RECOGNITION) {
      setState({ status: 'off', message: '' });
      return undefined;
    }
    let active = true;
    let running = false;
    let fatal = '';
    let networkErrors = 0;
    let restartTimer = 0;
    let lastCommandAt = 0;
    let handled = new Set();
    const recognition = new SPEECH_RECOGNITION();
    recognition.lang = 'fr-FR';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    let startedAt = 0;
    const start = () => {
      if (!active || running || fatal) return;
      try {
        startedAt = Date.now();
        recognition.start();
        running = true;
      } catch {
        /* deja demarree : onend relancera */
      }
    };
    const scheduleStart = delay => {
      window.clearTimeout(restartTimer);
      restartTimer = window.setTimeout(start, delay);
    };

    recognition.onstart = () => {
      running = true;
      handled = new Set();
      if (active && !fatal) setState(current => ({ ...current, status: 'listening', message: '' }));
    };
    recognition.onend = () => {
      running = false;
      if (active && !fatal) scheduleStart(networkErrors ? 1000 * networkErrors : 250);
    };
    recognition.onerror = event => {
      if (event.error === 'network' && networkErrors < VOICE_NETWORK_RETRIES) {
        networkErrors += 1;
        return;
      }
      if (VOICE_ERRORS[event.error]) {
        fatal = event.error;
        const refused = event.error === 'not-allowed' || event.error === 'service-not-allowed';
        setState({ status: 'error', message: VOICE_ERRORS[event.error], retry: refused || event.error === 'audio-capture' });
        // Refus : on precise d'ou il vient (site ou appareil).
        if (refused) {
          const instant = Date.now() - startedAt < 400;
          microphoneRefusalMessage().then(message => {
            if (!active) return;
            setState({ status: 'error', message: message === VOICE_ERRORS['not-allowed'] && instant ? VOICE_BLOCKED_SYSTEM : message, retry: true });
          });
        }
      }
    };
    recognition.onresult = event => {
      networkErrors = 0;
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (handled.has(index)) continue;
        // Toutes les alternatives : la premiere commande reconnue l'emporte.
        let command = null;
        for (let alternative = 0; alternative < result.length && !command; alternative += 1) {
          command = parseVoiceCommand(result[alternative].transcript);
        }
        // Provisoire : on n'agit que sur une commande simple et nette.
        if (!result.isFinal && (!command || command.type === 'timer' || command.type === 'goto')) continue;
        if (!command) {
          if (result.isFinal) setState(current => ({ ...current, heard: result[0].transcript.trim() }));
          continue;
        }
        handled.add(index);
        const now = Date.now();
        if (now - lastCommandAt < 1200) continue;
        lastCommandAt = now;
        setState(current => ({ ...current, heard: '' }));
        handlerRef.current(command);
      }
    };

    setState({ status: 'starting', message: '' });
    start();
    return () => {
      active = false;
      window.clearTimeout(restartTimer);
      try { recognition.abort(); } catch { /* deja arretee */ }
    };
  }, [enabled, attempt]);

  // « Réessayer » (un geste) : redemande le micro puis relance l'ecoute.
  const retry = () => {
    setState({ status: 'starting', message: '' });
    requestMicrophone().then(message => {
      if (message) setState({ status: 'error', message, retry: true });
      else setAttempt(value => value + 1);
    });
  };
  return { ...state, retry };
}

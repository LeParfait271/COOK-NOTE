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

// ---------- Mains libres : commandes vocales du mode mains libres ----------
// Cook Note ecoute mais ne parle pas : chaque commande comprise est affichee.
// Seules des phrases courtes qui SONT une commande declenchent (pas un mot
// entendu au milieu d'une conversation) ; une commande nette agit des le
// resultat provisoire, sans attendre la fin de phrase.
//
// Reconnaissance 100 % locale (Vosk, WebAssembly) : le son du micro est
// analyse sur l'appareil et n'est jamais envoye ni enregistre. Le modele
// francais (40 Mo) est telecharge une seule fois puis garde dans le
// navigateur (IndexedDB). Il est servi par le depot GitHub : Cloudflare
// refuse les fichiers de plus de 25 Mo.
const VOSK_SCRIPT_URL = '/assets/vendor/vosk/vosk.js';
const VOSK_MODEL_NAME = 'vosk-model-small-fr-0.22.tar.gz';
const VOSK_MODEL_URL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location?.hostname || '')
  ? `/voice-model/${VOSK_MODEL_NAME}`
  : `https://raw.githubusercontent.com/LeParfait271/COOK-NOTE/main/voice-model/${VOSK_MODEL_NAME}`;
const VOSK_READY_KEY = 'cook_note_voice_model_ready';
const LOCAL_VOICE_SUPPORTED = typeof WebAssembly === 'object'
  && Boolean(window.AudioContext || window.webkitAudioContext)
  && Boolean(window.navigator?.mediaDevices?.getUserMedia);

// Vocabulaire ecoute : Vosk ne peut reconnaitre que ces mots, « [unk] »
// absorbe tout le reste (conversation, bruit). Plus fiable qu'une ecoute
// libre sur des mots courts (« ok », « pause », « dix »). Les mots souvent
// confondus avec du bruit (« attends », « dis ») sont volontairement absents.
const VOICE_VOCABULARY = `suivant suivante étape précédent précédente la suite c'est fait j'ai fini
retour reviens en arrière première dernière début recommence fin annule annuler décoche
ok okay d'accord compris merci pause reprends reprendre écoute
tous les ingrédients ingrédient liste matériel technique température quelle four temps restant
combien de d' du des il reste pour personnes parts double moitié quantités
minuteur chrono ajoute rajoute encore minute minutes seconde secondes heure heures et demie demi
arrête stop le au coupe micro terminer quitter ferme va à
un une deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize
vingt trente quarante cinquante soixante
sauce pâte pâtes riz gâteau cuisson caramel crème sirop légumes viande poisson œufs tarte
pain beurre sucre lait chocolat eau farine sel huile`.split(/\s+/).filter(Boolean);
let voiceExtraWords = [];

// Mots de la recette ouverte (ingredients) : minuteur nomme « pour la
// ganache ».
function setVoiceVocabulary(words) {
  voiceExtraWords = Array.from(new Set((words || [])
    .flatMap(word => String(word).toLowerCase().split(/[^a-zà-öø-ÿœ']+/))
    .filter(word => word.length >= 3)));
}

let voskScriptPromise = null;
let voskModelPromise = null;

function loadVoskScript() {
  if (window.Vosk) return Promise.resolve(window.Vosk);
  if (!voskScriptPromise) {
    voskScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${VOSK_SCRIPT_URL}?v=0.0.8`;
      script.async = true;
      script.onload = () => (window.Vosk ? resolve(window.Vosk) : reject(new Error('Vosk absent')));
      script.onerror = () => reject(new Error('Vosk introuvable'));
      document.head.appendChild(script);
    }).catch(error => {
      voskScriptPromise = null;
      throw error;
    });
  }
  return voskScriptPromise;
}

// Modele charge une fois par page (garde entre deux ouvertures du mode).
function loadVoskModel() {
  if (!voskModelPromise) {
    voskModelPromise = loadVoskScript()
      .then(Vosk => Vosk.createModel(VOSK_MODEL_URL, -2))
      .then(model => {
        try { localStorage.setItem(VOSK_READY_KEY, '1'); } catch { /* stockage indisponible */ }
        return model;
      })
      .catch(error => {
        voskModelPromise = null;
        throw error;
      });
  }
  return voskModelPromise;
}

function voskModelCached() {
  try { return localStorage.getItem(VOSK_READY_KEY) === '1'; } catch { return false; }
}

// Meme interface que SpeechRecognition (start, abort, onstart, onresult,
// onerror, onend) : useHandsFree ne fait pas la difference. Ecoute continue,
// sans fin de session ; resultats provisoires puis definitifs, numerotes.
class LocalRecognition {
  constructor() {
    this.lang = 'fr-FR';
    this.continuous = true;
    this.interimResults = true;
    this.maxAlternatives = 1;
    this.active = false;
    this.index = 0;
    this.lastPartial = '';
  }

  emit(text, isFinal) {
    const transcript = String(text || '').replace(/\[unk\]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!transcript) {
      if (isFinal) this.lastPartial = '';
      return;
    }
    if (!isFinal && transcript === this.lastPartial) return;
    this.lastPartial = isFinal ? '' : transcript;
    const result = [{ transcript, confidence: 1 }];
    result.isFinal = isFinal;
    const results = [];
    results[this.index] = result;
    this.onresult?.({ resultIndex: this.index, results: Object.assign(results, { length: this.index + 1 }) });
    if (isFinal) this.index += 1;
  }

  fail(error) {
    this.onerror?.({ error });
    this.stopAudio();
    if (this.active) {
      this.active = false;
      this.onend?.();
    }
  }

  start() {
    if (this.active) throw new Error('InvalidStateError');
    this.active = true;
    this.index = 0;
    this.onloading?.(voskModelCached() ? 'Chargement de la reconnaissance vocale…' : 'Téléchargement de la reconnaissance vocale (40 Mo, une seule fois)…');
    loadVoskModel()
      .then(async model => {
        if (!this.active) return;
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 } });
        } catch (error) {
          this.fail(error?.name === 'NotFoundError' ? 'audio-capture' : 'not-allowed');
          return;
        }
        if (!this.active) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        const context = new AudioCtor();
        // Vocabulaire restreint, et seule une phrase entiere qui EST une
        // commande agit (parseVoiceCommand).
        const grammar = JSON.stringify([...new Set([...VOICE_VOCABULARY, ...voiceExtraWords])].concat('[unk]'));
        const recognizer = new model.KaldiRecognizer(context.sampleRate, grammar);
        recognizer.on('partialresult', message => this.emit(message.result?.partial, false));
        recognizer.on('result', message => this.emit(message.result?.text, true));
        const source = context.createMediaStreamSource(stream);
        const processor = context.createScriptProcessor(4096, 1, 1);
        // Le processeur doit etre relie a la sortie pour tourner : volume nul.
        const silent = context.createGain();
        silent.gain.value = 0;
        processor.onaudioprocess = event => {
          try { recognizer.acceptWaveform(event.inputBuffer); } catch { /* tampon ignore */ }
        };
        source.connect(processor);
        processor.connect(silent);
        silent.connect(context.destination);
        if (context.state === 'suspended') context.resume().catch(() => {});
        this.audio = { stream, context, recognizer, source, processor, silent };
        this.onstart?.();
      })
      .catch(() => this.fail(navigator.onLine === false ? 'network' : 'model'));
  }

  stopAudio() {
    const audio = this.audio;
    this.audio = null;
    if (!audio) return;
    try { audio.processor.disconnect(); audio.source.disconnect(); audio.silent.disconnect(); } catch { /* deja deconnecte */ }
    audio.stream.getTracks().forEach(track => track.stop());
    try { audio.recognizer.remove(); } catch { /* deja retire */ }
    audio.context.close().catch(() => {});
  }

  abort() {
    if (!this.active) return;
    this.active = false;
    this.stopAudio();
    setTimeout(() => this.onend?.(), 0);
  }

  stop() {
    this.abort();
  }
}

// Les tests peuvent remplacer le moteur (micro simule).
const SPEECH_RECOGNITION = window.__cookNoteTestRecognition || (LOCAL_VOICE_SUPPORTED ? LocalRecognition : null);
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
  ['next', /^(suivant|suivante|etape suivante|la suite|et apres|on continue|continue|c est fait|fait|c est bon|j ai fini|termine l etape)$/],
  ['previous', /^(precedent|precedente|etape precedente|retour|reviens|reviens en arriere|en arriere)$/],
  ['first', /^(premiere etape|la premiere etape|au debut|debut|recommence|recommencer|retour au debut|depuis le debut|reprends du debut)$/],
  ['last', /^(derniere etape|la derniere etape|a la fin|va a la fin)$/],
  ['undo', /^(annule|annuler|annule ca|pas fait|decoche|decoche l etape|je me suis trompe)$/],
  ['dismiss', /^(ok|okay|d accord|compris|vu|merci|c est note)$/],
  ['listenPause', /^(pause|pause ecoute|pause micro|attends|attends moi)$/],
  ['listenResume', /^(reprends|reprendre|reprends l ecoute|on reprend|c est reparti|je suis la|reprise)$/],
  ['allIngredients', /^(ingredients?|les ingredients|tous les ingredients|voir les ingredients|montre les ingredients|affiche les ingredients|toute la liste|liste des ingredients|la liste des ingredients|quels ingredients|il faut quoi)$/],
  ['equipment', /^(materiel|le materiel|quel materiel|les ustensiles|ustensiles|il faut quel materiel|de quoi j ai besoin)$/],
  ['technique', /^(technique|la technique|montre la technique|quelle technique|comment on fait|comment faire|explique|explique moi)$/],
  ['temperature', /^(temperature|quelle temperature|la temperature|temperature du four|le four a combien|a combien le four|four a combien|quelle temperature le four)$/],
  ['remaining', /^(temps restant|il reste combien|il reste combien de temps|combien de temps il reste|ca sera pret quand|c est pret quand|on a fini quand|fini dans combien de temps)$/],
  ['double', /^(double|double les quantites|deux fois plus|fois deux)$/],
  ['half', /^(moitie|la moitie|divise par deux|moitie des quantites|deux fois moins)$/],
  ['mute', /^(coupe le micro|arrete d ecouter|arrete l ecoute|desactive la voix|micro off)$/],
  // « stop » seul arrete l'alarme d'un minuteur termine.
  ['timerStop', /^(stop|arrete|silence|ca suffit)$/],
  ['close', /^(terminer|quitter|ferme|fermer|fin|quitte le mode mains libres|ferme le mode mains libres|sortir)$/]
];
const TIMER_WORD = /\b(minuteurs?|minuterie|chrono|timer|alarme|sonnerie)\b/;
const DURATION_WORD = /\b(\d+|une?|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingt|trente|quarante|cinquante|soixante|demie?|heures?|h|minutes?|min|mn|secondes?|sec|s)\b/g;

// Nom d'un minuteur : « … pour la sauce », « … de la sauce », « … du riz ».
function timerNameFrom(text) {
  const match = ` ${text} `.match(/ (?:pour|de|du|des|sur) (?:la |le |les |l )?([a-z ]+?) $/);
  if (!match) return '';
  const name = match[1].replace(DURATION_WORD, ' ').replace(/\b(minuteurs?|minuterie|chrono|timer|temps)\b/g, ' ').replace(/\s+/g, ' ').trim();
  return name.length >= 2 ? name : '';
}

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
  const command = (type, extra = {}) => ({ type, heard: core, ...extra });
  if (words.length <= 9) {
    const timerWord = TIMER_WORD.test(core);
    // « ajoute une minute », « encore 5 minutes au minuteur de la sauce ».
    if (/^(ajoute|rajoute|encore|plus|remets?)\b/.test(core) && /\b(minutes?|min|secondes?|heures?)\b/.test(core)) {
      return command('timerAdd', { seconds: spokenDurationSeconds(core.replace(/\b(au|du|de la|pour la|pour le) .*$/, '')), name: timerNameFrom(core.replace(/^.*?\b(minuteur|chrono|timer)\b/, '')) });
    }
    // Minuteurs en cours : « arrete le minuteur de la sauce », « pause minuteur ».
    if (timerWord && /^(arrete|arreter|stop|stoppe|coupe|annule|eteins|ferme|supprime|enleve)\b/.test(core)) return command('timerStop', { name: timerNameFrom(core.replace(/^.*?\b(minuteur|chrono|timer|alarme)\b/, '')) });
    if (timerWord && /^(pause|mets en pause|mets pause|suspends?)\b/.test(core)) return command('timerPause', { name: timerNameFrom(core.replace(/^.*?\b(minuteur|chrono|timer)\b/, '')) });
    if (timerWord && /^(reprends|reprendre|relance|redemarre|continue)\b/.test(core)) return command('timerResume', { name: timerNameFrom(core.replace(/^.*?\b(minuteur|chrono|timer)\b/, '')) });
    const left = core.match(/^(?:combien de temps|ou en est le minuteur|ou en sont les minuteurs|le minuteur en est ou)( .*)?$/);
    if (left && /^ il reste/.test(left[1] || '')) return command('remaining');
    if (left) return command('timerLeft', { name: timerNameFrom(left[1] || '') });
  }
  // « minuteur 10 minutes pour la sauce », « lance un minuteur de cinq minutes ».
  if (words.length <= 10 && TIMER_WORD.test(core)) {
    return command('timer', { seconds: spokenDurationSeconds(core), name: timerNameFrom(core) });
  }
  // « pour 6 personnes », « pour six », « 8 parts ».
  const servings = core.match(/^(?:pour |on est |on sera |c est pour )?([a-z0-9 ]+?) (?:personnes?|parts?|convives?|portions?|pieces?)$/) || core.match(/^pour ([a-z0-9 ]+)$/);
  if (servings && spokenNumber(servings[1])) return command('servings', { count: spokenNumber(servings[1]) });
  // « etape 4 », « va a l etape dix sept », « etape numero trois ».
  const jump = core.match(/^(?:va a l |aller a l |passe a l |on passe a l )?etape (?:numero |n )?([a-z0-9 ]+)$/);
  if (jump && spokenNumber(jump[1])) return command('goto', { step: spokenNumber(jump[1]) });
  if (words.length > 6) return null;
  const match = VOICE_COMMANDS.find(([, pattern]) => pattern.test(core));
  return match ? command(match[0]) : null;
}
// Etiquette d'un minuteur lance a la voix : « 10 min », « 1 h 30 », « 45 s ».
function formatTimerLabel(seconds) {
  if (seconds < 60) return `${seconds} s`;
  return seconds % 60 ? formatTimerClock(seconds) : formatMinutesShort(seconds / 60);
}

const VOICE_ERRORS = {
  'not-allowed': 'Micro non autorisé : touche « Réessayer » et accepte la demande du navigateur.',
  'service-not-allowed': 'Micro non autorisé : touche « Réessayer » et accepte la demande du navigateur.',
  'audio-capture': 'Aucun micro détecté sur cet appareil.',
  network: 'Connexion nécessaire une seule fois pour télécharger la reconnaissance vocale.',
  model: 'Reconnaissance vocale impossible à charger sur cet appareil.'
};
// Hors https et localhost, Chrome refuse le micro sans rien demander.
const VOICE_INSECURE = 'Le micro ne marche qu’en adresse sécurisée : ouvre Cook Note par https:// ou http://localhost:8080.';
const VOICE_POLICY = 'Micro désactivé par la configuration du site (en-tête Permissions-Policy).';
const VOICE_BLOCKED_SITE ='Micro bloqué pour ce site : clique sur l’icône à gauche de l’adresse, Micro, Autoriser, puis « Réessayer ».';
const VOICE_BLOCKED_SYSTEM = 'Micro bloqué par l’appareil. Sur Windows : Paramètres, Confidentialité, Microphone, autoriser les applications de bureau, puis « Réessayer ».';

// Refus du micro : bloque par le site (reglage du navigateur), par le systeme
// (le site est autorise mais le micro reste inaccessible) ou simple demande
// ignoree. Renvoie le message a afficher.
async function microphoneRefusalMessage() {
  if (window.isSecureContext === false) return VOICE_INSECURE;
  // En-tete Permissions-Policy du site (_headers, server.js) : refus sans demande.
  if (document.featurePolicy?.allowsFeature?.('microphone') === false) return VOICE_POLICY;
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

// Demande du micro avant l'ecoute (et au geste « Réessayer ») : c'est la
// demande standard du navigateur, que la reconnaissance vocale n'affiche pas
// toujours. Chrome precise la cause du refus (« Permission denied by
// system » = Windows) ; elle est ajoutee au message. Un refus instantane,
// sans demande affichee, vient aussi de l'appareil.
async function requestMicrophone() {
  if (window.isSecureContext === false) return VOICE_INSECURE;
  if (!navigator.mediaDevices?.getUserMedia) return '';
  const askedAt = Date.now();
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return '';
  } catch (error) {
    const detail = [error?.name, error?.message].filter(Boolean).join(' : ');
    const withDetail = message => (detail ? `${message} (Chrome : ${detail})` : message);
    if (error?.name === 'NotFoundError' || error?.name === 'OverconstrainedError') return withDetail(VOICE_ERRORS['audio-capture']);
    if (error?.name === 'NotReadableError' || /system/i.test(error?.message || '')) return withDetail(VOICE_BLOCKED_SYSTEM);
    const message = await microphoneRefusalMessage();
    return withDetail(message === VOICE_ERRORS['not-allowed'] && Date.now() - askedAt < 400 ? VOICE_BLOCKED_SYSTEM : message);
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
    let lastSignature = '';
    let handled = new Set();
    const recognition = new SPEECH_RECOGNITION();
    recognition.lang = 'fr-FR';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    // Reconnaissance locale : chargement du modele (telechargement la 1re fois).
    recognition.onloading = message => {
      if (active && !fatal) setState({ status: 'loading', message });
    };

    const start = () => {
      if (!active || running || fatal) return;
      try {
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
        setState({ status: 'error', message: VOICE_ERRORS[event.error], retry: refused || ['audio-capture', 'network', 'model'].includes(event.error) });
        // Refus : on redemande le micro pour connaitre la cause exacte ; si
        // l'acces est finalement accorde, l'ecoute repart d'elle-meme.
        if (refused) {
          requestMicrophone().then(message => {
            if (!active) return;
            if (message) setState({ status: 'error', message, retry: true });
            else {
              fatal = '';
              start();
            }
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
        // Seule la phrase finale agit (Vosk la donne ~0,3 s apres la fin de la
        // parole) : un debut de phrase (« pause » de « pause minuteur »,
        // « combien de la… ») ne part jamais a la place de la phrase entiere.
        if (!result.isFinal) continue;
        if (!command) {
          if (result.isFinal) setState(current => ({ ...current, heard: result[0].transcript.trim() }));
          continue;
        }
        handled.add(index);
        // Aucun delai entre deux commandes. Seul un doublon envoye par le
        // navigateur (meme commande dans les 0,6 s, plus court que le temps de
        // redire le mot) est ignore.
        const now = Date.now();
        const signature = `${command.type}:${command.heard}`;
        if (signature === lastSignature && now - lastCommandAt < 600) continue;
        lastCommandAt = now;
        lastSignature = signature;
        setState(current => ({ ...current, heard: '' }));
        handlerRef.current(command);
      }
    };

    // Micro d'abord (demande standard du navigateur), ecoute ensuite.
    setState({ status: 'starting', message: '' });
    requestMicrophone().then(message => {
      if (!active) return;
      if (message) {
        fatal = 'not-allowed';
        setState({ status: 'error', message, retry: true });
      } else {
        start();
      }
    });
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

// ---------- Mode mains libres : tout tient dans l'ecran ----------
// Jamais de defilement en mains libres : le contenu (etape, technique, liste
// d'ingredients) est reduit par paliers (zoom CSS) jusqu'a tenir dans sa
// boite, recalcule au changement d'etape, de panneau, de taille d'ecran.
const FIT_MIN_SCALE = 0.45;

function useFitToBox(boxRef, contentRef, deps) {
  React.useLayoutEffect(() => {
    const box = boxRef.current;
    const content = contentRef.current;
    if (!box || !content) return undefined;
    let frame = 0;
    const fit = () => {
      content.style.zoom = '';
      let scale = 1;
      while (box.scrollHeight > box.clientHeight + 1 && scale > FIT_MIN_SCALE) {
        scale = Math.max(FIT_MIN_SCALE, scale - 0.05);
        content.style.zoom = String(scale);
      }
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };
    fit();
    // Polices chargees apres coup : nouvelle mesure.
    document.fonts?.ready?.then(schedule).catch(() => {});
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
    observer?.observe(box);
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, deps);
}

// ---------- Mode mains libres : reponses aux commandes ----------
// Cook Note ne parle pas : chaque reponse s'affiche (bandeau d'etat ou
// panneau a la place de l'etape, que « ok » referme).

// Techniques citees dans une etape (« blanchir », « monter en neige »).
function stepTechniques(stepText, techniqueTargets) {
  const text = ` ${normalizeText(stripHtml(stepText)).replace(/[^a-z0-9]+/g, ' ')} `;
  const ids = [];
  (techniqueTargets || []).forEach(target => {
    const term = target.normalized.replace(/[^a-z0-9]+/g, ' ').trim();
    if (term && text.includes(` ${term} `) && !ids.includes(target.id)) ids.push(target.id);
  });
  return ids.map(id => TECHNIQUE_GUIDES.find(guide => guide.id === id)).filter(Boolean).slice(0, 3);
}

// Temperature de four : « 180 °C », « th. 6 » (thermostat x 30).
function stepTemperature(stepText) {
  const text = stripHtml(stepText);
  const celsius = text.match(/(\d{2,3})\s*°\s*C\b/);
  if (celsius) return `${celsius[1]} °C`;
  const thermostat = text.match(/\b(?:th\.?|thermostat)\s*(\d{1,2})\b/i);
  return thermostat ? `${Number(thermostat[1]) * 30} °C (th. ${thermostat[1]})` : '';
}

// Lignes d'aide integrees : les commandes utiles a cet instant, jamais de liste complete.
function voiceSuggestions({ step, index, total, paused, panel, timers, techniques, temperature }) {
  if (paused) return ['reprends'];
  if (panel) return ['ok'];
  const duration = findStepDurations(stripHtml(step))[0];
  return [
    index < total - 1 ? 'suivant' : 'terminer',
    index > 0 ? 'précédent' : '',
    duration ? `minuteur ${frenchUnitSpacing(duration.text)}` : '',
    timers ? 'combien de temps' : '',
    timers ? 'ajoute une minute' : '',
    techniques ? 'la technique' : '',
    temperature ? 'quelle température' : '',
    'voir les ingrédients',
    'pause'
  ].filter(Boolean).slice(0, 6);
}

// Toutes les commandes du mode mains libres. ctx : etat et actions de la vue.
function runCookVoiceCommand(command, ctx) {
  const { index, total, steps, title, go, advance, undoLast, onClose, note, setPanel, setPaused, setEnabled, recipe, factor, setFactor } = ctx;
  const timerName = command.name ? ` (${command.name})` : '';
  const servingInfo = typeof getServingInfo === 'function' ? getServingInfo(recipe) : null;
  const applyFactor = next => {
    if (!servingInfo) {
      note('Cette recette n’a pas de nombre de parts réglable', 'info');
      return;
    }
    const clamped = Math.min(Math.max(next, 0.25), 8);
    setFactor(clamped);
    const target = getServingTarget(recipe, clamped);
    note(`Quantités pour ${target} ${servingUnitLabel(servingInfo, target)}`);
  };
  switch (command.type) {
    case 'next':
      setPanel(null);
      note(index >= total - 1 ? 'Recette terminée' : 'Étape suivante');
      advance();
      break;
    case 'previous':
      setPanel(null);
      if (index === 0) note('Déjà à la première étape', 'info');
      else {
        note('Étape précédente');
        go(index - 1);
      }
      break;
    case 'first':
      setPanel(null);
      note(index === 0 ? 'Déjà à la première étape' : 'Première étape', index === 0 ? 'info' : 'ok');
      go(0);
      break;
    case 'last':
      setPanel(null);
      note(index === total - 1 ? 'Déjà à la dernière étape' : 'Dernière étape', index === total - 1 ? 'info' : 'ok');
      go(total - 1);
      break;
    case 'goto':
      setPanel(null);
      if (command.step >= 1 && command.step <= total) {
        note(`Étape ${command.step}`);
        go(command.step - 1);
      } else {
        note(`Cette recette a ${total} étapes`, 'info');
      }
      break;
    case 'undo': {
      const undone = undoLast();
      if (undone < 0) note('Rien à annuler', 'info');
      else {
        note(`Étape ${undone + 1} décochée`);
        go(undone);
      }
      break;
    }
    case 'dismiss':
      setPanel(null);
      break;
    case 'listenPause':
      setPaused(true);
      break;
    case 'listenResume':
      note('Écoute reprise');
      break;
    case 'allIngredients':
      setPanel({ type: 'ingredients' });
      break;
    case 'equipment':
      setPanel({ type: 'equipment' });
      break;
    case 'technique': {
      const techniques = stepTechniques(steps[index], ctx.techniqueTargets);
      if (techniques.length) setPanel({ type: 'technique', techniques });
      else note('Pas de technique particulière pour cette étape', 'info');
      break;
    }
    case 'temperature': {
      const here = stepTemperature(steps[index]);
      if (here) {
        note(`Four : ${here}`, 'ok', 5000);
        break;
      }
      // Sinon la plus proche dans les etapes suivantes, puis precedentes.
      const order = [...steps.keys()].filter(position => position !== index).sort((a, b) => (a < index) - (b < index) || Math.abs(a - index) - Math.abs(b - index));
      const found = order.map(position => ({ position, value: stepTemperature(steps[position]) })).find(item => item.value);
      note(found ? `Four : ${found.value} (étape ${found.position + 1})` : 'Pas de température indiquée dans cette recette', found ? 'ok' : 'info', 5000);
      break;
    }
    case 'remaining': {
      const seconds = steps.slice(index).reduce((sum, step) => sum + findStepDurations(stripHtml(step)).reduce((stepSum, duration) => stepSum + duration.seconds, 0), 0);
      note(seconds
        ? `Encore environ ${frenchUnitSpacing(formatMinutesShort(Math.max(1, Math.round(seconds / 60))))} d’après les étapes restantes`
        : 'Pas de durée indiquée dans les étapes restantes', seconds ? 'ok' : 'info', 5000);
      break;
    }
    case 'servings':
      applyFactor(servingInfo ? command.count / servingInfo.base : factor);
      break;
    case 'double':
      applyFactor(factor * 2);
      break;
    case 'half':
      applyFactor(factor / 2);
      break;
    case 'mute':
      setEnabled(false);
      break;
    case 'close':
      onClose();
      break;
    case 'timer': {
      const fromStep = findStepDurations(stripHtml(steps[index] || ''))[0];
      const seconds = command.seconds || fromStep?.seconds || 0;
      if (!seconds) {
        note('Durée non comprise : dites « minuteur 10 minutes »', 'info', 4000);
        break;
      }
      const duration = command.seconds ? formatTimerLabel(seconds) : fromStep.text;
      const name = command.name ? `${command.name.charAt(0).toUpperCase()}${command.name.slice(1)}` : '';
      const label = name ? `${name} · ${duration}` : duration;
      startKitchenTimer({ seconds, label, title });
      note(`Minuteur lancé : ${frenchUnitSpacing(label)}`);
      break;
    }
    case 'timerAdd': {
      if (!command.seconds) {
        note('Durée non comprise : dites « ajoute une minute »', 'info', 4000);
        break;
      }
      if (!kitchenTimersNamed(command.name)) {
        note(`Aucun minuteur${timerName}`, 'info');
        break;
      }
      controlKitchenTimers('add', { name: command.name, seconds: command.seconds });
      note(`${frenchUnitSpacing(formatTimerLabel(command.seconds))} ajoutée${[1, 60, 3600].includes(command.seconds) ? '' : 's'}${timerName}`);
      break;
    }
    case 'timerLeft': {
      const running = kitchenTimersLeft(command.name);
      if (!running.length) note(`Aucun minuteur en cours${timerName}`, 'info');
      else note(running.map(timer => `${timer.label ? `${frenchUnitSpacing(timer.label)} : ` : ''}${formatTimerClock(timer.seconds)}${timer.paused ? ' (pause)' : ''}`).join(' · '), 'ok', 5000);
      break;
    }
    case 'timerStop':
    case 'timerPause':
    case 'timerResume': {
      const ringing = !command.name && kitchenTimersRinging();
      if (!ringing && !kitchenTimersLeft(command.name).length) {
        note(`Aucun minuteur en cours${timerName}`, 'info');
        break;
      }
      const action = { timerStop: 'stop', timerPause: 'pause', timerResume: 'resume' }[command.type];
      controlKitchenTimers(action, { name: command.name });
      note(`${{ stop: ringing ? 'Alarme arrêtée' : 'Minuteur arrêté', pause: 'Minuteur en pause', resume: 'Minuteur relancé' }[action]}${timerName}`);
      break;
    }
    default:
      break;
  }
}

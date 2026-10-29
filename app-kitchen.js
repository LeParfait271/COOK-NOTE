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
  ['alpha', 'A–Z'],
  ['quick', 'Rapides'],
  ['easy', 'Faciles']
];

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

// Phrases du mode mains libres, ecrites comme on les dit (accents compris) :
// SEULE source des commandes simples. La reconnaissance (VOICE_COMMANDS) et
// le vocabulaire ecoute par Vosk (VOICE_VOCABULARY) en sont tires : ajouter
// une phrase ici suffit. Les commandes avec un nombre ou un nom (minuteurs,
// portions, « étape 3 ») sont analysees dans parseVoiceCommand.
const VOICE_PHRASES = {
  next: ['suivant', 'suivante', 'étape suivante', 'la suite', 'la suivante', 'la prochaine', 'prochaine étape', 'étape d’après', 'et après', 'on continue', 'on avance', 'avance', 'passe', 'passe à la suite', 'passer à la suite', 'on passe à la suite', 'passer à l’étape suivante', 'passe à l’étape suivante', 'on passe à la suivante', 'c’est fait', 'fait', 'c’est bon', 'j’ai fini', 'c’est fini', 'terminé', 'ok suivant', 'vas-y', 'allez', 'continue', 'étape d’après s’il te plaît'],
  previous: ['précédent', 'précédente', 'étape précédente', 'l’étape d’avant', 'étape d’avant', 'retour', 'reviens', 'revenir', 'reviens en arrière', 'retourne en arrière', 'en arrière', 'recule', 'on recule', 'reviens à l’étape précédente'],
  first: ['première étape', 'la première étape', 'au début', 'début', 'recommence', 'recommencer', 'retour au début', 'reviens au début', 'depuis le début', 'reprends du début', 'on recommence'],
  last: ['dernière étape', 'la dernière étape', 'à la fin', 'va à la fin'],
  undo: ['annule', 'annuler', 'annule ça', 'pas fait', 'décoche', 'décoche l’étape', 'je me suis trompé'],
  dismiss: ['ok', 'okay', 'oké', 'd’accord', 'compris', 'vu', 'merci', 'c’est noté', 'parfait', 'très bien', 'ferme ça', 'retour à l’étape', 'reviens à l’étape'],
  listenPause: ['pause', 'pause écoute', 'pause micro', 'mets en pause', 'stop écoute', 'arrête d’écouter un moment'],
  listenResume: ['reprends', 'reprendre', 'reprends l’écoute', 'on reprend', 'c’est reparti', 'reprise', 'je suis là', 'je reviens'],
  allIngredients: ['ingrédients', 'ingrédient', 'les ingrédients', 'tous les ingrédients', 'voir les ingrédients', 'montre les ingrédients', 'affiche les ingrédients', 'montre-moi les ingrédients', 'la liste', 'toute la liste', 'liste des ingrédients', 'la liste des ingrédients', 'quels ingrédients', 'il faut quoi', 'qu’est-ce qu’il faut', 'de quoi j’ai besoin'],
  equipment: ['matériel', 'le matériel', 'quel matériel', 'les ustensiles', 'ustensiles', 'voir le matériel', 'montre le matériel', 'il faut quel matériel'],
  technique: ['technique', 'la technique', 'montre la technique', 'voir la technique', 'quelle technique', 'comment on fait', 'comment faire', 'explique', 'explique-moi', 'aide-moi'],
  temperature: ['température', 'quelle température', 'la température', 'température du four', 'le four à combien', 'à combien le four', 'four à combien', 'quelle température le four', 'combien de degrés', 'à quelle température'],
  remaining: ['temps restant', 'il reste combien', 'il reste combien de temps', 'combien de temps il reste', 'ça sera prêt quand', 'c’est prêt quand', 'on a fini quand', 'fini dans combien de temps', 'temps total', 'durée restante', 'quand est-ce que c’est prêt'],
  double: ['double', 'double les quantités', 'deux fois plus', 'fois deux', 'multiplie par deux', 'double la recette'],
  half: ['moitié', 'la moitié', 'divise par deux', 'moitié des quantités', 'deux fois moins', 'demi recette', 'la moitié de la recette'],
  mute: ['coupe le micro', 'arrête d’écouter', 'arrête l’écoute', 'désactive la voix', 'micro off', 'éteins le micro', 'désactive le micro'],
  timerStop: ['stop', 'arrête', 'silence', 'ça suffit', 'chut', 'arrête la sonnerie', 'arrête l’alarme', 'coupe la sonnerie', 'coupe l’alarme', 'stop alarme'],
  close: ['terminer', 'termine', 'quitter', 'quitte', 'ferme', 'fermer', 'fin', 'sortir', 'sors', 'quitte le mode mains libres', 'ferme le mode mains libres', 'on arrête', 'j’ai terminé la recette']
};

// Mots des commandes avec un nombre ou un nom (minuteurs, portions, etapes).
const VOICE_STRUCTURE_WORDS = `minuteur minuteurs minuterie chrono alarme sonnerie lance lancer mets met démarre
programme un une deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize vingt
trente quarante cinquante soixante cent et demie demi quart minute minutes seconde secondes heure heures
ajoute rajoute ajouter encore plus remets enlève retire enlever retirer moins ôte supprime réduis
arrête arrêter stoppe coupe annule éteins ferme pause suspends reprends relance redémarre continue
combien de d' du des la le les l' au aux pour sur il reste temps où en est sont
personnes personne parts part convives portions pièces on est sera c'est pour
étape numéro va à aller passe la sauce pâte pâtes riz gâteau cuisson caramel crème sirop légumes viande
poisson œufs tarte pain beurre sucre lait chocolat eau farine sel huile four`.split(/\s+/).filter(Boolean);

const normalizeVoicePhrase = text => normalizeText(text)
  .replace(/['’-]/g, ' ')
  .replace(/[^a-z0-9 ]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// Vocabulaire ecoute : Vosk ne reconnait que ces mots, « [unk] » absorbe tout
// le reste (conversation, bruit) ; plus fiable qu'une ecoute libre sur les
// mots courts (« ok », « pause », « dix »). Mots absents du modele : ignores.
const VOICE_VOCABULARY = Array.from(new Set([
  ...Object.values(VOICE_PHRASES).flat().flatMap(phrase => phrase.toLowerCase().replace(/’/g, '\'').split(/[\s-]+/)),
  ...VOICE_STRUCTURE_WORDS
])).filter(Boolean);
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

// Commandes simples : la phrase entiere (moins les politesses) doit etre une
// des phrases de VOICE_PHRASES, dans l'ordre de la table.
const escapeVoiceRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const VOICE_COMMANDS = Object.entries(VOICE_PHRASES).map(([type, phrases]) => [
  type,
  new RegExp(`^(${phrases.map(normalizeVoicePhrase).map(escapeVoiceRegExp).join('|')})$`)
]);
// Repli tolerant : la reconnaissance avale ou deforme souvent les petits mots
// (« passe là suite » pour « passe à la suite ») ; on compare sans eux.
const VOICE_SMALL_WORDS = /\b(a|la|le|les|l|de|d|du|des|au|aux|un|une|en|et|y)\b/g;
const voiceSkeleton = text => text.replace(VOICE_SMALL_WORDS, ' ').replace(/\s+/g, ' ').trim();
const VOICE_SKELETONS = new Map();
Object.entries(VOICE_PHRASES).forEach(([type, phrases]) => phrases.forEach(phrase => {
  const key = voiceSkeleton(normalizeVoicePhrase(phrase));
  if (key && !VOICE_SKELETONS.has(key)) VOICE_SKELETONS.set(key, type);
}));
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
  // Politesses et formules autour de la commande : « euh tu peux passer a
  // la suite s'il te plait » -> « passer a la suite ».
  let core = said;
  for (let pass = 0; pass < 3; pass += 1) {
    core = core
      .replace(/^(ok|okay|alors|bon|euh|hum|cook note|dis|dis moi|hey|he|bon alors|tu peux|tu pourrais|peux tu|est ce que tu peux|je veux|je voudrais|j aimerais|on peut|vas y|allez|stp|s il te plait|maintenant)\s+/, '')
      .replace(/\s+(s il te plait|s il vous plait|stp|merci|maintenant|please|svp)$/, '')
      .trim();
  }
  // « combien deux temps » : « deux » devant un mot qui n'est pas une
  // quantite est un « de » mal entendu.
  core = core.replace(/\bdeux (?!(?:minutes?|heures?|secondes?|personnes?|parts?|portions?|fois|etapes?|convives?|pieces?|et|cent)\b)(?=[a-z]{2,})/g, 'de ');
  if (!core) return null;
  const words = core.split(' ');
  const command = (type, extra = {}) => ({ type, heard: core, ...extra });
  if (words.length <= 9) {
    const timerWord = TIMER_WORD.test(core);
    // « enleve une minute », « retire 30 secondes au minuteur du riz ».
    if (/^(enleve|enlever|retire|retirer|moins|ote|reduis|supprime)\b/.test(core) && /\b(minutes?|min|secondes?|heures?)\b/.test(core)) {
      return command('timerAdd', { seconds: -spokenDurationSeconds(core.replace(/\b(au|du|de la|pour la|pour le) .*$/, '')), name: timerNameFrom(core.replace(/^.*?\b(minuteur|chrono|timer)\b/, '')) });
    }
    // « ajoute une minute », « encore 5 minutes au minuteur de la sauce ».
    if (/^(ajoute|ajouter|rajoute|encore|plus|remets?)\b/.test(core) && /\b(minutes?|min|secondes?|heures?)\b/.test(core)) {
      return command('timerAdd', { seconds: spokenDurationSeconds(core.replace(/\b(au|du|de la|pour la|pour le) .*$/, '')), name: timerNameFrom(core.replace(/^.*?\b(minuteur|chrono|timer)\b/, '')) });
    }
    // Minuteurs en cours : « arrete le minuteur de la sauce », « pause minuteur ».
    if (timerWord && /^(arrete|arreter|stop|stoppe|coupe|annule|eteins|ferme|supprime|enleve)\b/.test(core)) return command('timerStop', { name: timerNameFrom(core.replace(/^.*?\b(minuteur|chrono|timer|alarme)\b/, '')) });
    if (timerWord && /^(pause|mets en pause|met en pause|mets pause|suspends?)\b/.test(core)) return command('timerPause', { name: timerNameFrom(core.replace(/^.*?\b(minuteur|chrono|timer)\b/, '')) });
    if (timerWord && /^(reprends|reprendre|relance|redemarre|continue)\b/.test(core)) return command('timerResume', { name: timerNameFrom(core.replace(/^.*?\b(minuteur|chrono|timer)\b/, '')) });
    const left = core.match(/^(?:combien de temps|il reste combien sur le minuteur|ou en est le minuteur|ou en sont les minuteurs|le minuteur en est ou|temps du minuteur|le minuteur)( .*)?$/);
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
  if (match) return command(match[0]);
  const loose = VOICE_SKELETONS.get(voiceSkeleton(core));
  return loose ? command(loose) : null;
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

// ---------- Mode mains libres : ambiance de l'etape ----------
// Lumiere de fond a peine teintee : « heat » (cuire, rotir, frire, poeler…),
// « cold » (frais, refrigerer, congeler, glacer), sinon « calm ».
function stepMood(step) {
  const text = normalizeText(stripHtml(step || ''));
  if (/\b(refriger|frigo|congel|au frais|glace|glacer|refroidi|bain marie froid)/.test(text)) return 'cold';
  if (/\b(cui[st]|cuire|rotir|roti|frire|frit|poeler|saisir|griller|four|bouill|mijot|caramelis|dorer|braiser|flamber|snacker)/.test(text)) return 'heat';
  return 'calm';
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

// ---------- Mode mains libres : fiches d'ouverture ----------
// Fiches affichees avant l'etape 1, dans cet ordre. Pour en ajouter une :
// un objet de plus ici (et son equivalent dans RecipeScreen.java pour l'APK).
//   id          : nom court (classe CSS .is-<id>, tests)
//   title       : titre de la fiche et du compteur
//   suggestions : commandes proposees dans la ligne « Dites »
//   render(view): contenu ; view = { recipe, factor, allIngredients, ingredientRow }
//   onLeave(view): facultatif, quand on passe a la suite ; view = { markIngredientsReady, note }
// « suivant » / « précédent » passent d'une fiche a l'autre, puis aux etapes ;
// le contenu est reduit pour tenir dans l'ecran (useFitToBox).
const HANDS_FREE_INTRO_PAGES = [
  {
    id: 'prep',
    title: 'Mise en place',
    suggestions: ({ servings }) => ['suivant', servings ? 'double' : '', servings ? 'moitié' : '', 'pause'].filter(Boolean),
    // Mise en place faite : tous les ingredients sont prets (coches sur la fiche).
    onLeave: ({ markIngredientsReady, note }) => {
      markIngredientsReady();
      note('Ingrédients prêts');
    },
    render: ({ recipe, factor, allIngredients, ingredientRow }) => {
      const info = getServingInfo(recipe);
      const target = info ? getServingTarget(recipe, factor) : 0;
      const sample = info ? (info.base === 6 ? 4 : 6) : 0;
      return [
        h('p', { key: 'why', className: 'cook-mode-panel-lead' }, 'Pesez et préparez tous les ingrédients avant de commencer : pendant la recette, les gestes s’enchaînent sans attendre, rien ne brûle pendant qu’on cherche un ingrédient, et on voit tout de suite s’il manque quelque chose.'),
        info && h('p', { key: 'servings', className: 'cook-mode-prep-servings' },
          h('strong', null, `Recette prévue pour ${info.base}\u00a0${servingUnitLabel(info, info.base)}`),
          target !== info.base ? `, quantités ci-dessous pour ${target}\u00a0${servingUnitLabel(info, target)}` : '',
          `. Pour changer, dites «\u00a0pour ${sample}\u00a0${servingUnitLabel(info, sample)}\u00a0», «\u00a0double\u00a0» ou «\u00a0moitié\u00a0» : toutes les quantités suivent, jusqu’à la dernière étape.`
        ),
        ...allIngredients().map(group => h('section', { key: group.key, className: 'cook-mode-panel-group' },
          group.title && h('h3', null, group.title),
          h('ul', { className: 'cook-mode-ingredients' }, group.items.map(ingredientRow))
        ))
      ];
    }
  }
];

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
function voiceSuggestions({ step, index, total, paused, panel, intro, finished, servings, timers, techniques, temperature }) {
  if (finished) return ['ok'];
  if (paused) return ['reprends'];
  if (panel) return ['ok'];
  if (intro) return intro.suggestions({ servings });
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
  const { index, total, steps, title, go, advance, back, undoLast, onClose, note, setPanel, setPaused, setEnabled, recipe, factor, setFactor, prep, atStart, skipIntro } = ctx;
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
      if (prep) {
        advance();
        break;
      }
      note(index >= total - 1 ? 'Recette terminée' : 'Étape suivante');
      advance();
      break;
    case 'previous':
      setPanel(null);
      if (atStart) note('Déjà au début', 'info');
      else {
        note('Retour');
        back();
      }
      break;
    case 'first':
      setPanel(null);
      skipIntro();
      note(index === 0 ? 'Déjà à la première étape' : 'Première étape', index === 0 ? 'info' : 'ok');
      go(0);
      break;
    case 'last':
      setPanel(null);
      skipIntro();
      note(index === total - 1 ? 'Déjà à la dernière étape' : 'Dernière étape', index === total - 1 ? 'info' : 'ok');
      go(total - 1);
      break;
    case 'goto':
      setPanel(null);
      skipIntro();
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
        note('Durée non comprise : dites « ajoute une minute » ou « enlève une minute »', 'info', 4000);
        break;
      }
      if (!kitchenTimersNamed(command.name)) {
        note(`Aucun minuteur${timerName}`, 'info');
        break;
      }
      controlKitchenTimers('add', { name: command.name, seconds: command.seconds });
      const amount = frenchUnitSpacing(formatTimerLabel(Math.abs(command.seconds)));
      const plural = [1, 60, 3600].includes(Math.abs(command.seconds)) ? '' : 's';
      note(`${amount} ${command.seconds > 0 ? 'ajoutée' : 'enlevée'}${plural}${timerName}`);
      break;
    }
    case 'timerLeft': {
      const running = kitchenTimersLeft(command.name);
      // Aucun minuteur : « combien de temps » parle de la recette.
      if (!running.length && !command.name) {
        runCookVoiceCommand({ type: 'remaining', heard: command.heard }, ctx);
        break;
      }
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

// ---------- Constellation des saveurs ----------
// Carte du ciel ludique : chaque ingredient courant est une etoile (plus il
// sert, plus elle brille), les ingredients souvent cuisines ensemble sont
// relies en constellations. On s'y promene (glisser, molette, boutons, deux
// doigts), une etoile touchee trace sa constellation et ouvre ses recettes.
// Calcule depuis le catalogue leger (ingredients des fiches), sans reseau.
const CONSTELLATION_SIZE = { width: 1600, height: 1000 };
const CONSTELLATION_PORTRAIT = { width: 1000, height: 1600 };
const constellationSize = () => (window.innerHeight > window.innerWidth * 1.1 ? CONSTELLATION_PORTRAIT : CONSTELLATION_SIZE);
const CONSTELLATION_STARS = 46;
const CONSTELLATION_SKIP = new Set(['sel', 'poivre', 'eau', 'sel fin', 'poivre noir', 'huile', 'glacons', 'eau froide', 'eau chaude']);
const CONSTELLATION_PAIRS = new Set(['huile', 'sauce', 'pate', 'creme', 'beurre', 'sucre', 'fromage', 'pomme', 'pommes', 'vinaigre', 'jus', 'zeste', 'pain', 'farine', 'lait', 'fond', 'poudre', 'fleur', 'citron', 'feuille', 'feuilles', 'graines', 'noix', 'pois', 'haricots', 'oignon', 'oignons', 'chou', 'riz']);
// Mots de tete a sauter (« petite gousse d'ail » -> ail).
const CONSTELLATION_LEAD = new Set(['de', 'du', 'des', 'la', 'le', 'les', 'un', 'une', 'petit', 'petite', 'petites', 'petits', 'gros', 'grosse', 'grosses', 'belle', 'belles', 'gousse', 'gousses', 'branche', 'branches', 'brin', 'brins', 'pincee', 'pincees', 'base', 'botte', 'tranche', 'tranches', 'morceau', 'morceaux', 'filet', 'trait', 'cuillere', 'cuilleres', 'soupe', 'cafe', 'cs', 'cc', 'sachet', 'sachets', 'verre', 'tasse', 'boite', 'feuille', 'feuilles', 'quelques', 'reste']);
// Une seule etoile par ingredient (jaunes, blancs, oeuf -> oeufs).
const CONSTELLATION_ALIASES = {
  oeuf: 'oeufs', jaune: 'oeufs', jaunes: 'oeufs', blanc: 'oeufs', blancs: 'oeufs',
  'beurre fondu': 'beurre', 'beurre pommade': 'beurre', 'beurre doux': 'beurre', 'beurre demi': 'beurre', 'beurre froid': 'beurre',
  oignons: 'oignon', tomate: 'tomates', carotte: 'carottes', echalotes: 'echalote', citrons: 'citron',
  'sucre semoule': 'sucre', 'sucre poudre': 'sucre', 'creme liquide': 'creme', 'creme entiere': 'creme', 'creme epaisse': 'creme',
  'farine t': 'farine', 'lait entier': 'lait', 'huile tournesol': 'huile neutre', 'huile pepins': 'huile neutre'
};
// Familles de saveurs : chacune a sa lumiere dans le ciel.
const CONSTELLATION_FAMILIES = [
  { id: 'douceur', label: 'Douceurs', keys: ['sucre', 'sucre glace', 'cassonade', 'chocolat', 'cacao', 'vanille', 'miel', 'lait', 'creme', 'beurre', 'oeufs', 'farine', 'levure', 'fecule', 'amandes', 'cafe'] },
  { id: 'jardin', label: 'Herbes & agrumes', keys: ['basilic', 'persil', 'thym', 'romarin', 'laurier', 'coriandre', 'ciboulette', 'menthe', 'aneth', 'citron', 'jus citron', 'zeste citron', 'citron vert', 'echalote', 'oignon', 'ail', 'carottes'] },
  { id: 'feu', label: 'Épices & feu', keys: ['piment', 'paprika', 'cumin', 'gingembre', 'chorizo', 'poivron', 'concentre', 'tomates', 'moutarde', 'curry', 'harissa', 'sauce soja', 'noix muscade'] }
];
const CONSTELLATION_GLOWS = { douceur: '#f3cf86', jardin: '#a9e3d2', feu: '#f2a28f', terre: '#e9dcc4' };
const constellationFamily = key => (CONSTELLATION_FAMILIES.find(family => family.keys.includes(key)) || { id: 'terre' }).id;
const CONSTELLATION_LABELS = {
  oeufs: 'œufs', creme: 'crème', fecule: 'fécule', 'pommes terre': 'pommes de terre', 'jus citron': 'jus de citron',
  'zeste citron': 'zeste de citron', 'fleur sel': 'fleur de sel', 'huile olive': 'huile d’olive', echalote: 'échalote',
  'sucre glace': 'sucre glace', 'noix muscade': 'noix de muscade', 'pate feuilletee': 'pâte feuilletée', pates: 'pâtes',
  'creme fraiche': 'crème fraîche', gingembre: 'gingembre', coriandre: 'coriandre', 'vinaigre vin': 'vinaigre de vin',
  'sauce soja': 'sauce soja', 'graines sesame': 'graines de sésame', 'huile sesame': 'huile de sésame', cafe: 'café', concentre: 'concentré de tomate', chapelure: 'chapelure'
};
const CONSTELLATION_DROP = /\b(frais|fraiche|fraiches|hache|hachee|haches|emince|emincee|coupe|coupee|en|de|d|du|des|la|le|les|pour|au|aux|a|bien|mur|mure|doux|douce|fin|fine|gros|grosse|petit|petite|sec|seche|moulu|moulue|rape|rapee|entier|entiere|liquide|bio|maison|environ|facultatif|ou)\b/g;

function constellationKey(item) {
  const text = stripHtml(String(item || ''));
  const parts = typeof splitIngredientQuantity === 'function' ? splitIngredientQuantity(text) : null;
  const name = normalizeText(parts ? parts.name : text)
    .replace(/\(.*?\)/g, ' ')
    .split(/[,;:]/)[0]
    .replace(/['’-]/g, ' ')
    .replace(/[^a-z ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = name.split(' ').filter(word => word.length > 1);
  while (words.length > 1 && CONSTELLATION_LEAD.has(words[0])) words.shift();
  if (!words.length || CONSTELLATION_LEAD.has(words[0])) return '';
  const first = words[0];
  let key = first;
  if (CONSTELLATION_PAIRS.has(first) && words[1]) {
    const second = words.slice(1).join(' ').replace(CONSTELLATION_DROP, ' ').trim().split(' ')[0];
    if (second) key = `${first} ${second}`;
  }
  return CONSTELLATION_ALIASES[key] || CONSTELLATION_ALIASES[first] || key;
}

function constellationLabel(key) {
  const label = CONSTELLATION_LABELS[key] || key;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// Pseudo-hasard stable (meme ciel a chaque ouverture).
function seededRandom(seed) {
  let value = seed >>> 0 || 1;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function hashText(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
  return hash >>> 0;
}

function buildConstellation(recipes, size = CONSTELLATION_SIZE) {
  const uses = new Map();
  const leaves = (recipes || []).filter(recipe => recipe && !(recipe.variants || []).length && (recipe.ingredients || []).length);
  leaves.forEach(recipe => {
    const keys = new Set((recipe.ingredients || []).flatMap(group => group.items || []).map(constellationKey).filter(key => key && !CONSTELLATION_SKIP.has(key)));
    keys.forEach(key => {
      if (!uses.has(key)) uses.set(key, []);
      uses.get(key).push(recipe);
    });
  });
  const stars = [...uses.entries()]
    .filter(([, list]) => list.length >= 3)
    .sort((left, right) => right[1].length - left[1].length)
    .slice(0, CONSTELLATION_STARS)
    .map(([key, list]) => ({ key, label: constellationLabel(key), recipes: list, count: list.length }));
  const index = new Map(stars.map((star, position) => [star.key, position]));
  // Liens : les deux voisins les plus souvent cuisines avec chaque etoile.
  const together = stars.map(() => new Map());
  stars.forEach((star, position) => {
    const ids = new Set(star.recipes.map(recipe => recipe.id));
    stars.forEach((other, otherPosition) => {
      if (otherPosition === position) return;
      const shared = other.recipes.filter(recipe => ids.has(recipe.id)).length;
      if (shared >= 2) together[position].set(otherPosition, shared / Math.sqrt(star.count * other.count));
    });
  });
  const links = new Map();
  together.forEach((neighbours, position) => {
    [...neighbours.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).forEach(([other, strength]) => {
      const id = position < other ? `${position}-${other}` : `${other}-${position}`;
      if (!links.has(id)) links.set(id, { a: Math.min(position, other), b: Math.max(position, other), strength });
    });
  });
  // Placement : graines stables puis quelques passes de ressorts / repulsion.
  const { width, height } = size;
  const random = seededRandom(hashText(stars.map(star => star.key).join('|')));
  stars.forEach(star => {
    star.x = width * (0.12 + random() * 0.76);
    star.y = height * (0.14 + random() * 0.72);
  });
  const linkList = [...links.values()];
  for (let pass = 0; pass < 220; pass += 1) {
    const cooling = 1 - pass / 220;
    stars.forEach((star, a) => {
      let fx = 0;
      let fy = 0;
      stars.forEach((other, b) => {
        if (a === b) return;
        const dx = star.x - other.x;
        const dy = star.y - other.y;
        const distance = Math.max(30, Math.hypot(dx, dy));
        const push = 9000 / (distance * distance);
        fx += (dx / distance) * push;
        fy += (dy / distance) * push;
      });
      fx += (width / 2 - star.x) * 0.002;
      fy += (height / 2 - star.y) * 0.002;
      star.vx = fx;
      star.vy = fy;
    });
    linkList.forEach(({ a, b }) => {
      const first = stars[a];
      const second = stars[b];
      const dx = second.x - first.x;
      const dy = second.y - first.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const pull = (distance - 150) * 0.02;
      first.vx += (dx / distance) * pull;
      first.vy += (dy / distance) * pull;
      second.vx -= (dx / distance) * pull;
      second.vy -= (dy / distance) * pull;
    });
    stars.forEach(star => {
      star.x = Math.min(width * 0.94, Math.max(width * 0.06, star.x + star.vx * 6 * cooling));
      star.y = Math.min(height * 0.92, Math.max(height * 0.08, star.y + star.vy * 6 * cooling));
    });
  }
  // Le ciel remplit tout le cadre, quelle que soit la forme de l'ecran.
  if (stars.length > 1) {
    const xs = stars.map(star => star.x);
    const ys = stars.map(star => star.y);
    const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    stars.forEach(star => {
      star.x = width * 0.1 + (star.x - minX) / Math.max(1, maxX - minX) * width * 0.8;
      star.y = height * 0.15 + (star.y - minY) / Math.max(1, maxY - minY) * height * (width > height ? 0.62 : 0.7);
    });
  }
  // Les noms ne se chevauchent jamais : on ecarte les etiquettes qui se touchent.
  const glyph = width > height ? 8.4 : 13.4;
  const lineGap = width > height ? 34 : 48;
  for (let pass = 0; pass < 140; pass += 1) {
    let moved = false;
    stars.forEach((star, a) => stars.forEach((other, b) => {
      if (b <= a) return;
      const dx = other.x - star.x;
      const dy = other.y - star.y;
      const needX = (star.label.length + other.label.length) * glyph / 2 + 14;
      if (Math.abs(dx) >= needX || Math.abs(dy) >= lineGap) return;
      moved = true;
      const pushX = (needX - Math.abs(dx)) / needX;
      const pushY = (lineGap - Math.abs(dy)) / lineGap;
      // On pousse sur l'axe le moins couteux.
      if (pushY * lineGap < pushX * needX) {
        const shift = (lineGap - Math.abs(dy)) / 2 + 1;
        const sign = dy >= 0 ? 1 : -1;
        star.y -= shift * sign;
        other.y += shift * sign;
      } else {
        const shift = (needX - Math.abs(dx)) / 2 + 1;
        const sign = dx >= 0 ? 1 : -1;
        star.x -= shift * sign;
        other.x += shift * sign;
      }
    }));
    stars.forEach(star => {
      const half = Math.max(width * 0.05, star.label.length * glyph / 2 + 12);
      star.x = Math.min(width - half, Math.max(half, star.x));
      star.y = Math.min(height * (width > height ? 0.8 : 0.88), Math.max(height * 0.13, star.y));
    });
    if (!moved) break;
  }
  const top = stars[0]?.count || 1;
  stars.forEach(star => {
    star.size = 2.2 + 5.2 * Math.sqrt(star.count / top);
    star.twinkle = (hashText(star.key) % 70) / 10;
    star.family = constellationFamily(star.key);
  });
  // Poussiere d'etoiles du fond (fixe, stable).
  const dust = Array.from({ length: 260 }, () => ({
    x: random() * width,
    y: random() * height,
    r: random() < 0.92 ? 0.4 + random() * 0.8 : 1.2 + random() * 0.8,
    o: 0.2 + random() * 0.6,
    d: random() * 6
  }));
  return { stars, links: linkList, dust, index, size };
}

function FlavorConstellation({ open, onClose, recipes, openRecipe }) {
  const sky = useMemo(() => (open ? buildConstellation(recipes, constellationSize()) : null), [open, recipes]);
  const [selected, setSelected] = useState(-1);
  const [hovered, setHovered] = useState(-1);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [shooting, setShooting] = useState(null);
  const dragRef = useRef(null);
  const svgRef = useRef(null);
  const parallaxRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setSelected(-1);
    setView({ x: 0, y: 0, scale: 1 });
    const onKey = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey, true);
      html.style.overflow = previous;
    };
  }, [open]);

  // Etoiles filantes, de temps en temps (rien si animations reduites).
  useEffect(() => {
    if (!open || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    let timer = 0;
    const launch = () => {
      const random = Math.random;
      setShooting({ id: Date.now(), x: 200 + random() * 1100, y: 60 + random() * 320, angle: 18 + random() * 22 });
      timer = window.setTimeout(launch, 5000 + Math.random() * 7000);
    };
    timer = window.setTimeout(launch, 1800);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Le ciel suit tres legerement la souris ou l'inclinaison du telephone.
  useEffect(() => {
    if (!open || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    let frame = 0;
    const apply = (px, py) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        parallaxRef.current?.style.setProperty('--sky-x', px.toFixed(3));
        parallaxRef.current?.style.setProperty('--sky-y', py.toFixed(3));
      });
    };
    const onMove = event => apply(event.clientX / innerWidth - 0.5, event.clientY / innerHeight - 0.5);
    const onTilt = event => apply(Math.max(-0.5, Math.min(0.5, (event.gamma || 0) / 60)), Math.max(-0.5, Math.min(0.5, ((event.beta || 0) - 45) / 60)));
    window.addEventListener('pointermove', onMove);
    window.addEventListener('deviceorientation', onTilt);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('deviceorientation', onTilt);
    };
  }, [open]);

  if (!open || !sky) return null;
  const { width, height } = sky.size;
  const active = selected >= 0 ? selected : hovered;
  const linked = new Set();
  if (active >= 0) {
    linked.add(active);
    sky.links.forEach(({ a, b }) => {
      if (a === active) linked.add(b);
      if (b === active) linked.add(a);
    });
  }
  const star = selected >= 0 ? sky.stars[selected] : null;
  // Telephone : l'etoile choisie remonte au-dessus de la fiche.
  const pickStar = position => {
    const next = selected === position ? -1 : position;
    setSelected(next);
    if (next < 0) return;
    // La camera glisse vers l'etoile (a droite de la fiche sur grand ecran, au-dessus sur telephone).
    const target = sky.stars[next];
    const portrait = width < height;
    const goal = portrait ? { x: width / 2, y: height * 0.3 } : { x: width * 0.6, y: height / 2 };
    setView(current => ({ ...current, x: (goal.x - width / 2) / current.scale + width / 2 - target.x, y: (goal.y - height / 2) / current.scale + height / 2 - target.y }));
  };
  const zoom = factor => setView(current => ({ ...current, scale: Math.min(3, Math.max(0.7, current.scale * factor)) }));
  // Deplacement : glisser (souris, un doigt), zoom : molette ou deux doigts.
  const onPointerDown = event => {
    if (event.target.closest('.constellation-star')) return;
    dragRef.current = { x: event.clientX, y: event.clientY, view, pointers: dragRef.current?.pointers || new Map() };
    dragRef.current.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = event => {
    const drag = dragRef.current;
    if (!drag || !drag.pointers.has(event.pointerId)) return;
    drag.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const rect = svgRef.current.getBoundingClientRect();
    const unit = width / rect.width;
    if (drag.pointers.size === 2) {
      const [p1, p2] = [...drag.pointers.values()];
      const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (!drag.pinch) drag.pinch = { distance, scale: view.scale };
      setView(current => ({ ...current, scale: Math.min(3, Math.max(0.7, drag.pinch.scale * distance / drag.pinch.distance)) }));
      return;
    }
    setView({ ...drag.view, x: drag.view.x + (event.clientX - drag.x) * unit / drag.view.scale, y: drag.view.y + (event.clientY - drag.y) * unit / drag.view.scale });
  };
  const onPointerUp = event => {
    const drag = dragRef.current;
    if (!drag) return;
    drag.pointers.delete(event.pointerId);
    if (!drag.pointers.size) dragRef.current = null;
    else drag.pinch = null;
  };
  const transform = `translate(${width / 2}px, ${height / 2}px) scale(${view.scale}) translate(${-width / 2 + view.x}px, ${-height / 2 + view.y}px)`;
  const name = star ? 'Constellation' : '';

  return ReactDOM.createPortal(h('div', { className: 'constellation', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Constellation des saveurs', ref: parallaxRef },
    h('div', { className: 'constellation-nebula', 'aria-hidden': 'true' }),
    h('header', { className: 'constellation-head' },
      h('div', null,
        h('small', null, 'Cook Note'),
        h('h2', null, 'Constellation des saveurs')
      ),
      h('button', { type: 'button', className: 'constellation-close', onClick: onClose, 'aria-label': 'Fermer la constellation' }, h(Icon, { name: 'close' }))
    ),
    h('svg', {
      ref: svgRef,
      className: width < height ? 'constellation-sky is-portrait' : 'constellation-sky',
      viewBox: `0 0 ${width} ${height}`,
      preserveAspectRatio: 'xMidYMid meet',
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onWheel: event => zoom(event.deltaY < 0 ? 1.12 : 1 / 1.12),
      onClick: event => {
        if (!event.target.closest('.constellation-star')) setSelected(-1);
      }
    },
      h('defs', null,
        Object.entries(CONSTELLATION_GLOWS).map(([family, color]) => h('radialGradient', { key: family, id: `cn-glow-${family}` },
          h('stop', { offset: '0%', stopColor: '#fffaf0', stopOpacity: 1 }),
          h('stop', { offset: '28%', stopColor: color, stopOpacity: 0.5 }),
          h('stop', { offset: '100%', stopColor: color, stopOpacity: 0 })
        )),
        h('radialGradient', { id: 'cn-milky' },
          h('stop', { offset: '0%', stopColor: '#c9b8ff', stopOpacity: 0.16 }),
          h('stop', { offset: '45%', stopColor: '#7d8cd8', stopOpacity: 0.07 }),
          h('stop', { offset: '100%', stopColor: '#0b1022', stopOpacity: 0 })
        ),
        h('radialGradient', { id: 'cn-ember' },
          h('stop', { offset: '0%', stopColor: '#f0b27a', stopOpacity: 0.12 }),
          h('stop', { offset: '100%', stopColor: '#f0b27a', stopOpacity: 0 })
        )
      ),
      // Voie lactee : un voile tres doux qui traverse le ciel en diagonale.
      h('g', { className: 'constellation-milky', 'aria-hidden': 'true' },
        h('ellipse', { cx: width * 0.5, cy: height * 0.5, rx: Math.max(width, height) * 0.62, ry: Math.min(width, height) * 0.16, fill: 'url(#cn-milky)', transform: `rotate(${width > height ? -18 : -62} ${width / 2} ${height / 2})` }),
        h('ellipse', { cx: width * 0.28, cy: height * 0.7, rx: width * 0.22, ry: height * 0.16, fill: 'url(#cn-ember)' }),
        h('ellipse', { cx: width * 0.76, cy: height * 0.26, rx: width * 0.2, ry: height * 0.14, fill: 'url(#cn-milky)' })
      ),
      h('g', { className: 'constellation-dust' },
        sky.dust.map((dot, position) => h('circle', { key: position, cx: dot.x, cy: dot.y, r: dot.r, style: { opacity: dot.o, animationDelay: `${dot.d}s` }, className: position % 9 === 0 ? 'is-twinkle' : '' }))
      ),
      shooting && h('line', { key: shooting.id, className: 'constellation-shooting', x1: shooting.x, y1: shooting.y, x2: shooting.x + 200, y2: shooting.y + 200 * Math.tan((shooting.angle * Math.PI) / 180), pathLength: 1 }),
      h('g', { style: { transform }, className: dragRef.current ? 'constellation-world is-dragging' : 'constellation-world' },
        sky.links.map(({ a, b }) => {
          const lit = active >= 0 && (a === active || b === active);
          return h('line', {
            key: `${a}-${b}-${lit ? active : 'n'}`,
            className: lit ? 'constellation-link is-lit' : 'constellation-link',
            x1: sky.stars[a].x, y1: sky.stars[a].y, x2: sky.stars[b].x, y2: sky.stars[b].y,
            pathLength: 1
          });
        }),
        sky.stars.map((item, position) => {
          const state = position === active ? 'is-active' : active >= 0 && !linked.has(position) ? 'is-dim' : linked.has(position) ? 'is-linked' : '';
          return h('g', {
            key: item.key,
            className: `constellation-star is-${item.family} ${state}`,
            transform: `translate(${item.x} ${item.y})`,
            tabIndex: 0,
            role: 'button',
            'aria-label': `${item.label} : ${item.count} recettes`,
            onPointerEnter: () => setHovered(position),
            onPointerLeave: () => setHovered(-1),
            onFocus: () => setHovered(position),
            onBlur: () => setHovered(-1),
            onClick: () => pickStar(position),
            onKeyDown: event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                pickStar(position);
              }
            },
            style: { animationDelay: `${item.twinkle}s` }
          },
            // Naissance des etoiles : les plus brillantes s'allument d'abord.
            h('g', { className: 'constellation-body', style: { animationDelay: `${0.25 + position * 0.045}s` } },
              h('circle', { className: 'constellation-halo', r: item.size * 4.2, fill: `url(#cn-glow-${item.family})`, style: { animationDelay: `${item.twinkle}s` } }),
              position < 7 && h('g', { className: 'constellation-spikes', style: { animationDelay: `${item.twinkle}s` } },
                h('line', { x1: -item.size * 7, x2: item.size * 7, y1: 0, y2: 0 }),
                h('line', { y1: -item.size * 7, y2: item.size * 7, x1: 0, x2: 0 })
              ),
              position === active && h('circle', { key: `ripple-${active}`, className: 'constellation-ripple', r: item.size * 2 }),
              h('circle', { className: 'constellation-core', r: item.size }),
              h('circle', { className: 'constellation-hit', r: Math.max(22, item.size * 3) }),
              h('text', { className: 'constellation-label', y: item.size * 4.2 + 14, textAnchor: 'middle' }, item.label)
            )
          );
        })
      )
    ),
    h('div', { className: 'constellation-zoom' },
      h('button', { type: 'button', onClick: () => zoom(1.25), 'aria-label': 'Rapprocher' }, '+'),
      h('button', { type: 'button', onClick: () => zoom(1 / 1.25), 'aria-label': 'Éloigner' }, '−'),
      h('button', { type: 'button', onClick: () => setView({ x: 0, y: 0, scale: 1 }), 'aria-label': 'Recentrer' }, '◎')
    ),
    star
      ? h('aside', { key: star.key, className: 'constellation-card', 'aria-live': 'polite' },
        h('small', null, name),
        h('h3', null, star.label),
        h('p', null, `${star.count} recette${star.count > 1 ? 's' : ''} l’utilisent`),
        h('div', { className: 'constellation-accords' },
          h('span', null, 'Accords'),
          [...linked].filter(position => position !== selected).map(position => h('button', { key: position, type: 'button', className: `is-${sky.stars[position].family}`, onClick: () => pickStar(position) }, sky.stars[position].label))
        ),
        h('ul', null, star.recipes.slice(0, 8).map(recipe => h('li', { key: recipe.id },
          h('button', { type: 'button', onClick: () => { onClose(); openRecipe(recipe.id); } }, recipe.title)
        ))),
        star.recipes.length > 8 && h('p', { className: 'constellation-more' }, `et ${star.recipes.length - 8} autres`)
      )
      : h('div', { className: 'constellation-hint' },
        h('p', null, 'Touchez une étoile pour révéler sa constellation'),
        h('ul', { className: 'constellation-legend' }, [...CONSTELLATION_FAMILIES, { id: 'terre', label: 'Fondamentaux' }].map(family => h('li', { key: family.id, className: `is-${family.id}` }, family.label))),
        h('button', { type: 'button', className: 'constellation-surprise', onClick: () => pickStar(Math.floor(Math.random() * sky.stars.length)) }, h(Icon, { name: 'spark' }), 'Une étoile au hasard')
      )
  ), document.body);
}

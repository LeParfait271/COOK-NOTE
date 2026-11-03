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
  next: ['suivant', 'suivante', 'étape suivante', 'la suite', 'la suivante', 'la prochaine', 'prochaine étape', 'étape d’après', 'et après', 'on continue', 'on avance', 'avance', 'passe', 'passe à la suite', 'passer à la suite', 'on passe à la suite', 'passer à l’étape suivante', 'passe à l’étape suivante', 'on passe à la suivante', 'c’est fait', 'fait', 'c’est bon', 'j’ai fini', 'c’est fini', 'terminé', 'ok suivant', 'vas-y', 'allez', 'continue', 'étape d’après s’il te plaît', 'après', 'ensuite', 'et ensuite', 'la suite s’il te plaît', 'étape suivante s’il te plaît', 'on y va', 'go', 'next', 'c’est prêt', 'ça y est', 'voilà', 'voilà c’est fait', 'c’est ok', 'top', 'nickel', 'étape suivante merci', 'je passe à la suite', 'on enchaîne', 'enchaîne', 'avance d’une étape', 'une de plus'],
  previous: ['précédent', 'précédente', 'étape précédente', 'l’étape d’avant', 'étape d’avant', 'retour', 'reviens', 'revenir', 'reviens en arrière', 'retourne en arrière', 'en arrière', 'recule', 'on recule', 'reviens à l’étape précédente', 'arrière', 'retour arrière', 'étape avant', 'avant', 'une étape en arrière', 'recule d’une étape', 'on revient', 'j’ai raté l’étape', 'remontre l’étape d’avant'],
  first: ['première étape', 'la première étape', 'au début', 'début', 'recommence', 'recommencer', 'retour au début', 'reviens au début', 'depuis le début', 'reprends du début', 'on recommence', 'reprends depuis le début', 'tout depuis le début', 'retour à la première étape'],
  last: ['dernière étape', 'la dernière étape', 'à la fin', 'va à la fin', 'la fin', 'dernière', 'va à la dernière étape'],
  undo: ['annule', 'annuler', 'annule ça', 'pas fait', 'décoche', 'décoche l’étape', 'je me suis trompé', 'non pas fait', 'oups', 'erreur', 'c’est pas fait', 'je n’ai pas fini'],
  dismiss: ['ok', 'okay', 'oké', 'd’accord', 'compris', 'vu', 'merci', 'c’est noté', 'parfait', 'très bien', 'ferme ça', 'retour à l’étape', 'reviens à l’étape'],
  listenPause: ['pause', 'pause écoute', 'pause micro', 'mets en pause', 'stop écoute', 'arrête d’écouter un moment'],
  listenResume: ['reprends', 'reprendre', 'reprends l’écoute', 'on reprend', 'c’est reparti', 'reprise', 'je suis là', 'je reviens'],
  allIngredients: ['ingrédients', 'ingrédient', 'les ingrédients', 'tous les ingrédients', 'voir les ingrédients', 'montre les ingrédients', 'affiche les ingrédients', 'montre-moi les ingrédients', 'la liste', 'toute la liste', 'liste des ingrédients', 'la liste des ingrédients', 'quels ingrédients', 'il faut quoi', 'qu’est-ce qu’il faut', 'de quoi j’ai besoin', 'ingrédients s’il te plaît', 'qu’est-ce qu’il me faut', 'qu’est-ce qu’on met', 'on met quoi', 'liste de courses', 'les quantités', 'quelles quantités', 'combien il en faut'],
  equipment: ['matériel', 'le matériel', 'quel matériel', 'les ustensiles', 'ustensiles', 'voir le matériel', 'montre le matériel', 'il faut quel matériel', 'il faut quoi comme matériel', 'quels ustensiles', 'avec quoi'],
  technique: ['technique', 'la technique', 'montre la technique', 'voir la technique', 'quelle technique', 'comment on fait', 'comment faire', 'explique', 'explique-moi', 'aide-moi', 'comment', 'c’est quoi', 'qu’est-ce que ça veut dire', 'montre-moi comment', 'je ne comprends pas', 'j’ai pas compris', 'aide'],
  temperature: ['température', 'quelle température', 'la température', 'température du four', 'le four à combien', 'à combien le four', 'four à combien', 'quelle température le four', 'combien de degrés', 'à quelle température', 'four', 'le four', 'chaleur du four', 'thermostat', 'quel thermostat', 'je chauffe à combien', 'le four est à combien', 'le four c’est combien', 'je mets le four à combien'],
  remaining: ['temps restant', 'il reste combien', 'il reste combien de temps', 'combien de temps il reste', 'ça sera prêt quand', 'c’est prêt quand', 'on a fini quand', 'fini dans combien de temps', 'temps total', 'durée restante', 'quand est-ce que c’est prêt', 'combien de temps', 'reste combien', 'encore longtemps', 'c’est long', 'il reste beaucoup'],
  double: ['double', 'double les quantités', 'deux fois plus', 'fois deux', 'multiplie par deux', 'double la recette'],
  half: ['moitié', 'la moitié', 'divise par deux', 'moitié des quantités', 'deux fois moins', 'demi recette', 'la moitié de la recette'],
  repeat: ['répète', 'répète l’étape', 'redis', 'redis-moi', 'relis', 'relis l’étape', 'lis l’étape', 'c’est quoi l’étape', 'qu’est-ce que je fais', 'qu’est-ce que je dois faire', 'je fais quoi', 'on fait quoi', 'quoi faire', 'l’étape', 'rappelle-moi l’étape', 'montre l’étape', 'pardon', 'quoi', 'hein'],
  where: ['on en est où', 'où on en est', 'où j’en suis', 'quelle étape', 'c’est quelle étape', 'on est à quelle étape', 'il reste combien d’étapes', 'combien d’étapes', 'combien d’étapes il reste', 'étape combien'],
  // Verdict de fin de recette (parcours de chef), a l'ecran « Recette terminée ».
  verdictGood: ['réussi', 'c’est réussi', 'plat réussi', 'très réussi', 'c’était réussi', 'réussite', 'succès', 'c’est un succès', 'délicieux', 'trop bon', 'très bon', 'c’était très bon', 'excellent', 'génial', 'une réussite'],
  verdictOk: ['correct', 'c’est correct', 'c’était correct', 'moyen', 'pas mal', 'bof', 'ça va', 'passable', 'mitigé', 'peut mieux faire', 'pas terrible', 'bien sans plus'],
  verdictBad: ['raté', 'c’est raté', 'plat raté', 'c’était raté', 'loupé', 'c’est loupé', 'échec', 'pas réussi', 'c’est brûlé', 'mauvais', 'c’était mauvais', 'immangeable', 'catastrophe'],
  mute: ['coupe le micro', 'arrête d’écouter', 'arrête l’écoute', 'désactive la voix', 'micro off', 'éteins le micro', 'désactive le micro'],
  timerStop: ['stop', 'arrête', 'silence', 'ça suffit', 'chut', 'arrête la sonnerie', 'arrête l’alarme', 'coupe la sonnerie', 'coupe l’alarme', 'stop alarme', 'tais-toi', 'ok stop', 'stop stop', 'éteins l’alarme', 'éteins la sonnerie', 'c’est bon stop'],
  close: ['terminer', 'termine', 'quitter', 'quitte', 'ferme', 'fermer', 'fin', 'sortir', 'sors', 'quitte le mode mains libres', 'ferme le mode mains libres', 'on arrête', 'j’ai terminé la recette', 'au revoir', 'à plus', 'bon appétit', 'fin de la recette', 'on a fini']
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
    this.onloading?.(voskModelCached() ? tc('Chargement de la reconnaissance vocale…') : tc('Téléchargement de la reconnaissance vocale (40 Mo, une seule fois)…'));
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
      .replace(/^(ok|okay|alors|bon|ben|bah|bref|donc|euh|heu|hum|hop|et|puis|cook note|cooknote|dis|dis moi|hey|he|eh|bon alors|bon ben|tu peux|tu pourrais|peux tu|pourrais tu|est ce que tu peux|est ce qu on peut|je veux|je voudrais|j aimerais|je veux bien|on peut|on va|vas y|allez|stp|s il te plait|maintenant|du coup|en fait|attends)\s+/, '')
      .replace(/\s+(s il te plait|s il vous plait|stp|merci|merci beaucoup|maintenant|please|svp|alors|du coup|la|voila|hein|bien|encore)$/, '')
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
  if (words.length > 8) return null;
  // La phrase nettoyee, ou telle quelle (« bon appetit » perdrait son « bon »).
  const match = VOICE_COMMANDS.find(([, pattern]) => pattern.test(core)) || VOICE_COMMANDS.find(([, pattern]) => pattern.test(said));
  if (match) return command(match[0]);
  const skeleton = voiceSkeleton(core);
  const loose = VOICE_SKELETONS.get(skeleton);
  if (loose) return command(loose);
  const near = voiceNearCommand(skeleton);
  return near ? command(near, { approximate: true }) : null;
}

// « suivannte », « precedant », « temperatur » : un mot de 5 lettres et plus
// peut differer d'une lettre (ajout, oubli, remplacement), deux a partir de
// 8 lettres ; les mots courts doivent etre exacts. Une seule commande
// possible, sinon rien.
function voiceWordsClose(left, right) {
  if (left === right) return true;
  const shortest = Math.min(left.length, right.length);
  const allowed = shortest >= 8 ? 2 : 1;
  if (shortest < 5 || Math.abs(left.length - right.length) > allowed) return false;
  return voiceEditDistance(left, right) <= allowed;
}
function voiceEditDistance(left, right) {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    const row = [i];
    for (let j = 1; j <= right.length; j += 1) {
      row[j] = Math.min(previous[j] + 1, row[j - 1] + 1, previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1));
    }
    previous = row;
  }
  return previous[right.length];
}
function voiceNearCommand(skeleton) {
  const words = skeleton.split(' ');
  if (!skeleton || !words.some(word => word.length >= 5)) return null;
  const found = new Set();
  VOICE_SKELETONS.forEach((type, key) => {
    const parts = key.split(' ');
    if (parts.length === words.length && parts.every((part, position) => voiceWordsClose(part, words[position]))) found.add(type);
  });
  return found.size === 1 ? [...found][0] : null;
}
// Etiquette d'un minuteur lance a la voix : « 10 min », « 1 h 30 », « 45 s ».
function formatTimerLabel(seconds) {
  if (seconds < 60) return `${seconds} s`;
  return seconds % 60 ? formatTimerClock(seconds) : formatMinutesShort(seconds / 60);
}

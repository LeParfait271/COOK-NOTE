// ---------- Commandes vocales en anglais ----------
// Site en anglais : le mode mains libres ecoute le modele anglais
// (voice-model/vosk-model-small-en-us-0.15.tar.gz) et comprend ces phrases,
// memes types que VOICE_PHRASES (app-voice.js). Les commandes avec nombre
// (minuteur, portions, etape) sont ramenees au francais puis analysees par
// parseVoiceCommand comme d'habitude.
const VOICE_PHRASES_EN = {
  next: ['next', 'next step', 'go on', 'continue', 'done', 'i am done', 'it is done', 'ok next', 'go', 'move on', 'carry on', 'forward', 'keep going'],
  previous: ['back', 'go back', 'previous', 'previous step', 'step back'],
  first: ['first step', 'start again', 'from the beginning', 'restart', 'beginning'],
  last: ['last step', 'final step', 'go to the end'],
  undo: ['undo', 'not done', 'oops', 'mistake', 'cancel that'],
  dismiss: ['ok', 'okay', 'got it', 'thanks', 'thank you', 'fine', 'close this', 'back to the step'],
  listenPause: ['pause', 'pause listening', 'stop listening for a moment', 'wait'],
  listenResume: ['resume', 'resume listening', 'i am back', 'listen again', 'start listening'],
  allIngredients: ['ingredients', 'show ingredients', 'show the ingredients', 'ingredient list', 'what do i need', 'list'],
  equipment: ['equipment', 'show equipment', 'what equipment', 'utensils', 'tools'],
  technique: ['technique', 'show technique', 'how do i do that', 'how to', 'explain', 'help', 'help me'],
  temperature: ['temperature', 'what temperature', 'oven temperature', 'how hot', 'oven'],
  remaining: ['time left', 'how long', 'how much time is left', 'when is it ready', 'remaining time'],
  double: ['double', 'double it', 'twice as much', 'double the recipe'],
  half: ['half', 'halve it', 'half the recipe', 'divide by two'],
  repeat: ['repeat', 'say again', 'read the step', 'what is the step', 'what do i do', 'what now', 'pardon', 'sorry'],
  where: ['where am i', 'which step', 'what step', 'how many steps', 'how many steps left'],
  verdictGood: ['success', 'great', 'it was great', 'delicious', 'good', 'very good', 'perfect', 'well done'],
  verdictOk: ['okay result', 'not bad', 'average', 'so so', 'could be better'],
  verdictBad: ['failed', 'it failed', 'bad', 'burnt', 'ruined', 'disaster'],
  mute: ['microphone off', 'turn off the microphone', 'stop the microphone', 'mute'],
  timerStop: ['stop', 'silence', 'quiet', 'stop the alarm', 'stop the timer', 'stop ringing'],
  close: ['close', 'exit', 'quit', 'finish', 'end', 'leave', 'i am finished', 'enjoy']
};

// Mots des commandes avec nombre, et leur equivalent francais.
const VOICE_ENGLISH_TO_FRENCH = {
  timer: 'minuteur', timers: 'minuteurs', alarm: 'alarme', minute: 'minute', minutes: 'minutes', second: 'seconde', seconds: 'secondes', hour: 'heure', hours: 'heures',
  half: 'demi', and: 'et', for: 'pour', of: 'de', the: 'la', a: 'un', an: 'un', set: 'lance', start: 'lance', add: 'ajoute', more: 'encore', remove: 'enleve', minus: 'moins',
  stop: 'arrete', pause: 'pause', resume: 'reprends', step: 'etape', number: 'numero', people: 'personnes', persons: 'personnes', person: 'personne', servings: 'portions', serving: 'portion', portions: 'portions', guests: 'convives',
  one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12', thirteen: '13', fourteen: '14', fifteen: '15', sixteen: '16', seventeen: '17', eighteen: '18', nineteen: '19',
  twenty: '20', thirty: '30', forty: '40', fifty: '50', sixty: '60', ninety: '90'
};

// Vocabulaire ecoute en anglais (utilise par LocalRecognition, app-voice.js).
const VOICE_VOCABULARY_EN = Array.from(new Set([
  ...Object.values(VOICE_PHRASES_EN).flat().flatMap(phrase => phrase.split(/\s+/)),
  ...Object.keys(VOICE_ENGLISH_TO_FRENCH),
  'to', 'on', 'it', 'please', 'how', 'long', 'left', 'go'
]));

const escapeEnglishVoice = text => text.split('').map(char => ('.*+?^${}()|[]\\'.includes(char) ? `\\${char}` : char)).join('');
const VOICE_COMMANDS_EN = Object.entries(VOICE_PHRASES_EN).map(([type, phrases]) => [type, new RegExp(`^(${phrases.map(escapeEnglishVoice).join('|')})$`)]);
const VOICE_NUMBER_COMMANDS = new Set(['timer', 'timerAdd', 'timerStop', 'timerPause', 'timerResume', 'timerLeft', 'servings', 'goto', 'remaining']);

function parseEnglishVoiceCommand(transcript) {
  let core = String(transcript || '').toLowerCase().replace(/[’']/g, ' ').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  for (let pass = 0; pass < 3; pass += 1) {
    core = core.replace(/^(ok|okay|so|um|uh|hey|cook note|please|can you|could you|now|and|then|well)\s+/, '').replace(/\s+(please|now|thanks|thank you)$/, '').trim();
  }
  if (!core) return null;
  const match = VOICE_COMMANDS_EN.find(([, pattern]) => pattern.test(core));
  if (match) return { type: match[0], heard: core };
  const french = core.split(' ').map(word => VOICE_ENGLISH_TO_FRENCH[word] ?? word).join(' ');
  const parsed = parseVoiceCommand(french, true);
  return parsed && VOICE_NUMBER_COMMANDS.has(parsed.type) ? { ...parsed, heard: core } : null;
}

// Suggestions affichees (« Dites … ») dans la langue du site.
const VOICE_SUGGESTIONS_EN = {
  suivant: 'next', 'précédent': 'back', terminer: 'finish', 'voir les ingrédients': 'show ingredients', pause: 'pause', reprends: 'resume', ok: 'ok',
  'la technique': 'technique', 'quelle température': 'what temperature', 'combien de temps': 'how long', 'ajoute une minute': 'add a minute',
  'réussi': 'success', correct: 'okay result', 'raté': 'failed', annule: 'undo', fermer: 'close'
};
function voiceSuggestionLabel(text) {
  if (!VOICE_ENGLISH) return text;
  if (VOICE_SUGGESTIONS_EN[text]) return VOICE_SUGGESTIONS_EN[text];
  if (/^minuteur /.test(text)) return text.replace(/^minuteur /, 'timer ');
  return tc(text);
}

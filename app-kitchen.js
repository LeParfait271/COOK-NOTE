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

// Moteur vocal (Vosk, phrases, analyse des commandes) : app-voice.js.
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
        h('p', { key: 'why', className: 'cook-mode-panel-lead' }, tc('Pesez et préparez tous les ingrédients avant de commencer : pendant la recette, les gestes s’enchaînent sans attendre, rien ne brûle pendant qu’on cherche un ingrédient, et on voit tout de suite s’il manque quelque chose.')),
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
  if (finished) return finished === 'rated' ? ['annule', 'fermer'] : ['réussi', 'correct', 'raté', 'fermer'];
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
      note(index >= total - 1 ? tc('Recette terminée') : tc('Étape suivante'));
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
    case 'repeat': {
      // Rappel de l'etape en cours (ou de la mise en place).
      if (prep) {
        note('Mise en place : dites « suivant » pour commencer la recette', 'info', 5000);
        break;
      }
      const text = stripHtml(steps[index] || '').replace(/\s+/g, ' ').trim();
      note(text ? `Étape ${index + 1} : ${text.length > 180 ? `${text.slice(0, 177)}…` : text}` : `Étape ${index + 1}`, 'ok', 9000);
      break;
    }
    case 'where':
      note(prep ? `Mise en place, puis ${total} étapes` : `Étape ${index + 1} sur ${total}${total - index - 1 > 0 ? ` · encore ${total - index - 1}` : ' · dernière étape'}`, 'ok', 5000);
      break;
    case 'verdictGood':
    case 'verdictOk':
    case 'verdictBad':
      note('Le verdict se donne à la fin : dites « terminer » à la dernière étape', 'info', 4000);
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
// doigts) ; une etoile touchee ouvre la fiche de l'ingredient (atlas des
// ingredients, assets/ingredients/). Toute fiche de l'atlas utilisee par une
// recette devient une etoile : un nouvel ingredient apparait tout seul.
const CONSTELLATION_SIZE = { width: 1600, height: 1000 };
const CONSTELLATION_PORTRAIT = { width: 1000, height: 1600 };
const constellationSize = () => (window.innerHeight > window.innerWidth * 1.1 ? CONSTELLATION_PORTRAIT : CONSTELLATION_SIZE);
// Noms toujours affiches a l'echelle 1 (les autres apparaissent en zoomant).
const CONSTELLATION_NAMED = 56;
const CONSTELLATION_LAYOUT_KEY = 'cook_note_sky_layout';
const constellationLayoutCache = new Map();

// Atlas des ingredients (assets/ingredients/) : charge a l'ouverture du ciel,
// le moteur d'abord, puis toutes les familles de fiches.
const INGREDIENT_ATLAS_BASE = '/assets/ingredients/';
let ingredientAtlasLoad = null;

function loadIngredientAtlas() {
  if (window.cookNoteAtlasReady && window.cookNoteAtlas) return Promise.resolve(window.cookNoteAtlas);
  // Anglais : fiches traduites (assets/i18n/en-atlas.js) en meme temps.
  if (COOK_NOTE_LANG === 'en' && !window.COOK_NOTE_EN_ATLAS) {
    window.COOK_NOTE_EN_ATLAS = loadDeferredScript(`/assets/i18n/en-atlas.js${typeof SITE_CACHE_VERSION !== 'undefined' ? `?v=${SITE_CACHE_VERSION}` : ''}`).catch(() => {});
  }
  if (!ingredientAtlasLoad) {
    const version = typeof SITE_CACHE_VERSION !== 'undefined' ? `?v=${SITE_CACHE_VERSION}` : '';
    ingredientAtlasLoad = loadDeferredScript(`${INGREDIENT_ATLAS_BASE}atlas-core.js${version}`, 'cookNoteAtlas')
      .then(atlas => Promise.all(atlas.FILES.map(file => loadDeferredScript(`${INGREDIENT_ATLAS_BASE}${file}${version}`))).then(() => {
        window.cookNoteAtlasReady = true;
        return atlas;
      }))
      .catch(error => {
        ingredientAtlasLoad = null;
        throw error;
      });
  }
  return ingredientAtlasLoad;
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

// Une etoile par fiche de l'atlas presente dans au moins une recette.
// Taille : nombre de recettes ; amas : famille ; liens : les ingredients le
// plus souvent cuisines ensemble (frequence relative, pas brute).
function buildConstellation(recipes, size, atlas) {
  const uses = new Map();
  const together = new Map();
  const categories = new Map();
  const seasons = new Map();
  const leaves = (recipes || []).filter(recipe => recipe && !(recipe.variants || []).length && (recipe.ingredients || []).length);
  leaves.forEach(recipe => {
    const ids = new Set();
    (recipe.ingredients || []).forEach(group => (group.items || []).forEach(item => {
      if (!atlas.ignored(item)) atlas.match(item).forEach(id => ids.add(id));
    }));
    const list = [...ids];
    const category = typeof primaryCategory === 'function' ? primaryCategory(recipe) : '';
    list.forEach(id => {
      uses.set(id, (uses.get(id) || 0) + 1);
      if (!categories.has(id)) categories.set(id, new Map());
      if (category) categories.get(id).set(category, (categories.get(id).get(category) || 0) + 1);
      if (!seasons.has(id)) seasons.set(id, new Map());
      (recipe.seasons || []).forEach(season => seasons.get(id).set(season, (seasons.get(id).get(season) || 0) + 1));
    });
    for (let a = 0; a < list.length; a += 1) {
      for (let b = a + 1; b < list.length; b += 1) {
        const key = list[a] < list[b] ? `${list[a]}|${list[b]}` : `${list[b]}|${list[a]}`;
        together.set(key, (together.get(key) || 0) + 1);
      }
    }
  });
  const top = (map, count) => [...(map || new Map()).entries()].sort((left, right) => right[1] - left[1]).slice(0, count).map(([name]) => name);
  const stars = atlas.entries
    .filter(entry => uses.has(entry.id))
    .map(entry => ({
      key: entry.id,
      label: entry.name,
      family: entry.family,
      entry,
      count: uses.get(entry.id),
      categories: top(categories.get(entry.id), 3),
      seasons: top(seasons.get(entry.id), 4)
    }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label, 'fr'));
  const index = new Map(stars.map((star, position) => [star.key, position]));
  // Noms affiches : les plus utilises, et les deux premiers de chaque famille.
  const namedPerFamily = new Map();
  stars.forEach((star, position) => {
    star.rank = position;
    const seen = namedPerFamily.get(star.family) || 0;
    star.named = position < CONSTELLATION_NAMED || seen < 2;
    namedPerFamily.set(star.family, seen + 1);
  });

  // Voisins : affinite = recettes communes / racine(produit des usages).
  const neighbours = stars.map(() => []);
  together.forEach((count, key) => {
    if (count < 2) return;
    const [left, right] = key.split('|');
    const a = index.get(left);
    const b = index.get(right);
    if (a === undefined || b === undefined) return;
    const affinity = count / Math.sqrt(stars[a].count * stars[b].count);
    neighbours[a].push({ other: b, affinity, count });
    neighbours[b].push({ other: a, affinity, count });
  });
  const links = new Map();
  neighbours.forEach((list, position) => {
    list.sort((left, right) => right.affinity - left.affinity);
    stars[position].pairs = list.slice(0, 6).map(item => item.other);
    list.slice(0, stars[position].named ? 3 : 1).forEach(({ other }) => {
      const a = Math.min(position, other);
      const b = Math.max(position, other);
      links.set(`${a}-${b}`, { a, b, same: stars[a].family === stars[b].family });
    });
  });
  const linkList = [...links.values()];

  // Placement : un amas par famille, les amas sur une grande ellipse, puis
  // repulsion entre etoiles et rappel doux vers le centre de l'amas.
  const { width, height } = size;
  const random = seededRandom(hashText(stars.map(star => star.key).join('|')));
  const families = atlas.FAMILIES.filter(family => stars.some(star => star.family === family.id));
  const centers = new Map();
  families.forEach((family, position) => {
    const angle = (position / families.length) * Math.PI * 2 - Math.PI / 2;
    const spread = position % 2 ? 0.27 : 0.36;
    centers.set(family.id, { x: width / 2 + Math.cos(angle) * width * spread, y: height / 2 + Math.sin(angle) * height * spread });
  });
  stars.forEach(star => {
    const center = centers.get(star.family);
    const angle = random() * Math.PI * 2;
    const reach = 20 + random() * 90;
    star.x = center.x + Math.cos(angle) * reach;
    star.y = center.y + Math.sin(angle) * reach;
  });
  // Le placement coute cher sur telephone : il est garde (memoire et appareil)
  // tant que les etoiles et la forme de l'ecran ne changent pas.
  const layoutKey = `${width}x${height}|${hashText(stars.map(star => star.key + star.count).join(','))}`;
  const saved = constellationLayoutCache.get(layoutKey) || readJson(CONSTELLATION_LAYOUT_KEY, null);
  const restored = Boolean(saved && saved.key === layoutKey && saved.x && saved.x.length === stars.length);
  if (restored) {
    stars.forEach((star, position) => {
      star.x = saved.x[position];
      star.y = saved.y[position];
    });
  } else {
    const passes = 110;
    for (let pass = 0; pass < passes; pass += 1) {
      const cooling = 1 - pass / passes;
      for (let a = 0; a < stars.length; a += 1) {
        const star = stars[a];
        let fx = 0;
        let fy = 0;
        for (let b = 0; b < stars.length; b += 1) {
          if (a === b) continue;
          const other = stars[b];
          const dx = star.x - other.x;
          const dy = star.y - other.y;
          const square = dx * dx + dy * dy;
          if (square > 67600) continue;
          const distance = Math.max(12, Math.sqrt(square));
          const push = (star.family === other.family ? 1300 : 4200) / (distance * distance);
          fx += (dx / distance) * push;
          fy += (dy / distance) * push;
        }
        const center = centers.get(star.family);
        fx += (center.x - star.x) * 0.034;
        fy += (center.y - star.y) * 0.034;
        star.vx = fx;
        star.vy = fy;
      }
      linkList.forEach(({ a, b }) => {
        const first = stars[a];
        const second = stars[b];
        const dx = second.x - first.x;
        const dy = second.y - first.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const pull = (distance - 160) * 0.0008;
        first.vx += (dx / distance) * pull;
        first.vy += (dy / distance) * pull;
        second.vx -= (dx / distance) * pull;
        second.vy -= (dy / distance) * pull;
      });
      stars.forEach(star => {
        star.x += Math.max(-24, Math.min(24, star.vx * 5 * cooling));
        star.y += Math.max(-24, Math.min(24, star.vy * 5 * cooling));
      });
    }
    // Le ciel remplit tout le cadre, quelle que soit la forme de l'ecran.
    if (stars.length > 1) {
      const xs = stars.map(star => star.x);
      const ys = stars.map(star => star.y);
      const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
      stars.forEach(star => {
        star.x = width * 0.07 + (star.x - minX) / Math.max(1, maxX - minX) * width * 0.86;
        star.y = height * 0.13 + (star.y - minY) / Math.max(1, maxY - minY) * height * (width > height ? 0.6 : 0.68);
      });
    }
    // Les noms affiches ne se chevauchent pas.
    const named = stars.filter(star => star.named);
    const glyph = width > height ? 8.4 : 13.4;
    const lineGap = width > height ? 32 : 46;
    for (let pass = 0; pass < 120; pass += 1) {
      let moved = false;
      named.forEach((star, a) => named.forEach((other, b) => {
        if (b <= a) return;
        const dx = other.x - star.x;
        const dy = other.y - star.y;
        const needX = (star.label.length + other.label.length) * glyph / 2 + 12;
        if (Math.abs(dx) >= needX || Math.abs(dy) >= lineGap) return;
        moved = true;
        if ((lineGap - Math.abs(dy)) < (needX - Math.abs(dx))) {
          const shift = (lineGap - Math.abs(dy)) / 2 + 1;
          star.y -= shift * (dy >= 0 ? 1 : -1);
          other.y += shift * (dy >= 0 ? 1 : -1);
        } else {
          const shift = (needX - Math.abs(dx)) / 2 + 1;
          star.x -= shift * (dx >= 0 ? 1 : -1);
          other.x += shift * (dx >= 0 ? 1 : -1);
        }
      }));
      named.forEach(star => {
        const half = Math.max(width * 0.04, star.label.length * glyph / 2 + 10);
        star.x = Math.min(width - half, Math.max(half, star.x));
        star.y = Math.min(height * 0.9, Math.max(height * 0.1, star.y));
      });
      if (!moved) break;
    }
    const layout = { key: layoutKey, x: stars.map(star => Math.round(star.x)), y: stars.map(star => Math.round(star.y)) };
    constellationLayoutCache.set(layoutKey, layout);
    writeJson(CONSTELLATION_LAYOUT_KEY, layout);
  }
  const most = stars[0]?.count || 1;
  const colors = new Map(atlas.FAMILIES.map(family => [family.id, family.color]));
  stars.forEach(star => {
    star.size = 1.5 + 5.2 * Math.sqrt(star.count / most);
    star.twinkle = (hashText(star.key) % 70) / 10;
    star.color = colors.get(star.family) || '#f3cf86';
  });
  // Poussiere d'etoiles du fond (fixe, stable).
  const dust = Array.from({ length: window.matchMedia?.('(hover: none)').matches ? 120 : 220 }, () => ({
    x: random() * width,
    y: random() * height,
    r: random() < 0.92 ? 0.4 + random() * 0.8 : 1.2 + random() * 0.8,
    o: 0.2 + random() * 0.6,
    d: random() * 6
  }));
  return { stars, links: linkList, dust, index, size, families };
}

function FlavorConstellation({ open, onClose, recipes, openRecipe }) {
  const [showRecipes, setShowRecipes] = useState(false);
  const [atlas, setAtlas] = useState(() => (window.cookNoteAtlasReady ? window.cookNoteAtlas : null));
  const [atlasError, setAtlasError] = useState(false);
  const [focusFamily, setFocusFamily] = useState('');
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (!open || atlas) return;
    loadIngredientAtlas().then(setAtlas).catch(() => setAtlasError(true));
  }, [open, atlas]);
  // Calcul du ciel apres l'affichage de l'ecran d'attente (le telephone ne fige pas).
  const [sky, setSky] = useState(null);
  useEffect(() => {
    if (!open || !atlas) return undefined;
    const timer = window.setTimeout(() => setSky(buildConstellation(recipes, constellationSize(), atlas)), 30);
    return () => window.clearTimeout(timer);
  }, [open, recipes, atlas]);
  const worldRef = useRef(null);
  const [selected, setSelected] = useState(-1);
  const [hovered, setHovered] = useState(-1);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [shooting, setShooting] = useState(null);
  const dragRef = useRef(null);
  const svgRef = useRef(null);
  const movedRef = useRef(false);
  const tapRef = useRef(0);
  const parallaxRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setSelected(-1);
    setFocusFamily('');
    setQuery('');
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
    // La page sous le ciel n'est plus peinte (moins de calques a composer).
    html.classList.add('has-constellation');
    return () => {
      window.removeEventListener('keydown', onKey, true);
      html.style.overflow = previous;
      html.classList.remove('has-constellation');
    };
  }, [open]);

  // Etoiles filantes, de temps en temps (rien si animations reduites).
  useEffect(() => {
    if (!open || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || window.matchMedia?.('(hover: none)').matches) return undefined;
    let timer = 0;
    const launch = () => {
      const random = Math.random;
      setShooting({ id: Date.now(), x: 200 + random() * 1100, y: 60 + random() * 320, angle: 18 + random() * 22 });
      timer = window.setTimeout(launch, 5000 + Math.random() * 7000);
    };
    timer = window.setTimeout(launch, 1800);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Le ciel suit tres legerement la souris (pas au telephone : l'inclinaison
  // redessinait tout le ciel en continu).
  useEffect(() => {
    if (!open || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !window.matchMedia?.('(hover: hover)').matches) return undefined;
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

  // Telephone : redessin du canvas a chaque changement de cadrage ou de choix.
  const [touchSky] = useState(() => Boolean(window.matchMedia?.('(hover: none)').matches));
  useEffect(() => {
    if (!open || !touchSky || !sky || !svgRef.current) return undefined;
    const redraw = () => svgRef.current && drawConstellationCanvas(svgRef.current, sky, view, selected, focusFamily);
    redraw();
    window.addEventListener('resize', redraw);
    return () => window.removeEventListener('resize', redraw);
  }, [open, touchSky, sky, view, selected, focusFamily]);

  if (!open) return null;
  if (!sky) {
    return ReactDOM.createPortal(h('div', { className: 'constellation is-loading', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Constellation des saveurs' },
      h('header', { className: 'constellation-head' },
        h('div', null, h('small', null, tc('Cook Note')), h('h2', null, tc('Constellation des saveurs'))),
        h('button', { type: 'button', className: 'constellation-close', onClick: onClose, 'aria-label': 'Fermer la constellation' }, h(Icon, { name: 'close' }))
      ),
      h('p', { className: 'constellation-loading' }, atlasError ? tc('Le ciel n’a pas pu se charger. Vérifiez la connexion puis rouvrez la constellation.') : tc('Les étoiles s’allument…'))
    ), document.body);
  }
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
    setShowRecipes(false);
    if (next < 0) return;
    // La camera glisse vers l'etoile (a droite de la fiche sur grand ecran, au-dessus sur telephone).
    const target = sky.stars[next];
    const portrait = width < height;
    const goal = portrait ? { x: width / 2, y: height * 0.3 } : { x: width * 0.6, y: height / 2 };
    setView(current => ({ ...current, x: (goal.x - width / 2) / current.scale + width / 2 - target.x, y: (goal.y - height / 2) / current.scale + height / 2 - target.y }));
  };
  // Cadrage : zoom 0,7 a 4, et le ciel ne peut pas sortir de l'ecran.
  const clampView = next => {
    const scale = Math.min(4, Math.max(0.7, next.scale));
    const limitX = width * 0.55;
    const limitY = height * 0.55;
    return { scale, x: Math.min(limitX, Math.max(-limitX, next.x)), y: Math.min(limitY, Math.max(-limitY, next.y)) };
  };
  // Point de l'ecran -> coordonnees du viewBox (ciel centre, « meet »).
  const toSky = (clientX, clientY, rect) => {
    const unit = Math.max(width / rect.width, height / rect.height);
    return { x: (clientX - rect.left) * unit - (rect.width * unit - width) / 2, y: (clientY - rect.top) * unit - (rect.height * unit - height) / 2 };
  };
  // Zoom autour d'un point : l'etoile sous le doigt (ou la souris) reste sous le doigt.
  const zoomAround = (base, scale, from, to = from) => {
    const worldX = (from.x - width / 2) / base.scale + width / 2 - base.x;
    const worldY = (from.y - height / 2) / base.scale + height / 2 - base.y;
    const next = Math.min(4, Math.max(0.7, scale));
    return clampView({ scale: next, x: (to.x - width / 2) / next - worldX + width / 2, y: (to.y - height / 2) / next - worldY + height / 2 });
  };
  const zoom = factor => setView(current => zoomAround(current, current.scale * factor, { x: width / 2, y: height / 2 }));
  // Gestes : un doigt deplace, deux doigts zooment autour de leur milieu et
  // deplacent en meme temps. A chaque doigt pose ou leve, le geste repart de
  // la position atteinte (aucun saut). Un toucher qui bouge de moins de 8 px
  // reste un toucher (choix d'une etoile), double toucher : zoom.
  const rebase = drag => {
    const points = [...drag.pointers.values()];
    drag.base = drag.live || drag.base;
    drag.anchor = points.length >= 2
      ? { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2, distance: Math.max(20, Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)) }
      : points[0] ? { ...points[0] } : null;
  };
  const onPointerDown = event => {
    if (event.target.closest('.constellation-star')) return;
    const drag = dragRef.current || (dragRef.current = { pointers: new Map(), base: view, live: null, moved: false, start: { x: event.clientX, y: event.clientY } });
    drag.rect = svgRef.current.getBoundingClientRect();
    drag.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    rebase(drag);
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {}
  };
  // Pendant le geste, rien n'est re-rendu par React : telephone, une image du
  // ciel deplacee dans le canvas ; ordinateur, le transform du monde SVG.
  const paint = next => {
    const stage = svgRef.current;
    const drag = dragRef.current;
    if (!stage || !drag) return;
    if (touchSky) drawConstellationCanvas(stage, sky, next, selected, focusFamily, drag.first);
    else if (worldRef.current) worldRef.current.style.transform = skyTransform(next);
  };
  const onPointerMove = event => {
    const drag = dragRef.current;
    if (!drag || !drag.pointers.has(event.pointerId)) return;
    drag.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (!drag.moved) {
      if (drag.pointers.size < 2 && Math.hypot(event.clientX - drag.start.x, event.clientY - drag.start.y) < 8) return;
      drag.moved = true;
      drag.first = drag.base;
      worldRef.current?.classList.add('is-dragging');
    }
    const points = [...drag.pointers.values()];
    const unit = Math.max(width / drag.rect.width, height / drag.rect.height);
    if (points.length >= 2 && drag.anchor?.distance) {
      const center = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
      const distance = Math.max(20, Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y));
      drag.live = zoomAround(drag.base, drag.base.scale * distance / drag.anchor.distance, toSky(drag.anchor.x, drag.anchor.y, drag.rect), toSky(center.x, center.y, drag.rect));
    } else if (drag.anchor) {
      drag.live = clampView({ ...drag.base, x: drag.base.x + (event.clientX - drag.anchor.x) * unit / drag.base.scale, y: drag.base.y + (event.clientY - drag.anchor.y) * unit / drag.base.scale });
    }
    if (!drag.frame) {
      drag.frame = requestAnimationFrame(() => {
        drag.frame = 0;
        if (drag.live) paint(drag.live);
      });
    }
  };
  const onPointerUp = event => {
    const drag = dragRef.current;
    if (!drag || !drag.pointers.has(event.pointerId)) return;
    drag.pointers.delete(event.pointerId);
    if (drag.pointers.size) {
      rebase(drag);
      return;
    }
    if (drag.frame) cancelAnimationFrame(drag.frame);
    dragRef.current = null;
    movedRef.current = drag.moved;
    worldRef.current?.classList.remove('is-dragging');
    if (drag.moved && drag.live) setView(drag.live);
  };
  // Double toucher (ou double clic) dans le vide : zoom x2 autour du point.
  const lastTapRef = tapRef;
  const onDoubleTap = (clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect();
    const point = toSky(clientX, clientY, rect);
    setView(current => zoomAround(current, current.scale >= 3.5 ? 1 : current.scale * 2, point, current.scale >= 3.5 ? { x: width / 2, y: height / 2 } : point));
    lastTapRef.current = 0;
  };
  const skyTransform = next => `translate(${width / 2}px, ${height / 2}px) scale(${next.scale}) translate(${-width / 2 + next.x}px, ${-height / 2 + next.y}px)`;
  const transform = skyTransform(view);
  const showAllNames = view.scale >= 1.7;
  const familyLabel = id => (sky.families.find(family => family.id === id) || {}).label || '';
  const matches = query.trim() ? sky.stars.filter(item => normalizeText(item.label).includes(normalizeText(query.trim()))).slice(0, 6) : [];

  return ReactDOM.createPortal(h('div', { className: 'constellation', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Constellation des saveurs', ref: parallaxRef },
    h('div', { className: 'constellation-nebula', 'aria-hidden': 'true' }),
    h('header', { className: 'constellation-head' },
      h('div', null,
        h('small', null, tc('Cook Note')),
        h('h2', null, tc('Constellation des saveurs'))
      ),
      h('button', { type: 'button', className: 'constellation-close', onClick: onClose, 'aria-label': 'Fermer la constellation' }, h(Icon, { name: 'close' }))
    ),
    touchSky ? h('canvas', {
      ref: svgRef,
      className: width < height ? 'constellation-sky is-canvas is-portrait' : 'constellation-sky is-canvas',
      role: 'img',
      'aria-label': `Ciel de ${sky.stars.length} ingrédients`,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClick: event => {
        if (movedRef.current) {
          movedRef.current = false;
          return;
        }
        const position = pickConstellationStar(event.currentTarget, sky, view, event.clientX, event.clientY);
        if (position >= 0) {
          pickStar(position);
          return;
        }
        const now = Date.now();
        if (now - lastTapRef.current < 320) onDoubleTap(event.clientX, event.clientY);
        else {
          lastTapRef.current = now;
          setSelected(-1);
        }
      }
    }) : h('svg', {
      ref: svgRef,
      className: width < height ? 'constellation-sky is-portrait' : 'constellation-sky',
      viewBox: `0 0 ${width} ${height}`,
      preserveAspectRatio: 'xMidYMid meet',
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onWheel: event => {
        const point = toSky(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect());
        setView(current => zoomAround(current, current.scale * (event.deltaY < 0 ? 1.12 : 1 / 1.12), point));
      },
      onDoubleClick: event => {
        if (!event.target.closest('.constellation-star')) onDoubleTap(event.clientX, event.clientY);
      },
      onClick: event => {
        if (!event.target.closest('.constellation-star')) setSelected(-1);
      }
    },
      h('defs', null,
        sky.families.map(({ id: family, color }) => h('radialGradient', { key: family, id: `cn-glow-${family}` },
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
      h('g', { ref: worldRef, style: { transform }, className: focusFamily ? 'constellation-world has-focus' : 'constellation-world' },
        sky.links.map(({ a, b, same }) => {
          const lit = active >= 0 && (a === active || b === active);
          return h('line', {
            key: `${a}-${b}-${lit ? active : 'n'}`,
            className: lit ? 'constellation-link is-lit' : same ? 'constellation-link' : 'constellation-link is-cross',
            x1: sky.stars[a].x, y1: sky.stars[a].y, x2: sky.stars[b].x, y2: sky.stars[b].y,
            pathLength: 1
          });
        }),
        sky.stars.map((item, position) => {
          const inFocus = !focusFamily || item.family === focusFamily;
          const state = position === active ? 'is-active' : active >= 0 && !linked.has(position) ? 'is-dim' : linked.has(position) ? 'is-linked' : !inFocus ? 'is-dim' : '';
          const labelled = item.named || showAllNames || position === active || linked.has(position) || (focusFamily && item.family === focusFamily);
          return h('g', {
            key: item.key,
            className: `constellation-star ${state}`,
            transform: `translate(${item.x} ${item.y})`,
            tabIndex: 0,
            role: 'button',
            'aria-label': `${item.label}, ${familyLabel(item.family)}`,
            // Survol a la souris seulement : au doigt il re-rendait tout le ciel.
            onPointerEnter: event => { if (event.pointerType === 'mouse') setHovered(position); },
            onPointerLeave: event => { if (event.pointerType === 'mouse') setHovered(-1); },
            onFocus: () => setHovered(position),
            onBlur: () => setHovered(-1),
            onClick: () => pickStar(position),
            onKeyDown: event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                pickStar(position);
              }
            },
            style: { animationDelay: `${item.twinkle}s`, '--star': item.color }
          },
            // Naissance des etoiles : les plus brillantes s'allument d'abord.
            // Halo et naissance animee pour les etoiles nommees seulement : les
            // 200 petites etoiles restent de simples points (bien plus legers).
            h('g', { className: item.named ? 'constellation-body is-named' : 'constellation-body', style: item.named ? { animationDelay: `${0.2 + Math.min(position, 80) * 0.02}s` } : undefined },
              (item.named || position === active || linked.has(position)) && h('circle', { className: position < 14 ? 'constellation-halo is-bright' : 'constellation-halo', r: item.size * 4.2, fill: `url(#cn-glow-${item.family})`, style: position < 14 ? { animationDelay: `${item.twinkle}s` } : undefined }),
              position < 7 && h('g', { className: 'constellation-spikes', style: { animationDelay: `${item.twinkle}s` } },
                h('line', { x1: -item.size * 7, x2: item.size * 7, y1: 0, y2: 0 }),
                h('line', { y1: -item.size * 7, y2: item.size * 7, x1: 0, x2: 0 })
              ),
              position === active && h('circle', { key: `ripple-${active}`, className: 'constellation-ripple', r: item.size * 2 }),
              h('circle', { className: 'constellation-core', r: item.size }),
              h('circle', { className: 'constellation-hit', r: Math.max(18, item.size * 3) }),
              labelled && h('text', { className: item.named ? 'constellation-label' : 'constellation-label is-minor', y: item.size * 4.2 + 14, textAnchor: 'middle' }, item.label)
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
    // Recherche d'un ingredient : la camera file vers son etoile.
    h('div', { className: 'constellation-search' },
      h(Icon, { name: 'search' }),
      h('input', {
        type: 'search',
        value: query,
        placeholder: `Chercher parmi ${sky.stars.length} ingrédients`,
        'aria-label': 'Chercher un ingrédient dans le ciel',
        onChange: event => setQuery(event.target.value),
        onKeyDown: event => {
          if (event.key === 'Enter' && matches.length) {
            pickStar(sky.index.get(matches[0].key));
            setQuery('');
          }
        }
      }),
      matches.length > 0 && h('ul', null, matches.map(item => h('li', { key: item.key },
        h('button', { type: 'button', style: { '--star': item.color }, onClick: () => { pickStar(sky.index.get(item.key)); setQuery(''); } }, item.label)
      )))
    ),
    star
      ? h('aside', { key: star.key, className: 'constellation-card', 'aria-live': 'polite', style: { '--star': star.color } },
        h('small', null, familyLabel(star.family)),
        h('h3', null, star.label),
        h('p', { className: 'constellation-portrait' }, star.entry.portrait),
        h('dl', { className: 'constellation-facts' },
          [['Saveur', 'saveur'], ['Origine', 'origine'], ['Saison', 'saison'], ['Bien choisir', 'choix'], ['Conservation', 'conservation'], ['Astuce de chef', 'astuce'], ['Accords classiques', 'accords'], ['Nutrition', 'nutrition']]
            .filter(([, field]) => star.entry[field])
            .map(([label, field]) => h('div', { key: field }, h('dt', null, label), h('dd', null, star.entry[field])))
        ),
        h('div', { className: 'constellation-onsite' },
          h('span', null, tc('Sur Cook Note')),
          h('p', null, `Présent dans ${star.count} recette${star.count > 1 ? 's' : ''}${star.categories.length ? `, surtout en ${star.categories.join(', ').toLowerCase()}` : ''}.`),
          // Recettes du site avec cet ingredient (calculees a la demande).
          openRecipe && h('button', { type: 'button', className: 'constellation-recipes-toggle', 'aria-expanded': showRecipes, onClick: () => setShowRecipes(value => !value) }, showRecipes ? 'Masquer les recettes' : `Voir les ${star.count > 1 ? `${star.count} recettes` : 'recette'}`),
          showRecipes && atlas && h('ul', { className: 'constellation-recipes' },
            (recipes || [])
              .filter(recipe => recipe && !(recipe.variants || []).length && (recipe.ingredients || []).some(group => (group.items || []).some(item => !atlas.ignored(item) && atlas.match(item).includes(star.entry.id))))
              .sort((a, b) => a.title.localeCompare(b.title, 'fr'))
              .map(recipe => h('li', { key: recipe.id }, h('button', { type: 'button', onClick: () => { onClose(); openRecipe(recipe.id); } }, recipe.title)))
          )
        ),
        (star.pairs || []).length > 0 && h('div', { className: 'constellation-accords' },
          h('span', null, tc('Souvent cuisiné avec')),
          star.pairs.map(position => h('button', { key: position, type: 'button', style: { '--star': sky.stars[position].color }, onClick: () => pickStar(position) }, sky.stars[position].label))
        )
      )
      : h('div', { className: 'constellation-hint' },
        h('p', null, `${sky.stars.length} ingrédients · touchez une étoile pour découvrir sa fiche`),
        h('ul', { className: 'constellation-legend' }, sky.families.map(family => h('li', { key: family.id },
          h('button', {
            type: 'button',
            className: focusFamily === family.id ? 'is-active' : '',
            style: { '--star': family.color },
            'aria-pressed': focusFamily === family.id,
            onClick: () => setFocusFamily(focusFamily === family.id ? '' : family.id)
          }, family.label)
        ))),
        h('button', { type: 'button', className: 'constellation-surprise', onClick: () => pickStar(Math.floor(Math.random() * sky.stars.length)) }, h(Icon, { name: 'spark' }), 'Une étoile au hasard')
      )
  ), document.body);
}

// ---------- A anticiper ----------
// Ce qu'une recette demande de preparer en avance, lu dans ses ingredients et
// ses etapes : beurre ou oeufs a temperature ambiante, trempage, marinade,
// repos au froid, levee. Chaque rappel porte son avance en minutes ; « Me le
// rappeler » cree un evenement de calendrier (.ics) avec une alarme par
// rappel, a l'heure du repas choisie : l'agenda du telephone previent, meme
// site ferme.
const ANTICIPATION_RULES = [
  { id: 'beurre', test: /\bbeurre\b[^.;]*\b(pommade|mou|ramolli|temperature ambiante)|\b(pommade)\b/, text: 'Sortir le beurre du réfrigérateur', lead: 60 },
  { id: 'oeufs', test: /\b(oeufs?|œufs?)\b[^.;]*\btemperature ambiante\b/, text: 'Sortir les œufs du réfrigérateur', lead: 45 },
  { id: 'viande', test: /\b(sortir|sors)\b[^.;]*\b(viande|gigot|roti|cote de boeuf|poulet|magret)\b[^.;]*\b(avance|avant|temperature ambiante)/, text: 'Sortir la viande du réfrigérateur', lead: 45 },
  { id: 'trempage', test: /\b(tremper|trempage|faire tremper)\b[^.;]*\b(nuit|veille|\d+\s*h)/, text: 'Mettre à tremper', lead: 720 },
  { id: 'marinade', test: /\b(mariner|marinade|laisser mariner)\b[^.;]*\b(nuit|veille|(\d+)\s*h)/, text: 'Lancer la marinade', lead: 'marinade' },
  { id: 'froid', test: /\b(repos(er)?|reserver|laisser prendre|refroidir)\b[^.;]*\b(au frais|au refrigerateur|au froid)\b[^.;]*\b(nuit|(\d+)\s*h)/, text: 'Préparer à l’avance (repos au froid)', lead: 'froid' },
  { id: 'levee', test: /\b(lever|levee|pousser|pousse)\b[^.;]*\b(\d+)\s*h/, text: 'Commencer la pâte (levée)', lead: 'levee' }
];

function anticipationHours(match, fallback) {
  const hours = Number(String(match || '').match(/(\d+)\s*h/)?.[1]);
  return hours ? hours * 60 : fallback;
}

function getRecipeAnticipations(recipe) {
  if (!recipe) return [];
  const lines = [
    ...(recipe.ingredients || []).flatMap(group => group.items || []),
    ...(recipe.steps || []).map(step => (typeof step === 'string' ? step : step?.text || ''))
  ].map(line => normalizeText(stripHtml(line)))
    // Conservation (« se conserve 48 h au frais ») : pas une preparation a l'avance.
    .filter(line => !/\b(conserv|se garde|jusqu a \d|restes?)\b/.test(line));
  const found = [];
  ANTICIPATION_RULES.forEach(rule => {
    const line = lines.find(text => rule.test.test(text));
    if (!line) return;
    const night = /\b(nuit|veille)\b/.test(line);
    let lead = rule.lead;
    if (typeof lead !== 'number') lead = night ? 720 : anticipationHours(line.match(rule.test)?.[0], 120);
    // Marge d'un quart d'heure en plus du temps demande, pour s'organiser.
    found.push({ id: rule.id, text: rule.text, lead: Math.min(1440, lead + (lead >= 120 ? 15 : 0)) });
  });
  return found.sort((a, b) => b.lead - a.lead);
}

const formatLead = minutes => (minutes >= 600 ? tc('la veille') : minutes >= 60 ? `${Math.round(minutes / 60)} h ${tc('avant')}` : `${minutes} min ${tc('avant')}`);

// ---------- Agendas du telephone ----------
// iPhone / iPad : le fichier .ics ouvert directement propose « Ajouter au
// calendrier » (alertes comprises). Android : lien Google Agenda (l'appli
// s'ouvre) ou le fichier .ics, que Google Agenda ou Samsung Agenda ouvrent.
// Ordinateur : les deux.
const AGENDA_NAV = typeof navigator !== 'undefined' ? navigator : {};
const AGENDA_IS_IOS = /iP(hone|ad|od)/.test(AGENDA_NAV.userAgent || '') || (AGENDA_NAV.platform === 'MacIntel' && AGENDA_NAV.maxTouchPoints > 1);
const AGENDA_IS_ANDROID = /Android/i.test(AGENDA_NAV.userAgent || '');

function agendaStamp(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function buildIcs(events) {
  const escape = text => String(text).replace(/[\\;,]/g, match => `\\${match}`).replace(/\n/g, '\\n');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Cook Note//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    ...events.flatMap(event => [
      'BEGIN:VEVENT',
      `UID:${event.uid}@cook-note`,
      `DTSTAMP:${agendaStamp(new Date())}`, `DTSTART:${agendaStamp(event.start)}`, `DTEND:${agendaStamp(event.end)}`,
      `SUMMARY:${escape(event.summary)}`,
      event.description ? `DESCRIPTION:${escape(event.description)}` : '',
      event.url ? `URL:${event.url}` : '',
      ...(event.alarms || []).flatMap(alarm => ['BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${escape(alarm.text || event.summary)}`, `TRIGGER:-PT${Math.max(0, Math.round(alarm.minutes))}M`, 'END:VALARM']),
      'END:VEVENT'
    ].filter(Boolean)),
    'END:VCALENDAR'
  ].join('\r\n');
}

function openIcs(events, fileName) {
  const text = buildIcs(events);
  if (AGENDA_IS_IOS) {
    // Safari iOS : l'adresse text/calendar ouvre la fiche « Ajouter au calendrier ».
    window.location.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(text)}`;
    return;
  }
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([text], { type: 'text/calendar;charset=utf-8' }));
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function googleAgendaUrl(event) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.summary,
    dates: `${agendaStamp(event.start)}/${agendaStamp(event.end)}`,
    details: [event.description, event.url].filter(Boolean).join('\n\n')
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Boutons selon l'appareil : le bon agenda en premier, l'autre en lien discret.
function AgendaButtons({ events, fileName, disabled = false, label = 'Ajouter à l’agenda' }) {
  const ready = !disabled && events.length > 0;
  const ics = h('button', { type: 'button', className: 'agenda-btn', disabled: !ready, onClick: () => openIcs(events, fileName) },
    h(Icon, { name: 'calendar' }), h('span', null, AGENDA_IS_IOS ? tc('Ajouter au Calendrier') : AGENDA_IS_ANDROID ? tc('Fichier agenda (.ics)') : tc(label)));
  // Google Agenda : un seul rendez-vous par lien, le premier de la liste.
  const google = h('a', { className: AGENDA_IS_ANDROID ? 'agenda-btn' : 'agenda-link', href: ready ? googleAgendaUrl(events[0]) : undefined, target: '_blank', rel: 'noreferrer', 'aria-disabled': !ready },
    AGENDA_IS_ANDROID && h(Icon, { name: 'calendar' }), h('span', null, tc('Google Agenda')));
  // Plusieurs rendez-vous (la semaine) : le fichier seul, Google n'en prend qu'un par lien.
  if (events.length > 1) return h('div', { className: 'agenda-buttons' }, h('button', { type: 'button', className: 'agenda-btn', disabled: !ready, onClick: () => openIcs(events, fileName) }, h(Icon, { name: 'calendar' }), h('span', null, tc(label))));
  return h('div', { className: 'agenda-buttons' },
    AGENDA_IS_ANDROID ? [h(React.Fragment, { key: 'g' }, google), h(React.Fragment, { key: 'i' }, ics)] : [h(React.Fragment, { key: 'i' }, ics), !AGENDA_IS_IOS && h(React.Fragment, { key: 'g' }, google)]
  );
}

function anticipationEvents(recipe, items, mealAt) {
  const title = tc(recipe.title);
  const start = new Date(mealAt);
  return [{
    uid: `${recipe.id || 'recette'}-${start.getTime()}`,
    start,
    end: new Date(start.getTime() + 60 * 60000),
    summary: `${tc('Cuisiner')} : ${title}`,
    description: items.map(item => `${tc(item.text)} (${formatLead(item.lead)})`).join('\n'),
    url: `${window.location.origin}${getRecipeUrl(recipe.id)}`,
    alarms: items.map(item => ({ minutes: item.lead, text: `${tc(item.text)} · ${title}` }))
  }];
}

function AnticipationBlock({ recipe }) {
  const items = useMemo(() => getRecipeAnticipations(recipe), [recipe]);
  const [mealAt, setMealAt] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + (date.getHours() >= 17 ? 1 : 0));
    date.setHours(19, 30, 0, 0);
    const pad = value => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  });
  if (!items.length) return null;
  return h('section', { className: 'anticipation-card notes-static-card', 'aria-label': tc('À anticiper') },
    h('p', { className: 'eyebrow' }, tc('À anticiper')),
    // Toucher une preparation lance un minuteur de sa duree (ex. beurre sorti :
    // pret dans 1 h). Au-dela de 10 h (la veille), l'agenda prend le relais.
    h('ul', null, items.map(item => h('li', { key: item.id },
      item.lead < 600
        ? h('button', { type: 'button', className: 'anticipation-timer', onClick: () => startKitchenTimer({ seconds: item.lead * 60, label: tc(item.text), title: tc(recipe.title) }), title: tc('Lancer un minuteur') },
          h('strong', null, formatLead(item.lead)), h('span', null, tc(item.text)), h(Icon, { name: 'timer' }))
        : h('div', { className: 'anticipation-timer is-static' }, h('strong', null, formatLead(item.lead)), h('span', null, tc(item.text)))
    ))),
    h('div', { className: 'anticipation-remind' },
      h('label', null, h('span', null, tc('Repas prévu')), h('input', { type: 'datetime-local', value: mealAt, onChange: event => setMealAt(event.target.value) })),
      h(AgendaButtons, { events: mealAt ? anticipationEvents(recipe, items, mealAt) : [], fileName: `cook-note-${recipe.id || 'recette'}.ics`, disabled: !mealAt })
    ),
    h('small', null, tc('Le repas s’ajoute à l’agenda du téléphone, avec une alerte pour chaque préparation.'))
  );
}

// ---------- Traducteur d'affichage (anglais) ----------
// En anglais, chaque texte affiche par l'application (noeuds texte et
// attributs placeholder, aria-label, title, alt) est remplace par sa
// traduction (window.COOK_NOTE_EN, scripts/translate-en.js). Les nombres sont
// repris : « 8 ingrédients » est cherche comme « {#} ingrédients » puis
// rendu « 8 ingredients ». Les donnees et l'etat React restent en francais :
// seul l'affichage change, React le reecrit librement et on retraduit.
// Rien ne tourne en francais.
(function englishDisplay() {
  if (COOK_NOTE_LANG !== 'en' || !window.COOK_NOTE_EN || typeof MutationObserver !== 'function') return;
  const dictionary = window.COOK_NOTE_EN;
  const ATTRIBUTES = ['placeholder', 'aria-label', 'title', 'alt'];
  const SKIP = 'script,style,textarea,code,pre,[translate="no"],[contenteditable="true"]';
  const NUMBER = /\d+(?:[.,]\d+)?/g;
  const cache = new Map();
  // Textes deja anglais (sortie d'une traduction) : jamais retraduits.
  const produced = new Set();

  // Gabarits « Ajouter {#} aux favoris » : chaque {#} attrape un nombre ou un
  // nom (traduit a son tour). Index par mot fixe (4 lettres et plus) pour ne
  // tester que les quelques gabarits possibles.
  const fill = (template, values) => template.replace(/\{(\d+)\}/g, (whole, index) => values[index - 1] ?? whole);
  const templateIndex = new Map();
  (window.COOK_NOTE_EN_TEMPLATES || []).forEach(([french, english]) => {
    const words = french.replace(/\{#\}/g, ' ').toLowerCase().match(/[a-zà-ÿœ’']{4,}/g);
    if (!words) return;
    const pattern = new RegExp(`^${french.split('{#}').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('(.+?)')}$`);
    const entry = { pattern, english, size: french.replace(/\{#\}/g, '').length };
    const anchor = words.sort((a, b) => b.length - a.length)[0];
    if (!templateIndex.has(anchor)) templateIndex.set(anchor, []);
    templateIndex.get(anchor).push(entry);
  });
  templateIndex.forEach(list => list.sort((a, b) => b.size - a.size));

  const lookup = text => dictionary[cookNoteTextHash(text)] || null;
  const exact = clean => {
    const direct = lookup(clean);
    if (direct) return direct;
    // Point final ajoute par le code (« Autour de : Riz au citron. »).
    if (/[^.]\.$/.test(clean)) {
      const bare = lookup(clean.slice(0, -1));
      if (bare) return `${bare.replace(/\.$/, '')}.`;
    }
    // « carré » ecrit en minuscules par le code : on cherche « Carré ».
    const first = clean.charAt(0);
    if (first !== first.toUpperCase()) {
      const capital = lookup(first.toUpperCase() + clean.slice(1));
      if (capital) return capital.charAt(0).toLowerCase() + capital.slice(1);
    }
    if (!/\d/.test(clean)) return null;
    const numbers = [];
    const key = clean.replace(NUMBER, value => { numbers.push(value); return '{#}'; });
    // « 120 g » affiche, « 120g » ecrit dans le code.
    const template = lookup(key) || lookup(key.replace(/\{#\}\s+(?=(?:g|kg|mg|ml|cl|dl|l|min|h|s|°C)\b)/g, '{#}'));
    return template ? fill(template, numbers) : null;
  };
  const byTemplate = (clean, depth) => {
    // Tous les gabarits possibles, le plus precis (le plus de texte fixe) d'abord.
    const candidates = [];
    for (const word of new Set(clean.toLowerCase().match(/[a-zà-ÿœ’']{4,}/g) || [])) candidates.push(...(templateIndex.get(word) || []));
    candidates.sort((a, b) => b.size - a.size);
    for (const entry of candidates) {
      const match = entry.pattern.exec(clean);
      // Chaque morceau attrape est traduit a son tour (espaces autour gardes).
      if (match) return fill(entry.english, match.slice(1).map(value => {
        if (!/[a-zà-ÿ]{2}/i.test(value)) return value;
        const english = englishOf(value.trim(), depth + 1);
        return english ? value.replace(value.trim(), english) : value;
      }));
    }
    return null;
  };
  // Morceaux assembles par le code : « Plats · 1 h 05 · Difficulté 4/10 »,
  // « Amaretto, Vins, alcools & boissons » (coupe au meilleur endroit).
  const SEPARATOR = /( · | \/ |, | : | — | \(|\) ?|(?<=[.!?]) )/;
  const bySegments = (clean, depth) => {
    const parts = clean.split(SEPARATOR);
    if (parts.length < 3) return null;
    const glue = part => (part === ' : ' ? ': ' : part);
    // Deux moities entierement traduites, si possible.
    for (let cut = 1; cut < parts.length; cut += 2) {
      const left = parts.slice(0, cut).join('').trim();
      const right = parts.slice(cut + 1).join('').trim();
      const leftEnglish = !left || !/[a-zà-ÿ]/i.test(left) ? left : englishOf(left, depth + 1);
      const rightEnglish = !right || !/[a-zà-ÿ]/i.test(right) ? right : englishOf(right, depth + 1);
      if (leftEnglish !== null && rightEnglish !== null && (leftEnglish !== left || rightEnglish !== right)) return `${leftEnglish}${glue(parts[cut])}${rightEnglish}`;
    }
    let changed = false;
    const english = parts.map((part, index) => {
      if (index % 2) return glue(part);
      const translated = englishOf(part.trim(), depth + 1);
      if (translated) changed = true;
      return translated || part;
    }).join('');
    return changed ? english : null;
  };
  const memo = new Map();
  function englishOf(clean, depth = 0) {
    if (!clean || depth > 6 || !/[a-zà-ÿ]/i.test(clean)) return null;
    if (memo.has(clean)) return memo.get(clean);
    const english = exact(clean) || byTemplate(clean, depth) || bySegments(clean, depth);
    memo.set(clean, english);
    return english;
  }

  // Pour le robot du site anglais (scripts/audit-english.js) et le debogage.
  window.cookNoteEnglishOf = englishOf;

  const translate = text => {
    if (!text || produced.has(text)) return null;
    if (cache.has(text)) return cache.get(text);
    const clean = text.trim();
    const english = englishOf(clean);
    const result = english ? text.replace(clean, english) : null;
    cache.set(text, result);
    if (result) produced.add(result);
    return result;
  };

  const skipped = element => !element || Boolean(element.closest(SKIP));
  const fixText = node => {
    if (skipped(node.parentElement)) return;
    const english = translate(node.nodeValue);
    if (english !== null && english !== node.nodeValue) node.nodeValue = english;
  };
  const fixAttributes = element => {
    for (const name of ATTRIBUTES) {
      const value = element.getAttribute(name);
      if (!value) continue;
      const english = translate(value);
      if (english !== null && english !== value) element.setAttribute(name, english);
    }
  };
  const fixTree = root => {
    if (root.nodeType === 3) {
      fixText(root);
      return;
    }
    if (root.nodeType !== 1 || skipped(root)) return;
    fixAttributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === 3) fixText(node);
      else if (node.closest(SKIP)) {
        // Sous-arbre exclu : on saute ses descendants.
        let next = walker.nextSibling();
        while (!next && walker.parentNode()) next = walker.nextSibling();
        node = next;
        continue;
      } else fixAttributes(node);
      node = walker.nextNode();
    }
  };

  const start = () => {
    fixTree(document.body);
    const title = translate(document.title);
    if (title) document.title = title;
    new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'characterData') fixText(record.target);
        else if (record.type === 'attributes') fixAttributes(record.target);
        else record.addedNodes.forEach(fixTree);
      }
    }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRIBUTES });
  };
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();

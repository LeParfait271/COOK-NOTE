document.addEventListener('DOMContentLoaded', () => {
  function sanitizeNoteHtml(value) {
    const template = document.createElement('template');
    template.innerHTML = String(value || '');
    const allowedTags = new Set(['SPAN', 'STRONG', 'EM', 'B', 'I', 'BR']);
    const clean = node => {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) return;
        if (child.nodeType !== Node.ELEMENT_NODE || !allowedTags.has(child.tagName)) {
          child.replaceWith(document.createTextNode(child.textContent || ''));
          return;
        }
        Array.from(child.attributes).forEach(attribute => {
          if (!(child.tagName === 'SPAN' && attribute.name === 'data-goto')) {
            child.removeAttribute(attribute.name);
          }
        });
        clean(child);
      });
    };
    clean(template.content);
    return template.innerHTML;
  }

  const cp1252Bytes = {
    0x20AC: 0x80,
    0x201A: 0x82,
    0x0192: 0x83,
    0x201E: 0x84,
    0x2026: 0x85,
    0x2020: 0x86,
    0x2021: 0x87,
    0x02C6: 0x88,
    0x2030: 0x89,
    0x0160: 0x8A,
    0x2039: 0x8B,
    0x0152: 0x8C,
    0x017D: 0x8E,
    0x2018: 0x91,
    0x2019: 0x92,
    0x201C: 0x93,
    0x201D: 0x94,
    0x2022: 0x95,
    0x2013: 0x96,
    0x2014: 0x97,
    0x02DC: 0x98,
    0x2122: 0x99,
    0x0161: 0x9A,
    0x203A: 0x9B,
    0x0153: 0x9C,
    0x017E: 0x9E,
    0x0178: 0x9F
  };

  function mojibakeScore(value) {
    const text = String(value || '');
    return (text.match(/[ÃÂÅ�]/g) || []).length + (text.match(/â[\u20ac\u2122\u0153\u20ac\u201c\u201d\u00a0-\u00bf]/g) || []).length;
  }

  function repairText(value) {
    const text = String(value || '');
    if (!/[ÃÂâÅ]/.test(text) || typeof TextDecoder === 'undefined') return text;
    try {
      const bytes = Uint8Array.from(Array.from(text, char => {
        const code = char.codePointAt(0);
        return cp1252Bytes[code] ?? (code <= 255 ? code : 63);
      }));
      const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
      return mojibakeScore(decoded) < mojibakeScore(text) ? decoded : text;
    } catch {
      return text;
    }
  }

  function normalizeValue(value) {
    if (typeof value === 'string') return repairText(value);
    if (Array.isArray(value)) return value.map(normalizeValue);
    if (!value || typeof value !== 'object') return value;
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeValue(item)]));
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const recipe = id && window.RECIPES ? normalizeValue(window.RECIPES[id]) : null;

  const title = document.getElementById('title');
  const ingredients = document.getElementById('ingredients');
  const steps = document.getElementById('steps');
  const notes = document.getElementById('notes');

  if (!title || !ingredients || !steps || !notes) return;

  if (!recipe) {
    title.textContent = 'Recette introuvable';
    ingredients.textContent = 'Retournez à la liste des recettes.';
    return;
  }

  document.title = recipe.title;
  title.textContent = recipe.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', `${recipe.title} sur Cook Note : ingrédients, étapes et astuces.`);
  const jsonLd = document.createElement('script');
  jsonLd.type = 'application/ld+json';
  jsonLd.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    image: recipe.image ? new URL(recipe.image, window.location.origin).href : undefined,
    recipeYield: recipe.yield || undefined,
    recipeCategory: (recipe.categories || []).join(', ') || undefined,
    recipeIngredient: (recipe.ingredients || []).flatMap(group => group.items || []),
    recipeInstructions: (recipe.steps || []).map(step => ({ '@type': 'HowToStep', text: step }))
  });
  document.head.appendChild(jsonLd);

  ingredients.replaceChildren(
    ...(recipe.ingredients || []).map(group => {
      const section = document.createElement('section');
      section.className = 'recipe-panel';

      const heading = document.createElement('h3');
      heading.textContent = group.group || 'Base';
      section.appendChild(heading);

      const list = document.createElement('ul');
      (group.items || []).forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
      section.appendChild(list);

      return section;
    })
  );

  steps.replaceChildren(
    ...(recipe.steps || []).map(step => {
      const li = document.createElement('li');
      li.textContent = step;
      return li;
    })
  );

  notes.replaceChildren(
    ...(recipe.notes || []).map(note => {
      const li = document.createElement('li');
      li.innerHTML = sanitizeNoteHtml(note);
      return li;
    })
  );

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-goto]');
    if (!target) return;
    event.preventDefault();
    window.location.href = `index.html#recipe=${encodeURIComponent(target.dataset.goto)}`;
  });
});

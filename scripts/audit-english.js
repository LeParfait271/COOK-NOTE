#!/usr/bin/env node
// Robot du site anglais : parcourt les ecrans principaux en anglais (bureau et
// telephone) et liste chaque texte encore en francais (texte affiche et
// attributs placeholder / aria-label / title / alt), avec l'ecran ou il
// apparait. Serveur local requis (node server.js, port 8080).
// Usage : node scripts/audit-english.js [--json fichier]
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd()] }));

const BASE = process.env.COOK_NOTE_URL || 'http://localhost:8080';
// Francais : un mot outil francais, ou des accents sans aucun mot anglais
// courant (« purée », « béarnaise » restent permis dans une phrase anglaise).
const FRENCH_WORD = /(^|[^a-zà-ÿ])(le|la|les|des|du|une|et|avec|sans|dans|aux|au|votre|vos|cette|ces|est|sont|pas|fiche|fiches|recette|recettes|étape|étapes|personnes?|ingrédients?|jours?|heures?|semaine|ajouter|retirer|voir|fermer|chercher|rechercher|partager|copier|imprimer|réussi|raté|cuisiné|actif|cuisson|repos|catégories?|saisons?|variantes?|plats|entrées|apéro|boissons|petit-déjeuner|accompagnements|toutes|déjà|maison|ouvrir|choisir|télécharger|lancer|minuteur|glisse|commencer|avant|servir|cocher|marquer|alcools|matières|grasses|laitages|œufs|féculents|céréales|épices|fromages|douceurs|légumes)(?=$|[^a-zà-ÿ])/i;
const ENGLISH_WORD = /\b(the|and|of|to|with|for|your|in|on|a|an|is|are|from|or|by|into)\b/i;
const FRENCH = { test: text => FRENCH_WORD.test(text) || (/[àâçèêëîïôûùüÿœ]/i.test(text) && !ENGLISH_WORD.test(text) && text.trim().split(/\s+/).length >= 3) };
// Mots identiques dans les deux langues, noms propres et plats gardes en VO.
const ALLOWED = /^(https?:.*|localhost.*|.*localhost:8080.*|Cook Note|Nutri-Score [A-E]|MaruChiwa|Android 5\.0\+|v\d+\.\d+.*|Commis.*|Chef de partie.*|Sous-chef.*|Français|Version originale|Passer le site en français|[A-Z]{1,3}|\d.*)$/;

async function texts(page) {
  return page.evaluate(() => {
    const out = [];
    const visible = element => {
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const value = node.nodeValue.replace(/\s+/g, ' ').trim();
      const parent = node.parentElement;
      // Texte identique dans les deux langues (« Desserts », « Sauces ») : ignore.
      const same = window.COOK_NOTE_EN && window.COOK_NOTE_EN[cookNoteTextHash(value)] === value;
      if (value && !same && parent && !parent.closest('script,style,[translate="no"],textarea') && visible(parent)) out.push(value);
      node = walker.nextNode();
    }
    document.querySelectorAll('[placeholder],[aria-label],[title],img[alt]').forEach(element => {
      if (element.closest('[translate="no"]')) return;
      ['placeholder', 'aria-label', 'title', 'alt'].forEach(name => {
        const value = element.getAttribute(name);
        if (value) out.push(value.trim());
      });
    });
    return out;
  });
}

// Une fiche sur 17 du catalogue (environ 20), collections comprises.
const CATALOG_SAMPLE = (() => {
  const context = { window: {} };
  require('node:vm').runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'recipes.js'), 'utf8'), context);
  return Object.keys(context.window.RECIPES).filter((id, index) => index % 17 === 3);
})();

async function main() {
  const browser = await chromium.launch({ args: ['--mute-audio'] });
  const found = new Map();
  const errors = [];
  const record = (screen, list) => list.forEach(text => {
    if (!FRENCH.test(text) || ALLOWED.test(text)) return;
    if (!found.has(text)) found.set(text, new Set());
    found.get(text).add(screen);
  });
  for (const [device, options] of [['bureau', { viewport: { width: 1280, height: 900 } }], ['tel', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]]) {
    const context = await browser.newContext(options);
    await context.addInitScript(() => {
      localStorage.setItem('cook_note_lang', 'en');
      localStorage.setItem('cook_note_shopping_basket', JSON.stringify(['beurre_blanc', 'chipirons_a_la_plancha']));
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`${device} : ${error.message}`));
    const visit = async (screen, action) => {
      try {
        await action();
        await page.waitForTimeout(700);
        record(`${device} · ${screen}`, await texts(page));
      } catch (error) {
        errors.push(`${device} · ${screen} : ${error.message.split('\n')[0]}`);
      }
    };
    const home = async () => { await page.goto(`${BASE}/`); await page.waitForSelector('.card-title'); };
    const escape = async () => { await page.keyboard.press('Escape'); await page.waitForTimeout(300); };
    await visit('accueil', home);
    await visit('recherche', async () => { await page.locator('.home-search, [aria-label*="earch"]').first().click(); await page.waitForTimeout(400); await page.keyboard.type('poulet'); await page.waitForTimeout(1200); });
    await escape();
    await visit('liste de courses', async () => { await home(); await page.locator('.home-quick-actions button').nth(2).click(); await page.waitForSelector('.shopping-modal'); });
    await escape();
    await visit('menu', async () => { await page.locator('.home-quick-actions button').nth(0).click(); await page.waitForSelector('.modal-panel'); });
    await escape();
    await visit('saisons', async () => { await page.click('.home-seasons-action'); await page.waitForSelector('.season-card'); });
    await escape();
    await visit('parcours de chef', async () => { await page.locator('.home-quick-actions button').last().click(); await page.waitForSelector('.chef-modal'); });
    await visit('parcours de chef · techniques', async () => { await page.locator('.chef-tabs button').nth(1).click(); });
    await escape();
    await visit('constellation', async () => { await page.click('.home-constellation-action'); await page.waitForSelector('.constellation-sky', { timeout: 60000 }); await page.waitForTimeout(800); await page.mouse.click(options.viewport.width / 2, options.viewport.height / 2); });
    await escape();
    await visit('techniques', async () => { await page.goto(`${BASE}/techniques/`); await page.waitForTimeout(1500); });
    // Trois fiches temoins, puis un echantillon regulier du catalogue (bureau).
    const sample = device === 'bureau' ? CATALOG_SAMPLE : [];
    for (const id of ['chipirons_a_la_plancha', 'beurre_blanc', 'sauces_maitre', ...sample]) {
      await visit(`fiche ${id}`, async () => { await page.goto(`${BASE}/recette/${id}/`); await page.waitForSelector('.recipe-detail-hero, .detail-meta', { timeout: 20000 }); });
    }
    await visit('fiche · notes', async () => { await page.goto(`${BASE}/recette/chipirons_a_la_plancha/`); await page.waitForSelector('.detail-meta'); for (const tab of await page.locator('.notes-family-tabs button, [role="tab"]').all()) { await tab.click().catch(() => {}); await page.waitForTimeout(150); } });
    await visit('fiche · plus', async () => { await page.click('.detail-utility-menu summary'); });
    await visit('partage', async () => { await page.locator('.detail-utility-item').filter({ hasText: /Share|Partager/ }).first().click(); await page.waitForSelector('.share-modal'); });
    await escape();
    await visit('mains libres', async () => { await page.click('.cook-mode-action'); await page.waitForTimeout(800); });
    await visit('mains libres · etapes', async () => { for (let i = 0; i < 4; i += 1) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(200); } });
    await visit('mains libres · fin', async () => { for (let i = 0; i < 12; i += 1) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(120); } });
    await context.close();
  }
  await browser.close();
  const list = [...found].sort((a, b) => a[0].localeCompare(b[0], 'fr'));
  list.forEach(([text, screens]) => console.log(`${text}\n    ← ${[...screens].slice(0, 3).join(', ')}`));
  console.log(`\n${list.length} textes encore en francais.`);
  if (errors.length) console.log(`Erreurs :\n${errors.join('\n')}`);
  const jsonIndex = process.argv.indexOf('--json');
  if (jsonIndex >= 0) fs.writeFileSync(process.argv[jsonIndex + 1], JSON.stringify(list.map(([text, screens]) => ({ text, screens: [...screens] })), null, 1));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});

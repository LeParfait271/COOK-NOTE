// `npm run captures` : captures ordinateur et telephone, jour et nuit, de
// l'accueil, d'une fiche et de chaque fenetre, dans tmp/captures/ (vide au
// prochain `npm run check`). Sert a verifier l'affichage d'un coup d'oeil.
// Le serveur local doit tourner (npm run serveur). Sons coupes, sans fenetre.
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const BASE = process.env.COOK_NOTE_URL || 'http://localhost:8080';
const OUT = path.join(ROOT, 'tmp', 'captures');
const RECIPE = process.argv[2] || 'hachis_parmentier';
const PANELS = [
  ['menu', '.home-quick-actions button:has-text("Composer un menu")', '.menu-planner-modal'],
  ['semaine', '.home-week-action', '.week-modal'],
  ['frigo', '.home-fridge-action', '.fridge-modal'],
  ['courses', '.home-shopping-action', '.shopping-modal'],
  ['saisons', '.home-seasons-action', '.season-card'],
  ['vins', '.home-wine-action', '.wine-modal'],
  ['profil', '.home-profile-action', '.modal-panel'],
  ['constellation', '.home-constellation-action', '.constellation-sky']
];

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ args: ['--mute-audio'] });
  let count = 0;
  for (const [device, viewport] of [['ordi', { width: 1440, height: 900 }], ['tel', { width: 390, height: 844 }]]) {
    for (const theme of ['dark', 'light']) {
      const context = await browser.newContext({ viewport, colorScheme: theme, deviceScaleFactor: 1 });
      const page = await context.newPage();
      const shot = async name => { await page.screenshot({ path: path.join(OUT, `${device}-${theme}-${name}.png`) }); count += 1; };
      // Theme force via les preferences (cle cook_note_preferences, theme.js).
      await page.addInitScript(value => { try { localStorage.setItem('cook_note_preferences', JSON.stringify({ ...JSON.parse(localStorage.getItem('cook_note_preferences') || '{}'), theme: value })); } catch {} }, theme);
      await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
      await shot('accueil');
      for (const [name, trigger, ready] of PANELS) {
        try {
          await page.click(trigger, { timeout: 5000 });
          await page.waitForSelector(ready, { timeout: 15000 });
          await page.waitForTimeout(500);
          await shot(name);
          await page.keyboard.press('Escape');
          await page.waitForTimeout(300);
        } catch (error) {
          console.log(`${device} ${theme} ${name} : ${error.message.split('\n')[0]}`);
          await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
        }
      }
      await page.goto(`${BASE}/recette/${RECIPE}`, { waitUntil: 'networkidle' });
      await shot(`fiche-${RECIPE}`);
      await context.close();
    }
  }
  await browser.close();
  console.log(`${count} captures dans tmp/captures/`);
})().catch(error => { console.error(error); process.exit(1); });

#!/usr/bin/env node
// Audit d'accessibilite des ecrans principaux, jour et nuit (serveur local
// requis) : contraste de chaque texte visible (WCAG AA : 4,5:1, 3:1 pour les
// grands textes) et nom accessible de chaque bouton ou lien.
// Usage : node scripts/audit-accessibility.js
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd()] }));

const BASE = process.env.COOK_NOTE_URL || 'http://localhost:8080';

async function scan(page) {
  return page.evaluate(() => {
    const parse = value => {
      // oklch(L C H [/ a]) -> sRGB (formules OKLab).
      const ok = String(value).match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\)/);
      if (ok) {
        let L = Number(ok[1]); if (L > 1) L /= 100;
        const C = Number(ok[2]); const H = Number(ok[3]) * Math.PI / 180;
        const a = C * Math.cos(H); const b = C * Math.sin(H);
        const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3; const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3; const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
        const lin = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
        const [r, g, bb] = lin.map(v => Math.max(0, Math.min(1, v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055))) .map(v => v * 255);
        const alpha = ok[4] ? (ok[4].endsWith('%') ? Number(ok[4].slice(0, -1)) / 100 : Number(ok[4])) : 1;
        return { r, g, b: bb, a: alpha };
      }
      const match = String(value).match(/rgba?\(([^)]+)\)|color\(srgb ([^)]+)\)/);
      if (!match) return null;
      const parts = (match[1] || match[2]).split(/[\s,/]+/).filter(Boolean).map(Number);
      const scale = match[2] ? 255 : 1;
      return { r: parts[0] * scale, g: parts[1] * scale, b: parts[2] * scale, a: parts[3] ?? 1 };
    };
    const luminance = ({ r, g, b }) => {
      const channel = value => {
        const v = value / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };
    // Fond reel : on remonte les ancetres en melangeant les fonds transparents.
    const backgroundOf = element => {
      const layers = [];
      for (let node = element; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        // Degrade : sa premiere couleur sert de fond ; image : on ne sait pas mesurer.
        let color = parse(style.backgroundColor);
        if (style.backgroundImage && style.backgroundImage !== 'none') {
          if (!/gradient/.test(style.backgroundImage)) return null;
          // Degrade decoratif (trait anime, soulignement) : taille partielle, on l'ignore.
          if (/(^|\s)0(%|px)?(\s|,|$)|\d+px/.test(style.backgroundSize) && !/^(auto|cover|100% 100%)$/.test(style.backgroundSize)) { if (!color || color.a === 0) continue; }
          const stop = parse(style.backgroundImage);
          if (stop && (!color || color.a === 0)) color = stop;
        }
        if (color && color.a > 0) {
          layers.push(color);
          if (color.a >= 1) break;
        }
      }
      let result = { r: 0, g: 0, b: 0 };
      const theme = document.documentElement.dataset.theme === 'light';
      if (!layers.length || layers[layers.length - 1].a < 1) result = theme ? { r: 251, g: 246, b: 236 } : { r: 12, g: 10, b: 8 };
      for (const layer of layers.reverse()) {
        result = { r: layer.r * layer.a + result.r * (1 - layer.a), g: layer.g * layer.a + result.g * (1 - layer.a), b: layer.b * layer.a + result.b * (1 - layer.a) };
      }
      return result;
    };
    const issues = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.nodeValue.trim();
      const element = node.parentElement;
      if (!text || !element || seen.has(element) || element.closest('script,style,svg,canvas,[aria-hidden="true"]')) continue;
      // Textes poses sur une photo (cartes, bandeau) : lisibilite assuree par leur voile, non mesurable ici.
      if (element.closest('.recipe-card, .variant-card, .recipe-detail-hero, .home-view > .hero, .share-ticket, .sr-only, .skip-link')) continue;
      // Texte peint autrement que par sa couleur (degrade, remplissage) : non mesurable.
      const paint = getComputedStyle(element);
      if (/text/.test(paint.backgroundClip || paint.webkitBackgroundClip || '') || (paint.webkitTextFillColor && paint.webkitTextFillColor !== paint.color)) continue;
      // Panneau ouvert : seul son contenu compte.
      const modal = document.querySelector('.modal-panel, .constellation');
      if (modal && !modal.contains(element)) continue;
      seen.add(element);
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (style.visibility === 'hidden' || style.display === 'none' || rect.width === 0 || rect.height === 0 || Number(style.opacity) < 0.5) continue;
      const color = parse(style.color);
      const background = backgroundOf(element);
      if (!color || !background) continue;
      const foreground = { r: color.r * color.a + background.r * (1 - color.a), g: color.g * color.a + background.g * (1 - color.a), b: color.b * color.a + background.b * (1 - color.a) };
      const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
      const ratio = (light + 0.05) / (dark + 0.05);
      const size = parseFloat(style.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
      const disabled = element.closest('[disabled],[aria-disabled="true"]');
      if (!disabled && ratio < (large ? 3 : 4.5)) issues.push(`contraste ${ratio.toFixed(2)} : « ${text.slice(0, 50)} » (${element.className || element.tagName.toLowerCase()})`);
    }
    document.querySelectorAll('button, a[href], [role="button"]').forEach(element => {
      const rect = element.getBoundingClientRect();
      if (!rect.width || element.closest('[aria-hidden="true"]')) return;
      const name = (element.getAttribute('aria-label') || element.textContent || element.getAttribute('title') || '').trim();
      if (!name) issues.push(`sans nom : ${element.outerHTML.slice(0, 90)}`);
    });
    return issues;
  });
}

async function main() {
  const browser = await chromium.launch({ args: ['--mute-audio'] });
  const report = new Map();
  for (const theme of ['dark', 'light']) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await context.addInitScript(value => {
      localStorage.setItem('cook_note_preferences', JSON.stringify({ theme: value }));
      localStorage.setItem('cook_note_theme', value);
      localStorage.setItem('cook_note_shopping_basket', JSON.stringify(['beurre_blanc']));
    }, theme);
    const page = await context.newPage();
    const visit = async (screen, action) => {
      try {
        await action();
        await page.waitForTimeout(700);
        (await scan(page)).forEach(issue => {
          const key = `${theme} · ${screen}`;
          if (!report.has(key)) report.set(key, new Set());
          report.get(key).add(issue);
        });
      } catch (error) {
        console.log(`${theme} · ${screen} : ${error.message.split('\n')[0]}`);
      }
    };
    const home = async () => { await page.goto(`${BASE}/`); await page.waitForSelector('.card-title'); };
    const escape = () => page.keyboard.press('Escape');
    await visit('accueil', home);
    await visit('fiche', async () => { await page.goto(`${BASE}/recette/beurre_blanc/`); await page.waitForSelector('.detail-meta'); });
    await visit('saisons', async () => { await home(); await page.click('.home-seasons-action'); await page.waitForSelector('.season-card'); });
    await escape();
    await visit('semaine', async () => { await page.click('.home-week-action'); await page.waitForSelector('.week-modal'); });
    await escape();
    await visit('frigo', async () => { await page.click('.home-fridge-action'); await page.waitForSelector('.fridge-modal'); });
    await escape();
    await visit('courses', async () => { await page.click('.home-shopping-action'); await page.waitForSelector('.shopping-modal'); });
    await escape();
    await visit('accords mets-vins', async () => { await page.click('.home-wine-action'); await page.waitForSelector('.wine-modal'); });
    await escape();
    await visit('parcours de chef', async () => { await page.locator('.home-quick-actions button:not(.home-profile-action)').last().click(); await page.waitForSelector('.chef-modal'); });
    await context.close();
  }
  await browser.close();
  let total = 0;
  report.forEach((issues, screen) => {
    total += issues.size;
    console.log(`## ${screen} (${issues.size})`);
    [...issues].slice(0, 12).forEach(issue => console.log(`  ${issue}`));
  });
  console.log(`\n${total} probleme(s) d'accessibilite.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});

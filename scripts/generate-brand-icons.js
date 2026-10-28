#!/usr/bin/env node
'use strict';

// Icones de Cook Note derivees de assets/brand/mark.svg (seule source) :
// favicon PNG, icones d'application 192/512, icone « maskable » (fond plein,
// embleme dans la zone sure de 80 %), icone Apple 180 et AVIF. Rendu par
// Chromium (Playwright) pour un trace net a chaque taille.
// Usage : node scripts/generate-brand-icons.js [--preview fichier.png]

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const BRAND = path.join(ROOT, 'assets', 'brand');
const svg = fs.readFileSync(path.join(BRAND, 'mark.svg'), 'utf8');
const previewIndex = process.argv.indexOf('--preview');
const preview = previewIndex > 0 ? process.argv[previewIndex + 1] : '';

// Version « maskable » : le fond remplit tout le carre (le systeme decoupe sa
// propre forme) et l'embleme est ramene dans la zone sure.
const maskable = svg
  .replace(/<rect x="4" y="4" width="120" height="120" rx="28"/, '<rect x="0" y="0" width="128" height="128"')
  .replace(/<rect x="11"[^>]*\/>/, '')
  .replace('<g fill="none"', '<g transform="translate(64 64) scale(.78) translate(-64 -64.4)" fill="none"');

const OUTPUTS = [
  { file: 'mark-64.png', size: 64, source: svg },
  { file: 'icon-192.png', size: 192, source: svg },
  { file: 'icon-512.png', size: 512, source: svg },
  { file: 'icon-maskable-512.png', size: 512, source: maskable },
  { file: 'app-icon.png', size: 180, source: svg }
];

function findMagick() {
  const local = path.join(ROOT, '.tools', 'imagemagick', process.platform === 'win32' ? 'magick.exe' : 'magick');
  for (const candidate of [local, process.platform === 'win32' ? 'magick.exe' : 'magick']) {
    try {
      execFileSync(candidate, ['-version'], { stdio: 'ignore' });
      return candidate;
    } catch (_) { /* suivant */ }
  }
  return '';
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const render = async (source, size, target) => {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0;background:transparent">${source.replace('width="128" height="128"', `width="${size}" height="${size}"`)}</body></html>`);
    await page.locator('svg').screenshot({ path: target, omitBackground: true });
  };
  for (const output of OUTPUTS) await render(output.source, output.size, path.join(BRAND, output.file));
  if (preview) {
    // Planche de controle : les tailles reelles cote a cote, fond clair et sombre.
    const sizes = [16, 32, 48, 64, 128, 192];
    const cell = source => sizes.map(size => source.replace('width="128" height="128"', `width="${size}" height="${size}"`)).join('');
    await page.setViewportSize({ width: 760, height: 520 });
    await page.setContent(`<html><body style="margin:0;font:12px system-ui">
      <div style="display:flex;gap:18px;align-items:end;padding:24px;background:#f3ede4">${cell(svg)}</div>
      <div style="display:flex;gap:18px;align-items:end;padding:24px;background:#111">${cell(svg)}</div>
      <div style="display:flex;gap:18px;align-items:end;padding:24px;background:#222">${cell(maskable.replace('<rect x="0" y="0" width="128" height="128"', '<rect x="0" y="0" width="128" height="128" rx="64"'))}</div>
    </body></html>`);
    await page.screenshot({ path: preview });
  }
  await browser.close();

  const magick = findMagick();
  if (magick) {
    for (const file of ['mark-64.png', 'app-icon.png']) {
      execFileSync(magick, [path.join(BRAND, file), '-quality', '60', path.join(BRAND, file.replace(/\.png$/, '.avif'))], { stdio: 'ignore' });
    }
  } else {
    console.warn('ImageMagick absent : AVIF non regeneres.');
  }
  console.log(`Icones regenerees : ${OUTPUTS.map(output => output.file).join(', ')}`);
})();

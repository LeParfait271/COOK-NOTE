#!/usr/bin/env node
// Traductions anglaises : chaque texte affiche doit avoir sa traduction
// (memoire DeepL ou correction manuelle). Tant que le premier passage n'est
// pas termine (quota DeepL mensuel), les manques sont signales sans bloquer ;
// translations/en/state.json « strict: true » les rend bloquants.
const fs = require('node:fs');
const path = require('node:path');
const { collectEnglishSources, textHash } = require('./lib/translation-sources');

const ROOT = path.resolve(__dirname, '..');
const read = (file, fallback) => {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8')); } catch { return fallback; }
};
const memory = read('translations/en/memory.json', {});
const overrides = read('translations/en/overrides.json', {});
const state = read('translations/en/state.json', {});
const overridden = new Set(Object.keys(overrides).map(textHash));
const sources = collectEnglishSources(ROOT);
const missing = sources.filter(item => !memory[item.hash]?.en && !overridden.has(item.hash));
const byOrigin = {};
missing.forEach(item => { byOrigin[item.origin] = (byOrigin[item.origin] || 0) + 1; });
const detail = Object.entries(byOrigin).map(([origin, count]) => `${origin} ${count}`).join(', ');
if (!missing.length) {
  console.log(`Validation traductions anglaises OK (${sources.length} textes).`);
} else if (state.strict) {
  console.error(`Traductions anglaises manquantes : ${missing.length} (${detail}). Lancer : node scripts/translate-en.js`);
  process.exit(1);
} else {
  console.log(`Traductions anglaises : ${sources.length - missing.length} / ${sources.length} faites, ${missing.length} a faire (${detail}). Lancer : node scripts/translate-en.js`);
}

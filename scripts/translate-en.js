#!/usr/bin/env node
// Traduction anglaise automatique (DeepL API) du contenu Cook Note.
//
// Le francais reste la seule source. Chaque texte affiche (titres, ingredients,
// etapes, notes, infos pratiques...) est repere par une empreinte de son texte
// francais ; translations/en/memory.json garde { empreinte: { fr, en } }.
// Seuls les textes nouveaux ou modifies partent chez DeepL : une recette
// ajoutee ou corrigee est traduite au prochain passage, rien d'autre ne bouge.
//
// translations/en/overrides.json : corrections a la main { "texte fr": "en" },
// jamais ecrasees. translations/en/glossary.tsv : vocabulaire de cuisine
// impose a DeepL (un « fr<TAB>en » par ligne).
//
// Sortie : assets/i18n/en-content.js (window.COOK_NOTE_EN = { empreinte: en }),
// charge par le site seulement en anglais.
//
// Usage : node scripts/translate-en.js [--dry] [--max-chars 200000]
// Cle : variable d'environnement DEEPL_API_KEY (jamais dans le depot).
const fs = require('node:fs');
const path = require('node:path');
const { collectEnglishSources, textHash } = require('./lib/translation-sources');

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'translations', 'en');
const MEMORY = path.join(DIR, 'memory.json');
const OVERRIDES = path.join(DIR, 'overrides.json');
const GLOSSARY = path.join(DIR, 'glossary.tsv');
const STATE = path.join(DIR, 'state.json');
const OUTPUT = path.join(ROOT, 'assets', 'i18n', 'en-content.js');
const BATCH = 40;
const QUOTA_MARGIN = 5000;

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const maxIndex = args.indexOf('--max-chars');
const maxChars = maxIndex >= 0 ? Number(args[maxIndex + 1]) || 0 : Infinity;

const readJson = (file, fallback) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
};
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 1)}\n`);
};

// Cle DeepL : fichier local translations/en/deepl-key.txt (ignore par git,
// jamais pousse), sinon variable d'environnement DEEPL_API_KEY.
const KEY_FILE = path.join(DIR, 'deepl-key.txt');
function apiKey() {
  let key = '';
  try { key = fs.readFileSync(KEY_FILE, 'utf8').replace(/^\uFEFF/, '').trim(); } catch { /* pas de fichier */ }
  if (/COLLE/i.test(key)) key = '';
  key = key || process.env.DEEPL_API_KEY || '';
  // Windows : variable utilisateur posee apres l'ouverture du terminal.
  if (!key && process.platform === 'win32') {
    try {
      key = require('node:child_process')
        .execFileSync('powershell.exe', ['-NoProfile', '-Command', "[Environment]::GetEnvironmentVariable('DEEPL_API_KEY','User')"], { encoding: 'utf8' })
        .trim();
    } catch { /* pas de cle */ }
  }
  return key;
}

function endpoint(key) {
  return key.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com';
}

async function deepl(key, route, body, method = 'POST') {
  const response = await fetch(`${endpoint(key)}${route}`, {
    method,
    headers: { Authorization: `DeepL-Auth-Key ${key}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!response.ok) throw new Error(`DeepL ${route} : ${response.status} ${await response.text()}`);
  return response.status === 204 ? null : response.json();
}

// Glossaire : recree seulement quand glossary.tsv change.
async function ensureGlossary(key, state) {
  if (!fs.existsSync(GLOSSARY)) return '';
  const entries = fs.readFileSync(GLOSSARY, 'utf8').replace(/^﻿/, '').split(/\r?\n/).map(line => line.trim()).filter(line => line.includes('\t') && !line.startsWith('#')).join('\n');
  if (!entries) return '';
  const hash = textHash(entries);
  if (state.glossaryId && state.glossaryHash === hash) return state.glossaryId;
  if (state.glossaryId) await deepl(key, `/v2/glossaries/${state.glossaryId}`, null, 'DELETE').catch(() => {});
  const created = await deepl(key, '/v2/glossaries', { name: 'Cook Note FR-EN', source_lang: 'fr', target_lang: 'en', entries, entries_format: 'tsv' });
  state.glossaryId = created.glossary_id;
  state.glossaryHash = hash;
  return state.glossaryId;
}

// Les {parametres} des textes d'interface ne doivent pas etre traduits.
// Gabarits de l'interface : chaque « {#} » (un nombre) devient <x>1</x>,
// <x>2</x>... pour garder l'ordre meme si l'anglais deplace les nombres.
const protect = text => {
  let index = 0;
  // Reperes 7, 8, 9... (pluriels) : « <x>1</x> ingrédients » ferait un singulier.
  return text.replace(/\{#\}/g, () => `<x>${6 + (index += 1)}</x>`).replace(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g, '<x>$1</x>');
};
// Le mode HTML de DeepL rend les apostrophes en entites (&#x27;) : on les
// remet en caracteres, sauf si le texte francais contenait lui-meme du HTML.
const decodeEntities = text => text.replace(/&#x27;|&#39;/g, '’').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const unprotect = (text, source = '') => {
  const plain = text.replace(/<x>(\d+)<\/x>/g, (whole, number) => `{${Number(number) - 6}}`).replace(/<x>([a-zA-Z0-9_]+)<\/x>/g, '{$1}');
  // Entites gardees seulement si le francais contenait du HTML ou des entites.
  return /<[a-z/]|&[a-z#0-9]+;/i.test(source) ? plain : decodeEntities(plain);
};

function writeOutput(memory, overrides) {
  const table = {};
  Object.entries(memory).forEach(([hash, entry]) => { if (entry.en) table[hash] = entry.en; });
  Object.entries(overrides).forEach(([fr, en]) => { if (en) table[textHash(fr)] = en; });
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  // Gabarits de l'interface (« Ajouter {#} aux favoris ») : listes a part pour
  // la reconnaissance par motif dans app-english.js.
  const templates = [];
  Object.values(memory).forEach(entry => { if (entry.en && entry.fr.includes('{#}') && !overrides[entry.fr]) templates.push([entry.fr, entry.en]); });
  Object.entries(overrides).forEach(([fr, en]) => { if (en && fr.includes('{#}')) templates.push([fr, en]); });
  fs.writeFileSync(OUTPUT, `// Genere par scripts/translate-en.js : ne pas modifier a la main.\nwindow.COOK_NOTE_EN = ${JSON.stringify(table)};\nwindow.COOK_NOTE_EN_TEMPLATES = ${JSON.stringify(templates)};\n`);
  return Object.keys(table).length;
}

async function main() {
  const memory = readJson(MEMORY, {});
  const overrides = readJson(OVERRIDES, {});
  const state = readJson(STATE, {});
  const sources = collectEnglishSources(ROOT);
  const overridden = new Set(Object.keys(overrides).map(textHash));
  const missing = sources.filter(item => !memory[item.hash]?.en && !overridden.has(item.hash));
  const missingChars = missing.reduce((sum, item) => sum + item.text.length, 0);
  console.log(`Textes : ${sources.length} · deja traduits : ${sources.length - missing.length} · a traduire : ${missing.length} (${missingChars.toLocaleString('fr-FR')} caracteres)`);
  if (dry || !missing.length) {
    console.log(`Fichier anglais : ${writeOutput(memory, overrides)} traductions.`);
    return;
  }
  const key = apiKey();
  if (!key) throw new Error('Cle DeepL absente : la coller dans translations/en/deepl-key.txt.');
  const usage = await deepl(key, '/v2/usage', null, 'GET');
  const left = Math.max(0, usage.character_limit - usage.character_count - QUOTA_MARGIN);
  const budget = Math.min(left, maxChars);
  console.log(`Quota DeepL : ${usage.character_count.toLocaleString('fr-FR')} / ${usage.character_limit.toLocaleString('fr-FR')} · budget de ce passage : ${budget.toLocaleString('fr-FR')}`);
  const glossaryId = await ensureGlossary(key, state);
  writeJson(STATE, state);
  let spent = 0;
  let done = 0;
  for (let start = 0; start < missing.length; start += BATCH) {
    const batch = [];
    for (const item of missing.slice(start, start + BATCH)) {
      if (spent + item.text.length > budget) break;
      spent += item.text.length;
      batch.push(item);
    }
    if (!batch.length) break;
    const result = await deepl(key, '/v2/translate', {
      text: batch.map(item => protect(item.text)),
      source_lang: 'FR',
      target_lang: 'EN-GB',
      tag_handling: 'html',
      ignore_tags: ['x'],
      preserve_formatting: true,
      ...(glossaryId ? { glossary_id: glossaryId } : {})
    });
    result.translations.forEach((translation, index) => {
      const item = batch[index];
      memory[item.hash] = { fr: item.text, en: unprotect(translation.text, item.text) };
    });
    done += batch.length;
    writeJson(MEMORY, memory);
    process.stdout.write(`\r${done} / ${missing.length} textes traduits`);
    if (batch.length < Math.min(BATCH, missing.length - start)) break;
  }
  process.stdout.write('\n');
  // Nettoyage : les textes qui n'existent plus sortent de la memoire.
  const live = new Set(sources.map(item => item.hash));
  Object.keys(memory).forEach(hash => { if (!live.has(hash)) delete memory[hash]; });
  writeJson(MEMORY, memory);
  const remaining = missing.length - done;
  console.log(`Fichier anglais : ${writeOutput(memory, overrides)} traductions.${remaining ? ` Reste ${remaining} textes (${budget < left ? 'limite --max-chars atteinte' : 'quota du mois atteint : relancer le mois prochain'}).` : ' Tout est traduit.'}`);
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});


// Nettoyage automatique du dossier de travail (lance apres `npm run check`,
// apres chaque build APK, ou a la main avec `npm run clean`).
// - tmp/ : vide, sauf tmp/perf (outils de mesure cites dans COOK_NOTE_RULES.md) ;
// - test-results/, playwright-report/ : resultats de tests deja lus ;
// - racine : journaux et captures temporaires (*.log, .tmp-*) ;
// - backups/android : les deux versions d'APK les plus recentes seulement, une
//   sauvegarde par version ; la cle old-keystore n'est jamais touchee ;
// - downloads/ : l'APK courant et sa copie numerotee la plus recente.
// Option --backups : seulement les sauvegardes et les APK (build Android).
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const onlyBackups = process.argv.includes('--backups');
const quiet = process.argv.includes('--quiet');
const removed = [];

function remove(target) {
  const full = path.resolve(ROOT, target);
  // Garde-fou : jamais en dehors du depot, jamais la cle de signature.
  if (!full.startsWith(ROOT + path.sep) || /old-keystore/i.test(full) || !fs.existsSync(full)) return;
  fs.rmSync(full, { recursive: true, force: true });
  removed.push(path.relative(ROOT, full).split(path.sep).join('/'));
}

const versionOf = name => (name.match(/v(\d+)\.(\d+)/) || []).slice(1).map(Number);
const newestFirst = (a, b) => {
  const [am = 0, an = 0] = versionOf(a);
  const [bm = 0, bn = 0] = versionOf(b);
  return bm - am || bn - an;
};

function cleanBackups() {
  const dir = path.join(ROOT, 'backups', 'android');
  if (!fs.existsSync(dir)) return;
  const versions = fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && /^before-v\d+\.\d+$/.test(entry.name))
    .map(entry => entry.name)
    .sort(newestFirst);
  versions.slice(2).forEach(name => remove(path.join('backups', 'android', name)));
  // Dans une version gardee : la derniere sauvegarde seulement.
  versions.slice(0, 2).forEach(name => {
    const stamps = fs.readdirSync(path.join(dir, name), { withFileTypes: true })
      .filter(entry => entry.isDirectory()).map(entry => entry.name).sort().reverse();
    stamps.slice(1).forEach(stamp => remove(path.join('backups', 'android', name, stamp)));
  });
}

function cleanDownloads() {
  const dir = path.join(ROOT, 'downloads');
  if (!fs.existsSync(dir)) return;
  const numbered = fs.readdirSync(dir).filter(name => /^cook-note-android-legacy-v\d+\.\d+\.apk$/.test(name)).sort(newestFirst);
  numbered.slice(1).forEach(name => remove(path.join('downloads', name)));
}

function cleanScratch() {
  const tmp = path.join(ROOT, 'tmp');
  if (fs.existsSync(tmp)) fs.readdirSync(tmp).filter(name => name !== 'perf').forEach(name => remove(path.join('tmp', name)));
  ['test-results', 'playwright-report'].forEach(remove);
  fs.readdirSync(ROOT).filter(name => /\.log$/i.test(name) || /^\.tmp-/.test(name)).forEach(remove);
}

cleanBackups();
cleanDownloads();
if (!onlyBackups) cleanScratch();

if (!quiet || removed.length) {
  console.log(removed.length
    ? `Nettoyage : ${removed.length} element(s) supprime(s)\n${removed.map(item => `  - ${item}`).join('\n')}`
    : 'Nettoyage : rien a supprimer.');
}

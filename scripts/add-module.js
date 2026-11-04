// `npm run module -- app-nouveau.js [apres=app-wine.js]` : enregistre un
// nouveau module partout ou il doit l'etre (index.html, service worker x2,
// _headers, scripts/lib/app-modules.js, controle node --check de package.json).
// Le fichier doit deja exister ; par defaut il est place apres app-wine.js.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const [file, afterArg] = process.argv.slice(2);
const after = (afterArg || 'apres=app-wine.js').replace(/^apres=/, '');
const fail = message => { console.error(message); process.exit(1); };
if (!/^app-[\w-]+\.js$/.test(file || '')) fail('Usage : npm run module -- app-nom.js [apres=app-wine.js]');
if (!fs.existsSync(path.join(ROOT, file))) fail(`${file} introuvable : creer le fichier d'abord.`);

const edits = [];
function edit(target, from, to, label) {
  const full = path.join(ROOT, target);
  const text = fs.readFileSync(full, 'utf8');
  if (text.includes(to.trim())) return;
  if (!text.includes(from)) fail(`${target} : ${label} introuvable (${from.trim()}).`);
  fs.writeFileSync(full, text.replace(from, to), 'utf8');
  edits.push(target);
}

const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const version = (index.match(new RegExp(`/${after.replace('.', '\\.')}\\?v=([\\w-]+)`)) || [])[1];
if (!version) fail(`index.html : ${after} introuvable, choisir un autre module avec apres=...`);

edit('index.html', `<script src="/${after}?v=${version}"></script>`, `<script src="/${after}?v=${version}"></script>\n  <script src="/${file}?v=${version}"></script>`, 'balise');
edit('service-worker.js', `  '/${after}',\n`, `  '/${after}',\n  '/${file}',\n`, 'precache');
edit('service-worker.js', `  '/${after}?v=${version}',\n`, `  '/${after}?v=${version}',\n  '/${file}?v=${version}',\n`, 'precache versionne');
edit('_headers', `/${after}\n  Cache-Control: public, max-age=300, must-revalidate\n`, `/${after}\n  Cache-Control: public, max-age=300, must-revalidate\n\n/${file}\n  Cache-Control: public, max-age=300, must-revalidate\n`, 'en-tete');
edit('scripts/lib/app-modules.js', `  '${after}',\n`, `  '${after}',\n  '${file}',\n`, 'liste des modules');
edit('package.json', `node --check ${after} && `, `node --check ${after} && node --check ${file} && `, 'controle');

console.log(edits.length ? `${file} enregistre dans : ${[...new Set(edits)].join(', ')}` : `${file} deja enregistre partout.`);

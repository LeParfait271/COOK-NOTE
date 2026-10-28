#!/usr/bin/env node
// Prepare Vosk (vosk-browser 0.0.8, Apache-2.0) pour Cook Note : le worker,
// embarque en base64 dans vosk.js et lance depuis une URL blob:, est ecrit
// dans son propre fichier (assets/vendor/vosk/vosk-worker.js). Il peut ainsi
// recevoir sa propre politique de securite (eval necessaire au code
// WebAssembly compile) sans assouplir celle du site.
// Usage : node scripts/vendor-vosk.js <chemin vers dist/vosk.js du paquet>
const fs = require('node:fs');
const path = require('node:path');

const source = process.argv[2];
if (!source) throw new Error('Chemin vers vosk.js du paquet vosk-browser requis.');
const target = path.resolve(__dirname, '..', 'assets', 'vendor', 'vosk');
const code = fs.readFileSync(source, 'utf8');
const call = code.match(/var WorkerFactory = createBase64WorkerFactory\('([A-Za-z0-9+/=]+)'[^;]*\);/);
if (!call) throw new Error('Worker Vosk introuvable dans vosk.js.');

// Meme decoupe que createURL() : la premiere ligne (commentaire) est retiree.
const decoded = Buffer.from(call[1], 'base64').toString('latin1');
const worker = decoded.substring(decoded.indexOf('\n', 10) + 1);
const loader = [
  'var WorkerFactory = (function () {',
  '        // Cook Note : worker servi comme fichier, a cote de vosk.js.',
  "        var script = document.currentScript && document.currentScript.src;",
  "        var url = script ? script.replace(/vosk\\.js(\\?.*)?$/, 'vosk-worker.js') : '/assets/vendor/vosk/vosk-worker.js';",
  '        return function WorkerFactory(options) {',
  '            return new Worker(url, options);',
  '        };',
  '    })();'
].join('\n');

fs.mkdirSync(target, { recursive: true });
fs.writeFileSync(path.join(target, 'vosk-worker.js'), Buffer.from(worker, 'latin1'));
fs.writeFileSync(path.join(target, 'vosk.js'), code.replace(call[0], loader));
console.log(`vosk.js ${(fs.statSync(path.join(target, 'vosk.js')).size / 1024).toFixed(0)} Ko, vosk-worker.js ${(fs.statSync(path.join(target, 'vosk-worker.js')).size / 1024).toFixed(0)} Ko`);

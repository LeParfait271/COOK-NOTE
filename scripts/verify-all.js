// `npm run verifier` : tout ce qu'on lance apres une modification, dans
// l'ordre, avec un resume a la fin (validation, tests, robot anglais,
// accessibilite). S'arrete au premier controle en echec.
const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
// Nouveaux textes traduits d'abord (seulement s'il y a la cle DeepL locale).
const fs = require('fs');
const STEPS = [
  ...(fs.existsSync(path.join(ROOT, 'translations/en/deepl-key.txt')) ? [['Traduction des nouveaux textes', npm, ['run', 'translate:en']]] : []),
  ['Validation (npm run check)', npm, ['run', 'check']],
  ['Tests Playwright', npx, ['playwright', 'test', '--reporter=line']],
  ['Robot anglais', process.execPath, ['scripts/audit-english.js']],
  ['Audit accessibilite', process.execPath, ['scripts/audit-accessibility.js']],
  // Simple signalement (n'echoue pas le resume) : code ou script plus utilise.
  ['Code mort (signalement)', process.execPath, ['scripts/find-dead-code.js'], true]
];

const results = [];
for (const [label, command, args, advisory] of STEPS) {
  const started = Date.now();
  console.log(`\n=== ${label} ===`);
  // Le shell seulement pour npm/npx (.cmd sous Windows) : le chemin de node
  // contient un espace (« COOK NOTE ») et casserait la ligne de commande.
  const viaShell = process.platform === 'win32' && command !== process.execPath;
  const run = spawnSync(command, args, { cwd: ROOT, encoding: 'utf8', shell: viaShell, maxBuffer: 64 * 1024 * 1024 });
  const output = `${run.stdout || ''}${run.stderr || ''}`;
  const tail = output.trim().split('\n').slice(-6).join('\n');
  console.log(tail);
  // Le robot et l'audit sortent en 0 meme avec des remarques : on lit leur bilan.
  const remarks = /([1-9]\d*) textes encore en francais|([1-9]\d*) probleme\(s\) d'accessibilite/.exec(output);
  const ok = advisory ? true : run.status === 0 && !remarks && !/\d+ failed/.test(output);
  results.push([advisory && run.status !== 0 ? `${label} : a regarder` : label, ok, Math.round((Date.now() - started) / 1000)]);
  if (!ok) break;
}

console.log('\n=== Resume ===');
results.forEach(([label, ok, seconds]) => console.log(`${ok ? 'OK    ' : 'ECHEC '} ${label} (${seconds} s)`));
const skipped = STEPS.slice(results.length).map(([label]) => label);
if (skipped.length) console.log(`Non lances : ${skipped.join(', ')}`);
process.exit(results.every(([, ok]) => ok) && !skipped.length ? 0 : 1);

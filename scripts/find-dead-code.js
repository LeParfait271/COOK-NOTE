// `npm run code:mort` (aussi lance par `npm run verifier`) : fonctions et
// constantes de premier niveau que plus rien n'utilise, et scripts que ni
// package.json, ni les autres scripts, ni la documentation n'appellent.
// Simple signalement : rien n'est supprime automatiquement.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const exists = file => fs.existsSync(path.join(ROOT, file));
const pkg = read('package.json');
const list = dir => (exists(dir) ? fs.readdirSync(path.join(ROOT, dir)) : []);
const docs = ['A_LIRE_EN_PREMIER.md', 'COOK_NOTE_RULES.md', 'AGENTS.md', 'README.txt', 'GUIDE_COMPLET.txt', 'check.ps1', 'dev.ps1'].filter(exists).map(read).join('\n')
  + list('docs').filter(f => /\.(md|txt)$/.test(f)).map(f => read(`docs/${f}`)).join('\n')
  + list('.github/workflows').map(f => read(`.github/workflows/${f}`)).join('\n')
  + list('.githooks').map(f => read(`.githooks/${f}`)).join('\n');
const scripts = list('scripts').filter(f => /\.(js|ps1|mjs|py)$/.test(f));
const scriptText = scripts.map(f => read(`scripts/${f}`)).join('\n') + list('scripts/lib').map(f => read(`scripts/lib/${f}`)).join('\n');
const findings = [];

scripts.forEach(file => {
  const name = file.replace(/\.[^.]+$/, '');
  const used = pkg.includes(file) || pkg.includes(`scripts/${name}`) || scriptText.split(file).length > 2
    || scriptText.includes(`./${name}`) || scriptText.includes(`'${name}'`) || docs.includes(file);
  if (!used) findings.push(`script jamais appele : scripts/${file}`);
});

const appFiles = fs.readdirSync(ROOT).filter(f => /^(app[\w-]*|recipe|recipe-worker|admin|theme|i18n|server)\.js$/.test(f));
const code = appFiles.map(read).join('\n') + read('index.html') + read('recipe.html') + scriptText;
appFiles.forEach(file => {
  const names = [...read(file).matchAll(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)|^const\s+([A-Za-z_$][\w$]*)\s*=/gm)].map(m => m[1] || m[2]);
  names.filter(name => (code.match(new RegExp(`\\b${name.replace(/\$/g, '\\$')}\\b`, 'g')) || []).length === 1)
    .forEach(name => findings.push(`inutilise : ${name} (${file})`));
});

console.log(findings.length ? `${findings.length} element(s) mort(s) :\n${findings.map(item => `  - ${item}`).join('\n')}` : 'Code mort : rien a signaler.');
process.exit(findings.length ? 1 : 0);

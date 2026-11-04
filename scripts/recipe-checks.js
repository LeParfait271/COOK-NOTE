// `npm run recette` : tous les controles d'une fiche apres un ajout ou une
// modification de recette (structure, formulation, quantites, four, materiel,
// liens, doublons, versions, placement des parents), puis l'audit culinaire.
const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHECKS = [
  'validate-recipes', 'validate-recipe-wording', 'validate-quantities', 'validate-oven-temperatures',
  'validate-recipe-equipment', 'validate-recipe-links', 'validate-recipe-duplicates', 'validate-recipe-versions',
  'validate-parent-placement', 'validate-parent-art-lock', 'validate-average-weights', 'audit-recipes'
];

let failed = 0;
for (const name of CHECKS) {
  const run = spawnSync(process.execPath, [`scripts/${name}.js`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  const ok = run.status === 0;
  if (!ok) failed += 1;
  const last = `${run.stdout || ''}${run.stderr || ''}`.trim().split('\n').slice(-1)[0] || '';
  console.log(`${ok ? 'OK    ' : 'ECHEC '} ${name.padEnd(28)} ${last.slice(0, 110)}`);
}
console.log(failed ? `\n${failed} controle(s) en echec : voir ci-dessus.` : '\nToutes les verifications de recettes passent.');
process.exit(failed ? 1 : 0);

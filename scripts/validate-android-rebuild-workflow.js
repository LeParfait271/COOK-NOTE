const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const packageJson = JSON.parse(read('package.json'));
const workflow = read('scripts/rebuild-android-release.ps1');
const rules = read('COOK_NOTE_RULES.md');
const androidDoc = read('docs/android-legacy-workflow.md');
const appsDoc = read('docs/apps-install-workflow.md');
const errors = [];

function expect(message, condition) {
  if (!condition) errors.push(message);
}

expect(
  'Commande apps:rebuild absente.',
  packageJson.scripts?.['apps:rebuild']?.includes('rebuild-android-release.ps1')
);
expect(
  'Commande apps:rebuild:check absente.',
  packageJson.scripts?.['apps:rebuild:check']?.includes('rebuild-android-release.ps1')
    && packageJson.scripts?.['apps:rebuild:check']?.includes('-CheckOnly')
);
expect(
  'Commande apps:rebuild:finalize absente.',
  packageJson.scripts?.['apps:rebuild:finalize']?.includes('rebuild-android-release.ps1')
    && packageJson.scripts?.['apps:rebuild:finalize']?.includes('-FinalizeExistingBuild')
);
[
  'Assert-OfficialRepository',
  'Get-VersionState',
  'New-AndroidBackup',
  'scripts/bump-version.js',
  'scripts/build-site.js',
  'build-android-legacy.ps1',
  'scripts/build-android-legacy-assets.js',
  '-Offline',
  '-SkipAssetBuild',
  'FinalizeExistingBuild',
  'Assert-ApkMetadata',
  'aapt.exe',
  'apksigner.bat',
  'validate-dist.js',
  'validate-cache-version.js',
  'validate-android-manual.js',
  'cook-note-android-legacy.apk',
  'cook-note-android-legacy-v$TargetVersion.apk',
  'dist\\downloads',
  'android-rebuild-latest.json',
  'android-gradle-latest.log',
  'Get-Content -LiteralPath $GradleLatestLogPath -Tail 30',
  'COOK_NOTE_ANDROID_REBUILD_OK'
].forEach(fragment => {
  expect(`Workflow rebuild incomplet (${fragment}).`, workflow.includes(fragment));
});
expect(
  'Le build Android doit etre reproductible sans daemon et hors ligne quand le cache est pret.',
  read('scripts/build-android-legacy.ps1').includes('--no-daemon')
    && read('scripts/build-android-legacy.ps1').includes('--offline')
    && read('scripts/build-android-legacy.ps1').includes('SkipAssetBuild')
);
expect(
  'Le workflow ne doit pas publier de GitHub Release.',
  !workflow.includes('PublishRelease') && !workflow.includes('publish-android-release.ps1')
);
expect(
  'La methode idempotente doit etre documentee.',
  rules.includes('npm run apps:rebuild')
    && rules.includes('idempotent')
    && androidDoc.includes('npm run apps:rebuild:check')
    && androidDoc.includes('npm run apps:rebuild')
    && appsDoc.includes('npm run apps:rebuild')
);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation workflow rebuild Android OK.');

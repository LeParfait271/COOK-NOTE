const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const errors = [];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function expect(label, condition) {
  if (!condition) errors.push(label);
}

const packageJson = JSON.parse(read('package.json'));
const packageText = read('package.json');
const androidGitignore = read('android-legacy/.gitignore');
const androidReadme = read('android-legacy/README.md');
const workflowDoc = read('docs/android-legacy-workflow.md');
const buildScript = read('scripts/build-android-legacy.ps1');
const publishScript = read('scripts/publish-android-release.ps1');
const androidBuildGradle = read('android-legacy/app/build.gradle');

const normalSiteScripts = ['build', 'check', 'preflight', 'dev', 'start'];
normalSiteScripts.forEach(scriptName => {
  const command = packageJson.scripts?.[scriptName] || '';
  expect(
    `Le script npm ${scriptName} ne doit jamais builder l'APK Android.`,
    !/build-android-legacy|publish-android-release|android:legacy:(?:apk|update|setup|publish)/.test(command)
  );
});

expect(
  'Le build Android doit rester une commande explicite.',
  packageJson.scripts?.['android:legacy:update-apk']?.includes('build-android-legacy.ps1')
);
expect(
  'Le setup Android doit rester une commande explicite.',
  packageJson.scripts?.['android:legacy:setup']?.includes('setup-android-legacy-tools.ps1')
);
expect(
  'La publication GitHub de l APK doit rester une commande explicite.',
  packageJson.scripts?.['android:legacy:publish-release']?.includes('publish-android-release.ps1')
);
expect(
  'Le validateur Android manuel doit etre branche au check.',
  packageText.includes('scripts/validate-android-manual.js')
);

[
  '.gradle/',
  'build/',
  'local.properties',
  'app/build/',
  'app/src/main/assets/www/'
].forEach(fragment => {
  expect(`android-legacy/.gitignore doit ignorer ${fragment}`, androidGitignore.includes(fragment));
});

expect(
  'Le script APK doit synchroniser dist seulement quand on le lance explicitement.',
  androidBuildGradle.includes('syncCookNoteDist') && buildScript.includes('APK Cook Note Android Legacy OK')
);
expect(
  'Le script APK doit echouer si Gradle echoue.',
  buildScript.includes('$LASTEXITCODE') && buildScript.includes('Gradle a echoue')
);
expect(
  'Le script de publication Android doit pousser un asset GitHub stable.',
  publishScript.includes('gh release') && publishScript.includes('cook-note-android.apk') && publishScript.includes('releases/latest/download')
);

[
  'Android Legacy',
  'projet secondaire',
  'ne se met pas a jour automatiquement',
  'npm run android:legacy:update-apk',
  'npm run android:legacy:publish-release',
  'cook-note-android.apk',
  'releases/latest/download',
  'app/src/main/assets/www/',
  'commit/push du site ne change pas l APK installe',
  'Android 5.0'
].forEach(fragment => {
  expect(`Documentation Android manuelle incomplete (${fragment}).`, workflowDoc.includes(fragment));
});

expect(
  'android-legacy/README.md doit pointer vers la documentation complete.',
  androidReadme.includes('docs/android-legacy-workflow.md') && androidReadme.includes('update-apk') && androidReadme.includes('publish-release')
);

const gitTracked = spawnSync('git', ['ls-files', 'android-legacy'], {
  cwd: ROOT,
  encoding: 'utf8',
  shell: false
});
if (gitTracked.status === 0) {
  const trackedForbidden = gitTracked.stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .filter(file => /\.(apk|aab)$/.test(file) || file.includes('/src/main/assets/www/'));
  expect(
    `Artefacts Android generes suivis par Git: ${trackedForbidden.join(', ')}`,
    trackedForbidden.length === 0
  );
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation Android manuel OK.');

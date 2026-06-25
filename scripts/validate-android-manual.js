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
const androidModernGitignore = read('android-modern/.gitignore');
const androidReadme = read('android-legacy/README.md');
const androidModernReadme = read('android-modern/README.md');
const workflowDoc = read('docs/android-legacy-workflow.md');
const appsWorkflowDoc = read('docs/apps-install-workflow.md');
const buildSiteScript = read('scripts/build-site.js');
const serviceWorker = read('service-worker.js');
const buildScript = read('scripts/build-android-legacy.ps1');
const buildModernScript = read('scripts/build-android-modern.ps1');
const updateAllAppsScript = read('scripts/update-all-apps.ps1');
const publishScript = read('scripts/publish-android-release.ps1');
const androidBuildGradle = read('android-legacy/app/build.gradle');
const androidModernBuildGradle = read('android-modern/app/build.gradle');
const androidModernMainActivity = read('android-modern/app/src/main/java/fr/cooknote/modern/MainActivity.java');

const normalSiteScripts = ['build', 'check', 'preflight', 'dev', 'start'];
normalSiteScripts.forEach(scriptName => {
  const command = packageJson.scripts?.[scriptName] || '';
  expect(
    `Le script npm ${scriptName} ne doit jamais builder l'APK Android.`,
    !/build-android-(?:legacy|modern)|update-all-apps|publish-android-release|apps:(?:update|publish)-all|android:(?:legacy|modern):(?:apk|update|setup|publish)/.test(command)
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
    && packageJson.scripts?.['android:legacy:publish-release']?.includes('-Channel legacy')
);
expect(
  'Le build Android Modern doit rester une commande explicite.',
  packageJson.scripts?.['android:modern:update-apk']?.includes('build-android-modern.ps1')
);
expect(
  'Le setup Android Modern doit rester une commande explicite.',
  packageJson.scripts?.['android:modern:setup']?.includes('setup-android-legacy-tools.ps1')
);
expect(
  'La publication GitHub Android Modern doit rester une commande explicite.',
  packageJson.scripts?.['android:modern:publish-release']?.includes('publish-android-release.ps1')
    && packageJson.scripts?.['android:modern:publish-release']?.includes('-Channel modern')
);
expect(
  'La mise a jour app doit rester groupee via apps:update-all.',
  packageJson.scripts?.['apps:update-all']?.includes('update-all-apps.ps1')
);
expect(
  'La publication app doit rester groupee via apps:publish-all.',
  packageJson.scripts?.['apps:publish-all']?.includes('update-all-apps.ps1')
    && packageJson.scripts?.['apps:publish-all']?.includes('-PublishRelease')
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
  expect(`android-modern/.gitignore doit ignorer ${fragment}`, androidModernGitignore.includes(fragment));
});

expect(
  'Le script APK doit synchroniser dist seulement quand on le lance explicitement.',
  androidBuildGradle.includes('syncCookNoteDist') && buildScript.includes('APK Cook Note Android Legacy OK')
    && androidModernBuildGradle.includes('syncCookNoteDist') && buildModernScript.includes('APK Cook Note Android Modern OK')
);
expect(
  'Le script de mise a jour groupee doit fabriquer et copier les deux APK Android ensemble.',
  updateAllAppsScript.includes('build-android-legacy.ps1')
    && updateAllAppsScript.includes('build-android-modern.ps1')
    && updateAllAppsScript.includes('cook-note-android-legacy.apk')
    && updateAllAppsScript.includes('cook-note-android-modern.apk')
    && updateAllAppsScript.includes('dist\\downloads')
    && updateAllAppsScript.includes('PublishRelease')
    && updateAllAppsScript.includes('publish-android-release.ps1')
);
expect(
  'Le script APK doit echouer si Gradle echoue.',
  buildScript.includes('$LASTEXITCODE') && buildScript.includes('Gradle a echoue')
    && buildModernScript.includes('$LASTEXITCODE') && buildModernScript.includes('Gradle a echoue')
);
expect(
  'Le script de publication Android doit pousser un asset GitHub stable.',
  publishScript.includes('gh release')
    && publishScript.includes('apps-v$VersionName')
    && publishScript.includes('cook-note-android-legacy.apk')
    && publishScript.includes('cook-note-android-modern.apk')
);
expect(
  'Les APK telechargeables doivent rester hors dist Cloudflare Pages.',
  !buildSiteScript.includes("'downloads'")
    && fs.existsSync(path.join(ROOT, 'downloads', 'cook-note-android-legacy.apk'))
    && fs.existsSync(path.join(ROOT, 'downloads', 'cook-note-android-modern.apk'))
    && !fs.existsSync(path.join(ROOT, 'dist', 'downloads'))
);
expect(
  'Les APK servis depuis GitHub Raw ne doivent pas remplir le cache PWA local.',
  serviceWorker.includes("url.pathname.startsWith('/downloads/')")
);
expect(
  'Android Modern doit etre optimise pour lecture locale fluide.',
    androidModernBuildGradle.includes("tasks.register('syncCookNoteDist', Sync)")
    && androidBuildGradle.includes("tasks.register('syncCookNoteDist', Sync)")
    && androidModernBuildGradle.includes("noCompress += ['html', 'js', 'css', 'json']")
    && androidBuildGradle.includes("noCompress += ['html', 'js', 'css', 'json']")
    && !androidModernBuildGradle.includes("'jpg'")
    && !androidBuildGradle.includes("'jpg'")
    && androidModernBuildGradle.includes("exclude('downloads/**')")
    && androidBuildGradle.includes("exclude('downloads/**')")
    && androidModernMainActivity.includes('setOffscreenPreRaster(true)')
    && androidModernMainActivity.includes('responseHeaders')
);

[
  'Android Legacy',
  'projet secondaire',
  'ne se met pas a jour automatiquement',
  'npm run android:legacy:update-apk',
  'npm run android:legacy:publish-release',
  'cook-note-android-legacy.apk',
  'apps-vX.YY',
  '/downloads/',
  'app/src/main/assets/www/',
  'commit/push du site ne change pas l APK installe',
  'Android 5.0',
  'npm run apps:update-all',
  'mise a jour groupee',
  'Ne jamais publier un seul APK'
].forEach(fragment => {
  expect(`Documentation Android manuelle incomplete (${fragment}).`, workflowDoc.includes(fragment));
});

expect(
  'android-legacy/README.md doit pointer vers la documentation complete.',
  androidReadme.includes('docs/android-legacy-workflow.md') && androidReadme.includes('update-apk') && androidReadme.includes('publish-release') && androidReadme.includes('cook-note-android-legacy.apk')
);
expect(
  'android-modern/README.md doit documenter le workflow moderne.',
  androidModernReadme.includes('docs/apps-install-workflow.md')
    && androidModernReadme.includes('android:modern:update-apk')
    && androidModernReadme.includes('android:modern:publish-release')
    && androidModernReadme.includes('cook-note-android-modern.apk')
);
[
  'Android 5',
  'Android recent',
  'iOS ancien',
  'iOS recent',
  'cook-note-android-legacy.apk',
  'cook-note-android-modern.apk',
  'raw.githubusercontent.com',
  '/downloads/',
  'Ajouter a l ecran d accueil',
  'ne doivent pas pretendre telecharger un `.ipa`',
  'npm run apps:update-all',
  'npm run apps:publish-all',
  'Mise a jour groupee obligatoire',
  'Ne jamais publier un seul APK'
].forEach(fragment => {
  expect(`Documentation globale apps incomplete (${fragment}).`, appsWorkflowDoc.includes(fragment));
});

expect(
  'Les balises iOS PWA doivent etre presentes.',
  read('index.html').includes('apple-mobile-web-app-capable')
    && read('index.html').includes('apple-mobile-web-app-title')
    && read('scripts/build-site.js').includes('apple-mobile-web-app-capable')
);

const gitTracked = spawnSync('git', ['ls-files', 'android-legacy', 'android-modern'], {
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

const globalTracked = spawnSync('git', ['ls-files'], {
  cwd: ROOT,
  encoding: 'utf8',
  shell: false
});
if (globalTracked.status === 0) {
  const allowedApks = new Set([
    'downloads/cook-note-android-legacy.apk',
    'downloads/cook-note-android-modern.apk'
  ]);
  const forbiddenApks = globalTracked.stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .filter(file => /\.(apk|aab)$/.test(file) && !allowedApks.has(file.replace(/\\/g, '/')));
  expect(
    `APK/AAB suivis hors emplacements autorises: ${forbiddenApks.join(', ')}`,
    forbiddenApks.length === 0
  );
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation Android manuel OK.');

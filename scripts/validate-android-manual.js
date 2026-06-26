const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const errors = [];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
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
const appScript = read('app.js');
const styleSheet = read('style.css');
const buildSiteScript = read('scripts/build-site.js');
const serviceWorker = read('service-worker.js');
const buildScript = read('scripts/build-android-legacy.ps1');
const buildModernScript = read('scripts/build-android-modern.ps1');
const legacyAssetsScript = read('scripts/build-android-legacy-assets.js');
const updateAllAppsScript = read('scripts/update-all-apps.ps1');
const publishScript = read('scripts/publish-android-release.ps1');
const androidBuildGradle = read('android-legacy/app/build.gradle');
const androidModernBuildGradle = read('android-modern/app/build.gradle');
const androidLegacySettingsGradle = read('android-legacy/settings.gradle');
const androidLegacyManifest = read('android-legacy/app/src/main/AndroidManifest.xml');
const androidLegacyStrings = read('android-legacy/app/src/main/res/values/strings.xml');
const androidLegacyMainActivity = read('android-legacy/app/src/main/java/fr/cooknote/legacy/MainActivity.java');
const androidLegacyRecipe = read('android-legacy/app/src/main/java/fr/cooknote/legacy/Recipe.java');
const androidLegacyRepository = read('android-legacy/app/src/main/java/fr/cooknote/legacy/CookNoteRepository.java');
const androidLegacyImageLoader = read('android-legacy/app/src/main/java/fr/cooknote/legacy/ImageLoader.java');
const androidLegacyAdapter = read('android-legacy/app/src/main/java/fr/cooknote/legacy/RecipeAdapter.java');
const androidModernMainActivity = read('android-modern/app/src/main/java/fr/cooknote/modern/MainActivity.java');
const androidModernStrings = read('android-modern/app/src/main/res/values/strings.xml');
const siteVersionName = (appScript.match(/const SITE_VERSION = 'v(\d+\.\d{2})'/) || [])[1] || '0.00';
const legacyVersionedApk = `downloads/cook-note-android-legacy-v${siteVersionName}.apk`;
const modernVersionedApk = `downloads/cook-note-android-modern-v${siteVersionName}.apk`;

['build', 'check', 'preflight', 'dev', 'start'].forEach(scriptName => {
  const command = packageJson.scripts?.[scriptName] || '';
  expect(
    `Le script npm ${scriptName} ne doit jamais builder l'APK Android.`,
    !/build-android-(?:legacy|modern)\.ps1|update-all-apps|publish-android-release|apps:(?:update|publish)-all|android:(?:legacy|modern):(?:apk|update|setup|publish)/.test(command)
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
    && packageText.includes('scripts/build-android-legacy-assets.js')
);

[
  '.gradle/',
  'build/',
  'local.properties',
  'app/build/'
].forEach(fragment => {
  expect(`android-legacy/.gitignore doit ignorer ${fragment}`, androidGitignore.includes(fragment));
  expect(`android-modern/.gitignore doit ignorer ${fragment}`, androidModernGitignore.includes(fragment));
});
expect(
  'android-modern/.gitignore doit ignorer les assets web generes.',
  androidModernGitignore.includes('app/src/main/assets/www/')
);

expect(
  'Le script APK doit synchroniser les assets seulement quand on le lance explicitement.',
  androidBuildGradle.includes('syncCookNoteDist') && buildScript.includes('APK Cook Note Android Legacy OK')
    && androidModernBuildGradle.includes('syncCookNoteDist') && buildModernScript.includes('APK Cook Note Android Modern OK')
);
expect(
  'Android Legacy doit etre une app native Lite, pas un wrapper web lourd.',
  buildScript.includes('node scripts/build-android-legacy-assets.js')
    && buildScript.includes('$LegacyApkOutput')
    && androidBuildGradle.includes('cook-note-lite')
    && androidBuildGradle.includes('assets.srcDirs = [legacyAssetRoot]')
    && androidBuildGradle.includes("noCompress += ['json']")
    && !androidBuildGradle.includes('org.mozilla.geckoview')
    && !androidLegacySettingsGradle.includes('maven.mozilla.org/maven2')
    && !androidLegacyManifest.includes('android.permission.INTERNET')
    && !androidLegacyManifest.includes('usesCleartextTraffic')
    && !androidLegacyManifest.includes('largeHeap')
    && androidLegacyMainActivity.includes('GridView')
    && androidLegacyMainActivity.includes('GridView.AUTO_FIT')
    && androidLegacyMainActivity.includes('setColumnWidth(dp(276))')
    && androidLegacyMainActivity.includes('setHorizontalSpacing')
    && androidLegacyMainActivity.includes('FrameLayout')
    && androidLegacyMainActivity.includes('collectionGridColumns')
    && androidLegacyMainActivity.includes('collectionCardHeight')
    && androidLegacyMainActivity.includes('(cardWidth * 9) / 16')
    && androidLegacyMainActivity.includes('RecipeAdapter')
    && androidLegacyMainActivity.includes('Spinner')
    && androidLegacyMainActivity.includes('ArrayAdapter')
    && androidLegacyMainActivity.includes('loadDetail')
    && androidLegacyMainActivity.includes('addSection')
    && androidLegacyMainActivity.includes('addInfoChips')
    && androidLegacyMainActivity.includes('stepRow')
    && androidLegacyMainActivity.includes('bulletRow')
    && androidLegacyMainActivity.includes('addHeaderStat')
    && androidLegacyMainActivity.includes('StateListDrawable')
    && androidLegacyMainActivity.includes('selectablePanel')
    && androidLegacyMainActivity.includes('buttonPanel')
    && androidLegacyMainActivity.includes('Carnet tablette Android 5.0+')
    && androidLegacyMainActivity.includes('RECHERCHE ET FILTRES')
    && androidLegacyMainActivity.includes('sectionButton(String value, boolean primary)')
    && androidLegacyMainActivity.includes('addInlineVariantPicker')
    && androidLegacyMainActivity.includes('selectedIngredientGroups')
    && androidLegacyMainActivity.includes('selectedRecipeSteps')
    && androidLegacyMainActivity.includes('addCollectionCards')
    && androidLegacyMainActivity.includes('addCollectionCard')
    && androidLegacyMainActivity.includes('"Recettes"')
    && androidLegacyMainActivity.includes('Preparation')
    && androidLegacyMainActivity.includes('SharedPreferences')
    && androidLegacyMainActivity.includes('favoriteIds')
    && androidLegacyMainActivity.includes('recentIds')
    && androidLegacyMainActivity.includes('PREF_SHOPPING')
    && androidLegacyMainActivity.includes('shoppingRecipeIds')
    && androidLegacyMainActivity.includes('searchPanelOpen')
    && androidLegacyMainActivity.includes('setSearchPanelOpen')
    && androidLegacyMainActivity.includes('isHomeMode')
    && androidLegacyMainActivity.includes('browseAllRecipes')
    && androidLegacyMainActivity.includes('Toutes fiches')
    && androidLegacyMainActivity.includes('fiches parents')
    && androidLegacyMainActivity.includes('repository.homeRecipes()')
    && androidLegacyMainActivity.includes('repository.filterSearchable')
    && androidLegacyMainActivity.includes('repository.childrenForParent')
    && androidLegacyMainActivity.includes('repository.collectionCount')
    && androidLegacyMainActivity.includes('addParentPath')
    && androidLegacyMainActivity.includes('parentTrail')
    && androidLegacyMainActivity.includes('panelGradient')
    && androidLegacyMainActivity.includes('R.drawable.ic_launcher')
    && androidLegacyMainActivity.includes('Recherche')
    && androidLegacyMainActivity.includes('Filtres (')
    && androidLegacyMainActivity.includes('selectedSeason')
    && androidLegacyMainActivity.includes('selectedDifficulty')
    && androidLegacyMainActivity.includes('copyIngredients')
    && androidLegacyMainActivity.includes('showShoppingList')
    && androidLegacyMainActivity.includes('buildShoppingText')
    && androidLegacyMainActivity.includes('copyShoppingList')
    && androidLegacyMainActivity.includes('copyRecipe')
    && androidLegacyMainActivity.includes('shareRecipe')
    && androidLegacyMainActivity.includes('Intent.ACTION_SEND')
    && androidLegacyMainActivity.includes('Ajouter aux courses')
    && androidLegacyMainActivity.includes('ClipboardManager')
    && androidLegacyMainActivity.includes('UPDATE_APK_URL')
    && androidLegacyMainActivity.includes('Mise a jour')
    && androidLegacyMainActivity.includes('Intent.ACTION_VIEW')
    && androidLegacyMainActivity.includes('cook-note-android-legacy.apk')
    && androidLegacyMainActivity.includes('GradientDrawable')
    && androidLegacyRepository.includes('recipes-lite.json')
    && androidLegacyRepository.includes('homeRecipes')
    && androidLegacyRepository.includes('filterSearchable')
    && androidLegacyRepository.includes('childrenForParent')
    && androidLegacyRepository.includes('belongsToParent')
    && androidLegacyRepository.includes('additionalMasters')
    && androidLegacyRepository.includes('collectionCounts')
    && androidLegacyRepository.includes('parentTrail')
    && androidLegacyRepository.includes('recipe.master.length() == 0')
    && androidLegacyRepository.includes('searchableOnly && recipe.isCollection()')
    && androidLegacyRepository.includes('json.optBoolean("variantGroups", false)')
    && androidLegacyRecipe.includes('variantGroups')
    && androidLegacyRepository.includes('detailImage')
    && androidLegacyRepository.includes('matchesSeason')
    && androidLegacyRepository.includes('matchesDifficulty')
    && androidLegacyImageLoader.includes('RGB_565')
    && androidLegacyImageLoader.includes('LruCache')
    && androidLegacyImageLoader.includes('detail-images/')
    && androidLegacyAdapter.includes('BaseAdapter')
    && androidLegacyAdapter.includes('FrameLayout')
    && androidLegacyAdapter.includes('Color.argb')
    && androidLegacyAdapter.includes('CARD_MIN_WIDTH_DP = 276')
    && androidLegacyAdapter.includes('resizeCardForParent')
    && androidLegacyAdapter.includes('cardWidthForParent')
    && androidLegacyAdapter.includes('(cardWidth * 9) / 16')
    && androidLegacyAdapter.includes('StateListDrawable')
    && androidLegacyAdapter.includes('selectablePanel')
    && androidLegacyAdapter.includes('holder.count')
    && androidLegacyAdapter.includes('setEllipsize')
    && androidLegacyAdapter.includes('favoriteIds')
    && androidLegacyAdapter.includes('collectionCounts')
    && !/Gecko|WebView|ServerSocket|127\.0\.0\.1|LocalAssetServer/.test(androidLegacyMainActivity + androidLegacyRepository + androidLegacyImageLoader)
);
expect(
  'Les assets Android Legacy doivent etre generes en catalogue natif allege.',
  legacyAssetsScript.includes("require('jpeg-js')")
    && legacyAssetsScript.includes('MAX_IMAGE_WIDTH = 480')
    && legacyAssetsScript.includes('DETAIL_IMAGE_WIDTH = 960')
    && legacyAssetsScript.includes('JPEG_QUALITY')
    && legacyAssetsScript.includes('DETAIL_JPEG_QUALITY')
    && legacyAssetsScript.includes('recipes-lite.json')
    && legacyAssetsScript.includes('detail-images')
    && legacyAssetsScript.includes('detailImage')
    && legacyAssetsScript.includes('variantGroups: Boolean(recipe.variantGroups)')
    && legacyAssetsScript.includes('additionalMasters: cleanArray(recipe.additionalMasters)')
    && legacyAssetsScript.includes('android-legacy-native-lite')
    && legacyAssetsScript.includes('copyLiteImage')
    && legacyAssetsScript.includes('recipe-card-images')
    && legacyAssetsScript.includes('recipe-images-optimized')
    && packageJson.devDependencies?.['jpeg-js']
);
expect(
  'Le script de mise a jour groupee doit fabriquer et copier les deux APK Android ensemble.',
  updateAllAppsScript.includes('build-android-legacy.ps1')
    && updateAllAppsScript.includes('build-android-modern.ps1')
    && updateAllAppsScript.includes('cook-note-android-legacy.apk')
    && updateAllAppsScript.includes('cook-note-android-modern.apk')
    && updateAllAppsScript.includes('Get-CookNoteVersionName')
    && updateAllAppsScript.includes('cook-note-android-legacy-v$VersionName.apk')
    && updateAllAppsScript.includes('cook-note-android-modern-v$VersionName.apk')
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
    && publishScript.includes('cook-note-android-legacy-v$VersionName.apk')
    && publishScript.includes('cook-note-android-modern-v$VersionName.apk')
);
expect(
  'Les APK telechargeables doivent rester hors dist Cloudflare Pages.',
  !buildSiteScript.includes("'downloads'")
    && exists('downloads/cook-note-android-legacy.apk')
    && exists('downloads/cook-note-android-modern.apk')
    && exists(legacyVersionedApk)
    && exists(modernVersionedApk)
    && !exists('dist/downloads')
);
expect(
  'Les APK servis depuis GitHub Raw ne doivent pas remplir le cache PWA local.',
  serviceWorker.includes("url.pathname.startsWith('/downloads/')")
);
expect(
  'Android Modern doit rester optimise pour lecture locale fluide.',
  androidModernBuildGradle.includes("tasks.register('syncCookNoteDist', Sync)")
    && androidModernBuildGradle.includes("noCompress += ['html', 'js', 'css', 'json']")
    && !androidModernBuildGradle.includes("'jpg'")
    && androidModernBuildGradle.includes("exclude('downloads/**')")
    && androidModernMainActivity.includes('setOffscreenPreRaster(true)')
    && androidModernMainActivity.includes('CookNoteModernApp/HD')
    && androidModernMainActivity.includes('setRendererPriorityPolicy')
    && androidModernMainActivity.includes('responseHeaders')
);
expect(
  'Les noms Android doivent afficher la version minimale.',
  androidLegacyStrings.includes('Cook Note Android 5.0+')
    && androidModernStrings.includes('Cook Note HD Android 8.0+')
);
expect(
  'Le rendu HD des apps recentes doit rester isole du mode Legacy.',
  appScript.includes('detectAppEnvironment')
    && appScript.includes('modern-app-hd')
    && appScript.includes('android-modern-app')
    && appScript.includes('ios-modern-pwa')
    && styleSheet.includes('.mc-shell.modern-app-hd')
    && styleSheet.includes('.modern-app-hd .recipe-detail-hero')
    && !androidLegacyMainActivity.includes('modern-app-hd')
);

[
  'Android Legacy',
  'projet secondaire',
  'ne se met pas a jour automatiquement',
  'npm run android:legacy:update-apk',
  'npm run android:legacy:publish-release',
  'cook-note-android-legacy.apk',
  'cook-note-android-legacy-vX.YY.apk',
  'apps-vX.YY',
  '/downloads/',
  'commit/push du site ne change pas l APK installe',
  'Android 5.0',
  'npm run apps:update-all',
  'mise a jour groupee',
  'Ne jamais publier un seul APK',
  'scripts/build-android-legacy-assets.js',
  'Native Lite',
  'recipes-lite.json',
  '480px',
  '960px',
  'detail-images',
  'jpeg-js',
  'GridView',
  'RGB_565',
  'refonte visuelle native premium',
  'cartes image',
  '16/9',
  'header compact avec stats locales',
  'hero',
  'actions principales/secondaires',
  'pastilles',
  'favoris locaux',
  'derniers ouverts',
  'filtres saison/difficulte',
  'panneau recherche/filtres replie',
  'accueil parent Android',
  'Toutes fiches',
  'cartes parent visibles',
  'menu deroulant',
  'selecteur natif',
  'rattachements parents additionnels',
  'nom APK versionne',
  'preparation choisie',
  'copie ingredients',
  'liste de courses locale',
  'copie fiche',
  'partage fiche',
  'bouton natif de mise a jour',
  'etapes numerotees',
  'sans WebView systeme et sans GeckoView',
  'assets/www'
].forEach(fragment => {
  expect(`Documentation Android manuelle incomplete (${fragment}).`, workflowDoc.includes(fragment));
});

expect(
  'android-legacy/README.md doit pointer vers la documentation complete.',
  androidReadme.includes('docs/android-legacy-workflow.md')
    && androidReadme.includes('Native Lite')
    && androidReadme.includes('refonte visuelle native premium')
    && androidReadme.includes('cartes')
    && androidReadme.includes('hero')
    && androidReadme.includes('actions principales')
    && androidReadme.includes('favoris locaux')
    && androidReadme.includes('derniers ouverts')
    && androidReadme.includes('panneau recherche/filtres replie')
    && androidReadme.includes('accueil parent Android')
    && androidReadme.includes('Toutes fiches')
    && androidReadme.includes('cartes parent visibles')
    && androidReadme.includes('menu')
    && androidReadme.includes('selecteurs natifs uniquement')
    && androidReadme.includes('rattachements parents additionnels')
    && androidReadme.includes('nom APK versionne')
    && androidReadme.includes('preparation choisie')
    && androidReadme.includes('filtres')
    && androidReadme.includes('copie ingredients')
    && androidReadme.includes('liste de courses locale')
    && androidReadme.includes('copie fiche')
    && androidReadme.includes('partage fiche')
    && androidReadme.includes('bouton natif de mise a jour')
    && androidReadme.includes('update-all')
    && androidReadme.includes('publish-all')
    && androidReadme.includes('cook-note-android-legacy.apk')
);
expect(
  'android-modern/README.md doit documenter le workflow moderne.',
  androidModernReadme.includes('docs/apps-install-workflow.md')
    && androidModernReadme.includes('android:modern:update-apk')
    && androidModernReadme.includes('android:modern:publish-release')
    && androidModernReadme.includes('cook-note-android-modern.apk')
);
[
  'Android 5.0+',
  'Android 8.0+',
  'iOS ancien',
  'iOS recent',
  'Cook Note Android 5.0+',
  'Cook Note HD Android 8.0+',
  'cook-note-android-legacy.apk',
  'cook-note-android-legacy-vX.YY.apk',
  'cook-note-android-modern.apk',
  'cook-note-android-modern-vX.YY.apk',
  'modern-app-hd',
  'CookNoteModernApp/HD',
  'raw.githubusercontent.com',
  '/downloads/',
  'Ajouter a l ecran d accueil',
  'ne doivent pas pretendre telecharger un `.ipa`',
  'npm run apps:update-all',
  'npm run apps:publish-all',
  'Mise a jour groupee obligatoire',
  'Ne jamais publier un seul APK',
  'scripts/build-android-legacy-assets.js',
  'Native Lite',
  'recipes-lite.json',
  '480px',
  '960px',
  'jpeg-js',
  'GridView',
  'RGB_565',
  'refonte visuelle native premium',
  'cartes image',
  '16/9',
  'header compact avec stats locales',
  'hero de fiche encadre',
  'actions principales/secondaires',
  'pastilles',
  'favoris locaux',
  'derniers ouverts',
  'filtres saison/difficulte',
  'panneau recherche/filtres replie',
  'accueil parent Android',
  'Toutes fiches',
  'cartes parent visibles',
  'menu deroulant',
  'selecteurs natifs de preparation',
  'rattachements parents additionnels',
  'nom APK versionne',
  'preparation choisie',
  'copie ingredients',
  'liste de courses locale',
  'copie fiche',
  'partage fiche',
  'bouton natif de mise a jour',
  'etapes numerotees',
  'sans GeckoView'
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
    .filter(file => /\.(apk|aab)$/.test(file) || file.includes('/src/main/assets/www/') || file.includes('/build/generated/cook-note-lite/'));
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
    'downloads/cook-note-android-modern.apk',
    legacyVersionedApk,
    modernVersionedApk
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

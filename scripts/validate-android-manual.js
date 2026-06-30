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
const androidReadme = read('android-legacy/README.md');
const workflowDoc = read('docs/android-legacy-workflow.md');
const appsWorkflowDoc = read('docs/apps-install-workflow.md');
const appScript = read('app.js');
const styleSheet = read('style.css');
const buildSiteScript = read('scripts/build-site.js');
const serviceWorker = read('service-worker.js');
const buildScript = read('scripts/build-android-legacy.ps1');
const legacyAssetsScript = read('scripts/build-android-legacy-assets.js');
const updateAllAppsScript = read('scripts/update-all-apps.ps1');
const publishScript = read('scripts/publish-android-release.ps1');
const androidBuildGradle = read('android-legacy/app/build.gradle');
const androidLegacySettingsGradle = read('android-legacy/settings.gradle');
const androidLegacyManifest = read('android-legacy/app/src/main/AndroidManifest.xml');
const androidLegacyStrings = read('android-legacy/app/src/main/res/values/strings.xml');
const androidLegacyMainActivity = read('android-legacy/app/src/main/java/fr/cooknote/legacy/MainActivity.java');
const androidLegacyRecipe = read('android-legacy/app/src/main/java/fr/cooknote/legacy/Recipe.java');
const androidLegacyRepository = read('android-legacy/app/src/main/java/fr/cooknote/legacy/CookNoteRepository.java');
const androidLegacyImageLoader = read('android-legacy/app/src/main/java/fr/cooknote/legacy/ImageLoader.java');
const androidLegacyAdapter = read('android-legacy/app/src/main/java/fr/cooknote/legacy/RecipeAdapter.java');
const siteVersionName = (appScript.match(/const SITE_VERSION = 'v(\d+\.\d{2})'/) || [])[1] || '0.00';
const legacyVersionedApk = `downloads/cook-note-android-legacy-v${siteVersionName}.apk`;

['build', 'check', 'preflight', 'dev', 'start'].forEach(scriptName => {
  const command = packageJson.scripts?.[scriptName] || '';
  expect(
    `Le script npm ${scriptName} ne doit jamais builder l'APK Android.`,
    !/build-android-legacy\.ps1|update-all-apps|publish-android-release|apps:(?:update|publish)-all|android:legacy:(?:apk|update|setup|publish)/.test(command)
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
  'Les commandes Android Modern doivent etre supprimees.',
  !packageText.includes('android:modern') && !packageText.includes('build-android-modern.ps1')
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
});

expect(
  'Le script APK doit synchroniser les assets seulement quand on le lance explicitement.',
  androidBuildGradle.includes('syncCookNoteDist') && buildScript.includes('APK Cook Note Android Legacy OK')
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
    && androidLegacyMainActivity.includes('setColumnWidth(dp(compactCards ? 244 : 286))')
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
    && androidLegacyMainActivity.includes('RECHERCHE SIMPLE')
    && androidLegacyMainActivity.includes('clearSearch')
    && androidLegacyMainActivity.includes('Recherche active')
    && androidLegacyMainActivity.includes('repository.searchSmart')
    && androidLegacyMainActivity.includes('SEARCH_DEBOUNCE_MS')
    && androidLegacyMainActivity.includes('scheduleApplyFilters')
    && androidLegacyMainActivity.includes('lastAppliedQuery')
    && androidLegacyMainActivity.includes('prewarmListImages')
    && androidLegacyMainActivity.includes('prewarmCollectionImages')
    && androidLegacyMainActivity.includes('LIST_PREWARM_LIMIT')
    && androidLegacyMainActivity.includes('COLLECTION_PREWARM_LIMIT')
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
    && androidLegacyMainActivity.includes('PREF_SHOPPING')
    && androidLegacyMainActivity.includes('PREF_KEEP_SCREEN_ON')
    && androidLegacyMainActivity.includes('PREF_QUANTITY_FACTOR')
    && androidLegacyMainActivity.includes('PREF_TEXT_MODE')
    && androidLegacyMainActivity.includes('PREF_COMPACT_CARDS')
    && androidLegacyMainActivity.includes('PREF_OPEN_LAST')
    && androidLegacyMainActivity.includes('SCREEN_DIAGNOSTIC')
    && androidLegacyMainActivity.includes('shoppingRecipeIds')
    && androidLegacyMainActivity.includes('FLAG_KEEP_SCREEN_ON')
    && androidLegacyMainActivity.includes('searchPanelOpen')
    && androidLegacyMainActivity.includes('setSearchPanelOpen')
    && androidLegacyMainActivity.includes('dispatchTouchEvent')
    && androidLegacyMainActivity.includes('handleBackSwipe')
    && androidLegacyMainActivity.includes('BACK_SWIPE_EDGE_DP')
    && androidLegacyMainActivity.includes('onSaveInstanceState')
    && androidLegacyMainActivity.includes('showCurrentScreen')
    && androidLegacyMainActivity.includes('NavState')
    && androidLegacyMainActivity.includes('MAX_BACK_STACK')
    && androidLegacyMainActivity.includes('trimBackStack')
    && androidLegacyMainActivity.includes('perfLog')
    && androidLegacyMainActivity.includes('isHomeMode')
    && androidLegacyMainActivity.includes('fiches parents')
    && androidLegacyMainActivity.includes('repository.homeRecipes()')
    && androidLegacyMainActivity.includes('repository.childrenForParent')
    && androidLegacyMainActivity.includes('repository.collectionCount')
    && androidLegacyMainActivity.includes('addParentPath')
    && androidLegacyMainActivity.includes('parentTrail')
    && androidLegacyMainActivity.includes('panelGradient')
    && androidLegacyMainActivity.includes('R.drawable.ic_launcher')
    && androidLegacyMainActivity.includes('Recherche')
    && !androidLegacyMainActivity.includes('RECHERCHE ET FILTRES')
    && !androidLegacyMainActivity.includes('Filtres (')
    && !androidLegacyMainActivity.includes('selectedSeason')
    && !androidLegacyMainActivity.includes('selectedDifficulty')
    && !androidLegacyMainActivity.includes('selectedCategory')
    && !androidLegacyMainActivity.includes('browseAllRecipes')
    && !androidLegacyMainActivity.includes('recentIds')
    && !androidLegacyMainActivity.includes('Toutes fiches')
    && !androidLegacyMainActivity.includes('openSurpriseRecipe')
    && !androidLegacyMainActivity.includes('Surprise')
    && androidLegacyMainActivity.includes('copyIngredients')
    && androidLegacyMainActivity.includes('showShoppingList')
    && androidLegacyMainActivity.includes('buildShoppingText')
    && androidLegacyMainActivity.includes('copyShoppingList')
    && androidLegacyMainActivity.includes('addQuantityControls')
    && androidLegacyMainActivity.includes('scaleIngredient')
    && androidLegacyMainActivity.includes('mergedShoppingLines')
    && androidLegacyMainActivity.includes('Courses fusionnees')
    && androidLegacyMainActivity.includes('showDiagnostic')
    && androidLegacyMainActivity.includes('buildDiagnosticText')
    && androidLegacyMainActivity.includes('onTrimMemory')
    && androidLegacyMainActivity.includes('adjustedTextSize')
    && androidLegacyMainActivity.includes('PREF_SHOPPING_DONE')
    && androidLegacyMainActivity.includes('CheckBox')
    && androidLegacyMainActivity.includes('copyShoppingTodo')
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
    && androidLegacyMainActivity.includes('addDetailHero')
    && androidLegacyMainActivity.includes('detailHeroHeight')
    && androidLegacyMainActivity.includes('addHeroActions')
    && androidLegacyMainActivity.includes('addRecipeContentGrid')
    && androidLegacyMainActivity.includes('addBeforePanel')
    && androidLegacyMainActivity.includes('Avant de commencer')
    && androidLegacyRepository.includes('recipes-lite.json')
    && androidLegacyRepository.includes('search-index-lite.json')
    && androidLegacyRepository.includes('SEARCH_INDEX_ASSET')
    && androidLegacyRepository.includes('SearchEntry')
    && androidLegacyRepository.includes('homeRecipes')
    && androidLegacyRepository.includes('filterSearchable')
    && androidLegacyRepository.includes('searchSmart')
    && androidLegacyRepository.includes('scoreRecipe')
    && androidLegacyRepository.includes('fuzzyContains')
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
    && androidLegacyRepository.includes('cleanString')
    && androidLegacyRepository.includes('repairText')
    && androidLegacyRepository.includes('mojibakeScore')
    && androidLegacyRepository.includes('windows1252Byte')
    && androidLegacyImageLoader.includes('RGB_565')
    && androidLegacyImageLoader.includes('LruCache')
    && androidLegacyImageLoader.includes('newSingleThreadExecutor')
    && androidLegacyImageLoader.includes('cachedAfterQueue')
    && androidLegacyImageLoader.includes('prefetchDetail')
    && androidLegacyImageLoader.includes('trimMemory')
    && androidLegacyImageLoader.includes('cacheSummary')
    && androidLegacyImageLoader.includes('pendingKeys')
    && androidLegacyImageLoader.includes('detail-images/')
    && androidLegacyAdapter.includes('BaseAdapter')
    && androidLegacyAdapter.includes('FrameLayout')
    && androidLegacyAdapter.includes('Color.argb')
    && androidLegacyAdapter.includes('CARD_MIN_WIDTH_DP = 286')
    && androidLegacyAdapter.includes('resizeCardForParent')
    && androidLegacyAdapter.includes('cardWidthForParent')
    && androidLegacyAdapter.includes('(cardWidth * 9) / 16')
    && androidLegacyAdapter.includes('StateListDrawable')
    && androidLegacyAdapter.includes('prefetchAround')
    && androidLegacyAdapter.includes('sameItems')
    && androidLegacyAdapter.includes('setCompactCards')
    && androidLegacyAdapter.includes('setPrefetchEnabled')
    && androidLegacyAdapter.includes('compactCards')
    && androidLegacyAdapter.includes('prefetchEnabled')
    && androidLegacyAdapter.includes('selectablePanel')
    && androidLegacyAdapter.includes('holder.title.setText(recipe.title)')
    && !androidLegacyAdapter.includes('holder.count')
    && !androidLegacyAdapter.includes('holder.meta')
    && !androidLegacyAdapter.includes('holder.badge')
    && androidLegacyAdapter.includes('setEllipsize')
    && androidLegacyAdapter.includes('favoriteIds')
    && androidLegacyAdapter.includes('collectionCounts')
    && !/Gecko|WebView|ServerSocket|127\.0\.0\.1|LocalAssetServer/.test(androidLegacyMainActivity + androidLegacyRepository + androidLegacyImageLoader)
);
expect(
  'Les assets Android Legacy doivent etre generes en catalogue natif allege.',
  legacyAssetsScript.includes("require('jpeg-js')")
    && legacyAssetsScript.includes('MAX_IMAGE_WIDTH = 480')
    && legacyAssetsScript.includes('DETAIL_IMAGE_WIDTH = 1280')
    && legacyAssetsScript.includes('JPEG_QUALITY')
    && legacyAssetsScript.includes('DETAIL_JPEG_QUALITY')
    && legacyAssetsScript.includes('recipes-lite.json')
    && legacyAssetsScript.includes('search-index-lite.json')
    && legacyAssetsScript.includes('android-legacy-search-index')
    && legacyAssetsScript.includes('searchIndexEntry')
    && legacyAssetsScript.includes('detail-images')
    && legacyAssetsScript.includes('detailImage')
    && legacyAssetsScript.includes('variantGroups: Boolean(recipe.variantGroups)')
    && legacyAssetsScript.includes('additionalMasters: cleanArray(recipe.additionalMasters)')
    && legacyAssetsScript.includes('android-legacy-native-lite')
    && legacyAssetsScript.includes('copyLiteImage')
    && legacyAssetsScript.includes('recipe-card-images')
    && legacyAssetsScript.includes('recipe-images-optimized')
    && legacyAssetsScript.includes('repairMojibakeText')
    && legacyAssetsScript.includes('assertNoEncodingIssues')
    && legacyAssetsScript.includes('ENCODING_SUSPECT_RE')
    && packageJson.devDependencies?.['jpeg-js']
);
expect(
  'Le script de mise a jour app doit fabriquer et copier uniquement l APK Android Legacy.',
  updateAllAppsScript.includes('build-android-legacy.ps1')
    && updateAllAppsScript.includes('cook-note-android-legacy.apk')
    && updateAllAppsScript.includes('Get-CookNoteVersionName')
    && updateAllAppsScript.includes('cook-note-android-legacy-v$VersionName.apk')
    && updateAllAppsScript.includes('dist\\downloads')
    && updateAllAppsScript.includes('PublishRelease')
    && updateAllAppsScript.includes('publish-android-release.ps1')
    && !updateAllAppsScript.includes('build-android-modern.ps1')
    && !updateAllAppsScript.includes('cook-note-android-modern.apk')
);
expect(
  'Le script APK doit echouer si Gradle echoue.',
  buildScript.includes('$LASTEXITCODE') && buildScript.includes('Gradle a echoue')
);
expect(
  'Le script de publication Android doit pousser un asset GitHub stable.',
  publishScript.includes('gh release')
    && publishScript.includes('apps-v$VersionName')
    && publishScript.includes('cook-note-android-legacy.apk')
    && publishScript.includes('cook-note-android-legacy-v$VersionName.apk')
    && !publishScript.includes('cook-note-android-modern.apk')
);
expect(
  'Les APK telechargeables doivent rester hors dist Cloudflare Pages.',
  !buildSiteScript.includes("'downloads'")
    && exists('downloads/cook-note-android-legacy.apk')
    && exists(legacyVersionedApk)
    && !exists('dist/downloads')
);
expect(
  'Les APK servis depuis GitHub Raw ne doivent pas remplir le cache PWA local.',
  serviceWorker.includes("url.pathname.startsWith('/downloads/')")
);
expect(
  'App Android HD/Modern encore presente.',
  !exists('android-modern')
    && !exists('scripts/build-android-modern.ps1')
    && !exists('downloads/cook-note-android-modern.apk')
    && !appScript.includes('modern-app-hd')
    && !appScript.includes('android-modern-app')
    && !appScript.includes('ios-modern-pwa')
    && !styleSheet.includes('.mc-shell.modern-app-hd')
    && !packageText.includes('android:modern')
);
expect(
  'Les noms Android doivent afficher la version minimale.',
  androidLegacyStrings.includes('Cook Note Android 5.0+')
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
  'workflow ne construit plus que l APK Android Legacy',
  'Ne pas recreer Android Modern/HD',
  'scripts/build-android-legacy-assets.js',
  'Native Lite',
  'recipes-lite.json',
  '480px',
  '1280px',
  'detail-images',
  'jpeg-js',
  'GridView',
  'RGB_565',
  'refonte visuelle native premium',
  'cartes image',
  '16/9',
  'header compact avec stats locales',
  'hero',
  'fiche recette detaillee proche du site',
  'grille Ingredients/Etapes/Avant de commencer',
  'actions principales/secondaires',
  'pastilles',
  'favoris locaux',
  'recherche simple sans filtres',
  'recherche intelligente sans filtres',
  'index recherche precompile',
  'swipe retour bord gauche',
  'navigation restaurable',
  'prechargement images',
  'accueil parent Android',
  'cartes parent visibles',
  'menu deroulant',
  'selecteur natif',
  'rattachements parents additionnels',
  'nom APK versionne',
  'preparation choisie',
  'copie ingredients',
  'liste de courses locale',
  'courses cochables',
  'courses fusionnees',
  'quantites ajustables',
  'preferences locales discretes',
  'diagnostic hors ligne',
  'cache image adaptatif',
  'scroll fluide',
  'copie fiche',
  'partage fiche',
  'ecran actif',
  'bouton natif de mise a jour',
  'audit perf leger',
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
    && androidReadme.includes('fiche recette detaillee proche du site')
    && androidReadme.includes('grille Ingredients/Etapes/Avant de commencer')
    && androidReadme.includes('actions principales')
    && androidReadme.includes('favoris locaux')
    && androidReadme.includes('recherche simple sans filtres')
    && androidReadme.includes('recherche intelligente sans filtres')
    && androidReadme.includes('index recherche precompile')
    && androidReadme.includes('swipe retour bord gauche')
    && androidReadme.includes('navigation restaurable')
    && androidReadme.includes('prechargement images')
    && androidReadme.includes('accueil parent Android')
    && androidReadme.includes('cartes parent visibles')
    && androidReadme.includes('menu')
    && androidReadme.includes('selecteurs natifs uniquement')
    && androidReadme.includes('rattachements parents additionnels')
    && androidReadme.includes('nom APK versionne')
    && androidReadme.includes('preparation choisie')
    && androidReadme.includes('copie ingredients')
    && androidReadme.includes('liste de courses locale')
    && androidReadme.includes('courses cochables')
    && androidReadme.includes('courses fusionnees')
    && androidReadme.includes('quantites ajustables')
    && androidReadme.includes('preferences locales discretes')
    && androidReadme.includes('diagnostic hors ligne')
    && androidReadme.includes('cache image adaptatif')
    && androidReadme.includes('scroll fluide')
    && androidReadme.includes('copie fiche')
    && androidReadme.includes('partage fiche')
    && androidReadme.includes('ecran actif')
    && androidReadme.includes('audit perf leger')
    && androidReadme.includes('bouton natif de mise a jour')
    && androidReadme.includes('update-all')
    && androidReadme.includes('publish-all')
    && androidReadme.includes('cook-note-android-legacy.apk')
);
expect(
  'android-legacy/README.md doit rappeler que Legacy est la seule app installable.',
  androidReadme.includes('Cook Note Android 5.0+')
    && !androidReadme.includes('Android 8.0+')
    && !androidReadme.includes('cook-note-android-modern')
);
[
  'Android 5.0+',
  'Cook Note Android 5.0+',
  'cook-note-android-legacy.apk',
  'cook-note-android-legacy-vX.YY.apk',
  'raw.githubusercontent.com',
  '/downloads/',
  'npm run apps:update-all',
  'npm run apps:publish-all',
  'Mise a jour explicite',
  'workflow commun historique',
  'scripts/build-android-legacy-assets.js',
  'Native Lite',
  'recipes-lite.json',
  '480px',
  '1280px',
  'jpeg-js',
  'GridView',
  'RGB_565',
  'refonte visuelle native premium',
  'cartes image',
  '16/9',
  'header compact avec stats locales',
  'hero de fiche encadre',
  'fiche recette detaillee proche du site',
  'grille Ingredients/Etapes/Avant de commencer',
  'actions principales/secondaires',
  'pastilles',
  'favoris locaux',
  'recherche simple sans filtres',
  'recherche intelligente sans filtres',
  'index recherche precompile',
  'swipe retour bord gauche',
  'navigation restaurable',
  'prechargement images',
  'accueil parent Android',
  'cartes parent visibles',
  'menu deroulant',
  'selecteurs natifs de preparation',
  'rattachements parents additionnels',
  'nom APK versionne',
  'preparation choisie',
  'copie ingredients',
  'liste de courses locale',
  'courses cochables',
  'courses fusionnees',
  'quantites ajustables',
  'preferences locales discretes',
  'diagnostic hors ligne',
  'cache image adaptatif',
  'scroll fluide',
  'copie fiche',
  'partage fiche',
  'ecran actif',
  'bouton natif de mise a jour',
  'audit perf leger',
  'etapes numerotees',
  'sans GeckoView'
].forEach(fragment => {
  expect(`Documentation globale apps incomplete (${fragment}).`, appsWorkflowDoc.includes(fragment));
});
expect(
  'Documentation globale apps contient encore Android HD/Modern.',
  !appsWorkflowDoc.includes('Android 8.0+')
    && !appsWorkflowDoc.includes('cook-note-android-modern')
    && !appsWorkflowDoc.includes('modern-app-hd')
    && !appsWorkflowDoc.includes('CookNoteModernApp/HD')
);

expect(
  'Les balises iOS PWA doivent etre presentes.',
  read('index.html').includes('apple-mobile-web-app-capable')
    && read('index.html').includes('apple-mobile-web-app-title')
    && read('scripts/build-site.js').includes('apple-mobile-web-app-capable')
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
    legacyVersionedApk
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

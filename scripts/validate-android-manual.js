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
const androidGradleProperties = read('android-legacy/gradle.properties');
const androidReadme = read('android-legacy/README.md');
const workflowDoc = read('docs/android-legacy-workflow.md');
const appsWorkflowDoc = read('docs/apps-install-workflow.md');
const projectRules = read('COOK_NOTE_RULES.md');
const masterGuard = read('A_LIRE_EN_PREMIER.md');
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
const siteVersionName = (appScript.match(/const SITE_VERSION = 'v(\d+\.\d{2})';/) || [])[1] || '0.00';
const androidLinkVersionName = (appScript.match(/const ANDROID_LEGACY_APK_VERSION = '(\d+\.\d{2})';/) || [])[1] || '0.00';
const androidApkVersionName = (androidGradleProperties.match(/^cookNoteAndroidVersion=(\d+\.\d{2})$/m) || [])[1] || '0.00';
const legacyVersionedApk = `downloads/cook-note-android-legacy-v${androidApkVersionName}.apk`;

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
    && packageJson.scripts?.['apps:update-all']?.includes('-Release')
);
expect(
  'La publication app doit rester groupee via apps:publish-all.',
  packageJson.scripts?.['apps:publish-all']?.includes('update-all-apps.ps1')
    && packageJson.scripts?.['apps:publish-all']?.includes('-Release')
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
    && androidLegacyMainActivity.includes('collectionCardImageWidth')
    && androidLegacyMainActivity.includes('collectionCardWidth')
    && androidLegacyMainActivity.includes('imageLoader.load(choice.recipe.image, image, cardImageWidth, cardHeight)')
    && androidLegacyMainActivity.includes('hero.setContentDescription("Image de " + recipe.title)')
    && androidLegacyMainActivity.includes('image.setContentDescription("Image de " + choice.label)')
    && androidLegacyMainActivity.includes('(cardWidth * 9) / 16')
    && androidLegacyMainActivity.includes('RecipeAdapter')
    && androidLegacyAdapter.includes('holder.image.setContentDescription("Image de " + recipe.title)')
    && androidLegacyMainActivity.includes('Spinner')
    && androidLegacyMainActivity.includes('ArrayAdapter')
    && androidLegacyMainActivity.includes('loadDetail')
    && androidLegacyMainActivity.includes('addSection')
    && !androidLegacyMainActivity.includes('addInfoChips')
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
    && androidLegacyMainActivity.includes('setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS)')
    && androidLegacyMainActivity.includes('setImeOptions(EditorInfo.IME_ACTION_SEARCH)')
    && androidLegacyMainActivity.includes('setOnEditorActionListener')
    && androidLegacyMainActivity.includes('repository.searchSmart')
    && androidLegacyMainActivity.includes('SEARCH_DEBOUNCE_MS')
    && androidLegacyMainActivity.includes('scheduleApplyFilters')
    && androidLegacyMainActivity.includes('lastAppliedQuery')
    && androidLegacyMainActivity.includes('LIST_PREWARM_DELAY_MS')
    && androidLegacyMainActivity.includes('prewarmListRunnable')
    && androidLegacyMainActivity.includes('scheduleListPrewarm')
    && androidLegacyMainActivity.includes('cancelListPrewarm')
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
    && !androidLegacyMainActivity.includes('favoriteIds')
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
    && androidLegacyMainActivity.includes('rememberListPosition')
    && androidLegacyMainActivity.includes('restoreListPosition')
    && androidLegacyMainActivity.includes('setSelectionFromTop')
    && androidLegacyMainActivity.includes('releaseListSurface')
    && androidLegacyMainActivity.includes('releaseScreenImages')
    && androidLegacyMainActivity.includes('releaseImagesInTree')
    && androidLegacyMainActivity.includes('android.R.id.content')
    && androidLegacyMainActivity.includes('cancelPendingPrefetch')
    && androidLegacyMainActivity.includes('perfLog')
    && androidLegacyMainActivity.includes('PERF_LOG_ENABLED = false')
    && !androidLegacyMainActivity.includes('Log.d(')
    && !androidLegacyMainActivity.includes('import android.util.Log')
    && androidLegacyMainActivity.includes('isHomeMode')
    && androidLegacyMainActivity.includes('fiches principales')
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
    && androidLegacyMainActivity.includes('SERVING_COUNT_PATTERN')
    && androidLegacyMainActivity.includes('servingOptions')
    && androidLegacyMainActivity.includes('baseServings')
    && androidLegacyMainActivity.includes('"Personnes"')
    && !androidLegacyMainActivity.includes('actionButton("Partager"')
    && !androidLegacyMainActivity.includes('actionButton(isFavorite')
    && !androidLegacyMainActivity.includes('new Intent(Intent.ACTION_SEND)')
    && androidLegacyMainActivity.includes('"+ Courses"')
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
    && legacyAssetsScript.includes('loadAppHelpers')
    && legacyAssetsScript.includes('completeBeforeSections')
    && legacyAssetsScript.includes('getRecipeAllergens')
    && legacyAssetsScript.includes('getRecipeAverageWeights')
    && legacyAssetsScript.includes('getRecipeEquipment')
    && legacyAssetsScript.includes('getRecipePracticalSections')
    && legacyAssetsScript.includes('getDisplayNotes')
    && legacyAssetsScript.includes('getPrepTimeline')
    && legacyAssetsScript.includes('getLinkedRecipeRefs')
    && legacyAssetsScript.includes('Recettes liees')
    && legacyAssetsScript.includes('Technique')
    && legacyAssetsScript.includes('Poids moyens')
    && androidLegacyRepository.includes('recipes-lite.json')
    && androidLegacyRepository.includes('search-index-lite.json')
    && androidLegacyRepository.includes('SEARCH_INDEX_ASSET')
    && androidLegacyRepository.includes('SearchEntry')
    && androidLegacyRepository.includes('homeRecipes')
    && androidLegacyRepository.includes('buildHomeRecipes')
    && androidLegacyRepository.includes('searchableRecipes')
    && !androidLegacyRepository.includes('filterSearchable')
    && androidLegacyRepository.includes('searchSmart')
    && androidLegacyRepository.includes('scoreRecipe')
    && androidLegacyRepository.includes('fuzzyContains')
    && androidLegacyRepository.includes('SEARCH_CACHE_LIMIT')
    && androidLegacyRepository.includes('searchResultsCache')
    && androidLegacyRepository.includes('buildSearchResultsCache')
    && androidLegacyRepository.includes('removeEldestEntry')
    && androidLegacyRepository.includes('Collections.unmodifiableList(output)')
    && androidLegacyRepository.includes('titleWords')
    && androidLegacyRepository.includes('searchWords')
    && androidLegacyRepository.includes('splitWords')
    && androidLegacyRepository.includes('containsWord(entry.titleWords')
    && androidLegacyRepository.includes('fuzzyContains(entry.searchWords')
    && androidLegacyRepository.includes('childrenForParent')
    && androidLegacyRepository.includes('childrenByParent')
    && androidLegacyRepository.includes('buildChildrenByParent')
    && androidLegacyRepository.includes('addParentChild')
    && !androidLegacyRepository.includes('belongsToParent(recipe, parent.id, new HashSet<String>())')
    && !androidLegacyRepository.includes('private boolean belongsToParent')
    && androidLegacyRepository.includes('additionalMasters')
    && androidLegacyRepository.includes('collectionCounts')
    && androidLegacyRepository.includes('buildCollectionCounts')
    && androidLegacyRepository.includes('Collections.unmodifiableMap')
    && androidLegacyRepository.includes('parentTrail')
    && androidLegacyRepository.includes('recipe.master.length() == 0')
    && !androidLegacyRepository.includes('searchableOnly && recipe.isCollection()')
    && androidLegacyRepository.includes('json.optBoolean("variantGroups", false)')
    && androidLegacyRecipe.includes('variantGroups')
    && androidLegacyRepository.includes('detailImage')
    && !androidLegacyRepository.includes('matchesSeason')
    && !androidLegacyRepository.includes('matchesDifficulty')
    && androidLegacyRepository.includes('cleanString')
    && androidLegacyRepository.includes('repairText')
    && androidLegacyRepository.includes('mojibakeScore')
    && androidLegacyRepository.includes('windows1252Byte')
    && androidLegacyImageLoader.includes('RGB_565')
    && androidLegacyImageLoader.includes('LruCache')
    && androidLegacyImageLoader.includes('ThreadPoolExecutor')
    && androidLegacyImageLoader.includes('PriorityBlockingQueue')
    && androidLegacyImageLoader.includes('PRIORITY_VISIBLE')
    && androidLegacyImageLoader.includes('PRIORITY_PREFETCH')
    && androidLegacyImageLoader.includes('ImageTask')
    && androidLegacyImageLoader.includes('prefetchGeneration')
    && androidLegacyImageLoader.includes('cancelPendingPrefetch')
    && androidLegacyImageLoader.includes('cachedAfterQueue')
    && androidLegacyImageLoader.includes('CACHE_DIMENSION_BUCKET')
    && androidLegacyImageLoader.includes('normalizedDimension')
    && androidLegacyImageLoader.includes('removeWaitingTargetLocked')
    && androidLegacyImageLoader.includes('waitingTargets')
    && androidLegacyImageLoader.includes('registerWaitingTarget')
    && androidLegacyImageLoader.includes('takeWaitingTargets')
    && androidLegacyImageLoader.includes('detach(ImageView')
    && androidLegacyImageLoader.includes('unregisterWaitingTarget')
    && androidLegacyImageLoader.includes('prefetchDetail')
    && androidLegacyImageLoader.includes('trimMemory')
    && androidLegacyImageLoader.includes('cacheSummary')
    && androidLegacyImageLoader.includes('pendingKeys')
    && androidLegacyImageLoader.includes('visiblePendingKeys')
    && androidLegacyImageLoader.includes('!hasWaitingTargets(cacheKey)')
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
    && androidLegacyAdapter.includes('hasStableIds')
    && androidLegacyAdapter.includes('lastPrefetchPosition')
    && androidLegacyAdapter.includes('resetPrefetchWindow')
    && androidLegacyAdapter.includes('sameItems')
    && androidLegacyAdapter.includes('setCompactCards')
    && androidLegacyAdapter.includes('setPrefetchEnabled')
    && androidLegacyAdapter.includes('releaseView')
    && androidLegacyMainActivity.includes('handleListScrollStateChanged')
    && androidLegacyMainActivity.includes('setRecyclerListener')
    && androidLegacyMainActivity.includes('onMovedToScrapHeap')
    && androidLegacyMainActivity.includes('LIST_IDLE_PREWARM_DELAY_MS')
    && androidLegacyMainActivity.includes('LIST_VISIBLE_PREFETCH_LIMIT')
    && androidLegacyMainActivity.includes('scheduleVisibleRangePrewarm')
    && androidLegacyMainActivity.includes('runScheduledVisibleRangePrewarm')
    && androidLegacyMainActivity.includes('cancelVisibleRangePrewarm')
    && androidLegacyMainActivity.includes('visibleCardWidth')
    && androidLegacyAdapter.includes('compactCards')
    && androidLegacyAdapter.includes('prefetchEnabled')
    && androidLegacyAdapter.includes('selectablePanel')
    && androidLegacyAdapter.includes('holder.title.setText(recipe.title)')
    && !androidLegacyAdapter.includes('holder.count')
    && !androidLegacyAdapter.includes('holder.meta')
    && !androidLegacyAdapter.includes('holder.badge')
    && androidLegacyAdapter.includes('setEllipsize')
    && !androidLegacyAdapter.includes('favoriteIds')
    && androidLegacyAdapter.includes('collectionCounts')
    && !/Gecko|WebView|ServerSocket|127\.0\.0\.1|LocalAssetServer/.test(androidLegacyMainActivity + androidLegacyRepository + androidLegacyImageLoader)
);
expect(
  'Android Legacy doit garder une preference de theme native jour/nuit synchronisee avec la palette.',
  androidLegacyMainActivity.includes('PREF_THEME')
    && androidLegacyMainActivity.includes('THEME_DARK')
    && androidLegacyMainActivity.includes('THEME_LIGHT')
    && androidLegacyMainActivity.includes('Configuration.UI_MODE_NIGHT_NO')
    && androidLegacyMainActivity.includes('defaultThemeMode')
    && androidLegacyMainActivity.includes('applyThemePalette')
    && androidLegacyMainActivity.includes('setLightTheme(!lightTheme)')
    && androidLegacyMainActivity.includes('adapter.setLightTheme(lightTheme)')
    && androidLegacyMainActivity.includes('Mode jour')
    && androidLegacyMainActivity.includes('Mode nuit')
    && androidLegacyAdapter.includes('setLightTheme')
    && androidLegacyAdapter.includes('applyThemePalette')
);
expect(
  'Android Legacy doit activer R8 et le shrink resources sur l APK distribue.',
  androidBuildGradle.includes('minifyEnabled true')
    && androidBuildGradle.includes('shrinkResources true')
    && androidBuildGradle.includes('signingConfig signingConfigs.debug')
    && androidBuildGradle.includes("proguard-android-optimize.txt")
    && exists('android-legacy/app/proguard-rules.pro')
);
expect(
  'Les titres de cartes Android doivent rester fondus dans l image, sans cartouche noir lourd.',
  androidLegacyAdapter.includes('cardTitleOverlayGradient')
    && androidLegacyMainActivity.includes('cardTitleOverlayGradient')
    && !androidLegacyAdapter.includes('overlayEdge')
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
    && updateAllAppsScript.includes('app-release.apk')
    && updateAllAppsScript.includes('ReadAllText')
    && updateAllAppsScript.includes('Encoding]::UTF8')
    && updateAllAppsScript.includes('Get-CookNoteVersionName')
    && updateAllAppsScript.includes('android-legacy\\gradle.properties')
    && updateAllAppsScript.includes('cookNoteAndroidVersion')
    && updateAllAppsScript.includes('cook-note-android-legacy-v$VersionName.apk')
    && updateAllAppsScript.includes('Remove-StaleVersionedApks')
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
  'Versions site/APK non alignees.',
  androidGradleProperties.includes('cookNoteAndroidVersion=')
    && androidBuildGradle.includes('cookNoteAndroidVersion')
    && !androidBuildGradle.includes('SITE_VERSION')
    && legacyAssetsScript.includes('cookNoteAndroidVersion')
    && legacyAssetsScript.includes('Versions Cook Note non alignees')
    && updateAllAppsScript.includes('cookNoteAndroidVersion')
    && updateAllAppsScript.includes('Versions site/APK non alignees')
    && appScript.includes("const ANDROID_LEGACY_APK_VERSION = '")
    && appScript.includes('cook-note-android-legacy-v${ANDROID_LEGACY_APK_VERSION}.apk')
    && appScript.includes('Version APK ${ANDROID_LEGACY_APK_VERSION}')
    && siteVersionName === androidLinkVersionName
    && siteVersionName === androidApkVersionName
    && exists(`downloads/cook-note-android-legacy-v${siteVersionName}.apk`)
    && !appScript.includes('const APP_VERSION_NUMBER = SITE_VERSION')
    && !appScript.includes('cook-note-android-legacy-v${APP_VERSION_NUMBER}.apk')
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
  'parite site/app',
  'ne se met pas a jour automatiquement sur la tablette',
  'fonctionnalite visible du site',
  'tablette peu puissante',
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
  'recherche simple sans filtres',
  'recherche intelligente sans filtres',
  'index recherche precompile',
  'mots recherche predecoupes',
  'fuzzy sans split',
  'allocations recherche reduites',
  'cache resultats recherche borne',
  'requetes recentes reutilisees',
  'classement recherche memoise',
  'catalogue parent precompile',
  'enfants parents preclasses',
  'compteurs collection caches',
  'swipe retour bord gauche',
  'navigation restaurable',
  'prechargement images',
  'prechauffage images differe',
  'prechauffage visible apres scroll',
  'annulation prechauffage en fling',
  'prefetch ralenti hors inertie',
  'images visibles prioritaires',
  'file image prioritaire',
  'annulation prefetch obsolete',
  'cache image normalise',
  'nettoyage vues recyclees',
  'vues image recyclees detachees',
  'cibles image obsoletes liberees',
  'images ecran detachees avant remplacement',
  'chargements visibles coalesces',
  'decodages visibles obsoletes ignores',
  'prefetch carte borne',
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
  'selecteur de personnes',
  'allergenes',
  'poids moyens',
  'ecran actif',
  'bouton natif de mise a jour',
  'audit perf leger',
  'etapes numerotees',
  'sans WebView systeme et sans GeckoView',
  'assets/www'
].forEach(fragment => {
  expect(`Documentation Android manuelle incomplete (${fragment}).`, workflowDoc.includes(fragment));
});

[
  'parite site/app',
  'fonctionnalite visible du site',
  'Native Lite pour tablette peu puissante',
  'npm run apps:update-all'
].forEach(fragment => {
  expect(`Regle de parite Android absente des docs (${fragment}).`,
    workflowDoc.includes(fragment)
      && appsWorkflowDoc.includes(fragment)
      && androidReadme.includes(fragment)
      && projectRules.includes(fragment)
      && masterGuard.includes(fragment));
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
    && androidReadme.includes('recherche simple sans filtres')
    && androidReadme.includes('recherche intelligente sans filtres')
    && androidReadme.includes('index recherche precompile')
    && androidReadme.includes('mots recherche predecoupes')
    && androidReadme.includes('fuzzy sans split')
    && androidReadme.includes('allocations recherche reduites')
    && androidReadme.includes('cache resultats recherche borne')
    && androidReadme.includes('requetes recentes reutilisees')
    && androidReadme.includes('classement recherche memoise')
    && androidReadme.includes('catalogue parent precompile')
    && androidReadme.includes('enfants parents preclasses')
    && androidReadme.includes('compteurs collection caches')
    && androidReadme.includes('swipe retour bord gauche')
    && androidReadme.includes('navigation restaurable')
    && androidReadme.includes('prechargement images')
    && androidReadme.includes('prechauffage images differe')
    && androidReadme.includes('prechauffage visible apres scroll')
    && androidReadme.includes('annulation prechauffage en fling')
    && androidReadme.includes('prefetch ralenti hors inertie')
    && androidReadme.includes('images visibles prioritaires')
    && androidReadme.includes('file image prioritaire')
    && androidReadme.includes('annulation prefetch obsolete')
    && androidReadme.includes('cache image normalise')
    && androidReadme.includes('nettoyage vues recyclees')
    && androidReadme.includes('vues image recyclees detachees')
    && androidReadme.includes('cibles image obsoletes liberees')
    && androidReadme.includes('images ecran detachees avant remplacement')
    && androidReadme.includes('chargements visibles coalesces')
    && androidReadme.includes('decodages visibles obsoletes ignores')
    && androidReadme.includes('prefetch carte borne')
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
    && androidReadme.includes('selecteur de personnes')
    && androidReadme.includes('allergenes')
    && androidReadme.includes('poids moyens')
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
  'Mise a jour explicite ou parite site/app',
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
  'recherche simple sans filtres',
  'recherche intelligente sans filtres',
  'index recherche precompile',
  'mots recherche predecoupes',
  'fuzzy sans split',
  'allocations recherche reduites',
  'cache resultats recherche borne',
  'requetes recentes reutilisees',
  'classement recherche memoise',
  'catalogue parent precompile',
  'enfants parents preclasses',
  'compteurs collection caches',
  'swipe retour bord gauche',
  'navigation restaurable',
  'prechargement images',
  'prechauffage images differe',
  'prechauffage visible apres scroll',
  'annulation prechauffage en fling',
  'prefetch ralenti hors inertie',
  'images visibles prioritaires',
  'file image prioritaire',
  'annulation prefetch obsolete',
  'cache image normalise',
  'nettoyage vues recyclees',
  'vues image recyclees detachees',
  'cibles image obsoletes liberees',
  'images ecran detachees avant remplacement',
  'chargements visibles coalesces',
  'decodages visibles obsoletes ignores',
  'prefetch carte borne',
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
  'selecteur de personnes',
  'allergenes et poids moyens',
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
    .filter(file => {
      const normalized = file.replace(/\\/g, '/');
      return /\.(apk|aab)$/.test(normalized)
        && fs.existsSync(path.join(ROOT, normalized))
        && !allowedApks.has(normalized);
    });
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

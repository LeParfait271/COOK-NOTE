const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');
const { readAppSource, readStyleSource } = require('./lib/app-modules');

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
// Documents lus avec espaces normalises : on verifie les decisions, pas la mise en forme.
const readDoc = relativePath => read(relativePath).replace(/\s+/g, ' ');
const androidReadme = readDoc('android-legacy/README.md');
const workflowDoc = readDoc('docs/android-legacy-workflow.md');
const appsWorkflowDoc = readDoc('docs/apps-install-workflow.md');
const projectRules = readDoc('COOK_NOTE_RULES.md');
const masterGuard = readDoc('A_LIRE_EN_PREMIER.md');
const appScript = readAppSource();
const styleSheet = readStyleSource();
const buildSiteScript = read('scripts/build-site.js');
const serviceWorker = read('service-worker.js');
const buildScript = read('scripts/build-android-legacy.ps1');
const legacyAssetsScript = read('scripts/build-android-legacy-assets.js');
const updateAllAppsScript = read('scripts/update-all-apps.ps1');

const imageParityContext = { window: {} };
vm.createContext(imageParityContext);
vm.runInContext(read('recipes.js'), imageParityContext, { filename: 'recipes.js' });
vm.runInContext(read('app-art-images.js'), imageParityContext, { filename: 'app-art-images.js' });
const parityRecipes = imageParityContext.window.RECIPES || {};
const parityDarkImages = imageParityContext.window.COOK_NOTE_THEME_RECIPE_ART?.dark || {};
const missingParityImages = Object.entries(parityRecipes).filter(([id, recipe]) => {
  const publicPath = String(parityDarkImages[id] || recipe.image || '').replace(/^\/+/, '').replace(/\?.*$/, '');
  return !publicPath || !exists(publicPath);
});
expect(
  'Toutes les images Android doivent avoir une source identique au mode nuit courant du site.',
  Object.keys(parityDarkImages).length > 0 && missingParityImages.length === 0
);
const publishScript = read('scripts/publish-android-release.ps1');
const androidBuildGradle = read('android-legacy/app/build.gradle');
const androidLegacySettingsGradle = read('android-legacy/settings.gradle');
const androidLegacyManifest = read('android-legacy/app/src/main/AndroidManifest.xml');
const androidLegacyStrings = read('android-legacy/app/src/main/res/values/strings.xml');
// L'interface Native Lite est repartie entre MainActivity, ses ecrans et ses
// classes d'appui : tous les fichiers Java du paquet sauf ceux lus a part.
const androidLegacyDir = path.join(ROOT, 'android-legacy/app/src/main/java/fr/cooknote/legacy');
const androidLegacyMainActivity = fs.readdirSync(androidLegacyDir)
  .filter(file => file.endsWith('.java') && !['Recipe.java', 'CookNoteRepository.java', 'ImageLoader.java', 'RecipeAdapter.java'].includes(file))
  .sort((a, b) => (a === 'MainActivity.java' ? -1 : b === 'MainActivity.java' ? 1 : a.localeCompare(b)))
  .map(file => fs.readFileSync(path.join(androidLegacyDir, file), 'utf8'))
  .join('\n');
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
  buildScript.includes('scripts/build-android-legacy-assets.js')
    && (buildScript.includes('& $Node') || buildScript.includes('node scripts/build-android-legacy-assets.js'))
    && buildScript.includes('$LegacyApkOutput')
    && androidBuildGradle.includes('cook-note-lite')
    && androidBuildGradle.includes('assets.srcDirs = [legacyAssetRoot]')
    && androidBuildGradle.includes("noCompress += ['json']")
    && !androidBuildGradle.includes('org.mozilla.geckoview')
    && !androidLegacySettingsGradle.includes('maven.mozilla.org/maven2')
    && !androidLegacyManifest.includes('usesCleartextTraffic')
    && !androidLegacyManifest.includes('largeHeap')
    && androidLegacyMainActivity.includes('GridView')
    && androidLegacyMainActivity.includes('GridView.AUTO_FIT')
    && androidLegacyMainActivity.includes('setColumnWidth(dp(286))')
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
    && androidLegacyMainActivity.includes('addTopBar')
    && androidLegacyMainActivity.includes('iconButton(')
    && androidLegacyMainActivity.includes('R.drawable.ic_basket')
    && androidLegacyMainActivity.includes('shoppingBadge')
    && androidLegacyMainActivity.includes('home-hero.png')
    && !androidLegacyMainActivity.includes('home-logo.png')
    && androidLegacyMainActivity.includes('heroWordmark.setImageResource(R.drawable.cook_note_wordmark)')
    && exists('android-legacy/app/src/main/res/drawable-nodpi/cook_note_wordmark.png')
    && !legacyAssetsScript.includes("'home-logo.png'")
    && androidLegacyMainActivity.includes('PRACTICAL_FAMILY_TITLES')
    && exists('assets/brand/app-icon.png')
    && !androidLegacyMainActivity.includes('addAccentLine(header, 11, 0)')
    && !androidLegacyMainActivity.includes('INSPIRATION DU MATIN')
    && !androidLegacyMainActivity.includes('Que voulez-vous cuisiner ?')
    && !androidLegacyMainActivity.includes('Recherchez une recette, un ingredient ou une envie dans votre carnet.')
    && androidLegacyMainActivity.includes('applySystemChrome')
    && androidLegacyMainActivity.includes('StateListDrawable')
    && androidLegacyMainActivity.includes('selectablePanel')
    && androidLegacyMainActivity.includes('buttonPanel')
    && androidLegacyMainActivity.includes('Rechercher une recette ou un ingredient')
    && androidLegacyMainActivity.includes('clearSearch')
    && androidLegacyMainActivity.includes('"Recherche : "')
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
    && androidLegacyMainActivity.includes('"Choisir une variante"')
    && androidLegacyMainActivity.includes('Chaque choix affiche sa recette complete')
    && androidLegacyMainActivity.includes('Variante selectionnee : ')
    && androidLegacyMainActivity.includes('SharedPreferences')
    && !androidLegacyMainActivity.includes('favoriteIds')
    && androidLegacyMainActivity.includes('PREF_SHOPPING')
    && androidLegacyMainActivity.includes('PREF_KEEP_SCREEN_ON')
    && androidLegacyMainActivity.includes('PREF_QUANTITY_FACTOR')
    && !androidLegacyMainActivity.includes('PREF_TEXT_MODE')
    && !androidLegacyMainActivity.includes('PREF_COMPACT_CARDS')
    && !androidLegacyMainActivity.includes('PREF_OPEN_LAST')
    && !androidLegacyMainActivity.includes('SCREEN_DIAGNOSTIC')
    && androidLegacyMainActivity.includes('shopping.recipeIds')
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
    && androidLegacyMainActivity.includes('Toutes les categories')
    && androidLegacyMainActivity.includes('repository.homeRecipes()')
    && androidLegacyMainActivity.includes('repository.childrenForParent')
    && androidLegacyMainActivity.includes('repository.collectionCount')
    && androidLegacyMainActivity.includes('addParentPath')
    && androidLegacyMainActivity.includes('parentTrail')
    && androidLegacyMainActivity.includes('panelGradient')
    && androidLegacyMainActivity.includes('R.drawable.cook_note_wordmark')
    && androidLegacyMainActivity.includes('Rechercher une recette ou un ingredient')
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
    && androidLegacyMainActivity.includes('String buildText(IngredientSource source')
    && androidLegacyMainActivity.includes('copyShoppingList')
    && androidLegacyMainActivity.includes('addQuantityControls')
    && androidLegacyMainActivity.includes('scaleIngredient')
    && androidLegacyMainActivity.includes('List<ShoppingLine> mergedLines(')
    && androidLegacyMainActivity.includes('Courses fusionnees')
    && !androidLegacyMainActivity.includes('showDiagnostic')
    && !androidLegacyMainActivity.includes('buildDiagnosticText')
    && androidLegacyMainActivity.includes('onTrimMemory')
    && androidLegacyMainActivity.includes('adjustedTextSize')
    && androidLegacyMainActivity.includes('PREF_SHOPPING_DONE')
    && androidLegacyMainActivity.includes('CheckBox')
    && androidLegacyMainActivity.includes('copyShoppingTodo')
    && androidLegacyMainActivity.includes('copyRecipe')
    && androidLegacyMainActivity.includes('SERVING_COUNT_PATTERN')
    && androidLegacyMainActivity.includes('portions?')
    && androidLegacyMainActivity.includes('servingUnit')
    && androidLegacyMainActivity.includes('servingSectionTitle')
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
    && androidLegacyAdapter.includes('" recettes" : " recette"')
    && androidLegacyAdapter.includes('holder.meta.setVisibility(View.GONE)')
    && legacyAssetsScript.includes('loadAppHelpers')
    && legacyAssetsScript.includes('completeBeforeSections')
    && legacyAssetsScript.includes('dedupeBeforeSections')
    && legacyAssetsScript.includes('assertNoDuplicateBeforeItems')
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
    && !androidLegacyAdapter.includes('compactCards')
    && !androidLegacyAdapter.includes('lightTheme')
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
    && androidLegacyAdapter.includes('prefetchEnabled')
    && androidLegacyAdapter.includes('selectablePanel')
    && androidLegacyAdapter.includes('holder.title.setText(recipe.title)')
    && !androidLegacyAdapter.includes('holder.count')
    && androidLegacyAdapter.includes('holder.meta')
    && !androidLegacyAdapter.includes('holder.badge')
    && androidLegacyAdapter.includes('setEllipsize')
    && !androidLegacyAdapter.includes('favoriteIds')
    && androidLegacyAdapter.includes('collectionCounts')
    && !/Gecko|WebView|ServerSocket|127\.0\.0\.1|LocalAssetServer/.test(androidLegacyMainActivity + androidLegacyRepository + androidLegacyImageLoader)
);

const __clauses = ["!androidLegacyMainActivity.includes('addPrefsPanel')","!androidLegacyMainActivity.includes('Mode jour')","!androidLegacyMainActivity.includes('Texte 100%')","!androidLegacyMainActivity.includes('Cartes confort')","!androidLegacyMainActivity.includes('Derniere non')","!androidLegacyMainActivity.includes('Diagnostic hors ligne')","!androidLegacyMainActivity.includes('update.setText(\"MISE A JOUR')","androidLegacyMainActivity.includes('iconButton(R.drawable.ic_update, \"Mise a jour\"')","projectRules.includes('Texte 100%')","projectRules.includes('Cartes confort')","projectRules.includes('Derniere non')"];
__clauses.forEach(c => { let ok; try { ok = eval(c); } catch (e) { ok = 'ERR ' + e.message; } if (ok !== true) console.log('ECHEC', c); });
process.exit(0);

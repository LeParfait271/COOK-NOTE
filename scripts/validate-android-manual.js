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
    // Seul ajout autorise aux assets : le modele vocal du mode mains libres.
    && androidBuildGradle.includes('assets.srcDirs = [legacyAssetRoot, voiceModelAssetRoot]')
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
    && androidLegacyMainActivity.includes('Rechercher une recette ou un ingr\\u00E9dient')
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
    && androidLegacyMainActivity.includes('Pr\\u00E9paration')
    && androidLegacyMainActivity.includes('"Choisir une variante"')
    && androidLegacyMainActivity.includes('Chaque choix affiche sa recette compl\\u00E8te')
    && androidLegacyMainActivity.includes('Variante selectionnee : ')
    && androidLegacyMainActivity.includes('SharedPreferences')
    // Favoris et mode cuisine comme le site (v5.40, demande utilisateur).
    && androidLegacyMainActivity.includes('PREF_FAVORITES')
    && androidLegacyMainActivity.includes('void openFavorites(')
    && androidLegacyMainActivity.includes('void openCookMode(')
    && androidLegacyMainActivity.includes('R.drawable.ic_heart')
    && androidLegacyMainActivity.includes('next.setAlpha(0.01f)')
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
    && androidLegacyMainActivity.includes('Toutes les cat\\u00E9gories')
    && androidLegacyMainActivity.includes('repository.homeRecipes()')
    && androidLegacyMainActivity.includes('repository.childrenForParent')
    && androidLegacyMainActivity.includes('repository.collectionCount')
    && androidLegacyMainActivity.includes('addParentPath')
    && androidLegacyMainActivity.includes('parentTrail')
    && androidLegacyMainActivity.includes('panelGradient')
    && androidLegacyMainActivity.includes('R.drawable.cook_note_wordmark')
    && androidLegacyMainActivity.includes('Rechercher une recette ou un ingr\\u00E9dient')
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
    && androidLegacyMainActivity.includes('Courses fusionn\\u00E9es')
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
    && legacyAssetsScript.includes('Recettes liées')
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
expect(
  'Android Legacy doit exposer uniquement le theme nuit et des actions d accueil sobres.',
  !androidLegacyMainActivity.includes('addPrefsPanel')
    && !androidLegacyMainActivity.includes('Mode jour')
    && !androidLegacyMainActivity.includes('Texte 100%')
    && !androidLegacyMainActivity.includes('Cartes confort')
    && !androidLegacyMainActivity.includes('Derniere non')
    && !androidLegacyMainActivity.includes('Diagnostic hors ligne')
    && !androidLegacyMainActivity.includes('update.setText("MISE A JOUR')
    && androidLegacyMainActivity.includes('iconButton(R.drawable.ic_update, "Mise a jour"')
    && projectRules.includes('Texte 100%')
    && projectRules.includes('Cartes confort')
    && projectRules.includes('Derniere non')
);
expect(
  'Android Legacy doit activer R8 et le shrink resources sur l APK distribue.',
  androidBuildGradle.includes('minifyEnabled true')
    && androidBuildGradle.includes('shrinkResources true')
    && androidBuildGradle.includes("proguard-android-optimize.txt")
    && exists('android-legacy/app/proguard-rules.pro')
);
expect(
  'Android Legacy doit signer la release avec une cle dediee stable pour garder les mises a jour installables.',
  androidBuildGradle.includes('signingConfig signingConfigs.release')
    && androidBuildGradle.includes("android-legacy/signing")
    && androidBuildGradle.includes("keystore.properties")
    && !androidBuildGradle.includes('signingConfig signingConfigs.debug')
);
expect(
  'La cle release Android et son mot de passe ne doivent jamais etre versionnes.',
  !/(storePassword|keyPassword)\s+['"]/.test(androidBuildGradle)
    && !exists('android-legacy/app/cook-note-release.jks')
    && read('.gitignore').includes('android-legacy/signing/')
    && read('.gitignore').includes('*.jks')
);
expect(
  'Android Legacy doit permettre la verification et l installation guidee des mises a jour.',
  androidLegacyManifest.includes('android.permission.INTERNET')
    && androidLegacyManifest.includes('android.permission.REQUEST_INSTALL_PACKAGES')
    && androidLegacyMainActivity.includes('checkForUpdatesAsync')
    && androidLegacyMainActivity.includes('DownloadManager')
    && androidLegacyMainActivity.includes('UPDATE_MANIFEST_URL')
    && androidLegacyMainActivity.includes('launchInstall')
);
expect(
  'La liste de courses Android doit s ouvrir sur le telephone via un QR code natif au meme format que le site.',
  androidLegacyMainActivity.includes('final class QrCode')
    && androidLegacyMainActivity.includes('showShoppingTransferQr')
    && androidLegacyMainActivity.includes('https://cook-note.pages.dev/#courses=')
    && androidLegacyMainActivity.includes('SHOPPING_TRANSFER_MAX_ENTRIES = 30')
    && appScript.includes('SHOPPING_TRANSFER_MAX_ENTRIES = 30')
    && appScript.includes("SHOPPING_TRANSFER_KEY = 'courses'")
);
expect(
  'Les controles tactiles Android doivent reagir a la premiere pression sans prise de focus intermediaire.',
  !androidLegacyMainActivity.includes('setFocusableInTouchMode(true)')
    && (androidLegacyMainActivity.match(/new CheckBox\((?:this|host)\)/g) || []).length === 3
    && (androidLegacyMainActivity.match(/checkBox\.setFocusable\(false\)/g) || []).length === 3
    && (androidLegacyMainActivity.match(/checkBox\.setClickable\(true\)/g) || []).length === 3
);
(() => {
  const versionMatch = androidGradleProperties.match(/^cookNoteAndroidVersion=(\d+)\.(\d{2})$/m);
  const expectedCode = versionMatch ? Number(versionMatch[1]) * 1000 + Number(versionMatch[2]) : null;
  const expectedName = versionMatch ? `${versionMatch[1]}.${versionMatch[2]}` : null;
  let manifest = null;
  try {
    manifest = JSON.parse(read('downloads/android-latest-version.json'));
  } catch (error) {
    manifest = null;
  }
  expect(
    'Le manifeste de mise a jour Android (downloads/android-latest-version.json) doit exister et porter la meme version produit.',
    manifest !== null
      && expectedCode !== null
      && manifest.versionCode === expectedCode
      && manifest.versionName === expectedName
      && typeof manifest.apkUrl === 'string'
      && manifest.apkUrl.length > 0
  );
})();
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
    && legacyAssetsScript.includes('DETAIL_IMAGE_WIDTH = 960')
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
    && legacyAssetsScript.includes('APP_ART_IMAGES_FILE')
    && legacyAssetsScript.includes('COOK_NOTE_THEME_RECIPE_ART')
    && legacyAssetsScript.includes('resizeBilinear')
    && !legacyAssetsScript.includes('resizeNearest')
    && legacyAssetsScript.includes("assets', 'recipes', 'cards")
    && legacyAssetsScript.includes("assets', 'recipes', 'heroes")
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
  'Versions Android publiees incoherentes.',
  androidGradleProperties.includes('cookNoteAndroidVersion=')
    && androidBuildGradle.includes('cookNoteAndroidVersion')
    && !androidBuildGradle.includes('SITE_VERSION')
    && legacyAssetsScript.includes('cookNoteAndroidVersion')
    && legacyAssetsScript.includes('Versions Cook Note non alignees')
    && updateAllAppsScript.includes('cookNoteAndroidVersion')
    && updateAllAppsScript.includes('Versions site/APK non alignees')
    && appScript.includes("const ANDROID_LEGACY_APK_VERSION = '")
    && appScript.includes("ANDROID_LEGACY_STABLE_APK_FILE = 'cook-note-android-legacy.apk'")
    && appScript.includes('https://raw.githubusercontent.com/LeParfait271/COOK-NOTE/main/downloads')
    && androidLinkVersionName === androidApkVersionName
    && Number(siteVersionName.replace('.', '')) >= Number(androidApkVersionName.replace('.', ''))
    && exists(`downloads/cook-note-android-legacy-v${androidApkVersionName}.apk`)
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
  ['docs/android-legacy-workflow.md', workflowDoc],
  ['docs/apps-install-workflow.md', appsWorkflowDoc],
  ['android-legacy/README.md', androidReadme]
].forEach(([file, text]) => {
  expect(`${file}: le build APK doit rester sur demande explicite.`, text.includes('npm run apps:update-all') && text.toLowerCase().includes('demande explicite'));
  expect(`${file}: regle de parite site/app absente.`, text.includes('parite site/app') && text.includes('Native Lite'));
  expect(`${file}: Android HD/Modern encore mentionne.`, !text.includes('Android 8.0+') && !text.includes('cook-note-android-modern'));
});
expect('Regle de parite Android absente des regles.', projectRules.includes('parite site/app') && projectRules.includes('Native Lite pour tablette peu puissante') && masterGuard.includes('parite site/app'));
expect('android-legacy/README.md doit pointer vers la documentation complete.', androidReadme.includes('docs/android-legacy-workflow.md') && androidReadme.includes('Cook Note Android 5.0+'));
expect('Documentation Android : chaine de production des assets absente.', workflowDoc.includes('scripts/build-android-legacy-assets.js') && workflowDoc.includes('recipes-lite.json') && workflowDoc.includes('sans WebView systeme et sans GeckoView'));
expect('Documentation apps : liens de telechargement absents.', appsWorkflowDoc.includes('cook-note-android-legacy.apk') && appsWorkflowDoc.includes('cook-note-android-legacy-vX.YY.apk') && appsWorkflowDoc.includes('raw.githubusercontent.com') && appsWorkflowDoc.includes('/downloads/'));
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

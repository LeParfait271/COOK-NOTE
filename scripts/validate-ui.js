const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const files = {
  appImages: fs.readFileSync(path.join(ROOT, 'app-images.js'), 'utf8'),
  app: fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8'),
  index: fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'),
  recipe: fs.readFileSync(path.join(ROOT, 'recipe.js'), 'utf8'),
  style: fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8'),
  server: fs.readFileSync(path.join(ROOT, 'server.js'), 'utf8'),
  admin: fs.readFileSync(path.join(ROOT, 'admin.js'), 'utf8'),
  adminHtml: fs.readFileSync(path.join(ROOT, 'admin.html'), 'utf8'),
  adminCss: fs.readFileSync(path.join(ROOT, 'admin.css'), 'utf8'),
  rules: fs.readFileSync(path.join(ROOT, 'COOK_NOTE_RULES.md'), 'utf8'),
  packageJson: fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')
};
const errors = [];
const recipeTabsAreSticky = [...files.style.matchAll(/\.recipe-tabs\s*\{([^}]*)\}/g)]
  .some(match => /position:\s*sticky/.test(match[1]));

function expect(label, condition) {
  if (!condition) errors.push(label);
}

expect('Recherche ingredients integree absente.', files.app.includes('scoreIngredientSearch') && files.app.includes('ingredientMeta') && files.app.includes('ingredient-match-badge'));
expect('Recherche separee ingredients encore presente.', !files.app.includes('ingredient-search-input') && !files.app.includes('ingredient-search-help') && !files.app.includes('FridgeAssistant'));
expect('Recherche sans selecteur de difficulte reel.', files.app.includes('SEARCH_DIFFICULTY_OPTIONS') && files.app.includes('matchesDifficultyFilter') && files.app.includes('difficultyFilter') && files.app.includes('recipe-difficulty-filter') && files.style.includes('.search-filter-row') && files.rules.includes('selecteur de difficulte'));
expect('Recherche par intention absente.', files.app.includes('getRecipeIntentLabels') && files.app.includes('sans cuisson') && files.app.includes('à préparer à l’avance') && files.app.includes('congelable'));
expect('Recherche intentions de nuit absente.', files.app.includes('soir de semaine') && files.app.includes('air fryer') && files.app.includes('reste pomme de terre') && files.app.includes('plancha'));
expect('Filtres avances encore presents.', !files.app.includes('QUICK_FILTERS') && !files.app.includes('QuickFilterBar') && !files.style.includes('quick-filter-row'));
expect('Page techniques absente.', files.app.includes('TECHNIQUE_GUIDES') && files.app.includes('TechniquesView'));
expect('Techniques de cuisinier incompletes.', files.app.includes('Émincer') && files.app.includes('Monder des tomates') && files.app.includes('Abaisser une pâte') && files.app.includes('Foncer un moule') && files.app.includes('Étuver') && files.app.includes('Macaroner') && files.app.includes('Lisser'));
expect('Techniques saisir/badigeonner absentes.', files.app.includes("id: 'saisir'") && files.app.includes("id: 'badigeonner'"));
expect('Technique beurrer trop large.', !files.app.includes("'beurrer', 'fariner le moule'"));
expect('Liens vers techniques absents.', files.app.includes('buildTechniqueTargets') && files.app.includes('openTechnique') && files.style.includes('inline-technique-link'));
expect('Liens automatiques sans limite de mot.', files.app.includes('findLinkedTextMatch') && files.app.includes('isLinkedTextBoundary'));
expect('Liens automatiques sans priorite titre/alias.', files.app.includes('aliasesByTerm') && files.app.includes('priority') && files.app.includes('titleNormalized.includes(normalized)'));
expect('Liens automatiques fragiles avec accents/ligatures.', files.app.includes('buildNormalizedIndexMap') && files.app.includes('indexMap[end]'));
expect('Fiche technique sans liens automatiques.', files.app.includes('technical-card') && files.app.includes("h('dd', null, renderLinkedText(item.value || item.text || ''"));
expect('Anti-gaspillage oeufs absent.', files.app.includes('getEggPartUsage') && files.app.includes('getEggWasteRecipeRefs') && files.app.includes('Anti-gaspillage blancs d’œufs') && files.app.includes('Anti-gaspillage jaunes d’œufs'));
expect('Surbrillance technique absente.', files.app.includes('highlightedTechniqueId') && files.style.includes('techniquePulse') && files.style.includes('techniquePulse 1s ease-in-out 5'));
expect('Centrage des liens techniques absent.', files.app.includes('scrollElementToViewportCenter') && files.app.includes('targetTechniqueId') && files.app.includes('visualViewport') && files.app.includes('settleTimer') && !files.app.includes('cook-note:technique-target'));
expect('Route /techniques absente du serveur.', files.server.includes("url.pathname === '/techniques'"));
expect('Export recette propre absent.', files.app.includes('recipeExportText') && files.app.includes('Copier fiche'));
expect('Resume recette premium absent.', files.app.includes('recipe-summary-panel') && files.style.includes('.recipe-summary-panel'));
expect('Passe premium composants absente.', files.style.includes('content-visibility: auto') && files.style.includes('.recipe-card::before') && files.style.includes('.variant-card::before') && files.app.includes("name: 'spark'"));
expect('Palette de commandes absente.', files.app.includes('function CommandPalette') && files.app.includes('commandOpen') && files.app.includes('commandRef') && files.app.includes('openCommandPalette') && files.style.includes('.command-palette') && files.style.includes('.command-input-shell'));
expect('Transitions de vue absentes.', files.app.includes('function runViewTransition') && files.app.includes('document.startViewTransition') && files.style.includes('::view-transition-new(root)'));
expect('Dock recette absent.', files.app.includes('function RecipeCommandDock') && files.app.includes('recipe-command-dock') && files.style.includes('.recipe-command-dock') && files.style.includes('--dock-progress'));
expect('Accent visuel pilote par contenu absent.', files.app.includes('--ambient-accent') && files.style.includes('--ambient-accent') && files.style.includes('var(--ambient-accent'));
expect('Cartes recettes pas limitees au titre seul.', /h\('div', \{ className: 'card-body' \},\s*h\('h3', null, recipe\.title\)\s*\)/.test(files.app) && !files.app.includes("h('div', { className: 'tag-line' }") && !files.app.includes("h('p', { className: 'card-meta' }") && !files.app.includes("className: 'video-badge'") && !files.app.includes("className: isFavorite ? 'fav-btn active' : 'fav-btn'"));
expect('Cartes variantes parent pas limitees au titre seul.', /h\('span', \{ className: 'variant-card-body' \},\s*h\('strong', null, variant\.label \|\| item\.title\)\s*\)/.test(files.app) && !files.app.includes("h('small', null, categoryLine(item))") && !files.app.includes("variant-card-quicklook"));
expect('Grille des fiches parentes sans respiration dediee.', files.app.includes('master-recipe-grid') && files.style.includes('.master-recipe-grid') && files.style.includes('.home-view .master-recipe-grid .recipe-card.master-card .card-media'));
expect('Grille longue sans rendu incremental.', files.app.includes('GRID_INITIAL_RENDER_COUNT') && files.app.includes('recipe-grid-load-more') && files.style.includes('.recipe-grid-load-more'));
expect('Allergenes mollusques confondent moule cuisson et coquillage.', files.app.includes('mouleToolPattern') && files.app.includes('molluskAllergenText') && files.rules.includes('moule de cuisson'));
expect('Correction affichage encodage absente.', files.app.includes('repairMojibakeText') && files.app.includes('normalizeLoadedRecipeValue') && files.recipe.includes('repairText') && files.recipe.includes('normalizeValue'));
expect('Collections encore traitees comme variantes bloquees.', files.app.includes('CollectionLinksPanel') && files.app.includes('recipes.filter(recipe => !recipe.master)') && !files.app.includes('variantSelection') && !files.app.includes('setActiveId(activeRecipe.master)') && !files.style.includes('variant-picker-panel-selected'));
expect('Sous-titre de carte recette encore base sur portions/rendement.', files.app.includes('getRecipeVariantLabel') && files.app.includes('countInlineVariantGroups') && !files.app.includes('item.yield || difficultyText(item)') && !files.app.includes("recipe.yield || ''"));
expect('Etapes de variantes inline non separees.', files.app.includes('getSelectedInlineVariantSteps') && files.app.includes('selectedInlineVariantGroup?.group') && files.app.includes('variant-group:${selectedInlineVariantGroup.index}'));
expect('Onglets recette mobile non bornes.', files.style.includes('.recipe-tabs button span') && files.style.includes('text-overflow: ellipsis') && files.style.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'));
expect('Swipe mobile recette pas assez explicite ou onglets sticky revenus.', files.app.includes('mobile-swipe-hint') && files.app.includes('Glisse pour passer') && files.style.includes('.mobile-swipe-hint') && !recipeTabsAreSticky && files.rules.includes('Si un swipe change de panneau, afficher un indice discret'));
expect('Swipe mobile recette encore limite a la grille.', files.app.includes("className: 'recipe-view'") && files.app.includes('onTouchStart: hasSelectedVariant ? handleMobileTabSwipeStart : undefined') && files.app.includes("h('div', { className: 'recipe-detail-grid' }") && files.rules.includes('accroche a toute la vue recette'));
expect('Recherche mobile non bornee.', files.style.includes('max-height: calc(100dvh - 28px)') && files.style.includes('.search-modal-field input'));
expect('Mode menu absent.', files.app.includes('MenuPlannerPanel') && files.app.includes('buildMenuSuggestion') && files.app.includes('addMenuToShopping') && files.style.includes('.menu-planner-grid'));
expect('Mode menu sans compatibilite culinaire.', files.app.includes('getMenuRecipeProfile') && files.app.includes('mainProfile.heavy && profile.heavy') && files.app.includes("families.includes('starch')"));
expect('Mode menu sans themes.', files.app.includes('MENU_THEMES') && files.app.includes('menuThemeScore') && files.app.includes('menu-theme-tabs') && files.app.includes('menu-planner-reason'));
expect('Mode menu propose encore des composants seuls.', files.app.includes('servable: !isComponent') && files.app.includes("role: isComponent ? 'component'") && files.app.includes('profile.servable'));
expect('Mode menu sans arbitrage explicite des roles.', files.app.includes('MENU_COMPONENT_IDS') && files.app.includes('MENU_SIDE_IDS') && files.app.includes('MENU_STARTER_IDS') && files.app.includes("'riz_cantonnais'") && files.app.includes("'cookies_sales_variantes'") && files.app.includes("'cake_tomate_chorizo_feta'") && files.app.includes("'pate_sucree'") && files.app.includes("'pates_tarte_variantes'") && files.app.includes("'pains_burgers_brioche'") && files.app.includes("'sauce_caramel'"));
expect('Mode menu sans score de coherence.', files.app.includes('menuBalanceScore') && files.app.includes('menuPairPenalty') && files.app.includes('menuLeadReason') && files.app.includes('Cohérence'));
expect('Mode menu sans accords expliques.', files.app.includes('menuPairAffinity') && files.app.includes('menuItemReason') && files.app.includes('annotateMenuItems') && files.style.includes('.menu-planner-note'));
expect('Mode menu sans plan de service.', files.app.includes('buildMenuServicePlan') && files.app.includes('buildMenuTimeline') && files.app.includes('buildMenuStress') && files.app.includes('buildMenuEquipmentConflicts') && files.style.includes('.menu-service-grid'));
expect('Mode menu sans historique ou dessert fin.', files.app.includes('menuDessertAffinity') && files.app.includes('menuSignature') && files.app.includes('menuHistory') && files.app.includes('STORAGE_KEYS.menuHistory'));
expect('Mode menu changement de carte/global absent.', files.app.includes('buildMenuItemReplacement') && files.app.includes('itemOffsets') && files.app.includes('menuItemSlotKey') && files.app.includes('Autre menu') && files.style.includes('.menu-planner-head-actions'));
expect('Mode menu sans proportions par personnes.', files.app.includes('menuServingFactorFor') && files.app.includes('menuFactorById') && files.app.includes('peopleCount') && files.style.includes('.menu-serving-control'));
expect('Mode menu perdu au retour recette.', files.app.includes('markMenuPlannerReturnState') && files.app.includes('openMenuRecipe') && files.app.includes('menuPlannerOpen: Boolean(enabled)') && files.rules.includes('le bouton retour du navigateur doit rouvrir le meme mode menu'));
expect('Mode menu semaine force encore des desserts longs.', files.app.includes('isWeeknightDessert') && files.app.includes("theme.id !== 'semaine' || isWeeknightDessert(recipe)") && files.rules.includes('Mode menu soir de semaine'));
expect('Mode menu sans registre accords professionnels.', files.app.includes('MENU_PAIRING_RULES') && files.app.includes('creamy-sauce-needs-neutral-side') && files.app.includes('need-crunch-or-freshness') && files.rules.includes('tomate expressive interdite avec sauce cremeuse'));
expect('Liste courses sans ameliorations permanentes.', files.app.includes('shoppingPurchaseHint') && files.app.includes('shoppingSmartGroupKey') && files.app.includes('filterShoppingListData') && files.app.includes('shoppingOwned') && files.style.includes('.shopping-owned-btn'));
expect('Admin sans diagnostic ajout recette.', files.admin.includes('renderDiagnostics') && files.admin.includes('inferDiagnosticRole') && files.adminHtml.includes('recipe-diagnostics') && files.adminCss.includes('.admin-diagnostic-panel'));
expect('Detection composants menu trop fragile.', files.app.includes('MENU_COMPONENT_PATTERNS') && files.app.includes('appareil') && files.app.includes('fourrage') && files.app.includes('condiment'));
expect('Precision cuilleres mal rangee.', files.app.includes('spoonPrecisionLabel') && files.app.includes('SPOON_WEIGHT_NOTE') && files.app.includes("add('measures', 'Repère indicatif'") && !files.style.includes('.average-weight-note'));
expect('Materiel necessaire encore dans la colonne droite.', !files.app.includes("add('equipment', 'Matériel nécessaire'"));
expect('Notes pratiques encore classees en double.', files.app.includes('noteAlreadyClassified') && files.app.includes('!noteAlreadyClassified(note)') && files.app.includes('storageNotes.includes(note)'));
expect('CSS mobile nav incoherent.', files.style.includes('grid-template-columns: repeat(5, 1fr)'));
expect('Scrollbars visibles dans panneaux longs.', files.style.includes('.recipe-panel::-webkit-scrollbar') && files.style.includes('.notes-panel::-webkit-scrollbar'));
expect('CSS print propre absent.', files.style.includes('@media print') && files.style.includes('.recipe-summary-panel'));
expect('Ancienne section dashboard encore presente.', !files.app.includes('function HomeDashboard') && !files.style.includes('.home-dashboard'));
expect('Ancienne section collections encore presente.', !files.app.includes('SmartCollections') && !files.style.includes('smart-collection'));
expect('Fallback image carte absent.', files.app.includes('onError: event =>') && files.app.includes('event.currentTarget.src = recipe.image'));
expect('Manifest images non charge ou non utilise.', files.index.includes('/assets/image-manifest.js?v=228') && files.index.includes('/app-images.js?v=228') && files.appImages.includes('IMAGE_MANIFEST') && files.appImages.includes('window.CookNoteImages') && files.app.includes('imageSizeAttrs(cardImage)') && files.app.includes('imageBackgroundStyle(recipe.image'));
expect('Mode cuisine revenu.', !files.app.includes('Mode cuisine') && !files.app.includes('focusMode') && !files.style.includes('recipe-focus-mode') && !files.style.includes('focus-toggle') && !files.style.includes('focus-action'));
expect('Boutons minuteurs revenus.', !files.app.includes('step-timer') && !files.style.includes('step-timer') && !files.app.includes('timerEnd') && !files.app.includes('timerLabel') && !files.app.includes('cooking-step-card') && !files.style.includes('cooking-step-actions'));
expect('Fiche rapide variantes sans etat vide.', files.app.includes('recipe-summary-empty') && files.app.includes('Sélectionne une variante pour afficher les informations de la fiche rapide.'));
expect('Compteur catalogue footer absent ou statique.', files.app.includes('getCatalogRecipeStats') && files.app.includes('site-footer-count') && files.app.includes('countInlineVariantGroups(recipe)') && files.rules.includes('compteur catalogue automatique') && files.style.includes('.site-footer-count'));
expect('Footer annee encadree revenue.', files.app.includes('Cook Note \\u00a9 2026.') && !files.app.includes('site-footer-year') && !files.style.includes('.site-footer-year') && files.rules.includes("l'annee dans une pilule separee"));
expect('Version footer absente.', files.app.includes("const SITE_VERSION = 'v2.28'") && files.app.includes("const SITE_UPDATED_AT = '30/06/26'") && files.app.includes('site-footer-version'));
expect('Boutons partager/imprimer visibles hors fiches recettes.', files.app.includes('isCategoryCollectionRecipe') && files.app.includes('Object.values(CATEGORY_PARENT_IDS).includes(recipe.id)') && files.app.includes("recipe.masterType === 'collection'") && files.app.includes('!isCategoryCollectionRecipe(selectedRecipe)') && files.app.includes("showRecipeUtilities && h(Button, { variant: 'ghost', className: 'icon-square', onClick: () => setShareOpen(true)") && files.app.includes("showRecipeUtilities && h(Button, { variant: 'ghost', className: 'icon-square', onClick: () => window.print()") && files.app.includes('showRecipeUtilities && h(SharePanel') && files.rules.includes('jamais sur les categories, collections ou fiches parentes'));
expect('Footer premium absent.', files.app.includes('site-footer-identity') && files.app.includes('site-footer-stats') && files.style.includes('.site-footer-inner::before') && files.style.includes('.site-footer-action:hover'));
expect('Bouton installation Android Legacy footer absent.', files.app.includes('APP_INSTALL_OPTIONS') && files.app.includes('github.com/LeParfait271/COOK-NOTE/raw/main/downloads') && files.app.includes('raw.githubusercontent.com/LeParfait271/COOK-NOTE/main/downloads') && files.app.includes('APP_REPO_FILE_BASE') && files.app.includes('Telecharger l APK') && files.app.includes('Lien brut') && files.app.includes('Page GitHub') && files.app.includes('Lien stable') && files.app.includes('app-install-file') && files.app.includes('cook-note-android-legacy-v${APP_VERSION_NUMBER}.apk') && files.app.includes('cook-note-android-legacy.apk') && files.app.includes('Android 5.0+') && files.app.includes('AppInstallPanel') && files.app.includes('site-footer-install-${option.id}') && files.style.includes('.site-footer-actions') && files.style.includes('.app-install-modal') && files.style.includes('.app-install-links') && files.style.includes('.app-install-file') && !files.app.includes('cook-note-android-modern') && !files.app.includes('Android 8.0+') && !files.app.includes('APK HD premium'));
expect('App HD/Modern supprimee.', !files.app.includes('detectAppEnvironment') && !files.app.includes('modern-app-hd') && !files.app.includes('android-modern-app') && !files.app.includes('ios-modern-pwa') && !files.style.includes('.mc-shell.modern-app-hd') && !files.packageJson.includes('android:modern') && files.rules.includes('Application Android unique'));
expect('Barre de fiche active encore sticky.', files.style.includes('.recipe-command-dock') && !files.style.includes('position: sticky;\n  top: 68px') && !files.style.includes('top: 60px;') && files.rules.includes('recipe-command-dock'));
expect('Script validate-ui non branche au check.', files.packageJson.includes('scripts/validate-ui.js'));

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation UI OK.');

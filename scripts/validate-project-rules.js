const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const rulesPath = path.join(ROOT, 'COOK_NOTE_RULES.md');
const masterGuardPath = path.join(ROOT, 'A_LIRE_EN_PREMIER.md');
const agentsPath = path.join(ROOT, 'AGENTS.md');
const designSystemPath = path.join(ROOT, 'docs', 'design-system.md');
const packagePath = path.join(ROOT, 'package.json');
const packageLockPath = path.join(ROOT, 'package-lock.json');
const validators = {
  recipes: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-recipes.js'), 'utf8'),
  ui: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-ui.js'), 'utf8'),
  production: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-production.js'), 'utf8'),
  featureCoverage: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-feature-coverage.js'), 'utf8'),
  cache: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-cache-version.js'), 'utf8'),
  visualImages: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-visual-image-duplicates.js'), 'utf8'),
  imageCleanup: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-image-cleanup.js'), 'utf8'),
  dist: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-dist.js'), 'utf8'),
  buildSite: fs.readFileSync(path.join(ROOT, 'scripts', 'build-site.js'), 'utf8'),
  performance: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-performance-budget.js'), 'utf8'),
  preflight: fs.readFileSync(path.join(ROOT, 'scripts', 'preflight.js'), 'utf8'),
  bumpVersion: fs.readFileSync(path.join(ROOT, 'scripts', 'bump-version.js'), 'utf8'),
  audit: fs.readFileSync(path.join(ROOT, 'scripts', 'audit-recipes.js'), 'utf8'),
  androidManual: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-android-manual.js'), 'utf8'),
  legacyAssets: fs.readFileSync(path.join(ROOT, 'scripts', 'build-android-legacy-assets.js'), 'utf8'),
  visualSmoke: fs.readFileSync(path.join(ROOT, 'tests', 'visual-smoke.spec.js'), 'utf8'),
  updateAllApps: fs.readFileSync(path.join(ROOT, 'scripts', 'update-all-apps.ps1'), 'utf8'),
  androidWorkflow: fs.readFileSync(path.join(ROOT, 'docs', 'android-legacy-workflow.md'), 'utf8'),
  appsWorkflow: fs.readFileSync(path.join(ROOT, 'docs', 'apps-install-workflow.md'), 'utf8'),
  workflow: fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'cook-note.yml'), 'utf8'),
  wrangler: fs.existsSync(path.join(ROOT, 'wrangler.toml')) ? fs.readFileSync(path.join(ROOT, 'wrangler.toml'), 'utf8') : '',
  architecture: fs.readFileSync(path.join(ROOT, 'docs', 'architecture.md'), 'utf8'),
  completeGuide: fs.readFileSync(path.join(ROOT, 'GUIDE_COMPLET.txt'), 'utf8'),
  windowsCheck: fs.readFileSync(path.join(ROOT, 'check.ps1'), 'utf8'),
  style: fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8'),
  adminCss: fs.readFileSync(path.join(ROOT, 'admin.css'), 'utf8'),
  gitignore: fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8'),
  app: fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8'),
  packageJson: fs.readFileSync(packagePath, 'utf8'),
  packageLock: fs.existsSync(packageLockPath) ? fs.readFileSync(packageLockPath, 'utf8') : ''
};
const errors = [];

function expect(label, condition) {
  if (!condition) errors.push(label);
}

expect('Fichier de regles Cook Note absent.', fs.existsSync(rulesPath));
expect('Garde-fou maitre A_LIRE_EN_PREMIER.md absent.', fs.existsSync(masterGuardPath));
expect('Pointeur agents AGENTS.md absent.', fs.existsSync(agentsPath));
expect('Design system Cook Note absent.', fs.existsSync(designSystemPath));
expect('package-lock.json absent: installations CI non reproductibles.', fs.existsSync(packageLockPath));

const rules = fs.existsSync(rulesPath) ? fs.readFileSync(rulesPath, 'utf8') : '';
const masterGuard = fs.existsSync(masterGuardPath) ? fs.readFileSync(masterGuardPath, 'utf8') : '';
const agentsGuide = fs.existsSync(agentsPath) ? fs.readFileSync(agentsPath, 'utf8') : '';
const designSystem = fs.existsSync(designSystemPath) ? fs.readFileSync(designSystemPath, 'utf8') : '';

[
  'Lois qualite permanentes',
  'Ne jamais degrader',
  'Tolerance zero dette technique',
  'Priorite a la stabilite',
  'Performance mesurable',
  'Securite par defaut',
  'Architecture durable',
  'Validation continue',
  'Auto-evaluation',
  "Rapport d'intervention"
].forEach(fragment => {
  expect(`A_LIRE_EN_PREMIER.md: loi qualite absente (${fragment}).`, masterGuard.includes(fragment));
});
expect('COOK_NOTE_RULES.md: rappel des lois qualite absent.', rules.includes('lois qualite permanentes') && rules.includes('ne jamais degrader') && rules.includes('validation continue'));
expect('COOK_NOTE_RULES.md: lien design system absent.', rules.includes('docs/design-system.md') && rules.includes('prefers-reduced-motion'));
expect('Design system incomplet.', designSystem.includes('--ds-radius-md') && designSystem.includes('120ms') && designSystem.includes('200ms') && designSystem.includes('320ms') && designSystem.includes('--ds-card-image-motion') && designSystem.includes('250ms') && designSystem.includes('focus visible') && designSystem.includes('prefers-reduced-motion'));
[
  'Silent Design',
  'Cinematic UI Engine',
  'Magnetic Interaction Engine',
  'Color Intelligence Engine',
  'Breathing Layout Engine',
  'Eye Tracking Simulator',
  'Subconscious Quality Engine',
  'Screenshot Test',
  'Award Winning Design',
  'First Impression Optimizer',
  'Premium Value Perception'
].forEach(fragment => {
  expect(`Principe design premium absent (${fragment}).`,
    designSystem.includes(fragment) && rules.includes(fragment));
});
expect('Garde-fou design premium absent du maitre.', masterGuard.includes('Silent Design') && masterGuard.includes('premiere impression'));
expect('Tokens design system site absents.', validators.style.includes('--ds-color-background') && validators.style.includes('--ds-space-8: 64px') && validators.style.includes('--ds-radius-md: 10px') && validators.style.includes('--ds-motion-fast: 120ms') && validators.style.includes('--ds-motion-slow: 320ms') && validators.style.includes('--ds-ease-out') && validators.style.includes('prefers-reduced-motion'));
expect('Tokens design system admin absents.', validators.adminCss.includes('--ds-color-background') && validators.adminCss.includes('--ds-space-8: 64px') && validators.adminCss.includes('--ds-radius-md: 10px') && validators.adminCss.includes('--ds-motion-fast: 120ms') && validators.adminCss.includes('--ds-motion-slow: 320ms') && validators.adminCss.includes('--ds-ease-out') && validators.adminCss.includes('prefers-reduced-motion'));

[
  'A_LIRE_EN_PREMIER.md',
  'arrondir au multiple de `5g`',
  'vanille selon gout ou arôme vanille selon dosage indiqué sur la bouteille',
  'cassonade ou vergeoise',
  'poivre du moulin',
  'sortir le beurre environ 45 a 60min avant',
  'Materiel necessaire',
  'coulis_fraise',
  'Chaque recette feuille doit avoir une image locale unique',
  'Aucune image recette ne doit venir du web',
  'Les donnees recette ne doivent jamais contenir de champs publics de source',
  'pas de presque-doublon',
  'npm run validate:visual-images',
  'assets/recipes/heroes/',
  'assets/recipes/cards/',
  'assets/image-manifest.js',
  'npm run generate:image-manifest',
  'npm run optimize:images',
  'npm run audit:images',
  'representer le plat exact',
  'rendu vectoriel plat',
  'nouveau nom de fichier stable',
  'montrer le visuel et attendre validation utilisateur',
  'Regenerer le sitemap',
  'score de completude',
  'La recherche doit comprendre les intentions',
  'Le mode menu doit rester un outil de decision direct',
  'Mode menu : accords dessert',
  'Mode menu soir de semaine',
  'MENU_PAIRING_RULES',
  'Historique des menus',
  'reseau d abord avec cache de secours',
  'images publiques immutables',
  'retourner le cache directement',
  'console.log',
  'bump la version des assets',
  'node scripts/preflight.js',
  'npm run build',
  'scripts/validate-dist.js',
  '`dist/`',
  'modules runtime extraits de `app.js`',
  'app-images.js',
  'app-art-images.js',
  'node scripts/bump-version.js --next',
  'scripts/optimize-selected-images.ps1',
  'app Android Legacy est un projet secondaire manuel',
  'parite site/app',
  'fonctionnalite visible du site',
  'Native Lite pour tablette peu puissante',
  'Application Android unique',
  'app Android HD/Modern est supprimee',
  'Mise a jour app obligatoire en workflow commun',
  'Cook Note Android 5.0+',
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
  'quantites ajustables',
  'courses fusionnees',
  'preferences locales discretes',
  'diagnostic hors ligne',
  'cache image adaptatif',
  'scroll fluide',
  'Android 5.0+',
  'npm run apps:update-all',
  'porter en Native Lite',
  'npm run apps:publish-all',
  'recherche temporisee',
  'decode image serialise',
  'coalescence chargements image',
  'chargements visibles coalesces',
  'decodages visibles obsoletes ignores',
  'images visibles prioritaires',
  'file image prioritaire',
  'annulation prefetch obsolete',
  'cache image normalise',
  'nettoyage vues recyclees',
  'vues image recyclees detachees',
  'cibles image obsoletes liberees',
  'images ecran detachees avant remplacement',
  'prechargement images borne',
  'prechauffage images differe',
  'prechauffage visible apres scroll',
  'annulation prechauffage en fling',
  'prefetch ralenti hors inertie',
  'position de grille conservee',
  'liberation memoire de liste',
  'pile retour bornee',
  'workflow ne construit maintenant que l APK Android Legacy',
  'scripts/build-android-legacy-assets.js',
  'Native Lite',
  'Qualite app',
  'recipes-lite.json',
  'GridView',
  'ImageLoader',
  'RGB_565',
  '480px',
  '1280px',
  'detail-images',
  'jpeg-js',
  'infos rapides en pastilles',
  'etapes numerotees',
  'sans source externe',
  'pas de WebView systeme',
  'pas de GeckoView ARMv7',
  'WebView systeme',
  'serveur HTTP local `127.0.0.1`',
  'assets/www',
  'npm run android:legacy:update-apk',
  'npm run android:legacy:publish-release',
  'docs/apps-install-workflow.md',
  'npm run audit:security',
  'cook-note-android-legacy.apk',
  'cook-note-android-legacy-vX.YY.apk',
  'meme version produit `X.YY`',
  'anciens `downloads/cook-note-android-legacy-v*.apk`',
  'apps-vX.YY',
  'github.com/LeParfait271/COOK-NOTE/raw/main/downloads',
  'raw.githubusercontent.com',
  '/downloads/',
  'docs/android-legacy-workflow.md',
  'npm run validate:android',
  'diffs image anormalement larges',
  'Le panier courses doit regrouper',
  'Liste de courses : mode `J’ai déjà`',
  'Export compact',
  'registre de couverture des features',
  'npm run validate:performance',
  'admin d\'ajout recette',
  'reparation anti-mojibake',
  'detection des bases et composants',
  'batch multi-recettes',
  'dashboard de sante du catalogue',
  'audit visuel',
  'sans rajouter de sections gadget',
  'Silent Design obligatoire',
  'Cinematic UI Engine',
  'Magnetic Interaction Engine',
  'Color Intelligence Engine',
  'Breathing Layout Engine',
  'Eye Tracking Simulator',
  'Subconscious Quality Engine',
  'Screenshot Test',
  'Award Winning Design',
  'First Impression Optimizer',
  'Premium Value Perception',
  'motion system `120ms / 200ms / 320ms`',
  'tokens du design system',
  'jamais sur les categories, collections ou fiches parentes',
  'ne doivent pas garder de trace de source externe',
  'leur propre URL `/recette/id`',
  'ancien panneau de variante selectionnee',
  'Ne pas afficher toutes les recettes enfants en vrac',
  'rattachements parents additionnels',
  'lecture native claire et premium',
  'cartes image',
  '16/9',
  'hero de fiche encadre',
  'fiche recette detaillee proche du site',
  'grille Ingredients/Etapes/Avant de commencer',
  'actions principales/secondaires',
  'cartes parent visibles',
  'menu deroulant',
  'nom APK versionne',
  'recipe-command-dock',
  'ne doit jamais etre sticky ni fixed',
  'Sous le nom d\'une carte recette',
  'toutes les categories de la fiche',
  '`Toppings frites` = Accompagnements/Sauces'
].forEach(fragment => {
  expect(`Regle manquante dans COOK_NOTE_RULES.md (${fragment}).`, rules.includes(fragment));
});

[
  'Ordre de lecture obligatoire',
  'COOK_NOTE_RULES.md',
  'docs/architecture.md',
  'docs/design-system.md',
  'Autonomie et autorisations',
  'Zones sensibles',
  'Interdits forts',
  'dist/',
  'Android Legacy',
  'powershell.exe -ExecutionPolicy Bypass -File .\\check.ps1',
  'npm run build',
  'npm run apps:update-all',
  'Pas de secret dans Git'
].forEach(fragment => {
  expect(`Garde-fou maitre incomplet (${fragment}).`, masterGuard.includes(fragment));
});

expect('AGENTS.md ne pointe pas vers le garde-fou maitre.', agentsGuide.includes('A_LIRE_EN_PREMIER.md') && agentsGuide.includes('COOK_NOTE_RULES.md'));

expect('Validation arrondi grammes non branchee.', validators.recipes.includes('checkRoundedLargeGramAmounts'));
expect('Validation dosage vanille non branchee.', validators.recipes.includes('checkVanillaDosage'));
expect('Validation cassonade/vergeoise non branchee.', validators.recipes.includes('checkBrownSugarWording'));
expect('Validation poivre du moulin non branchee.', validators.recipes.includes('checkPepperWording'));
expect('Validation unites non metriques non branchee.', validators.recipes.includes('NON_METRIC_UNIT_RE'));
expect('Validation images uniques non branchee.', validators.recipes.includes('leafImageHashes'));
expect('Validation sources recette interdites non branchee.', validators.recipes.includes('FORBIDDEN_RECIPE_SOURCE_KEYS') && validators.recipes.includes('image externe interdite'));
expect('Validation doublons visuels non branchee.', validators.visualImages.includes('PERCEPTUAL_CORRELATION_LIMIT') && validators.packageJson.includes('scripts/validate-visual-image-duplicates.js'));
expect('Validation images optimisees non branchee.', validators.recipes.includes('assets/recipes/heroes') && validators.recipes.includes('master PNG introuvable'));
expect('Validation chemins images locaux non branchee.', validators.recipes.includes('image locale introuvable') && validators.recipes.includes('image recette non optimisee'));
expect('Validation miniatures cartes non branchee.', validators.production.includes('assets/recipes/cards') && validators.production.includes('miniature carte introuvable'));
expect('Validation manifest images non branchee.', validators.packageJson.includes('scripts/generate-image-manifest.js') && validators.production.includes('assets/image-manifest.js') && validators.cache.includes('assets/image-manifest.js'));
expect('Validation nettoyage images non branchee.', validators.imageCleanup.includes('image presente mais non utilisee') && validators.imageCleanup.includes('aucun id recette correspondant') && validators.packageJson.includes('scripts/validate-image-cleanup.js'));
expect('Validation materiel necessaire colonne droite non branchee.', validators.ui.includes('Materiel necessaire encore dans la colonne droite'));
expect('Validation anti-doublon notes pratiques non branchee.', validators.ui.includes('Notes pratiques encore classees en double'));
expect('Validation recherche intention non branchee.', validators.ui.includes('Recherche par intention absente'));
expect('Validation panier courses noms proches non branchee.', fs.readFileSync(path.join(ROOT, 'scripts', 'validate-quantities.js'), 'utf8').includes('test_panier_noms'));
expect('Validation production non branchee.', validators.production.includes('Validation production OK.') && validators.packageJson.includes('scripts/validate-production.js'));
expect('Build production dist non branche.', validators.packageJson.includes('"build": "node scripts/build-site.js"') && validators.packageJson.includes('scripts/validate-dist.js') && validators.dist.includes('Validation dist OK.'));
expect('Build production masque encore une absence ou un echec Terser.', validators.packageJson.includes('"terser"') && validators.packageLock.includes('node_modules/terser') && validators.packageJson.includes('scripts/build-site.js') && validators.buildSite.includes('Dependance terser absente') && validators.buildSite.includes('Minification JavaScript impossible'));
expect('Sortie Cloudflare Pages dist non declaree.', validators.wrangler.includes('pages_build_output_dir = "dist"') && validators.workflow.includes('npm run build') && validators.workflow.includes('cook-note-dist'));
expect('Artefact dist Cloudflare Pages non versionne.', !/(^|\n)dist\/(\r?\n|$)/.test(validators.gitignore) && validators.architecture.includes('`dist/` est versionne comme artefact public Cloudflare Pages') && rules.includes('`dist/` est versionne comme artefact public Cloudflare Pages'));
expect('Build command Cloudflare Pages non documentee.', validators.wrangler.includes('Build command: npm run build') && validators.architecture.includes('Build command : `npm run build`') && validators.architecture.includes('No build command specified') && rules.includes('Build command: npm run build'));
expect('Guide complet encore aligne sur une ancienne architecture sans build.', validators.completeGuide.includes('scripts/build-site.js') && validators.completeGuide.includes('Build output directory: dist') && !validators.completeGuide.includes('site public React sans build'));
expect('Guide complet expose encore le serveur admin en production.', validators.completeGuide.includes('back-office sont reserves a la maintenance locale') && !validators.completeGuide.includes("Si l'admin doit etre accessible en ligne"));
expect('Module runtime images non protege.', validators.packageJson.includes('node --check app-images.js') && validators.packageJson.includes('node --check app-art-images.js') && validators.production.includes('/app-images.js') && validators.production.includes('/app-art-images.js') && validators.cache.includes('app-images.js') && validators.cache.includes('app-art-images.js') && validators.dist.includes("'app-images.js'") && validators.dist.includes("'app-art-images.js'") && validators.preflight.includes('/app-images.js') && validators.preflight.includes('/app-art-images.js'));
expect('Validation couverture features non branchee.', validators.packageJson.includes('scripts/validate-feature-coverage.js'));
expect('Garde-fou Lecture chef temperature absent.', rules.includes('La Lecture chef ne doit jamais deduire un service froid') && validators.featureCoverage.includes('service froid faux positif') && validators.featureCoverage.includes('pates_pesto_tomates_mozzarella') && validators.featureCoverage.includes('signal proteine faux positif'));
expect('Validation cache/version non branchee.', validators.cache.includes('Validation cache/version OK.') && validators.packageJson.includes('scripts/validate-cache-version.js'));
expect('Validateurs encore couples a la version de release.', validators.cache.includes('ne doit pas contenir de version/date de release en dur') && !validators.bumpVersion.includes("write('scripts/validate-ui.js'") && validators.ui.includes('siteAssetVersion') && rules.includes('Les validateurs ne doivent pas porter la version de release courante en dur') && validators.architecture.includes('Les validateurs ne portent pas la version courante en dur'));
expect('Validation budget performance non branchee.', validators.packageJson.includes('scripts/validate-performance-budget.js'));
expect('Validation cache image immutable non branchee.', validators.performance.includes('IMMUTABLE_IMAGE_PATHS') && validators.performance.includes('logs runtime interdits'));
expect('Script bump-version non branche.', validators.bumpVersion.includes('Version Cook Note') && validators.bumpVersion.includes('ANDROID_LEGACY_APK_VERSION') && validators.bumpVersion.includes('cookNoteAndroidVersion') && validators.packageJson.includes('scripts/bump-version.js'));
expect('Preflight non branche.', validators.preflight.includes('Preflight Cook Note OK.') && validators.preflight.includes('findFreePort') && validators.preflight.includes('validateDiffScope') && validators.packageJson.includes('scripts/preflight.js'));
expect('Optimisation ciblee images non branchee.', fs.existsSync(path.join(ROOT, 'scripts', 'optimize-selected-images.ps1')) && validators.packageJson.includes('optimize-selected-images.ps1'));
expect('Audit recettes non branche.', validators.audit.includes('Audit recettes OK') && validators.packageJson.includes('scripts/audit-recipes.js'));
expect('Audit images non branche.', validators.packageJson.includes('scripts/audit-images.js'));
expect('Workflow Android manuel non documente.', validators.androidWorkflow.includes('projet secondaire') && validators.androidWorkflow.includes('parite site/app') && validators.androidWorkflow.includes('ne se met pas a jour automatiquement sur la tablette') && validators.androidWorkflow.includes('fonctionnalite visible du site') && validators.androidWorkflow.includes('tablette peu puissante') && validators.androidWorkflow.includes('npm run apps:update-all') && validators.androidWorkflow.includes('npm run apps:publish-all') && validators.androidWorkflow.includes('npm run android:legacy:update-apk') && validators.androidWorkflow.includes('npm run android:legacy:publish-release') && validators.androidWorkflow.includes('cook-note-android-legacy.apk') && validators.androidWorkflow.includes('cook-note-android-legacy-vX.YY.apk') && validators.androidWorkflow.includes('rattachements parents additionnels') && validators.androidWorkflow.includes('refonte visuelle native premium') && validators.androidWorkflow.includes('cartes image') && validators.androidWorkflow.includes('16/9') && validators.androidWorkflow.includes('hero de fiche encadre') && validators.androidWorkflow.includes('fiche recette detaillee proche du site') && validators.androidWorkflow.includes('grille Ingredients/Etapes/Avant de commencer') && validators.androidWorkflow.includes('actions principales/secondaires') && validators.androidWorkflow.includes('cartes parent 16/9 visibles') && validators.androidWorkflow.includes('menu deroulant') && validators.androidWorkflow.includes('nom APK versionne') && validators.androidWorkflow.includes('recherche simple sans filtres') && validators.androidWorkflow.includes('recherche intelligente sans filtres') && validators.androidWorkflow.includes('index recherche precompile') && validators.androidWorkflow.includes('mots recherche predecoupes') && validators.androidWorkflow.includes('fuzzy sans split') && validators.androidWorkflow.includes('allocations recherche reduites') && validators.androidWorkflow.includes('cache resultats recherche borne') && validators.androidWorkflow.includes('requetes recentes reutilisees') && validators.androidWorkflow.includes('classement recherche memoise') && validators.androidWorkflow.includes('catalogue parent precompile') && validators.androidWorkflow.includes('enfants parents preclasses') && validators.androidWorkflow.includes('compteurs collection caches') && validators.androidWorkflow.includes('swipe retour bord gauche') && validators.androidWorkflow.includes('navigation restaurable') && validators.androidWorkflow.includes('prechargement images') && validators.androidWorkflow.includes('prechauffage images differe') && validators.androidWorkflow.includes('prechauffage visible apres scroll') && validators.androidWorkflow.includes('annulation prechauffage en fling') && validators.androidWorkflow.includes('prefetch ralenti hors inertie') && validators.androidWorkflow.includes('chargements visibles coalesces') && validators.androidWorkflow.includes('decodages visibles obsoletes ignores') && validators.androidWorkflow.includes('images visibles prioritaires') && validators.androidWorkflow.includes('file image prioritaire') && validators.androidWorkflow.includes('annulation prefetch obsolete') && validators.androidWorkflow.includes('cache image normalise') && validators.androidWorkflow.includes('nettoyage vues recyclees') && validators.androidWorkflow.includes('vues image recyclees detachees') && validators.androidWorkflow.includes('cibles image obsoletes liberees') && validators.androidWorkflow.includes('images ecran detachees avant remplacement') && validators.androidWorkflow.includes('prefetch carte borne') && validators.androidWorkflow.includes('courses cochables') && validators.androidWorkflow.includes('courses fusionnees') && validators.androidWorkflow.includes('quantites ajustables') && validators.androidWorkflow.includes('preferences locales discretes') && validators.androidWorkflow.includes('diagnostic hors ligne') && validators.androidWorkflow.includes('cache image adaptatif') && validators.androidWorkflow.includes('scroll fluide') && validators.androidWorkflow.includes('audit perf leger') && validators.androidWorkflow.includes('Ne pas remettre de filtres dans la recherche Android Legacy') && validators.androidWorkflow.includes('Ne pas recreer Android Modern/HD') && validators.androidWorkflow.includes('scripts/build-android-legacy-assets.js') && validators.androidWorkflow.includes('Native Lite') && validators.androidWorkflow.includes('recipes-lite.json') && validators.androidWorkflow.includes('480px') && validators.androidWorkflow.includes('1280px') && validators.androidWorkflow.includes('detail-images') && validators.androidWorkflow.includes('jpeg-js') && validators.androidWorkflow.includes('GridView') && validators.androidWorkflow.includes('RGB_565') && validators.androidWorkflow.includes('pastilles') && validators.androidWorkflow.includes('etapes numerotees') && validators.androidWorkflow.includes('sans WebView systeme et sans GeckoView') && validators.androidWorkflow.includes('assets/www'));
expect('Workflow apps global non documente.', validators.appsWorkflow.includes('Android 5.0+') && validators.appsWorkflow.includes('Cook Note Android 5.0+') && validators.appsWorkflow.includes('parite site/app') && validators.appsWorkflow.includes('fonctionnalite visible du site') && validators.appsWorkflow.includes('tablette peu puissante') && validators.appsWorkflow.includes('cook-note-android-legacy.apk') && validators.appsWorkflow.includes('cook-note-android-legacy-vX.YY.apk') && validators.appsWorkflow.includes('rattachements parents additionnels') && validators.appsWorkflow.includes('refonte visuelle native premium') && validators.appsWorkflow.includes('cartes image') && validators.appsWorkflow.includes('16/9') && validators.appsWorkflow.includes('hero de fiche encadre') && validators.appsWorkflow.includes('fiche recette detaillee proche du site') && validators.appsWorkflow.includes('grille Ingredients/Etapes/Avant de commencer') && validators.appsWorkflow.includes('actions principales/secondaires') && validators.appsWorkflow.includes('cartes parent') && validators.appsWorkflow.includes('menu deroulant') && validators.appsWorkflow.includes('nom APK versionne') && validators.appsWorkflow.includes('recherche simple sans filtres') && validators.appsWorkflow.includes('recherche intelligente sans filtres') && validators.appsWorkflow.includes('index recherche precompile') && validators.appsWorkflow.includes('mots recherche predecoupes') && validators.appsWorkflow.includes('fuzzy sans split') && validators.appsWorkflow.includes('allocations recherche reduites') && validators.appsWorkflow.includes('cache resultats recherche borne') && validators.appsWorkflow.includes('requetes recentes reutilisees') && validators.appsWorkflow.includes('classement recherche memoise') && validators.appsWorkflow.includes('catalogue parent precompile') && validators.appsWorkflow.includes('enfants parents preclasses') && validators.appsWorkflow.includes('compteurs collection caches') && validators.appsWorkflow.includes('swipe retour bord gauche') && validators.appsWorkflow.includes('navigation restaurable') && validators.appsWorkflow.includes('prechargement images') && validators.appsWorkflow.includes('prechauffage images differe') && validators.appsWorkflow.includes('prechauffage visible apres scroll') && validators.appsWorkflow.includes('annulation prechauffage en fling') && validators.appsWorkflow.includes('prefetch ralenti hors inertie') && validators.appsWorkflow.includes('chargements visibles coalesces') && validators.appsWorkflow.includes('decodages visibles obsoletes ignores') && validators.appsWorkflow.includes('images visibles prioritaires') && validators.appsWorkflow.includes('file image prioritaire') && validators.appsWorkflow.includes('annulation prefetch obsolete') && validators.appsWorkflow.includes('cache image normalise') && validators.appsWorkflow.includes('nettoyage vues recyclees') && validators.appsWorkflow.includes('vues image recyclees detachees') && validators.appsWorkflow.includes('cibles image obsoletes liberees') && validators.appsWorkflow.includes('images ecran detachees avant remplacement') && validators.appsWorkflow.includes('prefetch carte borne') && validators.appsWorkflow.includes('courses cochables') && validators.appsWorkflow.includes('courses fusionnees') && validators.appsWorkflow.includes('quantites ajustables') && validators.appsWorkflow.includes('preferences locales discretes') && validators.appsWorkflow.includes('diagnostic hors ligne') && validators.appsWorkflow.includes('cache image adaptatif') && validators.appsWorkflow.includes('scroll fluide') && validators.appsWorkflow.includes('audit perf leger') && validators.appsWorkflow.includes('sans filtres de') && validators.appsWorkflow.includes('apps-vX.YY') && validators.appsWorkflow.includes('github.com/LeParfait271/COOK-NOTE/raw/main/downloads') && validators.appsWorkflow.includes('raw.githubusercontent.com') && validators.appsWorkflow.includes('/downloads/') && validators.appsWorkflow.includes('npm run apps:update-all') && validators.appsWorkflow.includes('npm run apps:publish-all') && validators.appsWorkflow.includes('Mise a jour explicite ou parite site/app') && validators.appsWorkflow.includes('workflow commun historique') && validators.appsWorkflow.includes('scripts/build-android-legacy-assets.js') && validators.appsWorkflow.includes('Native Lite') && validators.appsWorkflow.includes('recipes-lite.json') && validators.appsWorkflow.includes('480px') && validators.appsWorkflow.includes('1280px') && validators.appsWorkflow.includes('jpeg-js') && validators.appsWorkflow.includes('GridView') && validators.appsWorkflow.includes('RGB_565') && validators.appsWorkflow.includes('pastilles') && validators.appsWorkflow.includes('etapes numerotees') && validators.appsWorkflow.includes('sans GeckoView') && !validators.appsWorkflow.includes('cook-note-android-modern') && !validators.appsWorkflow.includes('Android 8.0+'));
expect('Script apps groupe non branche.', validators.packageJson.includes('"apps:update-all"') && validators.packageJson.includes('"apps:publish-all"') && validators.updateAllApps.includes('build-android-legacy.ps1') && validators.updateAllApps.includes('cook-note-android-legacy.apk') && validators.updateAllApps.includes('Get-CookNoteVersionName') && validators.updateAllApps.includes('Sync-AndroidApkVersion') && validators.updateAllApps.includes('ANDROID_LEGACY_APK_VERSION') && validators.updateAllApps.includes('cook-note-android-legacy-v$VersionName.apk') && validators.updateAllApps.includes('Remove-StaleVersionedApks') && validators.updateAllApps.includes('dist\\downloads') && !validators.updateAllApps.includes('build-android-modern.ps1') && !validators.updateAllApps.includes('cook-note-android-modern.apk'));
expect('Version produit site/APK non verrouillee.', validators.app.includes("const ANDROID_LEGACY_APK_VERSION = '") && validators.app.includes('cook-note-android-legacy-v${ANDROID_LEGACY_APK_VERSION}.apk') && !validators.app.includes('const APP_VERSION_NUMBER = SITE_VERSION') && validators.androidManual.includes('Versions site/APK non alignees') && validators.cache.includes('Versions site/APK incoherentes') && validators.bumpVersion.includes('ANDROID_LEGACY_APK_VERSION') && validators.bumpVersion.includes('cookNoteAndroidVersion') && validators.updateAllApps.includes('Versions site/APK non alignees') && validators.legacyAssets.includes('Versions Cook Note non alignees') && validators.ui.includes('ANDROID_LEGACY_APK_VERSION') && rules.includes('meme version produit `X.YY`') && validators.androidWorkflow.includes('meme version produit `X.YY`') && validators.appsWorkflow.includes('meme version produit `X.YY`'));
expect('Assets Legacy Native Lite non branches.', validators.legacyAssets.includes("require('jpeg-js')") && validators.legacyAssets.includes('recipes-lite.json') && validators.legacyAssets.includes('search-index-lite.json') && validators.legacyAssets.includes('android-legacy-search-index') && validators.legacyAssets.includes('MAX_IMAGE_WIDTH = 480') && validators.legacyAssets.includes('DETAIL_IMAGE_WIDTH = 1280') && validators.legacyAssets.includes('detail-images') && validators.legacyAssets.includes('detailImage') && validators.legacyAssets.includes('additionalMasters') && validators.legacyAssets.includes('copyLiteImage') && validators.legacyAssets.includes('android-legacy-native-lite') && validators.packageJson.includes('scripts/build-android-legacy-assets.js') && validators.packageJson.includes('jpeg-js'));
expect('Validation Android manuel non branchee.', validators.androidManual.includes('Validation Android manuel OK.') && validators.androidManual.includes('Native Lite') && validators.androidManual.includes('App Android HD/Modern encore presente') && validators.packageJson.includes('scripts/validate-android-manual.js') && validators.packageJson.includes('apps:update-all') && validators.packageJson.includes('apps:publish-all') && validators.packageJson.includes('android:legacy:update-apk') && validators.packageJson.includes('android:legacy:publish-release') && !validators.packageJson.includes('android:modern:update-apk') && !validators.packageJson.includes('android:modern:publish-release') && validators.packageJson.includes('jpeg-js'));
expect('Nettoyage encodage Android Legacy non branche.', validators.legacyAssets.includes('repairMojibakeText') && validators.legacyAssets.includes('assertNoEncodingIssues') && validators.androidManual.includes('cleanString') && validators.androidManual.includes('windows1252Byte'));
expect('Validation regles non branchee au check.', validators.packageJson.includes('scripts/validate-project-rules.js'));
[
  'app-art-images.js',
  'app-premium.js',
  'app-techniques.js',
  'theme.js',
  'i18n.js',
  'scripts\\validate-average-weights.js',
  'scripts\\validate-parent-placement.js',
  'scripts\\validate-parent-art-lock.js',
  'scripts\\generate-art-images.js',
  'scripts\\validate-i18n.js',
  'scripts\\validate-theme.js',
  'scripts\\build-android-legacy-assets.js'
].forEach(fragment => {
  expect(`Fallback Windows check.ps1 incomplet (${fragment}).`, validators.windowsCheck.includes(fragment));
});
expect('CI non reproductible: npm ci doit etre utilise avec package-lock.json.', validators.workflow.includes('npm ci --no-audit --no-fund'));
expect('Audit securite CI non branche.', validators.packageJson.includes('"audit:security": "npm audit --audit-level=high"') && validators.workflow.includes('npm run audit:security') && rules.includes('npm run audit:security'));
expect('Version Playwright non epinglee pour Node 20/CI.', validators.packageJson.includes('"@playwright/test": "1.61.1"') && validators.packageLock.includes('@playwright/test/-/test-1.61.1.tgz') && !validators.packageJson.includes('"@playwright/test": "^'));
expect('Tests visuels incompatibles CSP stricte: page.waitForFunction exige unsafe-eval avec certaines versions Playwright.', !validators.visualSmoke.includes('waitForFunction') && rules.includes('unsafe-eval'));
expect('Readiness release non documentee.', rules.includes('Readiness release') && validators.architecture.includes('## Readiness release') && validators.architecture.includes('rollback consiste a redeployer le commit precedent'));

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation regles projet OK.');

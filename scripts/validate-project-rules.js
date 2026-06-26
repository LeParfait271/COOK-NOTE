const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const rulesPath = path.join(ROOT, 'COOK_NOTE_RULES.md');
const packagePath = path.join(ROOT, 'package.json');
const validators = {
  recipes: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-recipes.js'), 'utf8'),
  ui: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-ui.js'), 'utf8'),
  production: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-production.js'), 'utf8'),
  cache: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-cache-version.js'), 'utf8'),
  visualImages: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-visual-image-duplicates.js'), 'utf8'),
  dist: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-dist.js'), 'utf8'),
  preflight: fs.readFileSync(path.join(ROOT, 'scripts', 'preflight.js'), 'utf8'),
  bumpVersion: fs.readFileSync(path.join(ROOT, 'scripts', 'bump-version.js'), 'utf8'),
  audit: fs.readFileSync(path.join(ROOT, 'scripts', 'audit-recipes.js'), 'utf8'),
  androidManual: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-android-manual.js'), 'utf8'),
  legacyAssets: fs.readFileSync(path.join(ROOT, 'scripts', 'build-android-legacy-assets.js'), 'utf8'),
  updateAllApps: fs.readFileSync(path.join(ROOT, 'scripts', 'update-all-apps.ps1'), 'utf8'),
  androidWorkflow: fs.readFileSync(path.join(ROOT, 'docs', 'android-legacy-workflow.md'), 'utf8'),
  appsWorkflow: fs.readFileSync(path.join(ROOT, 'docs', 'apps-install-workflow.md'), 'utf8'),
  workflow: fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'cook-note.yml'), 'utf8'),
  wrangler: fs.existsSync(path.join(ROOT, 'wrangler.toml')) ? fs.readFileSync(path.join(ROOT, 'wrangler.toml'), 'utf8') : '',
  architecture: fs.readFileSync(path.join(ROOT, 'docs', 'architecture.md'), 'utf8'),
  gitignore: fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8'),
  packageJson: fs.readFileSync(packagePath, 'utf8')
};
const errors = [];

function expect(label, condition) {
  if (!condition) errors.push(label);
}

expect('Fichier de regles Cook Note absent.', fs.existsSync(rulesPath));

const rules = fs.existsSync(rulesPath) ? fs.readFileSync(rulesPath, 'utf8') : '';
[
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
  'assets/recipe-images-optimized/',
  'assets/recipe-card-images/',
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
  'bump la version des assets',
  'node scripts/preflight.js',
  'npm run build',
  'scripts/validate-dist.js',
  '`dist/`',
  'modules runtime extraits de `app.js`',
  'app-images.js',
  'node scripts/bump-version.js --next',
  'scripts/optimize-selected-images.ps1',
  'app Android Legacy est un projet secondaire manuel',
  'Mise a jour groupee obligatoire des applications',
  'Cook Note Android 5.0+',
  'Cook Note HD Android 8.0+',
  'Android 5.0+',
  'Android 8.0+',
  'npm run apps:update-all',
  'npm run apps:publish-all',
  'Ne jamais publier un seul APK',
  'scripts/build-android-legacy-assets.js',
  'Native Lite',
  'Qualite apps par generation',
  'modern-app-hd',
  'CookNoteModernApp/HD',
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
  'npm run android:modern:update-apk',
  'npm run android:legacy:publish-release',
  'npm run android:modern:publish-release',
  'docs/apps-install-workflow.md',
  'cook-note-android-legacy.apk',
  'cook-note-android-legacy-vX.YY.apk',
  'cook-note-android-modern.apk',
  'cook-note-android-modern-vX.YY.apk',
  'iOS ancien',
  'iOS recent',
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
  'Sous le nom d\'une carte recette',
  'toutes les categories de la fiche',
  '`Toppings frites` = Accompagnements/Sauces'
].forEach(fragment => {
  expect(`Regle manquante dans COOK_NOTE_RULES.md (${fragment}).`, rules.includes(fragment));
});

expect('Validation arrondi grammes non branchee.', validators.recipes.includes('checkRoundedLargeGramAmounts'));
expect('Validation dosage vanille non branchee.', validators.recipes.includes('checkVanillaDosage'));
expect('Validation cassonade/vergeoise non branchee.', validators.recipes.includes('checkBrownSugarWording'));
expect('Validation poivre du moulin non branchee.', validators.recipes.includes('checkPepperWording'));
expect('Validation unites non metriques non branchee.', validators.recipes.includes('NON_METRIC_UNIT_RE'));
expect('Validation images uniques non branchee.', validators.recipes.includes('leafImageHashes'));
expect('Validation sources recette interdites non branchee.', validators.recipes.includes('FORBIDDEN_RECIPE_SOURCE_KEYS') && validators.recipes.includes('image externe interdite'));
expect('Validation doublons visuels non branchee.', validators.visualImages.includes('PERCEPTUAL_CORRELATION_LIMIT') && validators.packageJson.includes('scripts/validate-visual-image-duplicates.js'));
expect('Validation images optimisees non branchee.', validators.recipes.includes('recipe-images-optimized') && validators.recipes.includes('master PNG introuvable'));
expect('Validation anciennes URLs images remplacees non branchee.', validators.recipes.includes('FORBIDDEN_RECIPE_IMAGE_BY_ID') && validators.recipes.includes('ancienne URL image interdite'));
expect('Validation miniatures cartes non branchee.', validators.production.includes('recipe-card-images') && validators.production.includes('miniature carte introuvable'));
expect('Validation manifest images non branchee.', validators.packageJson.includes('scripts/generate-image-manifest.js') && validators.production.includes('assets/image-manifest.js') && validators.cache.includes('assets/image-manifest.js'));
expect('Validation materiel necessaire colonne droite non branchee.', validators.ui.includes('Materiel necessaire encore dans la colonne droite'));
expect('Validation anti-doublon notes pratiques non branchee.', validators.ui.includes('Notes pratiques encore classees en double'));
expect('Validation recherche intention non branchee.', validators.ui.includes('Recherche par intention absente'));
expect('Validation panier courses noms proches non branchee.', fs.readFileSync(path.join(ROOT, 'scripts', 'validate-quantities.js'), 'utf8').includes('test_panier_noms'));
expect('Validation production non branchee.', validators.production.includes('Validation production OK.') && validators.packageJson.includes('scripts/validate-production.js'));
expect('Build production dist non branche.', validators.packageJson.includes('"build": "node scripts/build-site.js"') && validators.packageJson.includes('scripts/validate-dist.js') && validators.dist.includes('Validation dist OK.'));
expect('Sortie Cloudflare Pages dist non declaree.', validators.wrangler.includes('pages_build_output_dir = "dist"') && validators.workflow.includes('npm run build') && validators.workflow.includes('cook-note-dist'));
expect('Artefact dist Cloudflare Pages non versionne.', !/(^|\n)dist\/(\r?\n|$)/.test(validators.gitignore) && validators.architecture.includes('`dist/` est versionne comme artefact public Cloudflare Pages') && rules.includes('`dist/` est versionne comme artefact public Cloudflare Pages'));
expect('Build command Cloudflare Pages non documentee.', validators.wrangler.includes('Build command: npm run build') && validators.architecture.includes('Build command : `npm run build`') && validators.architecture.includes('No build command specified') && rules.includes('Build command: npm run build'));
expect('Module runtime images non protege.', validators.packageJson.includes('node --check app-images.js') && validators.production.includes('/app-images.js') && validators.cache.includes('app-images.js') && validators.dist.includes("'app-images.js'") && validators.preflight.includes('/app-images.js'));
expect('Validation couverture features non branchee.', validators.packageJson.includes('scripts/validate-feature-coverage.js'));
expect('Validation cache/version non branchee.', validators.cache.includes('Validation cache/version OK.') && validators.packageJson.includes('scripts/validate-cache-version.js'));
expect('Validation budget performance non branchee.', validators.packageJson.includes('scripts/validate-performance-budget.js'));
expect('Script bump-version non branche.', validators.bumpVersion.includes('Version Cook Note') && validators.packageJson.includes('scripts/bump-version.js'));
expect('Preflight non branche.', validators.preflight.includes('Preflight Cook Note OK.') && validators.preflight.includes('findFreePort') && validators.preflight.includes('validateDiffScope') && validators.packageJson.includes('scripts/preflight.js'));
expect('Optimisation ciblee images non branchee.', fs.existsSync(path.join(ROOT, 'scripts', 'optimize-selected-images.ps1')) && validators.packageJson.includes('optimize-selected-images.ps1'));
expect('Audit recettes non branche.', validators.audit.includes('Audit recettes OK') && validators.packageJson.includes('scripts/audit-recipes.js'));
expect('Audit images non branche.', validators.packageJson.includes('scripts/audit-images.js'));
expect('Workflow Android manuel non documente.', validators.androidWorkflow.includes('projet secondaire') && validators.androidWorkflow.includes('ne se met pas a jour automatiquement') && validators.androidWorkflow.includes('npm run apps:update-all') && validators.androidWorkflow.includes('npm run apps:publish-all') && validators.androidWorkflow.includes('npm run android:legacy:update-apk') && validators.androidWorkflow.includes('npm run android:legacy:publish-release') && validators.androidWorkflow.includes('cook-note-android-legacy.apk') && validators.androidWorkflow.includes('cook-note-android-legacy-vX.YY.apk') && validators.androidWorkflow.includes('rattachements parents additionnels') && validators.androidWorkflow.includes('refonte visuelle native premium') && validators.androidWorkflow.includes('cartes image') && validators.androidWorkflow.includes('16/9') && validators.androidWorkflow.includes('hero de fiche encadre') && validators.androidWorkflow.includes('fiche recette detaillee proche du site') && validators.androidWorkflow.includes('grille Ingredients/Etapes/Avant de commencer') && validators.androidWorkflow.includes('actions principales/secondaires') && validators.androidWorkflow.includes('cartes parent 16/9 visibles') && validators.androidWorkflow.includes('menu deroulant') && validators.androidWorkflow.includes('nom APK versionne') && validators.androidWorkflow.includes('Ne jamais publier un seul APK') && validators.androidWorkflow.includes('scripts/build-android-legacy-assets.js') && validators.androidWorkflow.includes('Native Lite') && validators.androidWorkflow.includes('recipes-lite.json') && validators.androidWorkflow.includes('480px') && validators.androidWorkflow.includes('1280px') && validators.androidWorkflow.includes('detail-images') && validators.androidWorkflow.includes('jpeg-js') && validators.androidWorkflow.includes('GridView') && validators.androidWorkflow.includes('RGB_565') && validators.androidWorkflow.includes('pastilles') && validators.androidWorkflow.includes('etapes numerotees') && validators.androidWorkflow.includes('sans WebView systeme et sans GeckoView') && validators.androidWorkflow.includes('assets/www'));
expect('Workflow apps global non documente.', validators.appsWorkflow.includes('Android 5.0+') && validators.appsWorkflow.includes('Android 8.0+') && validators.appsWorkflow.includes('Cook Note Android 5.0+') && validators.appsWorkflow.includes('Cook Note HD Android 8.0+') && validators.appsWorkflow.includes('iOS ancien') && validators.appsWorkflow.includes('iOS recent') && validators.appsWorkflow.includes('cook-note-android-modern.apk') && validators.appsWorkflow.includes('cook-note-android-modern-vX.YY.apk') && validators.appsWorkflow.includes('cook-note-android-legacy-vX.YY.apk') && validators.appsWorkflow.includes('rattachements parents additionnels') && validators.appsWorkflow.includes('refonte visuelle native premium') && validators.appsWorkflow.includes('cartes image') && validators.appsWorkflow.includes('16/9') && validators.appsWorkflow.includes('hero de fiche encadre') && validators.appsWorkflow.includes('fiche recette detaillee proche du site') && validators.appsWorkflow.includes('grille Ingredients/Etapes/Avant de commencer') && validators.appsWorkflow.includes('actions principales/secondaires') && validators.appsWorkflow.includes('cartes parent') && validators.appsWorkflow.includes('menu deroulant') && validators.appsWorkflow.includes('nom APK versionne') && validators.appsWorkflow.includes('apps-vX.YY') && validators.appsWorkflow.includes('github.com/LeParfait271/COOK-NOTE/raw/main/downloads') && validators.appsWorkflow.includes('raw.githubusercontent.com') && validators.appsWorkflow.includes('/downloads/') && validators.appsWorkflow.includes('npm run apps:update-all') && validators.appsWorkflow.includes('npm run apps:publish-all') && validators.appsWorkflow.includes('Mise a jour groupee obligatoire') && validators.appsWorkflow.includes('Ne jamais publier un seul APK') && validators.appsWorkflow.includes('scripts/build-android-legacy-assets.js') && validators.appsWorkflow.includes('Native Lite') && validators.appsWorkflow.includes('modern-app-hd') && validators.appsWorkflow.includes('CookNoteModernApp/HD') && validators.appsWorkflow.includes('recipes-lite.json') && validators.appsWorkflow.includes('480px') && validators.appsWorkflow.includes('1280px') && validators.appsWorkflow.includes('jpeg-js') && validators.appsWorkflow.includes('GridView') && validators.appsWorkflow.includes('RGB_565') && validators.appsWorkflow.includes('pastilles') && validators.appsWorkflow.includes('etapes numerotees') && validators.appsWorkflow.includes('sans GeckoView'));
expect('Script apps groupe non branche.', validators.packageJson.includes('"apps:update-all"') && validators.packageJson.includes('"apps:publish-all"') && validators.updateAllApps.includes('build-android-legacy.ps1') && validators.updateAllApps.includes('build-android-modern.ps1') && validators.updateAllApps.includes('cook-note-android-legacy.apk') && validators.updateAllApps.includes('cook-note-android-modern.apk') && validators.updateAllApps.includes('cook-note-android-legacy-v$VersionName.apk') && validators.updateAllApps.includes('cook-note-android-modern-v$VersionName.apk') && validators.updateAllApps.includes('dist\\downloads'));
expect('Assets Legacy Native Lite non branches.', validators.legacyAssets.includes("require('jpeg-js')") && validators.legacyAssets.includes('recipes-lite.json') && validators.legacyAssets.includes('MAX_IMAGE_WIDTH = 480') && validators.legacyAssets.includes('DETAIL_IMAGE_WIDTH = 1280') && validators.legacyAssets.includes('detail-images') && validators.legacyAssets.includes('detailImage') && validators.legacyAssets.includes('additionalMasters') && validators.legacyAssets.includes('copyLiteImage') && validators.legacyAssets.includes('android-legacy-native-lite') && validators.packageJson.includes('scripts/build-android-legacy-assets.js') && validators.packageJson.includes('jpeg-js'));
expect('Validation Android manuel non branchee.', validators.androidManual.includes('Validation Android manuel OK.') && validators.androidManual.includes('Native Lite') && validators.androidManual.includes('modern-app-hd') && validators.androidManual.includes('CookNoteModernApp/HD') && validators.packageJson.includes('scripts/validate-android-manual.js') && validators.packageJson.includes('apps:update-all') && validators.packageJson.includes('apps:publish-all') && validators.packageJson.includes('android:legacy:update-apk') && validators.packageJson.includes('android:legacy:publish-release') && validators.packageJson.includes('android:modern:update-apk') && validators.packageJson.includes('android:modern:publish-release') && validators.packageJson.includes('jpeg-js'));
expect('Nettoyage encodage Android Legacy non branche.', validators.legacyAssets.includes('repairMojibakeText') && validators.legacyAssets.includes('assertNoEncodingIssues') && validators.androidManual.includes('cleanString') && validators.androidManual.includes('windows1252Byte'));
expect('Validation regles non branchee au check.', validators.packageJson.includes('scripts/validate-project-rules.js'));

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Validation regles projet OK.');

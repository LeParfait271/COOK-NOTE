const fs = require('node:fs');
const path = require('node:path');
const { readAppSource, readStyleSource } = require('./lib/app-modules');

const ROOT = path.resolve(__dirname, '..');
const rulesPath = path.join(ROOT, 'COOK_NOTE_RULES.md');
const masterGuardPath = path.join(ROOT, 'A_LIRE_EN_PREMIER.md');
const agentsPath = path.join(ROOT, 'AGENTS.md');
const designSystemPath = path.join(ROOT, 'docs', 'design-system.md');
const recipeWorkflowPath = path.join(ROOT, 'docs', 'recipe-creation-workflow.md');
const culinaryAuditPath = path.join(ROOT, 'scripts', 'audit-culinary-proposals.js');
const culinaryReportPath = path.join(ROOT, 'reports', 'culinary-proposals.md');
const packagePath = path.join(ROOT, 'package.json');
const packageLockPath = path.join(ROOT, 'package-lock.json');
const validators = {
  recipes: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-recipes.js'), 'utf8'),
  ui: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-ui.js'), 'utf8'),
  production: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-production.js'), 'utf8'),
  featureCoverage: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-feature-coverage.js'), 'utf8'),
  cache: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-cache-version.js'), 'utf8'),
  visualImages: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-visual-image-duplicates.js'), 'utf8'),
  variantFamilyImages: fs.readFileSync(path.join(ROOT, 'scripts', 'validate-variant-family-images.js'), 'utf8'),
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
  androidWorkflow: fs.readFileSync(path.join(ROOT, 'docs', 'android-legacy-workflow.md'), 'utf8').replace(/\s+/g, ' '),
  appsWorkflow: fs.readFileSync(path.join(ROOT, 'docs', 'apps-install-workflow.md'), 'utf8').replace(/\s+/g, ' '),
  workflow: fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'cook-note.yml'), 'utf8'),
  wrangler: fs.existsSync(path.join(ROOT, 'wrangler.toml')) ? fs.readFileSync(path.join(ROOT, 'wrangler.toml'), 'utf8') : '',
  architecture: fs.readFileSync(path.join(ROOT, 'docs', 'architecture.md'), 'utf8').replace(/\s+/g, ' '),
  completeGuide: fs.readFileSync(path.join(ROOT, 'GUIDE_COMPLET.txt'), 'utf8').replace(/\s+/g, ' '),
  windowsCheck: fs.readFileSync(path.join(ROOT, 'check.ps1'), 'utf8'),
  style: readStyleSource(),
  adminCss: fs.readFileSync(path.join(ROOT, 'admin.css'), 'utf8'),
  gitignore: fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8'),
  app: readAppSource(),
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
expect('Workflow de creation des recettes absent.', fs.existsSync(recipeWorkflowPath));
expect('Audit culinaire non destructif absent.', fs.existsSync(culinaryAuditPath));
expect('Rapport de propositions culinaires absent.', fs.existsSync(culinaryReportPath));
expect('package-lock.json absent: installations CI non reproductibles.', fs.existsSync(packageLockPath));

// Les documents sont lus avec des espaces normalises : retours a la ligne et
// mise en forme ne cassent pas les controles. Les validateurs verifient le sens
// (sections, liens, decisions cles) et surtout le code, pas une formulation.
const readDoc = file => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '').replace(/\s+/g, ' ');
const rules = readDoc(rulesPath);
const masterGuard = readDoc(masterGuardPath);
const agentsGuide = readDoc(agentsPath);
const designSystem = readDoc(designSystemPath);
const recipeWorkflow = readDoc(recipeWorkflowPath);
const culinaryAudit = fs.existsSync(culinaryAuditPath) ? fs.readFileSync(culinaryAuditPath, 'utf8') : '';
const culinaryReport = fs.existsSync(culinaryReportPath) ? fs.readFileSync(culinaryReportPath, 'utf8') : '';

expect(
  'Verrou de validation humaine des corrections culinaires incomplet.',
  rules.includes('Validation humaine des corrections culinaires')
    && rules.includes('ne modifie jamais `recipes.js`')
    && rules.includes('ne remplace et ne supprime jamais une duree')
    && culinaryAudit.includes('hashBefore !== hashAfter')
    && culinaryReport.includes('Aucun temps n’est remplacé ou supprimé')
);
expect(
  'Collections encombrees par des controles retires ou sans ancien visuel parent.',
  validators.app.includes('function collectionHeroImage(recipe)')
    && validators.app.includes("className: 'variant-card-grid'")
    // Filtre texte, familles et tri reviennent (v5.40, demande utilisateur) dans
    // une seule barre ; les anciens filtres rapides et comparatifs restent exclus.
    && !validators.app.includes('collection-quick-filters')
    && !validators.app.includes('collection-comparison')
    && !validators.app.includes('variant-compare-toggle')
    && !validators.style.includes('.collection-comparison-grid')
);

expect(
  'Raccourci liens recettes absent des instructions agents.',
  agentsGuide.includes('RACCOURCI UTILISATEUR POUR AJOUTER DES RECETTES')
    && agentsGuide.includes('contenant uniquement un ou plusieurs liens HTTP(S)')
    && agentsGuide.includes('docs/recipe-creation-workflow.md')
    && agentsGuide.includes('docs/visual-references/RECIPE_IMAGE_STYLE.md')
    && rules.includes('vaut demande complete d\'import dans Cook Note')
);
expect(
  'Workflow de creation des recettes incomplet.',
  recipeWorkflow.includes("L'identite du plat prime")
    && recipeWorkflow.includes('Poulet basquaise au four')
    && recipeWorkflow.includes('Mayonnaise et Aioli')
    && recipeWorkflow.includes("sauce aux herbes")
    && recipeWorkflow.includes('Verrou de classement obligatoire')
    && recipeWorkflow.includes('meme nom culinaire reconnu')
    && recipeWorkflow.includes('Preuve avant modification')
    && recipeWorkflow.includes('decision finale')
    && recipeWorkflow.includes('sauce Choron')
    && recipeWorkflow.includes('trois references jour')
    && recipeWorkflow.includes('trois references nuit')
    && recipeWorkflow.includes("sans attendre de validation utilisateur")
);
expect(
  'Regles de classement variante ou fiche distincte absentes.',
  rules.includes('docs/recipe-creation-workflow.md')
    && rules.includes('Meme plat de base et meme identite culinaire = variante')
    && rules.includes('Le verrou de classement')
    && rules.includes('meme nom culinaire reconnu')
    && rules.includes('La sauce Choron est une variante')
    && rules.includes("Mayonnaise` n'est pas `Aioli")
    && rules.includes("sauce aux herbes n'est pas une variante")
);

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
    designSystem.includes(fragment));
});
expect('Garde-fou design premium absent du maitre.', masterGuard.includes('Silent Design') && masterGuard.includes('premiere impression'));
expect('Tokens design system site absents.', validators.style.includes('--ds-color-background') && validators.style.includes('--ds-space-8: 64px') && validators.style.includes('--ds-radius-md: 10px') && validators.style.includes('--ds-motion-fast: 120ms') && validators.style.includes('--ds-motion-slow: 320ms') && validators.style.includes('--ds-ease-out') && validators.style.includes('prefers-reduced-motion'));
expect('Tokens design system admin absents.', validators.adminCss.includes('--ds-color-background') && validators.adminCss.includes('--ds-space-8: 64px') && validators.adminCss.includes('--ds-radius-md: 10px') && validators.adminCss.includes('--ds-motion-fast: 120ms') && validators.adminCss.includes('--ds-motion-slow: 320ms') && validators.adminCss.includes('--ds-ease-out') && validators.adminCss.includes('prefers-reduced-motion'));

[
  '## 1. Methode et livraison',
  '## 2. Recettes : classement et creation',
  '## 3. Recettes : redaction, quantites et donnees',
  '## 4. Images',
  '## 5. Interface du site',
  '## 6. Production web',
  '## 7. Versions',
  '## 8. Application Android 5.0+ (Native Lite)',
  '## 9. Fonctions retirees ou refusees'
].forEach(section => {
  expect(`COOK_NOTE_RULES.md: section absente (${section}).`, rules.includes(section));
});
[
  'A_LIRE_EN_PREMIER.md',
  'docs/recipe-creation-workflow.md',
  'docs/visual-references/RECIPE_IMAGE_STYLE.md',
  'docs/design-system.md',
  'docs/android-legacy-workflow.md',
  'docs/apps-install-workflow.md',
  'scripts/lib/app-modules.js'
].forEach(reference => {
  expect(`COOK_NOTE_RULES.md: reference absente (${reference}).`, rules.includes(reference));
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
expect('Validation qualificatifs marketing des titres non branchee.', validators.recipes.includes('MARKETING_TITLE_QUALIFIER_RE') && validators.recipes.includes('qualificatif marketing interdit dans le titre'));
expect('Validation doublons visuels non branchee.', validators.visualImages.includes('PERCEPTUAL_CORRELATION_LIMIT') && validators.packageJson.includes('scripts/validate-visual-image-duplicates.js'));
expect('Validation images propres des familles variantes non branchee.', validators.variantFamilyImages.includes('image propre attendue') && validators.packageJson.includes('scripts/validate-variant-family-images.js'));
expect('Validation images optimisees non branchee.', validators.recipes.includes('assets/recipes/heroes') && validators.recipes.includes('master PNG introuvable'));
expect('Validation chemins images locaux non branchee.', validators.recipes.includes('image locale introuvable') && validators.recipes.includes('image recette non optimisee'));
expect('Validation miniatures cartes non branchee.', validators.production.includes('assets/recipes/cards') && validators.production.includes('miniature carte introuvable'));
expect('Validation manifest images non branchee.', validators.packageJson.includes('scripts/generate-image-manifest.js') && validators.production.includes('assets/image-manifest.js') && validators.cache.includes('assets/image-manifest.js'));
expect(
  'Validation nettoyage images non branchee.',
  validators.imageCleanup.includes('image presente mais non utilisee')
    && (
      validators.imageCleanup.includes('aucun id recette correspondant')
      || validators.imageCleanup.includes('aucun visuel de recette correspondant')
    )
    && validators.imageCleanup.includes('asset theme identique a la base')
    && validators.packageJson.includes('scripts/validate-image-cleanup.js')
);
expect('Validation materiel necessaire colonne droite non branchee.', validators.ui.includes('Materiel necessaire encore dans la colonne droite'));
expect('Validation anti-doublon notes pratiques non branchee.', validators.ui.includes('Notes pratiques encore classees en double'));
expect('Validation recherche intention non branchee.', validators.ui.includes('Recherche par intention absente'));
expect('Validation panier courses noms proches non branchee.', fs.readFileSync(path.join(ROOT, 'scripts', 'validate-quantities.js'), 'utf8').includes('test_panier_noms'));
expect('Validation production non branchee.', validators.production.includes('Validation production OK.') && validators.packageJson.includes('scripts/validate-production.js'));
expect('Build production dist non branche.', validators.packageJson.includes('"build": "node scripts/build-site.js"') && validators.packageJson.includes('scripts/validate-dist.js') && validators.dist.includes('Validation dist OK.'));
expect('Build production masque encore une absence ou un echec Terser.', validators.packageJson.includes('"terser"') && validators.packageLock.includes('node_modules/terser') && validators.packageJson.includes('scripts/build-site.js') && validators.buildSite.includes('Dependance terser absente') && validators.buildSite.includes('Minification JavaScript impossible'));
expect('Sortie Cloudflare Pages dist non declaree.', validators.wrangler.includes('pages_build_output_dir = "dist"') && validators.workflow.includes('npm run build') && validators.workflow.includes('cook-note-dist'));
expect('dist/ doit rester un artefact de build ignore par Git et construit par Cloudflare Pages.', /(^|\n)dist\/(\r?\n|$)/.test(validators.gitignore) && validators.architecture.includes('`dist/` est un artefact de build, ignore par Git') && validators.architecture.includes('git rm -r --cached dist') && rules.includes('artefact de build ignore par Git'));
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
expect('Workflow Android manuel non documente.', validators.androidWorkflow.includes('projet secondaire') && validators.androidWorkflow.includes('parite site/app') && validators.androidWorkflow.includes('ne se met pas a jour automatiquement sur la tablette') && validators.androidWorkflow.includes('npm run apps:update-all') && validators.androidWorkflow.includes('npm run apps:publish-all') && validators.androidWorkflow.includes('cook-note-android-legacy.apk') && validators.androidWorkflow.includes('scripts/build-android-legacy-assets.js') && validators.androidWorkflow.includes('sans WebView systeme et sans GeckoView'));
expect('Workflow apps global non documente.', validators.appsWorkflow.includes('Cook Note Android 5.0+') && validators.appsWorkflow.includes('parite site/app') && validators.appsWorkflow.includes('https://raw.githubusercontent.com/LeParfait271/COOK-NOTE/main/downloads/cook-note-android-legacy.apk') && validators.appsWorkflow.includes('chemin ne contient jamais la version') && validators.appsWorkflow.includes('npm run apps:update-all') && validators.appsWorkflow.includes('npm run apps:publish-all') && !validators.appsWorkflow.includes('cook-note-android-modern') && !validators.appsWorkflow.includes('Android 8.0+'));
expect('Script apps groupe non branche.', validators.packageJson.includes('"apps:update-all"') && validators.packageJson.includes('"apps:publish-all"') && validators.updateAllApps.includes('build-android-legacy.ps1') && validators.updateAllApps.includes('cook-note-android-legacy.apk') && validators.updateAllApps.includes('Get-CookNoteVersionName') && validators.updateAllApps.includes('Sync-AndroidApkVersion') && validators.updateAllApps.includes('ANDROID_LEGACY_APK_VERSION') && validators.updateAllApps.includes('cook-note-android-legacy-v$VersionName.apk') && validators.updateAllApps.includes('Remove-StaleVersionedApks') && validators.updateAllApps.includes('dist\\downloads') && !validators.updateAllApps.includes('build-android-modern.ps1') && !validators.updateAllApps.includes('cook-note-android-modern.apk'));
expect('Version produit site/APK non verrouillee.', validators.app.includes("const ANDROID_LEGACY_APK_VERSION = '") && validators.app.includes("ANDROID_LEGACY_STABLE_APK_FILE = 'cook-note-android-legacy.apk'") && !validators.app.includes('const APP_VERSION_NUMBER = SITE_VERSION') && validators.androidManual.includes('Versions Android publiees incoherentes') && validators.cache.includes('Versions APK incoherentes') && validators.bumpVersion.includes('--site-only') && validators.bumpVersion.includes('ANDROID_LEGACY_APK_VERSION') && validators.bumpVersion.includes('cookNoteAndroidVersion') && validators.updateAllApps.includes('Versions site/APK non alignees') && validators.legacyAssets.includes('Versions Cook Note non alignees') && rules.includes('meme version produit `X.YY`') && validators.androidWorkflow.includes('meme version produit `X.YY`') && validators.appsWorkflow.includes('meme version produit `X.YY`'));
[
  ['A_LIRE_EN_PREMIER.md', masterGuard],
  ['COOK_NOTE_RULES.md', rules]
].forEach(([file, text]) => {
  expect(`${file}: autorisation explicite de reconstruction APK absente.`,
    text.includes('0.01')
      && text.includes('npm run apps:update-all')
      && text.toLowerCase().includes('demande explicite'));
});
expect('Assets Legacy Native Lite non branches.', validators.legacyAssets.includes("require('jpeg-js')") && validators.legacyAssets.includes('recipes-lite.json') && validators.legacyAssets.includes('search-index-lite.json') && validators.legacyAssets.includes('android-legacy-search-index') && validators.legacyAssets.includes('MAX_IMAGE_WIDTH = 480') && validators.legacyAssets.includes('DETAIL_IMAGE_WIDTH = 960') && validators.legacyAssets.includes('detail-images') && validators.legacyAssets.includes('detailImage') && validators.legacyAssets.includes('additionalMasters') && validators.legacyAssets.includes('copyLiteImage') && validators.legacyAssets.includes('android-legacy-native-lite') && validators.legacyAssets.includes('COOK_NOTE_THEME_RECIPE_ART') && validators.legacyAssets.includes('resizeBilinear') && !validators.legacyAssets.includes('resizeNearest') && validators.packageJson.includes('scripts/build-android-legacy-assets.js') && validators.packageJson.includes('jpeg-js'));
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

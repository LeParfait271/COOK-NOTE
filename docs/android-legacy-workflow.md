# Android Legacy Cook Note

Ce document est la reference pour l'application Android Legacy Cook Note.
Elle est un projet secondaire en parallele du site, pas la source de verite.
GitHub et le site web restent prioritaires. La reference globale de
l'installation hors navigateur est dans `docs/apps-install-workflow.md`.

## Regle principale : parite Native Lite

L'application Android Legacy ne se met pas a jour automatiquement sur la tablette quand le site change : l'utilisateur doit toujours telecharger puis installer la nouvelle APK. En revanche, la regle projet impose la parite site/app pour les changements visibles.

Quand une intervention modifie une fonctionnalite visible du site, une recette,
le catalogue, l'UX ou un comportement utile aussi sur tablette, auditer Android
Legacy dans le meme lot. Si l'equivalent a du sens, le porter en Native Lite
pour tablette peu puissante. Le code reste pret a construire : lancer
`npm run apps:update-all` uniquement sur demande explicite de l'utilisateur. Si le changement est web-only, purement technique, ou sans impact
utilisateur Android, le noter dans le compte rendu.
Garde-fou parite site/app : fonctionnalite visible du site -> Native Lite pour tablette peu puissante.

Un commit/push du site ne change pas l APK installe sur la tablette. L APK deja
installee reste locale, mais le depot doit proposer une APK de meme version
produit quand une version Cook Note est publiee.

La version produit publiee est unique : `SITE_VERSION` porte `vX.YY`,
`cookNoteAndroidVersion` dans `android-legacy/gradle.properties` porte `X.YY`,
et `ANDROID_LEGACY_APK_VERSION` dans `app.js` porte aussi `X.YY`. Ces trois
valeurs doivent toujours rester alignees. `scripts/bump-version.js` synchronise
les trois sources, puis `npm run apps:update-all` fabrique l APK
`downloads/cook-note-android-legacy-vX.YY.apk` correspondante.

## Role de l app

- Projet : `android-legacy/`
- Plateforme cible : Android 5.0 minimum, donc `minSdk 21`
- Type : app native Java Native Lite, sans WebView systeme et sans GeckoView
- Source affichee : catalogue local `recipes-lite.json` + images locales
- Package Android : `fr.cooknote.legacy`

Android Legacy est faite pour les tablettes anciennes avec peu de RAM et un CPU
modeste. Elle ne charge pas le site React, ne demarre pas de serveur HTTP local,
ne depend pas du WebView systeme et n embarque plus GeckoView ARMv7. `MainActivity`
lit un JSON local, affiche une `GridView` recyclee en cartes image 16/9 proches du
site, ouvre les fiches dans des vues Android natives, et charge les images avec
un cache memoire limite.

L interface suit la section 8 de `COOK_NOTE_RULES.md` :

- theme nuit premium unique, palette native dans `Palette.java`, sans selecteur
  jour/nuit ni reglage visuel ;
- accueil compact : fiches parentes racines du site, bouton `Recherche` qui
  ouvre un seul champ avec `Effacer`, bouton `Courses` et bouton natif de mise a
  jour vers l APK stable `cook-note-android-legacy.apk` ;
- recherche dans tout le catalogue sans filtres visibles, classement tolerant
  aux fautes et index `search-index-lite.json` precompile ;
- hierarchie plate : les 8 parents affichent leurs recettes en cartes 16/9
  visibles (jamais dans un menu deroulant), en lisant `master` et
  `additionalMasters` ; les fiches a variantes internes gardent le selecteur
  natif `Choisir une variante` et une seule preparation active ;
- fiche detaillee proche du site (hero 16/9, pastilles, Ingredients / Etapes /
  Avant de commencer complet derive des helpers web), sans saisons, difficulte,
  nombre d etapes, favori ni partage ; selecteur natif de personnes qui met a
  jour rendements, ingredients, copie et courses ;
- liste de courses locale cochable et fusionnee, copiable, et envoi vers un
  telephone par QR code natif (`QrCode.java`, meme lien `#courses=` que le site) ;
- position de grille conservee au retour, navigation restaurable, swipe retour
  bord gauche, ecran actif persistant.

Les optimisations Native Lite (file image prioritaire mono-thread, prefetchs
annules en fling, caches bornes, recherche temporisee, recyclage des vues,
pile retour bornee) sont verifiees dans le code par `npm run validate:android`.

Le workflow officiel passe par `scripts/build-android-legacy-assets.js`, qui
genere une sortie dediee dans :

```text
android-legacy/build/generated/cook-note-lite
```

Cette sortie contient :

- `recipes-lite.json`, un catalogue compact sans source externe ;
- `search-index-lite.json`, un index recherche precompile pour l APK ;
- `images/`, les images recette locales reduites a `480px` maximum pour la liste ;
- `detail-images/`, les images de fiche reduites a `960px` maximum ;
- des JPEG recompresses avec `jpeg-js` pour limiter le decode RAM/CPU ;
- aucun fichier `assets/www`, aucun React, aucun service worker et aucun CSS du site.

Les anciennes preferences locales discretes et le diagnostic hors ligne sont
retires et interdits dans l interface et le code.

Le site et les recettes gardent les visuels habituels. La reduction d image ne
concerne que l APK Android 5.

## Pourquoi l app ne suit pas le build web automatiquement

Le build normal du site doit rester rapide et propre :

- `npm run build` genere seulement le site public dans `dist/`
- `npm run check` valide le site et les garde-fous
- `npm run preflight` valide le deploiement site
- aucun de ces scripts ne doit lancer Gradle ni produire d APK

Le dossier Android lit les assets Lite uniquement pendant un build Android
volontaire, declenche par la parite site/app ou par une demande explicite :

```powershell
npm run apps:update-all
```

Cette commande lance `scripts/build-android-legacy.ps1`. Le script genere
d'abord les assets Native Lite avec `scripts/build-android-legacy-assets.js`,
nettoie l ancien APK de sortie pour eviter les ZIP incrementaux gonfles, puis
Gradle fabrique l APK.

Le dossier `android-legacy/build/generated/cook-note-lite/` est genere
localement et ne doit pas etre versionne.

## Commandes utiles

Installer ou reparer les outils Android portables :

```powershell
npm run android:legacy:setup
```

Construire une nouvelle APK quand la parite site/app l'exige ou quand
l'utilisateur le demande explicitement :

```powershell
npm run apps:rebuild:check
npm run apps:rebuild
```

`apps:rebuild:check` est un preflight sans ecriture. Il indique la version cible,
la version APK publiee et si une synchronisation est necessaire.
`apps:rebuild` est le workflow final idempotent : il utilise la version courante
du site sans bump implicite, sauvegarde les anciens APK et le manifeste dans
`backups/android/before-vX.YY/<horodatage>/`, synchronise Android sur le site,
reconstruit `dist/` et l APK, retente une fois Gradle si necessaire, verifie
package/version/minSdk/signatures v1-v2 avant toute copie, remplace les deux APK
de `downloads/`, puis lance les validations Android, cache et `dist`.
Gradle est lance sans daemon et tente d abord le cache local hors ligne ; le
reseau n est utilise qu en repli si une dependance manque. Les assets Native
Lite ne sont generes qu une fois, meme si Gradle doit etre relance.
La sortie Gradle detaillee est conservee dans
`tmp/android-gradle-latest.log` au lieu d etre envoyee dans la conversation.
En cas d echec, seules les 30 dernieres lignes utiles sont affichees.

Un resume compact est ecrit dans `tmp/android-rebuild-latest.json`. Une relance
apres echec garde la meme version cible et ne provoque donc pas de bump
supplementaire. Le workflow ne publie jamais de GitHub Release.

Si le build Release a termine mais que l orchestration a ete interrompue avant
les validations ou les copies, reprendre sans reconstruire avec :

```powershell
npm run apps:rebuild:finalize
```

Ce mode refuse de continuer si les versions ne sont pas deja alignees ou si
l APK Release attendue est absente. Il execute encore toutes les validations,
la sauvegarde et les copies finales.

`npm run apps:update-all` reste la sous-commande historique de compatibilite.
`npm run android:legacy:update-apk` reste une sous-commande de diagnostic ; elles
ne remplacent pas le workflow securise `apps:rebuild`.

Publier l APK courant sur GitHub Releases, seulement sur demande explicite :

```powershell
npm run apps:publish-all
```

Cette commande demande GitHub CLI (`gh`) authentifie. Elle cree ou met a jour
une release commune `apps-vX.YY` et publie l APK sous le nom stable
`cook-note-android-legacy.apk`, avec une copie au nom APK versionne
`cook-note-android-legacy-vX.YY.apk`.

La commande `npm run android:legacy:publish-release` existe encore comme
sous-commande interne de diagnostic, mais elle ne doit pas etre le workflow
final de publication.

Construire sans relancer le build web, si `dist/` est deja a jour :

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\scripts\build-android-legacy.ps1 -SkipWebBuild
```

Sortie APK officielle :

```text
android-legacy/app/build/outputs/apk/release/app-release.apk
```

Verifier le comportement manuel Android :

```powershell
npm run validate:android
```

## Installation depuis le site

Le footer du site contient un bouton `Android 5.0+`. Il ouvre un panneau
d'installation dont le bouton primaire pointe vers la copie APK servie par
GitHub :

```text
https://github.com/LeParfait271/COOK-NOTE/raw/main/downloads/cook-note-android-legacy.apk
https://github.com/LeParfait271/COOK-NOTE/raw/main/downloads/cook-note-android-legacy-vX.YY.apk
```

Dans l APK installe, le bouton natif `Mise a jour` doit ouvrir la meme
URL. Sur la tablette, l utilisateur telecharge alors la nouvelle APK puis
choisit `Installer une mise a jour`. Ne pas changer le package
`fr.cooknote.legacy`, sinon Android ne pourra plus remplacer l ancienne app et
les preferences locales et les courses seraient perdues.

L URL stable reste la meme d une version Android a l autre pour le bouton natif
de mise a jour. Le bouton du site peut pointer vers le nom APK versionne
`downloads/cook-note-android-legacy-vX.YY.apk`, tandis que l alias stable
`downloads/cook-note-android-legacy.apk` reste disponible. Ces fichiers ne
doivent pas etre copies dans `dist/`, car Cloudflare Pages limite chaque fichier
public a 25 MiB. Le panneau garde aussi un lien brut `raw.githubusercontent.com`
et une page GitHub du fichier pour les navigateurs anciens qui gerent mal le
telechargement direct.

Les APK generes dans `android-legacy/` ne doivent pas etre ajoutes au depot Git.
Seules les copies telechargeables `downloads/cook-note-android-legacy.apk` et
`downloads/cook-note-android-legacy-vX.YY.apk` sont versionnees apres workflow
de parite site/app ou quand l utilisateur demande explicitement une publication
app depuis le site.

## Workflow pour toute modification, y compris web-only

1. Toute modification produit versionnee augmente la version du site de
   `0.01`. Une modification limitee aux garde-fous ou au workflow interne ne
   declenche pas de release.
2. Verifier si une adaptation fonctionnelle Native Lite est necessaire. Un
   changement web-only peut ne demander aucun changement de code Android.
3. Sans demande de reconstruction APK : lancer
   `node scripts/bump-version.js --next --site-only`. L APK publiee et son
   manifeste gardent la version du dernier binaire construit.
4. Lancer les checks habituels du site.
5. Uniquement sur demande explicite de reconstruction : lancer
   `node scripts/bump-version.js --next` puis `npm run apps:update-all` pour
   reconstruire le site et l APK avec la meme version `X.YY`.
6. Ne jamais annoncer ni publier une version APK sans binaire reconstruit
   correspondant.

## Workflow quand la parite Android est requise

1. Synchroniser GitHub avec `git pull --ff-only`.
2. Identifier l equivalent Native Lite adapte a une tablette peu puissante.
3. S assurer que le site est propre et que `dist/` est a jour.
4. Lancer `npm run apps:update-all`.
5. Verifier l APK :
   - `aapt dump badging android-legacy/app/build/outputs/apk/release/app-release.apk`
   - `apksigner verify --verbose android-legacy/app/build/outputs/apk/release/app-release.apk`
6. Ne pas committer les APK depuis les dossiers Android : ce sont des artefacts locaux ignores.
7. `npm run apps:update-all` copie l APK valide vers
   `downloads/cook-note-android-legacy.apk` et
   `downloads/cook-note-android-legacy-vX.YY.apk`. Verifier que
   `dist/downloads/` n existe pas.
8. Si l utilisateur demande aussi une Release GitHub, lancer
   `npm run apps:publish-all` apres authentification GitHub CLI.
9. Sur demande de l utilisateur, commit les changements de code, documentation
   et copies APK. Le push reste fait par l utilisateur via GitHub Desktop.
10. Donner le chemin local de l APK et/ou l URL de telechargement du site a l utilisateur.

## Fichiers importants

- `android-legacy/app/src/main/java/fr/cooknote/legacy/MainActivity.java`
  contient l interface native Android 5 Lite, les sections de fiche, les
  pastilles d infos allegees, la recherche simple sans filtres, la copie
  ingredients, la liste de courses locale, la copie
  fiche, le selecteur de personnes, la navigation restaurable, le swipe retour
  bord gauche, les courses
  cochables, l audit perf leger, l ecran actif persistant, le bouton natif de
  mise a jour et les etapes numerotees.
- `android-legacy/app/src/main/java/fr/cooknote/legacy/CookNoteRepository.java`
  lit `recipes-lite.json`, les `master`, les `additionalMasters` et les
  rattachements parents additionnels, puis gere la recherche intelligente sans
  filtres.
- `android-legacy/app/src/main/java/fr/cooknote/legacy/ImageLoader.java`
  decode les miniatures et les images detail locales en `RGB_565` avec un petit
  cache memoire et le prechargement images.
- `android-legacy/app/build.gradle` lit `cookNoteAndroidVersion` dans
  `android-legacy/gradle.properties` pour produire `versionName` et
  `versionCode`, puis monte `android-legacy/build/generated/cook-note-lite`
  comme assets APK. Le build officiel distribue est `release`, signe avec la
  cle release stable `android-legacy/signing/cook-note-release.jks` (alias
  `cooknote`, mots de passe dans `android-legacy/signing/keystore.properties`,
  dossier hors Git a sauvegarder hors du PC) pour que les mises a jour
  s installent par-dessus, avec R8 et shrink resources. La premiere APK signee
  avec cette cle (apres la v5.32) demande de desinstaller une fois l ancienne
  app : la mise a jour in-app depuis la v5.32 echouera
  (`INSTALL_FAILED_UPDATE_INCOMPATIBLE`).
- `app.js` expose `ANDROID_LEGACY_APK_VERSION` pour le lien de telechargement
  public. Cette version doit toujours etre la meme version produit `X.YY` que
  `SITE_VERSION` et `cookNoteAndroidVersion`.
- `scripts/build-android-legacy-assets.js` genere le catalogue Native Lite,
  y compris les sections `Avant de commencer` utiles a l APK : allergenes,
  poids moyens, repere cuilleres, conservation et rechauffage.
  Les images sont derivees en priorite des assets nuit actuellement affiches
  par le site (`assets/theme/dark`), avec repli sur l image de recette seulement
  lorsqu aucun asset de theme n existe. Le redimensionnement reste lisse et ne
  reutilise jamais les anciennes sorties generees Android.
- `scripts/build-android-legacy.ps1` construit l APK et nettoie la sortie APK
  avant packaging.
- `scripts/publish-android-release.ps1` publie l APK local sur GitHub Releases
  avec l asset stable `cook-note-android-legacy.apk` et le nom APK versionne
  `cook-note-android-legacy-vX.YY.apk`.
- `scripts/setup-android-legacy-tools.ps1` installe JDK, Gradle et Android SDK
  dans `%LOCALAPPDATA%\CookNoteAndroidTools`.
- `scripts/validate-android-manual.js` bloque les regressions qui brancheraient
  Android sur le workflow normal du site ou qui remettraient un moteur web lourd.

## A ne pas faire

- Ne pas ajouter le build APK dans `npm run build`, `npm run check`,
  `npm run preflight`, `start` ou `dev`.
- Ne pas versionner `android-legacy/build/generated/cook-note-lite/`.
- Ne pas versionner les APK ou AAB generes dans les dossiers Android.
- Ne pas remettre GeckoView, WebView, React, service worker, serveur HTTP local
  ou `assets/www` dans Android Legacy.
- Ne pas supprimer les fonctions natives legeres reintegrees : recherche simple
  sans filtres, copie ingredients, liste de courses locale,
  courses cochables, copie fiche, selecteur de personnes, navigation restaurable,
  swipe retour bord gauche, prechargement images, audit perf leger et ecran
  actif persistant.
- Ne pas remettre sur la fiche detail Android les saisons, la difficulte, le
  nombre d etapes, le bouton favori ou le bouton partager.
- Ne pas remettre de filtres dans la recherche Android Legacy : pas de categorie,
  saison, difficulte, favoris, recents, `Toutes fiches` ou bouton aleatoire dans
  le panneau de recherche.
- Ne pas remplacer la refonte visuelle native premium par des blocs Android
  par defaut : garder cartes tactiles, header compact avec stats locales, hero
  encadre, fiche recette detaillee proche du site, grille Ingredients/Etapes/Avant de commencer,
  sections cadrees et actions principales/secondaires distinguees.
- Ne pas cacher les recettes d une fiche parent dans un menu deroulant :
  garder des cartes parent visibles comme sur le site.
- Ne pas afficher toutes les preparations d une fiche a variantes internes a
  plat : garder le selecteur natif et la preparation choisie.
- Ne pas publier une nouvelle release APK sans demande explicite.
- Toute mise a jour app doit passer par `npm run apps:update-all`, meme si le
  workflow ne construit plus que l APK Android Legacy.
- Ne pas recreer Android Modern/HD, ni remettre de bouton moderne, sans demande
  explicite.
- Ne pas traiter l APK comme la source de verite des recettes.
- Ne pas modifier les recettes pour l app Android sans demande separee, sauf
  correction de parite sur une recette deja modifiee cote site.
- Ne pas laisser une fonctionnalite visible du site sans decision Android :
  porter en Native Lite ou documenter pourquoi l APK n'est pas concernee.

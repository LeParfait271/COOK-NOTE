# Android Legacy Cook Note

Ce document est la reference pour l'application Android Legacy Cook Note.
Elle est un projet secondaire en parallele du site, pas la source de verite.
GitHub et le site web restent prioritaires. La reference globale de
l'installation hors navigateur est dans `docs/apps-install-workflow.md`.

## Regle principale

L'application Android Legacy ne se met pas a jour automatiquement quand le site
change.

Un commit/push du site ne change pas l APK installe sur la tablette. Le site
peut continuer a evoluer, a bumper son cache, a modifier `dist/` ou a recevoir
des recettes sans regenerer ni publier un nouvel APK Android.

On met a jour l APK seulement quand l'utilisateur le demande explicitement, par
exemple avec une phrase du type :

- "mets a jour l APK"
- "rebuild l application Android"
- "prepare une nouvelle version tablette"

Sans demande explicite, ne pas lancer le build Android, ne pas remplacer l APK
sur la tablette et ne pas traiter Android comme une etape obligatoire du site.

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

La lecture doit rester confortable malgre le mode Lite : titres ellipses dans la
liste, fiche recette detaillee proche du site avec hero 16/9, actions dans le
hero, grille Ingredients/Etapes/Avant de commencer, infos rapides en pastilles,
ingredients en lignes lisibles, etapes numerotees et variantes cliquables. Les
fonctions reintegrees doivent rester natives et peu couteuses : favoris locaux
`SharedPreferences`, derniers ouverts, filtres saison/difficulte et copie des
ingredients vers le presse-papiers, liste de courses locale, copie fiche et
partage fiche, recette surprise depuis les filtres actifs et ecran actif
persistant pour cuisiner sans mise en veille. L accueil doit rester compact : la recherche et tous les filtres
doivent etre caches dans un panneau recherche/filtres replie qui s ouvre
seulement via `Recherche`. L accueil doit aussi garder un bouton
`Courses` compact et un bouton natif de mise a jour qui ouvre l URL GitHub
stable de l APK `cook-note-android-legacy.apk`. Ces elements restent des vues
Android simples, pas un rendu web.

La direction visuelle attendue est une refonte visuelle native premium mais
Native Lite : header compact avec stats locales, grille `GridView` en cartes
image 16/9 tactiles recyclees, fonds sombres cadres, etats presses via `StateListDrawable`,
sections cadrees, hero de fiche encadre, grille Ingredients/Etapes/Avant de
commencer, pastilles lisibles et actions principales/secondaires distinguees. Ne pas revenir a des controles Android par
defaut sans direction Cook Note.

L accueil parent Android doit reprendre le rangement du site : sans recherche
ni filtre actif, afficher seulement les fiches parents racines du catalogue,
pas toutes les recettes enfants en vrac. La puce `Toutes fiches` vit dans le
panneau recherche/filtres et permet de parcourir le catalogue cherchable sans
casser cet accueil parent.
La puce `Surprise` reste aussi dans ce panneau : elle ouvre une recette compatible
avec les filtres actifs, sans ajouter de carte permanente sur l accueil.
Les fiches parents doivent lire `master` et `additionalMasters`, afin que les
rattachements parents additionnels du site apparaissent dans les collections
Android Legacy.

Les variantes doivent suivre la construction du site. Les fiches parents et
collections affichent leurs recettes en grille de cartes parent 16/9 visibles,
comme sur le site, jamais dans un menu deroulant. Les fiches a variantes internes utilisent
une preparation choisie : une seule variante active affiche ses ingredients et
ses etapes, les autres restent dans le selecteur natif.

Le workflow officiel passe par `scripts/build-android-legacy-assets.js`, qui
genere une sortie dediee dans :

```text
android-legacy/build/generated/cook-note-lite
```

Cette sortie contient :

- `recipes-lite.json`, un catalogue compact sans source externe ;
- `images/`, les images recette locales reduites a `480px` maximum pour la liste ;
- `detail-images/`, les images de fiche reduites a `1280px` maximum ;
- des JPEG recompresses avec `jpeg-js` pour limiter le decode RAM/CPU ;
- aucun fichier `assets/www`, aucun React, aucun service worker et aucun CSS du site.

Le site et les recettes gardent les visuels habituels. La reduction d image ne
concerne que l APK Android 5.

## Pourquoi l app ne suit pas automatiquement le site

Le build normal du site doit rester rapide et propre :

- `npm run build` genere seulement le site public dans `dist/`
- `npm run check` valide le site et les garde-fous
- `npm run preflight` valide le deploiement site
- aucun de ces scripts ne doit lancer Gradle ni produire d APK

Le dossier Android lit les assets Lite uniquement pendant un build Android
demande :

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

Construire une nouvelle APK quand l'utilisateur le demande explicitement :

```powershell
npm run apps:update-all
```

La commande `npm run android:legacy:update-apk` existe encore comme
sous-commande de diagnostic, mais elle ne doit pas etre le workflow final :
`npm run apps:update-all` reste la commande finale pour garder le build, les
copies APK telechargeables et les checks alignes.

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

Sortie APK debug :

```text
android-legacy/app/build/outputs/apk/debug/app-debug.apk
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
les favoris locaux seraient perdus.

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
`downloads/cook-note-android-legacy-vX.YY.apk` sont versionnees quand
l utilisateur demande explicitement une publication app depuis le site.

## Workflow quand on travaille seulement sur le site

1. Modifier le site, les recettes ou les images selon la demande.
2. Bump version/cache avant push visible du site.
3. Lancer les checks habituels du site.
4. Commit et push.
5. Ne pas lancer `npm run android:legacy:update-apk`, sauf demande explicite.

Dans ce cas, l APK deja installe sur la tablette garde son ancien contenu.
C est voulu.

## Workflow quand l utilisateur demande une mise a jour APK

1. Synchroniser GitHub avec `git pull --ff-only`.
2. S assurer que le site est propre et que `dist/` est a jour.
3. Lancer `npm run apps:update-all`.
4. Verifier l APK :
   - `aapt dump badging android-legacy/app/build/outputs/apk/debug/app-debug.apk`
   - `apksigner verify --verbose android-legacy/app/build/outputs/apk/debug/app-debug.apk`
5. Ne pas committer les APK depuis les dossiers Android : ce sont des artefacts locaux ignores.
6. `npm run apps:update-all` copie l APK valide vers
   `downloads/cook-note-android-legacy.apk` et
   `downloads/cook-note-android-legacy-vX.YY.apk`. Verifier que
   `dist/downloads/` n existe pas.
7. Si l utilisateur demande aussi une Release GitHub, lancer
   `npm run apps:publish-all` apres authentification GitHub CLI.
8. Commit/push seulement les changements de code, documentation et copies APK demandees.
9. Donner le chemin local de l APK et/ou l URL de telechargement du site a l utilisateur.

## Fichiers importants

- `android-legacy/app/src/main/java/fr/cooknote/legacy/MainActivity.java`
  contient l interface native Android 5 Lite, les sections de fiche, les
  pastilles d infos, les favoris, les derniers ouverts, les filtres
  saison/difficulte dans un panneau recherche/filtres replie, la copie
  ingredients, la liste de courses locale, la copie fiche, le partage fiche,
  la recette surprise, l ecran actif persistant, le bouton natif de mise a jour
  et les etapes numerotees.
- `android-legacy/app/src/main/java/fr/cooknote/legacy/CookNoteRepository.java`
  lit `recipes-lite.json`, les `master`, les `additionalMasters` et les
  rattachements parents additionnels.
- `android-legacy/app/src/main/java/fr/cooknote/legacy/ImageLoader.java`
  decode les miniatures et les images detail locales en `RGB_565` avec un petit cache memoire.
- `android-legacy/app/build.gradle` lit `SITE_VERSION` dans `app.js` pour
  produire `versionName` et `versionCode`, puis monte
  `android-legacy/build/generated/cook-note-lite` comme assets APK.
- `scripts/build-android-legacy-assets.js` genere le catalogue Native Lite.
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
- Ne pas supprimer les fonctions natives legeres reintegrees : favoris locaux,
  derniers ouverts, filtres saison/difficulte, panneau recherche/filtres replie,
  copie ingredients, liste de courses locale, copie fiche, partage fiche,
  recette surprise et ecran actif persistant.
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
- Ne pas modifier les recettes pour l app Android sans demande separee.
- Ne pas supposer qu un push du site doit mettre a jour la tablette.

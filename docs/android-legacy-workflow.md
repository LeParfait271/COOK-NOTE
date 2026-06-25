# Android Legacy Cook Note

Ce document est la reference pour l'application Android Legacy Cook Note.
Elle est un projet secondaire en parallele du site, pas la source de verite.
GitHub et le site web restent prioritaires. La reference globale des quatre
installations est dans `docs/apps-install-workflow.md`.

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
lit un JSON local, affiche une `ListView` recyclee, ouvre les fiches dans des
vues Android natives, et charge les images avec un cache memoire limite.

La lecture doit rester confortable malgre le mode Lite : titres ellipses dans la
liste, fiches decoupees en sections natives, infos rapides en pastilles,
ingredients en lignes lisibles, etapes numerotees et variantes cliquables. Les
fonctions reintegrees doivent rester natives et peu couteuses : favoris locaux
`SharedPreferences`, derniers ouverts, filtres saison/difficulte et copie des
ingredients vers le presse-papiers. Ces elements restent des vues Android
simples, pas un rendu web.

Le workflow officiel passe par `scripts/build-android-legacy-assets.js`, qui
genere une sortie dediee dans :

```text
android-legacy/build/generated/cook-note-lite
```

Cette sortie contient :

- `recipes-lite.json`, un catalogue compact sans source externe ;
- `images/`, les images recette locales reduites a `480px` maximum pour la liste ;
- `detail-images/`, les images de fiche reduites a `960px` maximum ;
- des JPEG recompresses avec `jpeg-js` pour limiter le decode RAM/CPU ;
- aucun fichier `assets/www`, aucun React, aucun service worker et aucun CSS du site.

Le site HD, Android Modern et les recettes gardent les visuels habituels. La
reduction d image ne concerne que l APK Android 5.

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
quand Android Legacy change, Android Modern et les deux entrees iOS PWA doivent
etre revus dans le meme lot. Cette mise a jour groupee est obligatoire pour
eviter une app en avance sur les autres.

Publier l APK courant sur GitHub Releases, seulement sur demande explicite :

```powershell
npm run apps:publish-all
```

Cette commande demande GitHub CLI (`gh`) authentifie. Elle cree ou met a jour
une release commune `apps-vX.YY` et publie l APK sous le nom stable
`cook-note-android-legacy.apk`.

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
```

Cette URL reste la meme d une version Android a l autre. Le fichier source
autorise est `downloads/cook-note-android-legacy.apk`. Il ne doit pas etre copie
dans `dist/`, car Cloudflare Pages limite chaque fichier public a 25 MiB. Le
panneau garde aussi un lien brut `raw.githubusercontent.com` et une page GitHub
du fichier pour les navigateurs anciens qui gerent mal le telechargement direct.

Les APK generes dans `android-legacy/` ne doivent pas etre ajoutes au depot Git.
Seule la copie telechargeable `downloads/cook-note-android-legacy.apk` est
versionnee quand l utilisateur demande explicitement une publication app depuis
le site.

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
   - `aapt dump badging android-modern/app/build/outputs/apk/debug/app-debug.apk`
   - `apksigner verify --verbose android-legacy/app/build/outputs/apk/debug/app-debug.apk`
   - `apksigner verify --verbose android-modern/app/build/outputs/apk/debug/app-debug.apk`
5. Ne pas committer les APK depuis les dossiers Android : ce sont des artefacts locaux ignores.
6. `npm run apps:update-all` copie ensemble les APK valides vers
   `downloads/cook-note-android-legacy.apk` et
   `downloads/cook-note-android-modern.apk`. Verifier que `dist/downloads/`
   n existe pas.
7. Si l utilisateur demande aussi une Release GitHub, lancer
   `npm run apps:publish-all` apres authentification GitHub CLI.
8. Commit/push seulement les changements de code, documentation et copies APK demandees.
9. Donner le chemin local de l APK et/ou l URL de telechargement du site a l utilisateur.

## Fichiers importants

- `android-legacy/app/src/main/java/fr/cooknote/legacy/MainActivity.java`
  contient l interface native Android 5 Lite, les sections de fiche, les
  pastilles d infos, les favoris, les derniers ouverts, les filtres
  saison/difficulte, la copie ingredients et les etapes numerotees.
- `android-legacy/app/src/main/java/fr/cooknote/legacy/CookNoteRepository.java`
  lit `recipes-lite.json`.
- `android-legacy/app/src/main/java/fr/cooknote/legacy/ImageLoader.java`
  decode les miniatures et les images detail locales en `RGB_565` avec un petit cache memoire.
- `android-legacy/app/build.gradle` lit `SITE_VERSION` dans `app.js` pour
  produire `versionName` et `versionCode`, puis monte
  `android-legacy/build/generated/cook-note-lite` comme assets APK.
- `scripts/build-android-legacy-assets.js` genere le catalogue Native Lite.
- `scripts/build-android-legacy.ps1` construit l APK et nettoie la sortie APK
  avant packaging.
- `scripts/publish-android-release.ps1` publie l APK local sur GitHub Releases
  avec l asset stable `cook-note-android-legacy.apk`.
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
  derniers ouverts, filtres saison/difficulte et copie ingredients.
- Ne pas publier une nouvelle release APK sans demande explicite.
- Ne jamais publier un seul APK : toute mise a jour app doit passer par
  `npm run apps:update-all`.
- Ne pas traiter l APK comme la source de verite des recettes.
- Ne pas modifier les recettes pour l app Android sans demande separee.
- Ne pas supposer qu un push du site doit mettre a jour la tablette.

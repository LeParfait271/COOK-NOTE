# Cook Note Android Legacy

Application Android 5.0 compatible pour Cook Note, optimisee pour tablettes
anciennes avec peu de RAM et CPU modeste.

Important: cette application est un projet secondaire. Elle ne se met pas a jour
automatiquement quand le site change, et elle ne doit pas etre branchee sur
`npm run build`, `npm run check` ou `npm run preflight`.

Le mode d'emploi complet est dans
[`docs/android-legacy-workflow.md`](../docs/android-legacy-workflow.md).

## Principe

- Android minimum: `minSdkVersion 21`, donc Android 5.0
- Nom installe: `Cook Note Android 5.0+`
- App native Java Native Lite, sans WebView systeme et sans GeckoView
- Catalogue local `recipes-lite.json`
- Images locales reduites a `480px` max pour l APK Android 5 uniquement
- Liste recyclee, fiches natives, cache image limite
- Fonctions natives legeres : favoris locaux, derniers ouverts, filtres
  saison/difficulte et copie ingredients
- aucun changement de recette requis pour l app

## Mise a jour explicite

Ne construire une nouvelle APK que si l'utilisateur le demande explicitement.

Depuis la racine du depot :

```powershell
npm run apps:update-all
```

Sortie APK :

```text
android-legacy/app/build/outputs/apk/debug/app-debug.apk
```

Si Java, Gradle ou Android SDK sont absents :

```powershell
npm run android:legacy:setup
```

## Publication GitHub

Le site peut proposer le bouton `Android 5.0+` en bas de page. Ce bouton pointe
vers la copie APK stable du depot GitHub :

```text
https://github.com/LeParfait271/COOK-NOTE/raw/main/downloads/cook-note-android-legacy.apk
```

Ne publier cette APK que sur demande explicite :

```powershell
npm run apps:publish-all
```

Cette commande demande `gh` authentifie et ne doit pas etre branchee au build
normal du site.

## Garde-fou

```powershell
npm run validate:android
```

Ce check verifie que le workflow Android reste manuel, que les assets APK
generes ne sont pas versionnes, et que l app Legacy reste native Lite.

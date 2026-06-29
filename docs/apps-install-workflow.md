# Application Cook Note

Ce document est la reference pour l'installation Cook Note hors navigateur.
Le site web et GitHub restent la source de verite. L'application Android est un
projet secondaire manuel.

## Entree Android du footer

Le footer du site doit proposer une seule installation :

- `Android 5.0+` : APK Android Legacy pour tablette ancienne, nom installe
  `Cook Note Android 5.0+`, asset stable `cook-note-android-legacy.apk`
  et nom APK versionne `cook-note-android-legacy-vX.YY.apk`.

Le bouton doit afficher la version minimale directement dans son label :
`Android 5.0+`. Il ouvre un panneau d'installation. Le bouton primaire utilise
l'URL GitHub standard, pas Cloudflare Pages, car Pages limite chaque asset
public a 25 MiB :

```text
https://github.com/LeParfait271/COOK-NOTE/raw/main/downloads/cook-note-android-legacy-vX.YY.apk
```

Le panneau doit aussi garder un lien brut de secours :

```text
https://raw.githubusercontent.com/LeParfait271/COOK-NOTE/main/downloads/cook-note-android-legacy-vX.YY.apk
```

Et une page GitHub de secours si le navigateur de la tablette refuse le
telechargement direct. L'alias stable `cook-note-android-legacy.apk` reste
present pour les mises a jour natives depuis l'application deja installee.

Les copies telechargeables sont versionnees uniquement dans `downloads/`. Elles
ne doivent pas etre copiees dans `dist/`, sinon le deploy Cloudflare Pages peut
echouer. Les APK generes dans le dossier Android restent des artefacts locaux
ignores.

## Mise a jour explicite

Quand l'application Cook Note est mise a jour, utiliser le workflow commun
historique. Il ne construit maintenant que l'APK Android Legacy :

```powershell
npm run apps:update-all
```

Cette commande reconstruit le site courant, fabrique Android Legacy, puis
remplace les deux copies telechargeables autorisees :

```text
downloads/cook-note-android-legacy.apk
downloads/cook-note-android-legacy-vX.YY.apk
```

L'app ancienne reste volontairement legere : Android 5.0+ garde Native Lite avec
images reduites et interface Android native.

Publication Release GitHub, seulement sur demande explicite :

```powershell
npm run apps:publish-all
```

La commande `npm run android:legacy:update-apk` reste une sous-commande de
diagnostic. Elle ne doit pas etre utilisee comme workflow final de publication.

## Android Legacy

- Dossier : `android-legacy/`
- Package : `fr.cooknote.legacy`
- Android minimum : `minSdk 21`
- Objectif : Android 5.0, MediaPad T10 et tablettes anciennes avec 2 Go de RAM
- Moteur : aucun moteur web lourd, app native Java Native Lite
- Donnees embarquees : `recipes-lite.json` et images locales dans
  `android-legacy/build/generated/cook-note-lite`
- Images Legacy : miniatures de grille `480px` maximum, images de fiche
  `1280px` maximum, JPEG recompresses via `jpeg-js`, decodees en `RGB_565`
  avec petit cache memoire
- Interface : `GridView` recyclee en cartes image 16/9 proches du site, accueil
  parent Android compact avec les fiches parents du site par defaut, panneau
  recherche/filtres replie, recherche locale, filtres categories, filtres
  saison/difficulte, favoris locaux, derniers ouverts, fiche recette detaillee
  proche du site avec hero 16/9, actions dans le hero, grille
  Ingredients/Etapes/Avant de commencer, infos rapides en pastilles,
  ingredients en lignes, copie ingredients, rattachements parents additionnels,
  bouton natif de mise a jour, liste de courses locale, copie fiche, partage
  fiche, recette surprise, ecran actif persistant, etapes numerotees, cartes
  parent visibles et selecteurs natifs de preparation
- Direction visuelle Android Legacy : refonte visuelle native premium sans
  moteur web, header compact avec stats locales, grille `GridView` en cartes
  image 16/9 tactiles recyclees, hero de fiche encadre, sections cadrees,
  pastilles lisibles, etats presses natifs et actions principales/secondaires
  distinguees

Garde-fou lexical : workflow commun historique, fiche recette detaillee proche du site, grille Ingredients/Etapes/Avant de commencer, filtres saison/difficulte, accueil parent Android, selecteurs natifs de preparation, partage fiche, cartes parent visibles, recette surprise, ecran actif persistant.

Le panneau recherche/filtres replie garde les filtres hors de l'accueil tant que
l'utilisateur ne touche pas `Recherche`. Le bouton natif de mise a jour reste
disponible sous forme compacte avec `Mise a jour`. La puce `Toutes fiches`
reste dans le panneau de recherche pour parcourir le catalogue complet sans
remettre les recettes enfants en vrac sur l'accueil.
La puce `Surprise` reste dans ce meme panneau et ouvre une recette compatible
avec les filtres actifs. Le reglage `Ecran actif` reste natif et persistant pour
cuisiner sans mise en veille.

Les fiches parents lisent `master` et `additionalMasters`, afin que les
rattachements parents additionnels du site soient visibles dans l'app. Les
collections Android Legacy doivent afficher les recettes en grille de cartes
parent 16/9 visibles, comme le site, pas dans un menu deroulant. Les fiches avec
variantes internes gardent une preparation choisie : une seule preparation
active affiche ingredients et etapes.

Le bouton `Courses` ouvre une liste locale simple stockee en `SharedPreferences`
et copiable, sans serveur, sans WebView et sans fusion couteuse. Le bouton natif
de mise a jour ouvre toujours l'APK Android 5.0+ stable.

Les assets Legacy sont generes par `scripts/build-android-legacy-assets.js`.
Android Legacy ne doit pas embarquer `assets/www`, React, service worker,
GeckoView, WebView systeme ou serveur HTTP local. Elle reste sans GeckoView.

Build explicite :

```powershell
npm run apps:update-all
```

Sortie locale :

```text
android-legacy/app/build/outputs/apk/debug/app-debug.apk
```

Publication explicite :

```powershell
npm run apps:publish-all
```

## Release GitHub

Le script `scripts/publish-android-release.ps1` publie dans une release commune :

```text
apps-vX.YY
```

Cette release doit contenir les deux assets Android Legacy :

```text
cook-note-android-legacy.apk
cook-note-android-legacy-vX.YY.apk
```

`gh` doit etre installe et authentifie avec `gh auth login`. Si `gh` est absent,
le script doit echouer proprement sans modifier Git ni l'APK.

La Release GitHub est optionnelle. Le bouton du site ne depend pas de `gh` tant
que les copies `downloads/*.apk` sont presentes dans le depot GitHub.

## Regles de travail

- Ne jamais versionner les APK generes dans `android-legacy/`.
- Les seules copies APK autorisees dans Git sont
  `downloads/cook-note-android-legacy.apk` et
  `downloads/cook-note-android-legacy-vX.YY.apk`, apres demande explicite de
  publication app.
- Ne jamais copier les APK dans `dist/` : Cloudflare Pages refuse les assets de
  plus de 25 MiB.
- Ne jamais versionner `android-legacy/build/generated/cook-note-lite/`.
- Ne jamais brancher l'app Android a `npm run build`, `npm run check`,
  `npm run preflight`, `start` ou `dev`.
- Ne publier une nouvelle app que sur demande explicite utilisateur.
- Toute mise a jour app doit passer par `npm run apps:update-all`.
- Toute publication Release app doit passer par `npm run apps:publish-all`.
- Un push du site ne met pas a jour les apps deja installees.
- L'app Android Legacy peut sacrifier un peu de qualite visuelle pour la
  fluidite, mais elle doit garder une direction native premium et lisible.
- Les recettes ne doivent pas etre modifiees pour une app mobile sans demande
  separee.

# Application Cook Note

Ce document est la reference pour l'installation Cook Note hors navigateur.
Le site web et GitHub restent la source de verite. L'application Android est un
projet secondaire manuel avec parite site/app pour les changements visibles.

## Entree Android du footer

Le footer du site doit proposer une seule installation :

- `Android 5.0+` : APK Android Legacy pour tablette ancienne, nom installe
  `Cook Note Android 5.0+` et asset stable `cook-note-android-legacy.apk`.

Le bouton doit afficher la version minimale directement dans son label :
`Android 5.0+`. Il telecharge directement l'APK depuis l'URL brute stable :

```text
https://raw.githubusercontent.com/LeParfait271/COOK-NOTE/main/downloads/cook-note-android-legacy.apk
```

Ce chemin ne contient jamais la version et ne change pas lors d'une mise a
jour. L'alias stable sert aussi aux mises a jour natives depuis l'application
deja installee. Le nom APK versionne reste un artefact de publication et ne
doivent pas etre utilises par le bouton du footer.

Les copies telechargeables sont versionnees uniquement dans `downloads/`. Elles
ne doivent pas etre copiees dans `dist/`, sinon le deploy Cloudflare Pages peut
echouer. Le nom versionne affiche par le site vient de
`ANDROID_LEGACY_APK_VERSION` dans `app.js`, et cette valeur doit toujours etre
la meme version produit `X.YY` que `SITE_VERSION` et `cookNoteAndroidVersion`.
Les APK generes dans le dossier Android restent des artefacts locaux ignores.

## Mise a jour explicite ou parite site/app

Quand l'application Cook Note est mise a jour, utiliser le workflow commun
historique. Il ne construit maintenant que l'APK Android Legacy :

```powershell
npm run apps:update-all
```

Cette commande reconstruit le site courant, verifie que la version produit
site/APK est alignee, fabrique Android Legacy, puis remplace les deux copies
telechargeables autorisees :

```text
downloads/cook-note-android-legacy.apk
downloads/cook-note-android-legacy-vX.YY.apk
```

L'app ancienne reste volontairement legere : Android 5.0+ garde Native Lite avec
images reduites et interface Android native.

Regle de parite : quand une fonctionnalite visible du site, une recette, le
catalogue ou une UX utile sur tablette change, porter l'equivalent en Native
Lite pour tablette peu puissante et lancer `npm run apps:update-all` dans le
meme lot. Ne pas copier le web : adapter en vues natives simples, peu gourmandes
en CPU, RAM, GPU et batterie. Un changement purement technique du site ou une
demande web-only peut laisser l APK inchangee, avec justification dans le compte
rendu.
Garde-fou parite site/app : fonctionnalite visible du site -> Native Lite pour tablette peu puissante.

Regle permanente de version : toute modification versionnee du projet augmente
la version produit de `0.01`, y compris documentation, scripts, CI, admin local,
build et correctifs techniques. Le site et l APK doivent toujours porter la meme
version produit `X.YY`. `node scripts/bump-version.js --next` synchronise
`SITE_VERSION`, `ANDROID_LEGACY_APK_VERSION` et `cookNoteAndroidVersion`, puis
`npm run apps:update-all` reconstruit obligatoirement le site et l APK du meme
numero avant commit.

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
  parent Android compact avec les fiches parents du site par defaut, recherche
  simple sans filtres, fiche recette detaillee
  proche du site avec hero 16/9, actions utiles dans le hero, grille
  Ingredients/Etapes/Avant de commencer, infos rapides en pastilles allegees,
  ingredients en lignes, copie ingredients, rattachements parents additionnels,
  bouton natif de mise a jour, liste de courses locale, copie fiche, selecteur
  de personnes, recherche intelligente sans filtres, navigation restaurable, swipe
  retour bord gauche, recherche temporisee, prechargement images borne, decode
  image serialise, coalescence chargements image, chargements visibles
  coalesces, decodages visibles obsoletes ignores, images visibles prioritaires,
  file image prioritaire, annulation prefetch obsolete, cache image normalise,
  nettoyage vues recyclees, vues image recyclees detachees,
  cibles image obsoletes liberees, images ecran detachees avant remplacement,
  prechauffage images differe, position de grille
  conservee, prechauffage visible apres scroll, annulation prechauffage en fling,
  prefetch ralenti hors inertie, mots recherche predecoupes, fuzzy sans split,
  allocations recherche reduites, cache resultats recherche borne,
  requetes recentes reutilisees, classement recherche memoise, catalogue parent precompile, enfants parents preclasses,
  compteurs collection caches, liberation memoire de liste, pile retour bornee, prefetch carte
  borne, courses cochables, audit perf leger, ecran actif persistant, etapes numerotees, quantites ajustables,
  courses fusionnees, preferences locales discretes, diagnostic hors ligne,
  cache image adaptatif, scroll fluide, index recherche precompile, cartes
  parent visibles, selecteurs natifs de preparation, Avant de commencer complet
  derive des helpers web avec allergenes, materiel, poids moyens, timing,
  recettes liees, conseils pratiques, notes restantes et fiche technique
- Direction visuelle Android Legacy : refonte visuelle native premium sans
  moteur web, header compact avec stats locales, grille `GridView` en cartes
  image 16/9 tactiles recyclees, hero de fiche encadre, sections cadrees,
  pastilles lisibles, etats presses natifs et actions principales/secondaires
  distinguees
- Theme Android Legacy : mode nuit premium unique, sans selecteur de theme ni
  reglage visuel superflu, aucune WebView et aucun CSS web pour piloter l APK.

Garde-fou lexical : workflow commun historique, fiche recette detaillee proche du site, grille Ingredients/Etapes/Avant de commencer, recherche simple sans filtres, recherche intelligente sans filtres, recherche temporisee, index recherche precompile, mots recherche predecoupes, fuzzy sans split, allocations recherche reduites, cache resultats recherche borne, requetes recentes reutilisees, classement recherche memoise, accueil parent Android, selecteurs natifs de preparation, selecteur de personnes, allergenes et poids moyens Android, navigation restaurable, swipe retour bord gauche, prechargement images borne, decode image serialise, coalescence chargements image, chargements visibles coalesces, decodages visibles obsoletes ignores, images visibles prioritaires, file image prioritaire, annulation prefetch obsolete, cache image normalise, nettoyage vues recyclees, vues image recyclees detachees, cibles image obsoletes liberees, images ecran detachees avant remplacement, prechauffage images differe, prechauffage visible apres scroll, annulation prechauffage en fling, prefetch ralenti hors inertie, catalogue parent precompile, enfants parents preclasses, compteurs collection caches, position de grille conservee, liberation memoire de liste, pile retour bornee, prefetch carte borne, courses cochables, courses fusionnees, quantites ajustables, preferences locales discretes, theme jour/nuit natif, diagnostic hors ligne, cache image adaptatif, scroll fluide, audit perf leger, cartes parent visibles, ecran actif persistant.

La recherche Android Legacy reste volontairement basique : elle est fermee tant
que l'utilisateur ne touche pas `Recherche`, puis affiche seulement un champ
texte et `Effacer`. Elle cherche dans tout le catalogue, sans filtres de
categorie, saison, difficulte, favoris, recents, `Toutes fiches` ou bouton aleatoire.
Le moteur peut classer par pertinence, ignorer les accents et tolerer de petites
fautes sans ajouter de controles visibles.
Le bouton natif de mise a jour reste disponible sous forme compacte avec
`Mise a jour`. Le reglage `Ecran actif` reste natif et persistant pour cuisiner
sans mise en veille.

Les fiches parents lisent `master` et `additionalMasters`, afin que les
rattachements parents additionnels du site soient visibles dans l'app. La
hierarchie est strictement plate : les 8 fiches parentes racines affichent
directement les recettes en grille de cartes 16/9, sans collection ou fiche
parente intermediaire et sans menu deroulant. Les fiches avec
variantes internes gardent une preparation choisie : une seule preparation
active affiche ingredients et etapes.

Le bouton `Courses` ouvre une liste locale simple stockee en `SharedPreferences`,
cochable et copiable, avec une fusion native legere des ingredients compatibles,
sans serveur et sans WebView. Le bouton natif de mise a jour ouvre toujours
l'APK Android 5.0+ stable.

Les assets Legacy sont generes par `scripts/build-android-legacy-assets.js`.
Android Legacy ne doit pas embarquer `assets/www`, React, service worker,
GeckoView, WebView systeme ou serveur HTTP local. Elle reste sans GeckoView.

Build explicite :

```powershell
npm run apps:update-all
```

Sortie locale officielle :

```text
android-legacy/app/build/outputs/apk/release/app-release.apk
```

L APK distribue par le workflow officiel est un build `release`, signe avec la
configuration debug locale du workflow manuel, avec R8 actif et ressources
shrinkees.

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
  `downloads/cook-note-android-legacy-vX.YY.apk`, apres workflow de parite
  site/app ou demande explicite de publication app.
- Ne jamais copier les APK dans `dist/` : Cloudflare Pages refuse les assets de
  plus de 25 MiB.
- Ne jamais versionner `android-legacy/build/generated/cook-note-lite/`.
- Ne jamais brancher l'app Android a `npm run build`, `npm run check`,
  `npm run preflight`, `start` ou `dev`.
- Ne publier une Release GitHub app que sur demande explicite utilisateur.
- Toute mise a jour app doit passer par `npm run apps:update-all`.
- Toute publication Release app doit passer par `npm run apps:publish-all`.
- Un push du site ne met pas a jour les apps deja installees.
- Une mise a jour visible du site doit auditer la parite Android : porter en
  Native Lite ou expliquer pourquoi l APK n'est pas concernee.
- L'app Android Legacy peut sacrifier un peu de qualite visuelle pour la
  fluidite, mais elle doit garder une direction native premium et lisible.
- Les recettes ne doivent pas etre modifiees pour une app mobile sans demande
  separee.

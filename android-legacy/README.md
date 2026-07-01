# Cook Note Android Legacy

Application Android 5.0 compatible pour Cook Note, optimisee pour tablettes
anciennes avec peu de RAM et CPU modeste.

Important: cette application est un projet secondaire avec parite site/app. Elle
ne se met pas a jour automatiquement sur la tablette quand le site change, et
elle ne doit pas etre branchee sur `npm run build`, `npm run check` ou
`npm run preflight`. En revanche, toute mise a jour visible du site utile sur
tablette doit etre auditee et portee en Native Lite dans le meme lot.
Garde-fou parite site/app : fonctionnalite visible du site -> Native Lite pour tablette peu puissante.

Le mode d'emploi complet est dans
[`docs/android-legacy-workflow.md`](../docs/android-legacy-workflow.md).

## Principe

- Android minimum: `minSdkVersion 21`, donc Android 5.0
- Nom installe: `Cook Note Android 5.0+`
- App native Java Native Lite, sans WebView systeme et sans GeckoView
- Catalogue local `recipes-lite.json`
- Images locales reduites a `480px` max pour l APK Android 5 uniquement
- accueil parent Android compact avec les fiches parents du site par defaut,
  grille recyclee de cartes image 16/9 proches du site, recherche simple sans filtres
  et cache image limite
- refonte visuelle native premium : header compact, stats locales, cartes
  tactiles, sections cadrees, hero de fiche encadre, fiche recette detaillee proche du site,
  grille Ingredients/Etapes/Avant de commencer et actions principales / secondaires distinguees
- rattachements parents additionnels lus depuis `additionalMasters` pour que
  les fiches parents affichent tout leur contenu range
- Recherche basique et efficace : un champ texte, un bouton `Effacer`, aucun
  filtre dans la recherche, avec recherche intelligente sans filtres sous le capot
- cartes parent visibles pour les collections, avec des cartes parent 16/9
  visibles comme sur le site, sans menu deroulant pour choisir une recette
- selecteurs natifs uniquement pour la preparation choisie des fiches a
  variantes internes, sans afficher toutes les variantes en bloc
- Fonctions natives legeres : favoris locaux, recherche simple sans filtres,
  copie ingredients, liste de courses locale, quantites ajustables, courses
  fusionnees, preferences locales discretes, diagnostic hors ligne, index
  recherche precompile, recherche temporisee, cache image adaptatif, decode
  image serialise, coalescence chargements image, chargements visibles
  coalesces, decodages visibles obsoletes ignores, images visibles prioritaires,
  file image prioritaire, annulation prefetch obsolete, cache image normalise,
  nettoyage vues recyclees, vues image recyclees detachees,
  cibles image obsoletes liberees, images ecran detachees avant remplacement,
  prechauffage images differe, scroll fluide,
  prechauffage visible apres scroll, annulation prechauffage en fling,
  prefetch ralenti hors inertie,
  mots recherche predecoupes, fuzzy sans split, allocations recherche reduites,
  cache resultats recherche borne, requetes recentes reutilisees, classement recherche memoise,
  catalogue parent precompile, enfants parents preclasses, compteurs collection caches,
  position de grille conservee, prefetch carte borne, copie fiche,
  partage fiche, navigation restaurable, swipe retour bord gauche,
  prechargement images borne, liberation memoire de liste, courses cochables,
  audit perf leger, ecran actif persistant et bouton natif de mise a jour
- Garde-fou lexical : bouton natif de mise a jour, ecran actif persistant,
  cartes parent visibles, recherche simple sans filtres, recherche intelligente
  sans filtres, recherche temporisee, navigation restaurable, swipe retour bord
  gauche, prechargement images borne, decode image serialise, coalescence
  chargements image, chargements visibles coalesces, decodages visibles
  obsoletes ignores, images visibles prioritaires, file image prioritaire,
  annulation prefetch obsolete, cache image normalise, nettoyage vues recyclees,
  vues image recyclees detachees, cibles image obsoletes liberees,
  images ecran detachees avant remplacement, prechauffage images differe,
  position de grille conservee, liberation memoire de liste,
  prechauffage visible apres scroll, annulation prechauffage en fling,
  prefetch ralenti hors inertie, mots recherche predecoupes, fuzzy sans split,
  allocations recherche reduites, cache resultats recherche borne,
  requetes recentes reutilisees, classement recherche memoise, catalogue parent precompile, enfants parents preclasses,
  compteurs collection caches, prefetch carte borne, courses cochables, courses fusionnees, quantites ajustables,
  preferences locales discretes, diagnostic hors ligne, cache image adaptatif,
  scroll fluide, index recherche precompile, audit perf leger
- aucun changement de recette requis pour l app

## Mise a jour explicite ou parite site/app

Construire une nouvelle APK si la parite site/app l'exige ou si l'utilisateur
le demande explicitement. Adapter les fonctionnalites au format Native Lite pour
tablette peu puissante.

Depuis la racine du depot :

```powershell
npm run apps:update-all
```

Sortie APK :

```text
android-legacy/app/build/outputs/apk/release/app-release.apk
```

Si Java, Gradle ou Android SDK sont absents :

```powershell
npm run android:legacy:setup
```

## Publication GitHub

Le site peut proposer le bouton `Android 5.0+` en bas de page. Ce bouton pointe
vers la copie APK au nom APK versionne du depot GitHub, avec un alias stable
pour la mise a jour native :

```text
https://github.com/LeParfait271/COOK-NOTE/raw/main/downloads/cook-note-android-legacy.apk
https://github.com/LeParfait271/COOK-NOTE/raw/main/downloads/cook-note-android-legacy-vX.YY.apk
```

L app Android 5.0+ affiche aussi `Mise a jour` dans son accueil. Ce bouton
ouvre la meme URL stable pour telecharger la nouvelle APK et l installer
par-dessus l ancienne sans perdre les donnees locales.

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
generes ne sont pas versionnes, que l app Legacy reste native Lite et que la
parite site/app visible reste documentee.

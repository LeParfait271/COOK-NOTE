# Applications Cook Note

Ce document est la reference pour les installations Cook Note hors navigateur.
Le site web et GitHub restent la source de verite. Les applications sont des
projets secondaires manuels.

## Les 4 entrees du footer

Le footer du site doit proposer quatre installations distinctes :

- `Android 5.0+` : APK Android Legacy pour tablette ancienne, nom installe
  `Cook Note Android 5.0+`, asset stable `cook-note-android-legacy.apk`
  et nom APK versionne `cook-note-android-legacy-vX.YY.apk`
- `Android 8.0+` : APK Android Modern, nom installe
  `Cook Note HD Android 8.0+`, asset
  stable `cook-note-android-modern.apk`, nom APK versionne
  `cook-note-android-modern-vX.YY.apk`, rendu HD premium via `modern-app-hd`
- `iOS ancien` : installation PWA Safari guidee
- `iOS recent` : installation PWA Safari guidee, rendu HD premium via
  `modern-app-hd` quand elle est lancee en plein ecran

Les deux boutons Android doivent afficher la version minimale directement dans
leur label : `Android 5.0+` et `Android 8.0+`. Ils ouvrent un panneau d'installation. Le bouton primaire
utilise l'URL GitHub standard, pas Cloudflare Pages, car Pages limite chaque
asset public a 25 MiB :

```text
https://github.com/LeParfait271/COOK-NOTE/raw/main/downloads/cook-note-android-legacy-vX.YY.apk
https://github.com/LeParfait271/COOK-NOTE/raw/main/downloads/cook-note-android-modern-vX.YY.apk
```

Le panneau doit aussi garder un lien brut de secours :

```text
https://raw.githubusercontent.com/LeParfait271/COOK-NOTE/main/downloads/cook-note-android-legacy-vX.YY.apk
https://raw.githubusercontent.com/LeParfait271/COOK-NOTE/main/downloads/cook-note-android-modern-vX.YY.apk
```

Et une page GitHub de secours si le navigateur de la tablette refuse le
telechargement direct. Les alias stables `cook-note-android-legacy.apk` et
`cook-note-android-modern.apk` restent presents pour les mises a jour natives
depuis les applications deja installees.

Les copies telechargeables sont versionnees uniquement dans `downloads/`. Elles
ne doivent pas etre copiees dans `dist/`, sinon le deploy Cloudflare Pages peut
echouer. Les APK generes dans les dossiers Android restent des artefacts locaux
ignores.

Les deux boutons iOS ouvrent un panneau d'aide dans le site. Ils ne doivent pas pretendre telecharger un `.ipa` directement.

## Mise a jour groupee obligatoire

Quand une application Cook Note est mise a jour, toutes les applications doivent
etre traitees dans le meme lot. Ne jamais publier un seul APK ou une seule
entree app en decalage.

Workflow normal :

```powershell
npm run apps:update-all
```

Cette commande reconstruit le site courant, fabrique Android Legacy et Android
Modern, puis remplace ensemble les deux copies telechargeables :

```text
downloads/cook-note-android-legacy.apk
downloads/cook-note-android-modern.apk
downloads/cook-note-android-legacy-vX.YY.apk
downloads/cook-note-android-modern-vX.YY.apk
```

Les deux entrees iOS restent des installations PWA Safari, donc elles ne
produisent pas d APK ou d IPA. Elles doivent quand meme etre verifiees dans le
meme lot : libelles du footer, panneau d aide, manifest PWA, balises Apple et
absence de promesse de telechargement `.ipa`.

Les apps anciennes restent volontairement legeres : Android 5.0+ garde Native Lite
avec images reduites, et iOS ancien garde la PWA simple Safari. Les apps
recentes peuvent au contraire utiliser le rendu premium `modern-app-hd`.
Android Modern s'identifie avec le user-agent `CookNoteModernApp/HD`, puis le
site applique le skin HD. iOS recent applique le meme skin seulement en PWA plein
ecran sur appareil Apple moderne.

Publication Release GitHub, seulement sur demande explicite :

```powershell
npm run apps:publish-all
```

Les commandes `npm run android:legacy:update-apk`,
`npm run android:modern:update-apk`, `npm run android:legacy:publish-release`
et `npm run android:modern:publish-release` sont des sous-commandes de
diagnostic. Elles ne doivent pas etre utilisees comme workflow final de
publication, parce qu elles peuvent laisser une seule app en avance sur les
autres.

## Limite Apple

Un vrai `.ipa` iPhone/iPad ne s'installe pas librement depuis un simple bouton
web. Il faut une signature Apple et une distribution App Store, TestFlight,
Ad Hoc, Enterprise ou MDM.

Pour une installation directe depuis le site, le chemin fiable est donc :

1. ouvrir Cook Note dans Safari ;
2. utiliser `Partager` ;
3. choisir `Ajouter a l ecran d accueil` ;
4. lancer Cook Note depuis l icone.

Les balises PWA Apple doivent rester dans `index.html` et dans les pages
prerendues par `scripts/build-site.js`.

## Android Legacy

- Dossier : `android-legacy/`
- Package : `fr.cooknote.legacy`
- Android minimum : `minSdk 21`
- Objectif : Android 5.0, MediaPad T10 et tablettes anciennes avec 2 Go de RAM
- Moteur : aucun moteur web lourd, app native Java Native Lite
- Donnees embarquees : `recipes-lite.json` et images locales dans
  `android-legacy/build/generated/cook-note-lite`
- Images Legacy : miniatures de grille `480px` maximum, images de fiche
  `960px` maximum, JPEG recompresses via `jpeg-js`, decodees en `RGB_565`
  avec petit cache memoire
- Interface : `GridView` recyclee en cartes image proches du site, accueil parent Android
  compact avec les fiches parents du site par defaut, panneau recherche/filtres replie,
  recherche locale, filtres categories, filtres saison/difficulte, favoris locaux,
  derniers ouverts, fiches natives en sections lisibles, infos rapides en
  pastilles, ingredients en lignes, copie ingredients, rattachements parents
  additionnels, bouton natif de mise a
  jour, liste de courses locale, copie fiche, partage fiche, etapes numerotees
  cartes parent visibles et selecteurs natifs de preparation
- Direction visuelle Android Legacy : refonte visuelle native premium sans moteur web,
  header compact avec stats locales, grille `GridView` en cartes image tactiles
  recyclees, hero de fiche encadre, sections cadrees, pastilles lisibles, etats
  presses natifs et actions principales/secondaires distinguees

Le panneau recherche/filtres replie garde les filtres hors de l accueil tant
que l utilisateur ne touche pas `Recherche`. Le bouton natif de mise
a jour reste disponible sous forme compacte avec `Mise a jour`.
La puce `Toutes fiches` reste dans le panneau de recherche pour parcourir le
catalogue complet sans remettre les recettes enfants en vrac sur l'accueil.
Les fiches parents lisent `master` et `additionalMasters`, afin que les
rattachements parents additionnels du site soient visibles dans l app.
Les collections Android Legacy doivent afficher les recettes en cartes parent
visibles, comme le site, pas dans un menu deroulant. Les fiches avec variantes
internes gardent une preparation choisie : une seule preparation active affiche
ingredients et etapes.
Le bouton `Courses` ouvre une liste locale simple stockee en `SharedPreferences`
et copiable, sans serveur, sans WebView et sans fusion couteuse.
Le bouton natif de mise a jour ouvre toujours l APK Android 5.0+ stable.

Les assets Legacy sont generes par `scripts/build-android-legacy-assets.js`.
Android Legacy ne doit pas embarquer `assets/www`, React, service worker,
GeckoView, WebView systeme ou serveur HTTP local. Elle reste sans GeckoView.
Le site HD et Android Modern restent separes : l APK Android 5 est un lecteur local optimisee pour la
fluidite, pas une copie du site.

Le bouton natif `Mise a jour` de l APK Android 5.0+ doit ouvrir l URL
GitHub stable `downloads/cook-note-android-legacy.apk`, afin que la tablette
puisse installer la nouvelle APK par-dessus l ancienne sans passer par la
navigation du site.

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

## Android Modern

- Dossier : `android-modern/`
- Package : `fr.cooknote.modern`
- Android minimum : `minSdk 26`
- Objectif : appareils Android recents, WebView plus agressive, assets non
  compresses pour accelerer les lectures locales
- Experience : WebView locale avec user-agent `CookNoteModernApp/HD`, priorite
  renderer elevee et skin web `modern-app-hd` pour images, panneaux, dock et
  navigation plus premium
- Build explicite :

```powershell
npm run apps:update-all
```

Sortie locale :

```text
android-modern/app/build/outputs/apk/debug/app-debug.apk
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

Cette release doit contenir les deux assets Android stables :

```text
cook-note-android-legacy.apk
cook-note-android-modern.apk
cook-note-android-legacy-vX.YY.apk
cook-note-android-modern-vX.YY.apk
```

`gh` doit etre installe et authentifie avec `gh auth login`. Si `gh` est absent,
le script doit echouer proprement sans modifier Git ni l APK.

La Release GitHub est optionnelle. Les boutons du site ne dependent pas de `gh`
tant que les copies `downloads/*.apk` sont presentes dans le depot GitHub.

## Regles de travail

- Ne jamais versionner les APK generes dans `android-legacy/` ou `android-modern/`.
- Les seules copies APK autorisees dans Git sont `downloads/cook-note-android-legacy.apk`,
  `downloads/cook-note-android-modern.apk`,
  `downloads/cook-note-android-legacy-vX.YY.apk` et
  `downloads/cook-note-android-modern-vX.YY.apk`, apres demande explicite de
  publication app.
- Ne jamais copier les APK dans `dist/` : Cloudflare Pages refuse les assets de
  plus de 25 MiB.
- Ne jamais versionner `android-legacy/build/generated/cook-note-lite/`.
- Ne jamais versionner `android-modern/app/src/main/assets/www/`.
- Ne jamais brancher Android ou iOS a `npm run build`, `npm run check`,
  `npm run preflight`, `start` ou `dev`.
- Ne publier une nouvelle app que sur demande explicite utilisateur.
- Toute mise a jour app doit passer par `npm run apps:update-all`.
- Toute publication Release app doit passer par `npm run apps:publish-all`.
- Ne jamais publier un seul APK : Android Legacy et Android Modern doivent
  avancer ensemble, avec verification des deux entrees iOS PWA.
- Un push du site ne met pas a jour les apps deja installees.
- Les vieilles apps peuvent sacrifier la qualite visuelle pour la fluidite ; les
  apps recentes doivent garder le meilleur rendu possible.
- Les recettes ne doivent pas etre modifiees pour une app mobile sans demande
  separee.

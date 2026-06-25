# Applications Cook Note

Ce document est la reference pour les installations Cook Note hors navigateur.
Le site web et GitHub restent la source de verite. Les applications sont des
projets secondaires manuels.

## Les 4 entrees du footer

Le footer du site doit proposer quatre installations distinctes :

- `Android 5` : APK Android Legacy pour tablette ancienne, asset
  `cook-note-android-legacy.apk`
- `Android recent` : APK Android Modern, asset
  `cook-note-android-modern.apk`
- `iOS ancien` : installation PWA Safari guidee
- `iOS recent` : installation PWA Safari guidee

Les deux boutons Android ouvrent un panneau d'installation. Le bouton primaire
utilise l'URL GitHub standard, pas Cloudflare Pages, car Pages limite chaque
asset public a 25 MiB :

```text
https://github.com/LeParfait271/COOK-NOTE/raw/main/downloads/cook-note-android-legacy.apk
https://github.com/LeParfait271/COOK-NOTE/raw/main/downloads/cook-note-android-modern.apk
```

Le panneau doit aussi garder un lien brut de secours :

```text
https://raw.githubusercontent.com/LeParfait271/COOK-NOTE/main/downloads/cook-note-android-legacy.apk
https://raw.githubusercontent.com/LeParfait271/COOK-NOTE/main/downloads/cook-note-android-modern.apk
```

Et une page GitHub de secours si le navigateur de la tablette refuse le
telechargement direct.

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
```

Les deux entrees iOS restent des installations PWA Safari, donc elles ne
produisent pas d APK ou d IPA. Elles doivent quand meme etre verifiees dans le
meme lot : libelles du footer, panneau d aide, manifest PWA, balises Apple et
absence de promesse de telechargement `.ipa`.

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
- Images Legacy : miniatures de liste `480px` maximum, images de fiche
  `960px` maximum, JPEG recompresses via `jpeg-js`, decodees en `RGB_565`
  avec petit cache memoire
- Interface : `ListView` recyclee, recherche locale, filtres categories, fiches
  natives en sections lisibles, infos rapides en pastilles, ingredients en
  lignes, etapes numerotees et variantes cliquables

Les assets Legacy sont generes par `scripts/build-android-legacy-assets.js`.
Android Legacy ne doit pas embarquer `assets/www`, React, service worker,
GeckoView, WebView systeme ou serveur HTTP local. Elle reste sans GeckoView.
Le site HD et Android Modern restent separes : l APK Android 5 est un lecteur local optimisee pour la
fluidite, pas une copie du site.

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
```

`gh` doit etre installe et authentifie avec `gh auth login`. Si `gh` est absent,
le script doit echouer proprement sans modifier Git ni l APK.

La Release GitHub est optionnelle. Les boutons du site ne dependent pas de `gh`
tant que les copies `downloads/*.apk` sont presentes dans le depot GitHub.

## Regles de travail

- Ne jamais versionner les APK generes dans `android-legacy/` ou `android-modern/`.
- Les seules copies APK autorisees dans Git sont `downloads/cook-note-android-legacy.apk`
  et `downloads/cook-note-android-modern.apk`, apres demande explicite de
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
- Les recettes ne doivent pas etre modifiees pour une app mobile sans demande
  separee.

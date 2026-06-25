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

Les deux liens Android pointent vers GitHub Releases :

```text
https://github.com/LeParfait271/COOK-NOTE/releases/latest/download/cook-note-android-legacy.apk
https://github.com/LeParfait271/COOK-NOTE/releases/latest/download/cook-note-android-modern.apk
```

Les deux boutons iOS ouvrent un panneau d'aide dans le site. Ils ne doivent pas pretendre telecharger un `.ipa` directement.

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
- Objectif : Android 5.0 et tablettes anciennes
- Build explicite :

```powershell
npm run android:legacy:update-apk
```

Sortie locale :

```text
android-legacy/app/build/outputs/apk/debug/app-debug.apk
```

Publication explicite :

```powershell
npm run android:legacy:publish-release
```

## Android Modern

- Dossier : `android-modern/`
- Package : `fr.cooknote.modern`
- Android minimum : `minSdk 26`
- Objectif : appareils Android recents, WebView plus agressive, assets non
  compresses pour accelerer les lectures locales
- Build explicite :

```powershell
npm run android:modern:update-apk
```

Sortie locale :

```text
android-modern/app/build/outputs/apk/debug/app-debug.apk
```

Publication explicite :

```powershell
npm run android:modern:publish-release
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

## Regles de travail

- Ne jamais ajouter les APK ou AAB au depot Git.
- Ne jamais versionner `android-legacy/app/src/main/assets/www/`.
- Ne jamais versionner `android-modern/app/src/main/assets/www/`.
- Ne jamais brancher Android ou iOS a `npm run build`, `npm run check`,
  `npm run preflight`, `start` ou `dev`.
- Ne publier une nouvelle app que sur demande explicite utilisateur.
- Un push du site ne met pas a jour les apps deja installees.
- Les recettes ne doivent pas etre modifiees pour une app mobile sans demande
  separee.

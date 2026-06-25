# Cook Note Android Legacy

Wrapper Android 5.0 compatible pour Cook Note.

Important: cette application est un projet secondaire. Elle ne se met pas a jour
automatiquement quand le site change, et elle ne doit pas etre branchee sur
`npm run build`, `npm run check` ou `npm run preflight`.

Le mode d'emploi complet est dans
[`docs/android-legacy-workflow.md`](../docs/android-legacy-workflow.md).

## Principe

- Android minimum: `minSdkVersion 21`, donc Android 5.0
- WebView natif Java fullscreen
- Site servi depuis les assets APK via `https://cook-note.local/`
- `dist/` est copie dans l APK uniquement quand le build Android est lance
- aucun changement de recette requis pour l app

## Mise a jour explicite

Ne construire une nouvelle APK que si l'utilisateur le demande explicitement.

Depuis la racine du depot :

```powershell
npm run android:legacy:update-apk
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

Le site peut proposer le bouton `Installer Android` en bas de page. Ce bouton
pointe vers l asset stable GitHub Releases :

```text
https://github.com/LeParfait271/COOK-NOTE/releases/latest/download/cook-note-android.apk
```

Ne publier cette APK que sur demande explicite :

```powershell
npm run android:legacy:publish-release
```

Cette commande demande `gh` authentifie et ne doit pas etre branchee au build
normal du site.

## Garde-fou

```powershell
npm run validate:android
```

Ce check verifie que le workflow Android reste manuel, que les assets APK
generes ne sont pas versionnes, et que le projet ne s accroche pas au build
normal du site.

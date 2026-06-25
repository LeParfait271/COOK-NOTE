# Cook Note Android Modern

Wrapper Android recent pour Cook Note.

Important: cette application est un projet secondaire manuel. Elle ne se met
pas a jour automatiquement quand le site change, et elle ne doit pas etre
branchee sur `npm run build`, `npm run check` ou `npm run preflight`.

Le mode d'emploi complet est dans
[`docs/apps-install-workflow.md`](../docs/apps-install-workflow.md).

## Principe

- Android minimum: `minSdkVersion 26`
- Package Android: `fr.cooknote.modern`
- WebView natif Java fullscreen
- Site servi depuis les assets APK via `https://cook-note.local/`
- User-agent `CookNoteModernApp/HD` pour activer le skin web `modern-app-hd`
- Assets web non compresses dans l APK pour accelerer les lectures locales
- aucun changement de recette requis pour l app

## Mise a jour explicite

Depuis la racine du depot :

```powershell
npm run android:modern:update-apk
```

Sortie APK :

```text
android-modern/app/build/outputs/apk/debug/app-debug.apk
```

## Publication GitHub

Le bouton `Android recent` du footer pointe vers :

```text
https://github.com/LeParfait271/COOK-NOTE/raw/main/downloads/cook-note-android-modern.apk
```

Ne publier cette APK que sur demande explicite :

```powershell
npm run android:modern:publish-release
```

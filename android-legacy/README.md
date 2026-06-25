# Cook Note Android Legacy

Android 5.0 compatible wrapper for Cook Note.

This project builds a small native Android APK with a fullscreen WebView.
The WebView serves the generated `dist/` folder from local APK assets through
`https://cook-note.local/`, so Cook Note can use absolute URLs and work offline.

Targets:

- `minSdkVersion 21` for Android 5.0
- local bundled `dist/`
- no remote CDN
- no recipe source edits

Build from the repository root:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\scripts\build-android-legacy.ps1
```

Output APK:

```text
android-legacy/app/build/outputs/apk/debug/app-debug.apk
```

If Java, Gradle, or Android SDK are missing, the build script stops with a clear
message and leaves the Android project ready to build once those tools exist.

param(
  [string]$ApkPath = "android-legacy\app\build\outputs\apk\debug\app-debug.apk",
  [string]$Repository = "LeParfait271/COOK-NOTE",
  [string]$AssetName = "cook-note-android.apk"
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$ResolvedApk = Resolve-Path (Join-Path $Root $ApkPath) -ErrorAction SilentlyContinue
if (-not $ResolvedApk) {
  throw "APK introuvable: $ApkPath. Lance d'abord npm run android:legacy:update-apk."
}

$Gh = Get-Command gh -ErrorAction SilentlyContinue
if (-not $Gh) {
  throw "GitHub CLI introuvable. Installe gh puis connecte-toi avec gh auth login."
}

$AuthStatus = & gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
  throw "GitHub CLI non authentifie. Lance gh auth login puis relance ce script.`n$AuthStatus"
}

$Aapt = Get-ChildItem -Path (Join-Path $env:LOCALAPPDATA "CookNoteAndroidTools\android-sdk\build-tools") -Recurse -Filter "aapt.exe" -ErrorAction SilentlyContinue |
  Sort-Object FullName -Descending |
  Select-Object -First 1
if (-not $Aapt) {
  throw "aapt.exe introuvable. Lance npm run android:legacy:setup pour installer les outils Android portables."
}

$Badging = & $Aapt.FullName dump badging $ResolvedApk.Path
if ($LASTEXITCODE -ne 0) {
  throw "Impossible de lire les infos APK avec aapt."
}

$VersionMatch = [regex]::Match($Badging, "versionName='([^']+)'")
if (-not $VersionMatch.Success) {
  throw "versionName introuvable dans l'APK."
}

$VersionName = $VersionMatch.Groups[1].Value
$ReleaseTag = "android-v$VersionName"
$ReleaseTitle = "Cook Note Android $VersionName"
$Notes = @"
APK Android Legacy Cook Note $VersionName.

- Compatible Android 5.0 minimum.
- Application secondaire, mise a jour manuelle.
- Asset stable pour le site: $AssetName
"@

$TempApk = Join-Path ([IO.Path]::GetTempPath()) $AssetName
Copy-Item -LiteralPath $ResolvedApk.Path -Destination $TempApk -Force

Push-Location $Root
try {
  & gh release view $ReleaseTag --repo $Repository *> $null
  if ($LASTEXITCODE -eq 0) {
    & gh release upload $ReleaseTag $TempApk --repo $Repository --clobber
    if ($LASTEXITCODE -ne 0) { throw "Upload APK impossible sur la release $ReleaseTag." }
    & gh release edit $ReleaseTag --repo $Repository --latest --notes $Notes --title $ReleaseTitle
    if ($LASTEXITCODE -ne 0) { throw "Edition de la release $ReleaseTag impossible." }
  } else {
    & gh release create $ReleaseTag --repo $Repository --title $ReleaseTitle --notes $Notes --latest --target main
    if ($LASTEXITCODE -ne 0) { throw "Creation de la release $ReleaseTag impossible." }
    & gh release upload $ReleaseTag $TempApk --repo $Repository --clobber
    if ($LASTEXITCODE -ne 0) { throw "Renommage/upload asset $AssetName impossible." }
  }
} finally {
  Pop-Location
}

Write-Host "Release Android publiee:"
Write-Host "  Tag: $ReleaseTag"
Write-Host "  APK: https://github.com/$Repository/releases/latest/download/$AssetName"

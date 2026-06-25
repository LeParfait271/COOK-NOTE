param(
  [ValidateSet("legacy", "modern")]
  [string]$Channel = "legacy",
  [string]$ApkPath = "",
  [string]$Repository = "LeParfait271/COOK-NOTE",
  [string]$AssetName = ""
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$ChannelDefaults = @{
  legacy = @{
    ApkPath = "android-legacy\app\build\outputs\apk\debug\app-debug.apk"
    AssetName = "cook-note-android-legacy.apk"
    Label = "Android Legacy"
  }
  modern = @{
    ApkPath = "android-modern\app\build\outputs\apk\debug\app-debug.apk"
    AssetName = "cook-note-android-modern.apk"
    Label = "Android Modern"
  }
}

if (-not $ApkPath) { $ApkPath = $ChannelDefaults[$Channel].ApkPath }
if (-not $AssetName) { $AssetName = $ChannelDefaults[$Channel].AssetName }
$ChannelLabel = $ChannelDefaults[$Channel].Label

$ResolvedApk = Resolve-Path (Join-Path $Root $ApkPath) -ErrorAction SilentlyContinue
if (-not $ResolvedApk) {
  throw "APK introuvable: $ApkPath. Lance d'abord npm run android:$Channel:update-apk."
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
$ReleaseTag = "apps-v$VersionName"
$ReleaseTitle = "Cook Note Apps $VersionName"
$Notes = @"
Applications Cook Note $VersionName.

- Android Legacy: cook-note-android-legacy.apk
- Android Modern: cook-note-android-modern.apk
- iOS ancien/recent: installation PWA Safari depuis le site.
- Applications secondaires, mises a jour manuelles.
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
Write-Host "  Canal: $ChannelLabel"
Write-Host "  APK: https://github.com/$Repository/releases/latest/download/$AssetName"

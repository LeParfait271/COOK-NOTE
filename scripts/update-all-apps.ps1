param(
  [switch]$SkipWebBuild,
  [switch]$Release,
  [switch]$PublishRelease
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$DownloadsDir = Join-Path $Root "downloads"
$LegacyScript = Join-Path $PSScriptRoot "build-android-legacy.ps1"
$PublishScript = Join-Path $PSScriptRoot "publish-android-release.ps1"

function Get-CookNoteVersionName {
  $AppJs = Get-Content -Raw (Join-Path $Root "app.js")
  $Match = [regex]::Match($AppJs, "const SITE_VERSION = 'v(\d+)\.(\d{2})'")
  if (-not $Match.Success) {
    throw "SITE_VERSION invalide. Attendu: vX.YY avec passage v1.99 -> v2.00."
  }
  return "$($Match.Groups[1].Value).$($Match.Groups[2].Value)"
}

function Sync-AndroidApkVersion($VersionName, [bool]$AllowWrite) {
  $AppPath = Join-Path $Root "app.js"
  $AppJs = Get-Content -Raw $AppPath
  $Pattern = "const ANDROID_LEGACY_APK_VERSION = '\d+\.\d{2}';"
  $Replacement = "const ANDROID_LEGACY_APK_VERSION = '$VersionName';"
  if ($AppJs -notmatch $Pattern) {
    throw "ANDROID_LEGACY_APK_VERSION introuvable dans app.js."
  }
  $NextAppJs = [regex]::Replace($AppJs, $Pattern, $Replacement, 1)
  if ($NextAppJs -eq $AppJs) { return }
  if (-not $AllowWrite) {
    throw "ANDROID_LEGACY_APK_VERSION doit passer a $VersionName. Relance sans -SkipWebBuild pour regenerer le site public."
  }
  $Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($AppPath, $NextAppJs, $Utf8NoBom)
}

function Run-NpmBuild {
  Push-Location $Root
  try {
    npm.cmd run build
    if ($LASTEXITCODE -ne 0) {
      throw "npm run build a echoue avec le code $LASTEXITCODE."
    }
  } finally {
    Pop-Location
  }
}

function Run-AndroidBuild($ScriptPath, $Label) {
  if ($Release) {
    & $ScriptPath -SkipWebBuild -Release
  } else {
    & $ScriptPath -SkipWebBuild
  }
  if ($LASTEXITCODE -ne 0) {
    throw "$Label a echoue avec le code $LASTEXITCODE."
  }
}

function Copy-ExpectedApk($Channel, $TargetName) {
  $VariantDir = if ($Release) { "release" } else { "debug" }
  $ApkName = if ($Release) { "app-release-unsigned.apk" } else { "app-debug.apk" }
  $ApkPath = Join-Path $Root "android-$Channel\app\build\outputs\apk\$VariantDir\$ApkName"
  if (-not (Test-Path $ApkPath)) {
    throw "APK $Channel introuvable: $ApkPath"
  }
  New-Item -ItemType Directory -Path $DownloadsDir -Force | Out-Null
  $TargetPath = Join-Path $DownloadsDir $TargetName
  Copy-Item -LiteralPath $ApkPath -Destination $TargetPath -Force
  return $TargetPath
}

function Remove-StaleVersionedApks($CurrentName) {
  if (-not (Test-Path $DownloadsDir)) { return }
  Get-ChildItem -LiteralPath $DownloadsDir -Filter "cook-note-android-legacy-v*.apk" -File |
    Where-Object { $_.Name -ne $CurrentName } |
    Remove-Item -Force
}

$VersionName = Get-CookNoteVersionName
Sync-AndroidApkVersion $VersionName (-not $SkipWebBuild)

if (-not $SkipWebBuild) {
  Run-NpmBuild
}

if (-not (Test-Path (Join-Path $Root "dist\index.html"))) {
  throw "dist/index.html introuvable. Lance npm run build avant les apps."
}

Run-AndroidBuild $LegacyScript "Build Android Legacy"

$LegacyStableDownload = Copy-ExpectedApk "legacy" "cook-note-android-legacy.apk"
$LegacyVersionedName = "cook-note-android-legacy-v$VersionName.apk"
$LegacyVersionedDownload = Copy-ExpectedApk "legacy" $LegacyVersionedName
Remove-StaleVersionedApks $LegacyVersionedName

if (Test-Path (Join-Path $Root "dist\downloads")) {
  throw "dist\downloads ne doit jamais exister. Les APK doivent rester servis depuis GitHub."
}

if ($PublishRelease) {
  & $PublishScript -Channel legacy
  if ($LASTEXITCODE -ne 0) {
    throw "Publication Android Legacy echouee avec le code $LASTEXITCODE."
  }
  & $PublishScript -Channel legacy -AssetName "cook-note-android-legacy-v$VersionName.apk"
  if ($LASTEXITCODE -ne 0) {
    throw "Publication Android Legacy versionnee echouee avec le code $LASTEXITCODE."
  }
}

Write-Host "Mise a jour de l'application Cook Note OK:"
Write-Host "  Android Legacy stable: $LegacyStableDownload"
Write-Host "  Android Legacy versionne: $LegacyVersionedDownload"

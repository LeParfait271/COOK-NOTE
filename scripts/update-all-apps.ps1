param(
  [switch]$SkipWebBuild,
  [switch]$Release,
  [switch]$PublishRelease
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$DownloadsDir = Join-Path $Root "downloads"
$LegacyScript = Join-Path $PSScriptRoot "build-android-legacy.ps1"
$ModernScript = Join-Path $PSScriptRoot "build-android-modern.ps1"
$PublishScript = Join-Path $PSScriptRoot "publish-android-release.ps1"

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

if (-not $SkipWebBuild) {
  Run-NpmBuild
}

if (-not (Test-Path (Join-Path $Root "dist\index.html"))) {
  throw "dist/index.html introuvable. Lance npm run build avant les apps."
}

Run-AndroidBuild $LegacyScript "Build Android Legacy"
Run-AndroidBuild $ModernScript "Build Android Modern"

$LegacyDownload = Copy-ExpectedApk "legacy" "cook-note-android-legacy.apk"
$ModernDownload = Copy-ExpectedApk "modern" "cook-note-android-modern.apk"

if (Test-Path (Join-Path $Root "dist\downloads")) {
  throw "dist\downloads ne doit jamais exister. Les APK doivent rester servis depuis GitHub."
}

if ($PublishRelease) {
  & $PublishScript -Channel legacy
  if ($LASTEXITCODE -ne 0) {
    throw "Publication Android Legacy echouee avec le code $LASTEXITCODE."
  }
  & $PublishScript -Channel modern
  if ($LASTEXITCODE -ne 0) {
    throw "Publication Android Modern echouee avec le code $LASTEXITCODE."
  }
}

Write-Host "Mise a jour groupee des applications Cook Note OK:"
Write-Host "  Android Legacy: $LegacyDownload"
Write-Host "  Android Modern: $ModernDownload"
Write-Host "  iOS ancien/recent: entrees PWA du footer a verifier dans le meme lot."

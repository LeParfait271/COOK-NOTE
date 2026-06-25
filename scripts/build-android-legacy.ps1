param(
  [switch]$SkipWebBuild,
  [switch]$Release
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$AndroidDir = Join-Path $Root "android-legacy"
$GradleTask = if ($Release) { ":app:assembleRelease" } else { ":app:assembleDebug" }
$ToolsRoot = Join-Path $env:LOCALAPPDATA "CookNoteAndroidTools"

function Require-Command($Name, $Message) {
  $Command = Get-Command $Name -ErrorAction SilentlyContinue
  if (-not $Command) {
    throw $Message
  }
  return $Command.Source
}

$BundledJdk = Get-ChildItem -Path (Join-Path $ToolsRoot "jdk") -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
if ($BundledJdk) {
  $env:JAVA_HOME = $BundledJdk.FullName
  $env:Path = (Join-Path $BundledJdk.FullName "bin") + ";" + $env:Path
}

$BundledGradle = Get-ChildItem -Path (Join-Path $ToolsRoot "gradle") -Directory -Filter "gradle-*" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($BundledGradle) {
  $env:Path = (Join-Path $BundledGradle.FullName "bin") + ";" + $env:Path
}

if (-not $SkipWebBuild) {
  Push-Location $Root
  try {
    npm.cmd run build
  } finally {
    Pop-Location
  }
}

if (-not (Test-Path (Join-Path $Root "dist\index.html"))) {
  throw "dist/index.html introuvable. Lance npm run build avant l'APK."
}

Push-Location $Root
try {
  node scripts/build-android-legacy-assets.js
} finally {
  Pop-Location
}

$Java = Get-Command java -ErrorAction SilentlyContinue
if (-not $Java) {
  throw "Java/JDK introuvable. Installe JDK 17 puis relance scripts/build-android-legacy.ps1."
}

$SdkRoot = $env:ANDROID_HOME
if (-not $SdkRoot) { $SdkRoot = $env:ANDROID_SDK_ROOT }
if (-not $SdkRoot) { $SdkRoot = Join-Path $ToolsRoot "android-sdk" }
if (-not $SdkRoot) { $SdkRoot = Join-Path $env:LOCALAPPDATA "Android\Sdk" }
if (-not (Test-Path $SdkRoot)) {
  throw "Android SDK introuvable. Installe Android SDK avec platform 35 et build-tools, puis configure ANDROID_HOME."
}

$LocalProperties = Join-Path $AndroidDir "local.properties"
$EscapedSdk = $SdkRoot.Replace("\", "\\")
"sdk.dir=$EscapedSdk" | Set-Content -Path $LocalProperties -Encoding ASCII

Push-Location $AndroidDir
try {
  $Gradle = Get-Command gradle -ErrorAction SilentlyContinue
  if (-not $Gradle) {
    throw "Gradle introuvable. Installe Gradle ou ajoute gradle.bat au PATH."
  }
  gradle $GradleTask
  if ($LASTEXITCODE -ne 0) {
    throw "Gradle a echoue avec le code $LASTEXITCODE."
  }
} finally {
  Pop-Location
}

$ApkName = if ($Release) { "app-release-unsigned.apk" } else { "app-debug.apk" }
$ApkVariantDir = if ($Release) { "release" } else { "debug" }
$ApkPath = Join-Path $AndroidDir "app\build\outputs\apk\$ApkVariantDir\$ApkName"
if (-not (Test-Path $ApkPath)) {
  throw "APK attendu introuvable: $ApkPath"
}

Write-Host "APK Cook Note Android Legacy OK: $ApkPath"

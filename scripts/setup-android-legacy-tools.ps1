param(
  [string]$ToolsRoot = (Join-Path $env:LOCALAPPDATA "CookNoteAndroidTools")
)

$ErrorActionPreference = "Stop"

$JdkUrl = "https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse"
$GradleVersion = "8.7"
$GradleUrl = "https://services.gradle.org/distributions/gradle-$GradleVersion-bin.zip"
$CmdlineUrl = "https://dl.google.com/android/repository/commandlinetools-win-14742923_latest.zip"

$DownloadDir = Join-Path $ToolsRoot "downloads"
$JdkDir = Join-Path $ToolsRoot "jdk"
$GradleDir = Join-Path $ToolsRoot "gradle"
$SdkRoot = Join-Path $ToolsRoot "android-sdk"
$CmdlineLatest = Join-Path $SdkRoot "cmdline-tools\latest"

function Download-IfMissing($Url, $Destination) {
  if (Test-Path $Destination) {
    Write-Host "Deja present: $Destination"
    return
  }
  Write-Host "Telechargement: $Url"
  Invoke-WebRequest -Uri $Url -OutFile $Destination
}

function Expand-Clean($Zip, $Destination) {
  if (Test-Path $Destination) {
    Write-Host "Deja extrait: $Destination"
    return
  }
  $Parent = Split-Path $Destination -Parent
  New-Item -ItemType Directory -Force -Path $Parent | Out-Null
  $Temp = Join-Path $Parent ("extract-" + [IO.Path]::GetFileNameWithoutExtension($Zip))
  if (Test-Path $Temp) { Remove-Item -LiteralPath $Temp -Recurse -Force }
  New-Item -ItemType Directory -Force -Path $Temp | Out-Null
  Expand-Archive -LiteralPath $Zip -DestinationPath $Temp -Force
  $Child = Get-ChildItem -Path $Temp -Directory | Select-Object -First 1
  if (-not $Child) { throw "Archive vide: $Zip" }
  Move-Item -LiteralPath $Child.FullName -Destination $Destination
  Remove-Item -LiteralPath $Temp -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $DownloadDir, $JdkDir, $GradleDir, $SdkRoot | Out-Null

$JdkZip = Join-Path $DownloadDir "jdk17.zip"
$GradleZip = Join-Path $DownloadDir "gradle-$GradleVersion-bin.zip"
$CmdlineZip = Join-Path $DownloadDir "commandlinetools-win-latest.zip"

Download-IfMissing $JdkUrl $JdkZip
Download-IfMissing $GradleUrl $GradleZip
Download-IfMissing $CmdlineUrl $CmdlineZip

if (-not (Get-ChildItem -Path $JdkDir -Directory -ErrorAction SilentlyContinue | Select-Object -First 1)) {
  Expand-Clean $JdkZip (Join-Path $JdkDir "temurin-17")
}

if (-not (Test-Path (Join-Path $GradleDir "gradle-$GradleVersion"))) {
  Expand-Clean $GradleZip (Join-Path $GradleDir "gradle-$GradleVersion")
}

if (-not (Test-Path $CmdlineLatest)) {
  $TempCmdline = Join-Path $SdkRoot "cmdline-tools-temp"
  if (Test-Path $TempCmdline) { Remove-Item -LiteralPath $TempCmdline -Recurse -Force }
  Expand-Archive -LiteralPath $CmdlineZip -DestinationPath $TempCmdline -Force
  New-Item -ItemType Directory -Force -Path (Split-Path $CmdlineLatest -Parent) | Out-Null
  Move-Item -LiteralPath (Join-Path $TempCmdline "cmdline-tools") -Destination $CmdlineLatest
  Remove-Item -LiteralPath $TempCmdline -Recurse -Force
}

$JdkHome = (Get-ChildItem -Path $JdkDir -Directory | Select-Object -First 1).FullName
$GradleHome = Join-Path $GradleDir "gradle-$GradleVersion"
$env:JAVA_HOME = $JdkHome
$env:ANDROID_HOME = $SdkRoot
$env:ANDROID_SDK_ROOT = $SdkRoot
$env:Path = (Join-Path $JdkHome "bin") + ";" + (Join-Path $GradleHome "bin") + ";" + (Join-Path $CmdlineLatest "bin") + ";" + $env:Path

$SdkManager = Join-Path $CmdlineLatest "bin\sdkmanager.bat"
if (-not (Test-Path $SdkManager)) {
  throw "sdkmanager introuvable: $SdkManager"
}

Write-Host "Acceptation des licences Android SDK..."
1..80 | ForEach-Object { "y" } | & $SdkManager --sdk_root=$SdkRoot --licenses

Write-Host "Installation des packages Android SDK..."
& $SdkManager --sdk_root=$SdkRoot "platform-tools" "platforms;android-35" "build-tools;35.0.0"

Write-Host "Toolchain Android Legacy OK:"
Write-Host "  JAVA_HOME=$JdkHome"
Write-Host "  ANDROID_HOME=$SdkRoot"
Write-Host "  Gradle=$GradleHome"

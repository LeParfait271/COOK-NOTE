# Rend Vosk (vosk-android) utilisable sous Android 5 : compile
# android-legacy/vosk-compat/cnstdio.c (NDK, API 21) et ajoute libcnstdio.so
# comme dependance de libvosk.so (LIEF). Resultat dans
# android-legacy/app/src/main/jniLibs/<abi>/, versionne : le build de l'APK
# n'a besoin ni du NDK ni de LIEF.
# Usage : scripts/build-vosk-android-compat.ps1 -Aar <vosk-android-x.y.z.aar>
param([Parameter(Mandatory = $true)][string]$Aar)
$ErrorActionPreference = 'Stop'
$Root = Resolve-Path (Join-Path $PSScriptRoot '..')
$Ndk = Get-ChildItem (Join-Path $env:LOCALAPPDATA 'CookNoteAndroidTools\android-sdk\ndk') -Directory | Sort-Object Name | Select-Object -Last 1
$Clang = Join-Path $Ndk.FullName 'toolchains\llvm\prebuilt\windows-x86_64\bin\clang.exe'
$Python = Join-Path $Root '.tools\lief-env\Scripts\python.exe'
$Source = Join-Path $Root 'android-legacy\vosk-compat\cnstdio.c'
$Out = Join-Path $Root 'android-legacy\app\src\main\jniLibs'
$Work = Join-Path $Root 'tmp\vosk-compat'
Remove-Item -Recurse -Force $Work -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $Work | Out-Null
Copy-Item $Aar (Join-Path $Work 'vosk.zip')
Expand-Archive (Join-Path $Work 'vosk.zip') (Join-Path $Work 'aar')
$Targets = @{ 'armeabi-v7a' = 'armv7a-linux-androideabi21'; 'arm64-v8a' = 'aarch64-linux-android21'; 'x86_64' = 'x86_64-linux-android21' }
foreach ($abi in $Targets.Keys) {
  $dir = Join-Path $Out $abi
  New-Item -ItemType Directory -Force $dir | Out-Null
  & $Clang "--target=$($Targets[$abi])" -shared -fPIC -O2 '-Wl,-soname,libcnstdio.so' -o (Join-Path $dir 'libcnstdio.so') $Source
  if ($LASTEXITCODE -ne 0) { throw "Compilation impossible pour $abi" }
  $vosk = Join-Path $Work "aar\jni\$abi\libvosk.so"
  & $Python -c "import lief,sys; lib=lief.parse(sys.argv[1]); lib.add_library('libcnstdio.so'); lib.write(sys.argv[2])" $vosk (Join-Path $dir 'libvosk.so')
  if ($LASTEXITCODE -ne 0) { throw "Modification de libvosk.so impossible pour $abi" }
  "$abi : libcnstdio.so + libvosk.so"
}

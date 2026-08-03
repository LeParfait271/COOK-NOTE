param(
  [switch]$CheckOnly,
  [switch]$FinalizeExistingBuild,
  [ValidateRange(0, 2)]
  [int]$GradleRetries = 1
)

$ErrorActionPreference = "Stop"

$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$ExpectedRoot = "C:\COOK NOTE\COOK-NOTE v2"
$AppPath = Join-Path $Root "app.js"
$GradlePropertiesPath = Join-Path $Root "android-legacy\gradle.properties"
$UpdateManifestPath = Join-Path $Root "downloads\android-latest-version.json"
$DownloadsDir = Join-Path $Root "downloads"
$BuildScript = Join-Path $PSScriptRoot "build-android-legacy.ps1"
$ReleaseApk = Join-Path $Root "android-legacy\app\build\outputs\apk\release\app-release.apk"
$SummaryPath = Join-Path $Root "tmp\android-rebuild-latest.json"
$GradleLatestLogPath = Join-Path $Root "tmp\android-gradle-latest.log"
$BundledNode = Join-Path $Root ".tools\node\current\node.exe"

function Assert-OfficialRepository {
  $ResolvedRoot = [System.IO.Path]::GetFullPath($Root).TrimEnd("\")
  $ResolvedExpected = [System.IO.Path]::GetFullPath($ExpectedRoot).TrimEnd("\")
  if ($ResolvedRoot -ne $ResolvedExpected) {
    throw "Depot invalide: $ResolvedRoot. Attendu: $ResolvedExpected."
  }
}

function Get-NodeExecutable {
  $NodeCommand = Get-Command node -ErrorAction SilentlyContinue
  if ($NodeCommand) {
    return $NodeCommand.Source
  }
  if (Test-Path -LiteralPath $BundledNode) {
    return $BundledNode
  }
  throw "Node introuvable dans le PATH et dans .tools/node/current."
}

function Read-Utf8File($Path) {
  return [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
}

function Get-VersionState {
  $App = Read-Utf8File $AppPath
  $SiteMatch = [regex]::Match($App, "const SITE_VERSION = 'v(\d+\.\d{2})';")
  $AppAndroidMatch = [regex]::Match($App, "const ANDROID_LEGACY_APK_VERSION = '(\d+\.\d{2})';")
  $Gradle = Read-Utf8File $GradlePropertiesPath
  $GradleMatch = [regex]::Match($Gradle, "(?m)^cookNoteAndroidVersion=(\d+\.\d{2})\r?$")

  if (-not $SiteMatch.Success -or -not $AppAndroidMatch.Success -or -not $GradleMatch.Success) {
    throw "Versions Cook Note illisibles. Attendu: X.YY."
  }

  $PublishedVersion = $null
  if (Test-Path -LiteralPath $UpdateManifestPath) {
    $Manifest = Get-Content -LiteralPath $UpdateManifestPath -Raw | ConvertFrom-Json
    $PublishedVersion = [string]$Manifest.versionName
  }

  return [ordered]@{
    Site = $SiteMatch.Groups[1].Value
    AppAndroid = $AppAndroidMatch.Groups[1].Value
    Gradle = $GradleMatch.Groups[1].Value
    Published = $PublishedVersion
  }
}

function Get-ExpectedVersionCode($VersionName) {
  $Match = [regex]::Match($VersionName, "^(\d+)\.(\d{2})$")
  if (-not $Match.Success) {
    throw "Version cible invalide: $VersionName."
  }
  return ([int]$Match.Groups[1].Value * 1000) + [int]$Match.Groups[2].Value
}

function Find-AndroidTool($FileName) {
  $Candidates = @()
  $ToolRoots = @(
    (Join-Path $env:LOCALAPPDATA "CookNoteAndroidTools\android-sdk\build-tools"),
    (Join-Path $env:LOCALAPPDATA "Android\Sdk\build-tools")
  )

  foreach ($ToolRoot in $ToolRoots) {
    if (Test-Path -LiteralPath $ToolRoot) {
      $Candidates += Get-ChildItem -LiteralPath $ToolRoot -Directory -ErrorAction SilentlyContinue |
        Sort-Object Name -Descending |
        ForEach-Object { Join-Path $_.FullName $FileName } |
        Where-Object { Test-Path -LiteralPath $_ }
    }
  }

  $Command = Get-Command $FileName -ErrorAction SilentlyContinue
  if ($Command) {
    return $Command.Source
  }
  if ($Candidates.Count -gt 0) {
    return $Candidates[0]
  }
  throw "$FileName introuvable. Lance npm run android:legacy:setup."
}

function Get-Sha256($Path) {
  return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash
}

function Write-Summary($Data) {
  $SummaryDir = Split-Path -Parent $SummaryPath
  New-Item -ItemType Directory -Path $SummaryDir -Force | Out-Null
  $Json = $Data | ConvertTo-Json -Depth 5
  [System.IO.File]::WriteAllText($SummaryPath, $Json + [Environment]::NewLine, (New-Object System.Text.UTF8Encoding($false)))
}

function New-AndroidBackup($TargetVersion) {
  $Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $BackupDir = Join-Path $Root "backups\android\before-v$TargetVersion\$Stamp"
  New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null

  $Files = @()
  if (Test-Path -LiteralPath $DownloadsDir) {
    $Files += Get-ChildItem -LiteralPath $DownloadsDir -Filter "cook-note-android-legacy*.apk" -File
  }
  if (Test-Path -LiteralPath $UpdateManifestPath) {
    $Files += Get-Item -LiteralPath $UpdateManifestPath
  }

  $Inventory = @()
  foreach ($File in $Files) {
    Copy-Item -LiteralPath $File.FullName -Destination (Join-Path $BackupDir $File.Name) -Force
    $Inventory += [ordered]@{
      file = $File.Name
      bytes = $File.Length
      sha256 = if ($File.Extension -eq ".apk") { Get-Sha256 $File.FullName } else { $null }
    }
  }

  $InventoryPath = Join-Path $BackupDir "backup-info.json"
  $InventoryJson = [ordered]@{
    createdAt = (Get-Date).ToString("o")
    targetVersion = $TargetVersion
    files = $Inventory
  } | ConvertTo-Json -Depth 5
  [System.IO.File]::WriteAllText($InventoryPath, $InventoryJson + [Environment]::NewLine, (New-Object System.Text.UTF8Encoding($false)))

  return $BackupDir
}

function Invoke-NodeScript($Node, $Script, $Arguments = @()) {
  & $Node $Script @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$Script a echoue avec le code $LASTEXITCODE."
  }
}

function Sync-AndroidVersion($Node, $TargetVersion) {
  $Before = Get-VersionState
  if ($Before.AppAndroid -eq $TargetVersion -and $Before.Gradle -eq $TargetVersion -and $Before.Published -eq $TargetVersion) {
    return
  }

  Invoke-NodeScript $Node "scripts/bump-version.js" @("v$TargetVersion")
  $After = Get-VersionState
  if ($After.Site -ne $TargetVersion -or $After.AppAndroid -ne $TargetVersion -or $After.Gradle -ne $TargetVersion -or $After.Published -ne $TargetVersion) {
    throw "Synchronisation de version incomplete pour v$TargetVersion."
  }
}

function Invoke-AndroidBuild($Retries) {
  $LogDir = Split-Path -Parent $GradleLatestLogPath
  New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
  $Attempt = 0
  do {
    $Attempt += 1
    $AttemptLog = Join-Path $LogDir "android-gradle-attempt-$Attempt.log"
    $PreviousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
      if ($Attempt -eq 1) {
        & powershell.exe -ExecutionPolicy Bypass -File $BuildScript -SkipWebBuild -SkipAssetBuild -Release -Offline *> $AttemptLog
      } else {
        & powershell.exe -ExecutionPolicy Bypass -File $BuildScript -SkipWebBuild -SkipAssetBuild -Release *> $AttemptLog
      }
      $BuildExitCode = $LASTEXITCODE
    } finally {
      $ErrorActionPreference = $PreviousErrorActionPreference
    }
    Copy-Item -LiteralPath $AttemptLog -Destination $GradleLatestLogPath -Force
    if ($BuildExitCode -eq 0) {
      Write-Host "Build Gradle OK (tentative $Attempt). Journal: $GradleLatestLogPath"
      return [ordered]@{
        Attempts = $Attempt
        Log = $GradleLatestLogPath
      }
    }
    if ($Attempt -le $Retries) {
      Write-Host "Build Gradle hors ligne echoue. Nouvelle tentative reseau $($Attempt + 1)/$($Retries + 1)..."
    }
  } while ($Attempt -le $Retries)

  Write-Host "Dernieres lignes du journal Gradle:"
  Get-Content -LiteralPath $GradleLatestLogPath -Tail 30 | ForEach-Object { Write-Host $_ }
  throw "Build Android echoue apres $Attempt tentative(s)."
}

function Assert-ApkMetadata($ApkPath, $TargetVersion, $ExpectedVersionCode, $Aapt, $ApkSigner) {
  if (-not (Test-Path -LiteralPath $ApkPath)) {
    throw "APK Release introuvable: $ApkPath"
  }

  $Badging = (& $Aapt dump badging $ApkPath 2>&1) -join [Environment]::NewLine
  if ($LASTEXITCODE -ne 0) {
    throw "aapt ne peut pas lire l APK Release."
  }

  $PackageMatch = [regex]::Match($Badging, "package: name='([^']+)' versionCode='(\d+)' versionName='([^']+)'")
  $SdkMatch = [regex]::Match($Badging, "sdkVersion:'(\d+)'")
  if (-not $PackageMatch.Success -or -not $SdkMatch.Success) {
    throw "Metadonnees APK incompletes."
  }
  if ($PackageMatch.Groups[1].Value -ne "fr.cooknote.legacy") {
    throw "Package APK inattendu: $($PackageMatch.Groups[1].Value)."
  }
  if ([int]$PackageMatch.Groups[2].Value -ne $ExpectedVersionCode) {
    throw "versionCode APK inattendu: $($PackageMatch.Groups[2].Value), attendu $ExpectedVersionCode."
  }
  if ($PackageMatch.Groups[3].Value -ne $TargetVersion) {
    throw "versionName APK inattendu: $($PackageMatch.Groups[3].Value), attendu $TargetVersion."
  }
  if ([int]$SdkMatch.Groups[1].Value -ne 21) {
    throw "minSdk APK inattendu: $($SdkMatch.Groups[1].Value), attendu 21."
  }

  $Signature = (& $ApkSigner verify --verbose $ApkPath 2>&1) -join [Environment]::NewLine
  if ($LASTEXITCODE -ne 0) {
    throw "Signature APK invalide."
  }
  if ($Signature -notmatch "Verified using v1 scheme \(JAR signing\): true" -or
      $Signature -notmatch "Verified using v2 scheme \(APK Signature Scheme v2\): true") {
    throw "L APK doit etre signee avec les schemas v1 et v2."
  }
}

function Publish-ValidatedApk($ApkPath, $TargetVersion) {
  New-Item -ItemType Directory -Path $DownloadsDir -Force | Out-Null
  $StablePath = Join-Path $DownloadsDir "cook-note-android-legacy.apk"
  $VersionedPath = Join-Path $DownloadsDir "cook-note-android-legacy-v$TargetVersion.apk"
  $StablePartial = "$StablePath.partial"
  $VersionedPartial = "$VersionedPath.partial"

  Copy-Item -LiteralPath $ApkPath -Destination $StablePartial -Force
  Copy-Item -LiteralPath $ApkPath -Destination $VersionedPartial -Force
  $SourceHash = Get-Sha256 $ApkPath
  if ((Get-Sha256 $StablePartial) -ne $SourceHash -or (Get-Sha256 $VersionedPartial) -ne $SourceHash) {
    throw "Controle SHA256 des copies APK temporaires en echec."
  }

  [System.IO.File]::Copy($VersionedPartial, $VersionedPath, $true)
  Remove-Item -LiteralPath $VersionedPartial -Force
  [System.IO.File]::Copy($StablePartial, $StablePath, $true)
  Remove-Item -LiteralPath $StablePartial -Force

  Get-ChildItem -LiteralPath $DownloadsDir -Filter "cook-note-android-legacy-v*.apk" -File |
    Where-Object { $_.FullName -ne $VersionedPath } |
    Remove-Item -Force

  return [ordered]@{
    Stable = $StablePath
    Versioned = $VersionedPath
    Sha256 = $SourceHash
    Bytes = (Get-Item -LiteralPath $StablePath).Length
  }
}

Assert-OfficialRepository
$Node = Get-NodeExecutable
$Aapt = Find-AndroidTool "aapt.exe"
$ApkSigner = Find-AndroidTool "apksigner.bat"
$InitialVersions = Get-VersionState
$TargetVersion = $InitialVersions.Site
$ExpectedVersionCode = Get-ExpectedVersionCode $TargetVersion
$KeystorePath = Join-Path $Root "android-legacy\app\cook-note-release.jks"

if (-not (Test-Path -LiteralPath $KeystorePath)) {
  throw "Keystore release introuvable: $KeystorePath"
}

$NeedsSync = $InitialVersions.AppAndroid -ne $TargetVersion -or
  $InitialVersions.Gradle -ne $TargetVersion -or
  $InitialVersions.Published -ne $TargetVersion
$ExpectedVersionedName = "cook-note-android-legacy-v$TargetVersion.apk"
$StaleVersionedApks = @(
  if (Test-Path -LiteralPath $DownloadsDir) {
    Get-ChildItem -LiteralPath $DownloadsDir -Filter "cook-note-android-legacy-v*.apk" -File |
      Where-Object { $_.Name -ne $ExpectedVersionedName } |
      ForEach-Object { $_.Name }
  }
)

if ($CheckOnly) {
  $CheckSummary = [ordered]@{
    status = "check-ok"
    targetVersion = $TargetVersion
    expectedVersionCode = $ExpectedVersionCode
    androidSourceVersion = $InitialVersions.AppAndroid
    gradleVersion = $InitialVersions.Gradle
    publishedVersion = $InitialVersions.Published
    versionSyncRequired = $NeedsSync
    staleVersionedApks = $StaleVersionedApks
    releaseApkExists = Test-Path -LiteralPath $ReleaseApk
    gradleLog = $GradleLatestLogPath
    command = "npm run apps:rebuild"
  }
  Write-Summary $CheckSummary
  Write-Host "COOK_NOTE_ANDROID_REBUILD_CHECK_OK"
  Write-Host "targetVersion=$TargetVersion"
  Write-Host "publishedVersion=$($InitialVersions.Published)"
  Write-Host "versionSyncRequired=$($NeedsSync.ToString().ToLowerInvariant())"
  Write-Host "staleVersionedApks=$($StaleVersionedApks -join ',')"
  Write-Host "nextCommand=npm run apps:rebuild"
  exit 0
}

$BackupDir = $null
$GradleLog = $null
try {
  $BackupDir = New-AndroidBackup $TargetVersion
  if ($FinalizeExistingBuild) {
    if ($NeedsSync) {
      throw "Le mode finalisation exige des versions deja alignees sur $TargetVersion."
    }
    if (-not (Test-Path -LiteralPath $ReleaseApk)) {
      throw "Le mode finalisation exige une APK Release existante."
    }
    $BuildAttempts = 0
  } else {
    Sync-AndroidVersion $Node $TargetVersion
    Invoke-NodeScript $Node "scripts/build-site.js"
    Invoke-NodeScript $Node "scripts/build-android-legacy-assets.js"
    $BuildResult = Invoke-AndroidBuild $GradleRetries
    $BuildAttempts = $BuildResult.Attempts
    $GradleLog = $BuildResult.Log
  }
  Assert-ApkMetadata $ReleaseApk $TargetVersion $ExpectedVersionCode $Aapt $ApkSigner

  Invoke-NodeScript $Node "scripts/validate-dist.js"
  $Published = Publish-ValidatedApk $ReleaseApk $TargetVersion
  Invoke-NodeScript $Node "scripts/validate-cache-version.js"
  Invoke-NodeScript $Node "scripts/validate-android-manual.js"

  if (Test-Path -LiteralPath (Join-Path $Root "dist\downloads")) {
    throw "dist/downloads ne doit jamais exister."
  }

  $SuccessSummary = [ordered]@{
    status = "success"
    version = $TargetVersion
    versionCode = $ExpectedVersionCode
    mode = if ($FinalizeExistingBuild) { "finalize-existing-build" } else { "full-rebuild" }
    buildAttempts = $BuildAttempts
    gradleLog = $GradleLog
    stableApk = $Published.Stable
    versionedApk = $Published.Versioned
    bytes = $Published.Bytes
    sha256 = $Published.Sha256
    backup = $BackupDir
    validations = @("apk-metadata", "apk-signature-v1-v2", "dist", "cache", "android")
  }
  Write-Summary $SuccessSummary

  Write-Host "COOK_NOTE_ANDROID_REBUILD_OK"
  Write-Host "version=$TargetVersion"
  Write-Host "versionCode=$ExpectedVersionCode"
  Write-Host "apk=$($Published.Stable)"
  Write-Host "apkVersioned=$($Published.Versioned)"
  Write-Host "backup=$BackupDir"
  Write-Host "sha256=$($Published.Sha256)"
  Write-Host "bytes=$($Published.Bytes)"
  Write-Host "buildAttempts=$BuildAttempts"
  if ($GradleLog) {
    Write-Host "gradleLog=$GradleLog"
  }
} catch {
  Get-ChildItem -LiteralPath $DownloadsDir -Filter "*.apk.partial" -File -ErrorAction SilentlyContinue |
    Remove-Item -Force
  $FailureSummary = [ordered]@{
    status = "failed"
    targetVersion = $TargetVersion
    backup = $BackupDir
    gradleLog = if (Test-Path -LiteralPath $GradleLatestLogPath) { $GradleLatestLogPath } else { $null }
    error = $_.Exception.Message
  }
  Write-Summary $FailureSummary
  throw
}

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$nodeDir = Join-Path $root '.tools\node\current'
$node = Join-Path $nodeDir 'node.exe'
$npm = Join-Path $nodeDir 'npm.cmd'

function Invoke-CookNoteNodeCheck($nodeExe) {
  $files = @(
    'server.js',
    'app.js',
    'admin.js',
    'recipe.js',
    'service-worker.js',
    'playwright.config.js',
    'tests\visual-smoke.spec.js',
    'scripts\validate-recipes.js',
    'scripts\validate-quantities.js',
    'scripts\validate-ui.js',
    'scripts\validate-project-rules.js',
    'scripts\validate-production.js',
    'scripts\validate-feature-coverage.js',
    'scripts\validate-cache-version.js',
    'scripts\validate-visual-image-duplicates.js',
    'scripts\generate-image-manifest.js',
    'scripts\validate-performance-budget.js',
    'scripts\validate-headers.js',
    'scripts\bump-version.js',
    'scripts\preflight.js',
    'scripts\audit-recipes.js',
    'scripts\audit-images.js',
    'scripts\generate-sitemap.js'
  )

  foreach ($file in $files) {
    & $nodeExe --check $file
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  }

  $validators = @(
    'scripts\validate-recipes.js',
    'scripts\validate-quantities.js',
    'scripts\validate-ui.js',
    'scripts\validate-project-rules.js',
    'scripts\validate-production.js',
    'scripts\validate-feature-coverage.js',
    'scripts\validate-cache-version.js',
    'scripts\generate-image-manifest.js',
    'scripts\validate-performance-budget.js',
    'scripts\validate-headers.js',
    'scripts\validate-visual-image-duplicates.js'
  )

  foreach ($file in $validators) {
    if ($file -eq 'scripts\generate-image-manifest.js') {
      & $nodeExe $file --check
    } else {
      & $nodeExe $file
    }
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  }
}

if (Test-Path $node) {
  $env:PATH = "$nodeDir;$env:PATH"
  & $npm run check
  exit $LASTEXITCODE
}

$npmCommand = Get-Command npm -ErrorAction SilentlyContinue
if ($npmCommand) {
  npm run check
  exit $LASTEXITCODE
}

$codexNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
if (Test-Path $codexNode) {
  Invoke-CookNoteNodeCheck $codexNode
  exit 0
}

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand -and $nodeCommand.Source -and $nodeCommand.Source -notlike '*\WindowsApps\*') {
  Invoke-CookNoteNodeCheck $nodeCommand.Source
  exit 0
}

Write-Error 'Node.js ou npm est requis pour lancer les checks Cook Note.'
exit 1

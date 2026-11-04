# `npm run serveur` : arrete le serveur local qui occupe le port (8080 par
# defaut) et relance celui du depot, en arriere-plan et sans fenetre, pour ne
# jamais tester une vieille version du site.
param([int]$Port = 8080)
$Root = Split-Path -Parent $PSScriptRoot
$Node = Join-Path $Root ".tools\node\current\node.exe"
if (-not (Test-Path -LiteralPath $Node)) { $Node = (Get-Command node).Source }

# Pages pre-rendues a jour avant de relancer (dist/).
& $Node (Join-Path $Root "scripts\build-site.js") | Out-Null

Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

$env:PORT = "$Port"
Start-Process -FilePath $Node -ArgumentList "server.js" -WorkingDirectory $Root -WindowStyle Hidden
Start-Sleep -Seconds 2
try {
  $status = (Invoke-WebRequest -UseBasicParsing "http://localhost:$Port/" -TimeoutSec 10).StatusCode
  Write-Host "Serveur relance : http://localhost:$Port (HTTP $status)"
} catch {
  Write-Host "Le serveur ne repond pas sur le port $Port."
  exit 1
}

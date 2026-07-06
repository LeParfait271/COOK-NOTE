param(
  [Parameter(Mandatory = $true)]
  [string[]]$Names,
  [string]$SourceDir = "assets\recipes\masters",
  [string]$OptimizedDir = "assets\recipes\heroes",
  [string]$CardDir = "assets\recipes\cards",
  [int]$OptimizedMaxWidth = 1400,
  [int]$CardMaxWidth = 760,
  [int]$OptimizedQuality = 86,
  [int]$CardQuality = 82,
  [switch]$OptimizedOnly,
  [switch]$CardOnly
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$sourcePath = Join-Path $root $SourceDir
$optimizedPath = Join-Path $root $OptimizedDir
$cardPath = Join-Path $root $CardDir

New-Item -ItemType Directory -Force -Path $optimizedPath | Out-Null
New-Item -ItemType Directory -Force -Path $cardPath | Out-Null
Add-Type -AssemblyName System.Drawing

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" } |
  Select-Object -First 1

if (-not $jpegCodec) {
  throw "JPEG encoder not available."
}

function Save-CookNoteJpeg {
  param(
    [string]$Source,
    [string]$Destination,
    [int]$MaxWidth,
    [int]$Quality
  )

  $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality,
    [int64]$Quality
  )

  $image = $null
  $bitmap = $null
  $graphics = $null
  try {
    $image = [System.Drawing.Image]::FromFile($Source)
    $scale = [Math]::Min(1.0, $MaxWidth / [double]$image.Width)
    $width = [Math]::Max(1, [int][Math]::Round($image.Width * $scale))
    $height = [Math]::Max(1, [int][Math]::Round($image.Height * $scale))

    $bitmap = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $bitmap.SetResolution($image.HorizontalResolution, $image.VerticalResolution)

    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.Clear([System.Drawing.Color]::Black)
    $graphics.DrawImage($image, 0, 0, $width, $height)
    $bitmap.Save($Destination, $jpegCodec, $encoderParams)
  }
  finally {
    if ($graphics) { $graphics.Dispose() }
    if ($bitmap) { $bitmap.Dispose() }
    if ($image) { $image.Dispose() }
    if ($encoderParams) { $encoderParams.Dispose() }
  }
}

$created = 0
$normalizedNames = $Names | ForEach-Object {
  [System.IO.Path]::GetFileNameWithoutExtension($_)
}

foreach ($name in $normalizedNames) {
  $source = Join-Path $sourcePath "$name.png"
  if (-not (Test-Path $source)) {
    throw "Master PNG introuvable: $source"
  }

  if (-not $CardOnly) {
    $destination = Join-Path $optimizedPath "$name.jpg"
    Save-CookNoteJpeg -Source $source -Destination $destination -MaxWidth $OptimizedMaxWidth -Quality $OptimizedQuality
    Write-Host "Optimized: $destination"
    $created += 1
  }

  if (-not $OptimizedOnly) {
    $destination = Join-Path $cardPath "$name.jpg"
    Save-CookNoteJpeg -Source $source -Destination $destination -MaxWidth $CardMaxWidth -Quality $CardQuality
    Write-Host "Card: $destination"
    $created += 1
  }
}

Write-Host "Selected images created: $created"

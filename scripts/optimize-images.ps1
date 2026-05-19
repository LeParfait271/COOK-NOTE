param(
  [string]$SourceDir = "assets\recipe-images",
  [string]$DestinationDir = "assets\recipe-images-optimized",
  [int]$MaxWidth = 1400,
  [int]$Quality = 86,
  [switch]$Force
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$sourcePath = Join-Path $root $SourceDir
$destinationPath = Join-Path $root $DestinationDir

if (-not (Test-Path $sourcePath)) {
  throw "Source directory not found: $sourcePath"
}

New-Item -ItemType Directory -Force -Path $destinationPath | Out-Null
Add-Type -AssemblyName System.Drawing

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" } |
  Select-Object -First 1

if (-not $jpegCodec) {
  throw "JPEG encoder not available."
}

$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality,
  [int64]$Quality
)

$sourceBytes = 0L
$destinationBytes = 0L
$created = 0
$skipped = 0

Get-ChildItem -Path $sourcePath -File -Filter "*.png" | Sort-Object Name | ForEach-Object {
  $sourceBytes += $_.Length
  $destinationFile = Join-Path $destinationPath ([System.IO.Path]::ChangeExtension($_.Name, ".jpg"))

  if (-not $Force -and (Test-Path $destinationFile)) {
    $existing = Get-Item $destinationFile
    if ($existing.LastWriteTimeUtc -ge $_.LastWriteTimeUtc) {
      $destinationBytes += $existing.Length
      $skipped += 1
      return
    }
  }

  $image = $null
  $bitmap = $null
  $graphics = $null
  try {
    $image = [System.Drawing.Image]::FromFile($_.FullName)
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

    $bitmap.Save($destinationFile, $jpegCodec, $encoderParams)
    $destinationBytes += (Get-Item $destinationFile).Length
    $created += 1
  }
  finally {
    if ($graphics) { $graphics.Dispose() }
    if ($bitmap) { $bitmap.Dispose() }
    if ($image) { $image.Dispose() }
  }
}

$sourceMb = [Math]::Round($sourceBytes / 1MB, 2)
$destinationMb = [Math]::Round($destinationBytes / 1MB, 2)
$savedPercent = if ($sourceBytes -gt 0) {
  [Math]::Round((1 - ($destinationBytes / [double]$sourceBytes)) * 100, 1)
} else {
  0
}

Write-Host "Optimized images created: $created"
Write-Host "Optimized images skipped: $skipped"
Write-Host "Original PNG total: ${sourceMb}MB"
Write-Host "Optimized JPG total: ${destinationMb}MB"
Write-Host "Saved: ${savedPercent}%"

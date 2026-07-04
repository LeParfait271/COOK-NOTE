param(
  [string]$OutputDir = "tmp\image-audit",
  [int]$Columns = 4,
  [int]$ThumbWidth = 320,
  [int]$ThumbHeight = 190,
  [int]$LabelHeight = 48,
  [int]$BatchSize = 16
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$outRoot = Join-Path $root $OutputDir
New-Item -ItemType Directory -Force -Path $outRoot | Out-Null

Add-Type -AssemblyName System.Drawing

function Get-RelativePath([string]$path) {
  $full = [System.IO.Path]::GetFullPath($path)
  $base = [System.IO.Path]::GetFullPath("$root\")
  return $full.Substring($base.Length).Replace("\", "/")
}

function Get-ImageFiles([string]$relativeDir) {
  $dir = Join-Path $root $relativeDir
  if (!(Test-Path $dir)) { return @() }
  return Get-ChildItem -Path $dir -File |
    Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|webp)$' } |
    Sort-Object Name
}

function Draw-ImageContained($graphics, $image, [System.Drawing.RectangleF]$target) {
  $scale = [Math]::Min($target.Width / $image.Width, $target.Height / $image.Height)
  $width = [Single]($image.Width * $scale)
  $height = [Single]($image.Height * $scale)
  $x = [Single]($target.X + (($target.Width - $width) / 2))
  $y = [Single]($target.Y + (($target.Height - $height) / 2))
  $graphics.DrawImage($image, $x, $y, $width, $height)
}

function Draw-WrappedLabel($graphics, [string]$text, [System.Drawing.RectangleF]$rect, $font, $brush) {
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Near
  $format.Trimming = [System.Drawing.StringTrimming]::EllipsisCharacter
  $graphics.DrawString($text, $font, $brush, $rect, $format)
  $format.Dispose()
}

function New-ContactSheets([string]$name, [array]$files) {
  if (!$files -or !$files.Count) { return }

  $cellWidth = $ThumbWidth
  $cellHeight = $ThumbHeight + $LabelHeight
  $sheetIndex = 1

  for ($start = 0; $start -lt $files.Count; $start += $BatchSize) {
    $batch = @($files[$start..([Math]::Min($start + $BatchSize - 1, $files.Count - 1))])
    $rows = [Math]::Ceiling($batch.Count / $Columns)
    $bitmap = New-Object System.Drawing.Bitmap ($Columns * $cellWidth), ([int]$rows * $cellHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::FromArgb(246, 243, 235))
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    $labelFont = New-Object System.Drawing.Font "Arial", 10, ([System.Drawing.FontStyle]::Regular)
    $labelBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(30, 27, 24))
    $borderPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(185, 170, 145)), 1

    for ($i = 0; $i -lt $batch.Count; $i++) {
      $file = $batch[$i]
      $column = $i % $Columns
      $row = [Math]::Floor($i / $Columns)
      $x = $column * $cellWidth
      $y = $row * $cellHeight

      $graphics.FillRectangle([System.Drawing.Brushes]::White, $x, $y, $cellWidth, $ThumbHeight)
      $graphics.DrawRectangle($borderPen, $x, $y, $cellWidth - 1, $ThumbHeight - 1)

      $image = [System.Drawing.Image]::FromFile($file.FullName)
      try {
        Draw-ImageContained $graphics $image (New-Object System.Drawing.RectangleF ($x + 2), ($y + 2), ($cellWidth - 4), ($ThumbHeight - 4))
      } finally {
        $image.Dispose()
      }

      $label = Get-RelativePath $file.FullName
      Draw-WrappedLabel $graphics $label (New-Object System.Drawing.RectangleF $x, ($y + $ThumbHeight + 4), $cellWidth, ($LabelHeight - 6)) $labelFont $labelBrush
    }

    $outFile = Join-Path $outRoot ("{0}-{1:000}.jpg" -f $name, $sheetIndex)
    $bitmap.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)

    $borderPen.Dispose()
    $labelBrush.Dispose()
    $labelFont.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
    $sheetIndex++
  }
}

New-ContactSheets "recipe-images-optimized" @(Get-ImageFiles "assets\recipe-images-optimized")
New-ContactSheets "theme-dark" @(Get-ImageFiles "assets\dark")
New-ContactSheets "theme-day" @(Get-ImageFiles "assets\day")

Write-Host "Contact sheets written to $outRoot"

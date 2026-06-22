$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$targets = @(
  'recipes.js',
  'assets\catalog-1.js',
  'assets\catalog-2.js',
  'assets\catalog-3.js',
  'assets\catalog-4.js'
)

$byteMap = @{
  0x20AC = 0x80
  0x201A = 0x82
  0x0192 = 0x83
  0x201E = 0x84
  0x2026 = 0x85
  0x2020 = 0x86
  0x2021 = 0x87
  0x02C6 = 0x88
  0x2030 = 0x89
  0x0160 = 0x8A
  0x2039 = 0x8B
  0x0152 = 0x8C
  0x017D = 0x8E
  0x2018 = 0x91
  0x2019 = 0x92
  0x201C = 0x93
  0x201D = 0x94
  0x2022 = 0x95
  0x2013 = 0x96
  0x2014 = 0x97
  0x02DC = 0x98
  0x2122 = 0x99
  0x0161 = 0x9A
  0x203A = 0x9B
  0x0153 = 0x9C
  0x017E = 0x9E
  0x0178 = 0x9F
}

$e2Followers = New-Object 'System.Collections.Generic.HashSet[int]'
@(
  0x0080, 0x0081, 0x0082, 0x0083, 0x0084, 0x0085, 0x0086, 0x0087,
  0x0088, 0x0089, 0x008A, 0x008B, 0x008C, 0x008E, 0x0091, 0x0092,
  0x0093, 0x0094, 0x0095, 0x0096, 0x0097, 0x0098, 0x0099, 0x009A,
  0x009B, 0x009C, 0x009E, 0x009F, 0x20AC, 0x201A, 0x0192, 0x201E,
  0x2026, 0x2020, 0x2021, 0x02C6, 0x2030, 0x0160, 0x2039, 0x0152,
  0x017D, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2013, 0x2014,
  0x02DC, 0x2122, 0x0161, 0x203A, 0x0153, 0x017E, 0x0178
) | ForEach-Object { [void]$e2Followers.Add([int]$_) }

function Test-DecodableMojibakeChar([int]$codePoint) {
  return ($codePoint -le 255 -or $byteMap.ContainsKey($codePoint))
}

function Test-MojibakeFollower([int]$codePoint) {
  return (($codePoint -ge 0x0080 -and $codePoint -le 0x00BF) -or $byteMap.ContainsKey($codePoint))
}

function Decode-MojibakeSequence([string]$value) {
  $bytes = New-Object 'System.Collections.Generic.List[byte]'
  foreach ($ch in $value.ToCharArray()) {
    $codePoint = [int][char]$ch
    if ($byteMap.ContainsKey($codePoint)) {
      $bytes.Add([byte]$byteMap[$codePoint])
    } elseif ($codePoint -le 255) {
      $bytes.Add([byte]$codePoint)
    } else {
      return $value
    }
  }
  return [System.Text.Encoding]::UTF8.GetString($bytes.ToArray())
}

function Convert-EscapedPair([System.Text.RegularExpressions.Match]$match) {
  $first = [Convert]::ToInt32($match.Groups[1].Value, 16)
  $second = [Convert]::ToInt32($match.Groups[2].Value, 16)
  if (-not (Test-MojibakeFollower $second)) { return $match.Value }
  return ([string][char]$first) + ([string][char]$second)
}

function Convert-EscapedTriple([System.Text.RegularExpressions.Match]$match) {
  $second = [Convert]::ToInt32($match.Groups[1].Value, 16)
  $third = [Convert]::ToInt32($match.Groups[2].Value, 16)
  if (-not $e2Followers.Contains($second)) { return $match.Value }
  if (-not (Test-DecodableMojibakeChar $third)) { return $match.Value }
  return ([string][char]0x00E2) + ([string][char]$second) + ([string][char]$third)
}

function Expand-EscapedMojibake([string]$text) {
  $text = [regex]::Replace($text, '(?i)\\u(00c3|00c2|00c5)\\u([0-9a-f]{4})', {
    param($match)
    Convert-EscapedPair $match
  })
  return [regex]::Replace($text, '(?i)\\u00e2\\u([0-9a-f]{4})\\u([0-9a-f]{4})', {
    param($match)
    Convert-EscapedTriple $match
  })
}

function Get-MojibakeScore([string]$text) {
  if ([string]::IsNullOrEmpty($text)) { return 0 }
  $score = 0
  for ($index = 0; $index -lt $text.Length; $index += 1) {
    $codePoint = [int][char]$text[$index]
    if ($codePoint -eq 0xFFFD) {
      $score += 1
    } elseif (($codePoint -eq 0x00C3 -or $codePoint -eq 0x00C2 -or $codePoint -eq 0x00C5) -and $index + 1 -lt $text.Length) {
      if (Test-MojibakeFollower ([int][char]$text[$index + 1])) {
        $score += 1
      }
    } elseif ($codePoint -eq 0x00E2 -and $index + 1 -lt $text.Length) {
      if ($e2Followers.Contains([int][char]$text[$index + 1])) {
        $score += 1
      }
    }
  }
  return $score
}

function Repair-MojibakeText([string]$text) {
  if ([string]::IsNullOrEmpty($text)) { return $text }
  $builder = [System.Text.StringBuilder]::new()
  $changed = $false

  for ($index = 0; $index -lt $text.Length; $index += 1) {
    $codePoint = [int][char]$text[$index]
    if (($codePoint -eq 0x00C3 -or $codePoint -eq 0x00C2 -or $codePoint -eq 0x00C5) -and $index + 1 -lt $text.Length) {
      $nextCodePoint = [int][char]$text[$index + 1]
      if (Test-MojibakeFollower $nextCodePoint) {
        [void]$builder.Append((Decode-MojibakeSequence $text.Substring($index, 2)))
        $index += 1
        $changed = $true
      } else {
        [void]$builder.Append($text[$index])
      }
    } elseif ($codePoint -eq 0x00E2 -and $index + 2 -lt $text.Length -and $e2Followers.Contains([int][char]$text[$index + 1])) {
      if (Test-DecodableMojibakeChar ([int][char]$text[$index + 2])) {
        [void]$builder.Append((Decode-MojibakeSequence $text.Substring($index, 3)))
        $index += 2
        $changed = $true
      } else {
        [void]$builder.Append($text[$index])
      }
    } else {
      [void]$builder.Append($text[$index])
    }
  }

  if (-not $changed) { return $text }
  $patched = $builder.ToString()
  if ((Get-MojibakeScore $patched) -le (Get-MojibakeScore $text)) { return $patched }
  return $text
}

function Repair-FileText([string]$text) {
  $patched = Expand-EscapedMojibake $text
  for ($pass = 0; $pass -lt 5; $pass += 1) {
    $next = Repair-MojibakeText $patched
    if ($next -eq $patched) { break }
    $patched = $next
  }
  return $patched
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$updated = @()

foreach ($target in $targets) {
  $path = Join-Path $root $target
  $text = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
  $patched = Repair-FileText $text
  if ($patched -ne $text) {
    [System.IO.File]::WriteAllText($path, $patched, $utf8NoBom)
    $updated += $target
  }
}

if ($updated.Count) {
  Write-Host ('Encodage repare: ' + ($updated -join ', '))
} else {
  Write-Host 'Aucune correction necessaire.'
}

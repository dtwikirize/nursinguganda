param(
  [int]$MaxWidth = 900,
  [long]$Quality = 82
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$ImagesRoot = Join-Path $Root "assets\images"
$OutputDir = Join-Path $ImagesRoot "optimized"
$MatchFile = Join-Path $Root "assets\data\topic-image-matches.json"
$PageSelectionFile = Join-Path $ImagesRoot "nursing-uganda-page-image-selections.json"
$ManifestFile = Join-Path $OutputDir "nursing-uganda-optimized-image-manifest.json"
$SupportedExtensions = @(".jpg", ".jpeg", ".png", ".webp")

Add-Type -AssemblyName System.Drawing

function Convert-ToWebPath {
  param([string]$Path)
  return $Path.Replace([string]$Root, "").TrimStart("\").Replace("\", "/")
}

function Get-JpegCodec {
  return [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" } | Select-Object -First 1
}

function New-UniqueList {
  param([array]$Values)
  $seen = @{}
  $out = New-Object System.Collections.Generic.List[string]
  foreach ($value in $Values) {
    if ([string]::IsNullOrWhiteSpace($value)) { continue }
    if ($seen.ContainsKey($value)) { continue }
    $seen[$value] = $true
    $out.Add($value)
  }
  return $out
}

New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

$rootImages = Get-ChildItem -LiteralPath $ImagesRoot -File |
  Where-Object { $SupportedExtensions -contains $_.Extension.ToLowerInvariant() } |
  ForEach-Object { Convert-ToWebPath $_.FullName }

$matchJson = Get-Content -LiteralPath $MatchFile -Raw | ConvertFrom-Json
$strongImages = $matchJson.matches.PSObject.Properties.Value |
  Where-Object { $_.confidence -eq "strong" } |
  ForEach-Object { $_.image }

$pageSelectionJson = Get-Content -LiteralPath $PageSelectionFile -Raw | ConvertFrom-Json
$pageSelectionImages = $pageSelectionJson.PSObject.Properties.Value | ForEach-Object { $_.file }

$sources = New-UniqueList ($rootImages + $pageSelectionImages + $strongImages)
$jpegCodec = Get-JpegCodec
$encoder = [System.Drawing.Imaging.Encoder]::Quality
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, $Quality)

$optimized = @{}
$skipped = New-Object System.Collections.Generic.List[object]
$created = 0
$savedBytes = 0L

foreach ($source in $sources) {
  $sourcePath = Join-Path $Root ($source -replace "/", "\")
  if (-not (Test-Path -LiteralPath $sourcePath)) {
    $skipped.Add([pscustomobject]@{ source = $source; reason = "missing" })
    continue
  }

  $sourceItem = Get-Item -LiteralPath $sourcePath
  if ($sourceItem.Length -lt 40960) {
    $skipped.Add([pscustomobject]@{ source = $source; reason = "already-small" })
    continue
  }

  $image = $null
  $bitmap = $null
  $graphics = $null
  try {
    $image = [System.Drawing.Image]::FromFile($sourcePath)
    $ratio = if ($image.Width -gt $MaxWidth) { $MaxWidth / $image.Width } else { 1 }
    $targetWidth = [Math]::Max(1, [int][Math]::Round($image.Width * $ratio))
    $targetHeight = [Math]::Max(1, [int][Math]::Round($image.Height * $ratio))

    $outputBaseName = [IO.Path]::GetFileNameWithoutExtension($sourceItem.Name)
    $outputFileName = "$outputBaseName-w$targetWidth.jpg"
    $outputPath = Join-Path $OutputDir $outputFileName

    $bitmap = New-Object System.Drawing.Bitmap $targetWidth, $targetHeight
    $bitmap.SetResolution(72, 72)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::White)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.DrawImage($image, 0, 0, $targetWidth, $targetHeight)
    $graphics.Dispose()
    $graphics = $null

    $bitmap.Save($outputPath, $jpegCodec, $encoderParams)
    $outputItem = Get-Item -LiteralPath $outputPath

    if ($outputItem.Length -ge $sourceItem.Length) {
      Remove-Item -LiteralPath $outputPath -Force
      $skipped.Add([pscustomobject]@{ source = $source; reason = "optimized-larger" })
      continue
    }

    $optimized[$source] = [ordered]@{
      src = Convert-ToWebPath $outputPath
      width = $targetWidth
      height = $targetHeight
      original_bytes = $sourceItem.Length
      optimized_bytes = $outputItem.Length
      saved_bytes = $sourceItem.Length - $outputItem.Length
    }
    $created += 1
    $savedBytes += ($sourceItem.Length - $outputItem.Length)
  } catch {
    $skipped.Add([pscustomobject]@{ source = $source; reason = $_.Exception.Message })
  } finally {
    if ($graphics) { $graphics.Dispose() }
    if ($bitmap) { $bitmap.Dispose() }
    if ($image) { $image.Dispose() }
  }
}

$manifest = [ordered]@{
  generated_at_utc = (Get-Date).ToUniversalTime().ToString("o")
  max_width = $MaxWidth
  quality = $Quality
  source_count = $sources.Count
  optimized_count = $created
  saved_bytes = $savedBytes
  images = $optimized
  skipped = $skipped
}

$manifestJson = $manifest | ConvertTo-Json -Depth 8
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($ManifestFile, $manifestJson, $utf8NoBom)

Write-Host "Sources: $($sources.Count)"
Write-Host "Optimized: $created"
Write-Host "Saved bytes: $savedBytes"
Write-Host "Manifest: $ManifestFile"

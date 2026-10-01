Add-Type -AssemblyName System.Drawing

$src = "public\assets\tsoc_logo.jpg"
$dst = "public\assets\tsoc_logo_transparent.png"

$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path $src))
$width = 900
$height = [int]($img.Height * ($width / $img.Width))

$format = [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
$bmp = New-Object System.Drawing.Bitmap($width, $height, $format)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, 0, 0, $width, $height)
$g.Dispose()
$img.Dispose()

$rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$lockMode = [System.Drawing.Imaging.ImageLockMode]::ReadWrite
$bmpData = $bmp.LockBits($rect, $lockMode, $format)
$stride = [Math]::Abs($bmpData.Stride)
$bytes = $stride * $height
$rgbValues = New-Object byte[] $bytes
[System.Runtime.InteropServices.Marshal]::Copy($bmpData.Scan0, $rgbValues, 0, $bytes)

for ($i = 0; $i -lt $bytes; $i += 4) {
    $b = [int]$rgbValues[$i]
    $gVal = [int]$rgbValues[$i + 1]
    $r = [int]$rgbValues[$i + 2]
    
    $max = [Math]::Max($r, [Math]::Max($gVal, $b))
    
    if ($max -le 16) {
        $rgbValues[$i + 3] = [byte]0
    } elseif ($max -le 64) {
        $alpha = [int](($max - 16) / 48.0 * 255)
        $rgbValues[$i + 3] = [byte]$alpha
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($rgbValues, 0, $bmpData.Scan0, $bytes)
$bmp.UnlockBits($bmpData)

$bmp.Save((Join-Path (Get-Location) $dst), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Output "Done! Size: $(Get-Item $dst | Select-Object -ExpandProperty Length) bytes"

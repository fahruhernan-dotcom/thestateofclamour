Add-Type -AssemblyName System.Drawing

$src = "Source\drive-download-20261001T094129Z-1-001\TSOC Logo.jpg"
$dst = "public\assets\tsoc_logo.png"

$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path $src))
Write-Output "Image size: $($img.Width)x$($img.Height)"

$c0 = $img.GetPixel(10, 10)
Write-Output "Sample corner pixel: R=$($c0.R) G=$($c0.G) B=$($c0.B)"

# Create a 32-bit ARGB image for perfect transparency
$width = 800
$height = [int]($img.Height * ($width / $img.Width))
$resized = New-Object System.Drawing.Bitmap $width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
$g = [System.Drawing.Graphics]::FromImage($resized)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, 0, 0, $width, $height)
$g.Dispose()
$img.Dispose()

# Now iterate and make dark pixels transparent with smooth alpha falloff
# Lock bits or use fast processing
for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $p = $resized.GetPixel($x, $y)
        # Max RGB value as luminance estimate
        $maxC = [Math]::Max($p.R, [Math]::Max($p.G, $p.B))
        
        # If dark background
        if ($maxC -lt 15) {
            $resized.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($maxC -lt 45) {
            # Smooth feather alpha
            $alpha = [int](($maxC - 15) / 30.0 * 255)
            $resized.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
        }
    }
}

$resized.Save((Join-Path (Get-Location) $dst), [System.Drawing.Imaging.ImageFormat]::Png)
$resized.Dispose()

Write-Output "Saved transparent PNG: $(Get-Item $dst | Select-Object -ExpandProperty Length) bytes"

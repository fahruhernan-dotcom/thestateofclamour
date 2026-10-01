Add-Type -AssemblyName System.Drawing

$src = "public\assets\tsoc_logo.jpg"
$dst = "public\assets\tsoc_logo_web.jpg"

if (Test-Path $src) {
    $img = [System.Drawing.Image]::FromFile((Resolve-Path $src))
    $width = 1000
    $height = [int]($img.Height * ($width / $img.Width))
    $newImg = New-Object System.Drawing.Bitmap $width, $height
    $g = [System.Drawing.Graphics]::FromImage($newImg)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $width, $height)
    
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoder = [System.Drawing.Imaging.Encoder]::Quality
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, [long]88)
    
    $newImg.Save((Join-Path (Get-Location) $dst), $codec, $encoderParams)
    
    $g.Dispose()
    $newImg.Dispose()
    $img.Dispose()
    
    Write-Output "Optimized successfully: $(Get-Item $dst | Select-Object -ExpandProperty Length) bytes"
}

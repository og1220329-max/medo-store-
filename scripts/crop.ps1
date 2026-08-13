Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\LOQ\.gemini\antigravity-ide\brain\3606d287-b125-492c-b172-f901d8e7af0a\.user_uploaded\media_1786660879847.jpg"
$destPath = "c:\Users\LOQ\Downloads\medo store\public\images\medo-hero-banner.jpg"
$destPng = "c:\Users\LOQ\Downloads\medo store\public\images\medo-hero-banner.png"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
# Crop banner rectangle (Y: 104 to 506 -> height: 402, X: 24 to 1000 -> width: 976)
$x = 20
$y = 105
$width = $src.Width - 40
$height = 400
$rect = New-Object System.Drawing.Rectangle($x, $y, $width, $height)
$cropped = $src.Clone($rect, $src.PixelFormat)
$cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropped.Save($destPng, [System.Drawing.Imaging.ImageFormat]::Png)
$src.Dispose()
$cropped.Dispose()
Write-Output "Successfully cropped: $width x $height"

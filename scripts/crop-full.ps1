Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\LOQ\.gemini\antigravity-ide\brain\3606d287-b125-492c-b172-f901d8e7af0a\.user_uploaded\media_1786660879847.jpg"
$destFull = "c:\Users\LOQ\Downloads\medo store\public\images\medo-full-hero.jpg"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
# Crop everything below navbar (Y: 104 to end of image)
$y = 104
$height = $src.Height - $y
$rect = New-Object System.Drawing.Rectangle(0, $y, $src.Width, $height)
$cropped = $src.Clone($rect, $src.PixelFormat)
$cropped.Save($destFull, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$src.Dispose()
$cropped.Dispose()
Write-Output "Full hero image saved: $($src.Width) x $height"

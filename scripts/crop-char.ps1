Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\LOQ\.gemini\antigravity-ide\brain\3606d287-b125-492c-b172-f901d8e7af0a\.user_uploaded\media_1786660879847.jpg"
$destChar = "c:\Users\LOQ\Downloads\medo store\public\images\medo-character.jpg"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
# Character is on left side (X: 20 to 460, Y: 105 to 505)
$x = 20
$y = 105
$width = 460
$height = 400
$rect = New-Object System.Drawing.Rectangle($x, $y, $width, $height)
$cropped = $src.Clone($rect, $src.PixelFormat)
$cropped.Save($destChar, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$src.Dispose()
$cropped.Dispose()
Write-Output "Character saved: $width x $height"

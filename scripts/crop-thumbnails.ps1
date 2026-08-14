Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\LOQ\.gemini\antigravity-ide\brain\3606d287-b125-492c-b172-f901d8e7af0a\.user_uploaded\media_1786717572952.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

# Crop Card 1 (UC 60) thumbnail
$r1 = New-Object System.Drawing.Rectangle(658, 124, 78, 78)
$c1 = $src.Clone($r1, $src.PixelFormat)
$c1.Save("c:\Users\LOQ\Downloads\medo store\public\images\uc-60-card.png", [System.Drawing.Imaging.ImageFormat]::Png)
$c1.Dispose()

# Crop Card 2 (UC 120) thumbnail
$r2 = New-Object System.Drawing.Rectangle(658, 245, 78, 78)
$c2 = $src.Clone($r2, $src.PixelFormat)
$c2.Save("c:\Users\LOQ\Downloads\medo store\public\images\uc-120-card.png", [System.Drawing.Imaging.ImageFormat]::Png)
$c2.Dispose()

# Crop Card 3 (UC 325) thumbnail
$r3 = New-Object System.Drawing.Rectangle(658, 366, 78, 78)
$c3 = $src.Clone($r3, $src.PixelFormat)
$c3.Save("c:\Users\LOQ\Downloads\medo store\public\images\uc-325-card.png", [System.Drawing.Imaging.ImageFormat]::Png)
$c3.Dispose()

$src.Dispose()
Write-Output "Cropped all 3 thumbnails successfully."

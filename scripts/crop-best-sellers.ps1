Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\LOQ\.gemini\antigravity-ide\brain\3606d287-b125-492c-b172-f901d8e7af0a\.user_uploaded\media_1786717572952.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

Write-Output "Source Dimensions: $($src.Width) x $($src.Height)"

# Crop UC 60 thumbnail
# In the image (approx width 1024 x 512)
# Let's crop the 3 card thumbnails:
# UC 60 thumbnail is in the top right card, on its left side
# UC 120 thumbnail is in the middle right card
# UC 325 thumbnail is in the bottom right card

# Let's crop the PUBG promo banner (left side of image)
# Coordinates of banner: from X=30 to X=625, Y=100 to Y=460 approx
$bannerRect = New-Object System.Drawing.Rectangle(30, 100, 595, 360)
if ($bannerRect.Right -le $src.Width -and $bannerRect.Bottom -le $src.Height) {
    $croppedBanner = $src.Clone($bannerRect, $src.PixelFormat)
    $croppedBanner.Save("c:\Users\LOQ\Downloads\medo store\public\images\best-seller-banner.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $croppedBanner.Dispose()
    Write-Output "Saved best-seller-banner.png"
}

$src.Dispose()

Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\LOQ\.gemini\antigravity-ide\brain\3606d287-b125-492c-b172-f901d8e7af0a\.user_uploaded\media_1786715988898.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

# 1. Full section image (1024 x 457)
$src.Save("c:\Users\LOQ\Downloads\medo store\public\images\weekly-best-full.png", [System.Drawing.Imaging.ImageFormat]::Png)

# 2. Right PUBG Promo Card (X: 442, Y: 114, Width: 528, Height: 343)
$cropH = [Math]::Min(343, $src.Height - 114)
$rectBanner = New-Object System.Drawing.Rectangle(442, 114, 528, $cropH)
$cropBanner = $src.Clone($rectBanner, $src.PixelFormat)
$cropBanner.Save("c:\Users\LOQ\Downloads\medo store\public\images\weekly-pubg-promo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropBanner.Dispose()

# 3. Item 1: TikTok 7000 (X: 350, Y: 120, Width: 66, Height: 80)
$rect1 = New-Object System.Drawing.Rectangle(350, 120, 66, 80)
$crop1 = $src.Clone($rect1, $src.PixelFormat)
$crop1.Save("c:\Users\LOQ\Downloads\medo store\public\images\weekly-tiktok-7000.png", [System.Drawing.Imaging.ImageFormat]::Png)
$crop1.Dispose()

# 4. Item 2: Popularity Bike (X: 350, Y: 226, Width: 66, Height: 80)
$rect2 = New-Object System.Drawing.Rectangle(350, 226, 66, 80)
$crop2 = $src.Clone($rect2, $src.PixelFormat)
$crop2.Save("c:\Users\LOQ\Downloads\medo store\public\images\weekly-popularity-bike.png", [System.Drawing.Imaging.ImageFormat]::Png)
$crop2.Dispose()

# 5. Item 3: TikTok 17500 (X: 350, Y: 332, Width: 66, Height: 80)
$rect3 = New-Object System.Drawing.Rectangle(350, 332, 66, 80)
$crop3 = $src.Clone($rect3, $src.PixelFormat)
$crop3.Save("c:\Users\LOQ\Downloads\medo store\public\images\weekly-tiktok-17500.png", [System.Drawing.Imaging.ImageFormat]::Png)
$crop3.Dispose()

$src.Dispose()
Write-Output "Assets successfully generated!"

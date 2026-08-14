Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\LOQ\.gemini\antigravity-ide\brain\3606d287-b125-492c-b172-f901d8e7af0a\.user_uploaded\media_1786713082111.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

$y = 54
$size = 146

$circles = @(
    @{ name = "cat-uc-self.png";       x = 69 },
    @{ name = "cat-popularity.png";    x = 252 },
    @{ name = "cat-uc-we-charge.png";  x = 437 },
    @{ name = "cat-cheap-acc.png";     x = 621 },
    @{ name = "cat-korean-acc.png";    x = 805 }
)

foreach ($c in $circles) {
    $dest = "c:\Users\LOQ\Downloads\medo store\public\images\$($c.name)"
    $rect = New-Object System.Drawing.Rectangle($c.x, $y, $size, $size)
    $cropped = $src.Clone($rect, $src.PixelFormat)
    $cropped.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    Write-Output "Saved $($c.name)"
}

$src.Dispose()

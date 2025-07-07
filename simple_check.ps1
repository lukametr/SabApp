$zipFile = "test_download_20250707_132720.zip"
Write-Host "Checking ZIP file: $zipFile"
Write-Host "File size: $((Get-Item $zipFile).Length) bytes"

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipFile)
Write-Host "ZIP Contents:"
$zip.Entries | ForEach-Object { Write-Host "  - $($_.Name) ($($_.Length) bytes)" }
$zip.Dispose()
Write-Host "Total entries: $($zip.Entries.Count)"

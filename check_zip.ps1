# Check ZIP contents
$zipFile = "test_download_20250707_132720.zip"
if (Test-Path $zipFile) {
    Write-Host "✅ ZIP file exists: $zipFile"
    $fileSize = (Get-Item $zipFile).Length
    Write-Host "📦 File size: $fileSize bytes"
    
    try {
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        $zip = [System.IO.Compression.ZipFile]::OpenRead($zipFile)
        
        Write-Host "📁 ZIP Contents:"
        $entryCount = 0
        $zip.Entries | ForEach-Object {
            Write-Host "  - $($_.Name) ($($_.Length) bytes)"
            $entryCount++
        }
        
        $zip.Dispose()
        Write-Host "✅ ZIP file is valid and contains $entryCount entries"
    } catch {
        Write-Host "❌ Error reading ZIP: $($_.Exception.Message)"
    }
} else {
    Write-Host "❌ ZIP file not found: $zipFile"
}

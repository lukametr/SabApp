# Test download functionality
$baseUrl = "http://localhost:10000/api"
$documentId = "686b8db41a7ce55e8e8500ee"

Write-Host "Testing download for document ID: $documentId"

# Test download
try {
    $downloadResponse = Invoke-WebRequest -Uri "$baseUrl/documents/$documentId/download" -Method GET
    
    if ($downloadResponse.StatusCode -eq 200) {
        Write-Host "✅ Download successful!"
        Write-Host "Content-Type: $($downloadResponse.Headers.'Content-Type')"
        Write-Host "Content-Length: $($downloadResponse.Headers.'Content-Length')"
        
        # Save the file
        $fileName = "test_download_$(Get-Date -Format 'yyyyMMdd_HHmmss').zip"
        [System.IO.File]::WriteAllBytes($fileName, $downloadResponse.Content)
        Write-Host "File saved as: $fileName"
        
        # Check file size
        $fileSize = (Get-Item $fileName).Length
        Write-Host "File size: $fileSize bytes"
        
    } else {
        Write-Host "❌ Download failed with status: $($downloadResponse.StatusCode)"
    }
} catch {
    Write-Host "❌ Download error: $($_.Exception.Message)"
}

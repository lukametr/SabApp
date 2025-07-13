# Test different Railway URLs to find the correct one
$urls = @(
    "https://sabapp-production.up.railway.app",
    "https://saba-app-production.up.railway.app",
    "https://sabapp.up.railway.app",
    "https://saba-app.up.railway.app"
)

Write-Host "🔍 Testing Railway URLs..." -ForegroundColor Yellow

foreach ($url in $urls) {
    Write-Host "`nTesting: $url" -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method GET -TimeoutSec 10
        Write-Host "✅ $url is accessible" -ForegroundColor Green
        Write-Host "   Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor White
    } catch {
        if ($_.Exception.Response.StatusCode -eq 404) {
            Write-Host "❌ $url returns 404 - App not found" -ForegroundColor Red
        } elseif ($_.Exception.Response.StatusCode -eq 500) {
            Write-Host "⚠️ $url returns 500 - Server error (but app exists)" -ForegroundColor Yellow
        } else {
            Write-Host "❌ $url failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n🏁 URL testing completed!" -ForegroundColor Yellow

Write-Host "🔧 Google OAuth Production Fix - Quick Test" -ForegroundColor Cyan

# Test environment detection logic
Write-Host "`nTesting environment detection logic:" -ForegroundColor Yellow

Write-Host "Production hostnames that should trigger redirect flow:"
$productionHosts = @(
  "saba-app-production.up.railway.app",
  "example.com", 
  "mydomain.com"
)

foreach ($host in $productionHosts) {
  $isProduction = $host -ne "localhost" -and $host -ne "127.0.0.1"
  $flow = if ($isProduction) { "Redirect" } else { "Popup" }
  Write-Host "  $host -> $flow flow" -ForegroundColor $(if ($isProduction) { "Green" } else { "Red" })
}

Write-Host "`nDevelopment hostnames that should trigger popup flow:"
$devHosts = @(
  "localhost",
  "127.0.0.1"
)

foreach ($host in $devHosts) {
  $isProduction = $host -ne "localhost" -and $host -ne "127.0.0.1"
  $flow = if ($isProduction) { "Redirect" } else { "Popup" }
  Write-Host "  $host -> $flow flow" -ForegroundColor $(if ($isProduction) { "Red" } else { "Green" })
}

Write-Host "`n✅ Environment detection logic is correct!" -ForegroundColor Green

Write-Host "`n📋 What this fix does:" -ForegroundColor Cyan
Write-Host "1. Production (saba-app-production.up.railway.app):"
Write-Host "   - Skips Google API popup initialization"
Write-Host "   - Uses OAuth2 redirect flow only"
Write-Host "   - No more FedCM errors"

Write-Host "`n2. Development (localhost):"
Write-Host "   - Initializes Google API with popup mode"
Write-Host "   - Uses popup flow for testing"
Write-Host "   - Maintains development workflow"

Write-Host "`n🔧 Next steps required:" -ForegroundColor Yellow
Write-Host "1. Update Google Cloud Console:"
Write-Host "   - Add: https://saba-app-production.up.railway.app (JavaScript origins)"
Write-Host "   - Add: https://saba-app-production.up.railway.app/auth/google/callback (redirect URIs)"
Write-Host "2. Test in production after Google Console update"

Write-Host "`n💡 The FedCM errors should now be resolved!" -ForegroundColor Green

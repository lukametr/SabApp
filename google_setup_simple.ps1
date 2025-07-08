Write-Host "Google OAuth Configuration Check" -ForegroundColor Cyan

$clientId = "675742559993-5quocp5mgvmog0fd2g8ue03vpleb23t5.apps.googleusercontent.com"
$productionDomain = "https://saba-app-production.up.railway.app"
$callbackUrl = "$productionDomain/auth/google/callback"

Write-Host "`nConfiguration Details:" -ForegroundColor Yellow
Write-Host "Client ID: $clientId"
Write-Host "Production Domain: $productionDomain"
Write-Host "Callback URL: $callbackUrl"

Write-Host "`nCurrent Problem:" -ForegroundColor Red
Write-Host "Google OAuth returns 404 error - redirect URI not authorized"

Write-Host "`nGoogle Cloud Console Setup Required:" -ForegroundColor Green
Write-Host "1. Authorized JavaScript origins:"
Write-Host "   $productionDomain"
Write-Host ""
Write-Host "2. Authorized redirect URIs:"
Write-Host "   $callbackUrl"

Write-Host "`nSteps:" -ForegroundColor Cyan
Write-Host "1. Go to: https://console.cloud.google.com/"
Write-Host "2. Navigate: APIs & Services > Credentials"
Write-Host "3. Find OAuth 2.0 Client ID: $clientId"
Write-Host "4. Add the URLs above"
Write-Host "5. Save changes"

Write-Host "`nNote:" -ForegroundColor Yellow
Write-Host "Changes may take 5-10 minutes to take effect"

Write-Host "`nAfter Setup:" -ForegroundColor Green
Write-Host "Google OAuth should work in production without errors"

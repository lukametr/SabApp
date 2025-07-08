Write-Host "Checking Google OAuth Configuration Issues" -ForegroundColor Red

Write-Host "`nProblem: Google OAuth worked yesterday but now returns 404" -ForegroundColor Yellow

Write-Host "`nRecent changes that might have broken it:" -ForegroundColor Cyan
Write-Host "1. Modified Navigation.tsx to use redirect flow in production"
Write-Host "2. Added environment detection logic"
Write-Host "3. Changed initialization behavior"

Write-Host "`nPossible Issues:" -ForegroundColor Red
Write-Host "1. NEXT_PUBLIC_GOOGLE_CLIENT_ID not set in production environment"
Write-Host "2. Backend OAuth callback endpoint issues"
Write-Host "3. Environment detection logic problems"
Write-Host "4. State parameter handling issues"

Write-Host "`nDebug Steps:" -ForegroundColor Green
Write-Host "1. Check if NEXT_PUBLIC_GOOGLE_CLIENT_ID is available in production"
Write-Host "2. Test if backend /auth/google/callback endpoint is working"
Write-Host "3. Verify environment detection logic"
Write-Host "4. Check if redirect URL is being constructed correctly"

Write-Host "`nQuick Fix Option:" -ForegroundColor Yellow
Write-Host "Temporarily revert Navigation.tsx to use popup flow in production"
Write-Host "This will restore yesterday's working behavior"

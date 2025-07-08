# Test Google OAuth Flow
Write-Host "🔧 Testing Google OAuth Configuration..." -ForegroundColor Cyan

# Check if apps are running
$backendRunning = $false
$frontendRunning = $false

try {
  $backendResponse = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET -TimeoutSec 5
  if ($backendResponse) {
    Write-Host "✅ Backend is running on port 3001" -ForegroundColor Green
    $backendRunning = $true
  }
}
catch {
  Write-Host "❌ Backend not responding on port 3001" -ForegroundColor Red
}

try {
  $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
  if ($frontendResponse.StatusCode -eq 200) {
    Write-Host "✅ Frontend is running on port 3000" -ForegroundColor Green
    $frontendRunning = $true
  }
}
catch {
  Write-Host "❌ Frontend not responding on port 3000" -ForegroundColor Red
}

# Check Google OAuth backend endpoint
if ($backendRunning) {
  Write-Host "`n🔍 Testing Google OAuth endpoints..." -ForegroundColor Cyan
    
  try {
    Invoke-RestMethod -Uri "http://localhost:3001/auth/google/callback" -Method POST -ContentType "application/json" -Body '{}' -TimeoutSec 5 | Out-Null
  }
  catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
      Write-Host "✅ Google OAuth callback endpoint exists (returned 400 as expected for empty request)" -ForegroundColor Green
    }
    else {
      Write-Host "⚠️ Google OAuth callback endpoint responded with: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
  }
}

# Check environment variables
Write-Host "`n🔍 Checking Google OAuth configuration..." -ForegroundColor Cyan

$backendEnv = "apps\backend\.env"
$frontendEnv = "apps\frontend\.env.local"

if (Test-Path $backendEnv) {
  $envContent = Get-Content $backendEnv
  $hasGoogleClientId = $envContent | Where-Object { $_ -match "GOOGLE_CLIENT_ID=" }
  $hasGoogleClientSecret = $envContent | Where-Object { $_ -match "GOOGLE_CLIENT_SECRET=" }
    
  if ($hasGoogleClientId) {
    Write-Host "✅ Backend GOOGLE_CLIENT_ID configured" -ForegroundColor Green
  }
  else {
    Write-Host "❌ Backend GOOGLE_CLIENT_ID missing" -ForegroundColor Red
  }
    
  if ($hasGoogleClientSecret) {
    Write-Host "✅ Backend GOOGLE_CLIENT_SECRET configured" -ForegroundColor Green
  }
  else {
    Write-Host "❌ Backend GOOGLE_CLIENT_SECRET missing" -ForegroundColor Red
  }
}
else {
  Write-Host "❌ Backend .env file not found" -ForegroundColor Red
}

if (Test-Path $frontendEnv) {
  $envContent = Get-Content $frontendEnv
  $hasNextPublicGoogleClientId = $envContent | Where-Object { $_ -match "NEXT_PUBLIC_GOOGLE_CLIENT_ID=" }
    
  if ($hasNextPublicGoogleClientId) {
    Write-Host "✅ Frontend NEXT_PUBLIC_GOOGLE_CLIENT_ID configured" -ForegroundColor Green
  }
  else {
    Write-Host "❌ Frontend NEXT_PUBLIC_GOOGLE_CLIENT_ID missing" -ForegroundColor Red
  }
}
else {
  Write-Host "❌ Frontend .env.local file not found" -ForegroundColor Red
}

Write-Host "`n📋 Summary:" -ForegroundColor Cyan
Write-Host "Backend Running: $backendRunning" -ForegroundColor $(if ($backendRunning) { "Green" } else { "Red" })
Write-Host "Frontend Running: $frontendRunning" -ForegroundColor $(if ($frontendRunning) { "Green" } else { "Red" })

Write-Host "`n🌐 Production URLs to configure in Google Cloud Console:" -ForegroundColor Yellow
Write-Host "Authorized JavaScript origins:"
Write-Host "  - https://saba-app-production.up.railway.app"
Write-Host "Authorized redirect URIs:"
Write-Host "  - https://saba-app-production.up.railway.app/auth/google/callback"

Write-Host "`n💡 Development testing:" -ForegroundColor Cyan
if ($frontendRunning) {
  Write-Host "Visit: http://localhost:3000 and test Google Sign-In (should use popup flow)"
}
else {
  Write-Host "Start frontend first: cd apps/frontend && npm run dev"
}

Write-Host "`n💡 Production testing:" -ForegroundColor Cyan
Write-Host "After updating Google Cloud Console, visit: https://saba-app-production.up.railway.app"
Write-Host "Google Sign-In should use redirect flow (no FedCM errors)"

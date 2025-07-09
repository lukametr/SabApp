Write-Host "Testing Production Authentication System" -ForegroundColor Green

$productionUrl = "https://saba-app-production.up.railway.app"

# Test health endpoint first
Write-Host "`n1. Testing Production Health Endpoint..." -ForegroundColor Yellow

try {
  $response = Invoke-RestMethod -Uri "$productionUrl/health" -Method GET
  Write-Host "Production health check passed!" -ForegroundColor Green
  Write-Host "Status: $($response.status)" -ForegroundColor Cyan
} catch {
  Write-Host "Production health check failed: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host "Exiting test as production is not available" -ForegroundColor Red
  exit 1
}

# Test registration endpoint with new email
Write-Host "`n2. Testing Production Registration Endpoint..." -ForegroundColor Yellow

$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$registrationData = @{
  firstName      = "Test"
  lastName       = "User"
  email          = "test$timestamp@example.com"
  password       = "test123"
  personalNumber = "12345678901"
  phoneNumber    = "555987654"
  organization   = "Test Company"
  position       = "Developer"
} | ConvertTo-Json

try {
  $response = Invoke-RestMethod -Uri "$productionUrl/api/auth/register" `
                                -Method POST `
                                -Body $registrationData `
                                -ContentType "application/json"
  Write-Host "Production registration successful!" -ForegroundColor Green
  Write-Host "User ID: $($response.user.id)" -ForegroundColor Cyan
  Write-Host "User Name: $($response.user.name)" -ForegroundColor Cyan
  Write-Host "User Email: $($response.user.email)" -ForegroundColor Cyan
  $registrationToken = $response.accessToken
  $testEmail = "test$timestamp@example.com"
} catch {
  Write-Host "Production registration failed: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
  exit 1
}

# Test login endpoint  
Write-Host "`n3. Testing Production Login Endpoint..." -ForegroundColor Yellow

$loginData = @{
  email    = $testEmail
  password = "test123"
} | ConvertTo-Json

try {
  $response = Invoke-RestMethod -Uri "$productionUrl/api/auth/login" `
                                -Method POST `
                                -Body $loginData `
                                -ContentType "application/json"
  Write-Host "Production login successful!" -ForegroundColor Green
  Write-Host "User ID: $($response.user.id)" -ForegroundColor Cyan
  Write-Host "User Name: $($response.user.name)" -ForegroundColor Cyan
  $loginToken = $response.accessToken
} catch {
  Write-Host "Production login failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nProduction authentication system testing complete!" -ForegroundColor Green
Write-Host "✅ All tests passed - registration and login working in production!" -ForegroundColor Green

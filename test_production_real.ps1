# რეალური პროდუქციის ტესტი - 2025-07-09
Write-Host "=== Google რეგისტრაციის ტესტი ===" -ForegroundColor Cyan

# Google OAuth test data (ფეიკ token, რეალურად უნდა იყოს ვალიდური)
$googleTestData = @{
  credential     = "fake.google.jwt.token.for.testing"
  personalNumber = "12345678901"
  phoneNumber    = "+995555123456"
  organization   = "Test Org"
  position       = "Tester"
} | ConvertTo-Json

Write-Host "Testing Google Auth endpoint..." -ForegroundColor Yellow
try {
  $response = Invoke-RestMethod -Uri "https://saba-app-production.up.railway.app/api/auth/google" -Method Post -Body $googleTestData -ContentType "application/json"
  Write-Host "Google Auth Response: $($response | ConvertTo-Json)" -ForegroundColor Green
}
catch {
  Write-Host "Google Auth Error: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
  Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host "`n=== Email რეგისტრაციის ტესტი ===" -ForegroundColor Cyan
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$emailTestData = @{
  firstName      = "Test"
  lastName       = "User$timestamp"
  email          = "test$timestamp@example.com"
  password       = "TestPass123!"
  personalNumber = "98765432109"
  phoneNumber    = "+995555987654"
  organization   = "Test Org"
  position       = "Tester"
} | ConvertTo-Json

Write-Host "Testing Email Registration..." -ForegroundColor Yellow
try {
  $response = Invoke-RestMethod -Uri "https://saba-app-production.up.railway.app/api/auth/register" -Method Post -Body $emailTestData -ContentType "application/json"
  Write-Host "Email Registration SUCCESS!" -ForegroundColor Green
  Write-Host "User: $($response.user.email)" -ForegroundColor Green
  Write-Host "Token: $($response.access_token -ne $null)" -ForegroundColor Green
}
catch {
  Write-Host "Email Registration FAILED!" -ForegroundColor Red
  Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
  Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host "`n=== Debug Info ===" -ForegroundColor Cyan
try {
  $debugInfo = Invoke-RestMethod -Uri "https://saba-app-production.up.railway.app/api/debug/env"
  Write-Host "Environment: $($debugInfo | ConvertTo-Json)" -ForegroundColor Gray
}
catch {
  Write-Host "Debug endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

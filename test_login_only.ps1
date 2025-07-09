Write-Host "Testing Login Only" -ForegroundColor Green

# Test login endpoint
Write-Host "`n1. Testing Login Endpoint..." -ForegroundColor Yellow

$loginData = @{
  email    = "test@example.com"
  password = "test123"
} | ConvertTo-Json

try {
  $response = Invoke-RestMethod -Uri "http://localhost:10000/api/auth/login" `
                                -Method POST `
                                -Body $loginData `
                                -ContentType "application/json"
  Write-Host "Login successful!" -ForegroundColor Green
  Write-Host "User ID: $($response.user.id)" -ForegroundColor Cyan
  Write-Host "User Name: $($response.user.name)" -ForegroundColor Cyan
  $loginToken = $response.accessToken
} catch {
  Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

# Test health endpoint  
Write-Host "`n2. Testing Health Endpoint..." -ForegroundColor Yellow

try {
  $response = Invoke-RestMethod -Uri "http://localhost:10000/health" -Method GET
  Write-Host "Health check passed!" -ForegroundColor Green
  Write-Host "Status: $($response.status)" -ForegroundColor Cyan
} catch {
  Write-Host "Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nLocal authentication system testing complete!" -ForegroundColor Green

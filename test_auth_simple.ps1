Write-Host "Testing Authentication System" -ForegroundColor Green

# Test registration endpoint
Write-Host "`n1. Testing Registration Endpoint..." -ForegroundColor Yellow

$registrationData = @{
  firstName      = "Giorgi"
  lastName       = "Beridze"
  email          = "test@example.com"
  password       = "test123"
  personalNumber = "01234567890"
  phoneNumber    = "555123456"
  organization   = "Test Company"
  position       = "Developer"
} | ConvertTo-Json

try {
  $response = Invoke-RestMethod -Uri "http://localhost:10000/api/auth/register" `
                                -Method POST `
                                -Body $registrationData `
                                -ContentType "application/json"
  Write-Host "Registration successful!" -ForegroundColor Green
  Write-Host "User ID: $($response.user.id)" -ForegroundColor Cyan
  Write-Host "User Name: $($response.user.name)" -ForegroundColor Cyan
  $registrationToken = $response.accessToken
} catch {
  Write-Host "Registration failed: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

# Test login endpoint
Write-Host "`n2. Testing Login Endpoint..." -ForegroundColor Yellow

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

# Test protected endpoint
Write-Host "`n3. Testing Dashboard Access..." -ForegroundColor Yellow

try {
  $headers = @{
    "Authorization" = "Bearer $loginToken"
  }
  $response = Invoke-RestMethod -Uri "http://localhost:10000/api/auth/profile" `
                                -Method GET `
                                -Headers $headers
  Write-Host "Dashboard access successful!" -ForegroundColor Green
} catch {
  Write-Host "Dashboard access test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test health endpoint  
Write-Host "`n4. Testing Health Endpoint..." -ForegroundColor Yellow

try {
  $response = Invoke-RestMethod -Uri "http://localhost:10000/health" -Method GET
  Write-Host "Health check passed!" -ForegroundColor Green
  Write-Host "Status: $($response.status)" -ForegroundColor Cyan
} catch {
  Write-Host "Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAuthentication system testing complete!" -ForegroundColor Green

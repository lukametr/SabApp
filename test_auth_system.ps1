Write-Host "🧪 Testing Authentication System" -ForegroundColor Green

# Test registration endpoint
Write-Host "`n1. Testing Registration Endpoint..." -ForegroundColor Yellow

$registrationData = @{
  firstName      = "გიორგი"
  lastName       = "ბერიძე"
  email          = "test@example.com"
  password       = "test123"
  personalNumber = "01234567890"
  phoneNumber    = "555123456"
  organization   = "ტესტ კომპანია"
  position       = "დეველოპერი"
} | ConvertTo-Json

try {
  $response = Invoke-RestMethod -Uri "http://localhost:10000/api/auth/register" -Method POST -Body $registrationData -ContentType "application/json"
  Write-Host "✅ Registration successful!" -ForegroundColor Green
  Write-Host "User ID: $($response.user.id)" -ForegroundColor Cyan
  Write-Host "User Name: $($response.user.name)" -ForegroundColor Cyan
  Write-Host "Token: $($response.accessToken.Substring(0, 20))..." -ForegroundColor Cyan
  $token = $response.accessToken
}
catch {
  Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

# Test login endpoint
Write-Host "`n2. Testing Login Endpoint..." -ForegroundColor Yellow

$loginData = @{
  email    = "test@example.com"
  password = "test123"
} | ConvertTo-Json

try {
  $loginResponse = Invoke-RestMethod -Uri "http://localhost:10000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
  Write-Host "✅ Login successful!" -ForegroundColor Green
  Write-Host "User ID: $($loginResponse.user.id)" -ForegroundColor Cyan
  Write-Host "User Name: $($loginResponse.user.name)" -ForegroundColor Cyan
  $token = $loginResponse.accessToken
}
catch {
  Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test profile endpoint (protected)
if ($token) {
  Write-Host "`n3. Testing Profile Endpoint (Protected)..." -ForegroundColor Yellow
    
  $headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
  }
    
  try {
    $profileResponse = Invoke-RestMethod -Uri "http://localhost:10000/api/auth/profile" -Method GET -Headers $headers
    Write-Host "✅ Profile retrieval successful!" -ForegroundColor Green
    Write-Host "Profile: $($profileResponse | ConvertTo-Json -Depth 2)" -ForegroundColor Cyan
  }
  catch {
    Write-Host "❌ Profile retrieval failed: $($_.Exception.Message)" -ForegroundColor Red
  }
}

Write-Host "`n🎯 Frontend Testing Instructions:" -ForegroundColor Green
Write-Host "1. Visit: http://localhost:3000/auth/register" -ForegroundColor White
Write-Host "2. Register with the test data above" -ForegroundColor White
Write-Host "3. Visit: http://localhost:3000/auth/login" -ForegroundColor White
Write-Host "4. Login with email: test@example.com, password: test123" -ForegroundColor White
Write-Host "5. Check dashboard access and logout functionality" -ForegroundColor White

Write-Host "`n✅ Authentication system testing complete!" -ForegroundColor Green

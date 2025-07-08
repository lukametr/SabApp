# Test user registration with MongoDB check
Write-Host "=== Testing User Registration Process ===" -ForegroundColor Yellow

$baseUrl = "http://localhost:10000/api"
$testEmail = "test_user_$(Get-Date -Format "yyyyMMddHHmmss")@gmail.com"
$testPersonalNumber = "12345678900"  # Update as needed
$testPhoneNumber = "+995555123456"  # Update as needed

Write-Host "1. Testing new user registration endpoint..." -ForegroundColor Green
Write-Host "Test Email: $testEmail" -ForegroundColor White

# Create test Google auth data
$authData = @{
  idToken        = "fake_id_token_for_testing"
  personalNumber = $testPersonalNumber
  phoneNumber    = $testPhoneNumber
} | ConvertTo-Json

Write-Host "Sending registration request..." -ForegroundColor White

try {
  $response = Invoke-RestMethod -Uri "$baseUrl/auth/google" -Method POST -Body $authData -ContentType "application/json" -ErrorAction Stop
  Write-Host "✅ Registration successful!" -ForegroundColor Green
  Write-Host "User ID: $($response.user.id)" -ForegroundColor White
  Write-Host "User Email: $($response.user.email)" -ForegroundColor White
  Write-Host "User Name: $($response.user.name)" -ForegroundColor White
  Write-Host "Personal Number: $($response.user.personalNumber)" -ForegroundColor White
  Write-Host "Phone Number: $($response.user.phoneNumber)" -ForegroundColor White
}
catch {
  Write-Host "❌ Registration failed!" -ForegroundColor Red
  Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
  if ($_.Exception.Response) {
    $errorContent = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errorContent)
    $errorBody = $reader.ReadToEnd()
    Write-Host "Error Details: $errorBody" -ForegroundColor Red
  }
}

Write-Host "`n2. Checking existing users..." -ForegroundColor Green

# Check if we can get admin users list (this requires admin token)
try {
  $healthResponse = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET -ErrorAction Stop
  Write-Host "✅ Backend is running" -ForegroundColor Green
}
catch {
  Write-Host "❌ Backend health check failed" -ForegroundColor Red
}

Write-Host "`n3. Checking MongoDB connection..." -ForegroundColor Green

# Check app debug endpoint for MongoDB info
try {
  $debugResponse = Invoke-RestMethod -Uri "$baseUrl/api/debug" -Method GET -ErrorAction Stop
  Write-Host "Debug info:" -ForegroundColor White
  Write-Host ($debugResponse | ConvertTo-Json -Depth 3) -ForegroundColor White
}
catch {
  Write-Host "❌ Debug endpoint failed" -ForegroundColor Red
  Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Yellow

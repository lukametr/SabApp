# Test Google OAuth Registration Debug
Write-Host "=== Google OAuth Registration Debug Test ===" -ForegroundColor Yellow

$baseUrl = "http://localhost:10000/api"

Write-Host "`n1. Testing if Google auth endpoint is working..." -ForegroundColor Green

# Create test data that will trigger validation
$testData = @{
  idToken        = "invalid_test_token"
  personalNumber = "12345678901" 
  phoneNumber    = "+995555123456"
} | ConvertTo-Json

Write-Host "Sending Google auth request with invalid token to trigger validation..." -ForegroundColor White

try {
  $response = Invoke-RestMethod -Uri "$baseUrl/auth/google" -Method POST -Body $testData -ContentType "application/json" -ErrorAction Stop
  Write-Host "❌ Unexpected success: $($response)" -ForegroundColor Red
}
catch {
  $statusCode = $_.Exception.Response.StatusCode.value__
  Write-Host "Expected validation error: HTTP $statusCode" -ForegroundColor Yellow
    
  if ($_.Exception.Response) {
    try {
      $errorContent = $_.Exception.Response.GetResponseStream()
      $reader = New-Object System.IO.StreamReader($errorContent)
      $errorBody = $reader.ReadToEnd()
      $reader.Close()
      Write-Host "Error Response: $errorBody" -ForegroundColor White
    }
    catch {
      Write-Host "Could not read error response" -ForegroundColor Red
    }
  }
}

Write-Host "`n2. Testing Google auth endpoint without token..." -ForegroundColor Green

$emptyData = @{} | ConvertTo-Json

try {
  $response = Invoke-RestMethod -Uri "$baseUrl/auth/google" -Method POST -Body $emptyData -ContentType "application/json" -ErrorAction Stop
  Write-Host "❌ Unexpected success: $($response)" -ForegroundColor Red
}
catch {
  $statusCode = $_.Exception.Response.StatusCode.value__
  Write-Host "Expected validation error: HTTP $statusCode" -ForegroundColor Yellow
}

Write-Host "`n3. Testing auth/profile endpoint (should require token)..." -ForegroundColor Green

try {
  $response = Invoke-RestMethod -Uri "$baseUrl/auth/profile" -Method GET -ErrorAction Stop
  Write-Host "❌ Profile endpoint should require authentication" -ForegroundColor Red
}
catch {
  $statusCode = $_.Exception.Response.StatusCode.value__
  if ($statusCode -eq 401) {
    Write-Host "✅ Profile endpoint correctly requires authentication" -ForegroundColor Green
  }
  else {
    Write-Host "❌ Unexpected status code: $statusCode" -ForegroundColor Red
  }
}

Write-Host "`n=== Analysis ===" -ForegroundColor Yellow
Write-Host "The backend appears to be running correctly." -ForegroundColor White
Write-Host "The issue with user registration is likely one of these:" -ForegroundColor White
Write-Host "1. Google OAuth token validation failing" -ForegroundColor White
Write-Host "2. MongoDB connection issues during user creation" -ForegroundColor White
Write-Host "3. Frontend not properly sending Google tokens" -ForegroundColor White
Write-Host "4. Google Client Secret not configured correctly" -ForegroundColor White
Write-Host "`nTo debug further:" -ForegroundColor Yellow
Write-Host "- Check backend terminal logs during registration attempts" -ForegroundColor White
Write-Host "- Test with real Google OAuth token from frontend" -ForegroundColor White
Write-Host "- Verify Google Client Secret in backend .env file" -ForegroundColor White

Write-Host "`n=== Test Complete ===" -ForegroundColor Yellow

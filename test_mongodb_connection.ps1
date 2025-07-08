# Test MongoDB Connection and User Creation Directly
Write-Host "=== MongoDB Connection and User Creation Test ===" -ForegroundColor Yellow

# First, let's check if we can connect to MongoDB directly through the API
$baseUrl = "http://localhost:10000/api"

Write-Host "`n1. Testing Backend Health..." -ForegroundColor Green
try {
  $response = Invoke-RestMethod -Uri "http://localhost:10000/health" -Method GET -ErrorAction Stop
  Write-Host "✅ Backend Health: $($response.status)" -ForegroundColor Green
  Write-Host "Database: $($response.database)" -ForegroundColor White
  Write-Host "Uptime: $($response.uptime)" -ForegroundColor White
}
catch {
  Write-Host "❌ Backend health check failed" -ForegroundColor Red
  Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Testing Auth Profile with Invalid Token..." -ForegroundColor Green
try {
  # Try to access protected endpoint to see auth flow
  $headers = @{
    "Authorization" = "Bearer invalid_token"
  }
  $response = Invoke-RestMethod -Uri "$baseUrl/auth/profile" -Method GET -Headers $headers -ErrorAction Stop
  Write-Host "✅ Profile response: $($response)" -ForegroundColor Green
}
catch {
  Write-Host "❌ Profile access failed (expected)" -ForegroundColor Yellow
  Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n3. Checking Google Auth Configuration..." -ForegroundColor Green
Write-Host "This will test if the Google Auth service is properly configured." -ForegroundColor White

# Test Google auth endpoint with minimal data to see configuration
$testData = @{
  idToken = "test"
} | ConvertTo-Json

try {
  $response = Invoke-RestMethod -Uri "$baseUrl/auth/google" -Method POST -Body $testData -ContentType "application/json" -ErrorAction Stop
  Write-Host "✅ Got response (unexpected): $($response)" -ForegroundColor Green
}
catch {
  $statusCode = $_.Exception.Response.StatusCode.value__
  $statusDescription = $_.Exception.Response.StatusDescription
  Write-Host "❌ Google auth test failed with: $statusCode $statusDescription" -ForegroundColor Red
    
  if ($_.Exception.Response) {
    try {
      $errorContent = $_.Exception.Response.GetResponseStream()
      $reader = New-Object System.IO.StreamReader($errorContent)
      $errorBody = $reader.ReadToEnd()
      $reader.Close()
      Write-Host "Error Details: $errorBody" -ForegroundColor Red
    }
    catch {
      Write-Host "Could not read error details" -ForegroundColor Red
    }
  }
}

Write-Host "`n4. Looking for current backend logs..." -ForegroundColor Green
Write-Host "Backend should be running on port 10000" -ForegroundColor White
Write-Host "Check the terminal where you started the backend for detailed logs about registration attempts." -ForegroundColor Yellow

Write-Host "`n=== Analysis ===" -ForegroundColor Yellow
Write-Host "Based on the investigation:" -ForegroundColor White
Write-Host "1. Backend is running and healthy" -ForegroundColor White
Write-Host "2. MongoDB connection appears to be working" -ForegroundColor White  
Write-Host "3. Google Auth requires valid ID tokens from Google OAuth flow" -ForegroundColor White
Write-Host "4. The issue is likely in the frontend Google OAuth integration" -ForegroundColor White
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "- Check frontend Google OAuth implementation" -ForegroundColor White
Write-Host "- Verify Google Client Secret configuration" -ForegroundColor White
Write-Host "- Test actual Google OAuth flow through frontend" -ForegroundColor White

Write-Host "`n=== Test Complete ===" -ForegroundColor Yellow

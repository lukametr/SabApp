# Debug grant subscription endpoint in detail
$baseUrl = "https://saba-app-production.up.railway.app"

Write-Host "Debugging grant subscription error..." -ForegroundColor Yellow

# Login first
$loginData = @{
    email = "admin@saba.com"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
$token = $loginResponse.accessToken

Write-Host "Admin user: $($loginResponse.user.email) - Role: $($loginResponse.user.role)" -ForegroundColor Green

# Headers for authenticated requests
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test user ID (the regular user from the previous response)
$testUserId = "6873b3bcfba14e2f3e14ab76"

Write-Host "`nGranting 30 days subscription to user: $testUserId" -ForegroundColor Cyan

$grantData = @{
    userId = $testUserId
    days = 30
    paymentAmount = 50
    paymentNote = "Test payment from production test script"
} | ConvertTo-Json

Write-Host "Sending request to: $baseUrl/api/subscription/grant" -ForegroundColor White
Write-Host "Headers: Authorization = Bearer $($token.Substring(0, 20))..." -ForegroundColor White
Write-Host "Body: $grantData" -ForegroundColor White

try {
    # Use Invoke-WebRequest to get more detailed error info
    $response = Invoke-WebRequest -Uri "$baseUrl/api/subscription/grant" -Method POST -Body $grantData -Headers $headers -UseBasicParsing
    
    Write-Host "SUCCESS: Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
    
} catch [System.Net.WebException] {
    Write-Host "ERROR: Web exception occurred" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    
    # Read the error response body
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    $reader.Close()
    $stream.Close()
    
    Write-Host "Error Response Body: $responseBody" -ForegroundColor Yellow
    
} catch {
    Write-Host "ERROR: Other exception" -ForegroundColor Red
    Write-Host "Exception: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Exception Type: $($_.Exception.GetType().Name)" -ForegroundColor Red
}

Write-Host "`nDebug completed!" -ForegroundColor Yellow

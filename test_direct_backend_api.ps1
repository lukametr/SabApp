# Test calling backend API directly (no frontend proxy)
$baseUrl = "https://saba-app-production.up.railway.app"

Write-Host "Testing direct backend API calls..." -ForegroundColor Yellow

# Login first
$loginData = @{
    email = "admin@saba.com"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
$token = $loginResponse.accessToken

# Headers for authenticated requests
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "`n1. Testing direct users endpoint..." -ForegroundColor Cyan
try {
    $usersResponse = Invoke-RestMethod -Uri "$baseUrl/api/subscription/users" -Method GET -Headers $headers
    Write-Host "SUCCESS: Direct backend API call works" -ForegroundColor Green
    Write-Host "Users count: $($usersResponse.data.Count)" -ForegroundColor White
} catch {
    Write-Host "FAILED: Direct backend API call failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Testing grant subscription..." -ForegroundColor Cyan
$testUserId = "6873b3bcfba14e2f3e14ab76"
$grantData = @{
    userId = $testUserId
    days = 7
    paymentAmount = 25
    paymentNote = "Direct API test"
} | ConvertTo-Json

try {
    $grantResponse = Invoke-RestMethod -Uri "$baseUrl/api/subscription/grant" -Method POST -Body $grantData -Headers $headers
    Write-Host "SUCCESS: Grant subscription works!" -ForegroundColor Green
    Write-Host "Response: $($grantResponse.message)" -ForegroundColor White
} catch {
    Write-Host "FAILED: Grant subscription failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Get detailed error
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error details: $responseBody" -ForegroundColor Yellow
        $reader.Close()
        $stream.Close()
    }
}

Write-Host "`nTest completed!" -ForegroundColor Yellow

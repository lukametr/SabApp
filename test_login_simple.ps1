# Test admin login specifically with proper API route
$baseUrl = "https://saba-app-production.up.railway.app"

Write-Host "Testing admin login to production..." -ForegroundColor Yellow

$loginData = @{
    email = "admin@saba.com"
    password = "admin123"
} | ConvertTo-Json

Write-Host "Sending login request to: $baseUrl/api/auth/login" -ForegroundColor Cyan
Write-Host "Login data: $loginData" -ForegroundColor White

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    
    if ($loginResponse.access_token) {
        Write-Host "SUCCESS: Admin login successful" -ForegroundColor Green
        Write-Host "Token: $($loginResponse.access_token.Substring(0, 50))..." -ForegroundColor White
        Write-Host "User: $($loginResponse.user.email) - Role: $($loginResponse.user.role)" -ForegroundColor White
    } else {
        Write-Host "FAILED: Login successful but no access token received" -ForegroundColor Red
        Write-Host "Response: $($loginResponse | ConvertTo-Json)" -ForegroundColor White
    }
    
} catch {
    Write-Host "ERROR: Admin login failed" -ForegroundColor Red
    Write-Host "Exception: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host "`nTest completed!" -ForegroundColor Yellow

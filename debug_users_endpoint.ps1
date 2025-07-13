# Debug subscription users endpoint in production
$baseUrl = "https://saba-app-production.up.railway.app"

Write-Host "Debugging subscription users endpoint..." -ForegroundColor Yellow

# Login first
$loginData = @{
    email = "admin@saba.com"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
$token = $loginResponse.accessToken

Write-Host "Token: $($token.Substring(0, 50))..." -ForegroundColor Green

# Headers for authenticated requests
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test the subscription users endpoint
Write-Host "`nTesting: $baseUrl/api/subscription/users" -ForegroundColor Cyan

try {
    $usersResponse = Invoke-RestMethod -Uri "$baseUrl/api/subscription/users" -Method GET -Headers $headers
    
    Write-Host "SUCCESS: Users endpoint responded" -ForegroundColor Green
    Write-Host "Response type: $($usersResponse.GetType())" -ForegroundColor White
    Write-Host "Response: $($usersResponse | ConvertTo-Json -Depth 3)" -ForegroundColor White
    
    if ($usersResponse.data) {
        Write-Host "Data count: $($usersResponse.data.Count)" -ForegroundColor Yellow
        
        if ($usersResponse.data.Count -gt 0) {
            Write-Host "First user: $($usersResponse.data[0] | ConvertTo-Json -Depth 2)" -ForegroundColor White
        }
    } else {
        Write-Host "No data property found in response" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "ERROR: Failed to get users" -ForegroundColor Red
    Write-Host "Exception: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host "`nDebug completed!" -ForegroundColor Yellow

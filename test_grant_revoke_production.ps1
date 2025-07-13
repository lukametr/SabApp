# Test grant subscription functionality in production
$baseUrl = "https://saba-app-production.up.railway.app"

Write-Host "Testing grant subscription in production..." -ForegroundColor Yellow

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

# Test user ID (the regular user from the previous response)
$testUserId = "6873b3bcfba14e2f3e14ab76"

Write-Host "`nGranting 30 days subscription to user: $testUserId" -ForegroundColor Cyan

$grantData = @{
    userId = $testUserId
    days = 30
    paymentAmount = 50
    paymentNote = "Test payment from production test script"
} | ConvertTo-Json

Write-Host "Grant data: $grantData" -ForegroundColor White

try {
    $grantResponse = Invoke-RestMethod -Uri "$baseUrl/api/subscription/grant" -Method POST -Body $grantData -Headers $headers
    
    Write-Host "SUCCESS: Subscription granted!" -ForegroundColor Green
    Write-Host "Response: $($grantResponse | ConvertTo-Json -Depth 2)" -ForegroundColor White
    
    # Now test revoke
    Write-Host "`nTesting revoke subscription..." -ForegroundColor Cyan
    
    $revokeData = @{
        userId = $testUserId
        reason = "Test revocation from production test script"
    } | ConvertTo-Json
    
    try {
        $revokeResponse = Invoke-RestMethod -Uri "$baseUrl/api/subscription/revoke" -Method PUT -Body $revokeData -Headers $headers
        
        Write-Host "SUCCESS: Subscription revoked!" -ForegroundColor Green
        Write-Host "Response: $($revokeResponse | ConvertTo-Json -Depth 2)" -ForegroundColor White
        
    } catch {
        Write-Host "ERROR: Failed to revoke subscription" -ForegroundColor Red
        Write-Host "Exception: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response body: $responseBody" -ForegroundColor Yellow
        }
    }
    
} catch {
    Write-Host "ERROR: Failed to grant subscription" -ForegroundColor Red
    Write-Host "Exception: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host "`nTest completed!" -ForegroundColor Yellow

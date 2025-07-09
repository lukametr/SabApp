# Final Production Test
$baseUrl = "https://saba-app-production.up.railway.app"
$timestamp = Get-Date -Format "yyyyMMddHHmmssffff"
$testEmail = "finaltest$timestamp@uniquedomain.com"

Write-Host "FINAL PRODUCTION TEST" -ForegroundColor Cyan
Write-Host "URL: $baseUrl/api/auth/register"
Write-Host "Email: $testEmail"

$registerData = @{
    firstName = "Final"
    lastName = "Test$timestamp"
    email = $testEmail
    password = "FinalTestPass123!"
    personalNumber = "99999$($timestamp.Substring(0,10))"
    phoneNumber = "+995999$($timestamp.Substring(0,6))"
    organization = "Final Test Org"
    position = "Final Tester"
} | ConvertTo-Json

Write-Host "Sending registration request..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    
    Write-Host "REGISTRATION SUCCESSFUL!" -ForegroundColor Green
    Write-Host "User ID: $($response.user.id)" -ForegroundColor Green
    Write-Host "Email: $($response.user.email)" -ForegroundColor Green
    Write-Host "Token received: $($response.access_token -ne $null)" -ForegroundColor Green
    
    Write-Host "MONGODB FIX CONFIRMED WORKING!" -ForegroundColor Green
    
} catch {
    Write-Host "REGISTRATION FAILED" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

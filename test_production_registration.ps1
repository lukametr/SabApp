# Production Registration Test
$baseUrl = "https://saba-app-production.up.railway.app"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testEmail = "test$timestamp@example.com"

Write-Host "Testing registration on PRODUCTION: $baseUrl/api/auth/register"
Write-Host "Test email: $testEmail"

$registerData = @{
    firstName = "Test"
    lastName = "User $timestamp"
    email = $testEmail
    password = "TestPassword123!"
    personalNumber = "12345678901"
    phoneNumber = "+995555123456"
    organization = "Test Org"
    position = "Tester"
} | ConvertTo-Json

Write-Host "Sending production registration request..."

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    Write-Host "SUCCESS! Registration fixed in production!" -ForegroundColor Green
    Write-Host "User ID: $($response.user.id)" -ForegroundColor Green
    Write-Host "Token: $($response.access_token -ne $null)" -ForegroundColor Green
} catch {
    Write-Host "FAILED!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

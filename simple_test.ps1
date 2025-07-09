# Simple Registration Test
$baseUrl = "http://localhost:3001"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testEmail = "test$timestamp@example.com"

Write-Host "Testing registration at: $baseUrl/api/auth/register"
Write-Host "Test email: $testEmail"

$registerData = @{
    name = "Test User $timestamp"
    email = $testEmail
    password = "TestPassword123!"
    personalNumber = "12345678901"
    phoneNumber = "+995555123456"
    organization = "Test Org"
    position = "Tester"
} | ConvertTo-Json

Write-Host "Sending request..."

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "FAILED!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

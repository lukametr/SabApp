# Test Registration Fix Script
# Tests only email registration to verify the MongoDB googleId fix

$ErrorActionPreference = "Stop"

Write-Host "🧪 Testing Registration Fix..." -ForegroundColor Cyan
Write-Host "===============================`n" -ForegroundColor Cyan

# Test configuration
$baseUrl = "http://localhost:3001"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testEmail = "test$timestamp@example.com"

Write-Host "📧 Test Email: $testEmail" -ForegroundColor Yellow
Write-Host "🌐 Backend URL: $baseUrl`n" -ForegroundColor Yellow

# Test 1: Register new user
Write-Host "📝 Test 1: Registration" -ForegroundColor Green
Write-Host "------------------------" -ForegroundColor Green

$registerData = @{
    name = "Test User $timestamp"
    email = $testEmail
    password = "TestPassword123!"
    personalNumber = "12345678901"
    phoneNumber = "+995555123456"
    organization = "Test Org"
    position = "Tester"
} | ConvertTo-Json

try {
    Write-Host "Sending registration request..." -ForegroundColor Gray
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "User ID: $($registerResponse.user.id)" -ForegroundColor Gray
    Write-Host "Token received: $(if($registerResponse.access_token) { 'Yes' } else { 'No' })" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Registration failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        try {
            $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "Details: $($errorDetails.message)" -ForegroundColor Red
        } catch {
            Write-Host "Raw error: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "`n❌ TEST FAILED - Registration still broken" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ ALL TESTS PASSED!" -ForegroundColor Green
Write-Host "Registration fix is working correctly." -ForegroundColor Green

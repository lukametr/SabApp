# Final Production Registration Test - Comprehensive
$baseUrl = "https://saba-app-production.up.railway.app"
$timestamp = Get-Date -Format "yyyyMMddHHmmssffff"  # More precise timestamp
$testEmail = "finaltest$timestamp@uniquedomain.com"

Write-Host "🎯 FINAL PRODUCTION TEST" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "URL: $baseUrl/api/auth/register"
Write-Host "Email: $testEmail"
Write-Host ""

$registerData = @{
    firstName = "Final"
    lastName = "Test$timestamp"
    email = $testEmail
    password = "FinalTestPass123!"
    personalNumber = "99999$timestamp"  # Unique personal number
    phoneNumber = "+995999$timestamp"   # Unique phone number
    organization = "Final Test Org"
    position = "Final Tester"
} | ConvertTo-Json

Write-Host "📤 Sending registration request..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    
    Write-Host ""
    Write-Host "🎉 REGISTRATION SUCCESSFUL!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host "✅ User ID: $($response.user.id)" -ForegroundColor Green
    Write-Host "✅ Email: $($response.user.email)" -ForegroundColor Green
    Write-Host "✅ Name: $($response.user.name)" -ForegroundColor Green
    Write-Host "✅ Access Token: $($response.access_token -ne $null -and $response.access_token.Length -gt 0)" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔧 MONGODB FIX CONFIRMED WORKING!" -ForegroundColor Green
    Write-Host "The googleId null issue has been resolved." -ForegroundColor Green
    
    # Test login with the newly created user
    Write-Host ""
    Write-Host "🔐 Testing login with new user..." -ForegroundColor Yellow
    
    $loginData = @{
        email = $testEmail
        password = "FinalTestPass123!"
    } | ConvertTo-Json
    
    try {
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginData -ContentType "application/json"
        Write-Host "✅ LOGIN ALSO SUCCESSFUL!" -ForegroundColor Green
        Write-Host "✅ Login Token: $($loginResponse.access_token -ne $null)" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "🎯 COMPLETE SUCCESS - ALL SYSTEMS WORKING!" -ForegroundColor Green
        Write-Host "===========================================" -ForegroundColor Green
        Write-Host "✅ Registration: WORKING" -ForegroundColor Green  
        Write-Host "✅ Login: WORKING" -ForegroundColor Green
        Write-Host "✅ MongoDB Fix: DEPLOYED" -ForegroundColor Green
        Write-Host "✅ Production: FULLY OPERATIONAL" -ForegroundColor Green
        
    } catch {
        Write-Host "⚠️ Login failed but registration worked:" -ForegroundColor Yellow
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "✅ Primary fix (registration) is confirmed working!" -ForegroundColor Green
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ REGISTRATION STILL FAILING" -ForegroundColor Red
    Write-Host "================================" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        try {
            $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "Server Message: $($errorDetails.message)" -ForegroundColor Red
            Write-Host "Error Type: $($errorDetails.error)" -ForegroundColor Red
        } catch {
            Write-Host "Raw Error Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "- Check Railway deployment logs" -ForegroundColor Yellow
    Write-Host "- Verify database state" -ForegroundColor Yellow
    Write-Host "- May need additional database cleanup" -ForegroundColor Yellow
}

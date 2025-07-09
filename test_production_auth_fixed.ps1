# 🔧 Production Authentication System Test Script (Fixed)

Write-Host "🔧 Testing Fixed Authentication System in Production..." -ForegroundColor Blue
Write-Host "🌐 Production URL: https://saba-app-production.up.railway.app" -ForegroundColor Green
Write-Host ""

# Test 1: Health Check
Write-Host "1️⃣ Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "https://saba-app-production.up.railway.app/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Health Check: OK" -ForegroundColor Green
    Write-Host "   Response: $($healthResponse | ConvertTo-Json -Depth 2)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Debug Environment
Write-Host "2️⃣ Testing Debug Environment..." -ForegroundColor Yellow
try {
    $envResponse = Invoke-RestMethod -Uri "https://saba-app-production.up.railway.app/api/debug/env" -Method GET -TimeoutSec 10
    Write-Host "✅ Environment Check: OK" -ForegroundColor Green
    Write-Host "   NODE_ENV: $($envResponse.nodeEnv)" -ForegroundColor Gray
    Write-Host "   Has MongoDB URI: $($envResponse.hasMongoUri)" -ForegroundColor Gray
    Write-Host "   Has JWT Secret: $($envResponse.hasJwtSecret)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Environment Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Database Connection
Write-Host "3️⃣ Testing Database Connection..." -ForegroundColor Yellow
try {
    $dbResponse = Invoke-RestMethod -Uri "https://saba-app-production.up.railway.app/api/debug/db-connection" -Method GET -TimeoutSec 15
    Write-Host "✅ Database Connection: $($dbResponse.status.ToUpper())" -ForegroundColor Green
    Write-Host "   Message: $($dbResponse.message)" -ForegroundColor Gray
    Write-Host "   User Count: $($dbResponse.userCount)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Database Connection Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Registration
Write-Host "4️⃣ Testing Registration (with Fixed URLs and Debug Logging)..." -ForegroundColor Yellow
$testUser = @{
    firstName = "ტესტი"
    lastName = "მომხმარებელი"
    email = "test@example.com"
    password = "test123"
    personalNumber = "01234567890"
    phoneNumber = "555123456"
    organization = "ტესტ ორგანიზაცია"
    position = "ტესტ თანამდებობა"
}
$testUserJson = $testUser | ConvertTo-Json -Depth 2

try {
    $registerResponse = Invoke-RestMethod -Uri "https://saba-app-production.up.railway.app/api/auth/register" -Method POST -Body $testUserJson -ContentType "application/json" -TimeoutSec 20
    Write-Host "✅ Registration: SUCCESS" -ForegroundColor Green
    Write-Host "   User Email: $($registerResponse.user.email)" -ForegroundColor Gray
    Write-Host "   Token Length: $($registerResponse.accessToken.Length)" -ForegroundColor Gray
    
    # Store token for further tests
    $global:testToken = $registerResponse.accessToken
    
} catch {
    Write-Host "❌ Registration Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "   Status Code: $statusCode" -ForegroundColor Red
        
        try {
            $errorDetails = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorDetails)
            $errorContent = $reader.ReadToEnd()
            Write-Host "   Error Details: $errorContent" -ForegroundColor Red
        } catch {
            Write-Host "   Could not read error details" -ForegroundColor Red
        }
    }
}
Write-Host ""

# Test 5: Login (if registration failed, try with existing user)
Write-Host "5️⃣ Testing Login..." -ForegroundColor Yellow
$loginData = @{
    email = "test@example.com"
    password = "test123"
}
$loginDataJson = $loginData | ConvertTo-Json -Depth 2

try {
    $loginResponse = Invoke-RestMethod -Uri "https://saba-app-production.up.railway.app/api/auth/login" -Method POST -Body $loginDataJson -ContentType "application/json" -TimeoutSec 15
    Write-Host "✅ Login: SUCCESS" -ForegroundColor Green
    Write-Host "   User Email: $($loginResponse.user.email)" -ForegroundColor Gray
    Write-Host "   Token Length: $($loginResponse.accessToken.Length)" -ForegroundColor Gray
    
    # Store token for further tests
    $global:testToken = $loginResponse.accessToken
    
} catch {
    Write-Host "❌ Login Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "   Status Code: $statusCode" -ForegroundColor Red
    }
}
Write-Host ""

# Test 6: Profile Access (if we have a token)
if ($global:testToken) {
    Write-Host "6️⃣ Testing Profile Access..." -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $($global:testToken)"
            "Content-Type" = "application/json"
        }
        $profileResponse = Invoke-RestMethod -Uri "https://saba-app-production.up.railway.app/api/auth/profile" -Method GET -Headers $headers -TimeoutSec 10
        Write-Host "✅ Profile Access: SUCCESS" -ForegroundColor Green
        Write-Host "   User Name: $($profileResponse.name)" -ForegroundColor Gray
        Write-Host "   User Role: $($profileResponse.role)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Profile Access Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "6️⃣ Skipping Profile Access (no token available)" -ForegroundColor Yellow
}
Write-Host ""

# Test 7: Frontend Access
Write-Host "7️⃣ Testing Frontend Access..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "https://saba-app-production.up.railway.app" -Method GET -TimeoutSec 15
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend: Accessible" -ForegroundColor Green
        Write-Host "   Status Code: $($frontendResponse.StatusCode)" -ForegroundColor Gray
        Write-Host "   Content Length: $($frontendResponse.Content.Length) characters" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Frontend Access Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "🎯 TESTING COMPLETE" -ForegroundColor Blue
Write-Host "====================" -ForegroundColor Blue
Write-Host ""
Write-Host "🔧 Key Fixes Applied:" -ForegroundColor Green
Write-Host "   ✅ URL consistency fixed across all configurations" -ForegroundColor Gray
Write-Host "   ✅ Google OAuth initialization restored for production" -ForegroundColor Gray
Write-Host "   ✅ MongoDB connection enhanced with diagnostics" -ForegroundColor Gray
Write-Host "   ✅ Comprehensive debug logging added" -ForegroundColor Gray
Write-Host "   ✅ API methods added for Google OAuth" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Monitor Railway deployment logs for detailed error information" -ForegroundColor Gray
Write-Host "   2. Test Google OAuth registration and login in production" -ForegroundColor Gray
Write-Host "   3. Verify all authentication flows work end-to-end" -ForegroundColor Gray
Write-Host ""
Write-Host "📱 Manual Testing:" -ForegroundColor Cyan
Write-Host "   1. Visit: https://saba-app-production.up.railway.app/auth/register" -ForegroundColor Gray
Write-Host "   2. Try email registration with debug logging enabled" -ForegroundColor Gray
Write-Host "   3. Try Google OAuth registration and login" -ForegroundColor Gray
Write-Host "   4. Verify dashboard access after authentication" -ForegroundColor Gray

# 🔧 Simple Production Authentication Test

Write-Host "🔧 Testing Production Authentication System..." -ForegroundColor Blue
Write-Host "🌐 Production URL: https://saba-app-production.up.railway.app" -ForegroundColor Green
Write-Host ""

# Test 1: Health Check
Write-Host "1️⃣ Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "https://saba-app-production.up.railway.app/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Health: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Health: Failed - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Debug Environment
Write-Host "2️⃣ Environment Check..." -ForegroundColor Yellow
try {
    $env = Invoke-RestMethod -Uri "https://saba-app-production.up.railway.app/api/debug/env" -Method GET -TimeoutSec 10
    Write-Host "✅ Environment: OK" -ForegroundColor Green
    Write-Host "   NODE_ENV: $($env.nodeEnv)" -ForegroundColor Gray
    Write-Host "   MongoDB: $($env.hasMongoUri)" -ForegroundColor Gray
    Write-Host "   JWT: $($env.hasJwtSecret)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Environment: Failed - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Database Connection
Write-Host "3️⃣ Database Check..." -ForegroundColor Yellow
try {
    $db = Invoke-RestMethod -Uri "https://saba-app-production.up.railway.app/api/debug/db-connection" -Method GET -TimeoutSec 15
    Write-Host "✅ Database: $($db.status)" -ForegroundColor Green
    Write-Host "   Users: $($db.userCount)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Database: Failed - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Registration
Write-Host "4️⃣ Registration Test..." -ForegroundColor Yellow
$regBody = '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"test123","personalNumber":"01234567890","phoneNumber":"555123456"}'
try {
    $reg = Invoke-RestMethod -Uri "https://saba-app-production.up.railway.app/api/auth/register" -Method POST -Body $regBody -ContentType "application/json" -TimeoutSec 20
    Write-Host "✅ Registration: SUCCESS" -ForegroundColor Green
    Write-Host "   Email: $($reg.user.email)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Registration: Failed - $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

# Test 5: Login
Write-Host "5️⃣ Login Test..." -ForegroundColor Yellow
$loginBody = '{"email":"test@example.com","password":"test123"}'
try {
    $login = Invoke-RestMethod -Uri "https://saba-app-production.up.railway.app/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -TimeoutSec 15
    Write-Host "✅ Login: SUCCESS" -ForegroundColor Green
    Write-Host "   Email: $($login.user.email)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Login: Failed - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 TESTING COMPLETE" -ForegroundColor Blue
Write-Host "Manual testing: https://saba-app-production.up.railway.app/auth/register" -ForegroundColor Cyan

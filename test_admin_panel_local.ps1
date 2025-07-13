# Test admin panel functionality locally
$baseUrl = "http://localhost:3001"

Write-Host "🧪 Testing Admin Panel Locally" -ForegroundColor Yellow
Write-Host "===============================" -ForegroundColor Yellow

# First, start the backend if it's not running
Write-Host "`n🚀 Starting backend server..." -ForegroundColor Cyan
Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd 'c:\Users\lukacode\Desktop\saba_latest\apps\backend'; npm run start:dev" -WindowStyle Minimized

# Wait for backend to start
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep 10

# Test 1: Login as admin
Write-Host "`n1️⃣ Testing admin login..." -ForegroundColor Cyan
$loginData = @{
    email = "admin@saba.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/signin" -Method POST -Body $loginData -ContentType "application/json"
    
    if ($loginResponse.access_token) {
        Write-Host "✅ Admin login successful" -ForegroundColor Green
        $token = $loginResponse.access_token
        
        # Headers for authenticated requests
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        # Test 2: Get all users
        Write-Host "`n2️⃣ Testing get all users..." -ForegroundColor Cyan
        try {
            $usersResponse = Invoke-RestMethod -Uri "$baseUrl/api/subscription/users" -Method GET -Headers $headers
            Write-Host "✅ Successfully fetched $($usersResponse.Count) users" -ForegroundColor Green
            
            # Show first few users with their IDs
            $usersResponse | Select-Object -First 3 | ForEach-Object {
                Write-Host "   User: $($_.email) | ID: $($_.id) | _ID: $($_._id) | Status: $($_.subscription.status)" -ForegroundColor White
            }
            
            # Test 3: Grant subscription to a user
            if ($usersResponse.Count -gt 0) {
                $testUser = $usersResponse | Where-Object { $_.email -ne "admin@saba.com" } | Select-Object -First 1
                
                if ($testUser) {
                    Write-Host "`n3️⃣ Testing grant subscription to user: $($testUser.email)" -ForegroundColor Cyan
                    
                    $grantData = @{
                        userId = $testUser.id
                        days = 30
                        paymentAmount = 50
                        paymentNote = "Test payment from local test script"
                    } | ConvertTo-Json
                    
                    try {
                        $grantResponse = Invoke-RestMethod -Uri "$baseUrl/api/subscription/grant" -Method POST -Body $grantData -Headers $headers
                        Write-Host "✅ Successfully granted 30 days subscription to $($testUser.email)" -ForegroundColor Green
                        Write-Host "   New status: $($grantResponse.subscriptionStatus)" -ForegroundColor White
                        Write-Host "   End date: $($grantResponse.subscriptionEndDate)" -ForegroundColor White
                        
                        # Test 4: Revoke subscription
                        Write-Host "`n4️⃣ Testing revoke subscription..." -ForegroundColor Cyan
                        
                        $revokeData = @{
                            userId = $testUser.id
                            reason = "Test revocation from local test script"
                        } | ConvertTo-Json
                        
                        try {
                            $revokeResponse = Invoke-RestMethod -Uri "$baseUrl/api/subscription/revoke" -Method POST -Body $revokeData -Headers $headers
                            Write-Host "✅ Successfully revoked subscription for $($testUser.email)" -ForegroundColor Green
                            Write-Host "   New status: $($revokeResponse.subscriptionStatus)" -ForegroundColor White
                            Write-Host "   User status: $($revokeResponse.status)" -ForegroundColor White
                            
                        } catch {
                            Write-Host "❌ Failed to revoke subscription: $($_.Exception.Message)" -ForegroundColor Red
                        }
                        
                    } catch {
                        Write-Host "❌ Failed to grant subscription: $($_.Exception.Message)" -ForegroundColor Red
                        Write-Host "   Response: $($_.Exception.Response)" -ForegroundColor Red
                    }
                } else {
                    Write-Host "⚠️ No non-admin users found to test subscription grant" -ForegroundColor Yellow
                }
            } else {
                Write-Host "⚠️ No users found in the system" -ForegroundColor Yellow
            }
            
        } catch {
            Write-Host "❌ Failed to fetch users: $($_.Exception.Message)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "❌ Login failed - no access token received" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Admin login failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🏁 Local admin panel test completed!" -ForegroundColor Yellow

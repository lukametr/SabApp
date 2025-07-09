$uri = "https://saba-app-production.up.railway.app/api/auth/register"
$body = @{
    firstName = "TestUser"
    lastName = "Demo"
    email = "testuser@example.com"
    password = "test123"
    personalNumber = "01234567892"
    phoneNumber = "555123458"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

try {
    Write-Host "Testing registration..."
    $response = Invoke-RestMethod -Uri $uri -Method POST -Body $body -Headers $headers -TimeoutSec 20
    Write-Host "SUCCESS: Registration worked!"
    Write-Host "User: $($response.user.email)"
    Write-Host "Token: $($response.accessToken.Substring(0,20))..."
} catch {
    Write-Host "FAILED: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)"
    }
}

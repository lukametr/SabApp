# მინიმალური ტესტი უნიკალური მონაცემებით
$timestamp = Get-Date -Format "yyyyMMddHHmmssffff"
$uniqueEmail = "unique$timestamp@absolutelyunique.test"

$testData = @{
  firstName      = "Unique"
  lastName       = "Test$timestamp"
  email          = $uniqueEmail
  password       = "UniquePass123!"
  personalNumber = "11111$($timestamp.Substring(0,6))"
  phoneNumber    = "+99511$($timestamp.Substring(0,6))"
  organization   = "Unique Test Org"
  position       = "Unique Tester"
} | ConvertTo-Json

Write-Host "Testing with absolutely unique data:"
Write-Host "Email: $uniqueEmail"
Write-Host "Personal: 11111$($timestamp.Substring(0,6))"
Write-Host "Phone: +99511$($timestamp.Substring(0,6))"

try {
  $response = Invoke-RestMethod -Uri "https://saba-app-production.up.railway.app/api/auth/register" -Method Post -Body $testData -ContentType "application/json"
  Write-Host "SUCCESS! Registration worked!" -ForegroundColor Green
  Write-Host "User ID: $($response.user.id)" -ForegroundColor Green
}
catch {
  Write-Host "FAILED with unique data:" -ForegroundColor Red
  Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
  Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    
  # მოდი debug endpoint სხვა გზით შევამოწმოთ
  Write-Host "`nChecking if backend is properly updated..." -ForegroundColor Yellow
  try {
    $healthResponse = Invoke-RestMethod -Uri "https://saba-app-production.up.railway.app/health" -Method Get
    Write-Host "Health check timestamp: $($healthResponse.timestamp)" -ForegroundColor Gray
  }
  catch {
    Write-Host "Health check failed too" -ForegroundColor Red
  }
}

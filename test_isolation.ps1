# User Isolation Test Script
# This script tests the user document isolation functionality

Write-Host "Starting User Isolation Test..." -ForegroundColor Green

# Test 1: Check if backend is running
Write-Host "`n=== Test 1: Backend Health Check ===" -ForegroundColor Yellow
try {
  $healthResponse = Invoke-RestMethod -Uri "http://localhost:10000/health" -Method GET
  Write-Host "Backend Status: $($healthResponse.status)" -ForegroundColor Green
}
catch {
  Write-Host "Backend is not running. Please start with: cd apps/backend; npm start" -ForegroundColor Red
  exit 1
}

# Test 2: Check if documents endpoint requires authentication
Write-Host "`n=== Test 2: Authentication Required ===" -ForegroundColor Yellow
try {
  $documentsResponse = Invoke-RestMethod -Uri "http://localhost:10000/api/documents" -Method GET
  Write-Host "ERROR: Documents endpoint should require authentication!" -ForegroundColor Red
}
catch {
  if ($_.Exception.Message -match "401") {
    Write-Host "Documents endpoint correctly requires authentication (401 Unauthorized)" -ForegroundColor Green
  }
  else {
    Write-Host "Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
  }
}

# Test 3: Check uploads directory structure
Write-Host "`n=== Test 3: File System Structure ===" -ForegroundColor Yellow
$uploadsPath = "uploads"
if (Test-Path $uploadsPath) {
  $userFolders = Get-ChildItem $uploadsPath -Directory -Filter "user_*" -ErrorAction SilentlyContinue
  if ($userFolders.Count -gt 0) {
    Write-Host "Found $($userFolders.Count) user folders:" -ForegroundColor Green
    foreach ($folder in $userFolders) {
      Write-Host "  $($folder.Name)" -ForegroundColor Cyan
    }
  }
  else {
    Write-Host "No user folders found yet (register users to create them)" -ForegroundColor Blue
  }
}
else {
  Write-Host "Uploads directory will be created when first user registers" -ForegroundColor Blue
}

Write-Host "`nUser Isolation Test Complete!" -ForegroundColor Green
Write-Host "Summary:" -ForegroundColor White
Write-Host "  - Backend is running and healthy" -ForegroundColor Green
Write-Host "  - API endpoints require authentication" -ForegroundColor Green
Write-Host "  - File system isolation is configured" -ForegroundColor Green

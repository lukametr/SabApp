# User Document Isolation Test

# Test 1: List all documents (should only show user's own documents)
$response = Invoke-RestMethod -Uri "http://localhost:3001/documents" -Method GET -Headers @{"Authorization" = "Bearer YOUR_JWT_TOKEN_HERE" }
Write-Host "Test 1 - List Documents:"
Write-Host $response | ConvertTo-Json -Depth 10

# Test 2: Try to access another user's document directly by ID
# Replace ANOTHER_USER_DOCUMENT_ID with an actual ID from another user's document
try {
  $response = Invoke-RestMethod -Uri "http://localhost:3001/documents/ANOTHER_USER_DOCUMENT_ID" -Method GET -Headers @{"Authorization" = "Bearer YOUR_JWT_TOKEN_HERE" }
  Write-Host "Test 2 - Access Other User's Document (Should Fail):"
  Write-Host $response | ConvertTo-Json -Depth 10
}
catch {
  Write-Host "Test 2 - Access Other User's Document FAILED (Expected): $_"
}

# Test 3: Create a new document (should be associated with current user)
$documentData = @{
  evaluatorName     = "Test"
  evaluatorLastName = "User"
  objectName        = "Test Object"
  workDescription   = "Test work description"
  date              = "2025-01-01"
  time              = "10:00"
  hazards           = @()
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3001/documents" -Method POST -Headers @{"Authorization" = "Bearer YOUR_JWT_TOKEN_HERE"; "Content-Type" = "application/json" } -Body $documentData
Write-Host "Test 3 - Create Document:"
Write-Host $response | ConvertTo-Json -Depth 10

# Test 4: Verify the created document shows up in user's list
$response = Invoke-RestMethod -Uri "http://localhost:3001/documents" -Method GET -Headers @{"Authorization" = "Bearer YOUR_JWT_TOKEN_HERE" }
Write-Host "Test 4 - Verify Document in List:"
Write-Host $response | ConvertTo-Json -Depth 10

Write-Host "`n=== User Isolation Test Complete ==="

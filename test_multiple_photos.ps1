# Test script for creating document with multiple photos
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODc5MGM2OGU5MDIzMDE2OGVlYTVjNTgiLCJlbWFpbCI6ImFkbWluQHNhYmEuY29tIiwicm9sZSI6ImFkbWluIiwic3RhdHVzIjoiYWN0aXZlIiwibmFtZSI6IlN1cGVyIEFkbWluIiwicGljdHVyZSI6bnVsbCwiYXV0aFByb3ZpZGVyIjoiZW1haWwiLCJpc0VtYWlsVmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE3NTQwNzA0OTcsImV4cCI6MTc1NDY3NTI5N30.FGFeo_H_SwjI-eQiwUcndrJ9f5O2l3dY_X-rjcLBUSU"

# Sample base64 images (small red and blue pixels)
$redPixel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
$bluePixel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg=="

$documentData = @{
  evaluatorName     = "ტესტ"
  evaluatorLastName = "მომხმარებელი"
  objectName        = "ოფისი - გაუმჯობესებული ფორმატი"
  workDescription   = "კომპიუტერული მუშაობა"
  date              = "2025-08-01T17:24:15.840Z"
  time              = "2025-08-01T17:24:15.841Z"
  hazards           = @(
    @{
      id                        = "hazard_test_1"
      hazardIdentification      = "კომპიუტერის ეკრანი - მრავალი ფოტო"
      affectedPersons           = @("თანამშრომელი 1", "თანამშრომელი 2")
      injuryDescription         = "თვალების დაღლა"
      existingControlMeasures   = "რეგულარული შესვენებები"
      initialRisk               = @{
        probability = 3
        severity    = 2
        total       = 6
      }
      additionalControlMeasures = "ეკრანის კუთხის მორგება"
      residualRisk              = @{
        probability = 2
        severity    = 2
        total       = 4
      }
      requiredMeasures          = "10 წუთიანი შესვენება ყოველ საათში"
      responsiblePerson         = "ოფის მენეჯერი"
      reviewDate                = "2025-08-01T17:24:15.841Z"
      photos                    = @($redPixel, $bluePixel)
    }
  )
} | ConvertTo-Json -Depth 10

try {
  $response = Invoke-RestMethod -Uri "http://localhost:10000/api/documents" -Method POST -Body $documentData -ContentType "application/json" -Headers @{"Authorization" = "Bearer $token" }
  Write-Host "✅ Document created with multiple photos: $($response.id)" -ForegroundColor Green
    
  # Generate Excel file
  $docId = $response.id
  $excelResponse = Invoke-WebRequest -Uri "http://localhost:10000/api/documents/$docId/download/excel" -Headers @{"Authorization" = "Bearer $token" } -OutFile "test_report_multiple_photos.xlsx"
  Write-Host "✅ Excel file generated: test_report_multiple_photos.xlsx" -ForegroundColor Green
    
  # Open the file
  Start-Process "test_report_multiple_photos.xlsx"
    
}
catch {
  Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

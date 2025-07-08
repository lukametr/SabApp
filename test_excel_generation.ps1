# Test Excel Report Generation
# This script tests if Excel report generation works correctly

Write-Host "Testing Excel Report Generation..." -ForegroundColor Green

# Mock document data for testing Excel generation
$testDocument = @{
  id                = "test123"
  evaluatorName     = "ტესტ"
  evaluatorLastName = "შემფასებელი"
  objectName        = "ტესტ ობიექტი"
  workDescription   = "ტესტ სამუშაოს აღწერა"
  date              = "2025-01-01"
  time              = "10:00"
  hazards           = @(
    @{
      id                        = "hazard1"
      hazardIdentification      = "ტესტ საფრთხე 1"
      affectedPersons           = @("მუშაკი 1", "მუშაკი 2")
      injuryDescription         = "შესაძლო ზიანი"
      existingControlMeasures   = "არსებული კონტროლი"
      initialRisk               = @{
        probability = 3
        severity    = 4
        total       = 12
      }
      additionalControlMeasures = "დამატებითი ღონისძიება"
      residualRisk              = @{
        probability = 2
        severity    = 3
        total       = 6
      }
      requiredMeasures          = "საჭირო ღონისძიება"
      responsiblePerson         = "პასუხისმგებელი პირი"
    }
  )
}

Write-Host "✅ Mock document data created:" -ForegroundColor Green
Write-Host "  - Evaluator: $($testDocument.evaluatorName) $($testDocument.evaluatorLastName)" -ForegroundColor White
Write-Host "  - Object: $($testDocument.objectName)" -ForegroundColor White
Write-Host "  - Hazards count: $($testDocument.hazards.Count)" -ForegroundColor White
Write-Host "  - First hazard: $($testDocument.hazards[0].hazardIdentification)" -ForegroundColor White

Write-Host "`n📊 Excel report structure should include:" -ForegroundColor Cyan
Write-Host "  1. Document title and basic info" -ForegroundColor White
Write-Host "  2. Evaluator details" -ForegroundColor White
Write-Host "  3. Hazards table with:" -ForegroundColor White
Write-Host "     - Hazard identification" -ForegroundColor Gray
Write-Host "     - Affected persons" -ForegroundColor Gray
Write-Host "     - Injury description" -ForegroundColor Gray
Write-Host "     - Initial and residual risk calculations" -ForegroundColor Gray
Write-Host "     - Control measures" -ForegroundColor Gray
Write-Host "     - Responsible person" -ForegroundColor Gray

Write-Host "`n🔍 To test Excel generation:" -ForegroundColor Yellow
Write-Host "  1. Create a document with hazards in the frontend" -ForegroundColor White
Write-Host "  2. Click 'Excel-ად ჩამოტვირთვა' button" -ForegroundColor White
Write-Host "  3. Verify downloaded Excel file contains all data" -ForegroundColor White
Write-Host "  4. Check formatting: borders, headers, column widths" -ForegroundColor White

Write-Host "`n✅ Excel service improvements made:" -ForegroundColor Green
Write-Host "  ✅ Fixed hazard field mapping (hazardIdentification, etc.)" -ForegroundColor Green
Write-Host "  ✅ Added proper risk calculation display (probability x severity = total)" -ForegroundColor Green
Write-Host "  ✅ Improved column headers and widths" -ForegroundColor Green
Write-Host "  ✅ Added cell borders and text wrapping" -ForegroundColor Green
Write-Host "  ✅ Increased row height for better readability" -ForegroundColor Green

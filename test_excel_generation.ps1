# Test Excel photo generation PowerShell script

# 1. Admin login
Write-Host "🔐 1. Admin-ით შესვლა..." -ForegroundColor Green

$loginBody = @{
  email    = "admin@saba.com"
  password = "admin123"
} | ConvertTo-Json

try {
  $loginResponse = Invoke-RestMethod -Uri "http://localhost:10000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
  $token = $loginResponse.token
  Write-Host "✅ წარმატებით შევედით სისტემაში" -ForegroundColor Green
    
  # 2. Create document
  Write-Host "📄 2. ტესტური document-ის შექმნა..." -ForegroundColor Green
    
  $documentData = Get-Content "test_document.json" -Raw
  $headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
  }
    
  $createResponse = Invoke-RestMethod -Uri "http://localhost:10000/api/documents" -Method POST -Body $documentData -Headers $headers
  $documentId = $createResponse._id
    
  Write-Host "✅ ტესტური document შეიქმნა: $documentId" -ForegroundColor Green
  Write-Host "📸 საფრთხეების რაოდენობა:" $createResponse.hazards.Count -ForegroundColor Yellow
    
  # Show photo counts
  for ($i = 0; $i -lt $createResponse.hazards.Count; $i++) {
    $photoCount = $createResponse.hazards[$i].photos.Count
    Write-Host "📸 საფრთხე $($i + 1): $photoCount ფოტო" -ForegroundColor Yellow
  }
    
  # 3. Test Excel generation
  Write-Host "🚀 3. Excel ფაილის ტესტი..." -ForegroundColor Green
    
  $excelUri = "http://localhost:10000/api/documents/$documentId/download/excel"
  $excelHeaders = @{ "Authorization" = "Bearer $token" }
    
  # Download Excel file
  $filename = "test_photos_$documentId.xlsx"
  Invoke-WebRequest -Uri $excelUri -Headers $excelHeaders -OutFile $filename
    
  $fileSize = [math]::Round((Get-Item $filename).Length / 1KB, 2)
  Write-Host "✅ Excel ფაილი შენახულია: $filename" -ForegroundColor Green
  Write-Host "📊 ფაილის ზომა: $fileSize KB" -ForegroundColor Cyan
  Write-Host "🎯 შეამოწმეთ Excel ფაილი ფოტოების სწორი ჩამატებისთვის!" -ForegroundColor Magenta
    
  # Open the file explorer to show the file
  Start-Process explorer.exe -ArgumentList "/select,`"$PWD\$filename`""
    
}
catch {
  Write-Host "❌ შეცდომა: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host "🔍 Response details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
}

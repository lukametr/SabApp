# შემოწმება - Google OAuth კონფიგურაცია
Write-Host "🔧 Google OAuth შემოწმება..." -ForegroundColor Cyan

# ამჟამინდელი Client ID
$clientId = "675742559993-5quocp5mgvmog0fd2g8ue03vpleb23t5.apps.googleusercontent.com"
$productionDomain = "https://saba-app-production.up.railway.app"
$callbackUrl = "$productionDomain/auth/google/callback"

Write-Host "`n📋 კონფიგურაციის დეტალები:" -ForegroundColor Yellow
Write-Host "Client ID: $clientId"
Write-Host "Production Domain: $productionDomain"
Write-Host "Callback URL: $callbackUrl"

Write-Host "`n❌ მიმდინარე პრობლემა:" -ForegroundColor Red
Write-Host "Google OAuth აბრუნებს 404 შეცდომას, რადგან redirect URI არ არის ავტორიზებული"

Write-Host "`n🔧 Google Cloud Console-ში დასამატებელი URL-ები:" -ForegroundColor Green
Write-Host "1. Authorized JavaScript origins:"
Write-Host "   $productionDomain"
Write-Host ""
Write-Host "2. Authorized redirect URIs:"
Write-Host "   $callbackUrl"

Write-Host "`n📍 ნაბიჯები:" -ForegroundColor Cyan
Write-Host "1. წადი: https://console.cloud.google.com/"
Write-Host "2. აირჩიე: APIs & Services > Credentials"
Write-Host "3. მოძებნე OAuth 2.0 Client ID: $clientId"
Write-Host "4. დაამატე ზემოთ მითითებული URL-ები"
Write-Host "5. შეინახე ცვლილებები"

Write-Host "`n⏱️ მნიშვნელოვანი:" -ForegroundColor Yellow
Write-Host "ცვლილებების ძალაში შესვლას შეიძლება 5-10 წუთი დასჭირდეს"

Write-Host "`n✅ ცვლილებების შემდეგ:" -ForegroundColor Green
Write-Host "Google OAuth უნდა იმუშაოს production-ში ყოველგვარი შეცდომის გარეშე"

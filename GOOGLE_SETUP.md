# Google OAuth Setup Guide

## 4. დაამატე შენი Origin Google Console-ში

Google Sign-In არ მუშაობს, რადგან client_id არ აძლევს უფლებას გამოიყენოს ეს დომენი.

### ნაბიჯები:

1. **შედი Google Cloud Console**
   - გადადი: https://console.cloud.google.com/
   - აირჩიე შენი პროექტი

2. **OAuth Credentials**
   - მენიუში აირჩიე: "APIs & Services" > "Credentials"
   - იპოვე შენი OAuth 2.0 Client ID და დააჭირე მას

3. **Authorized JavaScript Origins**
   დაამატე შემდეგი URL-ები:
   ```
   https://sabap-production.up.railway.app
   http://localhost:3000
   ```

4. **Authorized redirect URIs**
   დაამატე:
   ```
   https://sabap-production.up.railway.app/api/auth/google/callback
   http://localhost:3000/api/auth/google/callback
   ```

5. **Client ID კოპირება**
   - კოპირე Client ID
   - დაამატე ის `.env.local` ფაილში:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
   ```

### შედეგი:
ამ ცვლილებების შემდეგ:
- ✅ Google ავტორიზაცია იმუშავებს სწორად
- ✅ /api/documents პასუხობს წარმატებით
- ✅ აღარ იქნება CSP ან client_id-ის შეცდომები კონსოლში

## Environment Variables

შექმენი `.env.local` ფაილი `apps/frontend/` დირექტორიაში:

```env
NEXT_PUBLIC_API_URL=https://sabap-production.up.railway.app/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

## Build და Deploy

```bash
# Frontend build
cd apps/frontend
pnpm build

# Backend build
cd ../backend
pnpm build

# Deploy to Railway
git add .
git commit -m "Fix Google OAuth and API endpoints"
git push
``` 
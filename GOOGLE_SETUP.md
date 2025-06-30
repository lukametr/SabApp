# Google OAuth Setup Guide

## 🔧 Error 400: invalid_request გადაწყვეტა

### 1. OAuth Consent Screen კონფიგურაცია

1. **Google Cloud Console-ში**:
   - გადადი: https://console.cloud.google.com/
   - აირჩიე შენი პროექტი

2. **OAuth Consent Screen**:
   - მენიუში აირჩიე: "APIs & Services" > "OAuth consent screen"
   - **User Type**: აირჩიე "External" (თუ არ ხარ Google Workspace-ში)
   - **App name**: დაამატე შენი აპლიკაციის სახელი
   - **User support email**: დაამატე შენი email
   - **Developer contact information**: დაამატე შენი email

3. **Scopes**:
   - დაამატე შემდეგი scopes:
     - `openid`
     - `email`
     - `profile`

4. **Test users**:
   - **Publishing status**: დატოვე "Testing"
   - **Test users**: დაამატე შენი Google account email
   - **Add Users**: დააჭირე და დაამატე შენი email

### 2. OAuth Credentials კონფიგურაცია

1. **Credentials**:
   - მენიუში აირჩიე: "APIs & Services" > "Credentials"
   - იპოვე შენი OAuth 2.0 Client ID და დააჭირე მას

2. **Authorized JavaScript Origins**:
   დაამატე შემდეგი URL-ები:
   ```
   https://sabap-production.up.railway.app
   http://localhost:3000
   http://localhost:3001
   ```

3. **Authorized redirect URIs**:
   დაამატე:
   ```
   https://sabap-production.up.railway.app/api/auth/google/callback
   http://localhost:3000/api/auth/google/callback
   http://localhost:3001/api/auth/google/callback
   ```

### 3. Environment Variables

შექმენი `.env.local` ფაილი `apps/frontend/` დირექტორიაში:

```env
NEXT_PUBLIC_API_URL=https://sabap-production.up.railway.app/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
```

### 4. Frontend კონფიგურაცია

დარწმუნდი რომ `Navigation.tsx` ფაილში სწორად არის კონფიგურირებული:

```typescript
useEffect(() => {
  // Initialize Google Sign-In
  if (window.google && window.google.accounts) {
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
      callback: handleGoogleSuccess,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  }
}, []);
```

### 5. Testing

1. **Local testing**:
   ```bash
   cd apps/frontend
   pnpm dev
   ```

2. **Production testing**:
   - დარწმუნდი რომ Railway-ზე დეპლოიმენტი დასრულებულია
   - გადადი: https://sabap-production.up.railway.app

### 🚨 მნიშვნელოვანი შენიშვნები

1. **Test Users**: თუ OAuth consent screen "Testing" რეჟიმშია, მხოლოდ test users შეუძლიათ ავტორიზაცია
2. **Client ID**: დარწმუნდი რომ სწორი Client ID გამოიყენება
3. **Redirect URIs**: ყველა redirect URI უნდა იყოს ზუსტად დაკონფიგურირებული
4. **Scopes**: დარწმუნდი რომ ყველა საჭირო scope დამატებულია

### 🔍 Troubleshooting

თუ მაინც გაქვთ პრობლემა:

1. **Browser Console**: შეამოწმე browser console-ში შეცდომები
2. **Network Tab**: შეამოწმე network requests
3. **Google Cloud Console Logs**: შეამოწმე Google Cloud Console-ში logs
4. **Clear Cache**: გაასუფთავე browser cache და cookies

### ✅ შედეგი:
ამ ცვლილებების შემდეგ:
- ✅ Google ავტორიზაცია იმუშავებს სწორად
- ✅ Error 400: invalid_request აღარ გამოჩნდება
- ✅ /api/documents პასუხობს წარმატებით
- ✅ აღარ იქნება CSP ან client_id-ის შეცდომები კონსოლში

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
git commit -m "Fix Google OAuth 400 invalid_request error"
git push
``` 
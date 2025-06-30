# Railway Deployment Setup Guide

## 🚀 Environment Variables Configuration

### Required Environment Variables

Add these variables in Railway dashboard under **Shared Variables**:

```bash
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# API Configuration  
NEXT_PUBLIC_API_URL=https://your-app-name.up.railway.app/api

# Backend Configuration
PORT=3001
CORS_ORIGIN=https://your-app-name.up.railway.app
DATABASE_URL=your_database_url_here

# Google OAuth Backend
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 🔧 Google Cloud Console Setup

1. **OAuth Consent Screen:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project
   - Navigate to "APIs & Services" > "OAuth consent screen"
   - Add your Railway domain to "Authorized domains"
   - Add test users if in testing mode

2. **OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Create or edit OAuth 2.0 Client ID
   - Add these **Authorized JavaScript origins:**
     ```
     https://your-app-name.up.railway.app
     http://localhost:3000
     ```
   - Add these **Authorized redirect URIs:**
     ```
     https://your-app-name.up.railway.app
     https://your-app-name.up.railway.app/api/auth/google/callback
     http://localhost:3000
     ```

### 🐛 Troubleshooting

#### Google Sign-In Issues:
- **"Client ID undefined"**: Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in Railway variables
- **"redirect_uri_mismatch"**: Verify redirect URIs in Google Cloud Console
- **"invalid_request"**: Check OAuth consent screen configuration

#### API Issues:
- **404 on /api/documents**: Verify backend is running and routes are configured
- **CORS errors**: Check `CORS_ORIGIN` variable matches your domain

#### Font Issues:
- Font warnings are now fixed with proper preloading configuration
- Check browser console for any remaining font-related errors

### 📝 Verification Steps

1. **Check Environment Variables:**
   ```bash
   # In Railway logs, you should see:
   🔧 API Configuration: { NODE_ENV: 'production', API_URL: '', ... }
   🔑 Google Client ID: { clientId: 'your-id', isConfigured: true, ... }
   ```

2. **Test Google Sign-In:**
   - Should show Georgian button: "შესვლა Google ანგარიშით"
   - Google One Tap should appear automatically
   - No Russian text should be visible

3. **Test API Endpoints:**
   - `/health` should return 200 OK
   - `/api/documents` should return documents list
   - Check browser network tab for successful requests

### 🔄 Deployment Process

1. **Push Changes:**
   ```bash
   git add .
   git commit -m "Fix Google Sign-In and API issues"
   git push
   ```

2. **Monitor Railway Logs:**
   - Check for build success
   - Verify environment variables are loaded
   - Monitor API requests and responses

3. **Test Application:**
   - Frontend loads without errors
   - Google Sign-In works in Georgian
   - Documents API returns data
   - No console errors

### 📞 Support

If issues persist:
1. Check Railway logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test Google OAuth configuration in Google Cloud Console
4. Check browser console for client-side errors 
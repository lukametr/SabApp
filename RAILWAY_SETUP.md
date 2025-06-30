# Railway Setup Guide

## 🚨 Current Issues to Fix

### 1. Environment Variables Missing
The application is failing because these environment variables are not set in Railway:

#### Frontend Environment Variables (Railway Dashboard)
Go to your Railway project → Frontend service → Variables tab and add:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_ACTUAL_GOOGLE_CLIENT_ID_HERE
NEXT_PUBLIC_API_URL=https://saba-app-production.up.railway.app/api
```

#### Backend Environment Variables (Railway Dashboard)
Go to your Railway project → Backend service → Variables tab and add:

```bash
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=https://saba-app-production.up.railway.app
FRONTEND_URL=https://saba-app-production.up.railway.app
```

### 2. Google OAuth Configuration

#### Step 1: Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google Identity API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"

#### Step 2: Configure OAuth Consent Screen
1. Go to "OAuth consent screen"
2. Fill in required information:
   - App name: "SabApp"
   - User support email: your email
   - Developer contact information: your email
3. Add test users if in testing mode

#### Step 3: Configure OAuth Client ID
1. Application type: "Web application"
2. Authorized JavaScript origins:
   ```
   https://saba-app-production.up.railway.app
   http://localhost:3000
   ```
3. Authorized redirect URIs:
   ```
   https://saba-app-production.up.railway.app
   http://localhost:3000
   ```

#### Step 4: Copy Client ID
Copy the generated Client ID and add it to Railway environment variables.

### 3. Fix Google Cloud Console Issues

If you encounter the "new branding experience" bug mentioned in the [Google Cloud Community](https://www.googlecloudcommunity.com/gc/Developer-Tools/new-branding-experience-not-letting-me-create-clientId/td-p/860498), try these solutions:

1. **Refresh the page** after configuring consent screen
2. **Use incognito mode** to access Google Cloud Console
3. **Clear browser cache and cookies**
4. **Switch to old experience** by clicking on any GCP service first

### 4. Deployment Verification

After setting up environment variables:

1. **Redeploy the application** in Railway
2. **Check Railway logs** for any build errors
3. **Test the application** at your Railway URL
4. **Verify Google Sign-In** works correctly

## 🔧 Troubleshooting

### Google Sign-In Issues
- **"Client ID undefined"**: Environment variable not set correctly
- **"Origin not allowed"**: Add your Railway URL to authorized origins
- **"Missing required parameter"**: Check Google Client ID configuration

### API 404 Errors
- **"/api/documents 404"**: Backend not running or routes not configured
- **Check Railway logs** for backend startup errors
- **Verify MongoDB connection** string is correct

### CSP Errors
- **Google stylesheets blocked**: CSP headers removed for static export compatibility
- **This is expected** in static export mode

## 📋 Environment Variables Summary

### Frontend (.env.local for local development)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

### Backend (.env for local development)
```bash
MONGODB_URI=mongodb://localhost:27017/sabap
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
PORT=3001
```

### Railway Production
Set these in Railway dashboard for each service (frontend/backend) as shown above.

## 🎯 Next Steps

1. **Set up environment variables** in Railway
2. **Configure Google OAuth** credentials
3. **Redeploy the application**
4. **Test all functionality**
5. **Monitor logs** for any remaining issues

## 📞 Support

If you continue to have issues:
1. Check Railway deployment logs
2. Verify all environment variables are set
3. Test Google OAuth configuration
4. Review this guide for any missed steps 
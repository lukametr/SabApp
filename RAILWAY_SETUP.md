# Railway Deployment Setup Guide

## Environment Variables Configuration

### Required Environment Variables

You need to add these environment variables in Railway's **Shared Variables** section:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_API_URL=https://saba-app-production.up.railway.app/api
```

### How to Add Environment Variables in Railway

1. Go to your Railway project dashboard
2. Click on your service (SabApp)
3. Go to the **Variables** tab
4. Add the variables in the **Shared Variables** section:
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
   - `NEXT_PUBLIC_API_URL`: `https://saba-app-production.up.railway.app/api`

### Google OAuth Configuration

1. **Google Cloud Console Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project
   - Go to "APIs & Services" > "Credentials"
   - Find your OAuth 2.0 Client ID

2. **Authorized JavaScript Origins**:

   ```
   https://saba-app-production.up.railway.app
   http://localhost:3000
   ```

3. **Authorized Redirect URIs**:
   ```
   https://saba-app-production.up.railway.app/auth/google/callback
   http://localhost:3000/auth/google/callback
   http://localhost:10000/api/auth/google/callback
   ```

### Troubleshooting Current Issues

#### Issue 1: Google Client ID is undefined

**Solution**: Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to Railway Shared Variables

#### Issue 2: API 404 errors

**Solution**: Ensure `NEXT_PUBLIC_API_URL` is set to `https://saba-app-production.up.railway.app/api`

#### Issue 3: Malformed API URLs

**Solution**: The API configuration has been fixed to prevent URL concatenation issues

### Verification Steps

After setting environment variables:

1. **Redeploy your application** in Railway
2. **Check Railway logs** for any build errors
3. **Test the application**:
   - Visit `https://saba-app-production.up.railway.app`
   - Check browser console for environment variable logs
   - Test Google Sign-In functionality
   - Test API endpoints

### Debug Endpoints

- **Health Check**: `https://saba-app-production.up.railway.app/health`
- **API Documentation**: `https://saba-app-production.up.railway.app/docs`
- **Environment Debug**: Check browser console for API configuration logs

### Common Issues and Solutions

1. **Environment variables not loading**:
   - Ensure variables are in Shared Variables, not service-specific
   - Redeploy after adding variables
   - Check Railway logs for build errors

2. **Google OAuth errors**:
   - Verify Client ID is correct
   - Check authorized origins in Google Cloud Console
   - Ensure redirect URIs are properly configured

3. **API 404 errors**:
   - Verify API URL is correct
   - Check backend logs in Railway
   - Ensure documents controller is properly imported

### Railway Configuration Files

The project uses these Railway configuration files:

- `railway.toml` (root) - Main deployment configuration
- `apps/backend/railway.toml` - Backend-specific configuration

### Deployment Process

1. **Build Process**:
   - Frontend: Next.js static export
   - Backend: NestJS application
   - Static files served by NestJS

2. **Start Command**:
   - Backend starts on port specified by `PORT` environment variable
   - Frontend static files served from `/` path
   - API routes served from `/api` path

### Monitoring and Logs

- **Railway Dashboard**: Monitor deployment status and logs
- **Application Logs**: Check for errors in Railway logs
- **Browser Console**: Check for client-side errors and API configuration

### Security Notes

- Never commit sensitive environment variables to Git
- Use Railway's environment variable system for secrets
- Ensure Google OAuth credentials are properly configured
- Check CORS settings for production domain

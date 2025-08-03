# Railway Deployment Guide

## Environment Variables Configuration

### Required Railway Environment Variables

#### Backend Variables:
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sabap

# JWT Configuration
JWT_SECRET=your-secure-jwt-secret-key-here-production
JWT_EXPIRATION=24h

# Google OAuth
GOOGLE_CLIENT_ID=675742559993-5quocp5mgvmog0fd2g8ue03vpleb23t5.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Server Configuration
PORT=3001
NODE_ENV=production
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# CORS & Frontend
CORS_ORIGIN=https://sabapp.com
FRONTEND_URL=https://sabapp.com

# Email Configuration (Required for production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@sabapp.com
```

#### Frontend Variables:
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://sabapp.com/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=675742559993-5quocp5mgvmog0fd2g8ue03vpleb23t5.apps.googleusercontent.com

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-production
NEXTAUTH_URL=https://sabapp.com

# Google OAuth (for NextAuth)
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

## Deployment Steps

1. **Create Railway Project**
   - Connect your GitHub repository
   - Set up automatic deployments from main branch

2. **Configure Environment Variables**
   - Go to Railway Dashboard > Your Service > Variables
   - Add all variables listed above with your actual values

3. **Domain Configuration**
   - Set up custom domain: `sabapp.com`
   - Configure SSL certificate (automatic with Railway)

4. **Database Setup**
   - Use MongoDB Atlas for production database
   - Configure connection string in MONGODB_URI

5. **Email Service Setup**
   - Configure Gmail SMTP or use SendGrid/Mailgun
   - Generate app password for Gmail
   - Update EMAIL_* variables accordingly

## Important Notes

- Never commit actual secrets to git
- Use Railway's environment variables for all sensitive data
- Test deployment with staging environment first
- Monitor logs during initial deployment

## Health Check

The application includes health check endpoints:
- `/health` - Basic health status
- `/api/health` - API health status  
- `/health/debug` - Debug information (development only)

## Build Process

The application uses Docker for deployment with:
- Multi-stage build process
- Chrome/Puppeteer support for PDF generation
- Production environment optimization
- Automatic frontend and backend building

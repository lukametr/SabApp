#!/bin/bash

echo "🚀 Railway Deployment Script for Saba App"

# Build frontend first
echo "📦 Building frontend..."
cd apps/frontend
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Copy frontend build to backend public directory
echo "📋 Copying frontend build to backend..."
mkdir -p ../backend/public
cp -r out/* ../backend/public/

# Build backend
echo "🏗️ Building backend..."
cd ../backend
npm run build

# Check if backend build was successful
if [ $? -eq 0 ]; then
    echo "✅ Backend build successful"
else
    echo "❌ Backend build failed"
    exit 1
fi

echo "🎉 Build complete! Ready for Railway deployment."
echo ""
echo "📝 Environment variables to set on Railway:"
echo "   - DATABASE_URL"
echo "   - GOOGLE_CLIENT_SECRET"
echo "   - JWT_SECRET"
echo "   - NEXTAUTH_SECRET"
echo ""

#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Build frontend
echo "🏗️ Building frontend..."
cd apps/frontend
pnpm build
cd ../..

# Verify frontend build
echo "🔍 Verifying frontend build..."
if [ ! -f "apps/frontend/out/index.html" ]; then
    echo "❌ Frontend build failed: index.html not found"
    exit 1
fi

if [ ! -f "apps/frontend/out/documents/index.html" ]; then
    echo "❌ Frontend build failed: documents/index.html not found"
    exit 1
fi

if [ ! -f "apps/frontend/out/profile/index.html" ]; then
    echo "❌ Frontend build failed: profile/index.html not found"
    exit 1
fi

echo "✅ Frontend build verified successfully"

# Build backend
echo "🏗️ Building backend..."
cd apps/backend
pnpm build
cd ../..

echo "✅ Build completed successfully!"
echo "🎯 Frontend build: apps/frontend/out"
echo "🎯 Backend build: apps/backend/dist" 
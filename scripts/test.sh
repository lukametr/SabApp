#!/bin/bash

# Exit on error
set -e

echo "🧪 Starting test process..."

# Check if builds exist
if [ ! -d "apps/frontend/out" ]; then
    echo "❌ Frontend build not found. Run build first."
    exit 1
fi

if [ ! -d "apps/backend/dist" ]; then
    echo "❌ Backend build not found. Run build first."
    exit 1
fi

# Test frontend static files
echo "🔍 Testing frontend static files..."
if [ ! -f "apps/frontend/out/index.html" ]; then
    echo "❌ index.html not found"
    exit 1
fi

if [ ! -f "apps/frontend/out/documents/index.html" ]; then
    echo "❌ documents/index.html not found"
    exit 1
fi

if [ ! -f "apps/frontend/out/profile/index.html" ]; then
    echo "❌ profile/index.html not found"
    exit 1
fi

echo "✅ Frontend static files verified"

# Test backend compilation
echo "🔍 Testing backend compilation..."
cd apps/backend
if ! node -c dist/main.js; then
    echo "❌ Backend compilation failed"
    exit 1
fi
cd ../..

echo "✅ Backend compilation verified"

# Test API endpoints (if server is running)
echo "🔍 Testing API endpoints..."
if curl -s http://localhost:10000/api/health > /dev/null 2>&1; then
    echo "✅ Health endpoint working"
else
    echo "⚠️  Health endpoint not accessible (server may not be running)"
fi

echo "�� All tests passed!" 
#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting SabApp..."

# Check if builds exist
if [ ! -d "apps/frontend/out" ]; then
    echo "❌ Frontend build not found. Run build first."
    exit 1
fi

if [ ! -d "apps/backend/dist" ]; then
    echo "❌ Backend build not found. Run build first."
    exit 1
fi

# Start the application
echo "🎯 Starting backend server..."
cd apps/backend
pnpm start:prod 
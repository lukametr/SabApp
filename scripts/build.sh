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

# Build backend
echo "🏗️ Building backend..."
cd apps/backend
pnpm build
cd ../..

echo "✅ Build completed successfully!"
echo "🎯 Frontend build: apps/frontend/out"
echo "🎯 Backend build: apps/backend/dist" 
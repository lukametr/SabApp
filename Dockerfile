FROM node:20-alpine

WORKDIR /app

# Clean npm cache and install pnpm
RUN npm cache clean --force && npm install -g pnpm

# Copy root and workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copy backend and frontend package files for faster install caching
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/

# Install dependencies
RUN pnpm install --frozen-lockfile --recursive

# Copy the rest of the monorepo
COPY . .

ARG CACHEBUST=1
# Set environment variables for frontend build
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID=675742559993-5quocp5mgvmog0fd2g8ue03vpleb23t5.apps.googleusercontent.com
ARG NEXT_PUBLIC_API_URL=https://saba-app-production.up.railway.app/api
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build frontend and backend
RUN pnpm --filter ./apps/frontend build
RUN pnpm --filter ./apps/backend build

# Set working directory to backend for production
WORKDIR /app/apps/backend

# Create uploads directory
RUN mkdir -p uploads

# Copy frontend build output to backend's public directory
RUN mkdir -p public
RUN ls -la ../frontend/out/ || echo "Frontend out directory not found"
RUN cp -r ../frontend/out/* public/ || echo "Failed to copy frontend files"
RUN ls -la public/ || echo "Public directory is empty"

# Expose port
EXPOSE 3001

# Start the backend application
CMD ["node", "dist/main.js"]
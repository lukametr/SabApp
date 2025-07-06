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
# Build frontend და backend
RUN pnpm --filter ./apps/frontend build
RUN pnpm --filter ./apps/backend build

# Set working directory to backend for production
WORKDIR /app/apps/backend

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Start the backend application
CMD ["node", "dist/main.js"]
FROM node:20-alpine

WORKDIR /app

# Copy root and workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copy backend and frontend package files for faster install caching
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --no-frozen-lockfile --recursive

# Copy the rest of the monorepo
COPY . .

ARG CACHEBUST=1
# Build frontend and backend
RUN pnpm --filter ./apps/frontend build
RUN pnpm --filter ./apps/backend build

# Set working directory to backend for production
WORKDIR /app/apps/backend

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Start the backend application (which will serve frontend static files)
CMD ["node", "dist/main.js"]
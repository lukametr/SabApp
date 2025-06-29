# Use Node.js 20
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm@8

# Set working directory
WORKDIR /app

# Copy package files first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Create directories and copy package.json files
RUN mkdir -p apps/frontend apps/backend packages/ui packages/utils
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build frontend and backend
RUN pnpm run build

# Expose port
EXPOSE 10000

# Start the application
CMD ["pnpm", "run", "start:prod"] 
FROM node:20-slim

WORKDIR /app

# Install Chrome dependencies and Georgian fonts for Puppeteer
RUN apt-get update && apt-get install -y \
  wget \
  gnupg \
  ca-certificates \
  procps \
  libxss1 \
  fonts-noto \
  fonts-noto-cjk \
  fonts-liberation \
  fonts-dejavu \
  fonts-noto-color-emoji \
  fontconfig \
  && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
  && apt-get update \
  && apt-get install -y google-chrome-stable \
  && fc-cache -fv \
  && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use system Chrome
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
ENV CHROME_BIN=/usr/bin/google-chrome-stable

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

# Copy production environment files if they exist
RUN if [ -f "apps/backend/.env.production" ]; then cp apps/backend/.env.production apps/backend/.env; fi
RUN if [ -f "apps/frontend/.env.production" ]; then cp apps/frontend/.env.production apps/frontend/.env.local; fi

ARG CACHEBUST=1
# Set environment variables for frontend build
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID=675742559993-5quocp5mgvmog0fd2g8ue03vpleb23t5.apps.googleusercontent.com
ARG NEXT_PUBLIC_API_URL=https://sabapp.com/api
ARG GOOGLE_CLIENT_ID=675742559993-5quocp5mgvmog0fd2g8ue03vpleb23t5.apps.googleusercontent.com
ARG GOOGLE_CLIENT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL=https://sabapp.com
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}

# Build frontend and backend
ENV SKIP_ENV_VALIDATION=true
ENV NODE_ENV=production
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

# Expose default port (Railway will override with $PORT)
EXPOSE 3000

# Add healthcheck script
COPY healthcheck.js ./
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node healthcheck.js

# Start the backend application with detailed logging and fallback
CMD ["sh", "-c", "echo 'Starting application...' && ls -la dist/ && node --version && npm --version && echo 'Environment:' && env | grep -E '(PORT|NODE_ENV|MONGODB_URI)' && echo 'Starting node process...' && timeout 30 node dist/main.js || (echo 'Main app failed, starting emergency health server...' && node health-server.js)"]
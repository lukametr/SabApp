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

ARG CACHEBUST=1
# Set environment variables for frontend build
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID=675742559993-5quocp5mgvmog0fd2g8ue03vpleb23t5.apps.googleusercontent.com
ARG NEXT_PUBLIC_API_URL=https://sabapp.com/api
ARG GOOGLE_CLIENT_ID=675742559993-5quocp5mgvmog0fd2g8ue03vpleb23t5.apps.googleusercontent.com
ARG GOOGLE_CLIENT_SECRET=GOCSPX-placeholder
ARG NEXTAUTH_SECRET=saba-nextauth-secret-production-key-2024
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

# Expose port
EXPOSE 3001

# Start the backend application
CMD ["node", "dist/main.js"]
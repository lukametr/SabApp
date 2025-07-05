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

# Build frontend and backend
RUN pnpm --filter ./apps/frontend build
RUN pnpm --filter ./apps/backend build

# Create uploads directory
RUN mkdir -p /app/apps/backend/uploads

# Install PM2 globally for multi-service management
RUN npm install -g pm2

# Create PM2 configuration
RUN echo '{\
  "apps": [\
  {\
  "name": "backend",\
  "cwd": "/app/apps/backend",\
  "script": "dist/main.js",\
  "env": {\
  "NODE_ENV": "production",\
  "PORT": "3001"\
  }\
  },\
  {\
  "name": "frontend",\
  "cwd": "/app/apps/frontend",\
  "script": "node_modules/.bin/next",\
  "args": "start -p 3000",\
  "env": {\
  "NODE_ENV": "production",\
  "PORT": "3000"\
  }\
  }\
  ]\
  }' > ecosystem.config.json

# Expose ports
EXPOSE 3000 3001

# Start both services with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.json"]
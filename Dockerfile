FROM node:20-alpine

WORKDIR /app

# Copy root and workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copy backend and frontend package files for faster install caching
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/

RUN npm install -g pnpm && pnpm install --frozen-lockfile --recursive

# Copy the rest of the monorepo
COPY . .

WORKDIR /app
RUN pnpm build

WORKDIR /app/apps/backend
CMD ["pnpm", "start:prod"]
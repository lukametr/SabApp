# Multi-stage build
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/
RUN npm install -g pnpm@8 && pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY . .
RUN npm install -g pnpm@8 && pnpm --filter ./apps/frontend build && pnpm --filter ./apps/frontend exec next export && pnpm --filter ./apps/backend build

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache dumb-init curl

## Backend
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules

## Frontend static export -> backend public
COPY --from=builder /app/apps/frontend/out/ ./apps/backend/public/

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "apps/backend/dist/main.js"]

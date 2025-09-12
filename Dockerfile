# Multi-stage build
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/
RUN npm install -g pnpm@10 && pnpm install --frozen-lockfile --prefer-offline

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++
RUN npm install -g pnpm@10
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules
COPY --from=deps /app/packages/utils/node_modules ./packages/utils/node_modules
COPY . .
# Remove any potentially problematic env files
RUN rm -f apps/frontend/.env.local apps/frontend/.env.production.local || true

# Build both apps
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter ./apps/backend build && \
  pnpm --filter ./apps/frontend build

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat dumb-init && \
  npm install -g pnpm@10
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Backend files
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder --chown=nextjs:nodejs /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=deps --chown=nextjs:nodejs /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Frontend standalone build
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/public ./apps/frontend/public

ENV NODE_ENV=production
ENV PORT=3001
ENV BACKEND_PORT=10000
ENV HOSTNAME=0.0.0.0

RUN echo '#!/bin/sh' > /app/start.sh && \
  echo 'set -e' >> /app/start.sh && \
  echo "node apps/backend/dist/main.js &" >> /app/start.sh && \
  echo 'sleep 2' >> /app/start.sh && \
  echo 'HOSTNAME=0.0.0.0 PORT=3001 node apps/frontend/server.js' >> /app/start.sh && \
  chmod +x /app/start.sh

USER nextjs

EXPOSE 3001 10000

ENTRYPOINT ["dumb-init", "--"]
CMD ["/app/start.sh"]

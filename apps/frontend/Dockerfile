# --- FRONTEND (Next.js) ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/
COPY pnpm-workspace.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
WORKDIR /app/apps/frontend
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/frontend/.next .next
COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder /app/apps/frontend/package.json ./package.json
COPY --from=builder /app/apps/frontend/next.config.js ./next.config.js
COPY --from=builder /app/apps/frontend/.env.docker ./.env
COPY --from=builder /app/packages ./packages
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile
EXPOSE 3000
CMD ["pnpm", "start"]

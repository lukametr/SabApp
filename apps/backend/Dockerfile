# --- BACKEND (NestJS) ---
FROM node:20-alpine AS builder
WORKDIR /app/apps/backend
COPY package.json ../../package.json
COPY ../../pnpm-lock.yaml ../../pnpm-lock.yaml
COPY ../../pnpm-workspace.yaml ../../pnpm-workspace.yaml
COPY . .
WORKDIR /app
RUN npm install -g pnpm && pnpm install --frozen-lockfile
WORKDIR /app/apps/backend
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app/apps/backend
ENV NODE_ENV=production
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./package.json
COPY --from=builder /app/apps/backend/.env ./.env
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile
EXPOSE 10000
CMD ["pnpm", "start:prod"]

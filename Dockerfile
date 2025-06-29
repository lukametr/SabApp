FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

# Install backend dependencies explicitly for backend build context
WORKDIR /app/apps/backend
RUN pnpm install --frozen-lockfile

RUN npm install -g @nestjs/cli@10.0.0

RUN pnpm build

CMD ["pnpm", "start:prod"]
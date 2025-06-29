FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

WORKDIR /app/apps/backend
RUN pnpm install --frozen-lockfile
RUN pnpm build

CMD ["pnpm", "start:prod"]
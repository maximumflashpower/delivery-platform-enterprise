# ════════════════════════════════════════════════
# Stage 1: Build (compila TS + dependencias nativas)
# ════════════════════════════════════════════════
FROM node:20-slim AS builder

# Instalar build tools para better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

# Prune dev dependencies para producción
RUN npm prune --omit=dev

# ════════════════════════════════════════════════
# Stage 2: Production (sin recompilar nada)
# ════════════════════════════════════════════════
FROM node:20-slim AS production

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Copiar package.json + node_modules ya compilados del builder
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

VOLUME ["/app/data"]

ENV PORT=3000
ENV DB_PATH=/app/data/dev.db
ENV DB_TYPE=sqlite
ENV CORS_ENABLED=true

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "dist/main.js"]

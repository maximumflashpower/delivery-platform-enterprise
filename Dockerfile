# ════════════════════════════════════════════════
# Stage 1: Build
# ════════════════════════════════════════════════
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

# ════════════════════════════════════════════════
# Stage 2: Production
# ════════════════════════════════════════════════
FROM node:20-slim AS production

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./

RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force

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

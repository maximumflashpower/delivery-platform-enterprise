# ============================================
# Stage 1: Build
# ============================================
FROM node:20-bookworm AS builder

WORKDIR /app

# Install build tools needed for native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-bookworm-slim AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/main.js"]

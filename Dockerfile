# ============================================
# Stage 1: Build
# ============================================
FROM node:20-bookworm AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Remove dev dependencies
RUN npm prune --omit=dev

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-bookworm-slim AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/main.js"]

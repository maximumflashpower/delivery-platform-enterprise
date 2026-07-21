# ============================================
# Stage 1: Build (instala todo, compila, luego prune dev deps)
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Remove dev dependencies
RUN npm prune --omit=dev

# ============================================
# Stage 2: Production (solo copia, sin npm install)
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/main.js"]

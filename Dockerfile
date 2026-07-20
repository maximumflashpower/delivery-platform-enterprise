FROM node:18 AS builder

WORKDIR /app

# Debian-based image already has build tools for native modules
COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Production stage
FROM node:18 AS production

WORKDIR /app

LABEL org.opencontainers.image.title="delivery-platform-enterprise"
LABEL org.opencontainers.image.description="Enterprise Multi-Domain Delivery Platform"

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]

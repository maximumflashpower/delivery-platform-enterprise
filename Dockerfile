# Stage 1: Builder
FROM node:18 AS builder

WORKDIR /app

LABEL org.opencontainers.image.title="delivery-platform-enterprise"
LABEL org.opencontainers.image.description="Enterprise Multi-Domain Delivery Platform"

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Stage 2: Production Runner
FROM node:18

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]

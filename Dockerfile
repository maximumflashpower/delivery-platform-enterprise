FROM node:18-alpine AS builder

WORKDIR /app

# Install Python and build tools for native modules
RUN apk add --no-cache python3 make g++

COPY package*.json ./

# Use legacy-peer-deps to resolve peer dependency conflicts
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

COPY --from=builder /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]

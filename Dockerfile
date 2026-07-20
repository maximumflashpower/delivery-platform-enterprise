FROM node:18-alpine AS builder

WORKDIR /app

# Install Python and build tools for native modules
RUN apk add --no-cache python3 make g++ gcc linux-headers

COPY package*.json ./

# Full install with all dependencies for build
RUN npm install --legacy-peer-deps

COPY . .

# Build TypeScript
RUN npm run build

# Production stage - copy built files and minimal deps
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including native module binaries)
# Remove --only=production flag for proper native module installation
RUN npm install --omit=dev --legacy-peer-deps

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]

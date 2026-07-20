FROM node:18

WORKDIR /app

LABEL org.opencontainers.image.title="delivery-platform-enterprise"
LABEL org.opencontainers.image.description="Enterprise Multi-Domain Delivery Platform"

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]

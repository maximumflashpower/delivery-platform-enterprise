#!/bin/bash
set -e

echo "=== Building Docker image ==="
docker build -t delivery-platform-enterprise:latest .

echo ""
echo "=== Docker image built successfully ==="
docker images | grep delivery-platform

echo ""
echo "=== Starting containers ==="
docker compose up -d

echo ""
echo "=== Waiting for startup (15s)... ==="
sleep 15

echo ""
echo "=== Health check ==="
curl -s http://localhost:3000/api | jq . 2>/dev/null || echo "Server not ready yet"

echo ""
echo "=== Total endpoints ==="
curl -s http://localhost:3000/docs-json | jq '.paths | length' 2>/dev/null || echo "Swagger not ready yet"

echo ""
echo "=== Container status ==="
docker compose ps

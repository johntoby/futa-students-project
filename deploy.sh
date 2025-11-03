#!/bin/bash

# FUTA Students API Deployment Script

echo "🚀 Starting FUTA Students API deployment..."

# Clean up existing containers
echo "🧹 Cleaning up existing containers..."
docker stop futa-postgres futa-students-app 2>/dev/null || true
docker rm futa-postgres futa-students-app 2>/dev/null || true

# Create Docker network
echo "📡 Creating the secured Docker network..."
docker network create futa-network 2>/dev/null || echo "Network already exists"

# Start PostgreSQL container
echo "🐘 Starting PostgreSQL database..."
docker run -d \
  --name futa-postgres \
  --network futa-network \
  -e POSTGRES_DB=futa_students \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -p 5433:5432 \
  -v futa_db_data:/var/lib/postgresql/data \
  postgres:15-alpine

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Build the application image
echo "🔨 Building application image..."
docker build -t futa-students-api .

# Start application container
echo "🌐 Starting application..."
docker run -d \
  --name futa-students-app \
  --network futa-network \
  -p 3000:3000 \
  -e PORT=3000 \
  -e DB_HOST=futa-postgres \
  -e DB_PORT=5432 \
  -e DB_NAME=futa_students \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres123 \
  -e NODE_ENV=production \
  -e LOG_LEVEL=info \
  futa-students-api

# Run database migrations
echo "📊 Running database migrations..."
sleep 5
docker exec futa-students-app node src/migrations/migrate.js

echo "✅ Deployment complete!"
echo "🌍 Application: http://localhost:3000"
echo "🔍 Health check: http://localhost:3000/api/v1/healthcheck"
echo ""
echo "📋 Container status:"
docker ps --filter "name=futa-"

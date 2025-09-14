#!/bin/bash

echo "🚀 Starting FUTA Students API with Docker Compose..."

# Build and start services
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 15

# Run database migrations
echo "📊 Running database migrations..."
docker-compose exec app node src/migrations/migrate.js

echo "✅ Deployment complete!"
echo "🌍 Application: http://localhost:3000"
echo "🔍 Health check: http://localhost:3000/api/v1/healthcheck"
echo ""
echo "📋 Services status:"
docker-compose ps
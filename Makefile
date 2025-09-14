.PHONY: help start-db migrate build-api run-api check-db check-migrations stop clean

# Docker configuration
DB_CONTAINER_NAME = futa-postgres
API_CONTAINER_NAME = futa-students-app
API_IMAGE_NAME = futa-students-api
NETWORK_NAME = futa-network

# Default target
help:
	@echo "Available commands:"
	@echo "  make start-db   - Start PostgreSQL database container"
	@echo "  make migrate    - Run database migrations"
	@echo "  make build-api  - Build REST API docker image"
	@echo "  make run-api    - Run REST API docker container"
	@echo "  make stop       - Stop all containers"
	@echo "  make clean      - Clean up containers and images"

# Start DB container
start-db:
	@echo "🐘 Starting PostgreSQL database container..."
	docker network create $(NETWORK_NAME) 2>/dev/null || true
	docker run -d \
		--name $(DB_CONTAINER_NAME) \
		--network $(NETWORK_NAME) \
		-e POSTGRES_DB=futa_students \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres123 \
		-p 5432:5432 \
		-v futa_db_data:/var/lib/postgresql/data \
		postgres:15-alpine
	@echo "✅ Database container started"

# Run DB migrations
migrate:
	@echo "📊 Running database migrations..."
	docker exec $(API_CONTAINER_NAME) node src/migrations/migrate.js
	@echo "✅ Migrations completed"

# Build REST API docker image
build-api:
	@echo "🔨 Building REST API docker image..."
	docker build -t $(API_IMAGE_NAME) .
	@echo "✅ API image built"

# Check if DB is running
check-db:
	@if ! docker ps --format "table {{.Names}}" | grep -q $(DB_CONTAINER_NAME); then \
		echo "🐘 Database not running, starting..."; \
		make start-db; \
		sleep 10; \
	else \
		echo "✅ Database already running"; \
	fi

# Check if migrations are applied
check-migrations:
	@if ! docker exec $(DB_CONTAINER_NAME) psql -U postgres -d futa_students -c "SELECT 1 FROM information_schema.tables WHERE table_name='students'" 2>/dev/null | grep -q "1 row"; then \
		echo "📊 Migrations not applied, running..."; \
		sleep 5; \
		docker exec $(API_CONTAINER_NAME) node src/migrations/migrate.js; \
	else \
		echo "✅ Migrations already applied"; \
	fi

# Run REST API docker container with dependencies
run-api: check-db build-api
	@echo "🌐 Starting REST API with Docker Compose..."
	docker compose up -d app
	@echo "⏳ Waiting for API to start..."
	sleep 10
	@make check-migrations
	@echo "✅ API deployment complete!"
	@echo "🌍 Application: http://localhost:3000"
	@echo "🔍 Health check: http://localhost:3000/api/v1/healthcheck"

# Stop containers
stop:
	@echo "🛑 Stopping containers..."
	docker stop $(API_CONTAINER_NAME) $(DB_CONTAINER_NAME) 2>/dev/null || true
	docker rm $(API_CONTAINER_NAME) $(DB_CONTAINER_NAME) 2>/dev/null || true
	@echo "✅ Containers stopped"

# Clean up
clean: stop
	@echo "🧹 Cleaning up..."
	docker rmi $(API_IMAGE_NAME) 2>/dev/null || true
	docker network rm $(NETWORK_NAME) 2>/dev/null || true
	@echo "✅ Cleanup completed"
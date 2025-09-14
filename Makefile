.PHONY: help start-db migrate build-api run-api check-db check-migrations test lint stop clean

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
	@echo "🔍 Cleaning up existing containers..."
	@docker compose down 2>/dev/null || true
	@docker stop $(DB_CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(DB_CONTAINER_NAME) 2>/dev/null || true
	@echo "🔫 Killing processes on port 5432..."
	@sudo fuser -k 5432/tcp 2>/dev/null || true
	@echo "🐘 Starting fresh database container..."
	@docker compose up -d postgres
	@echo "⏳ Waiting for database to be ready..."
	@sleep 15

# Check if migrations are applied
check-migrations:
	@echo "📊 Running database migrations..."
	@docker compose exec app node src/migrations/migrate.js
	@echo "✅ Migrations completed"

# Run REST API docker container with dependencies
run-api:
	@echo "🧹 Cleaning up existing containers..."
	@make check-db
	@echo "🌐 Starting REST API with Docker Compose..."
	@docker compose up -d --build app
	@echo "⏳ Waiting for API to start..."
	@sleep 10
	@make check-migrations
	@echo "✅ API deployment complete!"
	@echo "🌍 Application: http://localhost:3000"
	@echo "🔍 Health check: http://localhost:3000/api/v1/healthcheck"

# Stop containers
stop:
	@echo "🛑 Stopping containers..."
	@docker compose down
	@echo "✅ Containers stopped"

# Run tests
test:
	@echo "🧪 Running tests..."
	@echo "🧹 Cleaning up existing test database..."
	@docker stop test-postgres 2>/dev/null || true
	@docker rm test-postgres 2>/dev/null || true
	@echo "🐘 Starting test database..."
	@docker run -d --name test-postgres \
		-e POSTGRES_DB=futa_students_test \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres123 \
		-p 5433:5432 \
		postgres:15-alpine
	@sleep 10
	@echo "📊 Running test database migrations..."
	@DB_HOST=localhost DB_PORT=5433 DB_NAME=futa_students_test DB_USER=postgres DB_PASSWORD=postgres123 node src/migrations/migrate.js
	@echo "🧪 Running tests..."
	@DB_HOST=localhost DB_PORT=5433 DB_NAME=futa_students_test DB_USER=postgres DB_PASSWORD=postgres123 npm test
	@echo "🧹 Cleaning up test database..."
	@docker stop test-postgres 2>/dev/null || true
	@docker rm test-postgres 2>/dev/null || true
	@echo "✅ Tests completed"

# Run code linting
lint:
	@echo "🔍 Running code linting..."
	npm install eslint@9.0.0 --no-save
	npx eslint src/ --max-warnings=0
	npx eslint src/ --fix
	@echo "✅ Linting completed"

# Clean up
clean: stop
	@echo "🧹 Cleaning up..."
	docker rmi $(API_IMAGE_NAME) 2>/dev/null || true
	docker network rm $(NETWORK_NAME) 2>/dev/null || true
	@echo "✅ Cleanup completed"
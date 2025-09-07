.PHONY: install migrate start dev test clean help

# Default target
help:
	@echo "Available commands:"
	@echo "  install  - Install dependencies"
	@echo "  migrate  - Run database migrations"
	@echo "  start    - Start the production server"
	@echo "  dev      - Start the development server"
	@echo "  test     - Run tests"
	@echo "  clean    - Clean node_modules and database"
	@echo "  setup    - Complete setup (install + migrate)"

# Install dependencies
install:
	npm install

# Run database migrations
migrate:
	npm run migrate

# Start production server
start: migrate
	npm start

# Start development server
dev: migrate
	npm run dev

# Run tests
test:
	npm test

# Clean project
clean:
	rm -rf node_modules

# Complete setup
setup: install migrate
	@echo "Setup complete! Run 'make dev' to start the development server."
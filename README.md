# FUTA Students API

A RESTful API for managing Federal University of Technology Akure (FUTA) Computer Science students with a simple web frontend.

## Features

- Complete CRUD operations for student management
- RESTful API with proper HTTP verbs
- API versioning (v1)
- SQLite database with migrations
- Comprehensive logging
- Unit tests
- Simple web frontend
- Health check endpoint
- Postman collection for API testing

## API Endpoints

### Base URL: `http://localhost:3000/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/healthcheck` | Health check endpoint |
| POST | `/students` | Create a new student |
| GET | `/students` | Get all students |
| GET | `/students/:id` | Get student by ID |
| PUT | `/students/:id` | Update student |
| DELETE | `/students/:id` | Delete student |

## Student Schema

```json
{
  "id": "integer (auto-generated)",
  "matric_number": "string (unique, required)",
  "first_name": "string (required)",
  "last_name": "string (required)",
  "email": "string (unique, required)",
  "phone": "string (optional)",
  "level": "integer (required)",
  "department": "string (default: Computer Science)",
  "created_at": "datetime (auto-generated)",
  "updated_at": "datetime (auto-updated)"
}
```

## Prerequisites

- Node.js (v14 or higher)
- npm
- PostgreSQL (v12 or higher)
- Make (optional, for using Makefile commands)

## Local Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd futa-students-api
```

### 2. Install dependencies
```bash
npm install
# OR using Makefile
make install
```

### 3. Set up PostgreSQL database
Create a PostgreSQL database:
```sql
CREATE DATABASE futa_students;
CREATE DATABASE futa_students_test; -- For testing
```

### 4. Set up environment variables
Copy the `.env` file and modify with your PostgreSQL credentials:
```bash
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=futa_students
DB_USER=postgres
DB_PASSWORD=your_password
NODE_ENV=development
LOG_LEVEL=info
```

### 5. Run database migrations
```bash
npm run migrate
# OR using Makefile
make migrate
```

### 6. Start the server

#### Development mode (with auto-reload):
```bash
npm run dev
# OR using Makefile
make dev
```

#### Production mode:
```bash
npm start
# OR using Makefile
make start
```

### 7. Access the application
- **Web Frontend**: http://localhost:3000
- **API Base URL**: http://localhost:3000/api/v1
- **Health Check**: http://localhost:3000/api/v1/healthcheck

## Available Make Commands

```bash
make help      # Show available commands
make install   # Install dependencies
make migrate   # Run database migrations
make start     # Start production server
make dev       # Start development server
make test      # Run tests
make clean     # Clean node_modules and database
make setup     # Complete setup (install + migrate)
```

## Running Tests

```bash
npm test
# OR using Makefile
make test
```

## API Usage Examples

### Create a Student
```bash
curl -X POST http://localhost:3000/api/v1/students \
  -H "Content-Type: application/json" \
  -d '{
    "matric_number": "CSC/2020/001",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@student.futa.edu.ng",
    "phone": "08012345678",
    "level": 300
  }'
```

### Get All Students
```bash
curl http://localhost:3000/api/v1/students
```

### Get Student by ID
```bash
curl http://localhost:3000/api/v1/students/1
```

### Update Student
```bash
curl -X PUT http://localhost:3000/api/v1/students/1 \
  -H "Content-Type: application/json" \
  -d '{
    "matric_number": "CSC/2020/001",
    "first_name": "John",
    "last_name": "Smith",
    "email": "john.smith@student.futa.edu.ng",
    "level": 400
  }'
```

### Delete Student
```bash
curl -X DELETE http://localhost:3000/api/v1/students/1
```

## Postman Collection

Import the `postman_collection.json` file into Postman to test all API endpoints with pre-configured requests.

## Project Structure

```
futa-students-api/
├── src/
│   ├── config/
│   │   ├── database.js      # Database configuration
│   │   └── logger.js        # Logging configuration
│   ├── controllers/
│   │   └── studentController.js  # Student CRUD operations
│   ├── models/
│   │   └── Student.js       # Student model
│   ├── routes/
│   │   ├── index.js         # Main routes
│   │   └── students.js      # Student routes
│   ├── migrations/
│   │   └── migrate.js       # Database migrations
│   └── app.js               # Main application
├── frontend/
│   ├── index.html           # Web interface
│   ├── style.css            # Styles
│   └── script.js            # Frontend JavaScript
├── tests/
│   └── students.test.js     # Unit tests
├── database/                # SQLite database files
├── .env                     # Environment variables
├── package.json             # Dependencies
├── Makefile                 # Build commands
├── postman_collection.json  # Postman collection
└── README.md               # This file
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | futa_students |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | password |
| `NODE_ENV` | Environment | development |
| `LOG_LEVEL` | Logging level | info |

## Logging

The application uses Winston for logging with the following levels:
- `error`: Error messages
- `warn`: Warning messages
- `info`: Informational messages
- `debug`: Debug messages

## Database

The application uses PostgreSQL for robust data management. Make sure PostgreSQL is installed and running before starting the application.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests to ensure they pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
const request = require('supertest');
const app = require('../src/app');
const database = require('../src/config/database');

describe('Students API', () => {
  beforeAll(async () => {
    // Use test database
    process.env.DB_NAME = 'futa_students_test';
    await database.connect();
    
    // Create table for testing
    const createTable = `
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        matric_number VARCHAR(20) UNIQUE NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15),
        level INTEGER NOT NULL,
        department VARCHAR(100) DEFAULT 'Computer Science',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await database.query(createTable);
  });

  beforeEach(async () => {
    // Clean up before each test
    await database.query('DELETE FROM students');
    await database.query('ALTER SEQUENCE students_id_seq RESTART WITH 1');
  });

  afterAll(async () => {
    await database.close();
  });

  describe('POST /api/v1/students', () => {
    it('should create a new student', async () => {
      const studentData = {
        matric_number: 'CSC/2020/001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@student.futa.edu.ng',
        phone: '08012345678',
        level: 300
      };

      const response = await request(app)
        .post('/api/v1/students')
        .send(studentData)
        .expect(201);

      expect(response.body.message).toBe('Student created successfully');
      expect(response.body.data.matric_number).toBe(studentData.matric_number);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/v1/students')
        .send({
          first_name: 'Jane'
        })
        .expect(400);

      expect(response.body.error).toContain('Missing required fields');
    });
  });

  describe('GET /api/v1/students', () => {
    it('should get all students', async () => {
      const response = await request(app)
        .get('/api/v1/students')
        .expect(200);

      expect(response.body.message).toBe('Students retrieved successfully');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/students/:id', () => {
    it('should get a student by ID', async () => {
      const response = await request(app)
        .get('/api/v1/students/1')
        .expect(200);

      expect(response.body.message).toBe('Student retrieved successfully');
      expect(response.body.data.id).toBe(1);
    });

    it('should return 404 for non-existent student', async () => {
      const response = await request(app)
        .get('/api/v1/students/999')
        .expect(404);

      expect(response.body.error).toBe('Student not found');
    });
  });

  describe('PUT /api/v1/students/:id', () => {
    it('should update a student', async () => {
      const updateData = {
        matric_number: 'CSC/2020/001',
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@student.futa.edu.ng',
        level: 400
      };

      const response = await request(app)
        .put('/api/v1/students/1')
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe('Student updated successfully');
      expect(response.body.data.last_name).toBe('Smith');
    });
  });

  describe('DELETE /api/v1/students/:id', () => {
    it('should delete a student', async () => {
      const response = await request(app)
        .delete('/api/v1/students/1')
        .expect(200);

      expect(response.body.message).toBe('Student deleted successfully');
    });
  });

  describe('GET /api/v1/healthcheck', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/v1/healthcheck')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.service).toBe('FUTA Students API');
    });
  });
});
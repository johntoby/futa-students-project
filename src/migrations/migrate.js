require('dotenv').config();
const database = require('../config/database');
const logger = require('../config/logger');

async function runMigrations() {
  try {
    await database.connect();

    const createStudentsTable = `
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

    const createUpdateTrigger = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_students_updated_at ON students;
      CREATE TRIGGER update_students_updated_at
        BEFORE UPDATE ON students
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `;

    await database.query(createStudentsTable);
    logger.info('Students table created successfully');
    
    await database.query(createUpdateTrigger);
    logger.info('Update trigger created successfully');
    
    await database.close();
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
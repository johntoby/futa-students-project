const database = require('../config/database');

class Student {
  static async create(studentData) {
    const { matric_number, first_name, last_name, email, phone, level } = studentData;
    
    const sql = `
      INSERT INTO students (matric_number, first_name, last_name, email, phone, level)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await database.query(sql, [matric_number, first_name, last_name, email, phone, level]);
    return result.rows[0];
  }

  static async findAll() {
    const sql = 'SELECT * FROM students ORDER BY created_at DESC';
    const result = await database.query(sql);
    return result.rows;
  }

  static async findById(id) {
    const sql = 'SELECT * FROM students WHERE id = $1';
    const result = await database.query(sql, [id]);
    return result.rows[0];
  }

  static async update(id, studentData) {
    const { matric_number, first_name, last_name, email, phone, level } = studentData;
    
    const sql = `
      UPDATE students 
      SET matric_number = $1, first_name = $2, last_name = $3, email = $4, phone = $5, level = $6
      WHERE id = $7
      RETURNING *
    `;
    
    const result = await database.query(sql, [matric_number, first_name, last_name, email, phone, level, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const sql = 'DELETE FROM students WHERE id = $1';
    const result = await database.query(sql, [id]);
    return result.rowCount > 0;
  }
}

module.exports = Student;
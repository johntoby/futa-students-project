const Student = require('../models/Student');
const logger = require('../config/logger');

class StudentController {
  async createStudent(req, res) {
    try {
      const { matric_number, first_name, last_name, email, phone, level } = req.body;
      
      if (!matric_number || !first_name || !last_name || !email || !level) {
        return res.status(400).json({
          error: 'Missing required fields: matric_number, first_name, last_name, email, level'
        });
      }

      const student = await Student.create(req.body);
      logger.info(`Student created: ${student.matric_number}`);
      
      res.status(201).json({
        message: 'Student created successfully',
        data: student
      });
    } catch (error) {
      logger.error('Error creating student:', error);
      res.status(400).json({
        error: error.message.includes('UNIQUE constraint') 
          ? 'Student with this matric number or email already exists'
          : 'Failed to create student'
      });
    }
  }

  async getAllStudents(req, res) {
    try {
      const students = await Student.findAll();
      logger.info(`Retrieved ${students.length} students`);
      
      res.json({
        message: 'Students retrieved successfully',
        data: students,
        count: students.length
      });
    } catch (error) {
      logger.error('Error retrieving students:', error);
      res.status(500).json({ error: 'Failed to retrieve students' });
    }
  }

  async getStudentById(req, res) {
    try {
      const { id } = req.params;
      const student = await Student.findById(id);
      
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      logger.info(`Retrieved student: ${student.matric_number}`);
      res.json({
        message: 'Student retrieved successfully',
        data: student
      });
    } catch (error) {
      logger.error('Error retrieving student:', error);
      res.status(500).json({ error: 'Failed to retrieve student' });
    }
  }

  async updateStudent(req, res) {
    try {
      const { id } = req.params;
      const existingStudent = await Student.findById(id);
      
      if (!existingStudent) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const updatedStudent = await Student.update(id, req.body);
      logger.info(`Student updated: ${id}`);
      
      res.json({
        message: 'Student updated successfully',
        data: updatedStudent
      });
    } catch (error) {
      logger.error('Error updating student:', error);
      res.status(400).json({
        error: error.message.includes('UNIQUE constraint')
          ? 'Student with this matric number or email already exists'
          : 'Failed to update student'
      });
    }
  }

  async deleteStudent(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Student.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Student not found' });
      }

      logger.info(`Student deleted: ${id}`);
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      logger.error('Error deleting student:', error);
      res.status(500).json({ error: 'Failed to delete student' });
    }
  }
}

module.exports = new StudentController();
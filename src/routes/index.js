const express = require('express');
const studentsRouter = require('./students');

const router = express.Router();

// Health check endpoint
router.get('/healthcheck', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'FUTA Students API',
    version: '1.0.0'
  });
});

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'FUTA Students API v1',
    endpoints: {
      healthcheck: '/api/v1/healthcheck',
      students: '/api/v1/students'
    }
  });
});

// Students routes
router.use('/students', studentsRouter);

module.exports = router;
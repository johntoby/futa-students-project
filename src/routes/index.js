const express = require('express');
const studentsRouter = require('./students');

const router = express.Router();

router.use('/students', studentsRouter);

router.get('/healthcheck', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'FUTA Students API',
    version: '1.0.0'
  });
});

module.exports = router;
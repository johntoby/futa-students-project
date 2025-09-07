require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const database = require('./config/database');
const logger = require('./config/logger');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  crossOriginOpenerPolicy: false
}));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/v1', routes);

// Direct healthcheck for testing
app.get('/healthcheck', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'FUTA Students API'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'FUTA Students API',
    version: '1.0.0',
    endpoints: {
      healthcheck: '/api/v1/healthcheck',
      students: '/api/v1/students'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

async function startServer() {
  try {
    await database.connect();
    
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`FUTA Students API server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`Frontend: http://localhost:${PORT}`);
      logger.info(`API: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    console.error('Database connection failed. Please check:');
    console.error('1. PostgreSQL is running');
    console.error('2. Database exists: ' + process.env.DB_NAME);
    console.error('3. Credentials are correct');
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down server...');
  await database.close();
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

module.exports = app;
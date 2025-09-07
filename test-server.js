const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Simple CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// Test endpoints
app.get('/api/v1/healthcheck', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/v1/students', (req, res) => {
  res.json({ 
    message: 'Students retrieved successfully',
    data: [
      {
        id: 1,
        matric_number: 'CSC/2020/001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@futa.edu.ng',
        phone: '08012345678',
        level: 300,
        department: 'Computer Science'
      }
    ]
  });
});

app.post('/api/v1/students', (req, res) => {
  console.log('Received student data:', req.body);
  res.json({ message: 'Student created successfully', data: req.body });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log(`Try: http://3.92.137.94:${PORT}`);
});
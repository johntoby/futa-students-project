require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

console.log('Starting FUTA Students API...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Database:', process.env.DB_NAME);
console.log('Port:', PORT);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Frontend: http://localhost:${PORT}`);
  console.log(`✅ API: http://localhost:${PORT}/api/v1`);
  console.log(`✅ Health: http://localhost:${PORT}/api/v1/healthcheck`);
});
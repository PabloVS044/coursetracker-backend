const app = require('./app');
const { env } = require('./config/env');
const { pool } = require('./db/pool');

pool.on('error', (error) => {
  console.error('Unexpected error on idle PostgreSQL client', error);
});

app.listen(env.port, () => {
  console.log(`Courses Tracker API listening on port ${env.port}`);
  console.log(`Swagger UI available at http://localhost:${env.port}/api-docs`);
});

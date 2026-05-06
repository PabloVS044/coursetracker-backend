const express = require('express');
const swaggerUi = require('swagger-ui-express');

const corsMiddleware = require('./middlewares/cors');
const { pool } = require('./db/pool');
const { errorHandler } = require('./middlewares/error-handler');
const { notFound } = require('./middlewares/not-found');
const { swaggerDocument } = require('./config/swagger');
const coursesRoutes = require('./routes/courses');
const uploadsRoutes = require('./routes/uploads');

const app = express();
const isVercelRuntime = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

app.use(corsMiddleware);
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Courses Tracker API',
    status: 'online',
    docs: isVercelRuntime ? '/openapi.json' : '/api-docs',
  });
});

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.status(200).json({
      status: 'ok',
      database: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'unreachable',
      timestamp: new Date().toISOString(),
    });
  }
});

app.get('/openapi.json', (req, res) => {
  res.status(200).json(swaggerDocument);
});

if (isVercelRuntime) {
  app.get('/api-docs', (req, res) => {
    res.status(200).json({
      message:
        'Swagger UI is disabled on Vercel for this project. Use /openapi.json or run locally to view the interactive docs.',
      openapi: '/openapi.json',
    });
  });
} else {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use('/courses', coursesRoutes);
app.use('/uploads', uploadsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

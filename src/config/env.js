const dotenv = require('dotenv');

dotenv.config({ quiet: true });

function parseInteger(value, fallback) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isInteger(parsed) ? parsed : fallback;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInteger(process.env.PORT, 3000),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  databaseUrl: process.env.DATABASE_URL || '',
  databaseSsl: process.env.DATABASE_SSL === 'true',
};

module.exports = { env };

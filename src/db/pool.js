const { Pool, types } = require('pg');

const { env } = require('../config/env');

types.setTypeParser(20, (value) => Number.parseInt(value, 10));
types.setTypeParser(1700, (value) => Number.parseFloat(value));

const pool = new Pool(
  env.databaseUrl
    ? {
        connectionString: env.databaseUrl,
        ssl: env.databaseSsl ? { rejectUnauthorized: false } : false,
      }
    : undefined
);

module.exports = { pool };

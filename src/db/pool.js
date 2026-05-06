const { Pool, types } = require('pg');

const { env } = require('../config/env');

types.setTypeParser(20, (value) => Number.parseInt(value, 10));
types.setTypeParser(1700, (value) => Number.parseFloat(value));

function createPoolConfig() {
  const poolConfig = {
    connectionString: env.databaseUrl,
  };

  if (env.databaseSsl === true) {
    poolConfig.ssl = { rejectUnauthorized: false };
  } else if (env.databaseSsl === false) {
    poolConfig.ssl = false;
  }

  return poolConfig;
}

const poolConfig = createPoolConfig();

const pool = new Pool(poolConfig);

module.exports = { createPoolConfig, pool };

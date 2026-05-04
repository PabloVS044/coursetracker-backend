const cors = require('cors');

const { env } = require('../config/env');

const origin =
  env.corsOrigin === '*'
    ? '*'
    : env.corsOrigin
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

module.exports = cors({
  origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
});

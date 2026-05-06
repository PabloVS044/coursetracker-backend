const dotenv = require('dotenv');

dotenv.config({ quiet: true });

function parseInteger(value, fallback) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isInteger(parsed) ? parsed : fallback;
}

function parseOptionalBoolean(name, value) {
  if (value === undefined || value === '') {
    return null;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new Error(`${name} must be "true" or "false" when provided`);
}

function requireEnv(name) {
  const value = (process.env[name] || '').trim();

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function getOptionalEnv(name) {
  return (process.env[name] || '').trim();
}

function validateDatabaseUrl(value) {
  const hasPlaceholder =
    value.includes('[PROJECT_REF]') ||
    value.includes('[YOUR-PASSWORD]') ||
    value.includes('[TU_PASSWORD]') ||
    value.includes('[REGION]');

  if (hasPlaceholder) {
    throw new Error(
      'DATABASE_URL still contains example placeholders. Copy the full connection string from Supabase Connect.'
    );
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(value);
  } catch (error) {
    throw new Error(
      'DATABASE_URL is invalid. Copy the full Session pooler connection string from Supabase Connect.'
    );
  }

  if (!['postgres:', 'postgresql:'].includes(parsedUrl.protocol)) {
    throw new Error('DATABASE_URL must start with postgres:// or postgresql://');
  }

  if (
    parsedUrl.hostname.endsWith('.pooler.supabase.com') &&
    parsedUrl.username &&
    !parsedUrl.username.includes('.')
  ) {
    throw new Error(
      'Supabase pooler URLs require the project ref in the username, for example postgres.<project_ref>.'
    );
  }

  return value;
}

const databaseUrl = validateDatabaseUrl(requireEnv('DATABASE_URL'));

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInteger(process.env.PORT, 3000),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  databaseUrl,
  databaseSsl: parseOptionalBoolean('DATABASE_SSL', process.env.DATABASE_SSL),
  cloudinaryCloudName: getOptionalEnv('CLOUDINARY_CLOUD_NAME'),
  cloudinaryApiKey: getOptionalEnv('CLOUDINARY_API_KEY'),
  cloudinaryApiSecret: getOptionalEnv('CLOUDINARY_API_SECRET'),
  cloudinaryFolder: getOptionalEnv('CLOUDINARY_FOLDER'),
};

module.exports = { env };

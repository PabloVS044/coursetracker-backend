const crypto = require('crypto');

const { env } = require('../config/env');
const ApiError = require('../utils/ApiError');

function assertCloudinaryConfig() {
  if (env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret) {
    return;
  }

  throw new ApiError(424, 'Cloudinary no esta configurado en el backend');
}

function buildSignature(params) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return crypto
    .createHash('sha1')
    .update(`${payload}${env.cloudinaryApiSecret}`)
    .digest('hex');
}

async function uploadCourseImage(file) {
  assertCloudinaryConfig();

  if (!file) {
    throw new ApiError(400, 'Validation failed', [
      {
        field: 'image',
        message: 'image file is required',
      },
    ]);
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = {
    folder: env.cloudinaryFolder || undefined,
    timestamp,
  };
  const signature = buildSignature(paramsToSign);
  const formData = new FormData();

  formData.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);
  formData.append('api_key', env.cloudinaryApiKey);
  formData.append('timestamp', String(timestamp));

  if (paramsToSign.folder) {
    formData.append('folder', paramsToSign.folder);
  }

  formData.append('signature', signature);

  let response;

  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
  } catch (error) {
    throw new ApiError(424, 'No se pudo conectar con Cloudinary');
  }

  let payload = null;

  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok || !payload || !payload.secure_url) {
    throw new ApiError(424, 'Cloudinary rechazo la imagen', [
      {
        field: 'image',
        message:
          payload && payload.error && payload.error.message
            ? payload.error.message
            : 'No se pudo subir la imagen',
      },
    ]);
  }

  return {
    url: payload.secure_url,
    public_id: payload.public_id,
    original_filename: payload.original_filename || file.originalname,
    width: payload.width ?? null,
    height: payload.height ?? null,
    format: payload.format || null,
  };
}

module.exports = {
  uploadCourseImage,
};

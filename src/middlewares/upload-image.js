const multer = require('multer');

const ApiError = require('../utils/ApiError');

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter(req, file, callback) {
    if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      callback(
        new ApiError(400, 'Validation failed', [
          {
            field: 'image',
            message: 'image must be a JPG, PNG, WEBP, or GIF file',
          },
        ])
      );
      return;
    }

    callback(null, true);
  },
});

function mapUploadError(error) {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return new ApiError(400, 'Validation failed', [
      {
        field: 'image',
        message: 'image must be at most 5 MB',
      },
    ]);
  }

  if (error instanceof multer.MulterError) {
    return new ApiError(400, 'Validation failed', [
      {
        field: 'image',
        message: 'No se pudo procesar la imagen enviada',
      },
    ]);
  }

  return error;
}

function requireImageUpload(req, res, next) {
  upload.single('image')(req, res, (error) => {
    if (error) {
      return next(mapUploadError(error));
    }

    if (!req.file) {
      return next(
        new ApiError(400, 'Validation failed', [
          {
            field: 'image',
            message: 'image file is required',
          },
        ])
      );
    }

    return next();
  });
}

module.exports = {
  requireImageUpload,
};

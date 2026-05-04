function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: {
        message: 'Invalid JSON payload',
      },
    });
  }

  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  const payload = {
    error: {
      message: statusCode >= 500 ? 'Internal server error' : error.message,
    },
  };

  if (statusCode < 500 && Array.isArray(error.details) && error.details.length > 0) {
    payload.error.details = error.details;
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  return res.status(statusCode).json(payload);
}

module.exports = { errorHandler };

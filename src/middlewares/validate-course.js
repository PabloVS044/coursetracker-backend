const ApiError = require('../utils/ApiError');

const ALLOWED_LEVELS = new Set(['beginner', 'intermediate', 'advanced']);
const ALLOWED_SORT_FIELDS = new Set(['title', 'price', 'created_at', 'level']);
const ALLOWED_SORT_ORDERS = new Set(['asc', 'desc']);
const ALLOWED_BODY_FIELDS = new Set([
  'title',
  'instructor',
  'platform',
  'category',
  'level',
  'price',
  'duration_hours',
  'lessons',
  'language',
  'description',
  'image_url',
]);

function createValidationError(details, message = 'Validation failed') {
  return new ApiError(400, message, details);
}

function normalizeOptionalString(value, maxLength, field, details) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    details.push({ field, message: `${field} must be a string` });
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  if (normalized.length > maxLength) {
    details.push({ field, message: `${field} must be at most ${maxLength} characters long` });
    return null;
  }

  return normalized;
}

function validateRequiredString(field, value, minLength, maxLength, details) {
  if (typeof value !== 'string') {
    details.push({ field, message: `${field} is required` });
    return null;
  }

  const normalized = value.trim();

  if (normalized.length < minLength) {
    details.push({
      field,
      message: `${field} must be at least ${minLength} characters long`,
    });
    return null;
  }

  if (normalized.length > maxLength) {
    details.push({
      field,
      message: `${field} must be at most ${maxLength} characters long`,
    });
    return null;
  }

  return normalized;
}

function validateCourseId(req, res, next) {
  const courseId = Number.parseInt(req.params.courseId, 10);

  if (!Number.isInteger(courseId) || courseId < 1) {
    return next(
      createValidationError([
        {
          field: 'courseId',
          message: 'courseId must be a positive integer',
        },
      ])
    );
  }

  req.courseId = courseId;
  return next();
}

function validateCourseListQuery(req, res, next) {
  const details = [];
  const page = req.query.page === undefined ? 1 : Number.parseInt(req.query.page, 10);
  const limit = req.query.limit === undefined ? 10 : Number.parseInt(req.query.limit, 10);
  const sort = req.query.sort === undefined ? 'created_at' : String(req.query.sort).trim();
  const order = req.query.order === undefined ? 'desc' : String(req.query.order).trim().toLowerCase();
  const q = req.query.q === undefined ? '' : String(req.query.q).trim();

  if (!Number.isInteger(page) || page < 1) {
    details.push({ field: 'page', message: 'page must be a positive integer' });
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    details.push({ field: 'limit', message: 'limit must be an integer between 1 and 100' });
  }

  if (!ALLOWED_SORT_FIELDS.has(sort)) {
    details.push({
      field: 'sort',
      message: 'sort must be one of title, price, created_at, level',
    });
  }

  if (!ALLOWED_SORT_ORDERS.has(order)) {
    details.push({
      field: 'order',
      message: 'order must be either asc or desc',
    });
  }

  if (q.length > 120) {
    details.push({ field: 'q', message: 'q must be at most 120 characters long' });
  }

  if (details.length > 0) {
    return next(createValidationError(details, 'Invalid query parameters'));
  }

  req.listQuery = {
    page,
    limit,
    q,
    sort,
    order,
  };

  return next();
}

function validateCourseBody(req, res, next) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return next(
      createValidationError([
        {
          field: 'body',
          message: 'body must be a JSON object',
        },
      ])
    );
  }

  const details = [];

  for (const field of Object.keys(req.body)) {
    if (!ALLOWED_BODY_FIELDS.has(field)) {
      details.push({
        field,
        message: `${field} is not allowed`,
      });
    }
  }

  const title = validateRequiredString('title', req.body.title, 3, 120, details);
  const instructor = validateRequiredString('instructor', req.body.instructor, 3, 100, details);
  const platform = validateRequiredString('platform', req.body.platform, 2, 60, details);
  const language = validateRequiredString('language', req.body.language, 2, 40, details);
  const levelValue =
    typeof req.body.level === 'string' ? req.body.level.trim().toLowerCase() : req.body.level;
  const category = normalizeOptionalString(req.body.category, 60, 'category', details);
  const description = normalizeOptionalString(req.body.description, 5000, 'description', details);
  const imageUrl = normalizeOptionalString(req.body.image_url, 2048, 'image_url', details);
  const rawPrice = typeof req.body.price === 'string' ? req.body.price.trim() : req.body.price;
  const rawDuration =
    typeof req.body.duration_hours === 'string'
      ? req.body.duration_hours.trim()
      : req.body.duration_hours;
  const rawLessons =
    typeof req.body.lessons === 'string' ? req.body.lessons.trim() : req.body.lessons;

  if (typeof levelValue !== 'string' || !ALLOWED_LEVELS.has(levelValue)) {
    details.push({
      field: 'level',
      message: 'level must be one of beginner, intermediate, advanced',
    });
  }

  const price = Number(rawPrice);

  if (rawPrice === undefined || rawPrice === null || rawPrice === '') {
    details.push({ field: 'price', message: 'price is required' });
  } else if (!Number.isFinite(price) || price < 0) {
    details.push({ field: 'price', message: 'price must be a number greater than or equal to 0' });
  }

  let durationHours = null;

  if (rawDuration !== undefined && rawDuration !== null && rawDuration !== '') {
    durationHours = Number(rawDuration);

    if (!Number.isInteger(durationHours) || durationHours < 1) {
      details.push({
        field: 'duration_hours',
        message: 'duration_hours must be a positive integer',
      });
    }
  }

  const lessons = Number(rawLessons);

  if (rawLessons === undefined || rawLessons === null || rawLessons === '') {
    details.push({ field: 'lessons', message: 'lessons is required' });
  } else if (!Number.isInteger(lessons) || lessons < 1) {
    details.push({
      field: 'lessons',
      message: 'lessons must be a positive integer',
    });
  }

  if (details.length > 0) {
    return next(createValidationError(details));
  }

  req.coursePayload = {
    title,
    instructor,
    platform,
    category,
    level: levelValue,
    price,
    duration_hours: durationHours,
    lessons,
    language,
    description,
    image_url: imageUrl,
  };

  return next();
}

module.exports = {
  validateCourseBody,
  validateCourseId,
  validateCourseListQuery,
};

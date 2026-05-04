const COURSE_COLUMNS = `
  id,
  title,
  instructor,
  platform,
  category,
  level,
  price,
  duration_hours,
  description,
  image_url,
  created_at,
  updated_at
`;

const SORT_FIELD_MAP = {
  title: 'title',
  price: 'price',
  created_at: 'created_at',
  level: 'level',
};

function buildCourseSearch(q) {
  const values = [];
  const filters = [];

  if (q) {
    values.push(`%${q}%`);
    filters.push(`title ILIKE $${values.length}`);
  }

  return {
    values,
    whereClause: filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '',
  };
}

function buildListCountQuery(q) {
  const { values, whereClause } = buildCourseSearch(q);

  return {
    text: `SELECT COUNT(*) AS total FROM courses ${whereClause}`,
    values,
  };
}

function buildListCoursesQuery({ page, limit, q, sort, order }) {
  const { values, whereClause } = buildCourseSearch(q);
  const sortField = SORT_FIELD_MAP[sort] || SORT_FIELD_MAP.created_at;
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
  const offset = (page - 1) * limit;
  const queryValues = [...values, limit, offset];
  const limitPlaceholder = `$${values.length + 1}`;
  const offsetPlaceholder = `$${values.length + 2}`;

  return {
    text: `
      SELECT ${COURSE_COLUMNS}
      FROM courses
      ${whereClause}
      ORDER BY ${sortField} ${sortOrder}, id ASC
      LIMIT ${limitPlaceholder}
      OFFSET ${offsetPlaceholder}
    `,
    values: queryValues,
  };
}

const getCourseByIdQuery = `
  SELECT ${COURSE_COLUMNS}
  FROM courses
  WHERE id = $1
`;

const createCourseQuery = `
  INSERT INTO courses (
    title,
    instructor,
    platform,
    category,
    level,
    price,
    duration_hours,
    description,
    image_url
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING ${COURSE_COLUMNS}
`;

const updateCourseQuery = `
  UPDATE courses
  SET
    title = $2,
    instructor = $3,
    platform = $4,
    category = $5,
    level = $6,
    price = $7,
    duration_hours = $8,
    description = $9,
    image_url = $10
  WHERE id = $1
  RETURNING ${COURSE_COLUMNS}
`;

const deleteCourseQuery = 'DELETE FROM courses WHERE id = $1 RETURNING id';

module.exports = {
  buildListCountQuery,
  buildListCoursesQuery,
  createCourseQuery,
  deleteCourseQuery,
  getCourseByIdQuery,
  updateCourseQuery,
};

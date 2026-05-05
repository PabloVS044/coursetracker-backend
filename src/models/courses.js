const { pool } = require('../db/pool');
const courseQueries = require('../queries/courses');

async function listCourses({ page, limit, q, sort, order }) {
  const countQuery = courseQueries.buildListCountQuery(q);
  const listQuery = courseQueries.buildListCoursesQuery({ page, limit, q, sort, order });
  const countResult = await pool.query(countQuery.text, countQuery.values);
  const result = await pool.query(listQuery.text, listQuery.values);

  return {
    courses: result.rows,
    total: countResult.rows[0].total,
  };
}

async function getCourseById(courseId) {
  const result = await pool.query(courseQueries.getCourseByIdQuery, [courseId]);

  return result.rows[0] || null;
}

async function createCourse(course) {
  const result = await pool.query(courseQueries.createCourseQuery, [
    course.title,
    course.instructor,
    course.platform,
    course.category,
    course.level,
    course.price,
    course.duration_hours,
    course.lessons,
    course.language,
    course.description,
    course.image_url,
  ]);

  return result.rows[0];
}

async function updateCourse(courseId, course) {
  const result = await pool.query(courseQueries.updateCourseQuery, [
    courseId,
    course.title,
    course.instructor,
    course.platform,
    course.category,
    course.level,
    course.price,
    course.duration_hours,
    course.lessons,
    course.language,
    course.description,
    course.image_url,
  ]);

  return result.rows[0] || null;
}

async function deleteCourse(courseId) {
  const result = await pool.query(courseQueries.deleteCourseQuery, [courseId]);
  return result.rows[0] || null;
}

module.exports = {
  createCourse,
  deleteCourse,
  getCourseById,
  listCourses,
  updateCourse,
};

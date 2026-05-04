const ApiError = require('../utils/ApiError');
const coursesModel = require('../models/courses');

function buildPaginationMeta(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  };
}

async function listCourses(query) {
  const { courses, total } = await coursesModel.listCourses(query);

  return {
    data: courses,
    meta: buildPaginationMeta(query.page, query.limit, total),
  };
}

async function getCourseById(courseId) {
  const course = await coursesModel.getCourseById(courseId);

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  return { data: course };
}

async function createCourse(payload) {
  const course = await coursesModel.createCourse(payload);
  return { data: course };
}

async function updateCourse(courseId, payload) {
  const course = await coursesModel.updateCourse(courseId, payload);

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  return { data: course };
}

async function deleteCourse(courseId) {
  const deletedCourse = await coursesModel.deleteCourse(courseId);

  if (!deletedCourse) {
    throw new ApiError(404, 'Course not found');
  }
}

module.exports = {
  createCourse,
  deleteCourse,
  getCourseById,
  listCourses,
  updateCourse,
};

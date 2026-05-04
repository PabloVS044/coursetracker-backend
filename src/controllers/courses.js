const coursesService = require('../services/courses');

async function listCourses(req, res, next) {
  try {
    const response = await coursesService.listCourses(req.listQuery);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}

async function getCourseById(req, res, next) {
  try {
    const response = await coursesService.getCourseById(req.courseId);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}

async function createCourse(req, res, next) {
  try {
    const response = await coursesService.createCourse(req.coursePayload);
    return res.status(201).json(response);
  } catch (error) {
    return next(error);
  }
}

async function updateCourse(req, res, next) {
  try {
    const response = await coursesService.updateCourse(req.courseId, req.coursePayload);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}

async function deleteCourse(req, res, next) {
  try {
    await coursesService.deleteCourse(req.courseId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createCourse,
  deleteCourse,
  getCourseById,
  listCourses,
  updateCourse,
};

const { Router } = require('express');

const coursesController = require('../controllers/courses');
const {
  validateCourseBody,
  validateCourseId,
  validateCourseListQuery,
} = require('../middlewares/validate-course');

const router = Router();

router.get('/', validateCourseListQuery, coursesController.listCourses);
router.get('/:courseId', validateCourseId, coursesController.getCourseById);
router.post('/', validateCourseBody, coursesController.createCourse);
router.put('/:courseId', validateCourseId, validateCourseBody, coursesController.updateCourse);
router.delete('/:courseId', validateCourseId, coursesController.deleteCourse);

module.exports = router;

const { Router } = require('express');

const uploadsController = require('../controllers/uploads');
const { requireImageUpload } = require('../middlewares/upload-image');

const router = Router();

router.post('/image', requireImageUpload, uploadsController.uploadCourseImage);

module.exports = router;

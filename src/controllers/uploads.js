const uploadsService = require('../services/uploads');

async function uploadCourseImage(req, res, next) {
  try {
    const uploadedImage = await uploadsService.uploadCourseImage(req.file);

    return res.status(201).json({
      data: uploadedImage,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  uploadCourseImage,
};

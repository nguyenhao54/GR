const express = require('express');
const router = express.Router();
const lessonController = require('../controller/lessonController');
const authController = require('../controller/authController');

router
  .route('/')
  .get(lessonController.getAllLessons)
  .post(
    authController.protect,
    // authController.restrictTo('admin'),
    lessonController.createLesson,
  );

router.get('/my', authController.protect, lessonController.getMyLessons);

router
  .route('/:id')
  .get(lessonController.getLesson)
  .post(authController.protect, authController.restrictTo('admin'))
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    lessonController.updateLesson,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    lessonController.deleteLesson,
  );

module.exports = router;

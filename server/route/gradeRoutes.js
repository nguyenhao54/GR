const express = require('express');
const router = express.Router();
const gradeController = require('../controller/gradeController');
const authController = require('../controller/authController');

router
  .route('/')
  .get(gradeController.getGrade)
  .post(
    authController.protect,
    authController.restrictTo('teacher', 'admin'),
    gradeController.createGrade,
  );

router.get('/my', authController.protect, gradeController.getMyGrades);


router
  .route('/:id')
  .post(authController.protect, authController.restrictTo('admin'))
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'teacher'),
    gradeController.updateGrade,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'teacher'),
    gradeController.deleteGrade,
  );

module.exports = router;

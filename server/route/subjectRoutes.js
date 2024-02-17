const express = require('express');
const router = express.Router();
const subjectController = require('../controller/subjectController');
const authController = require('../controller/authController');

router
  .route('/')
  .get(subjectController.getAllSubjects)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    subjectController.createSubject,
  );

router
  .route('/:id')
  .get(subjectController.getSubject)
  .post(authController.protect, authController.restrictTo('admin'))
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    subjectController.updateSubject,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    subjectController.deleteSubject,
  );

module.exports = router;

const express = require('express');
const router = express.Router();
const classController = require('../controller/classController');
const authController = require('../controller/authController');

router
  .route('/')
  .get(classController.getAllClasses)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    classController.createClass,
  );

router.get('/my', authController.protect, classController.getMyClasses);

router
  .route('/:id')
  .get(classController.getClass)
  .post(authController.protect, authController.restrictTo('admin'))
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    classController.createClass,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    classController.createClass,
  );

module.exports = router;

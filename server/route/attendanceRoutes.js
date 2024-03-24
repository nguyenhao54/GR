const express = require('express');
const router = express.Router();
const attendanceController = require('../controller/attendanceController');
const authController = require('../controller/authController');

router
  .route('/')
  .get(attendanceController.getAllAttendances)
  .post(
    authController.protect,
    // authController.restrictTo('admin'),
    attendanceController.createAttendance,
  );
router.route('/my-attendance-stats').get(authController.protect, attendanceController.getMyAttendanceStats);
// router.get('/my', authController.protect, attendanceController.getMyAttendances);

router
  .route('/:id')
  .get(attendanceController.getAttendance)
  .patch(
    authController.protect,
    attendanceController.updateAttendance,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    attendanceController.deleteAttendance,
  );

module.exports = router;

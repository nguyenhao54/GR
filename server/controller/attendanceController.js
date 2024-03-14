const AppError = require('./../utils/appError');


const factory = require('./handlerFactory');
const Attendance = require('../models/attendanceModel');

// exports.setUserIds = catchAsync(async (req, res, next) => {
//   await authController.protect(req, res, next);
//   //   console.log('req params', req);
//   console.log(req.user);
//   if (!req.body.user) {
//     req.body.user = req.user._id;
//   }
//   next();
// });

exports.getAllAttendances = factory.getAll(Attendance);
exports.getAttendance = factory.getOne(Attendance);
exports.createAttendance = factory.createOne(Attendance);
exports.updateAttendance = factory.updateOne(Attendance);
exports.deleteAttendance = factory.deleteOne(Attendance);



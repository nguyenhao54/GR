const AppError = require('./../utils/appError');


const factory = require('./handlerFactory');
const Attendance = require('../models/attendanceModel');
const catchAsync = require('../utils/catchAsync');

exports.getMyAttendanceStats = catchAsync(async(req, res,next)=>{
    const stats = await Attendance.aggregate([
        {
            $match: {student: req.user._id}
        },
        {
            $group: {
                _id: "$isSuccessful",
                num: { $sum: 1 },
            }
        }
    ])
})

exports.getAllAttendances = factory.getAll(Attendance);
exports.getAttendance = factory.getOne(Attendance);
exports.createAttendance = factory.createOne(Attendance);
exports.updateAttendance = factory.updateOne(Attendance);
exports.deleteAttendance = factory.deleteOne(Attendance);



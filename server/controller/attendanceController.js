const AppError = require('./../utils/appError');
const Class = require('../models/classModel');

function selectWeek(date) {
  return Array(7)
    .fill(new Date(date))
    .map((el, idx) => new Date(el.setDate(el.getDate() - el.getDay() + idx)));
}

const factory = require('./handlerFactory');
const Attendance = require('../models/attendanceModel');
const catchAsync = require('../utils/catchAsync');
const Lesson = require('../models/lessonModel');

exports.getMyAttendanceStats = catchAsync(async (req, res, next) => {
  console.log(req.user._id);
  const date = new Date(new Date().getTime() - 7*24*60*60*1000)
  const weekdays = selectWeek(date);

  const stats = await Promise.all( weekdays.map(async (day) => {
    // lay lesson trong ngay hom do

    const classes = await Class.aggregate([
      {
        $unwind: '$students',
      },
      {
        $match: {
          students: req.user._id,
        },
      },
      { $unset: 'students' },
      // {select: "_id"},
    ]);
    const ids = classes.map((i) => i._id);
    // console.log("id", ids)

    const lessons = await Lesson.find({
      class: { $in: ids },
      $expr: {
        $eq: [
          { $dateToString: { format: '%Y-%m-%d', date: '$startDateTime' } },
          { $dateToString: { format: '%Y-%m-%d', date: day } },
        ],
      },
    });
    const lessonids = lessons.map((i) => i._id);

    const present = await Attendance
      // .populate({path: "lesson"})
      .aggregate([
        // {$populate: {}},
        {
          $match: {
            student: req.user._id,
            isSuccessful: true,
            lesson: { $in: lessonids },
          },
        },
      ]);
    return ({
      "date": day,
      "absent": lessons.length - present.length,
      "present": present.length,
    })
  }));

  // layu diem danh thanh cong trong  ngay

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getAllAttendances = factory.getAll(Attendance);
exports.getAttendance = factory.getOne(Attendance);
exports.createAttendance = factory.createOne(Attendance);
exports.updateAttendance = factory.updateOne(Attendance);
exports.deleteAttendance = factory.deleteOne(Attendance);

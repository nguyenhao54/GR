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
  const date = new Date(
    new Date(req.params.id).getTime() - 7 * 24 * 60 * 60 * 1000,
  );
  const weekdays = selectWeek(date);

  const stats = await Promise.all(
    weekdays.map(async (day) => {
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
      return {
        date: day,
        absent: lessons.length - present.length,
        present: present.length,
      };
    }),
  );

  // layu diem danh thanh cong trong  ngay

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getAttendanceRatio = catchAsync(async (req, res, next) => {
  const classId = req.params.classId;
  const classObj = (await Class.find({ classId: classId }))[0];
  if (classObj) {
    // console.log(classObj);
    const lessonIds = (
      await Lesson.find({
        class: classObj._id,
      })
    ).map((item) => item._id);
    const numberOfLessons = lessonIds.length;

    console.log(lessonIds, numberOfLessons);

    const statistic = await Promise.all(
      classObj.students.map(async (studentObjId) => {
        console.log(studentObjId, "studentObjId")
        const present = await Attendance
          // .populate({path: "lesson"})
          .aggregate([
            // {$populate: {}},
            {
              $match: {
                student: studentObjId._id,
                isSuccessful: { $eq: true },
                lesson: { $in: lessonIds },
              },
            },
          ]);

        console.log(present, 'present');
        return {
          student: studentObjId,
          ratio: present.length + '/' + numberOfLessons,
        };
      }),
    );

    res.status(200).json({
      status: 'success',
      data: statistic,
    });
  } else {
    res.status(400).json({
      status: 'failed',
      message: 'No class with that id',
    });
  }
});

exports.getAllAttendances = factory.getAll(Attendance);
exports.getAttendance = factory.getOne(Attendance);
exports.createAttendance = factory.createOne(Attendance);
exports.updateAttendance = factory.updateOne(Attendance);
exports.deleteAttendance = factory.deleteOne(Attendance);

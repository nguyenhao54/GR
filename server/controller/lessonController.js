const catchAsync = require('./../utils/catchAsync');
const Lesson = require('../models/lessonModel');
const Class = require('../models/classModel');
const factory = require('./handlerFactory');

exports.getAllLessons = factory.getAll(Lesson);
exports.getLesson = factory.getOne(Lesson, { path: 'class' });
exports.createLesson = factory.createOne(Lesson);
exports.updateLesson = factory.updateOne(Lesson);
exports.deleteLesson = factory.deleteOne(Lesson);

exports.getMyLessons = catchAsync(async (req, res, next) => {
  console.log(req.query)
  let classes;
  if (req.user.role === 'student') {
    classes = await Class.aggregate([
      {
        $unwind: '$students',
      },
      {
        $match: {
          students: req.user._id,
        },
      },
      { $unset: 'students' },
    ]);
  } else if (req.user.role === 'teacher') {
    classes = await Class.aggregate([
      {
        $match: {
          teacher: req.user._id,
        },
      },
      { $unset: 'students' },
    ]);
  }
  const ids = classes.map((i) => i._id);
  const lessons = await Lesson.find({
    class: { $in: ids },
    ...req.query
  }).populate('class', {
    subject: 1,
    teacher: 1,
    classId: 1,
    location: 1,
    students: 0,
  });

  res.status(200).json({
    status: 'success',
    results: lessons.length,
    data: {
      lessons,
    },
  });
});

exports.getMyCurrentLesson = catchAsync(async (req, res, next) => {
  let classes;
  if (req.user.role === 'student') {
    classes = await Class.aggregate([
      {
        $unwind: '$students',
      },
      {
        $match: {
          students: req.user._id,
        },
      },
      { $unset: 'students' },
    ]);
  } else if (req.user.role === 'teacher') {
    classes = await Class.aggregate([
      {
        $match: {
          teacher: req.user._id,
        },
      },
      { $unset: 'students' },
    ]);
  }
  const ids = classes.map((i) => i._id);
  const currentDateTime = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
  const lessons = await Lesson.find({
    class: { $in: ids },
    startDateTime: { $lte: currentDateTime },
    endDateTime: { $gte: currentDateTime },
  }).populate('class', {
    subject: 1,
    teacher: 1,
    classId: 1,
    location: 1,
    students: 0,
  });

  res.status(200).json({
    status: 'success',
    data: {
      lessons,
    },
  });
});

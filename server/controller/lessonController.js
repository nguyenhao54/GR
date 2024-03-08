const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Lesson = require('../models/lessonModel');
const Class = require('../models/classModel');

const factory = require('./handlerFactory');
const authController = require('./authController');

// exports.setUserIds = catchAsync(async (req, res, next) => {
//   await authController.protect(req, res, next);
//   //   console.log('req params', req);
//   console.log(req.user);
//   if (!req.body.user) {
//     req.body.user = req.user._id;
//   }
//   next();
// });

exports.getAllLessons = factory.getAll(Lesson);
exports.getLesson = factory.getOne(Lesson, { path: 'class' });
exports.createLesson = factory.createOne(Lesson);
exports.updateLesson = factory.updateOne(Lesson);
exports.deleteLesson = factory.deleteOne(Lesson);

exports.getMyLessons = catchAsync(async (req, res, next) => {
  //   console.log(req.user);
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
  const lessons = await Lesson.find({
    class: { $in: [ids] },
  });

  res.status(200).json({
    status: 'success',
    results: classes.length,
    data: {
      lessons,
    },
  });
});

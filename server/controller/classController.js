const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
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

exports.getAllClasses = factory.getAll(Class);
exports.getClass = factory.getOne(Class, { path: 'subject teacher students' });
exports.createClass = factory.createOne(Class);
exports.updateClass = factory.updateOne(Class);
exports.deleteClass = factory.deleteOne(Class);

exports.getMyClasses = catchAsync(async (req, res, next) => {
  //   console.log(req.user);
  const classesRes = await Class.aggregate([
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
  console.log('class', classesRes);
  const classes = await Class.populate(classesRes, {
    path: 'subject teacher',
  });

  res.status(200).json({
    status: 'success',
    results: classes.length,
    data: {
      classes,
    },
  });
});

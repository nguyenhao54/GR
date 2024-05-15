const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Class = require('../models/classModel');
const factory = require('./handlerFactory');
const authController = require('./authController');

exports.getAllClasses = factory.getAll(Class);
exports.getClass = factory.getOne(Class, { path: 'subject teacher students' });
exports.createClass = factory.createOne(Class);
exports.updateClass = factory.updateOne(Class);
exports.deleteClass = factory.deleteOne(Class);

exports.getMyClasses = catchAsync(async (req, res, next) => {
  let classesRes;
  if (req.user.role === 'student') {
    classesRes = await Class.aggregate([
      {
        $unwind: '$students',
      },
      {
        $match: {
          students: req.user._id,
          // semester: req.query.semester,
        },
      },
      { $unset: 'students' },
    ]);
  } else {
    classesRes = await Class.find({
      teacher: req.user._id,
    }).populate("students");
  }
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

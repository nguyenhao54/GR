const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Grade = require('../models/gradeModel');
const factory = require('./handlerFactory');

exports.createGrade = factory.createOne(Grade);
exports.updateGrade = factory.updateOne(Grade);
exports.deleteGrade = factory.deleteOne(Grade);

exports.getMyGrades = catchAsync(async (req, res, next) => {
  const grades = await Grade.find({student: req.user.id})

  res.status(200).json({
    status: 'success',
    results: grades.length,
    data: {
      grades
    },
  });
});

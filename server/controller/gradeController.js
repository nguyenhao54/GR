const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Grade = require('../models/gradeModel');
const Class = require('../models/classModel');
const factory = require('./handlerFactory');

exports.createGrade = factory.createOne(Grade);
exports.getGrade = factory.getAll(Grade);

exports.updateGrade = factory.updateOne(Grade);
exports.deleteGrade = factory.deleteOne(Grade);

exports.getMyGrades = catchAsync(async (req, res, next) => {
  const semester = req.query.semester;
  let grades;
  if (semester) {
    console.log(semester);
    const classes = await Class.aggregate([
      {
        $unwind: '$students',
      },
      {
        $match: {
          students: req.user._id,
          semester: semester,
        },
      },
      { $unset: 'students' },
    ]);
    console.log(classes);
    const ids = classes.map((i) => i._id);
    grades = await Grade.find({ student: req.user.id, class: { $in: ids } });
  } else {
    grades = await Grade.find({ student: req.user.id });
  }
 
  res.status(200).json({
    status: 'success',
    results: grades.length,
    data: {
      grades,
    },
  });
});

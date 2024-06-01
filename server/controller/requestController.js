const catchAsync = require('./../utils/catchAsync');
const Request = require('../models/requestModel');
const factory = require('./handlerFactory');
const Lesson = require('../models/lessonModel');

const Class = require('../models/classModel');
exports.getAllRequests = factory.getAll(Request);
exports.getRequest = factory.getOne(Request);
exports.createRequest = factory.createOne(Request);
exports.updateRequest = factory.updateOne(Request);
exports.deleteRequest = factory.deleteOne(Request);

exports.approveRequest = catchAsync(async (req, res, next) => {
  const request = await Request.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    {
      new: true,
      runValidators: true,
    },
  );

  // Call modifyRelatedAttendance to handle related attendance modification
  if (request && request.status === 'approved') {
    await Request.modifyRelatedAttendance(request);
  }

  res.status(200).json({
    status: 'success',
    data: {
      request,
    },
  });
});

exports.getMyRequests = catchAsync(async (req, res, next) => {
  let requests;
  if (req.user.role === 'student') {
    requests = await Request.find({
      student: req.user._id,
    });
  } else {
    let classes = await Class.aggregate([
      {
        $match: {
          teacher: req.user._id,
        },
      },
      { $unset: 'students' },
    ]);
    const ids = classes.map((i) => i._id);
    const lessons = await Lesson.find({
      class: { $in: ids },
    });
    const lessonIds = lessons.map((i) => i._id);
    requests = await Request.find({ lesson: { $in: lessonIds } }).populate({
      path: 'lesson',
      populate: {
        path: 'class',
        // match: { teacher: req.user._id },
      },
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      requests,
    },
  });
});

// request: lessonId[], reason, photo
exports.createBatch = catchAsync(async (req, res, next) => {
  if (req.body.lessonIds.length > 0) {
    const requests = await Promise.all(
      req.body.lessonIds.map(async (lessonId) => {
        return await Request.create({
          lesson: lessonId,
          reason: req.body.reason,
          photo: req.body.photo,
          student: req.body.student,
        });
      }),
    );

    res.status(200).json({
      status: 'success',
      data: {
        requests,
      },
    });
  }
});

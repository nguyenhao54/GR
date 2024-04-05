const mongoose = require('mongoose');
const validator = require('validator');
const Lesson = require('./lessonModel');
const Attendance = require('./attendanceModel');

const requestSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'denied'],
      default: 'pending',
    },
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

requestSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'lesson',
    populate: {
      path: 'class',
      select: 'teacher',
    },
  }).populate({
    path: "student",
    select: "name codeNumber"
  })
  next();
});

requestSchema.post('save', function () {
  this.contructor.modifyRelatedAttendance(this);
});

requestSchema.statics.modifyRelatedAttendance = async function (request) {
  //// IF REQUEST STATUS IS APPROVED

  if (request.status === 'approved') {
    // find the attendance record for this request lesson and student
    let attendance = await Attendance.find({
      lesson: request.lesson,
      student: request.student,
    });
    console.log(attendance);
    // if there is a record => update it
    if (attendance) {
      await Attendance.findByIdAndUpdate(attendance._id, {
        isSuccessful: true,
      });
    }
    // if no record => create one
    else {
      console.log(
        await Attendance.create({
          lesson: request.lesson,
          student: request.student,
          isSuccessful: true,
        }),
      );
    }
  }
};

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;

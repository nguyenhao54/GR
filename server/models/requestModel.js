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

requestSchema.index({ lesson: 1, student: 1 }, { unique: true });

requestSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'lesson',
    populate: {
      path: 'class',
      select: 'teacher classId',
    },
  }).populate({
    path: 'student',
    select: 'name codeNumber',
  });
  next();
});

requestSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne().clone();
  console.log(this.r, 'findone and');
  next();
});

// requestSchema.post(/^findOneAnd/, function () {
//   console.log('modify related');
//   if (this.r) this.r.constructor.modifyRelatedAttendance(this);
// });

requestSchema.statics.modifyRelatedAttendance = async function (request) {
  //// IF REQUEST STATUS IS APPROVED

  if (request.status === 'approved') {
    // find the attendance record for this request lesson and student
    let attendance = await Attendance.find({
      lesson: request.lesson,
      student: request.student,
    })[0];
    // console.log(attendance, 'âksksksk');
    // if there is a record => update it
    if (attendance) {
      // console.log(attendance, 'attendance');
      await Attendance.findByIdAndUpdate(attendance._id, {
        isSuccessful: true,
      });
    }
    // if no record => create one
    else {
      // console.log(
      await Attendance.create({
        lesson: request.lesson,
        student: request.student,
        isSuccessful: true,
      });
      // );
    }
  }
};

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;

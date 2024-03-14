const mongoose = require('mongoose');
const Lesson = require('./lessonModel');
const validator = require('validator');

function minutesDiff(dateTimeValue2, dateTimeValue1) {
  var differenceValue =
    (dateTimeValue2.getTime() - dateTimeValue1.getTime()) / 1000;
  differenceValue /= 60;
  return Math.abs(Math.round(differenceValue));
}

const attendanceSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.ObjectId,
      ref: 'Lesson',
      required: [true, 'attendance must belong to a Lesson'],
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    isSuccessful: {
      type: Boolean,
      default: false,
    },
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'atendance must belong to a student'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

attendanceSchema.statics.calStatus = async function (attendance) {
  console.log('cjakdjk CALSTATUS');
  const lesson = await Lesson.findById(attendance.lesson);
  if (
    attendance.checkInTime &&
    attendance.checkOutTime &&
    minutesDiff(attendance.checkInTime, attendance.checkOutTime) >=
      (lesson.duration * 2) / 3
  )
    await Attendance.findByIdAndUpdate(attendance._id, {
      ...attendance,
      isSuccessful: true,
    });
};

attendanceSchema.pre(/^findOneAnd/, async function (next) {
  this.attendance = await this.find({ });
  next();
});

attendanceSchema.index({ lesson: 1, student: 1 }, { unique: true });
attendanceSchema.post(/^findOneAnd/, async function () {
  await this.attendance.constructor.calStatus(this.attendance);
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;

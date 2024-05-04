const mongoose = require('mongoose');
const Lesson = require('./lessonModel');
const validator = require('validator');

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

attendanceSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'student',
    select: 'name codeNumber',
  });
  next();
});


attendanceSchema.statics.calStatus = async function (attendance) {
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

attendanceSchema.index({ lesson: 1, student: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;

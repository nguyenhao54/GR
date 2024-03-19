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

attendanceSchema.index({ lesson: 1, student: 1 }, { unique: true });

// attendanceSchema.post('save', function(){
//   this.constructor.calStatus(this.attendance);
// })

// attendanceSchema.pre(/^findOneAnd/, async function (next) {
//   // console.log("pre findOneAnd", this)
//   const queryCriteria = this.getQuery();
//   this.attendance = await this.model.find(queryCriteria);
//   console.log("pre findOneAnd",this.attendance)
//   // const filter = this.getFilter(); // Accessing the filter/query object
//   // console.log("Filter object:", filter);
//   next();
// });

// attendanceSchema.post(/^findOneAnd/, async function () {
//   console.log("post", this)
//   const Animal = mongoose.model('Animal', animalSchema);
//   await this.constructor.calStatus(this.attendance);
// });

// attendanceSchema.pre(/^find/, function (next) {
//   this.populate('lesson', { duration: 1 }), next();
// });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;

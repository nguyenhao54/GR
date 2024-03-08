const mongoose = require('mongoose');
const validator = require('validator');

const attendanceSchema = new mongoose.Schema({
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
},)

attendanceSchema.index({lesson: 1, student: 1}, {unique: true})

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;


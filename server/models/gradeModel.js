const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    processGrade: {
      type: Number,
      min: 0,
      max: 10
    },
    midGrade: {
      type: Number,
      min: 0,
      max: 10
    },
    finalGrade: {
      type: Number,
      min: 0,
      max: 10
    },
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    class: {
      type: mongoose.Schema.ObjectId,
      ref: 'Class',
      required: true
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

gradeSchema.index({ class: 1, student: 1 }, { unique: true });

gradeSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'class',
    select: 'classId _id subject -teacher -students semester',
    populate: { path: 'subject', select: 'title subjectId' },
  });
  next();
});

const Grade = mongoose.model('Grade', gradeSchema);
module.exports = Grade;

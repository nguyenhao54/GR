const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    ProcessGrade: {
      type: Number,
    },
    FinalGrade: {
      type: Number,
    },
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    class: {
      type: mongoose.Schema.ObjectId,
      ref: 'Class',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

gradeSchema.index({ student: 1, class: 1 }, { unique: true });

gradeSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'class',
    select: 'classId _id',
    populate: { path: 'subject', select: 'title subjectId' },
  });
  next();
});

const Grade = mongoose.model('Grade', gradeSchema);
module.exports = Grade;

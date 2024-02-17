const mongoose = require('mongoose');
const validator = require('validator');

const subjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, 'subject must have a title'],
    },
    subjectId: {
      type: String,
      unique: true,
      require: [true, 'subject must have an id'],
      uppercase: true,
    },
    numberOfCredits: {
      type: Number,
      require: [true, 'please specify nunber of credits for this subject'],
    },
    gradeCoefficient: {
      type: Number,
      max: 1,
      min: 0,
      require: [true, 'please specify grade coefficient for this subject'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;

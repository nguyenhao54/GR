const mongoose = require('mongoose');
const validator = require('validator');

const lessonSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.ObjectId,
      ref: 'Class',
      required: [true, 'lesson must belong to a Class'],
    },
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

lessonSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'class',
    // select: "name subjectId  title codeNumber"
  }),
    next();
});

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;

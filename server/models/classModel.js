const mongoose = require('mongoose');
const validator = require('validator');
const Lesson = require('./lessonModel');

const classSchema = new mongoose.Schema(
  {
    classId: {
      type: String,
      unique: true,
      required: [true, 'class must have an id'],
    },
    subject: {
      type: mongoose.Schema.ObjectId,
      ref: 'Subject',
      required: [true, 'class must belong to a subject'],
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    students: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User',
    },
    dayOfWeek: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    firstStartTime: {
      // buổi học đầu
      type: Date,
    },
    lastStartTime: {
      type: Date,
    },
    semester: {
      type: Number,
    },
    location: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      description: {
        type: String,
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

classSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'subject students',
    select: 'name subjectId title codeNumber gradeCoefficient',
  });
  // }
  // if (this._fields.teacher) {
  this.populate({
    path: 'teacher',
    select: 'name email',
  });
  next();
});

classSchema.statics.addRelatedLessons = async function (classInfo) {
  let startTime = classInfo.firstStartTime;
  for (
    startTime;
    startTime.getTime() < classInfo.lastStartTime.getTime();
    startTime = new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000)
  ) {
    const endTime = new Date(
      startTime.getTime() + classInfo.duration * 60 * 1000,
    );
    await Lesson.create({
      class: classInfo._id,
      startDateTime: startTime,
      endDateTime: endTime,
    });
  }
};

classSchema.statics.deleteRelatedLessons = async function (classInfo) {
  await Lesson.deleteMany({
    class: classInfo._id,
  });
};

classSchema.post('save', function () {
  this.constructor.addRelatedLessons(this);
});

classSchema.post('findOneAndDelete', async function () {
  await Lesson.deleteMany({
    class: this._id,
  });
});

const Class = mongoose.model('Class', classSchema);
module.exports = Class;

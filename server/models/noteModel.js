const mongoose = require('mongoose');
const Lesson = require('./lessonModel');
const validator = require('validator');

const noteSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.ObjectId,
      ref: 'Lesson',
      required: [true, 'note must belong to a Lesson'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'note must belong to an user'],
    },
    content: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

noteSchema.index({ lesson: 1, student: 1 }, { unique: true });

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;

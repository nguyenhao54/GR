const mongoose = require('mongoose');
const validator = require('validator');

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
    location: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Class = mongoose.model('Class', classSchema);
module.exports = Class;

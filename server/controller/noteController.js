const Note = require('../models/noteModel');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getAllNotes = factory.getAll(Note);
exports.createNote = factory.createOne(Note);
exports.getNote = factory.getOne(Note);

exports.updateNote = factory.updateOne(Note);
exports.deleteNote = factory.deleteOne(Note);

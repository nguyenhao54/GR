const express = require('express');
const authController = require('./../controller/authController');
const noteController = require('./../controller/noteController');
const router = express.Router({ mergeParams: true });
router
  .route('/')
  .get(noteController.getAllNotes)
  .post(
    authController.protect,
    noteController.createNote,
  );

router
  .route('/:id')
  .get(noteController.getNote)
  .delete(noteController.deleteNote)
  .patch(
    noteController.updateNote,
  );

module.exports = router;

const express = require('express');
const authController = require('./../controller/authController');
const reviewController = require('./../controller/reviewController');
const router = express.Router({ mergeParams: true });
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post( authController.protect,
    reviewController.setTourUserIds,
    reviewController.createReview );
  

router.route( '/:id' )
  .get(reviewController.getReview)
  .delete( reviewController.deleteReview )
  .patch( authController.restrictTo("user", "admin"), reviewController.updateReview );

module.exports = router;

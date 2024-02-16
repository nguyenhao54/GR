const express = require('express');
const tourRouter = express.Router();
const tourController = require( './../controller/tourController' );
const authController = require( './../controller/authController' );
// const reviewController = require( './../controller/reviewController' );
const reviewRouter = require( './reviewRouter' );



// tourRouter
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview,
//   ); 
tourRouter.use( '/:tourId/reviews', reviewRouter );

tourRouter.route('/top-5-cheap').get(tourController.aliasTopTour,tourController.getAllTours)
tourRouter.route( '/tour-stats' ).get( tourController.getTourStats )
tourRouter.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

tourRouter.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin)

tourRouter.route("/distances/:latlng/unit/:unit").get(tourController.getDistances)

// tourRouter.param( 'id', tourController.checkID ) //apply middleware
tourRouter
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post( authController.protect,
    authController.restrictTo( "admin", "lead-guide" ),
    tourController.createTour );

tourRouter
  .route('/:id')
  .get(tourController.getOneTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo( 'admin' ),
    tourController.deleteTour,
  );


module.exports = tourRouter;

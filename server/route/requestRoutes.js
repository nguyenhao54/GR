const express = require('express');
const router = express.Router();
const requestController = require('../controller/requestController');
const authController = require('../controller/authController');

router.route('/').get(requestController.getAllRequests).post(
  authController.protect,
  // authController.restrictTo('admin'),
  requestController.createRequest,
);
router.get('/my', authController.protect, requestController.getMyRequests);

router
  .route('/createBatch')
  .post(authController.protect, requestController.createBatch);


// router
//   .route('/deny/:id')
//   .patch(
//     authController.protect,
//     authController.restrictTo('teacher'),
//     requestController.denyRequest,
//   );

router
  .route('/:id')
  .get(requestController.getRequest)
  .patch(
    authController.protect,
    requestController.updateRequest,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    requestController.deleteRequest,
  );

  router
  .route('/:id/approve')
  .patch(
    authController.protect,
    authController.restrictTo('teacher'),
    requestController.approveRequest,
  );


module.exports = router;

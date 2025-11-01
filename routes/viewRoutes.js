const express = require('express');
// eslint-disable-next-line import/newline-after-import
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// router.get('/', (req, res) => {
//   res.status(200).render('base', {
//     title: 'The Forest Hiker',
//     user: 'Hassan Osama',
//   });
// });

router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);

router.get('/my-tours', authController.protect, viewsController.getMyTours);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData,
);
//router.get('/login', viewsController.getLoginForm);

module.exports = router;

const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alert = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      "Your booking was successful! If your booking doesn't show up immediately, please come back later.";
  } else {
    res.locals.alert = null;
  }
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  //1 get tour data
  const tours = await Tour.find();
  //2 build template

  //3 render the template

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //get data including reviews we guides
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with this name!', 404));
  }

  //build template
  //console.log('User in locals:', res.locals.user); test for profile data consistency

  //render template
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    locations: JSON.stringify(tour.locations),
  });
});

// In viewsController.js
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account',
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

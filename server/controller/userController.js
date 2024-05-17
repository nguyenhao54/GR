const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModel');
const factory = require('./handlerFactory');
const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = factory.getAll(User);
exports.getOneUser = factory.getOne(User);
exports.createUser = (req, res) => {};
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //create error of user posts password data

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'this is not for password update, plese use updatePassword',
        400,
      ),
    );
  }
  //filter not allowed update fields name
  const filteredObj = filterObj(
    req.body,
    'name',
    'email',
    'DOB',
    'phone',
    "photo",
    // add can  update fields here
    'codeNumber',
    'faculty',
    "major"
  );
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredObj, {
    new: true,
    runValidators: true,
  });

  ///
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  console.log('deleete me');
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

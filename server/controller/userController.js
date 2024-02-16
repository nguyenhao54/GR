const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModels');
const factory = require('./handlerFactory')
const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = factory.getAll(User)
exports.getOneUser = factory.getOne(User)
exports.createUser = (req, res) => {};
exports.updateUser = (req, res) => {};
exports.deleteUser = factory.deleteOne(User)

exports.getMe = ( req, res, next ) =>
{ 
  req.params.id= req.user.id
  next()
}

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
  const filteredObj = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
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
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

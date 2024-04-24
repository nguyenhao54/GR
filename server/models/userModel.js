const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
  },
  codeNumber: {
    type: Number,
    select: true,
    // required: [true, 'User must have an ID'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email is invalid'],
    required: [true, 'User must have a email'],
  },
  phone: {
    type: String,
    unique: true,
    validate: [validator.isMobilePhone, 'Phone is invalid'],
    required: [true, 'User must have a phone number'],
  },
  DOB: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
  password: {
    type: String,
    required: [true, 'User must have a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password m'],
    validate: {
      // THIS ONLY WORK ON CREATE AND SAVE OBJECTS : USer.create; User.save
      //can not use arrow function bcs need to use this key word
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password confirm does not match your password',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  major: {
    type: String,
  },
  faculty: {
    type: String,
    // required: [true, 'User must have a faculty'],
  },
  active: {
    type: Boolean,
    default: true,
    // select: false,
  },
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    console.log(changedTimestamp, JWTTimestamp);

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(resetToken);
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

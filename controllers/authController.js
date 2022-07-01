import { promisify } from 'util';

import jwt from 'jsonwebtoken';

import User from './../models/userModel';
import AppError from './../utils/appError';
import { catchAsync } from './../utils/catchAsync';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email&pw exists
  if (!email || !password) {
    return next(new AppError(400, 'Please provide email and password'));
  }
  //check if user exist and pw is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(401, 'Incorrect email or password!'));
  }

  //if everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  //getting token and check if exist
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError(401, 'You are not logged in! Please log in to get access')
    );
  }

  //verification tokens(check if the token payload has not been manipulated by a 3rd party)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  //check if user still exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(
      new AppError(401, 'The user belonging to this token does not exist.')
    );
  //check if user changed pw after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError(401, 'User currently changed password! PLease login again')
    );

  //GRANT ACCESS to protected route
  req.user = freshUser;
  next();
});

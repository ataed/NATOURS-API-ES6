import jwt from 'jsonwebtoken';

import User from '../models/userModel';
import AppError from './../utils/appError';
import { catchAsync } from './../utils/catchAsync';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({ name, email, password, passwordConfirm });

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

import { catchAsync } from './../utils/catchAsync';
import AppError from './../utils/appError';
import User from './../models/userModel';

import { getAll, getOne, updateOne, deleteOne } from './factoryHandler';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        400,
        'This route is not for password updates! Please use /updateMyPassword to change your password'
      )
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});

export const createUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    message: 'This route is not defined! Please use /signup instead',
  });
};

export const getAllUsers = getAll(User);
export const getUser = getOne(User);
export const deleteUser = deleteOne(User);
export const updateUser = updateOne(User);

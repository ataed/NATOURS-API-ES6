import express from 'express';

import {
  getAllUsers,
  getUser,
  deleteMe,
  updateMe,
} from '../controllers/userController';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} from '../controllers/authController';
const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.route('/').get(protect, restrictTo('admin'), getAllUsers);
router.route('/:id').get(getUser);

export default router;

import express from 'express';

import {
  getAllUsers,
  getUser,
  deleteMe,
  updateMe,
  updateUser,
  deleteUser,
  createUser,
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
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

//Protect all routes after this middleware
router.use(protect);

router.patch('/updateMyPassword', updatePassword);
// router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
export default router;

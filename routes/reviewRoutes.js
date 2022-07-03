import express from 'express';

import {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} from './../controllers/reviewController';
import { protect, restrictTo } from './../controllers/authController';

const router = express.Router();

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);
router
  .route('/:id')
  .get(getReview)
  .patch(protect, updateReview)
  .delete(deleteReview);

export default router;

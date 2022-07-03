import express from 'express';

import {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  setTourUserIds,
} from './../controllers/reviewController';
import { protect, restrictTo } from './../controllers/authController';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, createReview);
router
  .route('/:id')
  .get(getReview)
  .patch(protect, updateReview)
  .delete(deleteReview);

export default router;

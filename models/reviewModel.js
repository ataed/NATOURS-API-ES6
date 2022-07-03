import mongoose from 'mongoose';
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,

      max: 5,
      min: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },

    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      reqired: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;

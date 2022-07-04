import mongoose from 'mongoose';
const { Schema } = mongoose;
import Tour from './tourModel';

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
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);
  stats.length > 0
    ? await Tour.findByIdAndUpdate(tourId, {
        ratingsAverage: stats[0].avgRating,
        ratingsQuantity: stats[0].nRating,
      })
    : await Tour.findByIdAndUpdate(tourId, {
        ratingsAverage: 4.5,
        ratingsQuantity: 0,
      });
};

reviewSchema.post('save', function (doc, next) {
  //this point to the current review
  //this.constuctor ~~ Model
  this.constructor.calcAverageRatings(this.tour);
  next();
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne().clone();
  next();
});
reviewSchema.post(/^findOneAnd/, async function (doc, next) {
  await this.r.constructor.calcAverageRatings(this.r.tour);
  next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

import Tour from '../models/tourModel';
import User from '../models/userModel';
import Review from '../models/reviewModel';

dotenv.config({ path: './config.env' });

const URI = process.env.ATLAS_URI.replace(
  '<password>',
  process.env.URI_PASSWORD
);
mongoose
  .connect(URI)
  .then(() => console.log('Successfully connected to DB!'))
  .catch((err) => console.log(err));

const tours = JSON.parse(
  readFileSync(new URL('./tours.json', import.meta.url))
);
const users = JSON.parse(
  readFileSync(new URL('./users.json', import.meta.url))
);
const reviews = JSON.parse(
  readFileSync(new URL('./reviews.json', import.meta.url))
);
// console.log(tours);
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);

    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// console.log(process.argv);

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

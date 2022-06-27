import mongoose from 'mongoose';
import dotenv from 'dotenv';

import app from './app';

dotenv.config({ path: './config.env' });

const URI = process.env.ATLAS_URI.replace(
  '<password>',
  process.env.URI_PASSWORD
);
mongoose
  .connect(URI)
  .then(() => console.log('done'))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App runing on port : ${port}....`);
});

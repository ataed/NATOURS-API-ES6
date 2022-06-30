import mongoose from 'mongoose';
import dotenv from 'dotenv';

import app from './app';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🤯 Shutting down....');
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: './config.env' });

const URI = process.env.ATLAS_URI.replace(
  '<password>',
  process.env.URI_PASSWORD
);
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log('done'))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App runing on port : ${port}....`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHADLED REJECTION! 🤯 Shutting down....');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

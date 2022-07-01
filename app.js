import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';

import { globalErrorHandler } from './controllers/errorController';

import AppError from './utils/appError';

dotenv.config({ path: './config.env' });

const app = express();

//1) Middlewares
process.env.NODE_ENV === 'development' && app.use(morgan('dev'));
app.use(express.json());
// app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// for undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

//ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

export default app;

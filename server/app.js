const express = require('express');
const morgan = require('morgan');
const app = express();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./route/tourRoutes');
const userRouter = require('./route/userRoutes');
const reviewRouter = require('./route/reviewRouter');
const subjectRouter = require('./route/subjectRoutes');
const classRouter = require('./route/classRoutes');
const lessonRouter = require('./route/lessonRoutes');
const gradeRouter = require('./route/gradeRoutes');
const attendanceRouter = require('./route/attendanceRoutes');
const requestRouter = require('./route/requestRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //can only sent 100 request in 1 hour
  message: 'To many requests sent, please try again later',
});

app.use('/api', limiter);
app.use(helmet());
app.use(
  cors({
    // credentials: true,
    origin: true,
  }),
);

app.use(express.json({ limit: '10kb' })); //add middleware to middleware stack

// data sanitization against QL injection
app.use(mongoSanitize());

//agains xss
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/subjects', subjectRouter);
app.use('/api/v1/classes', classRouter);
app.use('/api/v1/lessons', lessonRouter);
app.use('/api/v1/grades', gradeRouter);
app.use('/api/v1/attendances', attendanceRouter);
app.use('/api/v1/requests', requestRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4 params => express autpmatically know this is the middleware to handle errors
app.use(globalErrorHandler);

module.exports = app;

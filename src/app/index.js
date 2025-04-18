const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const CustomError = require('../utils/Error.js');
const errorMiddleware = require('../middlewares/error.middleware.js');

// initializing the express application
const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// routes import
const calendarRouters = require('../modules/calendar/routes.js');
const scheduleRouters = require('../modules/schedules/routes.js');

// routes declaration
app.use('/api/v1/calendar', calendarRouters);
app.use('/api/v1/schedules', scheduleRouters);

// health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Catalog Service is up and running',
  });
});

// Not Found Handler
app.use((_req, res) => {
  const error = CustomError.notFound({
    message: 'Resource Not Found',
    errors: ['The requested resource does not exist'],
    hints: 'Please check the URL and try again',
  });

  res.status(error.status).json({ ...error, status: undefined });
});

// Global Error Handler
app.use(errorMiddleware);

// export the app
module.exports = app;

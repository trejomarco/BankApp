const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// errors management - class
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

// routers
const usersRouter = require('./routes/users.routes');
const transfersRouter = require('./routes/transfers.routes');

// starting app
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//routes
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/transfers', transfersRouter);

// errors
app.all('*', (req, res, next) => {
  return next(
    new AppError(`Cant find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;

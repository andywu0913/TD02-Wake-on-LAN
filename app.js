require('module-alias/register');

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const addressRouter = require('@routes/address');
const wakeRouter = require('@routes/wake');
const lanRouter = require('@routes/lan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public/')));

// allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use('/api/address', addressRouter);
app.use('/api/wake', wakeRouter);
app.use('/api/LAN', lanRouter);

app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/', 'index.html')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// default error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

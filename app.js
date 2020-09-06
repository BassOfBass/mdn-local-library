// import useful node libraries 
var createError = require('http-errors');
var express = require('express');
/**
 * A core Node library for parsing file and directory paths.
 */
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// add the middleware libraries into the request handling chain
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// get Express to serve all the static files in the /public directory in the project root.
app.use(express.static(path.join(__dirname, 'public')));

// add our (previously imported) route-handling code to the request handling chain. The imported code will define particular routes for the different parts of the site:
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// import useful node libraries 
const createError = require('http-errors');
const express = require('express');
/**
 * A core Node library for parsing file and directory paths.
 */
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

// establish routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const wikiRouter = require("./wiki.js");
const catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site

const app = express();
//Set up mongoose connection
let mongoose = require('mongoose');
const PRIVATEDATA = require('./private-data-do-not-steal');

let mongoDB = PRIVATEDATA.url;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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
app.use("/wiki", wikiRouter);
app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use((req, res, next) => {
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

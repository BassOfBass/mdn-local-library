import createError from 'http-errors';
import express from 'express';
import compression from "compression";
import helmet from "helmet";
import { fileURLToPath } from "url";
import { join, dirname } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import session from "express-session";
import connectMongo from "connect-mongo";
import passport from "passport";


// local imports
import { getCloudTags } from './libs/server/get-cloud-tags.js';
import { initializePassport } from "./libs/server/authorization.js"; 


// establish routers
import indexRouter from './routes/index.js';
import authRouter from "./routes/authorization.js"
import usersRouter from './routes/users.js';
import wikiRouter from "./routes/wiki.js";
import catalogRouter from './routes/catalog.js';
import blogRouter from "./routes/blog.js";
import apiRouter from "./routes/api/index.js"

// https://nodejs.org/api/esm.html#esm_no_require_exports_module_exports_filename_dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MongoStore = connectMongo(session);

const app = express();

//Set up mongoose connection
let mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.addListener("once", () => {
  console.log("Database connected");
})
db.addListener('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

// add the middleware libraries into the request handling chain
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); // compress all routes
app.use(helmet());
// get Express to serve all the static files in the /public directory in the project root.
app.use(express.static(join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: "sessions"
  }),
  cookie: {
    secure: false
  }
}));

initializePassport(app, passport);

// app.locals.tagCloud = getCloudTags();

app.use('/', indexRouter);
app.use("/authorization", authRouter);
app.use('/users', usersRouter);
app.use("/wiki", wikiRouter);
app.use('/catalog', catalogRouter);
app.use('/blog', blogRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;

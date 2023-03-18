require('dotenv').config()
require('express-async-errors')
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport')
const session = require('express-session')
const User = require('./models/User');
const connectDB = require('./db/connect')
const methodOverride = require('method-override')
const engine = require('ejs-mate')
//fake posts generator
// const genFakePosts = require('./seed')
// genFakePosts()


//require routes

const indexRouter = require('./routes/index');

const postRouter = require('./routes/posts')
const reviewRouter = require('./routes/reviews')
//middlewares
const authenticateUser = require('./middleware/authenticat');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();
// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))
//config express-session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'souli souli hassoun',
  resave: false,
  saveUninitialized: true
}))
//config passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Pre-routes middleware

app.use((req, res, next) => {
  req.user = {
    "_id": "6411f57de28ec365fb1cdc3d",
    "username": "mimoune"
  }
  // req.user = {
  //   "_id": "64142eefcac19e4e9243c0ff",
  //   "username": "soulim"
  // }
  // req.user = {
  //   "_id": "641194519b8d073a4029206b",
  //   "username": "soulimani"
  // }
  res.locals.currentUser = req.user
  res.locals.title = 'Surf Shop'
  res.locals.success = req.session.success || '';


  delete req.session.success;

  res.locals.error = req.session.error || ''
  delete req.session.error
  next()
})
//routes
app.use('/', indexRouter);
app.use('/posts', postRouter)
app.use('/posts/:id/reviews', reviewRouter)

// // catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  req.session.error = err.message
  res.redirect('back')
});
// app.use(notFoundMiddleware)
// app.use(errorHandlerMiddleware)

module.exports = app;

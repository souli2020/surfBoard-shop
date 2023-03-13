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
require('dotenv').config()
require('express-async-errors')


//require routes

const indexRouter = require('./routes/index');
const postRouter = require('./routes/posts')
const reviewRouter = require('./routes/reviews')
//middlewares
const authenticateUser = require('./middleware/authenticat');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();

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
//routes
app.use('/', indexRouter);
app.use('/posts', postRouter)
app.use('/posts/:id/reviews', reviewRouter)

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

module.exports = app;

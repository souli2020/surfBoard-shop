require('dotenv').config()
require('express-async-errors')
const favicon = require('serve-favicon');
const session = require('express-session')
const cors = require('cors');

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport')
const User = require('./models/User');
const connectDB = require('./db/connect')
const methodOverride = require('method-override')
const engine = require('ejs-mate')
//fake posts generator
// const genFakePosts = require('./seed')
// genFakePosts()
const app = express();
app.use(cors())
//config express-session
// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'souli souli hassoun',
  resave: false,
  saveUninitialized: true
}))

//require routes

const indexRouter = require('./routes/index');

const postRouter = require('./routes/posts')
const reviewRouter = require('./routes/reviews')
//middlewares
const authenticateUser = require('./middleware/authenticat');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const isLoggin = require('./middleware/checkLog')




// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))

//config passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//Pre-routes middleware

app.use((req, res, next) => {
  // console.log(req.session)
  res.locals.currentUser = req.user
  res.locals.title = 'Surf Shop'
  res.locals.success = req.session.success || '';

  req.session.redirectTo = req.originalUrl

  delete req.session.success;

  res.locals.error = req.session.error || ''

  delete req.session.error
  next()
})
//routes
app.use('/', indexRouter);
app.use('/posts', isLoggin, postRouter)
app.use('/posts/:id/reviews', isLoggin, reviewRouter)

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

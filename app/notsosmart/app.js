var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var lotteryRouter = require('./routes/lottery');
var checklotteryRouter = require('./routes/checklottery');
var negateRouter = require('./routes/negate');
var checkNegateRouter = require('./routes/checknegate');
var recycleRouter = require('./routes/recycle');
var checkRecycleRouter = require('./routes/checkrecycle');
var viewNftRouter = require('./routes/viewnft');
var reportRouter = require('./routes/report');
var checkReportRouter = require('./routes/checkreport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/lottery', lotteryRouter);
app.use('/checklottery', checklotteryRouter);
app.use('/users', usersRouter);
app.use('/negate', negateRouter);
app.use('/checknegate', checkNegateRouter);
app.use('/recycle', recycleRouter);
app.use('/checkrecycle', checkRecycleRouter);
app.use('/viewnft', viewNftRouter);
app.use('/report', reportRouter);
app.use('/checkreport', checkReportRouter);

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

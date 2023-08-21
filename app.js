var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var figureRouter = require('./routes/figure');
var dollRouter = require('./routes/doll');
var shopRouter = require('./routes/shop');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : false}))
app.use(session({
  secret: 'be6f20598b835cd8feb99e618b24879d7b61fc56c2f663f228aa991651dbcb18',
  resave: false,
  saveUninitialized: true,
}));
var hbs = require('hbs');
hbs.registerHelper('dateFormat', require('handlebars-dateformat')); 
var mongoose = require('mongoose');
var uri = "mongodb+srv://thanhnbgch211319:oPhXV5grWtOrkoLc@cluster0.q3dgrym.mongodb.net/asm";
mongoose.connect(uri)
.then(() => console.log('connect to db succeed'))
.catch((err) => console.log(err));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/figure', figureRouter);
app.use('/doll', dollRouter);
app.use('/shop', shopRouter);

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
app.listen(process.env.PORT || 3001);
module.exports = app;

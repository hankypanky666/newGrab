var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');

var Model = require('./models/user');

var routes = require('./routes/index');
var users = require('./routes/users');
var news = require('./routes/news');
var signin = require('./routes/signin');
var logout = require('./routes/logout');


var app = express();


passport.use(new LocalStrategy(function (username, password, done) {
    new Model.User({
        username: username
    }).fetch().then(function (data) {
        var user = data;
        if (user !== null) {
            user = data.toJSON();
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, {message: 'Invalid password'});
            } else {
                return done(null, user);
            }
        }
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    new Model.User({username: username}).fetch().then(function (user) {
        done(null, user);
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'secret strategic xxzzz code'}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/news', news);
app.use('/signin', signin);
app.use('/logout', logout);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

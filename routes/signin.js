var express = require('express');
var router = express.Router();

var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

var Model = require('../models/user');

router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('signin', {
            title: 'Login'
        });
    }
});

router.post('/', function (req, res, next) {
    var user = req.body;
    var usernamePromise = null;
    usernamePromise = new Model.User({
        username: user.username
    }).fetch();
    //console.log(req.body);
    return usernamePromise.then(function (model) {
        if (model) {
            signInPost(req, res, next);
        } else {
            //****************************************************//
            // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
            //****************************************************//
            var password = user.password;
            var hash = bcrypt.hashSync(password);

            var signUpUser = new Model.User({
                username: user.username,
                password: hash
            });

            signUpUser.save().then(function (model) {
                // sign in the newly registered user
                signInPost(req, res, next);
            });
        }
    });
});

var signInPost = function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/signin'
    }, function (err, user, info) {
        if (err) {
            //console.log(req.body);
            return res.render('signin', {title: 'Sign In', errorMessage: err.message});
        }

        if (!user) {
            //console.log(arguments);
            return res.render('signin', {title: 'Sign In', errorMessage: info.message});
        }
        return req.logIn(user, function (err) {
            if (err) {
                return res.render('signin', {title: 'Sign In', errorMessage: err.message});
            } else {
                return res.redirect('/');
            }
        });
    })(req, res, next);
};

module.exports = router;
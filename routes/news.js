var express = require('express');
var router = express.Router();
var Model = require('../models/Articles');

router.get('/', function (req, res, next) {
    //console.log(user);
    // как это проще реализовать?
    if (req.isAuthenticated()) {
        Model.Article.forge()
            .fetchAll()
            .then(function(configs) {
                res.render('news', {
                    title: 'news',
                    user: req.user,          //sending user data from passport session
                    data: configs.toJSON()
                });
                console.log(configs.toJSON());
            });

    } else {
        res.redirect('/signin');
    }

});


module.exports = router;
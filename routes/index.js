var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var urlutils = require('url');

var Model = require('../models/Config');
var Article = require('../models/Articles');

/* GET home page. */
router.get('/', function (req, res, next) {
    //console.log(req.query);
    if (req.query.url) {
        //console.log(urlutils.parse(req.query.url, true));
        var params = urlutils.parse(req.query.url, true);
        params['article'] = '.b-posts-1-item__text';
        params['nameArticle'] = req.query.name;
        //console.log(params);

        returnArticle(params, function (err, Data) {
            //console.log(Data);
            res.send({
                articleFull: Data,
                resource: params.siteUrl,
                resourceLink: params.href,
                nameArticle: params.nameArticle
            });
        });
    } else {
        if (!req.isAuthenticated()) {
            res.redirect('/signin');
        } else {
            var user = req.user;

            if (user !== undefined) {
                user = user.toJSON();
            }
            Model.Config.forge()
                .fetchAll()
                .then(function(configs) {
                    res.render('index', {
                        title: 'grabber',
                        user: user,
                        data: configs.toJSON()
                    });
                    //console.log(configs.toJSON());
                });
        }
    }

});


/**
 * get params from form on main page
 */
router.post('/', function(req, res, next){
    var param = {
        siteUrl: req.body.siteUrl,
        article: deleteDot(req.body.article),
        articleHeader: req.body.articleHeader,
        save: req.body.save
    };
    //console.log(param);
    if (param.save === 'true'){
        var configPromise = null;
        configPromise = new Model.Config({
            configName: param.siteUrl
        }).fetch();
        //console.log(req.body);
        return configPromise.then(function (model) {
            if (model) {
                res.send({message: 'This config exists!'});
            } else {
                var configName = param.siteUrl;
                var config = JSON.stringify(param);

                var saveConfig = new Model.Config({
                    configName: configName,
                    config: config
                });

                saveConfig.save().then(function (model) {
                    // sign in the newly registered user
                    res.send({message: 'This config saved!'});
                });
            }
        });
    } else {
        //console.log('grab');
        grabber(param, function(err, Data){
            if (!err){
                res.send({
                    articles: Data,
                    parsed: err,
                    user: req.user
                });
            } else {
                res.send({
                    message: "Error!"
                });
            }

        });
    }
});


router.post('/save', function(req, res, next){
    //console.log(req.body.title);
    var saveArticle = new Article.Article({
       userId: req.user.id,
       nameArticle: req.body.title,
       content: req.body.content,
       link: req.body.url
    });

    saveArticle.save().then(function(save){
        res.send({message: 'ok'});
    });
});

/**
 * returnArticle - return text
 * @param param
 * @param callback
 */
var returnArticle = function(param, callback){
    request(param.href, function (error, response, html) {
        if (!error && response.statusCode === 200) {
            var $ = cheerio.load(html),
                Data = [];
            $(param.article).each(function(i, element){
                var article = $(this).find('p');

                Data.push({
                    article: article.text()
                });
            });
            callback(false, Data);
        } else {
            callback(true, '');
        }
    });
};

/**
 * grabber - grab list of news
 * @param param
 * @param callback
 */
var grabber = function(param, callback){
    request(param.siteUrl, function (error, response, html) {
        if (!error && response.statusCode === 200) {
            var $ = cheerio.load(html),
                Data = [];
            $(param.article).each(function(i, element){
                var name = $(this).find(param.articleHeader);
                var link = $(this).find(param.articleHeader + ' > a').attr('href');

                Data.push({
                    name: name.text(),
                    link: link
                });
            });
            callback(false, Data);
        } else {
            callback(true, '');
        }
    });
};

/**
 * deleteDot - remove dot from tag
 * @param tag
 * @returns {*}
 */
function deleteDot(tag) {
    if (~tag[0].indexOf('.')) {
        return tag;
    } else {
        return '.' + tag;
    }
}

module.exports = router;


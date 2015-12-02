var DB = require('./db').DB;


var Article = DB.Model.extend({
    tableName: 'tblArticles',
    idAttribute: 'articleId',
});

module.exports.Article = Article;
var DB = require('./db').DB;


var User = DB.Model.extend({
    tableName: 'tblUsers',
    idAttribute: 'userId',
});
console.log(User.toString());

module.exports.User = User;
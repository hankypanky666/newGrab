var DB = require('./db').DB;


var Config = DB.Model.extend({
    tableName: 'tblConfigs',
    idAttribute: 'configId',
});

module.exports.Config = Config;
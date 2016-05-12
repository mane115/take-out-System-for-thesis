var mongoose = require("mongoose");
var initMongoose = function() {
    var db = tool.getMyModule("config/database");
    mongoose.connection.on('error', function(err) {
        console.error(err);
    });
    mongoose.connection.on('disconnected', function() {
        mongoose.connect(db.url, db.options);
    });
    mongoose.connect(db.url, db.options);
}
var loadModel = function() {
    tool.getMyModule("models/test");
    tool.getMyModule('models/customer');
    tool.getMyModule('models/seller');
    tool.getMyModule('models/goods');
    tool.getMyModule('models/order');
};
var init = function() {
    loadModel();
    initMongoose();
}

var getModel = function(name) {
    return mongoose.model(name);
};


var getConnection = function() {
    return mongoose.connection;
}
init();

module.exports = {
    getModel: getModel,
    ObjectId: mongoose.Types.ObjectId,
    getConnection: getConnection
}
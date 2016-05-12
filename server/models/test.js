var mongoose = require("mongoose");
var schema = null;

var createSchema = function() {
	var test = {
		accountName: String,
		password:String
	};
	schema = new mongoose.Schema(test);
};

var createIndex = function() {


};


var init = function() {
	createSchema();
	createIndex();
	mongoose.model("Test", schema);
}

init();
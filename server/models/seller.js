var mongoose = require("mongoose");
var schema = null;

var createSchema = function() {
	var seller = {
		accountName: String,
		name: String,
		password: String,
		address: String,
		phone: Number,
		cash: {
			type: Number,
			default: 0
		}
	};
	schema = new mongoose.Schema(seller);
};
var createIndex = function() {


};
var init = function() {
	createSchema();
	createIndex();
	mongoose.model("Seller", schema);
}

init();
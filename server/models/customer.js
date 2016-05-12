var mongoose = require("mongoose");
var schema = null;

var createSchema = function() {
	var customer = {
		accountName: String,
		name: String,
		password: String,
		address: String,
		phone: Number,
		cash: {
			type: Number,
			default: 0
		},
		collect: [{
			goodsId: String,
			goodsName: String,
			sellerName: String
		}]
	};
	schema = new mongoose.Schema(customer);
};

var createIndex = function() {


};


var init = function() {
	createSchema();
	createIndex();
	mongoose.model("Customer", schema);
}

init();
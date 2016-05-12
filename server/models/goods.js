var mongoose = require("mongoose");
var schema = null;

var createSchema = function() {
	var goods = {
		sellerName: String,
		name: String,
		details: String,
		price: Number,
		photo: String,
		quantity: String,
		hot: {
			type: Number,
			default: 0
		},
		commit: [{
			author: String,
			content: String,
			date: {
				type: Date,
				default: Date.now()
			}
		}]
	};
	schema = new mongoose.Schema(goods);
};

var createIndex = function() {


};


var init = function() {
	createSchema();
	createIndex();
	mongoose.model("Goods", schema);
}

init();
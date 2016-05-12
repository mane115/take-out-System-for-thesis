var mongoose = require("mongoose");
var schema = null;

var createSchema = function() {
	var order = {
		// sellerInfo: {
		// 	accountName: String,
		// 	address: String,
		// 	phone: Number
		// },
		customerInfo: {
			accountName: String,
			address: String,
			phone: Number
		},
		// goodsInfo: {
		// 	goodsId: String,
		// 	goodsName: String,
		// 	price: Number,
		// 	quantity: Number
		// },
		// statu: String,
		// date: {
		// 	type: Date,
		// 	default: Date.now()
		// },
		// sellerName: String,
		// customerName: String,
		isCommited: {
			type: Boolean,
			default: false
		}
	};
	schema = new mongoose.Schema(order);
};

var createIndex = function() {


};


var init = function() {
	createSchema();
	createIndex();
	mongoose.model("Order", schema);
}

init();
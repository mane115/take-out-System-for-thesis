var proxy = tool.getMyModule("models/mongoose_proxy");
var Seller = proxy.getModel("Seller");
var Order = proxy.getModel('Order');
var Customer = proxy.getModel('Customer')
var dbTool = tool.getMyModule("utils/db");

var getCustomerInfo = function(){
	return new Promise((success,fail)=>{
		return Customer.find({}).exec(dbTool.getCallBackForQuery(success,fail))
	})
}
var getAccountInfo = function(accountInformation) {
	var handleFun = function(success, fail) {
		console.log('getAccountInfo')
		var account = {
			accountName: accountInformation.accountName
		};
		Seller.findOne(account, function(e, data) {
			if (e) fail(30001);
			else {
				accountInformation.info = data;
				success(accountInformation)
			}
		})
	}
	return newPromise = new Promise(handleFun)
}
var comparePassword = function(accountInformation) {
	var handleFun = function(success, fail) {
		console.log('login')
		if (!accountInformation.info || accountInformation.info == null) fail(21002); //无账号信息
		else if (accountInformation.reqPassword === accountInformation.info.password) {
			console.log('comparePassword', accountInformation.info)
			success(accountInformation);
		} else fail(21001);
	};
	return newPromise = new Promise(handleFun)
}
var applyValidate = function(accountInformation) {
	var handleFun = function(success, fail) {
		console.log('applyValidate')
		if (!accountInformation.info || accountInformation.info == null) success(accountInformation);
		else fail(30004) //
	};
	return newPromise = new Promise(handleFun)
}
var createAccount = function(accountInformation) {
	var handleFun = function(success, fail) {
		console.log('createAccount')
		var account = {
			accountName: accountInformation.accountName,
			name: accountInformation.name,
			password: accountInformation.password,
			address: accountInformation.address,
			phone: accountInformation.phone
		};
		var entity = new Seller(account);
		entity.save(dbTool.getCallBackForSave(success, fail))
	};
	return newPromise = new Promise(handleFun)
}
var updatePassword = function(accountInformation) {
	var handleFun = function(success, fail) {
		console.log('updatePassword', accountInformation)
		var conditions = {
			accountName: accountInformation.accountName
		};
		var updates = {
			password: accountInformation.newPassword
		};
		Seller.findOneAndUpdate(conditions, updates)
			.exec(dbTool.getCallBackForUpdate(success, fail))
	};
	return newPromise = new Promise(handleFun)
}
var findOrder = function(sellerInfo) {
	var condition = {
		sellerName: sellerInfo.sellerName
	}
	var sort = {
		date: 1
	};
	var limit = sellerInfo.limit;
	var skip = (sellerInfo.page - 1) * sellerInfo.limit;
	return new Promise((success, fail) => {
		Order.find(condition).skip(skip).limit(limit)
			.exec((e, data) => {
				if (e) {
					console.log(e)
				} else {
					console.log(data);
					success(data)
				}
			})
	})
}
var checkOrder = function(orders) {
	return new Promise((success, fail) => {
		if (orders.length === 0) {
			fail(31008)
		} else {
			success(orders)
		}
	})
}
var changeOrderStatu = function(orderInfo) {
	var update = orderInfo.update;
	var option = {
		new: true
	};
	return new Promise((success, fail) => {
		Order.findByIdAndUpdate(orderInfo.id, update, option)
			.exec(dbTool.getCallBackForUpdate(success, fail))
	})
}
module.exports = {
	getAccountInfo: getAccountInfo,
	comparePassword: comparePassword,
	applyValidate: applyValidate,
	createAccount: createAccount,
	updatePassword: updatePassword,
	findOrder: findOrder,
	checkOrder: checkOrder,
	changeOrderStatu: changeOrderStatu,
	getCustomerInfo
}
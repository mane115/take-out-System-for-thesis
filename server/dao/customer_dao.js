var proxy = tool.getMyModule("models/mongoose_proxy");
var Customer = proxy.getModel("Customer");
var dbTool = tool.getMyModule("utils/db");

var getAccountInfo = function(accountInformation) {
	var handleFun = function(success, fail) {
		console.log('getAccountInfo')
		var account = {
			accountName: accountInformation.accountName
		};
		Customer.findOne(account, function(e, data) {
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
			console.log(accountInformation.info)
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
		var entity = new Customer(account);
		entity.save(dbTool.getCallBackForSave(success, fail))
	};
	return newPromise = new Promise(handleFun)
}
var updatePassword = function(accountInformation) {
	var handleFun = function(success, fail) {
		var conditions = {
			accountName: accountInformation.accountName
		};
		var updates = {
			password: accountInformation.newPassword
		};
		Customer.findOneAndUpdate(conditions, updates).exec(dbTool.getCallBackForUpdate(success, fail))
	};
	return newPromise = new Promise(handleFun)
}
var recharge = function(rechargeDetails) {
	return new Promise((success, fail) => {
		var update = {
			$inc: {
				cash: rechargeDetails.cash
			}
		};
		var option = {
			new: true
		}
		Customer.findByIdAndUpdate(rechargeDetails.id, update, option).exec(dbTool.getCallBackForUpdate(success, fail))
	})
}
var isUserCollect = function(collectInfo) {
	var conditions = {
		accountName: collectInfo.customerName
	}
	var toBooleanCollect = function(customerInfo) {
		if (customerInfo == null || customerInfo.collect.length === 0) {
			console.log('if')
			return true
		} else {
			console.log('else')
			var booleanStatu = true;
			customerInfo.collect.some(goods => {
				if (goods.goodsId === collectInfo.collect.goodsId) {
					booleanStatu = false
				}
			})
			return booleanStatu
		}
	}
	var booleanPromise = function(customerInfo) {
		return new Promise((success, fail) => {
			var test = toBooleanCollect(customerInfo);
			console.log('bollean', test)
			if (toBooleanCollect(customerInfo)) {
				success()
			} else {
				fail(32000)
			}
		})
	}
	var findCollect = function() {
		return new Promise((success, fail) => {
			Customer.findOne(conditions).exec(dbTool.getCallBackForQuery(success, fail))
		})
	}
	return new Promise((success, fail) => {
		var responseFun = function(useless) {
			console.log('res')
			success(collectInfo)
		}
		findCollect().then(booleanPromise).then(responseFun).catch(fail)
	})

}
var addCollect = function(collectInfo) {
	console.log('addCollect')
	var conditions = {
		accountName: collectInfo.customerName
	};
	var update = {
		$push: {
			collect: collectInfo.collect
		}
	};
	var option = {
		new: true
	}
	return new Promise((success, fail) => {
		Customer.findOneAndUpdate(conditions, update, option).exec((e, data) => {
			if (e) {
				fail(31001)
			} else {
				success(data)
			}
		})
	})
}
var checkAccount = function(accountInfo) {
	var conditions = {
		accountName: accountInfo.accountName
	}
	return new Promise((success, fail) => {
		Customer.findOne(conditions).exec(dbTool.getCallBackForQuery(success, fail))
	})
}
var dropCollect = function(collectInfo) {
	var conditions = {
		accountName: collectInfo.customerName
	};
	var update = {
		$pull: {
			collect: collectInfo.collect
		}
	};
	return new Promise((success, fail) => {
		Customer.findOneAndUpdate(conditions, update).exec((e, data) => {
			if (e) {
				fail(31001)
			} else {
				success(data)
			}
		})
	})
}
var getInfo = function(info) {
	var conditions = {
		accountName: info.accountName
	};
	return new Promise((success, fail) => {
		Customer.findOne(conditions).exec((e, data) => {
			if (e) {
				fail(31000)
			} else {
				console.log('查询用户信息：', data);
				delete data.password;
				success(data)
			}
		})
	})

}
module.exports = {
	getAccountInfo: getAccountInfo,
	comparePassword: comparePassword,
	applyValidate: applyValidate,
	createAccount: createAccount,
	updatePassword: updatePassword,
	recharge: recharge,
	isUserCollect: isUserCollect,
	addCollect: addCollect,
	checkAccount: checkAccount,
	dropCollect: dropCollect,
	getInfo: getInfo
}
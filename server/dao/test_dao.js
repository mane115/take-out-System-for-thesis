var proxy = tool.getMyModule("models/mongoose_proxy");
var Test = proxy.getModel("Test");
var dbTool = tool.getMyModule("utils/db");

var findBeforeCreate = function(id, password) {
	return newPromise = new Promise(function(success, fail) {
		var newAccount = {
			accountName: id,
		};
		Test.findOne(newAccount, function(e, data) {
			if (e) fail(31000);
			else if (data) fail(50001);
			else {
				newAccount.password = password;
				success(newAccount)
			}
		})
	})
}
var create = function(newAccount) {
	return newPromise = new Promise(function(success, fail) {
		var entity = new Test(newAccount);
		entity.save(dbTool.getCallBackForSave(success, fail))
	})
}
var login = function(id, password) {
	return newPromise = new Promise(function(success, fail) {
		var account = {
			accountName: id
		};
		Test.findOne(account, function(e, data) {
			if (e) fail(31000);
			else if (data.password === password) success(account);
			else fail(50002)
		});
	})
}

module.exports = {
	create: create,
	findBeforeCreate: findBeforeCreate,
	login: login
}
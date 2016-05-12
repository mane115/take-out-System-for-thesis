var dao = tool.getMyModule('dao/customer_dao');

var comparePassword = function(accountInformation) {
	return newPromise = new Promise(function(success, fail) {
		if (accountInformation.reqPassword === accountInformation.dbPassword) success(accountInformation);
		else fail(21001) //账号密码错误
	})
}
var distroyObj = function(Obj) {
	return newPromise = new Promise(function(success, fail) {
		Obj = null;
		success();
	})
}
var login = function(req, res) {
	var client = tool.getResponseFunc(res);
	var regenSession = function(data) {
		return new Promise(function(success, fail) {
			req.session.regenerate(function(e) {
				if (e) {
					console.error("重新生成sid失败", e);
					fail()
				} else {
					success(data);
				}
			})
		})
	}
	var cacheCustomer = function(accountInformation) {
		var customerInfo = {
			name: accountInformation.info.name,
			accountName: req.body.customer.accountName
		}
		req.session.customer = customerInfo;
		req.session.save();
		console.log("session.name:", req.session.customer.name);
		console.log("session.accountName:", req.session.customer.accountName)
	}
	var customerReq = req.body.customer;
	var accountInformation = {
		accountName: customerReq.accountName,
		reqPassword: customerReq.password
	}
	dao.getAccountInfo(accountInformation)
		.then(dao.comparePassword)
		.then(regenSession)
		.then(cacheCustomer)
		.then(client.success)
		.catch(client.fail)
}
var apply = function(req, res) {
	var client = tool.getResponseFunc(res);
	var customerReq = req.body.customer;
	console.log('test',typeof(req.body))
	var accountInformation = {
		accountName: customerReq.accountName,
		name: customerReq.name,
		password: customerReq.password,
		address: customerReq.address,
		phone: customerReq.phone
	}

	dao.getAccountInfo(accountInformation)
		.then(dao.applyValidate)
		.then(dao.createAccount)
		.then(distroyObj)
		.then(client.success)
		.catch(client.fail)
}
var unLogin = function(req, res) {
	var client = tool.getResponseFunc(res);
	req.session.destroy(function(e) {
		if (e) console.log(e);
		else client.success();
	})
}
var changePw = function(req, res) {
	var client = tool.getResponseFunc(res);
	var customerInfo = req.body.customer;
	// console.log()
	var accountInformation = {
		accountName: customerInfo.accountName,
		reqPassword: customerInfo.password,
		newPassword: customerInfo.newpassword
	}
	var distroySession = function() {
		return newPromise = new Promise(function(success, fail) {
			req.session.destroy(function(e) {
				if (e) console.log(e);
				else success()
			})
		})
	}
	dao.getAccountInfo(accountInformation)
		.then(dao.comparePassword)
		.then(dao.updatePassword)
		.then(distroyObj)
		.then(distroySession)
		.then(client.success)
		.catch(client.fail)
}
var recharge = function(req, res) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(accountInfo) {
		client.success({
			accountInfo: accountInfo
		})
	}
	var rechargeDetails = {
		id: req.body.id,
		cash: req.body.cash
	};
	console.log(rechargeDetails)
	dao.recharge(rechargeDetails)
		.then(responseClient)
		.catch(client.fail)
}
var addCollect = function(req, res, next) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(accountInfo) {
		delete accountInfo.password;
		client.success({
			accountInfo: accountInfo
		})
	}
	var collectInfo = {
		customerName: req.session.customer.accountName,
		collect: {
			goodsId: req.body.collect.goodsId,
			goodsName: req.body.collect.goodsName,
			sellerName: req.body.collect.sellerName
		}
	}
	dao.isUserCollect(collectInfo)
		.then(dao.addCollect)
		.then(responseClient)
		.then(next)
		.catch(client.fail)
}
var checkCollect = function(req, res) {
	var accountInfo = {
		accountName: req.session.customer.accountName
	}
	var client = tool.getResponseFunc(res);
	var responseClient = function(accountInfo) {
		delete accountInfo.password;
		client.success({
			accountInfo: accountInfo
		})
	}
	dao.checkAccount(accountInfo).then(responseClient).catch(client.fail)
}
var deleteCollect = function(req, res) {
	var client = tool.getResponseFunc(res);
	var responseClient = function() {
		client.success()
	}
	var collectInfo = {
		customerName: req.session.customer.accountName,
		collect: {
			goodsId: req.body.collect.goodsId,
			goodsName: req.body.collect.goodsName,
			sellerName: req.body.collect.sellerName
		}
	}
	dao.dropCollect(collectInfo).then(responseClient).catch(client.fail)
}
var getInfo = function(req, res) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(info) {
		client.success({
			info: info
		})
	};
	var info = {
		accountName: req.session.customer.accountName
	};
	dao.getInfo(info).then(responseClient).catch(client.fail)
}
module.exports = {
	login: login,
	apply: apply,
	unLogin: unLogin,
	changePw: changePw,
	recharge: recharge,
	addCollect: addCollect,
	checkCollect: checkCollect,
	deleteCollect: deleteCollect,
	getInfo: getInfo
}
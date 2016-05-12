var dao = tool.getMyModule('dao/seller_dao');
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
	var cacheSeller = function(accountInformation) {
		var sellerInfo = {
			name: accountInformation.info.name,
			accountName: req.body.seller.accountName
		}
		req.session.seller = sellerInfo;
		req.session.save();
		console.log("session.name:", req.session.seller.name);
		console.log("session.accountName:", req.session.seller.accountName)
	}
	var sellerReq = req.body.seller;
	var accountInformation = {
		accountName: sellerReq.accountName,
		reqPassword: sellerReq.password
	}
	dao.getAccountInfo(accountInformation)
		.then(dao.comparePassword)
		.then(regenSession)
		.then(cacheSeller)
		.then(client.success)
		.catch(client.fail)
}
var apply = function(req, res) {
	var client = tool.getResponseFunc(res);
	var sellerReq = req.body.seller;
	var accountInformation = {
		accountName: sellerReq.accountName,
		name: sellerReq.name,
		password: sellerReq.password,
		address: sellerReq.address,
		phone: sellerReq.phone
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
	var sellerInfo = req.body.seller;
	var accountInformation = {
		accountName: sellerInfo.accountName,
		reqPassword: sellerInfo.password,
		newPassword: sellerInfo.newPassword
	}
	var distroySession = function() {
		return newPromise = new Promise(function(success, fail) {
			req.session.destroy(function(e) {
				if (e) console.log(e);
				else success()
			})
		})
	}
	console.log(accountInformation)
	dao.getAccountInfo(accountInformation)
		.then(dao.comparePassword)
		.then(dao.updatePassword)
		.then(distroyObj)
		.then(distroySession)
		.then(client.success)
		.catch(client.fail)
}
var checkOrder = function(req, res) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(order) {
		client.success({
			order: order
		})
	};
	var sellerInfo = {
		sellerName: req.session.seller.accountName,
		limit: req.params.limit,
		page: req.params.page
	};
	console.log('sellerInfo', sellerInfo)
	dao.findOrder(sellerInfo)
		.then(dao.checkOrder)
		.then(responseClient)
		.catch(client.fail)
};

module.exports = {
	login: login,
	apply: apply,
	unLogin: unLogin,
	changePw: changePw,
	checkOrder: checkOrder,
}
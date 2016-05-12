var dao = tool.getMyModule('dao/goods_dao')

var create = function(req, res) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(goods) {
		client.success({
			good: goods
		})
	}
	var goods = req.body.goods;
	goods.sellerName = req.session.seller.accountName;
	console.log(goods);
	dao.find(goods)
		.then(dao.ifExistFail)
		.then(dao.create)
		.then(responseClient)
		.catch(client.fail)
}
var update = function(req, res) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(goods) {
		client.success({
			newGood: goods
		})
	}
	var updateGoods = {
		name: req.body.name,
		sellerName: req.session.seller.accountName
	}
	var newGoods = {
		toUpdateGoods: updateGoods,
		update: req.body.update
	}
	dao.findBeforUpdate(newGoods)
		.then(dao.update)
		.then(responseClient)
		.catch(client.fail)
}
var batchPullOff = function(req, res) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(goods) {
		client.success({
			delete: goods
		})
	}
	dao.removeByIds(req.body.goods.idArray)
		.then(responseClient)
		.catch(client.fail)
}
var checkBySeller = function(req, res) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(goods) {
		client.success({
			goods: goods
		})
	};
	var info = {
		accountName: req.session.seller.accountName,
		limit: req.params.limit,
		page: req.params.page
	}
	dao.checkBySellerName(info)
		.then(responseClient)
		.catch(client.fail)
}
var checkAll = function(req, res) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(goods) {
		client.success({
			goods: goods
		})
	}
	dao.checkAll()
		.then(responseClient)
		.catch(client.fail)
}
var check = function(req, res) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(goods) {
		client.success({
			goods: goods
		})
	};
	if (!req.params.sellerName) {
		dao.checkBySellerName(req.session.seller.accountName)
			.then(responseClient)
			.catch(client.fail)
	} else {
		dao.checkAll()
			.then(responseClient)
			.catch(client.fail)
	}
}
var checkByCustomer = function(req, res) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(goods) {
		client.success({
			goods: goods
		})
	};
	dao.checkBySellerName(req.params.accountName)
		.then(responseClient)
		.catch(client.fail)
}
var commitGoods = function(req, res, next) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(goods) {
		client.success({
			goods: goods
		})
	};
	var commitInfo = {
		goodsId: req.body.commitInfo.goodsId,
		commit: {
			author: req.session.customer.accountName,
			content: req.body.commitInfo.content
		}
	}
	dao.commitGoods(commitInfo).then(responseClient).then(next).catch(client.fail)
}
var incHot = function(req, res) {
	var goodsInfo = {
		goodsId: req.body.collect.goodsId
	}
	dao.incHot(goodsInfo)
}
var checkLimit = function(req, res) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(goods) {
		client.success({
			goods: goods
		})
	};
	var info = {
		limit: req.params.limit,
		page: req.params.page
	};
	dao.checkLimit(info)
		.then(responseClient)
		.catch(client.fail)
}
module.exports = {
	create: create,
	update: update,
	batchPullOff: batchPullOff,
	checkBySeller: checkBySeller,
	checkAll: checkAll,
	checkByCustomer: checkByCustomer,
	commitGoods: commitGoods,
	incHot: incHot,
	checkLimit: checkLimit
}
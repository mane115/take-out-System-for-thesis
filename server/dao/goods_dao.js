var proxy = tool.getMyModule("models/mongoose_proxy");
var Goods = proxy.getModel("Goods");
var dbTool = tool.getMyModule("utils/db");

var find = function(goods) {
	var toFindGoods = {
		name: goods.name,
		sellerName: goods.sellerName
	}
	return new Promise((success, fail) => {
		console.log("find")
		Goods.find(toFindGoods, (e, data) => {
			if (e) {
				console.log(e);
				fail(31001)
			} else {
				goods.query = data;
				success(goods)
			}
		})
	})
}
var create = function(goods) {
	return new Promise((success, fail) => {
		console.log("create")
			// Goods.create(goods, dbTool.getCallBackForSave(success,fail));
		var entity = new Goods(goods);
		entity.save(dbTool.getCallBackForSave(success, fail))
	})
}
var ifExistFail = function(goods) {
	return new Promise((success, fail) => {
		if (goods.query.length > 0) {
			fail(30006)
		} else {
			delete goods.query;
			success(goods)
		}
	})
}
var ifExistSuccess = function(goods) {
	return new Promise((success, fail) => {
		if (goods.query.length > 0) {
			delete goods.query;
			success(goods)
		} else {
			fail(30007)
		}
	})
}
var findBeforUpdate = function(newGoods) {
	return new Promise((success, fail) => {
		var returnInfo = function(goods) {
			success(newGoods)
		}
		if (newGoods.update.name != newGoods.toUpdateGoods.name) {
			var toFindNewGoods = {
				name: newGoods.update.name,
				sellerName: newGoods.toUpdateGoods.sellerName
			};
			find(toFindNewGoods)
				.then(ifExistFail)
				.catch(fail)
		};
		find(newGoods.toUpdateGoods)
			.then(ifExistSuccess)
			.then(returnInfo)
			.catch(fail);
	})
}
var update = function(newGoods) {
	return new Promise((success, fail) => {
		var condition = newGoods.toUpdateGoods;
		var update = newGoods.update
		var option = {
			new: true
		};
		Goods.update(condition, update, (e, data) => {
			if (e) {
				fail(31002)
			} else {
				console.log(data);
				success(data)
			}
		})

	})
}
var removeByIds = function(goodsIdArray) {
	return new Promise((success, fail) => {
		var condition = {
			_id: {
				$in: goodsIdArray
			}
		};
		Goods.remove(condition, dbTool.getCallBackForRemove(success, fail))
	})
}
var checkBySellerName = function(info) {
	return new Promise((success, fail) => {
		var condition = {
			sellerName: info.accountName
		};
		var limit = info.limit;
		var skip = (info.page - 1) * info.limit;
		Goods.find(condition).skip(skip).limit(limit)
			.exec(dbTool.getCallBackForQuery(success, fail))
	})
}
var checkAll = function() {
	return new Promise((success, fail) => {
		Goods.find().exec(dbTool.getCallBackForQuery(success, fail))
	})
}
var checkLimit = function(info) {
	// var sort = {
	// 	date: 1
	// };
	var limit = info.limit;
	var skip = (info.page - 1) * info.limit;
	return new Promise((success, fail) => {
		Goods.find().skip(skip).limit(limit)
			.exec(dbTool.getCallBackForQuery(success, fail))
	})
}
var commitGoods = function(commitInfo) {
	var condition = {
		_id: commitInfo.goodsId
	}
	var update = {
		$push: {
			commit: commitInfo.commit
		},
		$inc: {
			hot: 5
		}
	}
	var option = {
		new: true
	}
	return new Promise((success, fail) => {
		Goods.update(condition, update, option).exec((e, data) => {
			if (e) {
				fail(31002)
			} else {
				console.log(`后台增加hot完成，增加5热度`)
				success(data)
			}
		})
	})
}
var incHot = function(goodsInfo) {
	var condition = {
		_id: goodsInfo.goodsId
	}
	var update = {
		$inc: {
			hot: 1
		}
	}
	return new Promise((success, fail) => {
		Goods.update(condition, update).exec((e, data) => {
			if (e) {
				console.log(e);
			} else {
				console.log(`后台增加hot完成，增加1热度`)
				success(data)
			}
		})
	})
}
module.exports = {
	find: find,
	create: create,
	ifExistFail: ifExistFail,
	update: update,
	findBeforUpdate: findBeforUpdate,
	removeByIds: removeByIds,
	checkBySellerName: checkBySellerName,
	checkAll: checkAll,
	commitGoods: commitGoods,
	incHot: incHot,
	checkLimit: checkLimit
}
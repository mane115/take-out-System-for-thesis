var proxy = tool.getMyModule("models/mongoose_proxy");
var Goods = proxy.getModel("Goods");
var Customer = proxy.getModel("Customer");
var Seller = proxy.getModel("Seller");
var Order = proxy.getModel("Order");
var dbTool = tool.getMyModule("utils/db");

var getCustomerInfo = function(order) {
	var setCustomerInfo = function(data) {
		return new Promise((success, fail) => {
			console.log('>????', data)
			if (data === null || !data) {
				fail(20001)
			} else {
				var customerInfo = {
					accountName: data.accountName,
					address: data.address,
					phone: data.phone,
					cash: data.cash
				};
				order.customerInfo = customerInfo;
				success(order)
			}
		})
	}
	var findCustomer = function() {
		return new Promise((success, fail) => {
			var condition = {
				accountName: order.customerName
			};
			Customer.findOne(condition)
				.exec((e, data) => {
					if (e) {
						console.log(e);
						fail(31000)
					} else {
						console.log(data);
						success(data)
					}
				})
		})
	}
	return new Promise((success, fail) => {
		var responseFun = function(order) {
			success(order)
		};
		console.log('getCustomerInfo')
		findCustomer().then(setCustomerInfo).then(responseFun)
			.catch(fail)
	})
}
var getSellerInfo = function(order) {
	var setSellerInfo = function(data) {
		return new Promise((success, fail) => {
			if (data === null || !data) {
				fail(31005)
			} else {
				var sellerInfo = {
					accountName: data.accountName,
					address: data.address,
					phone: data.phone
				};
				order.sellerInfo = sellerInfo;
				console.log('order', order)
				success(order)
			}
		})
	}
	var findSeller = function() {
		return new Promise((success, fail) => {
			var condition = {
				accountName: order.goods.sellerName
			};
			Seller.findOne(condition)
				.exec(dbTool.getCallBackForQuery(success, fail))
		})
	}
	return new Promise((success, fail) => {
		console.log('getSellerInfo')
		var responseFun = function(order) {
			success(order)
		};
		findSeller().then(setSellerInfo).then(responseFun)
			.catch(fail);

	})
}
var distinguishMoney = function(order) {
	return new Promise((success, fail) => {
		console.log('order', order);
		var total = order.goods.quantity * order.goods.price;
		if (total > order.customerInfo.cash) {
			fail(31006)
		} else {
			success(order)
		}
	})
}
var reduceMoney = function(order) {
	return new Promise((success, fail) => {
		var newCash = order.customerInfo.cash - order.goods.quantity * order.goods.price;
		console.log('reduceMoney', order)
		var condition = {
			accountName: order.customerName
		};
		var update = {
			cash: newCash
		}
		if (newCash < 0) {
			fail(31006)
		} else {
			Customer.update(condition, update, (e, data) => {
				if (e) {
					console.log(e)
					fail(31002)
				} else {
					success(order)
				}
			})
		}
	})
}
var reduceQuantity = function(order) {
	return new Promise((success, fail) => {
		console.log('reduceQuantity')
		var update = {
			$inc: {
				quantity: (-order.goods.quantity)
			}
		};
		var option = {
			new: true
		};
		Goods.findByIdAndUpdate(order.goods.id, update, option, (e, data) => {
			if (e) {
				fail(31001)
			} else if (data.quantity < 0) {
				fail(31007)
			} else {
				success(order)
			}
		})
	})
}
var createOrder = function(order) {
	return new Promise((success, fail) => {
		console.log('createOrder', order)
		var newOrder = {
			sellerInfo: order.sellerInfo,
			customerInfo: order.customerInfo,
			goodsInfo: {
				goodsId: order.goods.id,
				goodsName: order.goods.goodsName,
				price: order.goods.price,
				quantity: order.goods.quantity
			},
			statu: "待接单",
			sellerName: order.sellerInfo.accountName,
			customerName: order.customerInfo.accountName
		};
		delete newOrder.customerInfo.cash;
		console.log(newOrder);
		var entity = new Order(newOrder);
		entity.save(dbTool.getCallBackForSave(success, fail))
	})
}
var buyInit = function(order) {
	return new Promise((success, fail) => {
		var responseFun = function(data) {
			success(data)
		}
		console.log(order);
		getCustomerInfo(order)
			.then(getSellerInfo)
			.then(distinguishMoney)
			.then(reduceMoney)
			.then(reduceQuantity)
			.then(createOrder)
			.then(responseFun)
			.catch(fail)
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
	console.log('orderInfo', orderInfo)
	var update = orderInfo.update;
	var option = {
		new: true
	};
	return new Promise((success, fail) => {
		Order.findByIdAndUpdate(orderInfo.id, update, option)
			.exec(dbTool.getCallBackForUpdate(success, fail))
	})
}
var batchChangeStatu = function(ordersInfo) {
	var condition = {
		_id: {
			$in: ordersInfo.ids
		}
	};
	var update = ordersInfo.update;
	var option = {
		multi: true
	}
	return new Promise((success, fail) => {
		Order.update(condition, update, option)
			.exec((e, datas) => {
				if (e) {
					console.log(e);
					fail(31003)
				} else {
					console.log(datas);
					success(datas)
				}
			})
	})
}
var findOrder = function(orderInfo) {
	var sort = {
		date: -1
	};
	var limit = orderInfo.limit;
	var skip = (orderInfo.page - 1) * orderInfo.limit;
	return new Promise((success, fail) => {
		Order.find(orderInfo.condition).skip(skip).limit(limit).sort(sort)
			.exec(dbTool.getCallBackForQuery(success, fail))
	})
}
var generalFind = function(condition, skip, limit, sort) {
	return new Promise((success, fail) => {
		Order.find(condition).skip(skip || 0).limit(limit || 0).sort(sort || {})
			.exec(dbTool.getCallBackForQuery(success, fail))
	})
}
var isUserCommit = function(commitInfo) {
	var condition = {
		_id: commitInfo.orderId
	}
	var booleanCommit = function(order) {
		return new Promise((success, fail) => {
			console.log('here?', condition)
			if (order.length === 0) {
				fail(31008)
			} else if (order[0].isCommited) {
				fail(31009)
			} else {
				success(order)
			}
		})
	}
	return new Promise((success, fail) => {
		console.log(`to find user:${commitInfo.customerName} is commit?`)
		var responseFun = function(useless) {
			success()
		}
		generalFind(condition).then(booleanCommit).then(responseFun).catch(fail)
	})
}
var updateCommit = function(commitInfo) {
	var condition = {
		_id: commitInfo.orderId
	}
	var update = {
		isCommited: true
	}
	var option = {
		new: true
	}
	console.log(`to update user:${commitInfo.customerName} is commit`)
	return new Promise((success, fail) => {
		Order.update(condition, update, option).exec((e, data) => {
			if (e) {
				fail(31002)
			} else {
				success(data)
			}
		})
	})
}
module.exports = {
	buy: buyInit,
	checkOrder: checkOrder,
	changeOrderStatu: changeOrderStatu,
	batchChangeStatu: batchChangeStatu,
	findOrder: findOrder,
	isUserCommit: isUserCommit,
	updateCommit: updateCommit
}
var dao = tool.getMyModule('dao/order_dao');
var buy = function(req, res) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(order) {
		client.success({
			order: order
		})
	};
	var order = req.body.order;
	order.customerName = req.session.customer.accountName;
	dao.buy(order)
		.then(responseClient)
		.catch(client.fail)
}
var setStatu = function(orderInfo) {
	return new Promise((success, fail) => {
		console.log('orderInfo', orderInfo.update.statuCode)
		switch (orderInfo.update.statuCode) {
			case '1':
				orderInfo.update.statu = '正在制作中';
				break;
			case '2':
				orderInfo.update.statu = '正在派送';
				break;
			case '0':
				orderInfo.update.statu = '商家取消订单';
				break;
			case '3':
				orderInfo.update.statu = '买家确认收货';
				break;
			case '4':
				orderInfo.update.statu = '申请退款';
				break;
			case '5':
				orderInfo.update.statu = '确认退款';
				break;
			default:
				fail(99998)
		};
		success(orderInfo)
	})
}
var changeOrderStatu = function(req, res) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(order) {
		client.success({
			order: order
		})
	};
	var orderInfo = {
		id: req.params.orderId,
		update: {
			statuCode: req.params.orderStatu
		}
	};
	setStatu(orderInfo)
		.then(dao.changeOrderStatu)
		.then(dao.checkOrder)
		.then(responseClient)
		.catch(client.fail)
}
var batchChangeOrderStatu = function(req, res) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(order) {
		client.success({
			order: order
		})
	};
	var ordersInfo = {
		ids: req.body.order.ids,
		update: {
			statuCode: req.body.order.statuCode
		}
	};
	setStatu(ordersInfo)
		.then(dao.batchChangeStatu)
		.then(dao.checkOrder)
		.then(responseClient)
		.catch(client.fail)
}
var getCustomerOrder = function(req, res) {
	var client = tool.getResponseFunc(res);
	var responseClient = function(order) {
		client.success({
			order: order
		})
	};
	var orderInfo = {
		limit: req.params.limit,
		page: req.params.page,
		condition: {}
	};
	////////////////////////////////////////////////11/30 10:58
	if (req.session.customer) {
		console.log('customer:', req.session.customer)
		orderInfo.condition.customerName = req.session.customer.accountName
	} else if (req.session.seller) {
		console.log(`seller:${req.session.seller}`)
		orderInfo.condition.sellerName = req.session.seller.accountName
	}
	////////////////////////////////////////////////11/30 10:58
	dao.findOrder(orderInfo)
		.then(dao.checkOrder)
		.then(responseClient)
		.catch(client.fail)
}
var isUserCommit = function(req, res, next) {
	var client = tool.getResponseFunc(res);
	var commitInfo = {
		goodsId: req.body.commitInfo.goodsId,
		content: req.body.commitInfo.content,
		orderId: req.body.commitInfo.orderId
	}
	dao.isUserCommit(commitInfo).then(next).catch(client.fail)
}
var updateUserIsCommit = function(req, res) {
	var client = tool.getResponseFunc(res);
	var commitInfo = {
		goodsId: req.body.commitInfo.goodsId,
		content: req.body.commitInfo.content,
		orderId: req.body.commitInfo.orderId
	}
	dao.updateCommit(commitInfo).catch(client.fail)
}
module.exports = {
	buy: buy,
	changeOrderStatu: changeOrderStatu,
	batchChangeOrderStatu: batchChangeOrderStatu,
	getCustomerOrder: getCustomerOrder,
	isUserCommit: isUserCommit,
	updateUserIsCommit: updateUserIsCommit
}
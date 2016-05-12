var router = require("express").Router();
var customer = tool.getMyModule('apps/customer_app');
var goods = tool.getMyModule('apps/goods_app');
var validate = tool.getMyModule('apps/validate');
var order = tool.getMyModule('apps/order_app');

router.post('/login', customer.login);
router.post('/apply', customer.apply);
router.all('/*', validate.isCustomerLogin);
//
router.get('/info',customer.getInfo);
router.get('/unLogin', customer.unLogin);
router.post('/changePw', customer.changePw); //更改密码会取消登陆状态
router.post('/info/recharge', customer.recharge);
//
router.get('/check/all', goods.checkAll);
router.get('/check/:page/:limit', goods.checkLimit);
router.get('/check/:accountName', goods.checkByCustomer);
//
router.get('/order/statu/:orderStatu/:orderId', order.changeOrderStatu);
router.post('/order/statu', order.batchChangeOrderStatu);
router.get('/order/:page/:limit', order.getCustomerOrder);
router.post("/buy", order.buy);
router.post('/commit', order.isUserCommit, goods.commitGoods, order.updateUserIsCommit);
router.post('/goods/commit',goods.commitGoods)
//
router.post('/collect', customer.addCollect, goods.incHot);
router.get('/collect', customer.checkCollect);
router.post('/collect/delete', customer.deleteCollect);
module.exports = router;
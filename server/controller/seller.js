var router = require("express").Router();
var seller = tool.getMyModule('apps/seller_app');
var validate = tool.getMyModule('apps/validate');
var goods = tool.getMyModule('apps/goods_app');
var order = tool.getMyModule('apps/order_app')
router.post('/login', seller.login);
router.post('/apply', seller.apply);
router.all('/*', validate.isSellerLogin);
//
router.get('/unLogin', seller.unLogin);
router.post('/changePw', seller.changePw) //更改密码会取消登陆状态
//上架商品
router.post('/createGoods', goods.create);
router.post('/updateGoods', goods.update);
router.post("/pullOffGoods", goods.batchPullOff);
router.get("/checkGoods/:page/:limit", goods.checkBySeller);
router.get("/checkAll", goods.checkAll);
//order
router.get('/order/statu/:orderStatu/:orderId', order.changeOrderStatu);
router.get('/order/:page/:limit', seller.checkOrder);
module.exports = router;
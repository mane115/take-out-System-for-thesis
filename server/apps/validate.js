var isCustomerLogin = function(req, res, next) {
	console.log(req.session.customer)
	if (req.session.seller) {
		return next()
	}
	if (!req.session.customer) {
		console.error("用户尚未登录", req.url);
		tool.getResponseFunc(res).fail(20001) //使用虚假用户
	} else next();

}
var isSellerLogin = function(req, res, next) {
	console.log(req.session.seller)
	if (!req.session.seller) {
		console.error("用户尚未登录", req.url);
		tool.getResponseFunc(res).fail(20001) //使用虚假用户
	} else next();

}
module.exports = {
	isCustomerLogin: isCustomerLogin,
	isSellerLogin: isSellerLogin
}
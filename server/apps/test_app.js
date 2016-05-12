var dao = tool.getMyModule("dao/test_dao");
var apply = function(req, res) {
	console.log('apply');
	var client = tool.getResponseFunc(res);
	var responseClient = function(response) {
		client.success({
			test: response
		})
	};
	dao.findBeforeCreate(req.body.account.id, req.body.account.password)
		.then(dao.create)
		.then(responseClient)
		.catch(client.fail);

};
var login = function(req, res) {
	console.log('login');
	var client = tool.getResponseFunc(res);
	var responseClient = function(response) {
		client.success({
			login: response
		})
	};
	var setSession = function(account) {
		req.session.account = account.accountName;
		console.log("session:",req.session.account)
	};
	dao.login(req.body.account.id, req.body.account.password)
		.then(setSession)
		.then(responseClient)
		.catch(client.fail)

}
module.exports = {
	apply: apply,
	login: login
}
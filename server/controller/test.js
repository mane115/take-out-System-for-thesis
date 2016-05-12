var router = require("express").Router();
var test = tool.getMyModule("apps/test_app");
// router.all("/*", function(req,res,next){
// 	console.log('mid');
// 	next()
// });

// router.get('/test', function(req, res) {
// 	console.log('test')
// 	res.send('test');
// })
router.post('/apply',test.apply);
router.post('/login',test.login);
module.exports = router;
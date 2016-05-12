var xssFilter = function(req, res, next){
	var escape = require(projectRoot + "/utils/escape")
	req.body = escape.escapeObj(req.body);
	next();
};

module.exports = xssFilter;
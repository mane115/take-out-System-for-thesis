global.projectRoot = __dirname;
global.tool = require("./utils/common");
var cfg = tool.getMyModule("config/server");
var mountMiddleware = function(app,express) {
	app.use(express.static('../client'));
	app.use('/dd',express.static('../dd'))
	var mountBodyParser = function() {
		var bodyParser = require('body-parser');
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({
			extended: false
		}));
	};
	var mountCookieParser = function() {
		var cookieParser = require('cookie-parser');
		app.use(cookieParser());
	};
	var mountSession = function() {
		var session = require("express-session");
		var getSessionStore = function() {
			var MongoStore = require('connect-mongo')(session);
			var option = {
				mongooseConnection: tool.getMyModule("/models/mongoose_proxy").getConnection()
			}
			return new MongoStore(option);
		};
		var config = {
			secret: "阿弥陀佛",
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 3600000
			},
			store: getSessionStore()
		}
		app.use(session(config));
	};
	var mountXssFilter = function() {
		var xssFilter = tool.getMyModule("/apps/xss_filter");
		app.use(xssFilter);
	};
	mountBodyParser();
	mountCookieParser();
	mountSession();
	mountXssFilter();
};
var mountAppModule = function(app) {
	app.use("/test", require("./controller/test"));
	app.use("/customer", require("./controller/customer"));
	app.use("/seller", require("./controller/seller"));
};
var captureErr = function() {
	require("process").on('uncaughtException', err => console.error("系统未知异常", err));
};
var initDB = function() {
	tool.getMyModule("models/mongoose_proxy");
}
var initSystem = function() {
	captureErr();
	initDB();
	var express = require('express');
	var app = express();
	mountMiddleware(app,express);
	mountAppModule(app);
	app.listen(cfg.port);
	console.log("Start server at", cfg.port);
};
new Promise(initSystem).catch(console.error);
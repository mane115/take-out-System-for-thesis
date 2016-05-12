"use strict";

var getMyModule = function() {
	var path = require("path");
	var dirs = [].slice.call(arguments, 0);
	dirs.unshift(global.projectRoot);
	return require(path.join.apply(path, dirs));
};
var getBasicResponseData = function(code) {
	if (typeof code !== "number") {
		console.error("错误码必须是数字", code);
		code = 9999
	}
	return {
		status: code,
		msg: getMyModule("config/status_code")[code] || "unknow ecode"
	};
};
var getAdditionalResponseData = function(code, additionalData) {
	var base = getBasicResponseData(code);
	for (var p in additionalData) {
		base[p] = additionalData[p];
	}
	return base;
}
var getResponseFunc = function(res) {
	var success = function(data) {
		res.json(getAdditionalResponseData(0, data));
	}
	var fail = function(ecode, data) {
		res.json(getAdditionalResponseData(ecode, data));
	}
	var error = function() {

	}
	return {
		success: success,
		fail: fail,
		error: error
	}
}

module.exports = {
		getMyModule: getMyModule,
		getResponseFunc: getResponseFunc
	}
	
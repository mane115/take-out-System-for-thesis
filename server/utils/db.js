var deleteProtities = function(mongooseObj) {
	mongooseObj = mongooseObj.toObject();
	delete mongooseObj.__v;
	return mongooseObj;
}
var toSimpleArray = function(mongooseArray) {
	return mongooseArray.map(function(mongooseObj) {
		return deleteProtities(mongooseObj)
	})
}

var toSimpleObject = function(mongooseObj) {
	if (mongooseObj instanceof Array) {
		return toSimpleArray(mongooseObj);
	} else {
		return deleteProtities(mongooseObj)
	}
}

var getCallBackForSave = function(success, fail) {
	var handleDBReturnAfterSave = function(e, savedObj) {
		if (e) {
			console.error(e);
			fail(31000);
		} else {
			success(toSimpleObject(savedObj));
		}
	}
	return handleDBReturnAfterSave;
}

var getCallBackForUpdate = function(success, fail) {
	var handleDBReturnAfterUpdate = function(e, updatedObj) {
		if (e) {
			console.error(e);
			fail(31002);
		} else if (!updatedObj) {
			fail(31004)
		} else {
			success(toSimpleObject(updatedObj));
		}
	}
	return handleDBReturnAfterUpdate;
}

var getCallBackForQuery = function(success, fail) {
	var handleDBReturnAfterQuery = function(e, results) {
		if (e) {
			console.error(e);
			fail(31001);
		} else {
			success(!results || toSimpleObject(results));
		}
	}
	return handleDBReturnAfterQuery;
}
var getCallBackForRemove = function(success, fail) {
	var handleDBReturnAfterQuery = function(e, results) {
		if (e) {
			console.error(e);
			fail(31003);
		}else{
			success();
		}
	}
	return handleDBReturnAfterQuery;
}
var dateToObjectId = function(date) {
	if (typeof date === "string") {
		date = new Date(date);
	}
	if (date instanceof Date) {
		return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000"
	} else {
		throw "需要Date或者String"
	}
}

module.exports = {
	dateToObjectId: dateToObjectId,
	getCallBackForSave: getCallBackForSave,
	getCallBackForQuery: getCallBackForQuery,
	getCallBackForUpdate: getCallBackForUpdate,
	getCallBackForRemove: getCallBackForRemove,
}
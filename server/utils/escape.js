var escapeChars = {
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
    "<": "&lt;",
    ">": "&gt;",
    "\n": "</br>"
};

var escapeString = function(str) {
    for (var key in escapeChars) {
        var reg = new RegExp(key, "g");
        str = str.replace(reg, escapeChars[key])
    }
    return str;
}

var escapeObj = function(obj) {
    for (var key in obj) {
        if ("string" === typeof obj[key]) {
            obj[key] = escapeString(obj[key])
        } else {
            escapeObj(obj[key]);
        }
    }
    return obj;
}

module.exports = {
    escapeObj: escapeObj
}
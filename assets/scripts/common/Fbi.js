var Settings = require("PASettings");
// extend FBInstant methods
var fbi = window.FBInstant || require("FbInstantMock");
fbi.supports = function(method) {
	if (Settings.getBool("offline") && cc.game.disconnected) {
		return false;
	}
	this._supportedAPIs = this._supportedAPIs || this.getSupportedAPIs(); 
	return this._supportedAPIs.contains(method);
};
fbi.exec = function(method, ...args) {
	if (!this.supports(method)) {
		console.log("METHOD_NOT_SUPPORTED", method, ...args);
		if (method.endsWith("Async")) {
			return Promise.reject({ code: "METHOD_NOT_SUPPORTED", method: method });
		} else {
			return;
		}
	}
	var context = this;
	var current = FBInstant;
	for (var m of method.split(".")) {
		if (current) {
			context = current;
			current = current[m];
		}
	}
	if (current) {
		return current.call(context, ...args);
	} else if (method.endsWith("Async")) {
		return Promise.resolve();
	}
};
window.FBInstant = fbi;
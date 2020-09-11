var JS = require("PAJS");
module.exports = {
	has(key) {
		return cc.sys.localStorage.getItem(key) !== null;
	},
	getItem(key) {
		return cc.sys.localStorage.getItem(key);
	},
	get(key, defaultValue = "") {
		var r = this.getItem(key);
		return JS.isDefined(r) ? r : defaultValue;
	},
	getBool(key, defaultValue = false) {
		var r = this.getItem(key);
		return JS.isDefined(r) ? JS.bool(r) : defaultValue;
	},
	getNum(key, defaultValue = 0) {
		var r = this.getItem(key);
		return JS.isDefined(r) ? JS.number(r) : defaultValue;
	},
	getJson(key, defaultValue) {
		var r = this.getItem(key);
		if (r) {
			return JS.isString(r) ? JSON.parse(r) : r;
		} else {
			return defaultValue;
		}
	},
	set(key, value) {
		if (value === undefined) {
			cc.sys.localStorage.removeItem(key);
		} else if (JS.isBool(value)) {
			cc.sys.localStorage.setItem(key, value ? "1" : "");
		} else if (JS.isNumber(value) || JS.isString(value)) {
			cc.sys.localStorage.setItem(key, value);
		} else {
			cc.sys.localStorage.setItem(key, JSON.stringify(value));
		}
		return value;
	},
	inc(key) {
		return this.set(key, this.getNum(key, 0) + 1);
	},
	remove(key) {
		cc.sys.localStorage.removeItem(key);
	}
};
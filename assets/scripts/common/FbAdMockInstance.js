var JS = require("JS");
var Settings = require("Settings");

var INTER = 1;
var VIDEO = 2;

module.exports = class {
	constructor(id, type) {
		this.id = id;
		this.type = type;
	}
	getPlacementID() {
		return this.id;
	}
	loadAsync() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (JS.rndBool(Settings.getNum("ad-fill-rate"))) {
					resolve();
				} else {
					reject({ code: "NO_FILL" });
				}
			}, JS.rnd(0.5, 2) * 1000);
		});
	}
	showAsync() {
		return new Promise((resolve, reject) => {
			console.log("show ad", duration);
			resolve();
		});
	}
};
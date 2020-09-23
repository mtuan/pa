var JS = require("PAJS");

cc.Class({
	extends: cc.Component,
	properties: {
		prefabs: require("UIPools")
	},
	loadAsync(url) {
		console.log("load", url);
		var r = JS.first(this.prefabs.types, m => m.id == url);
		return Promise.resolve(r.prefab);
	}
});
cc.Class({
	extends: cc.Component,
	properties: {
		pushApps: require("PushApps")
	},
	onLoad() {
		window.Main = this;
	}
});
var Resources = require("PAResources");
var JS = require("PAJS");
cc.Class({
	extends: cc.Component,
	properties: {
		manager: require("PAManager"),
		inters: require("PAInters"),
		banners: require("PABanners")
	},
	onLoad() {
		this.preview.updateLayout();
		Resources.loadResAsync("configs/basket-hit").then((d) => {
			this.configs = d.json;
		});
		window.Main = this;
	},
	nextApp() {
		var d = JS.rndValue(this.configs.templates);
		this.preview.setDataAsync(d);
	},
	showApp(id) {
		this.preview.setDataAsync(this.configs.templates[id]);
	}
});
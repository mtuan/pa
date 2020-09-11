var Resources = require("PAResources");
var JS = require("PAJS");
cc.Class({
	extends: cc.Component,
	properties: {
		preview: require("PAInter")
	},
	onLoad() {
		this.preview.updateLayout();
		Resources.loadResAsync("configs/basket").then((d) => {
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
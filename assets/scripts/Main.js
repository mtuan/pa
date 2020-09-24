var Resources = require("PAResources");
var JS = require("PAJS");
window.onunhandledrejection = (error) => {
    console.error("REJECT", error.reason);
    return true;
};
cc.Class({
	extends: cc.Component,
	properties: {
		manager: require("PAManager"),
		bundle: require("Bundle"),
		inters: cc.Node,
		banners: cc.Node,
		id: ""
	},
	ctor() {
		window.Main = this;
	},
	async onLoad() {
		var banners = this.manager.createBanners(this.banners);

		var apps = await Resources.loadJsonAsync("test/config.json");
		var app = apps[this.id];
		if (!app) {
			return;
		}
		this.manager.bundle = this.bundle;
		var configs = await this.manager.loadAsync("test/" + app.config);
		if (configs.hasInter()) {
			var inters = this.manager.createInters(this.inters);
			inters.loadAsync().then(() => {
				this.showAsync(inters);
			});
		}
		if (configs.hasBanner()) {
			var banners = this.manager.createBanners(this.banners);
			banners.loadAsync().then(() => {
				this.showAsync(banners);
			});
		}
	},
	showAsync(ads) {
		if (ads.instance) {
			ads.showAsync().then(() => this.showAsync(ads));
		} else {
			setTimeout(() => this.showAsync(ads), 1000);
		}
	}
});
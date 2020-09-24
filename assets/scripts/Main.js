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
		banners: cc.Node
	},
	ctor() {
		window.Main = this;
	},
	async onLoad() {
		var banners = this.manager.createBanners(this.banners);

		this.manager.bundle = this.bundle;
		var configs = await this.manager.loadAsync("configs/basket-hit.json");
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
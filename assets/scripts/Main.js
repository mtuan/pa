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
	async onLoad() {
		window.Main = this;
		
		var inters = this.manager.createInters(this.inters);
		var banners = this.manager.createBanners(this.banners);

		this.manager.bundle = this.bundle;
		await this.manager.loadAsync("configs/basket-hit.json");
		await Promise.allSettled([inters.loadAsync(), banners.loadAsync()]);
		this.showAsync(inters);
		this.showAsync(banners);
	},
	showAsync(ads) {
		ads.showAsync().then(() => this.showAsync(ads));
	}
});
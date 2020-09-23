var Configs = require("PAConfigs");
var Resources = require("PAResources");
var JS = require("PAJS");
var UI = require("PAUI");

var Manager = cc.Class({
	extends: cc.Component,
	properties: {
		inters: cc.Prefab,
		banners: cc.Prefab
	},
	// create place holder
	createInters(target) {
		var r = UI.create(this.inters, "PAInters");
		r.setManager(this);
		target && UI.add(r.node, target);
		return r;
	},
	createBanners(target) {
		var r = UI.create(this.banners, "PABanners");
		r.setManager(this);
		target && UI.add(r.node, target);
		return r;
	},
	// debug
	resetCount() {
		this.configs && this.configs.resetCount();	
	},
	resetRates() {
		this.configs && this.configs.resetRates();	
	},
	// dynamic load
	setBundle(bundle) {
		this.bundle = bundle;
	},
	loadAsync(url) {
		return Resources.loadJsonAsync(url).then(d => {
			if (!d.disabled) {
				this.configs = new Configs(d);
			}
		});
	},
	// handle events
	onShow(id, type) {
		this.configs && this.configs.onShow(id, type);
	},
	onClick(id, type) {
		this.configs && this.configs.onClick(id, type);
	},
	onCancel(id, type) {
		this.configs && this.configs.onCancel(id, type);
	}
});
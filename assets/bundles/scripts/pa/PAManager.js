var Configs = require("PAConfigs");
var JS = require("PAJS");
var UI = require("PAUI");

var Manager = cc.Class({
	extends: cc.Component,
	onLoad() {
		Manager.active = this;
	},
	getSrcId() {
		return this.configs ? this.configs.getSrcId() : "";
	},
	resetCount() {
		if (this.configs) {
			this.configs.resetCount();	
		}
	},
	resetRates() {
		if (this.configs) {
			this.configs.resetRates();	
		}
	},
	setBundle(bundle) {
		this.bundle = bundle;
	},
	loadConfigsAsync(url) {
		return Resources.loadJsonAsync(url).then(d => {
			if (!d.disabled) {
				this.configs = new Configs(d);
			}
		});
	}
});
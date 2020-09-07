var Resources = require("Resources");
var UI = require("UI");
cc.Class({
	extends: cc.Component,
	properties: {
		url: "",
		id: ""
	},
	async onLoad() {
		this.bundle = await Resources.loadBundleAsync(this.url);
		this.manager = await this.loadManagerAsync();
		await this.manager.initAsync(this.bundle, this.id);
	},
	async loadManagerAsync() {
		var prefab = await this.bundle.loadAsync("prefabs/pa-manager", cc.Prefab);
		var node = cc.instantiate(prefab);
		UI.add(node, this.node);
		return UI.component(node, "PAManager");
	},
	async loadInterAsync() {
		if (!this.manager || !this.manager.configs) {
			return { reason: "PUSH_APP_NOT_READY" }; 
		}
		return await this.manager.loadInterAsync();
	},
	async showInterAsync() {
		if (!this.manager || !this.manager.configs) {
			return { reason: "PUSH_APP_NOT_READY" }; 
		}
		return await this.manager.showInterAsync();
	}
});
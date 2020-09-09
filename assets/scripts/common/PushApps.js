var Resources = require("Resources");
var UI = require("UI");
cc.Class({
	extends: cc.Component,
	properties: {
		url: "",
		id: ""
	},
	async loadAsync() {
		this.bundle = await Resources.loadBundleAsync(this.url);
		this.manager = await this.loadManagerAsync();
		await this.manager.initAsync(this.bundle, this.id);
	},
	async loadManagerAsync() {
		var prefab = await this.bundle.loadAsync("prefabs/pa-manager", cc.Prefab);
		var r = UI.create(prefab, "PAManager");
		UI.add(r.node, this.node);
		return r;
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
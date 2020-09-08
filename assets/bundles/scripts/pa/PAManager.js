var Configs = require("PAConfigs");
var JS = require("JS");
var UI = require("UI");

var Manager = cc.Class({
	extends: cc.Component,
	onLoad() {
		this.prefabs = {};
		Manager.active = this;
	},
	getSrcId() {
		return this.configs ? this.configs.getSrcId() : "";
	},
	reset() {
		if (this.configs) {
			this.configs.reset();	
		}
	},
	initAsync(bundle, id) {
		this.bundle = bundle;
		this.id = id;
		return this.bundle.loadAsync(JS.format("data/%s", id)).then(d => {
			this.configs = new Configs(d.json);
			this.loadInterAsync();
		});
	},
	loadInterAsync() {
		var id = this.configs.loadInter();
		if (!id) {
			return Promise.reject({ reason: "INTER_NOT_AVAILABLE", id: id });
		}
		if (this.prefabs[id]) {
			return Promise.resolve(this.prefabs[id]);
		}
		return this.bundle.loadAsync(JS.format("apps/%s", id), cc.Prefab).then((prefab) => {
			return this.prefabs[id] = prefab;
		});
	},
	checkInter() {
		if (!this.configs.isInterTurn()) {
			return { reason: "INTER_NOT_IN_TURN" };
		}
		if (!this.configs.loadedInterId) {
			return { reason: "INTER_NOT_LOADED" };
		}
		var prefab = this.prefabs[this.configs.loadedInterId];
		if (!prefab) {
			return { reason: "INTER_NOT_LOADED" };
		}
	},
	showInterAsync() {
		this.configs.updateInterCount();
		var r = this.checkInter();
		if (r) {
			return Promise.reject(r);
		}
		var prefab = this.prefabs[this.configs.loadedInterId];
		this.configs.showInter();
		FBInstant.logEvent("PUSH_APP_SHOW", 0, {
			id: this.configs.loadedInterId,
			count: this.configs.getCount()
		});
		return new Promise((resolve, reject) => {
			var node = cc.instantiate(prefab);
			UI.add(node, this.node);
			UI.on(node, "click", () => {
				this.configs.clickInter();
				FBInstant.logEvent("PUSH_APP_CLICK", 0, {
					id: this.configs.loadedInterId
				});
			});
			UI.on(node, "close", (canceled) => {
				if (canceled) {
					FBInstant.logEvent("PUSH_APP_CANCEL", 0, {
						id: this.configs.loadedInterId
					});
				}
				resolve();
			});
		});
	}
});
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
	showInterAsync() {
		if (!this.configs.loadedInterId) {
			return Promise.reject({ reason: "APP_NOT_LOADED" });
		}
		var prefab = this.prefabs[this.configs.loadedInterId];
		if (!prefab) {
			return Promise.reject({ reason: "APP_NOT_LOADED" });
		}
		this.configs.showInter();
		return new Promise((resolve, reject) => {
			var node = cc.instantiate(prefab);
			UI.add(node, this.node);
			console.log("inter", UI.size(node), node.position);
			UI.on(node, "click", () => {
				this.configs.clickInter();
			});
			UI.on(node, "close", (canceled) => {
				if (canceled) {
					reject({ reason: "USER_CANCELED" });
				} else {
					resolve();
				}
				this.loadInterAsync();
			});
		});
	}
});
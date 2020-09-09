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
	initAsync(bundle, id, configUrl) {
		this.bundle = bundle;
		this.id = id;
		this.url = configUrl;
		return Resources.loadJsonAsync(this.url).then(d => {
			if (!d.disabled) {
				this.configs = new Configs(d);
				this.loadInterAsync();
			}
		});
	},
	loadInterAsync() {
		if (this.interInstance) {
			return Promise.resolve(this.interInstance);
		}
		if (this.interLoading) {
			return Promise.reject({ reason: "PA_INTER_LOADING" })
		}
		var next = this.configs.loadInter();
		if (!next) {
			return Promise.reject({ reason: "PA_INTER_NOT_AVAILABLE" });
		}
		this.interLoading = true;
		return this.loadInterPrefabAsync(next.type).then((prefab) => {
			var r = UI.create(prefab, "PAInter");
			r.id = next.id;
			if (next.data) {
				return r.setDataAsync(next.data).then(() => this.interInstance = r);
			} else {
				return Promise.resolve(this.interInstance = r);
			}
		}).finally(() => this.interLoading = false);
	},
	loadInterPrefabAsync(id) {
		if (this.prefabs[id]) {
			return Promise.resolve(this.prefabs[id]);
		}
		return this.bundle.loadAsync(JS.format("apps/%s", id), cc.Prefab)
			.then((prefab) => {
				return this.prefabs[id] = prefab;
			});
	},
	showInterAsync() {
		this.configs.updateInterCount();
		var r = this.configs.checkInterTurn();
		if (!r.isTurn) {
			return Promise.reject({ reason: "PA_INTER_NOT_IN_TURN", count: r.count, turns: r.turns });
		}
		if (!this.interInstance) {
			return Promise.reject({ reason: "PA_INTER_NOT_LOADED" });
		}
		var instance = this.interInstance;
		var interId = instance.id;
		// reload
		this.interInstance = null;
		this.loadInterAsync();
		// show
		this.configs.showInter(interId);
		FBInstant.logEvent("PA_INTER_SHOW", 0, {
			id: interId,
			count: this.configs.getInterCount()
		});
		UI.add(instance.node, this.node);
		return instance.showAsync(() => {
			this.configs.clickInter(interId);
			FBInstant.logEvent("PA_INTER_CLICK", 0, {
				id: interId
			});
		}, (canceled) => {
			if (canceled) {
				FBInstant.logEvent("PA_INTER_CANCEL", 0, {
					id: interId
				});
			}
		});
	}
});
var JS = require("JS");
var Settings = require("Settings");

cc.Class({
	ctor(d) {
		this.data = d;
		this.remote = this._getRemote(d);
		this.local = this._loadLocal();
		if (!this.local || this.local.version != this.remote.version) {
			this.local = this.remote;
			this.saveLocal();
		}
	},
	getSrcId() {
		return this.local.id;
	},
	loadInter() {
		return this.loadedInterId = JS.rndKey(this.local.apps, (apps, key) => apps[key]);
	},
	showInter() {
		if (this.loadedInterId) {
			this.local.apps[this._nextInter] *= this.local.configs["view-adjust"] || 0.1;
			this.saveLocal();
		}
	},
	clickInter() {
		if (this.loadedInterId) {
			this.local.apps[this._nextInter] *= this.local.configs["click-adjust"] || 0.5;
			this.saveLocal();
		}
	},
	saveLocal() {
		// ensure that values are not too small
		var min = Number.MAX_SAFE_INTEGER;
		JS.each(this.local.apps, (key, value) => {
			if (min > value) {
				min = value;
			}
		});
		if (min < 0.5) {
			for (var key in this.local.apps) {
				this.local.apps[key] *= 2;
			}
		}
		// save settings
		Settings.set("pa-apps", this.local);
	},
	_loadLocal() {
		return Settings.getJson("pa-apps");
	},
	_getRemote(d) {
		var set = this._getSet(d);
		return {
			version: d.version,
			id: d.id,
			apps: d.apps[set] || d.apps["default"],
			configs: d.configs[set] || d.configs["default"]
		};
	},
	_getSet(d) {
		for (var k in d.rules) {
			if (this._matchRule(d.rules[k])) {
				return d.rules[k].set || k;
			}
		}
	},
	_matchRule(d) {
		for (var k in d) {
			var value = this._getUserValue(k);
			var values = JS.isArray(d[k]) ? d[k] : [d[k]];
			if (value && !values.includes(value)) {
				return false;
			}
		}
		return true;
	},
	_getUserValue(key) {
		switch (key) {
		case "locale": return FBInstant.getLocale();
		case "lang": return FBInstant.getLocale().split("_").first();
		case "user": return FBInstant.player.getID();
		}
	}
});
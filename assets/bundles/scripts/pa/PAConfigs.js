var JS = require("PAJS");
var Settings = require("PASettings");

cc.Class({
	ctor(d) {
		this.setData(d);
	},
	setData(d) {
		this.data = d;
		this.remote = this._getRemote(d);
		this.local = this._loadLocal();
		if (!this.local || this.local.version != this.remote.version) {
			this.resetCount();
			this.resetRates();
			this.local = this.remote;
			this.saveLocal();
		}
	},
	resetCount() {
		Settings.remove("pa-inter-count");
		Settings.remove("pa-inter-date");
	},
	resetRates() {
		Settings.remove("pa-data");
	},
	getSrcId() {
		return this.local.id;
	},
	getNext() {
		var id = JS.rndKey(this.local.apps, (apps, key) => apps[key]);
		if (id) {
			var app = this.local.templates[id];
			return {
				src: this.local.id,
				id: id,
				app: app
			};
		}
	},
	updateInterCount() {
		var date = Settings.getNum("pa-inter-date");
		var today = JS.today();
		if (date != today) {
			Settings.set("pa-inter-count", 0);
			Settings.set("pa-inter-date", today);
		}
		return Settings.inc("pa-inter-count");
	},
	getInterCount() {
		return Settings.getNum("pa-inter-count");
	},
	checkInterTurn() {
		var count = Settings.getNum("pa-inter-count");
		var turns = this.local.configs["inter-index"];
		return {
			count: count,
			turns: turns,
			isTurn: turns && turns.includes(count)
		};
	},
	updateAppRate(id, adjust) {
		if (id) {
			this.local.apps[id] *= 1 - adjust;
			this.saveLocal();
		}
	},
	onShow(id, type) {
		this.updateAppRate(id, this.local.configs[JS.format("%s-show", type)] || 0.01);
	},
	onClick(id, type) {
		this.updateAppRate(id, this.local.configs[JS.format("%s-click", type)] || 0.5);
	},
	onCancel(id, type) {
		// TODO: update show rate when user cancel
	},
	saveLocal() {
		// ensure that values are not too small
		var min = Number.MAX_SAFE_INTEGER;
		JS.each(this.local.apps, (key, value) => {
			if (value > 0 && min > value) {
				min = value;
			}
		});
		if (min < 0.5) {
			for (var key in this.local.apps) {
				this.local.apps[key] *= 2;
			}
		}
		// save settings
		Settings.set("pa-data", this.local);
	},
	_loadLocal() {
		return Settings.getJson("pa-data");
	},
	_getRemote(d) {
		var set = this._getSet(d);
		return {
			version: d.version,
			id: d.id,
			templates: d.templates,
			apps: d.sets[set] || d.sets["default"],
			configs: d.configs[set] || d.configs["default"]
		};
	},
	_getSet(d) {
		if (d.rules) {
			for (var k in d.rules) {
				if (this._matchRule(d.rules[k])) {
					return d.rules[k].set || k;
				}
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
		case "country": return FBInstant.getLocale().split("_").last();
		case "user": return FBInstant.player.getID();
		}
	}
});
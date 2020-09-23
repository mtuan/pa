var JS = require("PAJS");
var UI = require("PAUI");

cc.Class({
	extends: cc.Component,
	properties: {
		path: "",
		types: {
			default: [],
			type: require("UIPool")
		}
	},
	onLoad() {
		for (var m of this.types) {
			m.path = this.path;
		}
	},
	initAsync() {
		var next = JS.first(this.types, m => !m.prefab);
		if (next) {
			return next.initAsync().then(() => this.initAsync());
		} else {
			return Promise.resolve();
		}
	},
	clear() {
		for (var m of this.types) {
			m.clear();
		}
	},
	getPool(id) {
		return JS.first(this.types, m => m.id == id);
	},
	setPool(id, prefab) {
		var pool = new UIPool();
		pool.id = id;
		pool.prefab = prefab;
		this.types.push(pool);
		return pool;
	},
	pull() {
		for (var m of this.types) {
			m.pull();
		}
	},
	
	// get, put
	getUsings(id) {
		return this.getPool(id).getUsings();
	},
	getAsync(id, type) {
		var pool = this.getPool(id);
		if (!pool) {
			return Promise.reject({ reason: "POOL_NOT_FOUND", id: id });
		}
		return pool.getAsync().then((r) => {
			return type ? UI.component(r, type) : r;
		}); 
	},
	put(item) {
		var items = Array.make(item);
		for (var m of items) {
			if (m._poolId) {
				this.getPool(m._poolId).put(m);
			}
		}
	}
});
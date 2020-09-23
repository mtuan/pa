var Resources = require("PAResources");
var JS = require("PAJS");
cc.Class({
	name: "UIPool",
	properties: {
		id: "",
		prefab: cc.Prefab
	},
	ctor() {
		this.pool = new cc.NodePool();
		this.used = [];
	},
	initAsync() {
		return Resources.loadResAsync("%s/%s".format(this.path, this.id)).then((prefab) => {
			return this.prefab = prefab;
		});
	},
	clear() {
		this.pool.clear();
	},
	prepare(count) {
		var require = count - this.pool.size();
		for (var i = 0; i < require; i++) {
			var r = cc.instantiate(this.prefab)
			r._poolId = this.id;
			this.pool.put(r);
		}
	},
	getUsings() {
		return this.used;
	},
	getAsync(count) {
		if (!this.prefab) {
			return this.initAsync().then(() => this.getAsync(count));
		} else {
			return Promise.resolve(this.get(count));
		}
	},
	get(count) {
		if (JS.isDefined(count)) {
			this.prepare(count);
			return JS.loop(count, () => this.use());
		} else {
			this.prepare(1);
			return this.use();
		}
	},
	use() {
		var r = this.pool.get();
		this.used.push(r);
		return r;
	},
	unuse(m) {
		this.used.remove(m);
		this.pool.put(m);
	},
	put(item) {
		if (JS.isArray(item)) {
			for (var m of item) {
				this.unuse(m);				
			}
		} else {
			this.unuse(item);
		}
	},
	pull() {
		for (var i = this.used.length - 1; i >= 0; i--) {
			this.unuse(this.used[i]);
		}
		this.used.clear();
	}
});
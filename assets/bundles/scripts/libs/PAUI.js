var JS = require("PAJS");
var Resources = require("PAResources");
module.exports = {
	// instantiate
	create(prefab, script) {
		var r = cc.instantiate(prefab);
		return script ? this.component(r, script) : r;
	},
	// hierarchy
	parent(node, value) {
		if (!JS.isDefined(value)) {
			return node.getParent();
		} else {
			node.setParent(value);
		}
	},
	component(node, type, create) {
		var r = node.getComponent(type);
		if (!r && create) {
			r = new type();
			node.addComponent(r);
		}
		return r;
	},
	add(node, parent) {
		if (!node.parent) {
			parent.addChild(node);
		} else {
			node.parent = parent;
		}
		return node;
	},
	remove(node, cleanup = true) {
		node.removeFromParent(cleanup);
	},
	clear(node, cleanup = true) {
		node.removeAllChildren(cleanup);
	},
	// events
	emit(node, event, ...args) {
		node.emit(event, ...args);
	},
	on(node, event, callback) {
		node.on(event, callback);
	},
	// attrs
	pos(node, value) {
		if (!JS.isDefined(value)) {
			return node.getPosition();
		} else {
			node.setPosition(value);
		}
	},
	size(node, value) {
		if (!JS.isDefined(value)) {
			return node.getContentSize();
		} else {
			node.setContentSize(value);
		}
	},
	scale(node, value) {
		if (!JS.isDefined(value)) {
			return node.scale;
		} else {
			node.scale = value;
		}
	},
	scaleX(node, value) {
		if (!JS.isDefined(value)) {
			return node.scaleX;
		} else {
			node.scaleX = value;
		}
	},
	scaleY(node, value) {
		if (!JS.isDefined(value)) {
			return node.scaleY;
		} else {
			node.scaleY = value;
		}
	},
	// sprite
	sprite(target, value, callback) {
		if (JS.isString(value)) {
			Resources.loadAsync(value).then((d) => {
				target.spriteFrame = new cc.SpriteFrame(d);
				callback && callback();
			});
		} else if (JS.isType(value, cc.SpriteFrame)) {
			target.spriteFrame = value;
			callback && callback();
		} else {
			callback && callback();
		}      
	},
	spriteAsync(target, value) {
		return new Promise((...args) => this.sprite(target, value, ...args));
	},
	// loaders
	loadAsync(...args) {
		return new Promise((resolve, reject) => {
			cc.loader.load(...args, (errors, result) => {
				if (errors) {
					reject(errors);
				} else {
					resolve(result);
				}
			});
		});
    },
    // actions
    action(node, action) {
    	node.runAction(action);
    }
};
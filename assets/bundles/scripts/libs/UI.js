var JS = require("JS");
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
			return node.getScale();
		} else {
			node.setScale(value);
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
		if (isString(value)) {
			Resources.loadAsync(value).then((d) => {
				target.spriteFrame = new cc.SpriteFrame(d);
				raise(callback);
			});
		} else if (isType(value, cc.SpriteFrame)) {
			target.spriteFrame = value;
			raise(callback);
		} else {
			raise(callback);
		}      
	},
	spriteAsync(target, value) {
		return new Promise((...args) => this.sprite(target, value, ...args));
	},
};
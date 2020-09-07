module.exports = {
	// hierarchy
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
	}
};
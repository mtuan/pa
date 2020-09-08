var Manager = require("PAManager");
var UI = require("UI");
cc.Class({
	extends: cc.Component,
	properties: {
		id: "",
		bg: cc.Node
	},
	onLoad() {
		var parentSize = UI.size(UI.parent(this.node));
		var size = UI.size(this.node);
		var sx = parentSize.width / size.width;
		var sy = parentSize.height / size.height;
		UI.scale(this.node, sy);
		UI.scale(this.bg, Math.max(sx, sy) / sy);
	},
	onPlay() {
		UI.emit(this.node, "click");
		var d = {
			"src-game": Manager.active.getSrcId()
		};
		FBInstant.switchGameAsync(this.id, d).then(() => {
			UI.emit(this.node, "close");
			UI.remove(this.node);
		}, () => {
			UI.emit(this.node, "close", true);
			UI.remove(this.node);
		});
	}
});
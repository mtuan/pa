var Manager = require("PAManager");
var UI = require("UI");
cc.Class({
	extends: cc.Component,
	properties: {
		id: "",
	},
	onPlay() {
		UI.emit(this.node, "click");
		FBInstant.switchGameAsync(this.id, { src: Manager.active.getSrcId() }).then(() => {
			UI.emit(this.node, "close");
			UI.remove(this.node);
		});
	}
});
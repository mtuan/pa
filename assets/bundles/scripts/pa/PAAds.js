var Manager = require("PAManager");
var JS = require("PAJS");
var UI = require("PAUI");
cc.Class({
	extends: cc.Component,
	onLoad() {
		UI.size(this.node, UI.size(UI.parent(this.node)));
	},
	showAsync() {
		return new Promise((resolve, reject) => {
			UI.on(this.node, "done", resolve);
		});
	},
	setDataAsync(d) {
		this.data = d;
		return this.updateDataAsync(d);
	},
	updateDataAsync() {
		return Promise.resolve();
	},
	onClick() {
		UI.emit(this.node, "click");
	},
	onSwitch() {
		UI.emit(this.node, "switch");
	},
	onCancel() {
		UI.emit(this.node, "cancel");
	},
	onPlay() {
		this.onClick();
		var d = {
			"game-id": this.data.src
		};
		FBInstant.switchGameAsync(this.data.id, d).then(() => {
			this.onSwitch();
		}, (e) => {
			this.onCancel();
		});
	}
});
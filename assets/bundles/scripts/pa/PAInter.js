var Manager = require("PAManager");
var UI = require("UI");
cc.Class({
	extends: cc.Component,
	properties: {
		id: "",
		bg: cc.Sprite,
		play: cc.Sprite,
	},
	onLoad() {
		this.updateLayout();
	},
	showAsync(onClick, onClose) {
		return new Promise((resolve, reject) => {
			UI.on(this.node, "click", onClick);
			UI.on(this.node, "close", (canceled) => {
				UI.remove(this.node);
				onClose && onClose(canceled);
				resolve();
			});
		});
	},
	setDataAsync(d) {
		this.data = d;
		this.id = d.id;
		var p1 = UI.spriteAsync(this.bg, d.screenshot);
		var p2 = UI.spriteAsync(this.play, d.button.image);
		return Promise.all([p1, p2]).then(() => {
			UI.pos(this.play.node, cc.v2(d.button.x, d.button.y));
			this.updateLayout();
		});
	},
	updateLayout() {
		var winSize = cc.winSize;
		var size = UI.size(this.bg.node);
		var sx = winSize.width / size.width;
		var sy = winSize.height / size.height;
		UI.size(this.node, size);
		UI.scale(this.node, sy);
		UI.scale(this.bg.node, Math.max(sx, sy) / sy);
	},
	onClose() {
		UI.emit(this.node, "close");
	},
	onPlay() {
		UI.emit(this.node, "click");
		var d = {
			"src-game": Manager.active.getSrcId()
		};
		FBInstant.switchGameAsync(this.id, d).then(() => {
			UI.emit(this.node, "close");
		}, (e) => {
			UI.emit(this.node, "close", true);
		});
	}
});
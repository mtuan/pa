var Manager = require("PAManager");
var UI = require("UI");
cc.Class({
	extends: cc.Component,
	properties: {
		bg: cc.Sprite,
		play: cc.Sprite,
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
		var p1 = d.screenshot ? UI.spriteAsync(this.bg, d.screenshot) : Promise.resolve();
		var p2 = d.button ? UI.spriteAsync(this.play, d.button.image).then(() => {
			UI.pos(this.play.node, cc.v2(d.button.x, d.button.y));
		}) : Promise.resolve();
		return Promise.all([p1, p2]).then(() => {
			this.updateLayout();
		});
	},
	updateLayout() {
		var winSize = cc.winSize;
		var size = UI.size(this.bg.node);
		var sx = winSize.width / size.width;
		var sy = winSize.height / size.height;
		UI.size(this.node, cc.size(winSize.width / sy, size.height));
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
		FBInstant.switchGameAsync(this.data.id, d).then(() => {
			UI.emit(this.node, "close");
		}, (e) => {
			UI.emit(this.node, "close", true);
		});
	}
});
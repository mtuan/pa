var Manager = require("PAManager");
var JS = require("PAJS");
var UI = require("PAUI");
cc.Class({
	extends: require("PAAds"),
	properties: {
		content: cc.Node,
		bg: cc.Sprite,
		play: cc.Sprite,
	},
	updateDataAsync(d) {
		var inter = d.app.inter;
		if (inter && !JS.isString(inter)) {
			var p1 = UI.spriteAsync(this.bg, inter.image);
			var p2 = UI.spriteAsync(this.play, inter.play.image).then(() => {
				UI.pos(this.play.node, cc.v2(inter.play.x, inter.play.y));
			});
			return Promise.all([p1, p2]);
		} else {
			return Promise.resolve();
		}
	},
	showAsync() {
		this.updateLayout();
		return this._super();
	},
	updateLayout() {
		var frameSize = UI.size(this.node);
		var size = UI.size(this.bg.node);
		var sx = frameSize.width / size.width;
		var sy = frameSize.height / size.height;
		var ratio = frameSize.width / frameSize.height;
		var scale = Math.min(sx, sy);
		
		var width = size.height * ratio;
		UI.size(this.content, cc.size(width, size.height));
		UI.scale(this.content, sy);
		UI.scale(this.bg.node, cc.v2(Math.max(width / size.width, 1), 1));
		UI.pos(this.node, cc.v2(0, 0));
	},
	onClose() {
		UI.emit(this.node, "done");
		UI.remove(this.node);
	},
	onCancel() {		
		this._super();
		this.onClose();
	},
	onSwitch() {
		this._super();
		this.onClose();
	}
});
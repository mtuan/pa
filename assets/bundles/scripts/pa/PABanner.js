var UI = require("PAUI");
cc.Class({
	extends: require("PAAds"),
	properties: {
		bg: cc.Sprite,
		effect: sp.Skeleton
	},
	showAsync() {
		UI.scaleX(this.effect.node, UI.size(this.node).width / 750);
		return this._super();
	},
	updateDataAsync(d) {
		return UI.spriteAsync(this.bg, d.app.banner);
	},
	onClose() {
		UI.emit(this.node, "done");
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
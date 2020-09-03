cc.Class({
	extends: cc.Component,
	properties: {
		id: "",
	},
	onPlay() {
		console.log("switch game", this.id);
		this.node.emit("close");
	}
});
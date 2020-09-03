var Bundle = require("Bundle");
cc.Class({
	extends: cc.Component,
	properties: {
		scenes: cc.Node
	},
	onLoad() {
		Bundle.loadAsync("https://localhost:8080/assets/basket").then((bundle) => {
		    console.log("loaded", bundle);
		    bundle.load("inter", cc.Prefab, (err, prefab) => {
		    	var node = cc.instantiate(prefab);
		    	this.scenes.addChild(node);
		    });
		});
	},
	_transformBundleUrl(task) {
		if (task.input) {
			for (var m of task.input) {
				console.log(m.config);
			}
		}
		task.output = task.input;
	}
});
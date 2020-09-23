var INTER = 1;
var VIDEO = 2;

// player
class Player {
	constructor(data) {
		this._data = data;
	}
	getPhoto() {
		return this._data.photo;
	}
	getName() {
		return this._data.name;
	}
	getID() {
		return this._data.id;
	}
}

class LoginPlayer extends Player {
	canSubscribeBotAsync() {
		return Promise.resolve(true);
	}
	setDataAsync(obj) {
		for (var key in obj) {
			if (!obj[key]) {
				cc.sys.localStorage.removeItem(key);
			} else {
				cc.sys.localStorage.setItem(key, obj[key]);
			}
			
		}
		return Promise.resolve();
    }
    getDataAsync(fields) {
    	var r = {};
    	for (var m of fields) {
    		r[m] = cc.sys.localStorage.getItem(m);
    	}
    	return Promise.resolve(r);
    }
    getConnectedPlayersAsync() {
    	return Promise.resolve([]);
    }
    incrementStatsAsync() {
    	return Promise.resolve();
    }
    flushDataAsync() {
    	return Promise.resolve();
    }
}

// leader board
class RankEntry {
	constructor(data, player) {
		this._data = data;
		this._player = player;
	}
	getPlayer() {
		return this._player;
	}
	getRank() {
		return this._data.rank;
	}
	getScore() {
		return this._data.score;
	}
}

class LeaderBoardEntry {
	constructor(key) {
		this._key = key;
		this._data = JSON.parse(cc.sys.localStorage.getItem(key) || "{}");
	}
	getScore() {
		return this._data.score || 0;
	}
	setScore(value) {
		var score = this._data.score || 0;
		if (score < value) {
			this._data.score = value;
			cc.sys.localStorage.setItem(this.key, JSON.stringify(this._data));
		}
	}
	getPlayer() {
		return this._player;
	}
}

class LeaderBoard {
	constructor(id) {
		this._id = id;
		this._player = new LeaderBoardEntry("board-%s-player".format(id));
	}
	setScoreAsync(value) {
		this._player.setScore(value);
		return Promise.resolve(this._player);
	}
	getPlayerEntryAsync() {
		return Promise.resolve(this._player);
	}
	getConnectedPlayerEntriesAsync() {
		return Promise.resolve([]);
	}
	getEntriesAsync() {
		return Promise.resolve([]);
	}
	getEntryCountAsync() {
		return Promise.resolve(0);
	}
};

// context
class Context {
	constructor(data = {}) {
		this._data = data;
	}
	getID() {
		return this._data.id;
	}
	getType() {
		return this._data.type;
	}
	isSizeBetween(min, max) {
		return true;
	}
	switchAsync(id) {
		return Promise.resolve();
	}
	chooseAsync() {
		return Promise.reject();
	}
	createAsync(playerId) {
		this._data.id = 1;
		this._data.type = "THREAD";
		return Promise.resolve();
	}
	getPlayersAsync() {
		return Promise.resolve([]);
	}
};

// payments
class Payments {
	getCatalogAsync() {
		return Promise.resolve([]);
	}
	purchaseAsync(config) {
		return Promise.reject();
	}
	onReady(callback) {
		callback && callback();
	}
};

// ad
var AdInstance = class {
	constructor(id, type) {
		this.id = id;
		this.type = type;
	}
	getPlacementID() {
		return this.id;
	}
	loadAsync() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve();
			}, 1000);
		});
	}
	showAsync() {
		return new Promise((resolve, reject) => {
			var duration = this.type == INTER ? 5 : 30;
			Dialogs.openAsync("ad", duration).then((dlg) => dlg.onClosed((dlg, canceled) => {
				if (canceled) {
					reject({ code: "USER_CANCELLED" });
				} else {
					resolve();
				}
			}, true));
		});
	}
};

function getProperties(obj) {	
	var r = Object.keys(obj).where(m => !m.startsWith("_"));
	if (r.length == 0) {
		r = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).where(m => !m.startsWith("_") && m !== "constructor");
	}
	return r; 
}

function getModules(obj, prefix = "") {
	var r = [];
	for (var key of getProperties(obj)) {
		var name = prefix + key;
		r.push(name);
		var value = obj[key];
		if (typeof value === "object") {
			r.push(...getModules(value, name + "."));
		}
	}
	return r;
}

var modules;
var FBInstant = {
	context: new Context(),
	player: new LoginPlayer({
		id: 100,
		name: "Test User"
	}),
	payments: new Payments(),

	getSupportedAPIs() {
		if (!modules) {
			modules = getModules(this);
		}
		return modules;
	},
	getLeaderboardAsync(id) {
		return Promise.resolve(new LeaderBoard(id));
	},
	getInterstitialAdAsync(id) {
		return Promise.resolve(new AdInstance(id, INTER));
	},
	getRewardedVideoAsync(id) {
		return Promise.resolve(new AdInstance(id, VIDEO));
	},
	canCreateShortcutAsync() {
		return Promise.resolve(false);
	},
	getLocale() {
		return "vi_US";
	},
	getPlatform() {
		return "WEB";
	},
	postSessionScore(...args) {
		console.log("postSessionScore", ...args);
		if (!this.context.getID()) {
			setTimeout(() => this.context.createAsync(), 500);
		}
	},
	logEvent(...args) {
		console.log("logEvent", ...args);
	},
	updateAsync(...args) {
		console.log("updateAsync", ...args);
	},
	switchGameAsync(id, data) {
		console.log("switchGameAsync", id, data);
		return Promise.resolve();
	},
	getEntryPointData() {
		return null;
	},
	initializeAsync() {
		return Promise.resolve();
	},
	startGameAsync() {
		return Promise.resolve();
	},
	setLoadingProgress() {

	},
	onPause() {

	}
};
var JS = require("JS");
var FbAdInstance = require("FbAdMockInstance");

var INTER = 1;
var VIDEO = 2;

// mock data
var ME = {
	id: 1,
	name: "Tuan"
};
var FRIENDS = {
	1: { name: "Lam", photo: "/avatars/Abu-IN.jpg" },
	2: { name: "Thang", photo: "/avatars/Adam-US.jpg" },
	3: { name: "Huy", photo: "/avatars/Alex_Wade-US.jpg" },
	4: { name: "Quynh", photo: "/avatars/Arlene-FR.jpg" },
	5: { name: "Chuan", photo: "/avatars/Abu-IN.jpg" },
	6: { name: "Loan", photo: "/avatars/Adam-US.jpg" },
	7: { name: "Hong", photo: "/avatars/Alex_Wade-US.jpg" },
	8: { name: "Son", photo: "/avatars/Arlene-FR.jpg" },
	9: { name: "Trung", photo: "/avatars/Abu-IN.jpg" },
	10: { name: "Tuan", photo: "/avatars/Adam-US.jpg" },
	11: { name: "Son 2", photo: "/avatars/Alex_Wade-US.jpg" },
	12: { name: "Thuy", photo: "/avatars/Arlene-FR.jpg" },
	13: { name: "Quang", photo: "/avatars/Abu-IN.jpg" },
	14: { name: "Luan", photo: "/avatars/Adam-US.jpg" },
};
class MockData {
	static getFriends() {
		return JS.select(FRIENDS, (key, value) => new Player({
			id: key,
			name: value.name,
			photo: value.photo
		}));
	}
	static getRankEntries() {
		return this.getFriends()
			.select(m => new RankEntry({ score: rndInt(10, 200) }, m))
			.orderBy(m => m._data.score, (v1, v2) => v2 - v1)
			.each((m, i) => m._data.rank = i);
	}
};

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
    	return Promise.resolve(MockData.getFriends());
    }
    incrementStatsAsync() {
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
		return Promise.resolve(MockData.getRankEntries());
	}
	getEntriesAsync() {
		return Promise.resolve(MockData.getRankEntries());
	}
};

// context
class Context {
	constructor() {
		this._data = {};
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
		var r = MockData.getFriends();
		return Promise.resolve(r.take(rndInt(0, r.length)));
	}
};

// payment
class Payment {
	getCatalogAsync() {
		return Promise.resolve([]);
	}
	purchaseAsync(config) {
		return Promise.reject();
	}
	onReady(callback) {
		raise(callback);
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
module.exports = {
	context: new Context(),
	player: new LoginPlayer(ME),
	payment: new Payment(),

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
		return Promise.resolve(new FbAdInstance(id, INTER));
	},
	getRewardedVideoAsync(id) {
		return Promise.resolve(new FbAdInstance(id, VIDEO));
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
	}
};
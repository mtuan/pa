module.exports = {
	// string
	format(string, ...args) {
		var i = 0;
		return string.replace(/\%s/g, m => args[i++]);
	},
	// return now since EPOC in seconds
	now() {
		return new Date().getTime() / 1000;
	},
	// type conversions
	string(value) {
		return "" + value;
	},
	number(value) {
		return (1 * value) || 0;
	},
	bool(value) {
		return value === true || value === 1 || value === "true" || value === "1";
	},
	// type check
	isBool(value) {
		return typeof value === "boolean";
	},
	isDefined(value) {
		return typeof value !== "undefined";
	},
	isFunction(value) {
		return typeof value === "function";
	},
	isNumber(value) {
		return typeof value === "number";
	},
	isString(value) {
		return typeof value === "string";
	},
	isArray(value) {
		return value instanceof Array;
	},
	isEmpty(value) {
		return !value || value.length == 0;
	},
	isType(value, type) {
		return value instanceof type;
	},
	// linq
	each(target, callback) {
		if (this.isArray(target)) {
			return this._eachArray(target, callback);
		} else {
			return this._eachObj(target, callback);
		}
	},
	_eachArray(array, callback) {
		var r = [];
		for (var i = 0; i < array.length; i++) {
			r.push(callback(array[i], i));
		}
		return r;
	},
	_eachObj(obj, callback) {
		var r = [];
		for (var key in obj) {
			r.push(callback(key, obj[key]));
		}
		return r;
	},
	sum(array, fnValue) {
		var r = 0;
		for (var i = 0; i < array.length; i++) {
			r += fnValue ? fnValue(array[i], i) : array[i];
		}
		return r;
	},
	// random
	rnd(...args) {
		var r = Math.random();
		switch (args.length) {
			case 1: return r * args[0];
			case 2: return args[0] + (args[1] - args[0]) * r;
			default: return r;
		}
	},
	rndBool(range = 0.5) {
		return this.rnd() < range;
	},
	rndInt(min, max) {
		return min + Math.floor(this.rnd() * (max + 1 - min));
	},
	rndItem(values) {
		return values[this.rndInt(0, values.length - 1)];
    },
    rndKey(obj, fnChance) {
    	var chances = [];
    	var keys = [];
    	for (var key in obj) {
    		keys.push(key);
    		chances.push(fnChance ? fnChance(obj, key) : 100);
    	}
    	return keys[this.rndChance(chances)];
    },
    rndChance(chances) {
    	var total = this.sum(chances);
    	var value = this.rnd(total);
    	var sum = 0;
    	for (var i = 0; i < chances.length; i++) {
    		sum += chances[i];
    		if (value < sum) {
    			return i;
    		}
    	}
    	return -1;
    }	
};
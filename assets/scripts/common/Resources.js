function parseParameters(options, onProgress, onComplete) {
    if (onComplete === undefined) {
        var isCallback = typeof options === "function";
        if (onProgress) {
            onComplete = onProgress;
            if (!isCallback) {
                onProgress = null;
            }
        } else if (onProgress === undefined && isCallback) {
            onComplete = options;
            options = null;
            onProgress = null;
        }
        if (onProgress !== undefined && isCallback) {
            onProgress = options;
            options = null;
        }
    }
    options = options || Object.create(null);
    return { options, onProgress, onComplete };
}
function downloadAjax(url, options, onProgress, onComplete) {
    var { options, onProgress, onComplete } = parseParameters(options, onProgress, onComplete);
    var errInfo = "download failed: " + url + ", status: ";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    if (options.responseType !== undefined) xhr.responseType = options.responseType;
    if (options.withCredentials !== undefined) xhr.withCredentials = options.withCredentials;
    if (options.mimeType !== undefined && xhr.overrideMimeType ) xhr.overrideMimeType(options.mimeType);
    if (options.timeout !== undefined) xhr.timeout = options.timeout;
    if (options.header) {
        for (var m in options.header) {
            xhr.setRequestHeader(m, options.header[m]);
        }
    }
    if (onProgress) {
        xhr.onprogress = function (e) {
            if (e.lengthComputable) {
                onProgress(e.loaded, e.total);
            }
        };
    }
    if (onComplete) {
	    xhr.onload = () => {
	        if ( xhr.status === 200 || xhr.status === 0 ) {
	            onComplete(null, xhr.response);
	        } else {
	            onComplete(new Error(errInfo + xhr.status + "(no response)"));
	        }
	    };
	    xhr.onerror = () => {
	        onComplete(new Error(errInfo + xhr.status + "(error)"));
	    };
	    xhr.ontimeout = () => {
	        onComplete(new Error(errInfo + xhr.status + "(time out)"));
	    };
	    xhr.onabort = () => {
	        onComplete(new Error(errInfo + xhr.status + "(abort)"));
	    };
    }

    xhr.send(null);
    
    return xhr;
}

module.exports = {
	// load remote resources
	loadAsync(...args) {
		return new Promise((resolve, reject) => {
			cc.loader.load(...args, (errors, result) => {
				if (errors) {
					reject(errors);
				} else {
					resolve(result);
				}
			});
		});
    },
    // load ajax
    loadAjaxAsync(url) {
    	return new Promise((resolve, reject) => {
    		downloadAjax(url, (err, data) => {
    			if (err) {
    				reject(err);
    			} else {
    				resolve(data);
    			}
    		});
    	});
    },
    loadJsonAsync(url) {
		return this.loadAjaxAsync(url).then(d => JSON.parse(d));
	},
	loadScriptAsync(url) {
		return this.loadAjaxAsync(url).then(d => eval(d));
	},
	// load bundle
	_bundles: {},
	loadBundleAsync(url) {
		if (url.startsWith("http")) {
			return this.loadRemoteBundleAsync(url);
		} else {
			return new Promise((resolve, reject) => {
				cc.assetManager.loadBundle(url, (err, bundle) => {
					if (err) {
						reject(err);
					} else {
						resolve(bundle);
					}
				})
			});
		}
	},
	loadRemoteBundleAsync(url) {
		if (this._bundles[url]) {
			return Promise.resolve(this._bundles[url]);
		}
		var configs = null;
		var p1 = this.loadJsonAsync(cc.path.join(url, "config.json")).then((d) => {
			configs = d;
			configs.base = url + "/";
		});
		var p2 = this.loadScriptAsync(cc.path.join(url, "index.raw"));
		return Promise.all([p1, p2]).then(() => {
			return this._createBundleAsync(configs).then((bundle) => {
				return this._bundles[url] = bundle;
			});
		});
	},
	_createBundleAsync(configs) {
		var r = new cc.AssetManager.Bundle();
		r.init(configs);
		r.loadAsync = function(...args) {
			return new Promise((resolve, reject) => {
				this.load(...args, (err, data) => {
					if (err) {
						reject(err);
					} else {
						resolve(data);
					}
				});
			})
		};
		return r.loadAsync("images/externals").then((d) => {
			r._config.externals = d.json;
			return r;
		}).catch(() => r);
	}
};
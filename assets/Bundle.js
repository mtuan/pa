function transformBundleUrl(task) {
	if (task.input) {
		for (var m of task.input) {
			if (!m.config || !m.config.externals) {
				continue;
			}
			var url = m.config.externals[m.info.path];
			if (url) {
				m.url = url;
			}
		}
	}
	task.output = task.input;
}
function parseParameters(options, onProgress, onComplete) {
    if (onComplete === undefined) {
        var isCallback = typeof options === 'function';
        if (onProgress) {
            onComplete = onProgress;
            if (!isCallback) {
                onProgress = null;
            }
        }
        else if (onProgress === undefined && isCallback) {
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
function downloadFile(url, options, onProgress, onComplete) {
    var { options, onProgress, onComplete } = parseParameters(options, onProgress, onComplete);

    var xhr = new XMLHttpRequest(), errInfo = 'download failed: ' + url + ', status: ';

    xhr.open('GET', url, true);

    if (options.responseType !== undefined) xhr.responseType = options.responseType;
    if (options.withCredentials !== undefined) xhr.withCredentials = options.withCredentials;
    if (options.mimeType !== undefined && xhr.overrideMimeType ) xhr.overrideMimeType(options.mimeType);
    if (options.timeout !== undefined) xhr.timeout = options.timeout;

    if (options.header) {
        for (var header in options.header) {
            xhr.setRequestHeader(header, options.header[header]);
        }
    }

    xhr.onload = function () {
        if ( xhr.status === 200 || xhr.status === 0 ) {
            onComplete && onComplete(null, xhr.response);
        } else {
            onComplete && onComplete(new Error(errInfo + xhr.status + '(no response)'));
        }

    };

    if (onProgress) {
        xhr.onprogress = function (e) {
            if (e.lengthComputable) {
                onProgress(e.loaded, e.total);
            }
        };
    }

    xhr.onerror = function(){
        onComplete && onComplete(new Error(errInfo + xhr.status + '(error)'));
    };

    xhr.ontimeout = function(){
        onComplete && onComplete(new Error(errInfo + xhr.status + '(time out)'));
    };

    xhr.onabort = function(){
        onComplete && onComplete(new Error(errInfo + xhr.status + '(abort)'));
    };

    xhr.send(null);
    
    return xhr;
}
cc.assetManager.transformPipeline = cc.assetManager.transformPipeline.append(transformBundleUrl);

module.exports = {
	loadFileAsync(url) {
		return new Promise((resolve, reject) => {
			downloadFile(url, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	},
	loadJsonAsync(url) {
		return this.loadFileAsync(url).then(d => JSON.parse(d));
	},
	loadScriptAsync(url) {
		return this.loadFileAsync(url).then(d => eval(d));
	},
	loadAsync(url) {
		var configs = null;
		var p1 = this.loadJsonAsync(cc.path.join(url, "config.json")).then((d) => {
			configs = d;
			configs.base = url + "/";
		});
		var p2 = this.loadScriptAsync(cc.path.join(url, "index.raw"));
		return Promise.all([p1, p2]).then(() => this._createBundle(configs));
	},
	_createBundle(configs) {
		var r = new cc.AssetManager.Bundle();
		r.init(configs);
		if (configs.externals) {
			r._config.externals = configs.externals;
		}
		return r;
	}
};
module.exports = {
	loaded: {},
	loadFile(url, options, onSuccess, onFailure) {
		// check cached
		if (this.loaded[url]) {
			return Promise.resolve(this.loaded[url]);
		}
		
		// create request
	    var xhr = new XMLHttpRequest();
	    xhr.open("GET", url, true);
	    // set attributes
	    if (options) {
		    if (options.responseType !== undefined) xhr.responseType = options.responseType;
		    if (options.withCredentials !== undefined) xhr.withCredentials = options.withCredentials;
		    if (options.mimeType !== undefined && xhr.overrideMimeType ) xhr.overrideMimeType(options.mimeType);
		    if (options.timeout !== undefined) xhr.timeout = options.timeout;
		    if (options.header) {
		        for (var header in options.header) {
		            xhr.setRequestHeader(header, options.header[header]);
		        }
		    }
	    }
	    // set callbacks
	    xhr.onload = () => {
	        if (xhr.status === 200 || xhr.status === 0) {
	            onSuccess && onSuccess(null, xhr.response);
	        } else {
	            onFailure && onFailure(new Error(errInfo + xhr.status + "(no response)"));
	        }
	    };
	    if (options && options.onProgress) {
	        xhr.onprogress = (e) => {
	            if (e.lengthComputable) {
	            	options.onProgress(e.loaded, e.total);
	            }
	        };
	    }
	    if (onFailure) {
		    xhr.onerror = () => onFailure(new Error(errInfo + xhr.status + "(error)"));
		    xhr.ontimeout = () => onFailure(new Error(errInfo + xhr.status + "(time out)"));
		    xhr.onabort = () => onFailure(new Error(errInfo + xhr.status + "(abort)"));
	    }
	    // send
	    xhr.send(null);	    
	    return xhr;
	},
	loadFileAsync(url, options) {
		return new Promise((...args) => this.loadFile(url, options, ...args));
	},
	loadJsonAsync(url) {
		return this.loadFileAsync(url, { responseType: "json" }).then((d) => {
			return isString(d) ? JSON.parse(d) : d;
		});
	},
	loadJsAsync(url) {
		return this.loadFileAsync(url).then((d) => {
			return eval(d);
		});
	}
};
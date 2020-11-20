if (window.restfull === undefined) {
    (function() {

    	function get(options, callback) {
            if(options.data) {
                var data = typeof(options.data) === 'string' ? options.data : JSON.stringify(options.data)
                    , startChar = options.path.indexOf('?') > -1 ? '&' : '?'
                ;
                options.path += startChar + 'data=' + encodeURIComponent(data);
            }
            var req = new XMLHttpRequest();
            req.open('GET', options.path, true);
            addHeaders(req, options);
            if (options.contentType !== false) 
                req.setRequestHeader('content-type', options.contentType || 'application/json')
            req.onreadystatechange = function() {
    			handleResponse(req, this, callback);
            }
            req.send();
    	}
    	function post(options, callback) {
            var req = new XMLHttpRequest();
            req.open('POST', options.path, true);
            addHeaders(req, options);
            if (options.contentType !== false)
                req.setRequestHeader('content-type', options.contentType || 'application/json')
            req.onreadystatechange = function() {
    			handleResponse(req, this, callback);
            }
            req.send(formatData(options));
    	}
        function patch(options, callback) {
            var req = new XMLHttpRequest();
            req.open('PATCH', options.path, true);
            addHeaders(req, options);
            if (options.contentType !== false)
                req.setRequestHeader('content-type', options.contentType || 'application/json')
            req.onreadystatechange = function() {
                handleResponse(req, this, callback);
            }
            req.send(formatData(options));
        }
    	function put(options, callback) {
            var req = new XMLHttpRequest();
            req.open('PUT', options.path, true);
            addHeaders(req, options);
            if (options.contentType !== false)
                req.setRequestHeader('content-type', options.contentType || 'application/json')
            req.onreadystatechange = function() {
    			handleResponse(req, this, callback);
            }
            req.send(formatData(options));
    	}
    	function del(options, callback) {
            var req = new XMLHttpRequest();
            req.open('DELETE', options.path, true);
            addHeaders(req, options)
            if (options.contentType !== false)
                req.setRequestHeader('content-type', options.contentType || 'application/json')
            req.onreadystatechange = function() {
            	handleResponse(req, this, callback);
            }
            req.send(formatData(options));
    	}

    	function handleResponse(req, xhr, callback) {
            if (req.readyState != 4) {
                return;
            }
    	    if (req.status >= 300){
            	if (callback) callback(xhr.response, null, req.status)
            }
            else if(req.readyState == 4) {
                if (callback) callback(null, xhr.response, req.status)
            }
		}

        function addHeaders(req, options) {
            Object.keys(options.headers || {}).forEach(function(header) {
                req.setRequestHeader(header, options.headers[header]);
            })
        }

        function formatData(options) {
            if (options.contentType === false)
                return options.data
            if (options.contentType === undefined)
                return JSON.stringify(options.data);
            if (options.contentType.toLowerCase() != 'application/json')
                return options.data;
            return JSON.stringify(options.data);
        }

    	window.restfull = {
    		get: get,
    		post: post,
            patch: patch,
    		put: put,
    		del: del
    	}
    }());
}
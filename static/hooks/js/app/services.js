app.service('api', ['$http', '$cookies', function($http, $cookies) {

    var APPLICATION_URL_PATH = "/api/1.0/applications/";
    var HOOKS_URL_PATH = "/api/1.0/hooks/";
    var REQUEST_URL_PATH = "/api/1.0/requests/";

    var X_CSRF_TOKEN_HEADER_NAME = "X-CSRFToken";
    var COOKIE_HEADER_NAME = "Cookie";

    var config = {
        headers:  {
            'Content-Type': 'application/json'
        }
    };

    var urlEncode = function(obj) {
        var str = [];
        for(var p in obj)
            if (obj.hasOwnProperty(p)) {
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    };

    var defaultHeaders = function() {
        var csrftoken = $cookies.get("csrftoken") || "";

        var xHeaders = config.headers;
        xHeaders[X_CSRF_TOKEN_HEADER_NAME] = csrftoken;
        return xHeaders;
    };

    var _http = function(method, url, query_params, data, headers, transformRequest) {
        query_params = query_params || null;
        data = data || null;
        headers = headers || defaultHeaders();
        transformRequest = transformRequest || null;

        if (transformRequest != null)
            var req = {
                method: method,
                url: url,
                headers: headers,
                params: query_params,
                data: data,
                transformRequest: transformRequest
            };
        else
            var req = {
                method: method,
                url: url,
                headers: headers,
                params: query_params,
                data: data,
            };

        return $http(req);
    };

    this.getApplications = function() {
        return _http("GET", APPLICATION_URL_PATH);
    };

    this.getApplication = function(id) {
        return _http("GET", APPLICATION_URL_PATH + id + "/");
    };

    this.createApplication = function(name, appId, secret) {
        params = {"name": name, "app_id": appId, "secret": secret}
        return _http("POST", APPLICATION_URL_PATH, null, params);
    };

    this.pairApplication = function(id, token) {
        var params = {"token": token}
        return _http("POST", APPLICATION_URL_PATH + id + "/pair/", null, params);
    };

    this.unpairApplication = function(id) {
        return _http("POST", APPLICATION_URL_PATH + id + "/unpair/", null, null);
    };

    this.updateApplication = function(id, name, appId, secret) {
        params = {"name": name, "app_id": appId, "secret": secret}
        return _http("PUT", APPLICATION_URL_PATH + id + "/", null, params);
    };

    this.deleteApplication = function(id) {
        return _http("DELETE", APPLICATION_URL_PATH + id + "/", null, null);
    };

    this.getHooks = function(application) {
        query_params = {"application": application}
        return _http("GET", HOOKS_URL_PATH, query_params, null);
    };

    this.getHook = function(id) {
        return _http("GET", HOOKS_URL_PATH + id + "/", null, null);
    };

    this.deleteHook = function(id) {
        return _http("DELETE", HOOKS_URL_PATH + id + "/", null, null);
    };

    this.createRequest = function(method, url, body) {
        params = {"method": method, "url": url, "body": body}
        return _http("POST", REQUEST_URL_PATH, null, params);
    };

    this.createHook = function(name, description, latch_status, method, url, body, regex, method2, url2, body2, regex2, application) {
        params = {"name": name, "description": description, "latch_status": latch_status, "method": method, "url": url,
            "body": body, "regex": regex, "application": application};
        return _http("POST", HOOKS_URL_PATH, null, params);
    };

    this.updateHook = function(id, name, description, latch_status, method, url, body, regex, method2, url2, body2, regex2, application) {
        params = {"name": name, "description": description, "latch_status": latch_status, "method": method, "url": url,
            "body": body, "regex": regex, "method2": method2, "url2": url2,
            "body2": body2, "regex2": regex2, "application": application};
        return _http("PUT", HOOKS_URL_PATH + id + "/", null, params);
    };

}]);
'use strict';

factFindApp.service('ApiService', ['$resource', 'newApiBaseUrl', function ($resource, newApiBaseUrl) {
    var api = $resource(newApiBaseUrl + ':url', { url: "@url" }, {
        get: { method: 'GET' },
        post: { method: 'POST' },
        put: { method: 'PUT' },
        delete: { method: 'DELETE' },
        patch: { method: 'PATCH' },
    });

    return {
        get: function (url, params) {
            var data = { url: url };
            for(var key in params) {
                data[key] = params[key];
            }

            return api.get(data)
        },
        post: function (url, params) {
            return api.post({ url: url }, params)
        },
        put: function (url, params) {
            return api.put({ url: url }, params)
        },
        delete: function (url, params) {
            return api.delete({ url: url }, params)
        },
        patch: function (url, params) {
            return api.patch({ url: url }, params)
        },
    }

}]);

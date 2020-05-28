'use strict';

factFindApp.service('liabilitiesService', ['$resource', '$q', 'apiBaseUrl', function ($resource, $q, apiBaseUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});

        return{
            getLiabilities: function (details) {
                var deferred = $q.defer();
                api.query({action: 'Get', subaction: 'GetLiabilities', request: 'GET', FFID: details.FFID, AppID: details.AppID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveDetail: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveLiabilities', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            SaveSelectedClientID: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveSelectedClientID', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveDeleteSelectedClient: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'DeleteByclientidAndCategory', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            DeleteLiability: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Delete', subaction: 'DeleteLiability', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
        };
    }]);

'use strict';

factFindApp.service('monthlyOutgoingService', ['$resource', '$q', 'apiBaseUrl', function ($resource, $q, apiBaseUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});

        return{
            getOutgoingDetails: function (detail) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetExpenditure', request: 'GET', FFID: detail.FFID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveOutgoingDetails: function (detail) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'saveExpenditure', request: 'POST'}, detail, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            
        };
    }]);

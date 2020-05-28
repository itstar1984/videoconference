'use strict';

factFindApp.service('dependantService', ['$resource', '$q', 'apiBaseUrl', function ($resource, $q, apiBaseUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});

        return{
            getDependants: function (detail) {
                var deferred = $q.defer();
                api.query({action: 'Get', subaction: 'GetDependantDetails', request: 'GET', FF_id: detail.FFID, AppID: detail.AppID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveDependants: function (detail) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveDependants', request: 'POST'}, detail, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            deleteDependant: function(detail){
                var deferred = $q.defer();
                api.save({action: 'Delete', subaction: 'DeleteDependant', request: 'POST'}, detail, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }

        };
    }]);

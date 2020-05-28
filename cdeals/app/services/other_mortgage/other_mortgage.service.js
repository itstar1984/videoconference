'use strict';

factFindApp.service('otherMortService', ['$resource', '$q', 'apiBaseUrl', function ($resource, $q, apiBaseUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});
        var subApi = $resource('./php_pages/getOtherExistingMort.php?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});
        return{
            getOtherMortgageDetails: function (details) {
                var deferred = $q.defer();
                subApi.query({action: 'Get', subaction: 'GetOtherMortgageDetailsByFFID', request: 'GET', FFID: details.FFID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveExistingMortgage: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveExistingMortgage', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveSelectedClientID: function (details) {
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
            DeleteExistingMortgage: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Delete', subaction: 'DeleteExistingMortgage', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
        };
    }]);

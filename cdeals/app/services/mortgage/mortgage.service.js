'use strict';

factFindApp.service('mortgageService', ['$resource', '$q', 'apiBaseUrl', function ($resource, $q, apiBaseUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});
        var subApi = $resource('./php_pages/GetMortAppDetails.php?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});
        var saveCurrentApi = $resource('./php_pages/cmortgage.php?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});
        var saveMortApi = $resource('./php_pages/cmortgageapp.php?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});
        return{
            getDetails: function (details) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetMortAppDetails_ByAppID', request: 'GET', FFID: details.FFID, AppID: details.AppID, IsDefaultApplication: true}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getCurrentMortgageDetails: function (details) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetCurrentMortgages', request: 'GET', FFID: details.FFID, AppID: details.AppID, IsDefaultApplication: true}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            SaveMortAppDetail: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveMortAppDetail', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            SaveCurrentMortgages: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveCurrentMortgages', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
        };
    }]);

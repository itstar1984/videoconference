'use strict';

factFindApp.service('sourceService', ['$resource', '$q', 'apiBaseUrl', function ($resource, $q, apiBaseUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});
        var subApi = $resource('./php_pages/getsource.php?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});
        return{
            getSourceDetails: function (details) {
                var deferred = $q.defer();
                subApi.get({action: 'Get', subaction: 'GetProductstest', request: 'GET', FFID: details.FFID, Appid: details.Appid}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            SaveShortlist: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveShortlist', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            SaveMortgageSelectedSave: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveMortgageSelectedSave', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            SaveMortgageProductNotes: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveMortgageProductNotes', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
        };
    }]);

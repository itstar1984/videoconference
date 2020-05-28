'use strict';

factFindApp.service('quoteService', ['$resource', '$q', 'apiBaseUrl', function ($resource, $q, apiBaseUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});

        return{
            getActiveQuotes: function (applicant) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetActiveMort', request: 'GET', FFID: applicant.FFID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getDeActiveQuotes: function (applicant) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetDeActiveMort', request: 'GET', FFID: applicant.FFID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getQuoteSummary: function (details) {
                var deferred = $q.defer();
                api.query({action: 'Get', subaction: 'GetQuoteSummary', request: 'GET', FFID: details.FFID, MortQuoteID: details.MortQuoteID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getMortgageProductNotes: function (details) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetMortgageProductNotes', request: 'GET', FF_ID: details.FFID, MortgageQuoteID: details.MortQuoteID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateMortageQuoteSelected: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'UpdateMortageQuoteSelected', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
        };
    }]);

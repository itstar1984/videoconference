'use strict';

factFindApp.service('creditHistoryService', ['$resource', '$q', 'apiBaseUrl', function ($resource, $q, apiBaseUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});

        return{
            saveCCJDetail: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveCCJ', request: 'POST'}, details, function (response) {
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
            getCCJDetails: function (details) {
                var deferred = $q.defer();
                api.query({action: 'Get', subaction: 'GetCCJ', request: 'GET', FFID: details.FFID, Appid: details.Appid}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveDefaultDetail: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveDefaults', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getDefaultDetails: function (details) {
                var deferred = $q.defer();
                api.query({action: 'Get', subaction: 'GetDefaults', request: 'GET', FFID: details.FFID, Appid: details.Appid}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveBankruptDetail: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveBankruptcy', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getBankruptDetails: function (details) {
                var deferred = $q.defer();
                api.query({action: 'Get', subaction: 'GetBankruptcy', request: 'GET', FFID: details.FFID, Appid: details.Appid}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveIVADetail: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveIVA', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getIVADetails: function (details) {
                var deferred = $q.defer();
                api.query({action: 'Get', subaction: 'GetIVA', request: 'GET', FFID: details.FFID, Appid: details.Appid}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveRepossessionsDetail: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveReposessions', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getRepossessionsDetails: function (details) {
                var deferred = $q.defer();
                api.query({action: 'Get', subaction: 'GetRepossesion', request: 'GET', FFID: details.FFID, Appid: details.Appid}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveSaveArrearsDetail: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveArrears', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getSaveArrearsDetails: function (details) {
                var deferred = $q.defer();
                api.query({action: 'Get', subaction: 'GetArrears', request: 'GET', FFID: details.FFID, Appid: details.Appid}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getNumOccurencesDetails: function (details) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'getNumOccurencesByFFID', request: 'GET', FFID: details.FFID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveNumOccurencesDetail: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveNumOccurences', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            deleteCH: function (details, apiName) {
                var deferred = $q.defer();
                api.save({action: 'Delete', subaction: apiName, request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
        };
    }]);

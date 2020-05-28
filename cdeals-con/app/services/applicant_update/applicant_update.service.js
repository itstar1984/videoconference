'use strict';

factFindApp.service('appClientUpdate', ['$resource', '$q', 'apiBaseUrl', function ($resource, $q, apiBaseUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});
        var app_update = {
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
            updateApplicant: function (details, ScopeID, categoryId, fn) {
                if (details.cliendidMasterArray.length > details.clientids.length) {
                    var diffClients = _.difference(details.cliendidMasterArray, details.clientids);
                    angular.forEach(diffClients, function (ClientID) {
                        if (ClientID) {
                            var selectedObj = {
                                "ScopeID": ScopeID,
                                "ClientID": ClientID,
                                "eFinancialCategoryID": categoryId
                            };
                            app_update.saveDeleteSelectedClient(selectedObj).then(function (response) {
                            });
                        }
                    });
                    var revClients = details.clientids.filter(function (aItem) {
                        return !(~details.cliendidMasterArray.indexOf(aItem));
                    });
                    angular.forEach(revClients, function (ClientID) {
                        var selectedObj = {
                            "ScopeID": ScopeID,
                            "ClientID": ClientID,
                            "eFinancialCategoryID": categoryId
                        };
                        app_update.saveSelectedClientID(selectedObj).then(function (response) {

                        });
                    });
                } else if (details.clientids.length > details.cliendidMasterArray.length) {
                    var diffClients = _.difference(details.clientids, details.cliendidMasterArray);
                    angular.forEach(diffClients, function (ClientID) {
                        var selectedObj = {
                            "ScopeID": ScopeID,
                            "ClientID": ClientID,
                            "eFinancialCategoryID": categoryId
                        };
                        app_update.saveSelectedClientID(selectedObj).then(function (response) {

                        });
                    });
                    var revClients = details.cliendidMasterArray.filter(function (aItem) {
                        return !(~details.clientids.indexOf(aItem));
                    });
                    angular.forEach(revClients, function (ClientID) {
                        var selectedObj = {
                            "ScopeID": ScopeID,
                            "ClientID": ClientID,
                            "eFinancialCategoryID": categoryId
                        };
                        app_update.saveDeleteSelectedClient(selectedObj).then(function (response) {

                        });
                    });
                } else if (details.clientids.length === details.cliendidMasterArray.length) {
                    var diffClients = _.difference(details.clientids, details.cliendidMasterArray);
                    if (angular.equals(diffClients, details.clientids)) {
                        angular.forEach(details.cliendidMasterArray, function (ClientID) {
                            if (ClientID) {
                                var selectedObj = {
                                    "ScopeID": ScopeID,
                                    "ClientID": ClientID,
                                    "eFinancialCategoryID": categoryId
                                };
                                app_update.saveDeleteSelectedClient(selectedObj).then(function (response) {
                                });
                            }
                        });
                        angular.forEach(details.clientids, function (ClientID) {
                            var selectedObj = {
                                "ScopeID": ScopeID,
                                "ClientID": ClientID,
                                "eFinancialCategoryID": categoryId
                            };
                            app_update.saveSelectedClientID(selectedObj).then(function (response) {

                            });
                        });
                    } else {
                        var revClients = _.difference(details.cliendidMasterArray, details.clientids);
                        angular.forEach(revClients, function (ClientID) {
                            if (ClientID) {
                                var selectedObj = {
                                    "ScopeID": ScopeID,
                                    "ClientID": ClientID,
                                    "eFinancialCategoryID": categoryId
                                };
                                app_update.saveDeleteSelectedClient(selectedObj).then(function (response) {
                                });
                            }
                        });
                        angular.forEach(diffClients, function (ClientID) {
                            var selectedObj = {
                                "ScopeID": ScopeID,
                                "ClientID": ClientID,
                                "eFinancialCategoryID": categoryId
                            };
                            app_update.saveSelectedClientID(selectedObj).then(function (response) {

                            });
                        });
                    }
                }
                $timeout(function () {
                    fn();
                }, 200);
            }
        };
        return app_update;
    }]);

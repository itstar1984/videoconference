'use strict';

factFindApp.service('addresstService', ['$resource', '$q', 'apiBaseUrl', function ($resource, $q, apiBaseUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});

        return{
            getDetails: function (detail) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetFullAddressesbyAddressID', request: 'GET', AddressID: detail.AddressID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getAddressDetailsByclientID: function (detail) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetAddressIDbyClientID', request: 'GET', clientID: detail.clientID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveDetail: function (detail) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveAddress', request: 'POST'}, detail, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            searchAddress: function (detail) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetPostcodeByFreeText', request: 'GET', postcode: detail.postcode}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getAddressByPostcode: function (detail) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetFullAddressByID', request: 'GET', postcodeID: detail.postcodeID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            deleteAddress: function(detail){
                var deferred = $q.defer();
                api.save({action: 'Delete', subaction: 'DeleteAddresses', request: 'POST'}, detail, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
            
        };
        var jsonDetails = {
            "XmlTagName": "Addresses",
            "ModifiedBy": 1,
            "ModifiedByForDatabase": 1,
            "AddressID": 1,
            "FFID": 2,
            "ClientID": 3,
            "eAddressTypeID": 4,
            "CurrentAddress": true,
            "ContactName": "sample string 6",
            "Address1": "sample string 7",
            "Address2": "sample string 8",
            "Address3": "sample string 9",
            "Town": "sample string 10",
            "County": "sample string 11",
            "Country": "sample string 12",
            "PostCode": "sample string 13",
            "HomePhone": "sample string 14",
            "WorkPhone": "sample string 15",
            "MobilePhone": "sample string 16",
            "EmailAddress": "sample string 17",
            "Fax": "sample string 18",
            "DateFrom": "2017-12-22T09:25:33.7211594+00:00",
            "DateTo": "2017-12-22T09:25:33.7221594+00:00",
            "Modified_By": 1,
            "ObjectState": 0
        }
    }]);

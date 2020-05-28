'use strict';

factFindApp.service('applicantService', ['$resource', '$q', 'apiBaseUrl', function ($resource, $q, apiBaseUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});

        return{
            getDetails: function (applicant) {
                var deferred = $q.defer();
                api.query({action: 'Get', subaction: 'GetClientDetails', request: 'GET', FF_id: applicant.FFID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveDetail: function (applicantDetails) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveClients', request: 'POST'}, applicantDetails, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveAppClientDetail: function (applicantDetails) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveAppClients', request: 'POST'}, applicantDetails, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
        };
        var jsonDetails = {
            "XmlTagName": "Clients",
            "ModifiedBy": 1,
            "ModifiedByForDatabase": 1,
            "IsSourcingRefreshRequired": true,
            "ClientID": 2,
            "FFID": 3,
            "AddressID": 1,
            "Active": true,
            "eTitleID": 1,
            "Surname": "sample string 5",
            "Firstname": "sample string 6",
            "Middlenames": "sample string 7",
            "MaidenName": "sample string 8",
            "DOB": "2017-12-22T08:56:22.9211594+00:00",
            "DateFrom": "2017-12-22T08:56:22.9211594+00:00",
            "DateTo": "2017-12-22T08:56:22.9211594+00:00",
            "ElectoralRoll": true,
            "RightToResideUK": true,
            "ProfStatus": true,
            "eGenderID": 1,
            "AnticipatedRetireAge": 1,
            "Smoker": true,
            "eNationalityID": 1,
            "eMaritalStatusID": 1,
            "eProofResDurationID": 1,
            "GoodHealth": true,
            "NeverDeclinedInsurance": true,
            "NeverDeclaredBankrupt": true,
            "HaveDependent": true,
            "Modified_By": 1,
            "ObjectState": 0
        }
    }]);

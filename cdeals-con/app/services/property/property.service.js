'use strict';

factFindApp.service('propertyService', ['$resource', '$q', 'apiBaseUrl', function ($resource, $q, apiBaseUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});

        return{
            getLatestDetailsByFFID: function (details) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetLatestPropertyByFFID', request: 'GET', FFID: details.FFID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getDetailsByAddressId: function (details) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetProperties', request: 'GET', AddressID: details.AddressID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveDetail: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveProperties', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveApplicationsDetail: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveApplications', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
        };
        var jsonDetails = {
            "XmlTagName": "Properties",
            "ModifiedBy": 1,
            "ModifiedByForDatabase": 1,
            "IsSourcingRefreshRequired": true,
            "PropertyDetailsID": 2,
            "AddressID": 3,
            "eApplicantID": 1,
            "eCountryID": 1,
            "ePropertyTypeID": 1,
            "ePropertyStatusID": 1,
            "eConstructionTypeID": 1,
            "eAlarmTypeID": 1,
            "eNonStdConstructionTypeID": 1,
            "eTenureTypeID": 1,
            "Listed": true,
            "ExLocalAuthority": true,
            "AgeYears": 1,
            "AgeMonths": 1,
            "ArchitectCertificate": true,
            "NumBedrooms": 1,
            "NumKitchens": 1,
            "NumBathrooms": 1,
            "NumGarages": 1,
            "NumOutbuildings": 1,
            "SelfBuild": true,
            "MultipleOccupancy": true,
            "DateFrom": "2017-12-28T05:02:38.0095906+00:00",
            "DateTo": "2017-12-28T05:02:38.0265906+00:00",
            "SemiCommercial": true,
            "ApprovedLocks": true,
            "ApprovedAlarm": true,
            "eWallConstructionID": 1,
            "eRoofConstructionID": 1,
            "FlatRoofPerc": 1,
            "OwnEntrance": true,
            "StudioFlat": true,
            "BalconyAccess": true,
            "PurposeBuilt": true,
            "Lift": true,
            "Converted": true,
            "Floor": 1,
            "NumFloors": 1,
            "AgriculturalTie": true,
            "HomeForDependantRelative": true,
            "LeaseYearsRemaining": 1,
            "ePropertyResidenceID": 1,
            "AboveCommercial": true,
            "eAboveCommercialID": 1,
            "FlyingFreeholdPercent": 1,
            "YearBuiltIn": "sample string 21",
            "IsUsedForBuisnessPurpose": true,
            "eArchitecturalID": 1,
            "PropertyClericalPurposeOnly": true,
            "PropertyVisitorForBusiness": true,
            "StockHeldInPremises": true,
            "ValueOfStock": 1.0,
            "ValueOfBusinessEquipment": 1.0,
            "eOccupancyPeriodID": 1,
            "PropertyStructureTypeID": 1,
            "ExpectedNoOfOccupants": 1,
            "eOccupancyStatus": 1,
            "eBCISecurityTypeID": 1,
            "ExternalDoor": true,
            "PatioDoor": true,
            "WindowLock": true,
            "AlarmApproved": true,
            "LetSubLet": true,
            "PercentShared": 1.0,
            "Modified_By": 1,
            "ObjectState": 0
        }
    }]);

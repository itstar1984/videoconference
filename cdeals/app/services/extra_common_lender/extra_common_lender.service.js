'use strict';

factFindApp.service('extraLenderService', ['$resource', '$q', 'apiBaseUrl', function ($resource, $q, apiBaseUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});

        return{
            getDetails: function (details) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetExtraCommonLenderQn', request: 'GET', FFID: details.FFID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveDetail: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveExtraCommonLender', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
        };
        var jsonDetails = {
            "XmlTagName": "ExtraCommonLenderQn",
            "ModifiedBy": -1,
            "ModifiedByForDatabase": -1,
            "ExtraQnID": 1,
            "FFID": 1,
            "IsResMortgage": "sample string 2",
            "ExtraOutstandingBalance": 1.0,
            "ELender": "sample string 3",
            "EPropertyValue": 1.0,
            "EMonthlyPayment": 1.0,
            "ERentingMonthly": 1.0,
            "LandlordDetails": "sample string 4",
            "MaidenName": "sample string 5",
            "ExtraMonies": "sample string 6",
            "NINumber": "sample string 7",
            "ExtraIncome": "sample string 8",
            "CurrentOccupancy": "sample string 9",
            "GroundRent": 1.0,
            "ServiceRent": 1.0,
            "TimeLeftonLease": "sample string 10",
            "MortgageAccNumber": "sample string 11",
            "Extra1": "sample string 12",
            "Extra2": "sample string 13",
            "Extra3": "sample string 14",
            "MaidenNameApp2": "sample string 15",
            "NINumberApp2": "sample string 16",
            "NumReception": 1,
            "NumBathrooms": 1,
            "IsGarage": "sample string 17",
            "GarageType": "sample string 18",
            "Parking": "sample string 19",
            "IsMortgageFree": "sample string 20",
            "LandlordAddress": "sample string 21",
            "LandlordPhone": "sample string 22",
            "MortgageAddress": "sample string 23",
            "EstateAgentName": "sample string 24",
            "EstateAgentAddress": "sample string 25",
            "ReasonforhouseMove": "sample string 26",
            "Solicitorname": "sample string 27",
            "SolicitorAddress": "sample string 28",
            "SolicitorTelphone": "sample string 29",
            "NameofSolicitor": "sample string 30",
            "FrequencyofPay": "sample string 31",
            "Ispaid": "sample string 32",
            "EmployeeNumber": "sample string 33",
            "ExisBankPeriod": "sample string 34",
            "Savings": "sample string 35",
            "Extra4": "sample string 36",
            "Extra5": "sample string 37",
            "Extra6": "sample string 38",
            "Extra7": "sample string 39",
            "Extra8": "sample string 40",
            "Extra9": "sample string 41",
            "Extra10": "sample string 42",
            "Extra11": "sample string 43",
            "Extra12": "sample string 44",
            "IsParking": "sample string 45",
            "Paid": "sample string 46",
            "IsFamilyLet": true,
            "IsStudentLet": true,
            "IsCapitalRaisingAllowed": true,
            "IsHMO": true,
            "CapitalRaisingReason": "sample string 51",
            "IsPartime": true,
            "Breakin12Months": true,
            "SemicommericalPercentage": 1.0,
            "AdditionalNotes": "sample string 54",
            "Extra13": "sample string 55",
            "Payday12Months": true,
            "PaydayRepaid": true,
            "IsBridging": true,
            "IsBridgingMainResidence": true,
            "BridgingTermMonths": 1,
            "PayEndofTerm": "sample string 60",
            "AnotherAddress": "sample string 61",
            "AnotherValue": 1.0,
            "AnotherOutstanding": 1.0,
            "AnotherLender": "sample string 62",
            "BridgingEquity": 1.0,
            "RemoBetweenMonths": 1,
            "RolledUpInterest": true,
            "IsExpat": true,
            "CurrencyPaid1": "sample string 65",
            "ExpatAdditional1": "sample string 66",
            "IsExpat2": true,
            "CurrencyPaid2": "sample string 68",
            "ExpatAdditional2": "sample string 69",
            "IsExpat3": true,
            "CurrencyPaid3": "sample string 71",
            "ExpatAdditional3": "sample string 72",
            "IsExpat4": true,
            "CurrencyPaid4": "sample string 74",
            "ExpatAdditional4": "sample string 75",
            "App1CurRes": "sample string 76",
            "App1CurrRent": "sample string 77",
            "App2CurRes": "sample string 78",
            "App2CurrRent": "sample string 79",
            "App3CurRes": "sample string 80",
            "App3CurrRent": "sample string 81",
            "App4CurrRes": "sample string 82",
            "App4CurrRent": "sample string 83",
            "Advisor": "sample string 84",
            "IsLimitedBTL": true,
            "App1CurMortgage": 1.0,
            "App2CurMortgage": 1.0,
            "App3CurMortgage": 1.0,
            "App4CurMortgage": 1.0,
            "IsHelptoBuy": true,
            "DepositFromClient": 1.0,
            "ObjectState": 0
        }
    }]);

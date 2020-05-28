'use strict';

factFindApp.service('mortgageService', ['$resource', '$q', 'apiBaseUrl', function ($resource, $q, apiBaseUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});

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
        var jsonDetails = {
            "XmlTagName": "MortAppDetail",
            "ModifiedBy": 1,
            "ModifiedByForDatabase": 1,
            "MortAppID": 1,
            "AppID": 1,
            "eMortgageTypeID": 1,
            "ePaymentMethodID": 1,
            "InterestOnlyAmount": 1.0,
            "RepaymentAmount": 1.0,
            "Deposit": 1.0,
            "eDepositSourceID": 1,
            "TermMonths": 1,
            "PurchasePrice": 1.0,
            "PropertyValue": 1.0,
            "LoanRequired": 1.0,
            "MortAmtRequired": 1.0,
            "LTV": 1.0,
            "eBTLMortgagePaymentCoveredID": 1,
            "BTLAnticipatedMonthlyIncome": 1.0,
            "ExistingMortgage": true,
            "DebtConsolidationAmt": 1.0,
            "ShOwnPcntPurchasing": 1.0,
            "ShOwnMthlyRentalPyt": 1.0,
            "ShOwnRemPcntAlreadyPurchased": 1.0,
            "ShOwnRemNewMthlyIncome": 1.0,
            "RTBPurchasePriceAfterDiscount": 1.0,
            "CapitalRaising": 1.0,
            "Advised": true,
            "eValuationTypeID": 1,
            "BrokerFeeCharged": true,
            "eStampDutyTypeID": 1,
            "SolicitorID": 1,
            "BankID": 1,
            "CardID": 1,
            "ERCAdded": true,
            "ContactLender": true,
            "Outcome": "sample string 7",
            "Reason": "sample string 8",
            "Contingency": 1.0,
            "PropertyPurchaseDate": "2017-12-26T06:34:21.8961594+00:00",
            "IsLTB": true,
            "ISFTL": true,
            "LTBDetails": "sample string 11",
            "Modified_By": 1,
            "ObjectState": 0
        }
    }]);

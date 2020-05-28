'use strict';

factFindApp.service('selectBoxService', ['$resource', '$q', 'apiSelectBoxUrl', function ($resource, $q, apiSelectBoxUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiSelectBoxUrl + '?action=:action', {action: '@action'});
        var getElifeBenifitapi = $resource(apiSelectBoxUrl + '?action=:action&applicant=:applicant', {action: '@action', applicant: '@applicant'});
        var objectifyArray = function (response) {
            var sortedArray = response.sort();
            sortedArray.splice(sortedArray.length - 1, 1);
            var objs = sortedArray.map(function (x) {
                return {
                    name: x[1],
                    val: x[0]
                };
            });
            return objs;
        };
        var objectifyLanderArray = function (response) {
            var sortedArray = response.sort();
            sortedArray.splice(sortedArray.length - 1, 1);
            var objs = sortedArray.map(function (x) {
                return {
                    name: x[1],
                    val: x[0],
                    BackendLenderID: x[2]
                };
            });
            return objs;
        };
        return{
            geteTitles: function () {
                var deferred = $q.defer();
                api.get({action: 'eTitles'}, function (response) {
                    var returnResponse = objectifyArray(response.eTitles);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteGenders: function () {
                var deferred = $q.defer();
                api.get({action: 'eGenders'}, function (response) {
                    var returnResponse = objectifyArray(response.eGenders);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteMaritalStatuses: function () {
                var deferred = $q.defer();
                api.get({action: 'eMaritalStatuses'}, function (response) {
                    var returnResponse = objectifyArray(response.eMaritalStatuses);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteNationalities: function () {
                var deferred = $q.defer();
                api.get({action: 'eNationalities'}, function (response) {
                    var returnResponse = objectifyArray(response.eNationalities);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteProofResDuration: function () {
                var deferred = $q.defer();
                api.get({action: 'eProofResDuration'}, function (response) {
                    var returnResponse = objectifyArray(response.eProofResDuration);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteEmploymentStatuses: function () {
                var deferred = $q.defer();
                api.get({action: 'eEmploymentStatuses'}, function (response) {
                    var returnResponse = objectifyArray(response.eEmploymentStatuses);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteAccountantQualifications: function () {
                var deferred = $q.defer();
                api.get({action: 'eAccountantQualifications'}, function (response) {
                    var returnResponse = objectifyArray(response.eAccountantQualifications);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteDependantRelToAppx: function () {
                var deferred = $q.defer();
                api.get({action: 'eDependantRelToApp'}, function (response) {
                    var returnResponse = objectifyArray(response.eDependantRelToApp);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteDepositSources: function () {
                var deferred = $q.defer();
                api.get({action: 'eDepositSources'}, function (response) {
                    var returnResponse = objectifyArray(response.eDepositSources);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteMortgagePaymentMethods: function () {
                var deferred = $q.defer();
                api.get({action: 'eMortgagePaymentMethods'}, function (response) {
                    var returnResponse = objectifyArray(response.eMortgagePaymentMethods);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteMortgageTypes: function () {
                var deferred = $q.defer();
                api.get({action: 'eMortgageTypes'}, function (response) {
                    var returnResponse = objectifyArray(response.eMortgageTypes);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteBTLMortgagePaymentCovered: function () {
                var deferred = $q.defer();
                api.get({action: 'eBTLMortgagePaymentCovered'}, function (response) {
                    var returnResponse = objectifyArray(response.eBTLMortgagePaymentCovered);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteLenders: function () {
                var deferred = $q.defer();
                api.get({action: 'eLenders'}, function (response) {
                    var returnResponse = objectifyLanderArray(response.eLenders);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteCreditCardTypes: function () {
                var deferred = $q.defer();
                api.get({action: 'eCreditCardTypes'}, function (response) {
                    var returnResponse = objectifyArray(response.eCreditCardTypes);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteLiabilityTypes: function () {
                var deferred = $q.defer();
                api.get({action: 'eLiabilityTypes'}, function (response) {
                    var returnResponse = objectifyArray(response.eLiabilityTypes);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteRepaymentVehiclePolicyTypes: function () {
                var deferred = $q.defer();
                api.get({action: 'eRepaymentVehiclePolicyTypes'}, function (response) {
                    var returnResponse = objectifyArray(response.eRepaymentVehiclePolicyTypes);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getePolicyTypes: function () {
                var deferred = $q.defer();
                api.get({action: 'ePolicyTypes'}, function (response) {
                    var returnResponse = objectifyArray(response.ePolicyTypes);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getePropertyTypes: function () {
                var deferred = $q.defer();
                api.get({action: 'ePropertyTypes'}, function (response) {
                    var returnResponse = objectifyArray(response.ePropertyTypes);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteBCIWallConstruction: function () {
                var deferred = $q.defer();
                api.get({action: 'eBCIWallConstruction'}, function (response) {
                    var returnResponse = objectifyArray(response.eBCIWallConstruction);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }, geteBCIRoofConstruction: function () {
                var deferred = $q.defer();
                api.get({action: 'eBCIRoofConstruction'}, function (response) {
                    var returnResponse = objectifyArray(response.eBCIRoofConstruction);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }, geteNonConstructionType: function () {
                var deferred = $q.defer();
                api.get({action: 'eNonConstructionType'}, function (response) {
                    var returnResponse = objectifyArray(response.eNonStdConstructionTypes);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }, getePropertyStatuses: function () {
                var deferred = $q.defer();
                api.get({action: 'ePropertyStatuses'}, function (response) {
                    var returnResponse = objectifyArray(response.ePropertyStatuses);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }, getePropertyResidence: function () {
                var deferred = $q.defer();
                api.get({action: 'ePropertyResidence'}, function (response) {
                    var returnResponse = objectifyArray(response.ePropertyResidence);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }, geteTenureTypes: function () {
                var deferred = $q.defer();
                api.get({action: 'eTenureTypes'}, function (response) {
                    var returnResponse = objectifyArray(response.eTenureTypes);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }, geteConstructionTypes: function () {
                var deferred = $q.defer();
                api.get({action: 'eConstructionTypes'}, function (response) {
                    var returnResponse = objectifyArray(response.eConstructionTypes);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }, geteNonStdConstructionTypes: function () {
                var deferred = $q.defer();
                api.get({action: 'eNonStdConstructionTypes'}, function (response) {
                    var returnResponse = objectifyArray(response.eNonStdConstructionTypes);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }, geteAboveCommercial: function () {
                var deferred = $q.defer();
                api.get({action: 'eAboveCommercial'}, function (response) {
                    var returnResponse = objectifyArray(response.eAboveCommercial);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }, geteCountries: function () {
                var deferred = $q.defer();
                api.get({action: 'eCountries'}, function (response) {
                    var returnResponse = objectifyArray(response.eCountries);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }, geteArrearsAndDefaultTypes: function () {
                var deferred = $q.defer();
                api.get({action: 'eArrearsAndDefaultTypes'}, function (response) {
                    var returnResponse = objectifyArray(response.eArrearsAndDefaultTypes);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }, geteLifeProviders: function () {
                var deferred = $q.defer();
                api.get({action: 'eLifeProviders'}, function (response) {
                    var returnResponse = objectifyArray(response.eLifeProviders);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }, geteUnemploymentDeferredPeriodDuration: function () {
                var deferred = $q.defer();
                api.get({action: 'eUnemploymentDeferredPeriodDuration'}, function (response) {
                    var returnResponse = objectifyArray(response.eUnemploymentDeferredPeriodDuration);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }, geteSeriousIllnessCoverTypes: function () {
                var deferred = $q.defer();
                api.get({action: 'eSeriousIllnessCoverTypes'}, function (response) {
                    var returnResponse = objectifyArray(response.eSeriousIllnessCoverTypes);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteLifePlanOwners: function () {
                var deferred = $q.defer();
                api.get({action: 'eLifePlanOwners'}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteBenefitTypes: function () {
                var deferred = $q.defer();
                api.get({action: 'eBenefitTypes'}, function (response) {
                    var returnResponse = objectifyArray(response.eBenefitTypes);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            geteAccounts_Available: function () {
                var deferred = $q.defer();
                api.get({action: 'eAccounts_Available'}, function (response) {
                    var returnResponse = objectifyArray(response.eAccounts_Available);
                    deferred.resolve(returnResponse);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
//           ,  geteDeferredPeriodDurations: function () {
//                var deferred = $q.defer();
//                api.get({action: 'eDeferredPeriodDurations'}, function (response) {
//                   deferred.resolve(response);
//                }, function (error) {
//                    deferred.reject(error);
//                });
//                return deferred.promise;
//            },
//            geteLifePlanPremiumBasis: function () {
//                var deferred = $q.defer();
//                api.get({action: 'eLifePlanPremiumBasis'}, function (response) {
//                    deferred.resolve(response);
//                }, function (error) {
//                    deferred.reject(error);
//                });
//                return deferred.promise;
//            }, geteLifePlanCoverTypes: function () {
//                var deferred = $q.defer();
//                api.get({action: 'eLifePlanCoverTypes'}, function (response) {
//                     deferred.resolve(response);
//                }, function (error) {
//                    deferred.reject(error);
//                });
//                return deferred.promise;
//            }, geteLifePlanAccountBasis: function () {
//                var deferred = $q.defer();
//                api.get({action: 'eLifePlanAccountBasis'}, function (response) {
//                    deferred.resolve(response);
//                }, function (error) {
//                    deferred.reject(error);
//                });
//                return deferred.promise;
//            },  geteLifeCoverTermBasis: function () {
//                var deferred = $q.defer();
//                api.get({action: 'eLifeCoverTermBasis'}, function (response) {
//                    deferred.resolve(response);
//                }, function (error) {
//                    deferred.reject(error);
//                });
//                return deferred.promise;
//            }, geteLifePlanExpiryAges: function () {
//                var deferred = $q.defer();
//                api.get({action: 'eLifePlanExpiryAges'}, function (response) {
//                    deferred.resolve(response);
//                }, function (error) {
//                    deferred.reject(error);
//                });
//                return deferred.promise;
//            }, geteIncomeProtEscalation: function () {
//                var deferred = $q.defer();
//                api.get({action: 'eIncomeProtEscalation'}, function (response) {
//                    var returnResponse = objectifyArray(response.eUnemploymentDeferredPeriodDuration);
//                    deferred.resolve(returnResponse);
//                }, function (error) {
//                    deferred.reject(error);
//                });
//                return deferred.promise;
//            }, geteLifeBenefitBasis: function (applicationId) {
//                var deferred = $q.defer();
//                getElifeBenifitapi.get({action: 'eLifeBenefitBasis', applicant: applicationId}, function (response) {
//                    var returnResponse = objectifyArray(response.eUnemploymentDeferredPeriodDuration);
//                    deferred.resolve(returnResponse);
//                }, function (error) {
//                    deferred.reject(error);
//                });
//                return deferred.promise;
//            }
        };

    }]);

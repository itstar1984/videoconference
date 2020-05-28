'use strict';

factFindApp.service('employmentService', ['$resource', '$q', 'apiBaseUrl', function ($resource, $q, apiBaseUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});
        var subApi = $resource('./php_pages/GetAllEmploymentsDesc.php?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});
        var subSelfApi = $resource('./php_pages/GetIncomeSelfEmpDetail.php?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});

        return{
            getHeaderByDetails: function (details) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetEmploymentHeaderByFFIDAndClientID', request: 'GET', FFID: details.FFID, ClientID: details.ClientID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            GetIncomeOtherByEmploymentHeaderID: function (details) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetIncomeOtherByEmploymentHeaderID', request: 'GET', EmploymentHeaderID: details.EmploymentHeaderID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getAllEmploymentsDesc: function (details) {
                var deferred = $q.defer();
                subApi.query({action: 'Get', subaction: 'GetAllEmploymentsDesc', request: 'GET', EmploymentHeaderID: details.EmploymentHeaderID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getDetailsByEmploymentID: function (details) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GeIncomeEmpDetailEmploymentID', request: 'GET', EmploymentID: details.EmploymentID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getSelfDetailsByEmploymentID: function (details) {
                var deferred = $q.defer();
                subSelfApi.query({action: 'Get', subaction: 'GeIncomeSelfEmpDetailEmploymentID', request: 'GET', EmploymentID: details.EmploymentID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            DeleteincomeSelfEmp: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Delete', subaction: 'DeleteincomeSelfEmp', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            GetAllIncomeBenefits: function (details) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetAllIncomeBenefitsByEmploymentHeaderID', request: 'GET', EmploymentHeaderID: details.EmploymentHeaderID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveHeaderDetail: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveEmploymentHeader', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveEmployDetail: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveEmployment', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveEmpIncome: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveEmpIncome', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            SaveSelfEmployed: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveSelfEmployed', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            SaveEmploymentHeader: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveEmploymentHeader', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            SaveIncomeOther: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveIncomeOther', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            SaveBenefits: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveBenefits', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            deleteBenefits: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Delete', subaction: 'DeleteIncomeBenefits', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            GetAllDeductions: function (details) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetDeductionbyEmploymentHeaderID', request: 'GET', EmploymentHeaderID: details.EmploymentHeaderID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            SaveDeduction: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveDeduction', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            deleteDeduction: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Delete', subaction: 'DeleteDeduction', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getEmployment: function (details) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetEmployment', request: 'GET', EmploymentID: details.EmploymentID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            GetEmploymentShares: function (details) {
                var deferred = $q.defer();
                api.get({action: 'Get', subaction: 'GetEmploymentShares', request: 'GET', ClientID: details.ClientID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            SaveEmploymentShares: function (details) {
                var deferred = $q.defer();
                api.save({action: 'Save', subaction: 'SaveEmploymentShares', request: 'POST'}, details, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getOccupatons: function(details) {
                var deferred = $q.defer();
                api.query({action: 'Get', subaction: 'GetOccupationDetailsByName', request: 'GET', Desc: details }, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            
        };
    }]);

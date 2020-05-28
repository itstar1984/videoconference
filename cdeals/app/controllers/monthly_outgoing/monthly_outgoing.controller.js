'use strict';

factFindApp.controller('monthlyOutgoingCtrl', ['$scope', '$rootScope', 'monthlyOutgoingService', 'localStorageService', '$firebaseObject', 'firebaseService',
    function ($scope, $rootScope, monthlyOutgoingService, localStorageService, $firebaseObject, firebaseService) {
        $scope.setFieldTypingStatus = function (field, status) {
            var obj = {
                monthlyOutgoingForm: {
                    field: field,
                    status: status
                },
            };
            firebaseService.saveTypingStatus(obj);
        };
        $scope.checkPartnerTyping = function (field) {
            var flg = false;
            if ($scope.typing.consultant && $scope.typing.consultant['monthlyOutgoingForm']
                    && $scope.typing.consultant['monthlyOutgoingForm']['field'] == field
                    && $scope.typing.consultant['monthlyOutgoingForm']['status']) {
                flg = true;
            }
            return flg;
        };
        $scope.changeTextField = function (fieldName) {
            if (!angular.isDefined($scope.customer.ExpenditureDetails[fieldName])) {
                $scope.customer.ExpenditureDetails[fieldName] = null;
            }
        };
        var getMonthlyOutgoingDetails = function () {

            monthlyOutgoingService.getOutgoingDetails({FFID: localStorageService.get('FFID')}).then(function (response) {
                if (response && response.ExpenditureID) {
                    $rootScope.tickTab('monthly_outgoing');
                    var details = angular.copy(response);
                    if (!$scope.customer.ExpenditureDetails) {
                        $scope.customer.ExpenditureDetails = {};
                    }
                    $scope.customer.ExpenditureDetails.ExpenditureID = details.ExpenditureID;
                    $scope.customer.ExpenditureDetails.CarBills = (details.CarBills);
                    $scope.customer.ExpenditureDetails.Continuing_rent = (details.Continuing_rent);
                    $scope.customer.ExpenditureDetails.CouncilTax = (details.CouncilTax);
                    $scope.customer.ExpenditureDetails.CriticalIllnessPolicies = (details.CriticalIllnessPolicies);
                    $scope.customer.ExpenditureDetails.FoodBills = (details.FoodBills);
                    $scope.customer.ExpenditureDetails.HomeInsurance = (details.HomeInsurance);
                    $scope.customer.ExpenditureDetails.InternetBills = (details.InternetBills);
                    $scope.customer.ExpenditureDetails.LifeInsurance = (details.LifeInsurance);
                    $scope.customer.ExpenditureDetails.MaintenancePayments = (details.MaintenancePayments);
                    $scope.customer.ExpenditureDetails.Other = (details.Other);
                    $scope.customer.ExpenditureDetails.Pension = (details.Pension);
                    $scope.customer.ExpenditureDetails.Protection = (details.Protection);
                    $scope.customer.ExpenditureDetails.RegularSavings = (details.RegularSavings);
                    $scope.customer.ExpenditureDetails.StudentLoan = (details.StudentLoan);
                    $scope.customer.ExpenditureDetails.TVLicence = (details.TVLicence);
                    $scope.customer.ExpenditureDetails.TelephoneBills = (details.TelephoneBills);
                    $scope.customer.ExpenditureDetails.Utilities = (details.Utilities);
                } else {
                    $rootScope.removeTickTab('monthly_outgoing');
                }
            });
        };
        $scope.saveForm = function () {
            
            if ($scope.customer.ExpenditureDetails) {
                setDefaultValueToZero();
            }
            if(!$scope.customer.ExpenditureDetails){
                $scope.customer.ExpenditureDetails = {};
                setDefaultValueToZero();
            }
                
            $scope.customer.ExpenditureDetails.FFID = localStorageService.get('FFID');
            monthlyOutgoingService.saveOutgoingDetails($scope.customer.ExpenditureDetails).then(function (response) {
                getMonthlyOutgoingDetails();
                $rootScope.changeTab({
                    state: 'app.dependant',
                    title: 'Dependants',
                    id: 'dependant'
                });
            });
        };
        $scope.backButtonAction = function () {
            $rootScope.changeTab({
                state: 'app.liabilities',
                title: 'Liabilities',
                id: 'liability'
            });
        };
        var initialize = function () {
            $scope.customer = {};
            var ref1 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/customer");
            var object = $firebaseObject(ref1);
            object.$bindTo($scope, 'customer');
            object.$loaded().then(function (data) {
                if (!$scope.customer.no_of_applicants) {
                    $scope.customer.no_of_applicants = 1;
                }
                if (!$scope.customer.activeApplicant) {
                    $scope.customer.activeApplicant = 1;
                }
                getMonthlyOutgoingDetails();
            });
            var ref2 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            $scope.typing = $firebaseObject(ref2);
        };
        initialize();

        var setDefaultValueToZero = function(){
            if(!$scope.customer.ExpenditureDetails.CouncilTax){
                $scope.customer.ExpenditureDetails.CouncilTax = 0;
            }
            if(!$scope.customer.ExpenditureDetails.InternetBills){
                $scope.customer.ExpenditureDetails.InternetBills = 0;
            }
            if(!$scope.customer.ExpenditureDetails.TelephoneBills){
                $scope.customer.ExpenditureDetails.TelephoneBills = 0;
            }
            if(!$scope.customer.ExpenditureDetails.CarBills){
                $scope.customer.ExpenditureDetails.CarBills = 0;
            }
            if(!$scope.customer.ExpenditureDetails.TVLicence){
                $scope.customer.ExpenditureDetails.TVLicence = 0;
            }
            if(!$scope.customer.ExpenditureDetails.Utilities){
                $scope.customer.ExpenditureDetails.Utilities = 0;
            }
            if(!$scope.customer.ExpenditureDetails.FoodBills){
                $scope.customer.ExpenditureDetails.FoodBills = 0;
            }
            if(!$scope.customer.ExpenditureDetails.Protection){
                $scope.customer.ExpenditureDetails.Protection = 0;
            }
            if(!$scope.customer.ExpenditureDetails.LifeInsurance){
                $scope.customer.ExpenditureDetails.LifeInsurance = 0;
            }
            if(!$scope.customer.ExpenditureDetails.Pension){
                $scope.customer.ExpenditureDetails.Pension = 0;
            }
            if(!$scope.customer.ExpenditureDetails.CriticalIllnessPolicies){
                $scope.customer.ExpenditureDetails.CriticalIllnessPolicies = 0;
            }
            if(!$scope.customer.ExpenditureDetails.RegularSavings){
                $scope.customer.ExpenditureDetails.RegularSavings = 0;
            }
            if(!$scope.customer.ExpenditureDetails.HomeInsurance){
                $scope.customer.ExpenditureDetails.HomeInsurance = 0;
            }
            if(!$scope.customer.ExpenditureDetails.MaintenancePayments){
                $scope.customer.ExpenditureDetails.MaintenancePayments = 0;
            }
            if(!$scope.customer.ExpenditureDetails.Other){
                $scope.customer.ExpenditureDetails.Other = 0;
            }
            if(!$scope.customer.ExpenditureDetails.Continuing_rent){
                $scope.customer.ExpenditureDetails.Continuing_rent = 0;
            }
            if(!$scope.customer.ExpenditureDetails.StudentLoan){
                $scope.customer.ExpenditureDetails.StudentLoan = 0;
            }
        }
    }]);

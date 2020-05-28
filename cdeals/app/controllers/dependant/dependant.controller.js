'use strict';

factFindApp.controller('dependantCtrl', ['$scope', '$rootScope', 'dependantService', 'localStorageService', '$firebaseObject', 'firebaseService', 'toaster',
    function ($scope, $rootScope, dependantService, localStorageService, $firebaseObject, firebaseService, toaster) {
        $scope.setFieldTypingStatus = function (field, status) {
            var obj = {
                dependantForm: {
                    field: field,
                    status: status
                },
            };
            firebaseService.saveTypingStatus(obj);
        };
        $scope.checkPartnerTyping = function (field) {
            var flg = false;
            if ($scope.typing.consultant && $scope.typing.consultant['dependantForm']
                    && $scope.typing.consultant['dependantForm']['field'] == field
                    && $scope.typing.consultant['dependantForm']['status']) {
                flg = true;
            }
            return flg;
        };

        $scope.changeDependantField = function (fieldName) {
            if (!angular.isDefined($scope.customer.dependant[fieldName])) {
                $scope.customer.dependant[fieldName] = null;
            }
        };
        $scope.changeAllDependantField = function (key, fieldName) {
            if (!angular.isDefined($scope.customer.dependantList[key][fieldName])) {
                $scope.customer.dependantList[key][fieldName] = null;
            }
        };
        var getDependants = function () {
            $scope.customer.dependant = {isDependant: false};
            dependantService.getDependants({FFID: localStorageService.get('FFID'), AppID: $scope.customer.clientDetails.AppID}).then(function (response) {
                if (response.length) {
                    $rootScope.tickTab('dependant');
                    var dependantList = angular.copy(response);
                    $scope.customer.dependantList = dependantList;
                } else {
                    $scope.customer.dependantList = [];
                    //$scope.customer.dependant = {isDependant: false};
                    $rootScope.removeTickTab('dependant');
                }
            });
        };
        $scope.saveDependant = function (depDetails) {
            var details = angular.copy(depDetails);
            details.FFID = localStorageService.get('FFID');
            dependantService.saveDependants(details).then(function (response) {
                if (depDetails.DependantID) {
                    toaster.pop('success', 'Updated Successfully!', '');
                } else {
                    toaster.pop('success', 'Added Successfully!', '');
                }
                getDependants();
            });
        };
        $scope.deleteDependant = function (dependant) {
            dependantService.deleteDependant(dependant).then(function (response) {
                toaster.pop('success', 'Deleted Successfully!', '');
                getDependants();
            });
        };
        $scope.backButtonAction = function () {
            $rootScope.changeTab({
                state: 'app.monthly_outgoing',
                title: 'Monthly Outgoing',
                id: 'monthly_outgoing'
            });
        };
        $scope.next = function () {
            $rootScope.changeTab({
                state: 'app.credithistroy',
                title: 'Credit History',
                id: 'credithistroy'
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
                getDependants();
            });
            var ref2 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            $scope.typing = $firebaseObject(ref2);
        };
        initialize();
    }]);

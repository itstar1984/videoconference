'use strict';

factFindApp.controller('otherExisitingMortgagesCtrl', ['$scope', '$rootScope', 'selectBoxService', 'otherMortService', 'appClientUpdate', 'localStorageService', '$firebaseObject', 'firebaseService', 'toaster',
    function ($scope, $rootScope, selectBoxService, otherMortService, appClientUpdate, localStorageService, $firebaseObject, firebaseService, toaster) {
        $scope.setFieldTypingStatus = function (field, status) {
            var obj = {
                otherMortgageForm: {
                    field: field,
                    status: status
                },
            };
            firebaseService.saveTypingStatus(obj);
        };
        $scope.checkPartnerTyping = function (field) {
            var flg = false;
            if ($scope.typing.client && $scope.typing.client['otherMortgageForm']
                    && $scope.typing.client['otherMortgageForm']['field'] == field
                    && $scope.typing.client['otherMortgageForm']['status']) {
                flg = true;
            }
            return flg;
        };
        $scope.changeTextField = function (fieldName) {
            if (!angular.isDefined($scope.customer.OtherExistingMortgageDetails[fieldName])) {
                $scope.customer.OtherExistingMortgageDetails[fieldName] = null;
            }
        };
        $scope.changeKeyTextField = function (key, fieldName) {
            if (!angular.isDefined($scope.customer.allOtherExistingMort[key][fieldName])) {
                $scope.customer.allOtherExistingMort[key][fieldName] = null;
            }
        };
        var initialize = function () {
            selectBoxService.geteLenders().then(function (response) {
                $scope.landerList = angular.copy(response);
            });
            selectBoxService.geteMortgagePaymentMethods().then(function (response) {
                $scope.repaymentMethods = angular.copy(response);
            });
            selectBoxService.geteTitles().then(function (response) {
                $scope.titleList = angular.copy(response);
            });
            $scope.mortgageTypes = [{name: "Residential", val: '1'}, {name: "BTL", val: '2'}];

            $scope.customer = {};
            var ref1 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/customer");
            var object = $firebaseObject(ref1);
            object.$bindTo($scope, 'customer');
            var ref2 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            $scope.typing = $firebaseObject(ref2);
            object.$loaded(function () {
                getOtherMortDetails();
            });

        };
        var getOtherMortDetails = function () {
            otherMortService.getOtherMortgageDetails({FFID: $scope.customer.clientDetails.FFID}).then(function (response) {
                if (response.length > 0) {
                    $rootScope.tickTab('otherexisitingmortgages');
                    var otherMortgages = angular.copy(response);
                    $scope.customer.allOtherExistingMort = otherMortgages;
                    angular.forEach($scope.customer.allOtherExistingMort, function (item) {
                        if (item.PurchaseDate) {
                            item.PurchaseDate = moment(item.PurchaseDate).format('DD/MM/YYYY');
                        }
                        if (item.EndDate) {
                            item.EndDate = moment(item.EndDate).format('DD/MM/YYYY');
                        }
                        if (item.clientids && item.clientids != '') {
                            var clientIds = item.clientids.split('$$').map(function (item) {
                                return parseInt(item, 10);
                            });
                            item.clientids = angular.copy(clientIds);
                            item.cliendidMasterArray = angular.copy(clientIds);
                        }
                    });
                } else {
                    $scope.customer.allOtherExistingMort = [];
                    $rootScope.removeTickTab('otherexisitingmortgages');
                }
            });
        };
        $scope.addOtherMortgage = function (details) {
            var mortDetails = angular.copy(details);
            if (mortDetails.isAnotherMortgage) {
                mortDetails.FFID = $scope.customer.clientDetails.FFID;
                mortDetails.PurchaseDate = (mortDetails.PurchaseDate) ? moment(moment(mortDetails.PurchaseDate, 'DD-MM-YYYY')).format('MM/DD/YYYY') : '';
                mortDetails.EndDate = (mortDetails.EndDate) ? moment(moment(mortDetails.EndDate, 'DD-MM-YYYY')).format('MM/DD/YYYY') : '';
                otherMortService.saveExistingMortgage(mortDetails).then(function (response) {
                    if (response && response.OtherMortID) {
                        $scope.customer.OtherExistingMortgageDetails.OtherMortID = response.OtherMortID;
                        angular.forEach(mortDetails.clientids, function (ClientID) {
                            var selectedObj = {
                                "ScopeID": $scope.customer.OtherExistingMortgageDetails.OtherMortID,
                                "ClientID": ClientID,
                                "eFinancialCategoryID": "11"
                            };
                            otherMortService.saveSelectedClientID(selectedObj).then(function (response) {
                                $scope.customer.OtherExistingMortgageDetails = {isAnotherMortgage: false};
                                getOtherMortDetails();
                            });
                        });

                        toaster.pop({
                            type: 'success',
                            title: "Added details successfully"
                        });
                        getOtherMortDetails();
                    }
                });
            }
        };
        $scope.deleteOtherMortgage = function (detail) {
            otherMortService.DeleteExistingMortgage(detail).then(function (response) {
                toaster.pop({
                    type: 'success',
                    title: "Deleted details successfully"
                });
                getOtherMortDetails();
            });
        };
        $scope.updateOtherMortgage = function (detail) {
            var mortDetails = angular.copy(detail);
            if (mortDetails.OtherMortID) {
                mortDetails.FFID = $scope.customer.clientDetails.FFID;
                mortDetails.PurchaseDate = (mortDetails.PurchaseDate) ? moment(moment(mortDetails.PurchaseDate, 'DD-MM-YYYY')).format('MM/DD/YYYY') : '';
                mortDetails.EndDate = (mortDetails.EndDate) ? moment(moment(mortDetails.EndDate, 'DD-MM-YYYY')).format('MM/DD/YYYY') : '';
                otherMortService.saveExistingMortgage(mortDetails).then(function (response) {
                    appClientUpdate.updateApplicant(mortDetails, mortDetails.OtherMortID, '11', getOtherMortDetails);
                    toaster.pop({
                        type: 'success',
                        title: "Updated details successfully"
                    });
                });
            }
        };
        $scope.isCheckedClientID = function (OtherExistingMortgageDetails, applicantData) {
            var flag = false;
            angular.forEach(OtherExistingMortgageDetails.clientidArray, function (clientID) {
                if (clientID == applicantData.ClientID) {
                    flag = true;
                }
            });
            return flag;
        };
        $scope.saveOtherMortageDetails = function () {
            if ($scope.customer.allOtherExistingMort && $scope.customer.allOtherExistingMort.length > 0) {
                $rootScope.tickTab('otherexisitingmortgages');
                $rootScope.changeTab({
                    state: 'app.liabilities',
                    title: 'Liabilities',
                    id: 'liability'
                });
            } else {
//                toaster.pop({
//                    type: 'warning',
//                    title: "Please fill up the details"
//                });
                $rootScope.changeTab({
                    state: 'app.liabilities',
                    title: 'Liabilities',
                    id: 'liability'
                });
            }

        };
        $scope.changeClientId = function (OtherExistingMortgageDetails, ClientId, itemVal) {
            if (!OtherExistingMortgageDetails.clientidArray) {
                OtherExistingMortgageDetails.clientidArray = [];
            }
            if (itemVal) {
                if (OtherExistingMortgageDetails.clientidArray.indexOf(itemVal) == '-1') {
                    OtherExistingMortgageDetails.clientidArray.push(itemVal);
                }
            } else {
                if (OtherExistingMortgageDetails.clientidArray.indexOf(ClientId) != '-1') {
                    OtherExistingMortgageDetails.clientidArray.splice(OtherExistingMortgageDetails.clientidArray.indexOf(ClientId), 1);
                }
            }
        };
        $scope.getApplicantTitle = function (titleID) {
            var etitle = _.findWhere($scope.titleList, {val: titleID});
            if (etitle) {
                return etitle.name;
            }
        };
        $scope.backButtonAction = function () {
            $rootScope.changeTab({
                state: 'app.sourcenow',
                title: 'Initial Source',
                id: 'sourcenow'
            });
        };
        initialize();
    }]);



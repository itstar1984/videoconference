'use strict';

factFindApp.controller('LiabilitiesCtrl', ['$scope', '$rootScope', 'selectBoxService', 'localStorageService', '$firebaseObject', 'firebaseService', 'liabilitiesService', 'appClientUpdate', 'extraLenderService', '$timeout', 'toaster',
    function ($scope, $rootScope, selectBoxService, localStorageService, $firebaseObject, firebaseService, liabilitiesService, appClientUpdate, extraLenderService, $timeout, toaster) {
        $scope.isLiabilitiesTab = function (tab) {
            return angular.equals($scope.customer.activeLiabilitiesTab, tab);
        };
        $scope.setLiabilitiesTab = function (tab) {
            $scope.customer.activeLiabilitiesTab = tab;
        };
        $scope.setFieldTypingStatus = function (field, status) {
            var obj = {
                liabilitiesForm: {
                    field: field,
                    status: status
                },
            };
            firebaseService.saveTypingStatus(obj);
        };
        $scope.checkPartnerTyping = function (field) {
            var flg = false;
            if ($scope.typing.consultant && $scope.typing.consultant['liabilitiesForm']
                    && $scope.typing.consultant['liabilitiesForm']['field'] == field
                    && $scope.typing.consultant['liabilitiesForm']['status']) {
                flg = true;
            }
            return flg;
        };
        $scope.changeAllLiabilityField = function (key, fieldName) {
            if (!angular.isDefined($scope.customer.allLiability[key][fieldName])) {
                $scope.customer.allLiability[key][fieldName] = null;
            }
        };
        $scope.changeLiabilityField = function (fieldName) {
            if (!angular.isDefined($scope.customer.Liabilities[fieldName])) {
                $scope.customer.Liabilities[fieldName] = null;
            }
        };
        var initialize = function () {
            selectBoxService.geteLiabilityTypes().then(function (response) {
                $scope.liabilitiesType = angular.copy(response);
            });
            selectBoxService.geteCreditCardTypes().then(function (response) {
                $scope.cardType = angular.copy(response);
            });
            selectBoxService.geteTitles().then(function (response) {
                $scope.titleList = angular.copy(response);
            });
            $scope.customer = {};
            var ref1 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/customer");
            var object = $firebaseObject(ref1);
            object.$bindTo($scope, 'customer');
            var ref2 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            $scope.typing = $firebaseObject(ref2);
            object.$loaded(function () {
                if (!$scope.customer.activeLiabilitiesTab) {
                    $scope.customer.activeLiabilitiesTab = 'liabilities';
                }
                loadLiabilities();
            });
        };
        var loadLiabilities = function () {
            extraLenderService.getDetails({FFID: localStorageService.get('FFID')}).then(function (response) {
                if (response.ExtraQnID) {
                    var extraCommonDetails = angular.copy(response);
                    $scope.customer.ExtraCommonLenderQn.ExtraQnID = extraCommonDetails.ExtraQnID;
                    $scope.customer.ExtraCommonLenderQn.Payday12Months = (extraCommonDetails.Payday12Months) ? extraCommonDetails.Payday12Months : false;
                    $scope.customer.ExtraCommonLenderQn.PaydayRepaid = (extraCommonDetails.PaydayRepaid) ? extraCommonDetails.PaydayRepaid : false;
                    $scope.customer.ExtraCommonLenderQn.IPA = (extraCommonDetails.IPA) ? extraCommonDetails.IPA : false;
                }
            });
            liabilitiesService.getLiabilities({FFID: $scope.customer.clientDetails.FFID, AppID: $scope.customer.clientDetails.AppID}).then(function (response) {
                if (response.length) {
                    $rootScope.tickTab('liability');
                    $scope.customer.allLiability = angular.copy(response);
                    angular.forEach($scope.customer.allLiability, function (liability, key) {
                        liability.show = false;
                        if (liability.StartDate) {
                            $scope.customer.allLiability[key].StartDate = moment($scope.customer.allLiability[key].StartDate).format('DD/MM/YYYY');
                        }
                        if (liability.EndDate) {
                            $scope.customer.allLiability[key].EndDate = moment($scope.customer.allLiability[key].EndDate).format('DD/MM/YYYY');
                        }
//                        if (liability.Rate) {
//                            liability.Rate = liability.Rate.toFixed(2);
//                            var myRate = angular.copy(liability.Rate);
//                            var rate = parseInt(myRate);
//                            if (rate < 10) {
//                                liability.Rate = '0' + myRate.toString();
//                            }
//                        }
//                        if (liability.OverdraftIntRate) {
//                            liability.OverdraftIntRate = liability.OverdraftIntRate.toFixed(2);
//                            var myRate = angular.copy(liability.OverdraftIntRate);
//                            var rate = parseInt(myRate);
//                            if (rate < 10) {
//                                liability.OverdraftIntRate = '0' + myRate.toString();
//                            }
//                        }
                        if (liability.clientids && liability.clientids != '') {
                            var clientIds = liability.clientids.split('$$').map(function (item) {
                                return parseInt(item, 10);
                            });
                            liability.clientids = angular.copy(clientIds);
                            liability.cliendidMasterArray = angular.copy(clientIds);

                        }
                    });
                } else {
                    // $rootScope.tickTab('liability');
                    $scope.customer.allLiability = [];
                    $rootScope.removeTickTab('liability');
                }

            });
        };
        initialize();
        $scope.createLiability = function (data) {
            var liabiltiesData = angular.copy(data);
            if (liabiltiesData && liabiltiesData.isLiabilities) {
                liabiltiesData.FFID = $scope.customer.clientDetails.FFID;
                liabilitiesService.saveDetail(liabiltiesData).then(function (response) {
                    if (response && response.LiabilityID) {
                        $scope.customer.Liabilities.LiabilityID = response.LiabilityID;
                    }
                    if (response && response.LiabilityID) {
                        angular.forEach(data.clientids, function (ClientID) {
                            var selectedObj = {
                                "ScopeID": $scope.customer.Liabilities.LiabilityID,
                                "ClientID": ClientID,
                                "eFinancialCategoryID": "1"
                            };
                            liabilitiesService.SaveSelectedClientID(selectedObj).then(function (response) {

                            });
                        });
                        $timeout(function () {
                            $scope.customer.Liabilities = {isLiabilities: false};
                        }, 500);
                        toaster.pop({
                            type: 'success',
                            title: "Added details successfully"
                        });
                        loadLiabilities();
                    }
                });
            } else {
                if ($scope.customer.activeLiabilitiesTab === 'liabilities') {
                    $scope.customer.activeLiabilitiesTab = 'payDayLoans';
                }
            }
        };
        $scope.updateLiability = function (data) {
            var liabiltiesData = angular.copy(data);
            liabiltiesData.FFID = $scope.customer.clientDetails.FFID;
            liabilitiesService.saveDetail(liabiltiesData).then(function (response) {
                if (response && response.LiabilityID) {
                    // remove all client Ids
                    appClientUpdate.updateApplicant(liabiltiesData, response.LiabilityID, '1', loadLiabilities);
                    toaster.pop({
                        type: 'success',
                        title: "Updated details successfully"
                    });
                }
            });
        };
        $scope.deleteLiabilities = function (liability) {
            liabilitiesService.DeleteLiability(liability).then(function (response) {
                loadLiabilities();
            });
        };
        $scope.createpaydayloan = function (obj) {
            $scope.customer.ExtraCommonLenderQn.FFID = $scope.customer.clientDetails.FFID;
            extraLenderService.saveDetail($scope.customer.ExtraCommonLenderQn).then(function (response) {
                loadLiabilities();
                $rootScope.changeTab({
                    state: 'app.monthly_outgoing',
                    title: 'Monthly Outgoing',
                    id: 'monthly_outgoing'
                });
            });
        };
        $scope.isCheckedClientID = function (liablity, applicantData) {
            var flag = false;
            angular.forEach(liablity.clientidArray, function (clientID) {
                if (clientID == applicantData.ClientID) {
                    flag = true;
                }
            });
            return flag;
        };
        $scope.changeClientId = function (liablity, ClientId, itemVal) {
            if (!liablity.clientidArray) {
                liablity.clientidArray = [];
            }
            if (itemVal) {
                if (liablity.clientidArray.indexOf(itemVal) == '-1') {
                    liablity.clientidArray.push(itemVal);
                }
            } else {
                if (liablity.clientidArray.indexOf(ClientId) != '-1') {
                    liablity.clientidArray.splice(liablity.clientidArray.indexOf(ClientId), 1);
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
                state: 'app.otherexisitingmortgages',
                title: 'Other Existing Mortgages',
                id: 'otherexisitingmortgages'
            });
        };
        $scope.backButtonActionForTabs = function () {
            $scope.setLiabilitiesTab('liabilities');
        };
    }]);



'use strict';
factFindApp.controller('nonSourcePropertyDetailsCtrl', ['$scope', '$rootScope', '$state', 'propertyService', 'extraLenderService', 'quoteService',
    'firebaseService', 'localStorageService', '$firebaseObject', 'toaster',
    function ($scope, $rootScope, $state, propertyService, extraLenderService, quoteService, firebaseService, localStorageService,
        $firebaseObject, toaster) {

        $scope.setFieldTypingStatus = function (field, status) {
            var obj = {
                nonsourcePropertyForm: {
                    field: field,
                    applicantId: $scope.customer.activeApplicant,
                    status: status
                },
            };
            firebaseService.saveTypingStatus(obj);
        };
        $scope.checkPartnerTyping = function (field) {
            var flg = false;
            if($scope.typing.consultant && $scope.typing.consultant['nonsourcePropertyForm'] &&
                $scope.typing.consultant['nonsourcePropertyForm']['field'] == field &&
                $scope.typing.consultant['nonsourcePropertyForm']['status']) {
                flg = true;
            }
            return flg;
        };
        $scope.changeTextField = function (fieldName) {
            if(!angular.isDefined($scope.customer.Properties[fieldName])) {
                $scope.customer.Properties[fieldName] = null;
            }
        };
        $scope.changeExtraTextField = function (fieldName) {
            if(!angular.isDefined($scope.customer.ExtraCommonLenderQn[fieldName])) {
                $scope.customer.ExtraCommonLenderQn[fieldName] = null;
            }
        };
        var initialize = function () {
            $scope.reasonForCapitalRaising = [{ label: 'Any Legal Reason', value: 'Any legal reason' }, { label: 'Only for Home imp on BTL property',
                value: 'Only for Home Imp on BTL property' }, { label: 'For Home imp or Deposit for another property', value: 'For Home Imp or Deposit for another property' }];
            $scope.GarageTypeList = [{ label: 'Single', value: 'Single' }, { label: 'Double', value: 'Double' }, { label: 'Not Applicable',
                value: 'Not applicable' }];

            $scope.customer = {};
            var ref1 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/customer");
            var object = $firebaseObject(ref1);
            object.$bindTo($scope, 'customer');
            object.$loaded().then(function (data) {
                if(!$scope.customer.no_of_applicants) {
                    $scope.customer.no_of_applicants = 1;
                }
                if(!$scope.customer.activeApplicant) {
                    $scope.customer.activeApplicant = 1;
                }
                $scope.customer.ExtraCommonLenderQn.IsCapitalRaisingAllowed = false;
                $scope.customer.ExtraCommonLenderQn.OwnEntrance = false;
                $scope.customer.ExtraCommonLenderQn.IsParking = 'False';
                getPropertyDetails();
            });
            var ref2 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            $scope.typing = $firebaseObject(ref2);
        };
        var getPropertyDetails = function () {
            quoteService.getActiveQuotes({ FFID: localStorageService.get('FFID') }).then(function (response) {
                if(response && response['MortgageQuotes '] && response['MortgageQuotes '].length > 1) {
                    var activeQuotes = [];
                    angular.forEach(response['MortgageQuotes '], function (quote) {
                        if(quote) {
                            activeQuotes.push(objectifyQuoteArray(quote));
                        }
                    });
                    $scope.customer.activeQuotes = angular.copy(activeQuotes);
                }
            });
            extraLenderService.getDetails({ FFID: localStorageService.get('FFID') }).then(function (response) {
                $scope.customer.ExtraCommonLenderQn.IsGarage = 'False';
                if(response.ExtraQnID) {
                    var extraCommonDetails = angular.copy(response);
                    $scope.customer.ExtraCommonLenderQn.ExtraQnID = extraCommonDetails.ExtraQnID;
                    $scope.customer.ExtraCommonLenderQn.ParkingStatus = extraCommonDetails.ParkingStatus || false;
                    $scope.customer.ExtraCommonLenderQn.IsParking = extraCommonDetails.IsParking || false;
                    $scope.customer.ExtraCommonLenderQn.CapitalRaisingReason = extraCommonDetails.CapitalRaisingReason || null;
                    $scope.customer.ExtraCommonLenderQn.NumReception = extraCommonDetails.NumReception || null;
                    $scope.customer.ExtraCommonLenderQn.IsGarage = extraCommonDetails.IsGarage || 'False';
                    $scope.customer.ExtraCommonLenderQn.GarageType = extraCommonDetails.GarageType || null;
                    $scope.customer.ExtraCommonLenderQn.IsCapitalRaisingAllowed = extraCommonDetails.IsCapitalRaisingAllowed ||
                        false;
                    $scope.customer.ExtraCommonLenderQn.OwnEntrance = extraCommonDetails.OwnEntrance || false;
                }
            });
            propertyService.getLatestDetailsByFFID({ FFID: $scope.customer.clientDetails.FFID }).then(function (response) {
                var latestProperty = angular.copy(response);
                if(latestProperty && latestProperty['Property '][0] && latestProperty['Property '][0][0] > 0) {
                    propertyService.getDetailsByAddressId({ AddressID: latestProperty['Property '][0][0] }).then(function (
                        response) {
                        if(response && response.PropertyDetailsID) {
                            var property = angular.copy(response);
                            $rootScope.tickTab('nonSourceProperty');
                            $scope.customer.Properties.PropertyDetailsID = property.PropertyDetailsID;
                            $scope.customer.Properties.AddressID = property.AddressID;
                            $scope.customer.Properties.eApplicantID = property.eApplicantID;
                            $scope.customer.Properties.eCountryID = property.eCountryID;
                            $scope.customer.Properties.ePropertyTypeID = property.ePropertyTypeID;
                            $scope.customer.Properties.ePropertyStatusID = property.ePropertyStatusID;
                            $scope.customer.Properties.eConstructionTypeID = property.eConstructionTypeID;
                            $scope.customer.Properties.eAlarmTypeID = property.eAlarmTypeID;
                            $scope.customer.Properties.eNonStdConstructionTypeID = property.eNonStdConstructionTypeID;
                            $scope.customer.Properties.eTenureTypeID = property.eTenureTypeID;
                            $scope.customer.Properties.Listed = property.Listed;
                            $scope.customer.Properties.ExLocalAuthority = property.ExLocalAuthority;
                            $scope.customer.Properties.AgeYears = property.AgeYears;
                            $scope.customer.Properties.AgeMonths = property.AgeMonths;
                            $scope.customer.Properties.ArchitectCertificate = property.ArchitectCertificate;
                            $scope.customer.Properties.NumBedrooms = property.NumBedrooms;
                            $scope.customer.Properties.NumKitchens = property.NumKitchens;
                            $scope.customer.Properties.NumBathrooms = property.NumBathrooms;
                            $scope.customer.Properties.NumGarages = property.NumGarages;
                            $scope.customer.Properties.NumOutbuildings = property.NumOutbuildings;
                            $scope.customer.Properties.SelfBuild = property.SelfBuild;
                            $scope.customer.Properties.MultipleOccupancy = property.MultipleOccupancy;
                            $scope.customer.Properties.SemiCommercial = property.SemiCommercial;
                            $scope.customer.Properties.ApprovedLocks = property.ApprovedLocks;
                            $scope.customer.Properties.ApprovedAlarm = property.ApprovedAlarm;
                            $scope.customer.Properties.eWallConstructionID = property.eWallConstructionID;
                            $scope.customer.Properties.eRoofConstructionID = property.eRoofConstructionID;
                            $scope.customer.Properties.FlatRoofPerc = property.FlatRoofPerc;
                            $scope.customer.Properties.FlatRoofPerc = property.FlatRoofPerc;
                            $scope.customer.Properties.OwnEntrance = property.OwnEntrance;
                            $scope.customer.Properties.StudioFlat = property.StudioFlat;
                            $scope.customer.Properties.BalconyAccess = property.BalconyAccess;
                            $scope.customer.Properties.PurposeBuilt = property.PurposeBuilt;
                            $scope.customer.Properties.Lift = property.Lift;
                            $scope.customer.Properties.Converted = property.Converted;
                            $scope.customer.Properties.Floor = property.Floor;
                            $scope.customer.Properties.NumFloors = property.NumFloors;
                            $scope.customer.Properties.AgriculturalTie = property.AgriculturalTie;
                            $scope.customer.Properties.HomeForDependantRelative = property.HomeForDependantRelative;
                            $scope.customer.Properties.LeaseYearsRemaining = property.LeaseYearsRemaining;
                            $scope.customer.Properties.ePropertyResidenceID = property.ePropertyResidenceID;
                            $scope.customer.Properties.AboveCommercial = property.AboveCommercial;
                            $scope.customer.Properties.eAboveCommercialID = property.eAboveCommercialID;
                            $scope.customer.Properties.FlyingFreeholdPercent = property.FlyingFreeholdPercent;
                            $scope.customer.Properties.YearBuiltIn = property.YearBuiltIn;
                            $scope.customer.Properties.IsUsedForBuisnessPurpose = property.IsUsedForBuisnessPurpose;
                            $scope.customer.Properties.eArchitecturalID = property.eArchitecturalID;
                            $scope.customer.Properties.PropertyClericalPurposeOnly = property.PropertyClericalPurposeOnly;
                            $scope.customer.Properties.PropertyVisitorForBusiness = property.PropertyVisitorForBusiness;
                            $scope.customer.Properties.StockHeldInPremises = property.StockHeldInPremises;
                            $scope.customer.Properties.ValueOfStock = property.ValueOfStock;
                            $scope.customer.Properties.ValueOfBusinessEquipment = property.ValueOfBusinessEquipment;
                            $scope.customer.Properties.eOccupancyPeriodID = property.eOccupancyPeriodID;
                            $scope.customer.Properties.PropertyStructureTypeID = property.PropertyStructureTypeID;
                            $scope.customer.Properties.ExpectedNoOfOccupants = property.ExpectedNoOfOccupants;
                            $scope.customer.Properties.eOccupancyStatus = property.eOccupancyStatus;
                            $scope.customer.Properties.eBCISecurityTypeID = property.eBCISecurityTypeID;
                            $scope.customer.Properties.ExternalDoor = property.ExternalDoor;
                            $scope.customer.Properties.PatioDoor = property.PatioDoor;
                            $scope.customer.Properties.AlarmApproved = property.AlarmApproved;
                            $scope.customer.Properties.LetSubLet = property.LetSubLet;
                            $scope.customer.Properties.PercentShared = property.PercentShared;

                        }
                    });
                }

            });
        };
        var objectifyQuoteArray = function (x) {
            return {
                quote: x[0],
                FFID: x[1],
                quoteFor: x[2],
                MortQuoteID: x[4],
                LenderName: x[5],
                productName: x[6],
                initialPay: x[11],
                totalCost: x[13],
                totalFee: x[15],
                show: false
            };
        };
        $scope.savePropertyForm = function (data) {
            propertyService.saveDetail($scope.customer.Properties).then(function (response) {
                $scope.customer.ExtraCommonLenderQn.FFID = localStorageService.get('FFID');
                extraLenderService.saveDetail($scope.customer.ExtraCommonLenderQn).then(function (response) {
                    getPropertyDetails();
                    toaster.pop({
                        type: 'success',
                        title: "Property Details Saved Successfully"
                    });
                    $rootScope.tickTab('nonSourceProperty');
                    //                    toaster.pop({
                    //                        type: 'info',
                    //                        title: "Your Application is successfully filled in and sourced."
                    //                    });
                    //                    $scope.$parent.requestAlert('Notice', 'Your Application is successfully filled in. Our Consultant will be in touch with you shortly.', '', 'Log Out', '', function (response) {
                    //                        if (response === 'Log Out') {
                    //                            $scope.$parent.logOut();
                    //                        }
                    //                    });
                    $rootScope.changeTab({
                        state: 'app.end_page',
                        title: 'end_page',
                        id: 'end_page'
                    });
                    //$state.go('app.end_page', {reload: false, inherit: true, notify: true});
                    if($scope.customer.activeQuotes && $scope.customer.activeQuotes.length > 0) {
                        angular.forEach($scope.customer.activeQuotes, function (item) {
                            quoteService.getQuoteSummary({ FFID: localStorageService.get('FFID'), MortQuoteID: item
                                    .MortQuoteID }).then(function (productSummary) {
                                var activeProductSummary = angular.copy(productSummary);
                                if(activeProductSummary && activeProductSummary.length > 0) {
                                    angular.forEach(activeProductSummary, function (products) {
                                        quoteService.updateMortageQuoteSelected(products.MortSelID)
                                            .then(function (response) {});
                                    });
                                }
                            });
                        });
                    }
                });

            });
        };
        $scope.backButtonAction = function () {
            $rootScope.changeTab({
                state: 'app.nonSourceEmploymentandIncome',
                title: 'Non source Employment and Income',
                id: 'nonSourceEmploymentandIncome'
            });
        };
        initialize();
    }
]);

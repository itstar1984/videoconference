'use strict';

factFindApp.controller('propertyCtrl', ['$scope', '$rootScope', 'selectBoxService', 'mortgageService', 'applicantService', 'extraLenderService', 'addresstService', 'localStorageService', '$firebaseObject', 'firebaseService', 'propertyService', '$filter',
    function ($scope, $rootScope, selectBoxService, mortgageService, applicantService, extraLenderService, addresstService, localStorageService, $firebaseObject, firebaseService, propertyService, $filter) {
        $scope.setFieldTypingStatus = function (field, status) {
            var obj = {
                propertyForm: {
                    field: field,
                    status: status
                },
            };
            firebaseService.saveTypingStatus(obj);
        };
        $scope.checkPartnerTyping = function (field) {
            var flg = false;
            if ($scope.typing.consultant && $scope.typing.consultant['propertyForm']
                    && $scope.typing.consultant['propertyForm']['field'] == field
                    && $scope.typing.consultant['propertyForm']['status']) {
                flg = true;
            }
            return flg;
        };
        $scope.isPropertyTabActive = function (tab) {
            return angular.equals($scope.customer.activePropertyTab, tab);
        };
        $scope.setPropertyTab = function (tab) {
            $scope.customer.activePropertyTab = tab;
        };
        $scope.searchPostCode = function (postcode) {
            addresstService.searchAddress({postcode: postcode}).then(function (response) {
                if (response.Results) {
                    $scope.customer.Properties['addressList'] = angular.copy(response.Results);
                }
            });
        };
        $scope.selectPostalCode = function (postcodeID) {
            addresstService.getAddressByPostcode({postcodeID: postcodeID}).then(function (response) {
                if (response.Results) {
                    var addressData = response.Results[0];
                    if (!$scope.customer.Properties['address']) {
                        $scope.customer.Properties['address'] = {};
                    }
                    $scope.customer.Properties['address']['Town'] = addressData.PostTown ? addressData.PostTown : '';
                    $scope.customer.Properties['address']['Address1'] = addressData.Line1 ? addressData.Line1 : '';
                    $scope.customer.Properties['address']['Address2'] = addressData.Line2 ? addressData.Line2 : '';
                    $scope.customer.Properties['address']['Address3'] = addressData.Line3 ? addressData.Line3 : '';
                    $scope.customer.Properties['address']['County'] = addressData.County ? addressData.County : '';
                    $scope.customer.Properties['address']['Country'] = addressData.Country ? addressData.Country : 'UK';
                    $scope.customer.Properties['address']['PostCode'] = addressData.Postcode ? addressData.Postcode : '';
                    $scope.customer.Properties['address']['eAddressTypeID'] = 4;
                    //$scope.customer.Properties['address']['CurrentAddress'] = true;
                    $scope.customer.Properties['addressList'].length = 0;
                    $scope.customer.Properties.postCodeTerm = '';
                }
            });
        };
        $scope.changeTextField = function (detail, fieldName) {
            if (!angular.isDefined($scope.customer[detail][fieldName])) {
                $scope.customer[detail][fieldName] = null;
            }
        };
        $scope.changeTextForAddressField = function (fieldName) {
            if (!angular.isDefined($scope.customer.Properties['address'][fieldName])) {
                $scope.customer.Properties['address'][fieldName] = null;
            }
        };

        var getApplicantAddress = function () {
            applicantService.getDetails({FFID: localStorageService.get('FFID')}).then(function (response) {
                if (response.length) {
                    var applicantList = angular.copy(response);
                    angular.forEach(applicantList, function (applicant, index) {
                        addresstService.getAddressDetailsByclientID({clientID: applicant.ClientID}).then(function (response) {
                            if (response.Addresses.length) {
                                angular.forEach(response.Addresses, function (addressId) {
                                    if (addressId) {
                                        addresstService.getDetails({AddressID: addressId}).then(function (response) {
                                            if (response['Address '].length && response['Address '][0]) {
                                                var addressData = angular.copy(response['Address '][0]);
                                                var addObj = objectifyAddressArray(addressData);
                                                if (!_.findWhere($scope.addressList, {name: addObj.Address1 + ',' + addObj.Address2 + ',' + addObj.Town}) && !addObj.DateTo) {
                                                    $scope.addressList.push({val: addObj.AddressID, name: addObj.Address1 + ',' + addObj.Address2 + ',' + addObj.Town});
                                                }
                                                //$scope.addressList.push({val: addObj.AddressID, name: addObj.Address1 + ',' + addObj.Address2 + ',' + addObj.Town});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            });
        };
        var initialize = function () {
            $scope.addressList = [];
            selectBoxService.getePropertyTypes().then(function (response) {
                $scope.propertyType = angular.copy(response);
            });
            selectBoxService.getePropertyStatuses().then(function (response) {
                $scope.propertyStatus = angular.copy(response);
            });
            selectBoxService.getePropertyResidence().then(function (response) {
                $scope.residencyType = angular.copy(response);
            });
            selectBoxService.geteTenureTypes().then(function (response) {
                $scope.tenureType = angular.copy(response);
            });
            selectBoxService.geteConstructionTypes().then(function (response) {
                $scope.constructionType = angular.copy(response);
            });
            selectBoxService.geteBCIWallConstruction().then(function (response) {
                $scope.wallConstructionTypes = angular.copy(response);
            });
            selectBoxService.geteNonConstructionType().then(function (response) {
                $scope.nonStdConstructionTypes = angular.copy(response);
            });
            selectBoxService.geteBCIRoofConstruction().then(function (response) {
                $scope.roofConstructionTypes = angular.copy(response);
            });
            selectBoxService.geteCountries().then(function (response) {
                $scope.countryList = angular.copy(response);
            });
            selectBoxService.geteAboveCommercial().then(function (response){
                $scope.eAboveCommercial = angular.copy(response);
            });
            $scope.reasonForCapitalRaising = [{label: 'Not Applicable', value: 'Not Applicable'}, {label: 'Any Legal Reason', value: 'Any legal reason'}, {label: 'Only for Home imp on BTL property', value: 'Only for Home Imp on BTL property'}, {label: 'For Home imp or Deposit for another property', value: 'For Home Imp or Deposit for another property'}];

            $scope.customer = {};
            var ref1 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/customer");
            var object = $firebaseObject(ref1);
            object.$bindTo($scope, 'customer');
            var ref2 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            $scope.typing = $firebaseObject(ref2);
            object.$loaded(function () {
                if (!$scope.customer.activePropertyTab) {
                    $scope.customer.activePropertyTab = 'propertyDetails';
                }

                getPropertyDetails();
            });
        };
        var getPropertyDetails = function () {
            mortgageService.getDetails({FFID: $scope.customer.clientDetails.FFID, AppID: $scope.customer.clientDetails.AppID}).then(function (response) {
                var morgageAppDetails = angular.copy(response);
                if (morgageAppDetails.MortAppID) {
                    if (morgageAppDetails.eMortgageTypeID > 5) {
                        getApplicantAddress();
                    }
                }
            });
            extraLenderService.getDetails({FFID: localStorageService.get('FFID')}).then(function (response) {
                if (response.ExtraQnID) {
                    var extraCommonDetails = angular.copy(response);
                    $scope.customer.ExtraCommonLenderQn.ExtraQnID = extraCommonDetails.ExtraQnID;
                    $scope.customer.ExtraCommonLenderQn.SemicommericalPercentage = (extraCommonDetails.SemicommericalPercentage) ? extraCommonDetails.SemicommericalPercentage : null;
                    $scope.customer.ExtraCommonLenderQn.IsHMO = (extraCommonDetails.IsHMO) ? extraCommonDetails.IsHMO : false;
                    $scope.customer.ExtraCommonLenderQn.IsFamilyLet = (extraCommonDetails.IsFamilyLet) ? extraCommonDetails.IsFamilyLet : false;
                    $scope.customer.ExtraCommonLenderQn.IsStudentLet = (extraCommonDetails.IsStudentLet) ? extraCommonDetails.IsStudentLet : false;
                    $scope.customer.ExtraCommonLenderQn.CapitalRaisingReason = (extraCommonDetails.CapitalRaisingReason) ? extraCommonDetails.CapitalRaisingReason : null;
                }
            });
            propertyService.getLatestDetailsByFFID({FFID: $scope.customer.clientDetails.FFID}).then(function (response) {
                var latestProperty = angular.copy(response);
                if(!$scope.customer.Properties.AboveCommercial){
                    $scope.customer.Properties.AboveCommercial = false;
                }
                if (latestProperty && latestProperty['Property '][0] && latestProperty['Property '][0][0] > 0) {
                    getAddressDetails(latestProperty['Property '][0][0]);
                    propertyService.getDetailsByAddressId({AddressID: latestProperty['Property '][0][0]}).then(function (response) {
                        if (response && response.PropertyDetailsID) {
                            var property = angular.copy(response);
                            $rootScope.tickTab('property');
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
        var objectifyAddressArray = function (x) {
            var addressObj = {
                AddressID: x[0],
                FFID: x[1],
                clientID: x[2],
                eAddressTypeID: x[3],
                CurrentAddress: x[4],
                ContactName: x[5],
                Address1: x[6],
                Address2: x[7],
                Address3: x[8],
                Town: x[9],
                County: x[10],
                Country: x[11],
                PostCode: x[12],

            };
            if (x[18]) {
                var str1 = x[18];
                var finalDateString = str1.substring(6, 19);
                var date1 = new Date(parseInt(finalDateString));
                var newDate1 = date1.toString('dd/MM/yyyy');
                addressObj.DateFrom = $filter('date')(new Date(newDate1), 'dd/MM/yyyy');
            }
            if (x[19]) {
                var str1 = x[19];
                var finalDateString = str1.substring(6, 19);
                var date1 = new Date(parseInt(finalDateString));
                var newDate1 = date1.toString('dd/MM/yyyy');
                addressObj.DateTo = $filter('date')(new Date(newDate1), 'dd/MM/yyyy');
            }
            return addressObj;
        };
        var getAddressDetails = function (addressId) {
            addresstService.getDetails({AddressID: addressId}).then(function (response) {
                if (response['Address '].length && response['Address '][0]) {
                    var addressData = angular.copy(response['Address '][0]);
                    var addObj = objectifyAddressArray(addressData);
                    if (!_.findWhere($scope.addressList, {name: addObj.Address1 + ',' + addObj.Address2 + ',' + addObj.Town}) && !addObj.DateTo) {
                        $scope.addressList.push({val: addObj.AddressID, name: addObj.Address1 + ',' + addObj.Address2 + ',' + addObj.Town});
                    }
                }
            });
        };
        $scope.changeBuiltYear = function (year) {
            if (year.length > 3) {
                var diff = moment().diff(year, 'years', false);
                $scope.customer.Properties.AgeYears = diff;
            }
        };
        $scope.savePropertyDetails = function (propertyDetailsDetails) {
            var details = angular.copy(propertyDetailsDetails);
            details.FFID = $scope.customer.clientDetails.FFID;
            details.ClientID = $scope.customer.applicants[1]['ClientID'];
            details.AddressID = $scope.customer.Properties.AddressID;

            var application = {
                FFID: $scope.customer.clientDetails.FFID,
                AppID: $scope.customer.clientDetails.AppID,
                AddressID: $scope.customer.Properties.AddressID
            };
            propertyService.saveApplicationsDetail(application).then(function (response) {

            });

            propertyService.saveDetail(details).then(function (response) {
                $scope.customer.ExtraCommonLenderQn.FFID = $scope.customer.clientDetails.FFID;
                extraLenderService.saveDetail($scope.customer.ExtraCommonLenderQn).then(function (response) {

                });
                getPropertyDetails();
                if ($scope.customer.activePropertyTab === 'propertyDetails') {
                    $scope.customer.activePropertyTab = 'additionalPropertyDetails';
                } else if ($scope.customer.activePropertyTab === 'additionalPropertyDetails') {
                    $rootScope.changeTab({
                        state: 'app.employmentandincome',
                        title: 'Employment and Income',
                        id: 'employmentandincome'
                    });
                }
            });
        };
        $scope.createaddress = function (address) {
            var adressData = angular.copy(address);
            adressData.FFID = $scope.customer.clientDetails.FFID;
            //adressData.AddressID = $scope.customer.Properties.AddressID ? $scope.customer.Properties.AddressID : '';
            addresstService.saveDetail(adressData).then(function (response) {
                //$scope.customer.Properties.AddressID = response.AddressID;
                getAddressDetails(response.AddressID);
                $scope.customer.Properties.createNewAdd = false;
                $scope.customer.Properties['address'] = {};
//                var application = {
//                    FFID: $scope.customer.clientDetails.FFID,
//                    AppID: $scope.customer.clientDetails.AppID,
//                    AddressID: $scope.customer.Properties.AddressID
//                };
//                propertyService.saveApplicationsDetail(application).then(function (response) {
//                    //$scope.customer.activePropertyTab = 'propertyDetails';
//                    getPropertyDetails();
//                });
            });
        };
        $scope.backButtonAction = function () {
            $rootScope.changeTab({
                state: 'app.yourmortgagerequirement',
                title: 'Your mortgage requirement',
                id: 'yourmortgagerequirement'
            });
        };
        $scope.backButtonActionForTabs = function (action) {
            if (action === 'propertyDetails') {
                $scope.setPropertyTab('addProperty');
            } else if (action === 'additionalPropertyDetailForm') {
                $scope.setPropertyTab('propertyDetails');
            }
        };
        initialize();
    }]);



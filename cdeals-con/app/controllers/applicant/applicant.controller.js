'use strict';

factFindApp.controller('applicantCtrl', ['$scope', '$rootScope', 'selectBoxService', 'applicantService', 'localStorageService', 'extraLenderService',
    'addresstService', '$firebaseObject', 'firebaseService', 'toaster', '$filter',
    function ($scope, $rootScope, selectBoxService, applicantService, localStorageService, extraLenderService, addresstService,
        $firebaseObject, firebaseService, toaster, $filter) {
        $scope.setFieldTypingStatus = function (field, status) {
            var obj = {
                applicantForm: {
                    field: field,
                    applicantId: $scope.customer.activeApplicant,
                    status: status
                },
            };
            firebaseService.saveTypingStatus(obj);
        }
        $scope.checkPartnerTyping = function (field) {
            var flg = false;
            if($scope.typing.client && $scope.typing.client['applicantForm'] &&
                $scope.typing.client['applicantForm']['field'] == field && $scope.typing.client['applicantForm']['status']) {
                flg = true;
            }
            return flg;
        }
        $scope.isTabActive = function (tab) {
            return angular.equals($scope.customer.activeApplicant, tab);
        };
        $scope.changeTab = function (tab) {
            $scope.customer.activeApplicant = tab;
            $scope.customer.copyAddress = false;
        };
        $scope.applicantCountChange = function () {
            if($scope.customer.activeApplicant > $scope.customer.no_of_applicants) {
                if($scope.customer.no_of_applicants - 1 == 0) {
                    $scope.customer.activeApplicant = 1;
                } else {
                    $scope.customer.activeApplicant = $scope.customer.no_of_applicants - 1;
                }
            }
        };
        $scope.hasErrorDOB = function (value) {
            if(value) {
                return((moment().year() - moment(value, 'DD/MM/YYYY').year()) < 18) ? true : false;
            }
        };
        $scope.formFields = {};
        var ref = firebase.database().ref().child("/formFields/applicantForm/");
        $scope.formFields = $firebaseObject(ref);
        var initialize = function () {
            selectBoxService.geteTitles().then(function (response) {
                $scope.titleList = angular.copy(response);
            });
            selectBoxService.geteNationalities().then(function (response) {
                $scope.nationList = angular.copy(response);
            });
            selectBoxService.geteProofResDuration().then(function (response) {
                $scope.recidentMonth = angular.copy(response);
            });
            selectBoxService.geteGenders().then(function (response) {
                $scope.GenderList = angular.copy(response);
            });
            selectBoxService.geteMaritalStatuses().then(function (response) {
                $scope.maritalStatus = angular.copy(response);
            });
            $scope.applicants = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
            $scope.customer = { 'ExtraCommonLenderQn': { 'Payday12Months': false, 'PaydayRepaid': false, 'IPA': false } };
            var ref1 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/customer");
            var object = $firebaseObject(ref1);
            var ref2 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            $scope.typing = $firebaseObject(ref2);
            object.$bindTo($scope, 'customer');
            object.$loaded().then(function (data) {
                if(!$scope.customer.no_of_applicants) {
                    $scope.customer.no_of_applicants = 1;
                }
                if(!$scope.customer.activeApplicant) {
                    $scope.customer.activeApplicant = 1;
                }
                if(angular.isUndefined($scope.customer.applicants)) {
                    $scope.customer.applicants = {};
                }

                angular.forEach($scope.applicants, function (applicant) {
                    if(angular.isUndefined($scope.customer.applicants[applicant.id])) {
                        $scope.customer.applicants[applicant.id] = {
                            IsExpat: false,
                            RightToResideUK: false,
                            isAdditionalIncome: false,
                            isAnyBenifits: false,
                            Properties: { Properties: false },
                            EmploymentHeader: { EmpFullStatus: true },
                            Employment: { CurrentEmployment: false },
                            IncomeSelfEmpDetail: { eSelfEmpYearID: 1 }
                        };
                    }
                });

                if(angular.isUndefined($scope.customer.ExtraCommonLenderQn)) {
                    $scope.customer.ExtraCommonLenderQn = {
                        IsBridging: false,
                        IsHelptoBuy: false,
                        IsLimitedBTL: false,
                        IsMortgagePortable: false,
                        IsBridgingMainResidence: false,
                        RolledUpInterest: false,
                        IsHMO: false,
                        IsFamilyLet: false,
                        IsStudentLet: false,
                        Payday12Months: false,
                        PaydayRepaid: false,
                        'IPA': false,
                        ParkingStatus: false,
                        IsParking: false,
                        IsGarage: 'No'
                    };
                }

                if(angular.isUndefined($scope.customer.MortAppDetail)) {
                    $scope.customer.MortAppDetail = { ISFTL: false, IsHelptoBuy: false, IsLTB: false };
                }
                if(angular.isUndefined($scope.customer.Mortgages)) {
                    $scope.customer.Mortgages = {};
                }
                if(angular.isUndefined($scope.customer.Properties)) {
                    $scope.customer.Properties = {
                        Lift: false,
                        Converted: false,
                        PurposeBuilt: false,
                        StudioFlat: false,
                        BalconyAccess: false,
                        ExLocalAuthority: false,
                        AgriculturalTie: false,
                        ArchitectCertificate: false,
                        SelfBuild: false,
                        IsNewBuild: false,
                        SemiCommercial: false,
                        IsUsedForBuisnessPurpose: false,
                        IsOwnershipShared: false
                    };
                }

                if(angular.isUndefined($scope.customer.OtherExistingMortgageDetails)) {
                    $scope.customer.OtherExistingMortgageDetails = { isAnotherMortgage: false };
                }

                if(angular.isUndefined($scope.customer.Liabilities)) {
                    $scope.customer.Liabilities = { isLiabilities: false };
                }
                if(angular.isUndefined($scope.customer.CCJs)) {
                    $scope.customer.CCJs = { isCCJ: false };
                }
                if(angular.isUndefined($scope.customer.ArrearsDefaults)) {
                    $scope.customer.ArrearsDefaults = { isArrears: false, isDefault: false };
                }
                if(angular.isUndefined($scope.customer.Bankruptcy)) {
                    $scope.customer.Bankruptcy = { isBankrupt: false };
                }
                if(angular.isUndefined($scope.customer.IVAs)) {
                    $scope.customer.IVAs = { isIVA: false };
                }
                if(angular.isUndefined($scope.customer.Repossessions)) {
                    $scope.customer.Repossessions = { isRepossessed: false, IsLiabilitySettled: false };
                }
                getApplicants();
            });

        };
        var getApplicants = function () {
            applicantService.getDetails({ FFID: localStorageService.get('FFID') }).then(function (response) {
                if(response.length) {
                    $rootScope.tickTab('applicant');
                    var applicantList = angular.copy(response);
                    angular.forEach(applicantList, function (applicant, index) {
                        $scope.customer.applicants[index + 1]['AddressID'] = applicant.AddressID;
                        $scope.customer.applicants[index + 1]['ClientID'] = applicant.ClientID;
                        $scope.customer.applicants[index + 1]['FFID'] = applicant.FFID;
                        $scope.customer.applicants[index + 1]['eTitleID'] = applicant.eTitleID;
                        $scope.customer.applicants[index + 1]['Surname'] = applicant.Surname;
                        $scope.customer.applicants[index + 1]['Firstname'] = applicant.Firstname;
                        $scope.customer.applicants[index + 1]['Middlenames'] = applicant.Middlenames;
                        $scope.customer.applicants[index + 1]['ElectoralRoll'] = applicant.ElectoralRoll;
                        $scope.customer.applicants[index + 1]['RightToResideUK'] = applicant.RightToResideUK;
                        $scope.customer.applicants[index + 1]['ProfStatus'] = applicant.ProfStatus;
                        $scope.customer.applicants[index + 1]['eGenderID'] = applicant.eGenderID;
                        $scope.customer.applicants[index + 1]['AnticipatedRetireAge'] = applicant.AnticipatedRetireAge;
                        $scope.customer.applicants[index + 1]['Smoker'] = applicant.Smoker;
                        $scope.customer.applicants[index + 1]['eNationalityID'] = applicant.eNationalityID;
                        $scope.customer.applicants[index + 1]['eMaritalStatusID'] = applicant.eMaritalStatusID;
                        $scope.customer.applicants[index + 1]['eProofResDurationID'] = applicant.eProofResDurationID;
                        if(applicant.DOB) {
                            var str1 = applicant.DOB;
                            var finalDateString = str1.substring(6, 19);
                            var date1 = new Date(parseInt(finalDateString));
                            var newDate1 = date1.toString('dd/MM/yyyy');
                            $scope.customer.applicants[index + 1]['DOB'] = $filter('date')(new Date(newDate1),
                                'dd/MM/yyyy');
                        }
                        addresstService.getAddressDetailsByclientID({ clientID: applicant.ClientID }).then(function (
                            response) {
                            if(response.Addresses.length && response.Addresses[0]) {
                                getAddressDetails(response.Addresses[0][0], index);
                            } else {
                                $scope.customer.applicants[index + 1]['address'] = {};
                            }
                        });
                    });
                    extraLenderService.getDetails({ FFID: localStorageService.get('FFID') }).then(function (response) {
                        if(response.ExtraQnID) {
                            var extraCommonDetails = angular.copy(response);
                            $scope.customer.ExtraCommonLenderQn.ExtraQnID = extraCommonDetails.ExtraQnID;
                            $scope.customer.ExtraCommonLenderQn.IsExpat = extraCommonDetails.IsExpat;
                            $scope.customer.ExtraCommonLenderQn.IsExpat2 = extraCommonDetails.IsExpat2;
                            $scope.customer.ExtraCommonLenderQn.IsExpat3 = extraCommonDetails.IsExpat3;
                            $scope.customer.ExtraCommonLenderQn.IsExpat4 = extraCommonDetails.IsExpat4;

                            $scope.customer.ExtraCommonLenderQn.App1OtherNationality = extraCommonDetails.App1OtherNationality;
                            $scope.customer.ExtraCommonLenderQn.App2OtherNationality = extraCommonDetails.App2OtherNationality;
                            $scope.customer.ExtraCommonLenderQn.App3OtherNationality = extraCommonDetails.App3OtherNationality;
                            $scope.customer.ExtraCommonLenderQn.App4OtherNationality = extraCommonDetails.App4OtherNationality;

                            $scope.customer.applicants[1]['AppOtherNationality'] = $scope.customer.ExtraCommonLenderQn.App1OtherNationality;
                            $scope.customer.applicants[2]['AppOtherNationality'] = $scope.customer.ExtraCommonLenderQn.App2OtherNationality;
                            $scope.customer.applicants[3]['AppOtherNationality'] = $scope.customer.ExtraCommonLenderQn.App3OtherNationality;
                            $scope.customer.applicants[4]['AppOtherNationality'] = $scope.customer.ExtraCommonLenderQn.App4OtherNationality;

                            if(extraCommonDetails.IsExpat) {
                                $scope.customer.applicants[1]['IsExpat'] = extraCommonDetails.IsExpat;
                            } else {
                                $scope.customer.applicants[1]['IsExpat'] = false;
                            }
                            if(extraCommonDetails.IsExpat2) {
                                $scope.customer.applicants[2]['IsExpat'] = extraCommonDetails.IsExpat2;
                            } else {
                                $scope.customer.applicants[2]['IsExpat'] = false;
                            }
                            if(extraCommonDetails.IsExpat3) {
                                $scope.customer.applicants[3]['IsExpat'] = extraCommonDetails.IsExpat3;
                            } else {
                                $scope.customer.applicants[3]['IsExpat'] = false;
                            }
                            if(extraCommonDetails.IsExpat4) {
                                $scope.customer.applicants[4]['IsExpat'] = extraCommonDetails.IsExpat4;
                            } else {
                                $scope.customer.applicants[4]['IsExpat'] = false;
                            }
                        }
                    });
                }
            });
        };
        var objectifyAddressArray = function (x) {
            return {
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
                PostCode: x[12]
            };
        };
        var getAddressDetails = function (addressId, index) {
            addresstService.getDetails({ AddressID: addressId }).then(function (response) {
                if(response['Address '].length && response['Address '][0]) {
                    var addressData = angular.copy(response['Address '][0]);
                    $scope.customer.applicants[index + 1]['address'] = objectifyAddressArray(addressData);
                }
            });
        };
        $scope.searchPostCode = function (postcode, index) {
            addresstService.searchAddress({ postcode: postcode }).then(function (response) {
                if(response.Results) {
                    $scope.customer.applicants[index]['addressList'] = angular.copy(response.Results);
                }
            });
        };
        $scope.selectPostalCode = function (postcodeID, index) {
            addresstService.getAddressByPostcode({ postcodeID: postcodeID }).then(function (response) {
                if(response.Results) {
                    var addressData = response.Results[0];
                    if(!$scope.customer.applicants[index]['address']) {
                        $scope.customer.applicants[index]['address'] = {};
                    }
                    $scope.customer.applicants[index]['address']['Town'] = addressData.PostTown ? addressData.PostTown : '';
                    $scope.customer.applicants[index]['address']['Address1'] = addressData.Line1 ? addressData.Line1 : '';
                    $scope.customer.applicants[index]['address']['Address2'] = addressData.Line2 ? addressData.Line2 : '';
                    $scope.customer.applicants[index]['address']['Address3'] = addressData.Line3 ? addressData.Line3 : '';
                    $scope.customer.applicants[index]['address']['County'] = addressData.County ? addressData.County : '';
                    $scope.customer.applicants[index]['address']['Country'] = addressData.Country ? addressData.Country : 'UK';
                    $scope.customer.applicants[index]['address']['PostCode'] = addressData.Postcode ? addressData.Postcode : '';
                    $scope.customer.applicants[index]['address']['eAddressTypeID'] = 1;
                    $scope.customer.applicants[index]['address']['CurrentAddress'] = true;
                    $scope.customer.applicants[index]['addressList'].length = 0;
                    $scope.customer.applicants[index]['postCodeTerm'] = '';
                }
            });
        };
        $scope.changeResideProof = function (value, index) {
            if(value === '1') {
                $scope.customer.applicants[index].ElectoralRoll = false;
            } else {
                $scope.customer.applicants[index].ElectoralRoll = true;
            }
        };
        $scope.changeTextField = function (applicantId, fieldName) {
            if(!angular.isDefined($scope.customer.applicants[applicantId][fieldName])) {
                $scope.customer.applicants[applicantId][fieldName] = null;
            }
        };
        $scope.changeAddressTextField = function (applicantId, fieldName) {
            if(!angular.isDefined($scope.customer.applicants[applicantId]['address'][fieldName])) {
                $scope.customer.applicants[applicantId]['address'][fieldName] = null;
            }
        };
        $scope.saveApplicant = function (applicantDetails, index) {
            if(index === $scope.customer.no_of_applicants) {
                var Flag = false;
                angular.forEach($scope.customer.applicants, function (applicantData, key) {
                    if(!applicantData.ClientID && key < $scope.customer.no_of_applicants) {
                        Flag = true;
                    }
                });
                if(Flag) {
                    toaster.pop('Warning', 'Please fill up other applicant Data');
                    return;
                }
            }
            var details = angular.copy(applicantDetails);
            details.DOB = moment(moment(details.DOB, 'DD-MM-YYYY')).format('MM/DD/YYYY');
            delete details.addressList;
            delete details.address;
            details.FFID = $scope.customer.clientDetails.FFID;
            if(details.ClientID) {
                details.Active = false;
            }
            applicantService.saveDetail(details).then(function (response) {
                details.ClientID = response.ClientID;
                $scope.customer.applicants[index]['ClientID'] = response.ClientID;
                var appDetails = {
                    FFID: $scope.customer.clientDetails.FFID,
                    ClientID: $scope.customer.applicants[index]['ClientID'],
                    AppID: $scope.customer.clientDetails.AppID
                };
                applicantService.saveAppClientDetail(appDetails).then(function (response) {
                    // var extraCommonDetails = {FFID: $scope.customer.clientDetails.FFID, ExtraQnID: $scope.customer.ExtraCommonLenderQn.ExtraQnID};
                    $scope.customer.ExtraCommonLenderQn.FFID = $scope.customer.clientDetails.FFID;
                    if(index === 1) {
                        $scope.customer.ExtraCommonLenderQn.IsExpat = applicantDetails.IsExpat;
                        if(applicantDetails.AppOtherNationality)
                            $scope.customer.ExtraCommonLenderQn.App1OtherNationality = applicantDetails.AppOtherNationality;
                    }
                    if(index === 2) {
                        $scope.customer.ExtraCommonLenderQn.IsExpat2 = applicantDetails.IsExpat;
                        if(applicantDetails.AppOtherNationality)
                            $scope.customer.ExtraCommonLenderQn.App2OtherNationality = applicantDetails.AppOtherNationality;
                    }
                    if(index === 3) {
                        $scope.customer.ExtraCommonLenderQn.IsExpat3 = applicantDetails.IsExpat;
                        if(applicantDetails.AppOtherNationality)
                            $scope.customer.ExtraCommonLenderQn.App3OtherNationality = applicantDetails.AppOtherNationality;
                    }
                    if(index === 4) {
                        $scope.customer.ExtraCommonLenderQn.IsExpat4 = applicantDetails.IsExpat;
                        if(applicantDetails.AppOtherNationality)
                            $scope.customer.ExtraCommonLenderQn.App4OtherNationality = applicantDetails.AppOtherNationality;
                    }
                    extraLenderService.saveDetail($scope.customer.ExtraCommonLenderQn).then(function (response) {
                        // console.log(response);
                    });
                    var addressDetails = angular.copy(applicantDetails.address);
                    addressDetails.FFID = $scope.customer.clientDetails.FFID;
                    addressDetails.ClientID = $scope.customer.applicants[index]['ClientID'];
                    addresstService.saveDetail(addressDetails).then(function (response) {
                        details.AddressID = response.AddressID;
                        $scope.customer.applicants[index]['AddressID'] = response.AddressID;
                        if(response.AddressID) {
                            applicantService.saveDetail(details).then(function (response) {

                                if($scope.customer.no_of_applicants === 1) {
                                    $rootScope.changeTab({
                                        state: 'app.yourmortgagerequirement',
                                        title: 'Your mortgage requirement',
                                        id: 'yourmortgagerequirement'
                                    });
                                } else {
                                    if(index === $scope.customer.no_of_applicants) {
                                        var Flag = false;
                                        angular.forEach($scope.customer.applicants, function (
                                            applicantData, key) {
                                            if(!applicantData.ClientID && key < $scope.customer.no_of_applicants) {
                                                Flag = true;
                                            }
                                        });

                                        if(!Flag) {
                                            $rootScope.changeTab({
                                                state: 'app.yourmortgagerequirement',
                                                title: 'Your mortgage requirement',
                                                id: 'yourmortgagerequirement'
                                            });
                                        }
                                    } else {
                                        $scope.changeTab(index + 1);
                                    }

                                }
                                getApplicants();
                            });
                        }
                    });
                });
            });
        };
        $scope.backButtonAction = function (index) {
            if(index > 1) {
                $scope.changeTab(index - 1);
            }
        };
        $scope.copyAddress = function () {
            if($scope.customer.copyAddress) {
                $scope.customer.applicants[$scope.customer.activeApplicant]['address'] = $scope.customer.applicants['1']['address'];
            } else {
                $scope.customer.applicants[$scope.customer.activeApplicant]['address'] = "";
            }
        };
        initialize();
        $rootScope.$on('CLIENT_CHANGE', function (options, event) {
            initialize();
        });

    }
]);

'use strict';
factFindApp.controller('nonsouceApplicantCtrl', ['$scope', '$rootScope', 'applicantService', 'extraLenderService', 'addresstService', 'localStorageService', 'quoteService', '$firebaseObject', 'firebaseService', 'selectBoxService', 'toaster', '$filter','$timeout',
    function ($scope, $rootScope, applicantService, extraLenderService, addresstService, localStorageService, quoteService, $firebaseObject, firebaseService, selectBoxService, toaster, $filter, $timeout) {
        $scope.setFieldTypingStatus = function (field, status) {
            var obj = {
                nonsourceApplicantForm: {
                    field: field,
                    applicantId: $scope.customer.activeApplicant,
                    status: status
                },
            };
            firebaseService.saveTypingStatus(obj);
        };
        $scope.checkPartnerTyping = function (field) {
            var flg = false;
            if ($scope.typing.consultant && $scope.typing.consultant['nonsourceApplicantForm']
                    && $scope.typing.consultant['nonsourceApplicantForm']['field'] == field
                    && $scope.typing.consultant['nonsourceApplicantForm']['status']) {
                flg = true;
            }
            return flg;
        };
    
        $scope.isTabActive = function (applicantId) {
            return angular.equals($scope.customer.activeApplicant, applicantId);
        };
		
		$scope.triggerSubmit = function(form){
			var el = angular.element(document.querySelector('form[name='+form+']'));
			if(!el || !el.scope()) return false;
			var ngForm = el.scope()[form];
			$timeout(function(){
				angular.forEach(ngForm.$error.required, function(field) {
					field.$setDirty();
				});
			},10)
			return ngForm.$valid;
		};
        $scope.changeApplicantTab = function (applicantId) {
            $scope.customer.activeApplicant = applicantId;
            getApplicants();
        };
        $scope.changeTextField = function (applicantId, fieldName) {
            if (!angular.isDefined($scope.customer.applicants[applicantId][fieldName])) {
                $scope.customer.applicants[applicantId][fieldName] = null;
            }
        };
        $scope.changeAddressTextField = function (applicantId, fieldName) {
            if (!angular.isDefined($scope.customer.applicants[applicantId]['newAddress'][fieldName])) {
                $scope.customer.applicants[applicantId]['newAddress'][fieldName] = null;
            }
        };
        
        $scope.isApplActiveTab = function (tab) {
            return angular.equals($scope.customer.applicants[$scope.customer.activeApplicant]['activeNonSourceApp'], tab);
        };
        $scope.setApplTab = function (tab) {
            $scope.customer.applicants[$scope.customer.activeApplicant]['activeNonSourceApp'] = tab;
        };

        $scope.searchPostCode = function (postcode, index) {
            addresstService.searchAddress({postcode: postcode}).then(function (response) {
                if (response.Results) {
                    $scope.customer.applicants[index]['newaddressList'] = angular.copy(response.Results);
                }
            });
        };
        $scope.selectPostalCode = function (postcodeID, index) {
            addresstService.getAddressByPostcode({postcodeID: postcodeID}).then(function (response) {
                if (response.Results) {
                    var addressData = response.Results[0];
                    if (!$scope.customer.applicants[index]['newAddress']) {
                        $scope.customer.applicants[index]['newAddress'] = {};
                    }
                    $scope.customer.applicants[index]['newAddress']['Town'] = addressData.PostTown ? addressData.PostTown : '';
                    $scope.customer.applicants[index]['newAddress']['Address1'] = addressData.Line1 ? addressData.Line1 : '';
                    $scope.customer.applicants[index]['newAddress']['Address2'] = addressData.Line2 ? addressData.Line2 : '';
                    $scope.customer.applicants[index]['newAddress']['Address3'] = addressData.Line3 ? addressData.Line3 : '';
                    $scope.customer.applicants[index]['newAddress']['County'] = addressData.County ? addressData.County : '';
                    $scope.customer.applicants[index]['newAddress']['Country'] = addressData.Country ? addressData.Country : 'UK';
                    $scope.customer.applicants[index]['newAddress']['PostCode'] = addressData.Postcode ? addressData.Postcode : '';
                    $scope.customer.applicants[index]['newAddress']['eAddressTypeID'] = 1;
                    $scope.customer.applicants[index]['newAddress']['CurrentAddress'] = true;
                    $scope.customer.applicants[index]['newaddressList'].length = 0;
                    $scope.customer.applicants[index]['postCodeTerm'] = '';
                }
            });
        };
        $scope.addAddress = function (applicantDetails, index) {
            var addressDetails = angular.copy(applicantDetails);
            addressDetails.FFID = $scope.customer.clientDetails.FFID;
            addressDetails.ClientID = $scope.customer.applicants[index]['ClientID'];
            addressDetails.DateFrom = (addressDetails.DateFrom) ? moment(moment(addressDetails.DateFrom, 'DD-MM-YYYY')).format('MM/DD/YYYY') : '';
            addressDetails.DateTo = (addressDetails.DateTo) ? moment(moment(addressDetails.DateTo, 'DD-MM-YYYY')).format('MM/DD/YYYY') : '';
            addresstService.saveDetail(addressDetails).then(function (response) {
                $scope.customer.applicants[$scope.customer.activeApplicant]['newAddress'] = {};
                $scope.customer.applicants[$scope.customer.activeApplicant]['IsNewAddress'] = false;
                getApplicants();
            });
        };
        $scope.updateAddress = function (address, index) {
            $scope.addAddress(address, index);
        };
        $scope.changeAddressField = function(key, fieldName){
            if (!angular.isDefined($scope.customer.applicants[$scope.customer.activeApplicant]['applicantAddressList'][key][fieldName])) {
                $scope.customer.applicants[$scope.customer.activeApplicant]['applicantAddressList'][key][fieldName] = null;
            }
        };
        $scope.deleteAddress = function(address){
            addresstService.deleteAddress(address).then(function(response){
                 getApplicants();
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
                HomePhone: x[13],
                WorkPhone: x[14],
                MobilePhone: x[15],
                EmailAddress: x[16],
                Fax: x[17]
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
        var mapAddress = function (addresses, appIndex) {
            if (!$scope.customer.applicants[appIndex + 1]['applicantAddressList']) {
                $scope.customer.applicants[appIndex + 1]['applicantAddressList'] = [];
            }
            var addressObj = objectifyAddressArray(addresses[0]);
            $scope.customer.applicants[appIndex + 1]['applicantAddressList'].push(addressObj);
        };
        var getAddressDetails = function (Addresses, index) {
            $scope.customer.applicants[index + 1]['applicantAddressList'] = [];
            $scope.customer.applicants[index + 1]['newAddress'] = {};
            $scope.customer.applicants[$scope.customer.activeApplicant]['IsNewAddress'] = false;
            if ($scope.customer.activeApplicant === index + 1) {
                angular.forEach(Addresses, function (addressId) {
                    if (addressId) {
                        addresstService.getDetails({AddressID: addressId}).then(function (response) {
                            if (response['Address '].length && response['Address '][0]) {
                                mapAddress(response['Address '], index);
                            }
                        });
                    }
                });
            }
        };
        var getApplicants = function () {
            quoteService.getActiveQuotes({FFID: localStorageService.get('FFID')}).then(function (response) {
                if (response && response['MortgageQuotes '] && response['MortgageQuotes '].length > 1) {
                    var activeQuotes = [];
                    angular.forEach(response['MortgageQuotes '], function (quote) {
                        if (quote) {
                            activeQuotes.push(objectifyQuoteArray(quote));
                        }
                    });
                    $scope.customer.activeQuotes = angular.copy(activeQuotes);
                }
            });
            applicantService.getDetails({FFID: localStorageService.get('FFID')}).then(function (response) {
                if (response.length) {
                    $rootScope.tickTab('nonSourceApplicant');
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
                        if (applicant.DOB) {
                            var str1 = applicant.DOB;
                            var finalDateString = str1.substring(6, 19);
                            var date1 = new Date(parseInt(finalDateString));
                            var newDate1 = date1.toString('dd/MM/yyyy');
                            $scope.customer.applicants[index + 1]['DOB'] = $filter('date')(new Date(newDate1), 'dd/MM/yyyy');
                        }
                        addresstService.getAddressDetailsByclientID({clientID: applicant.ClientID}).then(function (response) {
                            if (response.Addresses.length && response.Addresses[index]) {
                                getAddressDetails(response.Addresses, index);
                            }
//                            else {
//                                $scope.customer.applicants[index + 1]['address'] = {};
//                            }
                        });

                    });

                }
                extraLenderService.getDetails({FFID: localStorageService.get('FFID')}).then(function (response) {
                    if (response.ExtraQnID) {
                        var extraCommonDetails = angular.copy(response);
                        $scope.customer.ExtraCommonLenderQn.ExtraQnID = extraCommonDetails.ExtraQnID;
                        $scope.customer.ExtraCommonLenderQn.CurrencyPaid1 = (extraCommonDetails.CurrencyPaid1) ? extraCommonDetails.CurrencyPaid1 : null;
                        $scope.customer.ExtraCommonLenderQn.CurrencyPaid2 = (extraCommonDetails.CurrencyPaid2) ? extraCommonDetails.CurrencyPaid2 : null;
                        $scope.customer.ExtraCommonLenderQn.CurrencyPaid3 = (extraCommonDetails.CurrencyPaid3) ? extraCommonDetails.CurrencyPaid3 : null;
                        $scope.customer.ExtraCommonLenderQn.CurrencyPaid4 = (extraCommonDetails.CurrencyPaid4) ? extraCommonDetails.CurrencyPaid4 : null;
                        $scope.customer.applicants[1]['CurrencyPaid1'] = $scope.customer.ExtraCommonLenderQn.CurrencyPaid1;
                        $scope.customer.applicants[2]['CurrencyPaid1'] = $scope.customer.ExtraCommonLenderQn.CurrencyPaid2;
                        $scope.customer.applicants[3]['CurrencyPaid1'] = $scope.customer.ExtraCommonLenderQn.CurrencyPaid3;
                        $scope.customer.applicants[4]['CurrencyPaid1'] = $scope.customer.ExtraCommonLenderQn.CurrencyPaid4;

                        $scope.customer.ExtraCommonLenderQn.ExpatAdditional1 = (extraCommonDetails.ExpatAdditional1) ? extraCommonDetails.ExpatAdditional1 : null;
                        $scope.customer.ExtraCommonLenderQn.ExpatAdditional2 = (extraCommonDetails.ExpatAdditional2) ? extraCommonDetails.ExpatAdditional2 : null;
                        $scope.customer.ExtraCommonLenderQn.ExpatAdditional3 = (extraCommonDetails.ExpatAdditional3) ? extraCommonDetails.ExpatAdditional3 : null;
                        $scope.customer.ExtraCommonLenderQn.ExpatAdditional4 = (extraCommonDetails.ExpatAdditional4) ? extraCommonDetails.ExpatAdditional4 : null;
                        $scope.customer.applicants[1]['ExpatAdditional1'] = $scope.customer.ExtraCommonLenderQn.ExpatAdditional1;
                        $scope.customer.applicants[2]['ExpatAdditional1'] = $scope.customer.ExtraCommonLenderQn.ExpatAdditional2;
                        $scope.customer.applicants[3]['ExpatAdditional1'] = $scope.customer.ExtraCommonLenderQn.ExpatAdditional3;
                        $scope.customer.applicants[4]['ExpatAdditional1'] = $scope.customer.ExtraCommonLenderQn.ExpatAdditional4;

                        $scope.customer.ExtraCommonLenderQn.App1CurRes = (extraCommonDetails.App1CurRes) ? extraCommonDetails.App1CurRes : null;
                        $scope.customer.ExtraCommonLenderQn.App2CurRes = (extraCommonDetails.App2CurRes) ? extraCommonDetails.App2CurRes : null;
                        $scope.customer.ExtraCommonLenderQn.App3CurRes = (extraCommonDetails.App3CurRes) ? extraCommonDetails.App3CurRes : null;
                        $scope.customer.ExtraCommonLenderQn.App4CurrRes = (extraCommonDetails.App4CurrRes) ? extraCommonDetails.App4CurrRes : null;
                        $scope.customer.applicants[1]['App1CurRes'] = $scope.customer.ExtraCommonLenderQn.App1CurRes;
                        $scope.customer.applicants[2]['App1CurRes'] = $scope.customer.ExtraCommonLenderQn.App2CurRes;
                        $scope.customer.applicants[3]['App1CurRes'] = $scope.customer.ExtraCommonLenderQn.App3CurRes;
                        $scope.customer.applicants[4]['App1CurRes'] = $scope.customer.ExtraCommonLenderQn.App4CurrRes;

                        $scope.customer.ExtraCommonLenderQn.App1CurMortgage = (extraCommonDetails.App1CurMortgage) ? extraCommonDetails.App1CurMortgage : null;
                        $scope.customer.ExtraCommonLenderQn.App2CurMortgage = (extraCommonDetails.App2CurMortgage) ? extraCommonDetails.App2CurMortgage : null;
                        $scope.customer.ExtraCommonLenderQn.App3CurMortgage = (extraCommonDetails.App3CurMortgage) ? extraCommonDetails.App3CurMortgage : null;
                        $scope.customer.ExtraCommonLenderQn.App4CurMortgage = (extraCommonDetails.App4CurMortgage) ? extraCommonDetails.App4CurMortgage : null;
                        $scope.customer.applicants[1]['App1CurMortgage'] = $scope.customer.ExtraCommonLenderQn.App1CurMortgage;
                        $scope.customer.applicants[2]['App1CurMortgage'] = $scope.customer.ExtraCommonLenderQn.App2CurMortgage;
                        $scope.customer.applicants[3]['App1CurMortgage'] = $scope.customer.ExtraCommonLenderQn.App3CurMortgage;
                        $scope.customer.applicants[4]['App1CurMortgage'] = $scope.customer.ExtraCommonLenderQn.App4CurMortgage;

                        $scope.customer.ExtraCommonLenderQn.App1CurrRent = (extraCommonDetails.App1CurrRent) ? extraCommonDetails.App1CurrRent : null;
                        $scope.customer.ExtraCommonLenderQn.App2CurrRent = (extraCommonDetails.App2CurrRent) ? extraCommonDetails.App2CurrRent : null;
                        $scope.customer.ExtraCommonLenderQn.App3CurrRent = (extraCommonDetails.App3CurrRent) ? extraCommonDetails.App3CurrRent : null;
                        $scope.customer.ExtraCommonLenderQn.App4CurrRent = (extraCommonDetails.App4CurrRent) ? extraCommonDetails.App4CurrRent : null;
                        $scope.customer.applicants[1]['App1CurrRent'] = $scope.customer.ExtraCommonLenderQn.App1CurrRent;
                        $scope.customer.applicants[2]['App1CurrRent'] = $scope.customer.ExtraCommonLenderQn.App2CurrRent;
                        $scope.customer.applicants[3]['App1CurrRent'] = $scope.customer.ExtraCommonLenderQn.App3CurrRent;
                        $scope.customer.applicants[4]['App1CurrRent'] = $scope.customer.ExtraCommonLenderQn.App4CurrRent;
                    }
                });
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

        $scope.saveApplicant = function (applicantDetails, index) {
            var details = angular.copy(applicantDetails);
            delete details.addressList;
            delete details.address;
            details.FFID = localStorageService.get('FFID');
            if (details.ClientID) {
                details.Active = false;
            }
            applicantService.saveDetail(details).then(function (response) {
                details.ClientID = response.ClientID;
                $scope.customer.applicants[index]['ClientID'] = response.ClientID;
                if (index === 1) {
                    $scope.customer.ExtraCommonLenderQn.CurrencyPaid1 = (details.CurrencyPaid1) ? details.CurrencyPaid1 : null;
                    $scope.customer.ExtraCommonLenderQn.ExpatAdditional1 = (details.ExpatAdditional1) ? details.ExpatAdditional1 : null;
                    $scope.customer.ExtraCommonLenderQn.App1CurRes = (details.App1CurRes) ? details.App1CurRes : null;
                    $scope.customer.ExtraCommonLenderQn.App1CurMortgage = (details.App1CurMortgage) ? details.App1CurMortgage : null;
                    $scope.customer.ExtraCommonLenderQn.App1CurrRent = (details.App1CurrRent) ? details.App1CurrRent : null;
                }
                if (index === 2) {
                    $scope.customer.ExtraCommonLenderQn.CurrencyPaid2 = (details.CurrencyPaid1) ? details.CurrencyPaid1 : null;
                    $scope.customer.ExtraCommonLenderQn.ExpatAdditional2 = (details.ExpatAdditional1) ? details.ExpatAdditional1 : null;
                    $scope.customer.ExtraCommonLenderQn.App2CurRes = (details.App1CurRes) ? details.App1CurRes : null;
                    $scope.customer.ExtraCommonLenderQn.App2CurMortgage = (details.App1CurMortgage) ? details.App1CurMortgage : null;
                    $scope.customer.ExtraCommonLenderQn.App2CurrRent = (details.App1CurrRent) ? details.App1CurrRent : null;
                }
                if (index === 3) {
                    $scope.customer.ExtraCommonLenderQn.CurrencyPaid3 = (details.CurrencyPaid1) ? details.CurrencyPaid1 : null;
                    $scope.customer.ExtraCommonLenderQn.ExpatAdditional3 = (details.ExpatAdditional1) ? details.ExpatAdditional1 : null;
                    $scope.customer.ExtraCommonLenderQn.App3CurRes = (details.App1CurRes) ? details.App1CurRes : null;
                    $scope.customer.ExtraCommonLenderQn.App3CurMortgage = (details.App1CurMortgage) ? details.App1CurMortgage : null;
                    $scope.customer.ExtraCommonLenderQn.App3CurrRent = (details.App1CurrRent) ? details.App1CurrRent : null;
                }
                if (index === 4) {
                    $scope.customer.ExtraCommonLenderQn.CurrencyPaid4 = (details.CurrencyPaid1) ? details.CurrencyPaid1 : null;
                    $scope.customer.ExtraCommonLenderQn.ExpatAdditional4 = (details.ExpatAdditional1) ? details.ExpatAdditional1 : null;
                    $scope.customer.ExtraCommonLenderQn.App4CurrRes = (details.App1CurRes) ? details.App1CurRes : null;
                    $scope.customer.ExtraCommonLenderQn.App4CurMortgage = (details.App1CurMortgage) ? details.App1CurMortgage : null;
                    $scope.customer.ExtraCommonLenderQn.App4CurrRent = (details.App1CurrRent) ? details.App1CurrRent : null;
                }
                $scope.customer.ExtraCommonLenderQn.FFID = $scope.customer.clientDetails.FFID;
                extraLenderService.saveDetail($scope.customer.ExtraCommonLenderQn).then(function (response) {
                    getApplicants();
                    if ($scope.customer.no_of_applicants === 1) {
                        $scope.moveNextTab();
                    } else {
                        if (index === $scope.customer.no_of_applicants) {
                            var Flag = false;
                            angular.forEach($scope.customer.applicants, function (applicantData, key) {
                                if (!applicantData.ClientID && key < $scope.customer.no_of_applicants) {
                                    Flag = true;
                                }
                            });
                            if (!Flag) {
                                $scope.moveNextTab();
                            }
                        } else {
                            $scope.moveNextTab();
                        }
                    }
                    if ($scope.customer.activeQuotes && $scope.customer.activeQuotes.length > 0) {
                        angular.forEach($scope.customer.activeQuotes, function (item) {
                            quoteService.getQuoteSummary({FFID: localStorageService.get('FFID'), MortQuoteID: item.MortQuoteID}).then(function (productSummary) {
                                var activeProductSummary = angular.copy(productSummary);
                                if (activeProductSummary && activeProductSummary.length > 0) {
                                    angular.forEach(activeProductSummary, function (products) {
                                        quoteService.updateMortageQuoteSelected(products.MortSelID).then(function (response) {
                                        });
                                    });
                                }
                            });
                        });
                    }
                });
            });
        };
        $scope.backButtonAction = function (index) {
            if (index > 1) {
                $scope.changeApplicantTab(index - 1);
            } else {
                $rootScope.changeTab({
                    state: 'app.quote_summary',
                    title: 'Quote Summary',
                    id: 'quote_summary'
                });
            }
        };
        $scope.backButtonActionForTabs = function () {
            $scope.setApplTab('applicantDetails');
        };
        $scope.moveNextTab = function () {
            $scope.customer.applicants[$scope.customer.activeApplicant]['activeNonSourceApp'] = 'applicantAddress';
        };
        $scope.nextApplicant = function (currentApplicant) {
            if ($scope.customer.no_of_applicants > currentApplicant) {
                $scope.changeApplicantTab(currentApplicant + 1);
                $scope.setApplTab('applicantDetails');
            } else {
                $rootScope.changeTab({
                    state: 'app.nonSourceEmploymentandIncome',
                    title: 'Non source Employment and Income',
                    id: 'nonSourceEmploymentandIncome'
                });
            }

        };
        var initialize = function () {
            $scope.ResidentialStatusList = [
                {label: 'Owner outright', value: 'Owner outright'},
                {label: 'Owner with mortgage', value: 'Owner with mortgage'},
                {label: 'Living with family', value: 'Living with family'},
                {label: 'Living with friend', value: 'Living with friend.'},
                {label: 'Renting (private)', value: 'Renting'},
                {label: 'Renting (local authority)', value: 'RentingL'}
            ];
            
            $scope.address.EmailAddress = localStorageService.get('email');
            $scope.address.MobilePhone = localStorageService.get('phone');

            selectBoxService.geteMaritalStatuses().then(function (response) {
                $scope.maritalStatus = angular.copy(response);
            });
            $scope.applicants = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];
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
                if (!$scope.customer.applicants[1]['activeNonSourceApp']) {
                    $scope.customer.applicants[1]['activeNonSourceApp'] = 'applicantDetails';
                }
                if (!$scope.customer.applicants[2]['activeNonSourceApp']) {
                    $scope.customer.applicants[2]['activeNonSourceApp'] = 'applicantDetails';
                }
                if (!$scope.customer.applicants[3]['activeNonSourceApp']) {
                    $scope.customer.applicants[3]['activeNonSourceApp'] = 'applicantDetails';
                }
                if (!$scope.customer.applicants[4]['activeNonSourceApp']) {
                    $scope.customer.applicants[4]['activeNonSourceApp'] = 'applicantDetails';
                }
                getApplicants();
            });
            var ref2 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            $scope.typing = $firebaseObject(ref2);
        };
        initialize();
    }]);


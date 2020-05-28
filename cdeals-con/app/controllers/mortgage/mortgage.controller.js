'use strict';

factFindApp.controller('mortgageCtrl', ['$scope', '$rootScope', 'selectBoxService', 'extraLenderService', 'mortgageService', 'localStorageService',
    '$firebaseObject', 'firebaseService', 'liabilitiesService', '$filter', 'toaster',
    function ($scope, $rootScope, selectBoxService, extraLenderService, mortgageService, localStorageService, $firebaseObject,
        firebaseService, liabilitiesService, $filter, toaster) {
        $scope.setFieldTypingStatus = function (field, status) {
            var obj = {
                mortgageForm: {
                    field: field,
                    status: status
                },
            };
            firebaseService.saveTypingStatus(obj);
        };
        $scope.checkPartnerTyping = function (field) {
            var flg = false;
            if($scope.typing.client && $scope.typing.client['mortgageForm'] &&
                $scope.typing.client['mortgageForm']['field'] == field &&
                $scope.typing.client['mortgageForm']['status']) {
                flg = true;
            }
            return flg;
        };

        $scope.isMorgageTab = function (tab) {
            return angular.equals($scope.customer.activeMortgageTab, tab);
        };
        $scope.setMorgageTab = function (tab) {
            $scope.customer.activeMortgageTab = tab;
        };
        $scope.changeApplicationType = function (type) {
            if(type === 'Purchase') {
                $scope.customer.activeMortgageTab = 'purchaseDetails';
            } else {
                $scope.customer.activeMortgageTab = 'existingMortgage';
            }
            delete $scope.customer.MortAppDetail.eMortgageTypeID;
        };
        $scope.changeBridging = function (IsBridging) {
            if(IsBridging === false) {
                if($scope.customer.MortAppDetail.applicationType === 'Purchase') {
                    $scope.customer.activeMortgageTab = 'purchaseDetails';
                } else {
                    $scope.customer.activeMortgageTab = 'newMortgage';
                }
            }
        };
        $scope.changeTextField = function (detail, fieldName) {
            if(!angular.isDefined($scope.customer[detail][fieldName])) {
                $scope.customer[detail][fieldName] = null;
            }
        };
        var initialize = function () {
            selectBoxService.geteMortgageTypes().then(function (response) {
                var mortgageTypeList = angular.copy(response);
                var finalDetails = _.sortBy(mortgageTypeList, 'name');
                $scope.purchaseMorgageType = finalDetails.slice(0, 5);
                $scope.remortgageMorgageType = finalDetails.slice(5, finalDetails.length);
            });
            selectBoxService.geteMortgagePaymentMethods().then(function (response) {
                $scope.repaymentMethods = angular.copy(response);
            });
            selectBoxService.geteDepositSources().then(function (response) {
                $scope.sourceDepositList = angular.copy(response);
            });
            selectBoxService.geteBTLMortgagePaymentCovered().then(function (response) {
                $scope.btlpaymentCoverList = angular.copy(response);
            });
            selectBoxService.geteLenders().then(function (response) {
                $scope.existingLenderList = angular.copy(response);
            });
            $scope.loanRepayList = [{ label: "Refinance", val: 'Refinance' }, { label: "Sale of Existing Property", val: 'Sale of Existing Property' },
                { label: "Sale of Another Property", val: 'Sale of Another Property' }
            ];
            //$scope.existingLenderList = [{label: "Accord Prime", val: '1'}, {label: "Aldermore Mortgages", val: '2'}];
            $scope.earlyRepaymentModeList = [{ label: 'Add to New Mortgage', val: 1 }, { label: 'Own Funds', val: 2 }, {
                label: 'Not willing to pay',
                val: 3
            }];
            $scope.customer = {};
            var ref1 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/customer");
            var object = $firebaseObject(ref1);
            object.$bindTo($scope, 'customer');
            var ref2 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            $scope.typing = $firebaseObject(ref2);
            object.$loaded(function () {

                getMortgageDetails();
                calculateTotalConsolidatedVal();
                $scope.displayLTVErrorMsgOnNewMortgage = false;
            });
        };
        var calculateTotalConsolidatedVal = function () {
            liabilitiesService.getLiabilities({ FFID: $scope.customer.clientDetails.FFID, AppID: $scope.customer.clientDetails.AppID }).then(
                function (response) {
                    $scope.tcv = 0;
                    if(response.length) {
                        angular.forEach(response, function (liability) {
                            if(liability.Consolidate) {
                                $scope.tcv += liability.BalanceOutstanding;
                            }
                        });
                    }
                    if($scope.customer.MortAppDetail) {
                        $scope.customer.MortAppDetail.totalConsolidatedLiabilities = $scope.tcv;
                        $scope.getTotalLoanRequiredForNewMortgage();
                        $scope.getLTVForNewMortgage();
                        $scope.getTotalLoanRequiredForNotWillingToPay();
                        $scope.getLTVForNotWillingToPay();
                        $scope.getTotalLoanRequiredForSecuredLoan();
                        $scope.getLTVForSecuredLoan();
                    }
                });
        };
        var getMortgageDetails = function () {
            extraLenderService.getDetails({ FFID: $scope.customer.clientDetails.FFID }).then(function (response) {
                if(response.ExtraQnID) {
                    var extraCommonDetails = angular.copy(response);
                    $scope.customer.ExtraCommonLenderQn.ExtraQnID = extraCommonDetails.ExtraQnID;
                    $scope.customer.ExtraCommonLenderQn.IsBridging = (extraCommonDetails.IsBridging) ? extraCommonDetails.IsBridging :
                        false;
                    $scope.customer.ExtraCommonLenderQn.IsHelptoBuy = (extraCommonDetails.IsHelptoBuy) ? extraCommonDetails.IsHelptoBuy :
                        false;
                    $scope.customer.ExtraCommonLenderQn.DepositFromClient = (extraCommonDetails.DepositFromClient) ?
                        extraCommonDetails.DepositFromClient : null;
                    $scope.customer.ExtraCommonLenderQn.IsLimitedBTL = (extraCommonDetails.IsLimitedBTL) ? extraCommonDetails.IsLimitedBTL :
                        false;
                    $scope.customer.ExtraCommonLenderQn.IsMortgagePortable = (extraCommonDetails.IsMortgagePortable) ?
                        extraCommonDetails.IsMortgagePortable : false;
                    $scope.customer.ExtraCommonLenderQn.IsBridgingMainResidence = (extraCommonDetails.IsBridgingMainResidence) ?
                        extraCommonDetails.IsBridgingMainResidence : false;
                    $scope.customer.ExtraCommonLenderQn.BridgingTermMonths = (extraCommonDetails.BridgingTermMonths) ?
                        extraCommonDetails.BridgingTermMonths : null;
                    $scope.customer.ExtraCommonLenderQn.RolledUpInterest = (extraCommonDetails.RolledUpInterest) ?
                        extraCommonDetails.RolledUpInterest : false;
                    $scope.customer.ExtraCommonLenderQn.PayEndofTerm = (extraCommonDetails.PayEndofTerm) ? extraCommonDetails.PayEndofTerm :
                        null;
                }
            });
            mortgageService.getDetails({ FFID: $scope.customer.clientDetails.FFID, AppID: $scope.customer.clientDetails.AppID }).then(
                function (response) {
                    var morgageAppDetails = angular.copy(response);
                    if(!$scope.customer.MortAppDetail.ExistingMortgage) {
                        $scope.customer.MortAppDetail.ExistingMortgage = false;
                    }
                    if(morgageAppDetails.MortAppID) {
                        $rootScope.tickTab('yourmortgagerequirement');
                        $scope.customer.MortAppDetail.MortAppID = morgageAppDetails.MortAppID;
                        if(morgageAppDetails.PropertyPurchaseDate) {
                            var str1 = morgageAppDetails.PropertyPurchaseDate;
                            var finalDateString = str1.substring(6, 19);
                            var date1 = new Date(parseInt(finalDateString));
                            var newDate1 = date1.toString('dd/MM/yyyy');
                            $scope.customer.MortAppDetail.PropertyPurchaseDate = $filter('date')(new Date(newDate1), 'dd/MM/yyyy');
                        }
                        $scope.customer.MortAppDetail.eMortgageTypeID = morgageAppDetails.eMortgageTypeID;
                        $scope.customer.MortAppDetail.ePaymentMethodID = morgageAppDetails.ePaymentMethodID;
                        $scope.customer.MortAppDetail.InterestOnlyAmount = morgageAppDetails.InterestOnlyAmount;
                        $scope.customer.MortAppDetail.RepaymentAmount = morgageAppDetails.RepaymentAmount;
                        $scope.customer.MortAppDetail.Deposit = morgageAppDetails.Deposit;
                        $scope.customer.MortAppDetail.eDepositSourceID = morgageAppDetails.eDepositSourceID;

                        $scope.customer.MortAppDetail.PurchasePrice = morgageAppDetails.PurchasePrice;
                        $scope.customer.MortAppDetail.PropertyValue = morgageAppDetails.PropertyValue;
                        $scope.customer.MortAppDetail.LoanRequired = morgageAppDetails.LoanRequired;
                        $scope.customer.MortAppDetail.MortAmtRequired = morgageAppDetails.MortAmtRequired;
                        $scope.customer.MortAppDetail.LTV = morgageAppDetails.LTV;
                        $scope.customer.MortAppDetail.eBTLMortgagePaymentCoveredID = morgageAppDetails.eBTLMortgagePaymentCoveredID;
                        $scope.customer.MortAppDetail.BTLAnticipatedMonthlyIncome = morgageAppDetails.BTLAnticipatedMonthlyIncome;
                        $scope.customer.MortAppDetail.ExistingMortgage = morgageAppDetails.ExistingMortgage;
                        $scope.customer.MortAppDetail.DebtConsolidationAmt = morgageAppDetails.DebtConsolidationAmt;
                        $scope.customer.MortAppDetail.ShOwnPcntPurchasing = morgageAppDetails.ShOwnPcntPurchasing;
                        $scope.customer.MortAppDetail.ShOwnMthlyRentalPyt = morgageAppDetails.ShOwnMthlyRentalPyt;
                        $scope.customer.MortAppDetail.ShOwnRemPcntAlreadyPurchased = morgageAppDetails.ShOwnRemPcntAlreadyPurchased;
                        $scope.customer.MortAppDetail.ShOwnRemNewMthlyIncome = morgageAppDetails.ShOwnRemNewMthlyIncome;
                        $scope.customer.MortAppDetail.RTBPurchasePriceAfterDiscount = morgageAppDetails.RTBPurchasePriceAfterDiscount;
                        $scope.customer.MortAppDetail.CapitalRaising = morgageAppDetails.CapitalRaising;
                        $scope.customer.MortAppDetail.Advised = morgageAppDetails.Advised;
                        $scope.customer.MortAppDetail.eValuationTypeID = morgageAppDetails.eValuationTypeID;
                        $scope.customer.MortAppDetail.BrokerFeeCharged = morgageAppDetails.BrokerFeeCharged;
                        $scope.customer.MortAppDetail.eStampDutyTypeID = morgageAppDetails.eStampDutyTypeID;
                        $scope.customer.MortAppDetail.SolicitorID = morgageAppDetails.SolicitorID;
                        $scope.customer.MortAppDetail.BankID = morgageAppDetails.BankID;
                        $scope.customer.MortAppDetail.CardID = morgageAppDetails.CardID;
                        $scope.customer.MortAppDetail.ERCAdded = morgageAppDetails.ERCAdded;
                        $scope.customer.MortAppDetail.ContactLender = morgageAppDetails.ContactLender;
                        $scope.customer.MortAppDetail.Outcome = morgageAppDetails.Outcome;
                        $scope.customer.MortAppDetail.Reason = morgageAppDetails.Reason;
                        $scope.customer.MortAppDetail.Contingency = morgageAppDetails.Contingency;
                        $scope.customer.MortAppDetail.IsLTB = morgageAppDetails.IsLTB;
                        $scope.customer.MortAppDetail.ISFTL = morgageAppDetails.ISFTL;
                        $scope.customer.MortAppDetail.LTBDetails = morgageAppDetails.LTBDetails;
                        if(morgageAppDetails.TermMonths) {
                            $scope.customer.MortAppDetail.TermYear = Math.floor(Math.floor(morgageAppDetails.TermMonths) / 12);
                            $scope.customer.MortAppDetail.TermMonths = morgageAppDetails.TermMonths - $scope.customer.MortAppDetail.TermYear *
                                12;
                        }
                    }
                    mortgageService.getCurrentMortgageDetails({
                        FFID: $scope.customer.clientDetails.FFID,
                        AppID: $scope.customer.clientDetails
                            .AppID
                    }).then(function (response) {
                        var Morgages = angular.copy(response);
                        if(!$scope.customer.Mortgages) {
                            $scope.customer.Mortgages = { ERC: 0, Portable: false };
                        }
                        if(Morgages.MortgageID) {
                            $scope.customer.Mortgages.MortgageID = Morgages.MortgageID;
                            // $scope.customer.Mortgages.IsSourcingRefreshRequired = Morgages.IsSourcingRefreshRequired;
                            $scope.customer.Mortgages.OtherLenderName = Morgages.OtherLenderName;
                            $scope.customer.Mortgages.eMortgageTypeID = Morgages.eMortgageTypeID;
                            $scope.customer.Mortgages.AccountNumber = Morgages.AccountNumber;
                            $scope.customer.Mortgages.OriginalBalance = Morgages.OriginalBalance;
                            $scope.customer.Mortgages.OriginalTerm = Morgages.OriginalTerm;
                            $scope.customer.Mortgages.RemainingBalance = Morgages.RemainingBalance;
                            if(Morgages.RemainingTerm) {
                                $scope.customer.Mortgages.RemainingTermYear = Math.floor(Math.floor(Morgages.RemainingTerm) /
                                    12);
                                $scope.customer.Mortgages.RemainingTermMonths = Morgages.RemainingTerm - $scope.customer.Mortgages
                                    .RemainingTermYear * 12;
                            }
                            //$scope.customer.Mortgages.RemainingTerm = Morgages.RemainingTerm;
                            //                        if (Morgages.InterestRate) {
                            //                            Morgages.InterestRate = Morgages.InterestRate.toFixed(2);
                            //                            var myRate = angular.copy(Morgages.InterestRate);
                            //                            var rate = parseInt(myRate);
                            //                            if (rate < 10) {
                            //                                Morgages.InterestRate = '0' + myRate.toString();
                            //                            }
                            //                        }
                            $scope.customer.Mortgages.InterestRate = Morgages.InterestRate;
                            $scope.customer.Mortgages.MonthlyPayments = Morgages.MonthlyPayments;
                            $scope.customer.Mortgages.Portable = Morgages.Portable;
                            $scope.customer.Mortgages.ERC = Morgages.ERC;
                            $scope.customer.Mortgages.LoanRequired = Morgages.LoanRequired;
                            $scope.customer.Mortgages.eMortgagePaymentMethodID = Morgages.eMortgagePaymentMethodID;
                            $scope.customer.Mortgages.ToBeRepaid = Morgages.ToBeRepaid;
                            $scope.customer.Mortgages.ContactLender = Morgages.ContactLender;
                            $scope.customer.Mortgages.Outcome = Morgages.Outcome;
                            $scope.customer.Mortgages.Reason = Morgages.Reason;
                            $scope.customer.Mortgages.ERCPaymentMode = Morgages.ERCPaymentMode;

                            if(Morgages.PropertyPurchaseDate) {
                                var str1 = Morgages.PropertyPurchaseDate;
                                var finalDateString = str1.substring(6, 19);
                                var date1 = new Date(parseInt(finalDateString));
                                var newDate1 = date1.toString('dd/MM/yyyy');
                                $scope.customer.Mortgages.PropertyPurchaseDate = $filter('date')(new Date(newDate1),
                                    'dd/MM/yyyy');
                            }
                            if(Morgages.ERCExpiryDate) {
                                var str1 = Morgages.ERCExpiryDate;
                                var finalDateString = str1.substring(6, 19);
                                var date1 = new Date(parseInt(finalDateString));
                                var newDate1 = date1.toString('dd/MM/yyyy');
                                $scope.customer.Mortgages.ERCExpiryDate = $filter('date')(new Date(newDate1), 'dd/MM/yyyy');
                            }
                        }

                    });
                });
        };
        $scope.savePurchase = function (details) {
            var MortAppDetail = angular.copy(details.MortAppDetail);
            var Mortgages = angular.copy(details.Mortgages);
            if(!Mortgages) {
                Mortgages = {};
            }
            if(MortAppDetail.TermYear * 12 + MortAppDetail.TermMonths * 1 < 24) {
                toaster.pop({ type: 'error', title: "Term of New Mortgage Must be more than 2 year" });
                return;
            }
            MortAppDetail.MortAppID = MortAppDetail.MortAppID ? MortAppDetail.MortAppID : '';
            MortAppDetail.FFID = $scope.customer.clientDetails.FFID;
            MortAppDetail.Appid = $scope.customer.clientDetails.AppID;
            //MortAppDetail.MortAmtRequired = MortAppDetail.PropertyValue - (MortAppDetail.Deposit || 0) + (MortAppDetail.CapitalRaising || 0);
            MortAppDetail.TermMonths = MortAppDetail.TermYear * 12 + MortAppDetail.TermMonths * 1;
            MortAppDetail.eDepositSourceID = (MortAppDetail.eDepositSourceID) ? MortAppDetail.eDepositSourceID : '';
            //MortAppDetail.PurchasePrice = (MortAppDetail.PurchasePrice) ? MortAppDetail.PurchasePrice : '';
            //MortAppDetail.PropertyValue = (MortAppDetail.PropertyValue) ? MortAppDetail.PropertyValue : '';
            MortAppDetail.IsLTB = (MortAppDetail.IsLTB) ? MortAppDetail.IsLTB : '';
            MortAppDetail.ISFTL = (MortAppDetail.ISFTL) ? MortAppDetail.ISFTL : '';
            //MortAppDetail.RTBPurchasePriceAfterDiscount = (MortAppDetail.RTBPurchasePriceAfterDiscount) ? MortAppDetail.RTBPurchasePriceAfterDiscount : '';
            // MortAppDetail.CapitalRaising = (MortAppDetail.CapitalRaising) ? MortAppDetail.CapitalRaising : '';
            //MortAppDetail.Deposit = (MortAppDetail.Deposit) ? MortAppDetail.Deposit : '';
            //MortAppDetail.MortAmtRequired = (MortAppDetail.MortAmtRequired) ? MortAppDetail.MortAmtRequired : 0;
            MortAppDetail.PropertyPurchaseDate = (MortAppDetail.PropertyPurchaseDate) ? moment(moment(MortAppDetail.PropertyPurchaseDate,
                'DD-MM-YYYY')).format('MM/DD/YYYY') : '';
            MortAppDetail.eBTLMortgagePaymentCoveredID = (MortAppDetail.eBTLMortgagePaymentCoveredID) ? MortAppDetail.eBTLMortgagePaymentCoveredID :
                '';
            //MortAppDetail.BTLAnticipatedMonthlyIncome = (MortAppDetail.BTLAnticipatedMonthlyIncome) ? MortAppDetail.BTLAnticipatedMonthlyIncome : '';
            MortAppDetail.Contingency = 0;
            //MortAppDetail.InterestOnlyAmount = (MortAppDetail.InterestOnlyAmount) ? MortAppDetail.InterestOnlyAmount : '';
            //MortAppDetail.RepaymentAmount = (MortAppDetail.RepaymentAmount) ? MortAppDetail.RepaymentAmount : '';
            Mortgages.MortgageID = (Mortgages.MortgageID) ? Mortgages.MortgageID : '';
            Mortgages.FFID = $scope.customer.clientDetails.FFID;
            Mortgages.Appid = $scope.customer.clientDetails.AppID;
            Mortgages.eMortgagePaymentMethodID = 0;
            Mortgages.eLenderID = (Mortgages.eLenderID) ? Mortgages.eLenderID : '';
            Mortgages.eMortgageTypeID = MortAppDetail.eMortgageTypeID ? MortAppDetail.eMortgageTypeID : '';
            Mortgages.PropertyPurchaseDate = (MortAppDetail.PropertyPurchaseDate) ? moment(moment(MortAppDetail.PropertyPurchaseDate,
                'DD-MM-YYYY')).format('MM/DD/YYYY') : '';
            //Mortgages.OriginalBalance = (Mortgages.OriginalBalance) ? Mortgages.OriginalBalance : '';
            //Mortgages.RemainingBalance = (Mortgages.RemainingBalance) ? Mortgages.RemainingBalance : '';
            //Mortgages.MonthlyPayments = (Mortgages.MonthlyPayments) ? Mortgages.MonthlyPayments : '';
            Mortgages.ERCPaymentMode = (Mortgages.ERCPaymentMode) ? Mortgages.ERCPaymentMode : '';
            Mortgages.ERCExpiryDate = (Mortgages.ERCExpiryDate) ? moment(moment(Mortgages.ERCExpiryDate, 'DD-MM-YYYY')).format(
                'MM/DD/YYYY') : '';
            //Mortgages.ERC = (Mortgages.ERC) ? Mortgages.ERC : '';
            Mortgages.ToBeRepaid = 'true';
            if(MortAppDetail.eMortgageTypeID != 5 && MortAppDetail.eMortgageTypeID != 4) {
                MortAppDetail.LoanRequired = (MortAppDetail.PropertyValue - MortAppDetail.Deposit) + MortAppDetail.CapitalRaising;
                MortAppDetail.LTV = MortAppDetail.LoanRequired / MortAppDetail.PropertyValue * 100;
            }
            if(MortAppDetail.eMortgageTypeID == 5) {
                MortAppDetail.LoanRequired = $scope.calculateLaonRequiredforPurchaseSharedOwnership();
                MortAppDetail.LTV = $scope.calculateLTVforPurchaseSharedOwnership();
            }
            if(MortAppDetail.eMortgageTypeID == 4) {
                MortAppDetail.LoanRequired = $scope.calculateLaonRequiredforPurchaseRTB();
                MortAppDetail.LTV = $scope.calculateLTVforPurchaseRTB();
            }
            Mortgages.LoanRequired = (MortAppDetail.LoanRequired) ? MortAppDetail.LoanRequired : '';
            MortAppDetail.MortAmtRequired = Mortgages.LoanRequired;
            Mortgages.LTV = (MortAppDetail.LTV) ? MortAppDetail.LTV : '';
            //mortgageService.SaveCurrentMortgages(Mortgages).then(function (response) {
            mortgageService.SaveMortAppDetail(MortAppDetail).then(function (response) {
                $scope.customer.ExtraCommonLenderQn.FFID = $scope.customer.clientDetails.FFID;
                extraLenderService.saveDetail($scope.customer.ExtraCommonLenderQn).then(function (response) {
                    // console.log(response);
                });
                getMortgageDetails();
                if($scope.customer.activeMortgageTab === 'purchaseDetails' && $scope.customer.ExtraCommonLenderQn.IsBridging) {
                    $scope.customer.activeMortgageTab = 'bridging';
                } else {
                    $rootScope.changeTab({
                        state: 'app.property',
                        title: 'Property Details',
                        id: 'property'
                    });
                }
            });
            // });
        };
        $scope.saveBridging = function (details) {
            $scope.customer.ExtraCommonLenderQn.FFID = $scope.customer.clientDetails.FFID;
            extraLenderService.saveDetail($scope.customer.ExtraCommonLenderQn).then(function (response) {
                getMortgageDetails();
                if($scope.customer.activeMortgageTab === 'bridging') {
                    $rootScope.changeTab({
                        state: 'app.property',
                        title: 'Property Details',
                        id: 'property'
                    });
                }
            });
        };
        $scope.saveExistingMortgage = function (details) {
            var MortAppDetail = angular.copy(details.MortAppDetail);
            var Mortgages = angular.copy(details.Mortgages);
            MortAppDetail.MortAppID = MortAppDetail.MortAppID ? MortAppDetail.MortAppID : '';
            MortAppDetail.FFID = $scope.customer.clientDetails.FFID;
            MortAppDetail.Appid = $scope.customer.clientDetails.AppID;
            //MortAppDetail.MortAmtRequired = MortAppDetail.PropertyValue - (MortAppDetail.Deposit || 0) + (MortAppDetail.CapitalRaising || 0);
            MortAppDetail.TermMonths = MortAppDetail.TermYear * 12 + MortAppDetail.TermMonths * 1;
            MortAppDetail.eDepositSourceID = (MortAppDetail.eDepositSourceID) ? MortAppDetail.eDepositSourceID : '';
            //MortAppDetail.PurchasePrice = (MortAppDetail.PurchasePrice) ? MortAppDetail.PurchasePrice : '';
            //MortAppDetail.PropertyValue = (MortAppDetail.PropertyValue) ? MortAppDetail.PropertyValue : '';
            MortAppDetail.IsLTB = (MortAppDetail.IsLTB) ? MortAppDetail.IsLTB : '';
            MortAppDetail.ISFTL = (MortAppDetail.ISFTL) ? MortAppDetail.ISFTL : '';
            //MortAppDetail.RTBPurchasePriceAfterDiscount = (MortAppDetail.RTBPurchasePriceAfterDiscount) ? MortAppDetail.RTBPurchasePriceAfterDiscount : '';
            // MortAppDetail.CapitalRaising = (MortAppDetail.CapitalRaising) ? MortAppDetail.CapitalRaising : '';
            //MortAppDetail.Deposit = (MortAppDetail.Deposit) ? MortAppDetail.Deposit : '';
            //MortAppDetail.MortAmtRequired = (MortAppDetail.MortAmtRequired) ? MortAppDetail.MortAmtRequired : 0;
            MortAppDetail.PropertyPurchaseDate = (MortAppDetail.PropertyPurchaseDate) ? moment(moment(MortAppDetail.PropertyPurchaseDate,
                'DD-MM-YYYY')).format('MM/DD/YYYY') : '';
            MortAppDetail.eBTLMortgagePaymentCoveredID = (MortAppDetail.eBTLMortgagePaymentCoveredID) ? MortAppDetail.eBTLMortgagePaymentCoveredID :
                '';
            //MortAppDetail.BTLAnticipatedMonthlyIncome = (MortAppDetail.BTLAnticipatedMonthlyIncome) ? MortAppDetail.BTLAnticipatedMonthlyIncome : '';
            // MortAppDetail.Contingency = (MortAppDetail.Contingency) ? MortAppDetail.Contingency : '';
            //MortAppDetail.InterestOnlyAmount = (MortAppDetail.InterestOnlyAmount) ? MortAppDetail.InterestOnlyAmount : '';
            //MortAppDetail.RepaymentAmount = (MortAppDetail.RepaymentAmount) ? MortAppDetail.RepaymentAmount : '';
            Mortgages.MortgageID = Mortgages.MortgageID ? Mortgages.MortgageID : '';
            Mortgages.FFID = $scope.customer.clientDetails.FFID;
            Mortgages.Appid = $scope.customer.clientDetails.AppID;
            Mortgages.eMortgagePaymentMethodID = (Mortgages.eMortgagePaymentMethodID) ? Mortgages.eMortgagePaymentMethodID : '';
            Mortgages.eLenderID = (Mortgages.eLenderID) ? Mortgages.eLenderID : '';
            Mortgages.eMortgageTypeID = MortAppDetail.eMortgageTypeID ? MortAppDetail.eMortgageTypeID : '';
            Mortgages.PropertyPurchaseDate = (MortAppDetail.PropertyPurchaseDate) ? moment(moment(MortAppDetail.PropertyPurchaseDate,
                'DD-MM-YYYY')).format('MM/DD/YYYY') : '';
            //Mortgages.OriginalBalance = (Mortgages.OriginalBalance) ? Mortgages.OriginalBalance : '';
            //Mortgages.RemainingBalance = (Mortgages.RemainingBalance) ? Mortgages.RemainingBalance : '';
            Mortgages.RemainingTerm = Mortgages.RemainingTermYear * 12 + Mortgages.RemainingTermMonths * 1;
            //Mortgages.MonthlyPayments = (Mortgages.MonthlyPayments) ? Mortgages.MonthlyPayments : '';
            Mortgages.ERCPaymentMode = (Mortgages.ERCPaymentMode) ? Mortgages.ERCPaymentMode : '';
            Mortgages.ERCExpiryDate = (Mortgages.ERCExpiryDate) ? moment(moment(Mortgages.ERCExpiryDate, 'DD-MM-YYYY')).format(
                'MM/DD/YYYY') : '';
            //Mortgages.ERC = (Mortgages.ERC) ? Mortgages.ERC : '';
            Mortgages.ToBeRepaid = 'true';
            if(Mortgages.ERCPaymentMode === '1') {
                MortAppDetail.LoanRequired = $scope.getLoanRequired(Mortgages.RemainingBalance, Mortgages.ERC)
                MortAppDetail.LTV = $scope.getLTV(Mortgages.RemainingBalance, Mortgages.ERC, MortAppDetail.PropertyValue);
            }
            if(Mortgages.ERCPaymentMode === '2') {
                MortAppDetail.LoanRequired = Mortgages.RemainingBalance;
                MortAppDetail.LTV = (Mortgages.RemainingBalance / MortAppDetail.PropertyValue) * 100;
            }
            if(Mortgages.ERCPaymentMode === '3') {
                MortAppDetail.LoanRequired = Mortgages.RemainingBalance;
                MortAppDetail.LTV = (Mortgages.RemainingBalance / MortAppDetail.PropertyValue) * 100;
            }
            Mortgages.LoanRequired = (MortAppDetail.LoanRequired) ? MortAppDetail.LoanRequired : '';
            MortAppDetail.MortAmtRequired = Mortgages.LoanRequired;
            Mortgages.LTV = (MortAppDetail.LTV) ? MortAppDetail.LTV : '';
            mortgageService.SaveCurrentMortgages(Mortgages).then(function (response) {
                mortgageService.SaveMortAppDetail(MortAppDetail).then(function (response) {
                    $scope.customer.ExtraCommonLenderQn.FFID = $scope.customer.clientDetails.FFID;
                    extraLenderService.saveDetail($scope.customer.ExtraCommonLenderQn).then(function (response) {

                    });
                    getMortgageDetails();
                    if($scope.customer.activeMortgageTab === 'existingMortgage') {
                        if($scope.customer.MortAppDetail.eMortgageTypeID === 11 || $scope.customer.MortAppDetail.eMortgageTypeID ===
                            10) {
                            $scope.customer.activeMortgageTab = 'SecuredLoansMortgage';
                        } else {
                            $scope.customer.activeMortgageTab = 'newMortgage';
                        }
                    } else if($scope.customer.activeMortgageTab === 'newMortgage' && $scope.customer.ExtraCommonLenderQn.IsBridging) {
                        $scope.customer.activeMortgageTab = 'bridging';
                    }
                });
            });
        };
        $scope.saveNewMortgage = function (details) {
            var MortAppDetail = angular.copy(details.MortAppDetail);
            var Mortgages = angular.copy(details.Mortgages);
            if(MortAppDetail.TermYear * 12 + MortAppDetail.TermMonths * 1 < 24) {
                toaster.pop({ type: 'error', title: "Term of New Mortgage Must be more than 2 year" });
                return;
            }

            MortAppDetail.MortAppID = MortAppDetail.MortAppID ? MortAppDetail.MortAppID : '';
            MortAppDetail.FFID = $scope.customer.clientDetails.FFID;
            MortAppDetail.Appid = $scope.customer.clientDetails.AppID;
            //MortAppDetail.MortAmtRequired = MortAppDetail.PropertyValue - (MortAppDetail.Deposit || 0) + (MortAppDetail.CapitalRaising || 0);
            MortAppDetail.TermMonths = MortAppDetail.TermYear * 12 + MortAppDetail.TermMonths * 1;
            MortAppDetail.eDepositSourceID = (MortAppDetail.eDepositSourceID) ? MortAppDetail.eDepositSourceID : '';
            //MortAppDetail.PurchasePrice = (MortAppDetail.PurchasePrice) ? MortAppDetail.PurchasePrice : '';
            //MortAppDetail.PropertyValue = (MortAppDetail.PropertyValue) ? MortAppDetail.PropertyValue : '';
            MortAppDetail.IsLTB = (MortAppDetail.IsLTB) ? MortAppDetail.IsLTB : '';
            MortAppDetail.ISFTL = (MortAppDetail.ISFTL) ? MortAppDetail.ISFTL : '';
            //MortAppDetail.RTBPurchasePriceAfterDiscount = (MortAppDetail.RTBPurchasePriceAfterDiscount) ? MortAppDetail.RTBPurchasePriceAfterDiscount : '';
            // MortAppDetail.CapitalRaising = (MortAppDetail.CapitalRaising) ? MortAppDetail.CapitalRaising : '';
            //MortAppDetail.Deposit = (MortAppDetail.Deposit) ? MortAppDetail.Deposit : '';
            //MortAppDetail.MortAmtRequired = (MortAppDetail.MortAmtRequired) ? MortAppDetail.MortAmtRequired : 0;
            MortAppDetail.PropertyPurchaseDate = (MortAppDetail.PropertyPurchaseDate) ? MortAppDetail.PropertyPurchaseDate : '';
            MortAppDetail.eBTLMortgagePaymentCoveredID = (MortAppDetail.eBTLMortgagePaymentCoveredID) ? MortAppDetail.eBTLMortgagePaymentCoveredID :
                '';
            //MortAppDetail.BTLAnticipatedMonthlyIncome = (MortAppDetail.BTLAnticipatedMonthlyIncome) ? MortAppDetail.BTLAnticipatedMonthlyIncome : '';
            // MortAppDetail.Contingency = (MortAppDetail.Contingency) ? MortAppDetail.Contingency : '';
            //MortAppDetail.InterestOnlyAmount = (MortAppDetail.InterestOnlyAmount) ? MortAppDetail.InterestOnlyAmount : '';
            //MortAppDetail.RepaymentAmount = (MortAppDetail.RepaymentAmount) ? MortAppDetail.RepaymentAmount : '';
            Mortgages.MortgageID = Mortgages.MortgageID ? Mortgages.MortgageID : '';
            Mortgages.FFID = $scope.customer.clientDetails.FFID;
            Mortgages.Appid = $scope.customer.clientDetails.AppID;
            Mortgages.eMortgagePaymentMethodID = (Mortgages.eMortgagePaymentMethodID) ? Mortgages.eMortgagePaymentMethodID : '';
            Mortgages.eLenderID = (Mortgages.eLenderID) ? Mortgages.eLenderID : '';
            Mortgages.eMortgageTypeID = MortAppDetail.eMortgageTypeID ? MortAppDetail.eMortgageTypeID : '';
            Mortgages.PropertyPurchaseDate = (MortAppDetail.PropertyPurchaseDate) ? MortAppDetail.PropertyPurchaseDate : '';
            //Mortgages.OriginalBalance = (Mortgages.OriginalBalance) ? Mortgages.OriginalBalance : '';
            //Mortgages.RemainingBalance = (Mortgages.RemainingBalance) ? Mortgages.RemainingBalance : '';
            //Mortgages.MonthlyPayments = (Mortgages.MonthlyPayments) ? Mortgages.MonthlyPayments : '';
            Mortgages.ERCPaymentMode = (Mortgages.ERCPaymentMode) ? Mortgages.ERCPaymentMode : '';
            Mortgages.ERCExpiryDate = (Mortgages.ERCExpiryDate) ? moment(moment(Mortgages.ERCExpiryDate, 'DD-MM-YYYY')).format(
                'MM/DD/YYYY') : '';
            //Mortgages.ERC = (Mortgages.ERC) ? Mortgages.ERC : '';
            Mortgages.ToBeRepaid = 'true';
            Mortgages.RemainingTerm = Mortgages.RemainingTermYear * 12 + Mortgages.RemainingTermMonths * 1;
            //            if (MortAppDetail.eMortgageTypeID < 10) {
            //                MortAppDetail.LoanRequired = MortAppDetail.RepaymentAmount * 1 + Mortgages.RemainingBalance * 1 + MortAppDetail.CapitalRaising * 1 + MortAppDetail.Contingency * 1 + Mortgages.ERC * (Mortgages.ERCPaymentMode === "1");
            //            } else {
            //                MortAppDetail.LoanRequired = (MortAppDetail.RepaymentAmount * 1 + MortAppDetail.CapitalRaising * 1 + MortAppDetail.Contingency) * (MortAppDetail.RepaymentAmount > 0) * (MortAppDetail.CapitalRaising > 0) * (MortAppDetail.Contingency > 0);
            //            }

            if($scope.customer.MortAppDetail.eMortgageTypeID !== 11 && $scope.customer.MortAppDetail.eMortgageTypeID !== 10) {
                if(Mortgages.ERCPaymentMode === 1) {
                    MortAppDetail.LoanRequired = $scope.getTotalLoanRequiredForNewMortgage();
                    MortAppDetail.LTV = $scope.getLTVForNewMortgage();
                } else {
                    MortAppDetail.LoanRequired = $scope.getTotalLoanRequiredForNotWillingToPay();
                    MortAppDetail.LTV = $scope.getLTVForNotWillingToPay();
                }
            } else {
                MortAppDetail.LoanRequired = $scope.getTotalLoanRequiredForSecuredLoan();
                MortAppDetail.LTV = $scope.getLTVForSecuredLoan();
            }

            // MortAppDetail.LTV = (MortAppDetail.LoanRequired / MortAppDetail.PropertyValue) * 100;
            // Mortgages.LoanRequired = (MortAppDetail.LoanRequired) ? MortAppDetail.LoanRequired : '';
            MortAppDetail.MortAmtRequired = MortAppDetail.LoanRequired;
            // Mortgages.LTV = (MortAppDetail.LTV) ? MortAppDetail.LTV : '';

            mortgageService.SaveCurrentMortgages(Mortgages).then(function (response) {
                mortgageService.SaveMortAppDetail(MortAppDetail).then(function (response) {
                    $scope.customer.ExtraCommonLenderQn.FFID = $scope.customer.clientDetails.FFID;
                    extraLenderService.saveDetail($scope.customer.ExtraCommonLenderQn).then(function (response) {

                    });
                    getMortgageDetails();
                    if($scope.customer.ExtraCommonLenderQn.IsBridging) {
                        $scope.customer.activeMortgageTab = 'bridging';
                    } else {
                        $rootScope.changeTab({
                            state: 'app.property',
                            title: 'Property Details',
                            id: 'property'
                        });
                    }
                });
            });
        };
        $scope.getLoanRequired = function (RemainingBalance, ERC) {
            if(RemainingBalance && ERC)
                return parseFloat(RemainingBalance) + parseFloat(ERC);
            else if(!RemainingBalance) {
                return parseFloat(ERC);
            }
        };
        $scope.getLTV = function (RemainingBalance, ERC, PropertyValue) {
            if(RemainingBalance && ERC && PropertyValue) {
                var totalAmount = parseInt(RemainingBalance) + parseInt(ERC);
                return(parseFloat(totalAmount / parseFloat(PropertyValue)) * 100).toFixed(2);
            } else if(!RemainingBalance) {
                return(parseFloat(parseInt(ERC) / parseFloat(PropertyValue)) * 100).toFixed(2);
            }
        };
        $scope.getTotalLoanRequiredForNewMortgage = function () {
            if($scope.customer.MortAppDetail && $scope.customer.Mortgages) {
                var RemainingBalance = $scope.customer.Mortgages.RemainingBalance;
                var Contingency = $scope.customer.MortAppDetail.Contingency;
                var totalConsolidatedLiabilities = $scope.customer.MortAppDetail.totalConsolidatedLiabilities;
                var CapitalRaising = $scope.customer.MortAppDetail.CapitalRaising;
                var ERC = $scope.customer.Mortgages.ERC;
                if(ERC && RemainingBalance && Contingency && totalConsolidatedLiabilities && CapitalRaising) {
                    return parseFloat(ERC) + parseFloat(RemainingBalance) + parseFloat(Contingency) + parseFloat(
                        totalConsolidatedLiabilities) + parseFloat(CapitalRaising);
                } else {
                    RemainingBalance = (RemainingBalance) ? RemainingBalance : 0;
                    Contingency = (Contingency) ? Contingency : 0;
                    totalConsolidatedLiabilities = (totalConsolidatedLiabilities) ? totalConsolidatedLiabilities : $scope.tcv;
                    CapitalRaising = (CapitalRaising) ? CapitalRaising : 0;
                    ERC = (ERC) ? ERC : 0;
                    return parseFloat(ERC) + parseFloat(RemainingBalance) + parseFloat(Contingency) + parseFloat(
                        totalConsolidatedLiabilities) + parseFloat(CapitalRaising);
                }
            } else {
                return 0;
            }
        };
        $scope.getLTVForNewMortgage = function () {
            if($scope.customer.MortAppDetail && $scope.customer.Mortgages) {
                var RemainingBalance = $scope.customer.Mortgages.RemainingBalance;
                var Contingency = $scope.customer.MortAppDetail.Contingency;
                var totalConsolidatedLiabilities = $scope.customer.MortAppDetail.totalConsolidatedLiabilities;
                var CapitalRaising = $scope.customer.MortAppDetail.CapitalRaising;
                var ERC = $scope.customer.Mortgages.ERC;
                var PropertyValue = $scope.customer.MortAppDetail.PropertyValue;
                if(ERC && PropertyValue && RemainingBalance && Contingency && totalConsolidatedLiabilities && CapitalRaising) {
                    var totalAmount = parseFloat(ERC) + parseFloat(RemainingBalance) + parseFloat(Contingency) + parseFloat(
                        totalConsolidatedLiabilities) + parseFloat(CapitalRaising);
                    var LTV = (parseFloat(totalAmount / parseFloat(PropertyValue)) * 100).toFixed(2);
                    if(LTV > 100 || LTV < 0) {
                        $scope.displayLTVErrorMsgOnNewMortgage = true;
                    } else {
                        $scope.displayLTVErrorMsgOnNewMortgage = false;
                    }
                    return LTV;
                } else {
                    RemainingBalance = (RemainingBalance) ? RemainingBalance : 0;
                    Contingency = (Contingency) ? Contingency : 0;
                    totalConsolidatedLiabilities = (totalConsolidatedLiabilities) ? totalConsolidatedLiabilities : $scope.tcv;
                    CapitalRaising = (CapitalRaising) ? CapitalRaising : 0;
                    ERC = (ERC) ? ERC : 0;
                    var totalAmount = parseFloat(ERC) + parseFloat(RemainingBalance) + parseFloat(Contingency) + parseFloat(
                        totalConsolidatedLiabilities) + parseFloat(CapitalRaising);
                    var LTV = (parseFloat(totalAmount / parseFloat(PropertyValue)) * 100).toFixed(2);
                    if(LTV > 100 || LTV < 0) {
                        $scope.displayLTVErrorMsgOnNewMortgage = true;
                    } else {
                        $scope.displayLTVErrorMsgOnNewMortgage = false;
                    }
                    return LTV;
                }
            } else {
                return 0;
            }
        };
        $scope.getTotalLoanRequiredForNotWillingToPay = function () {
            if($scope.customer.MortAppDetail && $scope.customer.Mortgages) {
                var RemainingBalance = $scope.customer.Mortgages.RemainingBalance;
                var Contingency = $scope.customer.MortAppDetail.Contingency;
                var totalConsolidatedLiabilities = $scope.customer.MortAppDetail.totalConsolidatedLiabilities;
                var CapitalRaising = $scope.customer.MortAppDetail.CapitalRaising;
                if(RemainingBalance && Contingency && totalConsolidatedLiabilities && CapitalRaising) {
                    return parseFloat(RemainingBalance) + parseFloat(Contingency) + parseFloat(totalConsolidatedLiabilities) + parseFloat(
                        CapitalRaising);
                } else {
                    RemainingBalance = (RemainingBalance) ? RemainingBalance : 0;
                    Contingency = (Contingency) ? Contingency : 0;
                    totalConsolidatedLiabilities = (totalConsolidatedLiabilities) ? totalConsolidatedLiabilities : $scope.tcv;
                    CapitalRaising = (CapitalRaising) ? CapitalRaising : 0;
                    return parseFloat(RemainingBalance) + parseFloat(Contingency) + parseFloat(totalConsolidatedLiabilities) + parseFloat(
                        CapitalRaising);
                }
            } else {
                return 0;
            }
        };
        $scope.getLTVForNotWillingToPay = function () {
            if($scope.customer.MortAppDetail && $scope.customer.Mortgages) {
                var RemainingBalance = $scope.customer.Mortgages.RemainingBalance;
                var Contingency = $scope.customer.MortAppDetail.Contingency;
                var totalConsolidatedLiabilities = $scope.customer.MortAppDetail.totalConsolidatedLiabilities;
                var CapitalRaising = $scope.customer.MortAppDetail.CapitalRaising;
                var PropertyValue = $scope.customer.MortAppDetail.PropertyValue;
                if(PropertyValue && RemainingBalance && Contingency && totalConsolidatedLiabilities && CapitalRaising) {
                    var totalAmount = parseFloat(RemainingBalance) + parseFloat(Contingency) + parseFloat(totalConsolidatedLiabilities) +
                        parseFloat(CapitalRaising);
                    var LTV = (parseFloat(totalAmount / parseFloat(PropertyValue)) * 100).toFixed(2);
                    if(LTV > 100 || LTV < 0) {
                        $scope.displayLTVErrorMsgOnNewMortgage = true;
                    } else {
                        $scope.displayLTVErrorMsgOnNewMortgage = false;
                    }
                    return LTV;
                } else {
                    RemainingBalance = (RemainingBalance) ? RemainingBalance : 0;
                    Contingency = (Contingency) ? Contingency : 0;
                    totalConsolidatedLiabilities = (totalConsolidatedLiabilities) ? totalConsolidatedLiabilities : $scope.tcv;
                    CapitalRaising = (CapitalRaising) ? CapitalRaising : 0;
                    var totalAmount = parseFloat(RemainingBalance) + parseFloat(Contingency) + parseFloat(totalConsolidatedLiabilities) +
                        parseFloat(CapitalRaising);
                    var LTV = (parseFloat(totalAmount / parseFloat(PropertyValue)) * 100).toFixed(2);
                    if(LTV > 100 || LTV < 0) {
                        $scope.displayLTVErrorMsgOnNewMortgage = true;
                    } else {
                        $scope.displayLTVErrorMsgOnNewMortgage = false;
                    }
                    return LTV;
                }
            } else {
                return 0;
            }
        };
        $scope.getTotalLoanRequiredForSecuredLoan = function () {
            if($scope.customer.MortAppDetail) {
                var Contingency = $scope.customer.MortAppDetail.Contingency;
                var totalConsolidatedLiabilities = $scope.customer.MortAppDetail.totalConsolidatedLiabilities;
                var CapitalRaising = $scope.customer.MortAppDetail.CapitalRaising;
                if(Contingency && totalConsolidatedLiabilities && CapitalRaising) {
                    return parseFloat(Contingency) + parseFloat(totalConsolidatedLiabilities) + parseFloat(CapitalRaising);
                } else {
                    Contingency = (Contingency) ? Contingency : 0;
                    totalConsolidatedLiabilities = (totalConsolidatedLiabilities) ? totalConsolidatedLiabilities : $scope.tcv;
                    CapitalRaising = (CapitalRaising) ? CapitalRaising : 0;
                    return parseFloat(Contingency) + parseFloat(totalConsolidatedLiabilities) + parseFloat(CapitalRaising);
                }
            } else {
                return 0;
            }
        };
        $scope.getLTVForSecuredLoan = function () {
            if($scope.customer.MortAppDetail) {
                var Contingency = $scope.customer.MortAppDetail.Contingency;
                var totalConsolidatedLiabilities = $scope.customer.MortAppDetail.totalConsolidatedLiabilities;
                var CapitalRaising = $scope.customer.MortAppDetail.CapitalRaising;
                var PropertyValue = $scope.customer.MortAppDetail.PropertyValue;
                if(PropertyValue && Contingency && totalConsolidatedLiabilities && CapitalRaising) {
                    var totalAmount = parseFloat(Contingency) + parseFloat(totalConsolidatedLiabilities) + parseFloat(CapitalRaising);
                    var LTV = (parseFloat(totalAmount / parseFloat(PropertyValue)) * 100).toFixed(2);
                    if(LTV > 100 || LTV < 0) {
                        $scope.displayLTVErrorMsgOnNewMortgage = true;
                    } else {
                        $scope.displayLTVErrorMsgOnNewMortgage = false;
                    }
                    return LTV;
                } else {
                    Contingency = (Contingency) ? Contingency : 0;
                    totalConsolidatedLiabilities = (totalConsolidatedLiabilities) ? totalConsolidatedLiabilities : $scope.tcv;
                    CapitalRaising = (CapitalRaising) ? CapitalRaising : 0;
                    var totalAmount = parseFloat(Contingency) + parseFloat(totalConsolidatedLiabilities) + parseFloat(CapitalRaising);
                    var LTV = (parseFloat(totalAmount / parseFloat(PropertyValue)) * 100).toFixed(2);
                    if(LTV > 100 || LTV < 0) {
                        $scope.displayLTVErrorMsgOnNewMortgage = true;
                    } else {
                        $scope.displayLTVErrorMsgOnNewMortgage = false;
                    }
                    return LTV;
                }
            } else {
                return 0;
            }
        };

        $scope.isLTVmoreforPurchaseSharedOwnership = function () {
            if($scope.customer.MortAppDetail.PropertyValue && $scope.customer.MortAppDetail.PropertyValue != '' && $scope.customer.MortAppDetail
                .eMortgageTypeID === 5) {
                var Deposit = ($scope.customer.MortAppDetail.Deposit) ? parseFloat($scope.customer.MortAppDetail.Deposit) : 0;
                var CapitalRaising = ($scope.customer.MortAppDetail.CapitalRaising) ? parseFloat($scope.customer.MortAppDetail.CapitalRaising) :
                    0;
                var PropertyValue = ($scope.customer.MortAppDetail.PropertyValue) ? parseFloat($scope.customer.MortAppDetail.PropertyValue) :
                    0;
                var pctBought = ($scope.customer.MortAppDetail.ShOwnPcntPurchasing) ? parseFloat($scope.customer.MortAppDetail.ShOwnPcntPurchasing) :
                    0;

                var loanRequired;
                if(pctBought) {
                    loanRequired = (((PropertyValue * pctBought / 100) - Deposit) + CapitalRaising).toFixed(2);
                } else {
                    loanRequired = ((PropertyValue - Deposit) + CapitalRaising).toFixed(2);
                }
                var ltvforPurchaseSharedOwnership = (loanRequired / PropertyValue);
                var ltvPct = (ltvforPurchaseSharedOwnership * 100).toFixed(2);
                if(ltvPct > 100 || ltvPct < 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };
        $scope.calculateLTVforPurchaseSharedOwnership = function () {
            if($scope.customer.MortAppDetail.PropertyValue && $scope.customer.MortAppDetail.PropertyValue != '') {
                var Deposit = ($scope.customer.MortAppDetail.Deposit) ? parseFloat($scope.customer.MortAppDetail.Deposit) : 0;
                var CapitalRaising = ($scope.customer.MortAppDetail.CapitalRaising) ? parseFloat($scope.customer.MortAppDetail.CapitalRaising) :
                    0;
                var PropertyValue = ($scope.customer.MortAppDetail.PropertyValue) ? parseFloat($scope.customer.MortAppDetail.PropertyValue) :
                    0;
                var pctBought = ($scope.customer.MortAppDetail.ShOwnPcntPurchasing) ? parseFloat($scope.customer.MortAppDetail.ShOwnPcntPurchasing) :
                    0;
                var loanRequired;
                if(pctBought) {
                    loanRequired = (((PropertyValue * pctBought / 100) - Deposit) + CapitalRaising).toFixed(2);
                } else {
                    loanRequired = ((PropertyValue - Deposit) + CapitalRaising).toFixed(2);
                }

                //var loanRequiredforPurchaseSharedOwnership = ((PropertyValue - Deposit) + CapitalRaising).toFixed(2);
                var ltvforPurchaseSharedOwnership = (loanRequired / PropertyValue);
                return(ltvforPurchaseSharedOwnership * 100).toFixed(2);
            } else {
                return "";
            }
        };
        $scope.calculateLaonRequiredforPurchaseSharedOwnership = function () {
            if($scope.customer.MortAppDetail.PropertyValue && $scope.customer.MortAppDetail.PropertyValue != '') {
                var Deposit = ($scope.customer.MortAppDetail.Deposit) ? parseFloat($scope.customer.MortAppDetail.Deposit) : 0;
                var CapitalRaising = ($scope.customer.MortAppDetail.CapitalRaising) ? parseFloat($scope.customer.MortAppDetail.CapitalRaising) :
                    0;
                var PropertyValue = ($scope.customer.MortAppDetail.PropertyValue) ? parseFloat($scope.customer.MortAppDetail.PropertyValue) :
                    0;
                var pctBought = ($scope.customer.MortAppDetail.ShOwnPcntPurchasing) ? parseFloat($scope.customer.MortAppDetail.ShOwnPcntPurchasing) :
                    0;
                if(pctBought) {
                    var loanRequired = (((PropertyValue * pctBought / 100) - Deposit) + CapitalRaising).toFixed(2);
                    return loanRequired;
                } else {
                    var loanRequired2 = ((PropertyValue - Deposit) + CapitalRaising).toFixed(2);
                    return loanRequired2;
                }


            } else {
                return "";
            }
        };

        $scope.isLTVmoreforPurchaseRTB = function () {
            if($scope.customer.MortAppDetail.PropertyValue && $scope.customer.MortAppDetail.PropertyValue != '' && $scope.customer.MortAppDetail
                .RTBPurchasePriceAfterDiscount && $scope.customer.MortAppDetail.RTBPurchasePriceAfterDiscount != '' && $scope.customer.MortAppDetail
                .eMortgageTypeID === 4) {
                var loanRequiredforPurchaseSharedOwnership = ($scope.customer.MortAppDetail.RTBPurchasePriceAfterDiscount - $scope.customer
                    .MortAppDetail.Deposit + $scope.customer.MortAppDetail.CapitalRaising).toFixed(2);
                var ltvforPurchaseSharedOwnership = ((loanRequiredforPurchaseSharedOwnership / $scope.customer.MortAppDetail.PropertyValue) *
                    100).toFixed(2);
                if(ltvforPurchaseSharedOwnership > 100 || ltvforPurchaseSharedOwnership < 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };
        $scope.calculateLTVforPurchaseRTB = function () {
            if($scope.customer.MortAppDetail.PropertyValue && $scope.customer.MortAppDetail.PropertyValue != '' && $scope.customer.MortAppDetail
                .RTBPurchasePriceAfterDiscount && $scope.customer.MortAppDetail.RTBPurchasePriceAfterDiscount != '') {
                var loanRequiredforPurchaseSharedOwnership = ($scope.customer.MortAppDetail.RTBPurchasePriceAfterDiscount - $scope.customer
                    .MortAppDetail.Deposit + $scope.customer.MortAppDetail.CapitalRaising).toFixed(2);
                var ltvforPurchaseSharedOwnership = (loanRequiredforPurchaseSharedOwnership / $scope.customer.MortAppDetail.PropertyValue);
                return(ltvforPurchaseSharedOwnership * 100).toFixed(2);
            } else {
                return "";
            }
        };
        $scope.calculateLaonRequiredforPurchaseRTB = function () {
            if($scope.customer.MortAppDetail.RTBPurchasePriceAfterDiscount && $scope.customer.MortAppDetail.RTBPurchasePriceAfterDiscount !=
                '') {
                return($scope.customer.MortAppDetail.RTBPurchasePriceAfterDiscount - $scope.customer.MortAppDetail.Deposit + $scope.customer
                    .MortAppDetail.CapitalRaising).toFixed(2);
            } else {
                return "";
            }
        };
        $scope.backButtonAction = function () {
            $rootScope.changeTab({
                state: 'app.applicant',
                title: 'Applicants',
                id: 'applicant'
            });
        };
        $scope.backButtonActionForTabs = function (action) {
            if(action === 'bridging') {
                if($scope.customer.MortAppDetail.applicationType === 'Purchase') {
                    $scope.setMorgageTab('purchaseDetails');
                } else if($scope.customer.MortAppDetail.applicationType === 'Remortgage') {
                    if($scope.customer.MortAppDetail.eMortgageTypeID !== 11 && $scope.customer.MortAppDetail.eMortgageTypeID !== 10) {
                        $scope.setMorgageTab('newMortgage');
                    } else if($scope.customer.MortAppDetail.eMortgageTypeID === 11 || $scope.customer.MortAppDetail.eMortgageTypeID ===
                        10) {
                        $scope.setMorgageTab('SecuredLoansMortgage');
                    }
                }
            } else if(action === 'newMortgage') {
                $scope.setMorgageTab('existingMortgage');
            }
        };
        initialize();
    }
]);

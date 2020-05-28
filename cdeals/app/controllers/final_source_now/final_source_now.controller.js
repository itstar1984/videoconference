'use strict';

factFindApp.controller('finaSourceNowCtrl', ['$scope', '$rootScope', 'memberService', 'sourceService', 'localStorageService', '$firebaseObject',
    '$firebaseArray',
    'firebaseService', 'toaster',
    function ($scope, $rootScope, memberService, sourceService, localStorageService, $firebaseObject, $firebaseArray, firebaseService,
        toaster) {

        $scope.setFieldTypingStatus = function (field, status) {
            var obj = {
                sourceNowForm: {
                    field: field,
                    status: status
                },
            };
            firebaseService.saveTypingStatus(obj);
        };
        $scope.checkPartnerTyping = function (field) {
            var flg = false;
            if($scope.typing.consultant && $scope.typing.consultant['sourceNowForm'] &&
                $scope.typing.consultant['sourceNowForm']['field'] == field &&
                $scope.typing.consultant['sourceNowForm']['status']) {
                flg = true;
            }
            return flg;
        };
        $scope.changeTextArea = function (key, field) {
            if(!angular.isDefined($scope.customer.finalShortListedProduct[key][field])) {
                $scope.customer.finalShortListedProduct[key][field] = null;
            }
        };
        $scope.getActiveSourceNowTab = function (tab) {
            return angular.equals($scope.customer.sourceNowTab, tab);
        };
        $scope.setSourceNowTab = function (tab) {
            $scope.customer.sourceNowTab = tab;
            if($scope.customer.sourceNowTab == "PassedProducts") {
                $rootScope.total = $scope.total_passed;
            }
            $scope.activeTabResult = tab;
        };
        $scope.checkList = function (product) {
            if($scope.shortListProduct.length && _.findWhere($scope.shortListProduct, { ProductID: product.ProductID })) {
                if(!product.isCheck) {
                    var productIndex = $scope.shortListProduct.indexOf(_.findWhere($scope.shortListProduct, { ProductID: product.ProductID }));
                    $scope.shortListProduct.splice(productIndex, 1);
                } else {
                    var productIndex = $scope.shortListProduct.indexOf(_.findWhere($scope.shortListProduct, { ProductID: product.ProductID }));
                    $scope.shortListProduct[productIndex] = product;
                }
            } else if($scope.shortListProduct.length > 4) {
                toaster.pop({
                    type: 'warning',
                    title: "Compare list Count Exceed!",
                    body: "User can select maximum 5 list to compare!"
                });
                product.isCheck = false;
            } else {
                if(product.isCheck) {
                    $scope.shortListProduct.push(product);
                }
            }
        };
        $scope.updateShortList = function () {
            $scope.finalShortListedProduct = angular.copy($scope.shortListProduct);
            var object = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + '/customer');
            object.child('finalShortListedProduct').set([]);
            object.child('selectShortList').set([]);
            object.child('finalShortListedProduct').set(_.sortBy($scope.finalShortListedProduct, 'ProductID'));
            object.child('sourceNowTab').set('ShortlistedProducts');
            toaster.pop({
                type: 'success',
                title: "List Updated Successfully"
            });
        };
        $scope.clearShortList = function () {
            $scope.finalShortListedProduct = [];
            $scope.customer.finalShortListedProduct = [];
            $scope.selectShortList = [];
            $scope.customer.selectShortList = [];
            $scope.shortListProduct = [];
            angular.forEach($scope.successList, function (item) {
                delete item.isCheck;
            });
            angular.forEach($scope.filtered, function (item) {
                delete item.isCheck;
            });
            toaster.pop({
                type: 'success',
                title: "List Cleared Successfully"
            });
        };
        $scope.selecttoShortList = function (product) {
            if(product.isSelected) {
                $scope.selectShortList.push(product);
            } else {
                var productIndex = $scope.selectShortList.indexOf(_.findWhere($scope.selectShortList, { ProductID: product.ProductID }));
                $scope.selectShortList.splice(productIndex, 1);
            }
            $scope.customer.selectShortList = angular.copy($scope.selectShortList);
        };
        $scope.disableTerm = function (value) {
            //            if ($scope.customer.sourcesuccessFilter && $scope.customer.sourcesuccessFilter.Term && !_.contains($scope.customer.sourcesuccessFilter.Term, value) && $scope.customer.sourcesuccessFilter.Term.length > 1) {
            //                return true;
            //            } else {
            return false;
            //            }
        };
        $scope.disableProductType = function (value) {
            //            if ($scope.customer.sourcesuccessFilter && $scope.customer.sourcesuccessFilter.ProductType && !_.contains($scope.customer.sourcesuccessFilter.ProductType, value) && $scope.customer.sourcesuccessFilter.ProductType.length > 1) {
            //                return true;
            //            } else {
            return false;
            //            }
        };
        $scope.disableFailedTerm = function (value) {
            //            if ($scope.customer.sourcefailedFilter && $scope.customer.sourcefailedFilter.Term && !_.contains($scope.customer.sourcefailedFilter.Term, value) && $scope.customer.sourcefailedFilter.Term.length > 1) {
            //                return true;
            //            } else {
            return false;
            //            }
        };
        $scope.disableFailedProductType = function (value) {
            //            if ($scope.customer.sourcefailedFilter && $scope.customer.sourcefailedFilter.ProductType && !_.contains($scope.customer.sourcefailedFilter.ProductType, value) && $scope.customer.sourcefailedFilter.ProductType.length > 1) {
            //                return true;
            //            } else {
            return false;
            //            }
        };
        $scope.moveback = function (reason) {
            switch(reason) {
            case "Min Age":
            case "Ex-Patriates":
            case "Must Be On Voters Roll":
            case "Ex-Patriates refer to lender":
            case "Ex-Patriates Not Accecpted":
                $rootScope.changeTab({
                    state: 'app.applicant',
                    title: 'Applicants',
                    id: 'applicant'
                });
                break;

            case "BTL Rental Income Only not accepted":
            case "BTL Rental Income + Salary not accepted":
            case "LTV for flat not Accepted":
            case "LTV For House Is Not Accepted":
            case "LTV Exceeded for Debt consolidation":
            case "Exceeded Maximum amount of Debt Consolidation":
            case "LTV Exceeded for Debt consolidation":
            case "Repayment Method":
            case "Shared Ownership not required":
            case "Right to buy not available":
            case "A lower LTV product is available":
            case "Above maximum Loan Size":
            case "Min loan":
            case "Let to Buy":
            case "FirstTimeLandlord":
            case "Rental Income":
            case "Capital Raising BTL":
            case "Remortgage Only":
            case "Purchase Only":
            case "Not available to FTB":
            case "Only available to FTB":
            case "Shared Ownership":
            case "BTLCapitalRaisingReason BTL":
            case "Right to buy max loan ":
            case "Max loan":
            case "Right to buy max LTV":
            case "Above maximum LTV":
            case "Max Valuation":
            case "Min Valuation":
            case "Vendor Deposits Not accepted":
            case "Above maximum term":
            case "Min Term":
            case "Above maximum age at end of term":
            case "Failed on Secured Loan":
            case "Below Min Equity Amount":
            case "House value is proprtyvalue":
            case "In Probation Period refer to lender":
            case "Failed on Help To Buy":
            case "Shared Ownership Refer to Lender":
            case "SO-Max LTV Property being bought":
            case "Rental Income below 125%":
            case "BTL StressTest Percentage":
            case "Exclusive Let to Buy Product":
            case "Min/Max loan Limit":
            case "BTL Limited Company":
            case "Rental Income below 130%":
            case "BTL Portfolio":
            case "RTB-Max LTV on Discounted Price":
            case "In Probation Period Not Accecpted":
            case "Percentage of Loan amount allowed for Debt consolidation":
            case "Let to Buy Not Accepted":
            case "Not Bridging Product failure":
            case "Let to buy not accepted":
            case "Min Term":
            case "Above maximum age at end of term":
            case "Bridging Product":
            case "Not a Non Regulated Bridging Product":
            case "Not a Regulated Bridging Product":
            case "Bridging Term Exceeded Max Term Allowed":
            case "Capital Raising BTL":
            case "Remortgage Only":
            case "Purchase Only":
            case "Not available to FTB":
            case "Only available to FTB":
            case "Professional Mortgage":
            case "Vendor Deposits Not Accecpted":
            case "Rental Income":
            case "Available if drop LTV to 70%":
            case "Available if drop LTV to 50%":
            case "Not a Bridging Product":
                $rootScope.changeTab({
                    state: 'app.yourmortgagerequirement',
                    title: 'Your mortgage requirement',
                    id: 'yourmortgagerequirement'
                });
                break;
            case "NonExcouncil House Not Accepted":
            case "NonExcouncil House refer to lender":
            case "Ex-Council Not accepted":
            case "Minimum Outset Lease":
            case "Minimum Excess Lease":
            case "Agricultural Tie":
            case "Agricultural Tie Not Accecpted":
            case "Agricultural Tie refer to lender":
            case "Construction Type":
            case "Self Build":
            case "Self Build Not Accecpted":
            case "Number Of Kitchens":
            case "Number Of Bedrooms":
            case "Family Let BTL":
            case "Student Let BTL":
            case "Less 10 Years Old And No NHBC":
            case "Multiple Occupancy":
            case "Above Commercial":
            case "Semi Commercial":
            case "Steel Frame Not Accecpted":
            case "Freehold Flat refer to lender":
            case "NonExcouncil House Max LTV 100%":
            case "Steel Frame refer to lender":
            case "Flat Having Balcony Access":
            case "Property Residence":
            case "Region":
            case "Studio Flat":
            case "Flat Purpose Built":
            case "Flat Converted":
            case "Property Type House Is Not Accepted":
            case "Property Age Is Not Accepted":
            case "Flat Having Balcony Access":
            case "Thatched Not Accecpted":
            case "Thatched refer to lender":
            case "NonExcouncil Maisonette Not Accepted":
            case "NonExcouncil Maisonette Not Accepted":
            case "Less 10 Years Old And No NHBC Not Accecpted":
            case "Exceeds max floors in block":
            case "Exceeds max floors in block for Excouncil flat/purpose built with lift":
            case "Exceeds max floors in block for Excouncil flat/purpose built without Lift":
            case "Exceeds max floors in block for Excouncil flat/converted with lift":
            case "Exceeds max floors in block for Excouncil flat/converted without Lift":
            case "Exceeds max floors in block for flat/purpose built with lift":
            case "Exceeds max floors in block for flat/purpose built without Lift":
            case "Exceeds max floors in block for flat/converted with lift":
            case "Exceeds max floors in block for flat/converted without Lift":
            case "Freehold Flat":
            case "Flying Freehold":
            case "Multiple Occupancy Not Accecpted":
            case "Above Commercial Not Accecpted":
            case "ExcouncilStudioFlat Not Accepted":
            case "NonExcouncilStudioFlat Not Accepted":
            case "NonExcouncil House refer to lender":
            case "ExcouncilFlatPurposeBuilt Not Accepted":
            case "ExcouncilFlatPurposeBuilt refer to lender":
            case "ExcouncilFlatConverted refer to lender":
            case "ExcouncilFlatConverted Not Accepted":
            case "ExcouncilStudioFlat Max LTV 60%":
            case "Laing Easi Form Not Accecpted":
            case "Laing Easi Form refer to lender":
            case "ExcouncilStudioFlat refer to lender":
            case "PRC Repair With Certificate Not Accecpted":
            case "PRC Repair With Certificate refer to lender":
            case "Timber Framed Not Accecpted":
            case "Wimpey No Fines Not Accecpted":
            case "Wimpey No Fines refer to lender":
            case "NonExcouncilFlatConverted refer to lender":
            case "NonExcouncilStudioFlat refer to lender":
            case "NonExcouncilFlatPurposeBuilt refer to lender":
            case "NonExcouncilFlatPurposeBuilt Not Accepted":
            case "NonExcouncilStudioFlat Max LTV 60%":
                $rootScope.changeTab({
                    state: 'app.property',
                    title: 'Property Details',
                    id: 'property'
                });
                break;

            case "BTL StressTest Percentage":
            case "Income not enough to meet loan":
            case "Self-Employed years accounts":
            case "Employment Status":
            case "Self-cert not required":
            case "In Probation Period Not accepted":
            case "Employed Minimum months":
            case "Employed Minimum Continuous months":
            case "Self Employed Minimum months":
            case "Self Employed Minimum Continuous months":
            case "Min Employment Months":
            case "Self Cert not available":
            case "Minimum Income":

                $rootScope.changeTab({
                    state: 'app.employmentandincome',
                    title: 'Employment and Income',
                    id: 'employmentandincome'
                });
                break;
            case "BTL max number of properties":
            case "BTL max number of properties Specific to Lender":
            case "BTL Value Exceeds 10 times of Clients Income -Skipton specific":
                $rootScope.changeTab({
                    state: 'app.otherexisitingmortgages',
                    title: 'Other Existing Mortgages',
                    id: 'otherexisitingmortgages'
                });
                break;
            case "Pay day loan not repaid":
            case "Income Payment Agreement":
                $rootScope.changeTab({
                    state: 'app.liabilities',
                    title: 'Liabilities',
                    id: 'liability'
                });
                break;

            case "Adverse - Arrears":
            case "Adverse - CCJ":
            case "Adverse - Defaults":
            case "Adverse - Bankcrupt":
            case "Adverse - Repossesstion":
            case "Adverse - IVA":
            case "Previous Adverse credit not acceptable":
            case "A better adverse product exists for this lender":
            case "Adverse - Not allowed both CCJ and Arrears":
                $rootScope.changeTab({
                    state: 'app.credithistroy',
                    title: 'Credit Histroy',
                    id: 'credithistroy'
                });
                break;
            default:
                return false;
            }
        };
        var initialize = function () {
            $scope.currentPage = 1;
            $scope.pageSize = 10;
            $scope.filter = {};
            $scope.customers = {};
            $scope.customer = {};
            $scope.lenderList = [];
            $scope.shortListProduct = [];
            $scope.selectShortList = [];
            $scope.successList = [];
            $scope.failedList = [];
            $scope.failedResons = [];
            $scope.workaround = { shortListProduct: $scope.shortListProduct };
            $scope.synced = true;

            var ref1 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/customer");
            ref1.child('finalShortListedProduct').set([]);
            ref1.child('selectShortList').set([]);
            ref1.child('sourceNowTab').set('PassedProducts');
            var object = $firebaseObject(ref1);
            object.$bindTo($scope, 'customer');
            var ref2 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            $scope.typing = $firebaseObject(ref2);

            var ref3 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/workaround");
            ref3.set({ shortListProduct: [] });
            var fltr = $firebaseObject(ref3);
            fltr.$bindTo($scope, 'workaround')

            ref3.on('value', function (sh) {
                var val = sh.val() || { workaround: {} };
                if(val.workaround.shortListProduct && val.workaround.shortListProduct instanceof Array) {
                    if(!_.isEqual(_.pluck($scope.shortListProduct, 'ProductID'), _.pluck(val.workaround.shortListProduct,
                            'ProductID'))) {
                        $scope.shortListProduct = val.workaround.shortListProduct;
                        $scope.successList.forEach(function (el) {
                            delete el.isCheck;
                            if(_.findWhere($scope.shortListProduct, { ProductID: el.ProductID })) {
                                el.isCheck = true;
                            }
                        });
                    }
                }
            });

            $scope.$watchCollection('shortListProduct', function (val, oldVal) {
                if(!_.isEqual(_.pluck($scope.shortListProduct, 'ProductID'), _.pluck($scope.workaround.shortListProduct,
                        'ProductID'))) {
                    var clone = angular.copy(val);
                    clone.forEach(function (el) { delete el.$$hashKey })
                    ref3.set({ workaround: { shortListProduct: clone } });
                }

            });

            object.$loaded(function () {
                if(!$scope.customer.sourceNowTab) {
                    $scope.customer.sourceNowTab = 'PassedProducts';
                }
                $scope.customer.sourcesuccessFilter = {};
                $scope.customer.sourcefailedFilter = {};
                getSource();
            });
        };
        $scope.pageChangeHandler = function (num) {
            //console.log(num);
        };
        $scope.getFiledLength = function (reason) {
            var filterArr = _.where($scope.failedList, { FailureReason: reason });
            return filterArr.length;
        };
        var getSource = function () {
            $scope.customer.finalSourceLoading = true;
            sourceService.getSourceDetails({ FFID: $scope.customer.clientDetails.FFID, Appid: $scope.customer.clientDetails.AppID }).then(
                function (response) {
                    var data = angular.copy(response);
                    $scope.customer.finalSourceLoading = false;
                    if(data.Message) {
                        toaster.pop({
                            type: 'error',
                            title: "Please retry to get products"
                        });
                    } else {
                        var products = angular.copy(data);
                        $scope.successList = angular.copy(products.DataTable1);
                        $scope.lenderList = _.uniq(_.pluck($scope.successList, 'LenderName'));
                        $scope.failedList = angular.copy(products.DataTable2);
                        $scope.failedLenderList = _.uniq(_.pluck($scope.failedList, 'LenderName'));
                        $scope.failedResons = _.uniq(_.pluck($scope.failedList, 'FailureReason'));
                        setTimeout(function () {
                            if(!$rootScope.total) {
                                $rootScope.total = 0;
                            }
                            $scope.total_passed = $rootScope.total;
                        }, 1000);
                    }
                });
        };
        $scope.disabledCheck = function (product) {
            if($scope.customer.selectShortList && $scope.customer.selectShortList.length) {
                if(product.isSelected) {
                    return false;
                } else {
                    return true;
                }
            }
        };
        $scope.saveSource = function () {
            var details = {
                FFID: $scope.customer.clientDetails.FFID,
                AppID: $scope.customer.clientDetails.AppID,
                ProductID1: typeof $scope.customer.finalShortListedProduct[0] === "object" ? $scope.customer.finalShortListedProduct[
                    0].ProductID : '',
                ProductID2: typeof $scope.customer.finalShortListedProduct[1] === "object" ? $scope.customer.finalShortListedProduct[
                    1].ProductID : '',
                ProductID3: typeof $scope.customer.finalShortListedProduct[2] === "object" ? $scope.customer.finalShortListedProduct[
                    2].ProductID : '',
                ProductID4: typeof $scope.customer.finalShortListedProduct[3] === "object" ? $scope.customer.finalShortListedProduct[
                    3].ProductID : '',
                ProductID5: typeof $scope.customer.finalShortListedProduct[4] === "object" ? $scope.customer.finalShortListedProduct[
                    4].ProductID : '',
                SelectedProductID: $scope.customer.selectShortList[0].ProductID
            };
            var mortProductNoteDetails = {
                MortgageProductNotesID: ($scope.customer.clientDetails.MortgageProductNotesID) ? $scope.customer.clientDetails.MortgageProductNotesID :
                    null,
                FFID: $scope.customer.clientDetails.FFID
            };
            if($scope.customer.finalShortListedProduct[0] && $scope.customer.finalShortListedProduct[0].ProductIDNotes) {
                mortProductNoteDetails.ProductID1Notes = angular.copy($scope.customer.finalShortListedProduct[0].ProductIDNotes);
            }
            if($scope.customer.finalShortListedProduct[1] && $scope.customer.finalShortListedProduct[1].ProductIDNotes) {
                mortProductNoteDetails.ProductID2Notes = angular.copy($scope.customer.finalShortListedProduct[1].ProductIDNotes);
            }
            if($scope.customer.finalShortListedProduct[2] && $scope.customer.finalShortListedProduct[2].ProductIDNotes) {
                mortProductNoteDetails.ProductID3Notes = angular.copy($scope.customer.finalShortListedProduct[2].ProductIDNotes);
            }
            if($scope.customer.finalShortListedProduct[3] && $scope.customer.finalShortListedProduct[3].ProductIDNotes) {
                mortProductNoteDetails.ProductID4Notes = angular.copy($scope.customer.finalShortListedProduct[3].ProductIDNotes);
            }
            if($scope.customer.finalShortListedProduct[4] && $scope.customer.finalShortListedProduct[4].ProductIDNotes) {
                mortProductNoteDetails.ProductID5Notes = angular.copy($scope.customer.finalShortListedProduct[4].ProductIDNotes);
            }
            sourceService.SaveShortlist(details).then(function (response) {
                if(response && response.MortQuoteID) {
                    $scope.customer.clientDetails.MortgageQuoteID = response.MortQuoteID;
                }
                var createFF = {
                    UserID: 111,
                    eCaseStatusID: 2,
                    FFID: (localStorageService.get('FFID')) ? localStorageService.get('FFID') : 0,
                    ModifiedBy: 111
                };
                memberService.createFFID(createFF).then(function (response) {
                    // console.log(response);
                });
                if($scope.customer.finalShortListedProduct[0] && $scope.customer.finalShortListedProduct[0].ProductID) {
                    var mortDetails = angular.copy($scope.customer.finalShortListedProduct[0]);
                    mortDetails.FFID = $scope.customer.clientDetails.FFID;
                    mortDetails.MortQuoteId = $scope.customer.clientDetails.MortgageQuoteID;
                    mortDetails.SelectedProductId = $scope.customer.selectShortList[0].ProductID;
                    mortDetails.ProductID1Notes = mortDetails.ProductIDNotes;
                    mortDetails.ClientName = $scope.customer.applicants[1]['Firstname'] + ' ' + $scope.customer.applicants[1][
                        'Surname'
                    ];
                    if($scope.customer.selectShortList[0].ProductID === $scope.customer.finalShortListedProduct[0].ProductID) {
                        mortDetails.QuoteStatus = true;
                    }
                    sourceService.SaveMortgageSelectedSave(mortDetails).then(function (response) {
                        mortProductNoteDetails.MortgageQuoteID = mortDetails.MortQuoteId;
                        sourceService.SaveMortgageProductNotes(mortProductNoteDetails).then(function (response) {
                            if(response && response.MortgageProductNotesID)
                                $scope.customer.clientDetails.MortgageProductNotesID = response.MortgageProductNotesID;
                            toaster.pop({
                                type: 'success',
                                title: "Product Saved Successfully"
                            });
                            $rootScope.tickTab('finalsourcenow');
                            $rootScope.changeTab({
                                state: 'app.quote_summary',
                                title: 'Quote Summary',
                                id: 'quote_summary'
                            });
                        });
                    });
                }
                if($scope.customer.finalShortListedProduct[1] && $scope.customer.finalShortListedProduct[1].ProductID) {
                    var mortDetails = angular.copy($scope.customer.finalShortListedProduct[1]);
                    mortDetails.FFID = $scope.customer.clientDetails.FFID;
                    mortDetails.MortQuoteId = $scope.customer.clientDetails.MortgageQuoteID;
                    mortDetails.SelectedProductId = $scope.customer.selectShortList[0].ProductID;
                    mortDetails.ProductID2Notes = mortDetails.ProductIDNotes;
                    mortDetails.ClientName = $scope.customer.applicants[1]['Firstname'] + ' ' + $scope.customer.applicants[1][
                        'Surname'
                    ];
                    if($scope.customer.selectShortList[0].ProductID === $scope.customer.finalShortListedProduct[1].ProductID) {
                        mortDetails.QuoteStatus = true;
                    }
                    sourceService.SaveMortgageSelectedSave(mortDetails).then(function (response) {
                        mortProductNoteDetails.MortgageQuoteID = mortDetails.MortQuoteId;
                        sourceService.SaveMortgageProductNotes(mortProductNoteDetails).then(function (response) {
                            if(response && response.MortgageProductNotesID)
                                $scope.customer.clientDetails.MortgageProductNotesID = response.MortgageProductNotesID;
                        });
                    });
                }
                if($scope.customer.finalShortListedProduct[2] && $scope.customer.finalShortListedProduct[2].ProductID) {
                    var mortDetails = angular.copy($scope.customer.finalShortListedProduct[2]);
                    mortDetails.FFID = $scope.customer.clientDetails.FFID;
                    mortDetails.MortQuoteId = $scope.customer.clientDetails.MortgageQuoteID;
                    mortDetails.SelectedProductId = $scope.customer.selectShortList[0].ProductID;
                    mortDetails.ProductID3Notes = mortDetails.ProductIDNotes;
                    mortDetails.ClientName = $scope.customer.applicants[1]['Firstname'] + ' ' + $scope.customer.applicants[1][
                        'Surname'
                    ];
                    if($scope.customer.selectShortList[0].ProductID === $scope.customer.finalShortListedProduct[2].ProductID) {
                        mortDetails.QuoteStatus = true;
                    }
                    sourceService.SaveMortgageSelectedSave(mortDetails).then(function (response) {
                        mortProductNoteDetails.MortgageQuoteID = mortDetails.MortQuoteId;
                        sourceService.SaveMortgageProductNotes(mortProductNoteDetails).then(function (response) {
                            if(response && response.MortgageProductNotesID)
                                $scope.customer.clientDetails.MortgageProductNotesID = response.MortgageProductNotesID;
                        });
                    });
                }
                if($scope.customer.finalShortListedProduct[3] && $scope.customer.finalShortListedProduct[3].ProductID) {
                    var mortDetails = angular.copy($scope.customer.finalShortListedProduct[3]);
                    mortDetails.FFID = $scope.customer.clientDetails.FFID;
                    mortDetails.MortQuoteId = $scope.customer.clientDetails.MortgageQuoteID;
                    mortDetails.SelectedProductId = $scope.customer.selectShortList[0].ProductID;
                    mortDetails.ProductID4Notes = mortDetails.ProductIDNotes;
                    mortDetails.ClientName = $scope.customer.applicants[1]['Firstname'] + ' ' + $scope.customer.applicants[1][
                        'Surname'
                    ];
                    if($scope.customer.selectShortList[0].ProductID === $scope.customer.finalShortListedProduct[3].ProductID) {
                        mortDetails.QuoteStatus = true;
                    }
                    sourceService.SaveMortgageSelectedSave(mortDetails).then(function (response) {
                        mortProductNoteDetails.MortgageQuoteID = mortDetails.MortQuoteId;
                        sourceService.SaveMortgageProductNotes(mortProductNoteDetails).then(function (response) {
                            if(response && response.MortgageProductNotesID)
                                $scope.customer.clientDetails.MortgageProductNotesID = response.MortgageProductNotesID;
                        });
                    });
                }
                if($scope.customer.finalShortListedProduct[4] && $scope.customer.finalShortListedProduct[4].ProductID) {
                    var mortDetails = angular.copy($scope.customer.finalShortListedProduct[4]);
                    mortDetails.FFID = $scope.customer.clientDetails.FFID;
                    mortDetails.MortQuoteId = $scope.customer.clientDetails.MortgageQuoteID;
                    mortDetails.SelectedProductId = $scope.customer.selectShortList[0].ProductID;
                    mortDetails.ProductID5Notes = mortDetails.ProductIDNotes;
                    mortDetails.ClientName = $scope.customer.applicants[1]['Firstname'] + ' ' + $scope.customer.applicants[1][
                        'Surname'
                    ];
                    if($scope.customer.selectShortList[0].ProductID === $scope.customer.finalShortListedProduct[4].ProductID) {
                        mortDetails.QuoteStatus = true;
                    }
                    sourceService.SaveMortgageSelectedSave(mortDetails).then(function (response) {
                        mortProductNoteDetails.MortgageQuoteID = mortDetails.MortQuoteId;
                        sourceService.SaveMortgageProductNotes(mortProductNoteDetails).then(function (response) {
                            if(response && response.MortgageProductNotesID)
                                $scope.customer.clientDetails.MortgageProductNotesID = response.MortgageProductNotesID;
                        });
                    });
                }
            });
        };
        $scope.resetFilter = function () {
            initialize();
        };
        $scope.backButtonAction = function () {
            $rootScope.changeTab({
                state: 'app.credithistroy',
                title: 'Credit History',
                id: 'credithistroy'
            });
        };
        $scope.nextButtonAction = function () {
            $rootScope.changeTab({
                state: 'app.quote_summary',
                title: 'Quote Summary',
                id: 'quote_summary'
            });
        };
        $scope.changeFilter = function () {
            $scope.currentPage = 1;
            setTimeout(function () {
                $rootScope.total;
            }, 1000);
            //            if (!angular.isDefined($scope.customer.finalSourceFilter.LenderName)) {
            //                $scope.customer.finalSourceFilter.LenderName = null;
            //            }
        };
        initialize();

    }
]);

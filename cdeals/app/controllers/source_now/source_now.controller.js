'use strict';

factFindApp.controller('sourceNowCtrl', ['$scope', '$rootScope', '$state', 'sourceService', 'localStorageService', '$firebaseObject',
    'firebaseService', 'toaster',
    function ($scope, $rootScope, $state, sourceService, localStorageService, $firebaseObject, firebaseService, toaster) {

        var initialize = function () {
            $scope.currentPage = 1;
            $scope.pageSize = 10;
            $scope.filter = {};
            $scope.successList = [];
            $scope.lenderList = [];
            $scope.shortListProduct = [];
            $scope.customer = {};
            var ref1 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/customer");
            var object = $firebaseObject(ref1);
            object.$bindTo($scope, 'customer');
            var ref2 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            $scope.typing = $firebaseObject(ref2);
            object.$loaded(function () {
                if(!$scope.customer.intialsourceNowTab) {
                    $scope.customer.intialsourceNowTab = 'PassedProducts';
                }
                $scope.customer.failedFilter = {};
                $scope.customer.successFilter = {};
                getSource();
            });
        };
        $scope.getActiveSourceNowTab = function (tab) {
            return angular.equals($scope.customer.intialsourceNowTab, tab);
        };
        $scope.setSourceNowTab = function (tab) {
            $scope.customer.intialsourceNowTab = tab;
            if($scope.customer.intialsourceNowTab == "PassedProducts") {
                $rootScope.total = $scope.total_passed;
            }
            $scope.activeTabResult = tab;
        };
        $scope.changeFilter = function () {
            $scope.currentPage = 1;
            setTimeout(function () {
                $rootScope.total;
            }, 1000);
            //            if ($scope.customer.intialSourceFilter && !angular.isDefined($scope.customer.intialSourceFilter.lender)) {
            //                $scope.customer.intialSourceFilter.lender = null;
            //            }
        };
        $scope.pageChangeHandler = function (num) {
            // console.log(num);
        };
        $scope.getFiledLength = function (reason) {
            var filterArr = _.where($scope.failedList, { FailureReason: reason });
            return filterArr.length;
        };
        $scope.disableTerm = function (value) {
            //            if ($scope.customer.successFilter && $scope.customer.successFilter.Term && !_.contains($scope.customer.successFilter.Term, value) && $scope.customer.successFilter.Term.length > 1) {
            //                return true;
            //            } else {
            return false;
            //            }
        };
        $scope.disableProductType = function (value) {
            //            if ($scope.customer.successFilter && $scope.customer.successFilter.ProductType && !_.contains($scope.customer.successFilter.ProductType, value) && $scope.customer.successFilter.ProductType.length > 1) {
            //                return true;
            //            } else {
            return false;
            //            }
        };
        $scope.disableFailedTerm = function (value) {
            //            if ($scope.customer.failedFilter && $scope.customer.failedFilter.Term && !_.contains($scope.customer.failedFilter.Term, value) && $scope.customer.failedFilter.Term.length > 1) {
            //                return true;
            //            } else {
            return false;
            //            }
        };
        $scope.disableFailedProductType = function (value) {
            //            if ($scope.customer.failedFilter && $scope.customer.failedFilter.ProductType && !_.contains($scope.customer.failedFilter.ProductType, value) && $scope.customer.failedFilter.ProductType.length > 1) {
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
            case "Days between Remortgage Not Accepted":
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
            case "Freehold Flat Not Accecpted":
            case "NonExcouncilStudioFlat Max LTV 100%":
            case "Above Commercial refer to lender":
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
        var getSource = function () {
            $scope.customer.initalSourceLoading = true;
            sourceService.getSourceDetails({ FFID: $scope.customer.clientDetails.FFID, Appid: $scope.customer.clientDetails.AppID }).then(
                function (response) {
                    var data = angular.copy(response);
                    $scope.customer.initalSourceLoading = false;
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
        $scope.backButtonAction = function () {
            $rootScope.changeTab({
                state: 'app.employmentandincome',
                title: 'Employment and Income',
                id: 'employmentandincome'
            });
        };
        $scope.nextButtonAction = function () {
            $rootScope.changeTab({
                state: 'app.otherexisitingmortgages',
                title: 'Other Existing Mortgages',
                id: 'otherexisitingmortgages'
            });
        };
        initialize();

    }
]);

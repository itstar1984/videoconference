'use strict';

factFindApp.controller('quoteSummaryCtrl', ['$scope', '$rootScope', 'quoteService', 'localStorageService', '$firebaseObject', 'firebaseService',
    function ($scope, $rootScope, quoteService, localStorageService, $firebaseObject, firebaseService) {

        var initialize = function () {
            $scope.customer = {};
            $scope.customer.activeQuotes = [];
            $scope.customer.deActiveQuotes = [];
            var ref1 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/customer");
            var object = $firebaseObject(ref1);
            object.$bindTo($scope, 'customer');
            var ref2 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            $scope.typing = $firebaseObject(ref2);
            object.$loaded(function () {
                if(!$scope.customer.quoteSummaryTab) {
                    $scope.customer.quoteSummaryTab = 'activeQuote';
                }
                getQuotes();
            });
        };

        $scope.$watch('selectedClientID.productID', function () {
            console.log($scope.selectedClientID)
        });
        $scope.getActiveQuoteSummryTab = function (tab) {
            return angular.equals($scope.customer.quoteSummaryTab, tab);
        };
        $scope.setQuoteSummryTab = function (tab) {
            $scope.customer.quoteSummaryTab = tab;
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
        var mapQuotes = function (quetoArr, isActive) {
            var myArr = [];
            angular.forEach(quetoArr, function (item) {
                if(item) {
                    var obj = {};
                    obj.ProductID = item.ProductID ? item.ProductID : null;
                    obj.SelectedProductId = item.SelectedProductId ? item.SelectedProductId : null;
                    obj.LenderName = item.LenderName ? item.LenderName : null;
                    obj.ProductName = item.ProductName ? item.ProductName : null;
                    obj.ProductType = item.ProductType ? item.ProductType : null;
                    obj.Term = item.Term ? item.Term : null;
                    obj.InitialRate = item.InitialRate ? item.InitialRate : null;
                    obj.RevertingRate = item.RevertingRate ? item.RevertingRate : null;
                    obj.InitialPayment = item.InitialPayment ? item.InitialPayment : null;
                    obj.RevPayment = item.RevPayment ? item.RevPayment : null;
                    obj.TotalCost = item.TotalCost ? item.TotalCost : null;
                    obj.IncrementalCost = item.IncrementalCost ? item.IncrementalCost : null;
                    obj.TotalFee = item.TotalFee ? item.TotalFee : null;
                    obj.ERC = item.ERC ? item.ERC : null;
                    obj.ERCEndDate = item.ERCEndDate ? item.ERCEndDate : null;
                    obj.ERCOverHang = item.ERCOverHang ? item.ERCOverHang : null;
                    obj.BookingFee = item.BookingFee ? item.BookingFee : null;
                    obj.ArrangementFee = item.ArrangementFee ? item.ArrangementFee : null;
                    obj.HLC = item.HLC ? item.HLC : null;
                    obj.ValuationFee = item.ValuationFee ? item.ValuationFee : null;
                    obj.Cashback = item.Cashback ? item.Cashback : null;
                    obj.Incentives = item.Incentives ? item.Incentives : null;
                    obj.LendingCriteria = item.LendingCriteria ? item.LendingCriteria : null;
                    obj.AffordabilityFeatures = item.AffordabilityFeatures ? item.AffordabilityFeatures : null;
                    obj.Adverse = item.Adverse ? item.Adverse : null;
                    obj.Overpayment = item.Overpayment ? item.Overpayment : null;
                    obj.CapitalRaised = item.CapitalRaised ? item.CapitalRaised : null;
                    myArr.push(obj);
                }
            });
            var object = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + '/customer');
            if(isActive) {
                object.child('activeProductSummary').set([]);
                object.child('activeProductSummary').set(myArr);
            } else {
                object.child('deActiveProductSummary').set([]);
                object.child('deActiveProductSummary').set(myArr);
            }
        };
        var mapQuoteNotes = function (notes, isActive) {
            var notesObj = {};
            if(notes) {
                notesObj.ProductID1Notes = (notes.ProductID1Notes) ? notes.ProductID1Notes : null;
                notesObj.ProductID2Notes = (notes.ProductID2Notes) ? notes.ProductID2Notes : null;
                notesObj.ProductID3Notes = (notes.ProductID3Notes) ? notes.ProductID3Notes : null;
                notesObj.ProductID4Notes = (notes.ProductID4Notes) ? notes.ProductID4Notes : null;
                notesObj.ProductID5Notes = (notes.ProductID5Notes) ? notes.ProductID5Notes : null;
            }
            var objectNotes = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + '/customer');
            if(isActive) {
                objectNotes.child('activeProductNotes').set(notesObj);
            } else {
                objectNotes.child('deActiveProductNotes').set(notesObj);
            }
        };
        var getQuotes = function () {
            $scope.customer.activeQuotes = [];
            $scope.customer.deActiveQuotes = [];
            $scope.customer.showdeActiveProductSummary = false;
            $scope.customer.showActiveProductSummary = false;
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
            quoteService.getDeActiveQuotes({ FFID: localStorageService.get('FFID') }).then(function (response) {
                if(response && response['MortgageQuotes '] && response['MortgageQuotes '].length > 1) {
                    var deActiveQuotes = [];
                    angular.forEach(response['MortgageQuotes '], function (quote) {
                        if(quote) {
                            deActiveQuotes.push(objectifyQuoteArray(quote));
                        }
                    });
                    $scope.customer.deActiveQuotes = angular.copy(deActiveQuotes);
                }
            });
        };
        $scope.showDeactiveQuote = function (quote) {
            quote.show = !quote.show;
            $scope.customer.showdeActiveProductSummary = quote.show;
            quoteService.getQuoteSummary({ FFID: localStorageService.get('FFID'), MortQuoteID: quote.MortQuoteID }).then(function (
                response) {
                mapQuotes(response, false);
                quoteService.getMortgageProductNotes({ FFID: localStorageService.get('FFID'), MortQuoteID: quote.MortQuoteID }).then(
                    function (response) {
                        mapQuoteNotes(response, false);
                    });
            });
        };
        $scope.showActiveQuote = function (quote) {
            quote.show = !quote.show;
            $scope.customer.showActiveProductSummary = quote.show;
            quoteService.getQuoteSummary({ FFID: localStorageService.get('FFID'), MortQuoteID: quote.MortQuoteID }).then(function (
                response) {
                mapQuotes(response, true);
                quoteService.getMortgageProductNotes({ FFID: localStorageService.get('FFID'), MortQuoteID: quote.MortQuoteID }).then(
                    function (respo) {
                        mapQuoteNotes(respo, true);
                        //$scope.customer.activeProductNotes = angular.copy(respo);
                    });
            });
        };
        $scope.backButtonAction = function () {
            $rootScope.changeTab({
                state: 'app.finalsourcenow',
                title: 'Source Now',
                id: 'finalsourcenow'
            });
        };
        $scope.nextButtonAction = function () {
            $rootScope.changeTab({
                state: 'app.nonSourceApplicant',
                title: 'Non source Applicants',
                id: 'nonSourceApplicant'
            });
        };
        initialize();

    }
]);

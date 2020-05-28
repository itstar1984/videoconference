'use strict';

factFindApp.controller('CreditHistroyCtrl', ['$scope', 'localStorageService', '$firebaseObject', 'firebaseService', 'creditHistoryService',
    'appClientUpdate', '$rootScope', 'selectBoxService',
    function ($scope, localStorageService, $firebaseObject, firebaseService, creditHistoryService, appClientUpdate, $rootScope,
        selectBoxService) {

        $scope.occMinDate = moment().subtract(72, 'months').format('YYYY-MM-DD');
        $scope.occMaxDate = moment().format('YYYY-MM-DD');
        $scope.occur12 = [];
        $scope.occur24 = [];
        $scope.occur36 = [];
        $scope.occur72 = [];
        for(var i = 0; i < 12; i++) {
            $scope.occur12.push(i);
            $scope.occur24.push(i);
            $scope.occur36.push(i);
        }
        for(var i = 0; i < 36; i++) {
            $scope.occur72.push(i);
        }
        $scope.setToMonthFormat = function (val) {
            if(!val)
                return val;
            var list = val.split(" / ");
            if(list.length < 3)
                return null;
            return list[1] + ' / ' + list[2];

        };

        function daysInMonth(monthIndex, fullYear, type) {
            var days = new Array();
            var month = monthIndex + 1;
            var date = new Date(month + "/1/" + fullYear);
            var date1 = new Date(month + "/1/" + fullYear);
            date1.setMonth(month);
            var count = (date1 - date) / (1000 * 60 * 60 * 24);
            var startDate = 1;
            var endDate = count;
            var day = new Date().getDate();
            if(type == 0)
                endDate = day;
            if(type == 2)
                startDate = day;
            for(var i = startDate; i <= endDate; i++)
                days.push(i);
            days.push("Not sure");
            return days;

        }
        var unique = function (origArr) {
            var newArr = [],
                origLen = origArr.length,
                found, x, y;

            for(x = 0; x < origLen; x++) {
                found = undefined;
                for(y = 0; y < newArr.length; y++) {
                    if(origArr[x] === newArr[y]) {
                        found = true;
                        break;
                    }
                }
                if(!found) {
                    newArr.push(origArr[x]);
                }
            }
            return newArr;
        }
        $scope.dayspermonth12 = {};
        $scope.dayspermonth24 = {};
        $scope.dayspermonth36 = {};
        $scope.dayspermonth72 = {};
        var months = [],
            months24 = [],
            months36 = [],
            months72 = [],
            monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
        for(var i = 0; i < 12; i++) {
            var tempday = new Date();
            var monthIndex = tempday.getMonth() - i;
            var yearOff = Math.floor(monthIndex / 12);
            var monthName = monthNames[monthIndex - yearOff * 12];
            var year = tempday.getFullYear() + yearOff;
            var format = monthName + ' / ' + year;
            months.push(format);
            var type = 1;
            if(i === 0)
                type = 0;
            if(i === 12)
                type = 2;
            $scope.dayspermonth12[format] = daysInMonth(monthIndex - yearOff * 12, year, type);
        }
        $scope.months = unique(months);
        for(var i = 12; i < 24; i++) {
            var tempday = new Date();
            var monthIndex = tempday.getMonth() - i;
            var yearOff = Math.floor(monthIndex / 12);
            var monthName = monthNames[monthIndex - yearOff * 12];
            var year = tempday.getFullYear() + yearOff;
            var format = monthName + ' / ' + year;
            months24.push(format);
            var type = 1;
            if(i === 12)
                type = 0;
            if(i === 24)
                type = 2;
            $scope.dayspermonth24[format] = daysInMonth(monthIndex - yearOff * 12, year, type);
        }
        $scope.months24 = unique(months24);
        for(var i = 24; i < 36; i++) {
            var tempday = new Date();
            var monthIndex = tempday.getMonth() - i;
            var yearOff = Math.floor(monthIndex / 12);
            var monthName = monthNames[monthIndex - yearOff * 12];
            var year = tempday.getFullYear() + yearOff;
            var format = monthName + ' / ' + year;
            months36.push(format);
            var type = 1;
            if(i === 24)
                type = 0;
            if(i === 36)
                type = 2;
            $scope.dayspermonth36[format] = daysInMonth(monthIndex - yearOff * 12, year, type);
        }
        $scope.months36 = unique(months36);
        for(var i = 36; i < 72; i++) {
            var tempday = new Date();
            var monthIndex = tempday.getMonth() - i;
            var yearOff = Math.floor(monthIndex / 12);
            var monthName = monthNames[monthIndex - yearOff * 12];
            var year = tempday.getFullYear() + yearOff;
            var format = monthName + ' / ' + year;
            months72.push(format);
            var type = 1;
            if(i === 36)
                type = 0;
            if(i === 72)
                type = 2;
            $scope.dayspermonth72[format] = daysInMonth(monthIndex - yearOff * 12, year, type);
        }
        $scope.months72 = unique(months72);
        $scope.numOccur12Index = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'eleven', 'Twelve'];
        $scope.numOccur24Index = ['Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty', 'Twentyone',
            'Twentytwo', 'Twentythree', 'TwentyFour'
        ];
        $scope.numOccur36Index = ['TwentyFive', 'TwentySix', 'TwentySeven', 'TwentyEight', 'TwentyNine', 'Thirty', 'ThirtyOne', 'ThirtyTwo',
            'ThirtyThree', 'ThirtyFour', 'ThirtyFive', 'ThirtySix'
        ];
        $scope.numOccur72Index = ['ThirtySeven', 'ThirtyEight', 'ThirtyNine', 'Forty', 'FortyOne', 'FortyTwo', 'FortyThree', 'FortyFour',
            'FortyFive', 'FortySix', 'FortySeven', 'FortyEight', 'FortyNine', 'Fifty', 'Fiftyone', 'Fiftytwo', 'Fiftythree', 'Fiftyfour',
            'Fiftyfive', 'Fiftysix', 'Fiftyseven', 'Fiftyeight', 'Fiftynine', 'Sixty', 'Sixtyone', 'Sixtytwo', 'Sixtythree', 'Sixtyfour',
            'Sixtyfive', 'Sixtysix', 'Sixtyseven', 'Sixtyeight', 'Sixtynine', 'Seventy', 'Seventyone', 'Seventytwo'
        ];

        $scope.numObject = {
            '1': 'One',
            '2': 'Two',
            '3': 'Three',
            '4': 'Four',
            '5': 'Five',
            '6': 'Six',
            '7': 'Seven',
            '8': 'Eight',
            '9': 'Nine',
            '10': 'Ten',
            '11': 'eleven',
            '12': 'Twelve',
            '13': 'Thirteen',
            '14': 'Fourteen',
            '15': 'Fifteen',
            '16': 'Sixteen',
            '17': 'Seventeen',
            '18': 'Eighteen',
            '19': 'Nineteen',
            '20': 'Twenty',
            '21': 'Twentyone',
            '22': 'Twentytwo',
            '23': 'Twentythree',
            '24': 'TwentyFour',
            '25': 'TwentyFive',
            '26': 'TwentySix',
            '27': 'TwentySeven',
            '28': 'TwentyEight',
            '29': 'TwentyNine',
            '30': 'Thirty',
            '31': 'ThirtyOne',
            '32': 'ThirtyTwo',
            '33': 'ThirtyThree',
            '34': 'ThirtyFour',
            '35': 'ThirtyFive',
            '36': 'ThirtySix',
            '37': 'ThirtySeven',
            '38': 'ThirtyEight',
            '39': 'ThirtyNine',
            '40': 'Forty',
            '41': 'FortyOne',
            '42': 'FortyTwo',
            '43': 'FortyThree',
            '44': 'FortyFour',
            '45': 'FortyFive',
            '46': 'FortySix',
            '47': 'FortySeven',
            '48': 'FortyEight',
            '49': 'FortyNine',
            '50': 'Fifty',
            '51': 'Fiftyone',
            '52': 'Fiftytwo',
            '53': 'Fiftythree',
            '54': 'Fiftyfour',
            '55': 'Fiftyfive',
            '56': 'Fiftysix',
            '57': 'Fiftyseven',
            '58': 'Fiftyeight',
            '59': 'Fiftynine',
            '60': 'Sixty',
            '61': 'Sixtyone',
            '62': 'Sixtytwo',
            '63': 'Sixtythree',
            '64': 'Sixtyfour',
            '65': 'Sixtyfive',
            '66': 'Sixtysix',
            '67': 'Sixtyseven',
            '68': 'Sixtyeight',
            '69': 'Sixtynine',
            '70': 'Seventy',
            '71': 'Seventyone',
            '72': 'Seventytwo'
        };
        $scope.setFieldTypingStatus = function (field, status) {
            var obj = {
                creditHistoryForm: {
                    field: field,
                    status: status
                },
            };
            firebaseService.saveTypingStatus(obj);
        };
        $scope.checkPartnerTyping = function (field) {
            var flg = false;
            if($scope.typing.client && $scope.typing.client['creditHistoryForm'] &&
                $scope.typing.client['creditHistoryForm']['field'] == field &&
                $scope.typing.client['creditHistoryForm']['status']) {
                flg = true;
            }
            return flg;
        };
        $scope.changeTextFieldCCJ = function (fieldName) {
            if(!angular.isDefined($scope.customer.CCJs[fieldName])) {
                $scope.customer.CCJs[fieldName] = null;
            }
        };
        $scope.changeKeyTextFieldCCJ = function (key, fieldName) {
            if(!angular.isDefined($scope.customer.CCJlist[key][fieldName])) {
                $scope.customer.CCJlist[key][fieldName] = null;
            }
        };
        $scope.changeTextFieldArrears = function (fieldName) {
            if(!angular.isDefined($scope.customer.ArrearsDefaults[fieldName])) {
                $scope.customer.ArrearsDefaults[fieldName] = null;
            }
        };
        $scope.changeKeyTextFieldArrears = function (key, fieldName) {
            if(!angular.isDefined($scope.customer.ArrearDefaultlist[key][fieldName])) {
                $scope.customer.ArrearDefaultlist[key][fieldName] = null;
            }
        };
        $scope.changeTextFieldDefaults = function (fieldName) {
            if(!angular.isDefined($scope.customer.Defaults[fieldName])) {
                $scope.customer.Defaults[fieldName] = null;
            }
        };
        $scope.changeKeyTextFieldDefaults = function (key, fieldName) {
            if(!angular.isDefined($scope.customer.Defaultlist[key][fieldName])) {
                $scope.customer.Defaultlist[key][fieldName] = null;
            }
        };
        $scope.changeTextFieldBankrupt = function (fieldName) {
            if(!angular.isDefined($scope.customer.Bankruptcy[fieldName])) {
                $scope.customer.Bankruptcy[fieldName] = null;
            }
        };
        $scope.changeKeyTextFieldBankrupt = function (key, fieldName) {
            if(!angular.isDefined($scope.customer.Bankruptlist[key][fieldName])) {
                $scope.customer.Bankruptlist[key][fieldName] = null;
            }
        };
        $scope.changeTextFieldIVA = function (fieldName) {
            if(!angular.isDefined($scope.customer.IVAs[fieldName])) {
                $scope.customer.IVAs[fieldName] = null;
            }
        };
        $scope.changeKeyTextFieldIVA = function (key, fieldName) {
            if(!angular.isDefined($scope.customer.IVAlist[key][fieldName])) {
                $scope.customer.IVAlist[key][fieldName] = null;
            }
        };
        $scope.changeTextFieldRepossessions = function (fieldName) {
            if(!angular.isDefined($scope.customer.Repossessions[fieldName])) {
                $scope.customer.Repossessions[fieldName] = null;
            }
        };
        $scope.changeKeyTextFieldRepossessions = function (key, fieldName) {
            if(!angular.isDefined($scope.customer.Bankruptlist[key][fieldName])) {
                $scope.customer.Bankruptlist[key][fieldName] = null;
            }
        };
        $scope.changeOccuranceDate = function (key) {
            if(!angular.isDefined($scope.customer.ArrearsDefaults.occurrences[key])) {
                $scope.customer.ArrearsDefaults.occurrences[key] = null;
            }
        };
        $scope.changeKeyOccuranceDate = function (arrKey, key) {
            if(!angular.isDefined($scope.customer.ArrearDefaultlist[arrKey]['occurrences'][key])) {
                $scope.customer.ArrearDefaultlist[arrKey]['occurrences'][key] = null;
            }
        };
        var initialize = function () {
            selectBoxService.geteArrearsAndDefaultTypes().then(function (response) {
                $scope.ArrearsType = angular.copy(response);
            });
            selectBoxService.geteLenders().then(function (response) {
                $scope.LenderType = angular.copy(response);
            });
            selectBoxService.geteTitles().then(function (response) {
                $scope.titleList = angular.copy(response);
            });
            $scope.cardType = [{ label: 'Delta', value: '1' },
                { label: 'Mastercard', value: '2' },
                { label: 'Solo', value: '3' },
                { label: 'Switch', value: '4' },
                { label: 'Visa Credit', value: '5' },
                { label: 'Visa Debit', value: '7' }
            ]
            $scope.customer = {};
            var ref1 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/customer");
            var object = $firebaseObject(ref1);
            object.$bindTo($scope, 'customer');
            var ref2 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            $scope.typing = $firebaseObject(ref2);
            object.$loaded().then(function () {
                loadCCJDetails();
                loadBankruptDetails();
                loadDefaultDetails();
                loadIVADetails();
                loadRepossessionsDetails();
                loadArrearDefaultDetails();
                if(!$scope.customer.occurrences) {
                    $scope.customer.occurrences = { 72: [] };
                }
            });
        };
        $scope.changeClientId = function (obj, ClientId, itemVal) {
            if(!obj.clientidArray) {
                obj.clientidArray = [];
            }
            if(itemVal) {
                if(obj.clientidArray.indexOf(itemVal) == '-1') {
                    obj.clientidArray.push(itemVal);
                }
            } else {
                if(obj.clientidArray.indexOf(ClientId) != '-1') {
                    obj.clientidArray.splice(obj.clientidArray.indexOf(ClientId), 1);
                }
            }
        };
        $scope.isCheckedClientID = function (obj, applicantData) {
            var flag = false;
            angular.forEach(obj.clientidArray, function (clientID) {
                if(clientID == applicantData.ClientID) {
                    flag = true;
                }
            });
            return flag;
        };
        $scope.createOccurrences = function (type, value) {
            if(!$scope.customer.occurrences) {
                $scope.customer.occurrences = { 72: [] };
            }
            $scope.customer.occurrences[type] = [];
            for(var i = 1; i <= value; i++) {
                $scope.customer.occurrences[type].push(i);
            }
            $scope.customer.ArrearsDefaults.occurrences = [];
        };
        $scope.updateOccurrences = function (obj, value) {
            if(value && value > 0) {
                obj['occurrencesCount'] = [];
                for(var i = 0; i < value; i++) {
                    obj['occurrencesCount'][i] = i;
                }
                angular.forEach(obj.occurrences, function (val, key) {
                    if(key >= value) {
                        delete obj.occurrences[key];
                    }
                });
            }
        };

        var loadCCJDetails = function () {
            $scope.customer.CCJs = { isCCJ: false };
            creditHistoryService.getCCJDetails({ FFID: $scope.customer.clientDetails.FFID, Appid: $scope.customer.clientDetails.AppID }).then(
                function (response) {
                    if(response.length) {
                        $rootScope.tickTab('credithistroy');
                        var CCJlist = angular.copy(response);
                        angular.forEach(CCJlist, function (detail) {
                            if(detail.JudgementDate) {
                                detail.JudgementDate = moment(detail.JudgementDate).format('DD/MM/YYYY');
                            }
                            if(detail.DateSatisfied) {
                                detail.DateSatisfied = moment(detail.DateSatisfied).format('DD/MM/YYYY');
                            }
                            if(detail.clientids && detail.clientids != '') {
                                var clientIds = detail.clientids.split('$$').map(function (item) {
                                    return parseInt(item, 10);
                                });
                                detail.clientids = angular.copy(clientIds);
                                detail.cliendidMasterArray = angular.copy(clientIds);
                            }
                        });
                        $scope.customer.CCJlist = angular.copy(CCJlist);
                    } else {
                        $scope.customer.CCJlist = [];
                        $scope.customer.CCJs = { isCCJ: false };
                    }
                });
        };
        $scope.SaveCCJ = function (details) {
            var ccjDetails = angular.copy(details);
            ccjDetails.FFID = $scope.customer.clientDetails.FFID;
            ccjDetails.Appid = $scope.customer.clientDetails.AppID;
            ccjDetails.JudgementDate = (ccjDetails.JudgementDate) ? moment(moment(ccjDetails.JudgementDate, 'DD-MM-YYYY')).format(
                'MM/DD/YYYY') : '';
            ccjDetails.DateSatisfied = (ccjDetails.DateSatisfied) ? moment(moment(ccjDetails.DateSatisfied, 'DD-MM-YYYY')).format(
                'MM/DD/YYYY') : '';
            creditHistoryService.saveCCJDetail(ccjDetails).then(function (response) {
                if(response.CreditHistoryID) {
                    angular.forEach(ccjDetails.clientids, function (ClientID) {
                        var saveObj = {
                            "ScopeID": response.CreditHistoryID,
                            "ClientID": ClientID,
                            "eFinancialCategoryID": "2"
                        };
                        creditHistoryService.SaveSelectedClientID(saveObj).then(function (response) {
                            $scope.customer.CCJs = {};
                            loadCCJDetails();
                        });
                    });
                }
            });
        };
        $scope.updateCCJ = function (details) {
            var ccjDetails = angular.copy(details);
            ccjDetails.FFID = $scope.customer.clientDetails.FFID;
            ccjDetails.Appid = $scope.customer.clientDetails.AppID;
            ccjDetails.JudgementDate = (ccjDetails.JudgementDate) ? moment(moment(ccjDetails.JudgementDate, 'DD-MM-YYYY')).format(
                'MM/DD/YYYY') : '';
            ccjDetails.DateSatisfied = (ccjDetails.DateSatisfied) ? moment(moment(ccjDetails.DateSatisfied, 'DD-MM-YYYY')).format(
                'MM/DD/YYYY') : '';
            //delete ccjDetails.clientids;
            creditHistoryService.saveCCJDetail(ccjDetails).then(function (response) {
                if(response.CreditHistoryID) {
                    appClientUpdate.updateApplicant(ccjDetails, response.CreditHistoryID, '2', loadCCJDetails);
                } else {
                    $scope.customer.CCJs = {};
                    loadCCJDetails();
                }
            });
        };
        var loadDefaultDetails = function () {
            $scope.customer.Defaults = { isDefault: false, Satisfied: false };
            creditHistoryService.getDefaultDetails({ FFID: $scope.customer.clientDetails.FFID, Appid: $scope.customer.clientDetails.AppID })
                .then(function (response) {
                    if(response.length) {
                        $rootScope.tickTab('credithistroy');
                        var Defaultlist = angular.copy(response);
                        angular.forEach(Defaultlist, function (detail) {
                            if(detail.ArrDefDate) {
                                var dateString = angular.copy(detail.ArrDefDate);
                                var dateParts = dateString.split("/");
                                var ArrDefDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                                detail.ArrDefDate = moment(ArrDefDate).format('DD/MM/YYYY');
                            }
                            if(detail.DateSatisfied) {
                                var dateString = angular.copy(detail.DateSatisfied);
                                var dateParts = dateString.split("/");
                                var DateSatisfied = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                                detail.DateSatisfied = moment(DateSatisfied).format('DD/MM/YYYY');
                            }
                            if(detail.clientids && detail.clientids != '') {
                                var clientIds = detail.clientids.split('$$').map(function (item) {
                                    return parseInt(item, 10);
                                });
                                detail.clientids = angular.copy(clientIds);
                                detail.cliendidMasterArray = angular.copy(clientIds);
                            }
                        });
                        $scope.customer.Defaultlist = angular.copy(Defaultlist);
                    } else {
                        $scope.customer.Defaultlist = [];
                        $scope.customer.Defaults = { isDefault: false, Satisfied: false };
                    }
                });
        };
        $scope.SaveDefault = function (details) {
            var defaultDetails = angular.copy(details);
            defaultDetails.FFID = $scope.customer.clientDetails.FFID;
            defaultDetails.Appid = $scope.customer.clientDetails.AppID;
            defaultDetails.ArrDefDate = (defaultDetails.ArrDefDate) ? moment(moment(defaultDetails.ArrDefDate, 'DD-MM-YYYY')).format(
                'MM/DD/YYYY') : '';
            defaultDetails.DateSatisfied = (defaultDetails.DateSatisfied) ? moment(moment(defaultDetails.DateSatisfied, 'DD-MM-YYYY')).format(
                'MM/DD/YYYY') : '';
            defaultDetails.ArrearOrDefault = 2;
            creditHistoryService.saveDefaultDetail(defaultDetails).then(function (response) {
                if(response.ArrDefID) {
                    angular.forEach(defaultDetails.clientids, function (ClientID) {
                        var saveObj = {
                            "ScopeID": response.ArrDefID,
                            "ClientID": ClientID,
                            "eFinancialCategoryID": "5"
                        };
                        creditHistoryService.SaveSelectedClientID(saveObj).then(function (response) {
                            $scope.customer.Defaults = {};
                            loadDefaultDetails();
                        });
                    });
                }
            });
        };
        $scope.updateDefault = function (details) {
            var defaultDetails = angular.copy(details);
            defaultDetails.FFID = $scope.customer.clientDetails.FFID;
            defaultDetails.Appid = $scope.customer.clientDetails.AppID;
            defaultDetails.ArrearOrDefault = 2;
            defaultDetails.ArrDefDate = (defaultDetails.ArrDefDate) ? moment(moment(defaultDetails.ArrDefDate, 'DD-MM-YYYY')).format(
                'MM/DD/YYYY') : '';
            defaultDetails.DateSatisfied = (defaultDetails.DateSatisfied) ? moment(moment(defaultDetails.DateSatisfied, 'DD-MM-YYYY')).format(
                'MM/DD/YYYY') : '';
            creditHistoryService.saveDefaultDetail(defaultDetails).then(function (response) {
                if(response.ArrDefID) {
                    // remove all client Ids
                    appClientUpdate.updateApplicant(defaultDetails, response.ArrDefID, '5', loadDefaultDetails);
                } else {
                    $scope.customer.Defaults = { isArrears: false };
                    loadDefaultDetails();
                }
            });
        };
        var loadArrearDefaultDetails = function () {
            $scope.customer.ArrearDefaultlist = [];
            $scope.customer.ArrearsDefaults = { isArrears: false, Highest12: 0, Highest24: 0, Highest36: 0, Highest72: 0 };
            creditHistoryService.getSaveArrearsDetails({ FFID: $scope.customer.clientDetails.FFID, Appid: $scope.customer.clientDetails.AppID })
                .then(function (response) {
                    if(response.length) {
                        $rootScope.tickTab('credithistroy');
                        angular.forEach(response, function (detail) {
                            if(detail.ArrDefDate) {
                                var dateString = angular.copy(detail.ArrDefDate);
                                var dateParts = dateString.split("/");
                                var ArrDefDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                                detail.ArrDefDate = moment(ArrDefDate).format('DD/MM/YYYY');
                            }
                            if(detail.NumOccurence72 != "") {
                                detail.isNumOccurence72 = true;
                            }
                            if(detail.clientids && detail.clientids != '') {
                                var clientIds = detail.clientids.split('$$').map(function (item) {
                                    return parseInt(item, 10);
                                });
                                detail.clientids = angular.copy(clientIds);
                                detail.cliendidMasterArray = angular.copy(clientIds);
                            }
                        });
                        $scope.customer.ArrearDefaultlist = angular.copy(response);
                        loadNumOccurencesDetails();
                    }
                });
        };
        $scope.SaveArrearDefault = function (details) {
            var defaultDetails = angular.copy(details);
            defaultDetails.FFID = $scope.customer.clientDetails.FFID;
            defaultDetails.Appid = $scope.customer.clientDetails.AppID;
            defaultDetails.ArrDefDate = (defaultDetails.ArrDefDate) ? moment(moment(defaultDetails.ArrDefDate, 'DD-MM-YYYY')).format(
                'MM/DD/YYYY') : '';
            defaultDetails.ArrearOrDefault = "1";
            creditHistoryService.saveSaveArrearsDetail(defaultDetails).then(function (response) {
                if(response.ArrDefID) {
                    var numOccurence = {};
                    numOccurence.ArrDefID = response.ArrDefID;
                    numOccurence.FFID = defaultDetails.FFID;
                    angular.forEach(defaultDetails.arreas12, function (date, index) {
                        numOccurence[$scope.numOccur12Index[index]] = date;
                    });
                    angular.forEach(defaultDetails.arreas24, function (date, index) {
                        numOccurence[$scope.numOccur24Index[index]] = date;
                    });
                    angular.forEach(defaultDetails.arreas36, function (date, index) {
                        numOccurence[$scope.numOccur36Index[index]] = date;
                    });
                    angular.forEach(defaultDetails.arreas72, function (date, index) {
                        numOccurence[$scope.numOccur72Index[index]] = date;
                    });
                    saveNumOccurences(numOccurence);
                    angular.forEach(defaultDetails.clientids, function (ClientID) {
                        var saveObj = {
                            "ScopeID": response.ArrDefID,
                            "ClientID": ClientID,
                            "eFinancialCategoryID": "4"
                        };
                        creditHistoryService.SaveSelectedClientID(saveObj).then(function (response) {
                            loadArrearDefaultDetails();
                        });
                    });
                }
            });
        };
        $scope.updateArrearDefault = function (details) {
            var defaultDetails = angular.copy(details);
            defaultDetails.FFID = $scope.customer.clientDetails.FFID;
            defaultDetails.Appid = $scope.customer.clientDetails.AppID;
            defaultDetails.ArrDefDate = (defaultDetails.ArrDefDate) ? moment(moment(defaultDetails.ArrDefDate, 'DD-MM-YYYY')).format(
                'MM/DD/YYYY') : '';
            defaultDetails.ArrearOrDefault = "1";
            creditHistoryService.saveSaveArrearsDetail(defaultDetails).then(function (response) {
                if(response.ArrDefID) {
                    // remove all client Ids
                    var numOccurence = {};
                    numOccurence.ArrDefID = response.ArrDefID;
                    numOccurence.FFID = defaultDetails.FFID;
                    numOccurence.NumOccID = defaultDetails.NumOccID ? defaultDetails.NumOccID : null;
                    angular.forEach(defaultDetails.arreas12, function (date, index) {
                        numOccurence[$scope.numOccur12Index[index]] = date;
                    });
                    angular.forEach(defaultDetails.arreas24, function (date, index) {
                        numOccurence[$scope.numOccur24Index[index]] = date;
                    });
                    angular.forEach(defaultDetails.arreas36, function (date, index) {
                        numOccurence[$scope.numOccur36Index[index]] = date;
                    });
                    angular.forEach(defaultDetails.arreas72, function (date, index) {
                        numOccurence[$scope.numOccur72Index[index]] = date;
                    });
                    saveNumOccurences(numOccurence);
                    appClientUpdate.updateApplicant(defaultDetails, response.ArrDefID, '4', loadArrearDefaultDetails);
                } else {
                    $scope.customer.ArrearsDefaults = {};
                    loadArrearDefaultDetails();
                }
            });
        };
        var loadBankruptDetails = function () {
            $scope.customer.Bankruptcy = { isBankrupt: false };
            creditHistoryService.getBankruptDetails({ FFID: $scope.customer.clientDetails.FFID, Appid: $scope.customer.clientDetails.AppID })
                .then(function (response) {
                    if(response.length) {
                        $rootScope.tickTab('credithistroy');
                        angular.forEach(response, function (detail) {
                            if(detail.DischargeDate) {
                                var dateString = angular.copy(detail.DischargeDate);
                                var dateParts = dateString.split("/");
                                var DischargeDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                                detail.DischargeDate = moment(DischargeDate).format('DD/MM/YYYY');
                            }
                            if(detail.RegisteredDate) {
                                var dateString = angular.copy(detail.RegisteredDate);
                                var dateParts = dateString.split("/");
                                var RegisteredDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                                detail.RegisteredDate = moment(RegisteredDate).format('DD/MM/YYYY');
                            }
                            if(detail.clientids && detail.clientids != '') {
                                var clientIds = detail.clientids.split('$$').map(function (item) {
                                    return parseInt(item, 10);
                                });
                                detail.clientids = angular.copy(clientIds);
                                detail.cliendidMasterArray = angular.copy(clientIds);
                            }
                        });
                        $scope.customer.Bankruptlist = angular.copy(response);
                    } else {
                        $scope.customer.Bankruptlist = [];
                        $scope.customer.Bankruptcy = { isBankrupt: false };
                    }
                });
        };
        $scope.SaveBankrupt = function (details) {
            var bankruptDetails = angular.copy(details);
            bankruptDetails.FFID = $scope.customer.clientDetails.FFID;
            bankruptDetails.Appid = $scope.customer.clientDetails.AppID;
            bankruptDetails.DischargeDate = (bankruptDetails.DischargeDate) ? moment(moment(bankruptDetails.DischargeDate, 'DD-MM-YYYY'))
                .format('MM/DD/YYYY') : '';
            bankruptDetails.RegisteredDate = (bankruptDetails.RegisteredDate) ? moment(moment(bankruptDetails.RegisteredDate,
                'DD-MM-YYYY')).format('MM/DD/YYYY') : '';
            creditHistoryService.saveBankruptDetail(bankruptDetails).then(function (response) {
                if(response.BankruptcyID) {
                    angular.forEach(bankruptDetails.clientids, function (ClientID) {
                        var saveObj = {
                            "ScopeID": response.BankruptcyID,
                            "ClientID": ClientID,
                            "eFinancialCategoryID": "14"
                        };
                        creditHistoryService.SaveSelectedClientID(saveObj).then(function (response) {
                            $scope.customer.Bankruptcy = {};
                            loadBankruptDetails();
                        });
                    });
                }
            });
        };
        $scope.updateBankrupt = function (details) {
            var bankruptDetails = angular.copy(details);
            bankruptDetails.FFID = $scope.customer.clientDetails.FFID;
            bankruptDetails.Appid = $scope.customer.clientDetails.AppID;
            bankruptDetails.DischargeDate = (bankruptDetails.DischargeDate) ? moment(moment(bankruptDetails.DischargeDate, 'DD-MM-YYYY'))
                .format('MM/DD/YYYY') : '';
            bankruptDetails.RegisteredDate = (bankruptDetails.RegisteredDate) ? moment(moment(bankruptDetails.RegisteredDate,
                'DD-MM-YYYY')).format('MM/DD/YYYY') : '';
            creditHistoryService.saveBankruptDetail(bankruptDetails).then(function (response) {
                if(response.BankruptcyID) {
                    //                    if (bankruptDetails.clientidArray && bankruptDetails.clientidArray.length) {
                    // remove all client Ids
                    appClientUpdate.updateApplicant(bankruptDetails, response.BankruptcyID, '14', loadBankruptDetails);
                } else {
                    $scope.customer.Bankruptcy = {};
                    loadBankruptDetails();
                }
            });
        };
        var loadIVADetails = function () {
            $scope.customer.IVAs = { isIVA: false };
            creditHistoryService.getIVADetails({ FFID: $scope.customer.clientDetails.FFID, Appid: $scope.customer.clientDetails.AppID }).then(
                function (response) {
                    if(response.length) {
                        $rootScope.tickTab('credithistroy');
                        angular.forEach(response, function (detail) {
                            if(detail.DateStarted) {
                                var dateString = angular.copy(detail.DateStarted);
                                var dateParts = dateString.split("/");
                                var DateStarted = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                                detail.DateStarted = moment(DateStarted).format('DD/MM/YYYY');
                            }
                            if(detail.DateCompleted) {
                                var dateString = angular.copy(detail.DateCompleted);
                                var dateParts = dateString.split("/");
                                var DateCompleted = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                                detail.DateCompleted = moment(DateCompleted).format('DD/MM/YYYY');
                            }
                            if(detail.clientids && detail.clientids != '') {
                                var clientIds = detail.clientids.split('$$').map(function (item) {
                                    return parseInt(item, 10);
                                });
                                detail.clientids = angular.copy(clientIds);
                                detail.cliendidMasterArray = angular.copy(clientIds);
                            }
                        });
                        $scope.customer.IVAlist = angular.copy(response);
                    } else {
                        $scope.customer.IVAlist = [];
                        $scope.customer.IVAs = { isIVA: false };
                    }
                });
        };
        $scope.SaveIVA = function (details) {
            var ivaDetails = angular.copy(details);
            ivaDetails.FFID = $scope.customer.clientDetails.FFID;
            ivaDetails.Appid = $scope.customer.clientDetails.AppID;
            ivaDetails.DateStarted = (ivaDetails.DateStarted) ? moment(moment(ivaDetails.DateStarted, 'DD-MM-YYYY')).format('MM/DD/YYYY') :
                '';
            ivaDetails.DateCompleted = (ivaDetails.DateCompleted) ? moment(moment(ivaDetails.DateCompleted, 'DD-MM-YYYY')).format(
                'MM/DD/YYYY') : '';
            creditHistoryService.saveIVADetail(ivaDetails).then(function (response) {
                if(response.IVAID) {
                    angular.forEach(ivaDetails.clientids, function (ClientID) {
                        var saveObj = {
                            "ScopeID": response.IVAID,
                            "ClientID": ClientID,
                            "eFinancialCategoryID": "3"
                        };
                        creditHistoryService.SaveSelectedClientID(saveObj).then(function (response) {
                            $scope.customer.IVAs = {};
                            loadIVADetails();
                        });
                    });
                }
            });
        };
        $scope.updateIVA = function (details) {
            var ivaDetails = angular.copy(details);
            ivaDetails.FFID = $scope.customer.clientDetails.FFID;
            ivaDetails.Appid = $scope.customer.clientDetails.AppID;
            ivaDetails.DateStarted = (ivaDetails.DateStarted) ? moment(moment(ivaDetails.DateStarted, 'DD-MM-YYYY')).format('MM/DD/YYYY') :
                '';
            ivaDetails.DateCompleted = (ivaDetails.DateCompleted) ? moment(moment(ivaDetails.DateCompleted, 'DD-MM-YYYY')).format(
                'MM/DD/YYYY') : '';
            creditHistoryService.saveIVADetail(ivaDetails).then(function (response) {
                if(response.IVAID) {
                    // remove all client Ids
                    appClientUpdate.updateApplicant(ivaDetails, response.IVAID, '3', loadIVADetails);
                } else {
                    $scope.customer.IVAs = {};
                    loadIVADetails();
                }
            });
        };
        var loadRepossessionsDetails = function () {
            $scope.customer.Repossessions = { isRepossessed: false };
            creditHistoryService.getRepossessionsDetails({ FFID: $scope.customer.clientDetails.FFID, Appid: $scope.customer.clientDetails
                    .AppID }).then(function (response) {
                if(response.length) {
                    $rootScope.tickTab('credithistroy');
                    angular.forEach(response, function (detail) {
                        if(detail.DateLiabilitySettled) {
                            var dateString = angular.copy(detail.DateLiabilitySettled);
                            var dateParts = dateString.split("/");
                            var DateLiabilitySettled = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                            detail.DateLiabilitySettled = moment(DateLiabilitySettled).format('DD/MM/YYYY');
                        }
                        if(detail.RepoDate) {
                            var dateString = angular.copy(detail.RepoDate);
                            var dateParts = dateString.split("/");
                            var RepoDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                            detail.RepoDate = moment(RepoDate).format('DD/MM/YYYY');
                        }
                        if(detail.clientids && detail.clientids != '') {
                            var clientIds = detail.clientids.split('$$').map(function (item) {
                                return parseInt(item, 10);
                            });
                            detail.clientids = angular.copy(clientIds);
                            detail.cliendidMasterArray = angular.copy(clientIds);
                        }
                    });
                    $scope.customer.Repossessionslist = angular.copy(response);
                } else {
                    $scope.customer.Repossessionslist = [];
                    $scope.customer.Repossessions = { isRepossessed: false, IsLiabilitySettled: false };
                }
            });
        };
        $scope.SaveRepossessions = function (details) {
            var repossessionsDetails = angular.copy(details);
            repossessionsDetails.FFID = $scope.customer.clientDetails.FFID;
            repossessionsDetails.Appid = $scope.customer.clientDetails.AppID;
            repossessionsDetails.DateLiabilitySettled = (repossessionsDetails.DateLiabilitySettled) ? moment(moment(repossessionsDetails.DateLiabilitySettled,
                'DD-MM-YYYY')).format('MM/DD/YYYY') : '';
            repossessionsDetails.RepoDate = (repossessionsDetails.RepoDate) ? moment(moment(repossessionsDetails.RepoDate, 'DD-MM-YYYY'))
                .format('MM/DD/YYYY') : '';
            creditHistoryService.saveRepossessionsDetail(repossessionsDetails).then(function (response) {
                if(response.RepoID) {
                    angular.forEach(repossessionsDetails.clientids, function (ClientID) {
                        var saveObj = {
                            "ScopeID": response.RepoID,
                            "ClientID": ClientID,
                            "eFinancialCategoryID": "6"
                        };
                        creditHistoryService.SaveSelectedClientID(saveObj).then(function (response) {
                            $scope.customer.Repossessions = {};
                            loadRepossessionsDetails();
                        });
                    });
                }
            });
        };
        $scope.updateRepossessions = function (details) {
            var repossessionsDetails = angular.copy(details);
            repossessionsDetails.FFID = $scope.customer.clientDetails.FFID;
            repossessionsDetails.Appid = $scope.customer.clientDetails.AppID;
            repossessionsDetails.DateLiabilitySettled = (repossessionsDetails.DateLiabilitySettled) ? moment(moment(repossessionsDetails.DateLiabilitySettled,
                'DD-MM-YYYY')).format('MM/DD/YYYY') : '';
            repossessionsDetails.RepoDate = (repossessionsDetails.RepoDate) ? moment(moment(repossessionsDetails.RepoDate, 'DD-MM-YYYY'))
                .format('MM/DD/YYYY') : '';
            creditHistoryService.saveRepossessionsDetail(repossessionsDetails).then(function (response) {
                if(response.RepoID) {
                    // remove all client Ids
                    appClientUpdate.updateApplicant(repossessionsDetails, response.RepoID, '6', loadRepossessionsDetails);
                } else {
                    $scope.customer.Repossessions = {};
                    loadRepossessionsDetails();
                }
            });
        };
        $scope.goNext = function () {
            //$rootScope.tickTab('credithistroy');
            $rootScope.changeTab({
                state: 'app.finalsourcenow',
                title: 'Source Now',
                id: 'finalsourcenow'
            });
        };
        var loadNumOccurencesDetails = function () {
            creditHistoryService.getNumOccurencesDetails({ FFID: $scope.customer.clientDetails.FFID }).then(function (response) {
                if(response && response['NumOccurences ']) {
                    angular.forEach(response['NumOccurences '], function (occurenceArr, key) {
                        angular.forEach($scope.customer.ArrearDefaultlist, function (arrear) {
                            if(occurenceArr && occurenceArr.length) {
                                arrear.NumOccID = occurenceArr[0];
                                if(arrear.ArrDefID === occurenceArr[1]) {
                                    arrear.arreas12 = [];
                                    arrear.arreas12Month = [];
                                    arrear.arreas12Day = [];
                                    for(var j = 0; j < 12; j++) {
                                        arrear.arreas12.push(occurenceArr[j + 3]);
                                        var str = occurenceArr[j + 3] || "";
                                        arrear.arreas12Month.push(str.split(" / ")[1] + ' / ' + str.split(" / ")[
                                            2]);
                                        arrear.arreas12Day.push(str.split(" / ")[0]);
                                    }
                                    arrear.arreas24 = [];
                                    arrear.arreas24Month = [];
                                    arrear.arreas24Day = [];
                                    for(var j = 12; j < 24; j++) {
                                        arrear.arreas24.push(occurenceArr[j + 3]);
                                        var str = occurenceArr[j + 3] || "";
                                        arrear.arreas24Month.push(str.split(" / ")[1] + ' / ' + str.split(" / ")[
                                            2]);
                                        arrear.arreas24Day.push(str.split(" / ")[0]);
                                    }
                                    arrear.arreas36 = [];
                                    arrear.arreas36Month = [];
                                    arrear.arreas36Day = [];
                                    for(var j = 24; j < 36; j++) {
                                        arrear.arreas36.push(occurenceArr[j + 3]);
                                        var str = occurenceArr[j + 3] || "";
                                        arrear.arreas36Month.push(str.split(" / ")[1] + ' / ' + str.split(" / ")[
                                            2]);
                                        arrear.arreas36Day.push(str.split(" / ")[0]);
                                    }
                                    arrear.arreas72 = [];
                                    arrear.arreas72Month = [];
                                    arrear.arreas72Day = [];
                                    for(var j = 36; j < 72; j++) {
                                        arrear.arreas72.push(occurenceArr[j + 3]);
                                        var str = occurenceArr[j + 3] || "";
                                        arrear.arreas72Month.push(str.split(" / ")[1] + ' / ' + str.split(" / ")[
                                            2]);
                                        arrear.arreas72Day.push(str.split(" / ")[0]);
                                    }
                                }
                            }

                        });
                    });
                }
            });
        };
        var saveNumOccurences = function (details) {
            creditHistoryService.saveNumOccurencesDetail(details).then(function (response) {
                // console.log(response);
            });
        };
        $scope.deleteCH = function (chObj, api) {
            creditHistoryService.deleteCH(chObj, api).then(function (response) {
                if(api == 'DeleteCCJ') {
                    loadCCJDetails();
                } else if(api == 'DeleteArrearsDefaults') {
                    loadArrearDefaultDetails();
                    loadDefaultDetails();
                } else if(api == 'DeleteBankrupts') {
                    loadBankruptDetails();
                } else if(api == 'DeleteIVA') {
                    loadIVADetails();
                } else if(api == 'DeleteReposessions') {
                    loadRepossessionsDetails();
                }
            });
        };
        $scope.getApplicantTitle = function (titleID) {
            var etitle = _.findWhere($scope.titleList, { val: titleID });
            if(etitle) {
                return etitle.name;
            }
        };
        $scope.backButtonAction = function () {
            $rootScope.changeTab({
                state: 'app.dependant',
                title: 'Dependants',
                id: 'dependant'
            });
        };
        initialize();
    }
]);

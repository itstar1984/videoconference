'use strict';
factFindApp.controller('nonSourceEmploymentCtrl', ['$scope', '$rootScope', 'employmentService', 'firebaseService', 'localStorageService', '$firebaseObject', 'selectBoxService', 'quoteService', '$filter', 'toaster',
    function ($scope, $rootScope, employmentService, firebaseService, localStorageService, $firebaseObject, selectBoxService, quoteService, $filter, toaster) {
        $scope.setFieldTypingStatus = function (field, status) {
            var obj = {
                nonsourceEmpForm: {
                    field: field,
                    status: status
                },
            };
            firebaseService.saveTypingStatus(obj);
        };
        $scope.checkPartnerTyping = function (field) {
            var flg = false;
            if ($scope.typing.client && $scope.typing.client['nonsourceEmpForm']
                    && $scope.typing.client['nonsourceEmpForm']['field'] == field
                    && $scope.typing.client['nonsourceEmpForm']['status']) {
                flg = true;
            }
            return flg;
        };
        $scope.isTabActive = function (tab) {
            return angular.equals($scope.customer.activeApplicant, tab);
        };
        $scope.changeTab = function (tab) {
            $scope.customer.activeApplicant = tab;
        };
        $scope.isnonEmploymentActiveTab = function (tab) {
            return angular.equals($scope.customer.applicants[$scope.customer.activeApplicant]['activenonEmploymentTab'], tab);
        };
        $scope.setnonEmploymentTab = function (tab) {
            $scope.customer.applicants[$scope.customer.activeApplicant]['activenonEmploymentTab'] = tab;
        };
        $scope.changeTextBox = function (applicantId, field) {
            if (!angular.isDefined($scope.customer.applicants[applicantId]['Employment'][field])) {
                $scope.customer.applicants[applicantId]['Employment'][field] = null;
            }
        };
        $scope.changeDeductionTextField = function (obj) {
            if (!angular.isDefined(obj.Amount)) {
                obj.Amount = null;
            }
        }
        $scope.addChangeTextBox = function (applicantId, mainField, field) {
            if (!angular.isDefined($scope.customer.applicants[applicantId][mainField][field])) {
                $scope.customer.applicants[applicantId][mainField][field] = null;
            }
        };
        var objectifyDeductionArray = function (x) {
            return {
                DeductionID: x[0],
                clientID: x[1],
                FFID: x[2],
                EmploymentHeaderID: x[3],
                eDeductionID: x[4],
                Amount: x[5],
                xyz: x[6],
                name: x[7]
            };
        };
        var objectifyEmpShareArray = function (x) {
            return {
                EmpShareID: x[0],
                FFID: x[1],
                ClientID: x[2],
                IsShares: x[3],
                Turnover1: x[4],
                NetProfitBeforeTax1: x[5],
                ApplicantsDrawing1: x[6],
                ApplicantsDividends1: x[7],
                NetAssets1: x[8],
                Turnover2: x[9],
                NetProfitBeforeTax2: x[10],
                ApplicantsDrawing2: x[11],
                ApplicantsDividends2: x[12],
                NetAssets2: x[13],
                TurnOver3: x[14],
                NetProfitBeforeTax3: x[15],
                ApplicantsDrawing3: x[16],
                ApplicantsDividends3: x[17],
                NetAssets3: x[18]
            };
        };
        var initialize = function () {
            $scope.DeducationList = [{name: 'Pension', val: '1'}, {name: 'Child Care Voucher', val: '2'}, {name: 'Staff Loans', val: '3'}, {name: 'Student Loans', val: '4'}, {name: 'Healthcare', val: '5'}, {name: 'Sharesave', val: '6'}];
            $scope.newDeduction = {};
            $scope.customer = {};
            $scope.applicants = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];
            selectBoxService.geteAccountantQualifications().then(function (response) {
                $scope.AccountantQualifications = angular.copy(response);
            });
            var ref1 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/customer");
            var object = $firebaseObject(ref1);
            object.$bindTo($scope, 'customer');
            object.$loaded().then(function (data) {
                if (!$scope.customer.activeApplicant) {
                    $scope.customer.activeApplicant = 1;
                }
                if (!$scope.customer.applicants[1]['activenonEmploymentTab']) {
                    $scope.customer.applicants[1]['activenonEmploymentTab'] = 'employment';
                }
                if (!$scope.customer.applicants[2]['activenonEmploymentTab']) {
                    $scope.customer.applicants[2]['activenonEmploymentTab'] = 'employment';
                }
                if (!$scope.customer.applicants[3]['activenonEmploymentTab']) {
                    $scope.customer.applicants[3]['activenonEmploymentTab'] = 'employment';
                }
                if (!$scope.customer.applicants[4]['activenonEmploymentTab']) {
                    $scope.customer.applicants[4]['activenonEmploymentTab'] = 'employment';
                }
                if ($scope.customer.activeApplicant) {
                    getEmploymentDetails($scope.customer.activeApplicant);
                    $scope.customer.applicants[$scope.customer.activeApplicant]['isAnyDeducation'] = false;
                    $scope.customer.applicants[$scope.customer.activeApplicant]['IncomeDeductions'] = {};
                }
                angular.forEach($scope.customer.applicants, function (applicantData, key) {
                    $scope.customer.applicants[key]['isAnyDeducation'] = false;
                    $scope.customer.applicants[key]['IncomeDeductions'] = {};
                    if (!$scope.customer.applicants[key]['nonSourceEmp']) {
                        $scope.customer.applicants[key]['nonSourceEmp'] = {};
                    }
                });
            });
            var ref2 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            $scope.typing = $firebaseObject(ref2);

        };
        var getEmploymentDetails = function (index) {
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
            $scope.customer.applicants[index]['isAnyDeductions'] = false;
            $scope.customer.applicants[index]['IncomeDeductions'] = {};
            employmentService.getHeaderByDetails({FFID: $scope.customer.clientDetails.FFID, ClientID: $scope.customer.applicants[index]['ClientID']}).then(function (response) {
                if (response.EmploymentHeaderID) {
                    //$rootScope.tickTab('employmentandincome');
                    var empHeaderDetail = angular.copy(response);
                    $scope.customer.applicants[index]['EmploymentHeader']['EmploymentHeaderID'] = empHeaderDetail.EmploymentHeaderID;
                    $scope.customer.applicants[index]['EmploymentHeader']['EmpFullStatus'] = empHeaderDetail.EmpFullStatus;
                    $scope.customer.applicants[index]['EmploymentHeader']['TotalNetMonthlyIncome'] = empHeaderDetail.TotalNetMonthlyIncome;
                    $scope.customer.applicants[index]['EmploymentHeader']['EmployerName'] = empHeaderDetail.EmployerName;
                    $scope.customer.applicants[index]['EmploymentHeader']['EmployerAddressID'] = empHeaderDetail.EmployerAddressID;
                    $scope.customer.applicants[index]['EmploymentHeader']['MinEmployment'] = empHeaderDetail.MinEmployment;
                    employmentService.getAllEmploymentsDesc({EmploymentHeaderID: $scope.customer.applicants[index]['EmploymentHeaderID']}).then(function (response) {
                        if (response.length) {
                            var allEmpents = angular.copy(response);
                            var applicantEmp = angular.copy(allEmpents[index - 1]);
                            if (applicantEmp) {
                                $scope.customer.applicants[index]['Employment']['EmploymentID'] = applicantEmp.EmploymentID;
                                $scope.customer.applicants[index]['Employment']['EmploymentHeaderID'] = applicantEmp.EmploymentHeaderID;
                                $scope.customer.applicants[index]['Employment']['eEmploymentStatusID'] = applicantEmp.eEmploymentStatusID;
                                $scope.customer.applicants[index]['Employment']['EmploymentType'] = applicantEmp.EmploymentType;
                                $scope.customer.applicants[index]['Employment']['eOccupationID'] = applicantEmp.eOccupationID;
                                $scope.customer.applicants[index]['Employment']['eAccountantQualificationID'] = applicantEmp.eAccountantQualificationID;
                                $scope.customer.applicants[index]['Employment']['eEmpStatusDescription'] = applicantEmp.eEmpStatusDescription;
                                $scope.customer.applicants[index]['Employment']['eContractBasisDescription'] = applicantEmp.eContractBasisDescription;
                                $scope.customer.applicants[index]['Employment']['eOccupationDescription'] = applicantEmp.eOccupationDescription;
                                $scope.customer.applicants[index]['Employment']['eAccountantQualificationdesc'] = applicantEmp.eAccountantQualificationdesc;
                                $scope.customer.applicants[index]['Employment']['EmployerAddressID'] = applicantEmp.EmployerAddressID;
                                $scope.customer.applicants[index]['Employment']['CurrentEmployment'] = applicantEmp.CurrentEmployment;
                                $scope.customer.applicants[index]['Employment']['ProbationPeriod'] = applicantEmp.ProbationPeriod;
                                $scope.customer.applicants[index]['Employment']['ProbationPeriodDet'] = applicantEmp.ProbationPeriodDet;
                                $scope.customer.applicants[index]['Employment']['Benefits'] = applicantEmp.Benefits;
                                $scope.customer.applicants[index]['Employment']['BenefitsDet'] = applicantEmp.BenefitsDet;
                                $scope.customer.applicants[index]['Employment']['SelfCertAnnualIncome'] = applicantEmp.SelfCertAnnualIncome;
                                $scope.customer.applicants[index]['Employment']['UKTaxDomicile'] = applicantEmp.UKTaxDomicile;
                                $scope.customer.applicants[index]['Employment']['TaxCode'] = applicantEmp.TaxCode;
                                $scope.customer.applicants[index]['Employment']['HighRateTaxPerc'] = applicantEmp.HighRateTaxPerc;
                                if (applicantEmp.StartDate) {
                                    $scope.customer.applicants[index]['Employment']['StartDate'] = $filter('date')(applicantEmp.StartDate, 'MM/dd/yyyy');
                                }
                                if (applicantEmp.EndDate) {
                                    $scope.customer.applicants[index]['Employment']['EndDate'] = $filter('date')(applicantEmp.EndDate, 'MM/dd/yyyy');
                                }
                                $scope.customer.applicants[index]['Employment']['HRContactPerson'] = applicantEmp.HRContactPerson;
//                                employmentService.getEmployment({EmploymentID: applicantEmp.EmploymentID}).then(function (response) {
//                                    console.log(response);
//                                });
                            }
                        }
                    });
                    employmentService.GetAllDeductions({EmploymentHeaderID: empHeaderDetail.EmploymentHeaderID}).then(function (response) {
                        if (response.Deductions.length > 1) {
                            var deductions = [];
                            angular.forEach(response.Deductions, function (deduction) {
                                if (deduction) {
                                    var obj = objectifyDeductionArray(deduction);
                                    deductions.push(obj);
                                }
                            });
                            $scope.customer.applicants[index]['Deductions'] = angular.copy(deductions);
                        } else {
                            $scope.customer.applicants[index]['Deductions'] = [];
                        }
                    });
                }
            });
            employmentService.GetEmploymentShares({ClientID: $scope.customer.applicants[index]['ClientID']}).then(function (response) {
                if (response && response.EmploymentShares && response.EmploymentShares.length > 1) {
                    $rootScope.tickTab('nonSourceEmploymentandIncome');
                    var empShares = objectifyEmpShareArray(response.EmploymentShares[0]);
                    $scope.customer.applicants[index]['Employment']['EmpShareID'] = empShares.EmpShareID;
                    $scope.customer.applicants[index]['Employment']['IsShares'] = empShares.IsShares;
                    $scope.customer.applicants[index]['Employment']['Turnover1'] = empShares.Turnover1;
                    $scope.customer.applicants[index]['Employment']['NetProfitBeforeTax1'] = empShares.NetProfitBeforeTax1;
                    $scope.customer.applicants[index]['Employment']['ApplicantsDrawing1'] = empShares.ApplicantsDrawing1;
                    $scope.customer.applicants[index]['Employment']['ApplicantsDividends1'] = empShares.ApplicantsDividends1;
                    $scope.customer.applicants[index]['Employment']['NetAssets1'] = empShares.NetAssets1;
                    $scope.customer.applicants[index]['Employment']['Turnover2'] = empShares.Turnover2;
                    $scope.customer.applicants[index]['Employment']['NetProfitBeforeTax2'] = empShares.NetProfitBeforeTax2;
                    $scope.customer.applicants[index]['Employment']['ApplicantsDrawing2'] = empShares.ApplicantsDrawing2;
                    $scope.customer.applicants[index]['Employment']['ApplicantsDividends2'] = empShares.ApplicantsDividends2;
                    $scope.customer.applicants[index]['Employment']['NetAssets2'] = empShares.NetAssets2;
                    $scope.customer.applicants[index]['Employment']['TurnOver3'] = empShares.TurnOver3;
                    $scope.customer.applicants[index]['Employment']['NetProfitBeforeTax3'] = empShares.NetProfitBeforeTax3;
                    $scope.customer.applicants[index]['Employment']['ApplicantsDrawing3'] = empShares.ApplicantsDrawing3;
                    $scope.customer.applicants[index]['Employment']['ApplicantsDividends3'] = empShares.ApplicantsDividends3;
                    $scope.customer.applicants[index]['Employment']['NetAssets3'] = empShares.NetAssets3;
                } else {
                    $scope.customer.applicants[index]['Employment']['EmpShareID'] = '';
                    $scope.customer.applicants[index]['Employment']['IsShares'] = false;
                    $scope.customer.applicants[index]['Employment']['Turnover1'] = '';
                    $scope.customer.applicants[index]['Employment']['NetProfitBeforeTax1'] = '';
                    $scope.customer.applicants[index]['Employment']['ApplicantsDrawing1'] = '';
                    $scope.customer.applicants[index]['Employment']['ApplicantsDividends1'] = '';
                    $scope.customer.applicants[index]['Employment']['NetAssets1'] = '';
                    $scope.customer.applicants[index]['Employment']['Turnover2'] = '';
                    $scope.customer.applicants[index]['Employment']['NetProfitBeforeTax2'] = '';
                    $scope.customer.applicants[index]['Employment']['ApplicantsDrawing2'] = '';
                    $scope.customer.applicants[index]['Employment']['ApplicantsDividends2'] = '';
                    $scope.customer.applicants[index]['Employment']['NetAssets2'] = '';
                    $scope.customer.applicants[index]['Employment']['TurnOver3'] = '';
                    $scope.customer.applicants[index]['Employment']['NetProfitBeforeTax3'] = '';
                    $scope.customer.applicants[index]['Employment']['ApplicantsDrawing3'] = '';
                    $scope.customer.applicants[index]['Employment']['ApplicantsDividends3'] = '';
                    $scope.customer.applicants[index]['Employment']['NetAssets3'] = '';
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
        $scope.saveDeduction = function (newDeduction, index) {
            var deductionDetails = angular.copy(newDeduction);
            deductionDetails.FFID = $scope.customer.clientDetails.FFID;
            deductionDetails.ClientID = $scope.customer.applicants[index]['ClientID'];
            deductionDetails.EmploymentHeaderID = $scope.customer.applicants[index]['EmploymentHeaderID'];
            employmentService.SaveDeduction(deductionDetails).then(function (response) {
                toaster.pop({
                    type: 'success',
                    title: "Deducation Saved Successfully"
                });
                getEmploymentDetails(index);
            });
        };
        $scope.deleteDeducation = function (deduction, index) {
            employmentService.deleteDeduction(deduction).then(function (response) {
                toaster.pop({
                    type: 'success',
                    title: "Deducation Deleted Successfully"
                });
                getEmploymentDetails(index);
            });
        };
        $scope.saveEmployment = function (index) {
            var empDetails = angular.copy($scope.customer.applicants[index]['Employment']);
            empDetails.ClientID = $scope.customer.applicants[index]['ClientID'];
            empDetails.FFID = $scope.customer.clientDetails.FFID;
            empDetails.EmploymentHeaderID = $scope.customer.applicants[index]['EmploymentHeaderID'];
            empDetails.eOccupationID = 150;
            empDetails.EmploymentID = $scope.customer.applicants[index]['EmploymentID'];
            employmentService.saveEmployDetail(empDetails).then(function (response) {
                employmentService.SaveEmploymentShares(empDetails).then(function (response) {
                    getEmploymentDetails(index);
                    $scope.setnonEmploymentTab('Deductions');
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
        $scope.deductionTab = function (index) {
            if ($scope.customer.no_of_applicants === 1) {
                $rootScope.tickTab('nonSourceEmploymentandIncome');
                $rootScope.changeTab({
                    state: 'app.nonSourceProperty',
                    title: 'Non source Property Details',
                    id: 'nonSourceProperty'
                });
            } else {
                if (index === $scope.customer.no_of_applicants) {
                    $rootScope.tickTab('nonSourceEmploymentandIncome');
                    $rootScope.changeTab({
                        state: 'app.nonSourceProperty',
                        title: 'Non source Property Details',
                        id: 'nonSourceProperty'
                    });
//                    var Flag = false;
//                    angular.forEach($scope.customer.applicants, function (applicantData, key) {
//                        if (applicantData.ClientID && key < $scope.customer.no_of_applicants) {
//                            Flag = true;
//                        }
//                    });
//                    if (!Flag) {
//                        $rootScope.tickTab('nonSourceEmploymentandIncome');
//                        $rootScope.changeTab({
//                            state: 'app.nonSourceProperty',
//                            title: 'Non source Property Details',
//                            id: 'nonSourceProperty'
//                        });
//                    } else {
//                        $rootScope.removeTickTab('nonSourceEmploymentandIncome');
//                        toaster.pop('Warning', 'Please fill up other applicant Data');
//                    }
                } else {
                    $scope.changeTab(index + 1);
                }
            }
        };
        $scope.backButtonAction = function (index) {
            if (index > 1) {
                $scope.changeTab(index - 1);
            } else {
                $rootScope.changeTab({
                    state: 'app.nonSourceApplicant',
                    title: 'Non source Applicants',
                    id: 'nonSourceApplicant'
                });
            }
        };
        $scope.backButtonActionTabs = function () {
            $scope.setnonEmploymentTab('employment');
        };
        initialize();
    }]);


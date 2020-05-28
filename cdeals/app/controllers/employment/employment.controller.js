'use strict';

factFindApp.controller('employmentCtrl', ['$scope', '$rootScope', '$filter', 'selectBoxService', 'localStorageService', '$firebaseObject', 'firebaseService', 'employmentService', 'toaster',
    function ($scope, $rootScope, $filter, selectBoxService, localStorageService, $firebaseObject, firebaseService, employmentService, toaster) {
        $scope.setFieldTypingStatus = function (field, status) {
            var obj = {
                employmentForm: {
                    field: field,
                    status: status
                },
            };
            firebaseService.saveTypingStatus(obj);
        };
        $scope.checkPartnerTyping = function (field) {
            var flg = false;
            if ($scope.typing.consultant && $scope.typing.consultant['employmentForm']
                    && $scope.typing.consultant['employmentForm']['field'] == field
                    && $scope.typing.consultant['employmentForm']['status']) {
                flg = true;
            }
            return flg;
        };
        $scope.changeTextField = function (applicantId, masterfieldName, fieldName) {
            if (!angular.isDefined($scope.customer.applicants[applicantId][masterfieldName][fieldName])) {
                $scope.customer.applicants[applicantId][masterfieldName][fieldName] = null;
            }
        };
        $scope.changeBenifitTextField = function (obj) {
            if (!angular.isDefined(obj.Amount)) {
                obj.Amount = null;
            }
        };
        $scope.isTabActive = function (tab) {
            return angular.equals($scope.customer.activeApplicant, tab);
        };
        $scope.changeTab = function (tab) {
            $scope.customer.activeApplicant = tab;
            getEmploymentDetails(tab);
        };
        $scope.isEmploymentActiveTab = function (tab) {
            return angular.equals($scope.customer.applicants[$scope.customer.activeApplicant]['activeEmploymentTab'], tab);
        };
        $scope.setEmploymentTab = function (tab) {
            $scope.customer.applicants[$scope.customer.activeApplicant]['activeEmploymentTab'] = tab;
        };
        var getIncomeOther = function (index) {
            employmentService.GetIncomeOtherByEmploymentHeaderID({EmploymentHeaderID: $scope.customer.applicants[index]['EmploymentHeaderID']}).then(function (response) {
                if (response.OtherIncomeID) {
                    var otherIncome = angular.copy(response);
                    $scope.customer.applicants[index]['OtherIncomeID'] = otherIncome.OtherIncomeID;
                    $scope.customer.applicants[index]['EmploymentHeaderID'] = otherIncome.EmploymentHeaderID;
                    $scope.customer.applicants[index]['Pension'] = otherIncome.Pension;
                    $scope.customer.applicants[index]['Investments'] = otherIncome.Investments;
                    $scope.customer.applicants[index]['SecondJob'] = otherIncome.SecondJob;
                    $scope.customer.applicants[index]['BedroomRental'] = otherIncome.BedroomRental;
                    $scope.customer.applicants[index]['Other'] = otherIncome.Other;
                }
            });
        };
        $scope.saveEmployment = function (customers, index) {
            var employDetails = angular.copy(customers);
            var empHeaderDetails = angular.copy(employDetails.EmploymentHeader);
            empHeaderDetails.FFID = $scope.customer.clientDetails.FFID;
            empHeaderDetails.ClientID = $scope.customer.applicants[index]['ClientID'];
            empHeaderDetails.AppID = $scope.customer.clientDetails.AppID;
            empHeaderDetails.EmploymentHeaderID = $scope.customer.applicants[index]['EmploymentHeaderID'];
            empHeaderDetails.EmploymentID = $scope.customer.applicants[index]['EmploymentID'];
            employmentService.saveHeaderDetail(empHeaderDetails).then(function (response) {
                if (response.EmploymentHeaderID) {
                    $scope.customer.applicants[index]['EmploymentHeaderID'] = response.EmploymentHeaderID;
                }
                var emplomentDetails = angular.copy(employDetails.Employment);
                emplomentDetails.ClientID = $scope.customer.applicants[index]['ClientID'];
                emplomentDetails.EmploymentHeaderID = $scope.customer.applicants[index]['EmploymentHeaderID'];
                emplomentDetails.EmploymentID = $scope.customer.applicants[index]['EmploymentID'];
                emplomentDetails.StartDate = (emplomentDetails.StartDate) ? moment(moment(emplomentDetails.StartDate, 'DD-MM-YYYY')).format('MM/DD/YYYY')  : '';
                emplomentDetails.EndDate = (emplomentDetails.EndDate) ? moment(moment(emplomentDetails.EndDate, 'DD-MM-YYYY')).format('MM/DD/YYYY')  : '';
                employmentService.saveEmployDetail(emplomentDetails).then(function (response) {
                    if (response.EmploymentID) {
                        $scope.customer.applicants[index]['EmploymentID'] = response.EmploymentID;
                    }
                    if ($scope.customer.applicants[index]['activeEmploymentTab'] === 'employment') {
                        if (emplomentDetails.eEmploymentStatusID == 5 || emplomentDetails.eEmploymentStatusID == 6) {
                            $scope.customer.applicants[index]['activeEmploymentTab'] = 'additionalIncome';
                        } else {
                            $scope.customer.applicants[index]['activeEmploymentTab'] = 'incomeEmployed';
                        }

                    }
                    getEmploymentDetails(index);
                });
            });
        };
        $scope.changeIncomeTextField = function (applicantId, masterfieldName, fieldName) {
            if (!angular.isDefined($scope.customer.applicants[applicantId][masterfieldName][fieldName])) {
                $scope.customer.applicants[applicantId][masterfieldName][fieldName] = null;
            }
            var grossAnnual = 0;
            if ($scope.customer.applicants[applicantId]['IncomeEmpDetail']['BasicAnnualGuaranteed']) {
                grossAnnual += parseFloat($scope.customer.applicants[applicantId]['IncomeEmpDetail']['BasicAnnualGuaranteed']);
            }
            if ($scope.customer.applicants[applicantId]['IncomeEmpDetail']['IrregularIncome']) {
                grossAnnual += parseFloat($scope.customer.applicants[applicantId]['IncomeEmpDetail']['IrregularIncome']);
            }
            if ($scope.customer.applicants[applicantId]['IncomeEmpDetail']['GuaranteedBonus']) {
                grossAnnual += parseFloat($scope.customer.applicants[applicantId]['IncomeEmpDetail']['GuaranteedBonus']);
            }
            if ($scope.customer.applicants[applicantId]['IncomeEmpDetail']['GuaranteedOvertime']) {
                grossAnnual += parseFloat($scope.customer.applicants[applicantId]['IncomeEmpDetail']['GuaranteedOvertime']);
            }
            if ($scope.customer.applicants[applicantId]['IncomeEmpDetail']['RegularBonus']) {
                grossAnnual += parseFloat($scope.customer.applicants[applicantId]['IncomeEmpDetail']['RegularBonus']);
            }
            if ($scope.customer.applicants[applicantId]['IncomeEmpDetail']['RentalAllowance']) {
                grossAnnual += parseFloat($scope.customer.applicants[applicantId]['IncomeEmpDetail']['RentalAllowance']);
            }
            $scope.customer.applicants[applicantId]['IncomeEmpDetail']['GrossAnnualIncome'] = parseFloat(grossAnnual);
        };

        $scope.incomeSelfEmployed = function (detail, index) {
            if ($scope.customer.applicants[index]['Employment']['eEmploymentStatusID'] === 2 || $scope.customer.applicants[index]['Employment']['eEmploymentStatusID'] === 4) {
                var employDetails = angular.copy(detail);
                var selfHeaderEmployDetail = angular.copy($scope.customer.applicants[index]['EmploymentHeader']);
                selfHeaderEmployDetail.ClientID = $scope.customer.applicants[index]['ClientID'];
                selfHeaderEmployDetail.FFID = $scope.customer.clientDetails.FFID;
                selfHeaderEmployDetail.AppID = $scope.customer.clientDetails.AppID;
                selfHeaderEmployDetail.EmploymentHeaderID = $scope.customer.applicants[index]['EmploymentHeaderID'];
                employmentService.SaveEmploymentHeader(selfHeaderEmployDetail).then(function (response) {
                    employmentService.getSelfDetailsByEmploymentID({EmploymentID: $scope.customer.applicants[index]['EmploymentID']}).then(function (response) {
                        if (response.length) {
                            var allSelfEmployed = angular.copy(response);
                            angular.forEach(allSelfEmployed, function (selfItem) {
                                employmentService.DeleteincomeSelfEmp(selfItem).then(function (response) {

                                });
                            });
                        }
                    });
                    var IncomeSelfEmpDetail = angular.copy(employDetails.IncomeSelfEmpDetail);
                    var row = {
                        ClientID: $scope.customer.applicants[index]['ClientID'],
                        EmploymentID: $scope.customer.applicants[index]['EmploymentID'],
                        EmploymentHeaderID: $scope.customer.applicants[index]['EmploymentHeaderID'],
                        FFID: $scope.customer.clientDetails.FFID,
                        AppID: $scope.customer.clientDetails.AppID
                    };
                    var currentProjection = angular.copy(row);
                    currentProjection.eSelfEmpYearID = 1;
                    currentProjection.NetProfitOrLoss = IncomeSelfEmpDetail.currentYearProjection;
                    employmentService.SaveSelfEmployed(currentProjection).then(function (response) {
//                            if (response.IncomeSelfEmpDetailID) {
//                                $scope.customer.applicants[index]['IncomeSelfEmpDetailID1'] = response.IncomeSelfEmpDetailID;
//                            }
                        getEmploymentDetails(index);
                        if ($scope.customer.applicants[index]['activeEmploymentTab'] === 'incomeEmployed') {
                            $scope.customer.applicants[index]['activeEmploymentTab'] = 'additionalIncome';
                        }
                    });
                    if (selfHeaderEmployDetail.eAccountsAvailableID === 1) {
                        var firstRow = angular.copy(row);
                        firstRow.eSelfEmpYearID = 2;
                        firstRow.NetProfitOrLoss = IncomeSelfEmpDetail.NetProfitOrLoss;
                        //firstRow.IncomeSelfEmpDetailID = $scope.customer.applicants[index]['IncomeSelfEmpDetailID1'];
                        employmentService.SaveSelfEmployed(firstRow).then(function (response) {
//                            if (response.IncomeSelfEmpDetailID) {
//                                $scope.customer.applicants[index]['IncomeSelfEmpDetailID1'] = response.IncomeSelfEmpDetailID;
//                            }
                            getEmploymentDetails(index);
                            if ($scope.customer.applicants[index]['activeEmploymentTab'] === 'incomeEmployed') {
                                $scope.customer.applicants[index]['activeEmploymentTab'] = 'additionalIncome';
                            }
                        });
                    }
                    if (selfHeaderEmployDetail.eAccountsAvailableID === 2) {
                        var firstRow = angular.copy(row);
                        firstRow.eSelfEmpYearID = 2;
                        firstRow.NetProfitOrLoss = IncomeSelfEmpDetail.NetProfitOrLoss;
                        //firstRow.IncomeSelfEmpDetailID = $scope.customer.applicants[index]['IncomeSelfEmpDetailID1'];
                        employmentService.SaveSelfEmployed(firstRow).then(function (response) {
//                            if (response.IncomeSelfEmpDetailID) {
//                                $scope.customer.applicants[index]['IncomeSelfEmpDetailID1'] = response.IncomeSelfEmpDetailID;
//                            }
                            var secondRow = angular.copy(row);
                            secondRow.eSelfEmpYearID = 3;
                            secondRow.NetProfitOrLoss = IncomeSelfEmpDetail.NetProfit1YearBack;
                            //firstRow.IncomeSelfEmpDetailID = $scope.customer.applicants[index]['IncomeSelfEmpDetailID2'];
                            employmentService.SaveSelfEmployed(secondRow).then(function (response) {
//                                if (response.IncomeSelfEmpDetailID) {
//                                    $scope.customer.applicants[index]['IncomeSelfEmpDetailID2'] = response.IncomeSelfEmpDetailID;
//                                }
                                getEmploymentDetails(index);
                                if ($scope.customer.applicants[index]['activeEmploymentTab'] === 'incomeEmployed') {
                                    $scope.customer.applicants[index]['activeEmploymentTab'] = 'additionalIncome';
                                }
                            });
                        });
                    }
                    if (selfHeaderEmployDetail.eAccountsAvailableID === 3) {
                        var firstRow = angular.copy(row);
                        firstRow.eSelfEmpYearID = 2;
                        firstRow.NetProfitOrLoss = IncomeSelfEmpDetail.NetProfitOrLoss;
                        //firstRow.IncomeSelfEmpDetailID = $scope.customer.applicants[index]['IncomeSelfEmpDetailID1'];
                        employmentService.SaveSelfEmployed(firstRow).then(function (response) {
//                            if (response.IncomeSelfEmpDetailID) {
//                                $scope.customer.applicants[index]['IncomeSelfEmpDetailID1'] = response.IncomeSelfEmpDetailID;
//                            }
                            var secondRow = angular.copy(row);
                            secondRow.eSelfEmpYearID = 3;
                            secondRow.NetProfitOrLoss = IncomeSelfEmpDetail.NetProfit1YearBack;
                            //secondRow.IncomeSelfEmpDetailID = $scope.customer.applicants[index]['IncomeSelfEmpDetailID2'];
                            employmentService.SaveSelfEmployed(secondRow).then(function (response) {
//                                if (response.IncomeSelfEmpDetailID) {
//                                    $scope.customer.applicants[index]['IncomeSelfEmpDetailID2'] = response.IncomeSelfEmpDetailID;
//                                }
                                var thirdRow = angular.copy(row);
                                thirdRow.eSelfEmpYearID = 4;
                                thirdRow.NetProfitOrLoss = IncomeSelfEmpDetail.NetProfit2YearBack;
                                //thirdRow.IncomeSelfEmpDetailID = $scope.customer.applicants[index]['IncomeSelfEmpDetailID3'];
                                employmentService.SaveSelfEmployed(thirdRow).then(function (response) {
//                                    if (response.IncomeSelfEmpDetailID) {
//                                        $scope.customer.applicants[index]['IncomeSelfEmpDetailID3'] = response.IncomeSelfEmpDetailID;
//                                    }
                                    getEmploymentDetails(index);
                                    if ($scope.customer.applicants[index]['activeEmploymentTab'] === 'incomeEmployed') {
                                        $scope.customer.applicants[index]['activeEmploymentTab'] = 'additionalIncome';
                                    }
                                });
                            });
                        });
                    }
                });
            } else {
                var employDetails = angular.copy(detail);
                var IncomeEmpDetail = angular.copy(employDetails.IncomeEmpDetail);
                IncomeEmpDetail.FFID = $scope.customer.clientDetails.FFID;
                IncomeEmpDetail.AppID = $scope.customer.clientDetails.AppID;
                IncomeEmpDetail.ClientID = $scope.customer.applicants[index]['ClientID'];
                IncomeEmpDetail.EmploymentID = $scope.customer.applicants[index]['EmploymentID'];
                IncomeEmpDetail.IncomeEmpDetailID = $scope.customer.applicants[index]['IncomeEmpDetailID'];
                employmentService.saveEmpIncome(IncomeEmpDetail).then(function (response) {
                    if (response.IncomeEmpDetailID) {
                        $scope.customer.applicants[index]['IncomeEmpDetailID'] = response.IncomeEmpDetailID;
                    }
                    var headerEmployDetail = angular.copy(employDetails.EmploymentHeader);
                    headerEmployDetail.FFID = $scope.customer.clientDetails.FFID;
                    headerEmployDetail.AppID = $scope.customer.clientDetails.AppID;
                    headerEmployDetail.ClientID = $scope.customer.applicants[index]['ClientID'];
                    headerEmployDetail.EmploymentHeaderID = $scope.customer.applicants[index]['EmploymentHeaderID'];
                    employmentService.SaveEmploymentHeader(headerEmployDetail).then(function (response) {
                        getEmploymentDetails(index);
                        if ($scope.customer.applicants[index]['activeEmploymentTab'] === 'incomeEmployed') {
                            $scope.customer.applicants[index]['activeEmploymentTab'] = 'additionalIncome';
                        }
                    });
                });
            }
        };
        $scope.otherAdditionIncome = function (detail, index) {
            var employDetails = angular.copy(detail);
            if (employDetails.IncomeOther) {
                var otherEmpDetail = angular.copy(employDetails.IncomeOther);
                otherEmpDetail.IsSourcingRefreshRequired = true;
                otherEmpDetail.FFID = $scope.customer.clientDetails.FFID;
                otherEmpDetail.AppID = $scope.customer.clientDetails.AppID;
                otherEmpDetail.ClientID = $scope.customer.applicants[index]['ClientID'];
                otherEmpDetail.EmploymentHeaderID = $scope.customer.applicants[index]['EmploymentHeaderID'];
                otherEmpDetail.OtherIncomeID = $scope.customer.applicants[index]['OtherIncomeID'];
                employmentService.SaveIncomeOther(otherEmpDetail).then(function (response) {
                    if (response.OtherIncomeID) {
                        getIncomeOther(index);
                        //$scope.customer.applicants[index]['OtherIncomeID'] = response.OtherIncomeID;
                    }
                    if ($scope.customer.applicants[index]['activeEmploymentTab'] === 'additionalIncome') {
                        $scope.customer.applicants[index]['activeEmploymentTab'] = 'benifits';
                    }
                });
            } else {
                if ($scope.customer.applicants[index]['activeEmploymentTab'] === 'additionalIncome') {
                    $scope.customer.applicants[index]['activeEmploymentTab'] = 'benifits';
                }
            }
        };
        $scope.saveBenifit = function (data, index) {
            var benifitDetails = angular.copy(data);
            benifitDetails.FFID = $scope.customer.clientDetails.FFID;
            benifitDetails.AppID = $scope.customer.clientDetails.AppID;
            benifitDetails.ClientID = $scope.customer.applicants[index]['ClientID'];
            benifitDetails.IsSourcingRefreshRequired = true;
            benifitDetails.EmploymentHeaderID = $scope.customer.applicants[index]['EmploymentHeaderID'];
            benifitDetails.IncomeBenefitID = data.IncomeBenefitID;
            employmentService.SaveBenefits(benifitDetails).then(function (response) {
                if (response && !response.Message) {
                    toaster.pop({
                        type: 'success',
                        title: "Benifit Added Successfully"
                    });
                    delete $scope.customer.applicants[index]['IncomeBenefits'];
                    $scope.customer.applicants[$scope.customer.activeApplicant]['isAnyBenifits'] = !$scope.customer.applicants[$scope.customer.activeApplicant]['isAnyBenifits'];
                    getBenifts(benifitDetails.EmploymentHeaderID);
                }
            });
        };
        $scope.updateBenifit = function (data, index) {
            var benifitDetails = angular.copy(data);
            benifitDetails.FFID = $scope.customer.clientDetails.FFID;
            benifitDetails.AppID = $scope.customer.clientDetails.AppID;
            benifitDetails.ClientID = $scope.customer.applicants[index]['ClientID'];
            benifitDetails.IsSourcingRefreshRequired = true;
            benifitDetails.EmploymentHeaderID = $scope.customer.applicants[index]['EmploymentHeaderID'];
            benifitDetails.IncomeBenefitID = data.IncomeBenefitID;
            employmentService.SaveBenefits(benifitDetails).then(function (response) {
                if (response && !response.Message) {
                    toaster.pop({
                        type: 'success',
                        title: "Benifit update Successfully"
                    });
                    delete $scope.customer.applicants[index]['IncomeBenefits'];
                    getBenifts(benifitDetails.EmploymentHeaderID);
                }
            });
        };
        $scope.deleteBenift = function (detail) {
            var deleteDetails = angular.copy(detail);
            employmentService.deleteBenefits(deleteDetails).then(function (response) {
                if (response) {
                    toaster.pop({
                        type: 'success',
                        title: "Benifit Deleted Successfully"
                    });
                    getBenifts(deleteDetails.EmploymentHeaderID);
                }
            });
        };
        $scope.benifitTab = function () {
            if ($scope.customer.no_of_applicants === 1) {
                $rootScope.changeTab({
                    state: 'app.sourcenow',
                    title: 'Source Now',
                    id: 'sourcenow'
                });
            } else {
                if (($scope.customer.activeApplicant + 1) > $scope.customer.no_of_applicants) {
                    // Last Applicant
                    var Flag = false;
                    angular.forEach($scope.customer.applicants, function (applicantData, key) {
                        if (!applicantData.EmploymentHeaderID && applicantData.ClientID && key <= $scope.customer.no_of_applicants) {

                            Flag = true;
                        }
                    });
                    if (!Flag) {
                        $rootScope.tickTab('employmentandincome');
                        $rootScope.changeTab({
                            state: 'app.sourcenow',
                            title: 'Source Now',
                            id: 'sourcenow'
                        });
                    } else {
                        toaster.pop('warning', 'Please fill up other applicant form');
                    }

                } else {
                    $scope.changeTab($scope.customer.activeApplicant + 1);
                    $scope.setEmploymentTab('employment');
                }
            }

        };
        var getEmploymentDetails = function (index) {
            employmentService.getHeaderByDetails({FFID: $scope.customer.clientDetails.FFID, ClientID: $scope.customer.applicants[index]['ClientID']}).then(function (response) {
                if (response.EmploymentHeaderID) {
                    $rootScope.tickTab('employmentandincome');
                    var empHeaderDetail = angular.copy(response);
                    $scope.customer.applicants[index]['EmploymentHeaderID'] = empHeaderDetail.EmploymentHeaderID;
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
                                $scope.customer.applicants[index]['EmploymentID'] = applicantEmp.EmploymentID;
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
                                    $scope.customer.applicants[index]['Employment']['StartDate'] = $filter('date')(applicantEmp.StartDate, 'dd/MM/yyyy');
                                }
                                if (applicantEmp.EndDate) {
                                    $scope.customer.applicants[index]['Employment']['EndDate'] = $filter('date')(applicantEmp.EndDate, 'dd/MM/yyyy');
                                }
                                $scope.customer.applicants[index]['Employment']['HRContactPerson'] = applicantEmp.HRContactPerson;

                            }
                            employmentService.getDetailsByEmploymentID({EmploymentID: $scope.customer.applicants[index]['EmploymentID']}).then(function (response) {
                                if (response.IncomeEmpDetailID) {
                                    var incomeDetail = angular.copy(response);
                                    $scope.customer.applicants[index]['IncomeEmpDetail']['IncomeEmpDetailID'] = incomeDetail.IncomeEmpDetailID;
                                    $scope.customer.applicants[index]['IncomeEmpDetail']['EmploymentID'] = incomeDetail.EmploymentID;
                                    $scope.customer.applicants[index]['IncomeEmpDetail']['BasicAnnualGuaranteed'] = incomeDetail.BasicAnnualGuaranteed;
                                    $scope.customer.applicants[index]['IncomeEmpDetail']['GuaranteedOvertime'] = incomeDetail.GuaranteedOvertime;
                                    $scope.customer.applicants[index]['IncomeEmpDetail']['GuaranteedBonus'] = incomeDetail.GuaranteedBonus;
                                    $scope.customer.applicants[index]['IncomeEmpDetail']['RegularBonus'] = incomeDetail.RegularBonus;
                                    $scope.customer.applicants[index]['IncomeEmpDetail']['IrregularIncome'] = incomeDetail.IrregularIncome;
                                    $scope.customer.applicants[index]['IncomeEmpDetail']['RentalAllowance'] = incomeDetail.RentalAllowance;
                                    $scope.customer.applicants[index]['IncomeEmpDetail']['CarAllowance'] = incomeDetail.CarAllowance;
                                    $scope.customer.applicants[index]['IncomeEmpDetail']['MortgageSubsidy'] = incomeDetail.MortgageSubsidy;
                                }
                                if ($scope.customer.applicants[index]['Employment']['eEmploymentStatusID'] === 2 || $scope.customer.applicants[index]['Employment']['eEmploymentStatusID'] === 4) {
                                    employmentService.getSelfDetailsByEmploymentID({EmploymentID: $scope.customer.applicants[index]['EmploymentID']}).then(function (response) {
                                        if (response.length) {
                                            var allSelfEmployed = angular.copy(response);
                                            $scope.customer.applicants[index]['IncomeSelfEmpDetail']['EmploymentID'] = $scope.customer.applicants[index]['EmploymentID'];
                                            angular.forEach(allSelfEmployed, function (incomeSelfEmployed) {
                                                if (incomeSelfEmployed.eSelfEmpYearID === 1) {
                                                    $scope.customer.applicants[index]['IncomeSelfEmpDetailID1'] = incomeSelfEmployed.IncomeSelfEmpDetailID;
                                                    $scope.customer.applicants[index]['IncomeSelfEmpDetail']['currentYearProjection'] = incomeSelfEmployed.NetProfitOrLoss;
                                                }
                                                if (incomeSelfEmployed.eSelfEmpYearID === 2) {
                                                    $scope.customer.applicants[index]['IncomeSelfEmpDetailID2'] = incomeSelfEmployed.IncomeSelfEmpDetailID;
                                                    $scope.customer.applicants[index]['IncomeSelfEmpDetail']['NetProfitOrLoss'] = incomeSelfEmployed.NetProfitOrLoss;
                                                }
                                                if (incomeSelfEmployed.eSelfEmpYearID === 3) {
                                                    $scope.customer.applicants[index]['IncomeSelfEmpDetailID3'] = incomeSelfEmployed.IncomeSelfEmpDetailID;
                                                    $scope.customer.applicants[index]['IncomeSelfEmpDetail']['NetProfit1YearBack'] = incomeSelfEmployed.NetProfitOrLoss;
                                                }
                                                if (incomeSelfEmployed.eSelfEmpYearID === 4) {
                                                    $scope.customer.applicants[index]['IncomeSelfEmpDetailID4'] = incomeSelfEmployed.IncomeSelfEmpDetailID;
                                                    $scope.customer.applicants[index]['IncomeSelfEmpDetail']['NetProfit2YearBack'] = incomeSelfEmployed.NetProfitOrLoss;
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                    getBenifts(response.EmploymentHeaderID);
                }
            });
        };
        var getBenifts = function (EmploymentHeaderID) {
            employmentService.GetAllIncomeBenefits({EmploymentHeaderID: EmploymentHeaderID}).then(function (response) {
                if (response.IncomeBenefitsDesc) {
                    $scope.customer.applicants[$scope.customer.activeApplicant]['benifits'] = objectifyArray(response.IncomeBenefitsDesc);
                }
            });
        };
        var objectifyArray = function (response) {
            var sortedArray = response.sort();
            sortedArray.splice(sortedArray.length - 1, 1);
            var objs = sortedArray.map(function (x) {
                return {
                    IncomeBenefitID: x[0],
                    EmploymentHeaderID: x[1],
                    eBenefitTypeID: x[2],
                    eBenefitTypeDesc: x[3],
                    Amount: x[4]
                };
            });
            return objs;
        };
        var initialize = function () {
            selectBoxService.geteEmploymentStatuses().then(function (response) {
                $scope.employList = angular.copy(response);
            });
            selectBoxService.geteAccounts_Available().then(function (response) {
                $scope.accountList = angular.copy(response);
            });
            selectBoxService.geteBenefitTypes().then(function (response) {
                $scope.benifitsList = angular.copy(response);
            });
            
            $scope.monthList = [{name: 'Less than 1', val: '0'}, {name: '1', val: '1'}, {name: '3', val: '3'}, {name: '6', val: '6'}, {name: '12', val: '12'}, {name: '18', val: '18'}, {name: '24', val: '24'}, {name: '36', val: '36'}, {name: '99', val: '99'}];
            $scope.customer = {};
            var ref1 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/customer");
            var object = $firebaseObject(ref1);
            object.$bindTo($scope, 'customer');
            var ref2 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            $scope.typing = $firebaseObject(ref2);
            object.$loaded(function () {
                if (!$scope.customer.applicants[1]['activeEmploymentTab']) {
                    $scope.customer.applicants[1]['activeEmploymentTab'] = 'employment';
                }
                if (!$scope.customer.applicants[2]['activeEmploymentTab']) {
                    $scope.customer.applicants[2]['activeEmploymentTab'] = 'employment';
                }
                if (!$scope.customer.applicants[3]['activeEmploymentTab']) {
                    $scope.customer.applicants[3]['activeEmploymentTab'] = 'employment';
                }
                if (!$scope.customer.applicants[4]['activeEmploymentTab']) {
                    $scope.customer.applicants[4]['activeEmploymentTab'] = 'employment';
                }
                if ($scope.customer.activeApplicant) {
                    getEmploymentDetails($scope.customer.activeApplicant);
                }
            });
        };
        $scope.backButtonAction = function (index) {
            if (index > 1) {
                $scope.changeTab(index - 1);
            } else {
                $rootScope.changeTab({
                    state: 'app.property',
                    title: 'Property Details',
                    id: 'property'
                });
            }

        };
        $scope.backButtonActionForTabs = function (action) {
            if (action === 'incomeEmployed') {
                $scope.setEmploymentTab('employment');
            } else if (action === 'additionalIncome') {
                if ($scope.customer.applicants[$scope.customer.activeApplicant]['Employment']['eEmploymentStatusID'] == 5 || $scope.customer.applicants[$scope.customer.activeApplicant]['Employment']['eEmploymentStatusID'] == 6) {
                    $scope.setEmploymentTab('employment');
                } else {
                    $scope.setEmploymentTab('incomeEmployed');
                }
            } else if (action === 'benifits') {
                $scope.setEmploymentTab('additionalIncome');
            }
        };
        $scope.occupationSearch = function(hint){ 
            if(!hint){
                $scope.occupationStatus = false;    
            }else{
                $scope.occupationStatus = true;    
            }
            employmentService.getOccupatons(hint).then(function (response){
                $scope.occupations = angular.copy(response);
            });
        };
        $scope.fillTextbox = function(occupation_desc,occupation_id)
        {
            $scope.customer.applicants[$scope.customer.activeApplicant]['Employment']['eOccupationID'] = occupation_id;
            $scope.customer.applicants[$scope.customer.activeApplicant]['Employment']['eOccupationDescription'] = occupation_desc; 
            $scope.occupations = null;
            $scope.occupationStatus = false;
        };

        initialize();
    }]);



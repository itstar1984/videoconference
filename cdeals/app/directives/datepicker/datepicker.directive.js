'use strict';

factFindApp.directive('ngDatepicker', [function () {
        return {
            restrict: 'EA',
            require: '?ngModel',
            scope: {
                startDate: '=ngModel',
                maxDate: '=maxDate',
                minDate: '=minDate'
            },
            link: function (scope, element, attrs, ngModel) {
                element.mask("99/99/9999", {placeholder: 'DD/MM/YYYY'});
                element.daterangepicker({
                    locale: {
                        format: 'DD/MM/YYYY'
                    },
                    showDropdowns: true,
                    singleDatePicker: true,
                    startDate: moment(),
                    endDate: scope.endDate || moment(),
                    minDate: new Date(1, 1, 1),
                    autoUpdateInput: false
                            //maxDate: '+30Y',
                }).on("apply.daterangepicker", function (e, picker) {
                    picker.element.val(moment(picker.startDate).format('DD/MM/YYYY'));
                    ngModel.$setViewValue(moment(picker.startDate).format('DD/MM/YYYY'));
                    scope.$apply();
                });
//                
            }
        };
    }]);

factFindApp.directive('ngOccudatepicker', [function () {
        return {
            restrict: 'EA',
            require: '?ngModel',
            scope: {
                startDate: '=ngModel',
                maxDate: '=maxDate',
                minDate: '=minDate'
            },
            link: function (scope, element, attrs, ngModel) {
                element.mask("99/99/9999", {placeholder: 'DD/MM/YYYY'});
                element.daterangepicker({
                    locale: {
                        format: 'DD/MM/YYYY'
                    },
                    showDropdowns: true,
                    singleDatePicker: true,
                    startDate: moment(),
                    endDate: scope.endDate || moment(),
                    minDate: moment().subtract(72, 'months'),
                    maxDate: moment(),
                    autoUpdateInput: false
                }).on("apply.daterangepicker", function (e, picker) {
                    picker.element.val(moment(picker.startDate).format('DD/MM/YYYY'));
                    ngModel.$setViewValue(moment(picker.startDate).format('DD/MM/YYYY'));
                    scope.$apply();
                });

            }
        };
    }]);

factFindApp.directive('ngDobDatepicker', [function () {
        return {
            restrict: 'EA',
            require: '?ngModel',
            scope: {
                startDate: '=ngModel',
                maxDate: '=maxDate',
                minDate: '=minDate'
            },
            link: function (scope, element, attrs, ngModel) {
                element.mask("99/99/9999", {placeholder: 'DD/MM/YYYY'});
                element.daterangepicker({
                    locale: {
                        format: 'DD/MM/YYYY'
                    },
                    showDropdowns: true,
                    singleDatePicker: true,
                    startDate: moment(),
                    endDate: scope.endDate || moment(),
                    minDate: new Date(1, 1, 1),
                    //maxDate: moment().subtract(18, 'years'),
                    autoUpdateInput: false
                }).on("apply.daterangepicker", function (e, picker) {
                    picker.element.val(moment(picker.startDate).format('DD/MM/YYYY'));
                    ngModel.$setViewValue(moment(picker.startDate).format('DD/MM/YYYY'));
                    scope.$apply();
                });

            }
        };
    }]);
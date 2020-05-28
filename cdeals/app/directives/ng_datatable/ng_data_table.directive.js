'use strict';
factFindApp.directive('ngDataTable', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            scope: {
            },
            link: function postLink(scope, element, attrs) {
                var dataTableDom;
                var drawTable = function () {
                    $timeout(function () {
                        dataTableDom = $(element).DataTable({
                            'destroy': true,
//                            'bSearchable': true,
                            'searching': false,
                            'bLengthChange': false,
                            'info': false,
                            'bSort': false,
                            'dom': "<'text-right mb-md'T>" + $.fn.dataTable.defaults.sDom,
                            'iDisplayLength': parseInt(attrs.ngDataTable),
                            'pageLength': parseInt(attrs.ngDataTable),
                            'order': [0, 'desc']
                        });
                    }, 100);
                };
                drawTable();
            }
        };
    }]);


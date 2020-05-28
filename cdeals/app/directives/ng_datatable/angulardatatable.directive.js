'use strict';

factFindApp.directive('angularDataTable', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            scope: {},
            link: function postLink(scope, element, attrs) {
                var dataTableDom;
                var dataTableElement;
                var parentElement;
                scope.$on('CREATE_DATA_TABLE', function () {
                    $timeout
                            (function () {
                                dataTableElement = $(element).clone();
                                if (attrs.tableHeaderChange) {
                                    $(element).parent().append(dataTableElement);
                                    $(element).hide();
                                    dataTableDom = $(dataTableElement).dataTable({
                                        'destroy': true,
                                        'dom': "<'text-right mb-md'T>" + $.fn.dataTable.defaults.sDom,
                                        'iDisplayLength': parseInt(attrs.angularDataTable),
                                        'pageLength': parseInt(attrs.angularDataTable)
                                    });
                                } else {
                                    dataTableDom = $(element).dataTable({
                                        'destroy': true,
                                        'dom': "<'text-right mb-md'T>" + $.fn.dataTable.defaults.sDom,
                                        'iDisplayLength': parseInt(attrs.angularDataTable),
                                        'pageLength': parseInt(attrs.angularDataTable)
                                    });
                                }
                            }, 100);
                });
                scope.$on('DESTROY_DATA_TABLE', function () {
                    if (attrs.tableHeaderChange) {
                        if (dataTableDom && dataTableDom.length > 0) {
                            dataTableDom.fnDestroy(true);
                            $(element).show();
                        }
                    } else {
                        if (dataTableDom && dataTableDom.length > 0) {
                            dataTableDom.fnDestroy();
                        }
                    }
                });
            }
        };
    }]);

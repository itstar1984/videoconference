'use strict';

factFindApp.service('DateFilter', ['$filter', function ($filter) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        return{
            sortList: function (list, dateField) {
                list.sort(function (a, b) {
                    var keyA = new Date(a[dateField]);
                    var keyB = new Date(b[dateField]);
                    if (keyA > keyB) {
                        return 1;
                    }
                    if (keyA < keyB) {
                        return -1;
                    }
                    return 0;
                });
                list.reverse();
                return list;
            },
            getDateFilter: function (list, dateField) {
                list.sort(function (a, b) {
                    var keyA = new Date(a[dateField]);
                    var keyB = new Date(b[dateField]);
                    if (keyA > keyB) {
                        return 1;
                    }
                    if (keyA < keyB) {
                        return -1;
                    }
                    return 0;
                });
                list.reverse();
                var dateGroups = _.groupBy(list, function (element) {
                    return (element[dateField]);
                });
                var dateFilterList = Object.keys(dateGroups);
                var formattedDateFilterList = [];
                angular.forEach(dateFilterList, function (dateFilter) {
                    formattedDateFilterList.push({
                        value: $filter('date')(dateFilter, 'yyyy-MMM-dd, hh:mm a')
                    });
                });
                var dateGroupList = _.groupBy(formattedDateFilterList, function (dateTime) {
                    return dateTime.value.split(',')[0];
                });
                var filterList = [];
                for (var dateTime in dateGroupList) {
                    if (dateGroupList[dateTime].length > 1) {
                        var dateFilter = {
                            value: dateTime,
                            subFilters: dateGroupList[dateTime],
                            expand: true,
                            filter: true
                        };
                        for (var i in dateGroupList[dateTime]) {
                            dateGroupList[dateTime][i].filter = true;
                        }
                        filterList.push(dateFilter);
                    } else if (dateGroupList[dateTime].length == 1) {
                        dateGroupList[dateTime][0].filter = true;
                        filterList.push(dateGroupList[dateTime][0]);
                    }
                }
                return ({
                    value: 'Encounters',
                    subFilters: filterList,
                    root: true,
                    expand: true
                });
            },
            getByDateFieldFilter: function (list, dateField, fieldName) {
                list.sort(function (a, b) {
                    var keyA = new Date(a[dateField]);
                    var keyB = new Date(b[dateField]);
                    if (keyA > keyB) {
                        return 1;
                    }
                    if (keyA < keyB) {
                        return -1;
                    }
                    return 0;
                });
                list.reverse();
                var dateGroups = _.groupBy(list, function (element) {
                    return (element[dateField]);
                });
                var dateFilterList = Object.keys(dateGroups);
                var formattedDateFilterList = [];
                angular.forEach(dateFilterList, function (dateFilter) {
                    formattedDateFilterList.push({
                        value: $filter('date')(dateFilter, 'yyyy-MMM-dd, hh:mm a')
                    });
                });
                var dateGroupList = _.groupBy(formattedDateFilterList, function (dateTime) {
                    return dateTime.value.split(',')[0];
                });
                var filterList = [];
                for (var dateTime in dateGroupList) {
                    if (dateGroupList[dateTime].length > 1) {
                        var dateFilter = {
                            value: dateTime,
                            subFilters: dateGroupList[dateTime],
                            expand: true,
                            filter: true
                        };
                        for (var i in dateGroupList[dateTime]) {
                            dateGroupList[dateTime][i].filter = true;
                        }
                        filterList.push(dateFilter);
                    } else if (dateGroupList[dateTime].length == 1) {
                        dateGroupList[dateTime][0].filter = true;
                        filterList.push(dateGroupList[dateTime][0]);
                    }
                }
                return ({
                    value: fieldName,
                    subFilters: filterList,
                    root: true,
                    expand: true
                });
            },
            sortByKey: function (list, key) {
                list.sort(function (a, b) {
                    var keyA = a[key];
                    var keyB = b[key];
                    if (keyA > keyB) {
                        return 1;
                    }
                    if (keyA < keyB) {
                        return -1;
                    }
                    return 0;
                });
                list.reverse();
                return list;
            },
        };
    }]);

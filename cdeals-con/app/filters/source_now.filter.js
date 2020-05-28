/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


factFindApp.filter('filterMultiple', ['$filter', function($filter) {
    return function(items, keyObj) {
        if (items) {
            var filterObj = {
                data: items,
                filteredData: [],
                applyFilter: function(obj, key) {
                    var fData = [];
                    if (this.filteredData.length == 0)
                        this.filteredData = this.data;
                    if (obj) {
                        var fObj = {};
                        if (angular.isString(obj)) {
                            fObj[key] = obj;
                            fData = fData.concat($filter('filter')(this.filteredData, fObj));
                        } else if (angular.isArray(obj)) {
                            if (obj.length > 0) {
                                for (var i = 0; i < obj.length; i++) {
                                    if (angular.isString(obj[i])) {
                                        fObj[key] = obj[i];
                                        fData = fData.concat($filter('filter')(this.filteredData, fObj));
                                    }

                                }

                            }
                        }
                        if (fData.length > 0) {
                            this.filteredData = fData;

                        }


                    }

                }
            };

            if (keyObj) {
                angular.forEach(keyObj, function(obj, key) {
                    filterObj.applyFilter(obj, key);
                });
            }

            return filterObj.filteredData;
        }
    }
}]);
factFindApp.filter('startFrom', function() {
    return function(input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});
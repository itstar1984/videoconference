'use strict';

factFindApp.controller('headerCtrl', ['$scope', '$rootScope', '$state', 'localStorageService', function ($scope, $rootScope, $state, localStorageService) {
        $rootScope.userName = localStorageService.get('name');
        
    }]);



'use strict';

factFindApp.controller('sidePanelCtrl', ['$scope', '$rootScope', '$state', 'localStorageService', function ($scope, $rootScope, $state, localStorageService) {
        $rootScope.userName = localStorageService.get('name');
        $scope.tabList = ['Consultants', 'Waiting Clients'];
        $scope.currentTab = 'Consultants';
        $scope.isActiveTab = function (tab) {
            return angular.equals($scope.currentTab, tab);
        };
        $scope.changeTab = function (tab) {
            $scope.currentTab = tab;
        };
    }]);



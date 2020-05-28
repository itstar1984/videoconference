'use strict';

factFindApp.controller('loginCtrl', ['$scope', '$state', 'authentication', 'localStorageService', function ($scope, $state, authentication, localStorageService) {
        $scope.alerts = [];
        $scope.login = function () {
            $scope.alerts.length = 0;
            authentication.login($scope.user).then(function (response) {
                $state.transitionTo('app', {reload: true, inherit: true, notify: true});
            }).catch(function (fallback) {
                $scope.alerts.push({msg: fallback.msg});
            });
        };
        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
    }]);



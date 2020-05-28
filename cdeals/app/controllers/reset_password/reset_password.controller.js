'use strict';

factFindApp.controller('resetPasswordCtrl', [
    '$location',
    '$state',
    '$scope',
    'localStorageService',
    'authentication',
    function ($location, $state, $scope, localStorageService, authentication) {
        $scope.email = localStorageService.get('email')
        if(!$location.$$search.reset || !$scope.email) {
            $state.go('login', { reload: true, inherit: true, notify: true })
        }

        $scope.resetPass = function () {
            authentication.resetPass({
                password: $scope.password,
                email: $scope.email,
                token: $location.$$search.reset
            })
        }
    }
]);

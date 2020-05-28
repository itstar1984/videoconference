'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('reset_password', {
            url: '/reset_password',
            templateUrl: "app/controllers/reset_password/reset_password.html",
            controller: 'resetPasswordCtrl',
            params: { email: null }
        });
}]);

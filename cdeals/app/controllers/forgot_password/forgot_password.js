'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('forgetPassword', {
                    url: '/forgetPassword',
                    templateUrl: "app/controllers/forgot_password/forgot_password.html",
                    controller: 'forgotPasswordCtrl'
                });
    }]);
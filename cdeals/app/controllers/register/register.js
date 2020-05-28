'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('register', {
                    url: '/register',
                    templateUrl: "app/controllers/register/register.html",
                    controller: 'registerCtrl'
                });
    }]);
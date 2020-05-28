'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: "app/controllers/login/login.html",
                    controller: 'loginCtrl'
                });
    }]);
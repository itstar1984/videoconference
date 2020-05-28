'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app.employmentandincome', {
                    url: 'employment',
                    templateUrl: "app/controllers/employment/employment.html",
                    controller: 'employmentCtrl'
                });
    }]);
'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app.nonSourceEmploymentandIncome', {
                    url: 'nonSourceEmploymentandIncome',
                    templateUrl: "app/controllers/nonsourcing_employment/employment.html",
                    controller: 'nonSourceEmploymentCtrl'
                });
    }]);
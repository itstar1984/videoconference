'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app.otherexisitingmortgages', {
                    url: 'otherexisitingmortgages',
                    templateUrl: "app/controllers/other_exisiting_mortgages/other_exisiting_mortgages.html",
                    controller: 'otherExisitingMortgagesCtrl'
                });
    }]);
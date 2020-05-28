'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app.yourmortgagerequirement', {
                    url: 'mortgage',
                    templateUrl: "app/controllers/mortgage/mortgage.html",
                    controller: 'mortgageCtrl'
                });
    }]);
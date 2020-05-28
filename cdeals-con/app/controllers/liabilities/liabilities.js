'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app.liabilities', {
                    url: 'liabilities',
                    templateUrl: "app/controllers/liabilities/liabilities.html",
                    controller: 'LiabilitiesCtrl'
                });
    }]);
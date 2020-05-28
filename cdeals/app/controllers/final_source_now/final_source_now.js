'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app.finalsourcenow', {
                    url: 'finalsourcenow',
                    templateUrl: "app/controllers/final_source_now/final_source_now.html",
                    controller: 'finaSourceNowCtrl'
                });
    }]);
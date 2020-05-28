'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app.sourcenow', {
                    url: 'sourcenow',
                    templateUrl: "app/controllers/source_now/source_now.html",
                    controller: 'sourceNowCtrl'
                });
    }]);
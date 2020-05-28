'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app.end_page', {
                    url: 'end_page',
                    templateUrl: "app/controllers/end_page/end_page.html",
                    controller: 'endPageCtrl'
                });
    }]);
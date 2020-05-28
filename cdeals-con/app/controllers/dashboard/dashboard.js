'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app', {
                    url: '/',
                    views: {
                        '': {//<--this is the main template
                            templateUrl: "app/controllers/dashboard/dashboard.html",
                            controller: 'dashboardCtrl'
                        }
                    }
                });
    }]);
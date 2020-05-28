'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app', {
                    url: '/',
//                    templateUrl: "app/controllers/selectConsultant/selectConsultant.html",
//                    controller: 'selectConsultantCtrl',
                     views: {
                        '': {//<--this is the main template
                            templateUrl: "app/controllers/selectConsultant/selectConsultant.html",
                            controller: 'selectConsultantCtrl'
                        }
                    }
                });
    }]);
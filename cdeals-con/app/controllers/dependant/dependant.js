'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app.dependant', {
                    url: 'dependant',
                    templateUrl: "app/controllers/dependant/dependant.html",
                    controller: 'dependantCtrl'
                });
    }]);
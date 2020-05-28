'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('agreement', {
                    url: '/agreement',
                    templateUrl: "app/controllers/agreement/agreement.html",
                    controller: 'agreementCtrl'
                });
    }]);
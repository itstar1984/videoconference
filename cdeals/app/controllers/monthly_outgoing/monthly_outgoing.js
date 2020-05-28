'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app.monthly_outgoing', {
                    url: 'monthly_outgoing',
                    templateUrl: "app/controllers/monthly_outgoing/monthly_outgoing.html",
                    controller: 'monthlyOutgoingCtrl'
                });
    }]);
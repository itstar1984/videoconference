'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app.credithistroy', {
                    url: 'credithistroy',
                    templateUrl: "app/controllers/credit_history/credit_history.html",
                    controller: 'CreditHistroyCtrl'
                });
    }]);
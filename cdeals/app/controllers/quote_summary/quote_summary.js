'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app.quote_summary', {
                    url: 'quote_summary',
                    templateUrl: "app/controllers/quote_summary/quote_summary.html",
                    controller: 'quoteSummaryCtrl'
                });
    }]);
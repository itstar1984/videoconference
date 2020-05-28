'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app.applicant', {
                    url: 'applicant',
                    templateUrl: "app/controllers/applicant/applicant.html",
                    controller: 'applicantCtrl'
                });
    }]);
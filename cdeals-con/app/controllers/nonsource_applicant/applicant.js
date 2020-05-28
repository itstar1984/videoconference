'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app.nonSourceApplicant', {
                    url: 'nonSourceApplicant',
                    templateUrl: "app/controllers/nonsource_applicant/applicant.html",
                    controller: 'nonsouceApplicantCtrl'
                });
    }]);
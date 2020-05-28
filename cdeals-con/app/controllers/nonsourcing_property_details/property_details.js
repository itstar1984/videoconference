'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app.nonSourceProperty', {
                    url: 'nonSourceProperty',
                    templateUrl: "app/controllers/nonsourcing_property_details/property_details.html",
                    controller: 'nonSourcePropertyDetailsCtrl'
                });
    }]);
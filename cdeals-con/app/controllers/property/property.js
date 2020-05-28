'use strict';

factFindApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
                .state('app.property', {
                    url: 'property',
                    templateUrl: "app/controllers/property/property.html",
                    controller: 'propertyCtrl'
                });
    }]);
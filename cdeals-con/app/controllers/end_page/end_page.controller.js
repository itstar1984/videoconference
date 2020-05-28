'use strict';

factFindApp.controller('endPageCtrl', ['$scope', '$rootScope', 'quoteService', 'localStorageService', '$firebaseObject', 'firebaseService',
    function ($scope, $rootScope, quoteService, localStorageService, $firebaseObject, firebaseService) {
        $scope.logOutSystem = function () {
            $scope.$parent.logOut();
        };
    }]);

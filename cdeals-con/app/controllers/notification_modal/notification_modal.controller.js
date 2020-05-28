'use strict';

factFindApp.controller('notificationCtrl', ['$scope', '$modalInstance', 'options', function ($scope, $modalInstance, options) {

        $scope.confirm = function (response) {
            $modalInstance.close(response);
        };

        $scope.mute = function()
        {
            $scope.$parent.mute();
        }

        var initialize = function () {
            $scope.options = angular.copy(options);
        };
        initialize();
    }]);

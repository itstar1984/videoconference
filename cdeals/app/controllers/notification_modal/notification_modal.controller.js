'use strict';

factFindApp.controller('notificationCtrl', ['$scope', '$modalInstance', 'options', function ($scope, $modalInstance, options) {
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
        $scope.confirm = function () {
            $modalInstance.close();
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

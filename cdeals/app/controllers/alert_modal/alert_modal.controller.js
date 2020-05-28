'use strict';

factFindApp.controller('alertCtrl', ['$scope', '$modalInstance', 'options', function ($scope, $modalInstance, options) {
        $scope.confirm = function (response) {
            $modalInstance.close(response);
        };

       
	    $scope.mute = function()
        {
            if($scope.$parent.mute) $scope.$parent.mute();
        }
	
        
        var initialize = function () {
            $scope.options = angular.copy(options);
        };
        initialize();
    }]);

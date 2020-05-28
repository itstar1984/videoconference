'use strict';

factFindApp.controller('chatHistoryCtrl', ['$scope', '$modalInstance', 'options', function ($scope, $modalInstance, options) {

        var initialize = function () {
            $scope.msgList = angular.copy(options.chats);
        };
        initialize();
    }]);

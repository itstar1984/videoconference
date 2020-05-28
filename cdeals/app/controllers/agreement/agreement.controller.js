'use strict';

factFindApp.controller('agreementCtrl', ['$scope', '$state', '$http', 'authentication', 'localStorageService',
    function ($scope, $state, $http, authentication, localStorageService) {
        $scope.agreed = function () {
            login();
        };
        var login = function () {
            $scope.alerts.length = 0;
            var user = localStorageService.get('user');

            $http.get('https://ipapi.co/json').then(function (ipresponse) {
                var data = {
                    to: user.Email,
                    ip: ipresponse.data.ip,
                    userName: user.Name,
                    ClientID: user.ClientID,
                    Email: user.Email,
                    Password: user.Password
                };
                console.log(data);
                authentication.login(data).then(function (response) {
                    $state.transitionTo('app', {
                        reload: true,
                        inherit: true,
                        notify: true
                    });
                }).catch(function (fallback) {
                    $scope.alerts.push({
                        msg: fallback.message
                    });
                });
                // authentication.sendMail(data).then(function (response) {
                //     authentication.login($scope.user).then(function (response) {
                //         $state.transitionTo('app', {reload: true, inherit: true, notify: true});
                //     }).catch(function (fallback) {
                //         $scope.alerts.push({msg: fallback.msg});
                //     });
                // });
            });
        };
        $scope.alerts = [];
    }
]);

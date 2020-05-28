'use strict';

factFindApp.controller('loginCtrl', ['$scope', '$rootScope', '$state', 'authentication', '$q', 'localStorageService', '$http',
    function ($scope, $rootScope, $state, authentication, $q, localStorageService, $http) {
        $scope.alerts = [];
        $scope.login = function () {
            $scope.alerts.length = 0;
            console.log('$scope.user--', $scope.user);
            localStorageService.set('Password', $scope.user.password);
            authentication.login($scope.user).then(function (response) {
                console.log(response);
                $rootScope.myConsultantInfo = response.data.data;
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
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
        // $scope.sendMail = function () {
        //     var data = {
        //         to: 'nikunjsavaliya06@gmail.com'
        //     };
        //     authentication.sendMail(data).then(function (response) {
        //         console.log(response);
        //     });
        // };
        $rootScope.$on('event:social-sign-in-success', function (event, userDetails) {
            console.log(event);
            console.log(JSON.stringify(userDetails));
            if(userDetails) {
                authentication.socialLogin(userDetails).then(function (response) {
                    $state.transitionTo('app', {
                        reload: true,
                        inherit: true,
                        notify: true
                    });
                }).catch(function (fallback) {
                    console.log('fallback--', fallback);
                    if(fallback !== null) {
                        $scope.alerts.push({
                            msg: fallback.message
                        });
                    }
                });
            } else {
                console.log('err');
            }
        });
    }
]);

'use strict';

factFindApp.service('authentication', ['$q', '$http', 'localStorageService', 'ApiService',
    function ($q, $http, localStorageService, ApiService) {
        return {
            login: function (data) {
                console.log(data);
                return ApiService.post('UserClientController/Login', data).$promise;
            },
            requestPass: function (data) {
                return ApiService.post('UserClientController/ForgetPassword', data).$promise;
            },
            resetPass: function (data) {
                return ApiService.post('UserClientController/ResetPassword', data).$promise;
            },
            sendMail: function (data) {
                var deferred = $q.defer();
                $http.post('mailer/sendMail.php', data).success(function (response) {
                    deferred.resolve(response);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            socialLogin: function (data) {
                data.redirect_uri = 'https%3A%2F%2Flocalhost%3A44308%2F';
                data.response_type = 'token';
                data.client_id = 'self';
                data.state = '6509wJEW5N9sfSU65kB0paqutKAKYEKJf1LgfzW_u-M1';
                data.error = '1';
                return ApiService.get('Account/ExternalLogin', data).$promise;
            },
        }
    }
]);

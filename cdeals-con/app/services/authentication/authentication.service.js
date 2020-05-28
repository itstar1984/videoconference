'use strict';

factFindApp.service('authentication', ['$q', '$http', 'localStorageService', function ($q, $http, localStorageService) {
        return {
            login: function (data) {
                var deferred = $q.defer();
                $http.post('php_pages/GetUserDetailsByPassword.php', data).success(function (response) {
                    if (response.data[0].ConsultantID === '-1') {
                        deferred.reject({msg: response.data[0].msg});
                    } else {
                        var ID = response.data[0].ConsultantID;
                        var Name = response.data[0].Name;
                        var Email = response.data[0].Email;
                        localStorageService.set('name', Name);
                        localStorageService.set('email', Email);
                        localStorageService.set('consultantID', ID);
                        deferred.resolve(response.data[0]);
                    }
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
        }
    }]);

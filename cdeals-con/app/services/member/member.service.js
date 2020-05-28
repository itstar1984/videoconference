'use strict';

factFindApp.service('memberService', ['$resource', '$q', 'apiBaseUrl', '$rootScope', '$http', function ($resource, $q, apiBaseUrl, $rootScope, $http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', { action: '@action', subaction: '@subaction',
        request: '@request' }, {});

    return {
        createFFID: function (member) {
            var deferred = $q.defer();
            api.save({ action: 'save', subaction: 'SaveFactFind', request: 'POST' }, member, function (response) {
                deferred.resolve(response);
                $rootScope.$broadcast('MEMBERS_LOAD');
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        createAPP: function (member) {
            var deferred = $q.defer();
            api.save({ action: 'Save', subaction: 'SaveApplications', request: 'POST' }, member, function (response) {
                deferred.resolve(response);
                $rootScope.$broadcast('MEMBERS_LOAD');
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getAPPid: function (member) {
            var deferred = $q.defer();
            api.get({ action: 'Get', subaction: 'GetAppIDByFFID', request: 'GET', FFID: member.FFID }, function (response) {
                deferred.resolve(response);
                $rootScope.$broadcast('MEMBERS_LOAD');
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        register: function (data) {
            var deferred = $q.defer();
            $http.post('php_pages/signup.php', data)
                .success(function (response, status) {
                    var email = response.data[0].Email;
                    var password = response.data[0].Password;
                    if(email == "dB_disConnect") {
                        console.log("Database is not connected!");
                    } else if(email == "NoQuery") {
                        console.log("Insert query is not executed!");
                    } else if(email == "Already") {
                        //                                scope.showAlert();
                        //                                scope.newuser.username = '';
                        //                                scope.newuser.password = '';
                        //                                scope.newuser.confirmpassword = '';
                        //                                scope.newuser.homeaddress = '';
                        //                                scope.newuser.mobileaddress = '';
                    } else {
                        var returnRes = {
                            email: email,
                            password: password,
                            isSelecter: 0
                        }
                        deferred.resolve(returnRes);
                    }
                })
                .error(function (error) {
                    console.error(error);
                });
            return deferred.promise;

        }
    }
}]);

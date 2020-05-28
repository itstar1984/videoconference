'use strict';

factFindApp.factory('httpErrorResponseInterceptor', ['$q', '$location', 'localStorageService',
    function ($q, $location, localStorageService) {
        return {
            request: function (config) {
//                if (localStorageService.get('accessToken') && config.url.substring(0, 4) == 'http') {
//                    config.headers['Authorization'] = 'Bearer ' + localStorageService.get('accessToken');
//                }
//                config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    $location.path('/');
                    return $q.reject(response);
                }
                return response || $q.when(response);
            },
            responseError: function (response) {
                switch (response.status) {
                    case 401:
                        localStorageService.clearAll();
                        $location.path('/');
                        break;
                    case 404:
                        $location.path('/404');
                        break;
//                    case 500:
//                        $location.path('/500');
//                        break;
//                    default:
//                        $location.path('/500');
                }

                return $q.reject(response);
            }
        };
    }
]);

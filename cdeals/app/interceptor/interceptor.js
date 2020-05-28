'use strict';

factFindApp.factory('httpResponseInterceptor', ['$q', '$location', 'localStorageService', 'toaster',
    function ($q, $location, localStorageService, toaster) {
        return {
            request: function (config) {
                //                if (localStorageService.get('accessToken') && config.url.substring(0, 4) == 'http') {
                //                    config.headers['Authorization'] = 'Bearer ' + localStorageService.get('accessToken');
                //                }
                //                config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                return config;
            },
            requestError: function (err) {
                return $q.reject(err);
            },
            response: function (response) {
                console.log(response);
                if(!response) return $q.reject()
                if(response.status === 401) {
                    $location.path('/');
                    return $q.reject(response);
                }
                if(response.config.method !== 'GET' && typeof response.data === 'object') {
                    if(response.data.success && response.status < 399) {
                        toaster.pop({
                            type: 'success',
                            title: 'Success!',
                            body: response.data.message
                        });
                        return $q.resolve(response);
                    } else {
                        toaster.pop({
                            type: 'error',
                            title: 'Error!',
                            body: response.data.message
                        });
                        return $q.reject(response);
                    }
                }
                return response || $q.when(response);
            },
            responseError: function (response) {
                toaster.pop({
                    type: 'error',
                    title: 'Error!',
                    body: response.data.message || 'Server failure!'
                });
                switch(response.status) {
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

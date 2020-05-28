'use strict';

factFindApp.service('documentService', ['$resource', '$q', '$http', 'apiBaseUrl', function ($resource, $q, $http, apiBaseUrl) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource(apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {action: '@action', subaction: '@subaction', request: '@request'}, {});

        return{
            getOutStandingDetails: function (detail) {
                var deferred = $q.defer();
                api.get({action: 'OutstandingDocs', subaction: 'GetOutstandingForMortgage', request: 'GET', FFID: detail.FFID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getCaseDocuments: function (detail) {
                var deferred = $q.defer();
                api.query({action: 'Get', subaction: 'GetCaseDocuments', request: 'GET', FF_id: detail.FFID}, function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            checkDocument: function (detail, files) {
//                var deferred = $q.defer();
//                api.Save({request: 'POST'}, detail, function (response) {
//                    deferred.resolve(response);
//                }, function (error) {
//                    deferred.reject(error);
//                });
//                return deferred.promise;
                var fd = new FormData();
                fd.append('file', files);
                fd.append('model', angular.toJson(detail));
                var deferred = $q.defer();
                $http.post("./php_pages/check_upload.php", fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined, 'Process-Data': false}
                }).success(function (data, status, headers, config) {
                    if (data.existdoc === 0) {
                        $http.post("./php_pages/saveCaseDocument.php", fd, {
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined, 'Process-Data': false}
                        }).success(function (data, status, headers, config) {
                            deferred.resolve(data);
                        }).error(function (data, status, headers, config) {
                            window.alert("File not saved!! has some problems... check your files");
                        });
                    } else {
                        deferred.resolve(data);
                    }

                });

                return deferred.promise;
            }
        }
    }]);

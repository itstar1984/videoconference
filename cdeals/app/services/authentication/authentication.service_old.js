'use strict';

factFindApp.service( 'authentication', [ '$q', '$http', 'localStorageService', 'ApiService',
    function ( $q, $http, localStorageService, ApiService ) {
        return {
            login: function ( data ) {
                return ApiService.post( 'UserClientController/Login', data ).$promise;
            },
            requestPass: function ( data ) {
                return ApiService.post( 'UserClientController/ForgetPassword', data ).$promise;
            },
            resetPass: function ( data ) {
                return ApiService.post( 'UserClientController/ResetPassword', data ).$promise;
            },
            sendMail: function ( data ) {
                var deferred = $q.defer();
                $http.post( 'mailer/sendMail.php', data ).success( function ( response ) {
                    deferred.resolve( response );
                } ).error( function ( error ) {
                    deferred.reject( error );
                } );
                return deferred.promise;
            },
        }
    } ] );

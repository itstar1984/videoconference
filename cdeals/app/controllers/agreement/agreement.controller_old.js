'use strict';

factFindApp.controller( 'agreementCtrl', [ '$scope', '$state', '$http', 'authentication', 'localStorageService', function ( $scope, $state, $http,
    authentication, localStorageService ) {
    $scope.agreed = function () {
        login();
    };
    var login = function () {
        $scope.alerts.length = 0;
        $scope.user.username = localStorageService.get( 'username' );
        $scope.user.password = localStorageService.get( 'password' );

        $http.get( 'https://ipapi.co/json' )
            .then( function ( ipresponse ) {
                return authentication.sendMail( {
                    to: localStorageService.get( 'email' ),
                    ip: ipresponse.data.ip,
                    userName: $scope.user.username
                } )
            } )
            .then( function ( response ) {
                $state.transitionTo( 'app', { reload: true, inherit: true, notify: true } );
            } )
            .catch( function ( err ) { console.error( err ) } );

    };
    $scope.alerts = [];
} ] );

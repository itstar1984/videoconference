'use strict';

factFindApp.controller( 'forgotPasswordCtrl', [ '$scope', '$state', 'toaster', 'authentication', 'localStorageService',
    function ( $scope, $state, toaster, authentication, localStorageService ) {
        $scope.alerts = [];
        $scope.requestPass = function () {
            authentication.requestPass( $scope.user ).then( function ( response ) {
                localStorageService.set( 'email', $scope.user.email )
                $state.go( 'login', { reload: true, inherit: true, notify: true } );
                $scope.user.email = '';
            } ).catch( function ( err ) {
                console.error( err )
            } );
        };

        $scope.closeAlert = function ( index ) {
            $scope.alerts.splice( index, 1 );
        };
    }
] );

'use strict';

factFindApp.controller( 'loginCtrl', [ '$scope', '$rootScope', '$state', 'authentication', 'localStorageService',
    function ( $scope, $rootScope, $state, authentication, localStorageService ) {
        $scope.alerts = [];
        $scope.login = function () {
            $scope.alerts.length = 0;
            authentication.login( $scope.user )
                .then( function ( response ) {
                    var clientID = response.data.ClientID;

                    localStorageService.set( 'user', clientID );
                    localStorageService.set( 'clientID', clientID );
                    localStorageService.set( 'FFID', response.data.FFID );
                    localStorageService.set( 'DefaultConsultantID', response.data.DefaultConsultantID );
                    localStorageService.set( 'DefaultConsultantEmail', response.data.DefaultConsultantEmail );
                    localStorageService.set( 'Name', response.data.Name );
                    localStorageService.set( 'email', response.data.Email );

                    $state.transitionTo( 'app', { reload: true, inherit: true, notify: true } );
                } )
                .catch( function ( err ) {
                    console.error( err )
                } );
        };

        $scope.closeAlert = function ( index ) {
            $scope.alerts.splice( index, 1 );
        };
        // $scope.sendMail = function () {
        //     var data = {to: 'nikunjsavaliya06@gmail.com'};
        //     authentication.sendMail(data).then(function (response) {
        //         console.log(response);
        //     });
        // };
        $rootScope.$on( 'event:social-sign-in-success', function ( event, userDetails ) {
            // handle external login

            console.log( event );
            console.log( userDetails );
        } );
    }
] );

'use strict';

factFindApp.controller( 'registerCtrl', [ '$scope', '$rootScope', '$state', 'memberService', 'localStorageService', 'toaster', function ( $scope,
    $rootScope, $state, memberService, localStorageService, toaster ) {
    $scope.signupDetails = function () {
        setFocusOnValidation();

        var clone = angular.copy( $scope.user );
        clone.Name = clone.FirstName + ' ' + clone.Surname;
        memberService.register( clone ).then( function ( response ) {
            localStorageService.set( 'email', clone.Email );
            localStorageService.set( 'username', clone.Name );
            localStorageService.set( 'password', clone.Password );
            localStorageService.set( 'phone', clone.Mobile );
            $state.go( 'agreement', { reload: true, inherit: true, notify: true } );
        } ).catch( function ( error ) {
            console.error( error )
        } );
    };
    $scope.closeAlert = function ( index ) {
        $scope.alerts.splice( index, 1 );
    };
    var initialize = function () {
        $scope.alerts = [];
        $scope.titleList = [
            { name: 'DR.', val: '1' },
            { name: 'Miss.', val: '2' },
            { name: 'Mr.', val: '3' },
            { name: 'Mrs.', val: '4' },
            { name: 'Ms.', val: '5' }
        ];
    };
    initialize();

    var setFocusOnValidation = function () {
        if ( !$scope.user.eTitleID ) {
            $scope.reFoc = true;
            return;
        }
        if ( !$scope.user.FirstName ) {
            $scope.focusName = true;
            return;
        }
        if ( !$scope.user.Surname ) {
            $scope.focsuSur = true;
            return;
        }
        if ( !$scope.user.Email ) {
            $scope.focsuMail = true;
            return;
        }
        if ( !$scope.user.Password ) {
            $scope.focusPwd = true;
            return;
        }
        if ( !$scope.user.confirmPassword ) {
            $scope.focsuCnfmPwd = true;
            return;
        }
        if ( !$scope.user.PhoneNumber ) {
            $scope.focusPhone = true;
            return;
        }
        if ( !$scope.user.PostCode ) {
            $scope.focusPostCode = true;
            return;
        }
    };
} ] );

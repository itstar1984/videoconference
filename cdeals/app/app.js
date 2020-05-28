'use strict';

var factFindApp = angular.module( 'factFindApp', [
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'ui.select',
    'ui.mask',
    'angularUtils.directives.dirPagination',
    'angular-loading-bar',
    'LocalStorageModule',
    'toaster',
    'wiz.validation',
    'firebase',
    'checklist-model',
    'socialLogin',
    'angular-nicescroll'
] );
factFindApp.config( [
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    '$httpProvider',
    function ( $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider ) {
        $httpProvider.interceptors.push( 'httpResponseInterceptor' );
        //$urlRouterProvider.otherwise('/404');
        //$locationProvider.hashPrefix('!').html5Mode(true);
        $urlRouterProvider.rule( function ( $injector, $location ) {
            var path = $location.path();
            var hasTrailingSlash = path[ path.length - 1 ] === '/';
            if ( hasTrailingSlash ) {
                //if last charcter is a slash, return the same url without the slash
                var newPath = path.substr( 0, path.length - 1 );
                return newPath;
            }
        } );
    }
] );

factFindApp.config( [ 'uiSelectConfig',
    function ( uiSelectConfig ) {
        uiSelectConfig.theme = 'select2';
    }
] )
    .config( function ( localStorageServiceProvider ) {
        localStorageServiceProvider.setStorageType( 'sessionStorage' );
    } )
    .config( function ( $compileProvider ) {
        $compileProvider.imgSrcSanitizationWhitelist( /^\s*(http|ftp|mailto|file|tel|data)/ );
    } )
    .config( [ '$sceDelegateProvider', function ( $sceDelegateProvider ) {
        $sceDelegateProvider.resourceUrlWhitelist( [ 'self', /^http?:\/\/(cdn\.)?52.16.72.176/ ] );
    } ] )
    .config( [ 'cfpLoadingBarProvider', function ( cfpLoadingBarProvider ) {
        cfpLoadingBarProvider.includeBar = false;
        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.spinnerTemplate =
            '<div><div class="loading"><img src="assets/img/loading.gif" alt="loading-img"><div class="loading-msg">Please Wait... </div></div></div>';
    } ] )
    .config( [ 'uiMask.ConfigProvider', function ( uiMaskConfigProvider ) {
        uiMaskConfigProvider.maskDefinitions( { 'A': /[a-z]/, '*': /[a-zA-Z0-9]/ } );
        uiMaskConfigProvider.allowInvalidValue( false );
        uiMaskConfigProvider.eventsToHandle( [ 'input', 'keyup', 'click' ] );
    } ] )
    .config( function ( socialProvider ) {
        socialProvider.setGoogleKey( "748872387927-57erspt5koahamop65pkknk0i1iarrlr.apps.googleusercontent.com" );
        socialProvider.setFbKey( { appId: '2015250318502745', apiVersion: 'v2.12' } );
    } );
factFindApp.run( [ '$rootScope', '$location', 'localStorageService', '$state', function ( $rootScope, $location, localStorageService,$state ) {
    $rootScope.$on( '$stateChangeError', function ( event, toState, toParams, fromState, fromParams ) {
        // console.log(event);
        // console.log(toState);
        // console.log(toParams);
        // console.log(fromState);
        // console.log(fromParams);
        $location.path( '/500' );
        $state.go('app');
    } );
    $rootScope.$on( '$stateChangeStart', function ( event, toState, toParams, fromState, fromParams ) {
        if ( !localStorageService.get( 'user' ) ) {
            if ( ~[ 'register', 'forgetPassword', 'agreement', 'resetPassword' ].indexOf( toState.name ) ) {
                $location.path( '/' + toState.name );
            } else {
                $location.path( '/login' );
            }
        } else if (
            localStorageService.get( 'FFID' ) > 0 &&
            localStorageService.get( 'user' ) &&
            ( toState.name === 'login' || toState.name === 'app' )
        ) {
            $location.path( '/' );
        }
    } );
    $rootScope.$on( '$stateNotFound', function ( event, unfoundState, fromState, fromParams ) {
        $location.path( '/404' );
        // console.log(event);
        // console.log(unfoundState);
        // console.log(fromState);
        // console.log(fromParams);
    } );
} ] );

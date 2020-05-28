'use strict';

var factFindApp = angular.module('factFindApp', [
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
    'checklist-model'
]);
factFindApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider,
    $locationProvider, $httpProvider) {
    $httpProvider.interceptors.push('httpErrorResponseInterceptor');
    //$urlRouterProvider.otherwise('/404');
    //        $locationProvider.hashPrefix('!').html5Mode(true);
    $urlRouterProvider.rule(function ($injector, $location) {
        var path = $location.path();
        var hasTrailingSlash = path[path.length - 1] === '/';
        if(hasTrailingSlash) {
            //if last charcter is a slash, return the same url without the slash
            var newPath = path.substr(0, path.length - 1);
            return newPath;
        }
    });
}]);
factFindApp.config(['uiSelectConfig', function (uiSelectConfig) {
    uiSelectConfig.theme = 'select2';
}]).config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setStorageType('sessionStorage');
}).config(function ($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https|ftp|mailto|file|tel|data)/);
}).config(['$sceDelegateProvider', function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', /^https?:\/\/(cdn\.)?52.16.72.176/]);
}]).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = false;
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.spinnerTemplate =
        '<div><div class="loading"><img src="assets/img/loading.gif" alt="loading-img" /> <div class="loading-msg">Please Wait... </div></div></div>';
}]).config(['uiMask.ConfigProvider', function (uiMaskConfigProvider) {
    uiMaskConfigProvider.maskDefinitions({ 'A': /[a-z]/, '*': /[a-zA-Z0-9]/ });
    uiMaskConfigProvider.allowInvalidValue(false);
    uiMaskConfigProvider.eventsToHandle(['input', 'keyup', 'click']);
}]);

factFindApp.run(['$rootScope', '$location', 'localStorageService', function ($rootScope, $location, localStorageService) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
        // console.log(event);
        // console.log(toState);
        // console.log(toParams);
        // console.log(fromState);
        // console.log(fromParams);
        $location.path('/500');
    });
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if(!localStorageService.get('consultantID')) {
            $location.path('/login');
        } else if(localStorageService.get('consultantID') && (toState.name === 'login' || toState.name === 'app')) {
            $location.path('/');
        }
    });
    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
        $location.path('/404');
        // console.log(event);
        // console.log(unfoundState);
        // console.log(fromState);
        // console.log(fromParams);
    });
}]);

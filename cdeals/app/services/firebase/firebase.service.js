'use strict';

factFindApp.service('firebaseService', ['$resource', '$q', 'apiBaseUrl', '$rootScope', '$http', 'localStorageService', '$firebaseObject',
    function ($resource, $q, apiBaseUrl, $rootScope, $http, localStorageService, $firebaseObject) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var s = {};

        var ref = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
        s.typing = $firebaseObject(ref);
        
        s.saveTypingStatus = function (obj) {
            var ref = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            ref.child('client').set(obj);
        }

        return s;
    }]);

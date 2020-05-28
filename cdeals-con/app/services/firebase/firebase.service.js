'use strict';

factFindApp.service('firebaseService', ['$resource', '$q', 'apiBaseUrl', '$rootScope', '$http', 'localStorageService', '$firebaseObject',
    function ($resource, $q, apiBaseUrl, $rootScope, $http, localStorageService, $firebaseObject) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var s = {};
        var ref1 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
        s.typing = $firebaseObject(ref1);

        s.saveTypingStatus = function (obj) {
            var ref2 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/typing");
            ref2.child('consultant').set(obj);
        }

        return s;
    }]);

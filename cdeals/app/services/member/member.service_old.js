'use strict';

factFindApp.service( 'memberService', [ '$resource', '$q', 'apiBaseUrl', 'ApiService', '$rootScope', '$http', function ( $resource, $q, apiBaseUrl,
    ApiService, $rootScope, $http ) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var api = $resource( apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', {
        action: '@action',
        subaction: '@subaction',
        request: '@request'
    }, {} );

    return {
        createFFID: function ( member ) {
            var deferred = $q.defer();
            api.save( { action: 'save', subaction: 'SaveFactFind', request: 'POST' }, member, function ( response ) {
                deferred.resolve( response );
                $rootScope.$broadcast( 'MEMBERS_LOAD' );
            }, function ( error ) {
                deferred.reject( error );
            } );
            return deferred.promise;
        },
        createAPP: function ( member ) {
            var deferred = $q.defer();
            api.save( { action: 'Save', subaction: 'SaveApplications', request: 'POST' }, member, function ( response ) {
                deferred.resolve( response );
                $rootScope.$broadcast( 'MEMBERS_LOAD' );
            }, function ( error ) {
                deferred.reject( error );
            } );
            return deferred.promise;
        },
        GetMeetingAims: function ( member ) {
            var deferred = $q.defer();
            api.get( { action: 'MeetingAims', subaction: 'GetMeetingAims', request: 'GET', FF_id: member.FFID }, function ( response ) {
                deferred.resolve( response );
                $rootScope.$broadcast( 'MEMBERS_LOAD' );
            }, function ( error ) {
                deferred.reject( error );
            } );
            return deferred.promise;
        },
        SaveMeetingAims: function ( member ) {
            var deferred = $q.defer();
            api.save( { action: 'MeetingAims', subaction: 'SaveMeetingAims', request: 'POST' }, member, function ( response ) {
                deferred.resolve( response );
                $rootScope.$broadcast( 'MEMBERS_LOAD' );
            }, function ( error ) {
                deferred.reject( error );
            } );
            return deferred.promise;
        },
        getAPPid: function ( member ) {
            var deferred = $q.defer();
            api.get( { action: 'Get', subaction: 'GetAppIDByFFID', request: 'GET', FFID: member.FFID }, function ( response ) {
                deferred.resolve( response );
                $rootScope.$broadcast( 'MEMBERS_LOAD' );
            }, function ( error ) {
                deferred.reject( error );
            } );
            return deferred.promise;
        },
        updateClientDetail: function ( details ) {
            var deferred = $q.defer();
            $http.post( 'php_pages/SetDefaultConsultantID.php', details ).success( function ( response ) {
                var status = response.data[ 0 ].Status;
                deferred.resolve( status );
            } ).error( function ( error ) {
                console.error( error );
            } );
            return deferred.promise;
        },
        register: function ( data ) {
            return ApiService.post( 'UserClientController/PostNewUserClient', data ).$promise;
        }
    }
} ] );

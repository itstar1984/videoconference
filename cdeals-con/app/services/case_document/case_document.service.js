'use strict';

factFindApp.service( 'documentService', [ '$resource', '$q', '$http', 'apiBaseUrl', 'newApiBaseUrl',
    function ( $resource, $q, $http, apiBaseUrl, newApiBaseUrl ) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var api = $resource( apiBaseUrl + '?action=:action&subaction=:subaction&request=:request', { action: '@action', subaction: '@subaction', request: '@request' }, {} );

        return {
            getOutStandingDetails: function ( detail ) {
                var deferred = $q.defer();
                api.get( { action: 'OutstandingDocs', subaction: 'GetOutstandingForMortgage', request: 'GET', FFID: detail.FFID }, function ( response ) {
                    deferred.resolve( response );
                }, function ( error ) {
                    deferred.reject( error );
                } );
                return deferred.promise;
            },
            getCaseDocuments: function ( detail ) {
                var deferred = $q.defer();
                api.query( { action: 'Get', subaction: 'GetCaseDocuments', request: 'GET', FF_id: detail.FFID }, function ( response ) {
                    deferred.resolve( response );
                }, function ( error ) {
                    deferred.reject( error );
                } );
                return deferred.promise;
            },
            checkDocument: function ( detail, files ) {
                var deferred = $q.defer();
                var fd = new FormData();
                fd.append( 'File', files );
                fd.append( 'FFID', detail.FFID );
                fd.append( 'DOCTYPE', 2 )
                fd.append( 'USER', detail.consultantID )
                $http.post( newApiBaseUrl + "CaseDocumentController/UploadDocument", fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                } )
                    .success( function ( data, status, headers, config ) {
                        deferred.resolve( data );
                    } )
                    .error( function ( error ) {
                        deferred.reject( error );
                    } );

                return deferred.promise;
            }
        }
    } ] );

'use strict';

factFindApp.controller( 'caseDocumentCtrl', [ '$scope', '$modalInstance', 'documentService', 'options', 'toaster', function ( $scope, $modalInstance,
    documentService, options, toaster ) {

    var initialize = function () {
        $scope.options = angular.copy( options );
        $scope.options.CaseDocumentType = '59';
        $scope.options.lenderID = '0';
        //            documentService.getOutStandingDetails($scope.options).then(function (response) {
        //                console.log(response);
        //            })
        documentService.getCaseDocuments( $scope.options ).then( function ( response ) {
            console.log( response );
            $scope.caseDocuments = angular.copy( response );
            delete $scope.file;
        } );
    };
    $scope.downloadFile = function ( filecontent ) {
        var s = filecontent;
        // console.log(filecontent);
        var filename = s.CaseDocument_Name;
        //var contentType = s.CaseDocument_ContentType;
        var octetStreamMime = 'application/octet-stream'

        var contentType = "arraybuffer" || octetStreamMime;
        var data = s.CaseDocument_FileContents;
        // var sd = ab2str(data);
        var s1 = arrayBufferToBase64( data );
        var s2 = base64ToArrayBuffer( s1 );

        /* function ab2str(data) {
         return String.fromCharCode.apply(null, new Uint16Array(data));
         }*/

        function arrayBufferToBase64( data ) {
            var binary = '';
            var bytes = new Uint8Array( data );
            var len = bytes.byteLength;
            for ( var i = 0; i < len; i++ ) {
                binary += String.fromCharCode( bytes[ i ] );
            }
            return window.btoa( binary );
        }

        function base64ToArrayBuffer( binary ) {
            var binary_string = window.atob( binary );
            var len = binary_string.length;
            var bytes = new Uint8Array( len );
            for ( var i = 0; i < len; i++ ) {
                bytes[ i ] = binary_string.charCodeAt( i );
            }
            return bytes.buffer;
        }

        var linkElement = document.createElement( 'a' );
        try {
            var blob = new Blob( [ s2 ], { type: contentType } );
            var url = window.URL.createObjectURL( blob );

            linkElement.setAttribute( 'href', url );
            linkElement.setAttribute( "download", filename );

            var clickEvent = new MouseEvent( "click", {
                "view": window,
                "bubbles": true,
                "cancelable": false
            } );
            linkElement.dispatchEvent( clickEvent );
        } catch ( ex ) {
            console.error( ex );
        }
    };

    $scope.uploadDocument = function () {
        if ( $scope.file ) {
            documentService.checkDocument( $scope.options, $scope.file ).then( function ( response ) {
                initialize();
                $( "#fileInput" ).val( null );
                toaster.pop( 'success', 'File Uploaded Successfully', '' );
            } );
        } else {
            toaster.pop( 'info', 'Please Select File', '' );
        }
    };
    initialize();
    $scope.$on( 'selectedFile', function ( event, option ) {
        $scope.file = option.file;
    } );
} ] );

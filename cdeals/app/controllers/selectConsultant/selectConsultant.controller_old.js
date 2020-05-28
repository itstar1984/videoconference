'use strict';

factFindApp.controller( 'selectConsultantCtrl', [ '$scope', '$http', '$rootScope', '$state', '$modal', 'localStorageService', 'memberService',
    '$firebaseObject', 'webSocketAdderss', 'geoLocationUrl', 'DateFilter', '$timeout',
    function ( $scope, $http, $rootScope, $state, $modal, localStorageService, memberService, $firebaseObject, webSocketAdderss,
        geoLocationUrl, DateFilter, $timeout ) {
        var socket = io.connect( webSocketAdderss, {
            'forceNew': true,
            'reconnection': false,
            'reconnectionDelay': 1000,
            'reconnectionDelayMax': 5000,
            'reconnectionAttempts': 5
        } );
        $rootScope.partner = 'Consultant';
        $scope.activeConsultants = [];
        $scope.allConsultants = [];
        $scope.refreshChatPosition = function ( event ) {
            $( '.chat-box' ).css( {
                'bottom': 0,
                'right': 0,
                'top': '',
                'left': ''
            } );
            $( '#chat-panel-body' ).css( "display", 'none' );
        };

        function closeModals() {
            if ( $scope.notificationPopUp ) {
                $scope.notificationPopUp.close();
                $scope.notificationPopUp = null;
            }
            if ( $scope.requestAlertPopUp ) {
                $scope.requestAlertPopUp.close();
                $scope.requestAlertPopUp = null;
            }
        }
        $scope.logOut = function () {
            var object = firebase.database().ref().child( "/applicantData/" + localStorageService.get( 'FFID' ) );
            object.child( 'loginStatus' ).set( false );
            socket.disconnect();
            //socket = null;
            localStorageService.clearAll();
            $state.transitionTo( 'login', { reload: true, inherit: true, notify: true } );
            location.reload();
        };
        $scope.caseDocument = function () {
            var model = $modal.open( {
                templateUrl: 'app/controllers/case_document/case_document.html',
                controller: 'caseDocumentCtrl',
                backdrop: 'static',
                size: 'md',
                keyboard: false,
                resolve: {
                    options: function () {
                        return {
                            'AppID': localStorageService.get( 'AppID' ),
                            'FFID': localStorageService.get( 'FFID' )
                        }
                    }
                }
            } );
        };
        $scope.notification = function ( title, content, done, cancel, fn ) {
            closeModals();
            $scope.notificationPopUp = $modal.open( {
                templateUrl: 'app/controllers/notification_modal/notification_modal.html',
                controller: 'notificationCtrl',
                backdrop: 'static',
                size: 'md',
                keyboard: false,
                resolve: {
                    options: function () {
                        return {
                            title: title,
                            content: content,
                            done: done,
                            cancel: cancel
                        }
                    }
                }
            } );
            $scope.notificationPopUp.result.then( function () {
                fn( true );
            } );
        };
        $scope.requestAlert = function ( title, content, options1, options2, options3, fn ) {
            closeModals();
            $scope.requestAlertPopUp = $modal.open( {
                templateUrl: 'app/controllers/alert_modal/alert_modal.html',
                controller: 'alertCtrl',
                backdrop: 'static',
                size: 'md',
                keyboard: false,
                resolve: {
                    options: function () {
                        return {
                            title: title,
                            content: content,
                            options1: options1,
                            options2: options2,
                            options3: options3
                        }
                    }
                }
            } );
            $scope.requestAlertPopUp.result.then( function ( response ) {
                fn( response );
            } );
        };
        $rootScope.changeTab = function ( tab ) {
            $scope.tabsStats.currentTabId = tab.id;
            $state.go( tab.state, { reload: false, inherit: true, notify: true } );
            var ref1 = firebase.database().ref().child( "/applicantData/" + localStorageService.get( 'FFID' ) + "/customer/" );
            var object = $firebaseObject( ref1 );
            //            object.activeApplicant = 1;
            //            object.$save();
        };
        var watchTabState = function () {
            var ref1 = firebase.database().ref().child( "/applicantData/" + localStorageService.get( 'FFID' ) + "/tabsStats" );
            var object = $firebaseObject( ref1 );
            object.$watch( function () {
                if ( object.currentTabId ) {
                    $scope.tabsStats.currentTabId = object.currentTabId;
                    var tab = _.findWhere( $scope.mainTabList, { id: $scope.tabsStats.currentTabId } );
                    if ( tab ) {
                        $state.go( tab.state, { reload: false, inherit: true, notify: true } );
                    }
                }
            } );
        };
        $scope.isEngagedConsultant = function () {
            return ( localStorageService.get( 'engagedConsultantId' ) );
        };
        $scope.disableSelectConsultant = function () {
            var clientStatus = localStorageService.get( 'status' );
            if ( clientStatus && clientStatus != "" ) {
                if ( clientStatus == 'Hold' ) {
                    return true;
                } else {
                    return ( localStorageService.get( 'engagedConsultantId' ) !== 'somethings' ) ? true : false;
                }
            } else {
                return ( localStorageService.get( 'engagedConsultantId' ) !== 'somethings' ) ? true : false;
            }

        };
        var setConnectedConultantInfo = function ( email ) {
            delete $scope.myConsultantInfo;
            var info = _.findWhere( $scope.allConsultants, { email: email } );
            if ( info ) {
                $scope.myConsultantInfo = angular.copy( info );
            } else {
                delete $scope.myConsultantInfo;
            }
        };
        $scope.activeTab = function ( tab ) {
            if ( $state.current.name === tab.state ) {
                return true;
            }
        };
        $rootScope.tickTab = function ( id ) {
            if ( $scope.tabsStats && $scope.tabsStats[ id ] ) {
                $scope.tabsStats[ id ].enableTick = true;
            }
        };
        $rootScope.hasNotValidErrorDate = function ( value ) {
            if ( value ) {
                var date = value.split( '/' );
                var monthVal = date[ 1 ];
                var dateVal = date[ 0 ];
                if ( monthVal <= 12 ) {
                    if ( monthVal != 2 && dateVal <= 31 ) {
                        return false;
                    } else if ( monthVal == 2 ) {
                        if ( dateVal <= 29 ) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        };
        $rootScope.removeTickTab = function ( id ) {
            if ( $scope.tabsStats && $scope.tabsStats[ id ] ) {
                // console.log($scope.tabsStats[id]);
                $scope.tabsStats[ id ].enableTick = false;
                // console.log($scope.tabsStats[id]);
            }
        };
        $scope.isTicked = function ( tab ) {
            if ( $scope.tabsStats[ tab.id ] ) {
                //                $scope.$watch('tabsStats', function () {
                return ( $scope.tabsStats[ tab.id ].enableTick ) ? true : false;
                //                });
            }
        };
        var generateFFID = function () {
            $rootScope.userName = localStorageService.get( 'Name' );
            $scope.mainTabList = [ {
                state: 'app.applicant',
                title: 'Applicants',
                id: 'applicant'
            },
            {
                state: 'app.yourmortgagerequirement',
                title: 'Your mortgage requirement',
                id: 'yourmortgagerequirement'
            },
            {
                state: 'app.property',
                title: 'Property Details',
                id: 'property'
            },
            {
                state: 'app.employmentandincome',
                title: 'Employment and Income',
                id: 'employmentandincome'
            },
            {
                state: 'app.sourcenow',
                title: 'Initial Source',
                id: 'sourcenow'
            },
            {
                state: 'app.otherexisitingmortgages',
                title: 'Other Existing Mortgages',
                id: 'otherexisitingmortgages'
            },
            {
                state: 'app.liabilities',
                title: 'Liabilities',
                id: 'liability'
            },
            {
                state: 'app.monthly_outgoing',
                title: 'Monthly Outgoing',
                id: 'monthly_outgoing'
            },
            {
                state: 'app.dependant',
                title: 'Dependants',
                id: 'dependant'
            },
            {
                state: 'app.credithistroy',
                title: 'Credit History',
                id: 'credithistroy'
            },
            {
                state: 'app.finalsourcenow',
                title: 'Source Now',
                id: 'finalsourcenow'
            },
            {
                state: 'app.quote_summary',
                title: 'Quote Summary',
                id: 'quote_summary'
            },
            {
                state: 'app.nonSourceApplicant',
                title: 'Non source Applicants',
                id: 'nonSourceApplicant'
            },
            {
                state: 'app.nonSourceEmploymentandIncome',
                title: 'Non source Employment and Income',
                id: 'nonSourceEmploymentandIncome'
            },
            {
                state: 'app.nonSourceProperty',
                title: 'Non source Property Details',
                id: 'nonSourceProperty'
            },
            {
                state: 'app.end_page',
                title: 'End Page',
                id: 'end_page'
            }
            ];
            $scope.tabList = angular.copy( $scope.mainTabList );
            var lastIndex = $scope.tabList.indexOf( _.findWhere( $scope.tabList, { id: 'end_page' } ) );
            $scope.tabList.splice( lastIndex, 1 );
            var tabsStats = {
                currentTabId: 'applicant',
                applicant: {
                    active: false,
                    enableTick: false
                },
                yourmortgagerequirement: {
                    active: false,
                    enableTick: false
                },
                property: {
                    active: false,
                    enableTick: false
                },
                employmentandincome: {
                    active: false,
                    enableTick: false
                },
                sourcenow: {
                    active: false,
                    enableTick: false
                },
                otherexisitingmortgages: {
                    active: false,
                    enableTick: false
                },
                monthly_outgoing: {
                    active: false,
                    enableTick: false
                },
                dependant: {
                    active: false,
                    enableTick: false
                },
                liability: {
                    active: false,
                    enableTick: false
                },
                credithistroy: {
                    active: false,
                    enableTick: false
                },
                finalsourcenow: {
                    active: false,
                    enableTick: false
                },
                quote_summary: {
                    active: false,
                    enableTick: false
                },
                nonSourceApplicant: {
                    active: false,
                    enableTick: false
                },
                nonSourceEmploymentandIncome: {
                    active: false,
                    enableTick: false
                },
                nonSourceProperty: {
                    active: false,
                    enableTick: false
                },
                end_page: {
                    active: false,
                    enableTick: false
                }
            };
            if ( !localStorageService.get( 'FFID' ) ) {
                var obj = {
                    UserID: 111,
                    eCaseStatusID: 2,
                    FFID: ( localStorageService.get( 'FFID' ) ) ? localStorageService.get( 'FFID' ) : 0,
                    ModifiedBy: 111
                };
                memberService.createFFID( obj ).then( function ( response ) {
                    localStorageService.set( 'FFID', response.FFID );
                    updateClientDetails();
                    memberService.createAPP( { FFID: localStorageService.get( 'FFID' ) } ).then( function ( response ) {
                        memberService.getAPPid( { FFID: localStorageService.get( 'FFID' ) } ).then( function ( response ) {
                            localStorageService.set( 'AppID', response[ 'FFMortAppMap ' ][ 0 ][ 0 ] );
                            memberService.SaveMeetingAims( {
                                FFID: localStorageService.get( 'FFID' ),
                                MortgageApp: true,
                                eLeadSourceID: 1
                            } ).then( function ( response ) {

                            } );
                            var ref = firebase.database().ref().child( "/applicantData/" + localStorageService.get(
                                'FFID' ) );
                            var object = $firebaseObject( ref );
                            object.loginStatus = true;
                            object.lastLoginAt = moment().format( 'x' );
                            object.typing = { 'client': null, 'consultant': null };
                            object.tabsStats = tabsStats;
                            object.customer = {
                                //'tabsStats': tabsStats,
                                'activeTab': { name: 'app.applicant' },
                                'clientDetails': {
                                    'AppID': localStorageService.get( 'AppID' ),
                                    'FFID': localStorageService.get( 'FFID' )
                                },
                            };
                            $scope.FFID = localStorageService.get( 'FFID' );
                            object.$save();
                            $scope.tabsStats = {};
                            var ref1 = firebase.database().ref().child( "/applicantData/" + localStorageService.get(
                                'FFID' ) + "/tabsStats" );
                            var object1 = $firebaseObject( ref1 );
                            object1.$bindTo( $scope, 'tabsStats' );
                            object1.$loaded().then( function ( data ) {

                            } );
                            socketProgram();
                        } );
                    } );
                } );
            } else {
                updateClientDetails();
                memberService.createAPP( { FFID: localStorageService.get( 'FFID' ) } ).then( function ( response ) {
                    memberService.getAPPid( { FFID: localStorageService.get( 'FFID' ) } ).then( function ( response ) {
                        localStorageService.set( 'AppID', response[ 'FFMortAppMap ' ][ 0 ][ 0 ] );
                        memberService.GetMeetingAims( { FFID: localStorageService.get( 'FFID' ) } ).then( function ( response ) {
                            if ( response.MeetingAimsID ) {
                                var mettingAims = angular.copy( response );
                                memberService.SaveMeetingAims( mettingAims ).then( function ( response ) {
                                    //console.log(response);
                                } );
                            }
                        } );
                        $scope.FFID = localStorageService.get( 'FFID' );
                        var ref = firebase.database().ref().child( "/applicantData/" + localStorageService.get( 'FFID' ) +
                            "/customer/clientDetails" );
                        var object = $firebaseObject( ref );
                        object.FFID = localStorageService.get( 'FFID' );
                        object.AppID = localStorageService.get( 'AppID' );
                        object.$save();
                        $scope.tabsStats = {};
                        var ref1 = firebase.database().ref().child( "/applicantData/" + localStorageService.get( 'FFID' ) +
                            "/tabsStats" );
                        var object1 = $firebaseObject( ref1 );
                        object1.$bindTo( $scope, 'tabsStats' );
                        object1.$loaded().then( function ( data ) {

                        } );
                        socketProgram();
                    } );
                } );
            }
        };

        var initialize = function () {
            //            if (navigator.geolocation) {
            //                navigator.geolocation.getCurrentPosition(function (position) {
            //                    localStorageService.set('lat', position.coords.latitude);
            //                    localStorageService.set('lon', position.coords.longitude);
            //                    generateFFID();
            //                }, function (err) {
            //                    console.warn(`ERROR(${err.code}): ${err.message}`);
            //                }, {
            //                    enableHighAccuracy: true,
            //                    timeout: 5000,
            //                    maximumAge: 0
            //                });
            //            }
            //            $http.get(geoLocationUrl).then(function (response) {
            $http.get( 'https://ipapi.co/json' ).then( function ( response ) {
                localStorageService.set( 'lat', response.data.latitude );
                localStorageService.set( 'lon', response.data.longitude );
                generateFFID();
            } );
            //            });
        };
        var socketProgram = function () {
            socket.on( 'connect', function () {
                console.log( 'queuing connected' );
            } );
            socket.on( 'disconnect', function () {
                console.log( 'queuing disconnected' );
            } );
            socket.emit( "logIn", {
                id: localStorageService.get( 'clientID' ),
                name: localStorageService.get( 'Name' ),
                email: localStorageService
                    .get( 'email' ),
                location: { lat: localStorageService.get( 'lat' ), lon: localStorageService.get( 'lon' ) },
                type: "client"
            },
                function ( response ) {
                    // console.log(response);
                } );
            socket.on( 'add-consultant', function ( consultantInfo ) {
                var consInfo = {};
                consInfo.id = consultantInfo.id;
                consInfo.name = consultantInfo.name;
                consInfo.email = consultantInfo.email;
                consInfo.count = consultantInfo.count;
                consInfo.location = consultantInfo.location;
                consInfo.status = 'online';
                $scope.activeConsultants.push( consInfo );
                if ( _.findWhere( $scope.allConsultants, { email: consultantInfo.email } ) ) {
                    var consultant = _.findWhere( $scope.allConsultants, { email: consultantInfo.email } );
                    var indexConsultant = $scope.allConsultants.indexOf( consultant );
                    consultant.status = 'online';
                    $scope.allConsultants[ indexConsultant ] = consultant;
                } else {
                    $scope.allConsultants.push( consInfo );
                }
                if ( localStorageService.get( 'engagedConsultantId' ) === 'somethings' ) {
                    $scope.notification( 'Notice', consultantInfo.name + ' is online now', 'Ok', '', function ( response ) {

                    } );
                }
                $scope.$apply();
            } );
            socket.on( 'onlineConsultant', function ( consultantInfo ) {
                if ( _.findWhere( $scope.activeConsultants, { email: consultantInfo.email } ) ) {
                    var consultant = _.findWhere( $scope.activeConsultants, { email: consultantInfo.email } );
                    var indexConsultant = $scope.activeConsultants.indexOf( consultant );
                    consultant.status = 'online';
                    $scope.activeConsultants[ indexConsultant ] = consultant;
                } else {
                    var consInfo = {};
                    consInfo.id = consultantInfo.id;
                    consInfo.name = consultantInfo.name;
                    consInfo.email = consultantInfo.email;
                    consInfo.count = consultantInfo.count;
                    consInfo.location = consultantInfo.location;
                    consInfo.status = 'online';
                    $scope.activeConsultants.push( consInfo );
                }
                if ( _.findWhere( $scope.allConsultants, { email: consultantInfo.email } ) ) {
                    var consultant = _.findWhere( $scope.allConsultants, { email: consultantInfo.email } );
                    var indexConsultant = $scope.allConsultants.indexOf( consultant );
                    consultant.status = 'online';
                    $scope.allConsultants[ indexConsultant ] = consultant;
                } else {
                    var consInfo = {};
                    consInfo.id = consultantInfo.id;
                    consInfo.name = consultantInfo.name;
                    consInfo.email = consultantInfo.email;
                    consInfo.count = consultantInfo.count;
                    consInfo.location = consultantInfo.location;
                    consInfo.status = 'online';
                    $scope.activeConsultants.push( consInfo );
                    $scope.allConsultants.push( consInfo );
                }
                if ( localStorageService.get( 'engagedConsultantId' ) === 'somethings' ) {
                    $scope.notification( 'Notice', consultantInfo.name + ' is online now', 'Ok', '', function ( response ) {

                    } );
                }
                $scope.$apply();
            } );
            socket.on( 'consultantlist', function ( response ) {
                $scope.allConsultants = angular.copy( response );
                angular.forEach( response, function ( consultant ) {
                    if ( consultant.active ) {
                        consultant.status = 'online';
                        $scope.activeConsultants.push( consultant );
                    }
                } );
                if ( !localStorageService.get( 'DefaultConsultantEmail' ) ) {
                    if ( $scope.activeConsultants.length ) {
                        $scope.isLoading = true;
                        var consultantsWithLowCount = occupiedClient( $scope.activeConsultants );
                        var closestConsultant = NearestCity( localStorageService.get( 'lat' ), localStorageService.get( 'lon' ),
                            consultantsWithLowCount );
                        socket.emit( 'request-factfinding', {
                            id: localStorageService.get( 'clientID' ),
                            FFID: localStorageService.get(
                                'FFID' ),
                            name: localStorageService.get( 'Name' ),
                            email: localStorageService.get( 'email' )
                        },
                            closestConsultant,
                            function ( response ) {
                                $scope.isLoading = false;
                                if ( response.status === "free" ) {
                                    localStorageService.set( 'DefaultConsultantEmail', response.email );
                                    localStorageService.set( 'engagedConsultantId', response.email );
                                    setConnectedConultantInfo( response.email );
                                    updateClientDetails();
                                    //                                watchTabState();
                                    $scope.notification( 'Notice', 'You are now connected to Consultant ' + closestConsultant.name,
                                        'Ok', '',
                                        function ( response ) {
                                            if ( response ) {
                                                watchTabState();
                                            }
                                        } );
                                } else if ( response.status === "already" ) {
                                    $scope.notification( 'Notice',
                                        'You are already connected with the consultant. Do you wish to continue ?', 'Ok',
                                        '',
                                        function ( response ) {
                                            if ( response ) {
                                                watchTabState();
                                            }
                                        } );
                                } else if ( response.status === 'busy' ) {
                                    localStorageService.set( 'engagedConsultantId', 'somethings' );
                                    watchTabState();
                                    $scope.notification( 'Notice', 'Consultant ' + closestConsultant.name +
                                        ' is busy right now, Connect after sometime or try connecting other consultant',
                                        'Ok', '',
                                        function ( response ) {
                                            if ( !$( '.sidepanel-open-button' ).is( ":visible" ) )
                                                $( '.sidepanel-open-button' ).click();
                                        } );
                                } else {
                                    watchTabState();
                                    $scope.notification( 'Notice',
                                        'All Consultants are offline at the moment. Do you wish to continue ?', 'Yes',
                                        'No',
                                        function ( response ) {

                                        } );
                                }
                            } );
                    } else {
                        watchTabState();
                        $scope.requestAlert( 'Notice', 'All Consultants are offline at the moment. Do you wish to continue ?',
                            'No', 'Yes', '',
                            function ( response ) {
                                if ( response === 'Yes' ) {
                                    localStorageService.set( 'engagedConsultantId', 'somethings' );
                                } else {
                                    $scope.logOut();
                                }
                            } );
                    }
                } else {
                    $scope.isLoading = true;
                    //var defaultConsultant = _.findWhere($scope.allConsultants, {email: localStorageService.get('DefaultConsultantEmail')});
                    var defaultConsultant = { email: localStorageService.get( 'DefaultConsultantEmail' ) };
                    localStorageService.set( 'engagedConsultantId', 'somethings' );
                    socket.emit( 'request-factfinding', {
                        id: localStorageService.get( 'clientID' ),
                        FFID: localStorageService.get(
                            'FFID' ),
                        name: localStorageService.get( 'Name' ),
                        email: localStorageService.get( 'email' )
                    },
                        defaultConsultant,
                        function ( response ) {
                            $scope.isLoading = false;
                            if ( response.status === "free" ) {
                                localStorageService.set( 'engagedConsultantId', response.email );
                                setConnectedConultantInfo( response.email );
                                $scope.notification( 'Notice', 'You are now connected to Consultant ' + defaultConsultant.email,
                                    'Ok', '',
                                    function ( response ) {
                                        if ( response ) {
                                            watchTabState();
                                        }
                                    } );
                                //                            watchTabState();
                            } else if ( response.status === "already" ) {
                                $scope.notification( 'Notice',
                                    'You are already connected with the consultant. Do you wish to continue ?', 'Yes',
                                    'No',
                                    function ( response ) {
                                        if ( response ) {
                                            watchTabState();
                                        }
                                    } );
                            } else if ( response.status === 'busy' ) {
                                watchTabState();
                                $scope.requestAlert( 'Notice', 'Your default consultant is busy right now', 'Wait',
                                    'Choose Other', 'Continue',
                                    function ( response ) {
                                        if ( response === 'Choose Other' ) {
                                            if ( !$( '.sidepanel-open-button' ).is( ":visible" ) )
                                                $( '.sidepanel-open-button' ).click();
                                        } else if ( response === 'Continue' ) {

                                        } else {
                                            socket.emit( 'client-waiting', {
                                                id: localStorageService.get( 'clientID' ),
                                                FFID: localStorageService
                                                    .get( 'FFID' ),
                                                name: localStorageService.get( 'Name' ),
                                                email: localStorageService
                                                    .get( 'email' )
                                            }, defaultConsultant );
                                        }
                                    } );
                            } else {
                                watchTabState();
                                $scope.requestAlert( 'Notice', 'Your default consultant is Offline right now', 'Choose Other',
                                    'Continue', '',
                                    function ( response ) {
                                        if ( response === 'Continue' ) { } else {
                                            $( '.sidepanel-open-button' ).click();
                                        }
                                    } );
                            }
                        } );
                }
            } );
            socket.on( 'consultant-offline', function ( info ) {
                var consultant = _.findWhere( $scope.activeConsultants, { email: info.id } );
                var indexConsultant = $scope.activeConsultants.indexOf( consultant );
                $scope.activeConsultants.splice( indexConsultant, 1 );
                if ( _.findWhere( $scope.allConsultants, { email: info.id } ) ) {
                    var consultant = _.findWhere( $scope.allConsultants, { email: info.id } );
                    var indexConsultant = $scope.allConsultants.indexOf( consultant );
                    consultant.status = 'offline';
                    $scope.allConsultants[ indexConsultant ] = consultant;
                }
                if ( info.id === localStorageService.get( 'engagedConsultantId' ) ) {
                    setConnectedConultantInfo( info.id );
                    $scope.requestAlert( 'Notice', 'Unfortunately Consultant got disconnected ', 'Please select other consultant',
                        'Continue', '',
                        function ( response ) {
                            if ( response === 'Please select other consultant' ) {
                                localStorageService.set( 'engagedConsultantId', 'somethings' );
                                $( '.sidepanel-open-button' ).click();
                            } else {
                                localStorageService.set( 'engagedConsultantId', 'somethings' );
                            }
                            delete $scope.myConsultantInfo;
                        } );
                }
                $scope.$apply();
            } );
            socket.on( 'unable-to-respond', function () {
                $scope.requestAlert( 'Notice', 'Your default consultant is unable to respond', 'Choose Other', 'Continue', '',
                    function ( response ) {
                        if ( response === 'Choose Other' ) {
                            $( '.sidepanel-open-button' ).click();
                        } else if ( response === 'Continue' ) {
                            watchTabState();
                        }
                    } );
            } );
            socket.on( 'wait-factfind', function ( consultant ) {
                $scope.requestAlert( 'Notice', 'You are factfinding with ' + consultant.name, 'Ok', '', '', function ( response ) {
                    watchTabState();
                } );
            } );
            socket.on( 'consultant-transfer', function ( response, fromCon ) {
                if ( response.email && response.name ) {
                    $scope.requestAlert( 'Notice', 'Consultant ' + fromCon.name + ' transferred your case to consultant ' +
                        response.name, 'OK', '', '',
                        function ( response ) {
                            if ( response === 'Continue' ) {
                                watchTabState();
                            } else {
                                $( '.sidepanel-open-button' ).click();
                            }
                        } );
                    localStorageService.set( 'engagedConsultantId', response.email );
                    setConnectedConultantInfo( response.email );
                }
            } );
            socket.on( 'PeerToPeerEnable', function () {
                $rootScope.peerTopeer_flag = true;
                $rootScope.$apply();
            } );
            socket.on( 'PeerToPeerDisable', function () {
                $rootScope.peerTopeer_flag = false;
                $rootScope.$apply();
            } );
            socket.on( 'force-logout', function () {
                $scope.notification( 'Notice', 'Your account is been kicked off by other user', '', '', function ( response ) {

                } );
                $timeout( function () {
                    $scope.logOut();
                }, 200 );
                $scope.$apply();
            } );
        };
        $scope.connectConsultant = function ( consultant ) {
            if ( localStorageService.get( 'engagedConsultantId' ) === 'somethings' ) {
                localStorageService.set( 'status', "Hold" );
                socket.emit( 'request-factfinding', {
                    id: localStorageService.get( 'clientID' ),
                    FFID: localStorageService.get( 'FFID' ),
                    name: localStorageService
                        .get( 'Name' ),
                    email: localStorageService.get( 'email' )
                }, consultant, function ( response ) {
                    if ( response.status === "free" ) {
                        localStorageService.set( 'engagedConsultantId', response.email );
                        if ( _.findWhere( $scope.allConsultants, { email: response.email } ) ) {
                            var consultant = _.findWhere( $scope.allConsultants, { email: response.email } );
                            var indexConsultant = $scope.allConsultants.indexOf( consultant );
                            consultant.status = 'online';
                            $scope.allConsultants[ indexConsultant ] = consultant;
                        } else {
                            var consInfo = {};
                            consInfo.id = response.id;
                            consInfo.name = response.name;
                            consInfo.email = response.email;
                            consInfo.status = 'online';
                            $scope.activeConsultants.push( consInfo );
                            $scope.allConsultants.push( consInfo );
                        }
                        setConnectedConultantInfo( response.email );
                        localStorageService.set( 'status', "Free" );
                        if ( !localStorageService.get( 'DefaultConsultantEmail' ) ) {
                            localStorageService.set( 'DefaultConsultantEmail', response.email );
                            updateClientDetails();
                        }
                        watchTabState();
                    } else if ( response.status === "already" ) {
                        $scope.notification( 'Notice', 'You are already connected with the consultant. Do you wish to continue ?',
                            'Yes', 'No',
                            function ( response ) {
                                if ( response ) {
                                    localStorageService.set( 'status', "Free" );
                                    watchTabState();
                                }

                            } );
                    } else if ( response.status === 'busy' ) {
                        $scope.notification( 'Notice', 'Consultant ' + response.name +
                            ' is busy right now, Please select other consultant', 'Ok', '',
                            function ( response ) {
                                localStorageService.set( 'status', "Free" );
                                if ( !$( '.sidepanel-open-button' ).is( ":visible" ) )
                                    $( '.sidepanel-open-button' ).click();
                            } );
                    } else {
                        $scope.notification( 'Notice', 'All Consultants are offline at the moment. Do you wish to continue ?',
                            'Yes', 'No',
                            function ( response ) {
                                watchTabState();
                            } );
                    }
                } );
            }
        };
        var updateClientDetails = function () {
            var updateFields = {
                ClientID: localStorageService.get( 'clientID' ),
                FFID: localStorageService.get( 'FFID' ),
                DefaultConsultantEmail: localStorageService.get( 'DefaultConsultantEmail' ) ? localStorageService.get(
                    'DefaultConsultantEmail' ) : 0
            };
            memberService.updateClientDetail( updateFields ).then( function ( response ) {
                // console.log(response);
            } );
        };
        /*------------------ clossest consultant algoritham start--------------------------*/
        function Deg2Rad( deg ) {
            return deg * Math.PI / 180;
        }

        function PythagorasEquirectangular( lat1, lon1, lat2, lon2 ) {
            lat1 = Deg2Rad( lat1 );
            lat2 = Deg2Rad( lat2 );
            lon1 = Deg2Rad( lon1 );
            lon2 = Deg2Rad( lon2 );
            var R = 6371; // km
            var x = ( lon2 - lon1 ) * Math.cos( ( lat1 + lat2 ) / 2 );
            var y = ( lat2 - lat1 );
            var d = Math.sqrt( x * x + y * y ) * R;
            return d;
        }

        function NearestCity( latitude, longitude, consultantList ) {
            var mindif = 99999;
            var closest;
            angular.forEach( consultantList, function ( consultant, index ) {
                var dif = PythagorasEquirectangular( latitude, longitude, consultant.location.lat, consultant.location.lon );
                if ( dif < mindif ) {
                    closest = index;
                    mindif = dif;
                }
            } );
            return consultantList[ closest ];
        }

        function occupiedClient( consultantList ) {
            var sortByCount = DateFilter.sortByKey( consultantList, 'count' );
            var orderedConsultant = sortByCount.reverse();
            if ( orderedConsultant.length ) {
                var sameLowCountConsultant = _.where( orderedConsultant, { count: orderedConsultant[ 0 ].count } );
                return sameLowCountConsultant;
            }
        }
        /*------------------ clossest consultant algoritham over --------------------------*/
        initialize();
    }
] );

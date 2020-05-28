'use strict';
factFindApp.controller( 'dashboardCtrl', [ '$scope', '$http', '$rootScope', '$state', '$modal', 'localStorageService', '$firebaseObject',
    'webSocketAdderss', '$timeout', 'geoLocationUrl',
    function ( $scope, $http, $rootScope, $state, $modal, localStorageService, $firebaseObject, webSocketAdderss, $timeout, geoLocationUrl ) {
        var socket_queuing = io.connect( webSocketAdderss, {
            'forceNew': true,
            'reconnection': false,
            'reconnectionDelay': 1000,
            'reconnectionDelayMax': 5000,
            'reconnectionAttempts': 5
        } );
        $scope.tabsStats = {};
        $scope.clientList = [];
        $scope.consultantList = [];
        $scope.waitingClientList = [];
        $scope.searchCriterias = [ {
            key: 'firstName',
            title: 'First Name'
        }, {
            key: 'lastName',
            title: 'Last Name'
        }, {
            key: 'caseRef',
            title: 'Case Ref'
        }, {
            key: 'postcode',
            title: 'Postcode'
        } ];

        $scope.logOut = function () {
            localStorageService.clearAll();
            socket_queuing.disconnect();
            location.reload();
            $state.transitionTo( 'login', { reload: true, inherit: true, notify: true } );
        };
        $scope.downLoadChats = function () {
            var consultantInfo = {
                id: localStorageService.get( 'consultantID' ),
                name: localStorageService.get( 'name' ),
                email: localStorageService
                    .get( 'email' ),
                type: "consultant"
            };
            socket_queuing.emit( 'consultant-chathistory', consultantInfo, function ( chats ) {
                console.log( chats );
                var modal = $modal.open( {
                    templateUrl: 'app/controllers/chat_history/chat_history.html',
                    controller: 'chatHistoryCtrl',
                    backdrop: 'static',
                    size: 'md',
                    keyboard: false,
                    resolve: {
                        options: function () {
                            return {
                                chats: chats
                            };
                        }
                    }
                } );
            } );
        };
        $scope.refreshChatPosition = function ( event ) {
            $( '.chat-box' ).css( {
                'bottom': 0,
                'right': 0,
                'top': '',
                'left': ''
            } );
            $( '#chat-panel-body' ).css( "display", 'none' );
        };
        $scope.selectClient = function ( client ) {
            localStorageService.set( 'FFID', client.FFID );
            $rootScope.client = client;
            var ref1 = firebase.database().ref().child( "/applicantData/" + client.FFID + "/tabsStats" );
            $scope.tabsStats[ client.FFID ] = $firebaseObject( ref1 );
            $scope.tabsStats[ client.FFID ].$loaded().then( function ( data ) {
                watchTabState();
            } );
            //            delete $scope.tabsStats;
            //            $scope.tabsStats = {};
            //            var ref1 = firebase.database().ref().child("/applicantData/" + localStorageService.get('FFID') + "/tabsStats");
            //            var object1 = $firebaseObject(ref1);
            //            object1.$bindTo($scope, 'tabsStats');
            //            object1.$loaded().then(function (data) {
            //                watchTabState();
            //            });
        };
        $scope.isTicked = function ( tab ) {
            var FFID = localStorageService.get( 'FFID' );
            if ( $scope.tabsStats[ FFID ] && $scope.tabsStats[ FFID ][ tab.id ] ) {
                return ( $scope.tabsStats[ FFID ][ tab.id ].enableTick ) ? true : false;
            }
        };
        $scope.isActiveClient = function ( client ) {
            return angular.equals( client.FFID, $rootScope.client.FFID );
        };
        $scope.activeTab = function ( tab ) {
            var FFID = localStorageService.get( 'FFID' );
            if ( $scope.tabsStats[ FFID ] && $scope.tabsStats[ FFID ].currentTabId ) {
                var currentTab = _.findWhere( $scope.tabList, { id: $scope.tabsStats[ FFID ].currentTabId } );
                if ( currentTab ) {
                    return angular.equals( tab.id, currentTab.id );
                }
            }
        };
        $rootScope.changeTab = function ( tab ) {
            var FFID = localStorageService.get( 'FFID' );
            if ( $scope.tabsStats[ FFID ] ) {
                $scope.tabsStats[ FFID ].currentTabId = tab.id;
                var ref1 = firebase.database().ref().child( "/applicantData/" + FFID + "/tabsStats" );
                ref1.child( 'currentTabId' ).set( tab.id );
                $state.go( tab.state, { reload: false, inherit: true, notify: true } );
            }
        };
        var watchTabState = function () {
            var FFID = localStorageService.get( 'FFID' );
            //            $timeout(function () {
            //                var tab = _.findWhere($scope.tabList, {id: $scope.tabsStats[FFID].currentTabId});
            //                $state.go(tab.state, {reload: false, inherit: true, notify: true});
            //            }, 100);
            var ref1 = firebase.database().ref().child( "/applicantData/" + FFID + "/tabsStats" );
            var object = $firebaseObject( ref1 );
            object.$watch( function () {
                if ( object.currentTabId ) {
                    if ( $scope.tabsStats[ FFID ] ) {
                        var tab = _.findWhere( $scope.mainTabList, { id: $scope.tabsStats[ FFID ].currentTabId } );
                        $state.go( tab.state, { reload: false, inherit: true, notify: true } );
                    }
                }
            } );
        };
        $rootScope.tickTab = function ( id ) {
            var FFID = localStorageService.get( 'FFID' );
            if ( $scope.tabsStats[ FFID ] && $scope.tabsStats[ FFID ][ id ] ) {
                $scope.tabsStats[ FFID ][ id ].enableTick = true;
            }
        };
        $rootScope.removeTickTab = function ( id ) {
            var FFID = localStorageService.get( 'FFID' );
            if ( $scope.tabsStats[ FFID ] && $scope.tabsStats[ FFID ][ id ] ) {
                $scope.tabsStats[ FFID ][ id ].enableTick = false;
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

        $scope.caseDocument = function () {
            var model = $modal.open( {
                templateUrl: 'app/controllers/case_document/case_document.html',
                controller: 'CaseDocumentCtrl',
                backdrop: 'static',
                size: 'md',
                keyboard: false,
                resolve: {
                    options: function () {
                        return {
                            'consultantID': localStorageService.get( 'consultantID' ),
                            'FFID': localStorageService.get( 'FFID' )
                        }
                    }
                }
            } );
        };

        function closeModals() {
            if ( $scope.notificationPopUp ) {
                $scope.notificationPopUp.close();
                $scope.notificationPopUp = null;
            }
        }
        $scope.notification = function ( title, content, done, cancel, option3, fn ) {
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
                            cancel: cancel,
                            option3: option3
                        }
                    }
                }
            } );
            $scope.notificationPopUp.result.then( function ( response ) {
                fn( response );
            } );
        };

        var socketProgram = function () {
            socket_queuing.on( 'connect', function () {
                window.socket_queuing = socket_queuing;
                console.log( 'queuing connected' );
            } );
            socket_queuing.on( 'disconnect', function () {
                console.log( 'queuing disconnected' );
            } );
            socket_queuing.emit( "logIn", {
                id: localStorageService.get( 'consultantID' ),
                name: localStorageService.get( 'name' ),
                email: localStorageService
                    .get( 'email' ),
                location: { lat: localStorageService.get( 'lat' ), lon: localStorageService.get( 'lon' ) },
                type: "consultant"
            },
                function ( response ) {
                    if ( response === 'already' ) {
                        $scope.notification( 'Warning', 'Your account has been already logined!', 'Sign Out', '', '', function (
                            response ) {
                            if ( response === 'Sign Out' )
                                $scope.logOut();
                        } );
                    }
                } );
            socket_queuing.removeAllListeners();
            socket_queuing.on( 'client-request', function ( info, fn ) {
                var notificationText = info.consultant ? 'Consultant ' + info.consultant + ' transferred client ' + info.name +
                    ' to you' : 'Client ' + info.name + ' logged in cdeals.';
                $scope.notification( 'Notification', notificationText, 'Accept', 'Decline', 'Transfer', function ( response ) {
                    if ( response === 'Accept' ) {
                        var isAlready = _.findWhere( $scope.clientList, { email: info.email } );
                        if ( !isAlready ) {
                            fn( { status: 'free', email: localStorageService.get( 'email' ) } );
                            $scope.clientList.push( info );
                            $scope.selectClient( info );
                            $rootScope.$broadcast( 'CLIENT_ADD', { client: info } );
                        } else {
                            fn( { status: 'already', email: localStorageService.get( 'email' ) } );
                        }
                    } else if ( response === 'Decline' ) {
                        fn( { status: 'busy', name: localStorageService.get( 'name' ) } );
                    } else {
                        $( '.sidepanel-open-button' ).click();
                    }
                } );
                $timeout( function () {
                    $scope.notificationPopUp.close( 'Decline' );
                }, 10000 );
            } );
            socket_queuing.on( 'consultant-status', function ( info ) {
                closeModals();
                $scope.logOut();
            } );
            socket_queuing.on( 'client-offline', function ( info ) {
                //socket_queuing.emit('disconnect-client', 'sub');
                $rootScope.$broadcast( 'CLIENT_REMOVE', { client: angular.copy( info ) } );
                if ( _.findWhere( $scope.clientList, { email: info.email } ) ) {
                    var clientIndex = $scope.clientList.indexOf( _.findWhere( $scope.clientList, { email: info.email } ) );
                    $scope.clientList.splice( clientIndex, 1 );
                    if ( $scope.clientList.length ) {
                        $scope.selectClient( $scope.clientList[ 0 ] );
                    } else {
                        $state.go( 'app', { reload: false, inherit: true, notify: true } );
                    }
                    $scope.notification( 'Notification', 'Unfortunately Client ' + info.name + ' got disconnected', 'Ok', '', '',
                        function ( response ) {

                        } );
                }
            } );
            socket_queuing.on( 'consultantlist', function ( response ) {
                if ( response ) {
                    angular.forEach( response, function ( consultant ) {
                        consultant.status = 'online';
                        if ( consultant.email !== localStorageService.get( 'email' ) )
                            $scope.consultantList.push( consultant );
                        if ( consultant.email === localStorageService.get( 'email' ) ) {
                            $scope.waitingClientList = consultant.waitingClient;
                        }
                    } );
                }
            } );
            socket_queuing.on( 'add-consultant', function ( consultantInfo ) {
                var consInfo = {};
                consInfo.id = consultantInfo.id;
                consInfo.name = consultantInfo.name;
                consInfo.email = consultantInfo.email;
                consInfo.status = 'online';
                $scope.consultantList.push( consInfo );
                $scope.$apply();
            } );
            socket_queuing.on( 'onlineConsultant', function ( consultantInfo ) {
                if ( _.findWhere( $scope.consultantList, { email: consultantInfo.email } ) ) {
                    var consultant = _.findWhere( $scope.consultantList, { email: consultantInfo.email } );
                    var indexConsultant = $scope.consultantList.indexOf( consultant );
                    consultant.status = 'online';
                    $scope.consultantList[ indexConsultant ] = consultant;
                } else {
                    var consInfo = {};
                    consInfo.id = consultantInfo.id;
                    consInfo.name = consultantInfo.name;
                    consInfo.email = consultantInfo.email;
                    consInfo.count = consultantInfo.count;
                    consInfo.location = consultantInfo.location;
                    consInfo.status = 'online';
                    $scope.consultantList.push( consInfo );
                }
                $scope.$apply();
            } );
            socket_queuing.on( 'consultant-offline', function ( info ) {
                if ( _.findWhere( $scope.consultantList, { email: info.id } ) ) {
                    var consultant = _.findWhere( $scope.consultantList, { email: info.id } );
                    var indexConsultant = $scope.consultantList.indexOf( consultant );
                    consultant.status = 'offline';
                    $scope.consultantList[ indexConsultant ] = consultant;
                }
                $scope.$apply();
            } );
            socket_queuing.on( 'default-client-waiting', function ( info, fn ) {
                $scope.notification( 'Notification', 'Your default Client ' + info.name +
                    ' is waiting for you. do you want him to wait?', 'Yes', 'No', '',
                    function ( response ) {
                        if ( response === 'Yes' )
                            fn( true );
                        else
                            fn( false );
                    } );
            } );
            socket_queuing.on( 'update-waiting', function ( info ) {
                $scope.waitingClientList = angular.copy( info );
                $scope.$apply();
            } );
        };
        $scope.factFindWaitClient = function ( client ) {
            socket_queuing.emit( 'waiting-client-factfind', { email: localStorageService.get( 'email' ) }, client );
            $scope.clientList.push( client );
            $scope.selectClient( client );
            //$scope.$apply();
        };
        $scope.SendPeerToPeerEnable = function ( selectedClient ) {
            angular.forEach( $scope.clientList, function ( client ) {
                if ( client.FFID !== selectedClient.FFID ) {
                    socket_queuing.emit( 'PeerToPeerDisable', client );
                    client.PeerToPeer = false;
                } else {
                    client.PeerToPeer = true;
                }
            } );
            socket_queuing.emit( 'PeerToPeerEnable', selectedClient );
        };
        $scope.transferConsultant = function ( consultant ) {
            var client = _.findWhere( $scope.clientList, { FFID: localStorageService.get( 'FFID' ) } );
            if ( client ) {
                socket_queuing.emit( 'request-for-transfer', { id: client.id, FFID: client.FFID, name: client.name, email: client.email },
                    consultant, { email: localStorageService.get( 'email' ) },
                    function ( response ) {
                        if ( response.status === "free" ) {
                            var indexClient = $scope.clientList.indexOf( client );
                            $scope.clientList.splice( indexClient, 1 );
                            if ( $scope.clientList.length > 0 ) {
                                $scope.selectClient( $scope.clientList[ 0 ] );
                            } else {
                                $scope.$apply();
                            }
                        } else if ( response.status === 'busy' ) {
                            $scope.notification( 'Notice', 'Consultant ' + response.name + ' is busy.\n' +
                                'You can select another consultant.', 'OK', '', '',
                                function ( response ) {
                                    $( '.sidepanel-open-button' ).click();
                                } );
                        }
                    } );
            }
        };
        var initialize = function () {
            $rootScope.partner = 'Client';
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

            //            if (navigator.geolocation) {
            //                navigator.geolocation.getCurrentPosition(function (position) {
            //                    localStorageService.set('lat', position.coords.latitude);
            //                    localStorageService.set('lon', position.coords.longitude);
            //                    socketProgram();
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
                socketProgram();
            } );
            //            });
        };

        initialize();
    }
] );

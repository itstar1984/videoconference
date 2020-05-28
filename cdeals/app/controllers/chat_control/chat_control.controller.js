'use strict';

factFindApp.controller('chatController', ['$scope', '$rootScope', '$modal', 'localStorageService', 'voiceCallAddress', 'videoCallAdd', 'toaster',
    '$timeout',
    function ($scope, $rootScope, $modal, localStorageService, voiceCallAddress, videoCallAdd, toaster, $timeout) {

        var audio = new Audio('/cdeals/assets/audio/notification.mp3');
        audio.loop = true;

        var socket = io.connect(voiceCallAddress);
        socket.on('connect', function () {
            window.socket = socket;
            window.webrtc = true;
            chatLogin();
        });
        socket.on('disconnect', function () {
            window.webrtc = false;
        });

        function closeModals() {
            if($scope.chatAlertPopUp) {
                $scope.chatAlertPopUp.close();
                $scope.chatAlertPopUp = null;
            }
        }
        $scope.chatAlert = function (title, content, options1, options2, options3, mute, fn) {
            closeModals();
            $scope.chatAlertPopUp = $modal.open({
                templateUrl: 'app/controllers/alert_modal/alert_modal.html',
                controller: 'alertCtrl',
                backdrop: 'static',
                size: 'md',
                scope: $scope,
                keyboard: false,
                windowClass: 'calling',
                resolve: {
                    options: function () {
                        return {
                            title: title,
                            content: content,
                            options1: options1,
                            options2: options2,
                            options3: options3,
                            mute: mute
                        }
                    }
                }
            });
            $scope.chatAlertPopUp.result.then(function (response) {
                fn(response);
            });
        };

        $scope.mute = function () {
            audio.pause();
            audio.currentTime = 0;
        }

        var chatLogin = function () {
            socket.emit("logIn", {
                FFID: localStorageService.get('FFID'),
                id: localStorageService.get('clientID'),
                name: localStorageService
                    .get('Name'),
                email: localStorageService.get('email'),
                type: "client"
            }, function (response) {
                //console.log(response, $scope.$parent.email);
            });
            socket.removeAllListeners();
            socket.on('chat-message', function (from, to, message, dateTime) {
                var msgdetail = {};
                msgdetail.date = new Date().toLocaleTimeString();
                msgdetail.to = to;
                msgdetail.from = from;
                msgdetail.message = message;
                msgdetail.dateTime = dateTime;
                $scope.msgList.push(msgdetail);
                $scope.$apply();
                if(!$('#chat-panel-body').is(':visible')) {
                    document.getElementById('chat-panel-title').onclick();
                }
                $('.msg_div').scrollTop($('.msg_div')[0].scrollHeight);
            });
            socket.on('chat-history', function (msgList) {
                $scope.msgList = angular.copy(msgList);
                var consultantInfo = _.findWhere($scope.$parent.allConsultants, {
                    email: localStorageService.get(
                        'engagedConsultantId')
                });
                var clientInfo = {
                    from_ad: 'welcome',
                    FFID: localStorageService.get('FFID'),
                    id: localStorageService.get(
                        'clientID'),
                    name: localStorageService.get('Name'),
                    email: localStorageService.get('email'),
                    type: "client"
                };
                var welcomeMsg = {
                    to: consultantInfo,
                    from: clientInfo,
                    message: 'Welcome to Cdeals, \n ' + consultantInfo.name + ' is consulting you'
                };
                $scope.msgList.push(welcomeMsg);
            });
            socket.on('video-call-req', function (from, to, fn) {
                navigator.getUserMedia({ video: true, audio: false }, function (stream) {
                    audio.play();

                    var msgdetail = {};
                    msgdetail.from = from;
                    msgdetail.to = to;
                    msgdetail.fn = fn;
                    msgdetail.isCallRequest = true;
                    msgdetail.dateTime = moment().format();
                    $scope.msgList.push(msgdetail);
                    $scope.$apply();
                    $scope.chatAlert('Alert', msgdetail.from.name + ' is calling', '', 'Ignore', 'Accept', 'Mute',
                        function (res) {
                            if(res === 'Accept') {
                                $scope.acceptVideoCallReq(msgdetail);
                            } else {
                                $scope.cancelVideoCallReq(msgdetail);
                                //                            fn('Ignore');
                            }

                            audio.pause();
                            audio.currentTime = 0;
                        });
                    $timeout(function () {
                        fn(1);
                        $scope.chatAlertPopUp.close('Ignore');

                        audio.pause();
                        audio.currentTime = 0;
                    }, 10000);
                    window.localStream = stream;
                    if(!$('#chat-panel-body').is(':visible')) {
                        document.getElementById('chat-panel-title').onclick();
                    }
                    $('.msg_div').scrollTop($('.msg_div')[0].scrollHeight);
                }, function (err) {
                    $scope.callResponse(fn, 3);
                });
            });
            socket.on('voice-call-req', function (from, to, fn) {
                navigator.getUserMedia({ video: false, audio: true }, function (stream) {
                    audio.play();

                    var msgdetail = {};
                    msgdetail.from = from;
                    msgdetail.to = to;
                    msgdetail.fn = fn;
                    msgdetail.isCallRequest = true;
                    msgdetail.dateTime = moment().format();
                    $scope.msgList.push(msgdetail);
                    $scope.$apply();
                    $scope.chatAlert('Alert', msgdetail.from.name + ' is calling', '', 'Ignore', 'Accept', 'Mute',
                        function (res) {
                            if(res === 'Accept') {
                                $scope.acceptVoiceCallReq(msgdetail);
                            } else {
                                $scope.cancelVoiceCallReq(msgdetail);
                                //                            fn('Ignore');
                            }

                            audio.pause();
                            audio.currentTime = 0;
                        });
                    $timeout(function () {
                        fn(1);
                        $scope.chatAlertPopUp.close('Ignore');

                        audio.pause();
                        audio.currentTime = 0;
                    }, 10000);
                    window.localStream = stream;
                    if(!$('#chat-panel-body').is(':visible')) {
                        document.getElementById('chat-panel-title').onclick();
                    }
                    $('.msg_div').scrollTop($('.msg_div')[0].scrollHeight);
                }, function (err) {
                    $scope.callResponse(fn, 3);
                });
            });
            socket.on('videocall-disconnect', function (status) {
                if(status === 'holded') {
                    $scope.chatAlert('Notice', localStorageService.get('engagedConsultantId') +
                        ' is  is busy right now, will contact you shortly', 'Ok', '', '', '',
                        function (res) {

                        });
                }
                $(".video-controll").addClass('hide');
                $(".video-controll").hide();
                window.localStream = null;
                $(".video-controll iframe").attr('src', null);
            });
            socket.on('resume-call', function (from, to, fn) {
                $scope.chatAlert('Notice', localStorageService.get('engagedConsultantId') +
                    ' is resume your call. please accept...', 'Accept', 'Reject', '', '',
                    function (res) {
                        if(res === 'Accept') {
                            fn('accept');
                            $(".video-controll").removeClass('hide');
                            $(".video-controll").show();
                            $(".video-controll iframe").attr('src', to.src);
                        } else {
                            fn('reject');
                        }
                    });

            });
            socket.on('join-conference', function (remoteStream) {
                navigator.getUserMedia({ video: false, audio: true }, function (stream) {
                    window.localStream = stream;
                    $(".video-controll").removeClass('hide');
                    $(".video-controll").show();
                    $(".video-controll iframe").attr('src', remoteStream);
                }, function (err) {
                    console.error(err);
                });
            });
        };
        $scope.sendMessage = function (evt, message) {
            if(evt.keyCode === 13 && !evt.shiftKey) {
                var msg = angular.copy(message);
                var from = {
                    from_ad: 1,
                    FFID: localStorageService.get('FFID'),
                    id: localStorageService.get('clientID'),
                    name: localStorageService
                        .get('Name'),
                    email: localStorageService.get('email'),
                    type: "client"
                };
                var to = { email: localStorageService.get('engagedConsultantId') };
                if(to.email && to.email === 'somethings') {
                    toaster.pop('error', 'You not conected to any consultant yet!', '');
                } else {
                    if($rootScope.peerTopeer_flag) {
                        from.isarrived = false;
                    } else {
                        from.isarrived = true;
                    }
                    socket.emit('chat-message', from, to, msg, moment(), function (err) {
                        if(!err) {
                            var msgdetail = {};
                            msgdetail.dateTime = moment().format();
                            msgdetail.from = from;
                            msgdetail.message = msg;
                            $scope.msgList.push(msgdetail);
                            $scope.messageDetails = {};
                            $scope.$apply();
                            $('.msg_div').scrollTop($('.msg_div')[0].scrollHeight);
                        } else {
                            $scope.messageDetails = {};
                            toaster.pop('error', 'Your consultant offline!', '');
                        }
                    });
                }
            }
        };
        $scope.voiceCall = function () {
            if(localStorageService.get('engagedConsultantId') === 'somethings') {
                $scope.chatAlert('Warning', 'Your consultant is offline. Please select another consultant.', 'Ok', '', '', '', function (
                    response) {
                    $('.sidepanel-open-button').click();
                    return;
                });
            } else {
                if($rootScope.peerTopeer_flag) {
                    navigator.getUserMedia({ video: false, audio: true }, function (stream) {
                        var from = {
                            from_ad: 2,
                            FFID: localStorageService.get('FFID'),
                            id: localStorageService.get('clientID'),
                            name: localStorageService.get('Name'),
                            email: localStorageService.get('email'),
                            type: "client"
                        };
                        //var to = {email: localStorageService.get('engagedConsultantId')};
                        var to = _.findWhere($scope.$parent.allConsultants, {
                            email: localStorageService.get(
                                'engagedConsultantId')
                        });
                        var msgdetail = {};
                        msgdetail.from = from;
                        msgdetail.dateTime = moment().format();
                        msgdetail.to = to;
                        msgdetail.partner = "Consultant";
                        $scope.msgList.push(msgdetail);
                        $scope.$apply();
                        window.localStream = stream;
                        callVoiceMessage(msgdetail);
                    }, function (err) {
                        $scope.chatAlert("warning",
                            "Please check your audio settings on your machine  to have a video/Audio call help with our consultant",
                            'Ok', '', '', '',
                            function (response) {

                            });
                    });
                } else {
                    $scope.chatAlert('Warning',
                        'Your consultant is busy on some other call.In case if you want to buzz urgently please click on Emergency Call button.',
                        'Ok', '', '', '',
                        function (response) {

                        });
                }
            }
        };
        $scope.urgentCall = function () {
            if(localStorageService.get('engagedConsultantId') === 'somethings') {
                $scope.chatAlert('Warning', 'Your consultant is offline. Please select another consultant.', 'Ok', '', '', '', function (
                    response) {
                    $('.sidepanel-open-button').click();
                    return;
                });
            } else {
                if(!$rootScope.peerTopeer_flag) {
                    var from = {
                        urgent: true,
                        from_ad: 4,
                        FFID: localStorageService.get('FFID'),
                        id: localStorageService.get('clientID'),
                        name: localStorageService.get('Name'),
                        email: localStorageService.get('email'),
                        type: "client"
                    };
                    //                    var to = {email: localStorageService.get('engagedConsultantId')};
                    var to = _.findWhere($scope.$parent.allConsultants, { email: localStorageService.get('engagedConsultantId') });
                    socket.emit('urgent-call', from, to, function (response) {
                        if(response === 'accepted') {
                            $scope.chatAlert('Notice', 'The consultant accepted your urgent request.\n' +
                                'You can have a video or voice conversation with him.', 'Ok', '', '', '',
                                function (res) {
                                    navigator.getUserMedia({ video: false, audio: true }, function (stream) {
                                        window.localStream = stream;
                                        $(".video-controll").removeClass('hide');
                                        $(".video-controll").show();
                                        $(".video-controll iframe").attr('src', videoCallAdd + '/voice-chat/#room/' +
                                            from.email + '---' + to.email);
                                    }, function (err) {
                                        console.error(err);
                                    });
                                });
                        } else {
                            $scope.chatAlert('Notice', 'The consultant rejected your urgent request.\n' + 'Please wait .', 'Ok',
                                '', '', '',
                                function (response) {

                                });
                        }
                    });
                }
            }
        };
        $scope.videoCall = function () {
            if(localStorageService.get('engagedConsultantId') === 'somethings') {
                $scope.chatAlert('Warning', 'Your consultant is offline. Please select another consultant.', 'Ok', '', '', '', function (
                    response) {
                    $('.sidepanel-open-button').click();
                    return;
                });
            } else {
                if($rootScope.peerTopeer_flag) {
                    navigator.getUserMedia({ video: true, audio: false }, function (stream) {
                        var from = {
                            from_ad: 3,
                            FFID: localStorageService.get('FFID'),
                            id: localStorageService.get('clientID'),
                            name: localStorageService.get('Name'),
                            email: localStorageService.get('email'),
                            type: "client"
                        };
                        //var to = {email: localStorageService.get('engagedConsultantId')};
                        var to = _.findWhere($scope.$parent.allConsultants, {
                            email: localStorageService.get(
                                'engagedConsultantId')
                        });
                        var msgdetail = {};
                        msgdetail.from = from;
                        msgdetail.dateTime = moment().format();
                        msgdetail.to = to;
                        msgdetail.partner = "Consultant";
                        $scope.msgList.push(msgdetail);
                        $scope.$apply();
                        window.localStream = stream;
                        callVideoMessage(msgdetail);
                    }, function (err) {
                        $scope.chatAlert("Warning",
                            "Please check your audio settings on your machine  to have a video/Audio call help with our consultant",
                            'Ok', '', '', '',
                            function (response) {

                            });
                    });
                } else {
                    $scope.chatAlert('Warning',
                        'Your consultant is busy on some other call.In case if you want to buzz urgently please click on Emergency Call button.',
                        'Ok', '', '', '',
                        function (response) {

                        });
                }
            }
        };
        var callVoiceMessage = function (msgdetail) {
            socket.emit('voice-call-req', msgdetail.from, msgdetail.to, function (ack) {
                if(ack < 0) {
                    $scope.chatAlert("warning", msgdetail.to.name + " does not exits!", 'Ok', '', '', '', function (response) {
                        if(_.findWhere($scope.msgList, { from: msgdetail.from })) {
                            var msgIndex = $scope.msgList.indexOf(_.findWhere($scope.msgList, { from: msgdetail.from }));
                            $scope.msgList[msgIndex].isCallRequest = false;
                            //$scope.msgList.splice(msgIndex, 1);
                        }
                    });
                } else if(ack === 3) {
                    $scope.chatAlert("warning", "Cannot connect with " + msgdetail.to.name + " as there is no audio device!",
                        'Ok', '', '', '',
                        function (response) {
                            if(_.findWhere($scope.msgList, { from: msgdetail.from })) {
                                var msgIndex = $scope.msgList.indexOf(_.findWhere($scope.msgList, { from: msgdetail.from }));
                                $scope.msgList[msgIndex].isCallRequest = false;
                                //                            $scope.msgList.splice(msgIndex, 1);
                            }
                        });
                } else if(ack === 2) {
                    $scope.chatAlert("warning", "Cannot connect Voice call right now with " + msgdetail.to.name, 'Ok', '', '', '',
                        function (response) {
                            if(_.findWhere($scope.msgList, { from: msgdetail.from })) {
                                var msgIndex = $scope.msgList.indexOf(_.findWhere($scope.msgList, { from: msgdetail.from }));
                                $scope.msgList[msgIndex].isCallRequest = false;
                                //                            $scope.msgList.splice(msgIndex, 1);
                            }
                        });
                } else if(ack === 1) {
                    $scope.chatAlert("warning", msgdetail.to.name + " does not respond!", 'Ok', '', '', '', function (response) {
                        if(_.findWhere($scope.msgList, { from: msgdetail.from })) {
                            var msgIndex = $scope.msgList.indexOf(_.findWhere($scope.msgList, { from: msgdetail.from }));
                            $scope.msgList[msgIndex].isCallRequest = false;
                            //                            $scope.msgList.splice(msgIndex, 1);
                        }
                    });
                } else {
                    if(_.findWhere($scope.msgList, { from: msgdetail.from })) {
                        var msgIndex = $scope.msgList.indexOf(_.findWhere($scope.msgList, { from: msgdetail.from }));
                        $scope.msgList[msgIndex].isCallRequest = false;
                        //                        $scope.msgList.splice(msgIndex, 1);
                    }
                    $(".video-controll").removeClass('hide');
                    $(".video-controll").show();
                    $(".video-controll iframe").attr('src', videoCallAdd + '/voice-chat/#room/' + msgdetail.from.email + '---' +
                        msgdetail.to.email);
                }
            });
        };
        var callVideoMessage = function (msgdetail) {
            socket.emit('voice-call-req', msgdetail.from, msgdetail.to, function (ack) {
                if(ack < 0) {
                    $scope.chatAlert("warning", msgdetail.to.name + " does not exits!", 'Ok', '', '', '', function (response) {
                        if(_.findWhere($scope.msgList, { from: msgdetail.from })) {
                            var msgIndex = $scope.msgList.indexOf(_.findWhere($scope.msgList, { from: msgdetail.from }));
                            $scope.msgList[msgIndex].isCallRequest = false;
                            //$scope.msgList.splice(msgIndex, 1);
                        }
                    });
                } else if(ack === 3) {
                    $scope.chatAlert("warning", "Can not converstaion with " + msgdetail.to.name +
                        " because does not have camera!", 'Ok', '', '', '',
                        function (response) {
                            if(_.findWhere($scope.msgList, { from: msgdetail.from })) {
                                var msgIndex = $scope.msgList.indexOf(_.findWhere($scope.msgList, { from: msgdetail.from }));
                                $scope.msgList[msgIndex].isCallRequest = false;
                                //$scope.msgList.splice(msgIndex, 1);
                            }
                        });
                } else if(ack === 2) {
                    $scope.chatAlert("warning", "Cannot connect video call right now with " + msgdetail.to.name, 'Ok', '', '', '',
                        function (response) {
                            if(_.findWhere($scope.msgList, { from: msgdetail.from })) {
                                var msgIndex = $scope.msgList.indexOf(_.findWhere($scope.msgList, { from: msgdetail.from }));
                                $scope.msgList[msgIndex].isCallRequest = false;
                                //$scope.msgList.splice(msgIndex, 1);
                            }
                        });
                } else if(ack === 1) {
                    $scope.chatAlert("warning", msgdetail.to.name + " does not respond!", 'Ok', '', '', '', function (response) {
                        if(_.findWhere($scope.msgList, { from: msgdetail.from })) {
                            var msgIndex = $scope.msgList.indexOf(_.findWhere($scope.msgList, { from: msgdetail.from }));
                            $scope.msgList[msgIndex].isCallRequest = false;
                            //$scope.msgList.splice(msgIndex, 1);
                        }
                    });
                } else {
                    if(_.findWhere($scope.msgList, { from: msgdetail.from })) {
                        var msgIndex = $scope.msgList.indexOf(_.findWhere($scope.msgList, { from: msgdetail.from }));
                        $scope.msgList[msgIndex].isCallRequest = false;
                        //$scope.msgList.splice(msgIndex, 1);
                    }
                    $(".video-controll").removeClass('hide');
                    $(".video-controll").show();
                    $(".video-controll iframe").attr('src', videoCallAdd + '/chat/#room/' + msgdetail.from.email + '---' +
                        msgdetail.to.email);
                }

            });
        };
        $scope.acceptVoiceCallReq = function (msg) {
            $scope.callResponse(msg.fn, 0);
            if(_.findWhere($scope.msgList, { from: msg.from })) {
                var msgIndex = $scope.msgList.indexOf(_.findWhere($scope.msgList, { from: msg.from }));
                $scope.msgList[msgIndex].isCallRequest = false;
                //                $scope.msgList.splice(msgIndex, 1);
            }
            $(".video-controll").removeClass('hide');
            $(".video-controll").show();
            $(".video-controll iframe").attr('src', videoCallAdd + '/voice-chat/#room/' + msg.from.email + '---' + msg.to.email);
        };
        $scope.acceptVideoCallReq = function (msg) {
            $scope.callResponse(msg.fn, 0);
            if(_.findWhere($scope.msgList, { from: msg.from })) {
                var msgIndex = $scope.msgList.indexOf(_.findWhere($scope.msgList, { from: msg.from }));
                $scope.msgList[msgIndex].isCallRequest = false;
                //$scope.msgList.splice(msgIndex, 1);
            }
            $(".video-controll").removeClass('hide');
            $(".video-controll").show();
            $(".video-controll iframe").attr('src', videoCallAdd + '/chat/#room/' + msg.from.email + '---' + msg.to.email);
        };
        $scope.cancelVoiceCallReq = function (msg) {
            $scope.callResponse(msg.fn, 2);
            if(_.findWhere($scope.msgList, { from: msg.from })) {
                var msgIndex = $scope.msgList.indexOf(_.findWhere($scope.msgList, { from: msg.from }));
                $scope.msgList[msgIndex].isCallRequest = false;
                //$scope.msgList.splice(msgIndex, 1);
            }
            $(".video-controll").addClass('hide');
            $(".video-controll").hide();
        };
        $scope.cancelVideoCallReq = function (msg) {
            $scope.callResponse(msg.fn, 2);
            if(_.findWhere($scope.msgList, { from: msg.from })) {
                var msgIndex = $scope.msgList.indexOf(_.findWhere($scope.msgList, { from: msg.from }));
                $scope.msgList[msgIndex].isCallRequest = false;
                //$scope.msgList.splice(msgIndex, 1);
            }
            $(".video-controll").addClass('hide');
            $(".video-controll").hide();
        };
        $scope.endVideoVoiceChat = function () {
            var consultantInfo = { email: localStorageService.get('engagedConsultantId') };
            socket.emit('videocall-disconnect', consultantInfo, 'normal');
            $(".video-controll").addClass('hide');
            $(".video-controll").hide();
            window.localStream = null;
            $(".video-controll iframe").attr('src', null);
        };
        $scope.callResponse = function (fn, response) {
            fn(response);
        };
        var initialize = function () {
            $scope.msgList = [];
            $scope.messageDetails = {};
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        };
        initialize();
    }
]);

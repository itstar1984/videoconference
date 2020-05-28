'use strict';

factFindApp.controller('chatController', ['$scope', '$modal', 'localStorageService', 'voiceCallAddress', 'videoCallAdd', '$timeout', 'toaster',
    function ($scope, $modal, localStorageService, voiceCallAddress, videoCallAdd, $timeout, toaster) {

        var audio = new Audio('/cdeals/assets/audio/notification.mp3');
        audio.loop = true;



        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        var socket = io.connect(voiceCallAddress);
        socket.on('connect', function () {
            window.socket = socket;
            window.webrtc = true;
            chatLogin();
        });
        socket.on('disconnect', function () {
            window.webrtc = false;
        });
        var chatLogin = function () {
            socket.emit("logIn", {
                id: localStorageService.get('consultantID'),
                name: localStorageService.get('name'),
                email: localStorageService
                    .get('email'),
                type: "consultant"
            }, function (response) {
                //console.log(response, $scope.$parent.email);
            });
            socket.removeAllListeners();
            socket.on('chat-message', function (from, to, message, dateTime) {
                var msgdetail = {};
                msgdetail.dateTime = dateTime;
                msgdetail.from = from;
                msgdetail.to = to;
                msgdetail.message = message;
                if(from.isarrived) {
                    if(_.findWhere($scope.myClients, { FFID: from.FFID })) {
                        var arrivedClientIndex = $scope.myClients.indexOf(_.findWhere($scope.myClients, { FFID: from.FFID }));
                        $scope.myClients[arrivedClientIndex].isarrived = true;
                    }
                }
                $scope.msgList[from.FFID].msg.push(msgdetail);
                $scope.$apply();
                if(!$('#chat-panel-body').is(':visible')) {
                    document.getElementById('chat-panel-title').onclick();
                }
                $('.msg_list_div').scrollTop($('.msg_list_div')[0].scrollHeight);
            });
            socket.on('video-call-req', function (from, to, fn) {
                navigator.getUserMedia({ video: true, audio: false }, function (stream) {
                    audio.play();

                    var msgdetail = {};
                    msgdetail.from = from;
                    msgdetail.to = to;
                    msgdetail.fn = fn;
                    msgdetail.dateTime = moment().format();
                    msgdetail.isCallRequest = true;
                    $scope.msgList[from.FFID].msg.push(msgdetail);
                    $scope.$apply();
                    $scope.chatnotification('Alert', msgdetail.from.name + ' is calling', 'Accept', 'Ignore', 'Mute',
                        function (res) {
                            if(res === 'Accept') {
                                $scope.acceptVideoCallReq(msgdetail);
                            } else {
                                $scope.cancelVideoCallReq(msgdetail);
                            }

                            audio.pause();
                            audio.currentTime = 0;
                        });
                    $timeout(function () {
                        fn(1);
                        $scope.chatnotificationPopUp.close('Ignore');
                        audio.pause();
                        audio.currentTime = 0;
                    }, 10000);
                    window.localStream = stream;
                    if(!$('#chat-panel-body').is(':visible')) {
                        document.getElementById('chat-panel-title').onclick();
                    }
                    $('.msg_list_div').scrollTop($('.msg_list_div')[0].scrollHeight);
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
                    msgdetail.dateTime = moment().format();
                    msgdetail.isCallRequest = true;
                    $scope.msgList[from.FFID].msg.push(msgdetail);
                    $scope.$apply();
                    $scope.chatnotification('Alert', msgdetail.from.name + ' is calling', 'Accept', 'Ignore', 'Mute',
                        function (res) {
                            if(res === 'Accept') {
                                $scope.acceptVoiceCallReq(msgdetail);
                            } else {
                                $scope.cancelVoiceCallReq(msgdetail);
                            }

                            audio.pause();
                            audio.currentTime = 0;
                        });
                    $timeout(function () {
                        fn(1);
                        $scope.chatnotificationPopUp.close('Ignore');

                        audio.pause();
                        audio.currentTime = 0;
                    }, 10000);
                    window.localStream = stream;
                    if(!$('#chat-panel-body').is(':visible')) {
                        document.getElementById('chat-panel-title').onclick();
                    }
                    $('.msg_list_div').scrollTop($('.msg_list_div')[0].scrollHeight);
                }, function (err) {
                    $scope.callResponse(fn, 3);
                });
            });
            socket.on('urgent-call', function (from, to, fn) {
                $scope.chatnotification('Notice', 'Client ' + from.name + ' buzzing you on emergency call.', 'Accept', 'Reject',
                    '',
                    function (response) {
                        if(response === 'Accept') {
                            fn('accepted');
                            $('.msg_list_div').scrollTop($('.msg_list_div')[0].scrollHeight);
                            $scope.putClientHold(from);
                            $(".video-controll").addClass('hide');
                            $(".video-controll").hide();
                            window.localStream = null;
                            $(".video-controll iframe").attr('src', null);
                            $timeout(function () {
                                navigator.getUserMedia({ video: false, audio: true }, function (stream) {
                                    window.localStream = stream;
                                    $(".video-controll").removeClass('hide');
                                    $(".video-controll").show();
                                    $(".video-controll iframe").attr('src', videoCallAdd +
                                        'voice-chat/#room/' + from.email + '---' + to.email);
                                }, function (err) {
                                    console.error(err);
                                });
                            }, 500);
                        } else {
                            fn('canceled');
                        }
                    });
            });
            socket.on('videocall-disconnect', function (status) {
                $(".video-controll").addClass('hide');
                $(".video-controll").hide();
                window.localStream = null;
                $(".video-controll iframe").attr('src', null);
            });
        };
        $scope.joinRoom = function (client) {
            var stream = $(".video-controll iframe").attr('src');
            if(stream != null) {
                socket.emit('join-conference', client, stream);
            }
        };
        $scope.putClientHold = function (client) {
            var currentClient = angular.copy($scope.clientInfo);
            if($(".video-controll").hasClass('voice')) {
                currentClient.onVoiceCall = true;
            } else {
                currentClient.onVideoCall = true;
            }
            currentClient.src = $(".video-controll iframe").attr('src');
            $scope.holdClients.push(currentClient);
            socket.emit('videocall-disconnect', currentClient, 'holded');
            if(_.findWhere($scope.myClients, { FFID: client.FFID })) {
                var arrivedClients = _.findWhere($scope.myClients, { FFID: client.FFID });
                $scope.setClientChat(arrivedClients);
            }
        };
        $scope.resumeCall = function (client) {
            socket.emit('videocall-disconnect', $scope.clientInfo, 'normal');
            if(_.findWhere($scope.holdClients, { FFID: client.FFID })) {
                var holdClientIndex = $scope.holdClients.indexOf(_.findWhere($scope.holdClients, { FFID: client.FFID }));
                $scope.holdClients.splice(holdClientIndex, 1);
                $(".video-controll").addClass('hide');
                $(".video-controll").hide();
                window.localStream = null;
                $(".video-controll iframe").attr('src', null);
                $scope.setClientChat(client);
                var from = {
                    id: localStorageService.get('consultantID'),
                    name: localStorageService.get('name'),
                    email: localStorageService
                        .get('email'),
                    type: 'consultant'
                };

                socket.emit('resume-call', from, client, function (res) {
                    if(res === 'accept') {
                        $timeout(function () {
                            if(client.onVoiceCall) {
                                navigator.getUserMedia({ video: false, audio: true }, function (stream) {
                                    $(".video-controll").removeClass('hide');
                                    $(".video-controll").show();
                                    $(".video-controll iframe").attr('src', client.src);
                                    window.localStream = stream;
                                }, function (err) {
                                    console.error(err);
                                });
                            } else {
                                navigator.getUserMedia({ video: true, audio: false }, function (stream) {
                                    $(".video-controll").removeClass('hide');
                                    $(".video-controll").show();
                                    $(".video-controll iframe").attr('src', client.src);
                                    window.localStream = stream;
                                }, function (err) {
                                    console.error(err);
                                });
                            }
                        }, 500);
                    }
                });

            }
        };
        $scope.sendMessage = function (evt, message) {
            if(evt.keyCode === 13 && !evt.shiftKey) {
                var from = {
                    from_ad: 1,
                    id: localStorageService.get('consultantID'),
                    name: localStorageService.get('name'),
                    email: localStorageService
                        .get('email'),
                    type: 'consultant'
                };
                var to = angular.copy($scope.clientInfo);
                if(angular.equals(to, {})) {
                    toaster.pop('error', 'You have not any client yet!', '');
                } else {
                    socket.emit('chat-message', from, to, message, moment(), function (err) {
                        if(!err) {
                            var msgdetail = {};
                            msgdetail.date = new Date().toLocaleTimeString();
                            msgdetail.from = from;
                            msgdetail.message = message;
                            msgdetail.dateTime = moment().format();
                            $scope.msgList[$scope.clientInfo.FFID].msg.push(msgdetail);
                            $scope.messageDetails = {};
                            $scope.$apply();
                            $('.msg_list_div').scrollTop($('.msg_list_div')[0].scrollHeight);
                        } else {
                            $scope.messageDetails = {};
                            toaster.pop('error', 'Your client offline!', '');
                        }
                    });
                }
            }
        };
        $scope.voiceCall = function () {
            navigator.getUserMedia({ video: false, audio: true }, function (stream) {
                var from = {
                    from_ad: 2,
                    id: localStorageService.get('consultantID'),
                    name: localStorageService.get('name'),
                    email: localStorageService.get('email'),
                    type: 'consultant'
                };
                var to = angular.copy($scope.clientInfo);
                var msgdetail = {};
                msgdetail.from = from;
                msgdetail.dateTime = moment().format();
                msgdetail.to = to;
                msgdetail.partner = "Client";
                $scope.msgList[$scope.clientInfo.FFID].msg.push(msgdetail);
                $scope.$apply();
                window.localStream = stream;
                callVoiceMessage(msgdetail);
            }, function (err) {
                $scope.chatnotification("warning",
                    " Please check your audio settings on your machine  to have a video/Audio call help with the client",
                    'Ok', '', '',
                    function (response) {

                    });
            });
        };
        $scope.videoCall = function () {
            navigator.getUserMedia({ video: true, audio: false }, function (stream) {
                var from = {
                    from_ad: 3,
                    id: localStorageService.get('consultantID'),
                    name: localStorageService.get('name'),
                    email: localStorageService.get('email'),
                    type: 'consultant'
                };
                var to = angular.copy($scope.clientInfo);
                var msgdetail = {};
                msgdetail.dateTime = moment().format();
                msgdetail.from = from;
                msgdetail.to = to;
                msgdetail.partner = "Client";
                $scope.msgList[$scope.clientInfo.FFID].msg.push(msgdetail);
                $scope.$apply();
                window.localStream = stream;
                callVideoMessage(msgdetail);
            }, function (err) {
                $scope.chatnotification("warning",
                    " Please check your audio settings on your machine  to have a video/Audio call help with the client",
                    'Ok', '', '',
                    function (response) {

                    });
            });

        };
        $scope.acceptVoiceCallReq = function (msg) {
            $scope.callResponse(msg.fn, 0);
            if(_.findWhere($scope.msgList[msg.from.FFID].msg, { from: msg.from })) {
                var msgIndex = $scope.msgList[msg.from.FFID].msg.indexOf(_.findWhere($scope.msgList[msg.from.FFID].msg, { from: msg.from }));
                $scope.msgList[msg.from.FFID].msg[msgIndex].isCallRequest = false;
                //$scope.msgList[msg.from.FFID].msg.splice(msgIndex, 1);
            }
            $(".video-controll").removeClass('hide');
            $(".video-controll").addClass('voice');
            $(".video-controll").show();
            $(".video-controll iframe").attr('src', videoCallAdd + 'voice-chat/#room/' + msg.from.email + '---' + msg.to.email);
        };
        $scope.acceptVideoCallReq = function (msg) {
            $scope.callResponse(msg.fn, 0);
            if(_.findWhere($scope.msgList[msg.from.FFID].msg, { from: msg.from })) {
                var msgIndex = $scope.msgList[msg.from.FFID].msg.indexOf(_.findWhere($scope.msgList[msg.from.FFID].msg, { from: msg.from }));
                $scope.msgList[msg.from.FFID].msg[msgIndex].isCallRequest = false;
                //                $scope.msgList[msg.from.FFID].msg.splice(msgIndex, 1);
            }
            //            var ele = angular.element(event.target).parent();
            //            ele.remove();
            $(".video-controll").removeClass('hide');
            $(".video-controll").addClass('video');
            $(".video-controll").show();
            $(".video-controll iframe").attr('src', videoCallAdd + 'chat/#room/' + msg.from.email + '---' + msg.to.email);
        };
        $scope.cancelVoiceCallReq = function (msg) {
            $scope.callResponse(msg.fn, 2);
            if(_.findWhere($scope.msgList[msg.from.FFID].msg, { from: msg.from })) {
                var msgIndex = $scope.msgList[msg.from.FFID].msg.indexOf(_.findWhere($scope.msgList[msg.from.FFID].msg, { from: msg.from }));
                $scope.msgList[msg.from.FFID].msg[msgIndex].isCallRequest = false;
                //                $scope.msgList[msg.from.FFID].msg.splice(msgIndex, 1);
            }
            //            var ele = angular.element(event.target).parent();
            //            ele.remove();
            $(".video-controll").addClass('hide');
            $(".video-controll").hide();
        };
        $scope.cancelVideoCallReq = function (msg) {
            $scope.callResponse(msg.fn, 2);
            if(_.findWhere($scope.msgList[msg.from.FFID].msg, { from: msg.from })) {
                var msgIndex = $scope.msgList[msg.from.FFID].msg.indexOf(_.findWhere($scope.msgList[msg.from.FFID].msg, { from: msg.from }));
                $scope.msgList[msg.from.FFID].msg[msgIndex].isCallRequest = false;
                //                $scope.msgList[msg.from.FFID].msg.splice(msgIndex, 1);
            }
            $(".video-controll").addClass('hide');
            $(".video-controll").hide();
        };
        $scope.endVideoVoiceChat = function () {
            $(".video-controll").addClass('hide');
            $(".video-controll").hide();
            window.localStream = null;
            $(".video-controll iframe").attr('src', null);
            socket.emit('videocall-disconnect', $scope.clientInfo, 'normal');
        };
        var callVoiceMessage = function (msgdetail) {
            socket.emit('voice-call-req', msgdetail.from, msgdetail.to, function (ack) {
                if(ack < 0) {
                    $scope.chatnotification("warning", msgdetail.to.name + " does not exits!", 'Ok', '', '', function (response) {
                        if(_.findWhere($scope.msgList[msgdetail.to.FFID].msg, { from: msgdetail.from })) {
                            var msgIndex = $scope.msgList[msgdetail.to.FFID].msg.indexOf(_.findWhere($scope.msgList[
                                msgdetail.to.FFID].msg, { from: msgdetail.from }));
                            $scope.msgList[msgdetail.to.FFID].msg[msgIndex].isCallRequest = false;
                            //                            $scope.msgList[msgdetail.to.FFID].msg.splice(msgIndex, 1);
                        }
                    });
                } else if(ack === 3) {
                    $scope.chatnotification("warning", "Cannot connect Voice call right now with " + msgdetail.to.name, 'Ok', '',
                        '',
                        function (response) {
                            if(_.findWhere($scope.msgList[msgdetail.to.FFID].msg, { from: msgdetail.from })) {
                                var msgIndex = $scope.msgList[msgdetail.to.FFID].msg.indexOf(_.findWhere($scope.msgList[
                                    msgdetail.to.FFID].msg, { from: msgdetail.from }));
                                $scope.msgList[msgdetail.to.FFID].msg[msgIndex].isCallRequest = false;
                                //                            $scope.msgList[msgdetail.to.FFID].msg.splice(msgIndex, 1);
                            }
                        });
                } else if(ack === 2) {
                    $scope.chatnotification("warning", "Cannot connect call with " + msgdetail.to.name +
                        " as the call is been rejected now", 'Ok', '', '',
                        function (response) {
                            if(_.findWhere($scope.msgList[msgdetail.to.FFID].msg, { from: msgdetail.from })) {
                                var msgIndex = $scope.msgList[msgdetail.to.FFID].msg.indexOf(_.findWhere($scope.msgList[
                                    msgdetail.to.FFID].msg, { from: msgdetail.from }));
                                $scope.msgList[msgdetail.to.FFID].msg[msgIndex].isCallRequest = false;
                                //                            $scope.msgList[msgdetail.to.FFID].msg.splice(msgIndex, 1);
                            }
                        });
                } else if(ack === 1) {
                    $scope.chatnotification("warning", msgdetail.to.name + " does not respond!", 'Ok', '', '', function (response) {
                        if(_.findWhere($scope.msgList[msgdetail.to.FFID].msg, { from: msgdetail.from })) {
                            var msgIndex = $scope.msgList[msgdetail.to.FFID].msg.indexOf(_.findWhere($scope.msgList[
                                msgdetail.to.FFID].msg, { from: msgdetail.from }));
                            $scope.msgList[msgdetail.to.FFID].msg[msgIndex].isCallRequest = false;
                            //                            $scope.msgList[msgdetail.to.FFID].msg.splice(msgIndex, 1);
                        }
                    });
                } else {
                    if(_.findWhere($scope.msgList[msgdetail.to.FFID].msg, { from: msgdetail.from })) {
                        var msgIndex = $scope.msgList[msgdetail.to.FFID].msg.indexOf(_.findWhere($scope.msgList[msgdetail.to.FFID]
                            .msg, { from: msgdetail.from }));
                        $scope.msgList[msgdetail.to.FFID].msg[msgIndex].isCallRequest = false;
                        //                        $scope.msgList[msgdetail.to.FFID].msg.splice(msgIndex, 1);
                    }
                    $(".video-controll").removeClass('hide');
                    $(".video-controll").show();
                    $(".video-controll iframe").attr('src', videoCallAdd + 'voice-chat/#room/' + msgdetail.from.email + '---' +
                        msgdetail.to.email);
                }

            });
        };
        var callVideoMessage = function (msgdetail) {
            socket.emit('voice-call-req', msgdetail.from, msgdetail.to, function (ack) {
                if(ack < 0) {
                    $scope.chatnotification("warning", msgdetail.to.name + " does not exits!", 'Ok', '', '', function (response) {
                        if(_.findWhere($scope.msgList[msgdetail.to.FFID].msg, { from: msgdetail.from })) {
                            var msgIndex = $scope.msgList[msgdetail.to.FFID].msg.indexOf(_.findWhere($scope.msgList[
                                msgdetail.to.FFID].msg, { from: msgdetail.from }));
                            $scope.msgList[msgdetail.to.FFID].msg[msgIndex].isCallRequest = false;
                            //                            $scope.msgList[msgdetail.to.FFID].msg.splice(msgIndex, 1);
                        }
                    });
                } else if(ack === 3) {
                    $scope.chatnotification("warning", "Cannot have conversation with " + msgdetail.to.name +
                        " because does not have camera!", 'Ok', '', '',
                        function (response) {
                            if(_.findWhere($scope.msgList[msgdetail.to.FFID].msg, { from: msgdetail.from })) {
                                var msgIndex = $scope.msgList[msgdetail.to.FFID].msg.indexOf(_.findWhere($scope.msgList[
                                    msgdetail.to.FFID].msg, { from: msgdetail.from }));
                                $scope.msgList[msgdetail.to.FFID].msg[msgIndex].isCallRequest = false;
                                //                            $scope.msgList[msgdetail.to.FFID].msg.splice(msgIndex, 1);
                            }
                        });
                } else if(ack === 2) {
                    $scope.chatnotification("warning", "Cannot connect video call right now with " + msgdetail.to.name, 'Ok', '',
                        '',
                        function (response) {
                            if(_.findWhere($scope.msgList[msgdetail.to.FFID].msg, { from: msgdetail.from })) {
                                var msgIndex = $scope.msgList[msgdetail.to.FFID].msg.indexOf(_.findWhere($scope.msgList[
                                    msgdetail.to.FFID].msg, { from: msgdetail.from }));
                                $scope.msgList[msgdetail.to.FFID].msg[msgIndex].isCallRequest = false;
                                //                            $scope.msgList[msgdetail.to.FFID].msg.splice(msgIndex, 1);
                            }
                        });
                } else if(ack === 1) {
                    $scope.chatnotification("warning", msgdetail.to.name + " does not respond!", 'Ok', '', '', function (response) {
                        if(_.findWhere($scope.msgList[msgdetail.to.FFID].msg, { from: msgdetail.from })) {
                            var msgIndex = $scope.msgList[msgdetail.to.FFID].msg.indexOf(_.findWhere($scope.msgList[
                                msgdetail.to.FFID].msg, { from: msgdetail.from }));
                            $scope.msgList[msgdetail.to.FFID].msg[msgIndex].isCallRequest = false;
                            //                            $scope.msgList[msgdetail.to.FFID].msg.splice(msgIndex, 1);
                        }
                    });
                } else {
                    if(_.findWhere($scope.msgList[msgdetail.to.FFID].msg, { from: msgdetail.from })) {
                        var msgIndex = $scope.msgList[msgdetail.to.FFID].msg.indexOf(_.findWhere($scope.msgList[msgdetail.to.FFID]
                            .msg, { from: msgdetail.from }));
                        $scope.msgList[msgdetail.to.FFID].msg[msgIndex].isCallRequest = false;
                        //                        $scope.msgList[msgdetail.to.FFID].msg.splice(msgIndex, 1);
                    }
                    $(".video-controll").removeClass('hide');
                    $(".video-controll").show();
                    $(".video-controll iframe").attr('src', videoCallAdd + 'chat/#room/' + msgdetail.from.email + '---' +
                        msgdetail.to.email);
                }
            });
        };
        $scope.callResponse = function (fn, response) {
            fn(response);
        };
        $scope.setClientChat = function (client) {
            if(client.isarrived) {
                client.isarrived = false;
            }
            $scope.clientInfo = client;
            $scope.$parent.SendPeerToPeerEnable(client);
        };
        $scope.isClientChat = function (client) {
            return angular.equals(client.FFID, $scope.clientInfo.FFID);
        };

        function closeModals() {
            if($scope.chatnotificationPopUp) {
                $scope.chatnotificationPopUp.close();
                $scope.chatnotificationPopUp = null;
            }
        }
        $scope.chatnotification = function (title, content, done, cancel, mute, fn) {
            closeModals();
            $scope.chatnotificationPopUp = $modal.open({
                templateUrl: 'app/controllers/notification_modal/notification_modal.html',
                controller: 'notificationCtrl',
                backdrop: 'static',
                size: 'md',
                scope: $scope,
                keyboard: false,
                resolve: {
                    options: function () {
                        return {
                            title: title,
                            content: content,
                            done: done,
                            cancel: cancel,
                            mute: mute
                        }
                    }
                }
            });
            $scope.chatnotificationPopUp.result.then(function (response) {
                fn(response);
            });
        };

        $scope.mute = function () {
            audio.pause();
            audio.currentTime = 0;
        }


        var initialize = function () {
            $scope.msgList = {};
            $scope.messageDetails = {};
            $scope.myClients = [];
            $scope.holdClients = [];
            if($scope.$parent.clientList.length) {
                angular.forEach($scope.$parent.clientList, function (client) {
                    updateClients(client);
                });
                if($scope.myClients.length) {
                    $scope.setClientChat($scope.myClients[0]);
                }
            }
        };
        var updateClients = function (client) {
            if(!_.findWhere($scope.myClients, { FFID: client.FFID })) {
                $scope.myClients.push(client);
                $scope.msgList[client.FFID] = { msg: [] };
                var fromInfo = {
                    from_ad: 2,
                    id: localStorageService.get('consultantID'),
                    name: localStorageService.get('name'),
                    email: localStorageService
                        .get('email'),
                    type: 'consultant'
                };
                var toInfo = angular.copy(client);
                socket.emit('chat-history', fromInfo, toInfo, function (msgList) {
                    if($scope.msgList[toInfo.FFID] && $scope.msgList[toInfo.FFID].msg) {
                        $scope.msgList[toInfo.FFID].msg = angular.copy(msgList);
                    } else {
                        $scope.msgList[toInfo.FFID] = { msg: angular.copy(msgList) };
                    }
                });
            }
        };
        $scope.$watch(function () {
            return $scope.$parent.clientList;
        }, function (oldVal, newVal) {
            initialize();
        });
        $scope.$on('CLIENT_ADD', function (event, options) {
            if(options.client) {
                updateClients(options.client);
            }
        });
        $scope.$on('CLIENT_REMOVE', function (event, options) {
            if(options.client) {
                if(_.findWhere($scope.myClients, { email: options.client.email })) {
                    var clientIndex = $scope.myClients.indexOf(_.findWhere($scope.myClients, { email: options.client.email }));
                    $scope.myClients.splice(clientIndex, 1);
                    if($scope.myClients.length) {
                        $scope.setClientChat($scope.myClients[0]);
                    }
                }
            }
        });
    }
]);

'use strict';

factFindApp.service('webSocket', ['webSocketAdderss', function (webSocketAdderss) {
        var socket = io.connect(webSocketAdderss, {
            'forceNew': true,
            'reconnection': false,
            'reconnectionDelay': 1000,
            'reconnectionDelayMax': 5000,
            'reconnectionAttempts': 5
        });

        socket.on('connect', function () {
            console.log('queuing connected');
        })
        socket.on('disconnect', function () {
            console.log('queuing disconnected');
        })
        return {
            getsocket: function () {
                return socket;
            }
        }
    }]);
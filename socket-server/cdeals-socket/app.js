
/**
 * Module dependencies
 */

var express = require('express'),
//        routes = require('./routes'),
//        api = require('./routes/api'),
        path = require('path'),
        fs = require('fs'),
        http = require('http'),
        https = require("https");
var _ = require('underscore');
var app = module.exports = express();

//var server = http.createServer(app);
var server = https.createServer({
    key: fs.readFileSync("fakekeys/domain-key.pem"),
    cert: fs.readFileSync("fakekeys/domain-crt.pem"),
}, app);
var SocketServer = require('socket.io').listen(server);

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/voice', express.static(path.join(__dirname, '.', 'voice')));
app.use('/chat', express.static(path.join(__dirname, '.', 'video-chat')));
app.use('/voice-chat', express.static(path.join(__dirname, '.', 'voice-chat')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
    app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
    // TODO
}


/**
 * Routes
 */

var queuingConsultants = {};
var queuingClients = {};
var users = {};
var consultants = {};
var rooms = {};
var queuingSocket = SocketServer.of('/queuing').on('connection', function (client) {
    client.on('logIn', function (info, fn) {
        if (info.type === 'consultant') {
            if (queuingConsultants[info.email]) {
                if (queuingConsultants[info.email].login) {
                    fn('already');
                } else {
                    if (queuingConsultants[info.email].active) {
                        queuingConsultants[info.email].socketId = client.id;
                        queuingConsultants[info.email].login = true;
                        fn('login');
                    } else {
                        queuingConsultants[info.email].active = true;
                        queuingConsultants[info.email].socketId = client.id;
                        queuingConsultants[info.email].type = info.type;
                        queuingConsultants[info.email].name = info.name;
                        queuingConsultants[info.email].email = info.email;
                        queuingConsultants[info.email].login = false;
                        queuingConsultants[info.email].clientCount = 0;
//                        queuingConsultants[info.email].clients = [];
//                        queuingConsultants[info.email].waitingClient = [];
                        queuingConsultants[info.email].location = info.location;
                        fn(true);
                        client.broadcast.emit('onlineConsultant', queuingConsultants[info.email]);
                        var consultantList = [];
                        Object.keys(queuingConsultants).forEach(function (id) {
                            if (queuingConsultants[id].active) {
                                var consultantInfo = new Object();
                                consultantInfo.id = id;
                                consultantInfo.name = queuingConsultants[id].name;
                                consultantInfo.email = queuingConsultants[id].email;
                                consultantInfo.count = queuingConsultants[id].clientCount;
                                consultantInfo.location = queuingConsultants[id].location;
                                consultantInfo.clients = queuingConsultants[id].clients;
                                consultantInfo.waitingClient = queuingConsultants[id].waitingClient;
                                consultantList.push(consultantInfo);
                            }
                        });
                        client.emit('consultantlist', consultantList, function (response) {
                        });
                    }
                }
            } else {
                queuingConsultants[info.email] = {
                    active: true,
                    socketId: client.id,
                    type: info.type,
                    name: info.name,
                    email: info.email,
                    login: true,
                    clientCount: 0,
                    location: info.location,
                    clients: [],
                    waitingClient: []
                };
                fn(true);
                client.broadcast.emit('add-consultant', queuingConsultants[info.email]);
                var consultantList = [];
                Object.keys(queuingConsultants).forEach(function (id) {
                    if (queuingConsultants[id].active) {
                        var consultantInfo = new Object();
                        consultantInfo.id = id;
                        consultantInfo.name = queuingConsultants[id].name;
                        consultantInfo.email = queuingConsultants[id].email;
                        consultantInfo.count = queuingConsultants[id].clientCount;
                        consultantInfo.location = queuingConsultants[id].location;
                        consultantInfo.clients = queuingConsultants[id].clients;
                        consultantInfo.waitingClient = queuingConsultants[id].waitingClient;
                        consultantList.push(consultantInfo);
                    }
                })
                client.emit('consultantlist', consultantList, function (response) {
                });
            }
        } else {
            if (queuingClients[info.email]) {
                if (queuingClients[info.email].active) {
                    queuingClients[info.email].socketId = client.id;
                    queuingClients[info.email].login = true;
                    fn('login');
                } else {
                    queuingClients[info.email].active = true;
                    queuingClients[info.email].socketId = client.id;
                    queuingClients[info.email].type = info.type;
                    queuingClients[info.email].email = info.email;
                    queuingClients[info.email].login = false;
                    fn(true);
                    var consultantList = new Array();
                    Object.keys(queuingConsultants).forEach(function (id) {
//                        if (queuingConsultants[id].active) {
                        var consultantInfo = new Object();
                        consultantInfo.id = id;
                        consultantInfo.active = queuingConsultants[id].active;
                        consultantInfo.login = queuingConsultants[id].login;
                        consultantInfo.name = queuingConsultants[id].name;
                        consultantInfo.email = queuingConsultants[id].email;
                        consultantInfo.count = queuingConsultants[id].clientCount;
                        consultantInfo.location = queuingConsultants[id].location;
                        consultantInfo.clients = queuingConsultants[id].clients;
                        consultantInfo.waitingClient = queuingConsultants[id].waitingClient;
                        consultantList.push(consultantInfo);
                    });
                    client.emit('consultantlist', consultantList, function (response) {
                    });
                }
            } else {
                queuingClients[info.email] = {
                    active: true,
                    socketId: client.id,
                    type: info.type,
                    email: info.email,
                    login: false,
                    location: info.location,
                    name: info.name
                };
                fn(true);
                var consultantList = new Array();
                Object.keys(queuingConsultants).forEach(function (id) {
                    var consultantInfo = new Object();
                    consultantInfo.id = id;
                    consultantInfo.active = queuingConsultants[id].active;
                    consultantInfo.login = queuingConsultants[id].login;
                    consultantInfo.name = queuingConsultants[id].name;
                    consultantInfo.email = queuingConsultants[id].email;
                    consultantInfo.count = queuingConsultants[id].clientCount;
                    consultantInfo.location = queuingConsultants[id].location;
                    consultantInfo.clients = queuingConsultants[id].clients;
                    consultantInfo.waitingClient = queuingConsultants[id].waitingClient;
                    consultantList.push(consultantInfo);
                });
                client.emit('consultantlist', consultantList, function (response) {
                });
            }
        }
    });
    client.on('request-factfinding', function (info, to, fn) {
        if (queuingConsultants[to.email] && info && info.id && info.name && info.email && info.email != '') {
            if (queuingConsultants[to.email].active && queuingConsultants[to.email].socketId && queuingConsultants[to.email].socketId != null) {
                queuingSocket.sockets[queuingConsultants[to.email].socketId].emit('client-request', {id: info.id, FFID: info.FFID, name: info.name, email: info.email}, function (response) {
                    fn(response);
                    if (response.status === 'free') {
                        queuingConsultants[to.email].clientCount++;
                        queuingConsultants[to.email].clients.push({id: info.id, FFID: info.FFID, name: info.name, email: info.email});
                        queuingClients[info.email].consultantId = to.email;
                    }
                });
            } else {
                fn('offline');
            }
        } else {
            fn('offline');
        }
    });
    client.on('request-for-transfer', function (info, to, from, fn) {
        if (queuingConsultants[to.email] && info && info.id && info.name && info.email) {
            if (queuingConsultants[to.email].active && queuingConsultants[to.email].socketId) {
                // Consultant notification request for connect client .. 
                queuingSocket.sockets[queuingConsultants[to.email].socketId].emit('client-request', {id: info.id, FFID: info.FFID, name: info.name, email: info.email}, function (response) {
                    fn(response);
                    if (response.status === 'free') {
                        // Client notification for consultant tranferring your mirroring.. 
                        if (queuingClients[info.email] && queuingClients[info.email].socketId) {
                            queuingSocket.sockets[queuingClients[info.email].socketId].emit('consultant-transfer', queuingConsultants[to.email], queuingConsultants[from.email]);
                        }
                        queuingConsultants[to.email].clientCount++;
                        queuingConsultants[to.email].clients.push({id: info.id, FFID: info.FFID, name: info.name, email: info.email});
                        queuingClients[info.email].consultantId = to.email;
                    }
                });
            } else {
                fn('offline');
            }
        } else {
            fn('offline');
        }
    });
//    client.on('disconnect-client', function (info) {
//        Object.keys(queuingConsultants).forEach(function (id) {
//            if (queuingConsultants[id].socketId === client.id) {
//                if (info === 'add')
//                    queuingConsultants[id].clientCount++;
//                else
//                    queuingConsultants[id].clientCount--;
//            }
//        })
//    });
    client.on('disconnect', function () {
        var flag = false;
        var userid = 0;
        Object.keys(queuingConsultants).forEach(function (id) {
            if (queuingConsultants[id].socketId === client.id) {
                flag = true;
                queuingConsultants[id].active = false;
                queuingConsultants[id].login = false;
                queuingConsultants[id].clientCount = 0;
                queuingConsultants[id].clients = [];
                queuingConsultants[id].waitingClient = [];
                userid = id;
            }
        });
        if (flag) {
            client.broadcast.emit('consultant-offline', {id: userid});
        } else {
            Object.keys(queuingClients).forEach(function (id) {
                if (queuingClients[id].socketId === client.id) {
                    queuingClients[id].active = false;
                    queuingClients[id].login = false;
                    userid = id;
                }
            });
            if (userid) {
                client.broadcast.emit('client-offline', {id: userid, name: queuingClients[userid].name, email: queuingClients[userid].email});
                if (queuingConsultants[queuingClients[userid].consultantId] && queuingConsultants[queuingClients[userid].consultantId].clients) {
                    var clientIndex = queuingConsultants[queuingClients[userid].consultantId].clients.indexOf(_.findWhere(queuingConsultants[queuingClients[userid].consultantId].clients, {email: queuingClients[userid].email}));
                    queuingConsultants[queuingClients[userid].consultantId].clients.splice(clientIndex, 1);
                    queuingConsultants[queuingClients[userid].consultantId].clientCount--;
                }
            }
        }
    });
    client.on('put-waitinglist', function (info, to, fn) {
        if (to && queuingConsultants[to.email]) {
            queuingConsultants[to.email].waitingClient.push(info);
            fn(true);
        }
    });
    client.on('client-waiting', function (info, to) {
        if (queuingConsultants[to.email] && queuingConsultants[to.email].active && info && info.email) {
            queuingSocket.sockets[queuingConsultants[to.email].socketId].emit('default-client-waiting', info, function (response) {
                if (response) {
                    if (queuingConsultants[to.email]) {
                        queuingConsultants[to.email].waitingClient.push(info);
                    }
                } else {
                    queuingSocket.sockets[queuingClients[info.email].socketId].emit('unable-to-respond');
                }
            });
        }
    });
    client.on('createFFID', function (info, to) {
        if (Object.keys(queuingConsultants).indexOf(to) > -1) {
            if (queuingConsultants[to].active) {
                console.log("created ffid", info.FFID);
                queuingSocket.sockets[queuingConsultants[to].socketId].emit('createFFID', info);
            }
        }
    });
    client.on('PeerToPeerDisable', function (to) {
        if (Object.keys(queuingClients).indexOf(to.email) > -1) {
            if (queuingClients[to.email].active) {
                queuingSocket.sockets[queuingClients[to.email].socketId].emit('PeerToPeerDisable');
            }
        }
    });
    client.on('PeerToPeerEnable', function (to) {
        if (Object.keys(queuingClients).indexOf(to.email) > -1) {
            if (queuingClients[to.email].active) {
                queuingSocket.sockets[queuingClients[to.email].socketId].emit('PeerToPeerEnable');
            }
        }
    });
});
/**
 * Start Server
 */
//---------------------- socket for voice & video call --------------------//
var contactServer = SocketServer.of('/contact').on('connection', function (client) {
    client.on('logIn', function (info, fn) {
        if (Object.keys(users).indexOf(info.email) > -1) {
            if (users[info.email].active === true) {
                users[info.email].socketId = client.id;
                fn(true);
            } else {
                users[info.email].active = true;
                users[info.email].socketId = client.id;
                users[info.email].type = info.type;
                fn(true);
            }
        } else {
            var newUser = {};
            newUser.socketId = client.id;
            newUser.active = true;
            newUser.type = info.type;
            users[info.email] = newUser;
            fn(true);
        }
    });
    client.on('chat-message', function (from, to, message, fn) {
        if (Object.keys(users).indexOf(to.email) > -1 && users[to.email].active === true) {
            fn(false);
            contactServer.sockets[users[to.email].socketId].emit('chat-message', from, to, message);
        } else {
            // contactServer.sockets[users[to.email].socketId].emit('chat-message', from, to, message);
            fn(true);
        }
    });
    client.on('disconnect', function () {
        Object.keys(users).forEach(function (id) {
            if (users[id].socketId === client.id) {
                users[id].active = false;
                client.broadcast.emit('logout-user', users[id]);
            }
        });
    });
    client.on('voice-call-req', function (from, to, fn) {
        var state;
        if (Object.keys(users).indexOf(to.email) > -1) {
            if (users[to.email].active) {
                var id = users[to.email].socketId;
                contactServer.sockets[id].emit('voice-call-req', from, to, function (ack) {
                    fn(ack);
                });
            } else {
                //save into the file, or global variable, and allow the user know it.
                state = -1;
                fn(state);
            }
        } else {
            state = -2;
            fn(state);
        }
    });
    client.on('video-call-req', function (from, to, fn) {
        var state;
        if (Object.keys(users).indexOf(to.email) > -1) {
            if (users[to.email].active) {
                var id = users[to.email].socketId;
                contactServer.sockets[id].emit('video-call-req', from, to, function (ack) {
                    fn(ack);
                });
            } else {
                //save into the file, or global variable, and allow the consultant know it.
                state = -1;
                fn(state);
            }
        } else {
            state = -2;
            fn(state);
        }
    });
    client.on('videocall-disconnect', function (to, status) {
        if (Object.keys(users).indexOf(to.email) > -1){
            contactServer.socket(users[to.email].socketId).emit('videocall-disconnect', status);
        }
    });

    client.on('connectTo', function (from, to, data) {
        if (Object.keys(consultants).indexOf(to) > -1) {
            if (consultants[to].active === true)
            {
                var id = consultants[to].socketId;

                contactServer.sockets[id].emit('connectTo', from, to, data, function (err, sdp) {
                    if (!err)
                        contactServer.sockets[consultants[from].socketId].emit('recSDP', to, from, sdp);
                })
            } else
            {
                // SocketServer.sockets.sockets[id].emit('recSDP',from,to,sdp);
                //save into the file, or global variable, and allow the consultant know it.
            }
        } else {
            //SocketServer.sockets.sockets[id].emit('recSDP',from,to,sdp);
        }
    });
    function getRoom(channel) {
        return rooms[channel] = rooms[channel] || {clients: {}};
    }
    /**
     * Joins room
     * @param {String} channel channel/room name
     */
    function joinTo(channel) {
        if (client.channel === channel) {
            return;
        }
        var room = getRoom(channel);

        // add self
        room.clients[client.id] = {
            audio: false,
            screen: false,
            video: true
        };

        client.channel = channel;
    }
    client.on('disconnectChat', function (from, to) {
        if (Object.keys(consultants).indexOf(to) > -1) {
            if (consultants[to].active === true) {
                var id = consultants[to].socketId;
                var fromId = consultants[from].socketId;
                contactServer.sockets[id].emit('disconnectChat', from, to, fromId)

            }
        }
    });
    /**
     * Leaves room
     * @param {String} [channel] channel/room name
     */
    function leave(channel) {
        channel = channel || client.channel;
        var room = getRoom(channel);

        // remove current client from room
        delete room.clients[client.id];

        // notify other peers but not self in current channel
        Object.keys(room.clients).forEach(function (client_id) {
            contactServer.socket(client_id).emit('remove', {
                id: client.id
            });
        });

        // remove room if no clients
        if (!Object.keys(room).length) {
            delete rooms[channel];
        }
    }

    client.on('join', function (channel, fn) {
        // send list of other clients in that room
        fn(null, getRoom(channel));

        // then add self to that room
        joinTo(channel);
    });

    client.on('leave', leave);
    client.on('disconnect', leave);
    client.on('create', function (channel, fn) {
        // send channel name back
        fn(null, channel);

        // then add self to that room
        joinTo(channel);
    });
    client.on('message', function (message) {
        message.from = client.id;
        message.name = client.name;
        message.isMain = client.isMain;
        contactServer.socket(message.to).emit('message', message);
    });
    
    client.on('urgent-call', function (from, to, fn) {
        if (Object.keys(users).indexOf(to.email) > -1){
            contactServer.socket(users[to.email].socketId).emit('urgent-call', from, to, function (response) {
                fn(response);
            });
        }
    })
	client.on('resume-call', function (from, to, fn) {
        if (Object.keys(users).indexOf(to.email) > -1) {
            contactServer.socket(users[to.email].socketId).emit('resume-call', from, to, function (response) {
                fn(response);
            });
        }
    })
});
/**
 * Start Server
 */

server.listen(app.get('port'), function () {
    //console.log('Express server listening on port ' + app.get('port'));
});


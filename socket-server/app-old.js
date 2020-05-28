
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

// serve index and view partials
//app.get('/', routes.index);
//app.get('/partials/:name', routes.partials);

// JSON API
//app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
//app.get('*', routes.index);

// Socket.io Communication
//io.sockets.on('connection', require('./routes/socket'));

var queuingConsultants = {};
var queuingClients = {};
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
		
        if (queuingConsultants[to.email]) {
            if (queuingConsultants[to.email].active && queuingConsultants[to.email].socketId) {
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
        if (queuingConsultants[to.email] && queuingConsultants[to.email].active) {
            queuingSocket.sockets[queuingConsultants[to.email].socketId].emit('default-client-waiting', info, function (response) {
                if (response) {
                    if (queuingConsultants[to.email]) {
                        queuingConsultants[to.email].waitingClient.push(info);
                    }
                } else {
                    queuingSocket.sockets[queuingClients[info.email]].emit('unable-to-respond');
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
});
/**
 * Start Server
 */

server.listen(app.get('port'), function () {
    //console.log('Express server listening on port ' + app.get('port'));
});


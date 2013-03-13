var express = require('express');

var app = express().use(express.static(__dirname))
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

//app.use(express.static(__dirname));

server.listen(3000);

io.sockets.on('connection', function (socket) {
    socket.emit('initialize contacts', contacts);
    socket.on('modifying contacts', function (data) {
        contacts = data;
        console.log(contacts);
        
        socket.broadcast.emit('refresh contacts', contacts);
    });
    
});

var contacts = [{
        first_name: "Sylvain",
        last_name: "Kieffer",
        email: "sylvain.kieffer@univ-paris13.fr"
    }, {
        first_name: "Laurent",
        last_name: "Mernier",
        email: "mernier@univ-paris13.fr"
    }, {
        first_name: "Michel",
        last_name: "Renauld",
        email: "michel.renauld@univ-paris13.fr"
    }];
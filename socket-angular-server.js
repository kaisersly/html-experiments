var express = require('express');

var app = express().use(express.static(__dirname))
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

//app.use(express.static(__dirname));

server.listen(3000);

io.sockets.on('connection', function (socket) {
    socket.emit('initialize contacts', contacts);
    socket.on('modify contact', function (contact) {
        contacts.forEach(function (h,i) {
            if (h.id == contact.id) {
                contacts[i] = contact;
            }
        });
        console.log(contacts);
        socket.broadcast.emit('update contact', contact);
    });
    
});

var contacts = [{
        id: 1,
        first_name: "Sylvain",
        last_name: "Kieffer",
        email: "sylvain.kieffer@univ-paris13.fr"
    }, {
        id: 2,
        first_name: "Laurent",
        last_name: "Mernier",
        email: "mernier@univ-paris13.fr"
    }, {
        id: 3,
        first_name: "Michel",
        last_name: "Renauld",
        email: "michel.renauld@univ-paris13.fr"
    }];
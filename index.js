var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express();

var http = require('http');
var wss = http.Server(app);

app.use(express.static('client'));

wss.listen(PORT, function() {
    console.log('Server running on port ' + PORT);
});

var ws = require('socket.io')(wss);

ws.on('connection', function connection(socket) {
    socket.on('message', function message(data) {
        ws.emit('message', "Bienvenu");

        const obj = JSON.parse(data);
        const type = obj.type;
        const params = obj.params;


        console.log("Received message : " + data)
        console.log("Received message 2 : " + obj.toString())

        switch (type) {
            case "create":
                create(params);
                break;
            case "join":
                join(params);
                break;
            case "leave":
                leave(params);
                break;
            default:
                console.warn(`Type: ${type} unknown`);
                break;
        }
    });

    function create(params) {
        const room = genKey(5);
        rooms[room] = [ws];
        ws["room"] = room;

        generalInformation(ws);
    }

    function join(params) {
        const room = params.code;
        if (!Object.keys(rooms).includes(room)) {
            console.warn(`Room ${room} does not exist!`);
            return;
        }

        if (rooms[room].length >= maxClients) {
            console.warn(`Room ${room} is full!`);
            return;
        }

        rooms[room].push(ws);
        ws["room"] = room;

        generalInformation(ws);

    }

    function leave(params) {
        const room = ws.room;
        rooms[room] = rooms[room].filter(so => so !== ws);
        ws["room"] = undefined;

        if (rooms[room].length == 0)
            close(room);
    }

    function close(room) {
        rooms = rooms.filter(key => key !== room);

    }
});

const maxClients = 4;
let rooms = {};

function generalInformation(ws) {
    let obj;
    if (ws["room"] === undefined)
        obj = {
            "type": "info",
            "params": {
                "room": ws["room"],
                "no-clients": rooms[ws["room"]].length,
            }
        }
    else
        obj = {
            "type": "info",
            "params": {
                "room": "no room",
            }
        }

    ws.send(JSON.stringify(obj));
}

function genKey(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length));
    }
    return result;
}
// var PORT = process.env.PORT || 5000;
// var express = require('express');
// var app = express();

// var http = require('http');
// var server = http.Server(app);

// app.use(express.static('client'));

// server.listen(PORT, function() {
// console.log('Server running on port ' + PORT);
// });

// var io = require('socket.io')(server);

// io.on('connection', function(socket) {
//   socket.on('message', function(msg) {
//     io.emit('message', msg);
//   });
// });
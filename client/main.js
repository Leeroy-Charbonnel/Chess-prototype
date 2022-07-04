var ws = io();



ws.on('open', function(event) {
    console.log('Connected to WS');
});



ws.on('message', function(text) {
    console.log(event.data);
    document.getElementById("last-msg").innerText = event.data;
});




//Create room
function create() {
    ws.emit('{ "type": "create" }');
}

//Join room
function join() {
    const code = document.getElementById("room-code").value;
    const obj = {
        "type": "join",
        "params": {
            "code": code
        }
    }
    ws.emit(JSON.stringify(obj));
}


//Leave room
function leave() {
    ws.emit('{ "type": "leave" }');
}
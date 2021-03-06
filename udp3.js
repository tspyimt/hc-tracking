/*
 * Dependencies Packages
 * */
var dgram = require("dgram"),
    net = require('net'),
    d = require('dequeue'),
    util = require('util');


/*
 * Set Variables
 * */
var portUDP = 4545; // UDP Port

var hostTCP = "localhost", // TCP IP Server
    portTCP = 5555; // TCP Port

setInterval(init, 1);

/*
 * Proxy UDP to TCP
 * */
var proxy = new net.Socket();

/*proxy.connect(portTCP, hostTCP, function (socket) {
 console.log("Connecting Server TCP:", hostTCP,":",portTCP);

 });*/

proxy.connect(portTCP, hostTCP, function(socket){
    console.log("Connect succes server:", hostTCP);
});
proxy.on('error', function (err) {
    console.log("Error proxy UDP to TCP: ", err);
});

proxy.on('end', function (data) {
    console.log("Proxy End: ", data);
});

proxy.on('close', function () {
    console.log("Proxy UDP to TCP: Closed !");
});


/*
 *  UDP Server
 * */
var udpServer = dgram.createSocket("udp4");
var index = 0;
var obj;

udpServer.on("message",
    function (msg, rinfo) {
        FIFO.push(msg);
    }
);

udpServer.on('error', function (err) {
    console.log("Error server UDP: ", err);
});
udpServer.bind(portUDP);

console.log("Running server: ", portUDP);


/*
 * Function init listen process performance UDP
 * */
var FIFO = new d();         // Non-blocking performance implement UDP server

function init() {
    while (FIFO.length > 0) {
        var msg = FIFO.shift();
        proxy.write(msg.toString());
        console.log("Index:", index++);
    }
}
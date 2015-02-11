var d = require ('dequeue');
var seatStateStore = require("./SeatStateStore");
var redis = require("redis");
var rClient = redis.createClient();
var dgram = require("dgram");

var FIFO = new d();

fetcher();

var udpserver = dgram.createSocket("udp4");

udpserver.on("message",
    function (msg, rinfo) {
        FIFO.push(msg.toString());
        //console.log("MSG", msg);
    }
);

udpserver.bind(4444);

function fetcher () {
    while (FIFO.length > 0)
    {
        var msg = FIFO.shift();
        seatStateStore.parseMessage(msg);
        console.log("mg:", msg);
        console.log("vc", FIFO);
    }
    setImmediate(fetcher); //make this function continuously run
}

///